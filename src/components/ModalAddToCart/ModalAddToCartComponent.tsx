import {
  InputChangeEventDetail,
  IonAlert,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonInput,
  IonItem,
  IonLabel,
  IonModal,
  IonThumbnail,
} from "@ionic/react";
import { useContext, useState } from "react";
import { addProductToCartService, getCartProductsService } from "../service";
import { AuthContext } from "../../context/AuthContext";
import photoDefault from "../../../public/logo-my-app.png";

interface Props {
  popUpCart: boolean;
  setPopUpCart: (popUpCart: boolean) => void;
  idProduct: string;
  productDetails: any;
  price: number;
}

const ModalAddToCartComponent: React.FC<Props> = ({
  popUpCart,
  setPopUpCart,
  idProduct,
  productDetails,
  price,
}) => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    return null;
  }

  const { token, setProductsCart } = authContext;

  const [itemQuantities, setItemQuantities] = useState<{
    [itemId: string]: number;
  }>({});
  const [error, setError] = useState("");

  const handleQuantityChangeCart = (
    event: CustomEvent<InputChangeEventDetail>
  ) => {
    const quantity = parseInt(event.detail.value as string);

    setItemQuantities((prevQuantities) => ({
      ...prevQuantities,
      cantidad: quantity,
    }));
  };

  const handleAddProductsToCart = async () => {
    try {
      const objectToAdd = [];

      for (let key in itemQuantities) {
        const nothing = key;
        const cantidad = itemQuantities[key];

        const object = { nothing, itemQuantity: cantidad };

        objectToAdd.push(object);

        for (let i = 0; i < objectToAdd.length; i++) {
          await addProductToCartService({
            token,
            idProduct,
            quantity: itemQuantities.cantidad,
          });
        }

        const updateProductsCart = await getCartProductsService({ token });

        setItemQuantities({});

        setProductsCart(updateProductsCart);

        setPopUpCart(false);

        // await addProductToCartService({token, idProduct: idProduct, quantity: quantityCart});

        // const updateProductsCart = await getCartProductsService({token});

        // setProductsCart(updateProductsCart);

        // setPopUpCart(false);

        // setQuantityCart(0);
      }
    } catch (err: any) {
      setItemQuantities({});
      console.log(err.message);
      setError(err.message);
    }
  };

  const handleImageError = (
    id: string,
    event: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    event.currentTarget.src = photoDefault;
  };

  return (
    <>
      <IonModal isOpen={popUpCart}>
        <IonCard className="ion-padding">
          <IonCardHeader>
            <IonCardTitle className="ion-text-center" color={"primary"}>
              Añadir al carrito
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonInput
              type="number"
              placeholder="Cantidad"
              onIonChange={(e) => handleQuantityChangeCart(e)}
            />
            <section className="buttons-modal">
              <IonButton
                color="danger"
                onClick={() => {
                  setPopUpCart(false);
                }}
              >
                Cancelar
              </IonButton>
              <IonButton onClick={() => handleAddProductsToCart()}>
                Aceptar
              </IonButton>
            </section>
          </IonCardContent>
        </IonCard>
        <IonCard key={productDetails.A_CODIGO} className="card-product-list">
          <IonItem>
            <IonThumbnail slot="start" className="img-product-list">
              <img
                className="img-product-single"
                alt="foto-del-producto"
                src={`https://localhost:3000/fotos-productos/${productDetails.A_CODIGO}.jpg`}
                onError={(event) =>
                  handleImageError(productDetails.A_CODIGO, event)
                }
              />
            </IonThumbnail>
            <IonLabel text-wrap className="ion-text-start">
              <p className="title-product-list">{productDetails.A_DESCRIP}</p>
              <p className="code-product-list">{productDetails.A_CODIGO}</p>
              <p className="code-product-list">
                {productDetails.MARCA} - {productDetails.FORMATO}
              </p>
              <p className="code-product-list">
                Precio unitario: {price.toString().replace(".", ",")} €
              </p>
            </IonLabel>
          </IonItem>
        </IonCard>
      </IonModal>
      <IonAlert
        isOpen={!!error}
        onDidDismiss={() => {
          setError("");
          setPopUpCart(false);
        }}
        message={error}
        buttons={["OK"]}
      />
    </>
  );
};

export default ModalAddToCartComponent;
