import { useAuth } from "@context/auth";
import { Button, CircularProgress, FormControl, FormControlLabel, FormLabel, Paper, Radio, RadioGroup, TextField, Typography, Card, CardActions, CardMedia } from "@mui/material";
import { useState } from "react";
import useSWRMutation from "swr/mutation";
import { GetIpfsUrlFromPinata } from "@utils";
import axios from "axios";

export default function IssuedCertificatesPage() {
    const { auth } = useAuth()
    const [address, setAddress] = useState("")
    const [addressSaved, setAddressSaved] = useState(false)
    const [userType, setUserType] = useState("")
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
        
        const certificates = await getCertificates(address);
        const certificateData = await Promise.all(
            certificates.map(async (res) => {
                const tokenUri = await auth.contract.tokenURI(res.tokenId);
                const ipfsUrl = await GetIpfsUrlFromPinata(tokenUri);
                const response = await axios.get(ipfsUrl);
                const item = response.data;

                return {
                    creator: res.creator,
                    user: res.user,
                    image: item.image,
                }
            })
        )
        return certificateData;
    }

    const { trigger: handleSubmit, data: certificates, isMutating } = useSWRMutation("adas", getData)
    console.log(certificates)

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
        >
            <Typography component="div" variant="h4">Check for issued certificates</Typography>
            <div
                style={{
                    background: "inherit",
                    display: "flex",
                    flexDirection: "row",
                    gap: "2rem",
                }}
            >
                <Paper
                    style={{
                        padding: "1rem",
                        display: "flex",
                        flexDirection: "column",
                        gap: "1.5rem",
                        width: "50%",
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
                            width: "100%"
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
                            fullWidth
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
                <Paper
                    sx={{
                        width: "100%"
                    }}
                >
                    {isMutating?(
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", gap: 8}}>
                            <CircularProgress />
                            <Typography variant="body2" color="text.secondary">Loading</Typography>
                        </div>
                    ):(
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                padding: "1rem",
                                alignItems: "center"
                            }}
                        >
                            <Typography variant="h4" color="text.secondary">Your Certificates</Typography>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    flex: "0 1",
                                    flexWrap: "wrap",
                                    gap: "2rem",
                                    padding: "2rem",
                                    justifyContent: "center"
                                }}
                            >
                                {certificates?.map((e, i) => (
                                    <Card
                                        sx={{
                                            maxWidth: 300,
                                            gap: "1rem",
                                            display: "flex",
                                            flexDirection: "column",
                                            background: "#2e2e2e",
                                        }}
                                        key={i}
                                    >
                                        <a href={e.image} target="_blank" rel="noreferrer noopener">
                                            <CardMedia
                                                sx={{ width: 300 }}
                                                image={GetIpfsUrlFromPinata(e.image)}
                                                title={`Certificate ${i + 1}`}
                                                component="img"
                                            />
                                        </a>
                                        <div
                                            style={{
                                                padding: 10,
                                                display: "flex",
                                                justifyContent: "center",
                                                flexDirection: "column",
                                            }}
                                        >
                                            <Typography variant="body1" color="primary" sx={{ paddingBottom: 1}}>Transfer Details</Typography>
                                            <Typography variant="body2" color="text.secondary">Created by: {e.creator.slice(0, 6)}...{e.creator.slice(-4)}</Typography>
                                            <Typography variant="body2" color="text.secondary">To: {e.user.slice(0, 6)}...{e.user.slice(-4)}</Typography>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}
                </Paper>
            </div>
        </div>
    )
}