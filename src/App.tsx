import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor';
import InviteView from './pages/InviteView';
import CustomInviteView from './pages/CustomInviteView';
import AdminPanel from './pages/AdminPanel';
import { MetaPixel } from './components/MetaPixel';

export default function App() {
  return (
    <Router>
      <MetaPixel />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/editor/:templateId" element={<Editor />} />
        <Route path="/invite" element={<InviteView />} />
        <Route path="/c/:customPath" element={<CustomInviteView />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}
