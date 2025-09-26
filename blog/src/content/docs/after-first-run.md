---
title: After the first run
group: Start here
order: 4
---

# After the first run

_This guide explains what to know after your first successful run of the OpenSaaS template._

---

## After your first run: what to know

### Dev email flow (important)

When you sign up a new user, you'll be told to "check your email." **In development**, emails are **logged to the server** (Dummy provider), not sent. Open your server logs and click the verification link.

<div class="codebox">
  <div class="codebox__cap">Server Console Output</div>
  <pre><code>[ Server ] ╔═══════════════════════╗
[ Server ] ║ Dummy email sender ✉️ ║
[ Server ] ╚═══════════════════════╝
[ Server ] From: Open SaaS App <me@example.com>
[ Server ] To: vinny@wasp.sh
[ Server ] Subject: Verify your email
[ Server ] ═════════ Text ═════════
[ Server ] Click the link below to verify your email: http://localhost:3000/email-verification?token=eyJh...
[ Server ] ═════════ HTML ═════════
[ Server ] <p>Click the link below to verify your email</p>
[ Server ] <a href="http://localhost:3000/email-verification?token=eyJh...">Verify Email</a>
[ Server ] ════════════════════════</code></pre>
</div>

### What isn't configured yet

Payments (UniBee/Stripe/Lemon Squeezy), OpenAI, AWS S3, social Auth, Analytics, etc. need **API keys/config**. The guides that follow show you how to wire each one.

### Want to see the end state?

Explore **OpenSaaS.sh** (built with this template): log in, try the demo app, run a test payment, peek at the admin dashboard.

---

## Codebase Tour (1 minute)

At the root you'll see:

<div class="codebox">
  <div class="codebox__cap">Project Structure</div>
  <pre><code>.
├── app
├── blog
└── e2e-tests</code></pre>
</div>

- **app** — your Wasp full-stack app (React + NodeJS + Prisma) incl. `main.wasp`.
- **blog** — Astro Starlight docs/blog.
- **e2e-tests** — Playwright end-to-end tests.

### App file structure (vertical by feature)

> **Note:** Using Wasp v0.13 or below? You might see a slightly different structure; features remain the same.

<div class="codebox">
  <div class="codebox__cap">App Directory Structure</div>
  <pre><code>.
├── main.wasp              # Wasp Config file. You define your app structure here.
├── .wasp/                 # Output dir for Wasp. DON'T MODIFY THESE FILES.
├── public/                # Public assets dir, e.g. www.yourdomain.com/favicon.ico
├── src/                   # Your code goes here.
│   ├── admin/             # Admin dashboard related pages and components.
│   ├── analytics/         # Logic and background jobs for processing analytics.
│   ├── auth/              # All auth-related pages/components and logic.
│   ├── client/            # Shared components, hooks, landing page, and other client code.
│   ├── demo-ai-app/       # Logic for the example AI-powered demo app.
│   ├── file-upload/       # Logic for uploading files to S3.
│   ├── landing-page/      # Landing page related code
│   ├── messages/          # Logic for app user messages.
│   ├── payment/           # Logic for handling payments and webhooks.
│   ├── server/            # Scripts, shared server utils, and other server code.
│   ├── shared/            # Shared constants and util functions.
│   └── user/              # Logic related to users and their accounts.
├── .env.server            # Dev environment variables for your server
├── .env.client            # Dev environment variables for your client
├── .prettierrc            # Prettier configuration.
├── tailwind.config.js     # TailwindCSS configuration.
├── package.json
├── package-lock.json
└── .wasproot</code></pre>
</div>

---

## Wasp Config (what it controls)

Wasp compiles your `main.wasp` into a full client, server, and deploy setup. In this template, `main.wasp` already defines: **Auth, Routes/Pages, Prisma models, Operations (Queries/Actions), Background Jobs, Email sending**.

> If you want a deeper intro, the **Wasp docs tutorial** (~20 minutes) is a great start.

### Client helpers live in `src/client`

<div class="codebox">
  <div class="codebox__cap">Client Structure</div>
  <pre><code>└── client
    ├── components
    ├── fonts
    ├── hooks
    ├── icons
    ├── static
    ├── App.tsx
    ├── cn.ts
    └── Main.css</code></pre>
</div>

### Server helpers live in `src/server`

<div class="codebox">
  <div class="codebox__cap">Server Structure</div>
  <pre><code>└── server
    ├── scripts
    └── utils.ts</code></pre>
</div>

---

## Auth (ready to use now)

Email + social auth are already defined in `main.wasp`:

<div class="codebox">
  <div class="codebox__cap">main.wasp</div>
  <pre><code class="language-javascript">auth: {
  userEntity: User,
  methods: {
    email: {
      //...
    },
    google: {},
    github: {},
    discord: {}
  },
  onAuthFailedRedirectTo: "/",
},</code></pre>
</div>

### This wires:

- Email-verified login + password reset
- Social login (Google/GitHub)
- Auth DB entities (credentials, sessions, socials)
- Generated Auth UI (login/signup/reset)
- Hooks to fetch user data

### Dev email sender (Dummy)

Emails are logged to the console by default:

<div class="codebox">
  <div class="codebox__cap">main.wasp</div>
  <pre><code class="language-javascript">emailSender: {
  provider: Dummy, // logs all email verification links/tokens to the console
  defaultFrom: {
    name: "Open SaaS App",
    email: "me@example.com"
  },
},</code></pre>
</div>

