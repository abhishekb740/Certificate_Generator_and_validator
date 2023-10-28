import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AppBar from '@mui/material/AppBar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import Certificate from "../../ABI/abi.json";
import { ethers } from "ethers";
import { useState } from 'react';

export default function Header() {
    const [accountAddr, setAccountAddr] = useState("");
    const [contract, setContract] = useState(null)
    const [provider, setProvider] = useState(null);
    const connectToMetamask = async () => {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        if (chainId !== '0x33') {
            //alert('Incorrect network! Switch your metamask network to Rinkeby');
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x33' }],
            })
        }
        await window.ethereum.request({ method: 'eth_requestAccounts' }).then(async () => {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            if (provider) {
                setProvider(provider);
                window.ethereum.on('chainChanged', () => {
                    window.location.reload();
                })
                window.ethereum.on('accountsChanged', () => {
                    window.location.reload();
                })
                const signer = provider.getSigner();
                console.log(signer);
                const addr = await signer.getAddress();
                console.log(addr);
                setAccountAddr(addr);
                const contract = new ethers.Contract(Certificate.address, Certificate.abi, signer);
                setContract(contract);
                console.log(contract);
            }
            else {
                alert("Please Install Metamask First");
            }
        })
    }
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            {/* <MenuItem onClick={handleMenuClose}>Transactions</MenuItem> */}
            <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
        </Menu>
    );

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <MenuItem>
                <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                    <Badge badgeContent={4} color="error">
                        <MailIcon />
                    </Badge>
                </IconButton>
                <p>Messages</p>
            </MenuItem>
            <MenuItem>
                <IconButton
                    size="large"
                    aria-label="show 17 new notifications"
                    color="inherit"
                >
                    <Badge badgeContent={17} color="error">
                        <NotificationsIcon />
                    </Badge>
                </IconButton>
                <p>Notifications</p>
            </MenuItem>
            <MenuItem onClick={handleProfileMenuOpen}>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                >
                    <AccountCircle />
                </IconButton>
                <p>Profile</p>
            </MenuItem>
        </Menu>
    );

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" sx={{
                padding: ".5rem 0"
            }}>
                <Toolbar>
                    <Typography
                        variant="h5"
                        noWrap
                        component="div"
                        sx={{ display: { xs: 'none', sm: 'block', fontWeight: "bold" } }}
                    >
                        inscribe
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <Box
                        sx={{
                            display: {
                                xs: 'none',
                                md: 'flex'
                            },
                            alignItems: "center",
                            gap: "5px",
                            justifyContent: "center",
                            cursor: "pointer"
                        }}
                        onClick={connectToMetamask}
                    >
                        <IconButton
                            size="large"
                            edge="end"
                            aria-label="account of current user"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            color="inherit"
                        >
                            <AccountCircle fontSize='medium' />
                        </IconButton>
                        <Typography
                            component="div"
                            variant='body1'
                            fontWeight={500}
                        >
                            {accountAddr ? accountAddr.slice(0, 6) + "..." + accountAddr.slice(-4) : "Connect To Metamask"}
                        </Typography>
                    </Box>
                    <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="show more"
                            aria-controls={mobileMenuId}
                            aria-haspopup="true"
                            onClick={handleMobileMenuOpen}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            {renderMobileMenu}
            {renderMenu}
        </Box>
    );
}