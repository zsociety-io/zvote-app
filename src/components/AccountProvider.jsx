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
    const { wallets, select, connect, publicKey, disconnect, wallet, connecting, requestRecords } = useWallet();
    const [connected, setConnected] = useState(false);
    const [loading, setLoading] = useState(true);
    const [walletCookie, setWalletCookie, removeWalletCookie] = useCookie('wallet', '');
    const [sessionIdCookie, setSessionIdCookie, removeSessionIdCookie] = useCookie('session_id', '');

    const [mainTokenId, setMainTokenId] = useState(null);
    const [mainTokenPublicBalance, setMainTokenPublicBalance] = useState(null);

    const [mainTokenPrivateBalance, setMainTokenPrivateBalance] = useState(null);
    const [mainTokenData, setMainTokenData] = useState(null);
    const [tokenRecord, setTokenRecord] = useState(null);

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
                network || (process.env.NEXT_PUBLIC_NETWORK === "mainnet" ? "mainnet" : WalletAdapterNetwork.TestnetBeta),
                programs ?? []
            );
        } catch (e) {
            removeWalletCookie();
        }
        setConnected(false);
    };

    useEffect(() => {
        if (mainTokenId == null || !publicKey) return;
        async function loadmainTokenPublicBalance() {
            const resp = await get_request(`/api/contract/balance/${publicKey}/${mainTokenId}`);
            const tokBal = resp?.balance?.balance || 0;
            const tokData = resp?.token_data || null;

            setMainTokenPublicBalance(tokBal);
            setMainTokenData(tokData)
        }
        loadmainTokenPublicBalance();
    }, [mainTokenId, publicKey]);

    useEffect(() => {
        if (!walletCookie || !sessionIdCookie || !select) return;
        select(walletCookie);
    }, [select, walletCookie, sessionIdCookie, publicKey]);

    useEffect(() => {
        if (wallet) {
            autoConnect();
        }
    }, [select, walletCookie, sessionIdCookie, publicKey, wallet]);


    useEffect(() => {
        const loadPrivateBalance = async () => {
            if (connected && requestRecords != null) {
                let recs = await requestRecords(process.env.NEXT_PUBLIC_MTSP_PROGRAM_ID);
                let newTokenRec = null;
                let maxTokenRecVal = 0;
                let newPrivateBalance = recs.reduce(
                    (former, rec) => {
                        if (rec.spent) {
                            return former;
                        }
                        const isMainToken = (rec?.data?.token_id || '0field.private')?.split(".")[0] === mainTokenId;
                        const tokenBalanceStr = (isMainToken ? rec?.data?.amount : null) || '0u128.private';
                        const tokenBalance = Number(tokenBalanceStr.split(".")[0].slice(0, -4));
                        if (tokenBalance > maxTokenRecVal) {
                            newTokenRec = rec;
                            maxTokenRecVal = tokenBalance;
                        }
                        return tokenBalance + former;
                    }, 0
                );
                setTokenRecord(newTokenRec);
                setMainTokenPrivateBalance(newPrivateBalance);
            }
        };
        if (mainTokenId) {
            loadPrivateBalance();
        }
    }, [connected, requestRecords, mainTokenId]);

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
        <AccountContext.Provider value={{
            connected, loading, setConnected, logOut,
            mainTokenId, setMainTokenId, mainTokenPublicBalance,
            mainTokenData, mainTokenPrivateBalance, tokenRecord
        }}>
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