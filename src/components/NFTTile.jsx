import { GetIpfsUrlFromPinata } from "../utils";
import styles from "@styles/tile.module.scss";
function NFTTile (data) {
const IPFSUrl = GetIpfsUrlFromPinata(data.data.image);

    return (
        <>

        <div id={styles.tile}>
            {/*<div >*/}
            <img src={IPFSUrl} alt="Not able to fetch the image please try again"/>
            {/*</div>  */}
            <div>
                {/*<p>Issuer of the Certificate : Name of Organisation</p>*/}
                <p>Public address of the Issuer : {data.data.creator}</p>
                {/*<p>Holder of the Certificate : Name of Student</p>*/}
                <p>Public address of the Certificate holder : {data.data.user}</p>
            </div>
        </div>
        
        </>
    )
}

export default NFTTile;
