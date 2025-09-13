import InvalidPurchaseException from "./InvalidPurchaseException.js";

export default class BusinessRuleValidator {
  static validate(ticketSummary, totalTickets) {
    this.#validateMinimumTickets(totalTickets);
    this.#validateMaximumTickets(totalTickets);
    this.#validateAdultSupervision(ticketSummary);
  }

  static #validateMinimumTickets(totalTickets) {
    if (totalTickets === 0) {
      throw InvalidPurchaseException.noTicketsRequested();
    }
  }

  static #validateMaximumTickets(totalTickets) {
    if (totalTickets > 25) {
      throw InvalidPurchaseException.ticketLimitExceeded(totalTickets);
    }
  }

  static #validateAdultSupervision(ticketSummary) {
    if (ticketSummary.ADULT === 0 && (ticketSummary.CHILD > 0 || ticketSummary.INFANT > 0)) {
      throw InvalidPurchaseException.adultSupervisionRequired();
    }
  }
}