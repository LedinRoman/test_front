export default (customer) => {
  const {
    name, email, phone,
  } = customer;
  if (!name.length || !email.length || !phone.length) {
    return {
      type: 'error',
      title: 'ADDING CUSTOMER ERROR',
      text: 'All fields must be filled',
      duration: 3000,
      speed: 200,
    };
  }

  const checkEmail = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
  if (!checkEmail) {
    return {
      type: 'error',
      title: 'ADDING CUSTOMER ERROR',
      text: `Invalid email entered,
      Valid form is example@gmail.com`,
      duration: 3000,
      speed: 200,
    };
  }

  const checkPhone = /^\d{11}$/.test(phone);
  if (!checkPhone) {
    return {
      type: 'error',
      title: 'ADDING CUSTOMER ERROR',
      text: 'Invalid phone number entered',
      duration: 3000,
      speed: 200,
    };
  }

  return {
    type: 'success',
    message: 'succesfully added',
  };
};
