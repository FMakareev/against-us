import * as dotenv from 'dotenv';
import { DotenvConfigOptions, DotenvConfigOutput } from 'dotenv';
import { get } from 'lodash';
import { NoInferType } from '../types/no-infer.type';

const environment = process.env.NODE_ENV || 'development';

class ConfigModule<K = Record<string, any>> {

  config: DotenvConfigOutput;

  constructor(options?: DotenvConfigOptions, customEnv?: any) {
    this.config = dotenv.config(options);
    if (!this.config.error) {
      this.config.parsed = {
        ...this.config.parsed,
        ...customEnv,
      };
    }
  }

  get<T = any>(propertyPath: keyof K, defaultValue?: NoInferType<T>): T {
    return get(this.config.parsed, propertyPath, defaultValue);
  }
}

export const configModule = new ConfigModule({
  path: `.env.${environment}`,
}, {
  NODE_ENV: environment,
});
