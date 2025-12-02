import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './ui/Layout';
import FocusPage from './features/nuggets/FocusPage';
import LibraryPage from './features/books/LibraryPage';
import AddBookPage from './features/books/AddBookPage';
import ProfilePage from './features/auth/ProfilePage';
import AuthPage from './features/auth/AuthPage';
import BookDetailsPage from './features/books/BookDetailsPage';
import SharedNuggetPage from './features/nuggets/SharedNuggetPage';

function ProtectedRoute({ children }) {
  const { user, session } = useAuth();
  const location = useLocation();

  if (!session && !user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
}

function App() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/share/:shareId" element={<SharedNuggetPage />} />

      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<FocusPage />} />
        <Route path="library" element={<LibraryPage />} />
        <Route path="library/:bookId" element={<BookDetailsPage />} />
        <Route path="add" element={<AddBookPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  );
}

export default App;
