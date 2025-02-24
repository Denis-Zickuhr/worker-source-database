export enum HttpStatus {
    OK = 200,
    CREATED = 201,
    ACCEPTED = 202,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    METHOD_NOT_ALLOWED = 405,
    INTERNAL_SERVER_ERROR = 500,
    SERVICE_UNAVAILABLE = 503,
    GATEWAY_TIMEOUT = 504,
    UNPROCESSABLE_ENTITY = 422,
}

export const HttpStatusMessage = (status: HttpStatus): string => {
    switch (status) {
        case HttpStatus.OK: return "OK";
        case HttpStatus.CREATED: return "Created";
        case HttpStatus.ACCEPTED: return "Accepted";
        case HttpStatus.NO_CONTENT: return "No Content";
        case HttpStatus.BAD_REQUEST: return "Bad Request";
        case HttpStatus.UNAUTHORIZED: return "Unauthorized";
        case HttpStatus.FORBIDDEN: return "Forbidden";
        case HttpStatus.NOT_FOUND: return "Not Found";
        case HttpStatus.METHOD_NOT_ALLOWED: return "Method Not Allowed";
        case HttpStatus.INTERNAL_SERVER_ERROR: return "Internal Server Error";
        case HttpStatus.SERVICE_UNAVAILABLE: return "Service Unavailable";
        case HttpStatus.GATEWAY_TIMEOUT: return "Gateway Timeout";
        case HttpStatus.UNPROCESSABLE_ENTITY: return "Unprocessable Entity";
        default: return "Unknown Status";
    }
};
