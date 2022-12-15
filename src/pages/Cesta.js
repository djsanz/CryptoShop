import React, { useContext } from "react";
import { GetDebugLvl } from "../config/Entorno";
import { useTranslation } from 'react-i18next';
import DB from "../config/products.json";
import ImageLoader from "../render/ImagenLoader";
import UserContext from '../contexts/UserContext';
import { useNavigate } from "react-router-dom";
import { DeleteIcon, PlusIcon, MinusIcon } from "../helper/Icons";


export default function Cesta() {
	// eslint-disable-next-line
	const DebugLvl = GetDebugLvl();
	// eslint-disable-next-line
	const { t } = useTranslation();
	const { userCtx, cartCtx, addToCartCtx, removeFromCartCtx, deleteFromCartCtx } = useContext(UserContext)
	const navigate = useNavigate();
	
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


	return (
		<div className="mt-4 text-center flex-1 overflow-hidden">
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
											<MinusIcon Tam="30" onClick={() => removeFromCartCtx(item.id)} className="hover:cursor-pointer md:mr-1 lg:mr-1"/>
											{item.cant}
											<PlusIcon Tam="30" onClick={() => addToCartCtx(item.id)} className="hover:cursor-pointer md:ml-1 lg:ml-1"/>
										</div>
									</div>
									<div className="text-base md:text-xl lg:text-2xl font-semibold p-3 w-1/6">
										{t("Price")}:<br />
										{PrecioReal(Product)} USDC
									</div>
									<div className="flex text-center text-xl font-semibold p-3 items-center justify-end w-1/6">
										<button onClick={() => deleteFromCartCtx(item.id)} className="border rounded text-white bg-red-700 hover:bg-opacity-60 p-2"><DeleteIcon Tam="20" className=""/></button>
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
								? <button onClick={() => console.log("Pagar")} className="border rounded p-1 pr-2 mt-1 mb-2 text-white text-lg font-bold bg-green-800 hover:border-black hover:text-black hover:bg-opacity-60">{t("Checkout")}</button>
								: <div className="mt-1 mb-2">{t("Login to proceed checkout")}</div>
							: <></>
						}
					</div>
				</div>
			</div>
		</div>
	);
}
