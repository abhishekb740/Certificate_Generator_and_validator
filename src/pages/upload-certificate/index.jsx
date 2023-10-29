import { Button, Paper, TextField, Typography, styled } from "@mui/material";
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { useState } from "react";
import { uploadFileToIPFS, uploadJSONToIPFS } from "../../pinata";
import ModalComponent from "@components/Modal";
import { useAuth } from "@context/auth";

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
    const [file, setFile] = useState(null);
    const [open, setOpen] = useState(false);
    const [name, setname] = useState("Sample")
    const [message, setMessage] = useState("");
    const [fileURL, setFileURL] = useState(null);
    const { auth } = useAuth()
    const handleChangeFile = async (e) => {
        try {
            console.log(e.target.files[0]);
            console.log(URL.createObjectURL(e.target.files[0]));
            setFileURL(URL.createObjectURL(e.target.files[0]));
            const response = await uploadFileToIPFS(e.target.files[0]);
            if (response.success === true) {
                setFile(response.pinataURL);
            }
        }
        catch (e) {
            console.log("Error during File upload: ", e);
        }
    }

    async function uploadMetadataToIPFS() {
        if (!file) {
            console.log("name or fileURL not set", name, file);
            return;
        }
        const nftJSON = {
            name, image: file
        };
        try {
            const response = await uploadJSONToIPFS(nftJSON);
            if (response.success === true) {
                console.log("Uploaded json to pinata", response);
                return response.pinataURL;
            }
        }
        catch (e) {
            alert("Error uploading JSON metadata", e);
        }
    }

    const finalSubmit = async (e) => {
        console.log("Hello");
        setOpen(false);
        let contract = auth.contract;
        try {
            const metaDataURL = await uploadMetadataToIPFS();
            let transaction = await contract.createToken(metaDataURL, receiverAddr);
            await transaction.wait();
            alert("Successfully sent the Certificate to the User");
        }
        catch (e) {
            console.log(e);
            alert(e.reason);
        }
    }

    const handleSubmit = async (e) => {
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
               <div style={{ display: "flex", alignItems: "flex-end", gap: 10 }}>
                    <Typography component="div" variant="h3">Upload a new certificate</Typography>
                    <div style={{ paddingBottom: 5 }}>
                        <Typography component="div" variant="h6" color="primary">To a user</Typography>
                    </div>
                </div>
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
                        {fileURL && <img src={fileURL} alt="certificate" style={{ width: "100%", maxHeight: "60vh" }} />}
                    </Paper>
                </div>

            </Paper>
            <ModalComponent finalSubmit={finalSubmit} open={open} setOpen={setOpen} message={message} />
        </>
    )
}