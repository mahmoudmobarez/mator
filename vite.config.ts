import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      server: {
        host: '0.0.0.0', // Ensure it listens on all interfaces
        allowedHosts: [
          '5173-i9wphqb5xthnhvmxdfpy4-36b11016.manusvm.computer', // Keep old one just in case
          '5174-i25rlx7ib283atqmssij1-e38eca77.manusvm.computer', // Keep old one just in case
          '5173-iwrlq7bwfqdudylgmevst-8fc70f75.manusvm.computer', // Keep previous proxy domain
          '5173-iv5gb8wgi09ptg6g23kwq-7ea0d6d9.manusvm.computer', // Add the current proxy domain for port 5173
          '5174-iwrlq7bwfqdudylgmevst-8fc70f75.manusvm.computer'  // Add the current proxy domain for port 5174
        ]
      }
    };
});

