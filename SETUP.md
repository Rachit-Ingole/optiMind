# OptiMind - Setup & Configuration Guide

## 🚀 Quick Setup (5 minutes)

### Step 1: Get Your Gemini API Key
1. Visit [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key

### Step 2: Configure Environment
1. Open the `.env.local` file in the root directory
2. Replace `your_gemini_api_key_here` with your actual API key:
```
GEMINI_API_KEY=AIzaSyC...your-actual-key-here
```

### Step 3: Start the Server
The development server is already running at:
- **Local**: http://localhost:3000
- **Network**: http://10.59.65.31:3000

If it's not running, execute:
```bash
npm run dev
```

## ✅ Verification

Visit http://localhost:3000 and you should see:
1. **Home Page**: Hero section with "Start Evolving" button
2. **Tool Page** (click button): Input panel with real-time analysis

## 🎯 How to Use

### Test with Sample Idea:
```
A mobile app that connects college students with study groups 
based on their courses, learning styles, and availability. 
Uses AI to match compatible study partners and suggests optimal 
meeting times and locations on campus.
```

### Features to Test:
1. **Real-time Analysis**: Type 20+ characters to see live analysis
2. **Charts**: Watch market data and radar charts appear
3. **Evolution**: Select a goal and click "Evolve Idea"
4. **Variants**: Explore 3 AI-generated optimized versions
5. **Details**: Click any card to view full breakdown

## 📊 Expected Results

After evolving an idea, you'll see:
- **Impact-Optimized Variant**: High impact (85-95), Lower cost (40-60)
- **Cost-Optimized Variant**: High cost score (80-95), Moderate impact (55-70)
- **Balanced Variant**: Balanced scores (70-80 across all metrics)

## 🎨 UI Components Overview

### Components Created:
```
components/
├── IdeaCard.tsx          - Displays variant with scores
├── VariantModal.tsx      - Full details modal
├── AnalysisPanel.tsx     - Real-time analysis with charts
└── LoadingSpinner.tsx    - Loading animation
```

### Pages Created:
```
app/
├── page.tsx              - Home/landing page
└── tool/page.tsx         - Main application interface
```

### API Routes:
```
app/api/
├── analyze/route.ts      - Real-time idea analysis
└── evolve/route.ts       - Generate 3 variants
```

## 🔧 Customization Options

### 1. Change AI Model
Edit API routes to use a different model:
```typescript
const model = genAI.getGenerativeModel({ 
  model: 'gemini-1.5-pro' // or 'gemini-pro'
});
```

### 2. Adjust Analysis Delay
In `app/tool/page.tsx`, modify debounce timeout:
```typescript
const timer = setTimeout(() => {
  analyzeIdea(idea);
}, 1000); // Change to 500 or 2000
```

### 3. Modify Color Scheme
Update colors in components:
- Primary: `indigo-600` (currently #6366F1)
- Secondary: `blue-600`
- Success: `green-600`

### 4. Add More Metrics
Edit API prompts to include additional scores like:
- Technical Complexity
- Time to Market
- Risk Level
- Innovation Score

## 🚨 Troubleshooting

### Issue: "API Key not found"
**Solution**: Ensure `.env.local` exists and contains `GEMINI_API_KEY=your-key`

### Issue: Charts not rendering
**Solution**: Check browser console. Recharts requires valid numeric data.

### Issue: Analysis not appearing
**Solution**: Type at least 20 characters in the idea textarea.

### Issue: Evolution returns mock data
**Solution**: 
1. Check if API key is valid
2. Review Gemini API quota at https://aistudio.google.com
3. Check console for error messages

### Issue: Slow response times
**Solution**: 
- Switch to `gemini-1.5-flash` (faster but less capable)
- Reduce prompt complexity
- Consider caching analysis results

## 📈 Additional Features You Can Add

### 1. Export to PDF
```bash
npm install jspdf html2canvas
```

### 2. Save Ideas Locally
Use `localStorage` or add a database (Prisma + PostgreSQL)

### 3. Comparison Mode
Allow users to compare variants side-by-side

### 4. Share Links
Generate shareable URLs with idea data

### 5. User Accounts
Add NextAuth.js for authentication

### 6. Version History
Track idea iterations over time

### 7. Collaboration
Real-time editing with WebSockets

### 8. More Chart Types
- Timeline projections
- Cost breakdown pie charts
- ROI calculators

## 🎓 Learning Resources

### Next.js
- [Official Docs](https://nextjs.org/docs)
- [App Router Guide](https://nextjs.org/docs/app)

### Gemini AI
- [API Documentation](https://ai.google.dev/docs)
- [Best Practices](https://ai.google.dev/docs/best_practices)

### TailwindCSS
- [Documentation](https://tailwindcss.com/docs)
- [Component Examples](https://tailwindui.com/components)

### Recharts
- [Examples Gallery](https://recharts.org/en-US/examples)
- [API Reference](https://recharts.org/en-US/api)

## 💡 Pro Tips

1. **Better Prompts = Better Results**: Spend time refining AI prompts
2. **Error Handling**: The API routes include fallback mock data
3. **Performance**: Consider implementing request caching
4. **User Experience**: Add loading states for all async operations
5. **Mobile**: Test on different screen sizes (already responsive)

## 📝 Environment Variables Reference

```bash
# Required
GEMINI_API_KEY=your_key_here

# Optional (for future features)
# DATABASE_URL=postgresql://...
# NEXTAUTH_SECRET=...
# NEXTAUTH_URL=http://localhost:3000
```

## 🎉 Success!

Your OptiMind application is now fully set up and running!

Next steps:
1. Test with different ideas
2. Customize the UI to match your brand
3. Add your own features
4. Deploy to Vercel or your preferred platform

Need help? Check the main README.md or open an issue on GitHub.

---
Happy building! 🚀
