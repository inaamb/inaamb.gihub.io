// FarmConnect - Main JavaScript File
class User {
    constructor(type, name, email) {
        this.type = type; // can be 'farmer', 'buyer', or 'admin'
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
            errors.push("invalid email address");
        }
        
        if (!this.validatePassword(formData.password)) {
            errors.push("password must be at least 6 characters");
        }
        
        if (formData.phone && !this.validatePhone(formData.phone)) {
            errors.push("invalid phone number (10 digits required)");
        }
        
        return errors;
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

    requestAddProduct(productData) {
        console.log(`Farmer ${this.name} requested to add product: ${productData.name}`);
        return { success: true, message: 'Request sent to admin for approval' };
    }

    requestUpdateProduct(productId, updates) {
        console.log(`Farmer ${this.name} requested to update product ${productId}`);
        return { success: true, message: 'Update request sent to admin' };
    }

    requestRemoveProduct(productId) {
        console.log(`Farmer ${this.name} requested to remove product ${productId}`);
        return { success: true, message: 'Removal request sent to admin' };
    }

    getWeatherAlerts() {
        return [
            { type: 'warning', message: 'Heavy rain expected tomorrow' },
            { type: 'info', message: 'Temperature will reach 35°C in 3 days' }
        ];
    }

    getInventoryAlerts() {
        return [
            { item: 'Tomato Seeds', level: '15%', status: 'low' },
            { item: 'Fertilizer', level: '40%', status: 'medium' },
            { item: 'Livestock Feed', level: '5%', status: 'critical' }
        ];
    }

    getAIDecisionSupport(crop, soil, season) {
        // simple AI logic
        const recommendations = {
            planting: 'Plant in well-drained soil with full sun exposure',
            irrigation: 'Water deeply once a week, more frequently in hot weather',
            fertilization: 'Apply organic fertilizer every 4 weeks',
            market: 'Current prices favorable, consider selling in 2 weeks'
        };
        
        return recommendations;
    }
}

class Buyer extends User {
    constructor(name, email) {
        super('buyer', name, email);
        this.cart = [];
        this.orders = [];
        this.notifications = [];
    }

    addToCart(product) {
        this.cart.push(product);
        return this.cart;
    }

    checkout() {
        if (this.cart.length === 0) return false;
        
        const order = new Order(
            Date.now(),
            [...this.cart],
            this.cart.reduce((sum, item) => sum + item.price, 0),
            'pending'
        );
        
        this.orders.push(order);
        this.cart = [];
        return order;
    }

    placeOrder(order) {
        order.confirm();
        this.orders.push(order);
        return order;
    }

    cancelOrder(orderId) {
        const order = this.orders.find(o => o.orderId === orderId);
        if (order) {
            order.cancel();
            return true;
        }
        return false;
    }

    browseProduct() {
        // returns available products
        const products = JSON.parse(localStorage.getItem('products') || '[]');
        return products;
    }

    receiveNotification(message) {
        this.notifications.push({
            message: message,
            date: new Date().toISOString(),
            read: false
        });
        return this.notifications;
    }

    subscribeMealKit(mealKit) {
        mealKit.subscribe();
        return mealKit;
    }

    customizeMealKit(mealKit, preferences) {
        mealKit.customize(preferences);
        return mealKit;
    }
}

class Order {
    constructor(orderId, items, totalAmount, status) {
        this.orderId = orderId;
        this.items = items;
        this.totalAmount = totalAmount;
        this.status = status;
        this.orderDate = new Date().toISOString();
    }

    addProduct(product) {
        this.items.push(product);
        this.calculateTotal();
        return this;
    }

    addMealKit(mealKit) {
        this.items.push(mealKit);
        this.calculateTotal();
        return this;
    }

    calculateTotal() {
        this.totalAmount = this.items.reduce((sum, item) => sum + (item.price || 0), 0);
        return this.totalAmount;
    }

    cancel() {
        this.status = 'cancelled';
        return this;
    }

