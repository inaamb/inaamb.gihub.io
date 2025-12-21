// FarmConnect - Main JavaScript File
class User {
    constructor(type, name, email) {
        this.type = type; // Can be 'farmer', 'buyer', or 'admin'
        this.name = name;
        this.email = email;
        this.isLoggedIn = false;
    }

    login() {
        this.isLoggedIn = true;
        localStorage.setItem('currentUser', JSON.stringify(this));
        return true;
    }

    logout() {
        this.isLoggedIn = false;
        localStorage.removeItem('currentUser');
        return true;
    }

    static getCurrentUser() {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    }
}
class Validation {
    static validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    static validatePassword(password) {
        return password.length >= 6;
    }

    static validatePhone(phone) {
        const regex = /^[0-9]{10}$/;
        return regex.test(phone);
    }

    static validateForm(formData) {
        const errors = [];
        
        if (!this.validateEmail(formData.email)) {
            errors.push("Invalid email address");
        }
        
        if (!this.validatePassword(formData.password)) {
            errors.push("Password must be at least 6 characters");
        }
        
        if (formData.phone && !this.validatePhone(formData.phone)) {
            errors.push("Invalid phone number (10 digits required)");
        }
        
        return errors;
    }
}

// Add this at the end of script.js or in admin.js
function createDefaultAdmin() {
    const defaultAdmin = {
        type: 'admin',
        name: 'System Admin',
        email: 'admin@agrivision.com',
        password: 'admin123',
        isLoggedIn: false
    };
    
    // Store in localStorage
    localStorage.setItem('defaultAdmin', JSON.stringify(defaultAdmin));
    
    // Also create in users array for easy login
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    users.push(defaultAdmin);
    localStorage.setItem('users', JSON.stringify(users));
}

// Call this once
createDefaultAdmin();

class User {
    constructor(type, name, email) {
        this.type = type;
        this.name = name;
        this.email = email;
        this.isLoggedIn = false;
    }

    login() {
        this.isLoggedIn = true;
        localStorage.setItem('currentUser', JSON.stringify(this));
        return true;
    }

    logout() {
        this.isLoggedIn = false;
        localStorage.removeItem('currentUser');
        return true;
    }

    static getCurrentUser() {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    }
}

class Farmer extends User {
    constructor(name, email, farmName, farmType) {
        super('farmer', name, email);
        this.farmName = farmName;
        this.farmType = farmType;
        this.products = [];
    }

    addProduct(product) {
        this.products.push(product);
        return product;
    }

    getWeatherAlerts() {
        return [
            { type: 'warning', message: 'Heavy rain expected tomorrow' },
            { type: 'info', message: 'Temperature will reach 35°C in 3 days' }
        ];
    }
}

class Buyer extends User {
    constructor(name, email) {
        super('buyer', name, email);
        this.cart = [];
        this.orders = [];
    }

    addToCart(product) {
        this.cart.push(product);
        return this.cart;
    }

    checkout() {
        if (this.cart.length === 0) return false;
        
        const order = {
            id: Date.now(),
            items: [...this.cart],
            total: this.cart.reduce((sum, item) => sum + item.price, 0),
            date: new Date().toISOString()
        };
        
        this.orders.push(order);
        this.cart = [];
        return order;
    }
}

// UI Helper Functions
function showNotification(message, type = 'success') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

function redirectToDashboard(userType) {
    switch(userType) {
        case 'farmer':
            window.location.href = 'farmer.html';
            break;
        case 'buyer':
            window.location.href = 'buyer.html';
            break;
        case 'admin':
            window.location.href = 'admin.html';
            break;
        default:
            window.location.href = 'index.html';
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('FarmConnect initialized');
    
    // Check if user is already logged in
    const currentUser = User.getCurrentUser();
    if (currentUser && window.location.pathname.includes('login.html')) {
        redirectToDashboard(currentUser.type);
    }

});


