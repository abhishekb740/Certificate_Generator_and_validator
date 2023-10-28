import { Button, Paper, TextField, Typography, styled } from "@mui/material";
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { useState } from "react";
import styles from "./styles.module.scss"
import { uploadFileToIPFS, uploadJSONToIPFS } from "../../pinata";
import ModalComponent from "@components/Modal";

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

export default function UploadCertificatePage() {
    const [receiverAddr, setReceiverAddr] = useState("")
    const [addressSaved, setAddressSaved] = useState(false)
    const [image, setImage] = useState("")
    const [file, setFile] = useState(null);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");

    const handleChangeFile = async(e) =>{
        try{
            console.log(e.target.files[0]);
            const response = await uploadFileToIPFS(e.target.files[0]);
            if(response.success === true){
                setFile(response.pinataURL);
            }
        }
        catch(e){
            console.log("Error during File upload: ", e);
        }
    }

    const finalSubmit = (e) =>{
        console.log("Hello");
        setOpen(false);
    }

    const handleSubmit = async(e) =>{
        e.preventDefault();
        setMessage("Are you sure you want to Submit?");
        setOpen(true);
    }

    return (
        <>
            <Paper
                sx={{
                    display: "flex",
                    gap: "2rem",
                    width: "100%",
                    flexDirection: "column",
                    height: "100%",
                    background: "inherit",
                    padding: "1rem",
                }}
                className="something"
            >
                <Typography component="div" variant="h3">Create your own certificate</Typography>
                <div
                    style={{
                        width: "100%",
                        display: "flex",
                        gap: "2rem"
                    }}
                >
                    <Paper
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "1rem",
                            width: "35%",
                            padding: "1rem"
                        }}
                    >
                        <Typography variant="h6" component="div">Enter Details</Typography>
                        <div
                            style={{
                                display: "flex",
                                gap: "2rem",
                                padding: 0,
                                background: "inherit"
                            }}
                        >
                            <TextField
                                label="Enter receiver's address"
                                placeholder="Enter receiver's address"
                                name="receiverAddr"
                                onChange={(e) => setReceiverAddr(e.target.value)}
                                value={receiverAddr}
                                type={addressSaved ? "password" : "text"}
                                disabled={addressSaved}
                                fullWidth
                            />
                            <Button variant="contained" onClick={() => setAddressSaved(prev => !prev)}>
                                {addressSaved ? "Update" : "Save"}
                            </Button>
                        </div>
                        <Button component="label" variant="contained" startIcon={<CardMembershipIcon />}>
                            Upload Certificate
                            <VisuallyHiddenInput
                                type="file"
                                accept="image/"
                                max={524288}
                                onChange={handleChangeFile}
                            />
                        </Button>
                        <Button component="label" variant="contained" startIcon={<ArrowUpwardIcon />} onClick={handleSubmit}>
                            Submit
                        </Button>
                    </Paper>
                    <Paper
                        sx={{
                            width: "100%"
                        }}
                    >
                    </Paper>
                </div>

            </Paper>
            <ModalComponent finalSubmit={finalSubmit} open={open} setOpen={setOpen} message={message} />
        </>
    )
}