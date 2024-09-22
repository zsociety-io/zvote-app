
const TableItem = ({ name, ...props }) => {
    return (
        <div {...props} className="flex justify-between">
            <div className="flex items-center text-[22px] font-bold text-[#0C0B3F] gap-2">
                {name} <img src="/redirect_icon.svg" />
            </div>
            <img src="/trash-bin.svg" alt="" />
        </div>
    );
};

export function DaoCorePage() {
    return (
        <>
            <div className="grid grid-cols-2 gap-[85px] mt-[54px]">
                {/* Left */}
                <div className="col-span-1">
                    <div className="flex justify-between">
                        <h2 className="text-[28px] font-medium text-[#0C0B3F]">
                            Voting Systems
                        </h2>
                        <button type="button">
                            <div className="text-[#0C0B3F] text-[12px] font-extrabold flex items-center gap-2 bg-white rounded-[15px] px-3 py-2 border border-[#D5D5D5]">
                                <span className="text-[36px]">+</span>
                                Add Voting System
                            </div>
                        </button>
                    </div>
                    <div className="flex flex-col justify-between min-h-[444px]  bg-white mt-[18px] rounded-[15px] p-[35px] border border-[#D5D5D5]">
                        <div className="flex flex-col gap-[37px]">
                            <TableItem name="first_past_the_post.aleo" />
                            <TableItem name="first_past_the_post.aleo" />
                        </div>

                        <div className="flex justify-center gap-4 text-[22px]">
                            <div className="">1</div>
                            <div className="">2</div>
                            <div className="">...</div>
                            <div className="">11</div>
                        </div>
                    </div>
                </div>

                {/* Right */}
                <div className="col-span-1">
                    <div className="flex justify-between">
                        <h2 className="text-[28px] font-medium text-[#0C0B3F]">
                            Allowed Proposers
                        </h2>
                        <button type="button">
                            <div className="text-[#0C0B3F] text-[12px] font-extrabold flex items-center gap-2 bg-white rounded-[15px] px-3 py-2 border border-[#D5D5D5]">
                                <span className="text-[36px]">+</span>
                                Add proposer
                            </div>
                        </button>
                    </div>
                    <div className="flex flex-col justify-between min-h-[444px]  bg-white mt-[18px] rounded-[15px] p-[35px] border border-[#D5D5D5]">
                        <div className="flex flex-col gap-[37px]">
                            <TableItem name="aleo1...192s929feza30a21" />
                            <TableItem name="aleo1...192s929feza30a21" />
                        </div>

                        <div className="flex justify-center gap-4 text-[22px]">
                            <div className="">1</div>
                            <div className="">2</div>
                            <div className="">...</div>
                            <div className="">11</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}