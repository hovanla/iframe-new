import { getCookie, deleteCookie } from 'hono/cookie';
import { verify } from 'hono/jwt';

// Password hashing với Web Crypto API
export async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function comparePassword(password, hash) {
  const newHash = await hashPassword(password);
  return newHash === hash;
}

// Auth middleware
export const checkToken = async (c, next) => {
  const token = getCookie(c, 'authcookieif');
  if (!token) {
    return c.redirect('/login');
  }

  try {
    const payload = await verify(token, 'iframe');
    c.set('user', payload.user);
    await next();
  } catch (err) {
    return c.redirect('/login');
  }
};
