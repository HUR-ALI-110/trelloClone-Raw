import { storage } from "@/appwrite";
import { ID } from "appwrite";

const uploadImage = async(file:File)=>{
    if(!file)return;
    const fileUploded =  await storage.createFile("65f832d620b5610516bb",ID.unique(),file)
    return fileUploded;
}
export default uploadImage