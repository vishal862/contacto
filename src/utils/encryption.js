import CryptoJS from "crypto-js"
import dotenv from "dotenv"

dotenv.config();

const secretKey = process.env.ENCRYPTION_KEY;

export const encrypt = (data) => {
    const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
    return encryptedData;
};

export const decrypt = (encryptedData) => {
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
};

