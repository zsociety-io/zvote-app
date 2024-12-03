import React, { useEffect, useMemo, useLayoutEffect } from "react";
import Link from 'next/link';
import Image from "next/image";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import { WalletAdapterNetwork, WalletReadyState } from '@demox-labs/aleo-wallet-adapter-base';

import { useAccount, decryptPermission, network, programs } from '../AccountProvider';
import useCookie from 'react-use-cookie';
import { get_request } from '../../lib/utils/network.js';

import swal from 'sweetalert';

import useState from 'react-usestateref'

import { useRouter } from 'next/router';
import { formatNumber } from "@/lib/utils/strings"


const existingWallets = {
    leoWallet: {
        name: "Leo Wallet",
        url: "https://www.leo.app/"
    },
    puzzle: {
        name: "Puzzle Wallet",
        url: "https://puzzle.online/"
    },
    availWallet: {
        name: "Avail Wallet",
        url: "https://avail.global/"
    },
    soterWallet: {
        name: "Soter Wallet",
        url: "https://sotertech.io/"
    },
    foxWallet: {
        name: "Fox Wallet",
        url: "https://foxwallet.com/"
    }
};

const frontCookieOptions = {
    // days?: number;
    // path?: string;
    domain: (process.env.NODE_ENV === 'production') ?
        `.${process.env.NEXT_PUBLIC_DOMAIN}` :
        '',// domain?: string;
    // SameSite?: 'None' | 'Lax' | 'Strict';
    // Secure?: boolean;
    // HttpOnly?: boolean;
}

const walletButtons = {
    cancel: false,
    ...Object.fromEntries(
        Object.entries(existingWallets).map(([key, val]) => ([
            key, {
                text: "",
                value: val.name,
            }
        ])
        )
    )
}

let selectedWallet = null;

const prepareSignedMessage = (handshake_token, time) => {
    let toEncode = JSON.stringify({
        aud: process.env.NEXT_PUBLIC_HOST,
        sub: "connect",
        iat: time,
        jti: handshake_token
    }, null, 2);
    return toEncode;
}


