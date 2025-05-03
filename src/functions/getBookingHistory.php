<?php
session_start();

header( 'Access-Control-Allow-Origin: http://localhost:3000' );
header( 'Access-Control-Allow-Credentials: true' );
header( 'Content-Type: application/json; charset=UTF-8' );
header( 'Access-Control-Allow-Methods: GET, POST, OPTIONS' );
header( 'Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With' );

// Handle preflight
if ( $_SERVER[ 'REQUEST_METHOD' ] === 'OPTIONS' ) {
    http_response_code( 200 );
    exit();
}

if ( !isset( $_SESSION[ 'user' ] ) ) {
    echo json_encode( [ 'status' => 'error', 'message' => 'User not logged in.' ] );
    exit();
}

$user = $_SESSION[ 'user' ];
$userId = $user[ 'id' ];

try {
    $conn = new PDO( 'mysql:host=localhost;dbname=asr', 'root', '' );
    $conn->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );

    $stmt = $conn->prepare(
        'SELECT * 
           FROM bookings 
          WHERE user_id = :userId
       ORDER BY appointment_date DESC,      
                appointment_time DESC'
    );

    $stmt->execute( [ ':userId' => $userId ] );

    $bookings = $stmt->fetchAll( PDO::FETCH_ASSOC );

    echo json_encode( [
        'status' => 'success',
        'bookings' => $bookings
    ] );
} catch ( PDOException $e ) {
    echo json_encode( [ 'status' => 'error', 'message' => $e->getMessage() ] );
}