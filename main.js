const heartContainer = document.getElementById('heart2-container');
const heartWidth = 20; // Width of the heart element

function createHeart() {
    const heart = document.createElement('div');
    heart.classList.add('heart');
    heart.style.opacity = Math.random(); // Set random opacity between 0 and 1

    const containerWidth = window.innerWidth - heartWidth; // Adjusted width to prevent hearts from overflowing the window
    let newPosition = Math.random() * (containerWidth / 2); // Generate position towards the left half of the window
    
    // Check for overlapping hearts and adjust position if necessary
    const hearts = document.querySelectorAll('.heart');
    let overlap = false;
    hearts.forEach(existingHeart => {
        const existingPosition = parseFloat(existingHeart.style.left);
        const minDistance = heartWidth * 1.5; // Minimum distance to prevent overlap
        if (Math.abs(newPosition - existingPosition) < minDistance) {
            overlap = true;
            return;
        }
    });

    if (!overlap) {
        heart.style.left = newPosition + 'px';
        heartContainer.appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, 8000);
    }
}

setInterval(createHeart, 400);
setInterval(createHeart, 500);
setInterval(createHeart, 300);


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
