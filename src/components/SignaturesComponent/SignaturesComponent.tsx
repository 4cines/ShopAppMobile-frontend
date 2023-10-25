//not works for security reasons

import {
  IonBackButton,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonSpinner,
} from "@ionic/react";
import {
  arrowBackOutline,
  backspaceSharp,
  closeCircleOutline,
} from "ionicons/icons";

import "./SignatureComponent.css";
import { getSignatureService } from "../service";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

interface Props {
  setShowSignature: any;
  n: number;
}

interface Signature {
  Enviado_email: string;
  alb_gesco: number;
  fecha_firma: string;
  firma: string;
  quienfirma: string;
}

const SignaturesComponent: React.FC<Props> = ({ setShowSignature, n }) => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    return null;
  }

  const { token } = authContext;

  const [fechaFormateada, setFechaFormateada] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);
  const [signatureInfo, setSignatureInfo] = useState<Signature>();

  const getSignatureData = async (n: number, token: string) => {
    const signatureData = await getSignatureService({ n, token });
    return signatureData;
  };

  useEffect(() => {
    console.log("cucu");
    const fetchData = async () => {
      try {
        setLoading(true);
        const [signatureData] = await getSignatureData(n, token);
        const fecha = new Date(signatureData.fecha_firma);

        const dia = fecha.getUTCDate().toString().padStart(2, "0");
        const mes = (fecha.getUTCMonth() + 1).toString().padStart(2, "0");
        const anio = fecha.getUTCFullYear();
        const hora = fecha.getUTCHours().toString().padStart(2, "0");
        const minutos = fecha.getUTCMinutes().toString().padStart(2, "0");

        const fechaFormateada = `${dia}/${mes}/${anio}, ${hora}:${minutos}`;
        setFechaFormateada(fechaFormateada);
        setSignatureInfo(signatureData);
      } catch (err: any) {
        console.log(err.message);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    };
    fetchData();
  }, [n]);

  console.log(signatureInfo);

  return (
    <IonContent>
      <IonCard className="ion-card-signatures">
        {loading ? (
          <div className="spinner-container">
            <IonSpinner name="dots" className="spinner" />
            <p className="p-spinner">¡Cargando firma!</p>
          </div>
        ) : (
          signatureInfo && (
            <IonCardContent>
              <IonItem>
                <strong>Fecha firma: </strong>
                {fechaFormateada}h
              </IonItem>
              <IonItem>
                <strong>Enviado por mail:</strong> {signatureInfo.Enviado_email}
              </IonItem>
              <IonImg
                alt="firma"
                src={`https://localhost:3000/uploads/signatures/${signatureInfo.firma}`}
                id="signature"
                onLoad={() => setLoading(false)}
              />
              <IonItem>
                <strong>Albarán firmado por: </strong>{" "}
                {signatureInfo.quienfirma}{" "}
              </IonItem>
              <section id="section-button-signature">
                <IonButton
                  onClick={() => setShowSignature(false)}
                  size="small"
                  color={"danger"}
                >
                  Volver al albarán
                </IonButton>
              </section>
            </IonCardContent>
          )
        )}
      </IonCard>
    </IonContent>
  );
};

export default SignaturesComponent;
