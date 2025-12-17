# OptiMind - GitHub for Ideas 🚀

A Next.js collaborative platform where users can create, share, fork, and star AI-powered idea repositories. Think GitHub, but for evolving and optimizing ideas!

## 🌟 Key Features

### 🔐 User System
- Sign up/Login with email and password
- Secure authentication with NextAuth v5
- User dashboard to manage repositories
- Profile system ready for expansion

### 📦 Repository Management
- Create **public or private** idea repositories
- Organize with **categories and tags**
- Save complete idea evolution workflows
- Delete and manage your repositories

### 🌐 Social & Discovery
- **Discover page** - Browse all public repositories
- **Fork repositories** - Copy and build on others' ideas
- **Star system** - Bookmark your favorite ideas
- **View tracking** - See how many people viewed your ideas
- Search and filter functionality

### 🤖 AI-Powered Features
- **Real-time Analysis** - Get instant feedback as you type
- **Smart Evolution** - Generate 3 optimized variants
- **Business Insights** - B2B/B2C detection, monetization, GTM strategy
- **AI Debate Mode** - Two AI agents debate your idea
- **Idea Mixer** - Combine two ideas into hybrid concepts
- **Idea Library** - Local storage for quick prototyping

### 📊 Analytics & Insights
- Interactive charts with Recharts
- Market fit analysis
- Competition detection
- Clarity scoring
- Visual radar assessments

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | TailwindCSS 4 |
| Database | MongoDB + Mongoose |
| Auth | NextAuth v5 Beta |
| AI | Google Gemini 1.5 Flash |
| Charts | Recharts |
| Icons | Lucide React |
| Password | bcryptjs |

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Google Gemini API key

### Installation

1. **Clone the repository:**
```bash
git clone <your-repo-url>
cd opti-mind
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up MongoDB:**

**Option A: MongoDB Atlas (Cloud - Recommended)**
- Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- Create free account and cluster
- Get connection string
- Update `.env.local`

**Option B: Local MongoDB**
```bash
# macOS
brew install mongodb-community
brew services start mongodb-community

# Ubuntu/Debian
sudo apt-get install mongodb
sudo systemctl start mongodb
```

4. **Configure environment variables:**

Create `.env.local` in the root:
```env
# Google Gemini AI
GEMINI_API_KEY=your-gemini-api-key

# MongoDB
MONGODB_URI=mongodb://localhost:27017/optimind

# NextAuth (generate with: openssl rand -base64 32)
NEXTAUTH_SECRET=your-generated-secret
NEXTAUTH_URL=http://localhost:3000
```

5. **Start the development server:**
```bash
npm run dev
```

6. **Open your browser:**
```
http://localhost:3000
```

## 📖 User Guide

### Creating an Account
1. Navigate to the homepage
2. Click **"Sign In"** → **"Sign up"**
3. Enter name, email, and password (min 6 characters)
4. Click **"Create Account"**

### Creating a Repository
1. Sign in and go to **Dashboard**
2. Click **"New Idea"**
3. Fill in:
   - Repository name
   - Description
   - Visibility (public/private)
   - Category
   - Tags (up to 5)
   - Your detailed idea
4. Optionally click **"Generate Variants"** for AI optimization
5. Click **"Save"**

### Discovering Ideas
1. Click **"Discover"** in navigation
2. Browse public repositories
3. Use search bar to find specific ideas
4. Sort by: New, Most Stars, Most Forks, Most Viewed

### Forking & Starring
- **Fork**: Copy someone's public idea to your account
- **Star**: Bookmark interesting ideas
- View stats on repository detail pages

## 📁 Project Structure

```
opti-mind/
├── app/
│   ├── page.tsx                    # Home page
│   ├── login/page.tsx              # Sign in
│   ├── signup/page.tsx             # Create account
│   ├── dashboard/page.tsx          # User's repositories
│   ├── discover/page.tsx           # Browse public repos
│   ├── create/page.tsx             # Create repository
│   ├── repo/[id]/page.tsx          # Repository details
│   ├── tool/page.tsx               # Standalone tool
│   └── api/
│       ├── auth/                   # Authentication
│       ├── repos/                  # Repository CRUD + fork/star
│       ├── evolve/route.ts         # Generate variants
│       ├── analyze/route.ts        # Real-time analysis
│       ├── business-insights/      # Business analysis
│       ├── ai-debate/              # AI debate mode
│       └── idea-mixer/             # Idea mixing
├── components/                     # Reusable UI components
├── models/                         # MongoDB schemas
│   ├── User.ts
│   └── IdeaRepo.ts
├── lib/
│   └── mongodb.ts                  # Database connection
├── auth.ts                         # NextAuth config
└── types/                          # TypeScript definitions
```
- Detailed description
- Strengths (bullet points)
- Trade-offs (considerations)
- Scores (Impact, Cost, Feasibility)

## Customization

### Changing Colors
Edit the primary colors in component files or extend the Tailwind config:
- Primary: `#6366F1` (indigo)
- Secondary: `#93C5FD` (blue)

### Modifying AI Prompts
Edit the prompts in:
- `/app/api/evolve/route.ts` - For idea evolution
- `/app/api/analyze/route.ts` - For real-time analysis

### Adding Features
Consider implementing:
- User authentication
- Save/export variants
- Comparison mode for variants
- Historical idea tracking
- Collaborative features
- PDF report generation

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add `GEMINI_API_KEY` to environment variables
4. Deploy

### Other Platforms

Build the production version:
```bash
npm run build
npm start
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues or questions, please open an issue on GitHub.

---

Built with ❤️ using Next.js, TailwindCSS & Google Gemini AI

