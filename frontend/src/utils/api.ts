// API configuration and utility functions

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  count?: number;
}

// Get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Generic API request function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const token = getAuthToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    console.log(`[API] Making request to: ${url}`, {
      method: options.method || 'GET',
      hasToken: !!token
    });

    const response = await fetch(url, {
      headers,
      ...options,
    });

    // Check if response is JSON before trying to parse
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      console.error('[API] Non-JSON response:', text);
      throw new Error(`Server returned non-JSON response: ${response.status} ${response.statusText}`);
    }

    if (!response.ok) {
      console.error('[API] Error Response:', {
        status: response.status,
        statusText: response.statusText,
        data,
        url
      });
      throw new Error(data.message || `API request failed: ${response.status} ${response.statusText}`);
    }

    return data;
  } catch (error: any) {
    console.error('[API] Request failed:', {
      error: error.message,
      url,
      endpoint,
      apiBaseUrl: API_BASE_URL
    });

    // Provide more helpful error messages
    if (error instanceof TypeError) {
      if (error.message.includes('fetch')) {
        const helpfulMessage = `Failed to connect to backend server at ${API_BASE_URL}. ` +
          `Please make sure the backend is running on port 5000. ` +
          `Error: ${error.message}`;
        console.error('[API] Network Error:', helpfulMessage);
        throw new Error(helpfulMessage);
      }
      if (error.message.includes('CORS')) {
        const helpfulMessage = `CORS error: The backend may not be allowing requests from ${window.location.origin}. ` +
          `Check backend CORS configuration. Error: ${error.message}`;
        console.error('[API] CORS Error:', helpfulMessage);
        throw new Error(helpfulMessage);
      }
    }

    // Re-throw with original message if we haven't handled it
    throw error;
  }
}

