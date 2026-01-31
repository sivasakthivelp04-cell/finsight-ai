
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UploadPage from './pages/Upload';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    const companyId = localStorage.getItem('company_id');

    if (!token || !companyId) {
        return <Navigate to="/" replace />;
    }

    return children;
};

function App() {
    React.useEffect(() => {
        // Track refreshes: When the app script loads (refresh/initial entry),
        // set a flag that the dashboard should be cleared once.
        sessionStorage.setItem('needs_dashboard_clear', 'true');
        console.log("App session started: Refresh flag set.");
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />

                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/upload" element={<ProtectedRoute><UploadPage /></ProtectedRoute>} />
                <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
