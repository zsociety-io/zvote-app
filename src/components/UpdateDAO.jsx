import React, { useEffect } from 'react';

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
} from '@mui/material';

import Image from "next/image";

import { ZERO_ADDRESS, programIdToAddress, hashStruct, loadProgramAddresses } from "../lib/aleo/front.js";

import swal from 'sweetalert';

import { ThemeProvider, createTheme } from '@mui/material/styles';

import { useWallet } from '@demox-labs/aleo-wallet-adapter-react';


import useState from 'react-usestateref'


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


const UpdateDAO = ({
    defaultSettings,
    setIsUpdateLoading,
    refIsUpdateLoading,
    setIsUpdateEdited,
    updateDaoParamsRef,
    disableUpdates
}) => {
    defaultSettings = defaultSettings || undefined;
    const { requestTransaction, publicKey } = useWallet();
    const [canVSUpdateList, setCanVSUpdateList] = useState('noone');
    const [creatorType, setCreatorType] = useState('anyone');
    const [canUpdateDao, setCanUpdateDao] = useState('noone');
    const [governanceTokenID, setGovernanceTokenID] = useState(null);
    const [proposersUpdater, setProposersUpdater] = useState('admin');
    const [proposersAdmin, setProposersAdmin] = useState(null);
    const [daoAdmin, setDaoAdmin] = useState(null);
    const [vsAdmin, setVsAdmin] = useState(null);

    const [replacedDefaultForm, setReplacedDefaultForm, refReplacedDefaultForm] = useState(false);

    useEffect(
        () => {
            const setUpdateDaoRef = async () => {
                await loadProgramAddresses([
                    process.env.NEXT_PUBLIC_DAOMU_DAO_BASED_AP_PROGRAM_ID,
                    process.env.NEXT_PUBLIC_DAOMU_DAO_BASED_NA_PROGRAM_ID,
                    process.env.NEXT_PUBLIC_VSM_DAO_BASED_NAR_PROGRAM_ID,
                    process.env.NEXT_PUBLIC_VSM_DAO_BASED_APL_PROGRAM_ID,
                    process.env.NEXT_PUBLIC_PSM_DAO_BASED_PROGRAM_ID
                ]);

                const dao_manager = (creatorType === 'anyone') ?
                    process.env.NEXT_PUBLIC_DAOM_NAR_PROGRAM_ID
                    :
                    process.env.NEXT_PUBLIC_DAOM_APL_PROGRAM_ID
                    ;

                const dao_manager_updater = (canUpdateDao === 'noone') ?
                    ZERO_ADDRESS :
                    (canUpdateDao === 'admin') ?
                        daoAdmin :
                        await programIdToAddress(
                            (creatorType === 'anyone') ?
                                process.env.NEXT_PUBLIC_DAOMU_DAO_BASED_NA_PROGRAM_ID :
                                process.env.NEXT_PUBLIC_DAOMU_DAO_BASED_AP_PROGRAM_ID
                        )
                    ;
                const voting_system_manager = (canVSUpdateList === 'noone') ?
                    ZERO_ADDRESS :
                    (canVSUpdateList === 'admin') ?
                        vsAdmin :
                        (creatorType === 'anyone') ?
                            await programIdToAddress(
                                process.env.NEXT_PUBLIC_VSM_DAO_BASED_NAR_PROGRAM_ID
                            ) :
                            await programIdToAddress(
                                process.env.NEXT_PUBLIC_VSM_DAO_BASED_APL_PROGRAM_ID
                            )
                    ;
                const proposers_manager = (creatorType === 'anyone') ?
                    null :
                    (proposersUpdater === "admin") ?
                        proposersAdmin :
                        await programIdToAddress(
                            process.env.NEXT_PUBLIC_PSM_DAO_BASED_PROGRAM_ID
                        );
                updateDaoParamsRef.current = {
                    dao_manager,
                    dao_manager_updater,
                    voting_system_manager,
                    proposers_manager,
                    token_id: governanceTokenID
                };
            }
            setUpdateDaoRef();
        }
        ,
        [updateDaoParamsRef, creatorType, proposersUpdater, canUpdateDao, daoAdmin, canVSUpdateList, vsAdmin, proposersAdmin]
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (refIsUpdateLoading?.current) {
            return;
        }
        setIsUpdateLoading(true);
        try {
            swal("Success", "DAO transaction was just submitted, check your wallet history.", "success");
            setIsUpdateLoading(false);
        } catch (e) {
            setIsUpdateLoading(false);
            await swal("Error", (e.message || e) + "", "error");
        }
    };

    useEffect(() => {
        if (defaultSettings && (disableUpdates || !refReplacedDefaultForm?.current)) {
            setCanVSUpdateList(defaultSettings.canVSUpdateList || 'noone');
            setCreatorType(defaultSettings.creatorType || 'anyone');
            setCanUpdateDao(defaultSettings.canUpdateDao || 'noone');
            setGovernanceTokenID(defaultSettings.governanceTokenID);
            setProposersUpdater(defaultSettings.proposersUpdater || 'admin');
            setProposersAdmin(defaultSettings.proposersAdmin);
            setDaoAdmin(defaultSettings.daoAdmin);
            setVsAdmin(defaultSettings.vsAdmin);
            setReplacedDefaultForm(true);
        }
    }, [defaultSettings]);

    useEffect(() => {
        const formEdited = (
            refReplacedDefaultForm?.current && (
                defaultSettings?.canVSUpdateList !== canVSUpdateList ||
                defaultSettings?.creatorType !== creatorType ||
                defaultSettings?.canUpdateDao !== canUpdateDao ||
                defaultSettings?.governanceTokenID !== governanceTokenID ||
                defaultSettings?.proposersUpdater !== proposersUpdater ||
                defaultSettings?.proposersAdmin !== proposersAdmin ||
                defaultSettings?.daoAdmin !== daoAdmin ||
                defaultSettings?.vsAdmin !== vsAdmin
            )
        );
        if (!disableUpdates) {
            setIsUpdateEdited(formEdited);
        }
    }, [
        canVSUpdateList,
        creatorType,
        canUpdateDao,
        governanceTokenID,
        proposersUpdater,
        proposersAdmin,
        daoAdmin,
        vsAdmin,
        defaultSettings,
        setIsUpdateEdited
    ]);
    const canUpdateDaoSettings = !disableUpdates && publicKey != null && (
        (defaultSettings?.daoAdmin === publicKey)
        || (defaultSettings?.canUpdateDao === "vote")
    );
    return (
        <ThemeProvider theme={theme}>
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
            <Container maxWidth="sm" sx={{ mt: 4 }} className="flex flex-col justify-between min-h-[444px]  bg-white mt-[18px] rounded-[15px] p-[35px] border border-[#D5D5D5] max-w-none">
                <Grow in timeout={500}>
                    <Box component="form" onSubmit={handleSubmit} sx={{ p: 4, border: '1px solid #ddd', borderRadius: 2 }}>
                        {/* 1. Proposal Creation Control */}
                        <FormControl fullWidth margin="normal" className="border-none">
                            <FormLabel>1. Who can create proposals?</FormLabel>
                            <RadioGroup value={creatorType} onChange={(e) => setCreatorType(e.target.value)} >
                                <FormControlLabel value="anyone" control={<Radio />} label="Anyone" disabled={!canUpdateDaoSettings} />
                                <FormControlLabel value="definedList" control={<Radio />} label="A defined list of users" disabled={!canUpdateDaoSettings} />
                            </RadioGroup>
                            {creatorType === 'definedList' && (
                                <>
                                    <TextField
                                        margin="normal"
                                        label="Who can update this list?"
                                        select
                                        SelectProps={{ native: true }}
                                        variant="outlined"
                                        fullWidth
                                        value={proposersUpdater}
                                        onChange={(e) => {
                                            setProposersUpdater(e.target.value)
                                        }}
                                        disabled={!canUpdateDaoSettings}
                                        required
                                    >
                                        <option value="admin">Admin</option>
                                        <option value="vote">Members (Vote)</option>
                                    </TextField>
                                    {
                                        proposersUpdater === "admin"
                                        && (
                                            <TextField
                                                label="Admin address"
                                                variant="outlined"
                                                value={proposersAdmin}
                                                onChange={(e) => setProposersAdmin(e.target.value)}
                                                fullWidth
                                                margin="normal"
                                                required
                                                disabled={!canUpdateDaoSettings}
                                            />
                                        )
                                    }
                                </>
                            )}
                        </FormControl>

                        {/* 2. Update Voting System List Control */}
                        <FormControl fullWidth margin="normal">
                            <FormLabel>2. Who can update voting system list?</FormLabel>
                            <RadioGroup value={canVSUpdateList} onChange={(e) => setCanVSUpdateList(e.target.value)}>
                                <FormControlLabel value="noone" control={<Radio />} label="No one" disabled={!canUpdateDaoSettings} />
                                <FormControlLabel value="admin" control={<Radio />} label="Admin" disabled={!canUpdateDaoSettings} />
                                <FormControlLabel value="vote" control={<Radio />} label="Members (Vote)" disabled={!canUpdateDaoSettings} />
                            </RadioGroup>
                            {
                                canVSUpdateList === "admin" && (
                                    <TextField
                                        label="Admin address"
                                        variant="outlined"
                                        value={vsAdmin}
                                        onChange={(e) => setVsAdmin(e.target.value)}
                                        fullWidth
                                        margin="normal"
                                        required
                                        disabled={!canUpdateDaoSettings}
                                    />
                                )
                            }
                        </FormControl>

                        {/* 3. Update Voting System List Control */}
                        <FormControl fullWidth margin="normal">
                            <FormLabel>3. Who can update these settings?</FormLabel>
                            <RadioGroup value={canUpdateDao} onChange={(e) => setCanUpdateDao(e.target.value)}>
                                <FormControlLabel value="noone" control={<Radio />} label="No one" disabled={!canUpdateDaoSettings} />
                                <FormControlLabel value="admin" control={<Radio />} label="Admin" disabled={!canUpdateDaoSettings} />
                                <FormControlLabel value="vote" control={<Radio />} label="Members (Vote)" disabled={!canUpdateDaoSettings} />
                            </RadioGroup>

                            {
                                canUpdateDao === "admin" && (
                                    <TextField
                                        label="Admin address"
                                        variant="outlined"
                                        value={daoAdmin}
                                        onChange={(e) => setDaoAdmin(e.target.value)}
                                        fullWidth
                                        margin="normal"
                                        required
                                        disabled={!canUpdateDaoSettings}
                                    />
                                )
                            }
                        </FormControl>

                        {/* 4. DAO Token ID */}
                        <FormControl fullWidth margin="normal">
                            <FormLabel>4. DAO Token ID</FormLabel>
                            <TextField
                                label={disableUpdates ? "" : "1...12field"}
                                variant="outlined"
                                value={governanceTokenID}
                                onChange={(e) => setGovernanceTokenID(e.target.value)}
                                fullWidth
                                margin="normal"
                                required
                                disabled={!canUpdateDaoSettings}
                            />
                        </FormControl>


                        {/* Submit Button 
                        <Button style={{ borderRadius: "50px" }} type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                            {isUpdateLoading ? (<Image width={20} src={require("../img/loader-loading.gif").default} alt="wallet" id="wallet_img" />) : "Update"}
                        </Button>
                        */}
                    </Box>
                </Grow>
            </Container>
        </ThemeProvider>
    );
}


export default UpdateDAO;
