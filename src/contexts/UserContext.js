import React, { createContext, useState, useEffect } from 'react';
import { GetDebugLvl } from '../config/Entorno'
import SanzUSDC from "../config/SanzUSDC.json"
import { ethers } from "ethers";

const UserContext = createContext();
const DebugLvl = GetDebugLvl(0)

const UserProvider = ({ children }) => {
    // USUARIO
    const UserInicitalState = {
        account: null,
		saldo: 0
    }
    const [userCtx, setuserCtx] = useState(UserInicitalState);

    const loginCtx = async (_Account) => {
        setuserCtx({
            account: _Account,
			saldo: await SaldoUSDC(_Account)
        });
		if (cartCtx.length === 0){
			const TempCart = localStorage.getItem(_Account)
			if (TempCart?.length > 0){
				setCartCtx(JSON.parse(TempCart))
			}
		}
    }

    const logoutCtx = () => {
        if (DebugLvl >= 2){console.log("UserContext: logoutCtx()")}
        setuserCtx(UserInicitalState)
		setCartCtx(CartInicitalState)
    }

	const UpdateSaldo = async () => {
		const Saldo = await SaldoUSDC(userCtx.account)
		setuserCtx({
			account: userCtx.account,
			saldo: Saldo
		})
	}

	const SaldoUSDC = async (_Account) => {
		if (DebugLvl > 2) console.log("SaldoUSDC()")
		if (_Account === undefined) {
			_Account = userCtx.account
		}
		if (_Account === null) {
			return 0
		}
		if (window?.ethereum) {
			try {
				const provider = new ethers.providers.Web3Provider(window.ethereum);
				const ContratoUSDC = new ethers.Contract(process.env.REACT_APP_SANZUDSC, SanzUSDC, provider)
				const Saldo = await ContratoUSDC.balanceOf(_Account)
				return Saldo / (10 ** 2)
			} catch (err) {
				console.error("SaldoUSDC: CatchCall: " + err.message)
			}
		}
		return 0
	}

	// CARRITO COMPRA
    const CartInicitalState = []
	const [cartCtx, setCartCtx] = useState(CartInicitalState)
	
	const resetCartCtx = () => {
		setCartCtx(CartInicitalState)
	}

	const addToCartCtx = (productID,precio) => {
		const updatedCart = cartCtx.filter((item) => item.id !== productID)
		const SelectedProduct = searchFromCartCtx(productID)
		if (SelectedProduct !== null){
			SelectedProduct.cant += 1
			updatedCart.push(SelectedProduct)
		}else{
			updatedCart.push({id: productID, cant: 1, precio: precio})
		}
		updatedCart.sort((a, b) => a.id - b.id);
		setCartCtx(updatedCart);
	}

	const removeFromCartCtx = (productID) => {
		const updatedCart = cartCtx.filter((item) => item.id !== productID)
		const SelectedProduct = searchFromCartCtx(productID)
		if (SelectedProduct !== null){
			SelectedProduct.cant -= 1
			if (SelectedProduct.cant > 0){
				updatedCart.push(SelectedProduct)
			}
		}
		updatedCart.sort((a, b) => a.id - b.id);
		setCartCtx(updatedCart);
	}

	const deleteFromCartCtx = (productID) => {
		const updatedCart = cartCtx.filter((item) => item.id !== productID)
		updatedCart.sort((a, b) => a.id - b.id);
		setCartCtx(updatedCart);
	}

	const searchFromCartCtx = (productID) => {
		const SelectedProduct = cartCtx.filter((item) => item.id === productID)
		if (SelectedProduct.length > 0){
			return SelectedProduct[0]
		}else{
			return null
		}
	}

	const CartCtxToContractString = () => {
		let ContractString = ""
		cartCtx.forEach((item) => {
			ContractString += item.id + ":" + item.cant + ":" + item.precio + ","
		})
		return ContractString.slice(0, -1);
	}

	useEffect(() => {
		if (userCtx.account != null){
			localStorage.setItem(userCtx.account,JSON.stringify(cartCtx))
		}
	}, [cartCtx,userCtx])

    // Exportaciones
    const data = {
        userCtx,
        loginCtx,
        logoutCtx,
		SaldoUSDC,
		UpdateSaldo,
		cartCtx,
		addToCartCtx,
		deleteFromCartCtx,
		removeFromCartCtx,
		CartCtxToContractString,
		resetCartCtx
    };

    return (
        <UserContext.Provider value={data}>
            {children}
        </UserContext.Provider>
    )
}

export { UserProvider }
export default UserContext;