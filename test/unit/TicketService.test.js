import { expect, use } from "chai";
import sinon from "sinon";
import sinonChai from 'sinon-chai';
import TicketService from "../../src/pairtest/TicketService.js";
import TicketTypeRequest from "../../src/pairtest/lib/TicketTypeRequest.js";
import InvalidPurchaseException from "../../src/pairtest/lib/InvalidPurchaseException.js";
import TicketPaymentService from "../../src/thirdparty/paymentgateway/TicketPaymentService.js";
import SeatReservationService from "../../src/thirdparty/seatbooking/SeatReservationService.js";

use(sinonChai);

describe("TicketService - Senior Implementation (TDD)", () => {
  let ticketService;
  let paymentService;
  let seatReservationService;

  beforeEach(() => {
    paymentService = sinon.createStubInstance(TicketPaymentService);
    seatReservationService = sinon.createStubInstance(SeatReservationService);
    ticketService = new TicketService(paymentService, seatReservationService);
  });

  describe("Account ID validation", () => {
    it("should throw InvalidPurchaseException with specific error code for invalid account ID", () => {
      const adultTicket = new TicketTypeRequest("ADULT", 1);

      try {
        ticketService.purchaseTickets("invalid", adultTicket);
        expect.fail("Should have thrown exception");
      } catch (error) {
        expect(error).to.be.instanceOf(InvalidPurchaseException);
        expect(error.code).to.equal("ACCOUNT_ID_INVALID");
        expect(error.details.provided).to.equal("invalid");
      }
    });

    it("should throw InvalidPurchaseException for zero account ID", () => {
      const adultTicket = new TicketTypeRequest("ADULT", 1);

      try {
        ticketService.purchaseTickets(0, adultTicket);
        expect.fail("Should have thrown exception");
      } catch (error) {
        expect(error.code).to.equal("ACCOUNT_ID_INVALID");
        expect(error.details.provided).to.equal(0);
      }
    });

    it("should throw InvalidPurchaseException with error code for negative account ID", () => {
      const adultTicket = new TicketTypeRequest("ADULT", 1);

      try {
        ticketService.purchaseTickets(-1, adultTicket);
        expect.fail("Should have thrown exception");
      } catch (error) {
        expect(error.code).to.equal("ACCOUNT_ID_INVALID");
        expect(error.details.provided).to.equal(-1);
      }
    });
  });

  describe("Ticket request validation", () => {
    it("should throw InvalidPurchaseException with error code when no ticket requests provided", () => {
      try {
        ticketService.purchaseTickets(1);
        expect.fail("Should have thrown exception");
      } catch (error) {
        expect(error.code).to.equal("NO_TICKETS_REQUESTED");
      }
    });

    it("should throw InvalidPurchaseException with error code for invalid ticket request object", () => {
      try {
        ticketService.purchaseTickets(1, { type: "ADULT", count: 1 });
        expect.fail("Should have thrown exception");
      } catch (error) {
        expect(error.code).to.equal("INVALID_TICKET_REQUEST");
      }
    });

    it("should throw InvalidPurchaseException with error code for zero ticket count", () => {
      const zeroTicket = new TicketTypeRequest("ADULT", 0);

      try {
        ticketService.purchaseTickets(1, zeroTicket);
        expect.fail("Should have thrown exception");
      } catch (error) {
        expect(error.code).to.equal("INVALID_TICKET_REQUEST");
      }
    });
  });

  describe("Business rule validation integration", () => {
    it("should delegate to BusinessRuleValidator for ticket limit validation", () => {
      const tooManyTickets = new TicketTypeRequest("ADULT", 26);

      try {
        ticketService.purchaseTickets(1, tooManyTickets);
        expect.fail("Should have thrown exception");
      } catch (error) {
        expect(error.code).to.equal("TICKET_LIMIT_EXCEEDED");
        expect(error.details.requested).to.equal(26);
        expect(error.details.maximum).to.equal(25);
      }
    });

    it("should delegate to BusinessRuleValidator for adult supervision validation", () => {
      const childTicket = new TicketTypeRequest("CHILD", 1);

      try {
        ticketService.purchaseTickets(1, childTicket);
        expect.fail("Should have thrown exception");
      } catch (error) {
        expect(error.code).to.equal("ADULT_SUPERVISION_REQUIRED");
      }
    });

    it("should delegate to BusinessRuleValidator for infant supervision validation", () => {
      const infantTicket = new TicketTypeRequest("INFANT", 1);

      try {
        ticketService.purchaseTickets(1, infantTicket);
        expect.fail("Should have thrown exception");
      } catch (error) {
        expect(error.code).to.equal("ADULT_SUPERVISION_REQUIRED");
      }
    });

    it("should allow valid business rule scenarios through BusinessRuleValidator", () => {
      const adultTickets = new TicketTypeRequest("ADULT", 2);
      const childTickets = new TicketTypeRequest("CHILD", 3);
      const infantTickets = new TicketTypeRequest("INFANT", 2);

      expect(() =>
        ticketService.purchaseTickets(
          1,
          adultTickets,
          childTickets,
          infantTickets
        )
      ).to.not.throw();
    });
  });

  describe("Payment and seat calculation", () => {
    it("should calculate correct amount for adult tickets only", () => {
      const adultTickets = new TicketTypeRequest("ADULT", 2);

      ticketService.purchaseTickets(1, adultTickets);

      expect(paymentService.makePayment).to.have.been.calledWith(1, 50);
    });

    it("should calculate correct amount and seats for mixed tickets", () => {
      const adultTickets = new TicketTypeRequest("ADULT", 2);
      const childTickets = new TicketTypeRequest("CHILD", 1);
      const infantTickets = new TicketTypeRequest("INFANT", 1);

      ticketService.purchaseTickets(
        1,
        adultTickets,
        childTickets,
        infantTickets
      );

      expect(paymentService.makePayment).to.have.been.calledWith(1, 65);
      expect(seatReservationService.reserveSeat).to.have.been.calledWith(1, 3);
    });
  });

  describe("Seat reservation calculation and processing", () => {
    it("should reserve correct number of seats for adults only", () => {
      const adultTickets = new TicketTypeRequest("ADULT", 3);

      ticketService.purchaseTickets(1, adultTickets);

      expect(seatReservationService.reserveSeat).to.have.been.calledWith(1, 3);
    });

    it("should reserve correct number of seats excluding infants", () => {
      const adultTickets = new TicketTypeRequest("ADULT", 2);
      const childTickets = new TicketTypeRequest("CHILD", 2);
      const infantTickets = new TicketTypeRequest("INFANT", 3);

      ticketService.purchaseTickets(
        1,
        adultTickets,
        childTickets,
        infantTickets
      );

      expect(seatReservationService.reserveSeat).to.have.been.calledWith(1, 4);
    });
  });

  describe("Multiple ticket requests aggregation", () => {
    it("should aggregate multiple requests of same type", () => {
      const adultTickets1 = new TicketTypeRequest("ADULT", 2);
      const adultTickets2 = new TicketTypeRequest("ADULT", 3);

      ticketService.purchaseTickets(1, adultTickets1, adultTickets2);

      expect(paymentService.makePayment).to.have.been.calledWith(1, 125);
      expect(seatReservationService.reserveSeat).to.have.been.calledWith(1, 5);
    });

    it("should handle complex mixed scenarios within 25 ticket limit", () => {
      const adultTickets1 = new TicketTypeRequest("ADULT", 5);
      const adultTickets2 = new TicketTypeRequest("ADULT", 3);
      const childTickets1 = new TicketTypeRequest("CHILD", 4);
      const childTickets2 = new TicketTypeRequest("CHILD", 2);
      const infantTickets = new TicketTypeRequest("INFANT", 8);

      ticketService.purchaseTickets(
        1,
        adultTickets1,
        adultTickets2,
        childTickets1,
        childTickets2,
        infantTickets
      );

      expect(paymentService.makePayment).to.have.been.calledWith(1, 290);
      expect(seatReservationService.reserveSeat).to.have.been.calledWith(1, 14);
    });
  });

  describe("Service integration and error prevention", () => {
    it("should not call external services when business rules fail", () => {
      const childOnlyTicket = new TicketTypeRequest("CHILD", 1);

      expect(() => ticketService.purchaseTickets(1, childOnlyTicket)).to.throw(
        InvalidPurchaseException
      );

      expect(paymentService.makePayment).to.not.have.been.called;
      expect(seatReservationService.reserveSeat).to.not.have.been.called;
    });

    it("should not call external services when ticket limit exceeded", () => {
      const tooManyTickets = new TicketTypeRequest("ADULT", 30);

      expect(() => ticketService.purchaseTickets(1, tooManyTickets)).to.throw(
        InvalidPurchaseException
      );

      expect(paymentService.makePayment).to.not.have.been.called;
      expect(seatReservationService.reserveSeat).to.not.have.been.called;
    });

    it("should call both services for valid purchase", () => {
      const adultTicket = new TicketTypeRequest("ADULT", 1);

      ticketService.purchaseTickets(1, adultTicket);

      expect(paymentService.makePayment).to.have.been.calledOnce;
      expect(seatReservationService.reserveSeat).to.have.been.calledOnce;
    });
  });
});
