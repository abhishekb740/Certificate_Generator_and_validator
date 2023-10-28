import Layout from "./layout";
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { useState } from "react";
import RegisterPage from "./register";
import { Container } from "@mui/material";

const panels = {
    "Registration": <RegisterPage />,
    "Issue Certificates": "2",
    "Issued Certificates": "3",
    "Transaction History": "4"
}

export default function IndexPage() {
    const [value, setValue] = useState(Object.keys(panels)[0]);
    const handleChange = (_, newValue) => {
        setValue(newValue);
    };


    return (
        <Layout>
            <Box sx={{ width: '100%', typography: 'h2'}} >
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
                            <Container
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    height: "80vh",
                                    paddingTop: "3rem",
                                    width: "100%"
                                }}
                            >
                                {panels[e]}
                            </Container>
                        </TabPanel>
                    ))}
                </TabContext>
            </Box>
        </Layout>
    )
}