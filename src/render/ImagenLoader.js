import Image404 from '../images/404.png'
import ImageLoading from '../images/Loading/Mint_Old.gif'
import React,{useState,useEffect} from 'react'

const ImageLoader = (props) => {
	const [imageSrc, setImageSrc] = useState(null)
	const src = props.src
	const alt = props.alt
	const className = props.className?props.className + " inline":"inline"
	const onClick = props.onClick?props.onClick:null
	
	useEffect(() => {
		const image = new Image()
		image.src = src
		image.onload = () => {
			setImageSrc(src)
		}
		image.onerror = () => {
			setImageSrc(Image404)
		}
	}, [src])

	return (
		<>
			{imageSrc ? (
				<img src={imageSrc} alt={alt} className={className} onClick={onClick} />
			) : (
				<img src={ImageLoading} alt={alt} className={className} />
			)}
		</>
	);
};

export default ImageLoader;