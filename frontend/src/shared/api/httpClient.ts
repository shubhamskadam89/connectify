import { ApiError, UnauthorizedError, ValidationError, NetworkError } from './errors';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
}

async function handleResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  const data = isJson ? await response.json() : null;

  if (response.ok) {
    return data as T;
  }

  const message = data?.message || data?.error || `Request failed with status ${response.status}`;

  if (response.status === 401) {
    // Automatically clear token on 401 unauthorized responses
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    throw new UnauthorizedError(message);
  }

  if (response.status === 400) {
    throw new ValidationError(message, data);
  }

  throw new ApiError(message, response.status, data);
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`);
  
  if (options.params) {
    Object.entries(options.params).forEach(([key, val]) => {
      url.searchParams.append(key, val);
    });
  }

  const token = localStorage.getItem('accessToken');
  const headers = new Headers(options.headers);
  
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  try {
    const response = await fetch(url.toString(), {
      ...options,
      headers,
    });
    return await handleResponse<T>(response);
  } catch (error) {
    if (error instanceof ApiError || error instanceof UnauthorizedError || error instanceof ValidationError) {
      throw error;
    }
    throw new NetworkError();
  }
}

export const httpClient = {
  get<T>(path: string, params?: Record<string, string>, options: RequestOptions = {}): Promise<T> {
    return request<T>(path, { ...options, method: 'GET', params });
  },

  post<T>(path: string, body?: any, options: RequestOptions = {}): Promise<T> {
    return request<T>(path, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  put<T>(path: string, body?: any, options: RequestOptions = {}): Promise<T> {
    return request<T>(path, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  patch<T>(path: string, body?: any, options: RequestOptions = {}): Promise<T> {
    return request<T>(path, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  delete<T>(path: string, body?: any, options: RequestOptions = {}): Promise<T> {
    return request<T>(path, {
      ...options,
      method: 'DELETE',
      body: body ? JSON.stringify(body) : undefined,
    });
  },
};
