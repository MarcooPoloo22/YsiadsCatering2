<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

session_start();
if (!isset($_SESSION['user'])) {
    echo json_encode(["status" => "error", "message" => "User is not logged in."]);
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
    die(json_encode(["status" => "error", "message" => "Database connection failed: " . $conn->connect_error]));
}

// Get the raw POST data
$data = json_decode(file_get_contents("php://input"), true);
$id = $data['id'] ?? '';
if (empty($id)) {
    echo json_encode(["status" => "error", "message" => "Promo id is required"]);
    exit;
}

// Fetch the existing promo record for audit
$stmt_sel = $conn->prepare("SELECT * FROM promos WHERE id = ?");
$stmt_sel->bind_param("i", $id);
$stmt_sel->execute();
$oldPromo = $stmt_sel->get_result()->fetch_assoc();
$stmt_sel->close();

if (!$oldPromo) {
    echo json_encode(["status" => "error", "message" => "Promo not found"]);
    exit;
}

// Begin transaction
$conn->begin_transaction();
try {
    // Delete from promo_branches
    $stmt = $conn->prepare("DELETE FROM promo_branches WHERE promo_id = ?");
    $stmt->bind_param("i", $id);
    if (!$stmt->execute()) {
        throw new Exception("Failed to delete from promo_branches: " . $stmt->error);
    }
    $stmt->close();

    // Delete from promo_staff
    $stmt = $conn->prepare("DELETE FROM promo_staff WHERE promo_id = ?");
    $stmt->bind_param("i", $id);
    if (!$stmt->execute()) {
        throw new Exception("Failed to delete from promo_staff: " . $stmt->error);
    }
    $stmt->close();

    // Delete from promos
    $stmt = $conn->prepare("DELETE FROM promos WHERE id = ?");
    $stmt->bind_param("i", $id);
    if (!$stmt->execute()) {
        throw new Exception("Failed to delete from promos: " . $stmt->error);
    }
    $stmt->close();

    // Commit transaction
    $conn->commit();

    // Log audit trail (DELETE action, new value null)
    logAuditTrail(
        $conn,
        $user['id'],
        $user['first_name'],
        $user['role'],
        'DELETE',
        'promos',
        $oldPromo,
        null,
        "Deleted promo: " . $oldPromo['name']
    );

    echo json_encode(["status" => "success", "message" => "Promo deleted successfully"]);
} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}

$conn->close();
?>
