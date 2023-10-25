import {
  InputChangeEventDetail,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonModal,
  IonThumbnail,
  IonTitle,
} from "@ionic/react";
import { useContext, useEffect, useState } from "react";
import {
  getCartProductsService,
  updateQuatityProductInCartService,
} from "../service";
import { AuthContext } from "../../context/AuthContext";
import photoDefault from "../../../public/logo-my-app.png";

import "./ModalModifyQuantityCartComponent.css";
import { cartOutline } from "ionicons/icons";

interface Props {
  modalModifyQuantity: boolean;
  setModalModifyQuantity: (popUpList: boolean) => void;
  idProduct: string;
  quantityCart: number;
  setQuantityCart: (quantity: number) => void;
  listWithAllProducts: any;
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
const ModalModifyQuantityCartComponent: React.FC<Props> = ({
  modalModifyQuantity,
  setModalModifyQuantity,
  idProduct,
  quantityCart,
  setQuantityCart,
  listWithAllProducts,
}) => {
  // const [newQuantity, setNewQuantity] = useState<number>(quantityCart);

  const authContext = useContext(AuthContext);

  if (!authContext) {
    return null;
  }

  const { token, setProductsCart, productsCart } = authContext;

  // const handleQuantityChange = (event: CustomEvent<InputChangeEventDetail>) => {
  //     const quantity = parseInt(event.detail.value as string);

  //     setNewQuantity(quantity);
  // };

  const handleBlur = (event: any) => {
    const quantity = parseInt(event.target.value);
    setQuantityCart(quantity);
  };

  const handleIncrement = () => {
    setQuantityCart(quantityCart + 1);
  };

  const handleDecrement = () => {
    setQuantityCart(Math.max(quantityCart - 1, 1));
  };

  const handleModifyQuantity = async () => {
    try {
      if (quantityCart > 0) {
        await updateQuatityProductInCartService({
          token,
          idProduct,
          quantity: Number(quantityCart),
        });

        const updateContentList = await getCartProductsService({ token });

        setProductsCart(updateContentList);

        setModalModifyQuantity(false);
      }
    } catch (err: any) {
      console.log(err.message);
    }
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
      <IonContent className="content-modal">
        <IonHeader className="ion-padding header-cart-quantity">
          <IonIcon icon={cartOutline} color="primary" size="large" />
          <IonTitle color="primary">Carrito</IonTitle>
        </IonHeader>
        <IonCard className="ion-padding card-modal">
          <IonCardHeader>
            <IonCardTitle className="ion-text-center" color={"primary"}>
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
              <IonButton color="secondary" onClick={handleDecrement}>
                -
              </IonButton>
              <IonInput
                className="quantity-input"
                type="number"
                placeholder="Cantidad"
                min="1"
                value={quantityCart}
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
            <section className="buttons-modal ion-padding">
              <IonButton
                color="danger"
                onClick={() => setModalModifyQuantity(false)}
              >
                Cancelar
              </IonButton>
              <IonButton onClick={handleModifyQuantity}>Aceptar</IonButton>
            </section>
            <section className="increment-decrement-buttons"></section>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonModal>
  );
};

export default ModalModifyQuantityCartComponent;
