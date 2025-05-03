<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/php_errors.log');

// Set CORS headers
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "asr";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

// Get POST data and uploaded file
$data = $_POST;
$file = $_FILES['image'] ?? null;

try {
    // Validate surgery ID
    if (!isset($data['id'])) {
        throw new Exception("Missing surgery ID");
    }

    $surgeryId = intval($data['id']);
    if ($surgeryId <= 0) {
        throw new Exception("Invalid surgery ID");
    }

    // Validate branch_ids and staff_ids
    if (!isset($data['branch_ids']) || !isset($data['staff_ids'])) {
        throw new Exception("Missing branch_ids or staff_ids");
    }

    $branchIds = json_decode($data['branch_ids'], true);
    $staffIds = json_decode($data['staff_ids'], true);

    if (!is_array($branchIds) || !is_array($staffIds)) {
        throw new Exception("Invalid branch_ids or staff_ids format");
    }

    // Handle image upload
    $imageUrl = null;
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
            throw new Exception("Failed to upload image");
        }
    } else {
        throw new Exception("No image file uploaded or upload error");
    }

    // Update surgery with new image URL, branch_ids, and staff_ids
    $stmt = $conn->prepare("UPDATE surgeries SET image_url = ?, branch_ids = ?, staff_ids = ? WHERE id = ?");
    if (!$stmt) {
        throw new Exception("Prepare failed: " . $conn->error);
    }
    $stmt->bind_param("sssi", $imageUrl, json_encode($branchIds), json_encode($staffIds), $surgeryId);

    if (!$stmt->execute()) {
        throw new Exception("Error updating surgery: " . $stmt->error);
    }

    $stmt->close();

    // Return success response
    echo json_encode([
        "success" => true,
        "message" => "Surgery updated successfully",
        "image_url" => $imageUrl,
    ]);
} catch (Exception $e) {
    // Return error response
    http_response_code(400);
    echo json_encode(["error" => $e->getMessage()]);
}

$conn->close();
?>