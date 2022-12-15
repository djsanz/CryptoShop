import React from 'react';
import CargandoIMG from '../images/Loading/Cargando.gif'
import CreatingIMG from '../images/Loading/Creating.gif'
import SavingIMG from '../images/Loading/Saving.gif'
import SendingIMG from '../images/Loading/Sending.gif'
import MintIMG from '../images/Loading/Mint.gif'
import LockIMG from '../images/Loading/Lock.gif'
import MetamaskLoadingIMG from '../images/Loading/Loading.gif'

export default function ModalCargando(props) {
  const Imagen = props.Imagen;
  const Scale = props.Scale?props.Scale:"";

  return (
    <div className="fixed top-0 left-0 right-0 bg-black/80 flex items-center justify-center w-full h-screen z-20">
      {
        Imagen === 'Metamask'
        ? <img src={MetamaskLoadingIMG} alt='LoadingIMG' className={Scale}></img>
        : Imagen === 'Cargando'
          ? <img src={CargandoIMG} alt='LoadingIMG' className={Scale}></img>
          : Imagen === 'Creating'
            ? <img src={CreatingIMG} alt='LoadingIMG' className={Scale}></img>
            : Imagen === 'Saving'
              ? <img src={SavingIMG} alt='LoadingIMG' className={Scale}></img>
              : Imagen === 'Sending'
                ? <img src={SendingIMG} alt='LoadingIMG' className={Scale}></img>
                : Imagen === 'Mint'
                  ? <img src={MintIMG} alt='LoadingIMG' className={Scale}></img>
                  : Imagen === 'Lock'
                    ? <img src={LockIMG} alt='LoadingIMG' className={Scale}></img>
                    : <></>
      }
    </div>
  );
}