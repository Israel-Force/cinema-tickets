import InvalidPurchaseException from "./InvalidPurchaseException.js";
import TicketTypeRequest from "./TicketTypeRequest.js";

const TYPES = TicketTypeRequest.TYPES;
const CATALOG = TicketTypeRequest.CATALOG;

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
    const requiresAdult = TYPES.some(
      (t) => CATALOG[t].requiresAdult && (ticketSummary[t] ?? 0) > 0
    );
    if (requiresAdult && (ticketSummary.ADULT ?? 0) === 0) {
      throw InvalidPurchaseException.adultSupervisionRequired();
    }
  }
}
