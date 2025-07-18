import React, { useState, useEffect } from 'react';
import { getSimilarProducts } from '../services/api';
import ProductList from './ProductList';
import './ProductDetail.css';

const ProductDetail = ({ product, onBack }) => {
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product && product.product) {
      loadSimilarProducts();
    }
  }, [product]);

  const loadSimilarProducts = async () => {
    setLoading(true);
    try {
      const response = await getSimilarProducts(product.product.id);
      setSimilarProducts(response.data.data);
    } catch (error) {
      console.error('Error loading similar products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!product || !product.product) {
    return <div>Loading product details...</div>;
  }

  const { product: productInfo, enhancedInfo, relatedProducts } = product;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star full">★</span>);
    }

    if (hasHalfStar) {
      stars.push(<span key="half" className="star half">★</span>);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty">☆</span>);
    }

    return stars;
  };

  return (
    <div className="product-detail">
      <button className="back-button" onClick={onBack}>
        ← Back to Results
      </button>

      <div className="product-detail-content">
        <div className="product-main-info">
          <div className="product-header">
            <h1>{productInfo.name}</h1>
            <div className="product-rating">
              {renderStars(productInfo.rating)}
              <span className="rating-value">({productInfo.rating}/5)</span>
            </div>
          </div>

          <div className="product-price-large">
            {formatPrice(productInfo.price)}
          </div>

          <div className="product-meta-info">
            <div className="meta-item">
              <strong>Type:</strong> {productInfo.type}
            </div>
            <div className="meta-item">
              <strong>Category:</strong> {productInfo.category}
            </div>
          </div>

          <div className="product-description-full">
            <h3>Description</h3>
            <p>{productInfo.description}</p>
          </div>

          <div className="product-effects-section">
            <h3>Effects</h3>
            <div className="effects-list">
              {productInfo.effects.map((effect, index) => (
                <span key={index} className="effect-badge-large">
                  {effect}
                </span>
              ))}
            </div>
          </div>

          <div className="product-ingredients-section">
            <h3>Ingredients</h3>
            <div className="ingredients-list">
              {productInfo.ingredients.map((ingredient, index) => (
                <span key={index} className="ingredient-badge">
                  {ingredient}
                </span>
              ))}
            </div>
          </div>

          <div className="product-sales-info">
            <h3>Sales Information</h3>
            <div className="sales-stats">
              <div className="stat-item">
                <strong>Units Sold:</strong> {productInfo.sales_data.units_sold}
              </div>
              <div className="stat-item">
                <strong>Last Month Revenue:</strong> {formatPrice(productInfo.sales_data.last_month_revenue)}
              </div>
            </div>
          </div>
        </div>

        {enhancedInfo && enhancedInfo.response && (
          <div className="enhanced-info-section">
            <h3>Enhanced Information</h3>
            <div className="rag-enhanced-content">
              <div className="enhanced-text">
                {enhancedInfo.response.split('\n').map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
              
              {enhancedInfo.sources && enhancedInfo.sources.length > 0 && (
                <div className="sources-info">
                  <h4>Information Sources:</h4>
                  <ul>
                    {enhancedInfo.sources.map((source, index) => (
                      <li key={index}>
                        {source.type === 'ingredient' ? `Ingredient: ${source.name}` : `Product ID: ${source.id}`}
                        <span className="relevance-score">
                          (Relevance: {Math.round(source.relevance * 100)}%)
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {similarProducts.length > 0 && (
          <div className="similar-products-section">
            <ProductList 
              products={similarProducts} 
              onProductSelect={() => {}}
              title="Similar Products"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
