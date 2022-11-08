const CURRENCY_FORMATTER = new Intl.NumberFormat(undefined, {
  currency: "USD",
  style: "currency",
});
const formatCurrency = (num) => {
  return CURRENCY_FORMATTER.format(num);
};

export default formatCurrency;
