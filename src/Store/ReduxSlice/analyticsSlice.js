import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchAnalyticsReport = createAsyncThunk(
    "analytics/fetchReport",
    async ({ days, categoryId, token }, thunkAPI) => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` },
                params: { days, categoryId }
            };
            const response = await axios.get("/api/analytics/seller/full-report", config);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.toString());
        }
    }
);

const initialState = {
    report: {
        summary: {
            totalRevenue: 0,
            totalOrders: 0,
            avgOrderValue: 0,
            conversionRate: 0
        },
        salesTrend: [],
        topProducts: [],
        categoryDistribution: [],
        adPerformance: {
            totalImpressions: 0,
            totalClicks: 0,
            totalConversions: 0,
            avgCtr: 0
        }
    },
    isLoading: false,
    isError: false,
    message: ""
};

const analyticsSlice = createSlice({
    name: "analytics",
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.message = "";
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAnalyticsReport.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchAnalyticsReport.fulfilled, (state, action) => {
                state.isLoading = false;
                state.report = action.payload;
            })
            .addCase(fetchAnalyticsReport.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    }
});

export const { reset } = analyticsSlice.actions;
export default analyticsSlice.reducer;
