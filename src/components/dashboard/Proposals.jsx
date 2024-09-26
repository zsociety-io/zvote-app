import React, { useState } from "react";
import Link from "next/link";


const proposalTypesLabels = {
    "vsu": "Voting Systems Update",
    "psu": "Proposers Update",
    "daou": "Settings Update",
    "default": "Default"
};

const TableRow = ({ proposal }) => {
    return (
        <tr className="mt-5">
            <td className="text-[18px] pt-3 ">Create Gouv...</td>
            <td className="text-[18px] pt-3 ">{proposalTypesLabels?.[proposal.type]}</td>
            <td className="text-[18px] pt-3 text-[#959595]">04/09/25</td>
            <td className="pt-3">
                <div className="flex flex-start">
                    <div className="leading-normal text-[#8A8A8A] text-[12px] font-bold border border-[#ADADAD] rounded-full px-3 py-0.5 bg-[#ECECEC]">
                        Accepted
                    </div>
                </div>
            </td>
            <td className="text-[18px] pt-3 ">10/250</td>
        </tr>
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

export function ProposalsPage({ dao }) {
    const [activeTab, setActiveTab] = useState("all");

    const proposals = proposalToProposalData(dao.proposals);
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
                                    <th className="pb-4">Name</th>
                                    <th className="pb-4">Type</th>
                                    <th className="pb-4">Created At</th>
                                    <th className="pb-4">Status</th>
                                    <th className="pb-4">For Votes/Quorum</th>
                                </tr>
                            </thead>
                            <tbody className="mt-5">
                                {proposals.map((proposal) => (<TableRow proposal={proposal} />))}
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
                    <button type="button">
                        <div className="text-[#0C0B3F] text-[12px] font-extrabold flex items-center gap-2 bg-white rounded-[15px] px-3 py-2 border border-[#D5D5D5]">
                            <span className="text-[36px]">+</span>
                            New proposal
                        </div>
                    </button>
                </div>
            </div>
        </>
    );
}