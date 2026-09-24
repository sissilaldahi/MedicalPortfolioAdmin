import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';

function AdminLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const [pendingCount, setPendingCount] = useState(0);
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        // Simple security check: redirect to login if not authenticated
        if (localStorage.getItem('isAdminLoggedIn') !== 'true') {
            navigate('/login');
            return;
        }

        fetchPendingCount();
        const interval = setInterval(fetchPendingCount, 10000);
        return () => clearInterval(interval);
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('isAdminLoggedIn');
        navigate('/login');
    };

    const fetchPendingCount = () => {
        fetch('http://localhost/medilab_api/dashboard.php')
            .then((res) => res.json())
            .then((data) => {
                if (data.counts && data.counts.pending_appointments !== undefined) {
                    setPendingCount(data.counts.pending_appointments);
                }
            })
            .catch((err) => console.error('Error fetching badge count:', err));
    };

    const isActive = (path) =>
        location.pathname === path || (path === '/admin/dashboard' && location.pathname === '/admin');

    return (
        <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
            {/* Sidebar */}
            <div
                className="d-flex flex-column p-3 text-white shadow transition-all"
                style={{
                    width: isCollapsed ? '80px' : '250px',
                    minWidth: isCollapsed ? '80px' : '250px',
                    backgroundColor: '#0f172a',
                    transition: 'width 0.3s ease'
                }}
            >
                {/* Brand Header & Toggle Button */}
                <div className="d-flex align-items-center justify-content-between px-2 mb-3 mt-1">
                    {!isCollapsed ? (
                        <div className="d-flex align-items-center gap-2">
                            <div className="bg-primary rounded-3 d-flex align-items-center justify-content-center text-white fw-bold" style={{ width: '32px', height: '32px' }}>
                                M
                            </div>
                            <span className="fw-bold fs-5">Medilab</span>
                        </div>
                    ) : (
                        <div className="mx-auto bg-primary rounded-3 d-flex align-items-center justify-content-center text-white fw-bold" style={{ width: '32px', height: '32px' }}>
                            M
                        </div>
                    )}

                    {!isCollapsed && (
                        <button
                            className="btn btn-sm btn-outline-light border-secondary text-white px-2 py-1 rounded-2"
                            onClick={() => setIsCollapsed(true)}
                            title="Collapse Sidebar"
                            style={{ fontSize: '0.8rem' }}
                        >
                            <i className="fa-solid fa-angles-left"></i>
                        </button>
                    )}
                </div>

                {isCollapsed && (
                    <div className="text-center mb-3">
                        <button
                            className="btn btn-sm btn-outline-light border-secondary text-white p-2 rounded-2 mx-auto"
                            onClick={() => setIsCollapsed(false)}
                            title="Expand Sidebar"
                        >
                            <i className="fa-solid fa-angles-right"></i>
                        </button>
                    </div>
                )}

                <hr className="border-secondary opacity-25 mb-3" />

                {/* Navigation Links */}
                <ul className="nav nav-pills flex-column mb-auto gap-1">
                    {!isCollapsed && <div className="text-uppercase text-secondary fw-bold px-2 mb-1" style={{ fontSize: '0.65rem' }}>Main</div>}
                    <li className="nav-item">
                        <Link
                            to="/admin/dashboard"
                            className={`nav-link rounded-3 py-2 px-3 d-flex align-items-center ${isActive('/admin/dashboard') ? 'bg-primary text-white fw-semibold shadow-sm' : 'text-white-50'}`}
                            title="Dashboard"
                        >
                            <i className="fa-solid fa-chart-line fs-5" style={{ minWidth: '24px' }}></i>
                            {!isCollapsed && <span className="ms-2">Dashboard</span>}
                        </Link>
                    </li>

                    {!isCollapsed && <div className="text-uppercase text-secondary fw-bold px-2 mt-3 mb-1" style={{ fontSize: '0.65rem' }}>Website</div>}
                    {[
                        { path: '/admin/home', label: 'Home', icon: 'fa-house' },
                        { path: '/admin/services', label: 'Services', icon: 'fa-file-medical' },
                        { path: '/admin/departments', label: 'Departments', icon: 'fa-hospital-user' },
                        { path: '/admin/doctors', label: 'Doctors', icon: 'fa-user-doctor' },
                    ].map((item) => (
                        <li className="nav-item" key={item.path}>
                            <Link
                                to={item.path}
                                className={`nav-link rounded-3 py-2 px-3 d-flex align-items-center ${isActive(item.path) ? 'bg-primary text-white fw-semibold shadow-sm' : 'text-white-50'}`}
                                title={item.label}
                            >
                                <i className={`fa-solid ${item.icon} fs-5`} style={{ minWidth: '24px' }}></i>
                                {!isCollapsed && <span className="ms-2">{item.label}</span>}
                            </Link>
                        </li>
                    ))}

                    {!isCollapsed && <div className="text-uppercase text-secondary fw-bold px-2 mt-3 mb-1" style={{ fontSize: '0.65rem' }}>Management</div>}
                    <li className="nav-item">
                        <Link
                            to="/admin/appointments"
                            className={`nav-link rounded-3 py-2 px-3 d-flex align-items-center justify-content-between ${isActive('/admin/appointments') ? 'bg-primary text-white fw-semibold shadow-sm' : 'text-white-50'}`}
                            title="Appointments"
                        >
                            <div className="d-flex align-items-center text-truncate">
                                <i className="fa-solid fa-calendar-check fs-5" style={{ minWidth: '24px' }}></i>
                                {!isCollapsed && <span className="ms-2">Appointments</span>}
                            </div>
                            {!isCollapsed && pendingCount > 0 && (
                                <span className="badge bg-danger rounded-pill px-2 py-0.5" style={{ fontSize: '0.7rem' }}>
                                    {pendingCount}
                                </span>
                            )}
                        </Link>
                    </li>
                </ul>

                <hr className="border-secondary opacity-25 my-3" />

                {/* Bottom Profile & Working Logout Button */}
                <div className="p-2 rounded-3 bg-dark bg-opacity-50">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                        <div className="d-flex align-items-center gap-2 overflow-hidden">
                            <div className="bg-secondary rounded-circle d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0" style={{ width: '32px', height: '32px', fontSize: '0.8rem' }}>
                                AD
                            </div>
                            {!isCollapsed && (
                                <div className="text-truncate">
                                    <div className="fw-semibold text-white small">Admin User</div>
                                </div>
                            )}
                        </div>
                    </div>
                    <button
                        className="btn btn-outline-danger btn-sm w-100 text-danger border-danger rounded-3 py-1 d-flex align-items-center justify-content-center gap-2"
                        onClick={handleLogout}
                        title="Logout"
                    >
                        <i className="fa-solid fa-right-from-bracket"></i>
                        {!isCollapsed && <span className="small fw-semibold">Logout</span>}
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-grow-1 overflow-auto">
                <nav className="navbar navbar-expand navbar-light bg-white px-4 shadow-sm mb-0">
                    <span className="navbar-brand mb-0 h1 text-secondary fw-semibold fs-5">Admin Panel</span>
                    <div className="ms-auto">
                        <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 fw-semibold rounded-pill">Administrator</span>
                    </div>
                </nav>

                <Outlet />
            </div>
        </div>
    );
}

export default AdminLayout;