import { createStore } from 'redux'

// actions

const increment = () => {
  return {
    type: 'INCREMENT',
  }
}

const decrement = () => {
  return {
    type: 'DECREMENT',
  }
}

// state

let count = 0

// reducer (returns the updated state)

const counter = (count, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return count + 1
      break
    case 'DECREMENT':
      return count - 1
      break
  }
}

// create the store using the reducer
let store = createStore(counter)

// display the output in the console
store.subscribe(() => console.log(store.getState))

// dispatch
store.dispatch(increment())
store.dispatch(decrement())
