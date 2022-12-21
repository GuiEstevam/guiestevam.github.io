<?php
$url = "https://dog.ceo/api/breeds/list/all";
$dogs = json_decode(file_get_contents($url), true);
$breeds = $dogs['message'];

function getByBreed($breed)
{
      $api = 'https://dog.ceo/api/breed/' . $breed . '/images/random';
      $response = json_decode(file_get_contents($api));
      if (isset($response->status) && $response->status == 'success') {
            return $response->message;
      }
}
?>


<!DOCTYPE html>
<html lang="pt">

<head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Cachorros</title>
      <link rel="stylesheet" type="text/css" href="assets/css/style.css">
      <script src="assets/js/script.js"></script>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Inter&family=Montserrat&family=Open+Sans&family=Poppins&family=Roboto&display=swap" rel="stylesheet">
</head>

<body onload()="localData()">
      <header>
      </header>
      <div id="app">
            <section id="search">
                  <form name="breed" method="POST">
                        <select id="type-search" name="select_breeds" required>
                              <option value="" disabled selected>Selecione a raça do cachorro</option>
                              <?php
                              foreach ($breeds as $key => $value) { ?>
                                    <option value="<?php echo $key ?>">
                                          <?php echo $key ?>
                                    </option>
                              <?php  } ?>
                        </select>
                        <input type="submit" value="PESQUISAR">
                  </form>
            </section>
            <div id="content">
                  <?php
                  if (isset($_POST['select_breeds'])) {
                        $selected_breed = $_POST['select_breeds'];
                        $dogs_breed = getByBreed($selected_breed);
                  ?>
                        <div class="grid-container">
                              <h1> Dê um nome para o cachorro</h1>
                              <div class="grid-item">
                                    <img class="dog_img" id="random_dog" src="<?php echo $dogs_breed; ?>">
                              </div>
                              <form name="dog">
                                    <input type="text" class="dog_info" name="dog_name" placeholder="Nome" required>
                                    <select class="dog_info" name="select_font" required>
                                          <option value="" disabled selected>Selecione uma fonte</option>
                                          <option style="font-family: Roboto" value="Roboto">Roboto</option>
                                          <option style="font-family: Inter" value="Inter">Inter</option>
                                          <option style="font-family: Open Sans" value="Open Sans">Open Sans</option>
                                          <option style="font-family: Poppins" value="Poppins">Poppins</option>
                                          <option style="font-family: Montserrat" value="Montserrat">Montserrat</option>
                                    </select>
                                    <select class="dog_info" name="select_color" required>
                                          <option value="" disabled selected>Selecione uma cor</option>
                                          <option style="color:#0000ff" value="#0000ff">Azul</option>
                                          <option style="color:#FF0000" value="#FF0000">Vermelho</option>
                                          <option style="color:#ffa500" value="#ffa500">Laranja</option>
                                          <option style="color:#008000" value="#008000">Verde</option>
                                          <option style="color:#ffcbdb" value="#ffcbdb">Rosa</option>
                                    </select>
                                    <input type="button" value="Salvar" onClick="add()">
                              </form>
                        </div>
                  <?php
                  }
                  ?>
                  <div class="grid-container2" id="selected">
                        <div class="grid-item">
                              <h1> Esse foi o cachorro selecionado </h1>
                              <div class="grid-item">
                                    <img class="dog_img" id="dog_img">
                                    <span id="dogs_name">

                                    </span>
                              </div>
                        </div>
                  </div>
            </div>
      </div>
</body>

</html>
<script>
      if (localStorage.length > 0) {
            document.getElementById('selected').style.display = 'grid';

            let name = localStorage.getItem('name');
            let font = localStorage.getItem('font');
            let color = localStorage.getItem('color');
            let dog_image = localStorage.getItem('dog_image');
            let date = localStorage.getItem('date');

            let selected_dog = document.getElementById('dog_img');
            selected_dog.setAttribute('src', dog_image);

            let dogs_name = document.getElementById('dogs_name');
            dogs_name.innerHTML = name + '<br>' + date;
            dogs_name.style.fontFamily = font;
            dogs_name.style.color = color;
      }
</script>