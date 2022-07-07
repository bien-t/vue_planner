import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core'
import { DefaultApolloClient} from '@vue/apollo-composable'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons'
const httpLink = createHttpLink({
  uri: 'http://localhost:4000/api/graphql',
})

const cache = new InMemoryCache()

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache,
})

library.add(faTrash, faPen)

createApp(App).provide(DefaultApolloClient, apolloClient).component('font-awesome-icon', FontAwesomeIcon).mount('#app');