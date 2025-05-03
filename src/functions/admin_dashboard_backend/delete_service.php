<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
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

$data = json_decode(file_get_contents('php://input'), true);
$id = $data['id'] ?? '';
if (empty($id)) {
    echo json_encode(['status' => 'error', 'message' => 'Service id is required']);
    exit;
}

// Fetch the service record before deletion for audit trail
$stmt_sel = $conn->prepare("SELECT * FROM services WHERE id = ?");
$stmt_sel->bind_param("i", $id);
$stmt_sel->execute();
$oldService = $stmt_sel->get_result()->fetch_assoc();
$stmt_sel->close();

if (!$oldService) {
    echo json_encode(['status' => 'error', 'message' => 'Service not found']);
    exit;
}

// Begin a transaction
$conn->begin_transaction();
try {
    // Delete from service_branches
    $stmt = $conn->prepare("DELETE FROM service_branches WHERE service_id = ?");
    $stmt->bind_param("i", $id);
    if (!$stmt->execute()) {
        throw new Exception("Failed to delete from service_branches: " . $stmt->error);
    }
    $stmt->close();

    // Delete from service_staff
    $stmt = $conn->prepare("DELETE FROM service_staff WHERE service_id = ?");
    $stmt->bind_param("i", $id);
    if (!$stmt->execute()) {
        throw new Exception("Failed to delete from service_staff: " . $stmt->error);
    }
    $stmt->close();

    // Delete from services
    $stmt = $conn->prepare("DELETE FROM services WHERE id = ?");
    $stmt->bind_param("i", $id);
    if (!$stmt->execute()) {
        throw new Exception("Failed to delete from services: " . $stmt->error);
    }
    $stmt->close();

    // Commit the transaction
    $conn->commit();

    // Log the audit trail (action: DELETE) – new value is null
    logAuditTrail(
        $conn,
        $user['id'],
        $user['first_name'],
        $user['role'],
        'DELETE',
        'services',
        $oldService,
        null,
        "Deleted service: " . $oldService['name']
    );

    echo json_encode(['status' => 'success', 'message' => 'Service deleted successfully']);
} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}

$conn->close();
?>
