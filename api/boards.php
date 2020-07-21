<?php
$method = $_SERVER['REQUEST_METHOD'];
$params = $_GET;
$payload = file_get_contents('php://input');
$filename = '../data/' . $params["id"] . '.json';

if($method === "POST") {
  file_put_contents($filename, $payload);
}else if($method === "DELETE") {
  unlink($filename);
}else if($method === "GET") {
  if (file_exists($filename))  
  {  
    $result = file_get_contents($filename, false);
    header('Content-Type: application/json');
    echo json_encode($result);
  } 
  else 
  { 
    echo http_response_code(405);
  }  
}else {
    echo http_response_code(404);
}
?>
