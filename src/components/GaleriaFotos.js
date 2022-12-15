import React from 'react';
import { GetDebugLvl } from "../config/Entorno";
import ImageLoader from "../render/ImagenLoader";
import { Carousel } from 'flowbite-react'

export default function GaleriaFotos(props) {
	// eslint-disable-next-line
	const DebugLvl = GetDebugLvl();
	const { Fotos } = props;
	
	return (
		<div className="flex flex-1 items-center">
			<div className="w-1/4"></div>
			<div className="w-2/4 h-56">
				<Carousel slide={false}>
					{
						Fotos.map((Foto,Index) => (
							<div key={Index}><ImageLoader src={Foto} alt="Foto" className="h-56"/></div>
						))
					}
				</Carousel>
			</div>
			<div className="w-1/4"></div>
		</div>
	)
}