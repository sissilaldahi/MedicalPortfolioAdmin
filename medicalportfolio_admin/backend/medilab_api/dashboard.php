<?php
error_reporting(0);
ini_set('display_errors', 0);

include 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Fetch counts from each table
    $servicesCount = $conn->query("SELECT COUNT(*) as total FROM services")->fetch_assoc()['total'] ?? 0;
    $departmentsCount = $conn->query("SELECT COUNT(*) as total FROM departments")->fetch_assoc()['total'] ?? 0;
    $doctorsCount = $conn->query("SELECT COUNT(*) as total FROM doctors")->fetch_assoc()['total'] ?? 0;
    $appointmentsCount = $conn->query("SELECT COUNT(*) as total FROM appointments")->fetch_assoc()['total'] ?? 0;
    $pendingAppointments = $conn->query("SELECT COUNT(*) as total FROM appointments WHERE status = 'Pending' OR status = ''")->fetch_assoc()['total'] ?? 0;

    // Fetch recent appointments for quick view
    $recentResult = $conn->query("SELECT * FROM appointments ORDER BY id DESC LIMIT 5");
    $recentAppointments = [];
    while ($row = $recentResult->fetch_assoc()) {
        $recentAppointments[] = $row;
    }

    echo json_encode([
        "counts" => [
            "services" => (int)$servicesCount,
            "departments" => (int)$departmentsCount,
            "doctors" => (int)$doctorsCount,
            "appointments" => (int)$appointmentsCount,
            "pending_appointments" => (int)$pendingAppointments
        ],
        "recent_appointments" => $recentAppointments
    ]);
}
$conn->close();
?>