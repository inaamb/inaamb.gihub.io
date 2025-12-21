// ============================================
// FarmConnect Admin JavaScript
// ============================================

// Admin class extending User
class Admin extends User {
    constructor(name, email) {
        super('admin', name, email);
        this.permissions = ['all'];
    }

    // Approve or reject user registration
    approveUser(userId, approve = true, reason = '') {
        console.log(`Admin ${this.name} ${approve ? 'approved' : 'rejected'} user ${userId}. Reason: ${reason}`);
        return true;
    }

    // Update market prices
    updateMarketPrices(product, newPrice) {
        console.log(`Admin ${this.name} updated ${product} price to ${newPrice}`);
        return true;
    }

    // Add/modify weather information
    updateWeatherData(alert) {
        console.log(`Admin ${this.name} added weather alert: ${JSON.stringify(alert)}`);
        return true;
    }

    // Monitor platform activity
    monitorPlatform() {
        const stats = {
            onlineUsers: Math.floor(Math.random() * 50) + 20,
            activeOrders: Math.floor(Math.random() * 30) + 5,
            serverHealth: 'Good',
            revenueToday: (Math.random() * 1000 + 500).toFixed(2)
        };
        return stats;
    }

    // Ban or restrict user account
    banUser(userId, reason = 'Violation of terms') {
        console.log(`Admin ${this.name} banned user ${userId}. Reason: ${reason}`);
        return true;
    }

    // Directly modify product information
    updateProduct(productId, updates) {
        console.log(`Admin ${this.name} updated product ${productId}:`, updates);
        return true;
    }

    // Add new product directly to catalog
    addProduct(productData) {
        console.log(`Admin ${this.name} added product:`, productData);
        return productData;
    }

    // Remove product from catalog
    removeProduct(productId) {
        console.log(`Admin ${this.name} removed product ${productId}`);
        return true;
    }

    // Update farm information
    updateFarmInfo(farmId, updates) {
        console.log(`Admin ${this.name} updated farm ${farmId}:`, updates);
        return true;
    }

    // Handle farmer requests
    handleFarmRequest(requestId, action, comments = '') {
        console.log(`Admin ${this.name} ${action} farmer request ${requestId}. Comments: ${comments}`);
        return true;
    }
}

// ============================================
// ADMIN SESSION MANAGEMENT
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Check if admin is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.type !== 'admin') {
        window.location.href = 'login.html';
        return;
    }

    // Initialize admin
    const admin = new Admin(currentUser.name, currentUser.email);
    
    // Load all sections
    loadDashboard();
    loadUsers();
    loadProducts();
    loadMarketPrices();
    loadWeatherAlerts();
    loadFarmerRequests();
    loadSystemLogs();
    loadFarms();
    
    // Start monitoring
    startPlatformMonitoring();
    
    console.log('Admin dashboard initialized for:', admin.name);
});

// ============================================
// SECTION MANAGEMENT
// ============================================

function showSection(section) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(div => {
        div.style.display = 'none';
    });
    
    // Show selected section
    const sectionElement = document.getElementById(section + 'Section');
    if (sectionElement) {
        sectionElement.style.display = 'block';
    }
    
    // Update active menu item
    document.querySelectorAll('.list-group-item').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Refresh section data
    switch(section) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'users':
            loadUsers();
            break;
        case 'products':
            loadProducts();
            break;
        case 'prices':
            loadMarketPrices();
            break;
        case 'weather':
            loadWeatherAlerts();
            break;
        case 'requests':
            loadFarmerRequests();
            break;
        case 'monitor':
            updateSystemStats();
            break;
        case 'farms':
            loadFarms();
            break;
    }
}

// ============================================
// DASHBOARD FUNCTIONS
// ============================================

function loadDashboard() {
    // Update quick stats
    updateDashboardStats();
    
    // Load recent requests
    loadRecentRequests();
}

function updateDashboardStats() {
    // Simulate data - in real app, fetch from API
    const stats = {
        totalUsers: 42,
        pendingRequests: 3,
        activeProducts: 28,
        revenue: '$1,248.75'
    };
    
    document.getElementById('totalUsers').textContent = stats.totalUsers;
    document.getElementById('pendingRequests').textContent = stats.pendingRequests;
    document.getElementById('activeProducts').textContent = stats.activeProducts;
    document.getElementById('revenue').textContent = stats.revenue;
    
    // Update request badge
    updateRequestBadge();
}

