<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

error_reporting(E_ALL);
ini_set('display_errors', 1);

$host = 'localhost';
$dbname = 'asr';
$username = 'root';
$password = '';

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Database connection failed.']);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $token = $_GET['token'];

    // Verify the token
    $stmt = $conn->prepare("SELECT * FROM users WHERE verification_token = :token");
    $stmt->execute([':token' => $token]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        // Mark the user as verified
        $stmt = $conn->prepare("UPDATE users SET verified = 1, verification_token = NULL WHERE id = :id");
        $stmt->execute([':id' => $user['id']]);

        echo json_encode(['status' => 'success', 'message' => 'Email verified successfully!']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Invalid or expired token.']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
}