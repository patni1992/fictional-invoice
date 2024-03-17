import { MongoClient, Db } from "mongodb";

const url = process.env.MONGODB_URL || "mongodb://localhost:27017";
const dbName = process.env.DB_NAME || "invoice-db";

const client = new MongoClient(url);
let dbInstance: Db | null = null;

export async function connectToDB(): Promise<Db> {
  if (dbInstance) {
    return dbInstance;
  }

  try {
    await client.connect();
    console.log("Connected successfully to MongoDB");
    dbInstance = client.db(dbName);
    return dbInstance;
  } catch (error) {
    console.error("Could not connect to DB", error);
    throw error;
  }
}
