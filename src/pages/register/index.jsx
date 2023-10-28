import { Container, Paper, TextField, Typography, Button } from "@mui/material";
import BusinessIcon from '@mui/icons-material/Business';
import { useEffect, useState } from "react";
import { useAuth } from "@context/auth";


export default function RegisterPage() {
    const [formData, setFormData] = useState({
        companyName: "",
        location: "",
        registrationNo: "",
        pinCode: ""
    })
    const [isValid, setIsValid] = useState({
        companyName: true,
        location: true,
        registrationNo: true,
        pinCode: true
    })
    const { auth } = useAuth()
    useEffect(() => {
        console.log(auth)
    }, [auth])
    const handleChangeFormData = (event) => {
        setIsValid(prev => {
            if(event.target.name === "registrationNo") {
                prev[event.target.name] = !!event.target.value.match(/^\d{12}$/)
            }
            else if(event.target.name === "pinCode") {
                prev[event.target.name] = !!event.target.value.match(/^\d{6}$/)
            }
            else if(event.target.value.length === 0) {
                prev[event.target.name] = true
            }
            return prev
        })
        setFormData(async prev => (await isValid[event.target.name])?({...prev, [event.target.name]: event.target.value}):prev)
    }
    console.log(formData)
    return (
        <Container 
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100%",
                flexDirection: "column",
                width: "60%",
                gap: "1rem",
            }}
            >
            <Paper 
                sx={{
                    padding: "1.5rem",
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                    borderRadius: "1rem"
                }}
            >
                <Container 
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 1,
                        alignItems: "center",
                        justifyContent: "center",
                        paddingBottom: "2rem",
                        textAlign: "center"
                    }}
                >
                    <BusinessIcon fontSize="large" color="primary"/>
                    <Typography variant="h5" component="div" fontWeight={600} fontSize={18}>Register your company</Typography>
                </Container>
                <Container
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                        gap: "1rem"
                    }}
                >
                    <TextField 
                        placeholder="Company Name"
                        fullWidth
                        label="Company Name"
                        name="companyName"
                        required
                        onChange={handleChangeFormData}
                        error={!isValid.companyName}
                    />
                    <TextField 
                        placeholder="Registration No."
                        label="Registration No."
                        fullWidth
                        name="registrationNo"
                        required
                        onChange={handleChangeFormData}
                        error={!isValid.registrationNo}
                        helperText={!isValid.registrationNo && "Registration No accepts 12 digit number"}
                    />
                    <TextField 
                        placeholder="Address"
                        label="Address"
                        fullWidth
                        multiline
                        rows={3}
                        maxRows={3}
                        name="location"
                        required
                        onChange={handleChangeFormData}
                        error={!isValid.location}

                    />
                    <TextField 
                        placeholder="Pincode"
                        label="Pincode"
                        fullWidth
                        name="pinCode"
                        required
                        onChange={handleChangeFormData}
                        error={!isValid.pinCode}
                        helperText={!isValid.pinCode && "Pin code accepts 6 digit number"}
                    />
                </Container>
                <Container>
                    <Button variant="contained" fullWidth>
                        Register
                    </Button>
                </Container>
            </Paper>
        </Container>
    )
}