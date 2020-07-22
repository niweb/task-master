<?php
$method = $_SERVER['REQUEST_METHOD'];
$params = $_GET;
$payload = file_get_contents('php://input');
$filename = '../data/' . $params["id"] . '.json';

if ($method === "POST") {
  if (!file_exists($filename)) {
    file_put_contents($filename, $payload);
    header('Content-Type: application/json');
    echo $payload;
  } else {
    http_response_code(409);
  }

} else if ($method === "PUT") {
  if (file_exists($filename)) {
    file_put_contents($filename, $payload);
    header('Content-Type: application/json');
    echo $payload;
  } else {
    http_response_code(409);
  }

} else if ($method === "DELETE") {
  unlink($filename);

} else if ($method === "GET") {
  if (file_exists($filename)) {
    $result = file_get_contents($filename, false);
    header('Content-Type: application/json');
    echo $result;
  } else {
    http_response_code(404);
  }

} else {
  http_response_code(405);
}

?>