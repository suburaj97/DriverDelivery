import Config from 'react-native-config';

/**
 * Environment configuration module.
 *
 * This module is the single source of truth for reading environment variables
 * in the mobile app. Values are provided at build time via `react-native-config`
 * and must be declared in the root `.env` file.
 */

type OptionalEnvKey = 'GOOGLE_MAPS_API_KEY';

const getOptionalEnv = (key: OptionalEnvKey): string | undefined => {
  const value = Config[key];

  return value == null || value === '' ? undefined : String(value);
};

export interface EnvConfig {
  googleMapsApiKey?: string;
}

const envConfig: EnvConfig = {
  googleMapsApiKey: getOptionalEnv('GOOGLE_MAPS_API_KEY'),
};

export const env = envConfig;
