import React, { useContext, useState } from "react";
import { GetDebugLvl } from "../config/Entorno";
import { useTranslation } from 'react-i18next';
import DB from "../config/products.json";
import ImageLoader from "../render/ImagenLoader";
import UserContext from '../contexts/UserContext';
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { DeleteIcon, PlusIcon, MinusIcon } from "../helper/Icons";
import ModalCargando from '../modals/ModalCargando';
import SanzUSDC from "../config/SanzUSDC.json"
import CryptoShop from "../config/CryptoShop.json"
import GetGasFees from "../config/api";

export default function Cesta() {
	// eslint-disable-next-line
	const DebugLvl = GetDebugLvl();
	// eslint-disable-next-line
	const { t } = useTranslation();
	const { userCtx, SaldoUSDC, UpdateSaldo, cartCtx, addToCartCtx, removeFromCartCtx, deleteFromCartCtx, CartCtxToContractString, resetCartCtx } = useContext(UserContext)
	const navigate = useNavigate();
	const [EstadoAprobando, SetEstadoAprobando] = useState(false);
	const [EstadoPagando, SetEstadoPagando] = useState(false);

	const PrecioReal = (product) => {
		if (product.discountPercentage === 0) return product.price;
		const Temp = product.price - (product.price * product.discountPercentage / 100)
		return Math.round(Temp * 100) / 100;
	}

	const PrecioTotal = cartCtx.reduce((total, item) => {
		// eslint-disable-next-line
		const Product = DB.products.find((product) => product.id == item.id);
		const TotalTemp = total + (PrecioReal(Product) * item.cant)
		return Math.round(TotalTemp * 100) / 100;
	}, 0);

	const FechaActual = () => {
		const Fecha = new Date();
		const Dia = Fecha.getDate();
		const Mes = Fecha.getMonth() + 1;
		const Anio = Fecha.getFullYear();
		const Hora = Fecha.getHours();
		const Minuto = Fecha.getMinutes();
		const FechaFormateada = Anio.toString() + Mes.toString() + Dia.toString() + Hora.toString() + Minuto.toString();
		return FechaFormateada;
	}

	const AprobedUSDC = async () => {
		if (window?.ethereum) {
			try {
				const provider = new ethers.providers.Web3Provider(window.ethereum);
				const ContratoUSDC = new ethers.Contract(process.env.REACT_APP_SANZUDSC, SanzUSDC, provider)
				const Aprobed = await ContratoUSDC.allowance(userCtx.account, process.env.REACT_APP_CRYPTOSHOP)
				return Aprobed / (10 ** 2)
			} catch (err) {
				console.log("AprobedUSDC: CatchCall: " + err.message)
			}
		}
		return 0
	}

	const HacePago = async () => {
		const Saldo = await SaldoUSDC();
		if (Saldo < PrecioTotal) {
			alert(t("SinSaldo"))
			navigate('/')
			return
		}
		let RespAprob = false
		const Aprobed = await AprobedUSDC();
		if (Aprobed < PrecioTotal) {
			RespAprob = await Aprobando();
		} else {
			RespAprob = true
		}
		if (RespAprob) {
			const RespPay = await Pagando();
			if (RespPay) {
				await UpdateSaldo();
				resetCartCtx();
				navigate('/Pedidos')
			}
		}
	};

	const Aprobando = async () => {
		if (window?.ethereum) {
			try {
				SetEstadoAprobando(true)
				const provider = new ethers.providers.Web3Provider(window.ethereum);
				const signer = provider.getSigner()
				const nonce = await signer.getTransactionCount()
				const { maxFeePerGas, maxPriorityFeePerGas } = await GetGasFees()
				const ContratoUSDC = new ethers.Contract(process.env.REACT_APP_SANZUDSC, SanzUSDC, provider)
				const ContratoNFTWithSigner = ContratoUSDC.connect(signer);
				if (DebugLvl >= 2) console.log("nonce (Aprobando):",nonce)
				if (DebugLvl >= 2) console.log("maxFeePerGas (Aprobando): " + maxFeePerGas)
				if (DebugLvl >= 2) console.log("maxPriorityFeePerGas (Aprobando): " + maxPriorityFeePerGas)
				const RespContrato = await ContratoNFTWithSigner.approve(process.env.REACT_APP_CRYPTOSHOP, (PrecioTotal * (10 ** 2)).toFixed(0),{ maxFeePerGas:maxFeePerGas, maxPriorityFeePerGas:maxPriorityFeePerGas,nonce:nonce + 1 })
				SetEstadoAprobando(false)
				SetEstadoPagando(true)
				const TxReceipt = await WaitTX(RespContrato)
				if (TxReceipt === false) {
					SetEstadoPagando(false)
					return false
				}
				SetEstadoPagando(false)
				return true
			} catch (err) {
				if (err.message !== 'MetaMask Tx Signature: User denied transaction signature.') {
					console.log("Aprobando: CatchCall: " + err.message)
				}
			}
			SetEstadoAprobando(false)
			SetEstadoPagando(false)
		}
		return false
	};

	const Pagando = async () => {
		if (window?.ethereum) {
			try {
				SetEstadoAprobando(true)
				const provider = new ethers.providers.Web3Provider(window.ethereum);
				const signer = provider.getSigner()
				const nonce = await signer.getTransactionCount()
				const { maxFeePerGas, maxPriorityFeePerGas } = await GetGasFees()
				const ContratoUSDC = new ethers.Contract(process.env.REACT_APP_CRYPTOSHOP, CryptoShop, provider)
				const ContratoNFTWithSigner = ContratoUSDC.connect(signer);
				if (DebugLvl >= 2) console.log("nonce (Pagando):",nonce)
				if (DebugLvl >= 2) console.log("maxFeePerGas (Pagando): " + maxFeePerGas)
				if (DebugLvl >= 2) console.log("maxPriorityFeePerGas (Pagando): " + maxPriorityFeePerGas)
				const RespContrato = await ContratoNFTWithSigner.registrarCompra(FechaActual(), CartCtxToContractString(), (PrecioTotal * (10 ** 2)).toFixed(0),{ maxFeePerGas:maxFeePerGas, maxPriorityFeePerGas:maxPriorityFeePerGas,nonce:nonce + 1 })
				SetEstadoAprobando(false)
				SetEstadoPagando(true)
				const TxReceipt = await WaitTX(RespContrato)
				if (TxReceipt === false) {
					SetEstadoPagando(false)
					return false
				}
				SetEstadoPagando(false)
				return true
			} catch (err) {
				if (err.message !== 'MetaMask Tx Signature: User denied transaction signature.') {
					console.log("Pagando: CatchCall: " + err.message)
				}
			}
			SetEstadoAprobando(false)
			SetEstadoPagando(false)
		}
		return false
	};

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

	return (
		<div className="mt-4 text-center flex-1 overflow-hidden">
			{EstadoAprobando ? <ModalCargando Imagen='Metamask' Scale="scale-75" /> : <></>}
			{EstadoPagando ? <ModalCargando Imagen='Mint' /> : <></>}
			<div className="flex flex-col">
				{
					cartCtx.length === 0
						? <div className="text-center text-2xl mb-5 text-blue-500 font-extrabold">{t("Cart is empty")}</div>
						: cartCtx.map((item) => {
							// eslint-disable-next-line
							const Product = DB.products.find((product) => product.id == item.id);
							return (
								<div className="flex border rounded-lg bg-gray-900 mx-10 mb-2" key={Product.id}>
									<div className="p-3 w-3/6" onClick={() => navigate('/Product/' + Product.id)}>
										<div className="text-base md:text-xl lg:text-2xl font-semibold">{Product.title}</div>
										<div>
											<ImageLoader src={Product.thumbnail} alt={Product.title} className="h-28 hover:cursor-pointer" />
										</div>
									</div>
									<div className="p-3 w-1/6">
										<div className="text-base md:text-xl lg:text-2xl font-semibold">{t("Quantity")}:</div>
										<div className="flex flex-col-reverse md:flex-row lg:flex-row items-center justify-center text-center text-blue-500 font-bold mx-2 text-xl md:text-2xl lg:text-4xl">
											<MinusIcon Tam="30" onClick={() => removeFromCartCtx(item.id)} className="hover:cursor-pointer md:mr-1 lg:mr-1" />
											{item.cant}
											<PlusIcon Tam="30" onClick={() => addToCartCtx(item.id, item.precio)} className="hover:cursor-pointer md:ml-1 lg:ml-1" />
										</div>
									</div>
									<div className="text-base md:text-xl lg:text-2xl font-semibold p-3 w-1/6">
										{t("Price")}:<br />
										{PrecioReal(Product)} USDC
									</div>
									<div className="flex text-center text-xl font-semibold p-3 items-center justify-end w-1/6">
										<button onClick={() => deleteFromCartCtx(item.id)} className="border rounded text-white bg-red-700 hover:bg-opacity-60 p-2"><DeleteIcon Tam="20" className="" /></button>
									</div>
								</div>
							)
						})
				}
				<div className="flex self-center border-2 bg-white w-1/2"></div>
				<div className="flex-col border rounded-lg self-center mt-2 w-2/3 bg-gray-500">
					<div className="flex-1 text-center p-3 text-black">
						<span className="pr-2 text-2xl">Total:</span>
						<span className="pr-2 text-4xl font-bold text-purple-800">{PrecioTotal}</span>
						<span className="pr-2 text-2xl">USDC</span>
					</div>
					<div className="flex-1 text-center p-1">
						{
							cartCtx.length > 0
								? userCtx.account != null
									? <button onClick={() => HacePago()} className="border rounded p-1 pr-2 mt-1 mb-2 text-white text-lg font-bold bg-green-800 hover:border-black hover:text-black hover:bg-opacity-60">{t("Checkout")}</button>
									: <div className="mt-1 mb-2">{t("Login to proceed checkout")}</div>
								: <></>
						}
					</div>
				</div>
			</div>
		</div>
	);
}