function ConnectBtn(props) {
    const [loading, setLoading, refLoading] = useState(false);
    const [connectClicked, setConnectClicked, refConnectClicked] = useState(false);
    const [connect2Clicked, setConnect2Clicked, refConnect2Clicked] = useState(false);
    const customBtn = (props.customClass && props.contentText);

    const { autoConnect, wallets, select, connect, publicKey, disconnect, wallet, connected, signMessage } = useWallet();

    const [walletCookie, setWalletCookie, removeWalletCookie] = useCookie('wallet', '');
    const [sessionIdCookie, setSessionIdCookie, removeSessionIdCookie] = useCookie('session_id', '');

    const router = useRouter();
    const isDashboard = router.pathname.startsWith("/dashboard");

    const [installedWallets, otherWallets] = useMemo(() => {
        const installed = [];
        const notDetected = [];
        const loadable = [];
        for (const wallet of wallets) {
            if (wallet.readyState === WalletReadyState.NotDetected) {
                notDetected.push(wallet);
            }
            else if (wallet.readyState === WalletReadyState.Loadable) {
                loadable.push(wallet);
            }
            else if (wallet.readyState === WalletReadyState.Installed) {
                installed.push(wallet);
            }
        }
        return [installed, [...loadable, ...notDetected]];
    }, [wallets]);

    const { connected: accountConnected, loading: accountLoading, setConnected, mainTokenPublicBalance, mainTokenData, mainTokenPrivateBalance } = useAccount();

    const decimals = Number(mainTokenData?.decimals.slice(0, -2));

    const connectSemiDapp = async () => {
        try {
            const handshake_token = await get_request(`/api/session/handshake/${publicKey}`);
            const message = prepareSignedMessage(handshake_token.token, handshake_token.time);
            console.log(1)
            const signature = await signMessage(
                new TextEncoder().encode(message)
            );
            console.log(2)
            const signedMessage = {
                message,
                signature: new TextDecoder().decode(signature),
                publicKey
            };
            const signedMessageStr = encodeURIComponent(JSON.stringify(signedMessage));
            const reponseBackEndGenerateSessionToken = await get_request(`/api/session/create/${signedMessageStr}`);
            setWalletCookie(selectedWallet, frontCookieOptions);
            setSessionIdCookie(Math.floor(Math.random() * 1e10), frontCookieOptions);
            setConnected(true);
            swal("Success", "You are connected.", "success");
        }
        catch (e) {
            console.log({ e })
            swal("Error", (e?.message || e) + "", "error");
        }
        setLoading(false);
    }


    useMemo(
        () => {
            if (wallet && publicKey && refConnect2Clicked.current) {
                connectSemiDapp();
                setConnect2Clicked(false);
            }
        },
        [wallet, connect2Clicked, publicKey]
    );

    useEffect(() => {
        if (wallet && refConnectClicked.current) {
            connect(
                decryptPermission || "NO_DECRYPT",
                network || (process.env.NEXT_PUBLIC_NETWORK === "mainnet" ? "mainnet" : WalletAdapterNetwork.TestnetBeta),
                programs ?? []
            );
            setConnectClicked(false);
            setConnect2Clicked(true);
        }
    }, [wallet, connectClicked]);

    const openWalletSelect = async () => {
        const value = await swal("Chose your wallet", "", {
            buttons: walletButtons,
        });
        if (value == null)
            return;
        if (!installedWallets.filter((wal) => wal.adapter.name === value).length) {
            for (const existingWallet of Object.values(existingWallets)) {
                if (value == existingWallet.name) {
                    window.open(existingWallet.url, '_blank');
                    swal("Error", `${existingWallet.name} is not installed.`, "error");
                }
            }
        } else {
            select(value);
            selectedWallet = value;
            setConnectClicked(true);
        }
    }

    const handleClickConnect = async (e) => {
        if (accountConnected) {
            return;
        }
        try { e.preventDefault(); } catch { }
        if (loading || accountLoading) {
            return;
        }
        setLoading(true);
        try {
            await openWalletSelect();
        } catch (e) {
            console.log(e);
        }
        setLoading(false);
    }
    return (
        customBtn ? (<a href="#" className={props.customClass} onClick={handleClickConnect}>{props.contentText}</a>) :
            (
                <>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row"
                        }}
                    >
                        {isDashboard && accountConnected && (
                            <div
                                style={{
                                    alignItems: "center",
                                    display: "flex",
                                    paddingRight: "15px",
                                    fontSize: "16px"
                                }}
                            >
                                DAO Token:&nbsp;<span className="font-bold">{mainTokenData?.symbol}</span> &nbsp;
                                Public:&nbsp;
                                <span className="font-bold">
                                    {formatNumber((mainTokenPublicBalance || 0) / (10 ** decimals))}
                                </span>
                                &nbsp;
                                Private:&nbsp;<span className="font-bold">
                                    {formatNumber((mainTokenPrivateBalance || 0) / (10 ** decimals))}
                                </span>
                            </div>
                        )}
                        <div className="menu-button">
                            <Link className={props.className || "theme-btn nav-link "} href="/profile" id="connectBtn" onClick={handleClickConnect} >
                                <>
                                    <span className="aligned_connect">{!accountConnected ? (props.textContent || "Connect") : ("aleo..." + publicKey.slice(-3, publicKey.length))}</span>
                                    {
                                        (loading || accountLoading) && (
                                            <Image src={require("../../img/loader-loading.gif").default} alt="wallet" id="wallet_img" height={25} />
                                        )
                                    }
                                    {
                                        !(loading || accountLoading) && (
                                            <Image src={require("../../img/wallet.svg").default} alt="wallet" id="wallet_img" height={25} />
                                        )
                                    }
                                </>
                            </Link>
                        </div>
                    </div>
                </>)
    );
}


function component(x, v) {
    return Math.floor(x / v);
}

function verifyWallet() {

}


