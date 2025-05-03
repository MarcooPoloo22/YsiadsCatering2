<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Methods: GET, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    exit();
}


$servername = "localhost";
$username = "root";
$password = "";
$dbname = "asr";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Fetch promos with branch and staff data
$sql = "SELECT p.*, 
               GROUP_CONCAT(DISTINCT pb.branch_id) AS branch_ids, 
               GROUP_CONCAT(DISTINCT ps.staff_id) AS staff_ids 
        FROM promos p
        LEFT JOIN promo_branches pb ON p.id = pb.promo_id
        LEFT JOIN promo_staff ps ON p.id = ps.promo_id
        GROUP BY p.id";
$result = $conn->query($sql);

$promos = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        // Convert branch_ids and staff_ids to arrays
        $row['branch_ids'] = $row['branch_ids'] ? explode(",", $row['branch_ids']) : [];
        $row['staff_ids'] = $row['staff_ids'] ? explode(",", $row['staff_ids']) : [];

        // Ensure start_date and end_date are in the correct format
        if (!empty($row['start_date'])) {
            $row['start_date'] = date('Y-m-d\TH:i:s', strtotime($row['start_date']));
        } else {
            $row['start_date'] = null; // Set to null if empty
        }

        if (!empty($row['end_date'])) {
            $row['end_date'] = date('Y-m-d\TH:i:s', strtotime($row['end_date']));
        } else {
            $row['end_date'] = null; // Set to null if empty
        }

        $promos[] = $row;
    }
}

echo json_encode($promos);

$conn->close();
?>