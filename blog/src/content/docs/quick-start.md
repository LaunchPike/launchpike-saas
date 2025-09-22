---
title: Quick start
group: Start here
order: 3
---

# Quick start

_This runbook gets your SaaS app running locally fast. If you ever get stuck, come back to this runbook._

---

## 0) Install Wasp

**Pre-requisites**

- Node.js ≥ **22.12 (with npm)** available in `PATH`.
- We recommend **nvm** to switch Node versions easily. _(See: Installing and using nvm / Need help with nvm?)_

**Linux & macOS**

Open terminal and run:

<div class="codebox">
  <div class="codebox__cap">bash</div>
  <pre><code class="language-bash">curl -sSL https://get.wasp.sh/installer.sh | sh</code></pre>
</div>

**Apple Silicon note:** if you hit “Bad CPU type in executable”, see the Mac/Apple Silicon fix in the docs.

**Windows**

Use **WSL** (we recommend Ubuntu).  
Follow the step-by-step article to run Wasp in WSL; if needed, ping us on Discord.

Be sure to complete the **WSL2 Docker post installation** steps so PostgreSQL and Docker work correctly with Wasp.

Once inside your WSL environment, run:

<div class="codebox">
  <div class="codebox__cap">bash (WSL)</div>
  <pre><code class="language-bash">curl -sSL https://get.wasp.sh/installer.sh | sh</code></pre>
</div>

> Hitting WSL2 file system issues? See the troubleshooting note in docs.

---

## 1) Finalize installation

Verify Wasp is installed:

<div class="codebox">
  <div class="codebox__cap">bash</div>
  <pre><code class="language-bash">wasp version</code></pre>
</div>

For best DX (syntax highlighting, scaffolding, autocomplete), install the **Wasp VSCode extension**.  
_(Search “Wasp” in VS Code Extensions or visit the extension homepage.)_

---

## 2) Create your app from the OpenSaaS template

From the directory where you want your project:

<div class="codebox">
  <div class="codebox__cap">bash</div>
  <pre><code class="language-bash">wasp new</code></pre>
</div>

Enter your project name, then choose **[3] saas** from the template list.  
This clones a clean copy of the **Open SaaS** template. 🎉

---

## 3) Start your database

You need a running **Postgres** instance.

- Ensure **Docker** is installed and running.
- In a **new terminal** (inside your app directory):

<div class="codebox">
  <div class="codebox__cap">bash</div>
  <pre><code class="language-bash">cd app</code></pre>
</div>

Then:

<div class="codebox">
  <div class="codebox__cap">bash</div>
  <pre><code class="language-bash">wasp start db</code></pre>
</div>

Leave this terminal open while you work — stopping it stops your DB.

Create the first migration (installs deps on first run):

<div class="codebox">
  <div class="codebox__cap">bash</div>
  <pre><code class="language-bash">wasp db migrate-dev</code></pre>
</div>

In the future, run `wasp db migrate-dev` whenever you change your Prisma schema.

**Optional** — open Prisma Studio:

<div class="codebox">
  <div class="codebox__cap">bash</div>
  <pre><code class="language-bash">wasp db studio</code></pre>
</div>

---

## 4) Start your app

In the `app/` directory with DB running in another terminal:

**Copy env template:**

<div class="codebox">
  <div class="codebox__cap">bash</div>
  <pre><code class="language-bash">cp .env.server.example .env.server</code></pre>
</div>

`.env.server` holds API keys for payments, email, etc. For now, the dummy keys are fine to boot the app.

**Start the app:**

<div class="codebox">
  <div class="codebox__cap">bash</div>
  <pre><code class="language-bash">wasp start</code></pre>
</div>

If the browser doesn’t open automatically, visit **http://localhost:3000**.

At this point you should have:

- DB running (likely on port **5432**),  
- App running (client on **3000**, server on **3001**).

---

## 5) Run Docs & Blog (optional)

This starter includes **Astro (Starlight)** docs/blog. Use it as a base or delete it if you don’t need it.

To run it:

<div class="codebox">
  <div class="codebox__cap">bash</div>
  <pre><code class="language-bash">cd ../blog</code></pre>
</div>

Install deps:

<div class="codebox">
  <div class="codebox__cap">bash</div>
  <pre><code class="language-bash">npm install</code></pre>
</div>

Start dev server:

<div class="codebox">
  <div class="codebox__cap">bash</div>
  <pre><code class="language-bash">npm run dev</code></pre>
</div>

Check the terminal for the URL (typically **https://localhost:4321/**).

---

## What’s next?

You now have the app (and optional docs/blog) running locally.  
Next up: a quick guided tour of the app’s parts so you understand how everything fits together.

If this template helps, consider ⭐ **starring the GitHub repo** — it keeps the project healthy and improving.
