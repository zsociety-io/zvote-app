import React, { useEffect, useState } from 'react';
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import { get_request } from '@/lib/utils/network.js';

import { useRouter } from 'next/router';
import { getDao } from '@/lib/zvote';

function DashboardHome({ dao }) {
    const { requestTransaction, publicKey } = useWallet();
    const [isLoading, setIsLoading] = useState(true);

    const loadTokens = async () => {
        try {
            //const daos = await get_request(`/api/contract/daos/${publicKey}`);

        } catch (error) {
            console.error('Failed to load DAOs:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (publicKey != null) {
            loadTokens();
        }
    }, [publicKey]);

    return (
        <div className="hero-area-3">
            {console.log(publicKey, dao)}
        </div>
    );
}

export default DashboardHome;


export async function getServerSideProps(context) {
    const dao = await getDao(context.params.daoId);

    return { props: { dao } }
}