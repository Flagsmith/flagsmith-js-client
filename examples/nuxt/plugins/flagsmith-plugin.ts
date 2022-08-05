import {Plugin} from '@nuxt/types'
import flagsmith from 'flagsmith'
const plugin: Plugin = async ({beforeNuxtRender, app, nuxtState}, inject) => {
  if (process.server) {
    beforeNuxtRender(async ({nuxtState}) => {
      console.log("fetch is", fetch)
      const nodeFetch = require('node-fetch').default
      await flagsmith.init({
        environmentID: 'QjgYur4LQTwe5HpvbvhpzK',
        fetch: nodeFetch,
        enableLogs: true,
        api: 'https://api.flagsmith.com/api/v1/'
      })
      try {
        await flagsmith.getFlags()

      } catch(e) {
        console.log(e)
      }
      console.log(flagsmith.getState())
      nuxtState.flagsmith = flagsmith.getState()
    })
  }

  if (process.client) {
    console.log('hi')
    if (nuxtState.flagsmith) {
// @ts-expect-error
      flagsmith.setState(nuxtState.flagsmith)
    }
  }

  inject('flagsmith', flagsmith)
}

export default plugin
