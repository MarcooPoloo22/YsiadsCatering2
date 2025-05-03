<?php
session_start();

header('Access-Control-Allow-Origin: http://localhost:3000');
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if (!isset($_SESSION['user'])) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'User is not logged in.']);
    exit();
}

require_once 'audit_logger.php';

$host = 'localhost';
$dbname = 'asr';
$username = 'root';
$password = '';

// Create MySQLi connection
$conn = new mysqli($host, $username, $password, $dbname);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error', 
        'message' => 'Database connection failed: ' . $conn->connect_error
    ]);
    exit();
}

// Input validation
if (!isset($_POST['id'])) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid input data.']);
    exit();
}

$id = intval($_POST['id']);

// Get old appointment data for audit trail
$getOldStmt = $conn->prepare('SELECT * FROM bookings WHERE id = ?');
$getOldStmt->bind_param('i', $id);
$getOldStmt->execute();
$result = $getOldStmt->get_result();
$oldAppointment = $result->fetch_assoc();
$getOldStmt->close();

if (!$oldAppointment) {
    http_response_code(404);
    echo json_encode(['status' => 'error', 'message' => 'Appointment not found.']);
    exit();
}

// Process input data
$user_id = isset($_POST['user_id']) && $_POST['user_id'] !== '' ? intval($_POST['user_id']) : null;
$first_name = htmlspecialchars($_POST['first_name'] ?? '');
$last_name = htmlspecialchars($_POST['last_name'] ?? '');
$email = filter_var($_POST['email'] ?? '', FILTER_SANITIZE_EMAIL);
$contact_no = htmlspecialchars($_POST['contact_no'] ?? '');
$service_type = htmlspecialchars($_POST['service_type'] ?? '');
$branch_id = intval($_POST['branch_id'] ?? 0);
$staff_id = intval($_POST['staff_id'] ?? 0);
$appointment_date = $_POST['appointment_date'] ?? '';
$appointment_time = $_POST['appointment_time'] ?? '';
$status = in_array($_POST['status'] ?? 'pending', ['pending', 'confirmed', 'completed','cancelled']) ? $_POST['status'] : 'pending';
$rating = isset($_POST['rating']) && $_POST['rating'] !== '' ? intval($_POST['rating']) : null;

// Check slot availability
$checkStmt = $conn->prepare("
    SELECT COUNT(*) AS total_bookings 
    FROM bookings 
    WHERE appointment_date = ? 
    AND appointment_time = ? 
    AND status != 'cancelled'
    AND id != ?
");
$checkStmt->bind_param('ssi', $appointment_date, $appointment_time, $id);
$checkStmt->execute();
$checkResult = $checkStmt->get_result()->fetch_assoc();
$checkStmt->close();

if ($checkResult['total_bookings'] >= 2) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'The selected time slot is fully booked.']);
    exit();
}

// Handle file upload
$file_url = $oldAppointment['file_url'];
if (isset($_FILES['receipt_file']) && $_FILES['receipt_file']['error'] === UPLOAD_ERR_OK) {
    if (!is_dir('uploads')) {
        mkdir('uploads', 0777, true);
    }
    
    $tempPath = $_FILES['receipt_file']['tmp_name'];
    $originalName = basename($_FILES['receipt_file']['name']);
    $newFileName = uniqid('receipt_') . '_' . $originalName;
    $destination = 'uploads/' . $newFileName;

    if (move_uploaded_file($tempPath, $destination)) {
        $file_url = 'http://localhost/admin_dashboard_backend/' . $destination;
        // Delete old file if it exists
        if ($oldAppointment['file_url']) {
            $oldFilePath = str_replace('http://localhost/admin_dashboard_backend/', '', $oldAppointment['file_url']);
            if (file_exists($oldFilePath)) {
                @unlink($oldFilePath);
            }
        }
    }
}

// Update appointment
$updateStmt = $conn->prepare("
    UPDATE bookings SET 
        user_id = ?,
        first_name = ?,
        last_name = ?,
        email = ?,
        contact_no = ?,
        service_type = ?,
        branch_id = ?,
        staff_id = ?,
        appointment_date = ?,
        appointment_time = ?,
        status = ?,
        file_url = ?,
        rating = ?
    WHERE id = ?
");

$updateStmt->bind_param(
    'isssssiissssii',
    $user_id,
    $first_name,
    $last_name,
    $email,
    $contact_no,
    $service_type,
    $branch_id,
    $staff_id,
    $appointment_date,
    $appointment_time,
    $status,
    $file_url,
    $rating,
    $id
);

if ($updateStmt->execute()) {
    // Get updated appointment for audit trail
    $getNewStmt = $conn->prepare('SELECT * FROM bookings WHERE id = ?');
    $getNewStmt->bind_param('i', $id);
    $getNewStmt->execute();
    $newAppointment = $getNewStmt->get_result()->fetch_assoc();
    $getNewStmt->close();

    // Log audit trail
    $user = $_SESSION['user'];
    logAuditTrail(
        $conn,
        $user['id'],
        $user['first_name'],
        $user['role'],
        'UPDATE',
        'bookings',
        $oldAppointment,
        $newAppointment,
        "Updated appointment for " . $newAppointment['email']
    );

    echo json_encode(['status' => 'success', 'message' => 'Appointment updated successfully!']);
} else {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Failed to update appointment: ' . $conn->error
    ]);
}

$updateStmt->close();
$conn->close();
?>