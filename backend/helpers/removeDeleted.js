export const remove = (id, array) => {
  array.filter((element) => {
    return element._id !== id;
  });
}