import React, { useContext, useState, useEffect } from 'react';
import { GetDebugLvl } from "../config/Entorno";
import { Link } from "react-router-dom";
import UserContext from '../contexts/UserContext';
import { useTranslation } from 'react-i18next';
import { Navbar } from 'flowbite-react'
import Logo from "../images/logo.png";
import ShoppingCart from './ShoppingCart';
import BotonMetaMask from './BotonMetaMask';

export default function NavBar() {
    // eslint-disable-next-line
    const DebugLvl = GetDebugLvl();
    // eslint-disable-next-line
    const { userCtx } = useContext(UserContext)
    const { t } = useTranslation();

    return (
        <Navbar fluid rounded class="bg-gray-900 sticky top-0 z-10">
            <React.Fragment key=".0">
                <Navbar.Brand href="https://cryptoshop-lovat.vercel.app">
                    <img src={Logo} className="m-0 mr-3 h-10" alt="PlantillaReact Logo"/>
                    <span className="self-center whitespace-nowrap text-xl font-semibold">CryptoShop</span>
                </Navbar.Brand>
                <div className="flex md:order-2 m-1 space-x-2">
					{
						userCtx.account != null
						? <div className="flex items-center font-light">
							{userCtx.account.substring(2, 7)+" ... "+userCtx.account.substring(userCtx.account.length-5,userCtx.account.length)}
							<br/>
							{userCtx.saldo} USDC
						  </div>
						: ""
					}
                	<div className="flex items-center">
						<ShoppingCart/>
					</div>
					<div className="flex items-center">
						<BotonMetaMask />
					</div>
					<Navbar.Toggle />
                </div>
                <Navbar.Collapse>
                    <Link to="/" className='menu-item'>{t("Home")}</Link>
					<Link to="/Products" className='menu-item'>{t("Products")}</Link>
					{
						userCtx.account != null
						? <Link to="/Pedidos" className='menu-item'>{t("Orders")}</Link>
						: <span className='menu-item-disabled'>{t("Orders")}</span>
					}
                </Navbar.Collapse>
            </React.Fragment>
        </Navbar>
    );
}