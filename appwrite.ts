import { Client, Account, ID, Databases, Storage } from "appwrite";
const client = new Client();

client.setEndpoint("https://cloud.appwrite.io/v1").setProject("65f82f3b146bcebf1a67");

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);

export { client, account, databases, storage, ID };
