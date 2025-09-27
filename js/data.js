/**
 * HAPPY HOUR FINDER - DATA LAYER
 * Contains all restaurant and deals data
 */

// Restaurant data structure
const restaurantsData = [
    {
        id: 'tonys-pizza',
        name: 'Tony\'s Pizza Palace',
        description: 'Authentic NY-Style Pizza • 123 Main St',
        logo: 'TP',
        socialLinks: [
            { name: 'Facebook', url: '#' },
            { name: 'Instagram', url: '#' }
        ],
        specials: [
            {
                day: 'tuesday',
                title: '$2 Slice Tuesday',
                description: 'Any slice of pizza for just $2 all day long',
                likes: 127
            },
            {
                day: 'friday',
                title: 'Buy 2 Get 1 Free',
                description: 'Buy any 2 specialty pizzas, get a cheese pizza free',
                likes: 45
            }
        ]
    },
    {
        id: 'brew-house',
        name: 'The Brew House',
        description: 'Craft Beer & Wings • 456 Oak Ave',
        logo: 'BH',
        socialLinks: [
            { name: 'Facebook', url: '#' },
            { name: 'Twitter', url: '#' },
            { name: 'Instagram', url: '#' }
        ],
        specials: [
            {
                day: 'wednesday',
                title: 'Half-Price Wings',
                description: 'All wing flavors 50% off with drink purchase',
                likes: 89
            },
            {
                day: 'thursday',
                title: '$3 Craft Beer Pints',
                description: 'All house craft beers just $3 from 4-7pm',
                likes: 72
            }
        ]
    },
    {
        id: 'mamas-kitchen',
        name: 'Mama\'s Kitchen',
        description: 'Home-style Cooking • 789 Pine St',
        logo: 'MK',
        socialLinks: [
            { name: 'Facebook', url: '#' },
            { name: 'Instagram', url: '#' }
        ],
        specials: [
            {
                day: 'monday',
                title: 'Meatloaf Monday',
                description: 'Classic meatloaf dinner with sides for $8.99',
                likes: 56
            },
            {
                day: 'sunday',
                title: 'Family Feast',
                description: 'Feed 4 people for $29.99 - includes entrees and sides',
                likes: 94
            }
        ]
    },
    {
        id: 'sunset-grill',
        name: 'Sunset Grill',
        description: 'American Bistro • 321 Harbor Blvd',
        logo: 'SG',
        socialLinks: [
            { name: 'Facebook', url: '#' },
            { name: 'Instagram', url: '#' },
            { name: 'Yelp', url: '#' }
        ],
        specials: [
            {
                day: 'friday',
                title: 'Fish Fry Friday',
                description: 'Beer-battered fish & chips with coleslaw $12.99',
                likes: 78
            },
            {
                day: 'saturday',
                title: 'Steak Night',
                description: '8oz sirloin with potato and vegetable for $16.99',
                likes: 63
            }
        ]
    },
    {
        id: 'holyhound-taproom',
        name: 'Holy Hound Taproom',
        description: 'Hallowed Be Thy Beer • 57 W Market St',
        logo: 'HH',
        socialLinks: [
            { name: 'Facebook', url: 'https://www.facebook.com/HolyHoundTaproom/' },
            { name: 'Instagram', url: 'https://www.instagram.com/holyhoundtaproom' }
        ],
        specials: [
            {
                day: 'monday',
                title: '1/2 Price Wings',
                description: 'Lorum Ipsum',
                likes: 52
            },
            {
                day: 'tuesday',
                title: '1/2 Price Burgers',
                description: 'Nope',
                likes: 78
            },
            {
                day: 'wednesday',
                title: '1/2 Price Tacos - Trivia at 7pm',
                description: 'test',
                likes: 78
            },
            {
                day: 'friday',
                title: 'Pings in zen',
                description: 'what is this?!',
                likes: 78
            },
            {
                day: 'sunday',
                title: '1/2 Price Ramen bowls',
                description: 'Yummy Ramen',
                likes: 63
            },
            {
                day: 'sunday',
                title: '1/2 Price Drafts 4-6PM',
                description: '30+ Drafts',
                likes: 63
            }
        ]
    },
    {
        id: 'white-rose-grill',
        name: 'White Rose Bar & Grill',
        description: 'York/s Finest • 48 N Beaver St',
        logo: 'SG',
        socialLinks: [
            { name: 'Facebook', url: 'https://www.facebook.com/whiterosebarandgrill' },
            { name: 'Instagram', url: 'https://www.instagram.com/whiterosebarandgrill/' },
        ],
        specials: [
            {
                day: 'monday',
                title: 'Half Price Happy Hour 3-5pm',
                description: 'Everything 1/2 Off',
                likes: 74
            },
            {
                day: 'monday',
                title: 'Steak Night',
                description: '$10 New York Strips w/ 1 side',
                likes: 63
            }
        ]
    }
]

// Trending deals data
const trendingData = [
    {
        restaurant: 'Tony\'s Pizza',
        deal: '$2 Slice Tuesday',
        likes: 127
    },
    {
        restaurant: 'Brew House',
        deal: 'Half-price Wings Wednesday',
        likes: 89
    }
];

// Configuration
const appConfig = {
    days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    dayKeys: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
    adminPassword: 'admin123'
};

// Utility functions for data management
const dataUtils = {
    /**
     * Get current day information
     */
    getCurrentDay: () => {
        const today = new Date().getDay();
        return {
            index: today,
            name: appConfig.days[today],
            key: appConfig.dayKeys[today]
        };
    },

    /**
     * Get restaurants that have specials for a specific day
     */
    getRestaurantsByDay: (dayKey) => {
        if (dayKey === 'all') {
            return restaurantsData;
        }
        
        return restaurantsData.filter(restaurant => 
            restaurant.specials.some(special => special.day === dayKey)
        );
    },

    /**
     * Search restaurants by name or deal description
     */
    searchRestaurants: (searchTerm) => {
        const term = searchTerm.toLowerCase();
        
        return restaurantsData.filter(restaurant => {
            const nameMatch = restaurant.name.toLowerCase().includes(term);
            const dealMatch = restaurant.specials.some(special => 
                special.title.toLowerCase().includes(term) ||
                special.description.toLowerCase().includes(term)
            );
            
            return nameMatch || dealMatch;
        });
    },

    /**
     * Get top trending deals
     */
    getTrendingDeals: () => {
        return trendingData.sort((a, b) => b.likes - a.likes);
    },

    /**
     * Update likes for a specific deal
     */
    updateLikes: (restaurantId, day, newLikes) => {
        const restaurant = restaurantsData.find(r => r.id === restaurantId);
        if (restaurant) {
            const special = restaurant.specials.find(s => s.day === day);
            if (special) {
                special.likes = newLikes;
                return true;
            }
        }
        return false;
    }
};

// Export for use in other files (if using modules)
// export { restaurantsData, trendingData, appConfig, dataUtils };