You'll integrate real email providers in the **Authentication Guide**.

---

## Payments (Stripe or Lemon Squeezy)

### Flow overview

1. User clicks **BUY** → server creates a Checkout session
2. User completes payment on hosted Checkout
3. Payment processor redirects back to your app
4. Processor sends a **webhook** → your server updates subscription status

### Where things live

- **Processor selection/logic**: `src/payment/paymentProcessor.ts`
- **Checkout creation (Action)**: `src/payment/operation.ts`
- **Webhook handler**: `src/payment/webhook.ts`

### Action definition (Wasp)

<div class="codebox">
  <div class="codebox__cap">main.wasp</div>
  <pre><code class="language-javascript">action generateCheckoutSession {
  fn: import { generateCheckoutSession } from "@src/payment/operations",
  entities: [User]
}</code></pre>
</div>

### Action implementation

<div class="codebox">
  <div class="codebox__cap">src/server/actions.ts</div>
  <pre><code class="language-javascript">export const generateCheckoutSession = async (paymentPlanId, context) => {
  //...
}</code></pre>
</div>

### Client call

<div class="codebox">
  <div class="codebox__cap">src/client/app/SubscriptionPage.tsx</div>
  <pre><code class="language-javascript">import { generateCheckoutSession } from "wasp/client/operations";

const handleBuyClick = async (paymentPlanId) => {
  const checkoutSession = await generateCheckoutSession(paymentPlanId);
};</code></pre>
</div>

### Webhook endpoint (exposed)

<div class="codebox">
  <div class="codebox__cap">main.wasp</div>
  <pre><code class="language-javascript">api paymentsWebhook {
  fn: import { paymentsWebhook } from "@src/payment/webhook",
  httpRoute: (POST, "/payments-webhook")
  entities: [User],
}</code></pre>
</div>

You'll configure products/plans & keys in the **Payments Integration guide**.

---

## Analytics + Admin Dashboard

We use a **Wasp Job** (cron) to calculate daily stats. Data can come from **Plausible** or **Google Analytics** via provided helpers.

<div class="codebox">
  <div class="codebox__cap">main.wasp</div>
  <pre><code class="language-javascript">job dailyStatsJob {
  executor: PgBoss,
  perform: {
    fn: import { calculateDailyStats } from "@src/analytics/stats"
  },
  schedule: {
    cron: "0 * * * *" // runs every hour
  },
  entities: [User, DailyStats, Logs, PageViewSource]
}</code></pre>
</div>

See the **Analytics guide** for wiring Plausible/GA and the dashboard.

---

## Customize it - quick checklist

### Services that need your keys

- Auth providers (Google, GitHub)
- Payments (Stripe or Lemon Squeezy)
- OpenAI
- Email (SendGrid) — required if using email Auth
- Analytics (Plausible or Google Analytics)
- File uploads (AWS S3)

### main.wasp basics

**Change app name/title:**

<div class="codebox">
  <div class="codebox__cap">main.wasp</div>
  <pre><code class="language-javascript">app YourAppName {
  wasp: {
    version: "^0.13.2"
  },
  title: "Your App Name",</code></pre>
</div>

**Restart required** after renaming:

Run `wasp db start`, `wasp db migrate-dev`, and `wasp start`.

**Also:**

- Update meta tags in `app.head` (set future domain even if not live yet).
- Update `app.emailSender.defaultFrom.name` (what users see in inbox).

### Remove features you don't need:

- **Auth methods**: `app.auth.methods`
- **If not using email auth**: remove routes/pages `RequestPasswordReset`, `PasswordReset`, `EmailVerification`
- **Email sending**: `app.emailSender`, job `emailChecker`
- **Plausible** in `app.head`
- **File uploading**: entity `File`, route `FileUploadRoute`, action `createFile`, queries `getAllFilesByUser`, `getDownloadFileSignedURL`

- **Rename** Entities, Routes/Pages, Operations as you wish.

### Look & feel

- Update `public/favicon.svg`
- Replace `public/public-banner.webp` and its `og:image` / `twitter:image` in `app.head`
- Edit landing page `landingPage.tsx`
- Customize nav, features, testimonials, FAQs in `contentSections.ts`
- Replace `Logo.png` and `open-saas-banner.webp` under `static`
- Global styles: `tailwind.config.cjs` (note: current globals mainly used in Admin)

### Analytics/Admin tweaks

- If using Plausible, set your domain in `app.head`
- Adjust `calculateDailyStats` in `src/server/workers/calculateDailyStats.ts` for your provider
- Change `dailyStatsJob` cron in `main.wasp`
- Edit Admin components to show only the stats you need

### Env files

- After following the Guides, add keys to `.env.server` / `.env.client`
- Remove unused vars from `.env.*` and `.env.*.example`

### Other useful setup

- Create your GitHub repo
- Deploy to a host
- Buy a domain and connect it
- Read `e2e-tests` README and adapt tests
- Set up CI (start from the Open SaaS dev CI example)

---

## What's next

Proceed to the **Guides** to wire **Payments & Webhooks**, **Auth**, **Email**, **Analytics**, **S3**, and more.

If this starter saves you time, consider ⭐ **starring the GitHub repo** to keep it thriving.