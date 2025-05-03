<?php
session_start();
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Check if user is logged in
if (!isset($_SESSION['user'])) {
    http_response_code(401);
    echo json_encode(["error" => "User is not authenticated"]);
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

// Retrieve form data via $_POST and file (if any) via $_FILES
$id = $_POST['id'] ?? '';
$name = $_POST['name'] ?? '';
$description = $_POST['description'] ?? '';
$price = $_POST['price'] ?? '';

// Validate required fields
if (empty($id) || empty($name) || empty($description) || empty($price)) {
    echo json_encode(["error" => "ID, name, description, and price are required"]);
    exit;
}

// Fetch the current product record (old record) for auditing
$stmt_old = $conn->prepare("SELECT * FROM products WHERE id = ?");
$stmt_old->bind_param("i", $id);
$stmt_old->execute();
$oldProduct = $stmt_old->get_result()->fetch_assoc();
$stmt_old->close();

if (!$oldProduct) {
    echo json_encode(["error" => "Product not found"]);
    exit;
}

// Handle file upload if a new file is provided; otherwise use the existing file_url
$fileUrl = $oldProduct['file_url'];
if (isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
    $uploadDir = 'uploads/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }
    $fileName = uniqid() . '-' . basename($_FILES['file']['name']);
    $filePath = $uploadDir . $fileName;
    if (move_uploaded_file($_FILES['file']['tmp_name'], $filePath)) {
        $fileUrl = 'http://localhost/admin_dashboard_backend/' . $filePath;
    } else {
        echo json_encode(["error" => "Failed to upload file"]);
        exit;
    }
}

// Update the product
$stmt = $conn->prepare("UPDATE products SET name=?, description=?, price=?, file_url=? WHERE id=?");
if (!$stmt) {
    echo json_encode(["error" => "Failed to prepare update statement: " . $conn->error]);
    exit;
}
$stmt->bind_param("ssdsi", $name, $description, $price, $fileUrl, $id);
if ($stmt->execute()) {
    // Fetch updated record for audit logging
    $stmt_new = $conn->prepare("SELECT * FROM products WHERE id = ?");
    $stmt_new->bind_param("i", $id);
    $stmt_new->execute();
    $newProduct = $stmt_new->get_result()->fetch_assoc();
    $stmt_new->close();

    // Log the audit trail with action 'UPDATE'
    logAuditTrail(
        $conn,
        $user['id'],
        $user['first_name'],
        $user['role'],
        'UPDATE',
        'products',
        $oldProduct,
        $newProduct,
        "Updated product: " . $newProduct['name']
    );

    echo json_encode(["message" => "Product updated successfully"]);
} else {
    echo json_encode(["error" => "Error updating product: " . $stmt->error]);
}
$stmt->close();
$conn->close();
?>
