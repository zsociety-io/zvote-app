import React from 'react';

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

import { ZERO_ADDRESS, programIdToAddress, hashStruct, loadProgramAddresses } from "../lib/aleo/front";

import { createDao } from "../lib/adapter/index.js"
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


const CreateDAO = (props) => {
    const { requestBulkTransactions, publicKey } = useWallet();
    const [quorum, setQuorum] = useState("");
    const [votingSystem, setVotingSystem] = useState('yesNo');
    const [votingSystemParams, setVotingSystemParams] = useState('');
    const [canVSUpdateList, setCanVSUpdateList] = useState('noone');
    const [creatorType, setCreatorType] = useState('anyone');
    const [canUpdateDao, setCanUpdateDao] = useState('noone');
    const [governanceTokenID, setGovernanceTokenID] = useState('');
    const [customVotingSystem, setCustomVotingSystem] = useState('');
    const [proposersUpdater, setProposersUpdater] = useState('admin');

    const [isCreateLoading, setIsCreateLoading, refIsCreateLoading] = useState(false);

    const handleVotingSystemChange = () => {
        if (votingSystem === 'yesNo') {
            setVotingSystem('custom');
            setQuorum('');
            setVotingSystemParams('');
        } else {
            setVotingSystem('yesNo');
            setCustomVotingSystem('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (refIsCreateLoading.current) {
            return;
        }
        setIsCreateLoading(true);
        try {
            await loadProgramAddresses([
                process.env.NEXT_PUBLIC_VS_2_CANDIDATES_PROGRAM_ID,
                process.env.NEXT_PUBLIC_DAOMU_DAO_BASED_AP_PROGRAM_ID,
                process.env.NEXT_PUBLIC_DAOMU_DAO_BASED_NA_PROGRAM_ID,
                process.env.NEXT_PUBLIC_VSM_DAO_BASED_NAR_PROGRAM_ID,
                process.env.NEXT_PUBLIC_VSM_DAO_BASED_APL_PROGRAM_ID,
                process.env.NEXT_PUBLIC_PSM_DAO_BASED_PROGRAM_ID
            ]);

            const voting_system_id =
                (votingSystem === "yesNo") ?
                    process.env.NEXT_PUBLIC_VS_2_CANDIDATES_PROGRAM_ID
                    :
                    customVotingSystem;
            const voting_system = await programIdToAddress(voting_system_id)
            const dao_manager_updater = (canUpdateDao === 'noone') ?
                ZERO_ADDRESS :
                (canUpdateDao === 'admin') ?
                    publicKey :
                    await programIdToAddress(
                        (creatorType === 'anyone') ?
                            process.env.NEXT_PUBLIC_DAOMU_DAO_BASED_NA_PROGRAM_ID :
                            process.env.NEXT_PUBLIC_DAOMU_DAO_BASED_AP_PROGRAM_ID
                    )
                ;
            const voting_system_manager = (canVSUpdateList === 'noone') ?
                ZERO_ADDRESS :
                (canVSUpdateList === 'admin') ?
                    publicKey :
                    (creatorType === 'anyone') ?
                        await programIdToAddress(
                            process.env.NEXT_PUBLIC_VSM_DAO_BASED_NAR_PROGRAM_ID
                        ) :
                        await programIdToAddress(
                            process.env.NEXT_PUBLIC_VSM_DAO_BASED_APL_PROGRAM_ID
                        )
                ;

            const voting_system_params = (votingSystem === "yesNo") ?
                `{quorum: ${quorum}u128}` :
                votingSystemParams;
            const proposers_manager = proposersUpdater === "admin" ?
                publicKey :
                await programIdToAddress(
                    process.env.NEXT_PUBLIC_PSM_DAO_BASED_PROGRAM_ID
                );
            await createDao(
                publicKey,
                governanceTokenID,
                requestBulkTransactions,
                voting_system,
                voting_system_params,
                await hashStruct(voting_system_params),
                dao_manager_updater,
                voting_system_manager,
                creatorType === "anyone",
                proposers_manager,
                voting_system_id
            );
            swal("Success", "DAO transaction was just submitted, check your wallet history.", "success");
            setQuorum("");
            setVotingSystem('yesNo');
            setVotingSystemParams('');
            setCanVSUpdateList('noone');
            setCreatorType('anyone');
            setCanUpdateDao('noone');
            setProposersUpdater('admin');
            setGovernanceTokenID('');
            setCustomVotingSystem('');
            setIsCreateLoading(false);
        } catch (e) {
            setIsCreateLoading(false);
            await swal("Error", (e.message || e) + "", "error");
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="sm" sx={{ mt: 4 }}>
                <Grow in timeout={500}>
                    <Box component="form" onSubmit={handleSubmit} sx={{ p: 4, border: '1px solid #ddd', borderRadius: 2 }}>
                        <h1>
                            Create a DAO
                        </h1>

                        {/* 1. Proposal Creation Control */}
                        <FormControl fullWidth margin="normal">
                            <FormLabel>1. Who can create proposals?</FormLabel>
                            <RadioGroup value={creatorType} onChange={(e) => setCreatorType(e.target.value)}>
                                <FormControlLabel value="anyone" control={<Radio />} label="Anyone" />
                                <FormControlLabel value="definedList" control={<Radio />} label="A defined list of users" />
                            </RadioGroup>
                            {creatorType === 'definedList' && (
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
                                >
                                    <option value="admin">Admin</option>
                                    <option value="vote">Members (Vote)</option>
                                </TextField>
                            )}
                        </FormControl>

                        {/* 2. Voting System Control */}
                        <FormControl fullWidth margin="normal">
                            <FormLabel>2. Initial Voting System</FormLabel>
                            <Box display="flex" alignItems="center">
                                <Switch
                                    checked={votingSystem === 'custom'}
                                    onChange={handleVotingSystemChange}
                                    id="zezezd"
                                />
                                <label style={{
                                    cursor: "pointer",
                                    fontFamily: "'Roboto' 'Helvetica' Arial sans-serif",
                                    fontWeight: 400,
                                    fontSize: 15,
                                    lineHeight: "1.5",
                                    letterSpacing: "0.00938em",
                                    color: "rgb(33, 37, 41)"
                                }} for="zezezd">Custom</label>
                            </Box>

                            <label style={{
                                cursor: "pointer",
                                fontFamily: "'Roboto' 'Helvetica' Arial sans-serif",
                                fontWeight: 800,
                                fontSize: 15,
                                lineHeight: "1.5",
                                marginLeft: "10px",
                                letterSpacing: "0.00938em",
                                color: "rgb(33, 37, 41)"
                            }} >{votingSystem === 'custom' ? 'Custom' : 'Yes/No'}</label>

                            {votingSystem === 'yesNo' ? (
                                <TextField
                                    margin="normal"
                                    label="Quorum"
                                    type="number"
                                    value={quorum}
                                    onChange={(e) => setQuorum(e.target.value)}
                                    InputProps={{ endAdornment: <InputAdornment position="end">tokens</InputAdornment> }}
                                    fullWidth
                                    required
                                />
                            ) : (
                                <>
                                    <TextField
                                        margin="normal"
                                        label="Custom Voting System (ie: 'voting_system.aleo')"
                                        fullWidth
                                        value={customVotingSystem}
                                        onChange={(e) => {
                                            setCustomVotingSystem(e.target.value)
                                        }}
                                    />
                                    <TextField
                                        margin="normal"
                                        label="Voting System parameters (ie: '{ quorum: 1000u128 }')"
                                        fullWidth
                                        value={votingSystemParams}
                                        onChange={(e) => {
                                            setVotingSystemParams(e.target.value)
                                        }}
                                    />
                                </>
                            )}
                        </FormControl>

                        {/* 3. Update Voting System List Control */}
                        <FormControl fullWidth margin="normal">
                            <FormLabel>3. Who can update voting system list?</FormLabel>
                            <RadioGroup value={canVSUpdateList} onChange={(e) => setCanVSUpdateList(e.target.value)}>
                                <FormControlLabel value="noone" control={<Radio />} label="No one" />
                                <FormControlLabel value="admin" control={<Radio />} label="Admin" />
                                <FormControlLabel value="vote" control={<Radio />} label="Members (Vote)" />
                            </RadioGroup>
                        </FormControl>

                        {/* 4. Update Voting System List Control */}
                        <FormControl fullWidth margin="normal">
                            <FormLabel>4. Who can update these settings?</FormLabel>
                            <RadioGroup value={canUpdateDao} onChange={(e) => setCanUpdateDao(e.target.value)}>
                                <FormControlLabel value="noone" control={<Radio />} label="No one" />
                                <FormControlLabel value="admin" control={<Radio />} label="Admin" />
                                <FormControlLabel value="vote" control={<Radio />} label="Members (Vote)" />
                            </RadioGroup>
                        </FormControl>

                        <FormControl fullWidth margin="normal">
                            <FormLabel>5. DAO Token ID</FormLabel>
                            <TextField
                                label="1...12field"
                                variant="outlined"
                                value={governanceTokenID}
                                onChange={(e) => setGovernanceTokenID(e.target.value)}
                                fullWidth
                                margin="normal"
                                required
                            />
                        </FormControl>
                        {/* 4. DAO Token ID */}

                        {/* Submit Button */}
                        <Button style={{ borderRadius: "50px" }} type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                            {isCreateLoading ? (<Image width={20} src={require("../img/loader-loading.gif").default} alt="wallet" id="wallet_img" />) : "Create"}
                        </Button>
                    </Box>
                </Grow>
            </Container>
        </ThemeProvider>
    );
}
export default CreateDAO;
