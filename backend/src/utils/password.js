import crypto from 'crypto'

export const generarPasswordSegura = (length = 14) => {
  return crypto.randomBytes(length)
    .toString('base64')
    .replace(/[^a-zA-Z0-9!@#$%^&*]/g, '')
    .slice(0, length)
}
