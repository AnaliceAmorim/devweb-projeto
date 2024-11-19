<?php
require 'db_connect.php';

$data = json_decode(file_get_contents("php://input"), true);
$name = $data['name'];
$price = $data['price'];
$quantity = $data['quantity'];

$sql = "INSERT INTO carrinho (produto_id, quantidade) 
        SELECT id, $quantity FROM produtos WHERE nome_produto = '$name'
        ON DUPLICATE KEY UPDATE quantidade = quantidade + $quantity";
$conn->query($sql);

echo json_encode(["message" => "Produto adicionado ao carrinho"]);
$conn->close();
?>
