import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load environment variables for the current mode (development, production, etc.)
  const env = loadEnv(mode, process.cwd());

  return {
    server: {
      proxy: {
        '/api': {
          target: env.VITE_FRONT_END_URL, // Use `VITE_` prefix for env vars in Vite
          changeOrigin: true,             // Ensure that the origin is rewritten
          secure: false,                  // If using HTTPS on the target server
        },
      },
    },
    plugins: [react()],
  };
});
