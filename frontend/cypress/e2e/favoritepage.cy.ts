/// <reference types="cypress" />

describe("Favoritepage, can view favorites", () => {
  const user = {
    username: "cytest",
    email: "cytest@gmail.no",
    password: "123456",
  };

  beforeEach(() => {
    cy.visit("/");
    cy.login({ username: user.username, password: user.password });
  });

  it("can favorite a game and see it exist in favoritepage", () => {
    cy.visit("/games/1");
    cy.get('[data-cy="outline-heart-icon"]') // selects the outline heart (unliked)
      .first()
      .click();
    cy.get('[data-cy="filled-heart-icon"]').should("exist");
    cy.visit("/favorites");
    cy.get("[data-cy=result-card]", { timeout: 10000 }).should(
      "have.length",
      1,
    );
  });

  it("can remove favorite from favoritepage", () => {
    cy.visit("/favorites");
    cy.get("[data-cy=result-card]", { timeout: 10000 }).should(
      "have.length",
      1,
    );
    cy.get('[data-cy="result-card"]').first().click();
    cy.get('[data-cy="filled-heart-icon"]') // selects the filled heart (liked)
      .first()
      .click();
    cy.get("[data-cy=result-card]").should("have.length", 0);
  });
});
