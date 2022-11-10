export default (clients) => {
  for (const client of clients) {
    const newArr = [];
    for (const provider of client.providers) {
      newArr.push(provider.name);
    }
    client.providers = newArr;
  }
  return clients;
};
