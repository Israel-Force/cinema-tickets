export default class InvalidPurchaseException extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = 'InvalidPurchaseException';
    this.code = code;
    this.details = details;
  }

  static accountIdInvalid(accountId) {
    return new InvalidPurchaseException(
      'ACCOUNT_ID_INVALID',
      'Account ID must be a positive integer.',
      { provided: accountId }
    );
  }

  static noTicketsRequested() {
    return new InvalidPurchaseException(
      'NO_TICKETS_REQUESTED',
      'At least one ticket request is required.'
    );
  }

  static ticketLimitExceeded(requested, maximum = 25) {
    return new InvalidPurchaseException(
      'TICKET_LIMIT_EXCEEDED',
      `Cannot purchase more than ${maximum} tickets at a time.`,
      { requested, maximum }
    );
  }

  static adultSupervisionRequired() {
    return new InvalidPurchaseException(
      'ADULT_SUPERVISION_REQUIRED',
      'Child and Infant tickets cannot be purchased without at least one Adult ticket.'
    );
  }

  static invalidTicketRequest(message) {
    return new InvalidPurchaseException(
      'INVALID_TICKET_REQUEST',
      message
    );
  }
}