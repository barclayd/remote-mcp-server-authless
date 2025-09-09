export const getDateInTwoWeeks = () => {
  const date = new Date();
  date.setDate(date.getDate() + 14);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export const getJiminnyUTCDateFormat = (date: Date): string => {
  const pad = (n: number): string => String(n).padStart(2, '0');

  const year = date.getUTCFullYear();
  const month = pad(date.getUTCMonth() + 1); // months are 0-based
  const day = pad(date.getUTCDate());

  const hours = pad(date.getUTCHours());
  const minutes = pad(date.getUTCMinutes());
  const seconds = pad(date.getUTCSeconds());

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};
