import React, { useContext } from 'react';
import { GetDebugLvl } from "../config/Entorno";
import UserContext from '../contexts/UserContext'
import Icon from '../images/ShoppingCart.svg'
import { useNavigate } from "react-router-dom";

export default function ShoppingCart() {
	// eslint-disable-next-line
	const DebugLvl = GetDebugLvl();
	const navigate = useNavigate();
	const { cartCtx } = useContext(UserContext)
	
	return (
		<div className="flex items-center w-14 hover:cursor-pointer" onClick={() => navigate('/Cesta')}>
			<img src={Icon} className="h-10 px-1" alt="ShoppingCart Logo"/>
			{
				cartCtx.length !== 0
				? cartCtx.length > 9
					? cartCtx.length < 100
						? <span className="relative px-[0.1rem] border rounded-full bg-slate-400 text-base font-bold text-red-700 bottom-[0.6rem] -left-[2rem]">{cartCtx.length}</span>
						: <span className="border rounded-full bg-slate-400 px-1 text-base font-bold text-red-600">{cartCtx.length}</span>
					: <span className="relative px-[0.4rem] border rounded-full bg-slate-400 text-base font-bold text-red-700 bottom-[0.6rem] -left-[2rem]">{cartCtx.length}</span>
				: <></>
			}
			
		</div>
	)
}