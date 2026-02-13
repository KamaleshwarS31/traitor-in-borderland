# Deployment Guide: Traitor in Borderland

This guide provides step-by-step instructions to deploy the entire project (Frontend, Backend, and Database) using free hosting services.

## Architecture Overview
- **Database**: Neon (PostgreSQL) - Free Tier
- **Backend**: Render (Node.js) - Free Tier
- **Frontend**: Vercel (Next.js) - Free Tier

---

## Prerequisite: Git Repository
Ensure your project is pushed to a GitHub repository.
1. Create a new repository on GitHub.
2. Push your local `healthclub` folder to this repository.
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

---

## Step 1: Deploy Database (Neon)
1. Go to [Neon.tech](https://neon.tech) and sign up.
2. Create a new project named `traitor-game`.
3. Default database name `neondb` is fine.
4. Once created, copy the **Connection String** (e.g., `postgres://user:pass@host/neondb...`).'postgresql://neondb_owner:npg_8XZJSNPd9eyF@ep-hidden-breeze-a1o2w70d-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
   - You will need this for the Backend deployment.
5. Go to the **SQL Editor** in the Neon dashboard.
6. Open your local file `backend/db/schema.sql`, copy all its contents, and paste them into the Neon SQL Editor.
7. Click **Run** to create all tables.

---

## Step 2: Deploy Backend (Render)
1. Go to [Render.com](https://render.com) and sign up.
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository.
4. Configure the service:
   - **Name**: `traitor-backend`
   - **Region**: Closest to you (e.g., Singapore or Oregon).
   - **Branch**: `main`
   - **Root Directory**: `backend` (Important!)
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: Free

5. Scroll down to **Environment Variables** and add:
   - `DATABASE_URL`: Paste the Neon Connection String from Step 1.
   - `NODE_ENV`: `production`
   - `FRONTEND_URL`: `*` (We will update this later with the Vercel URL).
   - `FIREBASE_PROJECT_ID`: Your Firebase Project ID.
   - `FIREBASE_CLIENT_EMAIL`: Your Firebase Client Email (from `backend/traitor-in-borderland-firebase...json`).
   - `FIREBASE_PRIVATE_KEY`: Your Firebase Private Key (ensure to include the full `-----BEGIN PRIVATE KEY-----...` content).
     - *Alternatively*, you can paste the entire content of your Firebase JSON file into a variable named `FIREBASE_SERVICE_ACCOUNT_JSON`.

6. Click **Create Web Service**.
7. Wait for deployment to finish. Copy the **Service URL** (e.g., `https://traitor-backend.onrender.com`).https://traitor-in-borderland.onrender.com

---

## Step 3: Deploy Frontend (Vercel)
1. Go to [Vercel.com](https://vercel.com) and sign up.
2. Click **Add New** -> **Project**.
3. Import your GitHub repository.
4. Vercel should detect `Next.js`.
5. Configure Project:
   - **Root Directory**: Click "Edit" and select `frontend`.
   - **Framework Preset**: Next.js
6. Expand **Environment Variables** and add:
   - `NEXT_PUBLIC_API_URL`: The Render Backend URL (e.g., `https://traitor-backend.onrender.com`). **Do not add a trailing slash**.
   - `NEXT_PUBLIC_FIREBASE_API_KEY`: Your Firebase API Key (from `frontend/.env`).
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`: Your Firebase Auth Domain.
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: Your Firebase Project ID.

7. Click **Deploy**.
8. Wait for deployment. Once done, you will get a **Domain** (e.g., `traitor-game.vercel.app`).

---

## Step 4: Final Configuration
1. **Update Backend CORS**:
   - Go back to Render Dashboard -> `traitor-backend` -> Environment.
   - Edit `FRONTEND_URL` and set it to your Vercel Domain (e.g., `https://traitor-game.vercel.app`).
   - Save Changes. Render will redeploy automatically.

2. **Update Firebase Auth**:
   - Go to [Firebase Console](https://console.firebase.google.com).
   - Select your project -> Authentication -> Settings -> Authorized Domains.
   - Add your Vercel domain (`traitor-game.vercel.app`) to the list.

## Usage
- Open your Vercel URL.
- Login/Register as Master Admin (email set in `backend/init-db.js` or modify DB directly via Neon SQL Editor to create admin role).
  - *Tip*: You can run `INSERT INTO users (email, role) VALUES ('your@email.com', 'master_admin');` in Neon SQL Editor.

**Done! Your game is live.**
