import { Routes, Route } from 'react-router-dom';
import Layout from './ui/Layout';
import FocusPage from './features/nuggets/FocusPage';
import LibraryPage from './features/books/LibraryPage';
import AddBookPage from './features/books/AddBookPage';
import ProfilePage from './features/auth/ProfilePage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<FocusPage />} />
        <Route path="library" element={<LibraryPage />} />
        <Route path="add" element={<AddBookPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  );
}

export default App;
