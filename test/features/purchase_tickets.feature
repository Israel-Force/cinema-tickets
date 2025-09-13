# features/purchase_tickets.feature
Feature: Purchase cinema tickets
  As a customer
  I want to buy tickets with clear business rules applied

  Rule: Totals and limits
    - Max 25 tickets per purchase
    - Total seats = ADULT + CHILD

    Scenario: Buying adult, child and infant tickets together
      Given a valid account id of 101
      And I request 2 "ADULT" tickets
      And I request 3 "CHILD" tickets
      And I request 1 "INFANT" tickets
      When I purchase tickets
      Then the total amount paid should be 95
      And the total seats reserved should be 5

    Scenario: Reject purchase when total exceeds 25
      Given a valid account id of 7
      And I request 20 "ADULT" tickets
      And I request 6 "CHILD" tickets
      When I purchase tickets
      Then the purchase should be rejected with "Cannot purchase more than 25 tickets at a time."

    Scenario: Succeeds when total equals 25 (boundary)
      Given a valid account id of 8
      And I request 10 "ADULT" tickets
      And I request 15 "CHILD" tickets
      When I purchase tickets
      Then the total amount paid should be 475
      And the total seats reserved should be 25

  Rule: Adult guardianship
    - CHILD and INFANT require at least one ADULT
    - Each INFANT must have an ADULT (lap seating)

    Scenario: Reject purchase when no adult with child
      Given a valid account id of 5
      And I request 2 "CHILD" tickets
      When I purchase tickets
      Then the purchase should be rejected with "Child and Infant tickets cannot be purchased without at least one Adult ticket."

  Rule: Input validation
    - Account ID must be a positive integer
    - At least one ticket request is required

    Scenario: Invalid account id
      Given a valid account id of 0
      And I request 1 "ADULT" tickets
      When I purchase tickets
      Then the purchase should be rejected with "Account ID must be a positive integer."