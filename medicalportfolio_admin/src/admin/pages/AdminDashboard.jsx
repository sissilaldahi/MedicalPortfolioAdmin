import { useState, useEffect } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

function AdminDashboard() {
    const [counts, setCounts] = useState({
        services: 0,
        departments: 0,
        doctors: 0,
        appointments: 0,
        pending_appointments: 0,
    });

    const [appointments, setAppointments] = useState([]);
    const [chartDataByDoctor, setChartDataByDoctor] = useState({ labels: [], datasets: [] });
    const [chartDataByStatus, setChartDataByStatus] = useState({ labels: [], datasets: [] });

    useEffect(() => {
        fetch('http://localhost/medilab_api/dashboard.php')
            .then((res) => res.json())
            .then((data) => {
                if (data.counts) setCounts(data.counts);
            })
            .catch((err) => console.error('Error fetching dashboard counts:', err));

        fetch('http://localhost/medilab_api/appointments.php')
            .then((res) => res.json())
            .then((data) => {
               
                const aptList = Array.isArray(data)
                    ? data
                    : (data.appointments || data.data || []);

                setAppointments(aptList);
                processChartData(aptList);
            })
            .catch((err) => console.error('Error fetching appointments:', err));
    }, []);

    const processChartData = (aptList) => {
        const doctorCounts = {};
        aptList.forEach((apt) => {
            const doc = apt.doctor || 'Unassigned';
            doctorCounts[doc] = (doctorCounts[doc] || 0) + 1;
        });

        setChartDataByDoctor({
            labels: Object.keys(doctorCounts),
            datasets: [
                {
                    label: 'Appointments',
                    data: Object.values(doctorCounts),
                    backgroundColor: 'rgba(13, 110, 253, 0.7)',
                    borderColor: 'rgba(13, 110, 253, 1)',
                    borderWidth: 1,
                    borderRadius: 4,
                },
            ],
        });

        let pending = 0, confirmed = 0, cancelled = 0;
        aptList.forEach((apt) => {
            const status = apt.status || 'Pending';
            if (status === 'Confirmed') confirmed++;
            else if (status === 'Cancelled') cancelled++;
            else pending++;
        });

        setChartDataByStatus({
            labels: ['Pending', 'Confirmed', 'Cancelled'],
            datasets: [
                {
                    data: [pending, confirmed, cancelled],
                    backgroundColor: ['#ffc107', '#198754', '#dc3545'],
                    borderWidth: 1,
                },
            ],
        });
    };

    return (
        <div className="container-fluid px-4 py-4">
            <h2 className="fw-bold text-dark mb-4">Dashboard Overview</h2>

            <div className="row g-4 mb-4">
                <div className="col-md-3">
                    <div className="card border-0 shadow-sm rounded-3 p-3 d-flex flex-row align-items-center justify-content-between">
                        <div>
                            <div className="text-muted small text-uppercase fw-bold">Appointments</div>
                            <div className="fs-2 fw-bold text-dark mt-1">{counts.appointments}</div>
                        </div>
                        <div className="bg-light p-3 rounded-circle text-primary">
                            <i className="bi bi-calendar-check fs-4"></i>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card border-0 shadow-sm rounded-3 p-3 d-flex flex-row align-items-center justify-content-between">
                        <div>
                            <div className="text-muted small text-uppercase fw-bold">Doctors</div>
                            <div className="fs-2 fw-bold text-dark mt-1">{counts.doctors}</div>
                        </div>
                        <div className="bg-light p-3 rounded-circle text-success">
                            <i className="bi bi-person-badge fs-4"></i>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card border-0 shadow-sm rounded-3 p-3 d-flex flex-row align-items-center justify-content-between">
                        <div>
                            <div className="text-muted small text-uppercase fw-bold">Departments</div>
                            <div className="fs-2 fw-bold text-dark mt-1">{counts.departments}</div>
                        </div>
                        <div className="bg-light p-3 rounded-circle text-warning">
                            <i className="bi bi-grid fs-4"></i>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card border-0 shadow-sm rounded-3 p-3 d-flex flex-row align-items-center justify-content-between">
                        <div>
                            <div className="text-muted small text-uppercase fw-bold">Pending Approval</div>
                            <div className="fs-2 fw-bold text-dark mt-1">{counts.pending_appointments}</div>
                        </div>
                        <div className="bg-light p-3 rounded-circle text-danger">
                            <i className="bi bi-exclamation-circle fs-4"></i>
                        </div>
                    </div>
                </div>
            </div>

            
            <div className="row g-4 mb-4">
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm rounded-3 p-3 h-100">
                        <h6 className="fw-semibold mb-2 text-secondary">Appointments Distribution by Doctor</h6>
                        <div style={{ height: '220px', position: 'relative' }}>
                            {appointments.length > 0 ? (
                                <Bar
                                    data={chartDataByDoctor}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: { legend: { display: false } },
                                        scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
                                    }}
                                />
                            ) : (
                                <p className="text-muted text-center pt-5">No appointment data available.</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm rounded-3 p-3 h-100">
                        <h6 className="fw-semibold mb-2 text-secondary">Appointment Statuses</h6>
                        <div style={{ height: '220px', position: 'relative' }}>
                            {appointments.length > 0 ? (
                                <Doughnut
                                    data={chartDataByStatus}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: { legend: { position: 'bottom', labels: { boxWidth: 12 } } },
                                    }}
                                />
                            ) : (
                                <p className="text-muted text-center pt-5">No status data available.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="card border-0 shadow-sm rounded-3 p-4">
                <h5 className="fw-semibold mb-3 text-secondary">Recent Appointments</h5>
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light text-uppercase fs-7">
                            <tr>
                                <th>ID</th>
                                <th>Patient Name</th>
                                <th>Department</th>
                                <th>Doctor</th>
                                <th>Date / Time</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.length > 0 ? (
                                appointments.slice(0, 5).map((apt) => (
                                    <tr key={apt.id}>
                                        <td className="fw-semibold text-muted">{apt.id}</td>
                                        <td className="fw-bold text-dark">{apt.patient_name || apt.name}</td>
                                        <td><span className="badge bg-light text-dark border">{apt.department}</span></td>
                                        <td className="text-secondary">{apt.doctor}</td>
                                        <td className="small text-muted">{apt.appointment_date || `${apt.date} ${apt.time}`}</td>
                                        <td>
                                            <span className={`badge ${apt.status === 'Confirmed' ? 'bg-success' :
                                                    apt.status === 'Cancelled' ? 'bg-danger' : 'bg-warning text-dark'
                                                }`}>
                                                {apt.status || 'Pending'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center text-muted py-3">No recent appointments found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;