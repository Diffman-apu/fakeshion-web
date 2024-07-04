import { userReducer } from "../reducers/user"; 
import { usersReducer } from "../reducers/users"; 

import { legacy_createStore as createStore, applyMiddleware, combineReducers, compose } from "redux";
import { thunk } from "redux-thunk";

const allReducers = combineReducers({
    userState: userReducer,
    usersState: usersReducer,

})


const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(allReducers, /* preloadedState, */ 
    composeEnhancers(
        applyMiddleware(thunk)
    )
)

// const store = createStore(allReducers, 
//     compose(
//         applyMiddleware(thunk),
//         // window.devToolsExtension ? window.devToolsExtension() : f => f,
//         window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()  
//     )
// )

console.log("store:", store)

export default store