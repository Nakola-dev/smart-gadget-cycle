# ♻️ Triple G — Green Gadget Grid

> **Revolutionizing e-waste management through a circular economy platform that rewards responsible recycling.**

[![Built with Lovable](https://img.shields.io/badge/Built%20with-Lovable-00A36C?style=for-the-badge)](https://lovable.dev/projects/11560046-ba1b-4bf8-869b-2c45da8c6932)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)

---

## 🌍 Overview

**Triple G (Green Gadget Grid)** is a web-based platform that empowers users to responsibly recycle, trade, and learn about electronic waste. Users earn reward points by submitting old gadgets, which can be redeemed for refurbished devices, parts, or cash — creating a sustainable circular economy for electronics.

### Key Highlights

- 🏆 **Earn rewards** for recycling old electronics
- 🔄 **Swap & Exchange** points or cash for refurbished gadgets
- 📚 **E-Waste Education Hub** with articles, videos, and infographics
- 🗺️ **Recycling Pickup Map** to locate nearby e-waste centers
- 📊 **Dashboard** to track contributions and environmental impact
- 🔐 **Role-based access** with Admin management tools

---

## 🚀 Features

### 🏠 Landing Page
- Animated hero section with clear value proposition
- Live animated counters for platform impact statistics (gadgets recycled, CO₂ saved, users, rewards distributed)
- Step-by-step "How It Works" guide
- Feature highlights and call-to-action sections

### 🔄 Swap & Exchange Center
- Browse and search refurbished gadgets and parts
- Filter by category (Smartphones, Laptops, Tablets, Parts, Accessories)
- Pay with reward points or cash
- Sticky user points summary with animated balance counter
- Swap confirmation modal with remaining balance preview
- Transaction history table with status tracking
- Framer Motion hover and entry animations

### 📚 E-Waste Education Hub (Learn)
- **Hero Section** — "Learn. Act. Recycle." with animated entry
- **Category Navigation** — Horizontal scrollable chip filters (Recycle Tips, Safe Disposal, Reusing Components, Sustainability 101, Tech & Environment)
- **Content Grid** — Responsive 3-column grid of educational cards (articles, videos, infographics)
- **Featured Videos** — Embedded YouTube video player with modal playback
- **Article Detail View** — Full content modal with share functionality
- **Admin CRUD** — Add, edit, and delete content with modal forms
- **Admin Dashboard** — Stats overview with Recharts bar chart of views by category
- **Search & Filter** — Live filtering by keyword, category, and sort order
- **Impact Stats** — Animated counters for users educated, CO₂ saved, and guides published

### 📊 User Dashboard
- Personal statistics (total points, gadgets recycled, CO₂ saved, total value)
- Gadget list with status tracking
- Rewards timeline chart (Recharts)
- Quick action buttons for submitting gadgets, browsing swaps, and learning

### 📱 Submit a Gadget
- Multi-field form (device name, brand, category, condition, description)
- Image upload support
- Dynamic point estimation based on category and condition
- Step-by-step evaluation process overview

### 🗺️ Recycling Pickup Map
- List of nearby e-waste recycling centers with details
- Schedule a pickup form (name, phone, address, preferred location)
- Map placeholder for future interactive integration

### 🔐 Authentication
- Login and Registration pages with form validation
- Role-based access (User / Admin)
- Protected routes and conditional navigation
- Demo credentials for testing

### 🛠️ Admin Panel
- Platform statistics overview (users, gadgets processed, rewards, revenue)
- Tabbed management interface for Users, Gadgets, Articles, and Swaps
- CRUD operations with confirmation dialogs and toast notifications

### ℹ️ About Page
- Mission, Vision, Community, and Impact cards
- Team member profiles
- Platform values and purpose

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 18 + Vite |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS + shadcn/ui |
| **Animations** | Framer Motion |
| **Routing** | React Router DOM v6 |
| **State** | React Context + useState |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **HTTP Client** | Axios |
| **Forms** | React Hook Form + Zod |
| **Notifications** | Sonner + Radix Toast |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui component library
│   ├── Navbar.tsx        # Responsive navigation with role-based links
│   └── Footer.tsx        # Site footer
├── contexts/
│   └── AwarenessContext.tsx  # Education hub content state & CRUD
├── pages/
│   ├── Index.tsx         # Landing page
│   ├── Swap.tsx          # Swap & Exchange Center
│   ├── Awareness.tsx     # E-Waste Education Hub
│   ├── Dashboard.tsx     # User dashboard
│   ├── SubmitGadget.tsx  # Gadget submission form
│   ├── Map.tsx           # Recycling pickup locations
│   ├── Admin.tsx         # Admin management panel
│   ├── Login.tsx         # Login page
│   ├── Register.tsx      # Registration page
│   ├── About.tsx         # About Triple G
│   └── NotFound.tsx      # 404 page
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── App.tsx               # Root component & routes
├── main.tsx              # Entry point
└── index.css             # Design tokens & global styles
```

---

## 🏁 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Demo Credentials

| Role | Email | Password |
|---|---|---|
| Admin | `admin@tripleG.com` | `admin123` |
| User | `user@tripleG.com` | `user123` |

---

## 🛣️ Roadmap

- [ ] Backend integration with Lovable Cloud (database, auth, storage)
- [ ] Real-time reward point tracking and transactions
- [ ] Interactive map with geolocation for pickup centers
- [ ] Payment gateway integration (Stripe) for cash swaps
- [ ] Social sharing and referral system
- [ ] Push notifications for swap status updates
- [ ] Multi-language support (i18n)
- [ ] Progressive Web App (PWA) support
- [ ] AI-powered gadget condition assessment via image upload

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🌱 Our Mission

> *To revolutionize e-waste management by creating a circular economy where technology waste becomes a valuable resource, rewarding responsible disposal while protecting our planet.*

---

<p align="center">
  Built with 💚 by the <strong>Triple G Team</strong> — Making e-waste recycling rewarding.
</p>
