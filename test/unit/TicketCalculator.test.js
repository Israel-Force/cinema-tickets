import { expect } from "chai";
import TicketCalculator from "../../src/pairtest/lib/TicketCalculator.js";
import TicketTypeRequest from "../../src/pairtest/lib/TicketTypeRequest.js";

describe("TicketCalculator", () => {
  describe("Price calculations", () => {
    it("should calculate correct total amount", () => {
      const ticketSummary = { ADULT: 2, CHILD: 1, INFANT: 2 };

      const total = TicketCalculator.calculateTotalAmount(ticketSummary);

      expect(total).to.equal(65);
    });

    it("should calculate correct seat count", () => {
      const ticketSummary = { ADULT: 2, CHILD: 1, INFANT: 2 };
      const seats = TicketCalculator.calculateTotalSeats(ticketSummary);

      expect(seats).to.equal(3);
    });

    it("should return 0 when all counts are 0", () => {
      const summary = { ADULT: 0, CHILD: 0, INFANT: 0 };
      const total = TicketCalculator.getTotalTickets(summary);

      expect(total).to.equal(0);
    });
  });

  describe("Ticket summary creation", () => {
    it("should create correct summary from ticket requests", () => {
      const requests = [
        new TicketTypeRequest("ADULT", 2),
        new TicketTypeRequest("CHILD", 1),
        new TicketTypeRequest("ADULT", 1),
        new TicketTypeRequest("INFANT", 2),
      ];
      const summary = TicketCalculator.createTicketSummary(requests);

      expect(summary).to.deep.equal({ ADULT: 3, CHILD: 1, INFANT: 2 });
    });

    it("should handle zero seat types", () => {
      const summary = { INFANT: 3 };
      const seats = TicketCalculator.calculateTotalSeats(summary);

      expect(seats).to.equal(0);
    });

    it("should default missing types to 0", () => {
      const summary = { ADULT: 2 };
      const total = TicketCalculator.calculateTotalAmount(summary);

      expect(total).to.equal(50);
    });

    it("should ignores unknown summary keys that are not in TYPES", () => {
      const summary = { ADULT: 1, CHILD: 1, INFANT: 1, UNKNOWN: 9999 };
      const total = TicketCalculator.calculateTotalAmount(summary);
      const seats = TicketCalculator.calculateTotalSeats(summary);

      expect(total).to.equal(40);
      expect(seats).to.equal(2);
    });

    it("should calculate total tickets correctly", () => {
      const ticketSummary = { ADULT: 2, CHILD: 1, INFANT: 2 };
      const total = TicketCalculator.getTotalTickets(ticketSummary);

      expect(total).to.equal(5);
    });
  });
});
