
<h1 align="center">
  <br>
  <a href="http://www.amitmerchant.com/electron-markdownify"><img src="https://raw.githubusercontent.com/amitmerchant1990/electron-markdownify/master/app/img/markdownify.png" alt="Markdownify" width="200"></a>
  <br>
  LaunchPike
  <br>
</h1>

<h4 align="center">
  A free boilerplate for SaaS MVPs on 
  <a href="https://react.dev/" target="_blank" rel="noopener noreferrer">React</a> + 
  <a href="https://nodejs.org/en" target="_blank" rel="noopener noreferrer">Node.js</a> 
  with prewired auth, payments, DB, emails, and analytics.
</h4>

<p align="center">
  <a href="https://launchpike.org/" target="_blank" rel="noopener noreferrer">
    <img
      src="https://img.shields.io/badge/Official%20Website-launchpike.org-3B82F6?style=for-the-badge&logo=google-chrome&logoColor=white&labelColor=0F172A"
      alt="Official website" style="margin: 0 4px;"
    >
  </a>
  <a href="https://x.com/LaunchPike" target="_blank" rel="noopener noreferrer">
    <img
      src="https://img.shields.io/badge/X-@LaunchPike-000000?style=for-the-badge&logo=x&logoColor=white&labelColor=0F172A"
      alt="X (Twitter)" style="margin: 0 4px;"
    >
  </a>
  <a href="https://discord.gg/Ce4WGvzVYG" target="_blank" rel="noopener noreferrer">
    <img
      src="https://img.shields.io/badge/Discord-join-5865F2?style=for-the-badge&logo=discord&logoColor=white&labelColor=0F172A"
      alt="Discord" style="margin: 0 4px;"
    >
  </a>
  <a href="https://github.com/LaunchPike/launchpike-saas/stargazers" target="_blank" rel="noopener noreferrer">
    <img
      src="https://img.shields.io/github/stars/LaunchPike/launchpike-saas?style=for-the-badge&logo=github&label=Stars&labelColor=0F172A&cacheSeconds=600"
      alt="GitHub stars" style="margin: 0 4px;"
    >
  </a>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#quick-start">Quick start</a> •
  <a href="#documents">Documents</a>
</p>



## Welcome!

Thanks for stopping by!

**LaunchPike** is a boilerplate on **React + Node.js** to easily launch a **SaaS MVP**. 
Auth, payments, database, emails and analytics are prewired, so you can focus on the product itself. 

It’s free & open-source, easy to run locally, and ready to deploy fast.

## Features 
⚡️**Authentication & roles:** Email and social login with session handling, password reset, and role-based access (admin, user, etc.) you can extend.

⚡️**Payments & billing:** [UniBee](https://unibee.dev/), [Stripe](https://stripe.com), or [Lemon Squeezy](https://www.lemonsqueezy.com) integrations with subscriptions, trials, invoices, and webhook handlers mapped to app logic.

⚡️**Database & models:** [Prisma](https://www.prisma.io) schemas and migrations ready to run; typed queries/actions with [Zod](https://zod.dev) validation to reduce runtime errors.

⚡️**Emails & templates:** Transactional sending (welcome, verify, reset) with provider-agnostic adapters and environment-specific configs via [SendGrid](https://sendgrid.com).

⚡️ **Analytics & events:** [Plausible](https://plausible.io) / [Google Analytics (GA4)](https://marketingplatform.google.com/about/analytics/) page + custom events prewired for signups, upgrades, and key actions to track conversion.

⚡️ **File uploads:** [S3](https://aws.amazon.com/s3/)-compatible storage with signed URLs, size limits, and simple helpers for listing/removing files.

⚡️ **Admin basics:** Minimal admin pages for users, subscriptions, and content so you can operate without building dashboards first.

⚡️ **SEO & sitemap:** Ready-made tags, robots, and sitemap generation to set up SEO on day one.



## Quick start

### Prerequisites
- Node.js ≥ 22.12
- Docker (for Postgres)
- macOS/Linux; Windows via WSL2

### 1) Install Wasp
~~~bash
curl -sSL https://get.wasp.sh/installer.sh | sh
wasp version
~~~

### 2) Scaffold the app
~~~bash
wasp new
# choose the SaaS template
cd app
~~~

### 3) Start DB & run migrations
~~~bash
wasp start db           # starts Postgres (keep this terminal open)
wasp db migrate-dev
~~~

### 4) Configure env & run
~~~bash
cp .env.server.example .env.server
wasp start              # client: http://localhost:3000  •  server: http://localhost:3001
~~~

> **Email note:** in dev, the Dummy email sender logs verification/reset links to the **server console**. Copy the link from logs to finish signup.


## Documents
If you need detailed instructions to make things crystal clear, we’ve got [docs](https://launchpike.org/docs/introduction/).
They cover everything in depth - installation, updating the template, integrating services, SEO, deployment, and more.


## Contributors

<a href="https://github.com/LaunchPike/launchpike-saas/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=LaunchPike/launchpike-saas" alt="Contributors"/>
</a>


## Still have questions? Contact us!

Email us at [support@launchpike.org](mailto:support@launchpike.org) and we’ll get back to you ASAP.  
Or ask in our [Discord server](https://discord.gg/Ce4WGvzVYG) - our community or team will help :)


## You may also like...

- [UniBee](https://github.com/UniBee-Billing/unibee) — founder-friendly payments: self-hosted, full control over subscriptions, invoicing, customer portal, and webhooks.

## License

MIT

---


