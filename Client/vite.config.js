import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Explicitly load env variables
  const env = loadEnv(mode, process.cwd());

  return {
<<<<<<< HEAD
=======
    server: {
      proxy: {
        '/api': {
          target: env.VITE_BACKEND_URL, // Using the loaded environment variable
          secure: false,
        },
      },
    },
>>>>>>> c2c36f65bea5e371e6c7aff752644f2682f01c2f
    plugins: [react()],
  };
});
