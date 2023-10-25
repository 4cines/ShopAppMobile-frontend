import {
  IonAlert,
  IonButton,
  IonButtons,
  IonDatetime,
  IonItem,
} from "@ionic/react";
import { useContext, useEffect, useRef, useState } from "react";

import { AuthContext } from "../../context/AuthContext";
import { createOrderService, getUserDataService } from "../service";

import {
  addMonths,
  eachDayOfInterval,
  format,
  isWednesday,
  isFriday,
  isMonday,
  isThursday,
  isTuesday,
} from "date-fns";

import "./CalendarComponent.css";
import { useHistory } from "react-router";

interface MyComponentProps {
  setShowCalendar: (showCalendar: boolean) => void;
  showCalendar: boolean;
  deleteAllProducts: () => void;
}

const CalendarComponent: React.FC<MyComponentProps> = ({
  setShowCalendar,
  showCalendar,
  deleteAllProducts,
}) => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    return null;
  }

  const history = useHistory();

  const { token, productsCart, setProductsCart } = authContext;
  const datetime = useRef<null | HTMLIonDatetimeElement>(null);

  const [error, setError] = useState("");
  const [sendServiceDays, setSendServiceDays] = useState<string[]>([""]);
  const [orderServiceDays, setOrderServiceDays] = useState<string[]>([""]);
  const [showAlert, setShowAlert] = useState(false); // Estado para controlar la visibilidad del IonAlert
  const [avaiableDaysCalendar, setAvaiableDaysCalendar] = useState<number[]>([
    1, 2,
  ]);

  const todaytoState = new Date();
  const formattedToday = format(todaytoState, "yyyy-MM-dd");

  const [minDateCalendar, setMinDateCalendar] =
    useState<string>(formattedToday);

  const todayToMaxState = new Date();
  const nextMonth = addMonths(todayToMaxState, 1);
  const formattedNextMonth = format(nextMonth, "yyyy-MM-dd");

  const [maxDateCalendar, setMaxDateCalendar] =
    useState<string>(formattedNextMonth);
  const [selectedDay, setSelectedDay] = useState<any>("");

  const today = new Date();

  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();
  const hours = String(today.getHours()).padStart(2, "0");
  const minutes = String(today.getMinutes()).padStart(2, "0");
  const seconds = String(today.getSeconds()).padStart(2, "0");

  //2023-06-13 10:43:39
  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  const dayOfWeekArray = [
    "DOMINGO",
    "LUNES",
    "MARTES",
    "MIERCOLES",
    "JUEVES",
    "VIERNES",
    "SABADO",
  ];
  const nameDayToday = dayOfWeekArray[today.getDay()];

  today.setMonth(today.getMonth() + 1);
  const yearFromMonth = today.getFullYear();
  const monthFromMonth = String(today.getMonth() + 1).padStart(2, "0"); // Agrega un 0 al mes si es necesario
  const dayFromMonth = String(today.getDate()).padStart(2, "0");

  let allDays;

  const isWeekday = (dateString: string) => {
    const date = new Date(dateString);
    const utcDay = date.getUTCDay();
    return utcDay !== 0 && utcDay !== 6;
  };

  const getOrderAndSendDatestoUser = async () => {
    try {
      const userData = await getUserDataService({ token: authContext.token });

      // order info
      const userServiceValues = Object.keys(userData).filter((clave) => {
        const value = userData[clave];
        return (
          typeof value === "string" &&
          value.toLowerCase() === "x" &&
          clave.startsWith("P")
        );
      });

      const daysOfWeekUserServiceDaysArray = userServiceValues.map((clave) =>
        clave.slice(1)
      );

      setOrderServiceDays(daysOfWeekUserServiceDaysArray);

      // send info
      const userSendValues = Object.keys(userData).filter((clave) => {
        const value = userData[clave];
        return (
          typeof value === "string" &&
          value.toLowerCase() === "x" &&
          clave.startsWith("S")
        );
      });

      const daysOfWeekUserSendDaysArray = userSendValues.map((clave) =>
        clave.slice(1)
      );

      setSendServiceDays(daysOfWeekUserSendDaysArray);
    } catch (err: any) {
      console.log(err.message);
      setError(err.message);
      setShowAlert(true);
    }
  };

  const daysEnabledCalendar = () => {
    const response = new Date();

    const endDate = addMonths(response, 1);

    allDays = eachDayOfInterval({ start: response, end: endDate });

    let daysForValueDaysCalendar: number[] = [];

    if (sendServiceDays.includes("LUNES")) {
      allDays
        .filter((day) => isMonday(day))
        .map((day) => {
          daysForValueDaysCalendar.push(parseInt(format(day, "dd")));
        });
    }

    if (sendServiceDays.includes("MARTES")) {
      allDays
        .filter((day) => isTuesday(day))
        .map((day) => {
          daysForValueDaysCalendar.push(parseInt(format(day, "dd")));
        });
    }

    if (sendServiceDays.includes("MIERCOLES")) {
      allDays
        .filter((day) => isWednesday(day))
        .map((day) => {
          daysForValueDaysCalendar.push(parseInt(format(day, "dd")));
        });
    }

    if (sendServiceDays.includes("JUEVES")) {
      allDays
        .filter((day) => isThursday(day))
        .map((day) => {
          daysForValueDaysCalendar.push(parseInt(format(day, "dd")));
        });
    }

    if (sendServiceDays.includes("VIERNES")) {
      allDays
        .filter((day) => isFriday(day))
        .map((day) => {
          daysForValueDaysCalendar.push(parseInt(format(day, "dd")));
        });
    }

    setAvaiableDaysCalendar(daysForValueDaysCalendar);
  };

  useEffect(() => {
    getOrderAndSendDatestoUser();
  }, []);

  useEffect(() => {
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const yearFromTomorrow = tomorrow.getFullYear();
    const monthFromTomorrow = String(tomorrow.getMonth()).padStart(2, "0");
    const dayFromTomorrow = String(tomorrow.getDate()).padStart(2, "0");

    const cloneToday = new Date();

    cloneToday.setMonth(cloneToday.getMonth() + 1);
    const yearFromNextMonth = cloneToday.getFullYear();
    const monthFromNextMonth = String(cloneToday.getMonth() + 1).padStart(
      2,
      "0"
    );
    const dayFromNextMonth = String(cloneToday.getDate()).padStart(2, "0");

    setMinDateCalendar(
      `${yearFromTomorrow}-${monthFromTomorrow}-${dayFromTomorrow}`
    );
    setMaxDateCalendar(
      `${yearFromNextMonth}-${monthFromNextMonth}-${dayFromNextMonth}`
    );

    if (sendServiceDays) {
      daysEnabledCalendar();
    }
  }, [sendServiceDays]);

  const handleCloseComponent = () => {
    setShowAlert(false);
    setShowCalendar(false);
  };

  const handleConfirmPedido = async () => {
    try {
      await datetime.current?.confirm(true);
    } catch (err: any) {
      setError(err.message);
      console.log("Error al confirmar el valor seleccionado:", err);
    }
  };

  useEffect(() => {
    if (!selectedDay) return;

    // if(!orderServiceDays.includes(nameDayToday)) {
    //     setError('No se pueden realizar pedidos los ' + nameDayToday);
    //     return;
    // }

    const convertirFormatoFecha = (fecha: string) => {
      const fechaObjeto = new Date(fecha);
      const fechaFormateada = format(fechaObjeto, "yyyy-MM-dd HH:mm:ss");
      return fechaFormateada;
    };

    const fechaServicio = convertirFormatoFecha(selectedDay);

    const createOrder = async () => {
      const orderDates = {
        fechaPedido: formattedDate,
        fechaServicio,
      };

      try {
        await createOrderService({ token, orderDates });
      } catch (err: any) {
        setError(err.message);
        console.log("Error al crear el pedido:", err);
      }
    };

    createOrder();

    deleteAllProducts();

    setShowCalendar(false);

    history.push("/orders");
  }, [selectedDay]);

  return (
    <section className="calendar-component">
      <IonDatetime
        ref={datetime}
        locale="es-ES"
        dayValues={
          avaiableDaysCalendar.length > 0 ? avaiableDaysCalendar : allDays
        }
        isDateEnabled={isWeekday}
        firstDayOfWeek={1}
        min={minDateCalendar}
        max={maxDateCalendar}
        onIonChange={(e) => setSelectedDay(e.detail.value)}
      >
        <span slot="time-label">Hora</span>
        <IonButtons slot="buttons" className="cart-buttons-2">
          <IonButton
            color="danger"
            fill="outline"
            onClick={() => setShowCalendar(false)}
          >
            Cancelar
          </IonButton>
          <IonButton
            color="primary"
            fill="solid"
            onClick={() => handleConfirmPedido()}
          >
            Realizar pedido
          </IonButton>
        </IonButtons>
      </IonDatetime>
      <IonItem id="alertCalendarbutton" color="danger">
        {" "}
        Si desea que la entrega del pedido se realice en una fecha diferente a
        la habilitada, contacte con su poveedor.{" "}
      </IonItem>
      <IonAlert
        isOpen={!!error}
        onDidDismiss={() => handleCloseComponent()}
        header="Error"
        message={error}
        buttons={["OK"]}
      />
    </section>
  );
};

export default CalendarComponent;
