<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$host = "localhost";
$db_name = "medilab_db";
$username = "root";     
$password = "";         

try {
    $conn = new PDO("mysql:host=$host;dbname=$db_name;charset=utf8mb4", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $exception) {
    echo json_encode(array("success" => false, "message" => "DB Error: " . $exception->getMessage()));
    exit();
}

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->email) && !empty($data->password)) {
    $input_user = trim($data->email);
    $input_pass = trim($data->password);

    // Look for the user by email/username column
    $query = "SELECT id, email, password FROM admins WHERE email = :email LIMIT 1";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(":email", $input_user);
    $stmt->execute();

    if($stmt->rowCount() > 0) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $db_password = $row['password'];

        // Check if it matches the hashed password OR standard text '12345678'
        if(password_verify($input_pass, $db_password) || $input_pass === $db_password) {
            echo json_encode(array(
                "success" => true, 
                "message" => "Login successful",
                "admin" => array("id" => $row['id'], "email" => $row['email'])
            ));
        } else {
            http_response_code(401);
            echo json_encode(array("success" => false, "message" => "Incorrect password."));
        }
    } else {
        http_response_code(401);
        echo json_encode(array("success" => false, "message" => "Username not found."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("success" => false, "message" => "Please fill in all fields."));
}
?>