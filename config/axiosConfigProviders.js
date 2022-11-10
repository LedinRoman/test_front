const headers = {
  'Content-Type': 'application/json',
};

export const getProviders = () => ({
  options: {
    method: 'get',
    url: process.env.VUE_APP_GET_PROVIDERS,
    headers,
  },
});

export const createProvider = (name) => ({
  options: {
    method: 'post',
    url: process.env.VUE_APP_CREATE_PROVIDER,
    headers,
    data: { name },
  },
  success: {
    type: 'success',
    title: 'PROVIDER CREATED',
    text: 'Provider was successfully created',
  },
  alreadyExist: {
    type: 'warn',
    title: 'PROVIDER ALREADY EXIST',
    text: 'Provider with such name already exist, no providers were added',
    duration: 3000,
    speed: 200,
  },
});

export const deleteProvider = (id) => ({
  options: {
    method: 'delete',
    url: process.env.VUE_APP_DELETE_PROVIDER,
    headers,
    params: { _id: id },
  },
  success: {
    type: 'success',
    title: 'PROVIDER DELETED',
    text: 'Provider was successfully deleted',
  },
});

export const editProvider = (name, id) => ({
  options: {
    method: 'put',
    url: process.env.VUE_APP_EDIT_PROVIDER,
    headers,
    data: {
      name,
    },
    params: { _id: id },
  },
  success: {
    type: 'success',
    title: 'PROVIDER SAVED',
    text: 'Provider was successfully edited',
    duration: 3000,
    speed: 200,
  },
  alreadyExist: {
    type: 'warn',
    title: 'PROVIDER ALREADY EXIST',
    text: 'Provider with such name already exist, settings were not saved',
    duration: 3000,
    speed: 200,
  },
});
