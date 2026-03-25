<?php
// backend_php/inc/auth_utils.php

class AuthUtils {
    private static $secret_key = "YOUR_SUPER_SECRET_KEY"; // Change this!
    private static $issuer_claim = "jobfinder_portal";
    private static $audience_claim = "job_seekers";
    
    // JWT Generation (Simple implementation for demo)
    public static function generateJWT($userId, $email) {
        $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
        $payload = json_encode([
            "iss" => self::$issuer_claim,
            "aud" => self::$audience_claim,
            "iat" => time(),
            "exp" => time() + (60 * 60 * 24), // 24 hours
            "data" => [
                "id" => $userId,
                "email" => $email
            ]
        ]);
        
        $base64UrlHeader = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
        $base64UrlPayload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));
        
        $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, self::$secret_key, true);
        $base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
        
        return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
    }

    // Mock Firebase OTP Trigger
    // In a real app, this would use NodeMailer with Firebase SMTP or Firebase Hosting / Admin API
    public static function sendFirebaseOTP($email, $otp) {
        // This is where you would call Firebase logic or NodeMailer
        // For example, calling a Firebase Cloud Function via cURL:
        /*
        $ch = curl_init('https://your-firebase-func-url/sendOTP');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['email' => $email, 'otp' => $otp]));
        curl_exec($ch);
        */
        
        // Mock success for the portal logic
        return true;
    }
}
?>
