/**
 * HAPPY HOUR FINDER - MAIN APPLICATION
 * Handles all UI interactions and business logic
 */

// =============================================================================
// APPLICATION STATE
// =============================================================================

class AppState {
    constructor() {
        this.currentDay = dataUtils.getCurrentDay();
        this.selectedDay = this.currentDay.key;
        this.searchTerm = '';
        this.likedDeals = this.loadLikedDeals();
    }

    loadLikedDeals() {
        const liked = {};
        restaurantsData.forEach(restaurant => {
            restaurant.specials.forEach(special => {
                const key = `${restaurant.id}-${special.day}`;
                if (localStorage.getItem(`liked-${key}`)) {
                    liked[key] = true;
                }
            });
        });
        return liked;
    }

    toggleLike(restaurantId, day) {
        const key = `${restaurantId}-${day}`;
        if (this.likedDeals[key]) {
            delete this.likedDeals[key];
            localStorage.removeItem(`liked-${key}`);
            return false;
        } else {
            this.likedDeals[key] = true;
            localStorage.setItem(`liked-${key}`, 'true');
            return true;
        }
    }

    isLiked(restaurantId, day) {
        const key = `${restaurantId}-${day}`;
        return !!this.likedDeals[key];
    }
}

// Global app state
let appState;

// =============================================================================
// UI COMPONENTS
// =============================================================================

const UIComponents = {
    /**
     * Create restaurant card HTML
     */
    createRestaurantCard(restaurant) {
        const socialLinksHTML = restaurant.socialLinks.map(link => 
            `<a href="${link.url}" class="social-btn">${link.name}</a>`
        ).join('');

        const specialsHTML = restaurant.specials.map(special => {
            const isLiked = appState.isLiked(restaurant.id, special.day);
            const likedClass = isLiked ? 'liked' : '';
            
            return `
                <div class="special-item" data-day="${special.day}">
                    <div class="special-header">
                        <span class="special-day">${special.day.toUpperCase()}</span>
                        <div class="special-actions">
                            <button class="like-btn ${likedClass}" 
                                    data-restaurant="${restaurant.id}" 
                                    data-day="${special.day}" 
                                    data-likes="${special.likes}">
                                ❤️ ${special.likes}
                            </button>
                            <button class="share-btn" 
                                    data-restaurant="${restaurant.name}" 
                                    data-deal="${special.title}" 
                                    data-day="${special.day}">
                                📤 Share
                            </button>
                        </div>
                    </div>
                    <div class="special-description">
                        <strong>${special.title}</strong><br>
                        ${special.description}
                    </div>
                </div>
            `;
        }).join('');

        return `
            <div class="restaurant-card" data-restaurant="${restaurant.id}">
                <div class="restaurant-header">
                    <div class="restaurant-logo">${restaurant.logo}</div>
                    <div class="restaurant-info">
                        <h3>${restaurant.name}</h3>
                        <p>${restaurant.description}</p>
                        <div class="social-links">
                            ${socialLinksHTML}
                        </div>
                    </div>
                </div>
                <div class="specials">
                    ${specialsHTML}
                </div>
            </div>
        `;
    },

    /**
     * Create trending item HTML
     */
    createTrendingItem(trending) {
        return `
            <div class="trending-item">
                <span><strong>${trending.restaurant}</strong> - ${trending.deal}</span>
                <span>❤️ ${trending.likes} likes</span>
            </div>
        `;
    },

    /**
     * Render restaurants to the grid
     */
    renderRestaurants(restaurants) {
        const grid = document.getElementById('restaurantGrid');
        if (!grid) return;

        grid.innerHTML = restaurants.map(restaurant => 
            this.createRestaurantCard(restaurant)
        ).join('');

        // Re-attach event listeners after rendering
        this.attachRestaurantEventListeners();
    },

    /**
     * Render trending deals
     */
    renderTrending() {
        const trendingList = document.getElementById('trendingList');
        if (!trendingList) return;

        const trending = dataUtils.getTrendingDeals();
        trendingList.innerHTML = trending.map(item => 
            this.createTrendingItem(item)
        ).join('');
    },

    /**
     * Update the happening now indicator visibility
     */
    updateHappeningNow(selectedDay) {
        const happeningNow = document.getElementById('happeningNow');
        if (!happeningNow) return;

        console.log('Selected day:', selectedDay, 'Current day:', appState.currentDay.key);
        
        if (selectedDay === appState.currentDay.key) {
            happeningNow.style.display = 'block';
            console.log('Showing Happening Now');
        } else {
            happeningNow.style.display = 'none';
            console.log('Hiding Happening Now');
        }
    },

    /**
     * Attach event listeners to restaurant cards
     */
    attachRestaurantEventListeners() {
        // Like buttons
        document.querySelectorAll('.like-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                
                const restaurantId = btn.dataset.restaurant;
                const day = btn.dataset.day;
                let likes = parseInt(btn.dataset.likes);
                
                const wasLiked = appState.isLiked(restaurantId, day);
                const isNowLiked = appState.toggleLike(restaurantId, day);
                
                if (isNowLiked) {
                    likes++;
                    btn.classList.add('liked');
                } else {
                    likes--;
                    btn.classList.remove('liked');
                }
                
                btn.dataset.likes = likes;
                btn.textContent = `❤️ ${likes}`;
                
                // Update data
                dataUtils.updateLikes(restaurantId, day, likes);
            });
        });

        // Share buttons
        document.querySelectorAll('.share-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                
                const restaurant = btn.dataset.restaurant;
                const deal = btn.dataset.deal;
                const day = btn.dataset.day;
                
                this.shareContent(restaurant, deal, day);
            });
        });
    },

    /**
     * Handle content sharing
     */
    shareContent(restaurant, deal, day) {
        const shareText = `Check out this great deal: ${deal} on ${day.charAt(0).toUpperCase() + day.slice(1)} at ${restaurant}!`;
        const shareUrl = window.location.href;
        
        if (navigator.share) {
            navigator.share({
                title: `${restaurant} - ${deal}`,
                text: shareText,
                url: shareUrl
            }).catch(err => console.log('Error sharing:', err));
        } else {
            // Fallback: copy to clipboard
            const fullText = `${shareText} ${shareUrl}`;
            navigator.clipboard.writeText(fullText).then(() => {
                alert('Deal link copied to clipboard!');
            }).catch(err => {
                console.log('Error copying to clipboard:', err);
                // Final fallback: show share text
                prompt('Share this deal:', fullText);
            });
        }
    }
};