function VerifyBtn(props) {
    const [user, setUser] = useState([]);
    const [userLoaded, setUserLoaded] = useState(false);
    const invalidURL = false;
    const currentTimestamp = 0;
    const aleoAddress = "aleo123";
    const fetchUser = async () => {
        try {
            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            const token = urlParams.get('t');
            window.regid = token;
            let reponseBackEndPseudoChange = await ((await fetch('./get_register_info?reg_token=' + token)).json());
            if (reponseBackEndPseudoChange.error != undefined) {
                throw 'Error';
            }
            window.timestamp = (reponseBackEndPseudoChange.expire_timestamp - reponseBackEndPseudoChange.time_now) / 1000;
            return {
                success: true, data: {
                    discord_name: reponseBackEndPseudoChange.discord_name,
                    expire_timestamp: reponseBackEndPseudoChange.expire_timestamp,
                    discord_id: reponseBackEndPseudoChange.discord_id,
                    time_now: reponseBackEndPseudoChange.time_now
                }
            };
        } catch (error) {
            console.log(error);
            return { success: false };
        }
    }
    /*
    useEffect(() => {
      (async () => {
        setUserLoaded(false);
        let res = await fetchUser();
        setUserLoaded(true);
        if (res.success) {
          setUser(res.data);
          window.intervalCountdown = setInterval(function () { // execute code each second
  
            window.timestamp--; // decrement timestamp with one second each second
  
            if (window.timestamp <= 0) {
              clearInterval(window.intervalCountdown);
              if (!aleoAddress)
                setUser({});
            }
  
            var minutes = component(window.timestamp, 60) % 60, // minutes
              seconds = component(window.timestamp, 1) % 60; // seconds
  
            $('#countdown_time').html(("0" + minutes).slice(-2) + ":" + ("0" + seconds).slice(-2)); // display
  
          }, 1000); // interval each second = 1000 ms
        }
      })();
    }, []);
    */
    /*
    if (!userLoaded) {
        return (
            <div class="col-xxl-6 col-lg-7 order-lg-1 order-2 text-lg-start text-center alignCenter">
                <Image src={require("../../img/loader-loading.gif").default} style={{ filter: "invert(0.65)" }} width={100} />
            </div>
        );
    }
    if (invalidURL) {
        return (
            <div class="col-xxl-6 col-lg-7 order-lg-1 order-2 text-lg-start text-center alignCenter">
                <h1 class="redText">
                    <span class="strong_underline">Error:</span><br />
                    <span class="lighterText">Invalid or expired URL<span></span></span>
                </h1>
            </div>
        );
    }
    if (aleoAddress) {
        return (
            <div class="col-xxl-6 col-lg-7 order-lg-1 order-2 text-lg-start text-center alignCenter">
                <h1 class="greenText">Success</h1>
                <p><span class="underline">Discord name:</span> <strong>{user.discord_name}</strong><br />
                    <span class="underline">Discord ID:</span> <strong>{user.discord_id}</strong><br />
                    <span class="underline">Stake address:</span> <strong>{aleoAddress.slice(0, 15) + '...' + aleoAddress.slice(-10)}</strong><br />
                </p>
            </div>
        );
    }
    */
    return (
        <div class="col-xxl-6 col-lg-7 order-lg-1 order-2 text-lg-start text-center alignCenter">
            <h1>Register a new wallet</h1>
            <p>
                <span class="underline">Discord name:</span> <strong>{user.discord_name}</strong><br />
                <span class="underline">Discord ID:</span> <strong>{user.discord_id}</strong><br />
                <div id="countdown_time">{("0" + component(currentTimestamp, 60) % 60).slice(-2) + ":" + ("0" + component(currentTimestamp, 1) % 60).slice(-2)}</div>
            </p>
            <div class="row align-items-center verifContainer">
                <div class="col-xl-6 fitContentWidth">
                    <div class="fitContentWidth" id="verivy_div"><a class="theme-btn-2" id="verify_button" href="#" onClick={verifyWallet}>Verify wallet</a></div>
                </div>
            </div>
        </div>
    );
}

export default VerifyBtn;

