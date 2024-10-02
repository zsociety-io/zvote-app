import Link from "next/link";
import React, { useEffect } from "react";
import { useState, useRef } from "react";
import { DaoCorePage, } from "@/components/dashboard/DaoCore";
import { useTailwindLayout } from "@/hooks/useTailwindLayout"
import { TextField } from '@mui/material';

import { getProposal, getProposalVote } from '@/lib/zvote';

import ProposalContent from "@/components/dashboard/ProposalContent"
import { settingsFromDao } from "@/components/dashboard/DaoCore"
import { addressToProgramId, getMappingValue } from "@/lib/aleo/aleoscan"

import { formatAleoString, } from "@/lib/aleo";

import Image from "next/image"
import { useAccount } from "@/components/AccountProvider";

import { castVote, withdrawReceipt, setResult, applyUpdate } from "@/lib/adapter/dashboard"
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import { formatNumber } from "@/lib/utils/strings"



const proposalTypesLabels = {
    "vsu": "Voting Systems Update",
    "psu": "Proposers Update",
    "daou": "Settings Update",
    "default": "Default"
};

const proposalStatusLabels = {
    "pending": "Pending",
    "accepted": "Accepted",
    "rejected": "Rejected",
    "executed": "Executed"
};


export default function DashboardLayout({
    proposal
}) {
    const vsname = (
        proposal?.voting_system?.program_id
        || proposal?.voting_system?.address
    );
    const {
        setMainTokenId, mainTokenPublicBalance, mainTokenId, mainTokenPrivateBalance, tokenRecord, mainTokenData
    } = useAccount();
    const { requestTransaction, publicKey, connected, requestRecords } = useWallet();
    const canVote = mainTokenPrivateBalance > 0 && proposal.vote.result == null && !Boolean(proposal?.vote?.end?.ended);
    console.log({
        mainTokenPrivateBalance,
        res: proposal.vote.result,
        end: proposal?.vote?.end?.ended,
        canVote
    });
    useEffect(() => {
        setMainTokenId(proposal?.dao?.token_id)
    }, [proposal?.dao?.token_id]);

    const [receipt, setReceipt] = useState(null);
    const updateDaoParamsRef = useRef({
        dao_manager: null,
        dao_manager_updater: null,
        voting_system_manager: null,
        proposers_manager: null,
        token_id: null
    });

    useEffect(() => {
        const loadPrivateBalance = async () => {
            if (connected && requestRecords != null) {
                let recs = await requestRecords(proposal?.voting_system?.program_id);
                let newReceipt = null;
                recs.forEach(
                    (record) => {
                        if (record.spent) {
                            return;
                        }
                        const isMainToken = (record?.data?.token_id || '0field.private')?.split(".")[0] === proposal?.dao?.token_id;
                        const isCurrentDao = (record?.data?.dao_id || '0field.private')?.split(".")[0] === proposal?.dao_id;
                        const isCurrentProposal = (record?.data?.proposal_id || '0field.private')?.split(".")[0] === proposal?.proposal_id;
                        if (!isMainToken || !isCurrentDao || !isCurrentProposal) {
                            return;
                        }
                        const amountStr = (isMainToken ? record?.data?.amount : null) || '0u128.private';
                        const amount = Number(amountStr.split(".")[0].slice(0, -4));

                        if (amount > (newReceipt?.amount || 0)) {
                            newReceipt = {
                                amount,
                                record,
                                candidate: record?.data?.candidate.split(".")[0]
                            };
                        }
                        return;
                    }
                );
                setReceipt(newReceipt);
            }
        };
        if (mainTokenId) {
            loadPrivateBalance();
        }
    }, [connected, requestRecords, mainTokenId]);

    const score_1 = proposal.vote.scores?.score_1 || 0;
    const score_0 = proposal.vote.scores?.score_0 || 0;

    const decimals = Number(mainTokenData?.decimals.slice(0, -2));
    const quorum = Number(proposal?.voting_system?.params?.quorum?.slice(0, -4)) || 0;
    const displayQuorum = quorum / (10 ** decimals);
    const displayScore1 = ((score_1) / (10 ** decimals));
    const displayScore0 = ((score_0) / (10 ** decimals));
    const displayScore01 = ((score_0 + score_1) / (10 ** decimals));

    const againstWithdrawAvailable = receipt?.candidate === "0field" && receipt?.amount > 0;
    const forWithdrawAvailable = receipt?.candidate === "1field" && receipt?.amount > 0;

    const displayWithdraw = (againstWithdrawAvailable || forWithdrawAvailable) ? ((receipt?.amount) / (10 ** decimals)) : 0;

    const isProposalVoteSettable = (
        score_1 + score_0 > quorum
        && score_1 !== score_0
        && proposal?.vote?.result == null
        && proposal?.vote?.end?.ended
    );

    console.log({ proposal })
    const settableWinner = score_1 > score_0 ? "1field" : "0field";
    useTailwindLayout();
    return (
        <>
            <div className="min-h-screen bg-[#F1F1F1] px-[54px] py-[50px]">
                <div className="flex ">
                    {/* Dashboard Navigation */}
                    <div className="flex gap-12 "
                        style={{
                            flexWrap: "wrap",
                            justifyContent: "space-between",
                            width: "100%"
                        }}
                    >
                        <h1
                            className={"text-[36px] leading-[43.57px] text-[#0C0B3F] font-[500]"}
                        >
                            <Link href={`/dashboard/dao/${proposal.dao_id}`}>&nbsp;← </Link>&nbsp;&nbsp;Proposal
                        </h1>

                        <div style={{
                            flexDirection: "row",
                            display: "flex"
                        }}>
                            <style global jsx>{`
                                #dao_id_box, #proposal_content_box{
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
                                    display: "flex",
                                    marginRight: "20px"
                                }}
                            >
                                {canVote && (
                                    <button type="button" onClick={async () => {
                                        await castVote(
                                            publicKey,
                                            requestTransaction,
                                            proposal?.voting_system?.program_id,
                                            proposal?.dao_id,
                                            mainTokenPrivateBalance,
                                            proposal?.proposal_id,
                                            false,
                                            tokenRecord,
                                        )
                                    }}>
                                        <div className="mr-[10px] text-[#0C0B3F] text-[12px] font-extrabold flex items-center gap-2 bg-white rounded-[15px] px-3 py-2 border border-[#D5D5D5]">
                                            <span className="text-[22px]">↓</span>
                                            Vote Against
                                        </div>
                                    </button>
                                )}
                                {!canVote && !againstWithdrawAvailable && (
                                    <div className="mr-[10px] cursor-default text-[#858585] text-[12px] font-extrabold flex items-center gap-2 !bg-[#E5E6ED] rounded-[15px] px-3 py-2 border border-[#D5D5D5]">
                                        <span className="text-[22px]">↓</span>
                                        Vote Against
                                    </div>
                                )}
                                {againstWithdrawAvailable && (
                                    <button type="button" onClick={async () => {
                                        await withdrawReceipt(
                                            publicKey,
                                            requestTransaction,
                                            proposal?.voting_system?.program_id,
                                            receipt.record
                                        )
                                    }}>
                                        <div className="mr-[10px] text-[#0C0B3F] text-[12px] font-extrabold flex items-center gap-2 bg-white rounded-[15px] px-3 py-2 border border-[#D5D5D5]">
                                            <span className="text-[22px]">↓</span>
                                            Withdraw: {isNaN(displayWithdraw) ? 0 : displayWithdraw}
                                        </div>
                                    </button>
                                )}
                                {canVote && !againstWithdrawAvailable && (
                                    <button type="button" onClick={async () => {
                                        await castVote(
                                            publicKey,
                                            requestTransaction,
                                            proposal?.voting_system?.program_id,
                                            proposal?.dao_id,
                                            mainTokenPrivateBalance,
                                            proposal?.proposal_id,
                                            true,
                                            tokenRecord,
                                        )
                                    }}>
                                        <div className="mr-[10px] text-[#0C0B3F] text-[12px] font-extrabold flex items-center gap-2 bg-white rounded-[15px] px-3 py-2 border border-[#D5D5D5]">
                                            <span className="text-[22px]">↑</span>
                                            Vote For
                                        </div>
                                    </button>
                                )}
                                {!canVote && !forWithdrawAvailable && (
                                    <div className="mr-[10px] cursor-default text-[#858585] text-[12px] font-extrabold flex items-center gap-2 !bg-[#E5E6ED] rounded-[15px] px-3 py-2 border border-[#D5D5D5]">
                                        <span className="text-[22px]">↑</span>
                                        Vote For
                                    </div>
                                )}
                                {forWithdrawAvailable && (
                                    <button type="button" onClick={async () => {
                                        await withdrawReceipt(
                                            publicKey,
                                            requestTransaction,
                                            proposal?.voting_system?.program_id,
                                            receipt.record
                                        )
                                    }}>
                                        <div className="text-[#0C0B3F] text-[12px] font-extrabold flex items-center gap-2 bg-white rounded-[15px] px-3 py-2 border border-[#D5D5D5]">
                                            <span className="text-[22px]">↑</span>
                                            Withdraw: {isNaN(displayWithdraw) ? 0 : displayWithdraw}
                                        </div>
                                    </button>
                                )}
                            </div>
                            <div
                                style={{
                                    alignItems: "center",
                                    display: "flex"
                                }}
                            >
                                Proposal Id:&nbsp;
                            </div>
                            <div className="flex items-center text-[16px] font-bold text-[#0C0B3F] dao_id_container">
                                <TextField
                                    className="mt-[8px]"
                                    variant="outlined"
                                    value={proposal.proposal_id}
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

                    </div >
                </div>
                <>
                    <div className="grid grid-cols-4 gap-[32px] mt-[18px] text-[#0C0B3F]">
                        <div className="col-span-1">
                            <div className="py-[25px] px-[35px] bg-white rounded-[15px] border border-[#D5D5D5]">

                                <ul className="flex flex-col gap-3 mt-2 mb-3 text-[16px] font-medium">
                                    <li>
                                        <div className="font-bold">Type:</div>
                                        <div>{proposalTypesLabels?.[proposal.type]}</div>
                                    </li>
                                    <hr style={{ borderColor: "#696969" }} />
                                    <li>
                                        <span className="font-bold">Content:</span>
                                        <div className="flex items-center text-[16px] font-bold text-[#0C0B3F] dao_id_container">
                                            <TextField
                                                className="mt-[8px]"
                                                variant="outlined"
                                                value={proposal.content.value_str}
                                                fullWidth
                                                margin="normal"
                                                id={"proposal_content_box"}
                                                disabled={true}
                                            />
                                            <div className="link-copy copyInput" style={{ transform: "translate(-20px, 0px)" }}>
                                                <button
                                                    onClick={
                                                        (e) => {
                                                            const tempInput = document.createElement("input");
                                                            tempInput.value = document.getElementById("proposal_content_box").value;
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
                                    </li>
                                    <hr style={{ borderColor: "#696969" }} />
                                    <li>
                                        <div className="font-bold">Status:</div>
                                        <div>{proposalStatusLabels?.[proposal.status]}</div>
                                    </li>
                                    <hr style={{ borderColor: "#696969" }} />
                                    {proposal.vote.result == null && (<li>
                                        <div className="font-bold">For Votes:</div>
                                        <div>{isNaN(displayScore1) ? 0 : displayScore1}</div>
                                        <div className="font-bold">Against Votes:</div>
                                        <div>{isNaN(displayScore0) ? 0 : displayScore0}</div>
                                        <div className="font-bold">Total / Needed:</div>
                                        <div>{isNaN(displayScore01) ? 0 : displayScore01} / {isNaN(displayQuorum) ? 0 : displayQuorum}</div>
                                        {
                                            isProposalVoteSettable && (
                                                <div className="menu-button">
                                                    <a className="theme-btn nav-link w-full mt-[10px] cursor-pointer" id="connectBtn" onClick={async () => {
                                                        await setResult(
                                                            publicKey,
                                                            requestTransaction,
                                                            proposal?.voting_system?.program_id,
                                                            proposal?.dao_id,
                                                            proposal?.proposal_id,
                                                            settableWinner
                                                        )
                                                    }}>
                                                        <span className="aligned_connect">Set Result</span>
                                                    </a>
                                                </div>
                                            )
                                        }
                                    </li>)}
                                    {proposal.vote.result != null && (<li>
                                        <div className="font-bold">Result:</div>
                                        <div>{proposal.vote.result == "0field" ? "Rejected" : "Approved"}</div>
                                        {
                                            proposal.vote.result == "1field" && !proposal.vote.executed && proposal.type !== "default" && (
                                                <div className="menu-button">
                                                    <a className="theme-btn nav-link w-full mt-[10px] cursor-pointer" id="connectBtn" onClick={async () => {
                                                        await applyUpdate(
                                                            publicKey,
                                                            requestTransaction,
                                                            proposal,
                                                            updateDaoParamsRef
                                                        )
                                                    }}>
                                                        <span className="aligned_connect">Apply Update</span>
                                                    </a>
                                                </div>
                                            )
                                        }
                                    </li>)}
                                    <hr style={{ borderColor: "#696969" }} />
                                    <li>
                                        <div className="font-bold">Voting System:</div>
                                        <div className="flex items-center text-[16px] text-[#0C0B3F] gap-2">
                                            <a
                                                target="_blank"
                                                className="contents !hover:underline"
                                                href={
                                                    vsname.endsWith(".aleo") ?
                                                        `${process.env.NEXT_PUBLIC_EXPLORER_URL}/program?id=${vsname}` :
                                                        `${process.env.NEXT_PUBLIC_EXPLORER_URL}/address?a=${vsname}`
                                                }
                                            >
                                                {
                                                    vsname.substring(0, 30) + (vsname.length > 30
                                                        ? '...'
                                                        : ''
                                                    )
                                                } <Image width={15} src={require("@/img/redirect_icon.svg").default} alt="link" />
                                            </a>
                                        </div>
                                        <div className="font-bold">Parameters:</div>

                                        <div className="flex items-center text-[16px] font-bold text-[#0C0B3F] dao_id_container">
                                            <TextField
                                                className="mt-[8px]"
                                                variant="outlined"
                                                value={proposal?.voting_system?.params_str}
                                                fullWidth
                                                margin="normal"
                                                id={"proposal_vs_params_box"}
                                                disabled={true}
                                            />
                                            <div className="link-copy copyInput" style={{ transform: "translate(-20px, 0px)" }}>
                                                <button
                                                    onClick={
                                                        (e) => {
                                                            const tempInput = document.createElement("input");
                                                            tempInput.value = document.getElementById("proposal_vs_params_box").value;
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
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="col-span-3">
                            <div className="py-[23px] px-[46px] bg-white rounded-[15px] border border-[#D5D5D5] min-h-[500px]">
                                <ProposalContent proposal={proposal} updateDaoParamsRef={updateDaoParamsRef} />
                            </div>
                        </div>
                    </div>
                </>
            </div>
        </>
    );
}

async function getCorrespondingDao(proposal_content) {
    const dao_manager_program_id = await addressToProgramId(proposal_content.dao_manager)
    if (dao_manager_program_id == null) {
        return null;
    }
    const dao_manager_params_str = await getMappingValue(
        dao_manager_program_id,
        "dao_manager_params",
        proposal_content.dao_manager_params_hash
    );
    let dao_manager = {
        program_id: dao_manager_program_id,
        address: proposal_content.dao_manager
    };
    if (dao_manager_params_str == null) {
        return { dao_manager, standard: true, token_id: proposal_content.token_id };
    }
    const dao_manager_params = JSON.parse(formatAleoString(dao_manager_params_str));
    console.log(dao_manager_params)
    const dao_manager_updater_address = dao_manager_params?.dao_manager_updater;
    const voting_system_manager_address = dao_manager_params?.voting_system_manager;
    const proposers_manager_address = dao_manager_params?.proposers_manager_address;
    if (dao_manager_updater_address == null || voting_system_manager_address == null) {
        return { dao_manager, dao_manager_params, token_id: proposal_content.token_id, standard: true };
    }

    const dao_manager_updater = {
        address: dao_manager_updater_address,
        program_id: await addressToProgramId(dao_manager_updater_address)
    }
    const voting_system_manager = {
        address: voting_system_manager_address,
        program_id: await addressToProgramId(voting_system_manager_address)
    };


    dao_manager = {
        ...dao_manager,
        dao_manager_updater,
        voting_system_manager,
    }

    let proposers_manager = null;
    if (proposers_manager_address != null) {
        proposers_manager = {
            address: proposers_manager_address,
            program_id: await addressToProgramId(proposers_manager_address)
        };
        dao_manager = {
            ...dao_manager,
            proposers_manager,
        }
    }

    return {
        dao_manager,
        standard: true,
        token_id: proposal_content.token_id
    };
}



export async function getServerSideProps(context) {
    let [proposal, dao_str] = await Promise.all([
        getProposal(
            context.params.daoId,
            context.params.proposalId,
        ),
        getMappingValue(
            process.env.NEXT_PUBLIC_MDSP_PROGRAM_ID,
            "daos",
            context.params.daoId
        )
    ]);
    proposal.dao = dao_str ? JSON.parse(formatAleoString(dao_str)) : null;
    const [proposal_content, vote] = await Promise.all([
        loadProposalContent(proposal),
        getProposalVote(proposal)
    ]);
    proposal = { ...proposal, vote };

    return { props: { proposal } };
}


async function loadProposalContent(proposal) {
    const proposal_content = proposal?.content?.value;
    if (!proposal_content) {
        return
    }
    if (proposal.type === "daou") {
        const correspondingDao = await getCorrespondingDao(proposal_content);
        if (!correspondingDao.standard) {
            return;
        }
        proposal.content.daoSettings = settingsFromDao(correspondingDao);
    }
    if (proposal.type === "vsu") {
        const voting_system_address = proposal_content.voting_system;
        const voting_system = {
            address: voting_system_address,
            program_id: await addressToProgramId(voting_system_address)
        };

        const params_str = await getMappingValue(
            voting_system.program_id,
            "voting_system_params",
            proposal_content.vs_params_hash
        );
        const params = JSON.parse(formatAleoString(params_str));

        proposal.content.value.voting_system = {
            ...voting_system,
            params_str,
            params
        };
    }
    if (proposal.type === "psu") {
        const proposer_address = proposal_content.proposer;
        proposal.content.value.proposer = {
            address: proposer_address,
            program_id: await addressToProgramId(proposer_address)
        };
    }
}