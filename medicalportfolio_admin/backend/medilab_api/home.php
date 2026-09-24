<?php
include 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $result = $conn->query("SELECT * FROM home_content LIMIT 1");
    $data = $result->fetch_assoc() ?: ["title" => "", "description" => ""];
    echo json_encode($data);
} 
elseif ($method === 'POST') {
    $input = json_decode(file_get_contents("php://input"), true);
    $title = $input['title'] ?? '';
    $description = $input['description'] ?? '';

    // Check if a row exists, update or insert
    $check = $conn->query("SELECT id FROM home_content LIMIT 1");
    if ($check->num_rows > 0) {
        $stmt = $conn->prepare("UPDATE home_content SET title = ?, description = ?");
        $stmt->bind_param("ss", $title, $description);
    } else {
        $stmt = $conn->prepare("INSERT INTO home_content (title, description) VALUES (?, ?)");
        $stmt->bind_param("ss", $title, $description);
    }

    if ($stmt->execute()) {
        echo json_encode(["message" => "Home content updated successfully!"]);
    } else {
        echo json_encode(["message" => "Error updating home content."]);
    }
    $stmt->close();
}
$conn->close();
?>