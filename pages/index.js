import React from 'react';
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"
import Image from 'next/image';

import {
  nftaddress, nftmarketaddress, rpcURL
} from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/Market.sol/NFTMarket.json'
// import MyToken from '../artifacts/contracts/MyToken.sol/MyToken.json'

export default function Home() {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  useEffect(() => {
    loadNFTs()
  }, [])
  
  async function loadNFTs() {    
    const provider = new ethers.providers.JsonRpcProvider(rpcURL)
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
    const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, provider)
    const data = await marketContract.fetchMarketItems()
    
    const items = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      console.log(tokenUri)
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description,
      }
      return item
    }))
    setNfts(items)
    setLoadingState('loaded') 
  }
  
  async function buyNft(nft) {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')
    const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
    const transaction = await marketContract.createMarketSale(nftaddress, nft.tokenId, {
      value: price
    })
    await transaction.wait()

    // const myTokenContract = new ethers.Contract(mytokenaddress, MyToken.abi, signer)
    // await myTokenContract.approve(nftmarketaddress, price)
    
    // const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
    // const transaction = await marketContract.createMarketSale_MyToken(nftaddress, mytokenaddress, nft.tokenId, price)
    // await transaction.wait()
    
    loadNFTs()
  }

  if (loadingState === 'loaded' && !nfts.length) return (<h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>)
  return (
    <section className="author-area">
      <div className="container">
          <div className="row">
              <div className="col-12">
                  {/* Intro */}
                  <div className="intro d-flex justify-content-between align-items-end m-0">
                      <div className="intro-content">
                          <span>GET STARTED</span>
                          <h3 className="mt-3 mb-0">Home</h3>
                      </div>
                  </div>
              </div>
          </div>
          <div className="row items">
              {
                nfts.map((nft, i) => {
                  return (<div key={i} className="col-12 col-sm-6 col-lg-3 item">
                      <div className="card">
                          <div className="image-over">
                              <a href="#">
                                  <Image className="card-img-top" src={nft.image} alt="" width={350} height={350}/>
                              </a>
                          </div>
                          {/* Card Caption */}
                          <div className="card-caption col-12 p-0">
                              {/* Card Body */}
                              <div className="card-body">
                                  <a href="#">
                                      <h5 className="mb-0">{nft.title}</h5>
                                  </a>
                                  <div className="seller d-flex align-items-center my-3">
                                      <span>Description</span>
                                      <a href="#">
                                          <h6 className="ml-2 mb-0">{nft.description}</h6>
                                      </a>
                                  </div>
                                  <div className="card-bottom d-flex justify-content-between">
                                      <span>Price {nft.price} ETH</span>
                                  </div>
                                  <a className="btn btn-bordered-white btn-smaller mt-3" onClick={() => buyNft(nft)}><i className="icon-handbag mr-2" />BUY</a>
                              </div>
                          </div>
                      </div>
                  </div>)
                })
              }
          </div>
      </div>
    </section>
  )
}