import React from "react";
import { GetDebugLvl } from "../config/Entorno";
import DB from "../config/products.json";
import ImageLoader from "../render/ImagenLoader";
import { useNavigate } from "react-router-dom";

export default function Products() {
	// eslint-disable-next-line
	const DebugLvl = GetDebugLvl();
	// eslint-disable-next-line
	const navigate = useNavigate();

	const PrecioReal = (product) => {
		const Temp = product.price - (product.price * product.discountPercentage / 100)
		return Math.round(Temp * 100) / 100;
	}

	return (
		<div className="mt-4 text-center flex-1 overflow-hidden">
			<div className="flex flex-wrap justify-center">
				{DB.products.map((product) => (
					<div key={product.id} className="flex flex-col border-2 border-gray-400 rounded-lg w-48 m-2 hover:cursor-pointer" onClick={() => navigate('/Product/'+product.id)}>
						<div className="rounded-t-lg text-xl font-semibold bg-purple-700 pb-1">{product.title}</div>
						<div className=""><ImageLoader className=" max-h-48" src={product.thumbnail} alt="product.title" /></div>
						<div className="flex-1 p-1 bg-slate-800 ">{product.description}</div>
						<div className="rounded-b-lg bg-purple-700 text-center text-base font-semibold py-1">
							{
								product.discountPercentage > 0
								? <>
									<span className=" font-thin line-through decoration-red-500 decoration-2">{product.price}</span> <span className="text-xl">{PrecioReal(product)}</span> USDC
								  </>
								: <>{product.price} USDC</>
							}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
