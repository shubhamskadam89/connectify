export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
    
    if ((Error as any).captureStackTrace) {
      (Error as any).captureStackTrace(this, ApiError);
    }
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = 'Session expired. Please log in again.') {
    super(message, 401);
    this.name = 'UnauthorizedError';
  }
}

export class ValidationError extends ApiError {
  constructor(message: string, data?: any) {
    super(message, 400, data);
    this.name = 'ValidationError';
  }
}

export class NetworkError extends Error {
  constructor(message = 'A network error occurred. Please check your internet connection.') {
    super(message);
    this.name = 'NetworkError';
  }
}
