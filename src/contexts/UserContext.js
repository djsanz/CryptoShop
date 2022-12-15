import React, { createContext, useState, useEffect } from 'react';
import { GetDebugLvl } from '../config/Entorno'

const UserContext = createContext();
const DebugLvl = GetDebugLvl(0)

const UserProvider = ({ children }) => {
    // USUARIO
    const UserInicitalState = {
        account: null
    }
    const [userCtx, setuserCtx] = useState(UserInicitalState);

    const loginCtx = (_Account) => {
        setuserCtx({
            account: _Account
        });
		if (cartCtx.length === 0){
			const TempCart = localStorage.getItem(_Account)
			if (TempCart.length > 0){
				setCartCtx(JSON.parse(TempCart))
			}
		}
    }

    const logoutCtx = () => {
        if (DebugLvl >= 2){console.log("UserContext: logoutCtx()")}
        setuserCtx(UserInicitalState)
		setCartCtx(CartInicitalState)
    }

	// CARRITO COMPRA
    const CartInicitalState = []
	const [cartCtx, setCartCtx] = useState(CartInicitalState)

	const addToCartCtx = (productID) => {
		const updatedCart = cartCtx.filter((item) => item.id !== productID)
		const SelectedProduct = searchFromCartCtx(productID)
		if (SelectedProduct !== null){
			SelectedProduct.cant += 1
			updatedCart.push(SelectedProduct)
		}else{
			updatedCart.push({id: productID, cant: 1})
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
		cartCtx,
		addToCartCtx,
		deleteFromCartCtx,
		removeFromCartCtx
    };

    return (
        <UserContext.Provider value={data}>
            {children}
        </UserContext.Provider>
    )
}

export { UserProvider }
export default UserContext;