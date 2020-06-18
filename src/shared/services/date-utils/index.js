export const dateToISOString = date => (
  date &&
    `${String(date.getFullYear())}-${String(
      date.getMonth() + 1
    ).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
);

export const dateToString = date => {
  // debugger;
  console.log(date);
  return (
    date &&
    `${String(date.getDate()).padStart(2, '0')}-${String(
      date.getMonth() + 1
    ).padStart(2, '0')}-${String(date.getFullYear())}`
  );
};

export const dateToTime = date => (
  date &&
    `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
);


export const capitalizeFirstLetter = value => value && (value[0].toUpperCase() + value.substring(1));
