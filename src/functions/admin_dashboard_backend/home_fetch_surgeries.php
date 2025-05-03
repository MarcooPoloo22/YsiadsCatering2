<?php
// Allow requests from your React app
header("Access-Control-Allow-Origin: http://localhost:3000");
// Allow specific HTTP methods
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
// Allow specific headers
header("Access-Control-Allow-Headers: Content-Type, Authorization");
// Set response content type
header("Content-Type: application/json");

// Handle preflight request (OPTIONS method)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200); // Return 200 OK for preflight requests
    exit();
}

// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "asr";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Fetch data from the surgeries table
    $sql = "SELECT id, title, description, price, image_url, duration, created_at, updated_at FROM surgeries";
    $stmt = $conn->prepare($sql);
    $stmt->execute();

    // Fetch all rows as an associative array
    $surgeries = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Return the data as JSON
    echo json_encode($surgeries);
} catch (PDOException $e) {
    http_response_code(500); // Internal Server Error
    echo json_encode(["message" => "Database error: " . $e->getMessage()]);
} finally {
    $conn = null; // Close the database connection
}
?>