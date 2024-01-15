import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";
dotenv.config();
const uri = process.env.URL_MONGODB;

export const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });

    console.log("Conectado ao MongoDB Atlas");
  } catch (error) {
    console.log(error);
  }
}
