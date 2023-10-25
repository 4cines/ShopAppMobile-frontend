import { IonPage } from '@ionic/react';

import { useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import LoginPage from '../LoginPage/LogInPage';
import ProductsPage from '../ProductsPage/ProductsPage';
import HeaderComponent from '../../components/Header/HeaderComponent';
import { useHistory } from 'react-router';


const HomePage: React.FC = () => {

  const authContext = useContext(AuthContext);

  const history = useHistory();

  if(!authContext){
      return null;
  }

  const { token } = authContext;

  useEffect(() => {
    if (!authContext.token) {
      history.push('/login');
    }
  }, [token, history]);

  return (
    <IonPage>
      <HeaderComponent/>
       <ProductsPage />
    </IonPage>
  )
}

export default HomePage;
