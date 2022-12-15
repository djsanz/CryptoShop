// SPDX-License-Identifier: MIT
pragma solidity >=0.8.7 <=0.8.17;

contract CryptoShop {

    struct Compra {
        address comprador;
        uint256 fecha;
        string articulos;
    }

    mapping(uint256 => Compra) private compras;

    uint256 private comprasCount = 0;

    function registrarCompra(uint256 _total, address _comprador,uint256 _fecha, string calldata _articulos) public payable{
        require(msg.value == _total,"registrarCompra: Value not Valid");
        compras[comprasCount] = Compra(_comprador, _fecha, _articulos);
        comprasCount++;
    }

	function ComprasByAddress(address _comprador) public view returns (Compra[] memory){
		Compra[] memory comprasByAddress = new Compra[](comprasCount);
		uint256 count = 0;
		for(uint256 i = 0; i < comprasCount; i++){
			if(compras[i].comprador == _comprador){
				comprasByAddress[count] = compras[i];
				count++;
			}
		}
		return comprasByAddress;
	}

	function GetCompra(uint256 _id) public view returns (Compra memory){
		return compras[_id];
	}
}