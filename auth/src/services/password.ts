import {scrypt, randomBytes} from 'crypto'
import {promisify} from 'util'

// vì scrypt không phải là 1 promise
// nên ta phải bọc nó trong 1 promise để dùng async/await
// cách bọc ở đây
// https://dev.to/farnabaz/hash-your-passwords-with-scrypt-using-nodejs-crypto-module-316k
const scryptAsync = promisify(scrypt)

export class Password {
    static async toHash(password: string) {
        const salt = randomBytes(8).toString('hex')

        // TS không biết scryptAsync sẽ return về kiểu dữ liệu gì
        // nên buf.toString() sẽ bị error
        // so phải báo TS biết scryptAsync sẽ return Buffer
        const buf = (await scryptAsync(password, salt, 64)) as Buffer;

        return `${buf.toString('hex')}.${salt}`
    }

    static async compare(storedPassword: string, suppliedPassword: string) {
        const [hashedPassword, salt] = storedPassword.split('.')
        const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;
        return buf.toString('hex') === hashedPassword
    }
}

