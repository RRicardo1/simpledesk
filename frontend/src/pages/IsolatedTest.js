// Completely isolated component with no external dependencies
const IsolatedTest = () => {
  const renderTime = new Date().toISOString();
  console.log('🔬 IsolatedTest rendering at:', renderTime);

  // Inline styles to avoid any CSS issues
  const styles = {
    container: {
      padding: '32px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#ffffff',
      minHeight: '100vh'
    },
    header: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#333333',
      marginBottom: '20px',
      borderBottom: '2px solid #007acc',
      paddingBottom: '10px'
    },
    info: {
      backgroundColor: '#f8f9fa',
      border: '1px solid #e9ecef',
      padding: '16px',
      marginBottom: '20px',
      borderRadius: '4px'
    },
    button: {
      backgroundColor: '#007acc',
      color: 'white',
      border: 'none',
      padding: '12px 24px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '16px',
      marginRight: '10px',
      marginBottom: '10px'
    },
    counter: {
      fontSize: '18px',
      margin: '20px 0',
      padding: '10px',
      backgroundColor: '#e7f3ff',
      borderRadius: '4px'
    }
  };

  // Simple click handler
  const handleClick = () => {
    console.log('🔬 Button clicked at:', new Date().toISOString());
    alert('Button clicked successfully!');
  };

  // Test navigation without React Router
  const handleNavTest = () => {
    console.log('🔬 Testing manual navigation');
    window.location.hash = '#test-' + Date.now();
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>🔬 Isolated Component Test</h1>
      
      <div style={styles.info}>
        <p><strong>Purpose:</strong> Test if refresh occurs with zero external dependencies</p>
        <p><strong>Render Time:</strong> {renderTime}</p>
        <p><strong>Location:</strong> {window.location.href}</p>
        <p><strong>User Agent:</strong> {navigator.userAgent.slice(0, 80)}...</p>
      </div>

      <div style={styles.counter}>
        <p><strong>Page Load Count:</strong> {Math.floor(Date.now() / 1000) % 1000}</p>
      </div>

      <button style={styles.button} onClick={handleClick}>
        Test Click Handler
      </button>

      <button style={styles.button} onClick={handleNavTest}>
        Test Hash Navigation
      </button>

      <button style={styles.button} onClick={() => console.log('🔬 Console log test')}>
        Test Console Log
      </button>

      <div style={styles.info}>
        <h3>Instructions:</h3>
        <ol>
          <li>Keep this page open and watch the console</li>
          <li>Note if "🔬 IsolatedTest rendering" appears repeatedly</li>
          <li>Test the buttons to see if they work</li>
          <li>Check if render time changes without user interaction</li>
          <li>Monitor network tab for unexpected requests</li>
        </ol>
      </div>
    </div>
  );
};

export default IsolatedTest;