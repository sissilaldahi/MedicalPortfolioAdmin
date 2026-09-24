import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function AdminDepartments() {
    const [departments, setDepartments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [formData, setFormData] = useState({ id: '', name: '', description: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState('');
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchDepartments();
        fetchDoctors();
    }, []);

    const fetchDepartments = () => {
        fetch('http://localhost/medilab_api/departments.php')
            .then((res) => res.json())
            .then((data) => setDepartments(data))
            .catch((err) => console.error('Error fetching departments:', err));
    };

    const fetchDoctors = () => {
        fetch('http://localhost/medilab_api/doctors.php')
            .then((res) => res.json())
            .then((data) => setDoctors(data))
            .catch((err) => console.error('Error fetching doctors:', err));
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('http://localhost/medilab_api/departments.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        })
            .then((res) => res.json())
            .then((data) => {
                setMessage(data.message || 'Operation successful!');
                setFormData({ id: '', name: '', description: '' });
                setIsEditing(false);
                setShowModal(false);
                fetchDepartments();
            })
            .catch((err) => {
                console.error('Error saving department:', err);
                setMessage('Error saving department.');
            });
    };

    const handleEdit = (dept) => {
        setFormData(dept);
        setIsEditing(true);
        setShowModal(true);
    };

    const handleOpenAddModal = () => {
        setFormData({ id: '', name: '', description: '' });
        setIsEditing(false);
        setShowModal(true);
    };

    const handleDelete = (dept) => {
        // Logical check: Prevent deletion if any doctor is assigned to this department
        const isAssigned = doctors.some(
            (doc) => doc.department && doc.department.trim().toLowerCase() === dept.name.trim().toLowerCase()
        );

        if (isAssigned) {
            alert(`Cannot delete the "${dept.name}" department because one or more doctors are currently assigned to it.`);
            return;
        }

        if (window.confirm('Are you sure you want to delete this department?')) {
            fetch(`http://localhost/medilab_api/departments.php?id=${dept.id}`, {
                method: 'DELETE',
            })
                .then((res) => res.json())
                .then((data) => {
                    setMessage(data.message || 'Deleted successfully!');
                    fetchDepartments();
                })
                .catch((err) => console.error('Error deleting department:', err));
        }
    };

    const handleCancel = () => {
        setFormData({ id: '', name: '', description: '' });
        setIsEditing(false);
        setShowModal(false);
    };

    return (
        <div className="container-fluid px-4 py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold text-dark mb-0">Manage Departments</h2>
                <button className="btn btn-primary" onClick={handleOpenAddModal}>
                    + Add New Department
                </button>
            </div>

            {message && <div className="alert alert-primary py-2">{message}</div>}

            {/* Full-Width Table Layout */}
            <div className="card border-0 shadow-sm rounded-3 p-4">
                <h5 className="fw-semibold mb-3 text-secondary">Departments List</h5>
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light text-uppercase fs-7">
                            <tr>
                                <th style={{ width: '8%' }}>#</th>
                                <th style={{ width: '25%' }}>Name</th>
                                <th style={{ width: '47%' }}>Description</th>
                                <th style={{ width: '20%' }} className="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {departments.length > 0 ? (
                                departments.map((dept, index) => (
                                    <tr key={dept.id}>
                                        {/* Sequential row count instead of actual DB primary key */}
                                        <td className="fw-semibold text-muted">{index + 1}</td>
                                        <td className="fw-bold text-dark">{dept.name}</td>
                                        <td className="text-secondary text-truncate" style={{ maxWidth: '250px' }}>
                                            {dept.description}
                                        </td>
                                        <td className="text-end">
                                            <button
                                                className="btn btn-sm btn-outline-primary px-3 me-2"
                                                onClick={() => handleEdit(dept)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-sm btn-outline-danger px-2"
                                                onClick={() => handleDelete(dept)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center text-muted py-4">
                                        No departments found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add / Edit Department Modal Popup */}
            {showModal && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <form onSubmit={handleSubmit}>
                                <div className="modal-header">
                                    <h5 className="modal-title fw-semibold text-secondary">
                                        {isEditing ? 'Edit Department' : 'Add New Department'}
                                    </h5>
                                    <button type="button" className="btn-close" onClick={handleCancel}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold text-muted">Department Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            className="form-control"
                                            placeholder="e.g. Cardiology"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold text-muted">Description</label>
                                        <textarea
                                            name="description"
                                            className="form-control"
                                            rows="4"
                                            placeholder="Enter department details..."
                                            value={formData.description}
                                            onChange={handleChange}
                                            required
                                        ></textarea>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-light border text-muted" onClick={handleCancel}>
                                        Cancel
                                    </button>
                                    <button type="submit" className={`btn ${isEditing ? 'btn-success' : 'btn-primary'}`}>
                                        {isEditing ? 'Update Department' : 'Save Department'}
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

export default AdminDepartments;