<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Database configuration
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "asr";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["message" => "Database connection failed: " . $conn->connect_error]);
    exit();
}

try {
    // Query to get active promos (current date within promo period)
    $query = "SELECT 
                id,
                name,
                description,
                price,
                file_url,
                DATE_FORMAT(start_date, '%M %e, %Y') as start_date,
                DATE_FORMAT(end_date, '%M %e, %Y') as end_date
              FROM promos
              WHERE CURDATE() BETWEEN start_date AND end_date
              ORDER BY start_date ASC";

    $result = $conn->query($query);

    if (!$result) {
        throw new Exception("Query error: " . $conn->error);
    }

    $promos = [];
    while ($row = $result->fetch_assoc()) {
        // Format price as PHP currency with "Price: " prefix
        $formattedPrice = 'Price: ₱' . number_format($row['price'], 2, '.', ',');
        
        $promos[] = [
            'id' => $row['id'],
            'name' => $row['name'],
            'description' => $row['description'],
            'price' => $formattedPrice, // Send formatted price with prefix
            'file_url' => $row['file_url'],
            'start_date' => $row['start_date'],
            'end_date' => $row['end_date']
        ];
    }

    http_response_code(200);
    echo json_encode($promos);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["message" => $e->getMessage()]);
} finally {
    $conn->close();
}
?>