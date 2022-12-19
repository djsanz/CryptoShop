// SPDX-License-Identifier: MIT
pragma solidity >=0.8.7 <=0.8.17;

interface IERC20 {
    function balanceOf(address account) external view returns (uint256 balance);
    function allowance(address owner, address spender) external view returns (uint256 remaining);
    function transferFrom(address sender, address recipient, uint256 amount) external payable;
}

contract CryptoShop {

    struct Compra {
        uint256 id;
        address comprador;
        uint256 fecha;
        string articulos;
        uint256 total;
    }
    
    IERC20 private USDC = IERC20(0xd2a5bC10698FD955D1Fe6cb468a17809A08fd005);
    address private Bank = 0xdD870fA1b7C4700F2BD7f44238821C26f7392148;
    uint256 private comprasCount = 0;
    mapping(uint256 => Compra) private compras;

    function registrarCompra(uint256 _fecha, string calldata _articulos, uint256 _total) public {
        require(USDC.balanceOf(msg.sender) >= _total, "El remitente no tiene suficiente saldo en su cuenta de USDC");
    	require(USDC.allowance(msg.sender, address(this)) >= _total, "El remitente no ha autorizado al contrato a transferir la cantidad especificada de USDC");
		USDC.transferFrom(msg.sender, Bank, _total);
        compras[comprasCount] = Compra(comprasCount, msg.sender, _fecha,_articulos,_total);
        comprasCount++;
    }

	function ComprasByAddress() public view returns (Compra[] memory){
		Compra[] memory comprasByAddress = new Compra[](comprasCount);
		uint256 count = 0;
		for(uint256 i = 0; i < comprasCount; i++){
			if(compras[i].comprador == msg.sender){
				comprasByAddress[count] = compras[i];
				count++;
			}
		}
		return comprasByAddress;
	}

	function GetCompra(uint256 _id) private view returns (Compra memory){
		return compras[_id];
	}
}