import { useAuth } from "@context/auth";
import { Button, FormControl, FormControlLabel, FormLabel, Paper, Radio, RadioGroup, TextField, Typography } from "@mui/material";
import { useState } from "react";
import useSWRMutation from "swr/mutation";
import { GetIpfsUrlFromPinata } from "@utils";
import axios from "axios";

export default function IssuedCertificatesPage() {
    const { auth } = useAuth()
    console.log(auth)
    const [address, setAddress] = useState("")
    const [addressSaved, setAddressSaved] = useState(false)
    const [userType, setUserType] = useState("")
    const [data, updateData] = useState([]);
    // const [certificates, setCertificates] = useState(null)

    const getData = async (url) => {
        if (!address) {
            alert("Please enter address")
            return
        }
        let getCertificates;
        if (userType === "org") {
            getCertificates = auth.contract.getOrganisationCertificates
        }
        else if (userType === "user") {
            getCertificates = auth.contract.getUserCertificates
        }
        else {
            alert("Invalid user type")
            return
        }
        // await getCertificates(address).then(console.log).catch(console.log)
        fetchData(await getCertificates(address).then(console.log).catch(console.log));
    }
    const { trigger: handleSubmit, data: certificates } = useSWRMutation("adas", getData)
    console.log(certificates)

    const fetchData = async (certificates) => {
        const items = await Promise.all(certificates.map(async i => {
            var tokenURI = await auth.contract.tokenURI(i.tokenId);
            console.log("getting this tokenUri", tokenURI);
            tokenURI = GetIpfsUrlFromPinata(tokenURI);
            let meta = await axios.get(tokenURI);
            meta = meta.data;
            let item = {
                creator: i.creator,
                user: i.user,
                image: meta.image,
            }
            console.log(meta.image);
            return item;
        }))
        updateData(items);
    }

    // async function showCertificates() {
    //     //console.log("hello");
    //     if (!address) {
    //         alert("Please enter address")
    //         return
    //     }
    //     let getCertificates;
    //     if (userType === "org") {
    //         getCertificates = auth.contract.getOrganisationCertificates
    //     }
    //     else if (userType === "user") {
    //         getCertificates = auth.contract.getUserCertificates
    //     }
    //     else {
    //         alert("Invalid user type")
    //         return
    //     }
    //     const certificates = await getCertificates(address).then(console.log).catch(console.log)
    //     fetchData(await getCertificates(address).then(console.log).catch(console.log));
    //     const items = await Promise.all(certificates.map(async i => {
    //       var tokenURI = await auth.contract.tokenURI(i.tokenId);
    //       console.log("getting this tokenUri", tokenURI);
    //       tokenURI = GetIpfsUrlFromPinata(tokenURI);
    //       let meta = await axios.get(tokenURI);
    //       meta = meta.data;
    
    //       let item = {
    //         creator: i.creator,
    //         user: i.user,
    //         image: meta.image,
    //       }
    
    //       console.log(meta.image);
    //       return item;
    //     }))
    //     updateData(items);
    //   }

    return (
        <div
            style={{
                background: "inherit",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                height: "100%",
                width: "100%",
                padding: "2rem",
            }}
            className="something"
        >
            <Typography component="div" variant="h4">Check for issued certificates</Typography>
            <div
                style={{
                    background: "inherit",
                    display: "flex",
                    flexDirection: "column",
                    gap: "2rem",
                    // alignItems: "center"
                }}
            >
                <Paper
                    style={{
                        padding: "1rem",
                        display: "flex",
                        flexDirection: "column",
                        gap: "1.5rem",
                        maxWidth: "30%",
                        alignItems: "flex-start",
                        paddingLeft: "2rem"
                    }}
                >
                    <Typography component="div" variant="h5">Please Enter the details</Typography>
                    <div
                        style={{
                            display: "flex",
                            gap: "2rem",
                            padding: 0,
                            background: "inherit",
                        }}
                    >
                        <TextField
                            label="Enter receiver's address"
                            placeholder="Enter receiver's address"
                            name="receiverAddr"
                            onChange={(e) => setAddress(e.target.value)}
                            value={address}
                            type={addressSaved ? "password" : "text"}
                            disabled={addressSaved}
                        />
                        <Button variant="contained" onClick={() => setAddressSaved(prev => !prev)}>
                            {addressSaved ? "Update" : "Save"}
                        </Button>
                    </div>
                    <div>
                        <FormControl>
                            <FormLabel>Type of Account</FormLabel>
                            <RadioGroup row onChange={(e) => setUserType(e.target.value)} value={userType}>
                                <FormControlLabel value="org" control={<Radio />} label="Organization" />
                                <FormControlLabel value="user" control={<Radio />} label="User" />
                            </RadioGroup>
                        </FormControl>
                    </div>
                    <Button variant="contained" fullWidth onClick={handleSubmit}>
                        Submit
                    </Button>
                </Paper>
            </div>
        </div>
    )
}