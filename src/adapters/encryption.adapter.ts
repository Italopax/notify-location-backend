import { getEnv } from "@src/utils/constants";
import CryptoJS from "crypto-js"

export class EncryptionAdapter {
  public generateHash(value: string): string {
    return CryptoJS.HmacSHA256(value, getEnv().jwt.secretKey).toString(CryptoJS.enc.Base64);
  }
}