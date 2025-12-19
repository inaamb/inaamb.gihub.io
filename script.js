// FarmConnect Platform - Main JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('FarmConnect Platform initialized');
    
    // Check if user is logged in
    checkLoginStatus();
    
    // Initialize all components
    initializeComponents();
});

function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userType = localStorage.getItem('userType');
    
    // Update UI based on login status
    if (isLoggedIn === 'true' && window.location.pathname.includes('login.html')) {
        // Redirect based on user type
        if (userType === 'farmer') {
            window.location.href = 'farmer-dashboard.html';
        } else if (userType === 'buyer') {
            window.location.href = 'buyer-marketplace.html';
        }
    }
}

function initializeComponents() {
    // Add to cart buttons
    initializeCartButtons();
    
    // Quantity controls
    initializeQuantityControls();
    
    // Form submissions
    initializeForms();
    
    // Weather alerts
    initializeWeatherAlerts();
}

function initializeCartButtons() {
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const product = this.closest('.card').querySelector('.card-title').textContent;
            showNotification(`${product} added to cart!`, 'success');
        });
    });
}

function initializeQuantityControls() {
    document.querySelectorAll('.input-group .btn').forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            let value = parseInt(input.value) || 0;
            
            if (this.textContent === '+') {
                input.value = value + 1;
            } else if (this.textContent === '-' && value > 1) {
                input.value = value - 1;
            }
        });
    });
}

function initializeForms() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            localStorage.setItem('userEmail', email);
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userType', 'farmer'); // Default for demo
            window.location.href = 'farmer-dashboard.html';
        });
    }
    
    // Signup form
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const userType = document.querySelector('input[name="userType"]:checked').value;
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userType', userType);
            
            if (userType === 'farmer') {
                window.location.href = 'farmer-dashboard.html';
            } else {
                window.location.href = 'buyer-marketplace.html';
            }
        });
    }
    
    // Add product form
    const addProductForm = document.getElementById('addProductForm');
    if (addProductForm) {
        addProductForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('Product added successfully!', 'success');
            this.reset();
            
            // Close modal if exists
            const modal = bootstrap.Modal.getInstance(document.querySelector('#addProductModal'));
            if (modal) modal.hide();
        });
    }
}

function initializeWeatherAlerts() {
    // Simulate weather alerts
    if (window.location.pathname.includes('weather-alerts.html') || 
        window.location.pathname.includes('farmer-dashboard.html')) {
        
        const alerts = [
            {
                type: 'warning',
                icon: 'fa-exclamation-triangle',
                title: 'Heavy Rain Alert',
                message: 'Expected in your region tomorrow. Prepare drainage systems.',
                time: '2 hours ago'
            },
            {
                type: 'info',
                icon: 'fa-temperature-high',
                title: 'Temperature Warning',
                message: 'Heat wave expected next week. Water crops early morning.',
                time: '1 day ago'
            },
            {
                type: 'danger',
                icon: 'fa-wind',
                title: 'Strong Winds Alert',
                message: 'High winds expected tonight. Secure equipment and structures.',
                time: '3 hours ago'
            }
        ];
        
        // Display alerts if there's a container
        const alertContainer = document.getElementById('weatherAlertsContainer');
        if (alertContainer) {
            alerts.forEach(alert => {
                const alertElement = document.createElement('div');
                alertElement.className = `alert alert-${alert.type}`;
                alertElement.innerHTML = `
                    <div class="d-flex">
                        <i class="fas ${alert.icon} me-3 mt-1"></i>
                        <div>
                            <h6 class="mb-1">${alert.title}</h6>
                            <p class="mb-1">${alert.message}</p>
                            <small class="text-muted">${alert.time}</small>
                        </div>
                    </div>
                `;
                alertContainer.appendChild(alertElement);
            });
        }
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} notification-alert`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease;
    `;
    notification.innerHTML = `
        <div class="d-flex justify-content-between align-items-center">
            <span>${message}</span>
            <button type="button" class="btn-close" onclick="this.parentElement.parentElement.remove()"></button>
        </div>
    `;
    
    // Add styles for animation
    if (!document.querySelector('#notificationStyles')) {
        const styles = document.createElement('style');
        styles.id = 'notificationStyles';
        styles.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
}

// Logout function
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userType');
    localStorage.removeItem('userEmail');
    window.location.href = 'index.html';
}

// Add logout functionality to all logout buttons
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('[onclick*="logout"]').forEach(button => {
        button.addEventListener('click', logout);
    });
});