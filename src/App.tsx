import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor';
import InviteView from './pages/InviteView';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/editor/:templateId" element={<Editor />} />
        <Route path="/invite" element={<InviteView />} />
      </Routes>
    </Router>
  );
}
