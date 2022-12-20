import React, { useContext, useState } from 'react';
import { GetDebugLvl } from "../config/Entorno";
import { useTranslation } from 'react-i18next';
import UserContext from '../contexts/UserContext';
import { ethers } from "ethers";
import SanzUSDC from "../config/SanzUSDC.json"
import ModalCargando from '../modals/ModalCargando';
import GetGasFees from "../config/api";

export default function Home() {
	// eslint-disable-next-line
	const DebugLvl = GetDebugLvl();
	if (DebugLvl >= 2) console.log("Carga: Home");
	const { t,i18n } = useTranslation();
	const { userCtx } = useContext(UserContext)
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
				const { maxFeePerGas, maxPriorityFeePerGas } = await GetGasFees()
				const signer = provider.getSigner()
				const ContratoUSDC = new ethers.Contract(process.env.REACT_APP_SANZUDSC, SanzUSDC, provider)
				const ContratoNFTWithSigner = ContratoUSDC.connect(signer);
				const nonce = await signer.getTransactionCount()
				if (DebugLvl >= 2) console.log("nonce (MintTokens): " + nonce)
				if (DebugLvl >= 2) console.log("maxFeePerGas (MintTokens): " + maxFeePerGas)
				if (DebugLvl >= 2) console.log("maxPriorityFeePerGas (MintTokens): " + maxPriorityFeePerGas)
				const RespContrato = await ContratoNFTWithSigner.mint(100 * (10 ** 2),{ maxFeePerGas:maxFeePerGas, maxPriorityFeePerGas:maxPriorityFeePerGas,nonce:nonce + 1 })
				SetEstadoSendCoins(false)
				SetEstadoMinteando(true)
				await provider.waitForTransaction(RespContrato['hash'])
				SetEstadoMinteando(false)
			}catch(err){
				if (err.message !== 'MetaMask Tx Signature: User denied transaction signature.'){
					console.log("MintTokens: CatchCall: " + err.message)
				}
			}
			SetEstadoSendCoins(false)
			SetEstadoMinteando(false)
		}
	}

	return (
		<div className="mt-4 text-center flex-1 overflow-hidden">
			{EstadoSendCoins ? <ModalCargando Imagen='Metamask' Scale="scale-75"/> : <></>}
			{EstadoMinteando ? <ModalCargando Imagen='MintIMG'/> : <></>}
			<div className="flex-1 mt-4">
				{
					i18n.language === "es"
					? <p>
						Ejemplo de como se puede hacer una tienda con ReactJS y pagar en Crypto los productos.<br/>
						Todo se hace desde la Blockchain de pruebas de Polygon, "Mumbai"<br/>
						Esto es una prueba y todos los productos aquí mostrados no serán enviados<br/>
						<br/><br/>
					</p>
					: <p>
						Example of how you can make a store with ReactJS and pay for the products in Crypto.<br/>
						Everything is done from the Polygon TestNet Blockchain, "Mumbai"<br/>
						This is a test and all the products shown here will not be shipped<br/>
					</p>
				}
				<div className="mt-5">
					{
						userCtx.account === null
						? <span className=''>{t("Connect to Metamask to receive free SanzUSDC tokens")}</span>
						: <div>
							<div>
								<button onClick={() => MintTokens()} className='menu-item border-blue-700 border rounded p-1 bg-gray-700 hover:border-white'>
									{t("Get TestNet USDC")}
								</button>
							</div>
							<div className='m-5'>
								<button onClick={() => AddToken()} className='menu-item border-blue-700 border rounded p-1 bg-gray-700 hover:border-white'>
									{t("Add SanzUSDC to Metamask")}
								</button>
							</div>
						</div>	
					}
				</div>
			</div>
		</div>
	);
}
