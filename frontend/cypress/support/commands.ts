/// <reference types="cypress" />

Cypress.Commands.add(
  "login",
  (user: { username: string; password: string }) => {
    // Open the login popup
    cy.get('button[aria-label="login"]').click();

    // Fill the login form
    cy.get('input[name="username"]').type(user.username);
    cy.get('input[name="password"]').type(user.password);

    // Submit the form
    cy.get("form").contains("Login").click();

    // Optionally, check that login succeeded, e.g., navbar shows username
    cy.contains(user.username).should("exist");
  },
);

Cypress.Commands.add(
  "register",
  (user: { username: string; email: string; password: string }) => {
    // Open login/register popup
    cy.get('button[aria-label="login"]').click();

    // Switch to register tab
    cy.contains("Create your portal").click();

    // Wait for the username input to exist and be visible
    cy.get('input[name="username"]', { timeout: 8000 })
      .should("exist")
      .should("be.visible")
      .type(user.username);

    cy.get('input[name="email"]').should("be.visible").type(user.email);
    cy.get('input[name="password"]').first().type(user.password);
    cy.get('input[name="passwordConfirmation"]').type(user.password); // confirm password

    cy.get("form").contains("Register").click();

    cy.get("body").then(($body) => {
      if ($body.find(".sonner-toast").length) {
        cy.get(".sonner-toast")
          .invoke("text")
          .then((text) => {
            expect(text).to.satisfy(
              (text: string) =>
                text.includes("Welcome to Realm, player ${user.username}") ||
                text.includes(
                  "Oops! Both username and email are already claimed by another player.",
                ) ||
                text.includes(
                  "Something went wrong while forging your account. Give it another shot!",
                ),
            );
          });
      }
    });
  },
);
