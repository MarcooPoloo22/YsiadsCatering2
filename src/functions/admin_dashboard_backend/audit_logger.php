<?php
header("Access-Control-Allow-Credentials: true");
function logAuditTrail($conn, $user_id, $user_name, $user_role, $action_type, $table_name, $old_value = null, $new_value = null, $description = '') {
    // Filter sensitive fields
    $sensitive_fields = ['password', 'credit_card', 'token'];
    
    if (is_array($old_value)) {
        foreach ($sensitive_fields as $field) {
            if (isset($old_value[$field])) {
                $old_value[$field] = '***REDACTED***';
            }
        }
    }
    
    if (is_array($new_value)) {
        foreach ($sensitive_fields as $field) {
            if (isset($new_value[$field])) {
                $new_value[$field] = '***REDACTED***';
            }
        }
    }

    $sql = "INSERT INTO audit_logs (
        user_id, user_name, user_role, action_type, 
        table_name, old_value, new_value, description, timestamp
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())";
    
    $stmt = $conn->prepare($sql);
    $old_json = $old_value ? json_encode($old_value) : null;
    $new_json = $new_value ? json_encode($new_value) : null;
    
    $stmt->bind_param("isssssss", 
        $user_id,
        $user_name,
        $user_role,
        $action_type,
        $table_name,
        $old_json,
        $new_json,
        $description
    );
    
    if (!$stmt->execute()) {
        error_log("Audit trail error: " . $stmt->error);
    }
    $stmt->close();
}
?>