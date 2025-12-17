#!/bin/bash

echo "🚀 OptiMind Setup Check"
echo "======================="
echo ""

# Check Node.js
echo "📦 Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo "✅ Node.js installed: $NODE_VERSION"
else
    echo "❌ Node.js not found. Please install Node.js 18+"
    exit 1
fi

# Check npm
echo ""
echo "📦 Checking npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo "✅ npm installed: $NPM_VERSION"
else
    echo "❌ npm not found"
    exit 1
fi

# Check MongoDB
echo ""
echo "🗄️  Checking MongoDB..."
if command -v mongod &> /dev/null; then
    MONGO_VERSION=$(mongod --version | head -n 1)
    echo "✅ MongoDB installed: $MONGO_VERSION"
    
    # Check if MongoDB is running
    if pgrep -x "mongod" > /dev/null; then
        echo "✅ MongoDB is running"
    else
        echo "⚠️  MongoDB is installed but not running"
        echo "   Start it with: sudo systemctl start mongodb (Linux)"
        echo "   Or: brew services start mongodb-community (macOS)"
    fi
else
    echo "⚠️  MongoDB not found locally"
    echo "   You can:"
    echo "   1. Install locally: brew install mongodb-community (macOS)"
    echo "   2. Use MongoDB Atlas: https://www.mongodb.com/cloud/atlas"
fi

# Check environment file
echo ""
echo "🔧 Checking environment configuration..."
if [ -f ".env.local" ]; then
    echo "✅ .env.local file exists"
    
    # Check required variables
    if grep -q "GEMINI_API_KEY=" .env.local && grep -q "MONGODB_URI=" .env.local && grep -q "NEXTAUTH_SECRET=" .env.local; then
        echo "✅ Required environment variables found"
    else
        echo "⚠️  Some environment variables may be missing"
        echo "   Required: GEMINI_API_KEY, MONGODB_URI, NEXTAUTH_SECRET, NEXTAUTH_URL"
    fi
else
    echo "❌ .env.local file not found"
    echo "   Create it with:"
    echo "   cp .env.local.example .env.local (if example exists)"
    echo "   Or manually create .env.local with required variables"
fi

# Check dependencies
echo ""
echo "📚 Checking dependencies..."
if [ -d "node_modules" ]; then
    echo "✅ Dependencies installed"
else
    echo "⚠️  Dependencies not installed"
    echo "   Run: npm install"
fi

echo ""
echo "======================="
echo "🎯 Next Steps:"
echo ""
echo "1. Ensure MongoDB is running (local or Atlas)"
echo "2. Update .env.local with your configuration"
echo "3. Generate NextAuth secret: openssl rand -base64 32"
echo "4. Run: npm run dev"
echo "5. Visit: http://localhost:3000"
echo ""
echo "📖 For detailed setup, see GITHUB_SETUP.md"
