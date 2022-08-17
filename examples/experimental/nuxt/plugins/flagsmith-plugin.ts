import {Plugin} from '@nuxt/types'
import flagsmith from 'flagsmith'
const plugin: Plugin = async ({beforeNuxtRender, app, nuxtState}, inject) => {
  if (process.server) {
    beforeNuxtRender(async ({nuxtState}) => {
      const nodeFetch = require('node-fetch').default
      await flagsmith.init({
        api: 'https://edge.bullet-train-staging.win/api/v1/',
        environmentID: 'AbXqsQqLLAzmfj5SGCm8Ng',
        fetch: nodeFetch,
        enableLogs: true,
      })
      nuxtState.flagsmith = flagsmith.getState()
    })
  }

  if (process.client) {
    if (nuxtState.flagsmith) {
      await flagsmith.init({
        api: 'https://edge.bullet-train-staging.win/api/v1/',
        environmentID: 'AbXqsQqLLAzmfj5SGCm8Ng',
        preventFetch: true,
        realtime: true,
        enableLogs: true,
      })

      flagsmith.setState(nuxtState.flagsmith)
    }
  }

  inject('flagsmith', flagsmith)
}

export default plugin
