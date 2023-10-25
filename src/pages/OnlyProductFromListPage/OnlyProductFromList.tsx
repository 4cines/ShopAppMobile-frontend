import {
  IonAlert,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonCol,
  IonContent,
  IonFab,
  IonFabButton,
  IonFabList,
  IonGrid,
  IonHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonRow,
} from "@ionic/react";
import { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import {
  getListsDataService,
  getProductDetailsService,
} from "../../components/service";
import { IonSpinner } from "@ionic/react";
import { AuthContext } from "../../context/AuthContext";

import photoDefault from "../../../public/logo-my-app.png";

import ALTRAMUCES from "../../../public/alergenos/altramuz-alergenos-alimentarios-icono.png";
import APIO from "../../../public/alergenos/apio-alergenos-alimentarios-icono.png";
import CACAHUETES from "../../../public/alergenos/cacahuetes-alergenos-alimentarios-icono.png";
import CRUSTACEOS from "../../../public/alergenos/crustaceos-alergenos-alimentarios-icono.png";
import FRUTOSCASCARA from "../../../public/alergenos/frutos-secos-alergenos-alimentarios-icono.png";
import TRIGO from "../../../public/alergenos/gluten-alergenos-alimentarios-icono-100x100.png";
import HUEVOS from "../../../public/alergenos/huevos-alergenos-alimentarios-icono.png";
import LECHE from "../../../public/alergenos/lacteos-alergenos-alimentarios-icono.png";
import MOLUSCOS from "../../../public/alergenos/moluscos-alergenos-alimentarios-icono-100x100.png";
import MOSTAZA from "../../../public/alergenos/mostaza-alergenos-alimentarios-icono.png";
import PESCADO from "../../../public/alergenos/pescado-alergenos-alimentarios-icono.png";
import SESAMO from "../../../public/alergenos/sesamo-alergenos-alimentarios-icono-100x100.png";
import SOJA from "../../../public/alergenos/soja-alergenos-alimentarios-icono.png";
import SULFITOS from "../../../public/alergenos/sulfitos-alergenos-alimentarios-icono.png";

import HeaderComponent from "../../components/Header/HeaderComponent";
import {
  addOutline,
  appsOutline,
  arrowBackOutline,
  cartOutline,
  heartOutline,
} from "ionicons/icons";
import ModalAddToList from "../../components/ModalAddToList/ModalAddToList";
import ModalAddToCartComponent from "../../components/ModalAddToCart/ModalAddToCartComponent";

interface Alergenos {
  [key: string]: string | null;
}

interface AlergenosImagenes {
  [key: string]: string;
}

interface Lists {
  id: number;
  Nombre: string;
  C_CLIENTE: number;
}

const OnlyProductPage: React.FC = () => {
  const { idProduct } = useParams<{ idProduct: string }>();

  const [productDetails, setProductDetails] = useState<any>({});
  const [price, setPrice] = useState(0);
  const [lists, setLists] = useState<Lists[]>([]);
  const [popUpList, setPopUpList] = useState(false);
  const [popUpCart, setPopUpCart] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [ftpFileExist, setFtpFileExist] = useState(false);
  const [alergenos, setAlergenos] = useState<Alergenos>();

  const alergenosImg: AlergenosImagenes = {
    ALTRAMUCES: ALTRAMUCES,
    APIO: APIO,
    CACAHUETES: CACAHUETES,
    CRUSTACEOS: CRUSTACEOS,
    FRUTOSCASCARA: FRUTOSCASCARA,
    TRIGO: TRIGO,
    HUEVOS: HUEVOS,
    LECHE: LECHE,
    MOLUSCOS: MOLUSCOS,
    MOSTAZA: MOSTAZA,
    PESCADO: PESCADO,
    SESAMO: SESAMO,
    SOJA: SOJA,
    SULFITOS: SULFITOS,
  };

  const [trazas, setTrazas] = useState<string[]>([]);
  const [contiene, setContiene] = useState<string[]>([]);

  const history = useHistory();

  const authContext = useContext(AuthContext);

  if (!authContext) {
    return null;
  }

  const { token } = authContext;

  const alergenosWithIcons = (alergenosArray: string[]) => {
    const newArray = alergenosArray.filter(
      (elemento) =>
        elemento !== "CENTENO" &&
        elemento !== "CEBADA" &&
        elemento !== "AVENA" &&
        elemento !== "ESPELTA" &&
        elemento !== "KAMUT" &&
        elemento !== "HIBRIDOS"
    );
    return newArray.map((alergeno) => (
      <IonCol size="3" key={alergeno}>
        <IonImg className="alergenos-icon" src={alergenosImg[alergeno]} />
      </IonCol>
    ));
  };

  const productDetailsData = async (token: string, idProduct: string) => {
    setFtpFileExist(false);

    try {
      const json = await getProductDetailsService({ token, idProduct });

      const { data: productDetails, alergenosData } = json;

      const alergenosWhithoutArray = alergenosData[0];

      if (alergenosData.length > 0) {
        setAlergenos(alergenosWhithoutArray);

        const trazasArray = Object.keys(alergenosWhithoutArray).filter(
          (clave) => {
            const valor = alergenosWhithoutArray[clave];
            return valor === "*";
          }
        );

        setTrazas(trazasArray);

        const contieneArray = Object.keys(alergenosWhithoutArray).filter(
          (clave) => {
            const valor = alergenosWhithoutArray[clave];
            return valor?.toLowerCase() === "x";
          }
        );

        setContiene(contieneArray);
      }

      if (json.ftpFile) {
        setFtpFileExist(true);
      }

      if (productDetails.A_P_VENTA3) {
        setPrice(productDetails.A_P_VENTA3);
      }

      if (productDetails.A_P_VENTA2) {
        setPrice(productDetails.A_P_VENTA2);
      }

      if (productDetails.A_P_VENTA1) {
        setPrice(productDetails.A_P_VENTA1);
      }

      setProductDetails(productDetails);

      setTimeout(() => {
        setLoading(false);
      }, 1000);
    } catch (err: any) {
      console.log(err.message);
      setError(err.message);
    }
  };

  const getLists = async (token: string) => {
    try {
      const allLists = await getListsDataService({ token });

      setLists(allLists);
    } catch (err: any) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    setLoading(true);

    productDetailsData(token, idProduct);

    getLists(token);
  }, [authContext, idProduct]);

  const handleImageError = (
    id: string,
    event: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    event.currentTarget.src = photoDefault;
  };

  const beforeModal = () => {
    if (lists.length === 0) {
      setError("No hay listas");
      console.log(error);
    }

    setPopUpList(true);
  };

  //
  async function downloadAndOpenPDF() {
    window.open(
      `http://localhost:3000/uploads/${productDetails.A_CODIGO}.pdf`,
      "_blank"
    );
  }
  return (
    <IonPage className="product-page">
      <HeaderComponent />
      {loading ? (
        <IonContent className="loading">
          <div className="spinner-container">
            <IonSpinner name="dots" className="spinner" />
            <p className="p-spinner">¡Cargando producto!</p>
          </div>
        </IonContent>
      ) : (
        <>
          <IonContent>
            <IonCard className="product-card">
              <IonFab>
                <IonFabButton
                  onClick={() => window.history.back()}
                  size="small"
                >
                  <IonIcon icon={arrowBackOutline}></IonIcon>
                </IonFabButton>
              </IonFab>
              <section id="img-product">
                <img
                  className="img-product-single"
                  alt="foto-del-producto"
                  src={`http:/localhost:3000/fotos-productos/${productDetails.A_CODIGO}.jpg`}
                  onError={(event) =>
                    handleImageError(productDetails.A_CODIGO, event)
                  }
                />
              </section>
              <IonHeader>
                <IonCardContent>
                  <IonCardTitle className="ion-text-center">
                    {productDetails.A_DESCRIP}
                  </IonCardTitle>
                </IonCardContent>
                <IonCardContent>
                  <IonItem className="product-details">
                    Codigo del producto: {productDetails.A_CODIGO}
                  </IonItem>
                  <IonItem className="product-details">
                    Marca: {productDetails.MARCA}
                  </IonItem>
                  <IonItem className="product-details">
                    Formato: {productDetails.FORMATO}
                  </IonItem>
                  <IonItem className="product-details">
                    {" "}
                    Precio unitario: {price.toString().replace(".", ",")} €
                  </IonItem>
                </IonCardContent>
                {alergenos && (trazas.length > 0 || contiene.length > 0) && (
                  <IonCardContent className="ion-padding content-alergenos">
                    {contiene && contiene.length > 0 && (
                      <IonGrid>
                        <IonRow>
                          <IonCol>
                            Contiene
                            <IonRow>{alergenosWithIcons(contiene)}</IonRow>
                          </IonCol>
                        </IonRow>
                      </IonGrid>
                    )}
                    {trazas && trazas.length > 0 && (
                      <IonGrid>
                        <IonRow>
                          <IonCol>
                            Trazas
                            <IonRow>{alergenosWithIcons(trazas)}</IonRow>
                          </IonCol>
                        </IonRow>
                      </IonGrid>
                    )}
                  </IonCardContent>
                )}

                {ftpFileExist && (
                  <div className="ion-button-pdf">
                    <IonButton onClick={downloadAndOpenPDF} color="secondary">
                      👁 ficha técnica
                    </IonButton>
                  </div>
                )}
              </IonHeader>
            </IonCard>

            <ModalAddToList
              popUpList={popUpList}
              setPopUpList={setPopUpList}
              lists={lists}
              idProduct={idProduct}
              productDetails={productDetails}
              price={price}
            />

            <ModalAddToCartComponent
              popUpCart={popUpCart}
              setPopUpCart={setPopUpCart}
              idProduct={idProduct}
              productDetails={productDetails}
              price={price}
            />
          </IonContent>
        </>
      )}

      {error === "Falta la cabecera de autenticación" ? null : (
        <IonAlert
          isOpen={!!error}
          onDidDismiss={() => {
            setError("");
            setPopUpList(false);
          }}
          message={error}
          buttons={["OK"]}
        ></IonAlert>
      )}
    </IonPage>
  );
};

export default OnlyProductPage;