    confirm() {
        this.status = 'confirmed';
        return this;
    }
}

class MealKit {
    constructor(mealKitId, name, ingredients, dietType, price) {
        this.mealKitId = mealKitId;
        this.name = name;
        this.ingredients = ingredients;
        this.dietType = dietType;
        this.price = price;
        this.status = 'available';
        this.deliveryFrequency = 'weekly';
    }

    addIngredient(ingredient) {
        this.ingredients.push(ingredient);
        this.calculatePrice();
        return this;
    }

    removeIngredient(ingredientName) {
        this.ingredients = this.ingredients.filter(i => i.name !== ingredientName);
        this.calculatePrice();
        return this;
    }

    calculatePrice() {
        // simple price calculation
        this.price = 10 + (this.ingredients.length * 2);
        return this.price;
    }

    changeFrequency(frequency) {
        this.deliveryFrequency = frequency;
        return this;
    }

    subscribe() {
        this.status = 'subscribed';
        return this;
    }

    customize(preferences) {
        if (preferences.vegetarian) {
            this.dietType = 'vegetarian';
        }
        if (preferences.vegan) {
            this.dietType = 'vegan';
        }
        return this;
    }
}

class Product {
    constructor(productId, name, category, quantity, price, unit) {
        this.productId = productId;
        this.name = name;
        this.category = category;
        this.quantity = quantity;
        this.price = price;
        this.unit = unit;
        this.status = 'available';
        this.harvestDate = new Date().toISOString().split('T')[0];
    }

    updatePrice(newPrice) {
        this.price = newPrice;
        return this;
    }

    updateQuantity(newQuantity) {
        this.quantity = newQuantity;
        return this;
    }

    markAsUnavailable() {
        this.status = 'unavailable';
        return this;
    }
}

class Farm {
    constructor(farmId, farmName, farmLocation) {
        this.farmId = farmId;
        this.farmName = farmName;
        this.farmLocation = farmLocation;
        this.products = [];
    }

    getProducts() {
        return this.products;
    }

    getDetails() {
        return {
            farmId: this.farmId,
            farmName: this.farmName,
            farmLocation: this.farmLocation,
            productCount: this.products.length
        };
    }

    addProduct(product) {
        this.products.push(product);
        return this;
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

// initialize demo data
if (!localStorage.getItem('users')) {
    const defaultUsers = [
        {
            type: 'admin',
            name: 'System Admin',
            email: 'admin@agrivision.com',
            password: 'admin123',
            phone: '555-0001'
        },
        {
            type: 'farmer',
            name: 'John Farmer',
            email: 'john@farm.com',
            password: 'farmer123',
            phone: '555-0101',
            farmName: 'Green Valley Farm',
            farmType: 'Crop Farming'
        },
        {
            type: 'buyer',
            name: 'Lisa Shopper',
            email: 'lisa@buyer.com',
            password: 'buyer123',
            phone: '555-0201'
        }
    ];
    localStorage.setItem('users', JSON.stringify(defaultUsers));
}

// initialize forum posts
if (!localStorage.getItem('forumPosts')) {
    const defaultPosts = [
        {
            id: 1,
            question: 'How to control aphids organically?',
            category: 'Pest Control',
            author: 'Ahmed',
            date: '2024-01-10',
            answers: ['Use neem oil solution (5ml per liter) sprayed early morning.']
        },
        {
            id: 2,
            question: 'Best irrigation schedule for tomatoes in summer?',
            category: 'Crops',
            author: 'Fatima',
            date: '2024-01-12',
            answers: ['Drip irrigation daily for 30 minutes in early morning.']
        }
    ];
    localStorage.setItem('forumPosts', JSON.stringify(defaultPosts));
}

// initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('FarmConnect initialized');
    
    // check if user is already logged in
    const currentUser = User.getCurrentUser();
    if (currentUser && window.location.pathname.includes('login.html')) {
        redirectToDashboard(currentUser.type);
    }
});
