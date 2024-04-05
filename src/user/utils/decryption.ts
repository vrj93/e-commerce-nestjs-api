import { createDecipheriv, scrypt } from 'crypto';
import { promisify } from 'util';

const decrypt = async (password: any, iv: any): Promise<any> => {
  const passkey = process.env.PASS_KEY;

  const key = (await promisify(scrypt)(passkey, 'salt', 32)) as Buffer;
  const decipher = createDecipheriv('aes-256-ctr', key, iv);

  return Buffer.concat([decipher.update(password), decipher.final()]);
};
export default decrypt;
