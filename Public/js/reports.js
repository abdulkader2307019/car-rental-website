document.addEventListener('DOMContentLoaded', function() {
    const statCards = document.querySelectorAll('.stat-card');
    
    statCards.forEach(card => {
        card.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            
            document.querySelectorAll('.report-details').forEach(detail => {
                detail.classList.add('hidden');
            });
            
            const targetElement = document.getElementById(target);
            if (targetElement) {
                targetElement.classList.remove('hidden');
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});