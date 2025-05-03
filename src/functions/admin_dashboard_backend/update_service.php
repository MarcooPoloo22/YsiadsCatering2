<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

// Handle preflight requests (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

session_start();
if (!isset($_SESSION['user'])) {
    echo json_encode(['status' => 'error', 'message' => 'User is not logged in.']);
    exit;
}
$user = $_SESSION['user'];

require_once 'audit_logger.php';

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "asr";
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die(json_encode(['status' => 'error', 'message' => 'Database connection failed: ' . $conn->connect_error]));
}

// Retrieve POST data. (Assuming the form submits as multipart/form-data)
$id = $_POST['id'] ?? '';
$name = $_POST['name'] ?? '';
$description = $_POST['description'] ?? '';
$price = $_POST['price'] ?? '';
$duration = $_POST['duration'] ?? '';

// Decode JSON arrays from the keys used in add_service.php
$branch_ids = json_decode($_POST['selectedBranches'] ?? '[]', true);
$staff_ids = json_decode($_POST['selectedStaff'] ?? '[]', true);

// Validate required fields
$required = [
    'id' => $id,
    'name' => $name,
    'description' => $description,
    'price' => $price,
    'duration' => $duration,
    'selectedBranches' => $branch_ids,
    'selectedStaff' => $staff_ids
];
foreach ($required as $key => $value) {
    // For arrays, check if there is at least one element
    if ((is_array($value) && count($value) === 0) || empty($value)) {
        echo json_encode(['status' => 'error', 'message' => "$key is required"]);
        exit;
    }
}

// Handle file upload if a new file is provided
$file_url = '';
if (!empty($_FILES['file']['name']) && $_FILES['file']['error'] == 0) {
    $target_dir = "uploads/";
    if (!file_exists($target_dir)) {
        mkdir($target_dir, 0777, true);
    }
    $target_file = $target_dir . basename($_FILES['file']['name']);
    if (move_uploaded_file($_FILES['file']['tmp_name'], $target_file)) {
        $file_url = $target_file;
    }
}

// If no new file was uploaded, keep the existing file_url
if (empty($file_url)) {
    $stmt_file = $conn->prepare("SELECT file_url FROM services WHERE id = ?");
    $stmt_file->bind_param("i", $id);
    $stmt_file->execute();
    $stmt_file->bind_result($existing_file_url);
    $stmt_file->fetch();
    $file_url = $existing_file_url;
    $stmt_file->close();
}

// Fetch the current service record (old record) for auditing
$stmt_old = $conn->prepare("SELECT * FROM services WHERE id = ?");
$stmt_old->bind_param("i", $id);
$stmt_old->execute();
$oldService = $stmt_old->get_result()->fetch_assoc();
$stmt_old->close();

$conn->begin_transaction();

try {
    // Update the services table
    $stmt = $conn->prepare("UPDATE services SET name = ?, description = ?, price = ?, file_url = ?, duration = ? WHERE id = ?");
    if (!$stmt) {
        throw new Exception("Failed to prepare statement: " . $conn->error);
    }
    $stmt->bind_param("ssdsii", $name, $description, $price, $file_url, $duration, $id);
    if (!$stmt->execute()) {
        throw new Exception("Failed to update service: " . $stmt->error);
    }
    $stmt->close();

    // Delete existing branch associations
    $stmt = $conn->prepare("DELETE FROM service_branches WHERE service_id = ?");
    $stmt->bind_param("i", $id);
    if (!$stmt->execute()) {
        throw new Exception("Failed to delete branch associations: " . $stmt->error);
    }
    $stmt->close();

    // Insert new branch associations
    foreach ($branch_ids as $branch_id) {
        $stmt = $conn->prepare("INSERT INTO service_branches (service_id, branch_id) VALUES (?, ?)");
        $stmt->bind_param("ii", $id, $branch_id);
        if (!$stmt->execute()) {
            throw new Exception("Failed to insert branch association: " . $stmt->error);
        }
        $stmt->close();
    }

    // Delete existing staff associations
    $stmt = $conn->prepare("DELETE FROM service_staff WHERE service_id = ?");
    $stmt->bind_param("i", $id);
    if (!$stmt->execute()) {
        throw new Exception("Failed to delete staff associations: " . $stmt->error);
    }
    $stmt->close();

    // Insert new staff associations
    foreach ($staff_ids as $staff_id) {
        $stmt = $conn->prepare("INSERT INTO service_staff (service_id, staff_id) VALUES (?, ?)");
        $stmt->bind_param("ii", $id, $staff_id);
        if (!$stmt->execute()) {
            throw new Exception("Failed to insert staff association: " . $stmt->error);
        }
        $stmt->close();
    }

    // Commit the transaction
    $conn->commit();

    // Fetch the updated service record for audit trail
    $stmt_new = $conn->prepare("SELECT * FROM services WHERE id = ?");
    $stmt_new->bind_param("i", $id);
    $stmt_new->execute();
    $newService = $stmt_new->get_result()->fetch_assoc();
    $stmt_new->close();

    // Log the audit trail (action: UPDATE)
    logAuditTrail(
        $conn,
        $user['id'],
        $user['first_name'],
        $user['role'],
        'UPDATE',
        'services',
        $oldService,
        $newService,
        "Updated service: " . $name
    );

    echo json_encode(['status' => 'success', 'message' => 'Service updated successfully']);
} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}

$conn->close();
?>
