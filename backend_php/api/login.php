<?php
// backend_php/api/login.php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

require_once '../inc/db.php';
require_once '../inc/auth_utils.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->email) && !empty($data->password)) {
    // 1. Fetch user metadata
    $query = "SELECT id, name, email, password, verified FROM users WHERE email = ? LIMIT 1";
    $stmt = $db->prepare($query);
    $stmt->execute([$data->email]);
    
    if($stmt->rowCount() > 0) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // 2. Verify account activation
        if(!$row['verified']) {
            http_response_code(401);
            echo json_encode(["message" => "Account not verified. Please verify your OTP node."]);
            exit;
        }
        
        // 3. Verify Bcrypt hash
        if(password_verify($data->password, $row['password'])) {
            // 4. Issue JWT
            $token = AuthUtils::generateJWT($row['id'], $row['email']);
            
            http_response_code(200);
            echo json_encode([
                "message" => "Authentication successful.",
                "jwt" => $token,
                "user" => [
                    "id" => $row['id'],
                    "name" => $row['name'],
                    "email" => $row['email']
                ]
            ]);
        } else {
            http_response_code(401);
            echo json_encode(["message" => "Matrix authentication failed: Invalid credentials."]);
        }
    } else {
        http_response_code(404);
        echo json_encode(["message" => "Signal not found. Please register first."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Required credentials missing."]);
}
?>
