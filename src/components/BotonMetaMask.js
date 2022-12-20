import React, { useContext, useState, useEffect } from 'react';
import { GetDebugLvl } from "../config/Entorno";
import UserContext from '../contexts/UserContext'
import { useTranslation } from 'react-i18next';
import Icon from '../images/Icons/metamask.svg'
// import { ConnectMetamask, AuthenticateUserMetamask, AddNetwork } from '../helper/metamask'
import NetworkConfig from "../config/NetWork.json";

const DebugLvl = GetDebugLvl();

const ConnectMetamask = async () => {
    let Account = null
	try{
		const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
		Account = accounts[0]
	} catch (error) {
		console.error("ConnectMetamask(): Error: ",error);
	}
    return Account
}

const AuthenticateUserMetamask = async (_Account) => {
    try{
        await window.ethereum.request({ method: 'personal_sign', params: [ "Wellcome to CryptoShop",_Account ] });
        return true
    }catch (error){
        console.error("AuthenticateUserMetamask(): Error: ",error);
        return false
    }
}

const ChangeNetwork = async () => {
	if (window.ethereum) {
	  try {
		window.ethereum.request({
			method: 'wallet_switchEthereumChain',
			params:
				[{
					chainId: NetworkConfig.chainId,
				}]
		})
	  } catch (error) {
		console.error(error);
	  }
	}
  };

export default function BotonMetaMask() {
	// eslint-disable-next-line
	const { t } = useTranslation();
	const { userCtx, loginCtx, logoutCtx } = useContext(UserContext)
	const [NetworkID, setNetworkID] = useState(null)
    if (window?.ethereum){window?.ethereum?.on('chainChanged', chainId => {setNetworkID(chainId)})}

	async function handleClick() {
		if (window?.ethereum) {
			if (NetworkID === NetworkConfig.chainId){
				if (userCtx.account === null) {
					const TempAccount = await ConnectMetamask()
					if (TempAccount !== null){
						const Resp = await AuthenticateUserMetamask(TempAccount)
						if (Resp){
							await loginCtx(TempAccount)
						}
					}
				} else {
					logoutCtx()
				}
			} else {
				await ChangeNetwork()
			}
		} else {
			window.open('https://metamask.io/download.html', '_blank')
		}
	}

	window?.ethereum?.on('accountsChanged', function () {
	    if (DebugLvl >= 2){console.log("Metamask Event: accountsChanged")}
	    logoutCtx()
	});

	
	useEffect(() => {
		if ((NetworkID !== null) && (NetworkID !== NetworkConfig.chainId)){
			logoutCtx()
		}
	// eslint-disable-next-line
	},[NetworkID])

	useEffect(() => {
        if (window?.ethereum?.chainId === null){
            setInterval(() => {
                if (window?.ethereum?.chainId !== null){
                    setNetworkID(window?.ethereum?.chainId)
                }
            }, 500);
        }else{
            setNetworkID(window?.ethereum?.chainId)
        }
    },[]);

	return (
		<button onClick={() => handleClick()} className="border rounded p-1 pr-2 text-black text-lg font-bold bg-purple-800 hover:bg-opacity-40">
			<img src={Icon} className="h-6 inline px-1 pr-2" alt="Metamask Logo"/>
			{
				window?.ethereum
				? NetworkID === NetworkConfig.chainId
					? userCtx.account == null
						? <span>{t("LogIn")}</span>
						: <span>{t("LogOut")}</span>
					: <span>{t("Change Network")}</span>
				: <span>Install MetaMask</span>
			}
		</button>
	)
}