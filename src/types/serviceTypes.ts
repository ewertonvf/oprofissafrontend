export interface Service {
    _id: string;
    name: string;
    title: string;
    description: string;
    price: number;
    providerId: string;
    category: string;
    images: string[];
    rating?: number;
    providerName?: string;
    reviews?: Review[];
  }
  
  export interface Provider {
    _id: string;
    name: string;
    email: string;
    services: string[];
    avatar?: string;
    rating?: number;
  }
  
  export interface Review {
    _id: string;
    serviceId: string;
    userId: string;
    rating: number;
    comment: string;
    createdAt: Date;
  }
  
  export interface Category {
    _id: string;
    name: string;
    description?: string;
  }
  
  export interface ServicesState {
    services: Service[];
    currentService: Service | null;
    serviceDetails: { [key: string]: Service };
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
    hasMore: boolean;
  }