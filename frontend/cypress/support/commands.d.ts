/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    login(user: { username: string; password: string }): Chainable<void>;
    register(user: {
      username: string;
      email: string;
      password: string;
    }): Chainable<void>;
  }
}
