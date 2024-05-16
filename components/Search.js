import React from 'react'
import { useState, useEffect } from "react";
import { useMyContext } from '@/context/ProCon';


export default function Search() {

  const [searchQurey, setSearchQurey] = useState("");
  const [selectedOption, setSelectedOption] = useState("slug");

  const { value, setValue, setOriginalData, originalData } = useMyContext();


  useEffect(() => {
    SearchData(searchQurey)
  }, [searchQurey, selectedOption])

  const SearchData = (searchQuery) => {
    let filteredData = originalData;

    if (searchQuery) {
      filteredData = filteredData.filter((user) =>
        user[selectedOption].toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    switch (selectedOption) {
      case "slug":
        break;
      case "price":
        filteredData.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case "quantity":
        filteredData.sort((a, b) => parseInt(a.quantity) - parseInt(b.quantity));
        break;
      default:
        break;
    }

    setValue(filteredData);
  };

  return (
    <div className="container  mx-auto">
      <h1 className="text-3xl font-bold mb-6">Search a Product</h1>
      <div className="flex mb-2">
        <input
          type={selectedOption === 'quantity' || selectedOption === 'price' ? 'number' : 'text'}
          className="w-full border border-gray-300 px-4 py-2"
          placeholder={`Search for a ${selectedOption} ...`}
          value={searchQurey}
          onChange={(e) => setSearchQurey(e.target.value)}
        />
        <select
          id="searchQurey"
          className="ml-4 px-4 py-2 border-x-pink-700  "
          name="searchQurey"
          value={selectedOption}
          onChange={(e) => setSelectedOption(e.target.value)}
        >
          <option value="slug">Slug</option>
          <option value="quantity">Quantity</option>
          <option value="price">Price</option>
        </select>
      </div>

    </div>

  )
}
