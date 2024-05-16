"use client"
import { Header } from "@/components/Header";
import Addproduct from "@/components/Addproduct";
import Display from "@/components/Display";
import Search from "@/components/Search";
import { MyContextProvider } from '@/context/ProCon';



export default function Home() {


  return (
    <>
      <MyContextProvider>
        <Header />
        <Addproduct />
        <Search />
        <Display />
      </MyContextProvider>
    </>
  );
}
