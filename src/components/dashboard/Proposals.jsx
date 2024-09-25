import React, { useState } from "react";
import Link from "next/link";

const TableRow = () => {
    return (
        <tr className="mt-5">
            <td className="text-[18px] pt-3 ">Create Gouv...</td>
            <td className="text-[18px] pt-3 ">10/250</td>
            <td className="pt-3">
                <div className="flex flex-start">
                    <div className="leading-normal text-[#8A8A8A] text-[12px] font-bold border border-[#ADADAD] rounded-full px-3 py-0.5 bg-[#ECECEC]">
                        Accepted
                    </div>
                </div>
            </td>
            <td className="text-[18px] pt-3 ">Standard</td>
            <td className="text-[18px] pt-3 text-[#959595]">04/09/25</td>
        </tr>
    );
};

export function ProposalsPage() {
    const [activeTab, setActiveTab] = useState("all");
    return (
        <>
            <div className="grid grid-cols-4 gap-[32px] mt-[18px] text-[#0C0B3F]">
                <div className="col-span-1">
                    <div className="py-[25px] px-[35px] bg-white rounded-[15px] border border-[#D5D5D5]">

                        <ul className="flex flex-col gap-4 mt-4 text-[18px] font-medium">
                            <li>
                                <Link href="#" className={activeTab === "all" ? "font-black" : ""} onClick={() => setActiveTab("all")}>All Proposals</Link>
                            </li>
                            <li>
                                <Link href="#" className={activeTab === "vsu" ? "font-black" : ""} onClick={() => setActiveTab("vsu")}>Voting Systems Update</Link>
                            </li>
                            <li>
                                <Link href="#" className={activeTab === "psu" ? "font-black" : ""} onClick={() => setActiveTab("psu")}>Proposers Update</Link>
                            </li>
                            <li>
                                <Link href="#" className={activeTab === "stu" ? "font-black" : ""} onClick={() => setActiveTab("stu")}>Settings Update</Link>
                            </li>
                            <li>
                                <Link href="#" className={activeTab === "other" ? "font-black" : ""} onClick={() => setActiveTab("other")}>Other Proposals</Link>
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
                                    <th className="pb-4">For Votes/Quorum</th>
                                    <th className="pb-4">Status</th>
                                    <th className="pb-4">Type</th>
                                    <th className="pb-4">Created At</th>
                                </tr>
                            </thead>
                            <tbody className="mt-5">
                                <div
                                    style={{
                                        color: "grey",
                                        marginTop: "15px"
                                    }}
                                >Incoming...</div>
                                {false && (<>
                                    <TableRow />
                                    <TableRow />
                                    <TableRow />
                                </>)
                                }
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