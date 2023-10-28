import { AuthContext } from "@context/auth";
import { useState } from "react";
import Certificate from "../ABI/abi.json";
import { ethers } from "ethers";

export default function AuthProvider({ children }) {
    const [auth, setAuth] = useState()
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
        await window.ethereum.request({ method: 'eth_requestAccounts' }).then(async() => {
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
                const addr = await signer.getAddress();
                console.log(addr);
                setAccountAddr(addr);
                const contract = new ethers.Contract(Certificate.address, Certificate.abi, signer);
                setContract(contract);
            }
            else {
                alert("Please Install Metamask First");
            }
        })
    }

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    )
}