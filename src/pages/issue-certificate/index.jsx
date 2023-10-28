import { Button, Paper, TextField, Typography, styled } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useState } from "react";
import domToImage from "dom-to-image"
import styles from "./styles.module.scss"
import { uploadFileToIPFS, uploadJSONToIPFS } from "../pinata";

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

export default function IssueCertificatePage() {
    const [receiverAddr, setReceiverAddr] = useState("")
    const [addressSaved, setAddressSaved] = useState(false)
    const [receiverName, setReceiverName] = useState("")
    const [receiverDes, setReceiverDes] = useState("")

    const [sign, setSign] = useState(null)
    const [image, setImage] = useState("")
    const handleChangeSign = (e) => {
        setSign(URL.createObjectURL(e.target.files[0]))
    }

    function dataUrlToFile(url) {
        var arr = url.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], 'a.png', { type: mime });
    }

    async function generateImage(e) {
        e.preventDefault()
        await domToImage.toJpeg(document.getElementById(styles.certificateImage))
        .then(res => setImage(dataUrlToFile(res)))
    }

    return (
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
                    <TextField
                        label="Receiver's name"
                        placeholder="Receiver's name"
                        name="name"
                        onChange={(e) => setReceiverName(e.target.value)}
                        value={receiverName}
                        fullWidth
                    />
                    <TextField
                        label="Description"
                        placeholder="Description"
                        name="description"
                        onChange={(e) => setReceiverDes(e.target.value)}
                        value={receiverDes}
                        fullWidth
                        multiline
                        rows={5}
                        maxRows={5}
                    />
                    <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                        Upload Signature
                        <VisuallyHiddenInput
                            type="file"
                            accept="image/"
                            max={524288}
                            onChange={handleChangeSign}
                        />
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
    )
}