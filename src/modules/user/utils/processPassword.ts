import {
  BinaryLike,
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scrypt,
} from 'crypto';
import { promisify } from 'util';

export const encrypt = async (password: BinaryLike): Promise<any> => {
  const iv = randomBytes(16);
  const passkey = process.env.PASS_KEY;
  const key = (await promisify(scrypt)(passkey, 'salt', 32)) as Buffer;
  const cipher = createCipheriv('aes-256-ctr', key, iv);

  return {
    password: Buffer.concat([cipher.update(password), cipher.final()]),
    iv_code: iv,
  };
};

export const decrypt = async (password: any, iv: any): Promise<any> => {
  const passkey = process.env.PASS_KEY;
  const key = (await promisify(scrypt)(passkey, 'salt', 32)) as Buffer;
  const decipher = createDecipheriv('aes-256-ctr', key, iv);

  return Buffer.concat([decipher.update(password), decipher.final()]);
};
