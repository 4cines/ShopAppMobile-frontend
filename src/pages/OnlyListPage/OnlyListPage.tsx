import React, { useContext, useEffect, useState, useRef } from "react";
import {
  IonAlert,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonFab,
  IonFabButton,
  IonFabList,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonPage,
  IonSpinner,
  IonThumbnail,
} from "@ionic/react";
import {
  addOutline,
  arrowBackOutline,
  cartOutline,
  trashOutline,
} from "ionicons/icons";
import { useHistory, useParams } from "react-router";
import {
  addProductToCartService,
  deleteListService,
  deleteOnlyProductToListService,
  getCartProductsService,
  getContentListService,
  getListsDataService,
  updateQuatityProductInListService,
} from "../../components/service";
import { AuthContext } from "../../context/AuthContext";
import photoDefault from "../../../public/logo-my-app.png";
import HeaderComponent from "../../components/Header/HeaderComponent";

import "./OnlyListPage.css";

import ModalModifyQuantityListComponent from "../../components/ModalModifyQuantityList/ModalModifyQuantityListComponent";

interface List {
  id: number;
  Nombre: string;
  C_CLIENTE: number;
}

const OnlyListPage: React.FC = () => {
  const [error, setError] = useState("");
  const [nameList, setNameList] = useState("");
  const [idProduct, setIdProduct] = useState("");
  const [openModalDeleteList, setOpenModalDeleteList] = useState(false);
  const [openModalDeleteProductToList, setOpenModalDeleteProductToList] =
    useState(false);
  const [modalToAddListIntoCart, setModalToAddListIntoCart] = useState(false);
  const [modalModifyQuantity, setModalModifyQuantity] = useState(false);
  const [quantityProductToList, setQuantityProductToList] = useState(1);
  const quantityRef = useRef<HTMLIonInputElement>(null);

  const [loading, setLoading] = useState(true);

  const history = useHistory();

  const authContext = useContext(AuthContext);

  if (!authContext) {
    return null;
  }

  const { token, contentList, setContentList, setList, setProductsCart } =
    authContext;

  const idListParam = useParams();

  if (!idListParam) {
    return null;
  }

  const numList = idListParam;

  const idList = Object.values(numList)[0] as string;

  const getContentList = async (token: string, idList: string) => {
    try {
      setError("");
      const contentListData = await getContentListService({ token, idList });
      return contentListData;
    } catch (err: any) {
      setError(err.message);
      console.log(err.message);
    }
  };

  const infoListData = async () => {
    try {
      setError("");

      const listsData = await getListsDataService({ token });
      const infoList = listsData.find(
        (list: List) => list.id === Number(idList)
      );
      return infoList;
    } catch (err: any) {
      console.log(err.message);
      setError(err.message);
    }
  };

  useEffect(() => {
    setError("");
    const productsList = async () => {
      try {
        setLoading(true);

        if (!token || idList === undefined) {
          return;
        }

        const contentListData = await getContentList(token, idList);

        const infoList = await infoListData();

        setContentList(contentListData);

        setNameList(infoList?.Nombre);

        setTimeout(() => {
          setLoading(false);
        }, 1000);
      } catch (err: any) {
        console.log(err.message);
        setError(err.message);
      }
    };
    productsList();
  }, [token, idList]);

  const handleImageError = (
    id: string,
    event: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    event.currentTarget.src = photoDefault;
  };

  const handleDeleteList = async () => {
    //no eliminar setError!
    setError("");
    try {
      await deleteListService({ token, idList });

      const listsData = await getListsDataService({ token });

      setList(listsData);
    } catch (err: any) {
      console.log(err.message);
      setError(err.message);

      //si salta el catch, es porque no hay listas
      setList([]);
    }
    history.push("/lists");
  };

  const handleDeleteProductToList = async () => {
    //dont' remove setError!
    setError("");
    try {
      await deleteOnlyProductToListService({ token, idList, idProduct });

      const contentToList = await getContentList(token, idList);

      setContentList(contentToList);

      setList;
    } catch (err: any) {
      console.log(err.message);
      setError(err.message);
    }
  };

  const handleAddProductsToCart = async () => {
    try {
      console.log(contentList);
      for (let item of contentList) {
        await addProductToCartService({
          token,
          idProduct: item.L_CODIGO,
          quantity: item.cantidad,
        });
      }

      const updateProductsToCart = await getCartProductsService({ token });

      setProductsCart(updateProductsToCart);
    } catch (err: any) {
      console.log(err.message);
      setError(err.message);
    }
  };

  console.log(quantityProductToList);

  return (
    <IonPage>
      <HeaderComponent />
      {loading ? (
        <IonContent className="loading">
          <div className="spinner-container">
            <IonSpinner name="dots" className="spinner" />
            <p className="p-spinner">¡Cargando productos!</p>
          </div>
        </IonContent>
      ) : (
        <>
          <IonContent>
            <IonCard className="product-card">
              <IonFab>
                <IonFabButton routerLink="/lists" size="small">
                  <IonIcon icon={arrowBackOutline}></IonIcon>
                </IonFabButton>
              </IonFab>
              <IonHeader className="ion-padding">
                <IonCardTitle
                  className="ion-text-center lists-header"
                  color={"primary"}
                >
                  MIS LISTAS
                </IonCardTitle>
              </IonHeader>

              <IonAlert
                isOpen={!!error}
                onDidDismiss={() => setError("")}
                header="Ups!"
                message={error}
                buttons={["OK"]}
              />
              <IonCardContent className="list-card">
                <IonCardTitle
                  className="ion-text-center title-list"
                  color="secondary"
                >
                  {nameList}
                </IonCardTitle>
                {contentList && contentList.length > 0 ? (
                  contentList.map((list) => (
                    <IonCard className="card-list-product" key={list.L_CODIGO}>
                      <IonCardContent>
                        <IonItem
                          routerLink={`/extra/${list.L_CODIGO}`}
                          className="ion-mar gin-bottom"
                        >
                          <IonThumbnail
                            slot="start"
                            className="img-product-list"
                          >
                            <img
                              className="img-product-single"
                              alt="foto-del-producto"
                              src={`http://localhost:300/fotos-productos/${list.L_CODIGO}.jpg`}
                              onError={(event) =>
                                handleImageError(list.L_CODIGO, event)
                              }
                            />
                          </IonThumbnail>
                          <IonLabel text-wrap className="ion-text-start">
                            <p className="title-product-list">
                              {list.L_DESCVRIPCION}
                            </p>
                            <p className="code-product-list">
                              Codigo: {list.L_CODIGO}
                            </p>
                            <p className="code-product-list">
                              Marca: {list.MARCA}
                            </p>
                            <p className="code-product-list">
                              Formato: {list.FORMATO}
                            </p>
                            <p className="code-product-list">
                              Precio unitario:{" "}
                              {list.L_P_UNIT.toString().replace(".", ",")}{" "}
                            </p>
                            <p className="code-product-list">
                              Cantidad: {list.cantidad}
                            </p>
                          </IonLabel>
                        </IonItem>
                        <section className="buttons-modal padding-bottom">
                          <IonButton
                            className="bottons-size"
                            fill="outline"
                            size="small"
                            color={"danger"}
                            onClick={() => {
                              setOpenModalDeleteProductToList(true);
                              setIdProduct(list.L_CODIGO);
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
                              setIdProduct(list.L_CODIGO);
                              setQuantityProductToList(list.cantidad);
                            }}
                          >
                            Modificar cantidad
                          </IonButton>
                        </section>
                      </IonCardContent>
                    </IonCard>
                  ))
                ) : (
                  <p className="error-message">No hay productos en la lista</p>
                )}
              </IonCardContent>
            </IonCard>
            <ModalModifyQuantityListComponent
              modalModifyQuantity={modalModifyQuantity}
              setModalModifyQuantity={setModalModifyQuantity}
              idList={idList}
              idProduct={idProduct}
              listWithAllProducts={contentList}
              quantityProductToList={quantityProductToList}
              setQuantityProductToList={setQuantityProductToList}
              nameList={nameList}
            />
          </IonContent>
          <IonFab className="floating-button">
            <IonFabButton color={"success"}>
              <IonIcon icon={addOutline}></IonIcon>
            </IonFabButton>
            <IonFabList side="start">
              {contentList && contentList.length > 0 && (
                <IonFabButton className="large-button" color="warning">
                  <IonIcon
                    icon={cartOutline}
                    onClick={() => setModalToAddListIntoCart(true)}
                  ></IonIcon>
                </IonFabButton>
              )}
              <IonFabButton
                color="danger"
                onClick={() => setOpenModalDeleteList(true)}
                className="large-button"
              >
                <IonIcon icon={trashOutline} size="small"></IonIcon>
              </IonFabButton>
            </IonFabList>
          </IonFab>
          <IonFab
            slot="fixed"
            horizontal="end"
            vertical="bottom"
            className="delete-list"
          ></IonFab>
        </>
      )}
      <IonAlert
        isOpen={openModalDeleteList}
        onDidDismiss={() => setOpenModalDeleteList(false)}
        header="Eliminar Lista"
        message="¿Está seguro que desea eliminar esta lista?"
        buttons={[
          {
            text: "Cancelar",
            role: "cancel",
            cssClass: "secondary",
          },
          {
            text: "Eliminar",
            handler: () => handleDeleteList(),
          },
        ]}
      />

      <IonAlert
        isOpen={openModalDeleteProductToList}
        onDidDismiss={() => setOpenModalDeleteProductToList(false)}
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
            handler: () => handleDeleteProductToList(),
          },
        ]}
      />
      <IonAlert
        isOpen={modalToAddListIntoCart}
        onDidDismiss={() => setModalToAddListIntoCart(false)}
        header="Carrito"
        message="¿Está seguro que desea agregar los productos al carrito?"
        buttons={[
          {
            text: "Cancelar",
            role: "cancel",
            cssClass: "secondary",
          },
          {
            text: "Agregar",
            handler: () => handleAddProductsToCart(),
          },
        ]}
      ></IonAlert>
    </IonPage>
  );
};

export default OnlyListPage;
