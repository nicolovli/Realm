/// <reference types="cypress" />

describe("ResultPage: pagination, filters, and sorting", () => {
  beforeEach(() => {
    cy.viewport(1400, 900);
    cy.visit("/games?sort=popularity&order=desc");
  });

  it("displays games from the real backend", () => {
    cy.get("[data-cy=results-grid] li", { timeout: 10000 }).should(
      "have.length.at.least",
      1,
    );

    cy.get("[data-cy=results-grid] li").then(($items) => {
      expect($items.length).to.be.lte(12);
    });
  });

  it("paginates correctly", () => {
    cy.get("[aria-label='Next page']").click();

    cy.get("[data-cy=results-grid] li").should("exist");

    cy.get("[aria-label='Previous page']").click();
    cy.get("[data-cy=results-grid] li").should("exist");
  });

  it("applies cute and agriculture tags filters and shows 11 results", () => {
    cy.get("[data-cy=filter-pill-Tags]").click();
    cy.get("[data-cy=filter-pill-menu-Tags]").should("be.visible");
    cy.get("[data-cy=filter-option-Tags-Cute]").click();
    cy.get("[data-cy=filter-option-Tags-Agriculture]").click();

    // esc to close the scrolldowndown menu
    cy.get("body").type("{esc}", { force: true });
    cy.get("body").click(0, 0, { force: true });
    cy.get("body", { timeout: 5000 }).should(
      "have.css",
      "pointer-events",
      "auto",
    );

    cy.get("[data-cy=results-count]").should("contain.text", "11 matches");
  });

  it("shows all 11 filtered results on a single page when Cute + Agriculture are selected", () => {
    cy.get("[data-cy=filter-pill-Tags]").click();
    cy.get("[data-cy=filter-pill-menu-Tags]").should("be.visible");
    cy.get("[data-cy=filter-option-Tags-Cute]").click();
    cy.get("[data-cy=filter-option-Tags-Agriculture]").click();

    // close dropdown
    cy.get("body").type("{esc}", { force: true });
    cy.get("body").click(0, 0, { force: true });
    cy.get("body", { timeout: 5000 }).should(
      "have.css",
      "pointer-events",
      "auto",
    );

    cy.get("[data-cy=results-count]").should("contain.text", "11 matches");

    cy.get("[data-cy=results-grid] li").should("have.length", 11);

    cy.get("[aria-label='Next page']").should("be.disabled");
  });

  it("sorts A → Z with 'Farm Frenzy: Hurricane Season' first", () => {
    cy.get("[data-cy=filter-pill-Tags]").click();
    cy.get("[data-cy=filter-pill-menu-Tags]").should("be.visible");
    cy.get("[data-cy=filter-option-Tags-Cute]").click();
    cy.get("[data-cy=filter-option-Tags-Agriculture]").click();

    // esc to close the scrolldowndown menu
    cy.get("body").type("{esc}", { force: true });
    cy.get("body").click(0, 0, { force: true });
    cy.get("body", { timeout: 5000 }).should(
      "have.css",
      "pointer-events",
      "auto",
    );

    cy.get("[data-cy=sort-dropdown-trigger]")
      .filter(":visible")
      .first()
      .click();

    cy.get("[data-cy=sort-option-alphabetical-asc]")
      .filter(":visible")
      .first()
      .click();

    cy.get("[data-cy=results-grid] li")
      .first()
      .invoke("text")
      .should("contain", "Farm Frenzy: Hurricane Season");
  });

  it("sorts Z → A with 'Yonder: The Cloud Catcher Chronicles' first", () => {
    cy.get("[data-cy=filter-pill-Tags]").click();
    cy.get("[data-cy=filter-pill-menu-Tags]").should("be.visible");
    cy.get("[data-cy=filter-option-Tags-Cute]").click();
    cy.get("[data-cy=filter-option-Tags-Agriculture]").click();

    // esc to close the scrolldowndown menu
    cy.get("body").type("{esc}", { force: true });
    cy.get("body").click(0, 0, { force: true });
    cy.get("body", { timeout: 5000 }).should(
      "have.css",
      "pointer-events",
      "auto",
    );
    cy.get("[data-cy=sort-dropdown-trigger]")
      .filter(":visible")
      .first()
      .click();

    cy.get("[data-cy=sort-option-alphabetical-desc]")
      .filter(":visible")
      .first()
      .click();

    cy.get("[data-cy=results-grid] li")
      .first()
      .invoke("text")
      .should("contain", "Yonder: The Cloud Catcher Chronicles");
  });
});
