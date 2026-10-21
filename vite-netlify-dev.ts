import { existsSync } from 'node:fs';
import path from 'node:path';
import type { Plugin } from 'vite';
import { loadEnv } from 'vite';

const FUNCTION_ENV = ['NSP_SIGNING_KEY', 'NSP_ADMIN_EMAILS', 'POSTMARK_SERVER_TOKEN', 'NSP_LOGIN_FROM'];

/**
 * Runs the Netlify functions in netlify/functions inside `vite` dev, so the
 * organizer sign-in can be tried locally without the Netlify CLI. Settings
 * come from .env.local, and sign-in codes print in this terminal instead of
 * being emailed (unless a Postmark token is set there).
 */
export function netlifyFunctionsDev(): Plugin {
  return {
    name: 'netlify-functions-dev',
    apply: 'serve',
    configureServer(server) {
      const env = loadEnv('development', process.cwd(), '');
      for (const name of FUNCTION_ENV) {
        if (env[name] && !process.env[name]) process.env[name] = env[name];
      }
      process.env.NSP_DEV_AUTH = '1';

      server.middlewares.use(async (req, res, next) => {
        const match = /^\/\.netlify\/functions\/([a-z-]+)(?:\?.*)?$/.exec(req.url ?? '');
        const file = match && path.join(process.cwd(), 'netlify/functions', `${match[1]}.mts`);
        if (!file || !existsSync(file)) return next();

        try {
          const chunks: Buffer[] = [];
          for await (const chunk of req) chunks.push(chunk as Buffer);
          const hasBody = req.method !== 'GET' && req.method !== 'HEAD';
          const request = new Request(`http://${req.headers.host}${req.url}`, {
            method: req.method,
            headers: req.headers as Record<string, string>,
            body: hasBody ? Buffer.concat(chunks) : undefined,
          });

          const mod = await server.ssrLoadModule(file);
          const response: Response = await (mod.default as (r: Request) => Promise<Response>)(request);

          res.statusCode = response.status;
          response.headers.forEach((value, key) => {
            if (key !== 'set-cookie') res.setHeader(key, value);
          });
          const cookies = response.headers.getSetCookie();
          if (cookies.length) res.setHeader('set-cookie', cookies);
          res.end(Buffer.from(await response.arrayBuffer()));
        } catch (err) {
          server.config.logger.error(String(err));
          res.statusCode = 500;
          res.end('Function error');
        }
      });
    },
  };
}
