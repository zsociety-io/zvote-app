import UpdateDAO from "@/components/UpdateDAO"
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import useState from 'react-usestateref'
import { useRef, useEffect } from "react"
import Image from "next/image";
import { ZERO_ADDRESS } from "@/lib/aleo/front";
import swal from "sweetalert";

import { createApproveProposal, addApprovedProposer, addVotingSystem } from "@/lib/adapter/dashboard"

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


const ProposerModal = ({ inputProposer, setInputProposer, isOpen, onClose, onSubmit, }) => {
    const modalRef = useRef(null);  // Reference to the modal content

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();  // Close modal if clicked outside of the modal content
            }
        };

        // Add event listener when the modal is open
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        // Cleanup event listener when the modal is closed
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div ref={modalRef} className="bg-white p-6 rounded-lg shadow-lg">
                <ThemeProvider theme={theme}>
                    <Container>
                        <h1>Add Proposer</h1>
                        <FormControl fullWidth margin="normal">
                            <FormLabel>Proposer Address</FormLabel>
                            <TextField
                                label="ie: aleo1..."
                                variant="outlined"
                                value={inputProposer}
                                onChange={(e) => setInputProposer(e.target.value)}
                                fullWidth
                                margin="normal"
                                name="address"
                                required
                            />
                        </FormControl>
                        <Button onClick={onSubmit} style={{ padding: "4px", borderRadius: "50px", background: "#0a093d", color: "#ffffff", fontSize: "14px" }} type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                            {"Add"}
                        </Button>
                    </Container>
                </ThemeProvider>
            </div>
        </div >
    );
};


const VotingSystemModal = ({ inputVS, setInputVS, inputVSParams, setInputVSParams, isOpen, onClose, onSubmit, }) => {
    const modalRef = useRef(null);  // Reference to the modal content

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();  // Close modal if clicked outside of the modal content
            }
        };

        // Add event listener when the modal is open
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        // Cleanup event listener when the modal is closed
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div ref={modalRef} className="bg-white p-6 rounded-lg shadow-lg">
                <ThemeProvider theme={theme}>
                    <Container>
                        <h1>Add Voting System</h1>
                        <FormControl fullWidth margin="normal">
                            <FormLabel>Program ID</FormLabel>
                            <TextField
                                label="ie: voting_system.aleo"
                                variant="outlined"
                                value={inputVS}
                                onChange={(e) => setInputVS(e.target.value)}
                                fullWidth
                                margin="normal"
                                name="address"
                                required
                            />
                            <FormLabel>Parameters Struct</FormLabel>
                            <TextField
                                label="ie: { quorum: 1000u128 }"
                                variant="outlined"
                                value={inputVSParams}
                                onChange={(e) => setInputVSParams(e.target.value)}
                                fullWidth
                                margin="normal"
                                name="address"
                                required
                            />
                        </FormControl>
                        <Button onClick={onSubmit} style={{ padding: "4px", borderRadius: "50px", background: "#0a093d", color: "#ffffff", fontSize: "14px" }} type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                            {"Add"}
                        </Button>
                    </Container>
                </ThemeProvider>
            </div>
        </div >
    );
};

