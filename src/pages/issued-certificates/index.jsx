import { useAuth } from "@context/auth";
import { Button, FormControl, FormControlLabel, FormLabel, Paper, Radio, RadioGroup, TextField, Typography } from "@mui/material";
import { useState } from "react";
import useSWRMutation from "swr/mutation";

export default function IssuedCertificatesPage() {
    const { auth } = useAuth()

    const [address, setAddress] = useState("")
    const [addressSaved, setAddressSaved] = useState(false)
    const [userType, setUserType] = useState("")
    // const [certificates, setCertificates] = useState(null)

    const getData = async (url) => {
        if(!address) {
            alert("Please enter address")
            return
        }
        let getCertificates;
        if(userType === "org") {
            getCertificates = auth.contract.getOrganisationCertificates
        }
        else if(userType === "user") {
            getCertificates = auth.contract.getUserCertificates
        }
        else {
            alert("Invalid user type")
            return
        }
        await getCertificates(address).then(console.log).catch(console.log)
    }
    const { trigger: handleSubmit, data: certificates } = useSWRMutation("adas", getData)
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