// User API
export const userAPI = {
  register: async (userData: {
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }) => {
    return apiRequest('/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  login: async (email: string, password: string) => {
    return apiRequest('/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  getProfile: async (userId: string) => {
    return apiRequest(`/users/${userId}`);
  },

  updateProfile: async (userId: string, updates: Record<string, any>) => {
    return apiRequest(`/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },
};

// Chat API
export const chatAPI = {
  createChat: async (userId: string, title?: string) => {
    return apiRequest('/chats', {
      method: 'POST',
      body: JSON.stringify({ userId, title }),
    });
  },

  getUserChats: async (userId: string) => {
    return apiRequest(`/chats/user/${userId}`);
  },

  getChat: async (chatId: string) => {
    return apiRequest(`/chats/${chatId}`);
  },

  addMessage: async (
    chatId: string,
    message: {
      content: string;
      role: 'user' | 'assistant';
      emotion?: string;
    }
  ) => {
    return apiRequest(`/chats/${chatId}/messages`, {
      method: 'POST',
      body: JSON.stringify(message),
    });
  },

  updateChatTitle: async (chatId: string, title: string) => {
    return apiRequest(`/chats/${chatId}/title`, {
      method: 'PATCH',
      body: JSON.stringify({ title }),
    });
  },

  deleteChat: async (chatId: string) => {
    return apiRequest(`/chats/${chatId}`, {
      method: 'DELETE',
    });
  },
};

// Emotion API
export const emotionAPI = {
  recordEmotion: async (emotionData: {
    userId: string;
    emotion: string;
    intensity?: number;
    notes?: string;
    context?: string;
  }) => {
    return apiRequest('/emotions', {
      method: 'POST',
      body: JSON.stringify(emotionData),
    });
  },

  getEmotionHistory: async (
    userId: string,
    options?: {
      startDate?: string;
      endDate?: string;
      limit?: number;
    }
  ) => {
    const params = new URLSearchParams();
    if (options?.startDate) params.append('startDate', options.startDate);
    if (options?.endDate) params.append('endDate', options.endDate);
    if (options?.limit) params.append('limit', options.limit.toString());

    const queryString = params.toString();
    return apiRequest(
      `/emotions/user/${userId}${queryString ? `?${queryString}` : ''}`
    );
  },

  getEmotionStats: async (userId: string, days?: number) => {
    const queryString = days ? `?days=${days}` : '';
    return apiRequest(`/emotions/user/${userId}/stats${queryString}`);
  },

  deleteEmotion: async (emotionId: string) => {
    return apiRequest(`/emotions/${emotionId}`, {
      method: 'DELETE',
    });
  },
};

// Auth API
export const authAPI = {
  googleLogin: async (token: string) => {
    return apiRequest('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  },
};

// Chat API - Get AI Response
export const getAIResponse = async (
  message: string,
  conversationHistory: { role: string; content: string }[] = [],
  emotion?: string
) => {
  return apiRequest<{ response: string; emotion: string }>('/chats/ai/response', {
    method: 'POST',
    body: JSON.stringify({ message, conversationHistory, emotion }),
  });
};

// Event API
export const eventAPI = {
  createEvent: async (eventData: {
    title: string;
    description: string;
    location: string;
    city: string;
    date: string;
    time: string;
    maxAttendees: number;
    category: 'meditation' | 'support' | 'workshop' | 'social';
    requiresApproval?: boolean;
    hostId?: string;
  }) => {
    return apiRequest('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  },

  getAllEvents: async (filters?: {
    city?: string;
    category?: string;
    date?: string;
    limit?: number;
    skip?: number;
  }) => {
    const params = new URLSearchParams();
    if (filters?.city) params.append('city', filters.city);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.date) params.append('date', filters.date);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.skip) params.append('skip', filters.skip.toString());

    const queryString = params.toString();
    return apiRequest(`/events${queryString ? `?${queryString}` : ''}`);
  },

  getEvent: async (eventId: string) => {
    return apiRequest(`/events/${eventId}`);
  },

  joinEvent: async (eventId: string, userId?: string) => {
    return apiRequest(`/events/${eventId}/join`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  },

  getUserEvents: async (userId: string) => {
    return apiRequest(`/events/user/${userId}`);
  },

  approveJoinRequest: async (eventId: string, userId: string, hostId?: string) => {
    return apiRequest(`/events/${eventId}/approve/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify({ hostId }),
    });
  },

  rejectJoinRequest: async (eventId: string, userId: string, hostId?: string) => {
    return apiRequest(`/events/${eventId}/reject/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify({ hostId }),
    });
  },

  updateEvent: async (eventId: string, updates: Record<string, any>, hostId?: string) => {
    return apiRequest(`/events/${eventId}`, {
      method: 'PATCH',
      body: JSON.stringify({ ...updates, hostId }),
    });
  },

  deleteEvent: async (eventId: string, hostId?: string) => {
    return apiRequest(`/events/${eventId}`, {
      method: 'DELETE',
      body: JSON.stringify({ hostId }),
    });
  },
};

// Therapist API
export const therapistAPI = {
  getAllTherapists: async (filters?: {
    city?: string;
    specialization?: string;
    limit?: number;
    skip?: number;
  }) => {
    const params = new URLSearchParams();
    if (filters?.city) params.append('city', filters.city);
    if (filters?.specialization) params.append('specialization', filters.specialization);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.skip) params.append('skip', filters.skip.toString());

    const queryString = params.toString();
    return apiRequest(`/therapists${queryString ? `?${queryString}` : ''}`);
  },

  findNearbyTherapists: async (params: {
    latitude: number;
    longitude: number;
    maxDistance?: number;
    specialization?: string;
    limit?: number;
  }) => {
    const queryParams = new URLSearchParams();
    queryParams.append('latitude', params.latitude.toString());
    queryParams.append('longitude', params.longitude.toString());
    if (params.maxDistance) queryParams.append('maxDistance', params.maxDistance.toString());
    if (params.specialization) queryParams.append('specialization', params.specialization);
    if (params.limit) queryParams.append('limit', params.limit.toString());

    return apiRequest(`/therapists/nearby?${queryParams.toString()}`);
  },

  getTherapist: async (therapistId: string) => {
    return apiRequest(`/therapists/${therapistId}`);
  },
};

// Health check
export const healthCheck = async () => {
  return apiRequest('/health');
};

