<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/php_errors.log');

// Add CORS headers
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../config/db.php';

try {
    // Get parameters from the URL query string (GET request)
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $perPage = isset($_GET['perPage']) ? (int)$_GET['perPage'] : 10;
    $search = isset($_GET['search']) ? trim($_GET['search']) : '';

    // Validate parameters
    if ($page < 1) $page = 1;
    if ($perPage < 1) $perPage = 10;

    // Calculate offset for pagination
    $offset = ($page - 1) * $perPage;

    // Build the SQL query
    $sql = "SELECT * FROM audit_logs";
    $countSql = "SELECT COUNT(*) AS total FROM audit_logs";
    $params = [];
    $whereClauses = [];

    // Add search filter
    if (!empty($search)) {
        $whereClauses[] = "(
            user_name LIKE :search OR
            user_role LIKE :search OR
            action_type LIKE :search OR
            table_name LIKE :search
        )";
        $params[':search'] = "%$search%";
    }

    // Add WHERE clause if filters exist
    if (!empty($whereClauses)) {
        $where = " WHERE " . implode(" AND ", $whereClauses);
        $sql .= $where;
        $countSql .= $where;
    }

    // Add pagination
    $sql .= " ORDER BY timestamp DESC LIMIT :perPage OFFSET :offset";

    // Fetch total number of records (for pagination)
    $stmt = $pdo->prepare($countSql);
    foreach ($params as $key => $value) {
        $stmt->bindValue($key, $value, PDO::PARAM_STR);
    }
    $stmt->execute();
    $total = $stmt->fetchColumn();

    // Fetch paginated data
    $stmt = $pdo->prepare($sql);
    
    // Bind parameters for search
    foreach ($params as $key => $value) {
        $stmt->bindValue($key, $value, PDO::PARAM_STR);
    }

    // Bind pagination parameters
    $stmt->bindValue(':perPage', $perPage, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    
    $stmt->execute();
    $logs = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Return results
    echo json_encode([
        'success' => true,
        'data' => $logs,
        'total' => $total,
        'page' => $page,
        'perPage' => $perPage
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>