<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "asr";

$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    http_response_code(500);
    die(json_encode([
        'success' => false,
        'message' => 'Connection failed: ' . $conn->connect_error
    ]));
}

try {
    // Get branch IDs from query parameter
    if (!isset($_GET['branch_ids'])) {
        http_response_code(400);
        throw new Exception('Branch IDs are required');
    }

    $branchIds = explode(",", $_GET['branch_ids']);
    
    // Validate and sanitize branch IDs
    $validBranchIds = array();
    foreach ($branchIds as $id) {
        $id = trim($id);
        if (is_numeric($id)) {
            $validBranchIds[] = (int)$id;
        }
    }

    if (empty($validBranchIds)) {
        http_response_code(400);
        throw new Exception('Invalid branch IDs');
    }

    // Create placeholders for prepared statement
    $placeholders = implode(',', array_fill(0, count($validBranchIds), '?'));
    $types = str_repeat('i', count($validBranchIds));
    
    // Prepare and execute query with is_surgery_staff
    $sql = "SELECT staff.id, staff.name, staff.is_surgery_staff, branches.name AS branch_name 
            FROM staff 
            JOIN branches ON staff.branch_id = branches.id 
            WHERE staff.branch_id IN ($placeholders)";
    
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        throw new Exception('Prepare failed: ' . $conn->error);
    }

    $stmt->bind_param($types, ...$validBranchIds);
    $stmt->execute();
    $result = $stmt->get_result();

    if (!$result) {
        throw new Exception('Query failed: ' . $conn->error);
    }

    $staff = [];
    while ($row = $result->fetch_assoc()) {
        $staff[] = [
            'id' => $row['id'],
            'name' => $row['name'],
            'is_surgery_staff' => (int)$row['is_surgery_staff'], // Ensure integer
            'branch_name' => $row['branch_name']
        ];
    }

    echo json_encode([
        'success' => true,
        'data' => $staff
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
} finally {
    if (isset($stmt)) {
        $stmt->close();
    }
    $conn->close();
}
?>