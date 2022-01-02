import React, { useEffect, useState } from "react"
import ABI from './data/ABI.json'
import { ethers } from 'ethers'
import './WalletCard.css'
import detectEthereumProvider from '@metamask/detect-provider';
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
    return `${walletString.substring(0,6)}....${walletString.substring(walletString.length - 7)}`
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
    <body>
      <div data-collapse="medium" data-animation="default" data-duration="400" data-easing="ease" data-easing2="ease" role="banner" className="navigation w-nav">
        <div className="navigation-wrap">
          <a href="index.html" aria-current="page" className="logo-link w-nav-brand w--current"><img src="images/business-logo2x.png" width="108" alt="" className="logo-image" /></a>
        </div>
        <div>
          <button className="button cc-contact-us" onClick={connectWalletHandler}><span className="buttontext">{defaultAccount}</span></button>
        </div>
      </div>
      <div className="intro-header">
        <div className="button cc-white-button" onClick={mintButtonHandler}>MINT</div>
      </div>
      <div className="div-block-2">
        <h1>Heading</h1><img src="images/placeholder-2.svg" loading="lazy" width="700" alt="" className="image" />
      </div>
      <div className="section">
        <div className="container"></div>
      </div>
      <div className="section cc-cta">
        <div className="container">
          <div className="cta-wrap">
            <div>
              <div className="cta-text">
                <div className="heading-jumbo-small">Grow your business.<br /></div>
                <div className="paragraph-bigger cc-bigger-light">Today is the day to build the business of your dreams. Share your mission with the world — and blow your customers away.<br /></div>
              </div>
              <a className="button cc-jumbo-button w-inline-block">
                <div>Start Now</div>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="section">
        <div className="container">
          <div className="footer-wrap">
            <a href="https://webflow.com/" target="_blank" className="webflow-link w-inline-block"><img src="images/webflow-w-small2x_1webflow-w-small2x.png" width="15" alt="" className="webflow-logo-tiny" />
              <div className="paragraph-tiny">Powered by Webflow</div>
            </a>
          </div>
        </div>
      </div>

    </body>
  )
}

export default WalletCard