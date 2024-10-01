import Link from "next/link";
import React from "react";
import { useState, useEffect } from "react";
import { ProposalsPage, ProposalsFilters } from "@/components/dashboard/Proposals";
import { DaoCorePage, } from "@/components/dashboard/DaoCore";
import { useTailwindLayout } from "@/hooks/useTailwindLayout"
import { TextField } from '@mui/material';
import { getDao } from '@/lib/zvote';
import { useAccount } from "@/components/AccountProvider";

import {
    DecryptPermission,
    WalletAdapterNetwork,
} from '@demox-labs/aleo-wallet-adapter-base';


export default function DashboardLayout({
    dao
}) {
    const [activeTab, setActiveTab] = useState("proposals");
    const isProposals = (activeTab === "proposals");
    const isDaoCore = (activeTab === "daoCore");
    const [statusFilter, setStatusFilter] = useState("all");

    const { setMainTokenId, mainTokenId } = useAccount();

    useEffect(() => {
        setMainTokenId(dao.token_id)
    }, []);

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
                    {isProposals && <ProposalsFilters statusFilter={statusFilter} setStatusFilter={setStatusFilter} />}
                    {isDaoCore && (
                        <div style={{
                            flexDirection: "row",
                            display: "flex"
                        }}>
                            <style global jsx>{`
                                #dao_id_box{
                                    padding: 0!important;
                                    padding-right: 25px!important;
                                    background-color: white;
                                }
                                .dao_id_container .MuiInputBase-root {
                                    height: 35px !important;
                                    background-color: white;
                                    padding-left: 8px;
                                }
                            `}</style>
                            <div
                                style={{
                                    alignItems: "center",
                                    display: "flex"
                                }}
                            >
                                DAO Id:&nbsp;
                            </div>
                            <div className="flex items-center text-[16px] font-bold text-[#0C0B3F] dao_id_container">
                                <TextField
                                    className="mt-[8px]"
                                    variant="outlined"
                                    value={dao.dao_id}
                                    fullWidth
                                    margin="normal"
                                    id={"dao_id_box"}
                                    disabled={true}
                                />
                                <div className="link-copy copyInput" style={{ transform: "translate(-20px, 0px)" }}>
                                    <button
                                        onClick={
                                            (e) => {
                                                const tempInput = document.createElement("input");
                                                tempInput.value = document.getElementById("dao_id_box").value;
                                                document.body.appendChild(tempInput);
                                                tempInput.select();
                                                document.execCommand("copy");
                                                document.body.removeChild(tempInput);
                                                console.log("Copied: " + tempInput.value);
                                            }
                                        }
                                    ><i className="fas fa-copy"></i></button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                {isProposals && <ProposalsPage dao={dao} statusFilter={statusFilter} setStatusFilter={setStatusFilter} />}
                {isDaoCore && <DaoCorePage dao={dao} />}
            </div>
        </>
    );
}


export async function getServerSideProps(context) {
    const dao = await getDao(
        context.params.daoId
    )
    return { props: { dao } }
}