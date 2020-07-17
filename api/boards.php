<?php
$method = $_SERVER['REQUEST_METHOD'];
$params = $_GET;
$payload = file_get_contents('php://input');
$filename = '../data/' . $params["id"] . '.json';
var_dump([
  'method' => $method,
  'params' => $params,
  'payload' => $payload,
  'filename' => $filename,
]);
if($method  == "POST") {
  file_put_contents($filename, $payload);
}else if($method == "DELETE") {
  delete: unlink($filename);
}else if($method == "GET") {
  if (file_exists($filename))  
  { 
    file_get_contents($filename);
  } 
  else 
  { 
    file_put_contents($filename, $payload);
  }  
}else {
    $jsonArray["error"] = TRUE;
    $jsonArray["errormess"] = "not works  or not defined any";
}
//file_put_contents($filename, $payload)
// Try in browser console of client app and look at response in network tab
// fetch('api/boards.php?id=3')
// fetch('api/boards.php?id=3', { method: 'post', body: JSON.stringify({foo: 'bar'}) })
// Then you can do something like this
// for post and put: file_put_contents($filename, $payload)
// for get: file_get_contents($filename)
// for delete: unlink($filename)
?>