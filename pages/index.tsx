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
  let [videoPlaying, setVideoPlaying] = useState(false);

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

        {/* Favicons */}
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />

        {/* Open Graph / Social Preview */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Microcosm #22 PartyBid" />
        <meta property="og:description" content="Participated in the Microcosm #22 PartyBid? Claim your party collectible" />
        <meta property="og:image" content="/thumbnail.png" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Microcosm #22 PartyBid" />
        <meta name="twitter:description" content="Participated in the Microcosm #22 PartyBid? Claim your party collectible" />
        <meta name="twitter:image" content="/thumbnail.png" />
      </Head>

      <main className={styles.header}>
        <h1 className={styles.title}>Microcosm #22 PartyBid</h1>

        <div className={styles.imageWrapper}>
          {videoPlaying ? (
            <video autoPlay loop style={{ width: '800px', maxWidth: '90vw', height: 'auto', aspectRatio: '1' }}>
              <source src="https://succcpsttod4xbn3eh2yxsqwxqatf3fwuk7lufvgrydshuay4yka.arweave.net/lQQhPlObh8uFuyH1i8oWvAEy7LaivroWpo4HI9AY5hQ" type="video/mp4" />
            </video>
          ) : (
            <div
              onClick={() => setVideoPlaying(true)}
              style={{ position: 'relative', cursor: 'pointer', width: '800px', maxWidth: '90vw' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/thumbnail.png"
                alt="Microcosm #22"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '80px',
                height: '80px',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <div style={{
                  width: 0,
                  height: 0,
                  borderTop: '20px solid transparent',
                  borderBottom: '20px solid transparent',
                  borderLeft: '30px solid white',
                  marginLeft: '8px',
                }} />
              </div>
            </div>
          )}
        </div>
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
