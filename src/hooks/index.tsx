// import { getListsDataService } from "../components/service";

// import { AuthContext } from "../context/AuthContext";

// interface List {
//     id: number;
//     Nombre: string;
//     C_CLIENTE: number;
//   }

//   //actualiza directamente el listado de las listas del usuario
// export  const getListsData = async (token: string, setList:any) => {
//     try{

//     const listsData = await getListsDataService({token});

//     setList(listsData);

//     }catch(err: any){
//         console.log(err.message);
//         return [];
//     }
// }