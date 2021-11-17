import { ModuleMetadata, Type } from "@nestjs/common";

export type AesGcmModuleOptions = {
  key?: string;
  iv?: number;
  salt?: number;
  encoding?: BufferEncoding;
};

export interface AesGcmModuleOptionsFactory {
  createAesGcmModuleOptions():
    | Promise<AesGcmModuleOptions>
    | AesGcmModuleOptions;
}

export interface AesGcmModuleAsyncOptions
  extends Pick<ModuleMetadata, "imports"> {
  useFactory?: (
    ...args: any[]
  ) => Promise<AesGcmModuleOptions> | AesGcmModuleOptions;
  inject?: any[];
  useClass?: Type<AesGcmModuleOptionsFactory>;
}
