import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import sellerService from "../../Services/sellerService"; // Removed in favor of MockDataService
import {
    getFinancialMetrics,
    getSalesOverTime,
    getCategorySales,
    getProducts,
    getRecentOrders,
    getAdCampaigns,
    getProductMetrics,
    getPendingApprovals
} from "../../Services/MockDataService";

// Async thunk to fetch seller stats
export const fetchSellerStats = createAsyncThunk(
    "seller/fetchStats",
    async (_, thunkAPI) => {
        try {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 600));

            const financials = getFinancialMetrics();
            const salesOverTime = getSalesOverTime();
            const categorySales = getCategorySales();
            const products = getProducts(); // Get all products for the "My Products" list
            const recentOrders = getRecentOrders();
            const adCampaigns = getAdCampaigns();
            const productMetrics = getProductMetrics();
            const pendingApprovalsList = getPendingApprovals();

            // Construct the payload expected by the UI components
            return {
                revenue: financials.totalRevenue,
                productsListed: products.length,
                ordersMonth: financials.totalOrders, // Using total orders for now
                averageRating: 4.8, // Mocked average
                salesOverTime,
                categorySales,
                recentOrders,
                products, // Pass products list to populate state.products

                // Ad Stats
                totalImpressions: financials.totalImpressions,
                totalClicks: financials.totalClicks,
                ctr: financials.ctr,
                totalConversions: financials.totalConversions,
                adCampaigns, // New dynamic campaigns

                // Product Dashboard Metrics
                pendingApprovals: productMetrics.pendingApprovals,
                totalProducts: productMetrics.totalProducts,
                outOfStock: productMetrics.outOfStock,
                flaggedProducts: productMetrics.flaggedProducts,
                pendingApprovalsList // List of items
            };
        } catch (error) {
            return thunkAPI.rejectWithValue(error.toString());
        }
    }
);

const initialState = {
    stats: {
        revenue: 0,
        productsListed: 0,
        ordersMonth: 0,
        averageRating: 0.0,
        recentOrders: [],
        totalImpressions: 0,
        totalClicks: 0,
        ctr: 0,
        totalConversions: 0,
        adCampaigns: [],
        pendingApprovals: 0,
        totalProducts: 0,
        outOfStock: 0,
        flaggedProducts: 0,
        pendingApprovalsList: []
    },
    products: [], // Added products array
    settings: {
        storeName: "ABC Center",
        email: "abccenter@gmail.com",
        phone: "+94771234567",
        logo: "",
        banner: "",
        ordersNotification: true,
        messagesNotification: true,
        stockNotification: true
    },
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: "",
};

const sellerSlice = createSlice({
    name: "seller",
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
            state.message = "";
        },
        updateSettings: (state, action) => {
            state.settings = { ...state.settings, ...action.payload };
        },
        updateOrderStatus: (state, action) => {
            const { id, status } = action.payload;
            const orderIndex = state.stats.recentOrders.findIndex(order => order.id === id);
            if (orderIndex !== -1) {
                state.stats.recentOrders[orderIndex].status = status;
            }
        },
        addProduct: (state, action) => {
            state.products.push(action.payload);
        },
        updateProduct: (state, action) => {
            const index = state.products.findIndex(p => p.id === action.payload.id);
            if (index !== -1) {
                state.products[index] = action.payload;
            }
        },
        deleteProduct: (state, action) => {
            state.products = state.products.filter(p => p.id !== action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSellerStats.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchSellerStats.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.stats = action.payload;
                if (action.payload.products) {
                    state.products = action.payload.products;
                }
            })
            .addCase(fetchSellerStats.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { reset, updateSettings, updateOrderStatus, addProduct, updateProduct, deleteProduct } = sellerSlice.actions;
export default sellerSlice.reducer;
