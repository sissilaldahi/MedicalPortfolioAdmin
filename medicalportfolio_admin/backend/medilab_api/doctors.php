<?php
error_reporting(0);
ini_set('display_errors', 0);

include 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $department = $_GET['department'] ?? null;

    if (!empty($department)) {
        // Match against 'specialty' column
        $stmt = $conn->prepare("SELECT * FROM doctors WHERE specialty = ?");
        $stmt->bind_param("s", $department);
        $stmt->execute();
        $result = $stmt->get_result();
        $stmt->close();
    } else {
        $result = $conn->query("SELECT * FROM doctors");
    }

    $doctors = [];
    while ($row = $result->fetch_assoc()) {
        // Map specialty to 'department' for the frontend compatibility
        $row['department'] = $row['specialty'];
        $doctors[] = $row;
    }
    echo json_encode($doctors);
} 
elseif ($method === 'POST') {
    $input = json_decode(file_get_contents("php://input"), true);
    if (!$input) {
        $input = $_POST;
    }

    $id = $input['id'] ?? null;
    $name = $input['name'] ?? '';
    $department = $input['department'] ?? '';
    $phone = $input['phone'] ?? '';
    $schedule = $input['schedule'] ?? 'Mon-Fri: 9AM - 4PM';

    if (!empty($name) && !empty($department)) {
        if (!empty($id)) {
            // Update using specialty column
            $stmt = $conn->prepare("UPDATE doctors SET name = ?, specialty = ?, phone = ?, schedule = ? WHERE id = ?");
            $stmt->bind_param("ssssi", $name, $department, $phone, $schedule, $id);
        } else {
            // Insert using specialty column
            $stmt = $conn->prepare("INSERT INTO doctors (name, specialty, phone, schedule) VALUES (?, ?, ?, ?)");
            $stmt->bind_param("ssss", $name, $department, $phone, $schedule);
        }

        if ($stmt && $stmt->execute()) {
            echo json_encode(["message" => "Doctor saved successfully!"]);
        } else {
            echo json_encode(["message" => "Database execute error."]);
        }
        if ($stmt) $stmt->close();
    } else {
        echo json_encode(["message" => "Name and department are required."]);
    }
}
elseif ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if (!empty($id)) {
        $stmt = $conn->prepare("DELETE FROM doctors WHERE id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $stmt->close();
        echo json_encode(["message" => "Doctor deleted successfully!"]);
    }
}
$conn->close();
?>