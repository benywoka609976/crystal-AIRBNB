// script.js - StayKenya

// Global variables
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
let backgroundMusic = null;
let currentMusicIndex = -1;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing app...');
  initializeApp();
});

// Initialize the application
function initializeApp() {
  console.log('Initializing app...');
  
  // Initialize mobile menu
  initializeMobileMenu();
  
  // Initialize music player (only on homepage)
  if (document.getElementById('index-page')) {
    initializeMusicPlayer();
  }
  
  // Initialize category tabs (only on pages with tabs)
  if (document.querySelector('.category-tabs')) {
    initializeCategoryTabs();
  }
  
  // Initialize other components
  updateCartCount();
  updateWishlistCount();
  
  // Initialize listing cards if on a listing page
  if (document.querySelector('.listing-grid')) {
    initializeListingCards();
  }
  
  // Initialize cart page if on cart page
  if (document.getElementById('cart-items')) {
    renderCartItems();
  }
  
  // Initialize wishlist page if on wishlist page
  if (document.getElementById('wishlist-items')) {
    renderWishlistItems();
  }
  
  // Setup image error handlers
  setupImageErrorHandling();
  
  // Add event listeners
  setupEventListeners();
}

// MOBILE MENU FUNCTIONALITY
function initializeMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('nav');
  
  console.log('Mobile menu elements:', { menuToggle, nav });
  
  if (menuToggle && nav) {
    // Add initial styles for mobile
    if (window.innerWidth <= 768) {
      nav.style.display = 'none';
    }
    
    menuToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      console.log('Menu toggle clicked');
      
      if (nav.style.display === 'block') {
        nav.style.display = 'none';
        menuToggle.innerHTML = '☰';
      } else {
        nav.style.display = 'block';
        menuToggle.innerHTML = '✕';
      }
    });
    
    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        if (window.innerWidth <= 768) {
          nav.style.display = 'none';
          menuToggle.innerHTML = '☰';
        }
      });
    });
    
    // Close menu when clicking outside (only on mobile)
    document.addEventListener('click', function(event) {
      if (window.innerWidth <= 768) {
        if (!event.target.closest('nav') && !event.target.closest('.menu-toggle')) {
          nav.style.display = 'none';
          menuToggle.innerHTML = '☰';
        }
      }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
      if (window.innerWidth > 768) {
        nav.style.display = 'block';
      } else {
        nav.style.display = 'none';
        menuToggle.innerHTML = '☰';
      }
    });
    
  } else {
    console.warn('Mobile menu elements not found:', { menuToggle, nav });
  }
}

// MUSIC PLAYER FUNCTIONALITY
function initializeMusicPlayer() {
  console.log('Initializing music player...');
  
  const playBtn = document.getElementById('play-music');
  const pauseBtn = document.getElementById('pause-music');
  
  if (playBtn && pauseBtn) {
    // Create audio element
    backgroundMusic = new Audio();
    backgroundMusic.volume = 0.3; // Set volume to 30%
    backgroundMusic.loop = true;
    
    playBtn.addEventListener('click', function() {
      playRandomMusic();
      playBtn.style.display = 'none';
      pauseBtn.style.display = 'inline-block';
    });
    
    pauseBtn.addEventListener('click', function() {
      pauseMusic();
      playBtn.style.display = 'inline-block';
      pauseBtn.style.display = 'none';
    });
    
    // Auto-play on page load (with user interaction requirement)
    document.addEventListener('click', function firstClick() {
      if (backgroundMusic && backgroundMusic.paused) {
        playRandomMusic();
        playBtn.style.display = 'none';
        pauseBtn.style.display = 'inline-block';
      }
      document.removeEventListener('click', firstClick);
    });
  }
}

// Play random music from the collection
function playRandomMusic() {
  if (!backgroundMusic) return;
  
  // Generate random number between 1 and 20
  let newIndex;
  do {
    newIndex = Math.floor(Math.random() * 20) + 1;
  } while (newIndex === currentMusicIndex);
  
  currentMusicIndex = newIndex;
  
  // Set the music source
  backgroundMusic.src = `music/music${currentMusicIndex}.mp3`;
  
  // Play the music
  backgroundMusic.play().catch(error => {
    console.log('Auto-play was prevented:', error);
    // Show play button if auto-play was prevented
    const playBtn = document.getElementById('play-music');
    const pauseBtn = document.getElementById('pause-music');
    if (playBtn && pauseBtn) {
      playBtn.style.display = 'inline-block';
      pauseBtn.style.display = 'none';
    }
  });
}

