import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonGrid, IonPage } from "@ionic/react";
import HeaderComponent from "../../components/Header/HeaderComponent";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

import { getUserDataService } from "../../components/service/index";
import { useHistory } from "react-router";

interface UserInfo {
  C_NUMERO: number;
  C_EMPRESA: string;
  C_GRUPO: number;
  C_DOMICIL: string;
  C_DOM_ENV: string;
  C_LOC_ENV: string;
  C_TARIFA: number;
  SLUNES: string | null;
  SMARTES: string | null;
  SMIERCOLES: string | null;
  SJUEVES: string | null;
  SVIERNES: string | null;
  PLUNES: string | null;
  PMARTES: string | null;
  PMIERCOLES: string | null;
  PJUEVES: string | null;
  PVIERNES: string | null;
  C_E_MAIL: string | null;
  C_TELEFONO: string | null;
  C_NIF: string | null;
}

const ProfilePage: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [sendServiceDays, setSendServiceDays] = useState<string[]>([]);
  const authContext = useContext(AuthContext);

  const history = useHistory();

  if (!authContext) {
    return null;
  }

  const { token, logout } = authContext;

  const getDataUser = async (token: string) => {
    try {
      const dataUser = await getUserDataService({ token });

      setUserInfo(dataUser);

      //add

      const userData = await getUserDataService({ token: authContext.token });

      // send info
      const userSendValues = Object.keys(userData).filter((clave) => {
        const value = userData[clave];
        return typeof value === "string" && value.toLowerCase() === "x" && clave.startsWith("S");
      });

      const daysOfWeekUserSendDaysArray = userSendValues.map((clave) => clave.slice(1));

      return daysOfWeekUserSendDaysArray;

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {

    const fetchData = async () => {
      try{
        const daysOfWeekUserSendDaysArray = await getDataUser(token);
        if(daysOfWeekUserSendDaysArray) {
          setSendServiceDays(daysOfWeekUserSendDaysArray);
        }

      } catch(err) {
        console.log(err);
      }
    }
    
    fetchData();


  }, [token]);

  const handleLogout = () => {
    logout();
    history.push("/login");
  };

  return (
    <IonPage>
      <HeaderComponent />
      <IonContent>
        <IonGrid className="ion-padding ion-text-center"></IonGrid>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle className="ion-text-center ion-margin-bottom " color={"primary"}>
              {userInfo?.C_EMPRESA}
            </IonCardTitle>
          </IonCardHeader>

          <IonCardContent className=""> 📍 {userInfo?.C_DOM_ENV}</IonCardContent>
          <IonCardContent className=""> 🧾 CIF: {userInfo?.C_NIF}</IonCardContent>
          <IonCardContent className=""> ✉ {userInfo?.C_E_MAIL}</IonCardContent>
          <IonCardContent className=""> 📞 {userInfo?.C_TELEFONO}</IonCardContent>

          {sendServiceDays.length > 0 ? (
            <IonCardContent>
              🚚 Día/s de servicio: {sendServiceDays.join(", ")}
            </IonCardContent>
          ) : (
            <IonCardContent>🚚 Día/s de servicio: de lunes a viernes</IonCardContent>
          )}

        </IonCard>

        <section className="buttons-modal">
          <IonButton className="ion-margin-top" onClick={handleLogout}>
            Cerrar sesión
          </IonButton>
        </section>
      </IonContent>
    </IonPage>
  );
};

export default ProfilePage;
