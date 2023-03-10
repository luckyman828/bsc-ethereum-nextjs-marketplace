/* pages/create-item.js */
import { useState } from 'react'
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { useRouter } from 'next/router'
import Web3Modal from 'web3modal'
import Image from 'next/image'

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

import {
  nftaddress, nftmarketaddress
} from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/Market.sol/NFTMarket.json'

export default function CreateItem() {
  const [minting, setMinting] = useState(true);
  
  const [fileUrl, setFileUrl] = useState(null)
  const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })
  const router = useRouter()
  
  async function onChange(e) {
    
    const file = e.target.files[0]
    setMinting(false);
    try {
      const added = await client.add(
        file,
        {
          progress: (prog) => console.log(`received: ${prog}`)
        }
      )
      setMinting(true);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      console.log(url)
      setFileUrl(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }
  
  async function createMarket() {
    
    const { name, description, price } = formInput
    if (!name || !description || !price || !fileUrl) 
    {
      alert("Please input all fields")
      return
    }
      
    /* first, upload to IPFS */
    const data = JSON.stringify({
      name, description, image: fileUrl, itemOwner: await window.ethereum.enable()
    })
    try {
      const added = await client.add(data)
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      /* after file is uploaded to IPFS, pass the URL to save it on Polygon */
      createSale(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }

  async function createSale(url) {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)    
    const signer = provider.getSigner()

    /* next, create the item */
    let contract = new ethers.Contract(nftaddress, NFT.abi, signer)
    
    let transaction = await contract.createToken(url)
    let tx = await transaction.wait()
    let event = tx.events[0]
    let value = event.args[2]
    let tokenId = value.toNumber()
    const price = ethers.utils.parseUnits(formInput.price, 'ether')
    /* then list the item for sale on the marketplace */
    contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
    let listingPrice = await contract.getListingPrice()
    listingPrice = listingPrice.toString()
    console.log("step3")
    transaction = await contract.createMarketItem(nftaddress, tokenId, price, { value: listingPrice })
    console.log("step4")
    await transaction.wait()
    console.log("step5")
    router.push('/')
  }

  async function inputChanged() {

  }

  return (
    <section className="author-area">
      <div className="container">
        <div className="row justify-content-center">
            <div className="col-sm-12 col-md-6">
                {/* Intro */}
                <div className="intro mt-5 mt-lg-0 mb-4 mb-lg-5">
                    <div className="intro-content">
                        <span>Create Item</span>
                        
                    </div>
                </div>
                {/* Item Form */}
                <form className="item-form card no-hover">
                    <div className="row">
                        <div className="col-12">
                            <div className="form-group mt-3">
                                <input type="text" className="form-control" name="name" placeholder="Item Name" required="required" onChange={e => updateFormInput({ ...formInput, name: e.target.value })} />
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="form-group">
                                <textarea className="form-control" name="textarea" placeholder="Description" cols={30} rows={3} defaultValue={""} onChange={e => updateFormInput({ ...formInput, description: e.target.value })}/>
                            </div>
                        </div>
                        <div className="col-12 col-md-6">
                            <div className="form-group">
                                <input type="text" className="form-control" name="price" placeholder="Item Price" required="required" onChange={e => updateFormInput({ ...formInput, price: e.target.value })} />
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="input-group form-group">
                                <div className="custom-file">
                                    <input type="file" className="custom-file-input" id="inputGroupFile01" onChange={onChange} />
                                    <label className="custom-file-label" htmlFor="inputGroupFile01">Choose file</label>
                                </div>
                            </div>
                        </div>
                        {
                          fileUrl && (
                            <div className="row col-12 justify-content-center">
                              <div className="blog-thumb col-12 mt-3">
                                <Image className="w-80 " src={fileUrl} alt="" width={350} height={350} />
                              </div>
                            </div>
                          )
                        }
                        <div className="col-12">
                          {minting && (
                              <button className="btn w-100 mt-3 mt-sm-4" type="button" onClick={createMarket}>Create Item</button>
                          )}
                          {!minting && (
                              <span className="btn w-100 mt-3 mt-sm-4 disabled">Uploading...</span>
                          )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
      </div>
    </section>
    // <div className="flex justify-center">
    //   <div className="w-1/2 flex flex-col pb-12">
    //     <input 
    //       placeholder="Asset Name"
    //       className="mt-8 border rounded p-4"
    //       onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
    //     />
    //     <textarea
    //       placeholder="Asset Description"
    //       className="mt-2 border rounded p-4"
    //       onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
    //     />
    //     <input
    //       placeholder="Asset Price in Eth"
    //       className="mt-2 border rounded p-4"
    //       onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
    //     />
    //     <input
    //       type="file"
    //       name="Asset"
    //       className="my-4"
    //       onChange={onChange}
    //     />
    //     {
    //       fileUrl && (
    //         <img className="rounded mt-4" width="350" src={fileUrl} />
    //       )
    //     }
    //     <button onClick={createMarket} className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg">
    //       Create Digital Asset
    //     </button>
    //   </div>
    // </div>
  )
}
