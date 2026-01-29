// NOTE: create files for different utilities if file size increases and remove barrel file
import * as jose from 'jose';
import { environment } from '../../environments/environment.development';

const extractArrayFromString = (str: string) => {
  return str?.split(',')?.map((item) => item.trim());
};

const generateJWT = async (name: string, email: string) => {
  console.log('email in generateJWT: ', email);
  const sanitizedEmail = email.replace(/\s+/g, '+');

  const payload = {
    email: sanitizedEmail,
    name: name,
    iat: Math.floor(Date.now() / 1000),
    jti: Math.floor(Math.random() * Math.pow(2, 64)).toString(),
  };

  const encoder = new TextEncoder();
  const secret = encoder.encode(environment.zendeskJWTKey);

  const token = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .sign(secret);

  return token;
};

export { extractArrayFromString, generateJWT };
