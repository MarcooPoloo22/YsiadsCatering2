<?php
// branch_assign_branch.php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "asr";

$data = json_decode(file_get_contents('php://input'), true);
$id = $data['id'] ?? '';

if (empty($id)) {
    echo json_encode(['status' => 'error', 'message' => 'Branch id is required']);
    exit;
}

// For example, you might want to verify that the branch exists.
// (In a real-world scenario you might also record an assignment in another table.)
$stmt = $conn->prepare("SELECT id FROM branches WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    // Branch exists – proceed with any additional logic if needed.
    echo json_encode(['status' => 'success']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Branch not found']);
}
$stmt->close();
?>
