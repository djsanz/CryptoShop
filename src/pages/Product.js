import React,{useState, useEffect, useContext} from "react";
import { GetDebugLvl } from "../config/Entorno";
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import UserContext from '../contexts/UserContext';
import DB from "../config/products.json";
import { useNavigate } from "react-router-dom";
import NotFound from "../images/404.png"
import GaleriaFotos from "../components/GaleriaFotos";

export default function Product() {
	// eslint-disable-next-line
	const DebugLvl = GetDebugLvl();
	const { t } = useTranslation();
	const { ProductID } = useParams();
	const [Product, setProduct] = useState(null);
	const { addToCartCtx } = useContext(UserContext)
	const navigate = useNavigate();

	const AgregaCesta = () => {
		addToCartCtx(ProductID,PrecioReal());
		navigate('/Cesta')
	}

	const PrecioReal = () => {
		const Temp = Product.price - (Product.price * Product.discountPercentage / 100)
		return Math.round(Temp * 100) / 100;
	}

	useEffect(() => {
		// eslint-disable-next-line
		const TempProduct = DB.products.find((product) => product.id == ProductID);
		if (TempProduct !== undefined) {
			setProduct(TempProduct);
		}
		// eslint-disable-next-line
	}, []);

	return (
		<div className="mt-4 text-center flex-1 overflow-hidden">
			{
				Product === null
				? <div className="text-center">
					<h1>{t("Product Not Found")}</h1>
					<img src={NotFound} alt="404" className="inline mt-5" />
				  </div>
				: <div className="flex flex-col">
						<div className="text-2xl font-semibold pb-1">{Product.title}</div>
						<div className="">
							<GaleriaFotos Fotos={Product.images} />
						</div>
						<div className="flex-1 p-1 font-light ">{Product.description}</div>
						{
							Product.discountPercentage > 0
							? <div className="flex-1 p-1 font-light ">{t("Discount")}: {Product.discountPercentage} %</div>
							: <></>
						}
						{
							Product.discountPercentage > 0
							? <div>
								<span className=" text-xl text-red-500 line-through decoration-white decoration-dotted ">{Product.price}</span> <span className="text-xl">{PrecioReal()}</span> USDC
							  </div>
							: <div className="text-center text-xl font-semibold py-1">{Product.price} USDC</div>
						}
						<div className="text-center text-xl font-semibold py-2">
							<button onClick={() => AgregaCesta()} className="border rounded p-1 pr-2 text-white text-lg font-bold bg-green-700 hover:bg-opacity-60">{t("Add to Cart")}</button>
						</div>
				  </div>
			}
		</div>
	);
}
