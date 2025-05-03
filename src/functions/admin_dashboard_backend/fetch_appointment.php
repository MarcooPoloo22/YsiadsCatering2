<?php
header( 'Access-Control-Allow-Origin: *' );
header( 'Content-Type: application/json; charset=UTF-8' );
header( 'Access-Control-Allow-Methods: GET' );
header( 'Access-Control-Max-Age: 3600' );
header( 'Access-Control-Allow-Credentials: true' );
header( 'Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With' );

$servername = 'localhost';
$username   = 'root';
$password   = '';
$dbname     = 'asr';

$conn = new mysqli( $servername, $username, $password, $dbname );

$branch_id = isset( $_GET[ 'branch_id' ] ) ? $_GET[ 'branch_id' ] : null;
$staff_id  = isset( $_GET[ 'staff_id' ] )  ? $_GET[ 'staff_id' ]  : null;

$query = "
  SELECT 
    b.id,
    b.user_id AS user_id ,
    b.service_type,
    b.first_name,
    b.last_name,
    b.email,
    b.contact_no,
    b.appointment_date,
    b.appointment_time,
    b.status,
    b.file_url AS receipt_url, -- Payment Receipt
    b.rating,                  -- Rating column
    b.branch_id,               -- Branch ID for edit prepopulation
    b.staff_id,                -- Staff ID for edit prepopulation
    s.name AS staff_name,
    br.name AS branch_name
  FROM bookings b
  LEFT JOIN staff s    ON b.staff_id = s.id
  LEFT JOIN branches br ON b.branch_id = br.id
  WHERE 1=1
";

$params = array();
$types  = '';

if ( $branch_id ) {
    $query    .= ' AND b.branch_id = ?';
    $params[]  = $branch_id;
    $types    .= 'i';
}

if ( $staff_id ) {
    $query    .= ' AND b.staff_id = ?';
    $params[]  = $staff_id;
    $types    .= 'i';
}

$query .= ' ORDER BY b.appointment_date, b.appointment_time';

$stmt = $conn->prepare( $query );

if ( !empty( $params ) ) {
    $stmt->bind_param( $types, ...$params );
}

$stmt->execute();
$result = $stmt->get_result();
$appointments = array();

while ( $row = $result->fetch_assoc() ) {
    $appointments[] = $row;
}

echo json_encode( $appointments );
?>