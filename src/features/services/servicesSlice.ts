import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchServices, fetchServiceDetails, fetchReviews, fetchProvidersForService } from "../../services/api";
import { Service, ApiResponse, Review, ServicesState, Provider } from "../../types";

const initialState: ServicesState = {
  services: [],
  currentService: null,
  serviceDetails: {},
  providers: {},
  status: "idle",
  error: null,
  hasMore: true,
};

export const fetchServicesAsync = createAsyncThunk<
  ApiResponse<Service[]>,
  void,
  { rejectValue: string }
>(
  "services/fetchServices",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchServices();
      return { data: response, message: "Services fetched successfully", success: true };
    } catch (error) {
      return rejectWithValue("Failed to fetch services");
    }
  }
);

export const fetchServiceDetailsAsync = createAsyncThunk<
  ApiResponse<Service>,
  string,
  { rejectValue: string }
>(
  "services/fetchServiceDetails",
  async (serviceId, { rejectWithValue }) => {
    try {
      const service = await fetchServiceDetails(serviceId);
      return { data: service, message: "Service details fetched successfully", success: true };
    } catch (error) {
      return rejectWithValue("Failed to fetch service details");
    }
  }
);

export const fetchProvidersForServiceAsync = createAsyncThunk<
  ApiResponse<Provider[]> & { serviceId: string },
  string,
  { rejectValue: string }
>(
  "services/fetchProvidersForService",
  async (serviceId, { rejectWithValue }) => {
    try {
      const providers = await fetchProvidersForService(serviceId);
      return { data: providers, message: "Providers fetched successfully", success: true, serviceId };
    } catch (error) {
      return rejectWithValue("Failed to fetch providers");
    }
  }
);

export const fetchServiceReviewsAsync = createAsyncThunk<
  ApiResponse<Review[]>,
  string,
  { rejectValue: string }
>(
  "services/fetchServiceReviews",
  async (serviceId, { rejectWithValue }) => {
    try {
      const reviews = await fetchReviews(serviceId);
      return { data: reviews, message: "Reviews fetched successfully", success: true };
    } catch (error) {
      return rejectWithValue("Failed to fetch service reviews");
    }
  }
);

const servicesSlice = createSlice({
  name: "services",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchServicesAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchServicesAsync.fulfilled, (state, action: PayloadAction<ApiResponse<Service[]>>) => {
        state.status = "succeeded";
        state.services = action.payload.data;
        state.hasMore = action.payload.data.length > 0;
      })
      .addCase(fetchServicesAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch services";
      })
      .addCase(fetchServiceDetailsAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchServiceDetailsAsync.fulfilled, (state, action: PayloadAction<ApiResponse<Service>>) => {
        state.status = "succeeded";
        state.currentService = action.payload.data;
        state.serviceDetails[action.payload.data._id] = action.payload.data;
      })
      .addCase(fetchServiceDetailsAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch service details";
      })
      .addCase(fetchProvidersForServiceAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProvidersForServiceAsync.fulfilled, (state, action: PayloadAction<ApiResponse<Provider[]> & { serviceId: string }>) => {
        state.status = "succeeded";
        state.providers[action.payload.serviceId] = action.payload.data;
      })
      .addCase(fetchProvidersForServiceAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch providers";
      })
      .addCase(fetchServiceReviewsAsync.fulfilled, (state, action: PayloadAction<ApiResponse<Review[]>>) => {
        if (state.currentService) {
          state.currentService.reviews = action.payload.data;
          if (state.serviceDetails[state.currentService._id]) {
            state.serviceDetails[state.currentService._id].reviews = action.payload.data;
          }
        }
      });
  },
});

export default servicesSlice.reducer;