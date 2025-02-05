// Data produk (simulasi database)
const products = [
    {
        id: 1,
        name: "Kamera DSLR Canon",
        category: "kamera",
        price: 150000,
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32",
        description: "Kamera DSLR profesional untuk fotografi"
    },
    {
        id: 2,
        name: "Laptop Gaming",
        category: "elektronik",
        price: 200000,
        image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302",
        description: "Laptop gaming performa tinggi"
    },
    {
        id: 3,
        name: "Tenda Camping 4 Orang",
        category: "camping",
        price: 100000,
        image: "https://images.unsplash.com/photo-1478827387698-1771e0ce498f",
        description: "Tenda camping waterproof untuk 4 orang"
    },
    {
        id: 4,
        name: "Sepeda Gunung",
        category: "olahraga",
        price: 120000,
        image: "https://images.unsplash.com/photo-1576435728678-68d0fbf94e91",
        description: "Sepeda gunung untuk aktivitas outdoor"
    }
];

// jQuery Document Ready
$(document).ready(function() {
    // Initialize
    displayProducts('all');
    checkLoginStatus();

    // Event Handlers untuk Modal Login/Register
    $('#btnMasuk').click(function() {
        $('#modalLogin').fadeIn();
    });

    $('#btnDaftar').click(function() {
        $('#modalRegister').fadeIn();
    });

    $('.close').click(function() {
        $('.modal').fadeOut();
    });

    $('#switchToRegister').click(function(e) {
        e.preventDefault();
        $('#modalLogin').hide();
        $('#modalRegister').fadeIn();
    });

    $('#switchToLogin').click(function(e) {
        e.preventDefault();
        $('#modalRegister').hide();
        $('#modalLogin').fadeIn();
    });

    // Filter Products
    $('.filter-btn').click(function() {
        $('.filter-btn').removeClass('active');
        $(this).addClass('active');
        const category = $(this).data('filter');
        displayProducts(category);
    });

    // Search Functionality
    $('#searchInput').on('input', function() {
        const searchTerm = $(this).val().toLowerCase();
        filterProducts(searchTerm);
    });

    // Login Form Handler
    $('#loginForm').submit(function(e) {
        e.preventDefault();
        const email = $('#loginEmail').val();
        const password = $('#loginPassword').val();

        // Simulasi login (dalam implementasi nyata, ini akan memanggil API)
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            updateLoginStatus(true);
            $('#modalLogin').fadeOut();
            showAlert('Berhasil masuk!', 'success');
        } else {
            showAlert('Email atau password salah!', 'error');
        }
    });

    // Register Form Handler
    $('#registerForm').submit(function(e) {
        e.preventDefault();
        const name = $('#registerName').val();
        const email = $('#registerEmail').val();
        const password = $('#registerPassword').val();
        const confirmPassword = $('#confirmPassword').val();

        if (password !== confirmPassword) {
            showAlert('Password tidak cocok!', 'error');
            return;
        }

        // Simpan user baru ke localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        if (users.some(u => u.email === email)) {
            showAlert('Email sudah terdaftar!', 'error');
            return;
        }

        const newUser = { name, email, password };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        $('#modalRegister').fadeOut();
        $('#modalLogin').fadeIn();
        showAlert('Pendaftaran berhasil! Silakan masuk.', 'success');
    });

    // Category Card Click Handler
    $('.category-card').click(function() {
        const category = $(this).data('category');
        $('.filter-btn').removeClass('active');
        $(`.filter-btn[data-filter="${category}"]`).addClass('active');
        displayProducts(category);
        $('html, body').animate({
            scrollTop: $('.products').offset().top - 100
        }, 500);
    });

    // Navbar Mobile Menu
    $('.mobile-menu-btn').click(function() {
        $(this).toggleClass('active');
        $('.mobile-menu').toggleClass('active');
        
        // Animate hamburger menu
        if ($(this).hasClass('active')) {
            $(this).children('span').eq(0).css('transform', 'rotate(45deg) translate(5px, 5px)');
            $(this).children('span').eq(1).css('opacity', '0');
            $(this).children('span').eq(2).css('transform', 'rotate(-45deg) translate(7px, -7px)');
        } else {
            $(this).children('span').css({
                'transform': 'none',
                'opacity': '1'
            });
        }
    });

    // Mobile Dropdown Toggle
    $('.mobile-dropdown-toggle').click(function(e) {
        e.preventDefault();
        $(this).next('.mobile-dropdown-menu').slideToggle(300);
        $(this).find('.fa-chevron-down').toggleClass('rotate-180');
    });

    // Close mobile menu when clicking outside
    $(document).click(function(e) {
        if (!$(e.target).closest('.mobile-menu, .mobile-menu-btn').length) {
            $('.mobile-menu').removeClass('active');
            $('.mobile-menu-btn').removeClass('active').children('span').css({
                'transform': 'none',
                'opacity': '1'
            });
        }
    });

    // Category Navigation
    $('.nav-links a[data-category], .mobile-nav-links a[data-category]').click(function(e) {
        e.preventDefault();
        const category = $(this).data('category');
        $('.filter-btn').removeClass('active');
        $(`.filter-btn[data-filter="${category}"]`).addClass('active');
        displayProducts(category);
        
        // Scroll to products section
        $('html, body').animate({
            scrollTop: $('.products').offset().top - 100
        }, 500);

        // Close mobile menu if open
        $('.mobile-menu').removeClass('active');
        $('.mobile-menu-btn').removeClass('active').children('span').css({
            'transform': 'none',
            'opacity': '1'
        });
    });

    // Update cart count based on localStorage
    updateCartCount();
});

