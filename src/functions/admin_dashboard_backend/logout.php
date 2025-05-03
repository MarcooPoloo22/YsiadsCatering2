<?php
// Add CORS headers
header("Access-Control-Allow-Origin: http://localhost:3000"); 
header("Access-Control-Allow-Credentials: true"); // Allow cookies to be sent
header("Access-Control-Allow-Methods: POST, OPTIONS"); // Allowed methods
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Allowed headers

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

session_start();
session_unset();
session_destroy();

echo json_encode(['success' => true]);
exit();
?>