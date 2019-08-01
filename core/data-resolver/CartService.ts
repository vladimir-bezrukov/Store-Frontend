import { DataResolver } from './types/DataResolver'
import Task from '@vue-storefront/core/lib/sync/types/Task'
import CartItem from '@vue-storefront/core/modules/cart/types/CartItem'
import { TaskQueue } from '@vue-storefront/core/lib/sync'
import { processLocalizedURLAddress } from '@vue-storefront/core/helpers'
import config from 'config';

const setServerShippingInfo = async (methodsData: any): Promise<Task> =>
  TaskQueue.execute({
    url: processLocalizedURLAddress(config.cart.shippinginfo_endpoint),
    payload: {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors',
      body: JSON.stringify({
        addressInformation: {
          shippingAddress: {
            countryId: methodsData.country
          },
          shippingCarrierCode: methodsData.carrier_code,
          shippingMethodCode: methodsData.method_code
        }
      })
    },
    silent: true
  });

const getTotals = async (): Promise<Task> =>
  TaskQueue.execute({
    url: processLocalizedURLAddress(config.cart.totals_endpoint),
    payload: {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors'
    },
    silent: true
  });

const connectCart = async (guestCart: boolean = false, forceClientState: boolean = false): Promise<Task> => {
  const url = processLocalizedURLAddress(guestCart
    ? config.cart.create_endpoint.replace('{{token}}', '')
    : config.cart.create_endpoint)

  return TaskQueue.execute({
    url,
    payload: {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors'
    },
    force_client_state: forceClientState,
    silent: true
  });
}

const updateCartItem = async (cartServerToken: string, cartItem: CartItem): Promise<Task> =>
  TaskQueue.execute({
    url: processLocalizedURLAddress(config.cart.updateitem_endpoint),
    payload: {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors',
      body: JSON.stringify({
        cartItem: {
          ...cartItem,
          quoteId: cartItem.quoteId || cartServerToken
        }
      })
    }
  });

const deleteItem = async (cartServerToken: string, cartItem: CartItem): Promise<Task> =>
  TaskQueue.execute({
    url: processLocalizedURLAddress(config.cart.deleteitem_endpoint),
    payload: {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors',
      body: JSON.stringify({
        cartItem: {
          ...cartItem,
          quoteId: cartServerToken
        }
      })
    },
    silent: true
  });

const getPaymentMethods = async (): Promise<Task> =>
  TaskQueue.execute({
    url: processLocalizedURLAddress(config.cart.paymentmethods_endpoint),
    payload: {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors'
    },
    silent: true
  });

const getShippingMethods = async (address: any): Promise<Task> =>
  TaskQueue.execute({
    url: processLocalizedURLAddress(config.cart.shippingmethods_endpoint),
    payload: {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors',
      body: JSON.stringify({
        address
      })
    },
    silent: true
  });

const pullCart = async (): Promise<Task> =>
  TaskQueue.execute({
    url: processLocalizedURLAddress(config.cart.pull_endpoint),
    payload: {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors'
    },
    silent: true
  });

const applyCoupon = async (couponCode: string): Promise<Task> => {
  const url = processLocalizedURLAddress(config.cart.applycoupon_endpoint.replace('{{coupon}}', couponCode))

  return TaskQueue.execute({
    url,
    payload: {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors'
    },
    silent: false
  });
}

const removeCoupon = async (): Promise<Task> =>
  TaskQueue.execute({
    url: processLocalizedURLAddress(config.cart.deletecoupon_endpoint),
    payload: {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors'
    },
    silent: false
  });

export const CartService: DataResolver.CartService = {
  setServerShippingInfo,
  getTotals,
  connectCart,
  updateCartItem,
  deleteItem,
  getPaymentMethods,
  getShippingMethods,
  pullCart,
  applyCoupon,
  removeCoupon
}
