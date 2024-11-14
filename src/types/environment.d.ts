// src/types/environment.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string;
    JWT_SECRET: string;
    DATABASE_URL: string;
    NODE_ENV: 'development' | 'production' | 'test';
  }
}