// Pause music
function pauseMusic() {
  if (backgroundMusic) {
    backgroundMusic.pause();
  }
}

// CATEGORY TABS FUNCTIONALITY
function initializeCategoryTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      // Remove active class from all buttons and contents
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      
      // Add active class to clicked button
      this.classList.add('active');
      
      // Show corresponding content
      const tabId = this.getAttribute('data-tab');
      document.getElementById(tabId).classList.add('active');
    });
  });
}

// Setup event listeners
function setupEventListeners() {
  console.log('Setting up event listeners...');
  
  // Use event delegation for dynamic elements
  document.addEventListener('click', function(e) {
    console.log('Click event:', e.target);
    
    // Like button
    if (e.target.classList.contains('like-btn') || e.target.closest('.like-btn')) {
      const button = e.target.classList.contains('like-btn') ? e.target : e.target.closest('.like-btn');
      console.log('Like button clicked:', button);
      toggleWishlist(button);
    }
    
    // Add to cart button
    if (e.target.classList.contains('add-to-cart') || e.target.closest('.add-to-cart')) {
      const button = e.target.classList.contains('add-to-cart') ? e.target : e.target.closest('.add-to-cart');
      console.log('Add to cart clicked:', button);
      addToCart(button);
    }
    
    // Remove from cart
    if (e.target.classList.contains('remove-from-cart') || e.target.closest('.remove-from-cart')) {
      const button = e.target.classList.contains('remove-from-cart') ? e.target : e.target.closest('.remove-from-cart');
      if (button && button.dataset && button.dataset.id) {
        console.log('Remove from cart clicked:', button.dataset.id);
        removeFromCart(button.dataset.id);
      }
    }
    
    // Remove from wishlist
    if (e.target.classList.contains('remove-from-wishlist') || e.target.closest('.remove-from-wishlist')) {
      const button = e.target.classList.contains('remove-from-wishlist') ? e.target : e.target.closest('.remove-from-wishlist');
      if (button && button.dataset && button.dataset.id) {
        console.log('Remove from wishlist clicked:', button.dataset.id);
        removeFromWishlist(button.dataset.id);
      }
    }
    
    // Quantity controls
    if (e.target.classList.contains('quantity-decrease') || e.target.closest('.quantity-decrease')) {
      const button = e.target.classList.contains('quantity-decrease') ? e.target : e.target.closest('.quantity-decrease');
      if (button && button.dataset && button.dataset.id) {
        console.log('Decrease quantity clicked:', button.dataset.id);
        decreaseQuantity(button.dataset.id);
      }
    }
    
    if (e.target.classList.contains('quantity-increase') || e.target.closest('.quantity-increase')) {
      const button = e.target.classList.contains('quantity-increase') ? e.target : e.target.closest('.quantity-increase');
      if (button && button.dataset && button.dataset.id) {
        console.log('Increase quantity clicked:', button.dataset.id);
        increaseQuantity(button.dataset.id);
      }
    }
    
    // Empty cart
    if (e.target.classList.contains('empty-cart-btn') || e.target.closest('.empty-cart-btn')) {
      console.log('Empty cart clicked');
      emptyCart();
    }
    
    // Checkout button
    if (e.target.classList.contains('checkout-btn') || e.target.closest('.checkout-btn')) {
      console.log('Checkout clicked');
      checkout();
    }
    
    // FAQ toggle
    if (e.target.classList.contains('faq-item') || e.target.closest('.faq-item h3')) {
      const faqItem = e.target.classList.contains('faq-item') ? e.target : e.target.closest('.faq-item');
      faqItem.classList.toggle('active');
    }
  });
}

