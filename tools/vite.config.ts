import { homedir } from 'node:os';
import { join } from 'node:path';

/** The Webslides checkout whose packages (consumed as TypeScript source) build the deck. */
const WEBSLIDES = process.env.WEBSLIDES_DIR ?? join(homedir(), 'Coding/webslides');

export default {
  resolve: {
    alias: [
      {
        find: /^@webslides\/([a-z-]+)$/,
        replacement: join(WEBSLIDES, 'packages/$1/src/index.ts'),
      },
      { find: /^jsdom$/, replacement: join(WEBSLIDES, 'node_modules/jsdom/lib/api.js') },
    ],
  },
  server: { fs: { allow: [WEBSLIDES, join(import.meta.dirname, '..')] } },
};
