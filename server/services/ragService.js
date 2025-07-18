const fs = require('fs');
const path = require('path');

class RAGService {
  constructor() {
    this.products = this.loadData('products.json');
    this.ingredients = this.loadData('ingredients.json');
    this.sales = this.loadData('sales.json');
    this.knowledgeBase = this.buildKnowledgeBase();
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

  buildKnowledgeBase() {
    const kb = [];
    
    this.products.forEach(product => {
      kb.push({
        type: 'product',
        id: product.id,
        content: `${product.name} is a ${product.type} in the ${product.category} category. ${product.description} It contains ${product.ingredients.join(', ')} and provides effects like ${product.effects.join(', ')}. Price: $${product.price}. Rating: ${product.rating}/5.`,
        metadata: {
          productId: product.id,
          category: product.category,
          effects: product.effects,
          ingredients: product.ingredients,
          price: product.price,
          rating: product.rating
        }
      });
    });

    this.ingredients.forEach(ingredient => {
      kb.push({
        type: 'ingredient',
        content: `${ingredient.name}: ${ingredient.properties}. Common effects include ${ingredient.common_effects.join(', ')}. Scientific info: ${ingredient.scientific_info}`,
        metadata: {
          name: ingredient.name,
          effects: ingredient.common_effects,
          properties: ingredient.properties
        }
      });
    });

    return kb;
  }

  calculateSimilarity(text1, text2) {
    const words1 = text1.toLowerCase().split(/\W+/).filter(word => word.length > 2);
    const words2 = text2.toLowerCase().split(/\W+/).filter(word => word.length > 2);
    
    if (words1.length === 0 || words2.length === 0) return 0;
    
    let matchScore = 0;
    const totalWords = Math.max(words1.length, words2.length);
    
    const keywordGroups = {
      'stress': ['stress', 'stressed', 'tension', 'anxiety', 'pressure'],
      'relax': ['relax', 'relaxation', 'calm', 'calming', 'soothing', 'peaceful'],
      'sleep': ['sleep', 'sleeping', 'insomnia', 'rest', 'bedtime'],
      'energy': ['energy', 'energize', 'boost', 'alert', 'wake'],
      'focus': ['focus', 'concentration', 'mental', 'clarity', 'cognitive'],
      'immune': ['immune', 'immunity', 'health', 'wellness']
    };
    
    const exactMatches = words1.filter(word => words2.includes(word));
    matchScore += exactMatches.length / totalWords;
    
    for (const [mainKeyword, synonyms] of Object.entries(keywordGroups)) {
      const query1HasKeyword = words1.some(word => synonyms.includes(word));
      const query2HasKeyword = words2.some(word => synonyms.includes(word));
      
      if (query1HasKeyword && query2HasKeyword) {
        matchScore += 0.3;
      }
    }
    
    return Math.min(matchScore, 1.0);
  }

  retrieve(query, topK = 5) {
    const queryLower = query.toLowerCase();
    
    const scored = this.knowledgeBase.map(entry => ({
      ...entry,
      score: this.calculateSimilarity(queryLower, entry.content.toLowerCase())
    }));

    const topResults = scored
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
    
    console.log(`RAG Query: "${query}"`);
    console.log('Top 3 results:', topResults.slice(0, 3).map(r => ({ 
      type: r.type, 
      score: r.score, 
      content: r.content.substring(0, 100) + '...' 
    })));
    
    return topResults.filter(entry => entry.score > 0.01);
  }

  generateAugmentedResponse(query, retrievedDocs) {
    if (retrievedDocs.length === 0) {
      return {
        response: "I don't have specific information about that query.",
        sources: []
      };
    }

    let response = "";
    const sources = [];

    const productDocs = retrievedDocs.filter(doc => doc.type === 'product');
    const ingredientDocs = retrievedDocs.filter(doc => doc.type === 'ingredient');

    if (productDocs.length > 0) {
      response += "Based on our product catalog:\n";
      productDocs.forEach(doc => {
        response += `• ${doc.content}\n`;
        sources.push({
          type: doc.type,
          id: doc.metadata.productId || doc.metadata.name,
          relevance: doc.score
        });
      });
    }

    if (ingredientDocs.length > 0) {
      response += "\nIngredient information:\n";
      ingredientDocs.forEach(doc => {
        response += `• ${doc.content}\n`;
        sources.push({
          type: doc.type,
          name: doc.metadata.name,
          relevance: doc.score
        });
      });
    }

    return {
      response: response.trim(),
      sources: sources
    };
  }

  query(userQuery) {
    const retrievedDocs = this.retrieve(userQuery);
    return this.generateAugmentedResponse(userQuery, retrievedDocs);
  }

  getEnhancedProductInfo(productId) {
    const product = this.products.find(p => p.id === productId);
    if (!product) {
      return null;
    }

    const query = `${product.ingredients.join(' ')} ${product.effects.join(' ')} ${product.category}`;
    const retrievedDocs = this.retrieve(query);
    
    const relevantDocs = retrievedDocs.filter(doc => 
      doc.type === 'ingredient' || (doc.type === 'product' && doc.metadata.productId !== productId)
    );

    const augmentedInfo = this.generateAugmentedResponse(query, relevantDocs);

    return {
      product: product,
      enhancedInfo: augmentedInfo,
      relatedProducts: relevantDocs
        .filter(doc => doc.type === 'product')
        .map(doc => doc.metadata.productId)
        .slice(0, 3)
    };
  }
}

module.exports = RAGService;
