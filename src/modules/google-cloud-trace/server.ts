import { serverHooks } from '@vue-storefront/core/server/hooks'

serverHooks.tracing((config) => {
  let trace = require('@google-cloud/trace-agent')
  if (config.has('trace') && config.get('trace.enabled')) {
    trace.start(config.get('trace.config'))
  }
})
