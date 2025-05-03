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

$role = $_GET['role'] ?? 'customer'; // Default to 'customer' if no role is specified

// Prepare and execute the query
$sql = "SELECT id, first_name, middle_initial, last_name, email, contact_no, role FROM users WHERE role = ?";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    die(json_encode(["error" => "Failed to prepare statement: " . $conn->error]));
}

$stmt->bind_param("s", $role); // Bind the role parameter
$stmt->execute();

// Get the result
$result = $stmt->get_result();
$users = [];

// Fetch all rows as an associative array
while ($row = $result->fetch_assoc()) {
    // Combine first_name, middle_initial, and last_name into a single 'name' field
    $name = trim($row['first_name'] . ' ' . $row['middle_initial'] . ' ' . $row['last_name']);
    $name = preg_replace('/\s+/', ' ', $name); // Remove extra spaces

    // Add the user to the result array
    $users[] = [
        'id' => $row['id'],
        'name' => $name,
        'email' => $row['email'],
        'contactNumber' => $row['contact_no'], // Rename contact_no to contactNumber
        'role' => $row['role'],
    ];
}

// Return the result as JSON
echo json_encode($users);

// Close the statement and connection
$stmt->close();
$conn->close();
?>