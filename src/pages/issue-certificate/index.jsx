import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Button, Paper, TextField, Typography, styled } from "@mui/material";
import domToImage from "dom-to-image";
import { useState } from "react";
import styles from "./styles.module.scss";
import { uploadFileToIPFS, uploadJSONToIPFS } from "../../pinata";
import { ethers } from "ethers"
import Marketplace from "@ABI/abi.json"
import moment from 'moment/moment';
import ModalComponent from '@components/Modal';
import { useAuth } from '@context/auth';

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

const data = [
    "https://i.imgur.com/idG3CLO.png",
    "https://i.imgur.com/RFeCLoi.png",
    "https://i.imgur.com/XmfD44T.png",
    "https://i.imgur.com/oTYOlAM.png",
];

export default function IssueCertificatePage() {
    const [modalOpen, setModalOpen] = useState(false)
    const [receiverAddr, setReceiverAddr] = useState("")
    const [addressSaved, setAddressSaved] = useState(false)
    const [receiverName, setReceiverName] = useState("")
    const [receiverDes, setReceiverDes] = useState("")

    const [sign, setSign] = useState(null)
    const [image, setImage] = useState("")
    const [fileUrl, setFileUrl] = useState(null)
    const [message, updateMessage] = useState('');
    const [index, setIndex] = useState(0)
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

    const uploadMeta = async () => {
        if (!fileUrl) {
            updateMessage("Please try again");
            console.log("name or fileURL not set", receiverName, fileUrl);
            return;
        }
        if (!receiverName) {
            setReceiverName("SAMPLE")
        }
        const nftJson = {
            name: receiverName,
            image: fileUrl
        }
        try {
            updateMessage("uploading json to IPFS")
            const response = await uploadJSONToIPFS(nftJson);
            if (response.success === true) {
                console.log("Uploaded json to pinata", response);
                return response.pinataURL;
            }
        }
        catch (e) {
            updateMessage("Error uploading JSON metadata");
            alert("Error uploading JSON metadata", e);
        }
    }

    async function uploadImage(e) {
        e.preventDefault()
        await domToImage.toJpeg(document.getElementById(styles.certificateImage))
            .then(res => setImage(dataUrlToFile(res)))
            .then(async () => {
                updateMessage("Uploading image Please wait");
                try {
                    const response = await uploadFileToIPFS(image);
                    if (response.success === true) {
                        updateMessage("Uploaded Img Successfully");
                        setFileUrl(response.pinataURL);
                    }
                }
                catch (err) {
                    updateMessage("Failed to upload image please try again");
                    console.log("error during file upload : ", err);
                }
            })
            .then(async () => {
                try {
                    const metadataURL = await uploadMeta();
                    const provider = new ethers.providers.Web3Provider(window.ethereum);
                    const signer = provider.getSigner();
                    updateMessage("Please wait for 30 second");
                    let contract = new ethers.Contract(Marketplace.address, Marketplace.abi, signer);
                    let transaction = await contract.createToken(metadataURL, receiverAddr);
                    console.log(transaction);
                    await transaction.wait();
                    alert("Successfully sent the certificate");
                    updateMessage("");
                }
                catch (e) {
                    updateMessage("Please try again");
                    alert("upload error", e);
                }
            })
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
                            padding: "1rem",
                            height: "100%"
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
                        <Button onClick={() => setModalOpen(true)} variant='contained'>
                            Submit
                        </Button>
                    </Paper>
                    <Paper
                        sx={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            justifyContent: "center",
                            padding: '1rem'
                        }}
                    >
                        <div id={styles.certificateImage}>
                            <input
                                type="text"
                                value={receiverName}
                                disabled="disabled"
                                className={styles.dataName}
                            />
                            <textarea
                                type="text"
                                value={receiverDes}
                                disabled="disabled"
                                className={styles.dataDes}
                            />
                            <input
                                type="text"
                                value={moment().format("DD-MM-YYYY")}
                                disabled="disabled"
                                className={styles.dataDate}
                            />
                            {sign && <img id={styles.sign} src={sign}></img>}
                            <img id={styles.cerData} src={data[index]}></img>
                        </div>
                    </Paper>
                </div>
            </Paper>
            <ModalComponent
                open={modalOpen}
                setOpen={setModalOpen}
                finalSubmit={uploadImage}
                message="Are you sure you want to submit?"
            />
        </>
    )
}