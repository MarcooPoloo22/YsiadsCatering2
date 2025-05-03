<?php
session_start();
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

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
    echo json_encode(["error" => "Database connection failed: " . $conn->connect_error]);
    exit;
}

// Retrieve form data via $_POST and file via $_FILES
$data = $_POST;
$file = $_FILES['image'] ?? null;

if (
    !isset($data['id'], $data['title'], $data['description'], $data['price'], 
           $data['duration'], $data['branch_ids'], $data['staff_ids'])
) {
    echo json_encode(["error" => "Invalid data received"]);
    exit;
}

$id = intval($data['id']);
$title = htmlspecialchars($data['title']);
$description = htmlspecialchars($data['description']);
$price = floatval($data['price']);
$duration = intval($data['duration']);
$branchIds = json_decode($data['branch_ids'], true);
$staffIds = json_decode($data['staff_ids'], true);

if (!is_array($branchIds) || !is_array($staffIds) ||
    count($branchIds) === 0 || count($staffIds) === 0) {
    echo json_encode(["error" => "branch_ids and staff_ids are required"]);
    exit;
}

// Fetch the current surgery record (old record) for audit trail
$stmt_old = $conn->prepare("SELECT * FROM surgeries WHERE id = ?");
$stmt_old->bind_param("i", $id);
$stmt_old->execute();
$oldSurgery = $stmt_old->get_result()->fetch_assoc();
$stmt_old->close();

if (!$oldSurgery) {
    echo json_encode(["error" => "Surgery not found"]);
    exit;
}

// Handle image upload if a new image is provided; otherwise, keep the existing image URL
$imageUrl = $oldSurgery['image_url'];
if ($file && $file['error'] === UPLOAD_ERR_OK) {
    $uploadDir = 'uploads/surgeries/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }
    $fileName = uniqid() . '-' . basename($file['name']);
    $filePath = $uploadDir . $fileName;
    if (move_uploaded_file($file['tmp_name'], $filePath)) {
        $imageUrl = 'http://localhost/admin_dashboard_backend/' . $filePath;
    } else {
        echo json_encode(["error" => "Failed to upload image"]);
        exit;
    }
}

// Update the surgeries record
$stmt = $conn->prepare("UPDATE surgeries SET title = ?, description = ?, price = ?, image_url = ?, duration = ? WHERE id = ?");
if (!$stmt) {
    echo json_encode(["error" => "Prepare failed: " . $conn->error]);
    exit;
}
$stmt->bind_param("ssdsii", $title, $description, $price, $imageUrl, $duration, $id);

if (!$stmt->execute()) {
    echo json_encode(["error" => "Error updating surgery: " . $stmt->error]);
    exit;
}
$stmt->close();

// (Optional) Update associations in surgery_branches and surgery_staff if applicable
// For example, you may remove and reinsert associations if you manage them.
// Here we assume your surgeries table manages its core data only.

// Fetch updated surgery record for audit trail
$stmt_new = $conn->prepare("SELECT * FROM surgeries WHERE id = ?");
$stmt_new->bind_param("i", $id);
$stmt_new->execute();
$newSurgery = $stmt_new->get_result()->fetch_assoc();
$stmt_new->close();

// Log the audit trail (action: UPDATE)
logAuditTrail(
    $conn,
    $user['id'],
    $user['first_name'],
    $user['role'],
    'UPDATE',
    'surgeries',
    $oldSurgery,
    $newSurgery,
    "Updated surgery: " . $newSurgery['title']
);

echo json_encode(["status" => "success", "message" => "Surgery updated successfully"]);
$conn->close();
?>
