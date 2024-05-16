import { MongoClient } from "mongodb"; 
import { NextResponse } from "next/server";


export async function GET(request){


const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri);

  try {
    const database = client.db("Stock");
    const inventory = database.collection("inventory")
    const query = { }
    const products = await inventory.find(query).toArray();
    console.log("You successfully connected to MongoDB!",products);
    return NextResponse.json({ products})
  } finally {
    await client.close();
  }
}


export async function POST(req){

  let body = await req.json();
  const uri = process.env.MONGODB_URI;
  
  const client = new MongoClient(uri);
  
    try {
      const database = client.db("Stock");
      const inventory = database.collection("inventory")
      const query = { }
      const product = await inventory.insertOne(body)
      console.log("You successfully connected to MongoDB!",product);
      return NextResponse.json({ product, ok: true })
    } finally {
      await client.close();
    }
  }
