import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Paper } from "@mui/material";
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import { useState } from "react";
import IssueCertificatePage from "./issue-certificate";
import IssuedCertificatesPage from "./issued-certificates";
import Layout from "./layout";
import RegisterPage from "./register";
import UploadCertificatePage from "./upload-certificate";

const panels = {
    "Registration": <RegisterPage />,
    "Issue Certificates": <IssueCertificatePage />,
    "Upload Certificates": <UploadCertificatePage />,
    "Issued Certificates": <IssuedCertificatesPage />,
    // "Transaction History": "5"
}

export default function IndexPage() {

    const [value, setValue] = useState(Object.keys(panels)[0]);
    const handleChange = (_, newValue) => {
        setValue(newValue);
    };

    return (
        <Layout>
            <Box sx={{ width: '100%', typography: 'h2' }} >
                <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: "center" }}>
                        <TabList onChange={handleChange}>
                            {Object.keys(panels).map(e => (
                                <Tab key={e} label={e} value={e} />
                            ))}
                        </TabList>
                    </Box>
                    {Object.keys(panels).map(e => (
                        <TabPanel key={e} value={e}>
                            <Paper
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    height: "80vh",
                                    paddingTop: "2rem",
                                    width: "100%",
                                    background: "inherit"
                                }}
                            >
                                {panels[e]}
                            </Paper>
                        </TabPanel>
                    ))}
                </TabContext>
            </Box>
        </Layout>
    )
}