import { Test, TestingModule } from '@nestjs/testing';
import { AesGcmService } from './aes-gcm.service';
import { AES_GCM_OPTIONS } from './constants';

describe('AesGcmService', () => {
  let service: AesGcmService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        AesGcmService,
        {
          provide: AES_GCM_OPTIONS,
          useValue: {
            key: 'string',
            iv: 16,
            salt: 64,
            encoding: 'hex',
          },
        },
      ],
    }).compile();

    service = await moduleRef.resolve(AesGcmService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('GenerateRandomKey', () => {
    it('should be return a random key', () => {
      const randomKey = service.generateRandomKeySync(32, 'hex');
      expect(randomKey).toHaveLength(64);
    });

    it('should be return an async random key', async () => {
      const randomKey = await service.generateRandomKey(32, 'hex');
      expect(randomKey).toHaveLength(64);
    });
  });

  describe('Encrypt and Decrypt', () => {
    it('should be encrypt and decrypt a string', () => {
      const text = 'The example text to encrypt';
      const encrypted = service.encryptSync(text);

      expect(service.decryptSync(encrypted)).toEqual(text);
    });

    it('should be encrypt and decrypt async a string', async () => {
      const text = 'The example text to encrypt';
      const encrypted = await service.encrypt(text);

      expect(await service.decrypt(encrypted)).toEqual(text);
    });
  });

  describe('Hash', () => {
    it('should be return a hash', () => {
      const hash = service.hash('An any value');
      expect(typeof hash).toEqual('string');
    });
  });
});
