<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

session_start();

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "asr";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(['message' => "Connection failed: " . $conn->connect_error]));
}

// Check if user is logged in - Updated to check nested session structure
if (!isset($_SESSION['user']) || !isset($_SESSION['user']['id']) || !isset($_SESSION['user']['role'])) {
    http_response_code(401);
    echo json_encode([
        'message' => 'Unauthorized access - Session user data not found',
        'session_data' => $_SESSION // For debugging
    ]);
    exit;
}

// Get user data from nested session structure
$user_id = $_SESSION['user']['id'];
$user_role = $_SESSION['user']['role'];

// Only allow admin and employee roles to change password
$allowed_roles = ['admin', 'employee'];
if (!in_array($user_role, $allowed_roles)) {
    http_response_code(403);
    echo json_encode([
        'message' => 'Forbidden: Only admin and employees can change password',
        'your_role' => $user_role
    ]);
    exit;
}

// Get input data
$data = json_decode(file_get_contents("php://input"), true);

// Validate input
if (empty($data['old_password']) || empty($data['new_password'])) {
    http_response_code(400);
    echo json_encode(['message' => 'Old password and new password are required']);
    exit;
}

$old_password = $data['old_password'];
$new_password = $data['new_password'];

try {
    // Get current password hash from database
    $query = "SELECT password FROM users WHERE id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        http_response_code(404);
        echo json_encode(['message' => 'User not found']);
        exit;
    }
    
    $user = $result->fetch_assoc();
    
    // Verify old password
    if (!password_verify($old_password, $user['password'])) {
        http_response_code(401);
        echo json_encode(['message' => 'Current password is incorrect']);
        exit;
    }
    
    // Validate new password strength
    if (strlen($new_password) < 8) {
        http_response_code(400);
        echo json_encode(['message' => 'Password must be at least 8 characters long']);
        exit;
    }
    
    // Hash new password
    $new_password_hash = password_hash($new_password, PASSWORD_DEFAULT);
    
    // Update password in database
    $update_query = "UPDATE users SET password = ? WHERE id = ?";
    $update_stmt = $conn->prepare($update_query);
    $update_stmt->bind_param("si", $new_password_hash, $user_id);
    
    if ($update_stmt->execute()) {
        echo json_encode(['message' => 'Password updated successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['message' => 'Failed to update password']);
    }
    
    $update_stmt->close();
    $stmt->close();
    $conn->close();
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'message' => 'Server error',
        'error' => $e->getMessage()
    ]);
}
?>