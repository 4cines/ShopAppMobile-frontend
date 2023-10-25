import {
  IonButtons,
  IonHeader,
  IonImg,
  IonMenuButton,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

import photoDefault from "../../../public/logo-my-app.png";

import "./HeaderComponent.css";

const HeaderComponent: React.FC = () => {
  return (
    <IonHeader id="ion-header">
      <IonToolbar>
        <IonButtons slot="start">
          <IonMenuButton />
        </IonButtons>
        <section className="img-header">
          <IonImg className="logo" src={photoDefault} alt="logo-my-app" />
        </section>
      </IonToolbar>
    </IonHeader>
  );
};

export default HeaderComponent;
