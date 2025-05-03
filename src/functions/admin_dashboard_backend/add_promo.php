<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);
ini_set('error_log', 'php_errors.log');

// CORS and content type headers
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE, PUT");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Start session and check user
session_start();
if (!isset($_SESSION['user'])) {
    echo json_encode(['status' => 'error', 'message' => 'User is not logged in.']);
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
    die(json_encode(["error" => "Database connection failed: " . $conn->connect_error]));
}

// Using $_POST for form fields and $_FILES for file uploads
$data = $_POST;
$file = $_FILES['file'] ?? null;

if (
    !isset($data['name']) ||
    !isset($data['description']) ||
    !isset($data['price']) ||
    !isset($data['start_date']) ||
    !isset($data['end_date']) ||
    !isset($data['duration']) ||
    !isset($data['branch_ids']) ||
    !isset($data['staff_ids'])
) {
    echo json_encode(["error" => "Invalid data received"]);
    exit;
}

$name = $data['name'];
$description = $data['description'];
$price = $data['price'];
$startDate = $data['start_date'];
$endDate = $data['end_date'];
$duration = $data['duration'];
// branch_ids and staff_ids are sent as JSON strings; decode to arrays
$branchIds = json_decode($data['branch_ids'], true);
$staffIds = json_decode($data['staff_ids'], true);

// Validate required fields (check for non-empty arrays for associations)
if (empty($name) || empty($description) || empty($price) || empty($startDate) || empty($endDate) || empty($duration) ||
    !is_array($branchIds) || count($branchIds) === 0 ||
    !is_array($staffIds) || count($staffIds) === 0) {
    echo json_encode(["error" => "All fields are required"]);
    exit;
}

// (Optional) Validate that each branch and staff ID exists…
foreach ($branchIds as $branchId) {
    $stmt = $conn->prepare("SELECT id FROM branches WHERE id = ?");
    $stmt->bind_param("i", $branchId);
    $stmt->execute();
    $stmt->store_result();
    if ($stmt->num_rows === 0) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid branch ID: ' . $branchId]);
        exit;
    }
    $stmt->close();
}
foreach ($staffIds as $staffId) {
    $stmt = $conn->prepare("SELECT id FROM staff WHERE id = ?");
    $stmt->bind_param("i", $staffId);
    $stmt->execute();
    $stmt->store_result();
    if ($stmt->num_rows === 0) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid staff ID: ' . $staffId]);
        exit;
    }
    $stmt->close();
}

// Handle file upload
$fileUrl = null;
if ($file && $file['error'] === UPLOAD_ERR_OK) {
    $uploadDir = 'uploads/';
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }
    // Generate a unique file name
    $fileName = uniqid() . '-' . basename($file['name']);
    $filePath = $uploadDir . $fileName;
    if (move_uploaded_file($file['tmp_name'], $filePath)) {
        // Adjust the URL as needed
        $fileUrl = 'http://localhost/admin_dashboard_backend/' . $filePath;
    } else {
        echo json_encode(["error" => "Failed to upload file"]);
        exit;
    }
} else {
    echo json_encode(["error" => "File upload is required"]);
    exit;
}

// Insert into promos table
$sql = "INSERT INTO promos (name, description, price, file_url, start_date, end_date, duration) VALUES (?, ?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode(['status' => 'error', 'message' => 'Failed to prepare statement: ' . $conn->error]);
    exit;
}
$stmt->bind_param("ssdsssi", $name, $description, $price, $fileUrl, $startDate, $endDate, $duration);
if ($stmt->execute()) {
    $promoId = $stmt->insert_id;
    // Retrieve the new promo record for audit trail
    $getStmt = $conn->prepare("SELECT * FROM promos WHERE id = ?");
    $getStmt->bind_param("i", $promoId);
    $getStmt->execute();
    $newPromo = $getStmt->get_result()->fetch_assoc();
    $getStmt->close();

    // Insert associations into promo_branches
    foreach ($branchIds as $branchId) {
        $stmt_branch = $conn->prepare("INSERT INTO promo_branches (promo_id, branch_id) VALUES (?, ?)");
        $stmt_branch->bind_param("ii", $promoId, $branchId);
        if (!$stmt_branch->execute()) {
            echo json_encode(['status' => 'error', 'message' => 'Failed to insert into promo_branches: ' . $stmt_branch->error]);
            exit;
        }
        $stmt_branch->close();
    }
    // Insert associations into promo_staff
    foreach ($staffIds as $staffId) {
        $stmt_staff = $conn->prepare("INSERT INTO promo_staff (promo_id, staff_id) VALUES (?, ?)");
        $stmt_staff->bind_param("ii", $promoId, $staffId);
        if (!$stmt_staff->execute()) {
            echo json_encode(['status' => 'error', 'message' => 'Failed to insert into promo_staff: ' . $stmt_staff->error]);
            exit;
        }
        $stmt_staff->close();
    }

    // Log audit trail with action CREATE
    logAuditTrail(
        $conn,
        $user['id'],
        $user['first_name'],
        $user['role'],
        'CREATE',
        'promos',
        null,
        $newPromo,
        "Created promo: " . $name
    );

    echo json_encode(["status" => "success", "message" => "Promo added successfully", "promo_id" => $promoId]);
} else {
    echo json_encode(["status" => "error", "message" => "Error adding promo: " . $stmt->error]);
}
$stmt->close();
$conn->close();
?>
