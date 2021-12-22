/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'
import { useRouter } from "next/router";
import { data } from "autoprefixer";
import getCart from "@utils/foodCart/getCart"

var ctr = 0;

export default function Example() {
  const router = useRouter();
  const [products, setProducts] = useState(new Array());

  const [open, setOpen] = useState(true)
  const [delfee, setDelFee] = useState(50);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(delfee + subtotal);
  
  useEffect(() => {
    // Perform localStorage action
    var cart =  getCart()
    setProducts(cart.data);
    setSubtotal(cart.total + subtotal)
    setTotal(cart.total + subtotal + delfee)
    console.log(total)
  }, [])

  
  const deleteItem = (name) =>{
    for (var i = 0; i < products.length; i++){
      if(products[i].data.productName == name)
        break
    }
    var temp = products
    temp.splice(i,1);

    var temp = 0;
    for (var i =0; i < products.length; i++)
      temp += products[i].qty * products[i].data.productPrice;

    
    setSubtotal (temp)
    setTotal(temp + delfee)
    
    localStorage.setItem("foodCart", JSON.stringify(products));
  }

  const updateTotal = async (value, name) => {
    for (var i = 0; i < products.length; i++){
      if(products[i].data.productName == name)
        break
    }
    products[i].qty = value
    var temp = 0;
    for (var i =0; i < products.length; i++)
      temp += products[i].qty * products[i].data.productPrice;
    setSubtotal (temp)
    setTotal(temp + delfee)
    localStorage.setItem("foodCart", JSON.stringify(products));
  };
  if(products){
    return (
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 overflow-hidden" onClose={setOpen}>
          <div className="absolute inset-0 overflow-hidden">
            <Transition.Child
              as={Fragment}
              enter="ease-in-out duration-500"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in-out duration-500"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>
  
            <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <div className="w-screen max-w-md">
                  <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
                    <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900">My Food Cart</Dialog.Title>
                        <div className="ml-3 h-7 flex items-center">
                          <button
                            type="button"
                            className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                            onClick={() => setOpen(false)}
                          >
                            <span className="sr-only">Close panel</span>
                            <XIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
  
                      <div className="mt-8">
                        <div className="flow-root">
                          <ul role="list" className="-my-6 divide-y divide-gray-200">
                            {products.map((product) => (
                              <li key={product.id} className="py-6 flex">
                                <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
                                  <img
                                    src={product.data.productImagesCollection.items[0].url}
                                  //   alt={product.imageAlt}
                                    className="w-full h-full object-center object-cover"
                                  />
                                </div>
  
                                <div className="ml-4 flex-1 flex flex-col">
                                  <div>
                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                      <h3>
                                        <a href='#'>{product.data.productName}</a>
                                      </h3>
                                      <p className="ml-4">P {product.data.productPrice * product.qty}</p>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-500">P {product.data.productPrice}</p>
                                  </div>
                                  <div className="flex-1 flex items-end justify-between text-sm">
                                    <p className="text-gray-500">Qty: 
                                    <input
                                        className="input font-black-100 mx-2 text-normal w-14 input-sm input-bordered rounded-md focus:ring-2 focus:ring-blue-300" 
                                        type='number'
                                        min='1'
                                        step='1'
                                        max='9999'
                                        name = {product.data.productName}
                                        value = {product.qty}
                                        placeholder={product.qty}
                                        onLoad={(e)=> setTotal(product.qty)}
                                        onChange={(e) => updateTotal(e.target.value, e.target.name)}
                                    ></input>pc
                                    </p>
                                    <div className="flex">
                                      <button name = {product.data.productName} type="button"  className="font-medium text-green-600 hover:text-green-500" onClick = {(e) => deleteItem(e.target.name)}>
                                        Remove
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
  
                    <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <p>Subtotal</p>
                        <p>P{subtotal}</p>
                      </div>
                      <div className="flex justify-between text-base text-medium text-gray-500 my-3">
                        <p>Delivery Fee</p>
                        <p>P{delfee}</p>
                      </div>
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <p>Total</p>
                        <p>P{total}</p>
                      </div>
                      {/* <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p> */}
                      <div className="mt-6">
                        <a
                          href="/checkout"
                          className="flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700"
                        >
                          Proceed to Checkout
                        </a>
                      </div>
                      <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
                        <p>
                          or{' '}
                          <button
                            type="button"
                            className="text-green-600 font-medium hover:text-green-500"
                            onClick={() => setOpen(false)}
                          >
                            Add more items<span aria-hidden="true"> &rarr;</span>
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    )
  }
  else{
    return (
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 overflow-hidden" onClose={setOpen}>
          <div className="absolute inset-0 overflow-hidden">
            <Transition.Child
              as={Fragment}
              enter="ease-in-out duration-500"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in-out duration-500"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>
  
            <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <div className="w-screen max-w-md">
                  <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
                    <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900">My Food Cart</Dialog.Title>
                        <div className="ml-3 h-7 flex items-center">
                          <button
                            type="button"
                            className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                            onClick={() => setOpen(false)}
                          >
                            <span className="sr-only">Close panel</span>
                            <XIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
  
                      <div className="mt-8">
                        <div className="flow-root">
                          <ul role="list" className="-my-6 divide-y divide-gray-200">
                            ADD AN ITEM TO CART
                          </ul>
                        </div>
                      </div>
                    </div>
  
                    <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <p>Subtotal</p>
                        <p>P{subtotal}</p>
                      </div>
                      <div className="flex justify-between text-base text-medium text-gray-500 my-3">
                        <p>Delivery Fee</p>
                        <p>P{delfee}</p>
                      </div>
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <p>Total</p>
                        <p>P{total}</p>
                      </div>
                      {/* <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p> */}
                      <div className="mt-6">
                        <a
                          href="/checkout"
                          className="flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700"
                        >
                          Proceed to Checkout
                        </a>
                      </div>
                      <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
                        <p>
                          or{' '}
                          <button
                            type="button"
                            className="text-green-600 font-medium hover:text-green-500"
                            onClick={() => setOpen(false)}
                          >
                            Add more items<span aria-hidden="true"> &rarr;</span>
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    )
  }
  
}
