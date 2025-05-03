<?php
session_start();

header('Access-Control-Allow-Origin: http://localhost:3000');
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header( 'Access-Control-Allow-Credentials: true' );
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if (!isset($_SESSION['user'])) {
    echo json_encode(['error' => 'User is not logged in.']);
    exit;
}

require_once 'audit_logger.php';

$host     = 'localhost';
$dbname   = 'asr';
$username = 'root';
$password = '';

$conn = new mysqli($host, $username, $password, $dbname);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed: ' . $conn->connect_error]);
    exit();
}

// Gather POST data
$user_id          = isset($_POST['user_id']) && $_POST['user_id'] !== '' ? intval($_POST['user_id']) : null;
$first_name       = $_POST['first_name']       ?? null;
$last_name        = $_POST['last_name']        ?? null;
$email            = $_POST['email']            ?? null;
$contact_no       = $_POST['contact_no']       ?? null;
$service_type     = $_POST['service_type']     ?? null;
$branch_id        = isset($_POST['branch_id']) ? intval($_POST['branch_id']) : null;
$staff_id         = isset($_POST['staff_id'])  ? intval($_POST['staff_id'])  : null;
$appointment_date = $_POST['appointment_date'] ?? null;
$appointment_time = $_POST['appointment_time'] ?? null;
$rating           = isset($_POST['rating']) && $_POST['rating'] !== '' ? intval($_POST['rating']) : null;

// Basic validation
if (
    !$first_name || !$last_name || !$email || !$contact_no ||
    !$service_type || !$branch_id || !$staff_id ||
    !$appointment_date || !$appointment_time
) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields.']);
    exit();
}

// Check slot availability
$sqlCheck = "SELECT COUNT(*) AS total_bookings FROM bookings 
            WHERE appointment_date = ? AND appointment_time = ? AND status != 'cancelled'";
$checkStmt = $conn->prepare($sqlCheck);
if (!$checkStmt) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to prepare slot check statement: ' . $conn->error]);
    exit();
}
$checkStmt->bind_param('ss', $appointment_date, $appointment_time);
$checkStmt->execute();
$checkResult = $checkStmt->get_result();
$row = $checkResult->fetch_assoc();
$existingCount = $row['total_bookings'] ?? 0;

if ($existingCount >= 2) {
    http_response_code(400);
    echo json_encode(['error' => 'The selected time slot is fully booked.']);
    exit();
}

// Handle file upload
$newFileUrl = null;
if (isset($_FILES['receipt_file']) && $_FILES['receipt_file']['error'] === UPLOAD_ERR_OK) {
    if (!is_dir('uploads')) mkdir('uploads', 0777, true);
    
    $tempPath     = $_FILES['receipt_file']['tmp_name'];
    $originalName = basename($_FILES['receipt_file']['name']);
    $newFileName  = uniqid('receipt_') . '_' . $originalName;
    $destination  = 'uploads/' . $newFileName;

    if (move_uploaded_file($tempPath, $destination)) {
        $newFileUrl = 'http://localhost/admin_dashboard_backend/' . $destination;
    }
}

// Insert appointment
$sqlInsert = "INSERT INTO bookings (
    user_id, first_name, last_name, email, contact_no, 
    service_type, branch_id, staff_id, appointment_date, 
    appointment_time, status, file_url, rating
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)";

$insertStmt = $conn->prepare($sqlInsert);
if (!$insertStmt) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to prepare insert statement: ' . $conn->error]);
    exit();
}

$insertStmt->bind_param(
    'isssssiisssi',
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
    $newFileUrl,
    $rating
);

if ($insertStmt->execute()) {
    $newId = $conn->insert_id;
    
    // Get created appointment
    $getStmt = $conn->prepare("SELECT * FROM bookings WHERE id = ?");
    $getStmt->bind_param("i", $newId);
    $getStmt->execute();
    $newAppointment = $getStmt->get_result()->fetch_assoc();
    $getStmt->close();

    // Log audit trail
    $user = $_SESSION['user'];
    logAuditTrail(
        $conn,
        $user['id'],
        $user['first_name'],
        $user['role'],
        'CREATE',
        'bookings',
        null,
        $newAppointment,
        "Created appointment for: " . $newAppointment['email']
    );

    echo json_encode(['message' => 'Appointment added successfully.']);
} else {
    http_response_code(400);
    echo json_encode(['error' => 'Failed to add appointment.']);
}

$insertStmt->close();
$conn->close();
?>