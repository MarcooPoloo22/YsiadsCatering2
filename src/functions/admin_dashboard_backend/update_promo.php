<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

// Handle preflight
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

// Database connection
$servername = "localhost";
$dbUsername = "root";
$dbPassword = "";
$dbname = "asr";
$conn = new mysqli($servername, $dbUsername, $dbPassword, $dbname);
if ($conn->connect_error) {
    die(json_encode(['status' => 'error', 'message' => 'Database connection failed: ' . $conn->connect_error]));
}

// Retrieve form data; using $_POST and $_FILES (multipart/form-data)
$data = $_POST;
$file = $_FILES['file'] ?? null;

if (
    !isset($data['id']) ||
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

$id = $data['id'];
$name = $data['name'];
$description = $data['description'];
$price = $data['price'];
$startDate = $data['start_date'];
$endDate = $data['end_date'];
$duration = $data['duration'];
$branchIds = json_decode($data['branch_ids'], true);
$staffIds = json_decode($data['staff_ids'], true);

// Validate required fields
$required = [
    'id' => $id, 
    'name' => $name, 
    'description' => $description, 
    'price' => $price, 
    'start_date' => $startDate, 
    'end_date' => $endDate, 
    'duration' => $duration, 
    'branch_ids' => $branchIds, 
    'staff_ids' => $staffIds
];
foreach ($required as $key => $value) {
    if ((is_array($value) && count($value) === 0) || empty($value)) {
        echo json_encode(['status' => 'error', 'message' => "$key is required"]);
        exit;
    }
}

// Handle file upload if provided
$fileUrl = null;
if (!empty($file['name']) && $file['error'] == UPLOAD_ERR_OK) {
    $uploadDir = 'uploads/';
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }
    $fileName = uniqid() . '-' . basename($file['name']);
    $filePath = $uploadDir . $fileName;
    if (move_uploaded_file($file['tmp_name'], $filePath)) {
        $fileUrl = 'http://localhost/admin_dashboard_backend/' . $filePath;
    } else {
        echo json_encode(["error" => "Failed to upload file"]);
        exit;
    }
}

// If no new file, keep existing file_url
if (empty($fileUrl)) {
    $stmt_file = $conn->prepare("SELECT file_url FROM promos WHERE id = ?");
    $stmt_file->bind_param("i", $id);
    $stmt_file->execute();
    $stmt_file->bind_result($existing_file_url);
    $stmt_file->fetch();
    $fileUrl = $existing_file_url;
    $stmt_file->close();
}

// Fetch current promo record for audit (old record)
$stmt_old = $conn->prepare("SELECT * FROM promos WHERE id = ?");
$stmt_old->bind_param("i", $id);
$stmt_old->execute();
$oldPromo = $stmt_old->get_result()->fetch_assoc();
$stmt_old->close();

// Begin transaction
$conn->begin_transaction();

try {
    // Update the promos table
    $stmt = $conn->prepare("UPDATE promos SET name = ?, description = ?, price = ?, file_url = ?, start_date = ?, end_date = ?, duration = ? WHERE id = ?");
    if (!$stmt) {
        throw new Exception("Failed to prepare statement: " . $conn->error);
    }
    $stmt->bind_param("ssdsssii", $name, $description, $price, $fileUrl, $startDate, $endDate, $duration, $id);
    if (!$stmt->execute()) {
        throw new Exception("Failed to update promo: " . $stmt->error);
    }
    $stmt->close();

    // Delete existing branch associations
    $stmt = $conn->prepare("DELETE FROM promo_branches WHERE promo_id = ?");
    $stmt->bind_param("i", $id);
    if (!$stmt->execute()) {
        throw new Exception("Failed to delete branch associations: " . $stmt->error);
    }
    $stmt->close();

    // Insert new branch associations
    foreach ($branchIds as $branchId) {
        $stmt = $conn->prepare("INSERT INTO promo_branches (promo_id, branch_id) VALUES (?, ?)");
        $stmt->bind_param("ii", $id, $branchId);
        if (!$stmt->execute()) {
            throw new Exception("Failed to insert branch association: " . $stmt->error);
        }
        $stmt->close();
    }

    // Delete existing staff associations
    $stmt = $conn->prepare("DELETE FROM promo_staff WHERE promo_id = ?");
    $stmt->bind_param("i", $id);
    if (!$stmt->execute()) {
        throw new Exception("Failed to delete staff associations: " . $stmt->error);
    }
    $stmt->close();

    // Insert new staff associations
    foreach ($staffIds as $staffId) {
        $stmt = $conn->prepare("INSERT INTO promo_staff (promo_id, staff_id) VALUES (?, ?)");
        $stmt->bind_param("ii", $id, $staffId);
        if (!$stmt->execute()) {
            throw new Exception("Failed to insert staff association: " . $stmt->error);
        }
        $stmt->close();
    }

    // Commit transaction
    $conn->commit();

    // Fetch updated promo record for audit trail
    $stmt_new = $conn->prepare("SELECT * FROM promos WHERE id = ?");
    $stmt_new->bind_param("i", $id);
    $stmt_new->execute();
    $newPromo = $stmt_new->get_result()->fetch_assoc();
    $stmt_new->close();

    // Log the audit trail (UPDATE)
    logAuditTrail(
        $conn,
        $user['id'],
        $user['first_name'],
        $user['role'],
        'UPDATE',
        'promos',
        $oldPromo,
        $newPromo,
        "Updated promo: " . $name
    );

    echo json_encode(["status" => "success", "message" => "Promo updated successfully"]);
} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}

$conn->close();
?>
