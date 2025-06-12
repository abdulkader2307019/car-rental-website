document.addEventListener('DOMContentLoaded', function() {
    // Handle stat card clicks to show/hide details
    document.querySelectorAll('.stat-card').forEach(card => {
        card.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            const detailsSection = document.getElementById(target);
            
            // Hide all other details sections
            document.querySelectorAll('.report-details').forEach(section => {
                if (section.id !== target) {
                    section.classList.add('hidden');
                }
            });
            
            // Toggle the clicked section
            if (detailsSection) {
                detailsSection.classList.toggle('hidden');
            }
        });
    });

    // Add hover effects to stat cards
    document.querySelectorAll('.stat-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
            this.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });
});