<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
session_start();

if (!isset($_SESSION['user'])) {
    echo json_encode(["error" => "Unauthorized access"]);
    exit;
}

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "asr";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed: " . $conn->connect_error]));
}

try {
    $stmt = $conn->prepare("SELECT privacy_policy, terms_condition FROM site_policies LIMIT 1");
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $data = $result->fetch_assoc();
    } else {
        $data = [
            'privacy_policy' => '',
            'terms_condition' => ''
        ];
    }
    
    echo json_encode($data);
} catch (Exception $e) {
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}

$conn->close();
?>