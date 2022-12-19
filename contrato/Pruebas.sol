pragma solidity ^0.8.17;

import "https://github.com/OpenZeppelin/openzeppelin-solidity/contracts/token/ERC20/SafeERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-solidity/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// Dirección del contrato USDC en la red Ethereum
// Debes reemplazar esta dirección por la dirección del contrato USDC en tu red
address public USDC_ADDRESS = 0xE097d6B3100777DC31B34dC2c58fB524C2e76921;

// Interfaz ERC20 para el contrato USDC
interface IERC20 is SafeERC20 {
  function balanceOf(address account) external view returns (uint256 balance);
  function allowance(address owner, address spender) external view returns (uint256 remaining);
  function decimals() external view returns (uint256 decimals);
  function transferFrom(address sender, address recipient, uint256 amount) external payable;
  function approve(address spender, uint256 amount) external payable;
}

// Contrato que valida un pago en USDC
contract ValidateUSDCPayment {
  using SafeMath for uint256;

  IERC20 private USDC;

  constructor() public {
    // Asigna el contrato USDC a la variable "USDC"
    USDC = IERC20(USDC_ADDRESS);
  }

  // Función que valida un pago en USDC
 function makePayment(address sender, address recipient, uint256 amount) public {
    // Valida el pago
    require(USDC.balanceOf(sender) >= amount, "El remitente no tiene suficiente saldo en su cuenta de USDC");
    require(USDC.allowance(sender, address(this)) >= amount, "El remitente no ha autorizado al contrato a transferir la cantidad especificada de USDC");

    // Realiza la transferencia de USDC con la función "transferFrom" del contrato USDC
    USDC.transferFrom(sender, recipient, amount);
  }
}
