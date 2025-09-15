import { expect } from "chai";
import TicketTypeRequest from "../../src/pairtest/lib/TicketTypeRequest.js";

describe("TicketTypeRequest", () => {
  describe("Constructor validation", () => {
    it("should create valid ticket request for ADULT", () => {
      const r = new TicketTypeRequest("ADULT", 2);
      expect(r.getTicketType()).to.equal("ADULT");
      expect(r.getNoOfTickets()).to.equal(2);
    });

    it("should create valid ticket request for CHILD", () => {
      const r = new TicketTypeRequest("CHILD", 3);
      expect(r.getTicketType()).to.equal("CHILD");
      expect(r.getNoOfTickets()).to.equal(3);
    });

    it("should create valid ticket request for INFANT", () => {
      const r = new TicketTypeRequest("INFANT", 1);
      expect(r.getTicketType()).to.equal("INFANT");
      expect(r.getNoOfTickets()).to.equal(1);
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

  describe("Catalog exposure (single source of truth)", () => {
    it("should expose TYPES as a frozen array with expected values", () => {
      const TYPES = TicketTypeRequest.TYPES;
      expect(TYPES).to.deep.equal(["ADULT", "CHILD", "INFANT"]);
      expect(Object.isFrozen(TYPES)).to.equal(true);

      expect(() => { TYPES.push("HACK"); }).to.throw(TypeError);
    });

    it("should expose CATALOG as a frozen object with prices/seats/flags", () => {
      const CATALOG = TicketTypeRequest.CATALOG;

      expect(CATALOG.ADULT.price).to.equal(25);
      expect(CATALOG.CHILD.price).to.equal(15);
      expect(CATALOG.INFANT.price).to.equal(0);

      expect(CATALOG.ADULT.seatsPerTicket).to.equal(1);
      expect(CATALOG.INFANT.seatsPerTicket).to.equal(0);

      expect(CATALOG.ADULT.requiresAdult).to.equal(false);
      expect(CATALOG.CHILD.requiresAdult).to.equal(true);
      expect(CATALOG.INFANT.requiresAdult).to.equal(true);

      expect(Object.isFrozen(CATALOG)).to.equal(true);
      expect(() => { CATALOG.NEW = { price: 1 }; }).to.throw(TypeError);
    });

    it("error message lists valid types from the catalog (order-agnostic)", () => {
      try {
        new TicketTypeRequest("STUDENT", 1);
        expect.fail("expected constructor to throw");
      } catch (e) {
        expect(e).to.be.instanceOf(TypeError);

        const msg = String(e.message);
        expect(msg).to.match(/ADULT/);
        expect(msg).to.match(/CHILD/);
        expect(msg).to.match(/INFANT/);
      }
    });
  });

  describe("Immutability", () => {
    it("is frozen at the surface (no new props, no reassignment)", () => {
      const req = new TicketTypeRequest("CHILD", 2);
      expect(Object.isFrozen(req)).to.equal(true);

      expect(() => { req.type = "ADULT"; }).to.throw(TypeError);
      expect(() => { req.noOfTickets = 999; }).to.throw(TypeError);
      expect(() => { req.extra = "nope"; }).to.throw(TypeError);

      expect(req.getTicketType()).to.equal("CHILD");
      expect(req.getNoOfTickets()).to.equal(2);
      expect(req).to.not.have.property("extra");
    });
  });
});