<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "asr";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    http_response_code(500);
    die(json_encode([
        'success' => false,
        'error' => "Connection failed: " . $conn->connect_error
    ]));
}

try {
    $sql = "SELECT id, name, description, price, file_url, duration FROM services";
    $result = $conn->query($sql);

    if (!$result) {
        throw new Exception("Query error: " . $conn->error);
    }

    $services = [];
    $base_url = "http://localhost/admin_dashboard_backend/uploads/";

    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            // Prepend base URL if file_url is not null
            $row['file_url'] = $row['file_url'] 
                ? $base_url . ltrim($row['file_url'], '/')
                : null;
            $services[] = $row;
        }
    }

    echo json_encode([
        'success' => true,
        'data' => $services
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
} finally {
    $conn->close();
}
?>