// Functions
function displayProducts(category) {
    const productGrid = $('#productGrid');
    productGrid.empty();

    const filteredProducts = category === 'all' 
        ? products 
        : products.filter(p => p.category === category);

    filteredProducts.forEach(product => {
        const productCard = `
            <div class="product-card" data-category="${product.category}">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <p class="product-price">Rp ${product.price.toLocaleString()}/hari</p>
                    <div class="product-actions">
                        <button class="btn-add-cart" onclick="addToCart(${product.id})">
                            <i class="fas fa-cart-plus"></i> Tambah ke Keranjang
                        </button>
                        <a href="#" class="btn-sewa" data-id="${product.id}">Sewa Sekarang</a>
                    </div>
                </div>
            </div>
        `;
        productGrid.append(productCard);
    });

    // Event handler untuk tombol sewa
    $('.btn-sewa').click(function(e) {
        e.preventDefault();
        const productId = $(this).data('id');
        if (isLoggedIn()) {
            showAlert('Permintaan sewa sedang diproses...', 'success');
        } else {
            $('#modalLogin').fadeIn();
            showAlert('Silakan masuk terlebih dahulu untuk menyewa barang.', 'info');
        }
    });
}

function filterProducts(searchTerm) {
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
    );

    const productGrid = $('#productGrid');
    productGrid.empty();

    if (filteredProducts.length === 0) {
        productGrid.html('<p class="no-results">Tidak ada barang yang ditemukan.</p>');
        return;
    }

    filteredProducts.forEach(product => {
        const productCard = `
            <div class="product-card" data-category="${product.category}">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <p class="product-price">Rp ${product.price.toLocaleString()}/hari</p>
                    <div class="product-actions">
                        <button class="btn-add-cart" onclick="addToCart(${product.id})">
                            <i class="fas fa-cart-plus"></i> Tambah ke Keranjang
                        </button>
                        <a href="#" class="btn-sewa" data-id="${product.id}">Sewa Sekarang</a>
                    </div>
                </div>
            </div>
        `;
        productGrid.append(productCard);
    });
}

function showAlert(message, type = 'info') {
    const alert = $('<div>')
        .addClass(`alert alert-${type}`)
        .text(message)
        .css({
            'position': 'fixed',
            'top': '20px',
            'right': '20px',
            'padding': '15px',
            'border-radius': '5px',
            'z-index': 1000,
            'background-color': type === 'success' ? '#4CAF50' : 
                              type === 'error' ? '#f44336' : '#2196F3',
            'color': 'white',
            'box-shadow': '0 2px 5px rgba(0,0,0,0.2)'
        })
        .appendTo('body')
        .fadeIn();

    setTimeout(() => {
        alert.fadeOut(() => alert.remove());
    }, 3000);
}

