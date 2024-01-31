// main.js

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
