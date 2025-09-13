import { expect } from 'chai';
import TicketCalculator from '../../src/pairtest/lib/TicketCalculator.js';
import TicketTypeRequest from '../../src/pairtest/lib/TicketTypeRequest.js';

describe('TicketCalculator - Unit Tests', () => {
  describe('Price calculations', () => {
    it('should calculate correct total amount', () => {
      const ticketSummary = { ADULT: 2, CHILD: 1, INFANT: 2 };
      
      const total = TicketCalculator.calculateTotalAmount(ticketSummary);
      
      expect(total).to.equal(65);
    });

    it('should calculate correct seat count', () => {
      const ticketSummary = { ADULT: 2, CHILD: 1, INFANT: 2 };
      
      const seats = TicketCalculator.calculateTotalSeats(ticketSummary);

      expect(seats).to.equal(3);
    });
  });

  describe('Ticket summary creation', () => {
    it('should create correct summary from ticket requests', () => {
      const requests = [
        new TicketTypeRequest('ADULT', 2),
        new TicketTypeRequest('CHILD', 1),
        new TicketTypeRequest('ADULT', 1),
        new TicketTypeRequest('INFANT', 2)
      ];

      const summary = TicketCalculator.createTicketSummary(requests);

      expect(summary).to.deep.equal({ ADULT: 3, CHILD: 1, INFANT: 2 });
    });

    it('should calculate total tickets correctly', () => {
      const ticketSummary = { ADULT: 2, CHILD: 1, INFANT: 2 };
      
      const total = TicketCalculator.getTotalTickets(ticketSummary);
      
      expect(total).to.equal(5);
    });
  });
});