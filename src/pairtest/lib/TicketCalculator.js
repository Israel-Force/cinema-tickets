export default class TicketCalculator {
  static PRICES = {
    ADULT: 25,
    CHILD: 15,
    INFANT: 0
  };

  static calculateTotalAmount(ticketSummary) {
    return Object.entries(ticketSummary)
      .reduce((total, [type, count]) => {
        return total + (count * this.PRICES[type]);
      }, 0);
  }

  static calculateTotalSeats(ticketSummary) {
    // Infants don't get seats
    return ticketSummary.ADULT + ticketSummary.CHILD;
  }

  static createTicketSummary(ticketTypeRequests) {
    const summary = { ADULT: 0, CHILD: 0, INFANT: 0 };
    
    for (const request of ticketTypeRequests) {
      summary[request.getTicketType()] += request.getNoOfTickets();
    }
    
    return summary;
  }

  static getTotalTickets(ticketSummary) {
    return Object.values(ticketSummary).reduce((sum, count) => sum + count, 0);
  }
}