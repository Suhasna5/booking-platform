// Defines error types shared by validation and the global exception filter.
export interface ValidationErrorDetail {
  field: string;
  messages: string[];
}

export interface ErrorResponse {
  statusCode: number;
  message: string;
  traceId: string;
  errors?: ValidationErrorDetail[];
}
