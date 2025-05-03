<?php
header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');
header('Connection: keep-alive');
header('Access-Control-Allow-Origin: *');

$servername = "localhost";
$dbUsername = "root";
$dbPassword = "";
$dbname = "asr";

$conn = new mysqli($servername, $dbUsername, $dbPassword, $dbname);

if ($conn->connect_error) {
    echo "event: error\n";
    echo "data: " . json_encode([
        'error' => 'Database connection failed',
        'message' => $conn->connect_error
    ]) . "\n\n";
    ob_flush();
    flush();
    exit;
}

try {
    $userId = isset($_GET['userId']) ? intval($_GET['userId']) : 0;
    $lastEventId = isset($_GET['lastEventId']) ? intval($_GET['lastEventId']) : 0;

    if ($userId <= 0) {
        http_response_code(400);
        exit;
    }

    while (true) {
        // Check for new cancelled bookings
        $stmtCancelled = $conn->prepare("
            SELECT 
                id,
                first_name,
                last_name,
                service_type,
                appointment_date,
                appointment_time,
                status,
                created_at
            FROM bookings 
            WHERE user_id = ? 
            AND status = 'cancelled'
            AND id > ?
            ORDER BY id DESC
            LIMIT 1
        ");
        $stmtCancelled->bind_param("ii", $userId, $lastEventId);
        $stmtCancelled->execute();
        $resultCancelled = $stmtCancelled->get_result();
        $bookingCancelled = $resultCancelled->fetch_assoc();

        if ($bookingCancelled) {
            $eventDataCancelled = [
                'id' => $bookingCancelled['id'],
                'message' => "Booking Cancelled: {$bookingCancelled['service_type']}",
                'details' => [
                    'date' => date('F j, Y', strtotime($bookingCancelled['appointment_date'])),
                    'time' => date('g:i A', strtotime($bookingCancelled['appointment_time']))
                ]
            ];
            echo "id: {$bookingCancelled['id']}\n";
            echo "event: booking-cancelled\n";
            echo "data: " . json_encode($eventDataCancelled) . "\n\n";
            $lastEventId = $bookingCancelled['id'];
        }

        // Check for new confirmed bookings
        $stmtConfirmed = $conn->prepare("
            SELECT 
                id,
                first_name,
                last_name,
                service_type,
                appointment_date,
                appointment_time,
                status,
                created_at
            FROM bookings 
            WHERE user_id = ? 
            AND status = 'confirmed'
            AND id > ?
            ORDER BY id DESC
            LIMIT 1
        ");
        $stmtConfirmed->bind_param("ii", $userId, $lastEventId);
        $stmtConfirmed->execute();
        $resultConfirmed = $stmtConfirmed->get_result();
        $bookingConfirmed = $resultConfirmed->fetch_assoc();

        if ($bookingConfirmed) {
            $eventDataConfirmed = [
                'id' => $bookingConfirmed['id'],
                'message' => "Booking Confirmed: {$bookingConfirmed['service_type']}",
                'details' => [
                    'date' => date('F j, Y', strtotime($bookingConfirmed['appointment_date'])),
                    'time' => date('g:i A', strtotime($bookingConfirmed['appointment_time']))
                ]
            ];
            echo "id: {$bookingConfirmed['id']}\n";
            echo "event: booking-confirmed\n";
            echo "data: " . json_encode($eventDataConfirmed) . "\n\n";
            $lastEventId = $bookingConfirmed['id'];
        }

        ob_flush();
        flush();

        if (connection_aborted()) break;
        sleep(5);
    }

} catch (Exception $e) {
    echo "event: error\n";
    echo "data: " . json_encode([
        'error' => 'Server error',
        'message' => $e->getMessage()
    ]) . "\n\n";
    ob_flush();
    flush();
} finally {
    $conn->close();
}