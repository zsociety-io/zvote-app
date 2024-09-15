import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import useCookie from 'react-use-cookie';
import { get_request } from '../lib/utils/network.js';
import { WalletAdapterNetwork } from '@demox-labs/aleo-wallet-adapter-base';

// Initialize context
const AccountContext = createContext();

export const decryptPermission = null;
export const network = null;
export const programs = [];

// Context provider component
export const AccountProvider = ({ children }) => {
    const { wallets, select, connect, publicKey, disconnect, wallet, connecting } = useWallet();
    const [connected, setConnected] = useState(false);
    const [loading, setLoading] = useState(true);
    const [walletCookie, setWalletCookie, removeWalletCookie] = useCookie('wallet', '');
    const [sessionIdCookie, setSessionIdCookie, removeSessionIdCookie] = useCookie('session_id', '');

    const logOut = async () => {
        await get_request(`/api/session/destroy/${publicKey}`);
        setConnected(false);
        removeWalletCookie();
        removeSessionIdCookie();
        window.location.href = '/';
    };

    const checkConnected = async () => {
        let success = false;
        try {
            let resp = await get_request(`/api/session/${publicKey}`);
            success = resp?.status === 'success';
        } catch (e) { }
        setConnected(success);
        setLoading(false);
    };

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
    };

    useEffect(() => {
        if (!walletCookie || !sessionIdCookie || !select) return;
        select(walletCookie);
    }, [select, walletCookie, sessionIdCookie, publicKey]);

    useEffect(() => {
        if (wallet) {
            autoConnect();
        }
    }, [select, walletCookie, sessionIdCookie, publicKey, wallet]);

    useMemo(() => {
        if (publicKey) {
            checkConnected();
        } else if (connecting) {
            setLoading(true);
        } else if (!connecting) {
            setLoading(false);
        }
    }, [walletCookie, sessionIdCookie, publicKey, connecting]);

    return (
        <AccountContext.Provider value={{ connected, loading, setConnected, logOut }}>
            {children}
        </AccountContext.Provider>
    );
};

// Hook to use account context
export const useAccount = () => {
    const context = useContext(AccountContext);
    if (!context) {
        throw new Error('useAccount must be used within an AccountProvider');
    }
    return context;
};