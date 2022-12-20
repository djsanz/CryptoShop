import axios from "axios";
import { ethers } from "ethers";

const GetGasFees = async () => {
	// get max fees from gas station
	let maxFeePerGas = ethers.BigNumber.from(40000000000) // fallback to 40 gwei
	let maxPriorityFeePerGas = ethers.BigNumber.from(40000000000) // fallback to 40 gwei
	try {
		const { data } = await axios({method: 'get',url: 'https://gasstation-mumbai.matic.today/v2'})
		maxFeePerGas = ethers.utils.parseUnits(
			Math.ceil(data.fast.maxFee) + '',
			'gwei'
		)
		maxPriorityFeePerGas = ethers.utils.parseUnits(
			Math.ceil(data.fast.maxPriorityFee) + '',
			'gwei'
		)
	} catch {
		// ignore
	}
	return { maxFeePerGas, maxPriorityFeePerGas }
}

export default GetGasFees;