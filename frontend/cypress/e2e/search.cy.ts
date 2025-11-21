describe("Search", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get("[data-cy=search-form]").should("exist");
  });

  it('displays suggestions when typing "minecraft"', () => {
    cy.get("[data-cy=search-form]").first().type("minecraft");

    cy.wait(500);

    cy.get("[role=list]").should("be.visible");

    cy.get("[role=list]").should("have.length.greaterThan", 0);
    cy.get("[role=list]")
      .first()
      .contains(/minecraft/i);
  });

  it("navigates to a game detail page when clicking a suggestion", () => {
    cy.get("[data-cy=search-form]").first().type("minecraft");
    cy.wait(500);

    cy.get("[role=list]").first().click();

    cy.url().should("match", /\/games\/\d+$/);
  });

  // when just typing in minecraft and hitting enter, it should go to the search results page with 3 games
  it('searches "minecraft" and shows 3 results', () => {
    cy.get("[data-cy=search-form]").first().type("minecraft{enter}");

    cy.url().should("include", "search=minecraft");

    cy.get("[data-cy=result-card]", { timeout: 10000 }).should(
      "have.length",
      3,
    );
  });
});
