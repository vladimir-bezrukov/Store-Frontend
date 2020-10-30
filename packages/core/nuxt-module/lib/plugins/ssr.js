
import { configureSSR } from '@vue-storefront/core'
import { ssrRef, getCurrentInstance, onServerPrefetch } from '@nuxtjs/composition-api';

const canRenderOnCSR = (vm) => {
  const { from } = vm.$router.app.context;
  const { current } = vm.$router.history

  if (!from) {
    return false
  }

  return from.fullPath !== current.fullPath
}

const ssrPlugin = () => {
  configureSSR({
    vsfRef: ssrRef,
    onSSR: (fn) => {
      onServerPrefetch(fn);
      if (typeof window !== 'undefined') {
        const vm = getCurrentInstance();

        if (canRenderOnCSR(vm)) {
          fn();
        }
      }
    }
  });
};

export default ssrPlugin;
