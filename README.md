# React + Vite

## Vercel API routing

The browser calls `/__forum_api`. Vite proxies this path during development,
and `vercel.json` forwards it to the production backend before the SPA fallback.
When changing the production backend, update the external rewrite destination
in `vercel.json`; the local `VITE_BASE_FORUM_LOST_URL` / `VITE_API_BASE_URL`
variables only configure Vite's development proxy.

Configure the `VITE_FIREBASE_*` variables in Vercel for the deployment environment
and redeploy after changing them. Local `.env` files are ignored by Git.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
