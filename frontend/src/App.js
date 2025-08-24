import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TicketList from './pages/TicketList';
import TicketDetail from './pages/TicketDetail';
import NewTicket from './pages/NewTicket';
import UserManagement from './pages/UserManagement';
import KnowledgeBase from './pages/KnowledgeBase';
import KnowledgeBaseSimple from './pages/KnowledgeBaseSimple';
import Chat from './pages/Chat';
import ChatTest from './pages/ChatTest';
import ChatBasic from './pages/ChatBasic';
import ChatUltimate from './pages/ChatUltimate';
import ChatWithLayout from './pages/ChatWithLayout';
import DebugLogger from './pages/DebugLogger';
import IsolatedTest from './pages/IsolatedTest';
import AiTest from './pages/AiTest';
import Settings from './pages/Settings';
import Billing from './pages/Billing';
import Automation from './pages/Automation';
import CustomerPortal from './pages/CustomerPortal';
import Homepage from './pages/Homepage';
import About from './pages/About';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import SetupDemo from './pages/SetupDemo';
import SetupDemoSimple from './pages/SetupDemoSimple';
import Layout from './components/Layout';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0, // Don't retry by default
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false, // Don't refetch on window focus
      refetchOnReconnect: false, // Don't refetch on reconnect
      refetchInterval: false, // Disable background refetch
    },
  },
});

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  console.log('ProtectedRoute render:', { 
    hasUser: !!user, 
    loading, 
    timestamp: new Date().toISOString() 
  });
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  return user ? <Navigate to="/dashboard" /> : children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } 
      />
      <Route 
        path="/register" 
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } 
      />
      
      {/* Protected routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/tickets" 
        element={
          <ProtectedRoute>
            <Layout>
              <TicketList />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/tickets/new" 
        element={
          <ProtectedRoute>
            <Layout>
              <NewTicket />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/tickets/:ticketId" 
        element={
          <ProtectedRoute>
            <Layout>
              <TicketDetail />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/users" 
        element={
          <ProtectedRoute>
            <Layout>
              <UserManagement />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/knowledge-base" 
        element={
          <ProtectedRoute>
            <Layout>
              <KnowledgeBaseSimple />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/knowledge-base/new" 
        element={
          <ProtectedRoute>
            <Layout>
              <div className="p-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Create New Article</h1>
                <p className="text-gray-600">Article creation form would go here.</p>
                <button onClick={() => window.history.back()} className="mt-4 btn-secondary">
                  Back to Knowledge Base
                </button>
              </div>
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/knowledge-base/:id" 
        element={
          <ProtectedRoute>
            <Layout>
              <div className="p-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Article View</h1>
                <p className="text-gray-600">Article content would go here.</p>
                <button onClick={() => window.history.back()} className="mt-4 btn-secondary">
                  Back to Knowledge Base
                </button>
              </div>
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/knowledge-base/:id/edit" 
        element={
          <ProtectedRoute>
            <Layout>
              <div className="p-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Edit Article</h1>
                <p className="text-gray-600">Article editing form would go here.</p>
                <button onClick={() => window.history.back()} className="mt-4 btn-secondary">
                  Back to Knowledge Base
                </button>
              </div>
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/chat" 
        element={
          <ProtectedRoute>
            <Layout>
              <div style={{padding: '20px'}}>
                <h1>Chat Page Working</h1>
                <p>Time: {new Date().toLocaleString()}</p>
                <p>If you can see this without refreshing, navigation is working.</p>
              </div>
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route 
        path="/chat-layout" 
        element={<ChatWithLayout />}
      />
      <Route 
        path="/debug" 
        element={<DebugLogger />}
      />
      <Route 
        path="/ai-test" 
        element={<AiTest />}
      />
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute>
            <Layout>
              <Settings />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/billing" 
        element={
          <ProtectedRoute>
            <Layout>
              <Billing />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/automation" 
        element={
          <ProtectedRoute>
            <Layout>
              <Automation />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/customer-portal" 
        element={<CustomerPortal />}
      />
      <Route 
        path="/homepage" 
        element={<Homepage />}
      />
      
      {/* Public legal pages */}
      <Route path="/about" element={<About />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/demo" element={<SetupDemo />} />
      
      {/* Homepage for non-authenticated users */}
      <Route path="/" element={<Homepage />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="App">
            <AppRoutes />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;