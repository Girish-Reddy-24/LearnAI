#!/bin/bash

echo "🚀 Starting Learning Platform SQLite Backend"
echo "=============================================="
echo ""

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
    echo "✅ Virtual environment created"
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install -r requirements.txt

# Seed database if it doesn't exist
if [ ! -f "learning_platform.db" ]; then
    echo "🌱 Seeding database with sample data..."
    python -m app.seed_data
fi

# Start the server
echo ""
echo "✨ Starting FastAPI server..."
echo "📍 API will be available at: http://localhost:8000"
echo "📚 Documentation at: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

uvicorn app.main_sqlite:app --reload --host 0.0.0.0 --port 8000