// Handle broken images
function setupImageErrorHandling() {
  console.log('Setting up image error handling...');
  
  const images = document.querySelectorAll('img');
  console.log('Total images found:', images.length);
  
  images.forEach((img, index) => {
    // Add error handler
    img.addEventListener('error', function() {
      console.warn('Image failed to load:', this.src);
      
      // Create a colored placeholder
      const listingCard = this.closest('.listing-card');
      const categoryCard = this.closest('.category-card');
      
      if (listingCard) {
        const listingId = listingCard.dataset.id || '1';
        const colors = ['#FF385C', '#00A699', '#FFB400', '#914669', '#2176AE'];
        const colorIndex = parseInt(listingId) % colors.length;
        
        // Create SVG placeholder
        const svgString = `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="${colors[colorIndex]}"/>
          <text x="50%" y="50%" font-family="Arial" font-size="14" fill="white" text-anchor="middle" dy=".3em">Accommodation Image</text>
        </svg>`;
        
        this.src = 'data:image/svg+xml;base64,' + btoa(svgString);
      } else if (categoryCard) {
        // For category images
        this.src = 'data:image/svg+xml;base64,' + btoa(`
          <svg width="200" height="150" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="#00A699"/>
            <text x="50%" y="50%" font-family="Arial" font-size="12" fill="white" text-anchor="middle" dy=".3em">Category Image</text>
          </svg>
        `);
      } else {
        // For other images (logo, etc.)
        this.src = 'data:image/svg+xml;base64,' + btoa(`
          <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="#607d8b"/>
            <text x="50%" y="50%" font-family="Arial" font-size="10" fill="white" text-anchor="middle" dy=".3em">Image</text>
          </svg>
        `);
      }
    });
    
    // Also check if src is empty and set placeholder
    if (!img.src || img.src === window.location.href) {
      console.log('Image has empty src, setting placeholder:', img);
      img.dispatchEvent(new Event('error'));
    }
  });
}

// Initialize listing cards
function initializeListingCards() {
  const listingCards = document.querySelectorAll('.listing-card');
  console.log('Listing cards found:', listingCards.length);
  
  listingCards.forEach(card => {
    const listingId = card.dataset.id;
    const likeBtn = card.querySelector('.like-btn');
    
    if (likeBtn) {
      // Check if listing is in wishlist
      if (wishlist.some(item => item.id === listingId)) {
        likeBtn.classList.add('active');
        likeBtn.innerHTML = '❤';
      } else {
        likeBtn.classList.remove('active');
        likeBtn.innerHTML = '🤍';
      }
    }
  });
}

// Toggle wishlist
function toggleWishlist(button) {
  if (!button) return;
  
  const listingCard = button.closest('.listing-card');
  if (!listingCard) return;
  
  const listingId = listingCard.dataset.id;
  const listingTitle = listingCard.querySelector('.listing-title')?.textContent || 'Accommodation';
  const listingLocation = listingCard.querySelector('.listing-location')?.textContent || '';
  const listingPrice = listingCard.querySelector('.listing-price')?.textContent || 'KSh 0';
  const listingImage = listingCard.querySelector('.listing-image')?.src || '';
  
  const listing = {
    id: listingId,
    title: listingTitle,
    location: listingLocation,
    price: listingPrice,
    image: listingImage,
    quantity: 1
  };
  
  // Check if listing is already in wishlist
  const existingIndex = wishlist.findIndex(item => item.id === listingId);
  
  if (existingIndex !== -1) {
    // Remove from wishlist
    wishlist.splice(existingIndex, 1);
    button.classList.remove('active');
    button.innerHTML = '🤍';
    showNotification('Removed from wishlist', 'info');
  } else {
    // Add to wishlist
    wishlist.push(listing);
    button.classList.add('active');
    button.innerHTML = '❤';
    showNotification('Added to wishlist', 'success');
  }
  
  // Update localStorage
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
  updateWishlistCount();
}

