<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json; charset=UTF-8");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "asr";

$type = isset($_GET['type']) ? $_GET['type'] : die(json_encode(array("error" => "Type parameter is required")));

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die(json_encode(array("error" => "Connection failed: " . $conn->connect_error)));
}

switch ($type) {
    case 'Promo':
        $query = "SELECT id, name, price FROM promos WHERE CURDATE() BETWEEN start_date AND end_date";
        break;
    case 'Service':
        $query = "SELECT id, name, price FROM services";
        break;
    case 'Surgery':
        $query = "SELECT id, title AS name, price FROM surgeries";
        break;
    default:
        die(json_encode(array("error" => "Invalid type specified")));
}

$stmt = $conn->prepare($query);
if (!$stmt) {
    die(json_encode(array("error" => "Prepare failed: " . $conn->error)));
}

if (!$stmt->execute()) {
    die(json_encode(array("error" => "Execute failed: " . $stmt->error)));
}

$result = $stmt->get_result();
$data = $result->fetch_all(MYSQLI_ASSOC);

echo json_encode($data);

$stmt->close();
$conn->close();
?>