import BrianChen from '../client/static/Brian Chen.png';
import DanielCho from '../client/static/Daniel Cho.png';
import kivo from '../client/static/examples/kivo.webp';
import messync from '../client/static/examples/messync.webp';
import microinfluencerClub from '../client/static/examples/microinfluencers.webp';
import promptpanda from '../client/static/examples/promptpanda.webp';
import reviewradar from '../client/static/examples/reviewradar.webp';
import scribeist from '../client/static/examples/scribeist.webp';
import searchcraft from '../client/static/examples/searchcraft.webp';
import LeoTorres from '../client/static/Leo Torres.png';
import { BlogUrl, DocsUrl } from '../shared/common';
import type { GridFeature } from './components/FeaturesGrid';

export const features: GridFeature[] = [
  {
    name: 'Authentication',
    description: 'Complete authentication system with email/password, Google OAuth, GitHub, Discord log in and magic links',
    emoji: '🔐',
    href: DocsUrl,
    size: 'medium',
  },
  {
    name: 'Payments',
    description: 'Unibee, Stripe and Lemon Squeezy integration for payment processing and subscriptions',
    emoji: '💳',
    href: DocsUrl,
    size: 'medium',
  },
  {
    name: 'File Upload',
    description: 'File upload system with S3 support and validation',
    emoji: '📁',
    href: DocsUrl,
    size: 'small',
  },
  {
    name: 'Analytics',
    description: 'Google Analytics and Plausible integration for metrics tracking',
    emoji: '📈',
    href: DocsUrl,
    size: 'small',
  },
  {
    name: 'Email System',
    description: 'Email notifications, verification, and password reset functionality',
    emoji: '📧',
    href: DocsUrl,
    size: 'small',
  },
  {
    name: 'Blog',
    description: 'Built-in blog system with Astro for content marketing',
    emoji: '📝',
    href: DocsUrl,
    size: 'small',
  },
  {
    name: 'Testing',
    description: 'E2E testing with Playwright for complete functionality coverage',
    emoji: '🧪',
    href: DocsUrl,
    size: 'small',
  },
  {
    name: 'Database',
    description: 'Easy to run Postgres Database',
    emoji: '🚀',
    href: DocsUrl,
    size: 'medium',
  },
  {
    name: 'Admin Panel',
    description: 'Powerful admin panel with analytics, user management, and dashboards',
    emoji: '📊',
    href: DocsUrl,
    size: 'small',
  },
];

export const testimonials = [
  {
    name: 'Brian Chen',
    role: 'CTO @TechStartup',
    avatarSrc: BrianChen,
    socialUrl: 'https://twitter.com/techstartup',
    quote: "I care about code quality. The repo was clean, well-documented, and easy to extend. We felt confident scaling on top of it right away.",
  },
  {
    name: 'Leo Torres',
    role: 'Founder @DigitalAgency',
    avatarSrc: LeoTorres,
    socialUrl: 'https://linkedin.com/in/mariasidorova',
    quote: 'We’re a tiny team - just me and two devs. Normally we’d burn weeks setting up logins and billing. With LaunchPike that was done in hours. We focused on our AI features, shipped faster, and even got our first paying user the same week.',
  },
  {
    name: 'Daniel Cho',
    role: 'Indie Hacker',
    avatarSrc: DanielCho,
    socialUrl: 'https://github.com/dmitrykozlov',
    quote: 'Excellent documentation and clean code. Easy to customize for our needs.',
  },
];

export const faqs = [
  {
    id: 1,
    question: 'What should I do right after the first run?',
    answer: 'Start with the basics: branding → auth → email → analytics → deploy → billing → SEO. Follow this short checklist [link to docs] to go from “hello world” to live MVP.',
    href: 'https://github.com/launchpike',
  },
  {
    id: 2,
    question: 'How do I set up billing and subscriptions?',
    answer: 'Billing is built in. You can start with UniBee, which supports a wide range of gateways — from local payment systems to crypto — or choose other options.',
    href: DocsUrl,
  },
  {
    id: 3,
    question: 'How do I deploy my app?',
    answer: 'Use the Wasp one-liner to go live on Fly.io in minutes. Prefer control? Deploy manually anywhere — just set live env vars and payment keys. [Deploy guide →]',
    href: 'https://launchpike.org/docs',
  },
  {
    id: 4,
    question: 'Do I need to be a developer to use this?',
    answer: 'Basic coding knowledge can be helpful, but it’s not necessary. You don’t need a full team either — the starter comes prebuilt with the essentials, so even a solo founder can get an MVP live.',
  },
  {
    id: 5,
    question: 'I found an issue or want to request a feature.',
    answer: 'Awesome — tell us! Email support@launchpike.org with a quick note (steps to reproduce + screenshot/video help a ton).',
  },
];

export const footerNavigation = {
  app: [
    { name: 'Documentation', href: DocsUrl },
    { name: 'Blog', href: BlogUrl },
    { name: 'GitHub', href: 'https://github.com/launchpike' },
  ],
  company: [
    { name: 'About', href: 'https://launchpike.org' },
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
  ],
};

export const examples = [
  {
    name: 'CRM System',
    description: 'Customer relationship management system with analytics and reporting.',
    imageSrc: kivo,
    href: '#',
  },
  {
    name: 'Learning Platform',
    description: 'Online learning platform with video courses.',
    imageSrc: messync,
    href: '#',
  },
  {
    name: 'Social Network',
    description: 'Social platform for microblogging.',
    imageSrc: microinfluencerClub,
    href: '#',
  },
  {
    name: 'AI Assistant',
    description: 'Intelligent assistant with OpenAI integration.',
    imageSrc: promptpanda,
    href: '#',
  },
  {
    name: 'Review System',
    description: 'Platform for collecting and analyzing customer reviews.',
    imageSrc: reviewradar,
    href: '#',
  },
  {
    name: 'Content Platform',
    description: 'Content management system with editor.',
    imageSrc: scribeist,
    href: '#',
  },
  {
    name: 'Search Engine',
    description: 'Internal search system for documents.',
    imageSrc: searchcraft,
    href: '#',
  },
];
