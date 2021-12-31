import React, {useState} from "react"
import ABI from './data/ABI.json'
import {ethers} from 'ethers'
const WalletCard = () => {

    const [errorMessage, setErrorMessage] = useState(null);
    const [defaultAccount, setDefaultAccount] = useState(null);
    const [contract, setContract] = useState(null);
    const [connectButtonText, setConnectButtonText] = useState("Connect Wallet")


    const connectWalletHandler = () =>{
        if (window.ethereum) {
            //metamask installed
            window.ethereum.request({method: 'eth_requestAccounts'})
            .then(result => {
                accountChangedHandler(result[0]);
            })
        } else{
            setErrorMessage('Metamast is not found');
        }


    }



    const accountChangedHandler = (newAccount) => {
        setDefaultAccount(newAccount)
    }

    const mintButtonHandler = async () => {
        alert('mint')
        try{
            const {ethereum} = window;
            if(ethereum){
                const provider = new ethers.providers.Web3Provider(ethereum)
                const signer = provider.getSigner()
                const nftContract = new ethers.Contract('0x98B6585Cc06f1403585a90a07B9260ed750FA56b', ABI, signer);
                console.log('initialize payment')

                let nftTxn = await nftContract.mint(1, {value:ethers.utils.parseEther("0.00")})

                console.log('minting...')
                await nftTxn.wait()

                alert(`minted! see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`)
            }else{
                alert('etherum object not found')
            }
        }catch(err){
            console.log(err)
        }
    }


    return (
        <div>
            <h4>Connect to MetaMask</h4>
            <button onClick={connectWalletHandler}>{connectButtonText}</button>
            <div>
                <h3>Connected To: {defaultAccount}</h3>
            </div>
            <button onClick={mintButtonHandler}>mint</button>
        </div>
    )
}

export default WalletCard