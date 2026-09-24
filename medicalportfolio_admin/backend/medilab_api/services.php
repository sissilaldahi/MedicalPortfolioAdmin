<?php
error_reporting(0);
ini_set('display_errors', 0);

include 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $result = $conn->query("SELECT * FROM services");
    $services = [];
    while ($row = $result->fetch_assoc()) {
        $services[] = $row;
    }
    echo json_encode($services);
} 
elseif ($method === 'POST') {
    $input = json_decode(file_get_contents("php://input"), true);
    if (!$input) {
        $input = $_POST;
    }

    $id = $input['id'] ?? null;
    $name = $input['title'] ?? $input['name'] ?? ''; // Handles both React form keys
    $description = $input['description'] ?? '';
    $icon = $input['icon'] ?? 'bi-heart-pulse'; // Default fallback icon from your DB structure

    if (!empty($name)) {
        if (!empty($id)) {
            // Update existing service
            $stmt = $conn->prepare("UPDATE services SET name = ?, description = ?, icon = ? WHERE id = ?");
            $stmt->bind_param("sssi", $name, $description, $icon, $id);
            $actionMsg = "Service updated successfully!";
        } else {
            // Insert new service matching columns: name, description, icon
            $stmt = $conn->prepare("INSERT INTO services (name, description, icon) VALUES (?, ?, ?)");
            $stmt->bind_param("sss", $name, $description, $icon);
            $actionMsg = "Service added successfully!";
        }

        if ($stmt->execute()) {
            echo json_encode(["message" => $actionMsg]);
        } else {
            echo json_encode(["message" => "Database execute error."]);
        }
        $stmt->close();
    } else {
        echo json_encode(["message" => "Service name is required."]);
    }
}
elseif ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;

    if (!empty($id)) {
        $stmt = $conn->prepare("DELETE FROM services WHERE id = ?");
        $stmt->bind_param("i", $id);
        
        if ($stmt->execute()) {
            echo json_encode(["message" => "Service deleted successfully!"]);
        } else {
            echo json_encode(["message" => "Error deleting service."]);
        }
        $stmt->close();
    } else {
        echo json_encode(["message" => "Service ID is required."]);
    }
}
$conn->close();
?>