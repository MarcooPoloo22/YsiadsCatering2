<?php
session_start();
header( 'Access-Control-Allow-Origin: http://localhost:3000' );
header( 'Access-Control-Allow-Credentials: true' );
header( 'Access-Control-Allow-Headers: Content-Type' );
header( 'Access-Control-Allow-Methods: POST, OPTIONS' );
header( 'Content-Type: application/json; charset=UTF-8' );

if ( $_SERVER[ 'REQUEST_METHOD' ] === 'OPTIONS' ) {
    http_response_code( 200 );
    exit( 0 );
}

// Ensure the user is logged in
if ( !isset( $_SESSION[ 'user' ] ) ) {
    echo json_encode( [ 'status' => 'error', 'message' => 'User not logged in.' ] );
    exit();
}

// Get the JSON input
$input = file_get_contents( 'php://input' );
$data = json_decode( $input, true );

if ( !$data ) {
    echo json_encode( [ 'status' => 'error', 'message' => 'No data provided.' ] );
    exit();
}

// Extract password fields
$currentPassword = $data[ 'currentPassword' ] ?? '';
$newPassword     = $data[ 'newPassword' ] ?? '';
$confirmPassword = $data[ 'confirmPassword' ] ?? '';

if ( $newPassword !== $confirmPassword ) {
    echo json_encode( [ 'status' => 'error', 'message' => 'Passwords do not match.' ] );
    exit();
}

try {
    $conn = new PDO( 'mysql:host=localhost;dbname=asr', 'root', '' );
    $conn->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );

    // Get the user from session
    $user = $_SESSION[ 'user' ];
    $userId = $user[ 'id' ];

    // Fetch current hashed password from DB
    $stmt = $conn->prepare( 'SELECT password FROM users WHERE id = :id' );
    $stmt->execute( [ ':id' => $userId ] );
    $row = $stmt->fetch( PDO::FETCH_ASSOC );

    if ( !$row ) {
        echo json_encode( [ 'status' => 'error', 'message' => 'User not found.' ] );
        exit();
    }

    // Verify current password
    if ( !password_verify( $currentPassword, $row[ 'password' ] ) ) {
        echo json_encode( [ 'status' => 'error', 'message' => 'Current password is incorrect.' ] );
        exit();
    }

    // Hash the new password
    $hashedPassword = password_hash( $newPassword, PASSWORD_DEFAULT );

    // Update the DB
    $updateStmt = $conn->prepare( 'UPDATE users SET password = :password WHERE id = :id' );
    $updateStmt->execute( [
        ':password' => $hashedPassword,
        ':id' => $userId
    ] );

    echo json_encode( [ 'status' => 'success', 'message' => 'Password updated successfully.' ] );
} catch ( PDOException $e ) {
    echo json_encode( [ 'status' => 'error', 'message' => $e->getMessage() ] );
    exit();
}