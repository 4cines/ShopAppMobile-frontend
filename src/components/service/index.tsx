const portBackend = "http://localhost:3000";

export const loginUserService = async ({
  user,
  password,
}: {
  user: string;
  password: string;
}) => {
  console.log("user:", user);
  console.log("password:", password);
  const response = await fetch(`${portBackend}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user, password }),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message);
  }

  return json.data;
};

export const getUserDataService = async ({ token }: { token: string }) => {
  const response = await fetch(`${portBackend}/user`, {
    headers: {
      Authorization: token,
    },
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message);
  }

  return json.data;
};

export const getOwnProductsService = async ({
  token,
  currentPage,
  itemsPerPage,
}: {
  token: string;
  currentPage: number;
  itemsPerPage: number;
}) => {
  const response = await fetch(
    `${portBackend}/ownProducts?page=${currentPage}&itemsPerPage=${itemsPerPage}`,
    {
      headers: {
        Authorization: token,
      },
    }
  );

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message);
  }

  return json.data;
};

export const getAllProductsService = async ({
  token,
  currentPage,
  itemsPerPage,
}: {
  token: string;
  currentPage: number;
  itemsPerPage: number;
}) => {
  const response = await fetch(
    `${portBackend}/off-rateProducts?page=${currentPage}&itemsPerPage=${itemsPerPage}`,
    {
      headers: {
        Authorization: token,
      },
    }
  );

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message);
  }

  return json.data;
};

export const searchProductsService = async ({
  token,
  searchParam,
}: {
  token: string;
  searchParam: string;
}) => {
  const response = await fetch(`${portBackend}/search/${searchParam}`, {
    method: "POST",
    headers: {
      Authorization: token,
    },
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message);
  }

  return json.data;
};

export const getProductDetailsService = async ({
  token,
  idProduct,
}: {
  token: string;
  idProduct: string;
}) => {
  const response = await fetch(`${portBackend}/product/${idProduct}`, {
    method: "POST",
    headers: {
      Authorization: token,
    },
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message);
  }

  return json;
};

export const getListsDataService = async ({ token }: { token: string }) => {
  const response = await fetch(`${portBackend}/lists`, {
    headers: {
      Authorization: token,
    },
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message);
  }

  return json.data;
};

export const createNewListService = async ({
  token,
  nameList,
}: {
  token: string;
  nameList: string;
}) => {
  console.log("name:", { nameList });
  const response = await fetch(`${portBackend}/lists`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({ nameList }),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message);
  }
};

export const getContentListService = async ({
  token,
  idList,
}: {
  token: string;
  idList: string;
}) => {
  const response = await fetch(`${portBackend}/list/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({ idList }),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message);
  }

  return json.data;
};

export const deleteListService = async ({
  token,
  idList,
}: {
  token: string;
  idList: string;
}) => {
  const response = await fetch(`${portBackend}/lists/${idList}`, {
    method: "DELETE",
    headers: {
      Authorization: token,
    },
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message);
  }
};

export const addProductsToListService = async ({
  token,
  idList,
  cantidad,
  idProduct,
}: {
  token: string;
  idList: string;
  cantidad: number;
  idProduct: string;
}) => {
  const response = await fetch(`${portBackend}/lists/${idList}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({ cantidad, idProduct }),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message);
  }
};

export const updateQuatityProductInListService = async ({
  token,
  idList,
  quantity,
  idProduct,
}: {
  token: string;
  idList: string;
  quantity: number;
  idProduct: string;
}) => {
  const response = await fetch(`${portBackend}/lists/${idList}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({ quantity, idProduct }),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message);
  }
};

export const deleteOnlyProductToListService = async ({
  token,
  idList,
  idProduct,
}: {
  token: string;
  idList: string;
  idProduct: string;
}) => {
  console.log({ idList, idProduct });
  const response = await fetch(`${portBackend}/lists/${idList}/products`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({ idProduct }),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message);
  }
};

export const getOrdersService = async ({ token }: { token: string }) => {
  const response = await fetch(`${portBackend}/orders`, {
    headers: {
      Authorization: token,
    },
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message);
  }

  return json.data;
};

export const getOrderDetailsService = async ({
  token,
  idOrder,
}: {
  token: string;
  idOrder: string;
}) => {
  const response = await fetch(`${portBackend}/orders/${idOrder}`, {
    headers: {
      Authorization: token,
    },
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message);
  }

  return json.data;
};

export const getCartProductsService = async ({ token }: { token: string }) => {
  const response = await fetch(`${portBackend}/cart/products`, {
    headers: {
      Authorization: token,
    },
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message);
  }

  return json.data;
};

export const addProductToCartService = async ({
  token,
  idProduct,
  quantity,
}: {
  token: string;
  idProduct: string;
  quantity: number;
}) => {
  const response = await fetch(`${portBackend}/cart/addProduct`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({ idProduct, quantity }),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message);
  }
};

export const deleteAllProductFromCartService = async ({
  token,
}: {
  token: string;
}) => {
  const response = await fetch(`${portBackend}/cart/removeAllProducts`, {
    method: "DELETE",
    headers: {
      Authorization: token,
    },
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message);
  }
};

export const deleteProductFromCartService = async ({
  token,
  idProduct,
}: {
  token: string;
  idProduct: string;
}) => {
  const response = await fetch(`${portBackend}/cart/oneProduct`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({ idProduct }),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message);
  }
};

export const updateQuatityProductInCartService = async ({
  token,
  idProduct,
  quantity,
}: {
  token: string;
  idProduct: string;
  quantity: number;
}) => {
  const response = await fetch(`${portBackend}/cart/updateQuantity`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({
      idProduct,
      quantity,
    }),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message);
  }
};

export const createOrderService = async ({
  token,
  orderDates,
}: {
  token: string;
  orderDates: { fechaServicio: string; fechaPedido: string };
}) => {
  const response = await fetch(`${portBackend}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({ orderDates }),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message);
  }

  return json.data;
};

//ftp

export const getFtpService = async ({ idProduct }: { idProduct: string }) => {
  const response = await fetch(`${portBackend}/uploads/SE62459.pdf`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    // body: JSON.stringify({idProduct}),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message);
  }

  return json;
};

export const getFtpFileService = async ({
  idProduct,
}: {
  idProduct: string;
}) => {
  const response = await fetch(`${portBackend}/ftp/${idProduct}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message);
  }

  return json.data;
};

export const getSignatureService = async ({
  n,
  token,
}: {
  n: number;
  token: string;
}) => {
  const response = await fetch(`${portBackend}/orders/${n}/signature`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  });

  const json = await response.json();

  if (!response.ok) {
    console.log(json.message);
  }

  return json.data;
};
