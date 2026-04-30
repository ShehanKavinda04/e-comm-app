export const getProducts = () => {
    // High-quality mock data centralized here
    return [
        { id: 1, title: 'iPhone 13 Pro', name: 'iPhone 13 Pro', brand: 'Apple', category: 'Mobile Parts', price: 150000, image: 'https://images.unsplash.com/photo-1621330396173-e41b1cafd17f?w=500&q=80', stock: 50, status: "Approved" },
        { id: 2, title: 'Samsung S21 Screen', name: 'Samsung S21 Screen', brand: 'Samsung', category: 'Mobile Parts', price: 45000, image: samsungS21ScreenImg, stock: 30, status: "Approved" },
        { id: 3, title: 'HP Pavilion Battery', name: 'HP Pavilion Battery', brand: 'HP', category: 'Laptop Parts', price: 8500, image: hpBatteryImg, stock: 15, status: "Out of Stock" },
        { id: 4, title: 'Lenovo Charger', name: 'Lenovo Charger', brand: 'Lenovo', category: 'Laptop Parts', price: 4500, image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=500&q=60', stock: 100, status: "Approved" },
        { id: 5, title: 'OnePlus 9 Back Glass', name: 'OnePlus 9 Back Glass', brand: 'OnePlus', category: 'Mobile Parts', price: 3500, image: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&w=500&q=60', stock: 40, status: "Pending" },
        { id: 6, title: 'Dell Inspiron Screen', name: 'Dell Inspiron Screen', brand: 'Dell', category: 'Laptop Parts', price: 12000, image: 'https://images.unsplash.com/photo-1588872657578-13eb22fd5525?auto=format&fit=crop&w=500&q=60', stock: 25, status: "Approved" },
        { id: 7, title: 'Asus ROG Fan', name: 'Asus ROG Fan', brand: 'Asus', category: 'Laptop Parts', price: 6000, image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=500&q=60', stock: 10, status: "Flagged" },
        { id: 8, title: 'Acer Aspire Keyboard', name: 'Acer Aspire Keyboard', brand: 'Acer', category: 'Laptop Parts', price: 2500, image: 'https://images.unsplash.com/photo-1587829741301-3b7c8f2595f9?auto=format&fit=crop&w=500&q=60', stock: 60, status: "Approved" },
        { id: 9, title: 'iPhone 14 Case', name: 'iPhone 14 Case', brand: 'Apple', category: 'Accessories', price: 1500, image: 'https://images.unsplash.com/photo-1601593346740-925612772716?auto=format&fit=crop&w=500&q=60', stock: 200, status: "Approved" },
        { id: 10, title: 'Samsung A52 Display', name: 'Samsung A52 Display', brand: 'Samsung', category: 'Mobile Parts', price: 25000, image: 'https://images.unsplash.com/photo-1610945265064-f3947e27ddb9?auto=format&fit=crop&w=500&q=60', stock: 45, status: "Approved" }
    ];
};

export const generateMockData = () => {
    // Use the richer products list with images
    const products = getProducts();

    const orders = [];
    const today = new Date();
    const customerNames = ["Test User", "Ayodya Senavirathne", "John Doe", "Jane Smith", "Michael Brown", "Emily Davis", "Chris Wilson", "Sarah Johnson", "David Lee"];

    // Generate orders for the last 60 days
    for (let i = 0; i < 300; i++) {
        const daysAgo = Math.floor(Math.random() * 60);
        const date = new Date(today);
        date.setDate(today.getDate() - daysAgo);

        const product = products[Math.floor(Math.random() * products.length)];
        const quantity = Math.floor(Math.random() * 3) + 1;
        const customer = customerNames[Math.floor(Math.random() * customerNames.length)];

        // Extended statuses to match the specific UI design
        const statuses = ["Processing", "Delivered", "Shipped", "Canceled", "Disputed"];
        const status = statuses[Math.floor(Math.random() * statuses.length)];

        const expectedDelivery = new Date(date);
        expectedDelivery.setDate(date.getDate() + 5);

        const totalAmount = product.price * quantity;

        orders.push({
            id: `ORD-${1000 + i}`,
            date: date.toISOString().split('T')[0],
            customerName: customer,
            productName: product.name,
            category: product.category,
            amount: totalAmount,
            total: totalAmount, // Alias for OrderDetailsModal
            quantity: quantity,
            status: status,
            trackingNumber: `TN${123456789 + i}`,
            tracking: `TN${123456789 + i}`, // Alias for modal
            trackingProvider: "FedEx", // Mock provider
            expectedDelivery: expectedDelivery.toISOString().split('T')[0],
            shippingAddress: "123 Tech Street, Colombo 03, Sri Lanka",
            paymentMethod: "Credit Card (Visa ending 4242)",
            items: [
                {
                    name: product.name,
                    qty: quantity,
                    price: product.price,
                    image: product.image
                }
            ]
        });
    }

    return orders;
};

const mockOrders = generateMockData();

// ... existing code ...

export const getRecentOrders = () => {
    // Sort by date descending and take top 5
    return [...mockOrders]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);
};

export const getAllOrders = () => {
    return [...mockOrders].sort((a, b) => new Date(b.date) - new Date(a.date));
};

export const getPendingApprovals = () => {
    return [
        { id: 1, title: "iPhone 15 Battery", subtitle: "by TechParts Inc" },
        { id: 2, title: "Samsung S24 Screen", subtitle: "by MobileFix Ltd" },
        { id: 3, title: "MacBook Air M3 Case", subtitle: "by CaseWorld" },
    ];
};

export const getProductMetrics = () => {
    // Dynamic drift to simulate real-time updates
    const drift = (range) => Math.floor(Math.random() * range) - Math.floor(range / 2);

    return {
        pendingApprovals: Math.max(0, 3 + drift(3)), // Varies between 2-4
        totalProducts: 1245 + drift(10), // Varies +/- 5
        outOfStock: Math.max(0, 54 + drift(6)), // Varies +/- 3
        flaggedProducts: Math.max(0, 8 + drift(3)) // Varies +/- 1
    };
};

// End of generateMockData definitions

export const getFinancialMetrics = (dateRange = 7, category = "All Categories") => {
    // Dynamic drift
    const drift = () => Math.floor(Math.random() * 50) - 25;
    const revenueDrift = () => Math.floor(Math.random() * 10000) - 5000;

    // Base Totals (All Categories)
    let totalRevenue = 15439840 + revenueDrift();
    let totalOrders = 300 + Math.floor(Math.random() * 5);
    let avgOrderValue = 51453 + drift();

    // Scaling factors based on category
    if (category === "Mobile Parts") {
        totalRevenue = Math.floor(totalRevenue * 0.66);
        totalOrders = Math.floor(totalOrders * 0.60); // Assuming slightly different order volume mix
        avgOrderValue = Math.floor(totalRevenue / totalOrders);
    } else if (category === "Laptop Parts") {
        totalRevenue = Math.floor(totalRevenue * 0.12);
        totalOrders = Math.floor(totalOrders * 0.15);
        avgOrderValue = Math.floor(totalRevenue / totalOrders);
    } else if (category === "Accessories") {
        totalRevenue = Math.floor(totalRevenue * 0.01);
        totalOrders = Math.floor(totalOrders * 0.05); // Low value, high volume relative to revenue
        avgOrderValue = Math.floor(totalRevenue / totalOrders);
    }

    // Calculate orders for today (keeping logic based on mockOrders for relative consistency)
    const todayStr = new Date().toISOString().split('T')[0];
    const ordersToday = mockOrders.filter(order => order.date === todayStr).length;

    const conversionRate = 3.2;

    // Mock Ad Metrics - Target: 150,000 imp, 7,500 clicks, 5.0% CTR
    const totalImpressions = 150000 + Math.floor(Math.random() * 500);
    const totalClicks = 7500 + drift();
    const ctr = 5.0; // Fixed target CTR
    const totalConversions = 1200 + Math.floor(Math.random() * 50); // Kept similar scaling

    return {
        totalRevenue,
        totalOrders,
        ordersToday,
        avgOrderValue,
        conversionRate,
        activeUsers: 1554, // Mocked active users count
        totalProducts: 2450, // Mocked total products count

        // Ad Metrics
        totalImpressions,
        totalClicks,
        ctr,
        totalConversions
    };
};

export const getSalesOverTime = (dateRange = 7, category = "All Categories") => {
    // Dynamic drift
    const drift = () => Math.floor(Math.random() * 50000) - 25000;

    // Target Total: ~15,439,840
    // Pattern: Fri(Low), Sat(Low), Sun(Low), Mon(Peak), Tue(Dip), Wed(Peak), Thu(Dropping)
    const baseValues = [
        { name: 'Fri', value: 500000 },
        { name: 'Sat', value: 400000 },
        { name: 'Sun', value: 600000 },
        { name: 'Mon', value: 4000000 },
        { name: 'Tue', value: 2500000 },
        { name: 'Wed', value: 5000000 },
        { name: 'Thu', value: 2439840 }
    ];

    let multiplier = 1;
    if (category === "Mobile Parts") multiplier = 0.66;
    if (category === "Laptop Parts") multiplier = 0.12;
    if (category === "Accessories") multiplier = 0.01;

    return baseValues.map(day => ({
        name: day.name,
        value: Math.floor((day.value + drift()) * multiplier)
    }));
};

export const getTopProducts = (dateRange = 7, category = "All Categories") => {
    // Target Total Units: ~270
    const drift = () => Math.floor(Math.random() * 4) - 2;

    const allTopProducts = [
        { name: "Samsung A52 Display", value: 95 + drift(), category: "Mobile Parts" },
        { name: "Lenovo Charger", value: 80 + drift(), category: "Laptop Parts" },
        { name: "iPhone 14 Case", value: 60 + drift(), category: "Accessories" },
        { name: "Acer Aspire Keyboard", value: 35 + drift(), category: "Laptop Parts" },
        { name: "iPhone 13 Pro", value: 25 + drift(), category: "Mobile Parts" },
        { name: "HP Pavilion Battery", value: 15 + drift(), category: "Laptop Parts" }
    ];

    if (category === "All Categories") {
        return allTopProducts.slice(0, 4);
    }

    // Filter by category
    const filtered = allTopProducts.filter(p => p.category === category);

    // If not enough products in mock top list, add a fallback or return what we have
    if (filtered.length === 0) {
        return [{ name: `Top ${category} Item`, value: 10 }];
    }

    return filtered;
};

export const getCategorySales = () => {
    // Target Total: ~15,439,840
    // Mobile Parts (66%), Laptop Parts (12%), Accessories (1%)
    // Mobile: ~10.2M, Laptop: ~1.85M, Accessories: ~155K, Others: ~3.2M (21%)

    const drift = () => Math.floor(Math.random() * 10000) - 5000;

    return [
        { name: "Mobile Parts", value: 10190000 + drift(), color: '#F97316' }, // Orange
        { name: "Laptop Parts", value: 1850000 + drift(), color: '#DC2626' }, // Red
        { name: "Accessories", value: 155000 + drift(), color: '#EA580C' }, // Dark Orange
        { name: "Other", value: 3244840 + drift(), color: '#C2410C' } // Remaining to match total
    ];
};

// Custom designed ad images
import summerSaleImg from 'src/assets/ads/summer_sale.png';
import winterClearanceImg from 'src/assets/ads/winter_clearance.png';
import newArrivalsImg from 'src/assets/ads/new_arrivals.png';
import technovaPromoImg from 'src/assets/ads/technova_promo.png';

// Custom designed product images
import samsungS21ScreenImg from 'src/assets/products/samsung_s21_screen.png';
import hpBatteryImg from 'src/assets/products/hp_battery.png';

export const getAdCampaigns = () => {
    // Dynamic drift factor (small variation to make it feel "live")
    const drift = () => Math.floor(Math.random() * 10) - 5;

    return [
        {
            id: 1,
            title: "Summer Sale Campaign",
            image: summerSaleImg,
            status: "Active",
            clicks: 1234 + drift(),
            impressions: 1234 + drift(),
            active: true
        },
        {
            id: 2,
            title: "Winter Clearance",
            image: winterClearanceImg,
            status: "Pause",
            clicks: 856 + drift(),
            impressions: 2400 + drift(),
            active: false
        },
        {
            id: 3,
            title: "New Arrivals Promo",
            image: newArrivalsImg,
            status: "Active",
            clicks: 1105 + drift(),
            impressions: 12500 + Math.floor(Math.random() * 100),
            active: true
        },
        {
            id: 4,
            title: "Technova Brand Promo",
            image: technovaPromoImg,
            status: "Pause",
            clicks: 450 + drift(),
            impressions: 1000 + drift(),
            active: false
        }
    ];
};

// Mutable users array
let users = [
    {
        id: 1,
        name: "Test User",
        email: "user@gmail.com",
        role: "Buyer",
        status: "Active",
        image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop"
    },
    {
        id: 2,
        name: "Test Seller",
        email: "seller@gmail.com",
        role: "Seller",
        status: "Active",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop"
    },
    {
        id: 3,
        name: "Test Admin",
        email: "admin@gmail.com",
        role: "Admin",
        status: "Active",
        image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop"
    },
    {
        id: 4,
        name: "Ayodya Senavirathne",
        email: "ayodyasenavirathne@gmail.com",
        role: "Buyer",
        status: "Active",
        image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=150&h=150&fit=crop"
    }
];

export const getAllUsers = () => {
    // Dynamic simulation: randomly toggle a status occasionally
    if (Math.random() > 0.5) {
        const randomIndex = Math.floor(Math.random() * users.length);
        const user = users[randomIndex];
        // Toggle status
        const newStatus = user.status === "Active" ? "Inactive" : "Active";
        // Update the mutable array (simulating DB update)
        users[randomIndex] = { ...user, status: newStatus };
    }
    // Return a new array reference to trigger React re-renders effectively
    return [...users];
};



export const updateUser = (id, updatedData) => {
    users = users.map(user =>
        user.id === id ? { ...user, ...updatedData } : user
    );
    return users.find(user => user.id === id);
};

// Mutable wishlist
const wishlists = [
    {
        userId: 1, // Test User
        items: [
            { id: 101, name: "Casual Shoes", category: "Fashion", price: 4500, image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500" }
        ]
    }
];

export const getWishlist = (userId) => {
    const list = wishlists.find(w => w.userId === userId);
    return list ? list.items : [];
};

export const addToWishlist = (userId, item) => {
    let list = wishlists.find(w => w.userId === userId);
    if (!list) {
        list = { userId, items: [] };
        wishlists.push(list);
    }
    const exists = list.items.find(i => i.id === item.id);
    if (!exists) {
        list.items.push(item);
    }
    return list.items;
};

export const removeFromWishlist = (userId, itemId) => {
    const list = wishlists.find(w => w.userId === userId);
    if (list) {
        list.items = list.items.filter(item => item.id !== itemId);
    }
    return list ? list.items : [];
};

export const getUserStats = (userEmail) => {
    // Determine user name from email for mock matching
    const user = users.find(u => u.email === userEmail);
    const userName = user ? user.name : "Test User"; // Fallback
    const userId = user ? user.id : 1;

    const userOrders = mockOrders.filter(o => o.customerName === userName);
    const totalOrders = userOrders.length;

    const activeOrders = userOrders.filter(o =>
        ['Processing', 'Shipped', 'Disputed'].includes(o.status)
    ).length;

    const totalSpent = userOrders.reduce((acc, curr) => acc + curr.amount, 0);
    const loyaltyPoints = Math.floor(totalSpent / 100); // 1 point per 100 currency

    // Get actual wishlist count
    const wishlist = getWishlist(userId);

    return {
        totalOrders,
        wishlistItems: wishlist.length,
        activeOrders,
        loyaltyPoints
    };
};

export const getUserOrders = (userEmail) => {
    const user = users.find(u => u.email === userEmail);
    const userName = user ? user.name : "Test User";

    return mockOrders
        .filter(o => o.customerName === userName)
        .sort((a, b) => new Date(b.date) - new Date(a.date));
};

// Mutable notifications
let notifications = [
    { id: 1, userId: 1, title: 'Order Shipped!', description: 'Your order #ORD_123 has been shipped.', time: '2 mins ago', unread: true },
    { id: 2, userId: 1, title: 'Flash Sale Alert', description: 'Up to 50% off on mobile accessories!', time: '1 hour ago', unread: true },
    { id: 3, userId: 1, title: 'Price Drop', description: 'Laptop HP 250 G8 price decreased by Rs. 5000.', time: '5 hours ago', unread: false },
    { id: 4, userId: 1, title: 'Welcome to Tech Nova!', description: 'Thanks for creating an account.', time: '1 day ago', unread: false },
];

export const getNotifications = (userId = 1) => {
    return notifications.filter(n => n.userId === userId);
};

export const markAllNotificationsAsRead = (userId = 1) => {
    notifications = notifications.map(n =>
        n.userId === userId ? { ...n, unread: false } : n
    );
    return getNotifications(userId);
};

export const markNotificationAsRead = (id) => {
    const index = notifications.findIndex(n => n.id === id);
    if (index !== -1) {
        notifications[index] = { ...notifications[index], unread: false };
    }
    return notifications.find(n => n.id === id);
};

export const addNotification = (userId, notification) => {
    const newNotification = {
        id: Date.now(), // Unique ID
        userId,
        time: 'Just now',
        unread: true,
        ...notification
    };
    notifications.unshift(newNotification); // Add to beginning
    return notifications.filter(n => n.userId === userId);
};

export const deleteNotification = (id, userId) => {
    notifications = notifications.filter(n => n.id !== id);
    return notifications.filter(n => n.userId === userId);
};
