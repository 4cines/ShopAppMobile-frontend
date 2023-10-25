import {
  InputChangeEventDetail,
  IonAlert,
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonThumbnail,
} from "@ionic/react";
import HeaderComponent from "../../components/Header/HeaderComponent";
import { IonDatetime } from "@ionic/react";
import { cartOutline, createOutline } from "ionicons/icons";

import "./CartPage.css";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
  deleteAllProductFromCartService,
  deleteProductFromCartService,
  getCartProductsService,
  getUserDataService,
  updateQuatityProductInCartService,
} from "../../components/service";

import photoDefault from "../../../public/logo-my-app.png";
import CalendarComponent from "../../components/CalendarComponent/CalendarComponent";
import ModalModifyQuantityCartComponent from "../../components/ModalModifyQuantityCart/ModalModifyQuantityCartComponent";

const CartPage: React.FC = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    return;
  }
  const { token, productsCart, setProductsCart } = authContext;

  const [error, setError] = useState("");
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [idProduct, setIdProduct] = useState("");
  const [quantityCart, setQuantityCart] = useState(1);
  const [showCalendar, setShowCalendar] = useState(false);
  const [modalModifyQuantity, setModalModifyQuantity] = useState(false);
  const [openModalDeleteProduct, setOpenModalDeleteProduct] = useState(false);
  const [openModalDeleteAllProducts, setOpenModalDeleteAllProducts] =
    useState(false);

  //data Service
  const getProductsToCart = async () => {
    try {
      const productsCart = await getCartProductsService({ token });

      setProductsCart(productsCart);
    } catch (err: any) {
      console.log(err.message);
      setError(err.message);
    }
  };

  //modify quantity
  const changeQuantity = (event: CustomEvent<InputChangeEventDetail>) => {
    const quantity = parseInt(event.detail.value as string);
    setQuantityCart(quantity);

    console.log(quantity);
  };

  //data Service modify quantity
  const handleQuantityChangeCart = async (idProduct: string) => {
    await updateQuatityProductInCartService({
      token: authContext.token,
      idProduct,
      quantity: quantityCart,
    });

    getProductsToCart();
  };

  // data info cart
  useEffect(() => {
    getProductsToCart();
  }, []);

  // calculate total price
  useEffect(() => {
    const total = productsCart.reduce(
      (accumulator: number, product: any) =>
        accumulator + product.L_P_UNIT * product.cantidad,
      0
    );

    setTotalPrice(+total.toFixed(2));
  }, [productsCart]);

  const deleteOneProduct = async () => {
    try {
      await deleteProductFromCartService({
        token: authContext.token,
        idProduct,
      });

      getProductsToCart();
    } catch (err: any) {
      console.log(err.message);
      setError(err.message);
    }
  };

  const deleteAllProducts = async () => {
    try {
      await deleteAllProductFromCartService({ token: authContext.token });
      setProductsCart([]);
      setOpenModalDeleteAllProducts(false);
    } catch (err: any) {
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
    <IonPage>
      <HeaderComponent />
      <IonContent>
        <IonCard>
          <IonCardContent>
            <div className="cart-header">
              <IonIcon icon={cartOutline} color="primary" />
              <p className="total-price">Total: {totalPrice} €</p>
            </div>
            {!showCalendar && (
              <section className="cart-buttons">
                <IonButton
                  color="danger"
                  size="small"
                  onClick={() => setOpenModalDeleteAllProducts(true)}
                  disabled={productsCart.length === 0}
                >
                  Vaciar carrito
                </IonButton>
                <IonButton
                  color="primary"
                  onClick={() => setShowCalendar(true)}
                  disabled={productsCart.length === 0}
                >
                  Realizar pedido
                </IonButton>
              </section>
            )}
            {productsCart.length === 0 ? (
              <p className="empty-cart">No hay productos en el carrito</p>
            ) : showCalendar ? (
              <CalendarComponent
                setShowCalendar={setShowCalendar}
                showCalendar={showCalendar}
                deleteAllProducts={deleteAllProducts}
              />
            ) : (
              productsCart.map((product: any) => (
                <IonCard key={product.L_CODIGO} className="card-product-cart">
                  <IonItem>
                    <IonThumbnail slot="start" className="img-product-list">
                      <img
                        className="img-product-single"
                        alt="foto-del-producto"
                        src={`http://localhost:3000/fotos-productos/${product.L_CODIGO}.jpg`}
                        onError={(event) =>
                          handleImageError(product.L_CODIGO, event)
                        }
                      />
                    </IonThumbnail>
                    <IonLabel text-wrap className="ion-text-start">
                      <p className="product-name-cart">
                        {product.L_DESCVRIPCION}
                      </p>
                      <p className="product-details-cart">{product.L_CODIGO}</p>
                      <p className="product-details-cart">
                        {product.MARCA} - {product.FORMATO}
                      </p>
                      <p className="product-details-cart">
                        {" "}
                        {product.L_P_UNIT} €/ud
                      </p>

                      <p className="product-details-cart">
                        {" "}
                        Cantidad: {product.cantidad} ud/s{" "}
                      </p>
                    </IonLabel>
                  </IonItem>
                  <p className="product-subtotal-cart">
                    TOTAL: {(product.L_P_UNIT * product.cantidad).toFixed(2)} €
                  </p>
                  <section className="cart-buttons">
                    <IonButton
                      className="bottons-size"
                      fill="outline"
                      size="small"
                      color={"danger"}
                      onClick={() => {
                        setOpenModalDeleteProduct(true);
                        setIdProduct(product.L_CODIGO);
                      }}
                    >
                      Eliminar
                    </IonButton>
                    <IonButton
                      className="bottons-size"
                      fill="solid"
                      size="small"
                      onClick={() => {
                        setModalModifyQuantity(true);
                        setIdProduct(product.L_CODIGO);
                        setQuantityCart(product.cantidad);
                      }}
                    >
                      Modificar cantidad
                    </IonButton>
                  </section>
                </IonCard>
              ))
            )}
          </IonCardContent>
        </IonCard>
        <ModalModifyQuantityCartComponent
          modalModifyQuantity={modalModifyQuantity}
          setModalModifyQuantity={setModalModifyQuantity}
          idProduct={idProduct}
          quantityCart={quantityCart}
          setQuantityCart={setQuantityCart}
          listWithAllProducts={productsCart}
        />
      </IonContent>
      <IonAlert
        isOpen={openModalDeleteProduct}
        onDidDismiss={() => setOpenModalDeleteProduct(false)}
        header="Eliminar Producto"
        message="¿Está seguro que desea eliminar este producto?"
        buttons={[
          {
            text: "Cancelar",
            role: "cancel",
            cssClass: "secondary",
          },
          {
            text: "Eliminar",
            handler: () => deleteOneProduct(),
          },
        ]}
      />
      <IonAlert
        isOpen={openModalDeleteAllProducts}
        onDidDismiss={() => setOpenModalDeleteAllProducts(false)}
        header="Vaciar Carrito"
        message="¿Está seguro que desea vaciar el carrito?"
        buttons={[
          {
            text: "Cancelar",
            role: "cancel",
            cssClass: "secondary",
          },
          {
            text: "Eliminar",
            handler: () => deleteAllProducts(),
          },
        ]}
      />
    </IonPage>
  );
};

export default CartPage;
