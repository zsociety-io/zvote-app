import Link from "next/link";
import React from "react";
import { useState } from "react";
import { ProposalsPage, ProposalsFilters } from "@/components/dashboard/Proposals";
import { DaoCorePage, } from "@/components/dashboard/DaoCore";
import { useTailwindLayout } from "@/hooks/useTailwindLayout"

import {
    DecryptPermission,
    WalletAdapterNetwork,
} from '@demox-labs/aleo-wallet-adapter-base';

export default function DashboardLayout() {
    const [activeTab, setActiveTab] = useState("proposals");
    const isProposals = (activeTab === "proposals");
    const isDaoCore = (activeTab === "daoCore");
    console.log({ net: WalletAdapterNetwork.TestnetBeta })
    useTailwindLayout();
    return (
        <>
            <div className="min-h-screen bg-[#F1F1F1] px-[54px] py-[50px]">
                <div className="flex justify-between items-center">
                    {/* Dashboard Navigation */}
                    <div className="flex items-center gap-12">
                        <h1
                            className={"cursor-pointer text-[36px] leading-[43.57px] text-[#0C0B3F] " + (isProposals ? "font-bold" : "font-[300]")}
                            onClick={() => setActiveTab("proposals")}
                        >
                            Proposals
                        </h1>
                        <h1
                            className={"cursor-pointer text-[36px] leading-[43.57px] text-[#0C0B3F] " + (isDaoCore ? "font-bold" : "font-[300]")}
                            onClick={() => setActiveTab("daoCore")}
                        >
                            DAO Core
                        </h1>
                    </div >

                    {isProposals && <ProposalsFilters />}
                </div>
                {isProposals && <ProposalsPage />}
                {isDaoCore && <DaoCorePage />}
            </div>
        </>
    );
}