function loadRecentRequests() {
    const requests = [
        { farmer: 'John Farmer', product: 'Tomatoes', request: 'Price update to $3.00/kg', time: '2 hours ago' },
        { farmer: 'Sarah Grower', product: 'Carrots', request: 'Add organic certification', time: '4 hours ago' },
        { farmer: 'Riverbend Farm', product: 'Potatoes', request: 'Increase quantity to 200kg', time: '1 day ago' }
    ];
    
    const container = document.getElementById('recentRequests');
    let html = '';
    
    requests.forEach(req => {
        html += `
            <div class="alert alert-light border mb-2">
                <div class="d-flex justify-content-between">
                    <div>
                        <strong>${req.product}</strong> - ${req.farmer}
                        <p class="mb-0 small">${req.request}</p>
                    </div>
                    <div class="text-end">
                        <small class="text-muted">${req.time}</small><br>
                        <button class="btn btn-sm btn-outline-danger mt-1" onclick="showSection('requests')">Review</button>
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function updateRequestBadge() {
    const pendingCount = parseInt(document.getElementById('pendingRequests').textContent) || 0;
    const badge = document.getElementById('requestBadge');
    badge.textContent = pendingCount;
    
    if (pendingCount === 0) {
        badge.classList.remove('bg-danger');
        badge.classList.add('bg-secondary');
    } else {
        badge.classList.remove('bg-secondary');
        badge.classList.add('bg-danger');
    }
}

// ============================================
// USER MANAGEMENT FUNCTIONS
// ============================================

let allUsers = [];

function loadUsers() {
    // Sample users data
    allUsers = [
        { id: 1, name: 'John Farmer', email: 'john@greenvalley.com', type: 'farmer', status: 'active', registered: '2024-01-10' },
        { id: 2, name: 'Sarah Grower', email: 'sarah@sunnyacres.com', type: 'farmer', status: 'active', registered: '2024-01-12' },
        { id: 3, name: 'Mike Customer', email: 'mike@email.com', type: 'buyer', status: 'active', registered: '2024-01-13' },
        { id: 4, name: 'Lisa Shopper', email: 'lisa@email.com', type: 'buyer', status: 'pending', registered: '2024-01-14' },
        { id: 5, name: 'David Miller', email: 'david@farm.com', type: 'farmer', status: 'pending', registered: '2024-01-14' },
        { id: 6, name: 'Emma Wilson', email: 'emma@buyer.com', type: 'buyer', status: 'banned', registered: '2024-01-05' },
        { id: 7, name: 'Admin User', email: 'admin@agrivision.com', type: 'admin', status: 'active', registered: '2024-01-01' }
    ];
    
    // Set up event listeners for filters
    document.getElementById('searchUsers').addEventListener('input', filterUsers);
    document.getElementById('filterUserType').addEventListener('change', filterUsers);
    document.getElementById('filterUserStatus').addEventListener('change', filterUsers);
    
    // Initial display
    displayUsers(allUsers);
}

function displayUsers(users) {
    const table = document.getElementById('usersTable');
    
    if (users.length === 0) {
        table.innerHTML = '<tr><td colspan="7" class="text-center py-4 text-muted">No users found</td></tr>';
        return;
    }
    
    let html = '';
    
    users.forEach(user => {
        const typeClass = user.type === 'farmer' ? 'badge bg-primary' : 
                         user.type === 'buyer' ? 'badge bg-info' : 
                         'badge bg-danger';
        
        const statusClass = user.status === 'active' ? 'badge bg-success' : 
                           user.status === 'pending' ? 'badge bg-warning' : 
                           'badge bg-danger';
        
        html += `
            <tr>
                <td>${user.id}</td>
                <td>
                    ${user.name}
                    ${user.type === 'admin' ? '<i class="fas fa-shield-alt ms-1 text-danger"></i>' : ''}
                </td>
                <td>${user.email}</td>
                <td><span class="${typeClass}">${user.type}</span></td>
                <td><span class="${statusClass}">${user.status}</span></td>
                <td><small class="text-muted">${user.registered}</small></td>
                <td>
                    ${user.status === 'pending' ? `
                        <button class="btn btn-sm btn-success me-1 mb-1" onclick="approveUser(${user.id})">
                            <i class="fas fa-check"></i>
                        </button>
                        <button class="btn btn-sm btn-danger me-1 mb-1" onclick="rejectUser(${user.id})">
                            <i class="fas fa-times"></i>
                        </button>
                    ` : ''}
                    
                    ${user.status === 'active' && user.type !== 'admin' ? `
                        <button class="btn btn-sm btn-warning me-1 mb-1" onclick="banUser(${user.id})">
                            <i class="fas fa-ban"></i>
                        </button>
                    ` : ''}
                    
                    ${user.status === 'banned' ? `
                        <button class="btn btn-sm btn-info me-1 mb-1" onclick="unbanUser(${user.id})">
                            <i class="fas fa-unlock"></i>
                        </button>
                    ` : ''}
                    
                    <button class="btn btn-sm btn-outline-secondary mb-1" onclick="viewUserDetails(${user.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            </tr>
        `;
    });
    
    table.innerHTML = html;
}

function filterUsers() {
    const searchTerm = document.getElementById('searchUsers').value.toLowerCase();
    const typeFilter = document.getElementById('filterUserType').value;
    const statusFilter = document.getElementById('filterUserStatus').value;
    
    const filtered = allUsers.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm) || 
                            user.email.toLowerCase().includes(searchTerm);
        const matchesType = !typeFilter || user.type === typeFilter;
        const matchesStatus = !statusFilter || user.status === statusFilter;
        
        return matchesSearch && matchesType && matchesStatus;
    });
    
    displayUsers(filtered);
}

function approveUser(userId) {
    const user = allUsers.find(u => u.id === userId);
    if (user) {
        user.status = 'active';
        alert(`User ${user.name} has been approved.`);
        filterUsers();
        updateDashboardStats();
    }
}

function rejectUser(userId) {
    const reason = prompt('Enter rejection reason:');
    if (reason) {
        const user = allUsers.find(u => u.id === userId);
        if (user) {
            user.status = 'rejected';
            alert(`User ${user.name} rejected. Reason: ${reason}`);
            filterUsers();
        }
    }
}

function banUser(userId) {
    const reason = prompt('Enter ban reason:');
    if (reason) {
        const user = allUsers.find(u => u.id === userId);
        if (user) {
            user.status = 'banned';
            alert(`User ${user.name} has been banned. Reason: ${reason}`);
            filterUsers();
        }
    }
}

function unbanUser(userId) {
    const user = allUsers.find(u => u.id === userId);
    if (user) {
        user.status = 'active';
        alert(`User ${user.name} has been unbanned.`);
        filterUsers();
    }
}

function viewUserDetails(userId) {
    const user = allUsers.find(u => u.id === userId);
    if (user) {
        alert(`User Details:\n\nID: ${user.id}\nName: ${user.name}\nEmail: ${user.email}\nType: ${user.type}\nStatus: ${user.status}\nRegistered: ${user.registered}`);
    }
}

// ============================================
// PRODUCT MANAGEMENT FUNCTIONS
// ============================================

let allProducts = [];

function loadProducts() {
    // Sample products data
    allProducts = [
        { id: 1, name: 'Organic Tomatoes', category: 'Vegetables', price: 2.75, farmer: 'Green Valley Farm', organic: true, stock: 50 },
        { id: 2, name: 'Fresh Carrots', category: 'Vegetables', price: 1.90, farmer: 'Sunny Acres', organic: false, stock: 100 },
        { id: 3, name: 'Potatoes', category: 'Vegetables', price: 1.40, farmer: 'Riverbend Farm', organic: false, stock: 200 },
        { id: 4, name: 'Lettuce', category: 'Vegetables', price: 3.00, farmer: 'Green Valley Farm', organic: true, stock: 30 },
        { id: 5, name: 'Apples', category: 'Fruits', price: 2.20, farmer: 'Orchard Hills', organic: true, stock: 150 },
        { id: 6, name: 'Fresh Milk', category: 'Dairy', price: 4.50, farmer: 'Happy Cows Dairy', organic: true, stock: 40 },
        { id: 7, name: 'Organic Eggs', category: 'Dairy', price: 5.75, farmer: 'Sunny Acres', organic: true, stock: 60 }
    ];
    
    displayProducts(allProducts);
}

function displayProducts(products) {
    const container = document.getElementById('productsContainer');
    
    if (products.length === 0) {
        container.innerHTML = '<div class="alert alert-info">No products found</div>';
        return;
    }
    
    let html = '<div class="row">';
    
    products.forEach(product => {
        html += `
            <div class="col-md-6 mb-3">
                <div class="card product-card">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <h6 class="card-title mb-0">${product.name}</h6>
                            ${product.organic ? '<span class="badge bg-success">Organic</span>' : ''}
                        </div>
                        <p class="card-text small text-muted mb-2">
                            Category: ${product.category}<br>
                            Farmer: ${product.farmer}<br>
                            Stock: ${product.stock} kg
                        </p>
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <span class="h5 text-success">$${product.price}</span>
                                <span class="text-muted">/kg</span>
                            </div>
                            <div>
                                <button class="btn btn-sm btn-outline-danger me-1" onclick="editProduct(${product.id})">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn btn-sm btn-outline-dark" onclick="deleteProduct(${product.id})">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
    
    // Update product count
    document.getElementById('activeProducts').textContent = products.length;
}

function searchProducts() {
    const searchTerm = document.getElementById('searchProducts').value.toLowerCase();
    
    const filtered = allProducts.filter(product => {
        return product.name.toLowerCase().includes(searchTerm) ||
               product.category.toLowerCase().includes(searchTerm) ||
               product.farmer.toLowerCase().includes(searchTerm);
    });
    
    displayProducts(filtered);
}

function addProduct(e) {
    e.preventDefault();
    
    const form = e.target;
    const productData = {
        id: allProducts.length + 1,
        name: form.querySelector('input[placeholder="Product Name"]').value,
        category: form.querySelector('select').value,
        price: parseFloat(form.querySelector('input[placeholder="Price"]').value),
        farmer: form.querySelector('input[placeholder="Farmer/Farm Name"]').value || 'Admin Added',
        organic: form.querySelector('#organicCheck').checked,
        stock: Math.floor(Math.random() * 100) + 20
    };
    
    allProducts.push(productData);
    
    alert(`Product "${productData.name}" added to catalog!`);
    form.reset();
    displayProducts(allProducts);
    
    return false;
}

function editProduct(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;
    
    const newPrice = prompt(`Enter new price for ${product.name} (current: $${product.price}):`, product.price);
    if (newPrice && !isNaN(newPrice)) {
        product.price = parseFloat(newPrice);
        alert(`Price updated to $${newPrice}`);
        displayProducts(allProducts);
    }
}

function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        allProducts = allProducts.filter(p => p.id !== productId);
        alert('Product deleted from catalog');
        displayProducts(allProducts);
    }
}

