import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Explicitly load env variables
  const env = loadEnv(mode, process.cwd());

  return {
    server: {
      proxy: {
        '/api': {
          target: `${import.meta.env.FRONT_END_URL}`, // Using the loaded environment variable
          secure: false,
        },
      },
    },
    plugins: [react()],
  };
});
