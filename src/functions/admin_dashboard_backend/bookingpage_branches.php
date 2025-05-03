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

$serviceId = isset($_GET['serviceId']) ? $_GET['serviceId'] : die(json_encode(["error" => "Service ID required"]));
$serviceType = isset($_GET['type']) ? $_GET['type'] : die(json_encode(["error" => "Service type required"]));

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

// Determine bridge table and foreign key column
switch($serviceType) {
    case 'Surgery':
        $bridgeTable = 'surgery_branches';
        $foreignKey = 'surgery_id';
        break;
    case 'Promo':
        $bridgeTable = 'promo_branches';
        $foreignKey = 'promo_id';
        break;
    case 'Service':
        $bridgeTable = 'service_branches';
        $foreignKey = 'service_id';
        break;
    default:
        die(json_encode(["error" => "Invalid service type"]));
}

$query = "SELECT b.* FROM branches b
          JOIN $bridgeTable sb ON b.id = sb.branch_id
          WHERE sb.$foreignKey = ?"; // Use dynamic foreign key column

$stmt = $conn->prepare($query);
if (!$stmt) {
    die(json_encode(["error" => "Prepare failed: " . $conn->error]));
}

$stmt->bind_param("i", $serviceId);

if (!$stmt->execute()) {
    die(json_encode(["error" => "Execute failed: " . $stmt->error]));
}

$result = $stmt->get_result();
$branches = $result->fetch_all(MYSQLI_ASSOC);

echo json_encode($branches);

$stmt->close();
$conn->close();
?>