import { NextResponse } from "next/server"
import { MongoClient, ObjectId } from "mongodb";


export async function DELETE(req, content) {

  const uri = process.env.MONGODB_URI;

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("Stock");
    const inventory = database.collection("inventory");

    const productId = content.params.id;

    const record = { _id: new ObjectId(productId) };

    console.log("productId ", new ObjectId(productId))

    const result = await inventory.deleteOne(record);

    console.log("result ", result)

    if (result.deletedCount === 0) {
      return new NextResponse("Object not found", { status: 404 });
    }

    return new NextResponse("Object deleted successfully", { status: 200 });
  } catch (error) {
    console.error("Error deleting object:", error);
    return new NextResponse("Internal server error", { status: 500 });
  } finally {
    await client.close();
  }
}

export async function PUT(req, content) {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);
  let body = await req.json();


  try {
    await client.connect();
    const database = client.db("Stock");
    const inventory = database.collection("inventory");

    const productId = content.params.id;
    const updateData = body;
    console.log("update data ", updateData)

    const filter = { _id: new ObjectId(productId) };
    const update = { $set: updateData };

    const result = await inventory.findOneAndUpdate(filter, update);

    if (result.matchedCount === 0) {
      return new NextResponse("Object not found", { status: 404 });
    }

    return new NextResponse("Object updated successfully", { status: 200 });
  } catch (error) {
    console.error("Error updating object:", error);
    return new NextResponse("Internal server error", { status: 500 });
  } finally {
    await client.close();
  }
}
