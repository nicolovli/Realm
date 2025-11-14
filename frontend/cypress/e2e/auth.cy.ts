/// <reference types="cypress" />

describe("Test register and login", () => {
  const user = {
    username: "cytest",
    email: "cytest@gmail.no",
    password: "123456",
  };

  beforeEach(() => {
    cy.visit("/");
  });

  it("can register user", () => {
    cy.register(user);
  });

  it("can login user", () => {
    cy.login({ username: user.username, password: user.password });
  });

  it("can logout user", () => {
    cy.login({ username: user.username, password: user.password });
    cy.visit("/profile");
    cy.get('button[aria-label="Log out"]', { timeout: 8000 }).click();
  });
});
