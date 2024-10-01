import UpdateDAO from "@/components/UpdateDAO"
import { useRef } from 'react';

import {
    Container,
    FormControl,
    FormLabel,
    TextField,
    Button,
} from '@mui/material';


export default function ProposalContent({ proposal, updateDaoParamsRef }) {
    return (<>
        {(proposal?.type === "daou") && <DaoUpdateContent proposal={proposal} updateDaoParamsRef={updateDaoParamsRef} />}
        {(proposal?.type === "vsu") && <VotingSystemUpdateContent proposal={proposal} />}
        {(proposal?.type === "psu") && <ProposersUpdateContent proposal={proposal} />}
    </>
    );
}

function ProposersUpdateContent({ proposal }) {
    const isAdd = proposal?.content?.value?.is_add === "true";
    return (<>
        <style global jsx>{`
                .MuiInputBase-input{
                    padding: 8px !important;
                }
                .MuiTextField-root{
                    width: 100%;
                }
            `}</style>
        <h1
            style={{
                fontSize: "22px",
                marginTop: "10px",
                marginBottom: "20px"
            }}
        >
            Allowed proposer proposed to be {isAdd ? "added" : "removed"}:
        </h1>
        <div>
            <FormLabel>{proposal?.content?.value?.proposer?.program_id ? "Program ID" : "Address"}</FormLabel>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row"
                }}
            >
                <TextField
                    variant="outlined"
                    value={
                        proposal?.content?.value?.proposer?.program_id
                        || proposal?.content?.value?.proposer?.address
                    }
                    margin="normal"
                    id="proposer_address"
                    disabled={true}
                />
                <div className="link-copy copyInput" style={{ transform: "translate(-25px, 22px)" }}>
                    <button
                        onClick={
                            (e) => {
                                const tempInput = document.createElement("input");
                                tempInput.value = document.getElementById("proposer_address").value;
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
    </>
    );
}


function VotingSystemUpdateContent({ proposal }) {
    const isAdd = proposal?.content?.value?.is_add === "true";
    return (<>
        <style global jsx>{`
                .MuiInputBase-input{
                    padding: 8px !important;
                }
                .MuiTextField-root{
                    width: 100%;
                }
            `}</style>
        <h1
            style={{
                fontSize: "22px",
                marginTop: "10px",
                marginBottom: "20px"
            }}
        >
            Voting system proposed to be {isAdd ? "added" : "removed"}:
        </h1>
        <div>
            <FormLabel>{proposal?.content?.value?.voting_system?.program_id ? "Program ID" : "Address"}</FormLabel>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row"
                }}
            >
                <TextField
                    variant="outlined"
                    value={
                        proposal?.content?.value?.voting_system?.program_id
                        || proposal?.content?.value?.voting_system?.address
                    }
                    fullWidth
                    margin="normal"
                    id="program_id_or_address"
                    disabled={true}
                />
                <div className="link-copy copyInput" style={{ transform: "translate(-25px, 22px)" }}>
                    <button
                        onClick={
                            (e) => {
                                const tempInput = document.createElement("input");
                                tempInput.value = document.getElementById("program_id_or_address").value;
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
            <FormLabel>Parameters Struct</FormLabel>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row"
                }}
            >
                <TextField
                    variant="outlined"
                    value={proposal?.content?.value?.voting_system?.params_str}
                    fullWidth
                    margin="normal"
                    id="parameters_struct"
                    disabled={true}
                />
                <div className="link-copy copyInput" style={{ transform: "translate(-25px, 22px)" }}>
                    <button
                        onClick={
                            (e) => {
                                const tempInput = document.createElement("input");
                                tempInput.value = document.getElementById("parameters_struct").value;
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
    </>
    );
}


function DaoUpdateContent({ proposal, updateDaoParamsRef }) {
    return (<>
        <h1
            style={{
                fontSize: "22px",
                marginTop: "10px"
            }}
        >
            Proposed new settings for DAO:
        </h1>
        <UpdateDAO
            isUpdateLoading={null}
            setIsUpdateLoading={null}
            defaultSettings={proposal.content.daoSettings}
            setIsUpdateEdited={null}
            updateDaoParamsRef={updateDaoParamsRef}
            disableUpdates={true}
        />
    </>
    );
}