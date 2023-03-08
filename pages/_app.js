/* pages/_app.js */
import '../styles/globals.css'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import Web3Modal from 'web3modal'
import { ethers } from 'ethers'

function MyApp({ Component, pageProps }) {

  // const [connecting, setConnecting] = useState(false);
  const [address, setAddress] = useState(null);
  
  async function _connectWallet() {
    const web3Modal = new Web3Modal()
    
    const connection = await web3Modal.connect()
    
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner();
    const wallet = await signer.getAddress();
    const tempwallet = wallet.slice(0,5) + "..." + wallet.slice(-3)
    setAddress(tempwallet)
    
  }

  return (
    <div className="main">
      <header id="header">
            {/* Navbar */}
            <nav data-aos="zoom-out" data-aos-delay={800} className="navbar navbar-expand">
                <div className="container header">
                    {/* Navbar Brand*/}
                    <Link href="/">
                      <a className="navbar-brand">
                        <Image className="navbar-brand-sticky" src="/img/logo.png" alt="sticky brand-logo" width={75} height={75}/>
                      </a>
                    </Link>
                    <div className="ml-auto" />
                    {/* Navbar */}
                    <ul className="navbar-nav items mx-auto">
                        <li className="nav-item">
                          <Link href="/">
                            <a className="nav-link">Home</a>
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link href="/create-item">
                            <a className="nav-link">Create Item</a>
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link href="/creator-dashboard">
                            <a className="nav-link">Creator Dashboard</a>
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link href="/my-assets">
                            <a className="nav-link">My Digital Assets</a>
                          </Link>
                        </li>
                    </ul>
                    {/* Navbar Icons */}
                    <ul className="navbar-nav icons">
                        <li className="nav-item">
                            <a href="#" className="nav-link" data-toggle="modal" data-target="#search">
                                <i className="fas fa-search" />
                            </a>
                        </li>
                    </ul>
                    {/* Navbar Toggler */}
                    <ul className="navbar-nav toggle">
                        <li className="nav-item">
                            <a href="#" className="nav-link" data-toggle="modal" data-target="#menu">
                                <i className="fas fa-bars toggle-icon m-0" />
                            </a>
                        </li>
                    </ul>
                    {/* Navbar Action Button */}
                    <ul className="navbar-nav action">
                        <li className="nav-item ml-3">
                          {!address && (
                              <a className="btn ml-lg-auto btn-bordered-white" onClick={_connectWallet}><i className="icon-wallet mr-md-2" />Wallet Connect</a>
                          )}
                          {address && (
                              <span className="btn ml-lg-auto btn-bordered-white"><i className="icon-wallet mr-md-2" />{address}</span>
                          )}
                          
                        </li>
                    </ul>
                    
                </div>
            </nav>
        </header>
      <Component {...pageProps} />

      <div id="menu" className="modal fade p-0">
        <div className="modal-dialog dialog-animated">
            <div className="modal-content h-100">
                <div className="modal-header" data-dismiss="modal">
                    Menu <i className="far fa-times-circle icon-close" />
                </div>
                <div className="menu modal-body">
                    <div className="row w-100">
                        <div className="items p-0 col-12 text-center" />
                    </div>
                </div>
            </div>
        </div>
        </div>
      {/* <nav className="border-b p-6">
        <p className="text-4xl font-bold">Metaverse Marketplace</p>
        <div className="flex mt-4">
          <Link href="/">
            <a className="mr-4 text-pink-500">
              Home
            </a>
          </Link>
          <Link href="/create-item">
            <a className="mr-6 text-pink-500">
              Sell Digital Asset
            </a>
          </Link>
          <Link href="/my-assets">
            <a className="mr-6 text-pink-500">
              My Digital Assets
            </a>
          </Link>
          <Link href="/creator-dashboard">
            <a className="mr-6 text-pink-500">
              Creator Dashboard
            </a>
          </Link>
          <Link href="/components/Create/Create">
            <a className="mr-6 text-pink-500">
              Create
            </a>
          </Link>
        </div>
      </nav> */}
      
      
    </div>
  )
}

export default MyApp
