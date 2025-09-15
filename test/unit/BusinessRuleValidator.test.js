import { expect } from "chai";
import BusinessRuleValidator from "../../src/pairtest/lib/BusinessRuleValidator.js";
import InvalidPurchaseException from "../../src/pairtest/lib/InvalidPurchaseException.js";

describe("BusinessRuleValidator", () => {
  describe("Minimum tickets validation", () => {
    it("should pass validation when tickets are requested", () => {
      const ticketSummary = { ADULT: 1, CHILD: 0, INFANT: 0 };
      const totalTickets = 1;

      expect(() =>
        BusinessRuleValidator.validate(ticketSummary, totalTickets)
      ).to.not.throw();
    });

    it("should throw exception when no tickets requested", () => {
      const ticketSummary = { ADULT: 0, CHILD: 0, INFANT: 0 };
      const totalTickets = 0;

      try {
        BusinessRuleValidator.validate(ticketSummary, totalTickets);
        expect.fail("Should have thrown exception");
      } catch (error) {
        expect(error).to.be.instanceOf(InvalidPurchaseException);
        expect(error.code).to.equal("NO_TICKETS_REQUESTED");
      }
    });
  });

  describe("Maximum tickets validation", () => {
    it("should pass validation for exactly 25 tickets", () => {
      const ticketSummary = { ADULT: 25, CHILD: 0, INFANT: 0 };
      const totalTickets = 25;

      expect(() =>
        BusinessRuleValidator.validate(ticketSummary, totalTickets)
      ).to.not.throw();
    });

    it("should throw exception when requesting 26 tickets", () => {
      const ticketSummary = { ADULT: 26, CHILD: 0, INFANT: 0 };
      const totalTickets = 26;

      try {
        BusinessRuleValidator.validate(ticketSummary, totalTickets);
        expect.fail("Should have thrown exception");
      } catch (error) {
        expect(error).to.be.instanceOf(InvalidPurchaseException);
        expect(error.code).to.equal("TICKET_LIMIT_EXCEEDED");
        expect(error.details.requested).to.equal(26);
        expect(error.details.maximum).to.equal(25);
      }
    });
  });

  describe("Adult supervision validation", () => {
    it("should pass validation when adults present with children", () => {
      const ticketSummary = { ADULT: 2, CHILD: 3, INFANT: 1 };
      const totalTickets = 5;

      expect(() =>
        BusinessRuleValidator.validate(ticketSummary, totalTickets)
      ).to.not.throw();
    });

    it("should pass validation for adults only", () => {
      const ticketSummary = { ADULT: 2 };
      const totalTickets = 2;
      expect(() =>
        BusinessRuleValidator.validate(ticketSummary, totalTickets)
      ).to.not.throw();
    });

    it("should throw exception when children without adults", () => {
      const ticketSummary = { ADULT: 0, CHILD: 2, INFANT: 0 };
      const totalTickets = 2;

      try {
        BusinessRuleValidator.validate(ticketSummary, totalTickets);
        expect.fail("Should have thrown exception");
      } catch (error) {
        expect(error).to.be.instanceOf(InvalidPurchaseException);
        expect(error.code).to.equal("ADULT_SUPERVISION_REQUIRED");
      }
    });
  });

  describe("Rule execution order and priority", () => {
    it("should check minimum tickets first - fails on zero tickets even with other violations", () => {
      const ticketSummary = { ADULT: 0, CHILD: 0, INFANT: 0 };
      const totalTickets = 0;

      try {
        BusinessRuleValidator.validate(ticketSummary, totalTickets);
        expect.fail("Should have thrown exception");
      } catch (error) {
        expect(error.code).to.equal("NO_TICKETS_REQUESTED");
      }
    });

    it("should check maximum tickets before supervision - fails on limit even with supervision issues", () => {
      const ticketSummary = { ADULT: 0, CHILD: 30, INFANT: 0 };
      const totalTickets = 30;

      try {
        BusinessRuleValidator.validate(ticketSummary, totalTickets);
        expect.fail("Should have thrown exception");
      } catch (error) {
        expect(error.code).to.equal("TICKET_LIMIT_EXCEEDED");
      }
    });

    it("should check supervision last when other rules pass", () => {
      const ticketSummary = { ADULT: 0, CHILD: 5, INFANT: 0 };
      const totalTickets = 5;

      try {
        BusinessRuleValidator.validate(ticketSummary, totalTickets);
        expect.fail("Should have thrown exception");
      } catch (error) {
        expect(error.code).to.equal("ADULT_SUPERVISION_REQUIRED");
      }
    });
  });
});
