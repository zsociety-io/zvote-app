import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation'


import { TextField } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const proposalTypesLabels = {
    "vsu": "Voting Systems Update",
    "psu": "Proposers Update",
    "daou": "Settings Update",
    "default": "Default"
};

const proposalStatusLabels = {
    "pending": "Pending",
    "accepted": "Accepted",
    "rejected": "Rejected"
};

const TableRow = ({ proposal, index }) => {
    const router = useRouter();

    return (
        <tr className="mt-5 cursor-pointer hover:bg-[#fafafa] transition-all" onClick={() => router.push(`/dashboard/dao/${proposal.dao_id}/proposal/${proposal.proposal_id}`)}>
            <style global jsx>{`
                .MuiInputBase-input{
                    padding: 5px!important;
                    padding-right: 25px!important;
                }
            `}</style>
            <td className="text-[18px] py-3 ">{proposal.proposal_id.slice(0, 10)}...</td>
            <td className="text-[18px] py-3 ">{proposalTypesLabels?.[proposal.type]}</td>
            <td className="text-[18px] py-3 ">
                <div className="flex items-center text-[16px] font-bold text-[#0C0B3F] vs_params_container">
                    <TextField
                        className="mt-[8px]"
                        variant="outlined"
                        value={proposal.content.value_str}
                        fullWidth
                        margin="normal"
                        id={"proposalContent_" + index}
                        disabled={true}
                    />
                    <div className="link-copy copyInput" style={{ transform: "translate(-20px, 0px)" }}>
                        <button
                            onClick={
                                (e) => {
                                    e.stopPropagation();
                                    e.nativeEvent.stopImmediatePropagation();
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
            <td className="text-[18px] py-3 text-center">&nbsp;&nbsp;&nbsp;&nbsp;</td>
            <td className="py-3">
                <div className="flex flex-start">
                    <div
                        className={"w-[100px] text-center leading-normal text-[12px] font-bold border rounded-full px-3 py-0.5 "
                            + `
                                ${proposal.status === "pending" && "bg-[#F5F5F5] !border-[#D1D1D1] text-[#7D7D7D]"}
                                ${proposal.status === "accepted" && "bg-[#E6F4EA] !border-[#A4D4AE] text-[#4A8E59]"}
                                ${proposal.status === "rejected" && "bg-[#FDE8E8] !border-[#F5A6A6] text-[#D95757]"}
                            `
                        }
                    >
                        {proposalStatusLabels?.[proposal.status]}
                    </div>
                </div>
            </td>
        </tr >
    );
};


export function ProposalsPage({ dao, setStatusFilter, statusFilter }) {
    const [activeTab, setActiveTab] = useState("all");

    const proposals = dao.proposals
        .filter(
            proposal => (activeTab === "all" || proposal.type === activeTab)
        )
        .filter(
            (proposal) => (statusFilter === "all" || proposal.status === statusFilter)
        )
        ;
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
                                    <th className="pb-4">&nbsp;&nbsp;&nbsp;&nbsp;</th>
                                    <th className="pb-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="mt-5">
                                {
                                    proposals
                                        .map(
                                            (proposal, index) => (
                                                <TableRow proposal={proposal} index={index} />
                                            )
                                        )
                                }
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



export function ProposalsFilters({ statusFilter, setStatusFilter, userCanCreateProposals, onNewProposalClicked }) {
    return (
        <>
            <div className="flex gap-11 items-center">
                <div className="bg-[#E5E6ED] p-[4px] rounded-[10px]">
                    <button
                        onClick={() => setStatusFilter("all")}
                        type="button"
                        className={`px-[28px] py-1 text-[14px] font-medium rounded-[10px] ${statusFilter === "all" ? `bg-white` : `text-[#5F5F5F]`
                            }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setStatusFilter("pending")}
                        type="button"
                        className={`px-[28px] py-1 text-[14px] font-medium rounded-[10px] ${statusFilter === "pending" ? `bg-white` : `text-[#5F5F5F]`
                            }`}
                    >
                        {proposalStatusLabels["pending"]}
                    </button>
                    <button
                        onClick={() => setStatusFilter("accepted")}
                        type="button"
                        className={`px-[28px] py-1 text-[14px] font-medium rounded-[10px] ${statusFilter === "accepted" ? `bg-white` : `text-[#5F5F5F]`
                            }`}
                    >
                        {proposalStatusLabels["accepted"]}
                    </button>
                    <button
                        onClick={() => setStatusFilter("rejected")}
                        type="button"
                        className={`px-[28px] py-1 text-[14px] font-medium rounded-[10px] ${statusFilter === "rejected" ? `bg-white` : `text-[#5F5F5F]`
                            }`}
                    >
                        {proposalStatusLabels["rejected"]}
                    </button>
                </div>
                <div className="">
                    {userCanCreateProposals && (
                        <button type="button" onClick={onNewProposalClicked}>
                            <div className="text-[#0C0B3F] text-[12px] font-extrabold flex items-center gap-2 bg-white rounded-[15px] px-3 py-2 border border-[#D5D5D5]">
                                <span className="text-[36px]">+</span>
                                New proposal
                            </div>
                        </button>
                    )}
                    {!userCanCreateProposals && (
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