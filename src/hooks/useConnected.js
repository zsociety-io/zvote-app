
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";

import useCookie from 'react-use-cookie';
import { useState, useEffect, useMemo } from 'react';
import { get_request } from '../lib/utils/network.js';

import { WalletAdapterNetwork, WalletReadyState } from '@demox-labs/aleo-wallet-adapter-base';

export const decryptPermission = null;
export const network = null;
export const programs = [];

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


export function useConnected() {
    const { wallets, select, connect, publicKey, disconnect, wallet, connecting } = useWallet();
    const [connected, setConnected] = useState(false);
    const [loading, setLoading] = useState(true);

    const [walletCookie, setWalletCookie, removeWalletCookie] = useCookie('wallet', '');
    const [sessionIdCookie, setSessionIdCookie, removeSessionIdCookie] = useCookie('session_id', '');

    const logOut = async () => {
        await get_request('/api/session/destroy/' + publicKey);
        setConnected(false);
        removeWalletCookie();
        removeSessionIdCookie();
        window.location.href = '/';
    }

    useEffect(
        () => {
        }, [connected]
    );

    const checkConnected = async () => {
        console.log("check")
        let success = false;
        try {
            let resp = await get_request(`/api/session/${publicKey}`);
            success = resp?.status === 'success';
        } catch (e) { }
        setConnected(success);
        setLoading(false);
    }

    const autoConnect = async () => {
        let success = false;
        try {
            await connect(
                decryptPermission || "NO_DECRYPT",
                network || WalletAdapterNetwork.TestnetBeta,
                programs ?? []
            );
        } catch (e) {
            removeWalletCookie();
        }
        setConnected(false);
        //setLoading(false);
    }

    useEffect(
        () => {
            if (!walletCookie || !sessionIdCookie || !select) { return; }
            select(walletCookie);
        },
        [select, walletCookie, sessionIdCookie, publicKey]
    );

    useEffect(
        () => {
            if (wallet) {
                autoConnect();
            }
            //setLoading(false);
        },
        [select, walletCookie, sessionIdCookie, publicKey, wallet]
    );
    useMemo(
        () => {
            if (publicKey) {
                checkConnected()
            } else if (connecting) {
                setLoading(true);
            } else if (!connecting) {
                setLoading(false);
            }
        },
        [walletCookie, sessionIdCookie, publicKey, connecting]
    );

    return {
        connected,
        loading,
        setConnected,
        logOut
    };
}
