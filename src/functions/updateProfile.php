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

// Connect to the database
try {
    $conn = new PDO( 'mysql:host=localhost;dbname=asr', 'root', '' );
    $conn->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );

    // Get the user from session
    $user = $_SESSION[ 'user' ];
    $userId = $user[ 'id' ];

    // Prepare an UPDATE statement for the fields you allow editing
    // For example: first_name, middle_initial, last_name, email, contact_no
    $stmt = $conn->prepare( "
        UPDATE users 
        SET 
            first_name = :first_name,
            middle_initial = :middle_initial,
            last_name = :last_name,
            email = :email,
            contact_no = :contact_no
        WHERE id = :id
    " );

    $stmt->execute( [
        ':first_name'      => $data[ 'first_name' ] ?? $user[ 'first_name' ],
        ':middle_initial'  => $data[ 'middle_initial' ] ?? $user[ 'middle_initial' ],
        ':last_name'       => $data[ 'last_name' ] ?? $user[ 'last_name' ],
        ':email'           => $data[ 'email' ] ?? $user[ 'email' ],
        ':contact_no'      => $data[ 'contact_no' ] ?? $user[ 'contact_no' ],
        ':id'              => $userId
    ] );

    // Update the session so it reflects the new changes
    $_SESSION[ 'user' ][ 'first_name' ] = $data[ 'first_name' ] ?? $user[ 'first_name' ];
    $_SESSION[ 'user' ][ 'middle_initial' ] = $data[ 'middle_initial' ] ?? $user[ 'middle_initial' ];
    $_SESSION[ 'user' ][ 'last_name' ] = $data[ 'last_name' ] ?? $user[ 'last_name' ];
    $_SESSION[ 'user' ][ 'email' ] = $data[ 'email' ] ?? $user[ 'email' ];
    $_SESSION[ 'user' ][ 'contact_no' ] = $data[ 'contact_no' ] ?? $user[ 'contact_no' ];

    echo json_encode( [ 'status' => 'success', 'message' => 'Profile updated.' ] );
} catch ( PDOException $e ) {
    echo json_encode( [ 'status' => 'error', 'message' => $e->getMessage() ] );
    exit();
}