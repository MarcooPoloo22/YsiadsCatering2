<?php
require 'vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Create a new PHPMailer instance
$mail = new PHPMailer(true);

try {
   
    $mail->isSMTP(); 
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'aestheticskinrenewed1@gmail.com';
    $mail->Password   = 'asrkatipunan1'; 
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; 
    $mail->Port       = 587; 

    // Recipients
    $mail->setFrom('your-email@gmail.com', 'Your Name'); 
    $mail->addAddress('recipient-email@example.com', 'Recipient Name'); 

    // Content
    $mail->isHTML(true); // Set email format to HTML
    $mail->Subject = 'Test Email';
    $mail->Body    = 'This is a <b>test email</b> sent using PHPMailer.';
    $mail->AltBody = 'This is a test email sent using PHPMailer.'; 

    // Send the email
    $mail->send();
    echo 'Email has been sent!';
} catch (Exception $e) {
    echo "Email could not be sent. Error: {$mail->ErrorInfo}";
}