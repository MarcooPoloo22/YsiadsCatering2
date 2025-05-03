<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json; charset=UTF-8");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "asr";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed: " . $conn->connect_error]));
}

// Fetch services
$sql = "SELECT id, name, description, price, file_url, duration FROM services";
$result = $conn->query($sql);

$services = array();
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $service_id = $row['id'];

        // Fetch branch IDs for this service
        $branch_sql = "SELECT branch_id FROM service_branches WHERE service_id = $service_id";
        $branch_result = $conn->query($branch_sql);
        $branch_ids = array();
        if ($branch_result) {
            while ($branch_row = $branch_result->fetch_assoc()) {
                $branch_ids[] = $branch_row['branch_id'];
            }
        }

        // Fetch staff IDs for this service
        $staff_sql = "SELECT staff_id FROM service_staff WHERE service_id = $service_id";
        $staff_result = $conn->query($staff_sql);
        $staff_ids = array();
        if ($staff_result) {
            while ($staff_row = $staff_result->fetch_assoc()) {
                $staff_ids[] = $staff_row['staff_id'];
            }
        }

        // Add branch and staff IDs to the service data
        $row['branch_ids'] = $branch_ids;
        $row['staff_ids'] = $staff_ids;

        // Update file_url to include the correct base path
        $row['file_url'] = 'http://localhost/admin_dashboard_backend/uploads/' . basename($row['file_url']);

        // Add the service to the list
        $services[] = $row;
    }
}

echo json_encode($services);

$conn->close();
?>