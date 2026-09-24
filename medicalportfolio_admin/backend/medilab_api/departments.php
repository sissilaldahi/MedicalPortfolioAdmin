<?php
include 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $result = $conn->query("SELECT * FROM departments");
    $departments = [];
    while ($row = $result->fetch_assoc()) {
        $departments[] = $row;
    }
    echo json_encode($departments);
} 
elseif ($method === 'POST') {
    $input = json_decode(file_get_contents("php://input"), true);
    $id = $input['id'] ?? null;
    $name = $input['name'] ?? '';
    $description = $input['description'] ?? '';

    if (!empty($name)) {
        if (!empty($id)) {
            $stmt = $conn->prepare("UPDATE departments SET name = ?, description = ? WHERE id = ?");
            $stmt->bind_param("ssi", $name, $description, $id);
            $msg = "Department updated successfully!";
        } else {
            $stmt = $conn->prepare("INSERT INTO departments (name, description) VALUES (?, ?)");
            $stmt->bind_param("ss", $name, $description);
            $msg = "Department added successfully!";
        }

        if ($stmt->execute()) {
            echo json_encode(["message" => $msg]);
        } else {
            echo json_encode(["message" => "Error processing request."]);
        }
        $stmt->close();
    } else {
        echo json_encode(["message" => "Department name is required."]);
    }
}
elseif ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if (!empty($id)) {
        $stmt = $conn->prepare("DELETE FROM departments WHERE id = ?");
        $stmt->bind_param("i", $id);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Department deleted successfully!"]);
        } else {
            echo json_encode(["message" => "Error deleting department."]);
        }
        $stmt->close();
    }
}
$conn->close();
?>