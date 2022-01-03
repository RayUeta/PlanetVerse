import React, { useEffect, useState } from "react"
import ABI from './data/ABI.json'
import { ethers } from 'ethers'
import './WalletCard.css'
import detectEthereumProvider from '@metamask/detect-provider';
import mysteryLogo from "./images/WechatIMG210.png"
const WalletCard = () => {
  const deployNetwork = 'EthereumTestRinkeby'

  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState("Connect Wallet");
  const [contract, setContract] = useState(null);
  const [connectButtonText, setConnectButtonText] = useState("Connect Wallet")

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('chainChanged', () => {
        changeNetwork()
      })
      window.ethereum.on('accountChanged', () => {
        alert('account changed')
      })
    }
  })

  const networks = {
    EthereumTestRinkeby: {
      "chainId": `0x${Number(4).toString(16)}`,
    },
    EthereumMainNet: {
      "chainId": `0x${Number(1).toString(16)}`,
    }
  }


  const changeNetwork = async () => {
    try {
      if (!window.ethereum) {
        alert('You do not have metamask installed')
      }
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [
          {
            ...networks[deployNetwork]
          }
        ]
      })
    } catch (err) {
      alert(err.message)
    }
  }
  const nicePrintWallet = (walletString) => {
    return `${walletString.substring(0, 6)}....${walletString.substring(walletString.length - 7)}`
  }

  const connectWalletHandler = () => {
    if (window.ethereum) {
      //metamask installed
      window.ethereum.request({ method: 'eth_requestAccounts' })
        .then(result => {

          accountChangedHandler(nicePrintWallet(result[0]));
        })
    } else {
      setErrorMessage('Metamast is not found');
    }


  }



  const accountChangedHandler = (newAccount) => {
    setDefaultAccount(newAccount)
  }

  const mintButtonHandler = async () => {
    try {
      const { ethereum } = window;
      const chainId = await ethereum.request({ method: 'eth_chainId' });
      if (chainId != networks[deployNetwork]['chainId']) {
        alert(`make sure you are on ${deployNetwork} and try again`)
        changeNetwork()
      } else {
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum)
          const signer = provider.getSigner()
          const nftContract = new ethers.Contract('0xF5B6e48A6fbad96eEF0161b18a8AFC90ECF47149', ABI, signer);
          console.log('initialize payment')

          let nftTxn = await nftContract.mint(1, { value: ethers.utils.parseEther("0.01"), gasLimit: 3000000 })

          console.log('minting...')
          await nftTxn.wait()

          alert(`minted! see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`)
        } else {
          alert('etherum object not found')
        }

      }


    } catch (err) {
      console.log(err)
    }
  }



  return (

    <body className="body">
      <div data-collapse="medium" data-animation="default" data-duration="400" data-easing="ease" data-easing2="ease" role="banner" className="navigation w-nav">
        <div className="navigation-wrap">
          <a href="index.html" aria-current="page" className="logo-link w-nav-brand w--current"><img src="images/business-logo2x.png" width="108" alt="" className="logo-image"/></a>
        </div>
        <div>
          <button className="button cc-contact-us" onClick={connectWalletHandler}><span className="buttontext">{defaultAccount}</span></button>
        </div>
      </div>
      <div className="intro-header">
        <div className="div-block-3"><img src={mysteryLogo} className="image-2"/>
          <div className="button cc-white-button" onClick={mintButtonHandler}>MINT</div>
        </div>
      </div>
      <div className="div-block-2">
        <h2>What is the PlanetVerse?</h2>
        <p className="paragraph">PlanetVerse is a Defi + NFT project deployed on ETH with the main focus on NFT and Metaverse “BSaS” incubation that allow the outcome of NFT development standards, diverse user experience, and application values into a series of standard smart contracts. As a new-leader in the NFT SECTOR, PlanetVerse is able to provide NFT developer teams, artists and art show a platform to create easy and quick combinations of NFT products</p>
      </div>
      <div className="div-block-2">
        <h2>What is the PlanetVerse?</h2>
        <p className="paragraph">PlanetVerse is a Defi + NFT project deployed on ETH with the main focus on NFT and Metaverse “BSaS” incubation that allow the outcome of NFT development standards, diverse user experience, and application values into a series of standard smart contracts. As a new-leader in the NFT SECTOR, PlanetVerse is able to provide NFT developer teams, artists and art show a platform to create easy and quick combinations of NFT products</p>
      </div>
      <div className="div-block-2">
        <h2>What is the PlanetVerse?</h2>
        <p className="paragraph">PlanetVerse is a Defi + NFT project deployed on ETH with the main focus on NFT and Metaverse “BSaS” incubation that allow the outcome of NFT development standards, diverse user experience, and application values into a series of standard smart contracts. As a new-leader in the NFT SECTOR, PlanetVerse is able to provide NFT developer teams, artists and art show a platform to create easy and quick combinations of NFT products</p>
      </div>
      <div className="section">
        <div className="container"></div>
      </div>
    
    </body>
  )
}

export default WalletCard