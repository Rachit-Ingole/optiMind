# GitHub-Style Platform Setup Guide

OptiMind has been transformed into a multi-user platform with authentication and repository management, similar to GitHub!

## 🎯 New Features

### User Authentication
- Sign up / Sign in with email and password
- Secure password hashing with bcryptjs
- Protected routes with NextAuth v5
- Session management

### Idea Repositories
- Create public or private idea repositories
- Save your ideas with variants and analysis
- Organize with categories and tags
- Fork public repositories from other users
- Star your favorite ideas

### Social Features
- Discover page to browse public repositories
- User dashboard to manage your repos
- Fork counter and star counter
- View tracking for repositories

## 🚀 Quick Start

### 1. Install MongoDB

#### Option A: MongoDB Atlas (Cloud - Recommended for Production)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string
5. Update `.env.local`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/optimind?retryWrites=true&w=majority
   ```

#### Option B: Local MongoDB (Development)
```bash
# On Ubuntu/Debian
sudo apt-get install mongodb

# On macOS
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
sudo systemctl start mongodb  # Linux
brew services start mongodb-community  # macOS

# Update .env.local
MONGODB_URI=mongodb://localhost:27017/optimind
```

### 2. Generate NextAuth Secret

```bash
# Generate a secure random string
openssl rand -base64 32
```

Copy the output and update `.env.local`:
```
NEXTAUTH_SECRET=your-generated-secret-here
```

### 3. Update Environment Variables

Your `.env.local` should look like this:
```env
# Gemini AI
GEMINI_API_KEY=your-key-here

# MongoDB
MONGODB_URI=mongodb://localhost:27017/optimind

