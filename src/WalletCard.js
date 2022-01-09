import React, { useEffect, useState } from "react"
import ABI from './data/ABI.json'
import { ethers } from 'ethers'
import './WalletCard.css'

import logo from "./images/planetverselogo.png"
import m1 from "./mimgs/61.png"
import m2 from "./mimgs/64.png"
import m3 from "./mimgs/69.png"
import m4 from "./mimgs/72.png"
import m5 from "./mimgs/81.png"
import m6 from "./mimgs/87.png"



import Marquee from "react-fast-marquee"
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

    document.title = "PlanetVerse"
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
          <a href="index.html" aria-current="page" className="logo-link w-nav-brand w--current"><img src={logo} alt="" className="logo-image"/></a>
        </div>
        <div>
          <button className="button cc-white-button" onClick={connectWalletHandler}><span className="buttontext">{defaultAccount}</span></button>
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
        <h2>Featuringing Taskakians</h2>
        <p className="paragraph">The Taskskian race was a proud race of scientists and geneticists who was driven off world by their scientific perfectionism eventually destroying their planet when a toxic form of life called driblet forms from constant experimentation on the planet life. To not only expand their scientific endeavors but find a new home the Taskskian created the Arc in search of a new home. </p>
      </div>
      <div className="div-block-2">
        <p className="paragraph">Life aboard the ship is mostly grungy with hailing frequencies left on repeat to daily ship tasks, everyone has a tight and monitored schedule, rules are tight aboard the arc with a strict system of dos and do nots with certain roles given to certain people for maintenance for the ship. </p>
      </div>
      <div className="div-block-2">
        <p className="paragraph">The Higher maintenance the higher the status aboard the ship smaller subs ships are also sent out for trade like the Grade C Hizon with a purple tinge to it and four large turbine like engine in the back it’s general purpose is a merchant class vessel as the Taskskian have no dedicated military ships. Most of the larger merchant or Science vessels have at least one green house for plants since Taskskian are mainly vegetarian due to how the oils in their body consume certain substances. Ships like the Grade C normally have a passenger shuttle for moving groups of scientists or diplomats from or too a planets or ships surface.</p>
      </div>
      <div className="div-block-2">
        <p className="paragraph">The Taskskian are blob like yet still take a humanoid like shape due to their evolution, their brains are visible from outside their thick gelatinous shapes. They often wear tank like suits of clothing to encase their gelatinous shapes.
  
  The Taskskian mission is to find if other Taskskian had survived out on other far off planets , so far nothing has been found. Though the mission still continues with the eventual hopes of finding a new home and finding there brother and sisters far off amongst the stars
   </p>
      </div>


      <div className="section">
        <div className="container"></div>
      </div>
    
    </body>
  )
}

export default WalletCard