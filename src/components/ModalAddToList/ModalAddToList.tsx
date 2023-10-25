import {
  InputChangeEventDetail,
  IonAlert,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonModal,
  IonThumbnail,
} from "@ionic/react";
import { useContext, useState } from "react";
import { addProductsToListService, getContentListService } from "../service";
import { AuthContext } from "../../context/AuthContext";
import photoDefault from "../../../public/logo-my-app.png";

import "./ModalAddToList.css";

interface Props {
  popUpList: boolean;
  setPopUpList: (popUpList: boolean) => void;
  lists: Lists[];
  idProduct: string;
  productDetails: any;
  price: number;
}

interface Lists {
  id: number;
  Nombre: string;
  C_CLIENTE: number;
}

const ModalAddToList: React.FC<Props> = ({
  popUpList,
  setPopUpList,
  lists,
  idProduct,
  productDetails,
  price,
}) => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    return null;
  }

  const { token, setContentList } = authContext;

  const [error, setError] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [itemQuantities, setItemQuantities] = useState<{
    [itemId: string]: number;
  }>({});

  const handleCheckboxChange = (
    event: CustomEvent<InputChangeEventDetail>,
    listId: string
  ) => {
    const checked = event.target;

    if (checked) {
      setSelectedItems([listId]);
    } else {
      setSelectedItems([]);
    }
  };

  const handleQuantityChange = (
    event: CustomEvent<InputChangeEventDetail>,
    listId: string
  ) => {
    const quantity = parseInt(event.detail.value as string);

    setItemQuantities((prevQuantities) => ({
      ...prevQuantities,
      [listId]: quantity,
    }));
  };

  const handledAddProductsToList = async () => {
    try {
      const objectToAdd = [];

      for (let key in itemQuantities) {
        const idList = key;
        const cantidad = itemQuantities[key];

        const object = { idList, itemQuantity: cantidad };

        objectToAdd.push(object);

        for (let i = 0; i < objectToAdd.length; i++) {
          await addProductsToListService({
            token,
            idList,
            cantidad,
            idProduct: idProduct,
          });
        }
        setItemQuantities({});

        setSelectedItems([]);

        setPopUpList(false);

        const contentList = await getContentListService({ token, idList });

        setContentList(contentList);
      }
    } catch (err: any) {
      console.log(err);
      setItemQuantities({});
      setSelectedItems([]);
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
      <IonModal isOpen={popUpList}>
        <IonContent>
          <IonCard className="ion-padding">
            <IonCardHeader>
              <IonCardTitle className="ion-text-center " color={"primary"}>
                Selecciona una lista
              </IonCardTitle>
            </IonCardHeader>
            {lists.map((list: any) => (
              <IonCardContent key={list.id} className=" ion-padding ion-margin">
                <IonCheckbox
                  slot="start"
                  labelPlacement="end"
                  checked={selectedItems.includes(list.id)}
                  onIonChange={(e) => handleCheckboxChange(e, list.id)}
                  className={
                    selectedItems.includes(list.id) ? "selected-label" : ""
                  }
                >
                  {list.Nombre}
                </IonCheckbox>
                {selectedItems.includes(list.id) && (
                  <IonInput
                    type="number"
                    placeholder="Cantidad"
                    onIonChange={(e) => handleQuantityChange(e, list.id)}
                  />
                )}
              </IonCardContent>
            ))}
            <section className="buttons-modal">
              <IonButton
                color="danger"
                onClick={() => {
                  setPopUpList(false);
                }}
              >
                Cancelar
              </IonButton>
              <IonButton onClick={() => handledAddProductsToList()}>
                Aceptar
              </IonButton>
            </section>
          </IonCard>
          <IonCard key={productDetails.A_CODIGO} className="card-product-list">
            <IonItem>
              <IonThumbnail slot="start" className="img-product-list">
                <img
                  className="img-product-single"
                  alt="foto-del-producto"
                  src={`http://localhost:3000/fotos-productos/${productDetails.A_CODIGO}.jpg`}
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
        </IonContent>
      </IonModal>
      <IonAlert
        isOpen={!!error}
        onDidDismiss={() => {
          setError("");
          setPopUpList(false);
        }}
        message={error}
        buttons={["OK"]}
      />
    </>
  );
};

export default ModalAddToList;
