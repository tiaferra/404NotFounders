<?php
include 'conn.php';
$result = $conn->query("SELECT * FROM Ingrediente");
?>
<table class="tabella">
  <tr class ="testata">
    <th>numeroRicetta</th>
    <th>numero</th>
    <th>ingrediente</th>
    <th>quantità</th>
  </tr>
  <?php 
    foreach($result as $riga)
    {
  ?>
  <tr class="riga"><td class="cella">
    <?php
    echo $riga["numeroRicetta"];
    ?>
  </td><td class="cella">
   <?php
    echo $riga["numero"];
    ?>
  </td><td class="cella">
   <?php
    echo $riga["ingrediente"];
    ?>
  </td><td class="cella">
   <?php
    echo $riga["quantità"];
    ?>
 </td> </tr>
 <?php
    }
  ?>
</table>