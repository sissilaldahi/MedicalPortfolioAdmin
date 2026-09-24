<?php

ini_set('display_errors', 0);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$host = "localhost";
$username = "root";
$password = "";
$dbname = "medilab_db"; 

$conn = new mysqli($host, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database connection failed: " . $conn->connect_error]);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        
        $page = isset($_GET['page']) ? intval($_GET['page']) : 1;
        $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 5;
        $offset = ($page - 1) * $limit;

        
        $count_sql = "SELECT COUNT(*) as total FROM appointments";
        $count_result = $conn->query($count_sql);
        $total_rows = ($count_result) ? intval($count_result->fetch_assoc()['total']) : 0;
        $total_pages = ceil($total_rows / $limit);

        
        $sql = "SELECT id, patient_name, email, phone, appointment_date, department, doctor, message, status FROM appointments ORDER BY appointment_date DESC LIMIT $limit OFFSET $offset";
        $result = $conn->query($sql);
        
        $appointments = [];
        if ($result) {
            while ($row = $result->fetch_assoc()) {
               
                $row['doctor_name'] = $row['doctor'];
                $appointments[] = $row;
            }
            echo json_encode([
                "success" => true, 
                "data" => $appointments,
                "total" => $total_rows,
                "totalPages" => $total_pages,
                "currentPage" => $page
            ]);
        } else {
            echo json_encode(["success" => false, "message" => "Query failed: " . $conn->error]);
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        
       
        if (isset($data['action']) && $data['action'] === 'update_status') {
            $id = intval($data['id'] ?? 0);
            $status = $conn->real_escape_string($data['status'] ?? 'Pending');

            $sql = "UPDATE appointments SET status = '$status' WHERE id = $id";
            if ($conn->query($sql) === TRUE) {
                echo json_encode(["success" => true, "message" => "Status updated successfully."]);
            } else {
                echo json_encode(["success" => false, "message" => "Error updating status: " . $conn->error]);
            }
            break;
        }

        
        $patient_name = $conn->real_escape_string($data['patient_name'] ?? '');
        $email = $conn->real_escape_string($data['email'] ?? 'saso.aldahi@gmail.com'); 
        $phone = $conn->real_escape_string($data['phone'] ?? '00000000'); 
        $department = $conn->real_escape_string($data['department'] ?? '');
        $doctor = $conn->real_escape_string($data['doctor_name'] ?? $data['doctor'] ?? '');
        $appointment_date = $conn->real_escape_string($data['appointment_date'] ?? '');
        $message = $conn->real_escape_string($data['message'] ?? '');
        $status = $conn->real_escape_string($data['status'] ?? 'Pending');

        if (empty($patient_name) || empty($department) || empty($doctor) || empty($appointment_date)) {
            echo json_encode(["success" => false, "message" => "All required fields must be filled."]);
            exit();
        }

        $conflict_check = "SELECT id FROM appointments WHERE doctor = '$doctor' AND appointment_date = '$appointment_date'";
        $conflict_result = $conn->query($conflict_check);
        if ($conflict_result && $conflict_result->num_rows > 0) {
            echo json_encode(["success" => false, "message" => "This doctor already has an appointment scheduled at this exact date and time."]);
            exit();
        }

        $sql = "INSERT INTO appointments (patient_name, email, phone, appointment_date, department, doctor, message, status) 
                VALUES ('$patient_name', '$email', '$phone', '$appointment_date', '$department', '$doctor', '$message', '$status')";

        if ($conn->query($sql) === TRUE) {
            echo json_encode(["success" => true, "message" => "Appointment scheduled successfully."]);
        } else {
            echo json_encode(["success" => false, "message" => "Error: " . $conn->error]);
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"), true);
        $id = intval($data['id'] ?? 0);
        $status = $conn->real_escape_string($data['status'] ?? 'Pending');

        $sql = "UPDATE appointments SET status = '$status' WHERE id = $id";
        if ($conn->query($sql) === TRUE) {
            echo json_encode(["success" => true, "message" => "Status updated successfully."]);
        } else {
            echo json_encode(["success" => false, "message" => "Error updating status: " . $conn->error]);
        }
        break;

    default:
        echo json_encode(["success" => false, "message" => "Unsupported request method."]);
        break;
}

$conn->close();
?>