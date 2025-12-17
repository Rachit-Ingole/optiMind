# 🎯 OptiMind - Quick Reference Guide

## 🚀 Common Commands

```bash
# Development
npm run dev          # Start dev server (localhost:3000)
npm run build        # Build for production
npm run start        # Run production build
npm run lint         # Check code quality

# Installation
npm install          # Install dependencies
npm install <pkg>    # Add new package
```

## 📁 Project Structure

```
opti-mind/
├── app/
│   ├── api/
│   │   ├── analyze/route.ts    # Real-time analysis endpoint
│   │   └── evolve/route.ts     # Idea evolution endpoint
│   ├── tool/
│   │   └── page.tsx            # Main tool page
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   └── globals.css             # Global styles + animations
├── components/
│   ├── AnalysisPanel.tsx       # Real-time analysis with charts
│   ├── IdeaCard.tsx            # Variant display card
│   ├── VariantModal.tsx        # Details modal
│   └── LoadingSpinner.tsx      # Loading animation
├── types/
│   └── index.ts                # TypeScript interfaces
├── public/                     # Static files
├── .env.local                  # Environment variables (not committed)
├── package.json                # Dependencies
└── tsconfig.json               # TypeScript config
```

## 🎨 Color Palette

```typescript
// Primary Colors
Primary:     #6366F1  (indigo-600)
Secondary:   #93C5FD  (blue-300)

// Semantic Colors
Success:     #10B981  (green-600)
Warning:     #F59E0B  (amber-500)
Error:       #EF4444  (red-600)
Info:        #3B82F6  (blue-600)

// Neutral Colors
Background:  #FFFFFF  (white)
Card BG:     #F3F4F6  (gray-100)
Border:      #E5E7EB  (gray-200)
Text:        #1F2937  (slate-800)
Text Muted:  #6B7280  (slate-600)
```

## 🔧 Component Props Reference

### IdeaCard
```typescript
<IdeaCard
  title="string"           // Variant title
  summary="string"         // One-line summary
  description="string"     // 2-3 sentences
  scores={{
    impact: 85,           // 0-100
    cost: 70,             // 0-100
    feasibility: 80       // 0-100
  }}
  onClick={() => {}}      // Click handler
/>
```

### VariantModal
```typescript
<VariantModal
  variant={{
    title: "string",
    summary: "string",
    description: "string",
    strengths: ["...", "...", "..."],
    tradeoffs: ["...", "..."],
    scores: { impact: 85, cost: 70, feasibility: 80 }
  }}
  onClose={() => {}}      // Close handler
/>
```

### AnalysisPanel
```typescript
<AnalysisPanel
  analysis={{
    clarity: 75,          // 0-100
    marketFit: 80,        // 0-100
    competition: ["...", "...", "..."],
    suggestions: ["...", "...", "..."],
    marketData: [{ category: "...", demand: 85, competition: 70 }],
    radarData: [{ subject: "Innovation", score: 80 }]
  }}
  loading={false}         // Loading state
/>
```

## 🌐 API Endpoints

### POST /api/analyze
Analyzes idea for clarity and market fit.

**Request:**
```json
{
  "idea": "Your detailed idea description here..."
}
```

**Response:**
```json
{
  "clarity": 75,
  "marketFit": 80,
  "competition": ["Competitor 1", "Competitor 2"],
  "suggestions": ["Suggestion 1", "Suggestion 2"],
  "marketData": [
    { "category": "EdTech", "demand": 85, "competition": 70 }
  ],
  "radarData": [
    { "subject": "Innovation", "score": 80 }
  ]
}
```

### POST /api/evolve
Generates 3 optimized variants.

**Request:**
```json
{
  "idea": "Your detailed idea description here...",
  "goal": "impact" | "cost" | "balanced"
}
```

**Response:**
```json
{
  "variants": [
    {
      "title": "High-Impact Community Platform",
      "summary": "Viral growth through gamification",
      "description": "Build a feature-rich platform...",
      "strengths": ["...", "...", "..."],
      "tradeoffs": ["...", "..."],
      "scores": { "impact": 92, "cost": 45, "feasibility": 68 }
    },
    // ... 2 more variants
  ]
}
```

## 🎯 Key Features

