const PUBLIC_BASE_URL = process.env.PUBLIC_BASE_URL || '';

export const hero = {
  title: "Launch your SaaS MVP",
  compare: {
    launchpike: {
      time: 90,
      span: "minutes",
    },
    others: {
      time: 3,
      span: "days",
    },
  },
};

export const features = [
  { title: "Setting up payments", image: `${PUBLIC_BASE_URL ?? ''}/Card1.png` },
  { title: "Setting up auth", image: `${PUBLIC_BASE_URL ?? ''}/Card2.png` },
  { title: "Configuring the database", image: `${PUBLIC_BASE_URL ?? ''}/Card3.png` },
  { title: "Email sending setup", image: `${PUBLIC_BASE_URL ?? ''}/Card4.png` },
  { title: "Setting up analytics", image: `${PUBLIC_BASE_URL ?? ''}/Card5.png` },
  { title: "And many more...", image: `${PUBLIC_BASE_URL ?? ''}/Card6.png` },
];

export const faq = [
  {
    question: "Why is this free?",
    answer: `Because our biggest goal right now is adoption. LaunchPike is open-source - we want as many founders and builders as possible to ship faster, give us feedback, and grow the ecosystem. The more people who launch with it, the better it becomes.

What’s in it for us? Community traction, credibility, and long-term sustainability. As we grow, we’ll introduce optional paid services (like one-click deployment, hosting, premium integrations, and support). But the core framework, the part that saves you from wasting a week on boilerplate - will always stay free.`,
    isOpen: true,
  },
  {
    question: "Deployment looks too complex :(",
    answer:
      "We provide step-by-step guides, ready to run CLI scripts, and working demo apps.",
  },
  {
    question: "Why can’t I just vibe-code my MVP?",
    answer:
      "Vibe-coded MVPs miss critical infra like auth, payments, and email. They waste time and are harder to extend or maintain.",
  },
  {
    question: "What if my stack’s different, can I still use this?",
    answer: `Yes, as long as you’re comfortable with React and basic Node.js conventions.

Libraries are independent. Use UniBee or Stripe or Lemon Squeezy for payments, SendGrid or Mailgun for email, Postgres out of the box, and any SQL that Prisma supports if you prefer.

The runbook and patterns are framework agnostic, so you can lift the workflow and swap adapters to fit your setup.`,
  },
  {
    question: "Does LaunchPike support AI - Copilot, Cursor, etc?",
    answer: `Short answer yes. LaunchPike is AI-ready and AI accelerated.

Why AI editors love LaunchPike:

- Complete codebase with clear patterns.   Your AI editor gets real project context instead of a blank file.

- Consistent naming and file structure  Predictable folders and conventions help Cursor or Copilot generate code that fits your app on the first try.

- Built in building blocks  - AI can wire new features into these primitives fast.`,
  },
];

