import Link from "next/link";
import React from "react";
import { useState, useEffect, useRef } from "react";
import { ProposalsPage, ProposalsFilters } from "@/components/dashboard/Proposals";
import { DaoCorePage, } from "@/components/dashboard/DaoCore";
import { useTailwindLayout } from "@/hooks/useTailwindLayout"
import { TextField } from '@mui/material';
import { getDao } from '@/lib/zvote';
import { useAccount } from "@/components/AccountProvider";

import { post_request } from "@/lib/utils/network";

import MDEditor from '@uiw/react-md-editor';

import {
    Container,
    FormControl,
    FormLabel,
    Button,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import { VotingSystemSelection } from "@/components/dashboard/DaoCore"

import { createDefaultProposal } from "@/lib/adapter/dashboard"
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";

const theme = createTheme({
    palette: {
        primary: {
            main: '#0a093d',
        },
        secondary: {
            main: '#90caf9',
        },
    },

});


const CreateProposalModal = ({
    votingSystems,
    voteVS,
    setVoteVS,
    proposalMd,
    setProposalMd,
    isOpen,
    onClose,
    onSubmit,
    setProposalBlocks,
    proposalBlocks
}) => {
    const modalRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();  // Close modal if clicked outside of the modal content
            }
        };
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <style global jsx>{`
                .MuiOutlinedInput-root{
                    height: 55px!important;
                }
                .MuiInputBase-input {
                    padding: 15px!important;
                }
                .MuiBox-root{
                    border: none!important;
                    padding: 20px!important;
                    padding-top: 0!important;
                }
            `}</style>
            <div ref={modalRef} className="bg-white p-6 rounded-lg shadow-lg containerNewProposalForm">
                <ThemeProvider theme={theme}>
                    <Container>
                        <h1>Create a New proposal</h1>
                        <FormControl fullWidth margin="normal">
                            <div data-color-mode="light">
                                <MDEditor
                                    value={proposalMd}
                                    onChange={setProposalMd}
                                />
                            </div>
                            <VotingSystemSelection
                                votingSystems={votingSystems}
                                voteVS={voteVS}
                                setVoteVS={setVoteVS}
                                setProposalBlocks={setProposalBlocks}
                                proposalBlocks={proposalBlocks}
                            />
                        </FormControl>
                        <Button onClick={onSubmit} style={{ padding: "4px", borderRadius: "50px", background: "#0a093d", color: "#ffffff", fontSize: "14px" }} type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                            Create Proposal
                        </Button>
                    </Container>
                </ThemeProvider>
            </div>
        </div >
    );
};


export default function DashboardLayout({
    dao
}) {
    const { publicKey, requestBulkTransactions } = useWallet();
    const [activeTab, setActiveTab] = useState("proposals");
    const isProposals = (activeTab === "proposals");
    const isDaoCore = (activeTab === "daoCore");
    const [statusFilter, setStatusFilter] = useState("all");

    const [voteVS, setVoteVS] = useState("");
    const [proposalMd, setProposalMd] = useState("");
    const [isCreateProposalModalOpen, setIsCreateProposalModalOpen] = useState(false);
    const [proposalBlocks, setProposalBlocks] = useState("");

    const { setMainTokenId, mainTokenId } = useAccount();

    console.log(dao)

    const userCanCreateProposals = (
        publicKey != null
        && (
            dao.dao_manager.program_id === process.env.NEXT_PUBLIC_DAOM_NAR_PROGRAM_ID
            || (
                dao.dao_manager.proposers
                && dao
                    .dao_manager
                    .proposers.map(
                        (proposer) => proposer.address.includes(publicKey)
                    )
            )
        )

    );

    const handleCreateProposal = async () => {
        const { hash, content } = await post_request(
            "/api/contract/proposal/reference",
            {
                content: proposalMd
            }
        );
        const votingSystem = dao?.voting_systems?.[voteVS || 0];
        const votingSystemParamsHash = votingSystem?.params_hash;
        await createDefaultProposal(
            publicKey,
            requestBulkTransactions,
            dao.dao_manager.program_id,
            dao?.dao_id,
            hash,
            votingSystem,
            votingSystemParamsHash,
            proposalBlocks
        );
        setProposalMd("");
        setProposalBlocks("");
        setIsCreateProposalModalOpen(false);
    }

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
                    {isProposals && (
                        <ProposalsFilters
                            statusFilter={statusFilter}
                            setStatusFilter={setStatusFilter}
                            userCanCreateProposals={userCanCreateProposals}
                            onNewProposalClicked={() => setIsCreateProposalModalOpen(true)}
                        />
                    )}
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
                                            }
                                        }
                                    ><i className="fas fa-copy"></i></button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                {isProposals && <ProposalsPage dao={dao} statusFilter={statusFilter} setStatusFilter={setStatusFilter} />}
                {isProposals && (
                    <CreateProposalModal
                        isOpen={isCreateProposalModalOpen}
                        onClose={() => setIsCreateProposalModalOpen(false)}
                        onSubmit={handleCreateProposal}
                        proposalMd={proposalMd}
                        setProposalMd={setProposalMd}
                        votingSystems={dao.voting_systems}
                        voteVS={voteVS}
                        setVoteVS={setVoteVS}
                        setProposalBlocks={setProposalBlocks}
                        proposalBlocks={proposalBlocks}
                    />
                )}
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