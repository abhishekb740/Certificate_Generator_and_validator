import axios from "axios";
import { ethers } from "ethers";
import { useState } from "react";
import Marketplace from '../ABI/abi.json';
import { GetIpfsUrlFromPinata } from "../utils";
import NFTTile from "./NFTTile";
import styles from '@styles/user.module.scss';

function User() {
  const [address, setAddress] = useState();
  const [data, updateData] = useState([]);
  const [, updateFetched] = useState(false);
  async function showCertificates() {
    //console.log("hello");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    let contract = new ethers.Contract(Marketplace.address, Marketplace.abi, signer);
    let transaction = await contract.getUserCertificates(address);
    console.log(transaction);
    const items = await Promise.all(transaction.map(async i => {
      console.log(i.tokenId)
      var tokenURI = await contract.tokenURI(i.tokenId);
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
    updateFetched(true);
    updateData(items);
  }
  return (
    <>
      <div id={styles.user}>
        <input 
          type="text" 
          placeholder="Enter your public address"
          value={address} 
          onChange={(e) => { setAddress(e.target.value) }} 
        />
        <button onClick={showCertificates}>See my Certificates</button>
      </div>
      <div>
        {data.map((value, index) =>
          <NFTTile data={value} key={index}></NFTTile>
        )}
      </div>
    </>
  );
}

export default User;
