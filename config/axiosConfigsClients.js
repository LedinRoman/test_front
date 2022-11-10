const headers = {
  'Content-Type': 'application/json',
};

export const createCustomer = (customer) => {
  const {
    name, email, phone, providers,
  } = customer;
  // const mappedProviders = providers.map((item) => ({ id: item.id }));
  return {
    options: {
      method: 'post',
      url: process.env.VUE_APP_CREATE_CLIENT,
      headers,
      data: {
        name, email, phone, providers,
      },
    },
    success: {
      type: 'success',
      title: 'CUSTOMER ADDED',
      text: 'Customer was successfully added',
      duration: 3000,
      speed: 200,
    },
    alreadyExist: {
      type: 'warn',
      title: 'CUSTOMER ALREADY EXIST',
      text: 'Customer with such email already exist',
      duration: 3000,
      speed: 200,
    },
  };
};

export const getPaginated = (limit, page) => ({
  options: {
    method: 'get',
    url: process.env.VUE_APP_GET_PAGINATION,
    headers,
    params: { limit, page },
  },
});

export const deleteCustomer = (id) => ({
  options: {
    method: 'delete',
    url: process.env.VUE_APP_DELETE_CLIENT,
    headers,
    params: { _id: id },
  },
  success: {
    type: 'success',
    title: 'CUSTOMER DELETED',
    text: 'Customer was successfully deleted',
  },
});

export const editCustomer = (customer) => {
  const {
    name, email, phone, providers, _id,
  } = customer;
  return {
    options: {
      method: 'put',
      url: process.env.VUE_APP_EDIT_CLIENT,
      headers,
      data: {
        name, email, phone, providers,
      },
      params: { _id },
    },
    success: {
      type: 'success',
      title: 'CUSTOMER SAVED',
      text: 'Customer was successfully edited',
      duration: 3000,
      speed: 200,
    },
    alreadyExist: {
      type: 'warn',
      title: 'CUSTOMER ALREADY EXIST',
      text: 'Customer with such email already exist, settings were not saved',
      duration: 3000,
      speed: 200,
    },
  };
};
