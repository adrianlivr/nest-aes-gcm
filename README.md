<p align="center">
  <a href="http://nestjs.com"><img src="https://nestjs.com/img/logo_text.svg" alt="Nest Logo" width="320" /></a>
</p>

<p align="center">
  The AES GCM encryption module for <a href="https://github.com/nestjs/nest">Nest</a>.
</p>

## Configure

app.module.ts

```ts
...
@Module({
	...
	imports: [
		...
		AesGcmModule.forRoot({
			// Default Options
			key: 'SECRET_KEY', /* optional */
			salt: 64, /* opcional */
			iv: 16, /* optional */
			encoding: 'hex', /* optional */
		}),
		...
		// For asynchronous configuration
		...
		AesGcmModule.forRootAsync({
			import: [ConfigModule],
			useFactory: (config: ConfigService) => ({
				key: config.get('SECRET_KEY')
			})
			inject: [ConfigService]
		}),
		...
		// OR
		AesGcmModule.forRootAsync({
			useClass: AesGcmConfigClass
		}),
		...
	],
	...
})
...

```

your.service.ts

```ts
...
@Injectable()
export class YourService{
	constructor(private readonly aesGcmService: AesGcmService) {}

	async encrypt(text: string): Promise<string> {
		return await this.aesGcmService.encrypt(text);
	}

	encryptSync(text: string): string {
		return this.aesGcmService.encrypt(text);
	}

	async decryption(encrypted: string): Promise<string> {
		return  await this.aesGcmService.decrypt(encrypted);
	}

	decryptionSync(encrypted: string): string {
		return this.aesGcmService.decrypt(encrypted);
	}

	async generateRandomKey(len: number /* default: 32 */): Promise<string> {
		return await this.aesGcmService.generateRandomKey(len);
	}

	generateRandomKeySync(len: number): string {
		return this.aesGcmService.generateRandomKeySync(len);
	}

	hash(data: string, algorithm: string /* default: sha256 */): string {
		return this.aesGcmService.hash(data, algorithm);
	}
}
...
```

### Use Asynchronous methods for better performance
