import {Plugin} from '@nuxt/types'
import flagsmith from 'flagsmith'
const plugin: Plugin = async ({beforeNuxtRender, app, nuxtState}, inject) => {
  if (process.server) {
    beforeNuxtRender(async ({nuxtState}) => {
      const nodeFetch = require('node-fetch').default
      await flagsmith.init({
        environmentID: 'QjgYur4LQTwe5HpvbvhpzK',
        fetch: nodeFetch,
        enableLogs: true,
        api: 'https://api.flagsmith.com/api/v1/'
      })
      nuxtState.flagsmith = flagsmith.getState()
    })
  }

  if (process.client) {
    if (nuxtState.flagsmith) {
// @ts-expect-error
      flagsmith.setState(nuxtState.flagsmith)
    }
  }

  inject('flagsmith', flagsmith)
}

export default plugin