// ============================================
// MARKET PRICES FUNCTIONS
// ============================================

function loadMarketPrices() {
    const prices = [
        { product: 'Tomatoes', market: 'Central Market', price: 2.75, trend: 'increasing', updated: 'Today', suggestion: 'Wait 1 week' },
        { product: 'Potatoes', market: 'Central Market', price: 1.40, trend: 'stable', updated: 'Today', suggestion: 'Sell now' },
        { product: 'Carrots', market: 'Central Market', price: 1.90, trend: 'increasing', updated: 'Today', suggestion: 'Wait 3 days' },
        { product: 'Lettuce', market: 'East Market', price: 3.00, trend: 'increasing', updated: 'Yesterday', suggestion: 'Good price' },
        { product: 'Apples', market: 'North Market', price: 2.20, trend: 'decreasing', updated: '2 days ago', suggestion: 'Sell immediately' },
        { product: 'Milk', market: 'West Market', price: 4.50, trend: 'stable', updated: 'Today', suggestion: 'Stable demand' }
    ];
    
    const table = document.getElementById('pricesTable');
    let html = '';
    
    prices.forEach(item => {
        const trendClass = item.trend === 'increasing' ? 'badge bg-success' : 
                         item.trend === 'decreasing' ? 'badge bg-danger' : 
                         'badge bg-secondary';
        
        const suggestionClass = item.suggestion.includes('Wait') ? 'badge bg-info' :
                              item.suggestion.includes('Sell') ? 'badge bg-warning' :
                              'badge bg-success';
        
        html += `
            <tr>
                <td><strong>${item.product}</strong></td>
                <td>${item.market}</td>
                <td>$${item.price}/kg</td>
                <td><span class="${trendClass}">${item.trend}</span></td>
                <td><small class="text-muted">${item.updated}</small></td>
                <td><span class="${suggestionClass}">${item.suggestion}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-danger" onclick="updatePrice('${item.product}')">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            </tr>
        `;
    });
    
    table.innerHTML = html;
}

