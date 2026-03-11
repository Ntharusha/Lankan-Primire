module.exports = {
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_ERROR: 500,
  },

  BOOKING_STATUS: {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    CANCELLED: 'cancelled',
    COMPLETED: 'completed',
  },

  SEAT_STATUS: {
    AVAILABLE: 'available',
    SELECTED: 'selected',
    BOOKED: 'booked',
    BLOCKED: 'blocked',
  },

  ROLES: {
    ADMIN: 'admin',
    USER: 'user',
  },
}
