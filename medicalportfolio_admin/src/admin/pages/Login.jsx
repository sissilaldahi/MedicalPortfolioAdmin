import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost/medilab_api/login.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }) // 'email' variable holds your username 'sissil'
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem('isAdminLoggedIn', 'true');
                navigate('/admin/dashboard');
            } else {
                setError(data.message || 'Invalid username or password');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Could not connect to the server. Check XAMPP/PHP.');
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
            <div className="card border-0 shadow-sm p-4 rounded-4" style={{ width: '400px' }}>
                <div className="text-center mb-4">
                    <div className="bg-primary text-white rounded-3 d-inline-flex align-items-center justify-content-center fw-bold fs-4 mb-2" style={{ width: '48px', height: '48px' }}>
                        M
                    </div>
                    <h4 className="fw-bold text-dark">Admin Portal</h4>
                    <p className="text-muted small">Sign in to manage Medilab</p>
                </div>

                {error && <div className="alert alert-danger py-2 small">{error}</div>}

                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label className="form-label small fw-semibold text-secondary">Username</label>
                        <input
                            type="text"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="form-label small fw-semibold text-secondary">Password</label>
                        <input 
                            type="password" 
                            className="form-control" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold rounded-3">
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
} 