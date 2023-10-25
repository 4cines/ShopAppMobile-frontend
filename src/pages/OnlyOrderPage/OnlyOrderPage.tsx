import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonPage,
  IonThumbnail,
  IonTitle,
} from "@ionic/react";
import HeaderComponent from "../../components/Header/HeaderComponent";

import photoDefault from "../../../public/logo-my-app.png";
import { useContext, useEffect, useState } from "react";
import {
  getOrderDetailsService,
  getSignatureService,
} from "../../components/service";
import { AuthContext } from "../../context/AuthContext";
import { useHistory, useParams } from "react-router";
import { arrowBackOutline, receiptOutline } from "ionicons/icons";

import "./OnlyOrderPage.css";

import SignaturesComponent from "../../components/SignaturesComponent/SignaturesComponent";

interface ContentOrder {
  id: number;
  L_CANTIDAD: number;
  L_P_UNIT: number;
  L_DESVRIPCION: string;
  L_CODIGO: string;
  f_servicio: string;
  alb_gesco: number;
  h_pedido: string;
  L_CAJAS: number;
  n: number;
}

interface Signature {
  Enviado_email: string;
  alb_gesco: number;
  fecha_firma: string;
  firma: string;
  quienfirma: string;
}

const OnlyOrderPage: React.FC = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    return null;
  }

  const history = useHistory();

  const [error, setError] = useState("");
  const [order, setOrder] = useState<ContentOrder[]>([]);
  const [showSignature, setShowSignature] = useState(false);
  const [signatureInfo, setSignatureInfo] = useState<Signature>();

  const { idOrder } = useParams<{ idOrder: string }>();
  //idOrder = n

  const getOrderDetailsData = async (token: string, idOrder: string) => {
    try {
      setError("");

      const orderDetailsData = await getOrderDetailsService({ token, idOrder });

      return orderDetailsData;
    } catch (err: any) {
      setError(err.message);
      console.log(err.message);
    }
  };

  const getSignatureData = async (idOrder: string, token: string) => {
    const n = parseInt(idOrder);
    const signatureData = await getSignatureService({ n, token });
    setSignatureInfo(signatureData);
  };

  useEffect(() => {
    setError("");

    const detailsOrder = async () => {
      try {
        const { token } = authContext;

        const orderDetailsData = await getOrderDetailsData(
          token,
          idOrder as string
        );

        setOrder(orderDetailsData);
      } catch (err: any) {
        setError(err.message);
        console.log(err.message);
      }
    };

    detailsOrder();

    const fetchData = async () => {
      try {
        await getSignatureData(idOrder, authContext.token);
      } catch (err: any) {
        console.log(err.message);
      }
    };

    fetchData();
  }, [authContext, idOrder]);

  const handleImageError = (
    id: string,
    event: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    event.currentTarget.src = photoDefault;
  };

  return (
    <>
      <IonPage>
        <HeaderComponent />
        <IonContent>
          <IonCard>
            <IonFab>
              <IonFabButton
                onClick={() => {
                  history.push("/orders");
                  setShowSignature(false);
                }}
                size="small"
              >
                <IonIcon icon={arrowBackOutline}></IonIcon>
              </IonFabButton>
            </IonFab>
            <IonHeader className="ion-padding">
              <IonCardTitle
                className="ion-text-center lists-header"
                color={"primary"}
              >
                ALBARÁN
              </IonCardTitle>
            </IonHeader>

            {/* <IonCardContent className="card-list-unique">
                    <IonCardTitle className="ion-text-center" color={"primary"}>Albarán número:</IonCardTitle>
                    <IonCardSubtitle id="subtitle-card-order" color={"secondary"}> {order?.length > 0 && order[0]?.alb_gesco ? order[0]?.alb_gesco : 'Pendiente'} 
                  </IonCardSubtitle>
                </IonCardContent> */}
          </IonCard>

          {error && <p> {error} </p>}
          {showSignature ? (
            <SignaturesComponent
              setShowSignature={setShowSignature}
              n={order[0].n}
            />
          ) : (
            <IonCard id="card-only-order">
              <section id="button-signature">
                <IonButton
                  onClick={() => setShowSignature(true)}
                  disabled={
                    order?.length > 0 && order[0]?.alb_gesco && signatureInfo
                      ? false
                      : true
                  }
                  color={"white"}
                  fill="outline"
                >
                  <IonIcon icon={receiptOutline} color="primary" />
                </IonButton>
              </section>
              <IonCardContent>
                <IonCardTitle
                  className="ion-text-center title-list ion-padding"
                  color="secondary"
                >
                  {" "}
                  {order?.length > 0 && order[0]?.alb_gesco
                    ? order[0]?.alb_gesco
                    : "(pendiente)"}{" "}
                </IonCardTitle>
                {/* <IonCardTitle className="ion-text-center" >{item.alb_gesco ? item.alb_gesco : 'Pendiente'}</IonCardTitle> */}
                {order && order.length > 0 ? (
                  order.map((item: ContentOrder) => (
                    <IonCard className="card-product-list" key={item.id}>
                      <IonItem className="ion-margin-bottom">
                        <IonThumbnail slot="start" className="img-product-list">
                          <img
                            className="img-product-single"
                            alt="foto-del-producto"
                            src={`http://loclahost:3000/fotos-productos/${item.L_CODIGO}.jpg`}
                            onError={(event) =>
                              handleImageError(item.L_CODIGO, event)
                            }
                          />
                        </IonThumbnail>
                        <IonLabel text-wrap className="ion-text-start ">
                          <p className="title-product-list">
                            {item.L_DESVRIPCION}
                          </p>
                          <p className="code-product-list">
                            Codigo: {item.L_CODIGO}
                          </p>
                          <p className="code-product-list">
                            Precio unitario: {item.L_P_UNIT} €
                          </p>
                          <p className="code-product-list">
                            Cantidad: {item.L_CANTIDAD}
                          </p>
                          <p className="code-product-list">
                            Nº Cajas: {item.L_CAJAS}
                          </p>
                        </IonLabel>
                      </IonItem>
                    </IonCard>
                  ))
                ) : (
                  <IonItem className="ion-text-center ion-margin-bottom">
                    No hay productos en la lista
                  </IonItem>
                )}
              </IonCardContent>
            </IonCard>
          )}
        </IonContent>
      </IonPage>
    </>
  );
};

export default OnlyOrderPage;
