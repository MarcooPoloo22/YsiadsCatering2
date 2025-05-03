<?php
session_start();
header( 'Content-Type: application/json; charset=UTF-8' );
header( 'Access-Control-Allow-Origin: http://localhost:3000' );
header( 'Access-Control-Allow-Credentials: true' );

if ( !isset( $_SESSION[ 'user' ] ) ) {
    echo json_encode( [ 'status' => 'error', 'message' => 'User not logged in.' ] );
    exit();
}

// Assume $_SESSION[ 'user' ] contains the full user data from login.php
echo json_encode( [ 'status' => 'success', 'user' => $_SESSION[ 'user' ] ] );
?>