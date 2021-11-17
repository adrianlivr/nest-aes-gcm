import { DynamicModule, Global, Module } from '@nestjs/common';
import {
  AesGcmModuleAsyncOptions,
  AesGcmModuleOptions,
} from './aes-gcm.interfaces';
import { AesGcmService } from './aes-gcm.service';
import { AES_GCM_OPTIONS } from './constants';

@Global()
@Module({})
export class AesGcmModule {
  static forRoot(options: AesGcmModuleOptions): DynamicModule {
    return {
      module: AesGcmModule,
      providers: [
        {
          provide: AES_GCM_OPTIONS,
          useValue: options,
        },
        AesGcmService,
      ],
      exports: [AES_GCM_OPTIONS, AesGcmService],
    };
  }

  static forRootAsync({
    imports,
    inject,
    useFactory,
    useClass,
  }: AesGcmModuleAsyncOptions): DynamicModule {
    return {
      module: AesGcmModule,
      imports,
      providers: [
        useFactory
          ? {
              provide: AES_GCM_OPTIONS,
              useFactory,
              inject,
            }
          : {
              provide: AES_GCM_OPTIONS,
              useClass,
            },
        AesGcmService,
      ],
      exports: [AES_GCM_OPTIONS, AesGcmService],
    };
  }
}
