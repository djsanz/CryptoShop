import React, { useContext, useState, useEffect } from "react";
import { GetDebugLvl } from "../config/Entorno";
import { useTranslation } from 'react-i18next';
import UserContext from '../contexts/UserContext';
import CryptoShop from "../config/CryptoShop.json"
import DB from "../config/products.json";
import { ethers } from "ethers";
import ImageLoader from "../render/ImagenLoader";
import { useNavigate } from "react-router-dom";

export default function Pedidos() {
	// eslint-disable-next-line
	const DebugLvl = GetDebugLvl();
	// eslint-disable-next-line
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { userCtx } = useContext(UserContext)
	const [ Pedidos, SetPedidos] = useState([]);

	const GetPedidos = async () => {
		if (DebugLvl >= 2) console.log("GetPedidos()");
		if (window?.ethereum) {
			try {
				const provider = new ethers.providers.Web3Provider(window.ethereum);
				const ContratoShop = new ethers.Contract(process.env.REACT_APP_CRYPTOSHOP, CryptoShop, provider)
				const RespContrato = await ContratoShop.ComprasByAddress(userCtx.account)
				const PedidosFinales = []
				RespContrato.forEach((Pedido) => {
					if (Pedido.comprador !== "0x0000000000000000000000000000000000000000"){PedidosFinales.push(Pedido)}
				})
				SetPedidos(PedidosFinales)
			} catch (err) {
				if (err.message !== 'MetaMask Tx Signature: User denied transaction signature.') {
					console.log("GetPedidos: CatchCall: " + err.message)
				}
			}
		}
	}

	const PrecioReal = (Precio) => {
		const Temp = Precio / 100
		return Math.round(Temp * 100) / 100;
	}

	const ParseArticulos = (Articulos) => {
		const ArticulosArray = Articulos.split(",")
		const ArticulosParsed = []
		ArticulosArray.forEach((Articulo) => {
			const ArticuloParsed = Articulo.split(":")
			// eslint-disable-next-line
			const Product = DB.products.find((product) => product.id == ArticuloParsed[0]);
			ArticulosParsed.push({
				id: ArticuloParsed[0],
				cant: ArticuloParsed[1],
				precio: ArticuloParsed[2],
				title: Product.title,
				thumbnail: Product.thumbnail
			})
		})
		return ArticulosParsed
	}

	const ParseFecha = (Fecha) => {
		const fecha = new Date(Fecha.substring(0,4),Fecha.substring(4,6) - 1,Fecha.substring(6,8),Fecha.substring(8,10),Fecha.substring(10,12));
		const fechaEnEspañol = fecha.toLocaleString('es-ES', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: 'numeric',
			minute: 'numeric'
		});
		return fechaEnEspañol
	}

	useEffect(() => {
		GetPedidos()
	}, [])

	// useEffect(() => {
	// 	console.log("Pedidos: ",Pedidos)
	// 	console.log("Pedidos?.length: ",Pedidos?.length)
	// }, [Pedidos])

	return (
		<div className="mt-4 text-center flex-1 overflow-hidden">
			<h1 className="text-3xl font-bold underline mb-5">{t("My Orders")}:</h1>
			{
				Pedidos.length > 0
				? Pedidos.map((Pedido, index) => {
					return (
						<div key={index}>
							<div className="flex text-xl justify-between border border-b-0 rounded-t-lg bg-gray-800 mx-10">
								<div>{t("Order")}: {String(Pedido.id)}</div>
								<div>{ParseFecha(String(Pedido.fecha))}</div>
							</div>
							{
								ParseArticulos(Pedido.articulos).map((item, index) => {
									return (
										<div className="flex border border-b-0 bg-gray-900 mx-10" key={"Product"+String(item.id)}>
											<div className="p-3 w-3/6">
												<div className="text-base md:text-xl lg:text-2xl font-semibold">
													<span className="hover:cursor-pointer" onClick={() => navigate('/Product/'+String(item.id))}>{String(item.title)}</span>
												</div>
												<div>
													<ImageLoader onClick={() => navigate('/Product/'+String(item.id))} src={String(item.thumbnail)} alt={String(item.title)} className="h-20 hover:cursor-pointer"/>
												</div>
											</div>
											<div className="p-3 w-1/6">
												<div className="text-base md:text-xl lg:text-2xl font-semibold">{t("Quantity")}:</div>
												<div className="flex flex-col-reverse md:flex-row lg:flex-row items-center justify-center text-center text-blue-500 font-bold mx-2 text-xl md:text-2xl lg:text-4xl">
													{String(item.cant)}
												</div>
											</div>
											<div className="text-base md:text-xl lg:text-2xl font-semibold p-3 w-1/6">
												{t("Price")}:<br />
												{String(item.precio)} USDC
											</div>
										</div>
									)
								})
							}
							<div className="flex text-xl justify-center border rounded-b-lg bg-gray-800 mx-10 mb-8" key={index}>
								{t("Total")}: <span className="ml-3 mr-1 font-bold text-blue-700">{String(PrecioReal(Pedido.total))}</span> USDC
							</div>
						</div>
					)
				  })
				:<>{t("No Orders")}</>
			}
		</div>
	);
}
