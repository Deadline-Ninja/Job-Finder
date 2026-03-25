<?php
// backend_php/api/verify_otp.php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

require_once '../inc/db.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->user_id) && !empty($data->otp)) {
    // 1. In a production app, Verify OTP against a table or session
    // For this prototype, we'll mock a successful validation for any 6-digit OTP
    // or check a 'temp_otp' field in the users table if we added one.
    
    $query = "UPDATE users SET verified = TRUE WHERE id = ? LIMIT 1";
    $stmt = $db->prepare($query);
    
    if($stmt->execute([$data->user_id])) {
        http_response_code(200);
        echo json_encode(["message" => "Identity verified. Matrix node activated. Please login."]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Unable to update node status."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Verification data incomplete."]);
}
?>