// =============================================================================
// FILTER & SEARCH FUNCTIONALITY
// =============================================================================

const FilterManager = {
    /**
     * Filter restaurants by day
     */
    filterByDay(dayKey) {
        appState.selectedDay = dayKey;
        
        let restaurants;
        if (appState.searchTerm) {
            // Apply search first, then filter by day
            restaurants = dataUtils.searchRestaurants(appState.searchTerm);
            if (dayKey !== 'all') {
                restaurants = restaurants.filter(restaurant => 
                    restaurant.specials.some(special => special.day === dayKey)
                );
            }
        } else {
            restaurants = dataUtils.getRestaurantsByDay(dayKey);
        }
        
        UIComponents.renderRestaurants(restaurants);
        UIComponents.updateHappeningNow(dayKey);
    },

    /**
     * Filter restaurants by search term
     */
    filterBySearch(searchTerm) {
        appState.searchTerm = searchTerm;
        
        let restaurants;
        if (searchTerm.trim() === '') {
            restaurants = dataUtils.getRestaurantsByDay(appState.selectedDay);
        } else {
            restaurants = dataUtils.searchRestaurants(searchTerm);
            // Also apply day filter if not "all"
            if (appState.selectedDay !== 'all') {
                restaurants = restaurants.filter(restaurant => 
                    restaurant.specials.some(special => special.day === appState.selectedDay)
                );
            }
        }
        
        UIComponents.renderRestaurants(restaurants);
    },

    /**
     * Initialize filter event listeners
     */
    init() {
        // Day filter buttons
        document.querySelectorAll('.day-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active button
                document.querySelectorAll('.day-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const selectedDay = btn.dataset.day;
                this.filterByDay(selectedDay);
            });
        });

        // Search bar
        const searchBar = document.getElementById('searchBar');
        if (searchBar) {
            searchBar.addEventListener('input', (e) => {
                this.filterBySearch(e.target.value);
            });
        }
    }
};

