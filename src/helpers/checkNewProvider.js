export default (provider) => {
  if (!provider.name) {
    return {
      type: 'error',
      title: 'ADDING PROVIDER ERROR',
      text: 'Name must be filled',
      duration: 3000,
      speed: 200,
    };
  }

  return {
    type: 'success',
    message: 'succesfully added',
  };
};
