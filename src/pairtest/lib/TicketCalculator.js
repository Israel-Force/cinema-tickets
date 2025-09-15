import TicketTypeRequest from "./TicketTypeRequest.js";

const TYPES = TicketTypeRequest.TYPES;
const CATALOG = TicketTypeRequest.CATALOG;

export default class TicketCalculator {
  static calculateTotalAmount(ticketSummary) {
    return TYPES.reduce(
      (total, type) => total + (ticketSummary[type] ?? 0) * CATALOG[type].price,
      0
    );
  }

  static calculateTotalSeats(summary) {
    return TYPES.reduce(
      (seats, type) =>
        seats + (summary[type] ?? 0) * CATALOG[type].seatsPerTicket,
      0
    );
  }

  static createTicketSummary(ticketTypeRequests) {
    const summary = Object.fromEntries(TYPES.map((t) => [t, 0]));
    for (const request of ticketTypeRequests)
      summary[request.getTicketType()] += request.getNoOfTickets();

    return summary;
  }

  static getTotalTickets(summary) {
    return TYPES.reduce((sum, type) => sum + (summary[type] ?? 0), 0);
  }
}
