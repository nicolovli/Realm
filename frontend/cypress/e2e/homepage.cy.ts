/// <reference types="cypress" />

describe("HomePage", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should render all main components", () => {
    cy.get("header").should("exist");
    cy.get("footer").should("exist");
    cy.get('[aria-label="breadcrumb"]').should("exist");
    cy.get('section[aria-label="Promotional games carousel"]').should(
      "be.visible",
    );
    cy.get('section[aria-label="Featured games"]').should("be.visible");
  });

  it("should handle loading states", () => {
    cy.get('[data-cy="loading-skeleton"]').should("exist");
  });

  it("promo section should display games", () => {
    cy.get(
      'section[aria-label="Promotional games carousel"] [data-cy="promo-card"]',
    ).should("have.length.greaterThan", 0);
  });

  it("featured section should display games", () => {
    cy.wait(2000);
    cy.get(
      '[data-cy="featured-carousel"] [data-cy="featured-game-card"]',
    ).should("have.length.greaterThan", 0);
  });

  it("should navigate through promo carousel using arrows", () => {
    cy.wait(2000);

    cy.get('[data-cy="promo-carousel"]').within(() => {
      cy.get('[data-cy="promo-next"]').click();
      cy.get('[data-cy="promo-card"]').should("be.visible");
      cy.get('[data-cy="promo-prev"]').click();
      cy.get('[data-cy="promo-card"]').should("be.visible");
    });
  });

  it("should navigate through promo carousel using dots", () => {
    cy.wait(2000);

    cy.get('[data-cy="promo-carousel"]').within(() => {
      cy.get('nav[aria-label="Carousel navigation"] button[role="tab"]').each(
        ($btn) => {
          cy.wrap($btn).click();
          cy.get('[data-cy="promo-card"]').should("be.visible");
        },
      );
    });
  });

  it("should navigate through featured carousel using arrows", () => {
    cy.wait(2000);

    cy.get('[data-cy="featured-carousel"]').within(() => {
      cy.get('[data-cy="featured-next"]').then(($btn) => {
        if ($btn.is(":visible")) {
          cy.wrap($btn).click();
          cy.get('[data-cy="featured-game-card"]').should(
            "have.length.greaterThan",
            0,
          );
        }
      });

      cy.get('[data-cy="featured-prev"]').then(($btn) => {
        if ($btn.is(":visible")) {
          cy.wrap($btn).click();
          cy.get('[data-cy="featured-game-card"]').should(
            "have.length.greaterThan",
            0,
          );
        }
      });
    });
  });

  it("should navigate to game detail page when clicking promo card", () => {
    cy.wait(2000);
    cy.get('[data-cy="promo-card"]')
      .first()
      .within(() => {
        cy.contains("Read more").click();
      });
    cy.url().should("include", "/games/");
  });

  it("should navigate to game detail page when clicking featured card", () => {
    cy.wait(2000);
    cy.get('[data-cy="featured-game-card"]').first().click();
    cy.url().should("include", "/games/");
  });
});
