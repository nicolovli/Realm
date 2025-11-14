describe("Search", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get("[data-cy=search-input]").should("exist");
  });

  it('displays suggestions when typing "minecraft"', () => {
    cy.get("[data-cy=search-input]").first().type("minecraft");

    cy.wait(500);

    cy.get("[role=listbox]").should("be.visible");

    cy.get("[role=option]").should("have.length.greaterThan", 0);
    cy.get("[role=option]")
      .first()
      .contains(/minecraft/i);
  });

  it("navigates to a game detail page when clicking a suggestion", () => {
    cy.get("[data-cy=search-input]").first().type("minecraft");
    cy.wait(500);

    cy.get("[role=option]").first().click();

    cy.url().should("match", /\/games\/\d+$/);
  });

  // when just typing in minecraft and hitting enter, it should go to the search results page with 3 games
  it('searches "minecraft" and shows 3 results', () => {
    cy.get("[data-cy=search-input]").first().type("minecraft{enter}");

    cy.url().should("include", "search=minecraft");

    cy.get("[data-cy=result-card]", { timeout: 10000 }).should(
      "have.length",
      3,
    );
  });
});
