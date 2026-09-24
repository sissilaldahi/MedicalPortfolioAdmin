import { useState, useEffect } from 'react';

function AdminHome() {
    const [content, setContent] = useState({ title: '', description: '' });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    
    useEffect(() => {
        fetch('http://localhost/medilab_api/home.php')
            .then((res) => res.json())
            .then((data) => {
                setContent(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Error fetching home content:', err);
                setLoading(false);
            });
    }, []);

    const handleChange = (e) => {
        setContent({ ...content, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('http://localhost/medilab_api/home.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(content),
        })
            .then((res) => res.json())
            .then((data) => {
                setMessage(data.message || 'Updated successfully!');
            })
            .catch((err) => {
                console.error('Error updating home content:', err);
                setMessage('Error updating content.');
            });
    };

    if (loading) return <div className="p-4">Loading admin home content...</div>;

    return (
        <div className="container-fluid py-4">
            <h2 className="mb-4">Manage Home Page Content</h2>

            {message && <div className="alert alert-info">{message}</div>}

            <div className="row">
                <div className="col-md-6">
                    <div className="card shadow-sm p-4">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Main Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    className="form-control"
                                    value={content.title}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Description</label>
                                <textarea
                                    name="description"
                                    className="form-control"
                                    rows="4"
                                    value={content.description}
                                    onChange={handleChange}
                                    required
                                ></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary">
                                Save Changes
                            </button>
                        </form>
                    </div>
                </div>

                {/* Live Preview */}
                <div className="col-md-6">
                    <div className="card shadow-sm p-4 bg-light">
                        <h5 className="text-muted mb-3">Live Preview</h5>
                        <div className="p-4 border bg-white rounded">
                            <h1 className="display-6 fw-bold text-dark">{content.title}</h1>
                            <p className="lead text-secondary">{content.description}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminHome;