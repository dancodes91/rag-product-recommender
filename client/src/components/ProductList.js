import React from 'react';
import './ProductList.css';

const ProductList = ({ products, onProductSelect, title = "Products" }) => {
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

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="product-list">
      <h3>{title}</h3>
      <div className="products-grid">
        {products.map((product) => (
          <div 
            key={product.id} 
            className="product-card"
            onClick={() => onProductSelect(product.id)}
          >
            <div className="product-header">
              <h4>{product.name}</h4>
              <div className="product-rating">
                {renderStars(product.rating)}
                <span className="rating-value">({product.rating})</span>
              </div>
            </div>

            <div className="product-info">
              <p className="product-description">{product.description}</p>
              
              <div className="product-meta">
                <span className="product-type">{product.type}</span>
                <span className="product-category">{product.category}</span>
              </div>

              <div className="product-effects">
                {product.effects.map((effect, index) => (
                  <span key={index} className="effect-badge">
                    {effect}
                  </span>
                ))}
              </div>

              <div className="product-ingredients">
                <strong>Ingredients:</strong> {product.ingredients.join(', ')}
              </div>
            </div>

            <div className="product-footer">
              <div className="product-price">
                {formatPrice(product.price)}
              </div>
              
              {product.recommendationScore && (
                <div className="recommendation-score">
                  Match: {Math.round(product.recommendationScore * 100)}%
                </div>
              )}

              {product.sales_data && (
                <div className="sales-info">
                  {product.sales_data.units_sold} sold
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
