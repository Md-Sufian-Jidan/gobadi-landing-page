<h1 align="center">
  <img src="./src/assets/gobadi_logo.webp" alt="Gobadi Logo" width="60" />
  <br/>
  গবাদি — Gobadi
</h1>

<p align="center">
  <strong>AI-powered digital platform transforming the livestock ecosystem.</strong><br/>
  Connecting farmers, veterinarians, and trusted providers — all in one place.
</p>

<p align="center">
  <a href="https://gobadi.vercel.app/" target="_blank"><img src="https://img.shields.io/badge/Live%20Demo-gobadi.vercel.app-C1652F?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo" /></a>
  <a href="https://github.com/Md-Sufian-Jidan/gobadi" target="_blank"><img src="https://img.shields.io/badge/GitHub-Md--Sufian--Jidan%2Fgobadi-171717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" /></a>
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS v4" />
</p>

---

## What is Gobadi?

**Gobadi** (গবাদি) is a modern, beautifully designed landing page for an upcoming AI-powered livestock management platform. The name "Gobadi" is derived from the Bengali word for *livestock*, reflecting its deep roots in South Asian agricultural communities.

The platform is being built with a bold vision: to digitally transform how farmers, veterinarians, and trusted service providers collaborate. Through AI-driven insights, expert consultations, and a unified marketplace, Gobadi aims to make animal care faster, smarter, and more accessible for everyone in the ecosystem.

This repository is the **public-facing website** — a polished, responsive landing page that introduces Gobadi's mission, vision, and upcoming features, and invites the community to get in touch.

---

## Live Site

