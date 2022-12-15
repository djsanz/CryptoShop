import React from "react";
import { GetDebugLvl } from "../config/Entorno";
import { useTranslation } from 'react-i18next';

export default function Home() {
  // eslint-disable-next-line
  const DebugLvl = GetDebugLvl();
  if (DebugLvl >= 2) console.log("Carga: Home");
  const { t } = useTranslation();

  return (
    <div className="mt-4 text-center flex-1 overflow-hidden">
	  <div className="flex-1 mt-4">
	  	Ejemplo de como se puede hacer una tienda con ReactJS y pagar en Crypto los productos.<br/>
		Todo se hace desde la Blockchain de pruebas de Polygon, "Mumbai"<br/>
		Esto es una prueba y todos los productos aquí mostrados no serán enviados<br/>
		<br/><br/>
		Example of how you can make a store with ReactJS and pay for the products in Crypto.<br/>
		Everything is done from the Polygon TestNet Blockchain, "Mumbai"<br/>
		This is a test and all the products shown here will not be shipped<br/>
		<div className="mt-5">
			<a target="_blank" rel="noreferrer" href="https://calibration-faucet.filswan.com/#/dashboard" className='menu-item border-blue-700 border rounded p-1 bg-gray-700 hover:border-white'>
				{t("Get TestNet USDC")}
			</a>
		</div>
	  </div>
    </div>
  );
}
