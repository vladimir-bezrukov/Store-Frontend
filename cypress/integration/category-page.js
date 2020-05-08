/* eslint no-undef: 0 */
describe('Category page', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('[data-cy=app-header-url_women]').click();
    cy.location('pathname').should('include', 'women');
  });
  it('verification of filters in the Women category', () => {
    cy.get('div.sidebar.desktop-only');
    cy.wrap(['Clothing', 'Shoes', 'Bags', 'Looks']).its(0).should('eq', 'Clothing');
    cy.get('.products__grid').children()
      .should('have.length', '2')
      .then((value) => {
        cy.get('.navbar__counter').should('contain', value.length);
        cy.get(':nth-child(2) > .sf-accordion-item__header').click().first().should('have.attr', 'aria-pressed', 'true');
        cy.get('.sf-accordion-item__content > .sf-list').children().should('have.length', '10');
        cy.get('[data-cy=category-icon_list-view]').click().should('have.attr', 'aria-pressed', 'true');
        cy.get('[data-cy=category-btn_filters]').click();
        cy.get('[style="--color-background:#000000;"]').click().should('have.attr', 'aria-pressed', 'true');
        cy.get('[data-cy=category-filter_color_black]').click();
        cy.get('[data-cy=category-btn_done]').click();
        cy.get('[data-cy=category-btn_filters]').click();
        cy.get('[data-cy=category-btn_clear-all]').click();
        cy.get('.filters__colors').children().should('have.attr', 'aria-pressed', 'false');
        cy.get('[aria-label="Close sidebar"]').click();
        cy.get('.sf-sidebar__aside').should('not.exist');
      });
  });
  it('switching between categories', () => {
    cy.get('[data-cy=app-header-url_men]').click();
    cy.location('pathname').should('include', 'men');
    cy.get('.products__grid').children()
      .should('have.length', '4')
      .then((value) => {
        cy.get('.navbar__counter').should('contain', value.length);
      });
    cy.get('[data-cy=app-header-url_kids]').click();
    cy.location('pathname').should('include', 'kids');

  });
});