**[https://gobadi.vercel.app/](https://gobadi.vercel.app/)**

---

## Features at a Glance

| Section | Description |
|---|---|
| **Hero** | A bold, image-rich landing area with the tagline *"Where Livestock Meets Intelligence"*, a mobile app preview card, and a platform launch announcement. |
| **Our Vision** | Explains the three pillars of the platform: Animal Care Ecosystem, Doctor Consultation Network, and AI-Powered Insights & Marketplace. |
| **About Us** | Describes the platform's mission — enabling farmers to access veterinary care and AI health insights while empowering vets to reach more people digitally. |
| **Coming Soon** | A teaser section announcing the upcoming digital livestock platform. |
| **Contact Us** | A full contact section with email, phone, office address, social media links, and a working message form. |
| **Navbar** | Sticky top navigation bar with the Gobadi logo, Bengali branding, and anchor-based page navigation. |
| **Footer** | Clean branded footer with navigation links and copyright. |

---

## Project Structure

```
gobadi/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout — fonts, metadata, SEO tags
│   │   ├── page.tsx            # Home page — assembles all sections
│   │   ├── globals.css         # Design tokens (colors, fonts via CSS variables + Tailwind v4)
│   │   └── page.test.tsx       # Tests for the home page
│   │
│   ├── components/
│   │   ├── module/
│   │   │   └── home/           # Feature-level section components
│   │   │       ├── Hero.tsx
│   │   │       ├── OurVission.tsx
│   │   │       ├── AboutUs.tsx
│   │   │       ├── ComingSoon.tsx
│   │   │       ├── ContactUs.tsx
│   │   │       └── *.test.tsx  # Co-located component tests
│   │   │
│   │   └── shared/             # Reusable UI components
│   │       ├── Navbar.tsx
│   │       ├── Footer.tsx
│   │       ├── ResuableTitleDescription.tsx
│   │       └── *.test.tsx
│   │
│   ├── assets/                 # Local images, icons, GIFs used throughout the site
│   └── test/
│       └── setup.ts            # Global Vitest setup (mocks for next/image & next/link)
│
├── public/                     # Statically served files
├── next.config.ts              # Next.js configuration (image domains, etc.)
├── vitest.config.ts            # Vitest configuration (jsdom, react plugin, paths)
├── tsconfig.json               # TypeScript configuration
└── package.json
```

---

## Design System

The design uses a warm, earthy color palette with a dark primary base, implemented through CSS custom properties and Tailwind CSS v4's `@theme` directive.

| Token | Value | Role |
|---|---|---|
| `--accent` | `#C1652F` | Brand orange — buttons, highlights, CTA |
| `--primary` | `#171717` | Near-black — headings, primary text |
| `--secondary` | `#525252` | Muted grey — body copy |
| `--background` | `#F7F4EE` | Warm off-white — page background |
| `--border` | `#C0612B` | Darker orange — borders and nav button |
| `--sub-title-bg` | `#FBE6DA` | Soft peach — section subtitle pill backgrounds |

**Typography:**
- **Playfair Display** — headings and display text (`--font-display`)
- **Merriweather** — body copy (`--font-sans`)
- **Noto Sans Bengali** — Bengali brand name "গবাদি" (`--font-bengali`)

All fonts are loaded via `next/font/google` for zero layout shift.

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| [Next.js](https://nextjs.org/) | 16.x | React framework — App Router, SSR, image optimization |
| [React](https://react.dev/) | 19.x | UI library |
| [TypeScript](https://www.typescriptlang.org/) | 5.x | Type safety across the whole codebase |
| [Tailwind CSS](https://tailwindcss.com/) | 4.x | Utility-first CSS with `@theme` design tokens |
| [React Icons](https://react-icons.github.io/react-icons/) | 5.x | Icon library (Feather, Font Awesome, etc.) |
| [Vitest](https://vitest.dev/) | 4.x | Unit testing framework |
| [@testing-library/react](https://testing-library.com/) | 16.x | Component testing utilities |
| [Vercel](https://vercel.com/) | — | Hosting and deployment |

---

## Getting Started

### Prerequisites

- **Node.js** v18 or later
- **npm** (comes with Node) or your preferred package manager

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Md-Sufian-Jidan/gobadi.git

# 2. Navigate into the project folder
cd gobadi

# 3. Install dependencies
npm install
```

### Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The page auto-reloads as you edit files.

### Building for Production

```bash
npm run build
npm start
```

---

## Testing

The project uses **Vitest** and **@testing-library/react** for component-level unit tests. Tests live right next to the components they cover (co-located).

```bash
# Run all tests once
npm test

# Run tests in watch mode (re-runs on file save)
npm run test:watch
```

**What's tested:**
- Home page renders without crashing
- `Navbar` renders the logo and all navigation links
- `Footer` renders the brand and navigation anchors
- `ResuableTitleDescription` renders subtitle, title, and description correctly
- Each major section (`Hero`, `AboutUs`, `OurVission`, `ContactUs`, `ComingSoon`) renders without error

The Vitest setup (`src/test/setup.ts`) mocks `next/image` and `next/link` so components render cleanly in the jsdom environment without a Next.js server.

---

## Scripts Reference

| Script | Command | Description |
|---|---|---|
| Dev server | `npm run dev` | Start local development server with hot reload |
| Build | `npm run build` | Create an optimised production build |
| Start | `npm start` | Serve the production build locally |
| Lint | `npm run lint` | Run ESLint across the codebase |
| Test (once) | `npm test` | Run all Vitest unit tests |
| Test (watch) | `npm run test:watch` | Run tests in interactive watch mode |

---

## Deployment

This project is deployed on **Vercel**. Every push to the `main` branch automatically triggers a new production deployment.

To deploy your own copy:

1. Fork this repository
2. Create a free account at [vercel.com](https://vercel.com/)
3. Import your forked repository
4. Click **Deploy** — Vercel handles everything else automatically

The `NEXT_PUBLIC_API_URL` environment variable is used for generating absolute URLs in metadata (Open Graph, Twitter cards). Set this to your own domain in Vercel's environment variable settings.

---

## Contact

Have a question, a partnership idea, or just want to say hello?

- **Email:** ceo.gobaadi@gmail.com
- **Phone:** +8801911418977
- **Office:** Road# 9, House# 5, Lane# 3, Mirpur 11/a, Dhaka, 1216, Bangladesh

Or reach out directly through the [contact form on the website](https://gobadi.vercel.app/#contact).

---

## Author

**Md Sufian Jidan**

- GitHub: [@Md-Sufian-Jidan](https://github.com/Md-Sufian-Jidan)

---

## License

This project is private. All rights reserved © 2025 Gobadi.
