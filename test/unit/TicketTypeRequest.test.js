import { expect } from "chai";
import TicketTypeRequest from "../../src/pairtest/lib/TicketTypeRequest.js";

describe("TicketTypeRequest - Unit Tests", () => {
  describe("Constructor validation", () => {
    it("should create valid ticket request for ADULT type", () => {
      const request = new TicketTypeRequest("ADULT", 2);
      expect(request.getTicketType()).to.equal("ADULT");
      expect(request.getNoOfTickets()).to.equal(2);
    });

    it("should create valid ticket request for CHILD type", () => {
      const request = new TicketTypeRequest("CHILD", 3);
      expect(request.getTicketType()).to.equal("CHILD");
      expect(request.getNoOfTickets()).to.equal(3);
    });

    it("should create valid ticket request for INFANT type", () => {
      const request = new TicketTypeRequest("INFANT", 1);
      expect(request.getTicketType()).to.equal("INFANT");
      expect(request.getNoOfTickets()).to.equal(1);
    });

    it("should throw TypeError for invalid ticket type", () => {
      expect(() => new TicketTypeRequest("INVALID", 1)).to.throw(
        TypeError,
        "type must be ADULT, CHILD, or INFANT"
      );
    });

    it("should throw TypeError for non-integer ticket count", () => {
      expect(() => new TicketTypeRequest("ADULT", "two")).to.throw(
        TypeError,
        "noOfTickets must be an integer"
      );
    });

    it("should throw TypeError for floating point ticket count", () => {
      expect(() => new TicketTypeRequest("ADULT", 2.5)).to.throw(
        TypeError,
        "noOfTickets must be an integer"
      );
    });
  });

  describe("Immutability", () => {
    it("should not allow modification of ticket type after creation", () => {
      const request = new TicketTypeRequest("ADULT", 2);
      // Attempt to modify should not affect the object
      request.type = "CHILD";
      expect(request.getTicketType()).to.equal("ADULT");
    });

    it("should not allow modification of ticket count after creation", () => {
      const request = new TicketTypeRequest("ADULT", 2);
      // Attempt to modify should not affect the object
      request.noOfTickets = 5;
      expect(request.getNoOfTickets()).to.equal(2);
    });
  });
});
