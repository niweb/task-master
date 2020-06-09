<?php

$method = $_SERVER['REQUEST_METHOD'];
$params = $_GET;
$payload = json_decode(file_get_contents('php://input'));
$filename = '../data/boards/${params["id"]}.json';

var_dump([
  'method' => $method,
  'params' => $params,
  'payload' => $payload,
  'filename' => $filename,
]);

// Try in browser console of client app and look at response in network tab
// fetch('api/boards.php?id=3')
// fetch('api/boards.php?id=3', { method: 'post', body: JSON.stringify({foo: 'bar'}) })

// Then you can do something like this
// for post and put: file_put_contents($filename, $payload)
// for get: file_get_contents($filename)
// for delete: unlink($filename)

?>