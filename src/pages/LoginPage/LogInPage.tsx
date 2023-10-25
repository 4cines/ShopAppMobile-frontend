import React, { useState, useRef, useEffect } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonInput,
  IonButton,
  IonButtons,
  IonMenuButton,
  IonLabel,
  IonItem,
  IonGrid,
  IonImg,
  IonRow,
} from "@ionic/react";

import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { loginUserService } from "../../components/service/index";

import { useHistory } from "react-router-dom";

import logomyapp from "../../../public/logo-my-app.png";

import "./LogInPage.css";

const LoginPage: React.FC = () => {
  let userRef = useRef<HTMLIonInputElement>(null);
  let passwordRef = useRef<HTMLIonInputElement>(null);
  const [error, setError] = useState<string>("");

  const [userLogin, setUserLogin] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const authContext = useContext(AuthContext);

  if (!authContext) {
    return null;
  }

  const { login, token } = authContext;

  const history = useHistory();

  const handleLogin = async () => {
    setError("");

    setUserLogin(userRef.current?.value as string);
    setPassword(passwordRef.current?.value as string);

    if (!userLogin || !password) {
      return;
    }

    try {
      const newToken = await loginUserService({ user: userLogin, password });

      login(newToken);

      history.push("/");
    } catch (err: any) {
      console.log(error);
      setError(err.message);
    }
  };

  useEffect(() => {
    setUserLogin("");
    setPassword("");
  }, [token]);

  return (
    <IonPage>
      <IonContent fullscreen={true} className="ion-padding">
        <IonGrid className="ion-padding">
          <section id="logoSection">
            <IonImg src={logomyapp} id="logoImg" />
          </section>

          <IonRow className="ion-justify-content-center">
            <IonItem>
              <IonInput
                type="text"
                ref={userRef}
                id="userInput"
                aria-label="Usuario"
                placeholder="Usuario"
                value={userLogin}
                required
              ></IonInput>
            </IonItem>
            <IonItem>
              <IonInput
                type="password"
                ref={passwordRef}
                id="passwordInput"
                aria-label="Contraseña"
                placeholder="Contraseña"
                value={password}
                required
              ></IonInput>
            </IonItem>
          </IonRow>
          <IonGrid className="button-login">
            <IonRow className="ion-justify-content-center ion-padding">
              <IonButton onClick={handleLogin}>Iniciar sesión</IonButton>
            </IonRow>
            {error && (
              <IonLabel color="danger" className="ion-padding">
                {error}
              </IonLabel>
            )}
          </IonGrid>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;
