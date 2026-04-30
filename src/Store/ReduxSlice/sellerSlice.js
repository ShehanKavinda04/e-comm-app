import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch seller stats
export const fetchSellerStats = createAsyncThunk(
    "seller/fetchStats",
    async ({ token }, thunkAPI) => {
        try {
            const response = await axios.get("/api/seller/orders/stats", {
                headers: { Authorization: `Bearer ${token}` }
            });

            const data = response.data;

            // Mapping the Backend SellerDashboardStatsDTO to the state
            return {
                revenue: data.revenue || 0,
                productsListed: data.productsListed || 0,
                totalProducts: data.productsListed || 0, // Aliased for StatsCard
                ordersMonth: data.ordersMonth || 0,
                averageRating: data.averageRating || 0,
                outOfStock: data.outOfStock || 0,
                totalImpressions: data.totalImpressions || 0,
                totalClicks: data.totalClicks || 0,
                conversionRate: data.conversionRate || 0,
                flaggedProducts: data.flaggedProducts || 0,
                pendingApprovalsList: data.pendingApprovalsList || [],
                pendingApprovals: (data.pendingApprovalsList || []).length, // Numeric count
                recentOrders: data.recentOrders || [],
                salesHistory: data.salesHistory || [],
                topProducts: data.topProducts || [],
                categorySales: data.categorySales || []
            };
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.toString());
        }
    }
);

export const fetchSellerProducts = createAsyncThunk(
    "seller/fetchProducts",
    async ({ token }, thunkAPI) => {
        try {
            const response = await axios.get("/api/products/seller", {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.toString());
        }
    }
);

export const createProduct = createAsyncThunk(
    "seller/createProduct",
    async ({ token, productData }, thunkAPI) => {
        try {
            const formData = new FormData();
            Object.keys(productData).forEach(key => {
                if (key === 'imageFile' && productData[key]) {
                    formData.append('imageFile', productData[key]);
                } else if (productData[key] !== null && productData[key] !== undefined) {
                    formData.append(key, productData[key]);
                }
            });

            const response = await axios.post("/api/products", formData, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.toString());
        }
    }
);

export const updateProductThunk = createAsyncThunk(
    "seller/updateProduct",
    async ({ token, productId, productData }, thunkAPI) => {
        try {
            const formData = new FormData();
            Object.keys(productData).forEach(key => {
                if (key === 'imageFile' && productData[key]) {
                    formData.append('imageFile', productData[key]);
                } else if (productData[key] !== null && productData[key] !== undefined) {
                    formData.append(key, productData[key]);
                }
            });

            const response = await axios.put(`/api/products/${productId}`, formData, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.toString());
        }
    }
);

export const deleteProductThunk = createAsyncThunk(
    "seller/deleteProduct",
    async ({ token, productId }, thunkAPI) => {
        try {
            await axios.delete(`/api/products/${productId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return productId;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.toString());
        }
    }
);

export const toggleProductStatusThunk = createAsyncThunk(
    "seller/toggleStatus",
    async ({ token, productId }, thunkAPI) => {
        try {
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.toString());
        }
    }
);

export const fetchSellerOrders = createAsyncThunk(
    "seller/fetchOrders",
    async ({ token }, thunkAPI) => {
        try {
            const response = await axios.get("/api/seller/orders", {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.toString());
        }
    }
);

export const updateOrderItemStatusThunk = createAsyncThunk(
    "seller/updateOrderItemStatus",
    async ({ token, itemId, status, trackingNumber }, thunkAPI) => {
        try {
            const response = await axios.patch(`/api/seller/orders/items/${itemId}`, 
                { status, trackingNumber },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.toString());
        }
    }
);

export const fetchStoreSettings = createAsyncThunk(
    "seller/fetchStoreSettings",
    async ({ token }, thunkAPI) => {
        try {
            const response = await axios.get("/api/seller/profile", {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.toString());
        }
    }
);

export const updateStoreSettingsThunk = createAsyncThunk(
    "seller/updateStoreSettings",
    async ({ token, settingsData }, thunkAPI) => {
        try {
            const response = await axios.put("/api/seller/profile", settingsData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return { ...settingsData, message: response.data };
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.toString());
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
    products: [], 
    allOrders: [], // Added for Order Management page
    settings: {
        storeName: "",
        email: "",
        phone: "",
        logo: "",
        banner: "",
        ordersNotification: true,
        messagesNotification: true,
        stockNotification: true,
        description: ""
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
                state.stats = { ...state.stats, ...action.payload };
            })
            .addCase(fetchSellerStats.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Fetch Products
            .addCase(fetchSellerProducts.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchSellerProducts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.products = action.payload; // Set the products array
            })
            .addCase(fetchSellerProducts.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Create Product
            .addCase(createProduct.fulfilled, (state, action) => {
                state.products.push(action.payload);
                state.isSuccess = true;
            })
            // Update Product
            .addCase(updateProductThunk.fulfilled, (state, action) => {
                const index = state.products.findIndex(p => p.id === action.payload.id);
                if (index !== -1) {
                    state.products[index] = action.payload;
                }
                state.isSuccess = true;
            })
            // Delete Product
            .addCase(deleteProductThunk.fulfilled, (state, action) => {
                state.products = state.products.filter(p => p.id !== action.payload);
                state.isSuccess = true;
            })
            // Toggle Status
            .addCase(toggleProductStatusThunk.fulfilled, (state, action) => {
                const index = state.products.findIndex(p => p.id === action.payload.id);
                if (index !== -1) {
                    state.products[index] = action.payload;
                }
                state.isSuccess = true;
            })
            // Fetch All Orders
            .addCase(fetchSellerOrders.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchSellerOrders.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.allOrders = action.payload;
            })
            .addCase(fetchSellerOrders.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Update Order Item Status
            .addCase(updateOrderItemStatusThunk.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateOrderItemStatusThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                
                // Update in allOrders (Critical for Order Management sync)
                if (state.allOrders && action.payload?.id) {
                    const orderIndex = state.allOrders.findIndex(order => String(order.id) === String(action.payload.id));
                    if (orderIndex !== -1) {
                        state.allOrders[orderIndex] = { ...state.allOrders[orderIndex], ...action.payload };
                    }
                }
                
                // Also update in stats.recentOrders if present for dashboard sync
                if (state.stats.recentOrders && action.payload?.id) {
                    const recentIndex = state.stats.recentOrders.findIndex(order => String(order.id) === String(action.payload.id));
                    if (recentIndex !== -1) {
                        state.stats.recentOrders[recentIndex] = { ...state.stats.recentOrders[recentIndex], ...action.payload };
                    }
                }
            })
            .addCase(updateOrderItemStatusThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Fetch Store Settings
            .addCase(fetchStoreSettings.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchStoreSettings.fulfilled, (state, action) => {
                state.isLoading = false;
                state.settings = { ...state.settings, ...action.payload };
            })
            .addCase(fetchStoreSettings.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Update Store Settings
            .addCase(updateStoreSettingsThunk.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateStoreSettingsThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.settings = { ...state.settings, ...action.payload };
                state.message = action.payload.message;
            })
            .addCase(updateStoreSettingsThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { reset, updateSettings, updateOrderStatus, addProduct, updateProduct, deleteProduct } = sellerSlice.actions;
export default sellerSlice.reducer;
