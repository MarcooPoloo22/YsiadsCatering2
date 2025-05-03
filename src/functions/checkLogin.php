<?php
session_start();

header( 'Access-Control-Allow-Origin: http://localhost:3000' );
header( 'Content-Type: application/json; charset=UTF-8' );
header( 'Access-Control-Allow-Methods: POST, GET, OPTIONS' );
header( 'Access-Control-Max-Age: 3600' );
header( 'Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With' );
header( 'Access-Control-Allow-Credentials: true' );

error_reporting( E_ALL );
ini_set( 'display_errors', 0 );
ini_set( 'log_errors', 1 );
ini_set( 'error_log', 'C:\xampp\htdocs\error.log' );

error_log( 'Session ID: ' . session_id() );
error_log( 'Session Data: ' . print_r( $_SESSION, true ) );

if ( isset( $_SESSION[ 'user_id' ] ) ) {
    echo json_encode( [ 'status' => 'success', 'message' => 'User is logged in.' ] );
} else {
    echo json_encode( [ 'status' => 'error', 'message' => 'User is not logged in.' ] );
}