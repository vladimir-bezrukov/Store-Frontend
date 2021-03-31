import Base from './base';
import { el } from './utils/element';

class Product extends Base {
  get addToCartBtn(): Cypress.Chainable {
    return el('product_add-to-cart');
  }
}

export default new Product();
