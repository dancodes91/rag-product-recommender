const fs = require('fs');
const path = require('path');

class RecommendationService {
  constructor() {
    this.products = this.loadData('products.json');
    this.sales = this.loadData('sales.json');
  }

  loadData(filename) {
    try {
      const filePath = path.join(__dirname, '../data', filename);
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error loading ${filename}:`, error);
      return [];
    }
  }

  calculateProductSimilarity(product1, product2) {
    let similarity = 0;
    
    if (product1.category === product2.category) {
      similarity += 0.4;
    }
    
    const commonEffects = product1.effects.filter(effect => 
      product2.effects.includes(effect)
    );
    const totalEffects = [...new Set([...product1.effects, ...product2.effects])];
    similarity += (commonEffects.length / totalEffects.length) * 0.3;
    
    const commonIngredients = product1.ingredients.filter(ingredient => 
      product2.ingredients.includes(ingredient)
    );
    const totalIngredients = [...new Set([...product1.ingredients, ...product2.ingredients])];
    similarity += (commonIngredients.length / totalIngredients.length) * 0.2;
    
    const priceDiff = Math.abs(product1.price - product2.price);
    const maxPrice = Math.max(product1.price, product2.price);
    const priceSimiliarity = 1 - (priceDiff / maxPrice);
    similarity += priceSimiliarity * 0.1;
    
    return similarity;
  }

  getPopularityScore(productId) {
    const salesData = this.sales.find(s => s.product_id === productId);
    if (!salesData) return 0;
    
    const totalSales = salesData.daily_sales.reduce((sum, day) => sum + day.units_sold, 0);
    return totalSales;
  }

  getContentBasedRecommendations(userPreferences, limit = 5) {
    const { effects, category, priceRange, type } = userPreferences;
    
    let scoredProducts = this.products.map(product => {
      let score = 0;
      
      if (effects && effects.length > 0) {
        const matchingEffects = product.effects.filter(effect => 
          effects.includes(effect)
        );
        score += (matchingEffects.length / Math.max(effects.length, product.effects.length)) * 0.5;
        
        if (matchingEffects.length > 0) {
          score += 0.2;
        }
      }
      
      if (category && product.category === category) {
        score += 0.15;
      }
      
      if (type && product.type === type) {
        score += 0.1;
      }
      
      if (priceRange) {
        const { min, max } = priceRange;
        if (product.price >= min && product.price <= max) {
          score += 0.05;
        }
      }
      
      const popularityScore = this.getPopularityScore(product.id);
      const maxPopularity = Math.max(...this.sales.map(s => 
        s.daily_sales.reduce((sum, day) => sum + day.units_sold, 0)
      ));
      score += (popularityScore / maxPopularity) * 0.05;
      
      return {
        ...product,
        recommendationScore: score
      };
    });
    
    return scoredProducts
      .sort((a, b) => b.recommendationScore - a.recommendationScore)
      .slice(0, limit);
  }

}

module.exports = RecommendationService;
