import dotenv from 'dotenv';

dotenv.config();

interface EnvConfigs {
  PORT: string;
  DB_URL: string;
  NODE_ENV: 'development' | 'production';
}

const loadEnvironmentVariables = (): EnvConfigs => {
  const requiredEnvVariables = ['PORT', 'DB_URL', 'NODE_ENV'];

  requiredEnvVariables.forEach(key => {
    if (!process.env[key]) {
      throw new Error(`Environment variable ${key} is not defined`);
    }
  });

  return {
    PORT: process.env.PORT as string,
    DB_URL: process.env.DB_URL as string,
    NODE_ENV: process.env.NODE_ENV as 'development' | 'production',
  };
};

export const envVars: EnvConfigs = loadEnvironmentVariables();
