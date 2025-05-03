<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

session_start();
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

// Get the raw POST data for DELETE request
$data = json_decode(file_get_contents("php://input"), true);
$id = $data['id'] ?? '';
if (empty($id)) {
    echo json_encode(["error" => "Surgery ID is required"]);
    exit;
}

// Fetch existing surgery record for audit logging
$stmt_sel = $conn->prepare("SELECT * FROM surgeries WHERE id = ?");
$stmt_sel->bind_param("i", $id);
$stmt_sel->execute();
$oldSurgery = $stmt_sel->get_result()->fetch_assoc();
$stmt_sel->close();

if (!$oldSurgery) {
    echo json_encode(["error" => "Surgery not found"]);
    exit;
}

// (Optional) If you manage associations (like surgery_branches or surgery_staff), delete them here.
// For example:
// $conn->query("DELETE FROM surgery_branches WHERE surgery_id = $id");
// $conn->query("DELETE FROM surgery_staff WHERE surgery_id = $id");

// Delete surgery
$stmt = $conn->prepare("DELETE FROM surgeries WHERE id = ?");
$stmt->bind_param("i", $id);
if ($stmt->execute()) {
    // Log the audit trail (action: DELETE; new value is null)
    logAuditTrail(
        $conn,
        $user['id'],
        $user['first_name'],
        $user['role'],
        'DELETE',
        'surgeries',
        $oldSurgery,
        null,
        "Deleted surgery: " . $oldSurgery['title']
    );
    echo json_encode(["status" => "success", "message" => "Surgery deleted successfully"]);
} else {
    echo json_encode(["error" => "Error deleting surgery: " . $stmt->error]);
}
$stmt->close();
$conn->close();
?>
