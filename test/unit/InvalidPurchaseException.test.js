import { expect } from 'chai';
import InvalidPurchaseException from '../../src/pairtest/lib/InvalidPurchaseException.js';

describe('InvalidPurchaseException', () => {
  describe('Constructor functionality', () => {
    it('should create exception with all three parameters', () => {
      const code = 'TEST_ERROR';
      const message = 'Test error message';
      const details = { testProp: 'testValue' };
      
      const exception = new InvalidPurchaseException(code, message, details);
      
      expect(exception).to.be.instanceOf(Error);
      expect(exception).to.be.instanceOf(InvalidPurchaseException);
      expect(exception.name).to.equal('InvalidPurchaseException');
      expect(exception.code).to.equal(code);
      expect(exception.message).to.equal(message);
      expect(exception.details).to.deep.equal(details);
    });

    it('should create exception with code and message only', () => {
      const code = 'SIMPLE_ERROR';
      const message = 'Simple error';
      
      const exception = new InvalidPurchaseException(code, message);
      
      expect(exception.code).to.equal(code);
      expect(exception.message).to.equal(message);
      expect(exception.details).to.deep.equal({});
    });

    it('should create exception with empty details when not provided', () => {
      const exception = new InvalidPurchaseException('CODE', 'Message');
      
      expect(exception.details).to.be.an('object');
      expect(Object.keys(exception.details)).to.have.length(0);
    });

    it('should preserve error stack trace', () => {
      const exception = new InvalidPurchaseException('CODE', 'Message');
      
      expect(exception.stack).to.be.a('string');
      expect(exception.stack).to.include('InvalidPurchaseException');
    });
  });

  describe('Static factory method: accountIdInvalid', () => {
    it('should create account ID invalid exception with string value', () => {
      const invalidId = 'invalid-id';
      
      const exception = InvalidPurchaseException.accountIdInvalid(invalidId);
      
      expect(exception).to.be.instanceOf(InvalidPurchaseException);
      expect(exception.code).to.equal('ACCOUNT_ID_INVALID');
      expect(exception.message).to.equal('Account ID must be a positive integer.');
      expect(exception.details.provided).to.equal(invalidId);
    });

    it('should create account ID invalid exception with null value', () => {
      const exception = InvalidPurchaseException.accountIdInvalid(null);
      
      expect(exception.code).to.equal('ACCOUNT_ID_INVALID');
      expect(exception.details.provided).to.be.null;
    });

    it('should create account ID invalid exception with zero value', () => {
      const exception = InvalidPurchaseException.accountIdInvalid(0);
      
      expect(exception.code).to.equal('ACCOUNT_ID_INVALID');
      expect(exception.details.provided).to.equal(0);
    });

    it('should create account ID invalid exception with negative value', () => {
      const exception = InvalidPurchaseException.accountIdInvalid(-5);
      
      expect(exception.code).to.equal('ACCOUNT_ID_INVALID');
      expect(exception.details.provided).to.equal(-5);
    });

    it('should create account ID invalid exception with float value', () => {
      const exception = InvalidPurchaseException.accountIdInvalid(1.5);
      
      expect(exception.code).to.equal('ACCOUNT_ID_INVALID');
      expect(exception.details.provided).to.equal(1.5);
    });

    it('should create account ID invalid exception with object value', () => {
      const invalidId = { id: 123 };
      
      const exception = InvalidPurchaseException.accountIdInvalid(invalidId);
      
      expect(exception.code).to.equal('ACCOUNT_ID_INVALID');
      expect(exception.details.provided).to.deep.equal(invalidId);
    });
  });

  describe('Static factory method: noTicketsRequested', () => {
    it('should create no tickets exception with correct properties', () => {
      const exception = InvalidPurchaseException.noTicketsRequested();
      
      expect(exception).to.be.instanceOf(InvalidPurchaseException);
      expect(exception.code).to.equal('NO_TICKETS_REQUESTED');
      expect(exception.message).to.equal('At least one ticket request is required.');
      expect(exception.details).to.deep.equal({});
    });

    it('should create consistent exceptions when called multiple times', () => {
      const exception1 = InvalidPurchaseException.noTicketsRequested();
      const exception2 = InvalidPurchaseException.noTicketsRequested();
      
      expect(exception1.code).to.equal(exception2.code);
      expect(exception1.message).to.equal(exception2.message);
      expect(exception1.details).to.deep.equal(exception2.details);
      expect(exception1).to.not.equal(exception2);
    });
  });

  describe('Static factory method: ticketLimitExceeded', () => {
    it('should create ticket limit exception with default maximum', () => {
      const requested = 30;
      
      const exception = InvalidPurchaseException.ticketLimitExceeded(requested);
      
      expect(exception).to.be.instanceOf(InvalidPurchaseException);
      expect(exception.code).to.equal('TICKET_LIMIT_EXCEEDED');
      expect(exception.message).to.equal('Cannot purchase more than 25 tickets at a time.');
      expect(exception.details.requested).to.equal(requested);
      expect(exception.details.maximum).to.equal(25);
    });

    it('should create ticket limit exception with custom maximum', () => {
      const requested = 15;
      const customMax = 10;
      
      const exception = InvalidPurchaseException.ticketLimitExceeded(requested, customMax);
      
      expect(exception.code).to.equal('TICKET_LIMIT_EXCEEDED');
      expect(exception.message).to.equal('Cannot purchase more than 10 tickets at a time.');
      expect(exception.details.requested).to.equal(requested);
      expect(exception.details.maximum).to.equal(customMax);
    });
  });

  describe('Static factory method: adultSupervisionRequired', () => {
    it('should create adult supervision exception with correct properties', () => {
      const exception = InvalidPurchaseException.adultSupervisionRequired();
      
      expect(exception).to.be.instanceOf(InvalidPurchaseException);
      expect(exception.code).to.equal('ADULT_SUPERVISION_REQUIRED');
      expect(exception.message).to.equal('Child and Infant tickets cannot be purchased without at least one Adult ticket.');
      expect(exception.details).to.deep.equal({});
    });

    it('should create consistent exceptions when called multiple times', () => {
      const exception1 = InvalidPurchaseException.adultSupervisionRequired();
      const exception2 = InvalidPurchaseException.adultSupervisionRequired();
      
      expect(exception1.code).to.equal(exception2.code);
      expect(exception1.message).to.equal(exception2.message);
      expect(exception1.details).to.deep.equal(exception2.details);
    });
  });

  describe('Static factory method: invalidTicketRequest', () => {
    it('should create invalid ticket request exception with custom message', () => {
      const customMessage = 'Custom validation error message';
      
      const exception = InvalidPurchaseException.invalidTicketRequest(customMessage);
      
      expect(exception).to.be.instanceOf(InvalidPurchaseException);
      expect(exception.code).to.equal('INVALID_TICKET_REQUEST');
      expect(exception.message).to.equal(customMessage);
      expect(exception.details).to.deep.equal({});
    });

    it('should handle empty string message', () => {
      const exception = InvalidPurchaseException.invalidTicketRequest('');
      
      expect(exception.code).to.equal('INVALID_TICKET_REQUEST');
      expect(exception.message).to.equal('');
    });

    it('should handle long message', () => {
      const longMessage = 'This is a very long error message that contains a lot of detail about what went wrong with the ticket request validation process and why it failed';
      
      const exception = InvalidPurchaseException.invalidTicketRequest(longMessage);
      
      expect(exception.code).to.equal('INVALID_TICKET_REQUEST');
      expect(exception.message).to.equal(longMessage);
    });

    it('should handle null message', () => {
      const exception = InvalidPurchaseException.invalidTicketRequest(null);
      
      expect(exception.code).to.equal('INVALID_TICKET_REQUEST');
      expect(exception.message).equal('null');
    });
  });

  describe('Error inheritance and behavior', () => {
    it('should inherit from Error class', () => {
      const exception = new InvalidPurchaseException('CODE', 'Message');
      
      expect(exception).to.be.instanceOf(Error);
      expect(exception.constructor.name).to.equal('InvalidPurchaseException');
    });

    it('should have correct prototype chain', () => {
      const exception = new InvalidPurchaseException('CODE', 'Message');
      
      expect(Object.getPrototypeOf(exception)).to.equal(InvalidPurchaseException.prototype);
      expect(Object.getPrototypeOf(InvalidPurchaseException.prototype)).to.equal(Error.prototype);
    });

    it('should be throwable and catchable', () => {
      const exception = InvalidPurchaseException.accountIdInvalid('invalid');
      
      expect(() => {
        throw exception;
      }).to.throw(InvalidPurchaseException);
      
      try {
        throw exception;
      } catch (caught) {
        expect(caught).to.equal(exception);
        expect(caught.code).to.equal('ACCOUNT_ID_INVALID');
      }
    });

    it('should be identifiable in catch blocks', () => {
      let caughtException = null;
      
      try {
        throw InvalidPurchaseException.ticketLimitExceeded(30);
      } catch (error) {
        if (error instanceof InvalidPurchaseException) {
          caughtException = error;
        }
      }
      
      expect(caughtException).to.not.be.null;
      expect(caughtException.code).to.equal('TICKET_LIMIT_EXCEEDED');
    });
  });
});