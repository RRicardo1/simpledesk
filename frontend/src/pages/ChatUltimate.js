// Absolutely minimal React component - no JSX, no external dependencies
function ChatUltimate() {
  console.log('ChatUltimate rendering at:', new Date().toISOString());
  
  return {
    $$typeof: Symbol.for('react.element'),
    type: 'div',
    key: null,
    ref: null,
    props: {
      style: { padding: '32px', fontFamily: 'Arial, sans-serif' },
      children: [
        {
          $$typeof: Symbol.for('react.element'),
          type: 'h1',
          key: 'h1',
          ref: null,
          props: {
            style: { fontSize: '24px', marginBottom: '16px' },
            children: 'ULTIMATE MINIMAL CHAT TEST'
          }
        },
        {
          $$typeof: Symbol.for('react.element'),
          type: 'p',
          key: 'p1',
          ref: null,
          props: {
            children: 'If this refreshes, the issue is at the browser or server level.'
          }
        },
        {
          $$typeof: Symbol.for('react.element'),
          type: 'p',
          key: 'p2',
          ref: null,
          props: {
            children: `Page loaded at: ${new Date().toLocaleString()}`
          }
        }
      ]
    }
  };
}

export default ChatUltimate;