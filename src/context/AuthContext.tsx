import { createContext, useEffect, useState } from "react";

import {
  getCartProductsService,
  getListsDataService,
  getUserDataService,
} from "../components/service/index";
import { useHistory } from "react-router-dom";

import { Storage } from "@ionic/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface User {
  C_NUMERO: number;
  C_EMPRESA: string;
  C_GRUPO: number;
  C_DOMICIL: string;
  C_DOM_ENV: string;
  C_LOC_ENV: string;
  C_TARIFA: number;
  SLUNES: string;
  SMARTES: string;
  SMIERCOLES: string;
  SJUEVES: string;
  SVIERNES: string;
  PLUNES: string;
  PMARTES: string;
  PMIERCOLES: string;
  PJUEVES: string;
  PVIERNES: string;
}

interface List {
  id: number;
  Nombre: string;
  C_CLIENTE: number;
}

interface ProductsCart {
  idProduct: string;
  quantity: number;
}

interface ContentList {
  L_DESCVRIPCION: string;
  L_CODIGO: string;
  L_P_UNIT: string;
  cantidad: number;
  MARCA: string;
  FORMATO: string;
  PESONETO: string;
}

export const AuthContext = createContext<{
  token: string;
  isLogged: boolean;
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  list: List[];
  setList: (lists: List[]) => void;
  productsCart: ProductsCart[];
  setProductsCart: (productsCart: ProductsCart[]) => void;
  contentList: ContentList[];
  setContentList: (contentList: ContentList[]) => void;
  showMenu: boolean;
  goToHome: boolean;
  setGoToHome: (goToHome: boolean) => void;
} | null>(null);

export const AuthProviderComponent = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [isLogged, setIsLogged] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [list, setList] = useState<List[]>([]);
  const [productsCart, setProductsCart] = useState<ProductsCart[]>([]);
  const [contentList, setContentList] = useState<ContentList[]>([]);
  const [goToHome, setGoToHome] = useState(false);

  const [showMenu, setShowMenu] = useState<boolean>(false);

  useEffect(() => {
    const initializeStorage = async () => {
      const storage = new Storage();
      await storage.create();

      const ionicToken = await storage.get("token");

      if (ionicToken) {
        await AsyncStorage.setItem("token", ionicToken);
        setToken(ionicToken);
      }
    };

    initializeStorage();
  }, []);

  useEffect(() => {
    const saveToken = async (token: string) => {
      const storage = new Storage();
      await storage.create();
      await storage.set("token", token);

      await AsyncStorage.setItem("token", token);

      //setToken(token);
    };

    saveToken(token);
  }, [token]);

  const getDataUser = async () => {
    if (token) {
      try {
        const userData = await getUserDataService({ token });

        setUser(userData);

        setIsLogged(true);

        setList([]);
        setProductsCart([]);
      } catch (err: any) {
        console.log(err.message);
      }
    }
  };

  const getProductsCart = async () => {
    if (token) {
      try {
        const productsCart = await getCartProductsService({ token });

        setProductsCart(productsCart);
      } catch (err: any) {
        console.log(err.message);
      }
    }
  };

  const getListsData = async () => {
    try {
      const listsData = await getListsDataService({ token });

      setList(listsData);
    } catch (err: any) {
      console.log(err.message);
      return [];
    }
  };

  useEffect(() => {
    getDataUser();
  }, [token]);

  useEffect(() => {
    getProductsCart();
    getListsData();
  }, [user]);

  const login = (token: string) => {
    console;
    setToken(token);
  };

  const logout = () => {
    setToken("");
    setIsLogged(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        isLogged,
        user,
        login,
        logout,
        list,
        setList,
        productsCart,
        setProductsCart,
        contentList,
        setContentList,
        showMenu,
        goToHome,
        setGoToHome,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
