// features/step_definitions/purchase_tickets_steps.js
import { Given, When, Then, Before, After } from '@cucumber/cucumber';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import TicketService from '../../../src/pairtest/TicketService.js';
import TicketTypeRequest from '../../../src/pairtest/lib/TicketTypeRequest.js';
import TicketPaymentService from '../../../src/thirdparty/paymentgateway/TicketPaymentService.js';
import SeatReservationService from '../../../src/thirdparty/seatbooking/SeatReservationService.js';
import InvalidPurchaseException from '../../../src/pairtest/lib/InvalidPurchaseException.js';

chai.use(sinonChai);

Before(function () {
  this.sandbox = sinon.createSandbox();

  this.accountId = undefined;
  this.ticketRequests = [];

  this.paymentService = this.sandbox.createStubInstance(TicketPaymentService);
  this.seatReservationService = this.sandbox.createStubInstance(SeatReservationService);

  this.ticketService = new TicketService(this.paymentService, this.seatReservationService);
  this.result = undefined;
  this.error = undefined;
});

After(function () {
  this.sandbox.restore();
});

Given('a valid account id of {int}', function (accountId) {
  this.accountId = accountId;
});

Given('I request {int} {string} tickets', function (quantity, ticketType) {
  this.ticketRequests.push(new TicketTypeRequest(ticketType, quantity));
});

When('I purchase tickets', function () {
  try {
    this.result = this.ticketService.purchaseTickets(this.accountId, ...this.ticketRequests);
  } catch (err) {
    this.error = err;
  }
});

Then('the total amount paid should be {int}', function (expectedAmount) {
  expect(this.error).to.be.undefined;
  expect(this.paymentService.makePayment).to.have.been.calledOnceWithExactly(this.accountId, expectedAmount);
  // Optional: if TicketService returns a summary
  if (this.result) expect(this.result.totalAmount).to.equal(expectedAmount);
});

Then('the total seats reserved should be {int}', function (expectedSeats) {
  expect(this.error).to.be.undefined;
  expect(this.seatReservationService.reserveSeat).to.have.been.calledOnceWithExactly(this.accountId, expectedSeats);
  if (this.result) expect(this.result.totalSeats).to.equal(expectedSeats);
});

Then('the purchase should be rejected with {string}', function (expectedMessage) {
  expect(this.error).to.be.instanceOf(InvalidPurchaseException);
  expect(this.error.message).to.equal(expectedMessage);
  expect(this.paymentService.makePayment).to.not.have.been.called;
  expect(this.seatReservationService.reserveSeat).to.not.have.been.called;
});