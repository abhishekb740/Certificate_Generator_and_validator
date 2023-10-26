import { useEffect, useState } from 'react';
import './css/nav.css';
import { Link } from 'react-router-dom';
import { ethers } from "ethers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser,faWallet,faUsersBetweenLines} from "@fortawesome/free-solid-svg-icons";
//import styles from '../components/css/styles.module.css';

function Navbar() {
  const [connected, toggleConnect] = useState(false);
  const [currAddress, updateAddress] = useState('0xaa36a7');

  async function getAddress() {
    //const ethers = require("ethers");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const addr = await signer.getAddress();
    updateAddress(addr);
  }

  function updateButton() {
    const ethereumButton = document.querySelector('.enableEthereumButton');
    ethereumButton.textContent = "Connected";
    ethereumButton.classList.remove("hover:bg-blue-70");
    ethereumButton.classList.remove("bg-blue-500");
    ethereumButton.classList.add("hover:bg-green-70");
    ethereumButton.classList.add("bg-green-500");
  }

  async function connectWebsite() {

    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    if (chainId !== '0xaa36a7') {
      //alert('Incorrect network! Switch your metamask network to Rinkeby');
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }],
      })
    }
    await window.ethereum.request({ method: 'eth_requestAccounts' })
      .then(() => {
        updateButton();
        console.log("here");
        getAddress();
        //window.location.replace(location.pathname)
      });
  }

  useEffect(() => {
    if (window.ethereum == undefined)
      return;
    let val = window.ethereum.isConnected();
    if (val) {
      console.log("here");
      getAddress();
      toggleConnect(val);
      updateButton();
    }

    window.ethereum.on('accountsChanged', function (accounts) {
      //  window.location.replace(location.pathname)
    })
  });
  return (
    <>
      <div id='nav'>
        <nav>
          <ul>
            <li>
              <a href='/' className="title">Certificate Validator</a>
            </li>
            <li className='link'>
              <Link to="/">
                <FontAwesomeIcon icon={faUsersBetweenLines} style={{color: "#ebecf0",}} />
                Organisation
              </Link>
            </li>
            <li className='link'>
              <FontAwesomeIcon icon={faUser} style={{color: "#ebecf0",}} />
              <Link to="/user">
                User
              </Link>
            </li>
            <li>
              <button className="enableEthereumButton" onClick={connectWebsite}>
                {connected ? "Connected" : "Connect Wallet"}
              </button>
            </li>
          </ul>

          <p className='text'>
            {currAddress !== "0xaa36a7" ? "Connected to" : "Not Connected. Please login"} {currAddress !== "0xaa36a7" ? (currAddress.substring(0, 15) + '...') : ""}
          </p>
        </nav>
      </div>
    </>
  );
}

export default Navbar;