function isLoggedIn() {
    return localStorage.getItem('currentUser') !== null;
}

function checkLoginStatus() {
    if (isLoggedIn()) {
        updateLoginStatus(true);
    }
}

function updateLoginStatus(isLoggedIn) {
    const navButtons = $('.nav-buttons');
    if (isLoggedIn) {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        navButtons.html(`
            <span class="welcome-text">Halo, ${user.name}</span>
            <a href="#" class="btn-keluar" onclick="logout()">Keluar</a>
        `);
    } else {
        navButtons.html(`
            <a href="#" class="btn-masuk" id="btnMasuk">Masuk</a>
            <a href="#" class="btn-daftar" id="btnDaftar">Daftar</a>
        `);
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    updateLoginStatus(false);
    showAlert('Berhasil keluar!', 'success');
}

function addToCart(productId) {
    if (!isLoggedIn()) {
        $('#modalLogin').fadeIn();
        showAlert('Silakan masuk terlebih dahulu untuk menyewa barang.', 'info');
        return;
    }

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const product = products.find(p => p.id === productId);

    if (product) {
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1
            });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        showAlert('Barang berhasil ditambahkan ke keranjang!', 'success');
    }
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    $('.cart-count').text(totalItems);
}

document.addEventListener('DOMContentLoaded', function() {
    const btnMasuk = document.getElementById('btnMasuk');
    const btnDaftar = document.getElementById('btnDaftar');
    const userMenu = document.getElementById('userMenu');
    const btnLogout = document.getElementById('btnLogout');
    const modalLogin = document.getElementById('modalLogin');
    const modalRegister = document.getElementById('modalRegister');
    const loginForm = document.getElementById('loginForm');

    // Function to handle successful login
    function handleLoginSuccess(username = 'User') {
        btnMasuk.style.display = 'none';
        btnDaftar.style.display = 'none';
        userMenu.style.display = 'block';
        userMenu.querySelector('.username').textContent = username;
        modalLogin.style.display = 'none';
    }

    // Function to handle logout
    function handleLogout() {
        btnMasuk.style.display = 'inline-block';
        btnDaftar.style.display = 'inline-block';
        userMenu.style.display = 'none';
        // Add any additional logout logic here (e.g., clearing session)
    }

    // Login form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        // Add your login authentication logic here
        // For demo purposes, we'll just simulate a successful login
        const username = email.split('@')[0]; // Use part of email as username
        handleLoginSuccess(username);
    });

    // Logout button click handler
    btnLogout.addEventListener('click', function(e) {
        e.preventDefault();
        handleLogout();
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const btnMasuk = document.getElementById('btnMasuk');
    const btnDaftar = document.getElementById('btnDaftar');
    const userMenu = document.getElementById('userMenu');
    const btnLogout = document.getElementById('btnLogout');
    const modalLogin = document.getElementById('modalLogin');
    const modalRegister = document.getElementById('modalRegister');
    const loginForm = document.getElementById('loginForm');

    // Function to handle successful login
    function handleLoginSuccess(username = 'User') {
        btnMasuk.style.display = 'none';
        btnDaftar.style.display = 'none';
        userMenu.style.display = 'block';
        userMenu.querySelector('.username').textContent = username;
        modalLogin.style.display = 'none';
    }

    // Function to handle logout
    function handleLogout() {
        btnMasuk.style.display = 'inline-block';
        btnDaftar.style.display = 'inline-block';
        userMenu.style.display = 'none';
        // Add any additional logout logic here (e.g., clearing session)
    }

    // Login form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        // Add your login authentication logic here
        // For demo purposes, we'll just simulate a successful login
        const username = email.split('@')[0]; // Use part of email as username
        handleLoginSuccess(username);
    });

    // Logout button click handler
    btnLogout.addEventListener('click', function(e) {
        e.preventDefault();
        handleLogout();
    });
});
