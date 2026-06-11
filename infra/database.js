import { Client } from "pg";
import fs from "fs";
import path from "path";

async function query(queryObject) {
  const certPath = path.resolve("./certs/prod-ca-2021.crt");
  const ca = fs.readFileSync(certPath, "utf8");

  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    ssl: true,
  });

  try {
    await client.connect();
    const result = await client.query(queryObject);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await client.end();
  }
}

export default {
  query: query,
};
