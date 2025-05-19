function animateCounter(element, target, duration = 2000) {
    const start = parseInt(element.textContent);
    const increment = (target - start) / (duration / 16);
    let current = start;

    const animate = () => {
        current += increment;
        element.textContent = Math.round(current);

        if (current < target) {
            requestAnimationFrame(animate);
        } else {
            element.textContent = target;
        }
    };

    animate();
}

document.addEventListener('DOMContentLoaded', () => {
    const stats = {
        carsRented: 47,
        milesOvercome: 12350,
        hoursOnRoad: 892,
        citiesVisited: 23
    };

    Object.entries(stats).forEach(([key, value]) => {
        const element = document.getElementById(key);
        if (element) {
            animateCounter(element, value);
        }
    });

    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
});