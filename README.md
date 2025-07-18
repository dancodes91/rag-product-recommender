# Product Recommendation System with RAG

Built this for the BakedBot.ai take-home challenge. It's a product recommendation system that uses RAG (Retrieval-Augmented Generation) to give better product suggestions.

## How to Run

### What you need
- Node.js (14+)
- npm

### Setup
1. Install stuff:
   ```bash
   npm install
   ```

2. Start backend:
   ```bash
   npm start
   ```
   Should run on `http://localhost:5000`

3. Open new terminal, setup frontend:
   ```bash
   cd client
   npm install
   npm start
   ```
   Opens at `http://localhost:3000`

### Try it out
- Search for stuff like "I'm stressed" or "need energy"
- Use the filters if you want
- Click products to see more details
- Check trending section

## What I simplified

### Data stuff
- Used JSON files instead of real database - easier for demo
- Only 5 products, all health/wellness related
- Made up the sales data but tried to make it realistic

### Technical shortcuts
- Basic keyword matching instead of fancy NLP
- Everything runs in memory, no Redis or anything
- No user login - just focused on recommendations
- Used basic React state, didn't need Redux for this

### Algorithm shortcuts  
- Simple word matching instead of embeddings
- Fake collaborative filtering since no real user data
- RAG knowledge base is static, built once at startup

## How the recommendation works

### Content-based filtering
This is the main one. Looks at what the user wants and matches it to products:

- Effect matching gets highest score (0.5) - if user says "stress" and product helps with "stress relief"
- Category/type matching gets some points too
- Price range if they specify it
- Popular products get tiny boost but not much

### Collaborative filtering
Tried to do "people who liked X also liked Y" but since no real users, just compares products:
- Products with similar effects/ingredients get grouped
- Uses this for "similar products" suggestions
- Pretty basic implementation

### Hybrid approach
Just combines both methods. Content-based does most work, collaborative adds some variety.

### NLP part
Really simple:
- Maps words like "stress" -> "stress relief", "sleep" -> "improved sleep"  
- Tries to guess category from keywords
- Looks for price hints like "budget" or "premium"

## RAG implementation

### Knowledge base
Built from 3 things:
1. Product info (name, description, effects, ingredients)
2. Ingredient details (what they do, properties)
3. Sales data (for trending)

### How retrieval works
When user asks something:
1. Compare their query to knowledge base using word overlap
2. Group similar terms (stress/anxiety, relax/calm)
3. Score everything by relevance
4. Filter out low scores

### Response generation
Takes the relevant info and tries to make coherent response:
- Combines product and ingredient info
- Shows sources so you know where info came from
- Adds context about why products were suggested

### Integration with recommendations
RAG helps by:
- Explaining why products were recommended
- Giving background on ingredients
- Finding related products
- Making recommendations feel more trustworthy

## What could be better

### Quick fixes
1. Real database instead of JSON files
2. Proper NLP library like spaCy
3. Vector embeddings for better matching
4. Add caching with Redis
5. Better error handling everywhere

### Algorithm improvements
1. Real user data for collaborative filtering
2. Actual ML models instead of simple scoring
3. A/B testing to see what works
4. User profiles and history
5. Learn from user feedback

### RAG improvements
1. Connect to external APIs for more product info
2. Use real LLM like GPT for better responses
3. Include product images and reviews
4. Update knowledge base automatically
5. Better retrieval methods

### User experience
1. User accounts and login
2. Better explanations of recommendations
3. Let users rate suggestions
4. Mobile app version
5. Maybe voice search

### Production stuff
1. Write tests (I know, I know...)
2. Add monitoring and analytics
3. Security stuff like rate limiting
4. Make it scale horizontally
5. CI/CD pipeline

### Business features
1. Real inventory tracking
2. Shopping cart and payments
3. User reviews system
4. Track which recommendations work
5. Support multiple stores

## Technical notes

Kept it simple on purpose - wanted to show the concepts work before making it complex. The way it's structured makes it pretty easy to swap out parts later (like replacing JSON with real database).

RAG is pretty basic but shows the idea. In production you'd probably want vector database like Pinecone and better retrieval methods.

Recommendation algorithms are simplified but follow standard patterns. Could definitely improve with more sophisticated ML once you have real user data.

The scoring weights (like 0.5 for effect matching) were just trial and error until it felt right. Would need proper evaluation metrics in real system.
