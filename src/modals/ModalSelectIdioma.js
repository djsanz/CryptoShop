import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react'
import ES_icon from '../images/idioma/ES.png'
import ENG_icon from '../images/idioma/ENG.png'
import {useTranslation} from 'react-i18next';

const ModalSelectWallet = (props) => {
  const { i18n } = useTranslation();

  const ChangeLang = (_Idioma) => {
    localStorage.setItem("Idioma",_Idioma)
    i18n.changeLanguage(_Idioma)
    props.closeModal()
  }

  function CloseButtonImg(props) {
      return (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      )
    }

  return (
      <Transition appear show={props.isOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={props.closeModal}>
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>
            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                  <Dialog.Panel className="transform overflow-hidden rounded-xl bg-black text-left align-middle shadow-[#7209B7] shadow-xl transition-all">
                    <Dialog.Title as="div" className="p-1 flex flex-row text-lg font-bold font-medium text-black rounded-t-lg bg-[#7209B7]">
                      <div className="flex-col flex-1">Select</div>
                      <div className="flex-col mr-1">
                        <button onClick={() => {props.closeModal()}} className="text-black hover:text-[#F72585] ">
                          <CloseButtonImg className="inline-flex h-5 w-5"/>
                        </button>
                      </div>
                    </Dialog.Title>
                    <div className="flex flex-col text-white p-2.5 text-center">

                      <div className="flex flex-col">
                          <div className="flex flex-row">
                              <div className="flex flex-col flex-1">
                                  <button onClick={() => {ChangeLang("es")}} className="inline-flex items-center justify-center px-4 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-[#7209B7] hover:bg-[#F72585] disabled:cursor-not-allowed disabled:opacity-50">
                                  <img alt="ES-Flag" className="mr-1" src={ES_icon} style={{resizeMode: "cover",height:20}}/> Español
                                  </button>
                              </div>
                          </div>
                      </div>

                      <div className="flex flex-col mt-2">
                          <div className="flex flex-row">
                              <div className="flex flex-col flex-1">
                                  <button onClick={() => {ChangeLang("eng")}} className="inline-flex items-center justify-center px-4 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-[#7209B7] hover:bg-[#F72585] disabled:cursor-not-allowed disabled:opacity-50">
                                  <img alt="ENG-Flag" className="mr-1" src={ENG_icon} style={{resizeMode: "cover",height:20}}/> English
                                  </button>
                              </div>
                          </div>
                      </div>

                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
  );
}
export default ModalSelectWallet;