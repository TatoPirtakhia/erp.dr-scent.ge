import { combineReducers } from 'redux'
import theme from './slices/themeSlice'
import auth from './slices/authSlice'
import systemInfo  from './slices/systemInfoSlice'

const rootReducer = (asyncReducers) => (state, action) => {
    const combinedReducer = combineReducers({
        theme,
        auth,
        systemInfo,
        ...asyncReducers,
    })
    return combinedReducer(state, action)
}
  
export default rootReducer
