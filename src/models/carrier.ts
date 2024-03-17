import { ObjectId } from "mongodb";
import { connectToDB } from "../db";

type Carrier = {
  _id: ObjectId;
  name: string;
};

export async function getCarriers(): Promise<Carrier[]> {
  const db = await connectToDB();
  const collection = db.collection<Carrier>("carriers");
  return collection.find({}).toArray();
}
