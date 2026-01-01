// Mock service for seller statistics
// In a real app, this would import 'api' and make actual requests

const sellerService = {
    getSellerStats: async () => {
        // Simulating API call
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    data: {
                        revenue: 58750,
                        productsListed: 15,
                        ordersMonth: 24,
                        averageRating: 4.8,
                        recentOrders: [
                            { id: "#ORD_123", date: "2025-01-01", name: "Ayodya Senavirthne", item: "iPhone 13 Display", price: 25000, status: "Shipped" },
                            { id: "#ORD_124", date: "2025-01-02", name: "Kamal Perera", item: "Samsung S21 Screen", price: 18500, status: "Processing" },
                            { id: "#ORD_125", date: "2024-12-28", name: "Nimali Silva", item: "Laptop HP 250 G8", price: 125000, status: "Delivered" },
                            { id: "#ORD_126", date: "2025-01-03", name: "Sunil Ratnayake", item: "Sony Headphones", price: 8500, status: "Processing" },
                            { id: "#ORD_127", date: "2024-12-30", name: "Dilshan Bandara", item: "MacBook Air M1", price: 285000, status: "Shipped" },
                            { id: "#ORD_128", date: "2025-01-04", name: "Chathuri Jayasinghe", item: "Logitech Mouse", price: 4500, status: "Processing" },
                            { id: "#ORD_129", date: "2024-12-25", name: "Kasun Rajitha", item: "Dell Monitor 24\"", price: 45000, status: "Delivered" },
                            { id: "#ORD_130", date: "2024-12-29", name: "Priya Gamage", item: "Mechanical Keyboard", price: 12000, status: "Delivered" },
                            { id: "#ORD_131", date: "2025-01-05", name: "Asela Gunawardena", item: "USB-C Hub", price: 3500, status: "Processing" },
                            { id: "#ORD_132", date: "2025-01-01", name: "Manjula Peiris", item: "Webcam 1080p", price: 9500, status: "Shipped" }
                        ],
                        salesOverTime: [
                            { name: 'Mon', value: 4000 },
                            { name: 'Tue', value: 3000 },
                            { name: 'Wed', value: 2000 },
                            { name: 'Thu', value: 2780 },
                            { name: 'Fri', value: 1890 },
                            { name: 'Sat', value: 2390 },
                            { name: 'Sun', value: 3490 },
                        ],
                        categorySales: [
                            { name: 'Electronics', value: 400, color: '#0088FE' },
                            { name: 'Fashion', value: 300, color: '#00C49F' },
                            { name: 'Home', value: 300, color: '#FFBB28' },
                            { name: 'Beauty', value: 200, color: '#FF8042' },
                        ],
                        products: [
                            {
                                id: 1,
                                name: 'Wireless Bluetooth Headphones',
                                price: 4999,
                                stock: 45,
                                sold: 120,
                                status: 'Shipped',
                                image: 'https://imagedelivery.net/7D3NQGy_afPWwbfcO5Acjw/celltronics.lk/2024/09/Sony-WH-CH720N-Wireless-Noise-Cancelling-Headphone.jpg/w=600,h=600,fit=crop',
                                colors: [
                                    { name: "Midnight Black", img: "https://imagedelivery.net/7D3NQGy_afPWwbfcO5Acjw/celltronics.lk/2024/09/Sony-WH-CH720N-Wireless-Noise-Cancelling-Headphone.jpg/w=600,h=600,fit=crop" },
                                    { name: "Silver", img: "https://images.unsplash.com/photo-1583394838336-acd977730f90?w=800&auto=format&fit=crop" }
                                ]
                            },
                            {
                                id: 2,
                                name: 'iphone 13 display',
                                price: 1299,
                                stock: 8,
                                sold: 320,
                                status: 'Processing',
                                image: 'https://display.lk/wp-content/uploads/2024/05/13mini.jpg',
                                colors: [
                                    { name: "Pink", img: "https://display.lk/wp-content/uploads/2024/05/13mini.jpg" },
                                    { name: "Midnight", img: "https://m.media-amazon.com/images/I/61m668I9HeL._AC_SL1500_.jpg" }
                                ]
                            },
                            {
                                id: 3,
                                name: 'Laptop HP 250 G8',
                                price: 799,
                                stock: 0,
                                sold: 150,
                                status: 'Delivered',
                                image: 'https://5.imimg.com/data5/SELLER/Default/2024/5/421564721/IE/OY/HY/222521024/hp-250-g8-laptop.webp',
                                colors: [
                                    { name: "Silver", img: "https://5.imimg.com/data5/SELLER/Default/2024/5/421564721/IE/OY/HY/222521024/hp-250-g8-laptop.webp" },
                                    { name: "Black", img: "https://m.media-amazon.com/images/I/71Yv8+N9BKL._AC_SL1500_.jpg" }
                                ]
                            }
                        ]
                    }
                });
            }, 500); // 500ms delay
        });
    }
};

export default sellerService;
