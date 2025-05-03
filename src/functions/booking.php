<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, PUT, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");

error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);
ini_set('error_log', 'C:\xampp\htdocs\error.log');

require __DIR__ . '/vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$host = 'localhost';
$dbname = 'asr';
$username = 'root';
$password = '';

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    error_log('Database Connection Error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Database connection failed.']);
    exit();
}

// Handle GET requests
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Get booked slots for a specific date and staff
    if (isset($_GET['date']) && isset($_GET['staff_id'])) {
        $date = filter_input(INPUT_GET, 'date', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $staff_id = filter_input(INPUT_GET, 'staff_id', FILTER_SANITIZE_NUMBER_INT);

        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Invalid date format.']);
            exit();
        }

        try {
            $stmt = $conn->prepare("
                SELECT DATE_FORMAT(appointment_time, '%h:%i %p') as appointment_time
                FROM bookings
                WHERE appointment_date = :date
                AND staff_id = :staff_id
                AND status != 'cancelled'
            ");
            $stmt->execute([
                ':date' => $date,
                ':staff_id' => $staff_id,
            ]);
            $bookedSlots = $stmt->fetchAll(PDO::FETCH_COLUMN);

            echo json_encode(['status' => 'success', 'booked_slots' => $bookedSlots]);
        } catch (PDOException $e) {
            error_log('Database Error: ' . $e->getMessage());
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Failed to fetch booked slots.']);
        }
        exit();
    }
    
    // Get booking details for rating
    if (isset($_GET['booking_id']) && isset($_GET['action']) && $_GET['action'] === 'get_for_rating') {
        $booking_id = filter_input(INPUT_GET, 'booking_id', FILTER_SANITIZE_NUMBER_INT);
        
        try {
            $stmt = $conn->prepare("
                SELECT id, user_id, status 
                FROM bookings 
                WHERE id = :booking_id
            ");
            $stmt->execute([':booking_id' => $booking_id]);
            $booking = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$booking) {
                http_response_code(404);
                echo json_encode(['status' => 'error', 'message' => 'Booking not found.']);
                exit();
            }
            
            if ($booking['status'] !== 'completed') {
                http_response_code(400);
                echo json_encode(['status' => 'error', 'message' => 'Rating only allowed for completed appointments.']);
                exit();
            }
            
            echo json_encode(['status' => 'success', 'booking' => $booking]);
        } catch (PDOException $e) {
            error_log('Database Error: ' . $e->getMessage());
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Failed to fetch booking details.']);
        }
        exit();
    }
    
    // Manual archive trigger (protected with secret key)
    if (isset($_GET['action']) && $_GET['action'] === 'archive_now') {
        $secretKey = $_ENV['ARCHIVE_SECRET_KEY'] ?? '';
        if (!isset($_GET['key']) || $_GET['key'] !== $secretKey) {
            http_response_code(403);
            echo json_encode(['status' => 'error', 'message' => 'Unauthorized']);
            exit();
        }
        
        try {
            $threeYearsAgo = date('Y-m-d H:i:s', strtotime('-3 years'));
            
            // Begin transaction
            $conn->beginTransaction();
            
            // Archive old records
            $stmt = $conn->prepare("
                INSERT INTO bookings_archive 
                SELECT *, NULL as archived_at FROM bookings 
                WHERE created_at < :threeYearsAgo
            ");
            $stmt->bindParam(':threeYearsAgo', $threeYearsAgo);
            $stmt->execute();
            $archivedCount = $stmt->rowCount();
            
            // Delete archived records
            $stmt = $conn->prepare("
                DELETE FROM bookings 
                WHERE created_at < :threeYearsAgo
            ");
            $stmt->bindParam(':threeYearsAgo', $threeYearsAgo);
            $stmt->execute();
            $deletedCount = $stmt->rowCount();
            
            // Update archive timestamps
            $stmt = $conn->prepare("
                UPDATE bookings_archive 
                SET archived_at = NOW() 
                WHERE archived_at IS NULL
            ");
            $stmt->execute();
            
            $conn->commit();
            
            echo json_encode([
                'status' => 'success',
                'message' => "Archiving completed successfully.",
                'archived_records' => $archivedCount,
                'deleted_records' => $deletedCount
            ]);
            
        } catch (PDOException $e) {
            if ($conn->inTransaction()) {
                $conn->rollBack();
            }
            error_log('Archive Error: ' . $e->getMessage());
            http_response_code(500);
            echo json_encode([
                'status' => 'error',
                'message' => 'Archive failed: ' . $e->getMessage()
            ]);
        }
        exit();
    }
}

// Handle POST requests (new bookings)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get form data from POST
    $user_id = isset($_POST['user_id']) ? $_POST['user_id'] : null;
    $first_name = htmlspecialchars($_POST['first_name']);
    $last_name = htmlspecialchars($_POST['last_name']);
    $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
    $contact_no = htmlspecialchars($_POST['contact_no']);
    $service_type = htmlspecialchars($_POST['service_type']);
    $service_id = isset($_POST['service']) ? htmlspecialchars($_POST['service']) : null;
    $branch_id = htmlspecialchars($_POST['branch_id']);
    $staff_id = htmlspecialchars($_POST['staff_id']);
    $appointment_date = $_POST['appointment_date'];
    $appointment_time = $_POST['appointment_time'];
    $send_email = isset($_POST['send_email']) ? (bool)$_POST['send_email'] : false;

    // Handle file upload
    $file_url = null;
    if (isset($_FILES['receipt'])) {
        $uploadDir = __DIR__ . '/admin_dashboard_backend/uploads/';
        
        if (!file_exists($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }
        
        $fileName = uniqid() . '_' . basename($_FILES['receipt']['name']);
        $targetPath = $uploadDir . $fileName;
        
        if (move_uploaded_file($_FILES['receipt']['tmp_name'], $targetPath)) {
            $file_url = 'http://localhost/admin_dashboard_backend/uploads/' . $fileName;
        } else {
            error_log('File upload failed: ' . $_FILES['receipt']['error']);
        }
    }

    // Validate input
    if (!$first_name || !$last_name || !$email || !$contact_no || !$service_type || 
        !$branch_id || !$staff_id || !$appointment_date || !$appointment_time) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'All fields are required.']);
        exit();
    }

    // Check staff availability
    try {
        $stmt = $conn->prepare("
            SELECT COUNT(*) as total_bookings
            FROM bookings
            WHERE appointment_date = :appointment_date
            AND appointment_time = :appointment_time
            AND staff_id = :staff_id
            AND status != 'cancelled'
        ");
        $stmt->execute([
            ':appointment_date' => $appointment_date,
            ':appointment_time' => $appointment_time,
            ':staff_id' => $staff_id,
        ]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($result['total_bookings'] >= 1) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'The selected time slot is fully booked.']);
            exit();
        }
    } catch (PDOException $e) {
        error_log('Database Error: ' . $e->getMessage());
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Failed to check staff availability.']);
        exit();
    }

    // Insert the booking
    try {
        $conn->beginTransaction();
        
        $stmt = $conn->prepare("
            INSERT INTO bookings (
                user_id, first_name, last_name, email, contact_no, 
                service_type, branch_id, staff_id, 
                appointment_date, appointment_time, status, rating,
                file_url, created_at
            ) VALUES (
                :user_id, :first_name, :last_name, :email, :contact_no, 
                :service_type, :branch_id, :staff_id, 
                :appointment_date, :appointment_time, 'pending', NULL,
                :file_url, NOW()
            )
        ");
        $stmt->execute([
            ':user_id' => $user_id,
            ':first_name' => $first_name,
            ':last_name' => $last_name,
            ':email' => $email,
            ':contact_no' => $contact_no,
            ':service_type' => $service_type,
            ':branch_id' => $branch_id,
            ':staff_id' => $staff_id,
            ':appointment_date' => $appointment_date,
            ':appointment_time' => $appointment_time,
            ':file_url' => $file_url
        ]);

        $bookingId = $conn->lastInsertId();
        
        // Get additional details for email if requested
        if ($send_email) {
            // Get service name
            $serviceName = "Service";
            if ($service_id) {
                $stmt = $conn->prepare("SELECT name FROM services WHERE id = :service_id");
                $stmt->execute([':service_id' => $service_id]);
                $service = $stmt->fetch(PDO::FETCH_ASSOC);
                if ($service) {
                    $serviceName = $service['name'];
                }
            }
            
            // Get branch name
            $stmt = $conn->prepare("SELECT name FROM branches WHERE id = :branch_id");
            $stmt->execute([':branch_id' => $branch_id]);
            $branch = $stmt->fetch(PDO::FETCH_ASSOC);
            $branchName = $branch ? $branch['name'] : "Unknown Branch";
            
            // Get staff name
            $stmt = $conn->prepare("SELECT name FROM staff WHERE id = :staff_id");
            $stmt->execute([':staff_id' => $staff_id]);
            $staff = $stmt->fetch(PDO::FETCH_ASSOC);
            $staffName = $staff ? $staff['name'] : "Our Staff";
            
            // Format date for display
            $displayDate = date('F j, Y', strtotime($appointment_date));
            
            try {
                $mail = new PHPMailer(true);
                
                // Server settings
                $mail->isSMTP();
                $mail->Host       = $_ENV['SMTP_HOST'];
                $mail->SMTPAuth   = true;
                $mail->Username   = $_ENV['SMTP_USERNAME'];
                $mail->Password   = $_ENV['SMTP_PASSWORD'];
                $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
                $mail->Port       = (int)$_ENV['SMTP_PORT'];
                
                // Recipients
                $mail->setFrom($_ENV['SMTP_FROM_EMAIL'], $_ENV['SMTP_FROM_NAME']);
                $mail->addAddress($email, $first_name . ' ' . $last_name);
                
                // Content
                $mail->isHTML(true);
                $mail->Subject = 'Your Booking Confirmation at Aesthetic Skin Renewed';
                
                // HTML email body
                $mail->Body = "
                    <h1>Booking Confirmation #$bookingId</h1>
                    <p>Dear $first_name,</p>
                    <p>Thank you for booking with Aesthetic Skin Renewed!</p>
                    
                    <h2>Appointment Details</h2>
                    <p><strong>Type:</strong> $service_type</p>
                    <p><strong>Service:</strong> $serviceName</p>
                    <p><strong>Branch:</strong> $branchName</p>
                    <p><strong>Staff:</strong> $staffName</p>
                    <p><strong>Date:</strong> $displayDate</p>
                    <p><strong>Time:</strong> $appointment_time</p>
                    
                    <p>We look forward to seeing you!</p>
                    <p>If you need to reschedule or have any questions, please contact us.</p>
                    
                    <p>Best regards,<br>Aesthetic Skin Renewed Team</p>
                ";
                
                // Plain text version for non-HTML email clients
                $mail->AltBody = "Booking Confirmation #$bookingId\n\n" .
                    "Dear $first_name,\n\n" .
                    "Thank you for booking with Aesthetic Skin Renewed!\n\n" .
                    "Appointment Details:\n" .
                    "Type: $service_type\n" .
                    "Service: $serviceName\n" .
                    "Branch: $branchName\n" .
                    "Staff: $staffName\n" .
                    "Date: $displayDate\n" .
                    "Time: $appointment_time\n\n" .
                    "We look forward to seeing you!\n\n" .
                    "Best regards,\nAesthetic Skin Renewed Team";
                
                $mail->send();
            } catch (Exception $e) {
                error_log("Email sending failed: " . $e->getMessage());
                $emailError = $e->getMessage();
            }
        }
        
        $conn->commit();
        
        $response = [
            'status' => 'success', 
            'message' => 'Appointment booked successfully!',
            'booking_id' => $bookingId
        ];
        
        if ($send_email) {
            $response['email_sent'] = true;
            $response['email_message'] = 'Confirmation email has been sent.';
            if (isset($emailError)) {
                $response['email_error'] = $emailError;
            }
        }
        
        if ($file_url) {
            $response['file_url'] = $file_url;
        }
        
        echo json_encode($response);
    } catch (PDOException $e) {
        if ($conn->inTransaction()) {
            $conn->rollBack();
        }
        error_log('Database Error: ' . $e->getMessage());
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Failed to book appointment.']);
    }
} 
// Handle PUT requests (rating submissions)
elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $input = file_get_contents("php://input");
    $data = json_decode($input, true);

    if (!isset($data['booking_id']) || !isset($data['rating'])) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Booking ID and rating are required.']);
        exit();
    }

    $booking_id = filter_var($data['booking_id'], FILTER_SANITIZE_NUMBER_INT);
    $rating = filter_var($data['rating'], FILTER_SANITIZE_NUMBER_INT);

    // Validate rating (1-5)
    if ($rating < 1 || $rating > 5) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Rating must be between 1 and 5.']);
        exit();
    }

    try {
        // First check if booking exists and is completed
        $stmt = $conn->prepare("
            SELECT id, status 
            FROM bookings 
            WHERE id = :booking_id
        ");
        $stmt->execute([':booking_id' => $booking_id]);
        $booking = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$booking) {
            http_response_code(404);
            echo json_encode(['status' => 'error', 'message' => 'Booking not found.']);
            exit();
        }

        if ($booking['status'] !== 'completed') {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Rating only allowed for completed appointments.']);
            exit();
        }

        // Update the rating
        $stmt = $conn->prepare("
            UPDATE bookings 
            SET rating = :rating 
            WHERE id = :booking_id
        ");
        $stmt->execute([
            ':rating' => $rating,
            ':booking_id' => $booking_id
        ]);

        echo json_encode(['status' => 'success', 'message' => 'Rating submitted successfully!']);
    } catch (PDOException $e) {
        error_log('Database Error: ' . $e->getMessage());
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Failed to submit rating.']);
    }
} 
else {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
}