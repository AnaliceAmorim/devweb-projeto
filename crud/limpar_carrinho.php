<?php
require 'db_connect.php';

$sql = "DELETE FROM carrinho";
$conn->query($sql);

echo json_encode(["message" => "Carrinho limpo"]);
$conn->close();
?>
