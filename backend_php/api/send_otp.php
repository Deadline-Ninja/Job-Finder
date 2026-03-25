<?php
/**
 * JOBfinder - Send OTP API (PHPMailer)
 * This script handles sending OTP codes via Gmail SMTP.
 */

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Check if vendor/autoload.php exists (requires Composer installation)
if (file_exists('../vendor/autoload.php')) {
    require '../vendor/autoload.php';
} else {
    header("Content-Type: application/json");
    echo json_encode(["success" => false, "message" => "Composer dependencies missing. Please run 'composer install' in the backend_php directory."]);
    exit;
}

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->email) && !empty($data->otp)) {
    $mail = new PHPMailer(true);

    try {
        // Server settings
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'yourgmail@gmail.com'; // YOUR GMAIL
        $mail->Password   = 'your_app_password';   // YOUR APP PASSWORD
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = 587;

        // Sender
        $mail->setFrom('yourgmail@gmail.com', 'JOBfinder Security');

        // Receiver
        $mail->addAddress($data->email);

        // Content
        $mail->isHTML(true);
        $mail->Subject = 'Your JOBfinder Verification Code';
        $mail->Body    = "
            <div style='font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;'>
                <h2 style='color: #0A66C2;'>JOBfinder Security</h2>
                <p>Hello,</p>
                <p>You recently requested a verification code to access your JOBfinder account.</p>
                <div style='background: #f4f4f4; padding: 15px; text-align: center; border-radius: 5px; margin: 20px 0;'>
                    <span style='font-size: 24px; font-weight: bold; letter-spacing: 5px;'>{$data->otp}</span>
                </div>
                <p>This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
                <p>Best regards,<br>The JOBfinder Team</p>
            </div>
        ";
        $mail->AltBody = "Your JOBfinder verification code is: {$data->otp}";

        $mail->send();
        echo json_encode(["success" => true, "message" => "OTP transmitted to {$data->email}"]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Mailer Error: {$mail->ErrorInfo}"]);
    }
} else {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Incomplete request. 'email' and 'otp' are required."]);
}
?>