export const comments = [[
  {
    "photo": "Sarah Chen",
    "name": "Sarah Chen",
    "title": "Product Manager & consultant",
    "comment": "Setup took me less than 10 minutes. Unreal."
  },
  {
    "photo": "Marcus Chen",
    "name": "Marcus Chen",
    "title": "Entrepreneur",
    "comment": "As someone who's launched a few SaaS products before, I know how painful the early setup can be. Auth, payments, email, dashboards... it's always the same boring grind before you even get to the fun part.\n\nThis kit basically erased all of that. It felt like I waved some sort of tech wand and went straight to the part where I'm building something unique. Honestly, it's the most time I've ever saved on a new project."
  },
  {
    "photo": "Ravi Kumar",
    "name": "Ravi Kumar",
    "title": "Backend Engineer",
    "comment": "I really appreciate the attention to detail. Even small things like having a starter blog and admin dashboard included show that this isn't just a quick cash grab.\n\nIt feels like a solid foundation that will grow with me instead of holding me back later."
  },
  {
    "photo": "Emily Zhang",
    "name": "Emily Zhang",
    "title": "Designer",
    "comment": "I've already recommended this to a few friends"
  },
  {
    "photo": "Jessica Park",
    "name": "Jessica Park",
    "title": "Technical developer & UX designer",
    "comment": "It feels like having a senior dev set everything up for me, so I can just build"
  },
  {
    "photo": "Carlos Mendez",
    "name": "Carlos Mendez",
    "title": "Web Developer",
    "comment": "Exactly what I needed to kickstart my project"
  },
  {
    "photo": "Ethan Ramirez",
    "name": "Ethan Ramirez",
    "title": "SWE junior & specialization expert",
    "comment": "I've been playing around with different SaaS starter kits for a while, and most of them either feel too boilerplate or too complicated. This one strikes the perfect balance — it gives you the essentials you need to get started quickly, but it's structured in a way that doesn't overwhelm you with unnecessary stuff.\n\nWithin a day I had my app running and could actually focus on my own idea instead of fighting with boilerplate"
  },
  {
    "photo": "Emily Garcia",
    "name": "Emily Garcia",
    "title": "UI Designer & Quality",
    "comment": "The starter blog and admin dashboard are such nice touches. Great attention to detail."
  },
  {
    "photo": "Sarah Chechen",
    "name": "Sarah Chechen",
    "title": "Frontend & UI Designer",
    "comment": "I was amazed at how quickly I could get a working SaaS prototype up and running. Saved me weeks of setup and configuration time."
  }],[
  {
    "photo": "Jamal Robinson",
    "name": "Jamal Robinson",
    "title": "Software Engineer",
    "comment": "The insights gathered from user testing were invaluable, helping us refine our product before launch"
  },
  {
    "photo": "Tom Nguyen",
    "name": "Tom Nguyen",
    "title": "Developer",
    "comment": "I wish I had found this earlier. Would've saved me so many late nights setting up auth and payments"
  },
  {
    "photo": "Elena Martinez",
    "name": "Elena Martinez",
    "title": "Web Developer",
    "comment": "I was honestly expecting something half-baked since that's what I've seen in the past. But this feels solid - it's not just a demo, it's a solid foundation for a real product. I'd heavily recommend it to anyone serious about launching quickly"
  },
  {
    "photo": "Michael Patel",
    "name": "Michael Patel",
    "title": "Data Analyst",
    "comment": "The ability to visualize data trends in real-time has improved our decision-making significantly."
  },
  {
    "photo": "Nina Patel",
    "name": "Nina Patel",
    "title": "UI/UX designer & marketer",
    "comment": "The default styling and structure are surprisingly nice"
  },
  {
    "photo": "Sarah Johnson",
    "name": "Sarah Johnson",
    "title": "Product Manager at TechStars",
    "comment": "The flexibility of the platform allowed me to iterate on user feedback in real-time, which significantly improved our launch timeline."
  },
  {
    "photo": "Grace O'Reilly",
    "name": "Grace O'Reilly",
    "title": "Enterprise Strategist",
    "comment": "Refreshing to see something that doesn't overcomplicate things"
  },
  {
    "photo": "Tina Wong",
    "name": "Tina Wong",
    "title": "Web Developer",
    "comment": "Setup took me less than 10 minutes. Unreal"
  },
  {
    "photo": "Marcus Green",
    "name": "Marcus Green",
    "title": "Product strategist & evangelist",
    "comment": "The insights from user testing were invaluable. I could pivot our approach based on actual user feedback."
  }],[
  {
    "photo": "Lisa Patel",
    "name": "Lisa Patel",
    "title": "Marketing Specialist",
    "comment": "Super beginner-friendly but still robust for pros"
  },
  {
    "photo": "Jamal Harris",
    "name": "Jamal Harris",
    "title": "UI/UX Designer",
    "comment": "I expected the usual 'STARTER KIT' experience where things break the moment you customize them, but that hasn't been the case here. The structure is solid, and making changes feels natural. It's rare to find something done this that genuinely feels production-ready"
  },
  {
    "photo": "Tina Thompson",
    "name": "Tina Thompson",
    "title": "Senior Strategist",
    "comment": "It feels like someone removed all the boring parts of building SaaS"
  },
  {
    "photo": "Alex Turner",
    "name": "Alex Turner",
    "title": "Full-stack developer",
    "comment": "Jumping into development was effortless, and the community support is fantastic!"
  },
  {
    "photo": "Rajesh Mehta",
    "name": "Rajesh Mehta",
    "title": "Developer",
    "comment": "As someone who's launched a few SaaS products before, I know how painful the early setup can be. Auth, payments, email, dashboards... it's always the same boring grind before you even get to the fun part. This kit basically erased all of that. It felt like I waved some sort of tech wand and went straight to the part where I'm building something unique. Honestly, it's the most time I've ever saved on a new project"
  },
  {
    "photo": "Sarah Chennen",
    "name": "Sarah Chennen",
    "title": "Product Manager",
    "comment": "Finally, something that gives me all the essentials without forcing me to reinvent the wheel"
  },
  {
    "photo": "Olivia Smith",
    "name": "Olivia Smith",
    "title": "Brand strategist",
    "comment": "The onboarding flow was shockingly smooth"
  },
  {
    "photo": "Michael Tan",
    "name": "Michael Tan",
    "title": "Marketing Specialist",
    "comment": "I'm not a professional developer, just someone who had an idea and wanted to test it out could make it real. Normally I'd get stuck on all the technical setup, but this made it ridiculously simple.\n\nThe docs guided me step by step, and before I knew it I had user registration and even a working admin panel. For the first time, I feel like I can actually ship something without hiring a whole team"
  }],[
  {
    "photo": "Ravi Singh",
    "name": "Ravi Singh",
    "title": "Frontend Developer",
    "comment": "I've been burned before by open-source starters that look great but quickly fall apart. This one is different. The structure is solid, the dependencies are well-chosen, and the documentation is actually helpful. I felt confident from the first commit, and that's not something I can say often"
  },
  {
    "photo": "David Lo Dico",
    "name": "David Lo Dico",
    "title": "Product lead & founder",
    "comment": "As a solo founder, time is my most valuable resource. Setting up user accounts, payments, email — all of that used to take me weeks, and honestly it was the part I dreaded most. With this, I skipped straight to building the features my customers actually care about. It was like someone took a huge weight off my shoulders."
  },
  {
    "photo": "Julia Kim",
    "name": "Julia Kim",
    "title": "Data Scientist",
    "comment": "I appreciated the built-in machine learning capabilities which made implementing predictive models effortlessly."
  },
  {
    "photo": "Linda Yu",
    "name": "Linda Yu",
    "title": "Product Development Lead",
    "comment": "What stands out is the balance between simplicity and flexibility. Out of the box it works beautifully, but when you need to customize or add features, or tweak things, swap integrations, or restructure parts without breaking the whole system. That's rare, especially in free tools. It really feels like it was designed to grow with you instead of forcing you into a corner."
  },
  {
    "photo": "Maya Rodriguez",
    "name": "Maya Rodriguez",
    "title": "Social media stylist",
    "comment": "I've tried a bunch of commercial boilerplates that charge hundreds of dollars, and honestly, this outshines most of them.\n\nThe integrations are smoother, the setup is easier, and the whole experience feels much more polished. It's crazy that this is open-source. If I had discovered it earlier, I could have saved both money and a ton of frustration"
  },
  {
    "photo": "Nina Petrova",
    "name": "Nina Petrova",
    "title": "Content Designer",
    "comment": "Everything just clicked right away — no confusion."
  },
  {
    "photo": "Omar El-Fahim",
    "name": "Omar El-Fahim",
    "title": "Developer",
    "comment": "The code is so clean it's almost like a tutorial"
  },
  {
    "photo": "Liam O'Connor",
    "name": "Liam O'Connor",
    "title": "Software Engineer",
    "comment": "This is the first template that didn't feel like it would collapse under real use"
  },
  {
    "photo": "Aisha Patel",
    "name": "Aisha Patel",
    "title": "Data Analyst",
    "comment": "Conducting user testing became more efficient with the prototyping capabilities."
  }]
]
