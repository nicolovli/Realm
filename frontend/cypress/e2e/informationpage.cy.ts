/// <reference types="cypress" />

describe("InformationPage, can reveiw", () => {
  const user = {
    username: "cytest",
    email: "cytest@gmail.no",
    password: "123456",
  };

  beforeEach(() => {
    cy.visit("/games/14610");
  });

  it("can review", () => {
    cy.login({ username: user.username, password: user.password });
    cy.wait(500);

    cy.get('textarea[name="description"]').type(
      "This is a Cypress test review.",
    );
    cy.get('button[data-cy="submit-review-button"]').click();
  });

  it("can edit review", () => {
    cy.login({ username: user.username, password: user.password });
    cy.wait(500);

    cy.get('button[data-cy="edit-review-button"]').click();
    cy.get('textarea[name="description"]', { timeout: 10000 })
      .should("be.visible")
      .clear()
      .type(" This is a Cypress test review with edit.");
    cy.get('button[data-cy="save-review-button"]').click();
  });

  it("can delete review", () => {
    cy.login({ username: user.username, password: user.password });
    cy.wait(500);

    cy.get('button[aria-label="Delete review"]').click();
    cy.get('button[aria-label="Confirm delete review"]').click();
  });

  it("cannot review when not logged in", () => {
    cy.get('span[data-cy="reviewform_login"]').should("be.visible");
  });
});
