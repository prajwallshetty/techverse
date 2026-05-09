import { MongoClient, type Db } from "mongodb";

import { env } from "@/lib/env";

const options = {};

declare global {
  var _agriholdMongoClient: MongoClient | undefined;
  var _agriholdMongoClientPromise: Promise<MongoClient> | undefined;
}

function createMongoClient() {
  if (!env.MONGODB_URI) {
    throw new Error("Missing required environment variable: MONGODB_URI");
  }

  return new MongoClient(env.MONGODB_URI, options);
}

export function getMongoClientPromise() {
  const client = globalThis._agriholdMongoClient ?? createMongoClient();

  if (process.env.NODE_ENV !== "production") {
    globalThis._agriholdMongoClient = client;
  }

  const clientPromise =
    globalThis._agriholdMongoClientPromise ?? client.connect();

  if (process.env.NODE_ENV !== "production") {
    globalThis._agriholdMongoClientPromise = clientPromise;
  }

  return clientPromise;
}

export async function getDb(): Promise<Db> {
  const connectedClient = await getMongoClientPromise();
  return connectedClient.db(env.MONGODB_DB);
}
