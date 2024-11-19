<?php
require 'db_connect.php';

$sql = "SELECT p.nome_produto AS name, p.preco AS price, c.quantidade AS quantity
        FROM carrinho c
        INNER JOIN produtos p ON c.produto_id = p.id";
$result = $conn->query($sql);

$carrinho = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $carrinho[] = $row;
    }
}
echo json_encode($carrinho);
$conn->close();
?>
