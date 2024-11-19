<?php
require 'db_connect.php';

$data = json_decode(file_get_contents("php://input"), true);
$name = $data['name'];
$change = $data['change'];

$sql = "UPDATE carrinho c
        INNER JOIN produtos p ON c.produto_id = p.id
        SET c.quantidade = c.quantidade + $change
        WHERE p.nome_produto = '$name'";
$conn->query($sql);

$sql_delete = "DELETE FROM carrinho WHERE quantidade <= 0";
$conn->query($sql_delete);

echo json_encode(["message" => "Quantidade atualizada"]);
$conn->close();
?>
