import React, { useEffect, useState } from "react";
import './styles/App.css';
import { ethers } from "ethers";
import twitterLogo from './assets/twitter-logo.svg';
import textbookNft from './utils/TextbookNFT.json';


const TWITTER_HANDLE1 = 'aantonop';
const TWITTER_LINK1 = `https://twitter.com/${TWITTER_HANDLE1}`;
const TWITTER_HANDLE2 = 'gavofyork';
const TWITTER_LINK2 = `https://twitter.com/${TWITTER_HANDLE2}`;
const OPENSEA_LINK = '';
const TOTAL_MINT_COUNT = 50;

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [mintFlag, setMintFlag] =useState(false);
  const [finishFlag, setFinishFlag] =useState(false);
  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account)
    } else {
      console.log("No authorized account found")
    }
  }

  /*
  * Implement your connectWallet method here
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      /*
      * Fancy method to request access to account.
      */
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      /*
      * Boom! This should print out public address once we authorize Metamask.
      */
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]); 
    } catch (error) {
      console.log(error)
    }
  }
  const askContractToMintNft = async () => {
  const CONTRACT_ADDRESS = "0x86215c9ed4Cc25F98909e8c53CAC5B6391b34ed5";

  try {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, textbookNft.abi, signer);

      console.log("Going to pop wallet now to pay gas...")
      let nftTxn = await connectedContract.makeNFT();

      console.log("Mining...please wait.")
      await nftTxn.wait();
      
      console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
      setMintFlag(true);

    } else {
      console.log("Ethereum object doesn't exist!");
    }
  } catch (error) {
    console.log(error)
  }
}
  const askContractToReadNft = async () => {
  const CONTRACT_ADDRESS = "0x86215c9ed4Cc25F98909e8c53CAC5B6391b34ed5";

  try {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, textbookNft.abi, signer);

      console.log("Going to pop wallet now to pay gas...")
      let nftTxn = await connectedContract.readTextbook();

      console.log("Processing...please wait.")
      await nftTxn.wait();
      
      console.log(`Finished, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);

      setFinishFlag(true);

    } else {
      console.log("Ethereum object doesn't exist!");
    }
  } catch (error) {
    console.log(error)
  }
}

  // Render Methods
  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  /*
  * Added a conditional render! We don't want to show Connect to Wallet if we're already conencted :).
  */
  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">Mastering Ethereum</p>
          <p className="sub-text">
            01. What Is Ethereum?
          </p>
          
        </div>

         <div>
        {currentAccount === "" ? (
            renderNotConnectedContainer()
          ) : (
            <button onClick={askContractToMintNft} className="cta-button connect-wallet-button">
              Mint NFT
            </button>
          )}
        </div>
        <div className="body">
        {!mintFlag ? (<p></p>):(
          <a 
          className="sub-text"
          href='https://github.com/ethereumbook/ethereumbook/blob/c5ddebd3dbec804463c86d0ae2de9f28fbafb83a/01what-is.asciidoc' 
          target="_blank"
          >
          Jump to a page
          </a>
          )}
        </div>
       
        <div>
        { !mintFlag || finishFlag ? (
            <p></p>
          ) : (
            <button onClick={askContractToReadNft} className="cta-button connect-wallet-button">
              Finish
            </button>
          )}
        </div>

        <div>
        { !finishFlag ? (
            <p></p>
          ) : (
            <p className="header gradient-text">
              Congrats!!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;