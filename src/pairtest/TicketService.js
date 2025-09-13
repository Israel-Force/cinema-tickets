import TicketTypeRequest from './lib/TicketTypeRequest.js';
import InvalidPurchaseException from './lib/InvalidPurchaseException.js';
import TicketCalculator from './lib/TicketCalculator.js';
import BusinessRuleValidator from './lib/BusinessRuleValidator.js';

export default class TicketService {
  #paymentService;
  #seatReservationService;
  #businessRuleEngine;

  constructor(paymentService, seatReservationService) {
    this.#paymentService = paymentService;
    this.#seatReservationService = seatReservationService;
  }

  purchaseTickets(accountId, ...ticketTypeRequests) {
    this.#validateAccountId(accountId);
    this.#validateTicketRequests(ticketTypeRequests);

    const ticketSummary = TicketCalculator.createTicketSummary(ticketTypeRequests);
    const totalTickets = TicketCalculator.getTotalTickets(ticketSummary);
    
    BusinessRuleValidator.validate(ticketSummary, totalTickets);

    const totalAmount = TicketCalculator.calculateTotalAmount(ticketSummary);
    const totalSeats = TicketCalculator.calculateTotalSeats(ticketSummary);

    this.#processPayment(accountId, totalAmount);
    this.#reserveSeats(accountId, totalSeats);
  }

  #validateAccountId(accountId) {
    if (!Number.isInteger(accountId) || accountId <= 0) {
      throw InvalidPurchaseException.accountIdInvalid(accountId);
    }
  }

  #validateTicketRequests(ticketTypeRequests) {
    if (!ticketTypeRequests || ticketTypeRequests.length === 0) {
      throw InvalidPurchaseException.noTicketsRequested();
    }

    for (const request of ticketTypeRequests) {
      if (!(request instanceof TicketTypeRequest)) {
        throw InvalidPurchaseException.invalidTicketRequest(
          'All ticket requests must be instances of TicketTypeRequest'
        );
      }
      if (request.getNoOfTickets() <= 0) {
        throw InvalidPurchaseException.invalidTicketRequest(
          'Number of tickets must be greater than 0'
        );
      }
    }
  }

  #processPayment(accountId, totalAmount) {
    if (totalAmount > 0) {
      this.#paymentService.makePayment(accountId, totalAmount);
    }
  }

  #reserveSeats(accountId, totalSeats) {
    if (totalSeats > 0) {
      this.#seatReservationService.reserveSeat(accountId, totalSeats);
    }
  }
}
