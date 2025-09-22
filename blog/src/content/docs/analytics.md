---
title: Analytics
group: Integration Guides
order: 1
---

# Analytics

_This guide shows you how to integrate either Plausible or Google Analytics with your OpenSaaS app._

---

## Analytics (Plausible or Google Analytics)

You can integrate either **Plausible** (privacy-friendly, no cookies) or **Google Analytics** (free, uses cookies).

- **GA uses cookies** → you'll likely need the **Cookie Consent Modal**.
- **Plausible doesn't use cookies** → **no consent modal needed** (hosted plan is paid; self-hosting is free but requires extra setup).

If you need analytics on the blog, see **"Adding Analytics to your Blog"** at the end.

### Quick chooser

- **Need cookie-less, simple script?** Use **Plausible** (hosted = easy, paid; self-host = free, extra setup).
- **Want free + familiar tooling?** Use **Google Analytics** (remember the **Cookie Consent Modal**).

---

## Option A — Plausible

### Hosted Plausible

**1) Sign up** for a hosted Plausible account.

**2) Create your site** (add your domain). Use that domain (without `www`) as `PLAUSIBLE_SITE_ID`:

<div class="codebox">
  <div class="codebox__cap">.env.server</div>
  <pre><code>PLAUSIBLE_SITE_ID=<your domain without www></code></pre>
</div>

**3) Add the script tag** Plausible shows you to `app.head` in `main.wasp`:

<div class="codebox">
  <div class="codebox__cap">main.wasp</div>
  <pre><code class="language-javascript">// main.wasp
app OpenSaaS {
  wasp: {
    version: "^0.13.0"
  },
  title: "My SaaS App",
  head: [
    "<your plausible script tag here>",
  ],
  //...</code></pre>
</div>

**4) API key**: in Plausible, go to **Settings** → copy your **API key** and put it in `.env.server` as `PLAUSIBLE_API_KEY`.

### No Cookies

Plausible doesn't use cookies, so you **do not** add it to the Cookie Consent Modal.

Including the script in `app.head` is enough.

### Self-hosted Plausible

Plausible is open-source and can be self-hosted (keep data private, no hosted fees).

**Coming soon...** for this runbook; in the meantime, use the official docs.

_Want to help?_ Click **"Edit page"** and contribute. As a free, open-source project, we appreciate it 🙏

---

## Option B — Google Analytics

### 1) Switch stats provider in code (for Admin Dashboard)

Update `src/analytics/stats.ts` to use the **Google Analytics** provider (replace the Plausible import with GA).

_(Snippet shown exactly as in the original docs.)_

<div class="codebox">
  <div class="codebox__cap">src/analytics/stats.ts</div>
  <pre><code class="language-javascript">//...
import { getDailyPageViews, getSources } from './providers/plausibleAnalyticsUtils';
import { getDailyPageViews, getSources } from './providers/googleAnalyticsUtils';

export const calculateDailyStats: DailyStatsJob<never, void> = async (_args, context) => {
  //...
}</code></pre>
</div>

### 2) Create a GA4 Property

**Sign up for Google Analytics** → in the **Admin panel** (bottom left) **create a Property** for your app.

From the **Installation Instructions**, choose **Install manually** and locate:

<div class="codebox">
  <div class="codebox__cap">Google Analytics Setup</div>
  <pre><code><your-google-analytics-id>
https://www.googletagmanager.com/gtag/js?id=<your-google-analytics-id></code></pre>
</div>

### 3) Add GA ID to the client (works with the Cookie Consent Modal)

Put the ID into `.env.client`:

<div class="codebox">
  <div class="codebox__cap">.env.client</div>
  <pre><code>REACT_APP_GOOGLE_ANALYTICS_ID=<your-google-analytics-id> # e.g. G-1234567890</code></pre>
</div>

### noscript note

Google Tag Manager may suggest adding a `noscript` snippet after `<body>`.

**Skip it.** Users rarely browse with JS off, and Wasp requires JS anyway.

### 4) Enable GA Data API for server-side stats (Admin Dashboard)

To fetch analytics for your Admin Dashboard via API:

- **Create a Google Cloud project** (if you don't have one).
- **Enable** the **Google Analytics Data API (GA4)** in the Cloud Console (**Library**).
- **Create credentials** → **Service account key** (role: **Viewer**).
- **Download** the **JSON key** (keep it secure; don't commit it).
- In **GA** (not Cloud Console): **Admin** → **Property** → **Property Access Management** → add the **service account email** (`...@your-project-id.iam.gserviceaccount.com`) with **Viewer**.

**Encode private key (base64) and add to `.env.server`:**

<div class="codebox">
  <div class="codebox__cap">bash</div>
  <pre><code class="language-bash">echo -n "-----BEGIN PRIVATE KEY-----\nMI...A++eK\n-----END PRIVATE KEY-----\n" | base64</code></pre>
</div>

- Put the **base64 result** under `GOOGLE_ANALYTICS_PRIVATE_KEY` in `.env.server`.
- Add your **Property ID** (9 digits from GA: **Admin** → **Property** → **Property Settings** → **Property Details**) to `.env.server` as `GOOGLE_ANALYTICS_PROPERTY_ID`.

---

## Adding Analytics to your Blog (Astro Starlight)

Modify the `head` in `blog/astro.config.mjs`.

### Example for Google Analytics:

<div class="codebox">
  <div class="codebox__cap">blog/astro.config.mjs</div>
  <pre><code class="language-javascript">export default defineConfig({
  site: 'https://opensaas.sh',
  integrations: [
    starlightBlog({
      // ...
    }),
    starlight({
      //...
      head: [
        {
          tag: 'script',
          attrs: {
            src: 'https://www.googletagmanager.com/gtag/js?id=<YOUR-GOOGLE-ANALYTICS-ID>',
          },
        },
        {
          tag: 'script',
          content: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', '<YOUR-GOOGLE-ANALYTICS-ID>');
          `,
        },
      ],</code></pre>
</div>

_(For Plausible on the blog, add their script similarly to `head`.)_