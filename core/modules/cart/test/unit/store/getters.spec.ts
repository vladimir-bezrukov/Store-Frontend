import cartGetters from '../../../store/getters';

jest.mock('@vue-storefront/i18n', () => ({ t: jest.fn(str => str) }));

describe('Cart getters', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('totals returns platform total segments if they has been saved in store', () => {
    const stateMock = {
      platformTotalSegments: [
        {'code': 'subtotal', 'title': 'Subtotal', 'value': 39.36},
        {'code': 'shipping', 'title': 'Shipping & Handling (Flat Rate - Fixed)', 'value': 5},
        {'code': 'discount', 'title': 'Discount', 'value': -4.8},
        {'code': 'tax', 'title': 'Tax', 'value': 6.26, 'area': 'taxes',
          'extension_attributes': {
            'tax_grandtotal_details': [{
              'amount': 6.26,
              'rates': [{'percent': '23', 'title': 'VAT23-PL'}],
              'group_id': 1
            }]
          }},
        {'code': 'grand_total', 'title': 'Grand Total', 'value': 38.46, 'area': 'footer'}
      ]
    };
    const wrapper = (getters: any) => getters.totals(stateMock);

    expect(wrapper(cartGetters)).toEqual(stateMock.platformTotalSegments);
  });

  it(`totals returns totals without shipping and payment prices having neither platformTotalSegments 
  nor additional prices`, () => {
    const stateMock = {
      cartItems: [
        {qty: 1, priceInclTax: 1},
        {qty: 2, priceInclTax: 2}
      ]
    };
    const wrapper = (getters: any) => getters.totals(stateMock);

    expect(wrapper(cartGetters)).toEqual([
      {"code": "subtotalInclTax", "title": "Subtotal incl. tax", "value": 5},
      {"code": "grand_total", "title": "Grand total", "value": 5}
    ]);
  });

  it(`totals returns totals including shipping and payment prices having these prices in store 
  but no platformTotalSegments`, () => {
    const stateMock = {
      cartItems: [
        {qty: 1, priceInclTax: 1},
        {qty: 2, priceInclTax: 2}
      ],
      payment: {
        title: 'payment',
        costInclTax: 4,
      },
      shipping: {
        method_title: 'shipping',
        price_incl_tax: 8,
      }
    };
    const wrapper = (getters: any) => getters.totals(stateMock);

    expect(wrapper(cartGetters)).toEqual([
      {"code": "subtotalInclTax", "title": "Subtotal incl. tax", "value": 5},
      {"code": "grand_total", "title": "Grand total", "value": 21},
      {"code": "payment", "title": "payment", "value": 4},
      {"code": "shipping", "title": "shipping", "value": 8}
    ]);
  });

  it(`totals returns totals including first shipping and first payment prices having multiple prices in store 
  but no platformTotalSegments`, () => {
    const stateMock = {
      cartItems: [
        {qty: 1, priceInclTax: 1},
        {qty: 2, priceInclTax: 2}
      ],
      payment: [
        {
          title: 'payment',
          costInclTax: 4,
        },
        {
          title: 'another-payment',
          costInclTax: 16,
        }
      ],
      shipping: [
        {
          method_title: 'shipping',
          price_incl_tax: 8,
        },
        {
          method_title: 'another-shipping',
          price_incl_tax: 32,
        }
      ]
    };
    const wrapper = (getters: any) => getters.totals(stateMock);

    expect(wrapper(cartGetters)).toEqual([
      {"code": "subtotalInclTax", "title": "Subtotal incl. tax", "value": 5},
      {"code": "grand_total", "title": "Grand total", "value": 21},
      {"code": "payment", "title": "payment", "value": 4},
      {"code": "shipping", "title": "shipping", "value": 8}
    ]);
  });

  it('totalQuantity returns total quantity of all products in cart', () => {
    const stateMock = {
      cartItems: [
        {qty: 1},
        {qty: 2}
      ]
    };
    const wrapper = (getters: any) => getters.totalQuantity(stateMock);

    expect(wrapper(cartGetters)).toBe(3);
  });

  it('coupon returns coupon information when coupon has been applied to the cart', () => {
    const stateMock = {
      platformTotals: {
        coupon_code: 'foo',
        discount_amount: 1.23
      }
    };
    const wrapper = (getters: any) => getters.coupon(stateMock);

    expect(wrapper(cartGetters)).toEqual({
      code: stateMock.platformTotals.coupon_code,
      discount: stateMock.platformTotals.discount_amount
    });
  });

  it('coupon returns false given no coupons applied to the cart', () => {
    const stateMock = {};
    const wrapper = (getters: any) => getters.coupon(stateMock);

    expect(wrapper(cartGetters)).toBe(false);
  });

  it('isVirtualCart returns true given only virtual items in cart', () => {
    const stateMock = {
      cartItems: [
        {type_id: 'virtual'},
        {type_id: 'downloadable'}
      ]
    };
    const wrapper = (getters: any) => getters.isVirtualCart(stateMock);

    expect(wrapper(cartGetters)).toBe(true);
  });

  it('isVirtualCart returns false given any non virtual items in cart', () => {
    const stateMock = {
      cartItems: [
        {type_id: 'virtual'},
        {type_id: 'definitely-not-virtual'}
      ]
    };
    const wrapper = (getters: any) => getters.isVirtualCart(stateMock);

    expect(wrapper(cartGetters)).toBe(false);
  });
});
