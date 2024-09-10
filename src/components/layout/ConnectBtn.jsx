import React, { useEffect, useMemo, useLayoutEffect } from "react";
import Link from 'next/link';
import Image from "next/image";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import { WalletAdapterNetwork, WalletReadyState } from '@demox-labs/aleo-wallet-adapter-base';

import { useConnected, decryptPermission, network, programs } from '../../hooks/useConnected.js';
import useCookie from 'react-use-cookie';
import { get_request } from '../../lib/utils/network.js';

import swal from 'sweetalert';

import useState from 'react-usestateref'


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

    const { connected: accountConnected, loading: accountLoading, setConnected } = useConnected();

    const connectSemiDapp = async () => {
        try {
            console.log("done")
            const handshake_token = await get_request(`/api/session/handshake/${publicKey}`);
            const message = prepareSignedMessage(handshake_token.token, handshake_token.time);
            const signature = await signMessage(
                new TextEncoder().encode(message)
            );
            console.log(signature)
            console.log(new TextDecoder().decode(signature))
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
            if (props?.loginRefreshRef?.current) {
                props.loginRefreshRef.current()
            };
        }
        catch (e) {
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
                network || WalletAdapterNetwork.TestnetBeta,
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
            (<div className="menu-button">
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
            </div>)
    );
}

export default ConnectBtn;