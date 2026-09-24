import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function AdminSidebar() {
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    const isActive = (path) =>
        location.pathname === path
            ? 'active text-primary fw-semibold'
            : 'text-white-50';

    return (
        <div
            className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark shadow-sm transition-all"
            style={{
                width: isCollapsed ? '80px' : '260px',
                minHeight: '100vh',
                transition: 'width 0.3s ease'
            }}
        >
            {/* Header with Brand & 3-Dot Toggle Menu */}
            <div className="d-flex align-items-center justify-content-between mb-2 px-1">
                {!isCollapsed && (
                    <div>
                        <a href="/admin" className="text-white text-decoration-none fs-4 fw-bold">
                            Medilab
                        </a>
                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>Admin Panel</div>
                    </div>
                )}

                {/* 3-Dots Dropdown Trigger */}
                <div className="position-relative ms-auto">
                    <button
                        className="btn btn-sm btn-dark text-white-50 rounded-circle border-0 p-2 hover-light"
                        onClick={() => setShowDropdown(!showDropdown)}
                        title="Options"
                    >
                        <i className="fa-solid fa-ellipsis-vertical fs-5"></i>
                    </button>

                    {showDropdown && (
                        <div className="dropdown-menu show position-absolute end-0 mt-1 shadow border-0 rounded-3 py-1 bg-dark border-secondary">
                            <button
                                className="dropdown-item text-white small py-2 px-3 bg-transparent hover-dropdown"
                                onClick={() => { setIsCollapsed(!isCollapsed); setShowDropdown(false); }}
                            >
                                <i className={`fa-solid ${isCollapsed ? 'fa-angles-right' : 'fa-angles-left'} me-2 text-primary`}></i>
                                {isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <hr className="text-secondary mt-1 mb-3 opacity-25" />

            {/* Navigation Links */}
            <ul className="nav nav-pills flex-column mb-auto gap-1">

                {!isCollapsed && <small className="text-muted text-uppercase fw-bold ps-2 mb-1" style={{ fontSize: '0.70rem', letterSpacing: '0.5px' }}>Main</small>}
                <li className="nav-item">
                    <Link
                        to="/admin"
                        className={`nav-link rounded-3 py-2 px-3 d-flex align-items-center ${isActive('/admin')}`}
                        style={{ backgroundColor: location.pathname === '/admin' ? 'rgba(13, 110, 253, 0.15)' : 'transparent' }}
                        title="Dashboard"
                    >
                        <i className="fa-solid fa-chart-line me-3 fs-6"></i> {!isCollapsed && <span>Dashboard</span>}
                    </Link>
                </li>

                {!isCollapsed && <small className="text-muted text-uppercase fw-bold ps-2 mt-3 mb-1" style={{ fontSize: '0.70rem', letterSpacing: '0.5px' }}>Website</small>}

                {[
                    { path: '/admin/home', label: 'Home', icon: 'fa-house' },
                    { path: '/admin/about', label: 'About', icon: 'fa-circle-info' },
                    { path: '/admin/services', label: 'Services', icon: 'fa-file-medical' },
                    { path: '/admin/departments', label: 'Departments', icon: 'fa-hospital-user' },
                    { path: '/admin/doctors', label: 'Doctors', icon: 'fa-user-doctor' },
                ].map((item) => (
                    <li className="nav-item" key={item.path}>
                        <Link
                            to={item.path}
                            className={`nav-link rounded-3 py-2 px-3 d-flex align-items-center ${isActive(item.path)}`}
                            style={{ backgroundColor: location.pathname === item.path ? 'rgba(13, 110, 253, 0.15)' : 'transparent' }}
                            title={item.label}
                        >
                            <i className={`fa-solid ${item.icon} me-3 fs-6`}></i> {!isCollapsed && <span>{item.label}</span>}
                        </Link>
                    </li>
                ))}

                {!isCollapsed && <small className="text-muted text-uppercase fw-bold ps-2 mt-3 mb-1" style={{ fontSize: '0.70rem', letterSpacing: '0.5px' }}>Management</small>}
                <li className="nav-item">
                    <Link
                        to="/admin/appointments"
                        className={`nav-link rounded-3 py-2 px-3 d-flex align-items-center justify-content-between ${isActive('/admin/appointments')}`}
                        style={{ backgroundColor: location.pathname === '/admin/appointments' ? 'rgba(13, 110, 253, 0.15)' : 'transparent' }}
                        title="Appointments"
                    >
                        <div className="d-flex align-items-center text-truncate">
                            <i className="fa-solid fa-calendar-check me-3 fs-6"></i> {!isCollapsed && <span>Appointments</span>}
                        </div>
                        {!isCollapsed && <span className="badge bg-danger rounded-pill px-2 py-1 fs-8">2</span>}
                    </Link>
                </li>
            </ul>

            <hr className="text-secondary opacity-25" />

            {/* Logout Button */}
            <div>
                <button className="btn btn-outline-danger w-100 text-danger border-danger rounded-3 py-2 d-flex align-items-center justify-content-center bg-transparent hover-danger-btn">
                    <i className="fa-solid fa-right-from-bracket me-2"></i> {!isCollapsed && <span>Logout</span>}
                </button>
            </div>
        </div>
    );
}