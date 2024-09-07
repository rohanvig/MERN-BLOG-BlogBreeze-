import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Explicitly load env variables
  const env = loadEnv(mode, process.cwd());

  return {
    server: {
      proxy: {
        '/api': {
          target: env.VITE_BACKEND_URL, // Using the loaded environment variable
          secure: false,
        },
      },
    },
    plugins: [react()],
  };
});
