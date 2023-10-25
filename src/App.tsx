import { IonApp, IonRouterOutlet, IonSplitPane, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';


import Menu from './components/MenuComponent/Menu';
import HomePage from './pages/HomePage/HomePage';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

/* Pages */
import LoginPage from './pages/LoginPage/LogInPage';
import OnlyProductPage from './pages/OnlyProductPage/OnlyProductPage';
import ListsPage from './pages/ListsPage/ListsPage';
import OnlyListPage from './pages/OnlyListPage/OnlyListPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import OrderPage from './pages/OrdersPage/OrdersPage';
import OnlyOrderPage from './pages/OnlyOrderPage/OnlyOrderPage';
import OnlyProductFromList from './pages/OnlyProductFromListPage/OnlyProductFromList';
import CartPage from './pages/CartPage/CartPage';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

setupIonicReact();

const App: React.FC = () => {

  return (
    <IonApp>
      <IonReactRouter>
        <IonSplitPane contentId="main">
          <Menu />
          <IonRouterOutlet id="main">
              <Route path="/" exact={true} >
                <HomePage />
              </Route>
              <Route path="/cart" exact={true}>
                <CartPage />
              </Route>
              <Route path="/profile" exact={true}>
                <ProfilePage />
              </Route>
              <Route path="/orders" exact={true}>
                <OrderPage /> 
              </Route>
              <Route path="/orders/:idOrder" exact={true}>
                <OnlyOrderPage /> 
              </Route>
              <Route path="/products/:idProduct" exact={true}>
                <OnlyProductPage />
              </Route>
              <Route path="/lists" exact={true}>
                <ListsPage />
              </Route>
              <Route path="/lists/:idList" exact={true}>
                <OnlyListPage />
              </Route>
              <Route path="/extra/:idProduct" exact={true}>
                <OnlyProductFromList />
              </Route> 
              <Route path="/login" exact={true}>
                <LoginPage />
              </Route>
              {/* <Redirect to="/login" /> */}
          </IonRouterOutlet>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
