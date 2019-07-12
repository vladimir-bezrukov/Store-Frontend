import { MutationTree } from 'vuex'
import * as types from './mutation-types'
import * as entities from '@vue-storefront/core/store/lib/entities'
import OrderState from '../types/OrderState'
import config from 'config'
import { Logger } from '@vue-storefront/core/lib/logger'
import EventBus from '@vue-storefront/core/compatibility/plugins/event-bus'
import { StorageManager } from '@vue-storefront/core/store/lib/storage-manager'

const mutations: MutationTree<OrderState> = {
  /**
   * Add order to sync. queue
   * @param {Object} product data format for products is described in /doc/ElasticSearch data formats.md
   */
  [types.ORDER_PLACE_ORDER] (state, order) {
    const ordersCollection = StorageManager.get('ordersCollection')
    const orderId = entities.uniqueEntityId(order) // timestamp as a order id is not the best we can do but it's enough
    order.order_id = orderId.toString()
    order.created_at = new Date()
    order.updated_at = new Date()

    ordersCollection.setItem(orderId.toString(), order, (err, resp) => {
      if (err) Logger.error(err, 'order')()
      if (!order.transmited) {
        EventBus.$emit('order/PROCESS_QUEUE', { config: config }) // process checkout queue
      }
      Logger.info('Order placed, orderId = ' + orderId, 'order')()
    }).catch((reason) => {
      Logger.error(reason, 'order') // it doesn't work on SSR
    }) // populate cache
  },
  [types.ORDER_LAST_ORDER_WITH_CONFIRMATION] (state, payload) {
    state.last_order_confirmation = payload
  },
  [types.ORDER_ADD_SESSION_ORDER_HASH] (state, hash: string) {
    state.session_order_hashes.push(hash)
  },
  [types.ORDER_REMOVE_SESSION_ORDER_HASH] (state, hash: string) {
    state.session_order_hashes = state.session_order_hashes.filter(sessionHash => sessionHash !== hash)
  }
}

export default mutations
