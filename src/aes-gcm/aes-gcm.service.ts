import { Inject, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { AesGcmModuleOptions } from './aes-gcm.interface';
import { AES_GCM_OPTIONS } from './constants';

@Injectable()
export class AesGcmService {
  private readonly key: string;
  private readonly iv: number;
  private readonly salt: number;
  private readonly encoding: BufferEncoding;

  constructor(
    @Inject(AES_GCM_OPTIONS) private readonly options: AesGcmModuleOptions,
  ) {
    this.key = options.key || this.generateRandomKeySync();
    this.iv = options.iv || 16;
    this.salt = options.salt || 64;
    this.encoding = options.encoding || 'hex';
  }

  generateRandomKey(
    size = 32,
    encoding: BufferEncoding = this.encoding,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(size, (err, buf) => {
        if (err) return reject(err);

        return resolve(buf.toString(encoding));
      });
    });
  }

  generateRandomKeySync(
    size = 32,
    encoding: BufferEncoding = this.encoding,
  ): string {
    return crypto.randomBytes(size).toString(encoding);
  }

  encrypt(
    data: string,
    secretKey: string = this.key,
    $salt: number = this.salt,
    $iv: number = this.iv,
    encoding: BufferEncoding = this.encoding,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      crypto.randomBytes($iv, (err, iv) => {
        if (err) reject(err);
        crypto.randomBytes($salt, (err, salt) => {
          if (err) reject(err);
          crypto.pbkdf2(secretKey, salt, 2145, 32, 'sha512', (err, key) => {
            if (err) reject(err);

            const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
            const encrypted = Buffer.concat([
              cipher.update(data, 'utf8'),
              cipher.final(),
            ]);
            const tag = cipher.getAuthTag();
            return resolve(
              Buffer.concat([salt, iv, tag, encrypted]).toString(encoding),
            );
          });
        });
      });
    });
  }

  decrypt(
    encrypted: string,
    secretKey: string = this.key,
    $salt: number = this.salt,
    $iv: number = this.iv,
    encoding: BufferEncoding = this.encoding,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const bData = Buffer.from(encrypted, encoding);
      const salt = bData.slice(0, $salt);
      const iv = bData.slice($salt, $salt + $iv);
      const tag = bData.slice($salt + $iv, $salt + $iv + 16);
      const text = bData.slice($salt + $iv + 16);

      crypto.pbkdf2(secretKey, salt, 2145, 32, 'sha512', (err, key) => {
        if (err) return reject(err);
        const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
        decipher.setAuthTag(tag);

        return resolve(
          decipher.update(text, undefined, 'utf8') + decipher.final('utf8'),
        );
      });
    });
  }

  encryptSync(
    data: string,
    secretKey: string = this.key,
    $salt: number = this.salt,
    $iv: number = this.iv,
    encoding: BufferEncoding = this.encoding,
  ): string {
    const iv = crypto.randomBytes($iv);
    const salt = crypto.randomBytes($salt);
    const key = crypto.pbkdf2Sync(secretKey, salt, 2145, 32, 'sha512');
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    const encrypted = Buffer.concat([
      cipher.update(data, 'utf8'),
      cipher.final(),
    ]);
    const tag = cipher.getAuthTag();
    return Buffer.concat([salt, iv, tag, encrypted]).toString(encoding);
  }

  decryptSync(
    encrypted: string,
    secretKey: string = this.key,
    $salt: number = this.salt,
    $iv: number = this.iv,
    encoding: BufferEncoding = this.encoding,
  ): string {
    const bData = Buffer.from(encrypted, encoding);
    const salt = bData.slice(0, $salt);
    const iv = bData.slice($salt, $salt + $iv);
    const tag = bData.slice($salt + $iv, $salt + $iv + 16);
    const text = bData.slice($salt + $iv + 16);
    const key = crypto.pbkdf2Sync(secretKey, salt, 2145, 32, 'sha512');
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(tag);

    return decipher.update(text, undefined, 'utf8') + decipher.final('utf8');
  }

  hash(data: string, algorithm?: string): string {
    return crypto
      .createHash(algorithm || 'sha256')
      .update(data)
      .digest('hex');
  }
}
