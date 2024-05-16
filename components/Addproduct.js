"use client"
import React from 'react'
import { useState, useEffect } from "react";
import { useMyContext } from '@/context/ProCon';
import { message } from "antd"


export default function Addproduct() {


  const [productForm, setProductForm] = useState({})
  const [products, setProducts] = useState([])
  const [requestProcessing, setRequestProcessing] = useState(false);
  const [showModal, setShowModal] = useState(false);




  const { value, setValue, setFormval, formval, setLoading, loading, originalData, setOriginalData } = useMyContext();



  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    const response = await fetch("/api/product")
    let rjson = await response.json()
    setProducts(rjson.products)
    setValue(rjson.products)
    setOriginalData(rjson.products)
    setLoading(false)
  }

  const openModal = () => {
    setFormval(true)
    setShowModal(true);
  };

  const closeModal = () => {
    if (requestProcessing) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
    setFormval(false)
    setProductForm({});
  };


  const addProduct = async (e) => {
    e.preventDefault();

    if (Object.keys(productForm).length === 0) {
      message.error("Please Fill Required Boxes")
    } else if (!productForm.slug || !productForm.quantity || !productForm.price) {
      message.error("Please Fill All Required Boxes")
    }

    else {
      const slugNames = products.map(item => item.slug);
      const productExists = slugNames.find(item => item === productForm.slug);

      if (productExists) {
        message.error("This product name is already exists. Please try again")

        const { slug, ...rest } = productForm;
        setProductForm({ slug: '', ...rest });

      } else {
        if (!requestProcessing) {
          setRequestProcessing(true);

          message.loading("Please Wait...")

          try {
            const response = await fetch("/api/product", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(productForm),
            });

            if (response.ok) {

              message.destroy()
              message.success("Product Added Successfully")

              fetchProducts();
              setProductForm({});
              setShowModal(false);
              setFormval(false)
              setRequestProcessing(true);
            } else {
              console.error("Failed to add product");
              message.error("Failed To Add Product")
            }

          } catch (error) {
            console.error("Error adding product:", error.message);
          } finally {
            setRequestProcessing(false);

          }
        } else {
          message.error("Form already submitted or request in progress")
        }
      }
    }
  };

  const handelChange = (e) => {
    message.destroy()
    setProductForm({ ...productForm, [e.target.name]: e.target.value })
  }

  return (
    <>

      <div className="flex justify-end items-center">
        <button
          onClick={openModal}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none"
        >
          Add Product
        </button>
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg" style={{ width: '65%' }}>
              <div className="flex justify-end">
                <button className="text-gray-500 hover:text-gray-700" onClick={closeModal}>
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <h1 className="text-3xl text-center font-semibold mb-6">Add a product</h1>
              <hr />
              <div className="mt-4">
                <div className="container my-8 mx-auto">
                  <div className="mb-4">
                    <label htmlFor="productName" className="block mb-2">Product Slug:</label>
                    <input value={productForm?.slug || ""} name="slug" onChange={handelChange} type="text" id="productName" className="w-full border border-gray-300 px-4 py-2" />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="productQuantity" className="block mb-2">Product Quantity:</label>
                    <input value={productForm?.quantity || ""} name="quantity" onChange={handelChange} type="number" id="productQuantity" className="w-full border border-gray-300 px-4 py-2" />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="productPrice" className="block mb-2">Product Price:</label>
                    <input value={productForm?.price || ""} name="price" onChange={handelChange} type="number" id="productPrice" className="w-full border border-gray-300 px-4 py-2" />
                  </div>
                </div>
                <div className="flex justify-center">
                  <button onClick={addProduct} type="submit" className="bg-blue-500 text-white px-4 py-2 border rounded-lg inline-flex items-center"> Save  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>



    </>

  )
}




