import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function AdminDoctors() {
    const [doctors, setDoctors] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [formData, setFormData] = useState({ id: '', name: '', department: '', phone: '', schedule: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState('');
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchDoctors();
        fetchDepartments();
    }, []);

    const fetchDoctors = () => {
        fetch('http://localhost/medilab_api/doctors.php')
            .then((res) => res.json())
            .then((data) => setDoctors(data))
            .catch((err) => console.error('Error fetching doctors:', err));
    };

    const fetchDepartments = () => {
        fetch('http://localhost/medilab_api/departments.php')
            .then((res) => res.json())
            .then((data) => setDepartments(data))
            .catch((err) => console.error('Error fetching departments:', err));
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('http://localhost/medilab_api/doctors.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        })
            .then((res) => res.json())
            .then((data) => {
                setMessage(data.message || 'Operation successful!');
                setFormData({ id: '', name: '', department: '', phone: '', schedule: '' });
                setIsEditing(false);
                setShowModal(false);
                fetchDoctors();
            })
            .catch((err) => console.error('Error saving doctor:', err));
    };

    const handleEdit = (doc) => {
        setFormData(doc);
        setIsEditing(true);
        setShowModal(true);
    };

    const handleOpenAddModal = () => {
        setFormData({ id: '', name: '', department: '', phone: '', schedule: '' });
        setIsEditing(false);
        setShowModal(true);
    };

    const handleDelete = (doc) => {
        if (doc.department && doc.department.trim() !== '') {
            alert(`Cannot delete Dr. ${doc.name} because they are currently assigned to the "${doc.department}" department.`);
            return;
        }

        if (window.confirm('Are you sure you want to delete this doctor?')) {
            fetch(`http://localhost/medilab_api/doctors.php?id=${doc.id}`, {
                method: 'DELETE',
            })
                .then((res) => res.json())
                .then((data) => {
                    setMessage(data.message || 'Deleted successfully!');
                    fetchDoctors();
                })
                .catch((err) => console.error('Error deleting doctor:', err));
        }
    };

    const handleCancel = () => {
        setFormData({ id: '', name: '', department: '', phone: '', schedule: '' });
        setIsEditing(false);
        setShowModal(false);
    };

    return (
        <div className="container-fluid px-4 py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold text-dark mb-0">Manage Doctors</h2>
                <button className="btn btn-primary" onClick={handleOpenAddModal}>
                    + Add New Doctor
                </button>
            </div>

            {message && <div className="alert alert-primary py-2">{message}</div>}

            <div className="card border-0 shadow-sm rounded-3 p-4">
                <h5 className="fw-semibold mb-3 text-secondary">Doctors List</h5>
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light text-uppercase fs-7">
                            <tr>
                                <th style={{ width: '6%' }}>#</th>
                                <th style={{ width: '24%' }}>Name</th>
                                <th style={{ width: '22%' }}>Department</th>
                                <th style={{ width: '16%' }}>Phone</th>
                                <th style={{ width: '16%' }}>Schedule</th>
                                <th style={{ width: '16%' }} className="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {doctors.length > 0 ? (
                                doctors.map((doc, index) => (
                                    <tr key={doc.id}>
                                        <td className="fw-semibold text-muted">{index + 1}</td>
                                        <td className="fw-bold text-dark">{doc.name}</td>
                                        <td>
                                            {doc.department ? (
                                                <span className="badge bg-light text-dark border">{doc.department}</span>
                                            ) : (
                                                <span className="badge bg-secondary text-white">None</span>
                                            )}
                                        </td>
                                        <td className="small text-secondary">{doc.phone || 'N/A'}</td>
                                        <td className="small text-muted">{doc.schedule || 'Not Set'}</td>
                                        <td className="text-end">
                                            <button
                                                className="btn btn-sm btn-outline-primary px-2 me-1"
                                                onClick={() => handleEdit(doc)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-sm btn-outline-danger px-2"
                                                onClick={() => handleDelete(doc)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center text-muted py-4">
                                        No doctors found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <form onSubmit={handleSubmit}>
                                <div className="modal-header">
                                    <h5 className="modal-title fw-semibold text-secondary">
                                        {isEditing ? 'Edit Doctor' : 'Add New Doctor'}
                                    </h5>
                                    <button type="button" className="btn-close" onClick={handleCancel}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold text-muted">Doctor Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            className="form-control"
                                            placeholder="e.g. Dr. John Doe"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold text-muted">Department</label>
                                        <select
                                            name="department"
                                            className="form-select"
                                            value={formData.department}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select Department</option>
                                            {departments.map((dept) => (
                                                <option key={dept.id} value={dept.name}>{dept.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold text-muted">Phone</label>
                                        <input
                                            type="text"
                                            name="phone"
                                            className="form-control"
                                            placeholder="e.g. 76917923"
                                            value={formData.phone}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold text-muted">Working Schedule</label>
                                        <input
                                            type="text"
                                            name="schedule"
                                            className="form-control"
                                            placeholder="e.g. Mon-Fri: 9AM - 2PM"
                                            value={formData.schedule}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-light border text-muted" onClick={handleCancel}>
                                        Cancel
                                    </button>
                                    <button type="submit" className={`btn ${isEditing ? 'btn-success' : 'btn-primary'}`}>
                                        {isEditing ? 'Update Doctor' : 'Save Doctor'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminDoctors;