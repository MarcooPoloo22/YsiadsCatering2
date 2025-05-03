<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Log errors to a file
ini_set('log_errors', 1);
ini_set('error_log', 'php_errors.log');

// CORS headers
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE, PUT");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight requests (OPTIONS)
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
$username = "root";
$password = "";
$dbname = "asr";
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed: " . $conn->connect_error]));
}

// Get form data (from POST variables)
$name = $_POST['name'] ?? '';
$description = $_POST['description'] ?? '';
$price = $_POST['price'] ?? '';
$duration = $_POST['duration'] ?? '';

// Decode JSON arrays for branches and staff
$branch_ids = isset($_POST['selectedBranches']) ? json_decode($_POST['selectedBranches'], true) : [];
$staff_ids = isset($_POST['selectedStaff']) ? json_decode($_POST['selectedStaff'], true) : [];

// Validate required fields
if (empty($name) || empty($description) || empty($price) || empty($duration) || empty($branch_ids) || empty($staff_ids)) {
    echo json_encode(['status' => 'error', 'message' => 'All fields are required']);
    exit;
}

// Validate branch IDs
foreach ($branch_ids as $branch_id) {
    $stmt = $conn->prepare("SELECT id FROM branches WHERE id = ?");
    $stmt->bind_param("i", $branch_id);
    $stmt->execute();
    $stmt->store_result();
    if ($stmt->num_rows === 0) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid branch ID: ' . $branch_id]);
        exit;
    }
    $stmt->close();
}

// Validate staff IDs
foreach ($staff_ids as $staff_id) {
    $stmt = $conn->prepare("SELECT id FROM staff WHERE id = ?");
    $stmt->bind_param("i", $staff_id);
    $stmt->execute();
    $stmt->store_result();
    if ($stmt->num_rows === 0) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid staff ID: ' . $staff_id]);
        exit;
    }
    $stmt->close();
}

// Handle file upload
$file_url = '';
if (isset($_FILES['file'])) {
    if ($_FILES['file']['error'] == UPLOAD_ERR_OK) {
        $target_dir = "uploads/";
        if (!file_exists($target_dir)) {
            mkdir($target_dir, 0777, true);
        }
        $target_file = $target_dir . basename($_FILES['file']['name']);
        if (move_uploaded_file($_FILES['file']['tmp_name'], $target_file)) {
            $file_url = $target_file;
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Failed to move uploaded file']);
            exit;
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'File upload error: ' . $_FILES['file']['error']]);
        exit;
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'File upload is required']);
    exit;
}

// Insert into services
$stmt = $conn->prepare("INSERT INTO services (name, description, price, file_url, duration) VALUES (?, ?, ?, ?, ?)");
if (!$stmt) {
    echo json_encode(['status' => 'error', 'message' => 'Failed to prepare statement: ' . $conn->error]);
    exit;
}
$stmt->bind_param("ssdsi", $name, $description, $price, $file_url, $duration);
if ($stmt->execute()) {
    $service_id = $stmt->insert_id;
    // Get the newly created service record for logging
    $getStmt = $conn->prepare("SELECT * FROM services WHERE id = ?");
    $getStmt->bind_param("i", $service_id);
    $getStmt->execute();
    $newService = $getStmt->get_result()->fetch_assoc();
    $getStmt->close();

    // Insert into service_branches
    foreach ($branch_ids as $branch_id) {
        $stmt_branch = $conn->prepare("INSERT INTO service_branches (service_id, branch_id) VALUES (?, ?)");
        $stmt_branch->bind_param("ii", $service_id, $branch_id);
        if (!$stmt_branch->execute()) {
            echo json_encode(['status' => 'error', 'message' => 'Failed to insert into service_branches: ' . $stmt_branch->error]);
            exit;
        }
        $stmt_branch->close();
    }

    // Insert into service_staff
    foreach ($staff_ids as $staff_id) {
        $stmt_staff = $conn->prepare("INSERT INTO service_staff (service_id, staff_id) VALUES (?, ?)");
        $stmt_staff->bind_param("ii", $service_id, $staff_id);
        if (!$stmt_staff->execute()) {
            echo json_encode(['status' => 'error', 'message' => 'Failed to insert into service_staff: ' . $stmt_staff->error]);
            exit;
        }
        $stmt_staff->close();
    }

    // Log the audit trail (action: CREATE)
    logAuditTrail(
        $conn,
        $user['id'],
        $user['first_name'],
        $user['role'],
        'CREATE',
        'services',
        null,
        $newService,
        "Created service: " . $name
    );

    echo json_encode(['status' => 'success', 'message' => 'Service added successfully', 'id' => $service_id]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to add service: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
