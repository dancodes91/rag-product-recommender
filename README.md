# AI-Powered Product Recommendation System with RAG

A full-stack application that demonstrates an AI-powered product recommendation system using Retrieval-Augmented Generation (RAG) technology. Built for the BakedBot.ai Full Stack AI/ML Engineer take-home challenge.

## Features

### Core Functionality
- **AI-Powered Recommendations**: Natural language query processing with intelligent product matching
- **RAG Implementation**: Retrieval-Augmented Generation for enhanced product information and context-aware responses
- **Multiple Recommendation Algorithms**: 
  - Content-based filtering
  - Collaborative filtering
  - Hybrid approach combining both methods
- **Trending Products**: Dynamic trending analysis based on sales data and ratings
- **Advanced Search**: Natural language processing with preference extraction
- **Product Details**: Enhanced product information using RAG technology

### Technical Features
- **Full-Stack Architecture**: Node.js backend with React frontend
- **RESTful API**: Comprehensive API endpoints for all functionality
- **Responsive Design**: Mobile-first responsive UI
- **Real-time Data**: Dynamic recommendations based on user preferences
- **Knowledge Base**: Structured product and ingredient information for RAG

## Architecture

### Backend (Node.js)
- **Express.js** server with RESTful API endpoints
- **RAG Service**: Custom implementation for retrieval and augmentation
- **Recommendation Service**: Multiple recommendation algorithms
- **Data Layer**: JSON-based mock data (easily replaceable with database)

### Frontend (React)
- **Component-based architecture** with reusable UI components
- **State management** using React hooks
- **Responsive design** with CSS Grid and Flexbox
- **API integration** with Axios

### AI/ML Components
- **Natural Language Processing**: Query parsing and preference extraction
- **Similarity Algorithms**: Product matching based on multiple factors
- **RAG System**: Knowledge base retrieval and response generation
- **Recommendation Engine**: Hybrid filtering approach


## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Backend Setup
1. Install backend dependencies:
```bash
npm install
```

2. Start the backend server:
```bash
npm start
# or for development with auto-reload:
npm run dev
```

The backend server will run on `http://localhost:5000`

### Frontend Setup
1. Navigate to the client directory and install dependencies:
```bash
cd client
npm install
```

2. Start the React development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

### Full Development Setup
Run both backend and frontend simultaneously:
```bash
# From the root directory
npm run dev-full
```

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID with RAG enhancement
- `GET /api/products/:id/similar` - Get similar products

### Recommendations
- `POST /api/recommendations` - Get personalized recommendations

### Trending & Search
- `GET /api/trending` - Get trending products
- `GET /api/search` - Search products with filters
- `POST /api/rag/query` - Direct RAG query endpoint

### Utility
- `GET /api/health` - Health check
- `GET /api/ingredients` - Get ingredient information


## Future Enhancements

### Technical Improvements
1. **Machine Learning Models**: Implement proper ML models for recommendations
2. **Real-time Updates**: WebSocket integration for live updates
3. **Advanced RAG**: Integration with LLMs like GPT or Claude
4. **Performance Optimization**: Implement caching and optimization strategies
5. **Testing Suite**: Comprehensive unit and integration tests

### Feature Additions
1. **User Profiles**: Personal recommendation history and preferences
2. **Reviews & Ratings**: User-generated content integration
3. **Inventory Management**: Real-time stock tracking
4. **Purchase Integration**: E-commerce functionality
5. **Mobile App**: React Native mobile application

