<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

session_start();

// Database connection
$host = 'localhost';
$dbname = 'asr';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die(json_encode(['authenticated' => false, 'error' => 'Database connection failed']));
}

$response = ['authenticated' => false];
$userData = [];

if (
    isset($_SESSION['user_id'], $_SESSION['role'], $_SESSION['ip'], $_SESSION['user_agent']) &&
    ($_SESSION['role'] === 'admin' || $_SESSION['role'] === 'employee') &&
    $_SESSION['ip'] === $_SERVER['REMOTE_ADDR'] &&
    $_SESSION['user_agent'] === $_SERVER['HTTP_USER_AGENT']
) {
    try {
        // Get user details including first_name
        $stmt = $pdo->prepare("SELECT id, first_name, role FROM users WHERE id = :id AND role = :role");
        $stmt->execute([
            ':id' => $_SESSION['user_id'],
            ':role' => $_SESSION['role']
        ]);
        
        if ($user = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $response['authenticated'] = true;
            $response['user'] = [
                'id' => $user['id'],
                'first_name' => $user['first_name'],
                'role' => $user['role']
            ];
            
            // Update session with latest user data
            $_SESSION['first_name'] = $user['first_name'];
            $_SESSION['role'] = $user['role'];
        }
    } catch (PDOException $e) {
        error_log("Session check error: " . $e->getMessage());
    }
}

if (!$response['authenticated']) {
    session_unset();
    session_destroy();
    $response['error'] = 'Session invalid or expired';
}

echo json_encode($response);
exit();
?>