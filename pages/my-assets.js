/* pages/my-assets.js */
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"

import {
  nftmarketaddress, nftaddress
} from '../config'

import Market from '../artifacts/contracts/Market.sol/NFTMarket.json'
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'

export default function MyAssets() {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  useEffect(() => {
    loadNFTs()
  }, [])
  async function loadNFTs() {
    const web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
    })
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
    const data = await marketContract.fetchMyNFTs()
    
    const items = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
      }
      return item
    }))
    setNfts(items)
    setLoadingState('loaded') 
  }
  if (loadingState === 'loaded' && !nfts.length) return (
  <section className="author-area">
    <div className="container">
      <h1 className="py-10 px-20 text-3xl">No assets owned</h1>
    </div>
  </section>)
  return (

    <section className="author-area">
      <div className="container">
          <div className="row items">
              {nfts.map((nft, i) => {
                <div key={i} className="col-12 col-sm-6 col-lg-3 item">
                    <div className="card">
                        <div className="image-over">
                            <a href="#">
                                <img className="card-img-top" src={nft.image} alt="" />
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
                                    <span>Owned By</span>
                                    <a href="#">
                                        <h6 className="ml-2 mb-0">item.owner</h6>
                                    </a>
                                </div>
                                <div className="card-bottom d-flex justify-content-between">
                                    <span>{nft.price}</span>
                                    <span>3</span>
                                </div>
                                <a className="btn btn-bordered-white btn-smaller mt-3" href="#"><i className="icon-handbag mr-2" />{item.btnText}</a>
                            </div>
                        </div>
                    </div>
                </div>
              })}
          </div>
      </div>
  </section>

    // <div className="flex justify-center">
    //   <div className="p-4">
    //     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
    //       {
    //         nfts.map((nft, i) => (
    //           <div key={i} className="border shadow rounded-xl overflow-hidden">
    //             <img src={nft.image} className="rounded" />
    //             <div className="p-4 bg-black">
    //               <p className="text-2xl font-bold text-white">Price - {nft.price} Eth</p>
    //             </div>
    //           </div>
    //         ))
    //       }
    //     </div>
    //   </div>
    // </div>
  )
}



