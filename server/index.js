const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const RAGService = require('./services/ragService');
const RecommendationService = require('./services/recommendationService');

const app = express();
const PORT = process.env.PORT || 5000;

const ragService = new RAGService();
const recommendationService = new RecommendationService();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use(express.static(path.join(__dirname, '../client/build')));

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'RAG Product Recommender API is running' });
});

app.get('/api/products', (req, res) => {
  try {
    res.json({
      success: true,
      data: ragService.products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch products',
      message: error.message
    });
  }
});

app.get('/api/products/:id', (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const enhancedProduct = ragService.getEnhancedProductInfo(productId);
    
    if (!enhancedProduct) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      data: enhancedProduct
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch product information',
      message: error.message
    });
  }
});

app.post('/api/recommendations', (req, res) => {
  try {
    const { query, preferences = {} } = req.body;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Query is required'
      });
    }
    
    const recommendations = recommendationService.getPersonalizedRecommendations(query, preferences);
    
    const ragResponse = ragService.query(query);
    
    res.json({
      success: true,
      data: {
        recommendations,
        ragInfo: ragResponse,
        query: query,
        extractedPreferences: recommendationService.extractPreferencesFromQuery(query.toLowerCase())
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get recommendations',
      message: error.message
    });
  }
});

app.get('/api/trending', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const trending = recommendationService.getTrendingProducts(limit);
    
    res.json({
      success: true,
      data: trending
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch trending products',
      message: error.message
    });
  }
});

app.get('/api/products/:id/similar', (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const limit = parseInt(req.query.limit) || 3;
    
    const similarProducts = recommendationService.getCollaborativeRecommendations(productId, limit);
    
    res.json({
      success: true,
      data: similarProducts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch similar products',
      message: error.message
    });
  }
});

app.post('/api/rag/query', (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Query is required'
      });
    }
    
    const ragResponse = ragService.query(query);
    
    res.json({
      success: true,
      data: ragResponse
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to process RAG query',
      message: error.message
    });
  }
});

app.get('/api/debug/rag', (req, res) => {
  try {
    const testQuery = "stress relaxation";
    const retrievedDocs = ragService.retrieve(testQuery);
    
    res.json({
      success: true,
      data: {
        query: testQuery,
        knowledgeBaseSize: ragService.knowledgeBase.length,
        retrievedDocs: retrievedDocs,
        sampleKBEntry: ragService.knowledgeBase[0]
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.get('/api/ingredients', (req, res) => {
  try {
    res.json({
      success: true,
      data: ragService.ingredients
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch ingredients',
      message: error.message
    });
  }
});

app.get('/api/search', (req, res) => {
  try {
    const { effects, category, type, minPrice, maxPrice } = req.query;
    
    let filteredProducts = ragService.products;
    
    if (effects) {
      const effectsArray = effects.split(',').map(e => e.trim());
      filteredProducts = filteredProducts.filter(product =>
        effectsArray.some(effect => product.effects.includes(effect))
      );
    }
    
    if (category) {
      filteredProducts = filteredProducts.filter(product =>
        product.category === category
      );
    }
    
    if (type) {
      filteredProducts = filteredProducts.filter(product =>
        product.type === type
      );
    }
    
    if (minPrice || maxPrice) {
      const min = parseFloat(minPrice) || 0;
      const max = parseFloat(maxPrice) || Infinity;
      filteredProducts = filteredProducts.filter(product =>
        product.price >= min && product.price <= max
      );
    }
    
    res.json({
      success: true,
      data: filteredProducts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to search products',
      message: error.message
    });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Something went wrong!',
    message: err.message
  });
});

// app.get('*', (req, res) => {
//   res.status(404).json({ error: 'Route not found' });
// });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`RAG Service initialized with ${ragService.products.length} products`);
  console.log(`Recommendation Service ready`);
  console.log(`Knowledge base contains ${ragService.knowledgeBase.length} entries`);
});

module.exports = app;
