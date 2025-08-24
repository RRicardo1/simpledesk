import React from 'react';
import { useNavigate } from 'react-router-dom';

const KnowledgeBaseSimple = () => {
  const navigate = useNavigate();
  
  console.log('🔍 KnowledgeBaseSimple rendering');

  const handleNewArticle = () => {
    console.log('🔍 New Article button clicked');
    alert('New Article clicked - would navigate to /knowledge-base/new');
    navigate('/knowledge-base/new');
  };

  const handleViewArticle = (id) => {
    console.log('🔍 View Article button clicked for ID:', id);
    alert(`View Article clicked - would navigate to /knowledge-base/${id}`);
    navigate(`/knowledge-base/${id}`);
  };

  const handleEditArticle = (id) => {
    console.log('🔍 Edit Article button clicked for ID:', id);
    alert(`Edit Article clicked - would navigate to /knowledge-base/${id}/edit`);
    navigate(`/knowledge-base/${id}/edit`);
  };

  const mockArticles = [
    { id: 1, title: 'Getting Started Guide', category: 'Getting Started' },
    { id: 2, title: 'FAQ', category: 'Support' },
    { id: 3, title: 'Troubleshooting', category: 'Help' }
  ];

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', marginBottom: '10px' }}>Knowledge Base - Simple Test</h1>
        <button 
          onClick={handleNewArticle}
          style={{
            backgroundColor: '#007acc',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          ➕ New Article
        </button>
      </div>

      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h2 style={{ marginBottom: '15px' }}>Test Articles</h2>
        
        {mockArticles.map(article => (
          <div key={article.id} style={{ 
            padding: '15px', 
            borderBottom: '1px solid #eee',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h3 style={{ margin: '0 0 5px 0', fontSize: '18px' }}>{article.title}</h3>
              <span style={{ 
                backgroundColor: '#e7f3ff', 
                padding: '2px 8px', 
                borderRadius: '12px', 
                fontSize: '12px',
                color: '#007acc'
              }}>
                {article.category}
              </span>
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => handleViewArticle(article.id)}
                style={{
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                👁️ View
              </button>
              
              <button 
                onClick={() => handleEditArticle(article.id)}
                style={{
                  backgroundColor: '#ffc107',
                  color: 'black',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                ✏️ Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '4px',
        fontSize: '14px'
      }}>
        <h3>Test Instructions:</h3>
        <ol>
          <li>Click the "New Article" button above</li>
          <li>Click the "View" or "Edit" buttons for each article</li>
          <li>Check if alerts appear and navigation works</li>
          <li>Look for console logs in browser dev tools</li>
        </ol>
      </div>
    </div>
  );
};

export default KnowledgeBaseSimple;