# NextAuth
NEXTAUTH_SECRET=your-generated-secret
NEXTAUTH_URL=http://localhost:3000
```

### 4. Start the Application

```bash
npm run dev
```

The app will be available at http://localhost:3000

## 📖 User Guide

### Creating an Account
1. Navigate to http://localhost:3000
2. Click "Sign In" in the navigation
3. Click "Sign up" to create a new account
4. Fill in your name, email, and password (minimum 6 characters)

### Creating an Idea Repository
1. Sign in to your account
2. Click "Dashboard" in the navigation
3. Click "New Idea" button
4. Fill in:
   - **Repository Name**: A unique name for your idea
   - **Description**: Brief summary
   - **Your Idea**: Detailed description
   - **Visibility**: Public (others can see/fork) or Private (only you)
   - **Category**: Tech, Business, Education, etc.
   - **Tags**: Up to 5 tags for categorization
5. Optionally click "Generate Variants" to get AI-optimized versions
6. Click "Save" to create the repository

### Discovering Ideas
1. Click "Discover" in the navigation
2. Browse public repositories from all users
3. Use the search bar to find specific ideas
4. Sort by:
   - Recently Added
   - Most Stars
   - Most Forks
   - Most Viewed

### Forking Repositories
1. Find a public repository you like
2. Click on it to view details
3. Click the "Fork" button
4. A copy will be created in your account
5. The original repo will show "Forked from [original]"

### Starring Repositories
1. View any repository
2. Click the "Star" button
3. Star count increases
4. Use stars to bookmark ideas you find interesting

## 🗄️ Database Schema

### User Collection
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  image: String,
  bio: String,
  location: String,
  website: String,
  followers: [ObjectId],
  following: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

### IdeaRepo Collection
```javascript
{
  name: String,
  description: String,
  owner: ObjectId (ref: User),
  visibility: 'public' | 'private',
  content: {
    originalIdea: String,
    goal: String,
    variants: Array,
    businessInsights: Object,
    analysis: Object
  },
  forkedFrom: ObjectId (ref: IdeaRepo),
  forks: [ObjectId],
  stars: [ObjectId],
  tags: [String],
  category: String,
  starCount: Number,
  forkCount: Number,
  viewCount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔒 Security Features

- Passwords hashed with bcryptjs (10 salt rounds)
- JWT-based session management
- Protected API routes (require authentication)
- Middleware to protect dashboard and creation routes
- Private repositories only accessible by owner
- Public repositories accessible to everyone

## 🛣️ Routes

### Public Routes
- `/` - Home page
- `/login` - Sign in page
- `/signup` - Create account page
- `/discover` - Browse public repositories
- `/repo/[id]` - View repository details (public repos)
- `/tool` - Standalone idea evolution tool (no save)

### Protected Routes (Require Login)
- `/dashboard` - User's repository management
- `/create` - Create new repository
- `/repo/[id]` - View private repositories (owner only)

### API Routes
- `POST /api/auth/register` - Create account
- `GET /POST /api/auth/[...nextauth]` - NextAuth handlers
- `GET /api/repos` - List repositories
- `POST /api/repos` - Create repository
- `GET /api/repos/[id]` - Get repository details
- `PUT /api/repos/[id]` - Update repository
- `DELETE /api/repos/[id]` - Delete repository
- `POST /api/repos/[id]/fork` - Fork repository
- `POST /api/repos/[id]/star` - Star/unstar repository
- `POST /api/evolve` - Generate idea variants
- `POST /api/analyze` - Real-time idea analysis
- `POST /api/business-insights` - Business analysis

## 🎨 Features Comparison

| Feature | Before | After |
|---------|--------|-------|
| Users | Single user | Multi-user with accounts |
| Storage | Browser localStorage | MongoDB database |
| Sharing | Export JSON only | Public repositories + URLs |
| Collaboration | None | Fork + Star system |
| Discovery | None | Browse all public repos |
| Privacy | No control | Public/Private visibility |
| Organization | Basic library | Categories + Tags + Dashboard |

## 🔧 Development Tips

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
sudo systemctl status mongodb  # Linux
brew services list  # macOS

# View MongoDB logs
sudo tail -f /var/log/mongodb/mongodb.log  # Linux
brew services info mongodb-community  # macOS
```

### Reset Database (Development Only)
```bash
# Connect to MongoDB
mongosh

# Switch to database
use optimind

# Drop all collections
db.users.drop()
db.ideareps.drop()
```

### View Database Content
```bash
mongosh optimind
db.users.find().pretty()
db.ideareps.find().pretty()
```

## 🚀 Production Deployment

### Environment Variables for Production
```env
GEMINI_API_KEY=your-production-key
MONGODB_URI=your-production-mongodb-uri
NEXTAUTH_SECRET=very-long-random-secret-for-production
NEXTAUTH_URL=https://your-domain.com
```

### Deploy to Vercel
1. Push code to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!

### MongoDB Atlas for Production
- Use MongoDB Atlas for production database
- Enable network access from anywhere (0.0.0.0/0) or specific IPs
- Create a dedicated database user with strong password
- Use connection pooling for better performance

## 📝 Next Steps

Consider adding:
- [ ] User profile pages
- [ ] Follow/unfollow users
- [ ] Comments on repositories
- [ ] Repository editing after creation
- [ ] Search with filters (tags, category)
- [ ] Trending page
- [ ] Email verification
- [ ] OAuth providers (Google, GitHub)
- [ ] Activity feed
- [ ] Notifications

## 🐛 Troubleshooting

### "Please define MONGODB_URI" error
- Make sure `.env.local` exists and has MONGODB_URI
- Restart the dev server after adding env variables

### "Invalid credentials" on login
- Check if user exists in database
- Password must be at least 6 characters
- Email is case-sensitive

### Fork button not working
- Must be signed in
- Can only fork public repositories
- Cannot fork your own repositories

### Repository not showing in Discover
- Check visibility is set to "public"
- Refresh the page
- Check database with mongosh

## 📚 Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [Next.js App Router](https://nextjs.org/docs/app)

---

**Need help?** Check the existing documentation files or create an issue on GitHub!
