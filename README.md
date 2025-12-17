# OptiMind - AI Idea Evolution Engine

A Next.js web application that helps users evolve and optimize their ideas using Google Gemini AI.

## Features

- 🎯 **Real-time Idea Analysis**: Get instant feedback on clarity, market fit, and competition as you type
- 🚀 **Smart Evolution**: AI generates three optimized variants (impact-focused, cost-efficient, and balanced)
- 📊 **Visual Insights**: Interactive charts and metrics powered by Recharts
- 💡 **Competition Analysis**: Discover existing solutions and market landscape
- ✨ **Professional UI**: Clean, card-based layout inspired by Vercel/Notion

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: TailwindCSS 4
- **AI**: Google Gemini AI
- **Charts**: Recharts
- **Icons**: Lucide React
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Google Gemini API key (get one at [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey))

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd opti-mind
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
opti-mind/
├── app/
│   ├── api/
│   │   ├── analyze/route.ts    # Real-time analysis endpoint
│   │   └── evolve/route.ts     # Idea evolution endpoint
│   ├── tool/
│   │   └── page.tsx            # Main tool page
│   ├── layout.tsx
│   ├── page.tsx                # Home page
│   └── globals.css
├── components/
│   ├── AnalysisPanel.tsx       # Real-time analysis with charts
│   ├── IdeaCard.tsx            # Variant card component
│   ├── VariantModal.tsx        # Detailed variant modal
│   └── LoadingSpinner.tsx      # Loading indicator
└── public/
```

## Usage

1. **Home Page**: Click "Start Evolving" to access the tool
2. **Enter Your Idea**: Describe your idea in detail (minimum 20 characters for analysis)
3. **Real-time Analysis**: Watch as AI analyzes your idea for clarity, competition, and provides suggestions
4. **Choose Optimization Goal**: Select Impact, Cost, or Balanced
5. **Evolve**: Click "Evolve Idea" to generate three optimized variants
6. **Explore Variants**: Click any card to view detailed strengths, trade-offs, and metrics

## Features in Detail

### Real-time Analysis
- **Clarity Score**: How well-defined is your idea?
- **Market Fit**: How well does it address market needs?
- **Competition**: Existing competitors and similar solutions
- **AI Suggestions**: Actionable recommendations
- **Market Data Charts**: Visual representation of market demand and competition
- **Radar Assessment**: Multi-dimensional evaluation of your idea

### Idea Evolution
- **Impact-Optimized**: Maximum reach and effectiveness
- **Cost-Optimized**: Budget-friendly and resource-efficient
- **Balanced**: Equal consideration of all factors

Each variant includes:
- Title and summary
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

