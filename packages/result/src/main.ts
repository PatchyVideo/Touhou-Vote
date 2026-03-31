import { createApp } from 'vue'
import NProgress from 'nprogress'
import App from './App.vue'
import { router } from './router'

import 'nprogress/css/nprogress.css'
import '@unocss/reset/tailwind.css'
import '@/styles/global.postcss'
import 'uno.css'

NProgress.start()

// create graphql client
const client = createApollo()
// vue app
const app = createApp(
  defineComponent({
    render: () => [h(App)],
    setup() {
      provideClient(client)
    },
  })
)

app.use(router)
app.mount('#app')

NProgress.done()
