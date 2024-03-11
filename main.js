// main.js
function createHeart() {
    const heart2 = document.createElement('div');
    heart2.classList.add('heart');
    heart2.style.left = Math.random() * (window.innerWidth - 20) + 'px';
    document.getElementById('heart2-container').appendChild(heart2);
  
    setTimeout(() => {
      heart2.remove();
    }, 5000);
  }
  
  setInterval(createHeart, 500);
  


document.addEventListener('DOMContentLoaded', function () {
    var checkbox = document.getElementById('open');

    checkbox.addEventListener('change', function () {
        if (checkbox.checked) {
            setTimeout(function () {
                window.location.href = 'page.html';
            }, 3000);
        }
    });
});
