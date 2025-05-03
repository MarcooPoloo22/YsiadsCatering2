<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);
ini_set('error_log', 'php_errors.log');

// CORS and Content-Type headers
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Start session and check if user is logged in
session_start();
if (!isset($_SESSION['user'])) {
    echo json_encode(["error" => "User is not logged in."]);
    exit;
}
$user = $_SESSION['user'];

// Include audit trail functionality
require_once 'audit_logger.php';

// Database connection
$servername = "localhost";
$dbUsername = "root";
$dbPassword = "";
$dbname = "asr";
$conn = new mysqli($servername, $dbUsername, $dbPassword, $dbname);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Connection failed: " . $conn->connect_error]);
    exit;
}

// Expecting form data via $_POST and file data via $_FILES
$name = $_POST['name'] ?? '';
$description = $_POST['description'] ?? '';
$price = $_POST['price'] ?? '';

// Validate required fields
if (empty($name) || empty($description) || empty($price)) {
    echo json_encode(["error" => "Name, description, and price are required"]);
    exit;
}

// Handle file upload
if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    echo json_encode(["error" => "File upload error"]);
    exit;
}

$uploadDir = 'uploads/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}
$fileName = uniqid() . '-' . basename($_FILES['file']['name']);
$filePath = $uploadDir . $fileName;
if (!move_uploaded_file($_FILES['file']['tmp_name'], $filePath)) {
    echo json_encode(["error" => "Failed to move uploaded file"]);
    exit;
}
// Adjust URL as needed
$fileUrl = 'http://localhost/admin_dashboard_backend/' . $filePath;

// Insert product
$stmt = $conn->prepare("INSERT INTO products (name, description, price, file_url) VALUES (?, ?, ?, ?)");
if (!$stmt) {
    echo json_encode(["error" => "Failed to prepare statement: " . $conn->error]);
    exit;
}
$stmt->bind_param("ssds", $name, $description, $price, $fileUrl);

if ($stmt->execute()) {
    $productId = $stmt->insert_id;
    // Retrieve the newly created record for audit logging
    $getStmt = $conn->prepare("SELECT * FROM products WHERE id = ?");
    $getStmt->bind_param("i", $productId);
    $getStmt->execute();
    $newProduct = $getStmt->get_result()->fetch_assoc();
    $getStmt->close();

    // Log the audit trail with action 'CREATE'
    logAuditTrail(
        $conn,
        $user['id'],
        $user['first_name'],
        $user['role'],
        'CREATE',
        'products',
        null,
        $newProduct,
        "Created product: " . $newProduct['name']
    );

    echo json_encode(["message" => "Product added successfully", "product_id" => $productId]);
} else {
    echo json_encode(["error" => "Error adding product: " . $stmt->error]);
}
$stmt->close();
$conn->close();
?>
