import React, { useContext, useState, useEffect } from 'react';
import { GetDebugLvl } from "../config/Entorno";
import { useTranslation } from 'react-i18next';
import UserContext from '../contexts/UserContext';
import { ethers } from "ethers";
import SanzUSDC from "../config/SanzUSDC.json"
import ModalCargando from '../modals/ModalCargando';

export default function Home() {
	// eslint-disable-next-line
	const DebugLvl = GetDebugLvl();
	const { t,i18n } = useTranslation();
	const { userCtx, UpdateSaldo } = useContext(UserContext)
	const [ UserETH , SetUserETH] = useState(0);
	const [EstadoSendCoins, SetEstadoSendCoins] = useState(false);
	const [EstadoMinteando, SetEstadoMinteando] = useState(false);

	const AddToken = async () => {
		if (window?.ethereum) {
			try {
				window.ethereum.request({
					method: 'wallet_watchAsset',
					params:
						{
							type: 'ERC20',
							options: {
								address: process.env.REACT_APP_SANZUDSC,
								symbol: 'USDC',
								decimals: 2
							}
						}
				})
			} catch (error) {
				console.error(error);
			}
		}
	};

	const MintTokens = async () => {
		SetEstadoSendCoins(true)
		if (window?.ethereum) {
			try {
				SetEstadoSendCoins(true)
				const provider = new ethers.providers.Web3Provider(window.ethereum);
				const signer = provider.getSigner()
				const ContratoUSDC = new ethers.Contract(process.env.REACT_APP_SANZUDSC, SanzUSDC, provider)
				const ContratoNFTWithSigner = ContratoUSDC.connect(signer);
				const nonce = await signer.getTransactionCount()
				if (DebugLvl >= 2) console.log("nonce (MintTokens):",nonce)
				const RespContrato = await ContratoNFTWithSigner.mint(5000 * (10 ** 2),{nonce:nonce + 1 })
				SetEstadoSendCoins(false)
				SetEstadoMinteando(true)
				await provider.waitForTransaction(RespContrato['hash'])
				await UpdateSaldo()
				SetEstadoMinteando(false)
			}catch(err){
				if (err.code === "ACTION_REJECTED"){
					console.error("MintTokens: User Denied Transaction")
				}else if (err.code === -32603){
						alert(t("RedSaturada"))
				}else{
					console.error("MintTokens: CatchCall:",err)
				}
			}
			SetEstadoSendCoins(false)
			SetEstadoMinteando(false)
		}
	}

	const SaldoETH = async () => {
		if ((window?.ethereum) && (userCtx.account !== null)) {
			try{
				const provider = new ethers.providers.Web3Provider(window.ethereum);
				let Balance = await provider.getBalance(userCtx.account)
				SetUserETH(Balance / (10 ** 18))
			}catch{
				SetUserETH(0)
			}
		}
	}

	const GetETH = async () => {
		if (window?.ethereum) {
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			await SaldoETH()
			if (DebugLvl >= 2) console.log("Balance (GetETH):",UserETH)
			if (UserETH > 0.02){
				alert(t("Max Goerli ETH"))
				return
			}			
			SetEstadoMinteando(true)
			try {
				const WriterWallet = new ethers.Wallet(process.env.REACT_APP_FAUCET_SECRET, provider);
				const Tx = await WriterWallet.sendTransaction({to:userCtx.account,value: ethers.utils.parseEther("0.02")})
				if (DebugLvl >= 2) console.log("Tx (GetETH):",Tx)
				await WaitTX(Tx)
				await SaldoETH()
			}catch(err){
				console.error("GetETH: CatchCall:",err)
			}
			SetEstadoMinteando(false)
		}
	}

	const WaitTX = async (_TX) => {
		try {
			const TxReceipt = await _TX.wait()
			if (DebugLvl >= 2) { console.log("TxReceipt: ", TxReceipt) }
			return TxReceipt
		} catch (err) {
			if (DebugLvl >= 2) { console.log("WaitTX: Error: ", err) }
			return false
		}
	}

	useEffect(() => {
		if (userCtx.account !== null) {
			SaldoETH()
		}
	// eslint-disable-next-line
	}, [userCtx.account])

	return (
		<div className="mt-4 text-center flex-1 overflow-hidden">
			{EstadoSendCoins ? <ModalCargando Imagen='Metamask' Scale="scale-75"/> : <></>}
			{EstadoMinteando ? <ModalCargando Imagen='MintIMG'/> : <></>}
			<div className="flex-1 mt-4">
				{
					i18n.language === "es"
					? <p>
						Ejemplo de como se puede hacer una tienda con ReactJS y pagar en Crypto los productos.<br/>
						Todo se hace desde la Blockchain de pruebas de Ethereum, "Goerli"<br/>
						Esto es una prueba y todos los productos aquí mostrados no serán enviados<br/>
						<br/><br/>
					</p>
					: <p>
						Example of how you can make a store with ReactJS and pay for the products in Crypto.<br/>
						Everything is done from the Ethereum TestNet Blockchain, "Goerli"<br/>
						This is a test and all the products shown here will not be shipped<br/>
					</p>
				}
				<div className="mt-5">
					{
						userCtx.account === null
						? <span className=''>{t("Connect to Metamask to receive free SanzUSDC tokens")}</span>
						: <div>
							<div className='m-5'>
								{
									UserETH < 0.02
									? <button onClick={() => GetETH()} className='menu-item border-blue-700 border rounded p-1 bg-gray-800 hover:border-white'>{t("Get Goerli ETH")}</button>
									: <button className='menu-item-disabled border-blue-700 border rounded p-1 bg-gray-800 hover:border-white'>{t("Get Goerli ETH")}</button>
								}
							</div>
							<div>
								{
									userCtx.saldo < 5000
									? <button onClick={() => MintTokens()} className='menu-item border-blue-700 border rounded p-1 bg-gray-800 hover:border-white'>{t("Get TestNet USDC")}</button>
									: <button className='menu-item-disabled border-blue-700 border rounded p-1 bg-gray-800 hover:border-white'>{t("Get TestNet USDC")}</button>
								}
								
							</div>
							<div className='m-5'>
								<button onClick={() => AddToken()} className='menu-item border-red-600 border rounded p-1 bg-gray-800 hover:border-white'>{t("Add SanzUSDC to Metamask")}</button>
							</div>
						</div>	
					}
				</div>
			</div>
		</div>
	);
}
