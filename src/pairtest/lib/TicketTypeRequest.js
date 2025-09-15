/**
 * Immutable Object.
 */

export default class TicketTypeRequest {
  static #CATALOG = Object.freeze({
    ADULT: { price: 25, seatsPerTicket: 1, requiresAdult: false },
    CHILD: { price: 15, seatsPerTicket: 1, requiresAdult: true },
    INFANT: { price: 0, seatsPerTicket: 0, requiresAdult: true },
  });

  static get TYPES() {
    return Object.freeze(Object.keys(this.#CATALOG));
  }

  static get CATALOG() {
    return this.#CATALOG;
  }

  #type;
  #noOfTickets;

  constructor(type, noOfTickets) {
    if (!TicketTypeRequest.TYPES.includes(type)) {
      const list = TicketTypeRequest.TYPES;
      const expected = `${list.slice(0, -1).join(", ")}, or ${list.slice(-1)}`;
      throw new TypeError(`type must be ${expected}`);
    }

    if (!Number.isInteger(noOfTickets)) {
      throw new TypeError("noOfTickets must be an integer");
    }

    this.#type = type;
    this.#noOfTickets = noOfTickets;
    Object.freeze(this);
  }

  getNoOfTickets() {
    return this.#noOfTickets;
  }

  getTicketType() {
    return this.#type;
  }
}
