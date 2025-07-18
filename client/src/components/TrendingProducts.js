import React from 'react';
import './TrendingProducts.css';

const TrendingProducts = ({ products, onProductSelect }) => {
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
    <div className="trending-products">
      <div className="trending-header">
        <h2>Trending Products</h2>
      </div>

      <div className="trending-grid">
        {products.map((product, index) => (
          <div 
            key={product.id} 
            className="trending-card"
            onClick={() => onProductSelect(product.id)}
          >
            <div className="trending-rank">
              #{index + 1}
            </div>

            <div className="trending-content">
              <div className="trending-header-info">
                <h4>{product.name}</h4>
                <div className="trending-rating">
                  {renderStars(product.rating)}
                  <span className="rating-value">({product.rating})</span>
                </div>
              </div>

              <p className="trending-description">{product.description}</p>

              <div className="trending-effects">
                {product.effects.slice(0, 3).map((effect, idx) => (
                  <span key={idx} className="trending-effect-badge">
                    {effect}
                  </span>
                ))}
                {product.effects.length > 3 && (
                  <span className="more-effects">
                    +{product.effects.length - 3} more
                  </span>
                )}
              </div>

              <div className="trending-footer">
                <div className="trending-price">
                  {formatPrice(product.price)}
                </div>
                
                <div className="trending-stats">
                  {product.recentSales && (
                    <span className="recent-sales">
                      {product.recentSales} sold recently
                    </span>
                  )}
                  {product.sales_data && (
                    <span className="total-sales">
                      {product.sales_data.units_sold} total sales
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingProducts;