function updatePrice(product) {
    const newPrice = prompt(`Enter new price for ${product}:`);
    if (newPrice && !isNaN(newPrice)) {
        alert(`${product} price updated to $${newPrice}`);
        loadMarketPrices(); // Refresh the table
    }
}

function updateAllPrices() {
    if (confirm('Update all market prices with latest data?')) {
        alert('All market prices updated successfully!');
        loadMarketPrices();
    }
}

function addPriceEntry(e) {
    e.preventDefault();
    
    const form = e.target;
    const product = form.querySelector('input[placeholder="Product Name"]').value;
    const market = form.querySelector('input[placeholder="Market"]').value;
    const price = form.querySelector('input[placeholder="Price"]').value;
    const trend = form.querySelector('select').value;
    
    if (product && market && price && trend) {
        alert(`New price entry added:\nProduct: ${product}\nMarket: ${market}\nPrice: $${price}\nTrend: ${trend}`);
        form.reset();
    } else {
        alert('Please fill all fields');
    }
    
    return false;
}

// ============================================
// WEATHER ALERTS FUNCTIONS
// ============================================

let weatherAlerts = [];

function loadWeatherAlerts() {
    weatherAlerts = [
        { id: 1, type: 'Rain', severity: 'High', message: 'Heavy rainfall expected tomorrow. Prepare drainage systems.', regions: ['North', 'East'], date: '2024-01-15', active: true },
        { id: 2, type: 'Heat Wave', severity: 'Medium', message: 'Temperatures reaching 35°C in 3 days. Water crops early.', regions: ['South'], date: '2024-01-16', active: true },
        { id: 3, type: 'Wind', severity: 'Low', message: 'Strong winds expected tonight. Secure loose items.', regions: ['West'], date: '2024-01-14', active: true },
        { id: 4, type: 'Frost', severity: 'Critical', message: 'Frost warning for early morning. Protect sensitive crops.', regions: ['North', 'East'], date: '2024-01-13', active: false }
    ];
    
    displayWeatherAlerts();
}