### Real-time Analysis
- **Trigger**: User types 20+ characters
- **Debounce**: 1 second delay
- **Displays**: Clarity score, competition, suggestions, charts

### Idea Evolution
- **Input**: Idea + optimization goal
- **Output**: 3 variants (Impact/Cost/Balanced)
- **Time**: 3-5 seconds per request

### Charts
- **Bar Chart**: Market demand vs competition
- **Radar Chart**: 5-dimensional idea assessment
- **Progress Bars**: Individual metric scores

## 🔍 Debugging Tips

### Check if API Key is set:
```bash
echo $GEMINI_API_KEY  # Should show your key
# or check .env.local file
```

### Test API endpoints directly:
```bash
# Test analyze endpoint
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"idea": "A mobile app for finding study partners"}'

# Test evolve endpoint
curl -X POST http://localhost:3000/api/evolve \
  -H "Content-Type: application/json" \
  -d '{"idea": "A mobile app for finding study partners", "goal": "balanced"}'
```

### Check browser console:
```javascript
// Open DevTools (F12) and look for:
- Network errors (API failures)
- Console errors (React errors)
- Failed requests (API timeout)
```

### Common issues:
1. **Charts not showing**: Check data format (numbers, not strings)
2. **API errors**: Verify GEMINI_API_KEY in .env.local
3. **Slow responses**: Switch to gemini-1.5-flash model
4. **Build errors**: Run `npm run build` to check

## 📝 Code Snippets

### Add new API endpoint:
```typescript
// app/api/your-route/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const data = await request.json();
  // Your logic here
  return NextResponse.json({ result: "..." });
}
```

### Add new component:
```typescript
// components/YourComponent.tsx
'use client';

export default function YourComponent({ prop }: { prop: string }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {prop}
    </div>
  );
}
```

### Call API from frontend:
```typescript
const response = await fetch('/api/your-route', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ data: "..." }),
});
const result = await response.json();
```

## 🎨 Tailwind Classes Reference

### Layout:
```css
flex items-center justify-center   /* Center content */
grid grid-cols-2 gap-4            /* 2-column grid */
max-w-7xl mx-auto px-6            /* Container */
space-y-4                         /* Vertical spacing */
```

### Styling:
```css
bg-white rounded-lg shadow-md     /* Card style */
border border-gray-200            /* Border */
text-slate-800 font-semibold      /* Typography */
hover:bg-indigo-700               /* Hover state */
transition-all duration-150       /* Animation */
```

### Responsive:
```css
md:grid-cols-3                    /* Desktop: 3 cols */
lg:flex-row                       /* Large: row layout */
sm:text-sm                        /* Small: smaller text */
```

## 📊 Performance Tips

1. **Optimize images**: Use Next.js Image component
2. **Lazy load**: Use `dynamic()` for heavy components
3. **Memoize**: Use `useMemo` for expensive calculations
4. **Debounce**: Already implemented for analysis (1s)
5. **Cache**: Consider Redis for API responses

## 🔒 Security Checklist

- ✅ API key in .env.local (not committed)
- ✅ .env* in .gitignore
- ⚠️ Add rate limiting for API routes
- ⚠️ Validate user input
- ⚠️ Add CORS headers if needed
- ⚠️ Sanitize AI responses

## 🚀 Deployment Checklist

- [ ] Set GEMINI_API_KEY in production
- [ ] Run `npm run build` successfully
- [ ] Test all features in production mode
- [ ] Set up error monitoring (Sentry)
- [ ] Configure analytics (GA4)
- [ ] Add custom domain
- [ ] Enable HTTPS
- [ ] Set up CI/CD pipeline

## 📱 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ⚠️ IE11 not supported

## 🆘 Getting Help

1. **Check logs**: Browser console + terminal output
2. **Read docs**: README.md, SETUP.md
3. **Search issues**: Check if others had same problem
4. **Ask AI**: Use GitHub Copilot or ChatGPT
5. **Community**: Stack Overflow, Next.js Discord

## 📚 Useful Links

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Gemini AI](https://ai.google.dev/docs)
- [Recharts](https://recharts.org/en-US/)
- [Lucide Icons](https://lucide.dev/)

---

**Quick tip**: Press `Ctrl+K` (or `Cmd+K` on Mac) in VS Code to quickly find files! 🚀
