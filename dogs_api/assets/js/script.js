function add() {
 alert('Sucesso!');
 let timeElapsed = Date.now();
 let today = new Date(timeElapsed);
 let formated_today = today.toLocaleString();

 localStorage.setItem('name', document.dog.dog_name.value);
 localStorage.setItem('font', document.dog.select_font.value);
 localStorage.setItem('color', document.dog.select_color.value);
 image = document.getElementById('random_dog');
 image_src = image.getAttribute('src');
 localStorage.setItem('dog_image', image_src);
 localStorage.setItem('date', formated_today);

 let name = localStorage.getItem('name');
 let font = localStorage.getItem('font');
 let color = localStorage.getItem('color');
 let dog_image = localStorage.getItem('dog_image');
 let date = localStorage.getItem('date');

 selected_dog = document.getElementById('dog_img');
 image_src = selected_dog.setAttribute('src', dog_image);

 dogs_name = document.getElementById('dogs_name');
 dogs_name.innerHTML = name + '<br>' + date;
 dogs_name.style.fontFamily = font;
 dogs_name.style.color = color;

 document.getElementById('selected').style.display = 'grid';
}
