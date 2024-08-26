import React , {useState} from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter  } from 'react-router-dom'
import { ThemeSwitcherProvider } from 'react-css-theme-switcher';
import store from './store';
import history from './history'
import Layouts from './layouts'
import { THEME_CONFIG } from './configs/AppConfig';
import './lang'
import CheckUser from './checkUser';

const themes = {
  dark: `${window.location.origin}/css/dark-theme.css`,
  light: `${window.location.origin}/css/light-theme.css`,
};


function App() {
  const [isLoading, setIsLoading] = useState(true)
  if (isLoading)
    return (
      <Provider store={store} >
        <CheckUser isLoading={isLoading} setIsLoading={setIsLoading} />
      </Provider>
    )

  return (
    <div className="App">
      <Provider store={store}>
        <BrowserRouter history={history}>
          <ThemeSwitcherProvider 
            themeMap={themes} 
            defaultTheme={THEME_CONFIG.currentTheme} 
            insertionPoint="styles-insertion-point"
          >
            <Layouts />
          </ThemeSwitcherProvider>
        </BrowserRouter>  
      </Provider>
    </div>
  );
}

export default App;
