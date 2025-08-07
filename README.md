# 🏛️ Ellytic Frontend

**AI-powered services for AFM registration, translations, tax and more. Fully GDPR-compliant and based in Germany.**

[![Next.js](https://img.shields.io/badge/Next.js-14.2.31-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.1-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 🚀 Features

- **🏠 Modern Landing Page** - Responsive homepage with Sanity CMS integration
- **🧙‍♂️ Interactive Wizard** - 2-step onboarding process with state management
- **📊 User Dashboard** - Real-time status tracking for services
- **💳 Secure Checkout** - Bundle selection and payment processing
- **🔐 Authentication** - NextAuth.js with Google OAuth
- **📧 Newsletter System** - Email subscription management
- **📁 File Upload** - Document upload with preview and progress
- **⚙️ Admin Panel** - Comprehensive admin dashboard
- **🌍 Multi-Language** - Support for EN, DE, EL, NL
- **📱 Mobile-First** - Fully responsive design
- **⚡ Performance** - Optimized with Next.js 14 App Router

## 🛠️ Tech Stack

- **Framework:** [Next.js 14.2.31](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS 3.4.1](https://tailwindcss.com/)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Authentication:** [NextAuth.js](https://next-auth.js.org/)
- **CMS:** [Sanity](https://www.sanity.io/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Payments:** [Stripe](https://stripe.com/)
- **Internationalization:** [i18next](https://www.i18next.com/)
- **Icons:** Heroicons (via Tailwind)

## 📦 Installation

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ellytic-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   # Google OAuth
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   
   # Stripe
   STRIPE_SECRET_KEY=your-stripe-secret-key
   STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
   
   # NextAuth
   NEXTAUTH_SECRET=your-random-secret
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
ellytic-frontend/
├── 📄 Configuration Files
│   ├── package.json              # Dependencies & Scripts
│   ├── tsconfig.json             # TypeScript Configuration
│   ├── tailwind.config.js        # Tailwind CSS Configuration
│   ├── next.config.js            # Next.js Configuration
│   ├── middleware.ts             # Next.js Middleware
│   └── i18n.ts                   # Internationalization Setup
│
├── 🌐 App Router (Next.js 14)
│   ├── app/layout.tsx            # Root Layout
│   ├── app/page.tsx              # Landing Page
│   ├── app/wizard/page.tsx       # Setup Wizard
│   ├── app/dashboard/page.tsx    # User Dashboard
│   ├── app/checkout/page.tsx     # Checkout Page
│   ├── app/login/page.tsx        # Login Page
│   └── app/admin/page.tsx        # Admin Dashboard
│
├── 🔌 API Routes
│   ├── app/api/newsletter/route.ts    # Newsletter API
│   ├── app/api/status/route.ts        # Status API
│   ├── app/api/upload/route.ts        # Upload API
│   └── app/auth/[...nextauth]/route.ts # Auth API
│
├── 🧩 Components
│   ├── components/ui/button.tsx           # UI Components
│   ├── components/newsletter/NewsletterForm.tsx
│   ├── components/status/StatusTracker.tsx
│   ├── components/upload/DocumentUploader.tsx
│   └── components/admin/AdminDashboard.tsx
│
├── 🗃️ State Management
│   └── store/wizardStore.ts      # Zustand Store
│
├── 🌍 Internationalization
│   └── i18n/locales/             # Translation Files
│       ├── en/common.json
│       ├── de/common.json
│       ├── el/common.json
│       └── nl/common.json
│
└── 🎨 Styles
    ├── styles/globals.css        # Global Styles
    └── app/globals.css           # App Styles
```

## 🚀 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Type checking
npm run type-check   # Check TypeScript types
```

## 🌍 Internationalization

The app supports multiple languages with automatic locale detection:

- **English (en)** - Default
- **German (de)** - For German users
- **Greek (el)** - For Greek users  
- **Dutch (nl)** - For Dutch users

Locale detection is handled by middleware based on user's country.

## 🔐 Authentication

Authentication is powered by NextAuth.js with Google OAuth provider:

1. Set up Google OAuth credentials
2. Configure environment variables
3. Users can sign in with Google accounts
4. Protected routes available for authenticated users

## 📁 File Upload

The document upload system supports:

- **File Types:** PDF, JPG, JPEG, PNG
- **Preview:** Image preview for uploaded files
- **Progress:** Real-time upload progress
- **Storage:** Temporary storage in `/tmp` (development)

## 🎨 Styling

Built with Tailwind CSS for:

- **Responsive Design** - Mobile-first approach
- **Custom Components** - Reusable UI components
- **Dark Mode Ready** - Easy theme switching
- **Performance** - Purged CSS for production

## 📱 Responsive Design

The application is fully responsive with:

- **Mobile-First** approach
- **Breakpoints:** sm, md, lg, xl
- **Touch-Friendly** interactions
- **Optimized** for all screen sizes

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file with:

```env
# Authentication
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXTAUTH_SECRET=your-random-secret
NEXTAUTH_URL=http://localhost:3000

# Payments
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key

# CMS (Optional)
SANITY_PROJECT_ID=your-sanity-project-id
SANITY_DATASET=production
```

### Tailwind Configuration

Customize colors, fonts, and animations in `tailwind.config.js`:

```javascript
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      // Custom configurations
    },
  },
  plugins: [],
};
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy automatically** on push to main branch

### Other Platforms

The app can be deployed to any platform supporting Next.js:

- **Netlify** - Static export
- **AWS Amplify** - Full-stack deployment
- **Docker** - Containerized deployment

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- **Documentation:** Check the code comments
- **Issues:** Create an issue on GitHub
- **Email:** support@ellytic.com

## 🙏 Acknowledgments

- **Next.js Team** - For the amazing framework
- **Vercel** - For hosting and deployment
- **Tailwind CSS** - For the utility-first CSS framework
- **Sanity** - For the headless CMS
- **Stripe** - For payment processing

---

**Built with ❤️ for Ellytic**

*Transforming Greek bureaucracy for EU citizens, pensioners and expats. Fully digital and secure.*
