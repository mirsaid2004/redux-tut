import { store } from './app/store'
import { Provider } from 'react-redux'
import Counter from './Counter'

function Index() {
  return (
    <Provider store={store}>
      <Counter />
    </Provider>
  )
}

export default Index