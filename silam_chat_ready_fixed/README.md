# Silam Chat (Vercel-ready)

This is a ready-to-deploy chat app (web + Vercel serverless API) that uses OpenAI's Chat Completions.
Silam behaves like ChatGPT and saves chat history locally in the browser.

## Quick Deploy (Vercel)
1. Create a new repo in GitHub (e.g., `silam-chat-ai`) and upload all files from this package.
2. On Vercel, click **Import Project** → choose the repo and deploy.
3. In your Vercel project **Settings → Environment Variables**, add:
   - `OPENAI_API_KEY` = your OpenAI secret key (sk-...)
4. Redeploy the project.

## Local development
- Install: `npm install`
- Run dev server: `npm run dev`
- Build: `npm run build`

## Notes
- The serverless API endpoint is `/api/chat` and will proxy requests to OpenAI.
- The frontend stores chat history in `localStorage`.
- Greeting: "Hey, I'm Silam — how can I help you today?"


## Fixes included
- Added `type: module` to package.json so serverless functions using ESM syntax work on Vercel.
- Added a typing placeholder UI and improved error replacement logic.
- The backend will read `OPENAI_MODEL` env var if you want to change model without editing code.
