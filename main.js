document.addEventListener('DOMContentLoaded', function() {
    var checkbox = document.getElementById('open');
    var label = document.querySelector('.open');

    label.addEventListener('click', function() {
        if (checkbox.checked) {
            setTimeout(function() {
                window.location.href = 'page.html';
            }, 2); // Wait for 2 seconds
        }
    });
});