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

// export const SendCoins = async (_Wallet,_Amount) => {
//     const ethers = require('ethers');
//     const provider = new ethers.providers.Web3Provider(window.ethereum)
//     const signer = provider.getSigner()
//     const Params = {
//       "to": _Wallet,
//       "value": ethers.utils.parseUnits(_Amount.toString(),"ether")
//     }
//     try{
//       const Tx = await signer.sendTransaction(Params)
//       if (DebugLvl >= 2){console.log("Tx: ",Tx)}
//       const RespTx = await WaitTX(Tx)
//       return RespTx
//     }catch(err){
//       if (DebugLvl >= 2){console.log("SendCoins(): Error: ",err)}
//       return false
//     }
//   }

// const WaitTX = async (_TX) => {
//     try{
//       const TxReceipt = await _TX.wait()
//       if (DebugLvl >= 2){console.log("TxReceipt: ",TxReceipt)}
//       return TxReceipt
//     }catch(err){
//       if (DebugLvl >= 2){console.log("WaitTX: Error: ",err)}
//       return false
//     }
//   }