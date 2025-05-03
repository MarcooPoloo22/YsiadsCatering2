<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Set the default timezone to Asia/Manila
date_default_timezone_set('Asia/Manila');

// Error logging configuration
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', 'C:\xampp\htdocs\password_reset_errors.log'); // Log file path

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$input = file_get_contents("php://input");
$data = json_decode($input, true);

if (!$data || !isset($data['token']) || !isset($data['newPassword']) || !isset($data['confirmPassword'])) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid input data.']);
    error_log('Invalid input data in resetpassword.php');
    exit();
}

$token = $data['token'];
$newPassword = $data['newPassword'];
$confirmPassword = $data['confirmPassword'];

if ($newPassword !== $confirmPassword) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Passwords do not match.']);
    error_log('Passwords do not match in resetpassword.php');
    exit();
}

$host = 'localhost';
$dbname = 'asr';
$username = 'root';
$password = '';

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Fetch the reset request from the database
    $stmt = $conn->prepare("SELECT * FROM password_resets WHERE token = :token");
    $stmt->execute([':token' => $token]);
    $resetRequest = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$resetRequest) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Invalid or expired token.']);
        error_log('Invalid or expired token in resetpassword.php: ' . $token);
        exit();
    }

    // Calculate expiry time in PHP (Asia/Manila timezone)
    $current_time = date("Y-m-d H:i:s");
    $expiry_time = date("Y-m-d H:i:s", strtotime($resetRequest['created_at'] . ' +1 hour'));

    if ($current_time > $expiry_time) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Invalid or expired token.']);
        error_log('Token expired in resetpassword.php: ' . $token);
        exit();
    }

    // Fetch the user associated with the reset request
    $stmt = $conn->prepare("SELECT * FROM users WHERE email = :email");
    $stmt->execute([':email' => $resetRequest['email']]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'User not found.']);
        error_log('User not found in resetpassword.php: ' . $resetRequest['email']);
        exit();
    }

    // Update the user's password
    $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
    $stmt = $conn->prepare("UPDATE users SET password = :password WHERE id = :id");
    $stmt->execute([
        ':password' => $hashedPassword,
        ':id' => $user['id'],
    ]);

    // Delete the reset token
    $stmt = $conn->prepare("DELETE FROM password_resets WHERE token = :token");
    $stmt->execute([':token' => $token]);

    echo json_encode(['status' => 'success', 'message' => 'Password reset successfully.']);
} catch (PDOException $e) {
    error_log('Database Error in resetpassword.php: ' . $e->getMessage());
    echo json_encode(['status' => 'error', 'message' => 'Failed to reset password.']);
}