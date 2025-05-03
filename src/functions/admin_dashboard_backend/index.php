<?php
// File: index.php

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Get the request URI
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH); // Extract the path only

// Route requests to the correct file
if (strpos($requestUri, '/api/audit-logs') === 0) {
    require __DIR__ . '/api/audit_endpoints.php';
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Not Found']);
}
?>