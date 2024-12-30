import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { searchServices } from "../../services/api";
import { Service } from "../../types";

interface SearchState {
  searchResults: Service[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  hasMore: boolean;
}

const initialState: SearchState = {
  searchResults: [],
  status: "idle",
  error: null,
  hasMore: true,
};

export const searchServicesAsync = createAsyncThunk(
  "search/searchServices",
  async ({ query, filters }: { query: string; filters: any }) => {
    return await searchServices(query, filters);
  }
);

export const searchMoreServicesAsync = createAsyncThunk(
  "search/searchMoreServices",
  async ({ query, filters }: { query: string; filters: any }) => {
    return await searchServices(query, filters);
  }
);

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(searchServicesAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(searchServicesAsync.fulfilled, (state, action: PayloadAction<Service[]>) => {
        state.status = "succeeded";
        state.searchResults = action.payload;
        state.hasMore = action.payload.length > 0;
      })
      .addCase(searchServicesAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
      .addCase(searchMoreServicesAsync.fulfilled, (state, action: PayloadAction<Service[]>) => {
        state.searchResults = [...state.searchResults, ...action.payload];
        state.hasMore = action.payload.length > 0;
      });
  },
});

export default searchSlice.reducer;