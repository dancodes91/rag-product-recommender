import React, { useState, useEffect } from 'react';
import './App.css';
import SearchForm from './components/SearchForm';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import RAGInfo from './components/RAGInfo';
import TrendingProducts from './components/TrendingProducts';
import { getRecommendations, getTrendingProducts, getProductById } from './services/api';

function App() {
  const [recommendations, setRecommendations] = useState([]);
  const [ragInfo, setRagInfo] = useState(null);
  const [trending, setTrending] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    loadTrendingProducts();
  }, []);

  const loadTrendingProducts = async () => {
    try {
      const response = await getTrendingProducts();
      setTrending(response.data.data);
    } catch (err) {
      console.error('Error loading trending products:', err);
    }
  };

  const handleSearch = async (searchQuery, preferences = {}) => {
    setLoading(true);
    setError(null);
    setQuery(searchQuery);
    
    try {
      const response = await getRecommendations(searchQuery, preferences);
      const { recommendations: recs, ragInfo: rag } = response.data.data;
      
      setRecommendations(recs);
      setRagInfo(rag);
    } catch (err) {
      setError('Failed to get recommendations. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProductSelect = async (productId) => {
    try {
      const response = await getProductById(productId);
      setSelectedProduct(response.data.data);
    } catch (err) {
      console.error('Error loading product details:', err);
      setError('Failed to load product details.');
    }
  };

  const handleBackToResults = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Product Recommender</h1>
      </header>

      <main className="App-main">
        {!selectedProduct ? (
          <>
            <SearchForm onSearch={handleSearch} loading={loading} />
            
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            {query && (
              <div className="search-results">
                <h2>Results for: "{query}"</h2>
                
                {ragInfo && (
                  <RAGInfo ragInfo={ragInfo} />
                )}
                
                {recommendations.length > 0 ? (
                  <ProductList 
                    products={recommendations} 
                    onProductSelect={handleProductSelect}
                    title="Recommended Products"
                  />
                ) : !loading && query && (
                  <p>No recommendations found for your query.</p>
                )}
              </div>
            )}

            {trending.length > 0 && (
              <TrendingProducts 
                products={trending} 
                onProductSelect={handleProductSelect}
              />
            )}
          </>
        ) : (
          <ProductDetail 
            product={selectedProduct} 
            onBack={handleBackToResults}
          />
        )}
      </main>

      <footer className="App-footer">
        <p>Built with React, Node.js, and AI/ML techniques</p>
      </footer>
    </div>
  );
}

export default App;
