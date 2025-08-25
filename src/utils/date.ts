export const getDateInTwoWeeks = () => {
  const date = new Date();
  date.setDate(date.getDate() + 14);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};
