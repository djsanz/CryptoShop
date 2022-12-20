import { GetDebugLvl } from "../config/Entorno";
// import { ethers } from "ethers";

// eslint-disable-next-line
const DebugLvl = GetDebugLvl();

export const ConnectMetamask = async () => {
	let Account = null
	try {
		const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
		Account = accounts[0]
	} catch (error) {
		console.error("ConnectMetamask(): Error: ", error);
	}
	return Account
}

export const AuthenticateUserMetamask = async (_Account) => {
	try {
		await window.ethereum.request({ method: 'personal_sign', params: ["Weelcome to CryptoShop", _Account] });
		return true
	} catch (error) {
		console.error("AuthenticateUserMetamask(): Error: ", error);
		return false
	}
}

// export const getBalanceMetamask = async (_Account) => {
//     try{
//         const TempBalance = await window?.ethereum?.request({ method: 'eth_getBalance', params: [_Account,'latest'] })
//         const balanceInEth = parseFloat(ethers.utils.formatEther(TempBalance)).toFixed(4);
//         return balanceInEth + " " + Abi.NetWorkInfo.ChainSymbol
//     }catch (error){
//         console.error("getBalanceMetamask(): Error: ",error);
//         return 0
//     }
// }

export const AddNetwork = async () => {
	if (DebugLvl >= 2) { console.log("AddNetwork()") }
	try {
		await window.ethereum.request({
			method: 'wallet_addEthereumChain',
			params:
				[{
					chainId: "0x13881",
					chainName: "Mumbai",
					nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
					rpcUrls: ["https://matic-mumbai.chainstacklabs.com"],
					blockExplorerUrls: ["https://mumbai.polygonscan.com"]
				}]
		})
	} catch (error) {
		console.error("AddNetwork Error:", error);
	}
}