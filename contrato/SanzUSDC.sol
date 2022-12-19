// SPDX-License-Identifier: MIT
pragma solidity >=0.8.7 <=0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract USDC is ERC20, Ownable {
    constructor() ERC20("SanzUSDC", "USDC") {}

    function mint(uint256 amount) public {
        _mint(msg.sender, amount);
    }

	function decimals() public view virtual override returns (uint8) {
		return 2;
	}
}