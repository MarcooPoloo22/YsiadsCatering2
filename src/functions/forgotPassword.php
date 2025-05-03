<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Set the default timezone to Asia/Manila
date_default_timezone_set('Asia/Manila');

// Error logging configuration
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', 'C:\xampp\htdocs\password_reset_errors.log'); // Log file path

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require __DIR__ . '/vendor/autoload.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

$input = file_get_contents("php://input");
$data = json_decode($input, true);

if (!$data || !isset($data['email'])) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid input data.']);
    error_log('Invalid input data in forgotpassword.php');
    exit();
}

$email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);

if (!$email) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid email address.']);
    error_log('Invalid email address in forgotpassword.php: ' . $data['email']);
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
    error_log('Database Connection Error in forgotpassword.php: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Database connection failed.']);
    exit();
}

try {
    // Step 1: Check if the email exists in the `users` table
    $stmt = $conn->prepare("SELECT * FROM users WHERE email = :email");
    $stmt->execute([':email' => $email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Email not found.']);
        error_log('Email not found in forgotpassword.php: ' . $email);
        exit();
    }

    // Step 2: Generate a reset token and store it in the `password_resets` table
    $reset_token = bin2hex(random_bytes(32));
    $created_at = date("Y-m-d H:i:s"); // Uses Asia/Manila timezone

    // Delete any existing reset tokens for this email
    $stmt = $conn->prepare("DELETE FROM password_resets WHERE email = :email");
    $stmt->execute([':email' => $email]);

    // Insert the new reset token into the `password_resets` table
    $stmt = $conn->prepare("INSERT INTO password_resets (email, token, created_at) VALUES (:email, :token, :created_at)");
    $stmt->execute([
        ':email' => $email,
        ':token' => $reset_token,
        ':created_at' => $created_at,
    ]);

    // Step 3: Send the password reset email with a link to the React page
    $mail = new PHPMailer(true);

    try {
        $mail->isSMTP();
        $mail->Host       = $_ENV['SMTP_HOST'];
        $mail->SMTPAuth   = true;
        $mail->Username   = $_ENV['SMTP_USERNAME'];
        $mail->Password   = $_ENV['SMTP_PASSWORD'];
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = $_ENV['SMTP_PORT'];

        $mail->setFrom($_ENV['SMTP_FROM_EMAIL'], $_ENV['SMTP_FROM_NAME']);
        $mail->addAddress($email);

        // Redirect URL to the React page for password reset
        $reset_link = "http://localhost:3000/reset-password?token=$reset_token";
        $mail->isHTML(true);
        $mail->Subject = 'Password Reset Request';
        $mail->Body    = "
            <h2>Password Reset</h2>
            <p>Click the link below to reset your password:</p>
            <p><a href='$reset_link'>Reset Password</a></p>
            <p>This link will expire in 1 hour.</p>
        ";
        $mail->AltBody = "Click the link below to reset your password:\n\n$reset_link";

        $mail->send();
        echo json_encode(['status' => 'success', 'message' => 'Password reset email sent.']);
    } catch (Exception $e) {
        error_log('PHPMailer Error in forgotpassword.php: ' . $e->getMessage());
        echo json_encode(['status' => 'error', 'message' => 'Failed to send password reset email.']);
    }
} catch (PDOException $e) {
    error_log('Database Error in forgotpassword.php: ' . $e->getMessage());
    echo json_encode(['status' => 'error', 'message' => 'Failed to process your request.']);
}