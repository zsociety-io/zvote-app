import '../styles/all.min.css'
import '../styles/aos.css'
import '../styles/bootstrap.min.css'
import '../styles/elegant-icons.min.css'
import '../styles/globals.css'
import '../styles/register.css'
import '../styles/responsive.css'

import Script from 'next/script'
import { LeoWalletAdapter } from '@demox-labs/aleo-wallet-adapter-leo';

import Head from 'next/head';

import Navigation from '../components/layout/Navigation.jsx'
import Footer from '../components/layout/Footer.jsx'
import { WalletProvider } from '@demox-labs/aleo-wallet-adapter-react';
import { useRouter } from 'next/router';

import {
  DecryptPermission,
  WalletAdapterNetwork,
} from '@demox-labs/aleo-wallet-adapter-base';

import React, { useMemo, useEffect } from 'react';

import {
  PuzzleWalletAdapter,
  AvailWalletAdapter,
  SoterWalletAdapter,
  FoxWalletAdapter,
  configureConnectionForPuzzle,
  puzzleConfig
} from "../lib/adapter/adapters/index.js";

import { AccountProvider } from "../components/AccountProvider"

import { isMobile as reactDetectIsMobile } from 'react-device-detect';

function App({ Component, pageProps }) {
  const router = useRouter();
  const noLayoutPaths = ['/dashboard'];
  const hideLayout = noLayoutPaths.some((path) => router.pathname.startsWith(path));

  const appName = "zVote"
  const dAppUrl = `https://${process.env.NEXT_PUBLIC_HOST}/`;
  const wallets = useMemo(
    () => [
      new LeoWalletAdapter({
        appName,
        isMobile: reactDetectIsMobile,
        mobileWebviewUrl: dAppUrl,
      }),
      new PuzzleWalletAdapter({ appName }),
      new AvailWalletAdapter({ appName }),
      new SoterWalletAdapter({ appName }),
      new FoxWalletAdapter({ appName }),
    ],
    []
  );
  useEffect(() => {
    configureConnectionForPuzzle({ ...puzzleConfig, dAppUrl });
  }, []);

  return <>
    <WalletProvider
      wallets={wallets}
      network={WalletAdapterNetwork.TestnetBeta}
      decryptPermission={DecryptPermission.OnChainHistory}
      programs={[
        process.env.NEXT_PUBLIC_CREDITS_PROGRAM_ID,
      ]}
      autoConnect
    >
      <AccountProvider>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1 maximum-scale=1"
          />
        </Head>
        <Navigation />
        <Component {...pageProps} />
        {!hideLayout && <Footer />}
      </AccountProvider>
      {!hideLayout && (
        <>
          <Script
            src="bootstrap.bundle.min.js"
            strategy="lazyOnload"
          />
          <Script
            src="jquery-3.6.0.min.js"
            strategy="lazyOnload"
          />
          <Script
            src="popper.min.js"
            strategy="lazyOnload"
          />
        </>
      )}
    </WalletProvider>
  </>
}

export default App
