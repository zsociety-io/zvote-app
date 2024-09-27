import React, { useState } from "react";
import Link from "next/link";

import {
    Container,
    Typography,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Switch,
    TextField,
    Button,
    Grow,
    Box,
    InputAdornment,
} from '@mui/material'; import { ThemeProvider, createTheme } from '@mui/material/styles';

const proposalTypesLabels = {
    "vsu": "Voting Systems Update",
    "psu": "Proposers Update",
    "daou": "Settings Update",
    "default": "Default"
};

const TableRow = ({ proposal, index }) => {
    return (

        <tr className="mt-5">
            <style global jsx>{`
                .MuiInputBase-input{
                    padding: 5px!important;
                    padding-right: 25px!important;
                }
            `}</style>
            <td className="text-[18px] pt-3 ">{proposal.proposal_id.slice(0, 10)}...</td>
            <td className="text-[18px] pt-3 ">{proposalTypesLabels?.[proposal.type]}</td>
            <td className="text-[18px] pt-3 ">
                <div className="flex items-center text-[16px] font-bold text-[#0C0B3F] vs_params_container">
                    <TextField
                        label="Parameters "
                        variant="outlined"
                        value={proposal.content.value_str}
                        fullWidth
                        margin="normal"
                        id={"proposalContent_" + index}
                        disabled={true}
                    />
                    <div className="link-copy copyInput" style={{ transform: "translate(-20px, 5px)" }}>
                        <button
                            onClick={
                                (e) => {
                                    const tempInput = document.createElement("input");
                                    tempInput.value = document.getElementById("proposalContent_" + index).value;
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
            </td>
            <td className="text-[18px] pt-3 ">0/{proposal.voting_system.params.quorum.slice(0, -4)}</td>
            <td className="pt-3">
                <div className="flex flex-start">
                    <div className="leading-normal text-[#8A8A8A] text-[12px] font-bold border border-[#ADADAD] rounded-full px-3 py-0.5 bg-[#ECECEC]">
                        Active
                    </div>
                </div>
            </td>
        </tr >
    );
};

const proposalToProposalData = (proposals) => {
    return proposals.map(
        (proposal) => {
            const pid = proposal.content.program_id;
            const type = (
                pid === process.env.NEXT_PUBLIC_VSM_DAO_BASED_NAR_PROGRAM_ID
                || pid === process.env.NEXT_PUBLIC_VSM_DAO_BASED_APL_PROGRAM_ID
            ) ?
                "vsu" :
                (
                    pid === process.env.NEXT_PUBLIC_DAOMU_DAO_BASED_AP_PROGRAM_ID
                    || pid === process.env.NEXT_PUBLIC_DAOMU_DAO_BASED_NA_PROGRAM_ID
                ) ?
                    "daou" :
                    pid === process.env.NEXT_PUBLIC_PSM_DAO_BASED_PROGRAM_ID ?
                        "psu"
                        :
                        "default";
            return {
                ...proposal,
                type,
            };
        }
    );
}

export function ProposalsPage({ dao, setStatusFilter, statusFilter }) {
    const [activeTab, setActiveTab] = useState("all");

    const proposals = proposalToProposalData(dao.proposals).filter(
        proposal => (activeTab === "all" || proposal.type === activeTab)
    );
    return (
        <>
            <div className="grid grid-cols-4 gap-[32px] mt-[18px] text-[#0C0B3F]">
                <div className="col-span-1">
                    <div className="py-[25px] px-[35px] bg-white rounded-[15px] border border-[#D5D5D5]">

                        <ul className="flex flex-col gap-4 mt-2 mb-3 text-[18px] font-medium">
                            <li>
                                <Link href="#" className={activeTab === "all" ? "font-black" : ""} onClick={() => setActiveTab("all")}>All Proposals</Link>
                            </li>
                            <li>
                                <Link href="#" className={activeTab === "default" ? "font-black" : ""} onClick={() => setActiveTab("default")}>Default Proposals</Link>
                            </li>
                            <li>
                                <Link href="#" className={activeTab === "vsu" ? "font-black" : ""} onClick={() => setActiveTab("vsu")}>Voting Systems Update</Link>
                            </li>
                            <li>
                                <Link href="#" className={activeTab === "psu" ? "font-black" : ""} onClick={() => setActiveTab("psu")}>Proposers Update</Link>
                            </li>
                            <li>
                                <Link href="#" className={activeTab === "daou" ? "font-black" : ""} onClick={() => setActiveTab("daou")}>Settings Update</Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="col-span-3">
                    <div className="py-[23px] px-[46px] bg-white rounded-[15px] border border-[#D5D5D5] min-h-[622px] flex flex-col justify-between">
                        <table className="w-full">
                            <thead className="border-b">
                                <tr className="text-[18px] font-medium text-[#5F5F5F]">
                                    <th className="pb-4">ID</th>
                                    <th className="pb-4">Type</th>
                                    <th className="pb-4">Content</th>
                                    <th className="pb-4">Votes: For/Needed</th>
                                    <th className="pb-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="mt-5">
                                {proposals.map((proposal, index) => (<TableRow proposal={proposal} index={index} />))}
                                {!proposals?.length && (<div style={{ color: "grey", marginTop: "20px" }}>No proposals yet...</div>)}
                            </tbody>
                        </table>
                        <div className="flex justify-center gap-4 text-[18px]">
                            <div className="">1</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}



export function ProposalsFilters() {
    const [activeFilter, setActiveFilter] = useState("All");
    return (
        <>
            <div className="flex gap-11 items-center">
                <div className="bg-[#E5E6ED] p-[4px] rounded-[10px]">
                    <button
                        onClick={() => setActiveFilter("All")}
                        type="button"
                        className={`px-[28px] py-1 text-[14px] font-medium rounded-[10px] ${activeFilter === "All" ? `bg-white` : `text-[#5F5F5F]`
                            }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setActiveFilter("Active")}
                        type="button"
                        className={`px-[28px] py-1 text-[14px] font-medium rounded-[10px] ${activeFilter === "Active" ? `bg-white` : `text-[#5F5F5F]`
                            }`}
                    >
                        Active
                    </button>
                    <button
                        onClick={() => setActiveFilter("Past")}
                        type="button"
                        className={`px-[28px] py-1 text-[14px] font-medium rounded-[10px] ${activeFilter === "Past" ? `bg-white` : `text-[#5F5F5F]`
                            }`}
                    >
                        Past
                    </button>
                    <button
                        onClick={() => setActiveFilter("Accepted")}
                        type="button"
                        className={`px-[28px] py-1 text-[14px] font-medium rounded-[10px] ${activeFilter === "Accepted" ? `bg-white` : `text-[#5F5F5F]`
                            }`}
                    >
                        Accepted
                    </button>
                </div>
                <div className="">
                    {false && (
                        <button type="button" onClick={() => {
                        }}>
                            <div className="text-[#0C0B3F] text-[12px] font-extrabold flex items-center gap-2 bg-white rounded-[15px] px-3 py-2 border border-[#D5D5D5]">
                                <span className="text-[36px]">+</span>
                                Add Voting System
                            </div>
                        </button>
                    )}
                    {!false && (
                        <div className="cursor-default text-[#858585] text-[12px] font-extrabold flex items-center gap-2 !bg-[#E5E6ED] rounded-[15px] px-3 py-2 border border-[#D5D5D5]">
                            <span className="text-[36px]">+</span>
                            New proposal
                        </div>
                    )}

                </div>
            </div>
        </>
    );
}