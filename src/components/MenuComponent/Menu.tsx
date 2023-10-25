import React, { useContext, useEffect } from "react";
import {
  IonButton,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonGrid,
  useIonAlert,
  IonFooter,
  IonImg,
} from "@ionic/react";
import {
  busOutline,
  busSharp,
  cartOutline,
  cartSharp,
  personCircleOutline,
  personCircleSharp,
  restaurantOutline,
  restaurantSharp,
  logOutOutline,
  logOutSharp,
  heartOutline,
  heartSharp,
  receiptOutline,
  receiptSharp,
} from "ionicons/icons";
import { useHistory, useLocation, Redirect } from "react-router-dom";
import "./Menu.css";

import { AuthContext } from "../../context/AuthContext";

import logoVM from "../../../public/logo-my-app.png";

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

const appPages: AppPage[] = [
  {
    title: "Productos",
    url: "/",
    iosIcon: restaurantOutline,
    mdIcon: restaurantSharp,
  },
  {
    title: "Mis Listas",
    url: "/lists",
    iosIcon: heartOutline,
    mdIcon: heartSharp,
  },
  {
    title: "Pedidos",
    url: "/orders",
    iosIcon: receiptOutline,
    mdIcon: receiptSharp,
  },
  {
    title: "Carrito",
    url: "/cart",
    iosIcon: cartOutline,
    mdIcon: cartSharp,
  },
  {
    title: "Perfil",
    url: "/profile",
    iosIcon: personCircleOutline,
    mdIcon: personCircleSharp,
  },
];

const Menu: React.FC = () => {
  const location = useLocation();
  const authContext = useContext(AuthContext);

  if (!authContext) {
    return null;
  }

  const { user } = authContext;

  const [presentAlert] = useIonAlert();
  const history = useHistory();

  const closeMenu = () => {
    const menu = document.querySelector("ion-menu");
    menu && menu.close();
  };

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList id="inbox-list">
          <IonListHeader className="ion-margin " id="title-menu">
            {user && user.C_EMPRESA}
          </IonListHeader>
          <section className="ionSection">
            {appPages.map((appPage, index) => (
              <IonMenuToggle key={index} autoHide={false} onClick={closeMenu}>
                <IonItem
                  className={
                    location.pathname === appPage.url ? "selected" : ""
                  }
                  routerLink={!authContext.token ? "/login" : appPage.url}
                  routerDirection="none"
                  lines="none"
                  detail={false}
                >
                  <IonIcon
                    aria-hidden="true"
                    slot="start"
                    ios={appPage.iosIcon}
                    md={appPage.mdIcon}
                  />
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            ))}
          </section>
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
