<?php
// backend_php/api/register.php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

require_once '../inc/db.php';
require_once '../inc/auth_utils.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->name) && !empty($data->email) && !empty($data->password)) {
    // 1. Check if user exists
    $check_query = "SELECT id FROM users WHERE email = ? LIMIT 1";
    $stmt = $db->prepare($check_query);
    $stmt->execute([$data->email]);
    
    if($stmt->rowCount() > 0) {
        http_response_code(400);
        echo json_encode(["message" => "User already signed up. Please login."]);
        exit;
    }
    
    // 2. Hash Password
    $password_hash = password_hash($data->password, PASSWORD_BCRYPT);
    
    // 3. Create User (unverified)
    $insert_query = "INSERT INTO users (name, email, password, verified) VALUES (?, ?, ?, FALSE)";
    $stmt = $db->prepare($insert_query);
    
    if($stmt->execute([$data->name, $data->email, $password_hash])) {
        $user_id = $db->lastInsertId();
        
        // 4. Generate & Send OTP (Firebase Interface)
        $otp = rand(100000, 999999);
        // Store OTP in session or a temporary table (for production)
        if(AuthUtils::sendFirebaseOTP($data->email, $otp)) {
            http_response_code(201);
            echo json_encode([
                "message" => "Initial registry established. Please verify OTP sent to your email.",
                "user_id" => $user_id,
                "debug_otp" => $otp // REMOVE IN PRODUCTION
            ]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Failed to trigger Firebase OTP service."]);
        }
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Unable to create node in database."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Matrix error: Required data is incomplete."]);
}
?>
