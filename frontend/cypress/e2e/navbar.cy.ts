/// <reference types="cypress" />

describe("Navbar: check interaction and responsiveness for mobile and desktop", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  context("Desktop resolution", () => {
    beforeEach(() => {
      cy.viewport(1280, 800);
    });

    it("Shows the logo and navigation links", () => {
      cy.get("header").should("be.visible");
      cy.get('a[aria-label="Homepage"]').should("exist");
      cy.contains("Favorites").should("exist");
      cy.contains("Discover").should("exist");
    });

    it("Navigates to Favorites when clicked", () => {
      cy.contains("Favorites").click();
      cy.url().should("include", "/favorites");
    });

    it("Navigates to Discover when clicked", () => {
      cy.contains("Discover").click();
      cy.url().should("include", "/games?sort=popularity");
    });

    it("Click darkmode", () => {
      cy.get('button[aria-label="Switch to dark theme"]').click();
      cy.get("html").should("have.class", "dark");
      cy.window().then((win) => {
        expect(win.localStorage.getItem("theme")).to.eq("dark");
      });
      cy.get('button[aria-label="Switch to light theme"]').should("exist");
    });

    it("Click lightmode", () => {
      cy.get('button[aria-label="Switch to dark theme"]').click();
      cy.get('button[aria-label="Switch to light theme"]').click();
      cy.get("html").should("not.have.class", "dark");
      cy.window().then((win) => {
        expect(win.localStorage.getItem("theme")).to.eq("light");
      });
      cy.get('button[aria-label="Switch to dark theme"]').should("exist");
    });
  });

  context("Mobile resolution", () => {
    beforeEach(() => {
      cy.viewport("iphone-6");
    });

    it("Shows mobile menu icon and hides desktop nav", () => {
      cy.get("nav[aria-label='Main Navigation']").should("not.be.visible");
      cy.get('button[aria-label="Open mobile menu"]').should("exist");
    });

    it("Opens mobile sheet menu when clicking menu button", () => {
      cy.get('button[aria-label="Open mobile menu"]').click();
      cy.get('[role="dialog"]').should("be.visible");
      cy.contains("Favorites").should("exist");
      cy.contains("Discover").should("exist");
    });

    it("Navigates to Favorites page when menu item clicked", () => {
      cy.get('button[aria-label="Open mobile menu"]').click();
      cy.get('[role="dialog"]').contains("Favorites").click();
      cy.url().should("include", "/favorites");
      cy.get('[role="dialog"]').should("not.exist");
    });

    it("toggles dark mode in mobile menu", () => {
      cy.get('button[aria-label="Open mobile menu"]').click();
      cy.get('[role="dialog"]').should("be.visible");
      cy.get('[role="dialog"]').within(() => {
        cy.get('button[aria-label="Switch to dark theme"]').click();
        cy.get('button[aria-label="Switch to light theme"]').should("exist");
      });

      cy.get("html").should("have.class", "dark");

      cy.window().then((win) => {
        expect(win.localStorage.getItem("theme")).to.eq("dark");
      });

      cy.get('[role="dialog"]').within(() => {
        cy.get('button[aria-label="Switch to light theme"]').click();
        cy.get('button[aria-label="Switch to dark theme"]').should("exist");
      });

      cy.get("html").should("not.have.class", "dark");
      cy.window().then((win) => {
        expect(win.localStorage.getItem("theme")).to.eq("light");
      });
    });
  });
});
