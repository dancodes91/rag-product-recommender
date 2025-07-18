import React, { useState } from 'react';
import './RAGInfo.css';

const RAGInfo = ({ ragInfo }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!ragInfo || !ragInfo.response) {
    return null;
  }

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="rag-info">
      <div className="rag-header" onClick={toggleExpanded}>
        <h3>Knowledge Base Information</h3>
        <button className="toggle-button">
          {isExpanded ? '▼' : '▶'}
        </button>
      </div>
      
      {isExpanded && (
        <div className="rag-content">
          <div className="rag-response">
            {ragInfo.response.split('\n').map((line, index) => {
              if (line.trim() === '') return null;
              
              // Check if line starts with bullet point or is a header
              if (line.startsWith('•')) {
                return (
                  <div key={index} className="rag-bullet-point">
                    {line}
                  </div>
                );
              } else if (line.includes(':') && !line.startsWith(' ')) {
                return (
                  <div key={index} className="rag-section-header">
                    {line}
                  </div>
                );
              } else {
                return (
                  <p key={index} className="rag-text">
                    {line}
                  </p>
                );
              }
            })}
          </div>

          {ragInfo.sources && ragInfo.sources.length > 0 && (
            <div className="rag-sources">
              <h4>Information Sources</h4>
              <div className="sources-grid">
                {ragInfo.sources.map((source, index) => (
                  <div key={index} className="source-item">
                    <div className="source-type">
                      {source.type === 'ingredient' ? 'Ingredient' : 'Product'}
                    </div>
                    <div className="source-name">
                      {source.name || `ID: ${source.id}`}
                    </div>
                    <div className="source-relevance">
                      <div className="relevance-bar">
                        <div 
                          className="relevance-fill" 
                          style={{ width: `${Math.round(source.relevance * 100)}%` }}
                        ></div>
                      </div>
                      <span className="relevance-text">
                        {Math.round(source.relevance * 100)}% relevant
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default RAGInfo;
