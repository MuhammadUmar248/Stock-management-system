"use client"

import React from 'react'
import { useState, useEffect } from "react";
import { useMyContext } from '@/context/ProCon';
import Swal from 'sweetalert';
import { message } from "antd"



export default function Display() {

  const [hoveredRow, setHoveredRow] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [productForm, setProductForm] = useState({})
  const [requestProcessing, setRequestProcessing] = useState(false);
  const [update, setUpdate] = useState({});
  const [isFormChanged, setIsFormChanged] = useState(false);
  const [currentSlug, setCurrentSlug] = useState("");


  const { value, setValue, setFormval, formval, setLoading, loading } = useMyContext();


  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    const response = await fetch("/api/product")
    let rjson = await response.json()
    setValue(rjson.products)
  }


  const handleMouseEnter = (slug) => {
    setHoveredRow(slug);
  };

  const handleMouseLeave = () => {
    setHoveredRow(null);
  };

  const handleDelete = async (slug) => {

    Swal({
      title: 'Are you sure?',
      text: 'It will be permanently deleted!',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        message.loading("Please Wait")

        setFormval(true)
        try {
          const response = await fetch(`/api/product/${slug}`, {
            method: 'delete',
          });
          if (response.ok) {
            fetchProducts()
            message.destroy();
            message.success("Your product has been deleted")

            setFormval(false)

          } else {
            console.error('Failed to delete object:', response.statusText);
          }
        } catch (error) {
          console.error('Error deleting object:', error.message);
        } finally {
        }
      }
    });

  };

  const handleEdit = (item) => {
    setCurrentSlug(item.slug)
    setShowModal(true);
    setFormval(true)
    setProductForm({ slug: item.slug, quantity: item.quantity, price: item.price })
    setUpdate(item._id)
  };

  const closeModal = () => {

    setShowModal(false);
    setFormval(false)
    setIsFormChanged(false);

  };

  const handelChange = (e) => {
    setProductForm({ ...productForm, [e.target.name]: e.target.value })
    setIsFormChanged(true);

  }

  const updateProduct = async (e) => {
    e.preventDefault();

    if (Object.keys(productForm).length === 0 || !productForm.slug || !productForm.quantity || !productForm.price) {
      message.error("Please Fill All Required Boxes")
      return;
    }

    if (requestProcessing) {
      message.destroy()
      message.error("Form already submitted or request in progress")
      return;
    } else {
      const slugNames = value.map(item => item.slug);
      const productExists = slugNames.some(existingSlug => existingSlug === productForm.slug && existingSlug !== currentSlug);

      if (productExists) {
        message.error("This product name is already exists. Please try again")
        const { slug, ...rest } = productForm;
        setProductForm({ slug: '', ...rest });



      } else {


        setRequestProcessing(true);

        message.loading("Please Wait...")



        try {
          const response = await fetch(`/api/product/${update}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(productForm),
          });

          if (response.ok) {
            message.destroy()
            message.success("Product Update Successfully")
            setIsFormChanged(false);

            fetchProducts();
            setProductForm({});
            setShowModal(false);
            setFormval(false);

          } else {
            message.destroy()
            message.success("Failed to update product")
          }
        } catch (error) {
          message.destroy()
          message.error("Error updating product")

        } finally {
          setRequestProcessing(false);
        }

      }

    }

  };



  return (
    <div className="container my-6 mx-auto">
      <h1 className="text-3xl font-bold mb-4">Display Current Stock</h1>
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="pr-4 py-2 text-left pl-5">Product Name</th>
            <th className="pr-4 py-2 text-left pl-5">Quantity</th>
            <th className="pr-4 py-2 text-left pl-5">Price</th>
          </tr>
        </thead>
        <tbody>

          {loading ?

            <tr key="loading">
              <td className="border px-4 py-2 text-center text-lg" colSpan="3">Please Wait....</td>
            </tr>
            : value.length === 0 ? <tr key="no-data">
              <td className="border px-4 py-2 text-center text-lg" colSpan="3">No data available</td>
            </tr>

              : (
                value.map((items, index) => (
                  (formval ? (
                    <tr key={items.slug || index}>
                      <td className="border px-4 py-2">{items.slug}</td>
                      <td className="border px-4 py-2">{items.quantity}</td>
                      <td className="border px-4 py-2">PKR {items.price}</td>
                    </tr>
                  ) : (
                    <tr
                      key={items.slug}
                      onMouseEnter={() => handleMouseEnter(items.slug)}
                      onMouseLeave={handleMouseLeave}
                      className={`relative ${hoveredRow === items.slug ? 'bg-gray-100' : ''}`}
                    >
                      <td className="border px-2 py-2">{items.slug}</td>
                      <td className="border px-2 py-2">{items.quantity}</td>
                      <td className="border px-10 py-2">PKR {items.price}</td>
                      {hoveredRow === items.slug && (
                        <td className="md:absolute md:top-0 md:right-0 md:mt-2 md:mr-2 border">
                          <div className="flex flex-col md:flex-row md:gap-2 gap-1">
                            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-1 rounded" onClick={() => handleEdit(items)}>
                              Edit
                            </button>
                            <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded" onClick={() => handleDelete(items._id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                ))
              )}
        </tbody>
      </table>


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
            <h1 className="text-3xl text-center font-semibold mb-6">Update a product</h1>
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
                <button onClick={updateProduct} disabled={!isFormChanged} type="submit" className={`bg-blue-500 text-white px-4 py-2 border rounded-lg inline-flex items-center ${!isFormChanged && 'opacity-50 cursor-not-allowed'}`}> Update  </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

}


