import React, { useEffect, useState, useContext, useRef } from "react";
import {
  IonAlert,
  IonButtons,
  IonCard,
  IonContent,
  IonGrid,
  IonHeader,
  IonItem,
  IonLabel,
  IonMenuButton,
  IonPage,
  IonRow,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonThumbnail,
  IonTitle,
  IonToolbar,
  SegmentValue,
} from "@ionic/react";

import photoDefault from "../../../public/logo-my-app.png";

import OwnProductsComponent from "../../components/OwnProducts/OwnProductsComponent";
import AllProductsComponent from "../../components/AllProducts/AllProductsComponent";
import { searchProductsService } from "../../components/service";
import { AuthContext } from "../../context/AuthContext";

import "./ProductsPage.css";

const ProductsPage: React.FC = () => {
  const [itemToSearch, setItemToSearch] = useState("");
  const [searchActive, setSearchActive] = useState(false);
  const [searchResults, setSearchResults] = useState<any>([]);
  const [showProducts, setShowProducts] = useState<SegmentValue>("ownProducts");
  const [searchIsActive, setSearchIsActive] = useState(false);
  const [error, setError] = useState("");

  const searchbarRef = useRef<HTMLIonSearchbarElement>(null);

  const authContext = useContext(AuthContext);

  if (!authContext) {
    return;
  }
  const { token } = authContext;

  const searchProductData = async (token: string, searchProducts: string) => {
    try {
      const searchResults = await searchProductsService({
        token,
        searchParam: searchProducts,
      });

      setSearchResults(searchResults);
    } catch (err: any) {
      console.log(err.message);

      setError(err.message);
    }
  };

  const handleSearchProducts = async (itemToSearch: any) => {
    setError("");

    try {
      setItemToSearch(itemToSearch);

      if (itemToSearch && itemToSearch.length < 3) {
        setError("Ingrese más de 3 caracteres");
        return;
      }

      if (itemToSearch.length > 0) {
        setSearchIsActive(true);
        setSearchActive(true);

        searchProductData(token, itemToSearch);
      } else {
        setSearchActive(false);
      }

      if (searchbarRef.current) {
        console.log(searchbarRef.current);
      }
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
    <>
      <IonContent>
        <IonSearchbar
          id="ion-search-product"
          ref={searchbarRef}
          animated={true}
          placeholder="Buscar producto/s"
          className="cancel-button-icon"
          showCancelButton="focus"
          value={itemToSearch}
          onIonChange={(e) => {
            handleSearchProducts(e.detail.value);
          }}
        ></IonSearchbar>

        <IonGrid>
          <IonRow>
            <IonSegment
              value={showProducts}
              onIonChange={(e) =>
                setShowProducts(e.detail.value ?? "ownProducts")
              }
            >
              <IonSegmentButton value="ownProducts">
                <IonLabel color={"primary"}>Mis Productos</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="allProducts">
                <IonLabel color={"primary"}>Otros productos</IonLabel>
              </IonSegmentButton>
            </IonSegment>
          </IonRow>
        </IonGrid>
        <>
          {searchActive ? (
            searchResults.map((product: any) => (
              <IonCard key={product.A_CODIGO} className="card-product-list">
                <IonItem routerLink={`/products/${product.A_CODIGO}`}>
                  <IonThumbnail slot="start" className="img-product-list">
                    <img
                      className="img-product-single"
                      alt="foto-del-producto"
                      src={`http://localhost:3000/fotos-productos/${product.A_CODIGO}.jpg`}
                      onError={(event) =>
                        handleImageError(product.A_CODIGO, event)
                      }
                    />
                  </IonThumbnail>
                  <IonLabel text-wrap className="ion-text-start">
                    <p className="title-product-list">{product.A_DESCRIP}</p>
                    <p className="code-product-list">{product.A_CODIGO}</p>
                    <p className="code-product-list">
                      {product.MARCA} - {product.FORMATO}
                    </p>
                  </IonLabel>
                </IonItem>
              </IonCard>
            ))
          ) : showProducts === "ownProducts" ? (
            <OwnProductsComponent handleImageError={handleImageError} />
          ) : showProducts === "allProducts" ? (
            <AllProductsComponent handleImageError={handleImageError} />
          ) : null}
        </>
        <IonAlert
          isOpen={!!error}
          onDidDismiss={() => {
            setError("");
            setSearchActive(false);
          }}
          message={error}
          buttons={["OK"]}
        ></IonAlert>

        <IonAlert
          isOpen={!!searchIsActive}
          onDidDismiss={() => {
            setSearchIsActive(false);
          }}
          message={"Se han encontrado las siguientes coincidencias"}
          buttons={["OK"]}
        ></IonAlert>
      </IonContent>
    </>
  );
};

export default ProductsPage;
