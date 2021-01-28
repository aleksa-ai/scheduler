describe('Appointments', () => {
  beforeEach(() => {
    //Reset database before each test
    cy.request('GET', '/api/debug/reset');
    //Visit root of  web server & confirm that DOM contains text "Monday"
    cy.visit('/');
    cy.contains('Monday');
  });

  //Test Interview Booking
  it('should book an interview', () => {
    //Test click on "Add" button in second appointment
    cy.get('[alt=Add]').first().click();
    //Test name input
    cy.get('[data-testid=student-name-input]').type('Lydia Miller-Jones');
    //Test interviewer selection
    cy.get('[alt="Sylvia Palmer"]').click();
    //Test clicks of save button
    cy.contains('Save').click();
    //Test the Show component displaying  student & interview names
    cy.contains('.appointment__card--show', 'Lydia Miller-Jones');
    cy.contains('.appointment__card--show', 'Sylvia Palmer');
  });

  //Test Interview Editing (similar to previous except...)
  it('should edit an interview', () => {
    // Click arguments to force action & disable "waiting for actionability"...
    cy.get('[alt=Edit]').first().click({ force: true });
    //...can clear  input field before typing in it.
    cy.get('[data-testid=student-name-input]').clear().type('Jane Austen');
    cy.get('[alt="Tori Malcolm"]').click();
    cy.contains('Save').click();
    cy.contains('.appointment__card--show', 'Jane Austen');
    cy.contains('.appointment__card--show', 'Tori Malcolm');
  });

  //Test Interview Cancelation 
  it.only('should cancel an interview', () => {
    //Clicks the delete button for the existing appointment
    cy.get('[alt=Delete]').click({ force: true });
    //Clicks the confirm button
    cy.contains('Confirm').click();
    //Check that the "Deleting" indicator should exist
    cy.contains('Deleting').should('exist');
    //Check that the "Deleting" indicator should not exist
    cy.contains('Deleting').should('not.exist');
    //... ".appointment__card--show" element containing "Archie Cohen" does not exist
    cy.contains('.appointment__card--show', 'Archie Cohen').should('not.exist');
  });
});