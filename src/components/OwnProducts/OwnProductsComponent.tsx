import {
  IonButton,
  IonCard,
  IonGrid,
  IonIcon,
  IonItem,
  IonLabel,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonThumbnail,
} from "@ionic/react";
import { getOwnProductsService } from "../service";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

import "./OwnProductsComponent.css";
import { chevronBack, chevronForwardOutline } from "ionicons/icons";

const OwnProductsComponent: React.FC<{
  handleImageError: (
    id: string,
    event: React.SyntheticEvent<HTMLImageElement, Event>
  ) => void;
}> = ({ handleImageError }) => {
  const [ownProducts, setOwnProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const authContext = useContext(AuthContext);

  const getOwnProducts = async (
    token: string,
    currentPage: number,
    itemsPerPage: number
  ) => {
    try {
      const { ownProducts, numProducts } = await getOwnProductsService({
        token,
        currentPage,
        itemsPerPage,
      });

      setTotalPages(Math.ceil(numProducts / itemsPerPage));

      setOwnProducts(ownProducts);
    } catch (err: any) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    if (!authContext) {
      return;
    }

    const { token } = authContext;

    getOwnProducts(token, currentPage, itemsPerPage);
  }, [authContext, itemsPerPage]);

  const handlePageChangeAdd = (addPage: number) => {
    setCurrentPage(addPage);

    if (!authContext) {
      return;
    }
    const { token } = authContext;

    getOwnProducts(token, addPage, itemsPerPage);
  };

  const handlePageChangeRest = (restPage: number) => {
    setCurrentPage(restPage);

    if (!authContext) {
      return;
    }
    const { token } = authContext;

    getOwnProducts(token, restPage, itemsPerPage);
  };

  return (
    <>
      {ownProducts.map((product: any) => (
        <IonCard key={product.A_CODIGO} className="card-product-list">
          <IonItem routerLink={`/products/${product.A_CODIGO}`}>
            <IonThumbnail slot="start" className="img-product-list">
              <img
                className="img-product-single"
                alt="foto-del-producto"
                src={`http://localhost:3000/fotos-productos/${product.A_CODIGO}.jpg`}
                onError={(event) => handleImageError(product.A_CODIGO, event)}
              />
            </IonThumbnail>
            <IonLabel text-wrap className="ion-text-start">
              <p className="title-product-list">{product.A_DESCRIP}</p>
              <p className="code-product-list">{product.A_CODIGO}</p>
              <p className="code-product-list">Marca: {product.MARCA}</p>
              <p className="code-product-list">Formato: {product.FORMATO}</p>
            </IonLabel>
          </IonItem>
        </IonCard>
      ))}
      <IonGrid>
        <IonRow className="ion-justify-content-center pagination">
          <IonButton
            className="button-page"
            disabled={currentPage === 1}
            onClick={() => handlePageChangeRest(currentPage - 1)}
          >
            <IonIcon icon={chevronBack} />
          </IonButton>
          <p className="current-page">
            {" "}
            {currentPage} de {totalPages}
          </p>
          <IonButton
            className="button-page"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChangeAdd(currentPage + 1)}
          >
            {" "}
            <IonIcon icon={chevronForwardOutline} />
          </IonButton>
        </IonRow>
        <IonRow className="ion-select">
          <IonSelect
            placeholder="Num de productos por pagina"
            onIonChange={(e) => setItemsPerPage(parseInt(e.detail.value))}
          >
            <IonSelectOption value="10">Ver 10 productos</IonSelectOption>
            <IonSelectOption value="20">Ver 20 productos</IonSelectOption>
            <IonSelectOption value="30">Ver 30 productos</IonSelectOption>
            <IonSelectOption value="40">Ver 40 productos</IonSelectOption>
          </IonSelect>
        </IonRow>
      </IonGrid>
    </>
  );
};

export default OwnProductsComponent;
