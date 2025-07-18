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

  getCollaborativeRecommendations(productId, limit = 3) {
    const targetProduct = this.products.find(p => p.id === productId);
    if (!targetProduct) return [];
    
    const similarities = this.products
      .filter(p => p.id !== productId)
      .map(product => ({
        ...product,
        similarity: this.calculateProductSimilarity(targetProduct, product)
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);
    
    return similarities;
  }

  getHybridRecommendations(userPreferences, limit = 5) {
    const contentBased = this.getContentBasedRecommendations(userPreferences, limit * 2);
    
    let collaborativeProducts = [];
    if (userPreferences.likedProducts && userPreferences.likedProducts.length > 0) {
      userPreferences.likedProducts.forEach(productId => {
        const collab = this.getCollaborativeRecommendations(productId, 2);
        collaborativeProducts = [...collaborativeProducts, ...collab];
      });
    }
    
    const allRecommendations = [...contentBased];
    
    collaborativeProducts.forEach(collabProduct => {
      const exists = allRecommendations.find(p => p.id === collabProduct.id);
      if (!exists) {
        allRecommendations.push({
          ...collabProduct,
          recommendationScore: collabProduct.similarity * 0.8
        });
      } else {
        exists.recommendationScore += collabProduct.similarity * 0.2;
      }
    });
    
    return allRecommendations
      .sort((a, b) => b.recommendationScore - a.recommendationScore)
      .slice(0, limit);
  }

  getTrendingProducts(limit = 5) {
    const productSales = this.sales.map(salesData => {
      const product = this.products.find(p => p.id === salesData.product_id);
      const recentSales = salesData.daily_sales.slice(-3);
      const totalRecentSales = recentSales.reduce((sum, day) => sum + day.units_sold, 0);
      
      return {
        ...product,
        recentSales: totalRecentSales,
        trendScore: totalRecentSales * product.rating
      };
    });
    
    return productSales
      .sort((a, b) => b.trendScore - a.trendScore)
      .slice(0, limit);
  }

  getPersonalizedRecommendations(userQuery, userPreferences = {}) {
    const queryLower = userQuery.toLowerCase();
    const extractedPreferences = this.extractPreferencesFromQuery(queryLower);
    
    const combinedPreferences = {
      ...extractedPreferences,
      ...userPreferences
    };
    
    return this.getHybridRecommendations(combinedPreferences);
  }

  extractPreferencesFromQuery(query) {
    const preferences = {
      effects: [],
      category: null,
      type: null,
      priceRange: null
    };
    
    const effectKeywords = {
      'relaxation': ['relax', 'calm', 'stress', 'anxiety', 'peaceful'],
      'energy boost': ['energy', 'boost', 'energize', 'wake up', 'alert'],
      'improved sleep': ['sleep', 'insomnia', 'rest', 'bedtime'],
      'focus enhancement': ['focus', 'concentration', 'mental clarity', 'cognitive'],
      'immune support': ['immune', 'immunity', 'health', 'wellness'],
      'stress relief': ['stress', 'tension', 'pressure', 'overwhelmed']
    };
    
    Object.entries(effectKeywords).forEach(([effect, keywords]) => {
      if (keywords.some(keyword => query.includes(keyword))) {
        preferences.effects.push(effect);
      }
    });
    
    if (query.includes('wellness') || query.includes('health')) {
      preferences.category = 'wellness';
    } else if (query.includes('energy') || query.includes('performance')) {
      preferences.category = 'energy';
    } else if (query.includes('nutrition') || query.includes('food')) {
      preferences.category = 'nutrition';
    }
    
    if (query.includes('tea') || query.includes('drink') || query.includes('beverage')) {
      preferences.type = 'beverage';
    } else if (query.includes('supplement') || query.includes('capsule') || query.includes('pill')) {
      preferences.type = 'supplement';
    } else if (query.includes('food') || query.includes('smoothie') || query.includes('mix')) {
      preferences.type = 'food';
    }
    
    if (query.includes('cheap') || query.includes('budget') || query.includes('affordable')) {
      preferences.priceRange = { min: 0, max: 20 };
    } else if (query.includes('premium') || query.includes('expensive') || query.includes('high quality')) {
      preferences.priceRange = { min: 20, max: 100 };
    }
    
    return preferences;
  }
}

module.exports = RecommendationService;