function displayWeatherAlerts() {
    const container = document.getElementById('weatherAlertsContainer');
    const activeAlerts = weatherAlerts.filter(alert => alert.active);
    
    document.getElementById('activeAlertsCount').textContent = activeAlerts.length;
    
    if (activeAlerts.length === 0) {
        container.innerHTML = '<div class="alert alert-info">No active weather alerts</div>';
        return;
    }
    
    let html = '';
    
    activeAlerts.forEach(alert => {
        const severityClass = alert.severity === 'Critical' ? 'alert-danger' :
                            alert.severity === 'High' ? 'alert-warning' :
                            alert.severity === 'Medium' ? 'alert-info' :
                            'alert-secondary';
        
        html += `
            <div class="alert ${severityClass} mb-3">
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <h6><i class="fas fa-exclamation-triangle me-2"></i>${alert.type} Alert</h6>
                        <p class="mb-1 small">${alert.message}</p>
                        <small class="text-muted">
                            <i class="fas fa-map-marker-alt me-1"></i>Regions: ${alert.regions.join(', ')} | 
                            <i class="fas fa-calendar me-1 ms-2"></i>${alert.date}
                        </small>
                    </div>
                    <div class="text-end">
                        <span class="badge ${severityClass.replace('alert-', 'bg-')}">${alert.severity}</span><br>
                        <button class="btn btn-sm btn-outline-dark mt-2" onclick="removeWeatherAlert(${alert.id})">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function createWeatherAlert(e) {
    e.preventDefault();
    
    const form = e.target;
    const type = form.querySelector('select').value;
    const severity = form.querySelectorAll('select')[1].value;
    
    // Get checked regions
    const regions = [];
    if (document.getElementById('northRegion').checked) regions.push('North');
    if (document.getElementById('southRegion').checked) regions.push('South');
    if (document.getElementById('eastRegion').checked) regions.push('East');
    if (document.getElementById('westRegion').checked) regions.push('West');
    
    const message = form.querySelector('textarea').value;
    const date = form.querySelector('input[type="date"]').value || new Date().toISOString().split('T')[0];
    
    const newAlert = {
        id: weatherAlerts.length + 1,
        type: type,
        severity: severity,
        message: message,
        regions: regions,
        date: date,
        active: true
    };
    
    weatherAlerts.push(newAlert);
    
    alert(`${severity} ${type} alert published to ${regions.length} region(s)!`);
    form.reset();
    displayWeatherAlerts();
    
    return false;
}

function removeWeatherAlert(alertId) {
    if (confirm('Remove this weather alert?')) {
        const alert = weatherAlerts.find(a => a.id === alertId);
        if (alert) {
            alert.active = false;
            displayWeatherAlerts();
        }
    }
}

// ============================================
// FARMER REQUESTS FUNCTIONS
// ============================================

let farmerRequests = [];

function loadFarmerRequests() {
    farmerRequests = [
        { id: 1, farmer: 'John Farmer', farm: 'Green Valley Farm', product: 'Organic Tomatoes', request: 'Update price to $3.00/kg due to increased quality', status: 'pending', date: '2024-01-15', farmerEmail: 'john@greenvalley.com' },
        { id: 2, farmer: 'Sarah Grower', farm: 'Sunny Acres', product: 'Carrots', request: 'Add organic certification badge to product listing', status: 'pending', date: '2024-01-14', farmerEmail: 'sarah@sunnyacres.com' },
        { id: 3, farmer: 'John Farmer', farm: 'Green Valley Farm', product: 'Lettuce', request: 'Increase available quantity to 50kg', status: 'pending', date: '2024-01-15', farmerEmail: 'john@greenvalley.com' },
        { id: 4, farmer: 'Riverbend Farm', product: 'Potatoes', request: 'Change product category from "Vegetables" to "Organic Root Vegetables"', status: 'approved', date: '2024-01-13', farmerEmail: 'contact@riverbend.com' },
        { id: 5, farmer: 'Orchard Hills', product: 'Apples', request: 'Add new product variant: "Organic Gala Apples"', status: 'rejected', date: '2024-01-12', farmerEmail: 'info@orchardhills.com', rejectionReason: 'Duplicate product entry' }
    ];
    
    displayFarmerRequests();
}

function displayFarmerRequests() {
    const container = document.getElementById('requestsContainer');
    const pendingRequests = farmerRequests.filter(req => req.status === 'pending');
    
    if (pendingRequests.length === 0) {
        container.innerHTML = '<div class="alert alert-success"><i class="fas fa-check-circle me-2"></i>No pending requests - all caught up!</div>';
        updateRequestBadge();
        return;
    }
    
    let html = '';
    
    pendingRequests.forEach(request => {
        html += `
            <div class="dashboard-card mb-3">
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <div>
                        <h6 class="text-primary">${request.product}</h6>
                        <p class="mb-1"><strong>Farmer:</strong> ${request.farmer} (${request.farm || 'No farm specified'})</p>
                        <p class="mb-1 small"><strong>Request:</strong> ${request.request}</p>
                        <small class="text-muted">
                            <i class="fas fa-envelope me-1"></i>${request.farmerEmail} | 
                            <i class="fas fa-calendar me-1 ms-2"></i>${request.date}
                        </small>
                    </div>
                    <span class="badge bg-warning">Pending</span>
                </div>
                
                <div class="row mt-3">
                    <div class="col-md-8">
                        <textarea class="form-control form-control-sm" rows="2" placeholder="Add comments (optional)" id="comment${request.id}"></textarea>
                    </div>
                    <div class="col-md-4">
                        <div class="d-grid gap-2">
                            <button class="btn btn-sm btn-success" onclick="approveRequest(${request.id})">
                                <i class="fas fa-check me-1"></i> Approve
                            </button>
                            <button class="btn btn-sm btn-danger" onclick="rejectRequest(${request.id})">
                                <i class="fas fa-times me-1"></i> Reject
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
    
    // Update pending count
    document.getElementById('pendingRequests').textContent = pendingRequests.length;
    updateRequestBadge();
}

function approveRequest(requestId) {
    const request = farmerRequests.find(req => req.id === requestId);
    if (!request) return;
    
    const comment = document.getElementById(`comment${requestId}`)?.value || '';
    
    if (confirm(`Approve this request from ${request.farmer}?\n\nProduct: ${request.product}\nRequest: ${request.request}`)) {
        request.status = 'approved';
        
        // Simulate product update
        const product = allProducts.find(p => p.name === request.product);
        if (product) {
            if (request.request.includes('price')) {
                const newPrice = request.request.match(/\$(\d+\.?\d*)/);
                if (newPrice) {
                    product.price = parseFloat(newPrice[1]);
                }
            }
        }
        
        alert(`Request approved! ${request.farmer} has been notified.\n\nProduct has been updated accordingly.`);
        displayFarmerRequests();
        loadProducts(); // Refresh product list
    }
}

function rejectRequest(requestId) {
    const request = farmerRequests.find(req => req.id === requestId);
    if (!request) return;
    
    const comment = document.getElementById(`comment${requestId}`)?.value || '';
    let reason = prompt('Enter rejection reason (required):');
    
    if (reason) {
        request.status = 'rejected';
        request.rejectionReason = reason;
        
        alert(`Request rejected! ${request.farmer} has been notified.\n\nReason: ${reason}`);
        displayFarmerRequests();
    }
}

// ============================================
// PLATFORM MONITORING FUNCTIONS
// ============================================

function startPlatformMonitoring() {
    // Initial update
    updateSystemStats();
    updateSystemLogs();
    
    // Update every 30 seconds
    setInterval(updateSystemStats, 30000);
    setInterval(addSystemLog, 60000); // Add log every minute
}

function updateSystemStats() {
    // Simulate dynamic stats
    const onlineUsers = Math.floor(Math.random() * 30) + 10;
    const serverLoad = Math.floor(Math.random() * 60) + 20;
    const dailyOrders = Math.floor(Math.random() * 15) + 5;
    const storageUsed = Math.floor(Math.random() * 30) + 60;
    
    document.getElementById('onlineUsers').textContent = onlineUsers;
    document.getElementById('serverLoad').textContent = serverLoad + '%';
    document.getElementById('dailyOrders').textContent = dailyOrders;
    document.getElementById('storageUsed').textContent = storageUsed + '%';
}

function loadSystemLogs() {
    const logs = [
        { time: '10:30', message: 'User "john@greenvalley.com" updated product "Tomatoes"', type: 'info' },
        { time: '10:15', message: 'New order #1005 placed by "mike@email.com"', type: 'success' },
        { time: '09:45', message: 'Weather alert sent to North Region farmers', type: 'warning' },
        { time: '09:30', message: 'System backup completed successfully', type: 'info' },
        { time: '09:15', message: '3 new user registrations', type: 'success' },
        { time: '08:45', message: 'Security scan completed - no threats found', type: 'success' }
    ];
    
    updateSystemLogs();
}

function updateSystemLogs() {
    const container = document.getElementById('systemLogs');
    
    // Simulate new log entries
    const logTypes = ['info', 'success', 'warning'];
    const logActions = [
        'User login', 'Order placed', 'Product updated', 'Weather alert sent',
        'User registered', 'Database backup', 'Security scan', 'Price update'
    ];
    
    let logs = [];
    for (let i = 0; i < 8; i++) {
        const hour = 10 - Math.floor(i / 2);
        const minute = i % 2 === 0 ? '00' : '30';
        const type = logTypes[Math.floor(Math.random() * logTypes.length)];
        const action = logActions[Math.floor(Math.random() * logActions.length)];
        
        logs.push({
            time: `${hour}:${minute}`,
            message: `${action} ${Math.random() > 0.5 ? 'successfully' : 'completed'}`,
            type: type
        });
    }
    
    // Sort by time (newest first)
    logs.sort((a, b) => b.time.localeCompare(a.time));
    
    let html = '';
    logs.forEach(log => {
        const icon = log.type === 'success' ? 'fa-check-circle text-success' :
                    log.type === 'warning' ? 'fa-exclamation-triangle text-warning' :
                    'fa-info-circle text-info';
        
        html += `
            <div class="border-bottom py-2">
                <i class="fas ${icon} me-2"></i>
                <span class="text-muted">[${log.time}]</span>
                <span class="ms-2">${log.message}</span>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function addSystemLog() {
    // This would be called periodically to add new logs
    console.log('System log updated');
}

function backupDatabase() {
    alert('Database backup initiated... This may take a few minutes.');
    // Simulate backup process
    setTimeout(() => {
        alert('Database backup completed successfully! Backup file: farmconnect_backup_' + new Date().toISOString().split('T')[0] + '.sql');
        addSystemLog();
    }, 2000);
}

function clearCache() {
    if (confirm('Clear all system cache? This may improve performance.')) {
        alert('System cache cleared successfully!');
        addSystemLog();
    }
}

function sendSystemAlert() {
    const message = prompt('Enter system-wide notification message:');
    if (message) {
        alert(`System notification sent to all users: "${message}"`);
        addSystemLog();
    }
}

function generateReport() {
    alert('Monthly report generation started... Report will be available in the reports section.');
    // Simulate report generation
    setTimeout(() => {
        alert('Monthly report generated successfully! Download link: /reports/monthly_2024_01.pdf');
        addSystemLog();
    }, 3000);
}

function scanSecurity() {
    alert('Running security scan...');
    setTimeout(() => {
        alert('Security scan completed:\n\n✓ No vulnerabilities found\n✓ All systems secure\n✓ Firewall active\n✓ Data encrypted');
        addSystemLog();
    }, 2500);
}

function viewAuditLog() {
    alert('Opening audit logs... (In a real system, this would open a detailed log viewer)');
}

function updateSystem() {
    if (confirm('Check for system updates?')) {
        alert('Checking for updates...\n\nSystem is up to date. Version 2.1.4');
    }
}

// ============================================
// FARM MANAGEMENT FUNCTIONS
// ============================================

function loadFarms() {
    const farms = [
        { name: 'Green Valley Farm', type: 'Crop Farming', size: '50.5 acres', location: 'North Region', farmer: 'John Farmer', products: 3 },
        { name: 'Sunny Acres', type: 'Mixed Farming', size: '120 acres', location: 'South Region', farmer: 'Sarah Grower', products: 2 },
        { name: 'Riverbend Farm', type: 'Crop Farming', size: '75 acres', location: 'East Region', farmer: 'Tom Rivers', products: 1 },
        { name: 'Orchard Hills', type: 'Orchard', size: '200 acres', location: 'West Region', farmer: 'Alice Green', products: 1 },
        { name: 'Happy Cows Dairy', type: 'Dairy Farm', size: '40 acres', location: 'North Region', farmer: 'Bob Dairy', products: 1 }
    ];
    
    const container = document.getElementById('farmsList');
    let html = '<div class="table-responsive"><table class="table table-hover"><thead><tr><th>Farm Name</th><th>Type</th><th>Size</th><th>Location</th><th>Farmer</th><th>Products</th><th>Actions</th></tr></thead><tbody>';
    
    farms.forEach(farm => {
        html += `
            <tr>
                <td><strong>${farm.name}</strong></td>
                <td><span class="badge bg-primary">${farm.type}</span></td>
                <td>${farm.size}</td>
                <td>${farm.location}</td>
                <td>${farm.farmer}</td>
                <td><span class="badge bg-success">${farm.products}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-danger me-1" onclick="editFarm('${farm.name}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-dark" onclick="viewFarmDetails('${farm.name}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            </tr>
        `;
    });
    
    html += '</tbody></table></div>';
    container.innerHTML = html;
}

function updateFarmInfo(e) {
    e.preventDefault();
    
    const form = e.target;
    const farmName = form.querySelector('select').value;
    
    if (!farmName) {
        alert('Please select a farm');
        return false;
    }
    
    alert(`Farm information updated for ${farmName}\n\nChanges saved successfully.`);
    form.reset();
    return false;
}

function editFarm(farmName) {
    alert(`Edit farm: ${farmName}\n\n(In a real system, this would open an edit form)`);
}

function viewFarmDetails(farmName) {
    alert(`Farm Details:\n\nName: ${farmName}\n\nViewing detailed farm information and statistics.`);
}

// ============================================
// LOGOUT FUNCTION
// ============================================

function logout() {
    if (confirm('Logout from admin panel?')) {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }
}
