import React, { useState, useEffect } from 'react';
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import PartyBidMicrocosm22 from "../artifacts/contracts/PartyBidMicrocosm22.sol/PartyBidMicrocosm22.json";

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: process.env.NEXT_PUBLIC_INFURA
    }
  }
}

export default function Home() {
  let [web3, setWeb3] = useState<any>({});
  let [account, setAccount] = useState('');
  let [chainId, setChainId] = useState(0);
  let [hasBalance, setHasBalance] = useState(false);
  let [hasMinted, setHasMinted] = useState(true);
  let [claimed, setClaimed] = useState(false);
  let [claiming, setClaiming] = useState(false);

  let web3Modal: any
  if (process.browser) {
    web3Modal = new Web3Modal({
      cacheProvider: true,
      theme: 'dark',
      providerOptions
    });
  }

  // FIXME replace with prodcution contract URL
  // currentlyt using dev address
  // const contractAddress = '0xdd75fed2b89fc0ed5a955f6856a44dcc9e453ae3';
  const contractAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';

  const claimToken = async () => {
    setClaiming(true);
    const Contract = new web3.eth.Contract(PartyBidMicrocosm22.abi, contractAddress);
    await Contract.methods.mintCollectible().send({ from: account });
    setClaiming(false);
    setClaimed(true);
  }

  const connect = async () => {
    try {
      if (process.browser) {
        let provider = await web3Modal.connect();
        setWeb3(new Web3(provider));
        let web3: any = new Web3(provider);
        let chain = await web3.eth.getChainId();

        let Contract = new web3.eth.Contract(PartyBidMicrocosm22.abi, contractAddress);
        console.log("Contract", Contract)

        let accounts = await web3.eth.getAccounts()
        let balance = await Contract.methods.hasBalance().call({ from: accounts[0] })
        let minted = await Contract.methods.minted(accounts[0]).call({ from: accounts[0] })

        setAccount(accounts[0]);
        setChainId(chain);
        setHasBalance(balance)
        setHasMinted(minted)
      }
    } catch (err) {
      console.log('Err: ', err);
    }
  }
  const bottomButton = () => {
    if (claiming) {
      return <h5 className={styles.description}>NFT being claimed...</h5>
    } if (claimed) {
      return <h4 className={[styles.win, styles.tada].join(' ')}>Party collectible claimed!</h4>
    } else if (account === '') {
      return <button className={styles.btn} onClick={connect} >Connect Wallet </button>
    } else if (chainId !== 1) {
      return <h5 className={styles.description}> Please connect to the Ethereum Network</h5>
    } else if (!hasBalance) {
      return <h5 className={styles.description}>You must have participated in the Microcosm #22 PartyBid</h5>
    } else if (hasMinted) {
      return <h5 className={styles.description}>You have already claimed</h5>
    } else {
      return <button className={styles.btn} onClick={claimToken} >Claim NFT</button>
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Microcosm #22 PartyBid</title>
        <meta name="description" content="Participated in the Microcosm #22 PartyBid? Claim your party collectible" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.header}>
        <h1 className={styles.title}>Microcosm #22 PartyBid</h1>

        <a href="https://foundation.app/@JenStark_Vault/cosmos/22" target="_blank" rel="noreferrer">
          <div className={styles.imageWrapper}>
            <video autoPlay loop style={{ width: '800px', height: '800px' }}>
              <source src="https://succcpsttod4xbn3eh2yxsqwxqatf3fwuk7lufvgrydshuay4yka.arweave.net/lQQhPlObh8uFuyH1i8oWvAEy7LaivroWpo4HI9AY5hQ" type="video/mp4" />
            </video>
          </div>
        </a>
        <h5 className={[styles.description, styles.descriptionSize].join(' ')}>
          Did you participate in the <a href="https://www.partybid.app/party/0x5dCc03D9A613E59db4751D1071dBAF3cAEDFFd30">Microcosm #22 PartyBid</a>?
          <br />
          Claim your party collectible today
        </h5>
        {bottomButton()}
      </main>

      <footer className={styles.footer}>
      </footer>
    </div>
  )
}
