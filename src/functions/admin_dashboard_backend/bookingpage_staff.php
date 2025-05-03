<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "asr";

// Get all required parameters
$branchId = isset($_GET['branchId']) ? $_GET['branchId'] : die(json_encode(["error" => "Branch ID required"]));
$serviceId = isset($_GET['serviceId']) ? $_GET['serviceId'] : die(json_encode(["error" => "Service ID required"]));
$serviceType = isset($_GET['type']) ? $_GET['type'] : die(json_encode(["error" => "Service type required"]));

// Determine bridge table and foreign key column based on service type
switch($serviceType) {
    case 'Surgery':
        $bridgeTable = 'surgery_staff';
        $foreignKey = 'surgery_id';
        break;
    case 'Promo':
        $bridgeTable = 'promo_staff';
        $foreignKey = 'promo_id';
        break;
    case 'Service':
        $bridgeTable = 'service_staff';
        $foreignKey = 'service_id';
        break;
    default:
        die(json_encode(["error" => "Invalid service type"]));
}

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

// Prepare query to get staff associated with both service and branch
$query = "SELECT s.* FROM staff s
          JOIN $bridgeTable bt ON s.id = bt.staff_id
          WHERE bt.$foreignKey = ? AND s.branch_id = ?";

$stmt = $conn->prepare($query);
if (!$stmt) {
    die(json_encode(["error" => "Prepare failed: " . $conn->error]));
}

$stmt->bind_param("ii", $serviceId, $branchId);

if (!$stmt->execute()) {
    die(json_encode(["error" => "Execute failed: " . $stmt->error]));
}

$result = $stmt->get_result();
$staff = $result->fetch_all(MYSQLI_ASSOC);

echo json_encode($staff);

$stmt->close();
$conn->close();
?>