// ListPage.tsx
import React, { useContext, useEffect, useState, useRef } from "react";
import { IonAlert, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonInput, IonItem, IonModal, IonPage, IonRouterLink, IonTitle } from "@ionic/react";
import HeaderComponent from "../../components/Header/HeaderComponent";
import { AuthContext } from "../../context/AuthContext";
import { createNewListService, getListsDataService } from "../../components/service";
import { add } from "ionicons/icons";

import './ListsPage.css';

interface List {
    id: number;
    Nombre: string;
    C_CLIENTE: number;
}

const ListPage: React.FC = () => {
    const [openModal, setOpenModal] = useState(false);
    const [error, setError] = useState('');

    const authContext = useContext(AuthContext);

    if (!authContext) {
        return null;
    }

    const { token, list, setList } = authContext;

    const newListNameRef = useRef<HTMLIonInputElement>(null);

    const handleCreateNewList = async () => {
        const nameList = newListNameRef.current?.value as string;

        try {
            await createNewListService({ token, nameList });
            const listsData = await getListsDataService({token});
            setList(listsData);
            handleCloseModal();
        } catch (err: any) {
            console.log(err);
            setError(err.message);
        }
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setError('');
    };

    return (
        <IonPage>
            <HeaderComponent />
            <IonContent className="ion-padding">
                    <IonAlert
                        isOpen={!!error}
                        onDidDismiss={() => setError('')}
                        header="Error"
                        message={error}
                        buttons={['OK']}
                    />
                  <IonHeader className="ion-padding">
                    <IonCardTitle className="ion-text-center lists-header" color={"primary"}>MIS LISTAS</IonCardTitle>
                </IonHeader>   
                {list.length === 0 ? <p className="error-message"> No hay listas creadas</p> : list.map((list: List) => (
                    <IonCard key={list.id} className="list-card">
                        <IonItem routerLink={`/lists/${list.id}`}>
                            <IonCardTitle  color="secondary">{list.Nombre}</IonCardTitle>
                        </IonItem>
                    </IonCard>
                ))}
                <IonFab slot="fixed" horizontal="end" vertical="bottom" className="add-list">
                    <IonFabButton onClick={() => setOpenModal(true)}>
                        <IonIcon icon={add}></IonIcon>
                    </IonFabButton>
                </IonFab>
                {openModal && (
                    <IonModal isOpen={openModal} >
                        <IonContent>
                            <IonHeader className="ion-padding">
                                <IonCardTitle className="ion-text-center lists-header" color={"primary"}>MIS LISTAS</IonCardTitle>
                            </IonHeader>
                            <IonCard className="ion-padding card-modal">
                                <IonCardHeader>
                                    <IonCardTitle color="primary" className="ion-text-center">Crear nueva Lista</IonCardTitle>
                                </IonCardHeader>
                                <IonCardContent>
                                    <IonInput placeholder="Nombre de la Lista" ref={newListNameRef} required></IonInput>
                                </IonCardContent>
                                <section className="buttons-modal">
                                    <IonButton color="danger" onClick={() => handleCloseModal()}>Cancelar</IonButton>
                                    <IonButton onClick={() => handleCreateNewList()}>Aceptar</IonButton>
                                </section>
                            </IonCard>
                        </IonContent>
                    </IonModal>
                    
                )}
            </IonContent>
        </IonPage>
    );
};

export default ListPage;