// Add to cart
function addToCart(button) {
  if (!button) return;
  
  const listingCard = button.closest('.listing-card');
  if (!listingCard) return;
  
  const listingId = listingCard.dataset.id;
  const listingTitle = listingCard.querySelector('.listing-title')?.textContent || 'Accommodation';
  const listingLocation = listingCard.querySelector('.listing-location')?.textContent || '';
  const listingPrice = listingCard.querySelector('.listing-price')?.textContent || 'KSh 0';
  const listingImage = listingCard.querySelector('.listing-image')?.src || '';
  
  const listing = {
    id: listingId,
    title: listingTitle,
    location: listingLocation,
    price: listingPrice,
    image: listingImage,
    quantity: 1
  };
  
  // Check if listing is already in cart
  const existingIndex = cart.findIndex(item => item.id === listingId);
  
  if (existingIndex !== -1) {
    // Increase quantity
    cart[existingIndex].quantity += 1;
    showNotification('Booking period extended', 'info');
  } else {
    // Add to cart
    cart.push(listing);
    showNotification('Added to bookings', 'success');
  }
  
  // Add animation to button
  button.classList.add('added-to-cart');
  setTimeout(() => {
    button.classList.remove('added-to-cart');
  }, 500);
  
  // Update localStorage
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  
  // If on cart page, update the cart display
  if (document.getElementById('cart-items')) {
    renderCartItems();
  }
}

// Remove from cart
function removeFromCart(listingId) {
  cart = cart.filter(item => item.id !== listingId);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  if (document.getElementById('cart-items')) {
    renderCartItems();
  }
  showNotification('Removed from bookings', 'info');
}

// Remove from wishlist
function removeFromWishlist(listingId) {
  wishlist = wishlist.filter(item => item.id !== listingId);
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
  updateWishlistCount();
  
  // If on wishlist page, update the display
  if (document.getElementById('wishlist-items')) {
    renderWishlistItems();
  }
  
  // Also update the like buttons on listing pages
  const likeBtn = document.querySelector(`.listing-card[data-id="${listingId}"] .like-btn`);
  if (likeBtn) {
    likeBtn.classList.remove('active');
    likeBtn.innerHTML = '🤍';
  }
  
  showNotification('Removed from wishlist', 'info');
}

// Increase quantity
function increaseQuantity(listingId) {
  const item = cart.find(item => item.id === listingId);
  if (item) {
    item.quantity += 1;
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    if (document.getElementById('cart-items')) {
      renderCartItems();
    }
  }
}

// Decrease quantity
function decreaseQuantity(listingId) {
  const item = cart.find(item => item.id === listingId);
  if (item) {
    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      // Remove if quantity becomes 0
      removeFromCart(listingId);
      return;
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    if (document.getElementById('cart-items')) {
      renderCartItems();
    }
  }
}

// Empty cart
function emptyCart() {
  if (cart.length === 0) {
    showNotification('Bookings list is already empty', 'info');
    return;
  }
  
  if (confirm('Are you sure you want to clear all your bookings?')) {
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    if (document.getElementById('cart-items')) {
      renderCartItems();
    }
    showNotification('Bookings cleared', 'info');
  }
}

// Update cart count in header
function updateCartCount() {
  const cartCountElements = document.querySelectorAll('.cart-count');
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  
  cartCountElements.forEach(element => {
    if (element) {
      element.textContent = totalItems;
    }
  });
}

// Update wishlist count in header
function updateWishlistCount() {
  const wishlistCountElements = document.querySelectorAll('.wishlist-count');
  const totalItems = wishlist.length;
  
  wishlistCountElements.forEach(element => {
    if (element) {
      element.textContent = totalItems;
    }
  });
}

// Render cart items
function renderCartItems() {
  const cartItemsContainer = document.getElementById('cart-items');
  const cartTotalElement = document.getElementById('cart-total');
  const cartSubtotalElement = document.getElementById('cart-subtotal');
  
  if (!cartItemsContainer) return;
  
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p class="empty-cart-message">Your bookings list is empty</p>';
    if (cartTotalElement) cartTotalElement.textContent = 'KSh 0';
    if (cartSubtotalElement) cartSubtotalElement.textContent = 'KSh 0';
    return;
  }
  
  let cartHTML = '';
  let subtotal = 0;
  
  cart.forEach(item => {
    const priceMatch = item.price.match(/(\d+[\d,]*)/);
    const price = priceMatch ? parseFloat(priceMatch[1].replace(',', '')) : 0;
    const itemTotal = price * item.quantity;
    subtotal += itemTotal;
    
    cartHTML += `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.title}" class="cart-item-image" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRkYzODVDIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5BY2NvbW1vZGF0aW9uIEltYWdlPC90ZXh0Pjwvc3ZnPg==='">
        <div class="cart-item-details">
          <h3 class="cart-item-title">${item.title}</h3>
          <p class="cart-item-location">${item.location}</p>
          <p class="cart-item-price">${item.price} x ${item.quantity} nights</p>
        </div>
        <div class="cart-item-actions">
          <div class="quantity-control">
            <button class="quantity-btn quantity-decrease" data-id="${item.id}">-</button>
            <input type="text" class="quantity-input" value="${item.quantity}" readonly>
            <button class="quantity-btn quantity-increase" data-id="${item.id}">+</button>
          </div>
          <button class="remove-btn remove-from-cart" data-id="${item.id}">Remove</button>
        </div>
      </div>
    `;
  });
  
  cartItemsContainer.innerHTML = cartHTML;
  
  if (cartTotalElement) cartTotalElement.textContent = `KSh ${subtotal.toLocaleString()}`;
  if (cartSubtotalElement) cartSubtotalElement.textContent = `KSh ${subtotal.toLocaleString()}`;
}

