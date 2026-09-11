// @ts-nocheck
describe('ER Triage End-to-End Orchestration', () => {
  it('successfully analyzes field transmissions and simulates a dispatch', () => {
    cy.visit('/');
    cy.get('textarea').type('Paramedic Unit 7: Mass casualty crash on Outer Ring Road, 3 patients critical.');
    cy.contains('INITIATE ORCHESTRATION').click();
    cy.contains('SYSTEM OUTPUT').should('be.visible');
    cy.contains('DISPATCH AUTOMATED ER EMAIL').should('be.visible');
  });
});