// =============================================================================
// MODAL FUNCTIONALITY
// =============================================================================

const ModalManager = {
    /**
     * Open contact modal
     */
    openContactModal() {
        const modal = document.getElementById('contactModal');
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    },

    /**
     * Close contact modal
     */
    closeContactModal() {
        const modal = document.getElementById('contactModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            
            // Reset form
            const form = document.getElementById('contactForm');
            const successMessage = document.getElementById('successMessage');
            
            if (form) form.style.display = 'block';
            if (successMessage) successMessage.style.display = 'none';
            
            const formElement = document.getElementById('contactForm');
            if (formElement) formElement.reset();
        }
    },

    /**
     * Handle form submission
     */
    handleFormSubmission(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(e.target);
        const submissionData = Object.fromEntries(formData);
        
        console.log('Form submitted:', submissionData);
        
        // In a real app, you would send this to your backend:
        // this.submitToBackend(submissionData);
        
        // Show success message
        const form = document.getElementById('contactForm');
        const successMessage = document.getElementById('successMessage');
        
        if (form) form.style.display = 'none';
        if (successMessage) successMessage.style.display = 'block';
        
        // Auto-close after 3 seconds
        setTimeout(() => {
            this.closeContactModal();
        }, 3000);
    },

    /**
     * Initialize modal event listeners
     */
    init() {
        // Form submission
        const form = document.getElementById('contactForm');
        if (form) {
            form.addEventListener('submit', (e) => this.handleFormSubmission(e));
        }

        // Close modal when clicking outside
        window.addEventListener('click', (event) => {
            const modal = document.getElementById('contactModal');
            if (event.target === modal) {
                this.closeContactModal();
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeContactModal();
            }
        });
    }
};

// =============================================================================
// ADMIN FUNCTIONALITY
// =============================================================================

const AdminManager = {
    /**
     * Handle admin login
     */
    login() {
        const password = prompt('Enter admin password:');
        if (password === appConfig.adminPassword) {
            alert('Welcome to the admin dashboard! (This would redirect to a secure admin page)');
            // In a real app: window.location.href = '/admin';
        } else if (password !== null) {
            alert('Incorrect password');
        }
    }
};

// =============================================================================
// ANIMATIONS & EFFECTS
// =============================================================================

const AnimationManager = {
    /**
     * Initialize scroll animations
     */
    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        // Observe restaurant cards
        document.querySelectorAll('.restaurant-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    }
};

// =============================================================================
// GLOBAL FUNCTIONS (for inline onclick handlers)
// =============================================================================

function openContactModal() {
    ModalManager.openContactModal();
}

function closeContactModal() {
    ModalManager.closeContactModal();
}

function adminLogin() {
    AdminManager.login();
}

// =============================================================================
// APPLICATION INITIALIZATION
// =============================================================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('Happy Hour Finder - Initializing...');
    
    // Initialize app state
    appState = new AppState();
    
    // Set current day in header
    const currentDayElement = document.getElementById('currentDay');
    if (currentDayElement) {
        currentDayElement.textContent = appState.currentDay.name;
    }
    
    // Initialize managers
    FilterManager.init();
    ModalManager.init();
    
    // Render initial content
    UIComponents.renderTrending();
    
    // Set current day button as active and filter to today's deals
    const currentDayBtn = document.querySelector(`[data-day="${appState.currentDay.key}"]`);
    if (currentDayBtn) {
        currentDayBtn.classList.add('active');
        FilterManager.filterByDay(appState.currentDay.key);
    } else {
        // Fallback: show all restaurants
        UIComponents.renderRestaurants(restaurantsData);
    }
    
    // Initialize animations
    setTimeout(() => {
        AnimationManager.initScrollAnimations();
    }, 100);
    
    console.log('Happy Hour Finder - Ready!');
});