// Render wishlist items
function renderWishlistItems() {
  const wishlistItemsContainer = document.getElementById('wishlist-items');
  
  if (!wishlistItemsContainer) return;
  
  if (wishlist.length === 0) {
    wishlistItemsContainer.innerHTML = '<p class="empty-wishlist-message">Your wishlist is empty</p>';
    return;
  }
  
  let wishlistHTML = '';
  
  wishlist.forEach(item => {
    wishlistHTML += `
      <div class="wishlist-item">
        <img src="${item.image}" alt="${item.title}" class="wishlist-item-image" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRkYzODVDIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5BY2NvbW1vZGF0aW9uIEltYWdlPC90ZXh0Pjwvc3ZnPg==='">
        <div class="wishlist-item-details">
          <h3 class="wishlist-item-title">${item.title}</h3>
          <p class="wishlist-item-location">${item.location}</p>
          <p class="wishlist-item-price">${item.price}</p>
        </div>
        <div class="wishlist-item-actions">
          <button class="add-to-cart" data-id="${item.id}">Book Now</button>
          <button class="remove-btn remove-from-wishlist" data-id="${item.id}">Remove</button>
        </div>
      </div>
    `;
  });
  
  wishlistItemsContainer.innerHTML = wishlistHTML;
}

// Checkout function - sends booking inquiry to WhatsApp
function checkout() {
  if (cart.length === 0) {
    showNotification('Your bookings list is empty', 'warning');
    return;
  }
  
  let message = "Hello! I would like to inquire about the following accommodations:\n\n";
  
  cart.forEach(item => {
    message += `- ${item.title} (${item.quantity} nights) - ${item.price}\n`;
  });
  
  const subtotal = cart.reduce((total, item) => {
    const priceMatch = item.price.match(/(\d+[\d,]*)/);
    const price = priceMatch ? parseFloat(priceMatch[1].replace(',', '')) : 0;
    return total + (price * item.quantity);
  }, 0);
  
  message += `\nTotal: KSh ${subtotal.toLocaleString()}\n\n`;
  message += "Please provide availability and booking details for these properties.";
  
  // Encode the message for URL
  const encodedMessage = encodeURIComponent(message);
  
  // Create WhatsApp URL
  const whatsappURL = `https://wa.me/254740941872?text=${encodedMessage}`;
  
  // Open WhatsApp in a new tab
  window.open(whatsappURL, '_blank');
}

// Show notification
function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  // Add styles
  notification.style.position = 'fixed';
  notification.style.top = '20px';
  notification.style.right = '20px';
  notification.style.padding = '15px 20px';
  notification.style.borderRadius = '8px';
  notification.style.color = 'white';
  notification.style.zIndex = '10000';
  notification.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
  notification.style.transition = 'all 0.3s ease';
  
  // Set background color based on type
  if (type === 'success') {
    notification.style.backgroundColor = 'var(--success)';
  } else if (type === 'warning') {
    notification.style.backgroundColor = 'var(--warning)';
    notification.style.color = 'var(--dark)';
  } else if (type === 'info') {
    notification.style.backgroundColor = 'var(--secondary)';
  } else {
    notification.style.backgroundColor = 'var(--dark)';
  }
  
  // Add to body
  document.body.appendChild(notification);
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}