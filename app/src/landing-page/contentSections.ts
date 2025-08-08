import daBoiAvatar from '../client/static/da-boi.webp';
import kivo from '../client/static/examples/kivo.webp';
import messync from '../client/static/examples/messync.webp';
import microinfluencerClub from '../client/static/examples/microinfluencers.webp';
import promptpanda from '../client/static/examples/promptpanda.webp';
import reviewradar from '../client/static/examples/reviewradar.webp';
import scribeist from '../client/static/examples/scribeist.webp';
import searchcraft from '../client/static/examples/searchcraft.webp';
import { BlogUrl, DocsUrl } from '../shared/common';
import type { GridFeature } from './components/FeaturesGrid';

export const features: GridFeature[] = [
  {
    name: 'Authentication',
    description: 'Complete authentication system with email/password, Google OAuth, and email verification',
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
    name: 'Admin Panel',
    description: 'Powerful admin panel with analytics, user management, and dashboards',
    emoji: '📊',
    href: DocsUrl,
    size: 'large',
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
    name: 'Deployment',
    description: 'Automatic deployment to Fly.io with CI/CD setup',
    emoji: '🚀',
    href: DocsUrl,
    size: 'medium',
  },
];

export const testimonials = [
  {
    name: 'Alex Petrov',
    role: 'CTO @ TechStartup',
    avatarSrc: daBoiAvatar,
    socialUrl: 'https://twitter.com/techstartup',
    quote: "LaunchPike helped us launch our SaaS product in record time. Excellent architecture and ready-made solutions!",
  },
  {
    name: 'Maria Sidorova',
    role: 'Founder @ DigitalAgency',
    avatarSrc: daBoiAvatar,
    socialUrl: 'https://linkedin.com/in/mariasidorova',
    quote: 'All necessary features are already included. The time and resource savings are enormous.',
  },
  {
    name: 'Dmitry Kozlov',
    role: 'Lead Developer @ InnovationLab',
    avatarSrc: daBoiAvatar,
    socialUrl: 'https://github.com/dmitrykozlov',
    quote: 'Excellent documentation and clean code. Easy to customize for our needs.',
  },
];

export const faqs = [
  {
    id: 1,
    question: 'What does LaunchPike include?',
    answer: 'LaunchPike is a full-featured OpenSaaS template with authentication, payments, admin panel, analytics, file upload system, blog, and automatic deployment.',
    href: 'https://github.com/launchpike',
  },
  {
    id: 2,
    question: 'Can it be customized for specific needs?',
    answer: 'Yes, LaunchPike is built on the Wasp framework and is easily customizable. All components are modular and well-documented.',
    href: DocsUrl,
  },
  {
    id: 3,
    question: 'What technologies are used?',
    answer: 'React, Node.js, Prisma, PostgreSQL, Stripe, Google Analytics, Astro for blog, and much more.',
    href: 'https://wasp.sh/docs',
  },
  {
    id: 4,
    question: 'Is there mobile device support?',
    answer: 'Yes, all components are responsive and optimized for mobile devices.',
    href: '#',
  },
];

export const footerNavigation = {
  app: [
    { name: 'Documentation', href: DocsUrl },
    { name: 'Blog', href: BlogUrl },
    { name: 'GitHub', href: 'https://github.com/launchpike' },
  ],
  company: [
    { name: 'About', href: 'https://launchpike.com' },
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