const TableItem = ({ name, index, userCanAddProposers, onTrashClicked, canTrash, ...props }) => {
    const isVs = (props.paramsStr != null);
    return (
        <div {...props} className="flex justify-between w-full" index={index}>
            <div className="flex items-center text-[16px] font-bold text-[#0C0B3F] gap-2">
                <a
                    target="_blank"
                    className="contents !hover:underline"
                    href={
                        name.endsWith(".aleo") ?
                            `${process.env.NEXT_PUBLIC_EXPLORER_URL}/program?id=${name}` :
                            `${process.env.NEXT_PUBLIC_EXPLORER_URL}/address?a=${name}`
                    }
                >
                    {
                        name.substring(0, 30) + (name.length > 30
                            ? '...'
                            : ''
                        )
                    } <Image width={15} src={require("@/img/redirect_icon.svg").default} alt="link" />
                </a>
            </div>
            {
                isVs && (
                    <div className="flex items-center text-[16px] font-bold text-[#0C0B3F] vs_params_container">
                        <TextField
                            style={{ height: "35px !important" }}
                            label="Parameters "
                            variant="outlined"
                            value={props.paramsStr}
                            fullWidth
                            margin="normal"
                            id={"votingSystemParams_" + index}
                            disabled={true}
                        />
                        <div className="link-copy copyInput" style={{ transform: "translate(-20px, 5px)" }}>
                            <button
                                onClick={
                                    (e) => {
                                        const tempInput = document.createElement("input");
                                        tempInput.value = document.getElementById("votingSystemParams_" + index).value;
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
                )
            }
            {
                canTrash && <a
                    target="_blank"
                    className="contents !hover:underline cursor-pointer"
                    onClick={onTrashClicked}
                >
                    <Image width={20} src={require("@/img/trash-bin.svg").default} alt="delete" />
                </a>
            }
            {
                !canTrash && <a
                    target="_blank"
                    className="contents !hover:underline"
                    onClick={onTrashClicked}
                >
                    <Image width={20} src={require("@/img/trash-bin-grey.svg").default} alt="delete" />
                </a>
            }
        </div>
    );
};

const settingsFromDao = (dao, publicKey) => {
    console.log(dao)
    const daom = dao?.dao_manager;
    const creatorType = (
        (daom?.program_id === process.env.NEXT_PUBLIC_DAOM_NAR_PROGRAM_ID) ?
            "anyoone" :
            (daom?.program_id === process.env.NEXT_PUBLIC_DAOM_APL_PROGRAM_ID) ?
                "definedList" :
                daom?.program_id || daom?.address
    );
    const proposersUpdater = (
        (daom?.proposers_manager?.address === process.env.NEXT_PUBLIC_PSM_DAO_BASED_PROGRAM_ID) ?
            "vote" :
            "admin"
    );
    const canVSUpdateList = (
        (daom?.voting_system_manager?.address === ZERO_ADDRESS) ?
            'noone' :
            ([
                process.env.NEXT_PUBLIC_VSM_DAO_BASED_NAR_PROGRAM_ID,
                process.env.NEXT_PUBLIC_VSM_DAO_BASED_APL_PROGRAM_ID
            ]).includes(daom?.voting_system_manager?.program_id) ?
                'vote' :
                'admin'
    );
    const canUpdateDao = (
        (daom?.dao_manager_updater.address === ZERO_ADDRESS) ?
            'noone' :
            (daom?.dao_manager_updater.program_id === process.env.NEXT_PUBLIC_DAOMU_DAO_BASED_PROGRAM_ID) ?
                'vote' :
                'admin'
    );
    const proposersAdmin = (proposersUpdater === "admin") ?
        daom?.proposers_manager.address :
        null
    const vsAdmin = (canVSUpdateList === "admin") ?
        daom?.voting_system_manager.address :
        null;
    const daoAdmin = (canUpdateDao === "admin") ?
        daom?.dao_manager_updater.address :
        null;
    const governanceTokenID = dao?.token_id;
    return {
        creatorType,
        proposersUpdater,
        canVSUpdateList,
        canUpdateDao,
        governanceTokenID,
        proposersAdmin,
        vsAdmin,
        daoAdmin,
    };
}


export function DaoCorePage({ dao }) {
    const { publicKey, requestTransaction, requestBulkTransactions } = useWallet();
    const daoSettings = settingsFromDao(dao, publicKey);

    const [isUpdateLoading, setIsUpdateLoading, refIsUpdateLoading] = useState(false);
    const [isUpdateEdited, setIsUpdateEdited, refIsUpdateEdited] = useState(false);
    const [inputVS, setInputVS] = useState("");
    const [inputVSParams, setInputVSParams] = useState("");
    const [inputProposer, setInputProposer] = useState("");

    const [isVSModalOpen, setIsVSModalOpen] = useState(false);  // Modal state
    const [isProposerModalOpen, setIsProposerModalOpen] = useState(false);  // Modal state

    const userIsProposersAdmin = daoSettings?.proposersAdmin === publicKey && publicKey != null;
    const userCanAddProposers = (userIsProposersAdmin || daoSettings?.proposersUpdater === "vote");

    const userIsVsAdmin = daoSettings?.vsAdmin === publicKey && publicKey != null;
    const userCanAddVs = (userIsVsAdmin || daoSettings?.canVSUpdateList === "vote");

    const addProposer = async (addOrRemove, proposer) => {
        if (!userCanAddProposers) {
            return
        }
        try {
            if (userIsProposersAdmin) {
                await addApprovedProposer(
                    publicKey,
                    requestTransaction,
                    dao.dao_id,
                    addOrRemove ? inputProposer : proposer,
                    addOrRemove
                );
            } else {
                //await createApproveProposal();
            }
        } catch (e) {
            await swal("Error", (e.message || e) + "", "error");
        }
    }

    const addVS = async (addOrRemove, vs, vsParams) => {
        if (!userCanAddVs) {
            return
        }
        if (userIsVsAdmin) {
            const votingSystemManager = dao?.dao_manager?.voting_system_manager?.program_id;

            await addVotingSystem(
                publicKey,
                requestBulkTransactions,
                votingSystemManager,
                dao.dao_id,
                addOrRemove ? inputVS : vs,
                addOrRemove ? inputVSParams : vsParams,
                addOrRemove
            );

        } else {
            //await createApproveProposal();
        }
    }


    const handleVSModalSubmit = () => {
        addVS(true);
        setIsVSModalOpen(false);  // Close modal after submission
    };
    const handleProposerModalSubmit = () => {
        addProposer(true);
        setIsProposerModalOpen(false);  // Close modal after submission
    };

    return (
        <>
            <style global jsx>{`
                .swal-button--confirm{
                    background-color: black!important;
                    font-size: 14px!important;
                    color: white!important;
                    padding-top: 5px!important;
                    padding-bottom: 5px!important;
                    padding-right: 20px!important;
                    padding-left: 20px!important;
                }
                .vs_params_container .MuiInputBase-root {
                        height: 35px !important;
                }
            `}</style>
            <div className="grid grid-cols-2 gap-[85px] mt-[22px]">
                {/* Left */}
                <div className="col-span-1">
                    <div className="flex justify-between">
                        <h2 className="text-[28px] font-medium text-[#0C0B3F]">
                            DAO Settings
                        </h2>
                        <button type="button">
                            {isUpdateLoading && (
                                <div className="text-[#0C0B3F] text-[12px] font-extrabold flex items-center gap-2 bg-white rounded-[15px] px-3 py-2 border border-[#D5D5D5]">
                                    <Image width={20} src={require("@/img/loader-loading.gif").default} alt="wallet" id="wallet_img" />
                                    Loading
                                </div>
                            )}
                            {!isUpdateLoading && refIsUpdateEdited.current && (
                                <div className="text-[#0C0B3F] text-[12px] font-extrabold flex items-center gap-2 bg-white rounded-[15px] px-3 py-2 border border-[#D5D5D5]">
                                    <span className="text-[36px]"> <Image width={20} src={require("@/img/save.svg").default} alt="link" /></span>
                                    Update Settings
                                </div>
                            )}
                            {!isUpdateLoading && !refIsUpdateEdited.current && (
                                <div className="cursor-default text-[#858585] text-[12px] font-extrabold flex items-center gap-2 !bg-[#E5E6ED] rounded-[15px] px-3 py-2 border border-[#D5D5D5]">
                                    <span className="text-[36px]"> <Image width={20} src={require("@/img/save-grey.svg").default} alt="link" /></span>
                                    Update Settings
                                </div>
                            )}
                        </button>
                    </div>
                    <UpdateDAO
                        isUpdateLoading={isUpdateLoading}
                        setIsUpdateLoading={setIsUpdateLoading}
                        defaultSettings={daoSettings}
                        setIsUpdateEdited={setIsUpdateEdited}
                    />
                </div>

                {/* Right */}
                <div className="col-span-1">
                    <div className="flex justify-between">
                        <h2 className="text-[28px] font-medium text-[#0C0B3F]">
                            Voting Systems
                        </h2>
                        {userCanAddVs && (
                            <button type="button" onClick={() => setIsVSModalOpen(true)}>
                                <div className="text-[#0C0B3F] text-[12px] font-extrabold flex items-center gap-2 bg-white rounded-[15px] px-3 py-2 border border-[#D5D5D5]">
                                    <span className="text-[36px]">+</span>
                                    Add Voting System
                                </div>
                            </button>
                        )}
                        {!userCanAddVs && (
                            <div className="cursor-default text-[#858585] text-[12px] font-extrabold flex items-center gap-2 !bg-[#E5E6ED] rounded-[15px] px-3 py-2 border border-[#D5D5D5]">
                                <span className="text-[36px]">+</span>
                                Add Voting System
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col justify-between min-h-[444px]  bg-white mt-[18px] rounded-[15px] p-[35px] border border-[#D5D5D5]">
                        <div className="flex flex-col gap-[37px]">
                            {
                                dao.voting_systems.map(
                                    (voting_system, index) => {
                                        return <TableItem
                                            paramsStr={voting_system?.paramsStr}
                                            name={voting_system.program_id || voting_system.address}
                                            index={index}
                                            canTrash={userCanAddVs}
                                            onTrashClicked={
                                                () => addVS(false)
                                            } />
                                    }
                                )
                            }
                            {!dao.voting_systems?.length
                                && <div
                                    className="flex justify-center gap-4 text-[18px] text-[#a8aaad]"
                                    style={{ color: "#a8aaad", width: "fit-content", textAlign: "center" }}
                                >
                                    <div className="">No voting system for this DAO yet. Add one first.</div>
                                </div>
                            }
                        </div>

                        <div className="flex justify-center gap-4 text-[18px]">
                            <div className="">1</div>
                        </div>
                    </div>

                    {/* Move "Allowed Proposers" block under "Voting Systems" */}
                    {(daoSettings?.creatorType === "definedList") && <div className="mt-[54px]">
                        <div className="flex justify-between">
                            <h2 className="text-[28px] font-medium text-[#0C0B3F]">
                                Allowed Proposers
                            </h2>

                            {userCanAddProposers && (
                                <button type="button" onClick={() => setIsProposerModalOpen(true)}>
                                    <div className="text-[#0C0B3F] text-[12px] font-extrabold flex items-center gap-2 bg-white rounded-[15px] px-3 py-2 border border-[#D5D5D5]">
                                        <span className="text-[36px]">+</span>
                                        Add proposer
                                    </div>
                                </button>
                            )}
                            {!userCanAddProposers && (
                                <div className="cursor-default text-[#858585] text-[12px] font-extrabold flex items-center gap-2 !bg-[#E5E6ED] rounded-[15px] px-3 py-2 border border-[#D5D5D5]">
                                    <span className="text-[36px]">+</span>
                                    Add proposer
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col justify-between min-h-[444px] bg-white mt-[18px] rounded-[15px] p-[35px] border border-[#D5D5D5]">
                            <div className="flex flex-col gap-[37px]" style={{ alignItems: "center" }}>
                                {
                                    dao?.dao_manager?.proposers && dao?.dao_manager?.proposers.map(
                                        (proposer, index) => {
                                            return <TableItem address={proposer.address} name={proposer.address} index={index} userCanAddProposers={userCanAddProposers} onTrashClicked={
                                                () => addProposer(false, proposer.address)
                                            } canTrash={userCanAddProposers} />
                                        }
                                    )
                                }
                                {!dao?.dao_manager?.proposers?.length
                                    && <div
                                        className="flex justify-center gap-4 text-[18px] text-[#a8aaad]"
                                        style={{ color: "#a8aaad", width: "fit-content", textAlign: "center" }}
                                    >
                                        <div className="">No one is allowed to make proposals yet. Add a proposer first.</div>
                                    </div>
                                }
                            </div>
                            <div className="flex justify-center gap-4 text-[18px]">
                                <div className="">1</div>
                            </div>
                        </div>
                    </div>}
                </div>
            </div>
            <VotingSystemModal
                isOpen={isVSModalOpen}
                onClose={() => setIsVSModalOpen(false)}
                onSubmit={handleVSModalSubmit}
                inputVS={inputVS}
                setInputVS={setInputVS}
                inputVSParams={inputVSParams}
                setInputVSParams={setInputVSParams}
            />
            <ProposerModal
                isOpen={isProposerModalOpen}
                onClose={() => setIsProposerModalOpen(false)}
                onSubmit={handleProposerModalSubmit}
                inputProposer={inputProposer}
                setInputProposer={setInputProposer}
            />
        </>
    );
}
