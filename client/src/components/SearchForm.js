import React, { useState } from 'react';
import './SearchForm.css';

const SearchForm = ({ onSearch, loading }) => {
  const [query, setQuery] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [preferences, setPreferences] = useState({
    category: '',
    type: '',
    priceRange: { min: '', max: '' },
    effects: []
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      const cleanPreferences = {
        ...preferences,
        priceRange: preferences.priceRange.min || preferences.priceRange.max ? {
          min: parseFloat(preferences.priceRange.min) || 0,
          max: parseFloat(preferences.priceRange.max) || 1000
        } : null
      };
      onSearch(query.trim(), cleanPreferences);
    }
  };

  const handleEffectToggle = (effect) => {
    setPreferences(prev => ({
      ...prev,
      effects: prev.effects.includes(effect)
        ? prev.effects.filter(e => e !== effect)
        : [...prev.effects, effect]
    }));
  };

  const availableEffects = [
    'relaxation',
    'energy boost',
    'improved sleep',
    'focus enhancement',
    'immune support',
    'stress relief',
    'mental clarity',
    'antioxidant boost'
  ];

  const categories = ['wellness', 'energy', 'nutrition'];
  const types = ['beverage', 'supplement', 'food'];

  return (
    <div className="search-form">
      <form onSubmit={handleSubmit}>
        <div className="search-input-group">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for products..."
            className="search-input"
            disabled={loading}
          />
          <button 
            type="submit" 
            className="search-button"
            disabled={loading || !query.trim()}
          >
            {loading ? 'Searching...' : 'Get Recommendations'}
          </button>
        </div>

        <button
          type="button"
          className="advanced-toggle"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          {showAdvanced ? 'Hide' : 'Show'} Advanced Filters
        </button>

        {showAdvanced && (
          <div className="advanced-filters">
            <div className="filter-group">
              <label>Category:</label>
              <select
                value={preferences.category}
                onChange={(e) => setPreferences(prev => ({ ...prev, category: e.target.value }))}
              >
                <option value="">Any Category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Type:</label>
              <select
                value={preferences.type}
                onChange={(e) => setPreferences(prev => ({ ...prev, type: e.target.value }))}
              >
                <option value="">Any Type</option>
                {types.map(type => (
                  <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Price Range:</label>
              <div className="price-range">
                <input
                  type="number"
                  placeholder="Min"
                  value={preferences.priceRange.min}
                  onChange={(e) => setPreferences(prev => ({
                    ...prev,
                    priceRange: { ...prev.priceRange, min: e.target.value }
                  }))}
                />
                <span>to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={preferences.priceRange.max}
                  onChange={(e) => setPreferences(prev => ({
                    ...prev,
                    priceRange: { ...prev.priceRange, max: e.target.value }
                  }))}
                />
              </div>
            </div>

            <div className="filter-group">
              <label>Desired Effects:</label>
              <div className="effects-grid">
                {availableEffects.map(effect => (
                  <button
                    key={effect}
                    type="button"
                    className={`effect-tag ${preferences.effects.includes(effect) ? 'selected' : ''}`}
                    onClick={() => handleEffectToggle(effect)}
                  >
                    {effect}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </form>

    </div>
  );
};

export default SearchForm;
