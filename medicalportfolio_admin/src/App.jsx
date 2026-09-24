import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// Import Layout & Pages
import AdminDashboard from './admin/pages/AdminDashboard';
import AdminServices from './admin/pages/AdminServices';
import AdminDepartments from './admin/pages/AdminDepartments';
import AdminDoctors from './admin/pages/AdminDoctors';
import AdminLayout from './admin/components/AdminLayout';
import AdminAppointments from './admin/pages/AdminAppoinments';
import AdminHome from './admin/pages/AdminHome';
import Login from './admin/pages/Login';
function App() {
    return (
        <Router>
            <Routes>
                {/* Redirect root or unknown pages to login */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />

                {/* Admin Layout Wrapper with Nested Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="home" element={<AdminHome />} />
                    <Route path="services" element={<AdminServices />} />
                    <Route path="departments" element={<AdminDepartments />} />
                    <Route path="doctors" element={<AdminDoctors />} />
                    <Route path="appointments" element={<AdminAppointments />} />
                </Route>

                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    );
}

export default App;