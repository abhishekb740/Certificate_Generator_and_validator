import styles from "@styles/org.module.scss";
import domtoimage from 'dom-to-image';
import { ethers } from "ethers";
import { useState } from "react";
import Marketplace from '../ABI/abi.json';
import { uploadFileToIPFS, uploadJSONToIPFS } from "../pinata";

const data = [
    { "image": "https://i.imgur.com/idG3CLO.png" },
    { "image": "https://i.imgur.com/RFeCLoi.png" },
    { "image": "https://i.imgur.com/XmfD44T.png" },
    { "image": "https://i.imgur.com/oTYOlAM.png" },
];

function Organisation() {
    let [name, setName] = useState();
    let [description, setDescription] = useState();
    let [date, setDate] = useState();
    let [sign, setSign] = useState(null);
    let [index, setIndex] = useState(0);
    let [receiverAddress, setReceiverAddress] = useState();
    let [img, setImage] = useState("");
    const [fileURL, setFileURL] = useState(null);
    const [message, updateMessage] = useState('');

    async function OnChangeFileThroughUpload(e) {
        var file = e.target.files[0];
        //if(!img) {setImage(e.target.files[0]);}
        //console.log(e.target.files[0]);
        updateMessage("Uploading image Please wait");
        try {
            const response = await uploadFileToIPFS(file);
            if (response.success === true) {
                updateMessage("Uploaded Img Successfully");
                setFileURL(response.pinataURL);
            }
        }
        catch (err) {
            updateMessage("Failed to upload image please try again");
            console.log("error during file upload : ", err);
        }

    }

    async function OnChangeFile() {
        console.log(img);
        //if(!img) {setImage(e.target.files[0]);}
        //console.log(e.target.files[0]);
        updateMessage("Uploading image Please wait");
        try {
            const response = await uploadFileToIPFS(img);
            if (response.success === true) {
                updateMessage("Uploaded Img Successfully");
                setFileURL(response.pinataURL);
            }
        }
        catch (err) {
            updateMessage("Failed to upload image please try again");
            console.log("error during file upload : ", err);
        }
    }
    async function uploadMetadataToIPFS() {
        if (!fileURL) {
            updateMessage("Please try again");
            console.log("name or fileURL not set", name, fileURL);
            return;
        }
        if (!name) {
            name = "SAMPLE"
        }

        const nftJSON = {
            name, image: fileURL
        };
        try {
            updateMessage("uploading json to IPFS")
            const response = await uploadJSONToIPFS(nftJSON);
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
    async function listNFT(e) {
        e.preventDefault();
        try {
            const metadataURL = await uploadMetadataToIPFS();
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            updateMessage("Please wait for 30 second");

            let contract = new ethers.Contract(Marketplace.address, Marketplace.abi, signer);

            let transection = await contract.createToken(metadataURL, receiverAddress);

            console.log(transection);
            await transection.wait();
            alert("Successfully sent the certificate");
            updateMessage("");
            //window.location.replace("/");
        }
        catch (e) {
            updateMessage("Please try again");
            alert("upload error", e);
        }
    }
    function dataURLtoFile(dataurl, filename) {// to convert base64 to img
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    }
    async function MintSend(e) {
        e.preventDefault();
        await domtoimage.toJpeg(document.getElementById(styles["img-cer"])).then(function (data) {
            var file = dataURLtoFile(data, 'a.png');
            setImage(file);
            updateMessage("Information saved")
        })

    }
    function setSample(e, index) {
        setIndex(index);
    }
    return (
        <>
            <div id={styles.org}>
                {/* Certificate information edit preview section */}
                <div id={styles["meta-data"]}>
                    {/*<h1>Certificate</h1>*/}
                    <h2>Create Certificate</h2>
                    <p>Enter Name</p>
                    <input type="text" value={name} placeholder="Enter the name"
                        onChange={(e) => { setName(e.target.value) }}></input>
                    <br></br>

                    <p>Enter Description</p>
                    <textarea rows="3" cols="40" type="text" value={description} placeholder="Enter the Description"
                        onChange={(e) => { setDescription(e.target.value) }}></textarea>
                    <br></br>
                    <p>Enter Date</p>
                    <input type="text" value={date} placeholder="Enter the Date"
                        onChange={(e) => { setDate(e.target.value) }}></input>
                    <br></br>
                    <label htmlFor="image">Upload Signature (&lt;500 KB)</label>
                    <br></br>
                    <input type={"file"} onChange={(e) => { setSign(URL.createObjectURL(e.target.files[0])) }}></input>

                    <br></br>
                    <button onClick={(e) => MintSend(e)}>Save Information</button>
                    <button onClick={(e) => OnChangeFile(e)}>Upload Certificate</button>
                    <br></br>
                    <p>Enter public address of user</p>
                    <input type="text" value={receiverAddress} placeholder="Enter the address"
                        onChange={(e) => { setReceiverAddress(e.target.value) }}></input>
                    <button onClick={(e) => listNFT(e)}>Send</button>
                    <br></br>
                    <p>{message}</p>
                    <h2>OR Upload Certificate</h2>
                    <br></br>
                    <div>
                        <label htmlFor="image">Upload Image (&lt;500 KB)</label>
                        <br></br>
                        <input type={"file"} onChange={OnChangeFileThroughUpload}></input>
                    </div>
                    <br></br>
                    <div>{message}</div>
                    <p>Enter public address of user</p>
                    <input type="text" placeholder="Enter the address"
                        onChange={(e) => { setReceiverAddress(e.target.value) }} />
                    <button onClick={listNFT} id="list-button">Send</button>
                </div>
                {/* show data on selected certificate */}
                <div id={styles["img-cer"]}>
                    <input type="text" value={name} disabled="disabled" className={styles["data-name"]}></input>
                    <textarea type="text" value={description} disabled="disabled" className={styles["data-des"]}></textarea>
                    <input type="text" value={date} disabled="disabled" className={styles["data-date"]}></input>
                    {sign && <img id={styles.sign} src={sign}></img>}
                    <img id={styles["cer-data"]} src={data[index].image}></img>
                </div>

            </div>
            {/* Select design section */}
            <h1 className={styles.heading}>Select a Design</h1>
            <div id={styles["sample-img"]}>
                {data.map((value, index) => {
                    {/*console.log(data[index].image);*/ }
                    return <img key={index} id="highlight-selected" onClick={(e) => { setSample(e, index) }} src={value.image}></img>
                })}
            </div>
        </>
    );
}

export default Organisation;
