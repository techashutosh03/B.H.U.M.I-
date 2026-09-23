// Smooth Page Load
window.addEventListener('load', function () {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s';
        document.body.style.opacity = '1';
    }, 100);
});

// Active Navigation Highlight
const currentPage = window.location.pathname.split('/').pop();
document.querySelectorAll('.nav-item').forEach(item => {
    if (item.getAttribute('href') === currentPage) {
        item.classList.add('active');
    }
});

// Notification Click Handler
document.querySelector('.notification-icon').addEventListener('click', function () {
    alert('Notifications panel will open here');
});

// User Profile Click Handler
document.querySelector('.user-profile').addEventListener('click', function () {
    alert('Profile menu will open here');
});

// Stat Cards Animation on Scroll
const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px 0px -100px 0px'
};

const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'slideUp 0.6s ease forwards';
            statObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.stat-card').forEach(card => {
    statObserver.observe(card);
});

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// View Details Buttons
document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
        e.stopPropagation();
        const activityItem = this.closest('.activity-item');
        const title = activityItem.querySelector('h4').textContent;
        alert(`Viewing details for: ${title}`);
    });
});

// Table Action Buttons
document.querySelectorAll('.table-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        if (this.disabled) return;

        const row = this.closest('tr');
        const khasraNo = row.querySelector('td:first-child strong').textContent;
        const action = this.textContent.trim();

        if (action === 'View') {
            alert(`Viewing details for Khasra No. ${khasraNo}`);
        } else if (action === 'Download') {
            alert(`Downloading E-Registry for Khasra No. ${khasraNo}`);
            // Simulate download
            setTimeout(() => {
                alert('Download started!');
            }, 500);
        }
    });
});

// Mark Notification as Read
document.querySelectorAll('.notification-item').forEach(notification => {
    notification.addEventListener('click', function () {
        this.classList.remove('unread');
    });
});

// View All Notifications
document.querySelector('.view-all-btn').addEventListener('click', function () {
    alert('Redirecting to all notifications page...');
});

// Logout Confirmation
document.querySelector('.logout-btn').addEventListener('click', function (e) {
    e.preventDefault();
    if (confirm('Are you sure you want to logout?')) {
        window.location.href = '../../index.html';
    }
});

// Real-time Clock (Optional)
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit'
    });

    // You can add a clock element if needed
    console.log('Current Time:', timeString);
}

setInterval(updateTime, 60000);

// Smooth Scroll for Sections
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Card Hover Sound Effect (Optional - Subtle)
document.querySelectorAll('.action-card, .stat-card').forEach(card => {
    card.addEventListener('mouseenter', function () {
        this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    });
});

// Loading State for Buttons
function showLoadingState(button, originalText) {
    button.disabled = true;
    button.textContent = 'Loading...';
    button.style.opacity = '0.6';

    setTimeout(() => {
        button.disabled = false;
        button.textContent = originalText;
        button.style.opacity = '1';
    }, 1500);
}

// Add to action buttons if needed
document.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        const originalText = this.textContent;
        showLoadingState(this, originalText);
    });
});

// Dynamic Stats Update (Simulated)
function updateStats() {
    const stats = document.querySelectorAll('.stat-info h3');
    // This would typically come from an API
    console.log('Stats updated');
}

// Auto-refresh stats every 30 seconds (optional)
// setInterval(updateStats, 30000);

console.log('Citizen Dashboard Loaded Successfully! ');