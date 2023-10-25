import {
  InputChangeEventDetail,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonModal,
  IonThumbnail,
  IonHeader,
} from "@ionic/react";
import { useContext, useEffect, useState } from "react";
import {
  getContentListService,
  updateQuatityProductInListService,
} from "../service";
import { AuthContext } from "../../context/AuthContext";
import photoDefault from "../../../public/logo-my-app.png";

import "./ModalModifyQuantityListComponent.css";

interface Props {
  modalModifyQuantity: boolean;
  setModalModifyQuantity: (popUpList: boolean) => void;
  idList: string;
  idProduct: string;
  listWithAllProducts: any;
  quantityProductToList: number;
  nameList: string;
  setQuantityProductToList: (quantity: number) => void;
}

interface ProductType {
  FORMATO: string;
  L_CODIGO: string;
  L_DESCVRIPCION: string;
  L_P_UNIT: string;
  MARCA: string;
  PESONETO: string;
  cantidad: number;
}

const ModalModifyQuantityListComponent: React.FC<Props> = ({
  modalModifyQuantity,
  setModalModifyQuantity,
  idList,
  idProduct,
  listWithAllProducts,
  quantityProductToList,
  nameList,
  setQuantityProductToList,
}) => {
  // const [newQuantity, setNewQuantity] = useState<number>(quantityProductToList);

  const authContext = useContext(AuthContext);

  if (!authContext) {
    return null;
  }

  const { token, setContentList } = authContext;
  const handleBlur = (event: any) => {
    const quantity = parseInt(event.target.value);
    setQuantityProductToList(quantity);
  };

  const handleModifyQuantity = async (res: any) => {
    try {
      if (quantityProductToList > 0) {
        await updateQuatityProductInListService({
          token,
          idList,
          idProduct,
          quantity: Number(quantityProductToList),
        });

        const updateContentList = await getContentListService({
          token,
          idList,
        });

        setContentList(updateContentList);

        setModalModifyQuantity(false);
      }
    } catch (err: any) {
      console.log(err.message);
    }
  };

  const handleIncrement = () => {
    setQuantityProductToList(quantityProductToList + 1);
  };

  const handleDecrement = () => {
    setQuantityProductToList(Math.max(quantityProductToList - 1, 1));
  };

  const handleImageError = (
    id: string,
    event: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    event.currentTarget.src = photoDefault;
  };
  const productDetail =
    listWithAllProducts &&
    listWithAllProducts.find(
      (product: ProductType) => product.L_CODIGO === idProduct
    );

  return (
    <IonModal isOpen={modalModifyQuantity}>
      <IonContent>
        <IonHeader className="ion-padding">
          <IonCardTitle
            className="ion-text-center lists-header"
            color={"primary"}
          >
            MIS LISTAS
          </IonCardTitle>
        </IonHeader>
        <IonCard className="ion-padding card-modal">
          <IonCardHeader>
            <IonCardTitle
              className="ion-text-center title-list margin-list-name"
              color="secondary"
            >
              {nameList}
            </IonCardTitle>
            <IonCardTitle
              className="ion-text-center size-text-title"
              color={"primary"}
            >
              Modificar cantidad
            </IonCardTitle>
          </IonCardHeader>
          {productDetail && (
            <IonCard key={productDetail.L_CODIGO} className="card-product-list">
              <IonItem>
                <IonThumbnail slot="start" className="img-product-list">
                  <img
                    className="img-product-single"
                    alt="foto-del-producto"
                    src={`http://localhost:3000/fotos-productos/${productDetail.L_CODIGO}.jpg`}
                    onError={(event) =>
                      handleImageError(productDetail.L_CODIGO, event)
                    }
                  />
                </IonThumbnail>
                <IonLabel text-wrap className="ion-text-start">
                  <p className="title-product-list">
                    {productDetail.L_DESCVRIPCION}
                  </p>
                  <p className="code-product-list">
                    Código: {productDetail.L_CODIGO}
                  </p>
                  <p className="code-product-list">
                    Marca: {productDetail.MARCA}{" "}
                  </p>
                  <p className="code-product-list">
                    FORMATO:{productDetail.FORMATO}
                  </p>
                  <p className="code-product-list">
                    Precio:{" "}
                    {productDetail.L_P_UNIT.toString().replace(".", ",")} €
                  </p>
                </IonLabel>
              </IonItem>
            </IonCard>
          )}
          <IonCardContent>
            <section className="add-rest-buttons-section">
              <IonButton
                size="small"
                color="secondary"
                onClick={handleDecrement}
              >
                {" "}
                -
              </IonButton>
              <IonInput
                className="quantity-input"
                type="number"
                placeholder="Cantidad"
                value={quantityProductToList}
                min="1"
                onBlur={(e) => handleBlur(e)}
              ></IonInput>
              <IonButton
                size="small"
                color="secondary"
                onClick={handleIncrement}
              >
                +
              </IonButton>
            </section>
            <section className="buttons-modal">
              <IonButton
                color="danger"
                onClick={() => {
                  setModalModifyQuantity(false);
                }}
              >
                Cancelar
              </IonButton>
              <IonButton onClick={handleModifyQuantity}>Aceptar</IonButton>
            </section>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonModal>
  );
};

export default ModalModifyQuantityListComponent;
