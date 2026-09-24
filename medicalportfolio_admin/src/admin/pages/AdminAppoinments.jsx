import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminAppoinments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const itemsPerPage = 5; // Change this to how many items you want per page

    // Form State for Adding Appointment
    const [showAddModal, setShowAddModal] = useState(false);
    const [patientName, setPatientName] = useState('');
    const [email, setEmail] = useState('');
    const [department, setDepartment] = useState('');
    const [doctorName, setDoctorName] = useState('');
    const [appointmentDate, setAppointmentDate] = useState('');
    const [status, setStatus] = useState('Pending');

    const doctorsByDepartment = {
        Cardiology: ['Dr. John Smith', 'Dr. Sarah Jenkins', 'Dr. Walter White'],
        Pediatrics: ['Dr. Michael Brown', 'Dr. Emily Davis'],
        Neurology: ['Dr. Robert Wilson', 'Dr. Lisa Taylor', 'Dr. Sarah Johnson']
    };

    const API_URL = 'http://localhost/medilab_api/appointments.php';

    // Fetch Appointments with Page Support
    const fetchAppointments = async (page = 1) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}?page=${page}&limit=${itemsPerPage}`);
            const result = await response.json();
            if (result.success) {
                setAppointments(result.data);
                setTotalPages(result.totalPages || 1);
                setCurrentPage(result.currentPage || page);
                setTotalRecords(result.total || result.data.length);
            } else {
                setError(result.message || 'Failed to fetch appointments.');
            }
        } catch (error) {
            console.error(error);
            setError('Network error while connecting to server.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments(currentPage);
    }, [currentPage]);

    // Handle Add Appointment Submit
    const handleAddAppointment = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    patient_name: patientName,
                    email,
                    department,
                    doctor_name: doctorName,
                    appointment_date: appointmentDate,
                    status
                })
            });
            const result = await response.json();
            if (result.success) {
                setSuccessMsg('Appointment scheduled successfully!');
                setShowAddModal(false);
                setPatientName('');
                setEmail('');
                setDepartment('');
                setDoctorName('');
                setAppointmentDate('');
                setStatus('Pending');
                // Refresh to page 1 to see the newest booking
                setCurrentPage(1);
                fetchAppointments(1);
            } else {
                setError(result.message || 'Failed to add appointment.');
            }
        } catch (error) {
            console.error(error);
            setError('Error saving appointment.');
        }
    };

    // Handle Status Change
    const handleStatusChange = async (id, newStatus) => {
        try {
            const response = await fetch(API_URL, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: newStatus })
            });
            const result = await response.json();
            if (result.success) {
                fetchAppointments(currentPage);
            } else {
                alert(result.message || 'Failed to update status.');
            }
        } catch (error) {
            console.error(error);
            alert('Error updating status.');
        }
    };

    // KPI Counts based on the current loaded table view
    const pendingCount = appointments.filter(a => a.status === 'Pending').length;
    const confirmedCount = appointments.filter(a => a.status === 'Confirmed').length;
    const cancelledCount = appointments.filter(a => a.status === 'Cancelled').length;

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Appointment Management</h2>
                <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                    + Schedule New Appointment
                </button>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {successMsg && <div className="alert alert-success">{successMsg}</div>}

            {/* Statistic Cards (Soft Blue Shades) */}
            <div className="row g-3 mb-4">
                <div className="col-md-3 col-sm-6">
                    <div className="card shadow-sm border-0 border-start border-primary border-4 bg-white">
                        <div className="card-body py-3">
                            <h6 className="text-muted mb-1 font-monospace text-uppercase fs-7">Total Appointments</h6>
                            <h3 className="fw-bold mb-0 text-primary">{totalRecords}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 col-sm-6">
                    <div className="card shadow-sm border-0 border-start border-info border-4 bg-white">
                        <div className="card-body py-3">
                            <h6 className="text-muted mb-1 font-monospace text-uppercase fs-7">Pending</h6>
                            <h3 className="fw-bold mb-0 text-info">{pendingCount}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 col-sm-6">
                    <div className="card shadow-sm border-0 border-start border-success border-4 bg-white">
                        <div className="card-body py-3">
                            <h6 className="text-muted mb-1 font-monospace text-uppercase fs-7">Confirmed</h6>
                            <h3 className="fw-bold mb-0 text-success">{confirmedCount}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 col-sm-6">
                    <div className="card shadow-sm border-0 border-start border-secondary border-4 bg-white">
                        <div className="card-body py-3">
                            <h6 className="text-muted mb-1 font-monospace text-uppercase fs-7">Cancelled</h6>
                            <h3 className="fw-bold mb-0 text-secondary">{cancelledCount}</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Appointments Table Card */}
            <div className="card shadow-sm">
                <div className="card-body">
                    {loading ? (
                        <div className="text-center py-4">Loading appointments...</div>
                    ) : appointments.length === 0 ? (
                        <div className="text-center py-4 text-muted">No appointments found.</div>
                    ) : (
                        <>
                            <div className="table-responsive">
                                <table className="table table-hover align-middle">
                                    <thead className="table-light">
                                        <tr>
                                            <th>#</th>
                                            <th>Patient Name</th>
                                            <th>Email</th>
                                            <th>Department</th>
                                            <th>Doctor</th>
                                            <th>Date & Time</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {appointments.map((app, index) => (
                                            <tr key={app.id}>
                                                <td className="fw-bold">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                                <td>{app.patient_name}</td>
                                                <td>{app.email}</td>
                                                <td>{app.department}</td>
                                                <td>{app.doctor_name}</td>
                                                <td>{app.appointment_date}</td>
                                                <td>
                                                    <select
                                                        className={`form-select form-select-sm fw-bold ${app.status === 'Confirmed'
                                                                ? 'text-success'
                                                                : app.status === 'Cancelled'
                                                                    ? 'text-danger'
                                                                    : 'text-warning'
                                                            }`}
                                                        value={app.status}
                                                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                                                    >
                                                        <option value="Pending">Pending</option>
                                                        <option value="Confirmed">Confirmed</option>
                                                        <option value="Cancelled">Cancelled</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination Controls */}
                            <div className="d-flex justify-content-between align-items-center mt-3">
                                <span className="text-muted">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <div>
                                    <button
                                        className="btn btn-outline-primary btn-sm me-2"
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(prev => prev - 1)}
                                    >
                                        Previous
                                    </button>
                                    <button
                                        className="btn btn-outline-primary btn-sm"
                                        disabled={currentPage >= totalPages}
                                        onClick={() => setCurrentPage(prev => prev + 1)}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Add Appointment Modal */}
            {showAddModal && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <form onSubmit={handleAddAppointment}>
                                <div className="modal-header">
                                    <h5 className="modal-title">Schedule New Appointment</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Patient Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={patientName}
                                            onChange={(e) => setPatientName(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Department</label>
                                        <select
                                            className="form-select"
                                            value={department}
                                            onChange={(e) => {
                                                setDepartment(e.target.value);
                                                setDoctorName('');
                                            }}
                                            required
                                        >
                                            <option value="">Select Department</option>
                                            {Object.keys(doctorsByDepartment).map((dept) => (
                                                <option key={dept} value={dept}>{dept}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Doctor</label>
                                        <select
                                            className="form-select"
                                            value={doctorName}
                                            onChange={(e) => setDoctorName(e.target.value)}
                                            required
                                            disabled={!department}
                                        >
                                            <option value="">Select Doctor</option>
                                            {department &&
                                                doctorsByDepartment[department]?.map((doc) => (
                                                    <option key={doc} value={doc}>{doc}</option>
                                                ))}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Date & Time</label>
                                        <input
                                            type="datetime-local"
                                            className="form-control"
                                            value={appointmentDate}
                                            onChange={(e) => setAppointmentDate(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary">Save Appointment</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminAppoinments;