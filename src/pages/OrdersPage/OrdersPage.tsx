import { IonAlert, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonInput, IonItem, IonModal, IonPage, IonSpinner, IonText } from "@ionic/react";
import HeaderComponent from "../../components/Header/HeaderComponent";
import { add } from "ionicons/icons";
import { useContext, useEffect, useState } from "react";
import { getOrdersService } from "../../components/service";
import { AuthContext } from "../../context/AuthContext";
import "./OrdersPage.css"

interface Order {
    f_servicio: string;
    alb_gesco: number,
    estado: string,
    h_pedido: string,
    n: number,
    n_pedido_cliente: number,
}
const OrderPage: React.FC = () => {

    const [error , setError] = useState('');
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    const authContext = useContext(AuthContext);

    if(!authContext){
        return null;
    }

    const { token } = authContext;

    const getOrdersData = async (token: string) => {
        
        const ordersData = await getOrdersService({token});

        setTimeout(() => {
            setLoading(false);
          }, 1000);

        return ordersData;
    }

    useEffect(() => {
        setLoading(true);
        setError('');
          const fetchData = async () => {
            try {

              const orderData = await getOrdersData(token);

              setOrders(orderData);

            } catch (err: any) {
              console.log(err.message);
              setError(err.message);
            }
          };
      
          fetchData();
    }, [authContext]);

    const formatDate = (dateString : string) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString().slice(-2);

        
        return `${day}/${month}/${year}`;
      };



    return (
        <IonPage>
            <HeaderComponent/>
            {loading ? 
                <IonContent className="loading">
                    <div className="spinner-container">
                    <IonSpinner name="dots" className="spinner"/>
                    <p className="p-spinner">¡Cargando albaranes!</p>
                    </div>
                </IonContent>
            : <>
            <IonContent className="ion-padding">
                 {error && 
                <>
                <IonAlert isOpen={!!error} onDidDismiss={() => setError('')} header="Error" message={error} buttons={['OK']} /> 
                <p className="error-message">No hay albaranes</p>
                </>}
                <IonHeader className="ion-padding">
                    <IonCardTitle className="ion-text-center albaranes-title" color={"primary"}>ALBARANES</IonCardTitle>
                </IonHeader>
   
                {orders.map((order: Order) => (
                    <IonCard key={order.n} routerLink={`/orders/${order.n}`}>
                        <IonCardHeader>
                            <IonCardTitle color={"primary"}>
                                {(!order.alb_gesco) ? '(Pendiente de numeración)' : order.alb_gesco}
                            </IonCardTitle>
                        </IonCardHeader>    
                            <p className="p-orders"style={{ color: order.estado === 'Listo' || "LISTO" ? 'green' : 'red' }}>Estado: {order.estado}</p>
                            <p className="p-orders">Fecha de pedido: {formatDate(order.h_pedido)}</p>
                            <p className="p-orders">Fecha de entrega: {formatDate(order.f_servicio)}</p>
                            <p className="p-orders">Número pedido cliente: {order.n_pedido_cliente}</p>
                    </IonCard>
                ))}
            </IonContent>
            </>
            }
            
        </IonPage>
    );
}

export default OrderPage;