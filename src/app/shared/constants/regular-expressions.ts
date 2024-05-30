export const CustomRegex = {
  ONLY_DIGITS: /^[0-9]*$/,
  ONLY_DIGITS_GREATER_THAN_ZERO: /^[1-9][0-9]*$/,

  // Verifies Number is a negative/positive number.
  // Number may be a decimal, but if it is, it requires at least one number before and after the decimal place.
  // Decimal numbers may also be negative or positive. Only 1 decimal place is allowed.
  // Match: 5.01 5 99 -5.01 -5 -99 1.9e10
  // Not Match: 5. .3 k.a
  SIMPLE_NUMBER: /-?[0-9]+(\.[0-9]+)?(e[0-9]+)?/,
  // Match: 123 1.1 .3 0.4 -.3 -0.4 -123 -1.1
  RATIONAL_NUMBER: /^-?[0-9]*(\.[0-9]){0,1}$/g,
  BETWEEN_ZERO_TO_ONE: /^(0?(\.\d+)?|1(\.0+)?)$/,
  MILITARY_TIME: /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
  BETWEEN_TWO_TO_NINETY_NINE: /^([2-9]|[1-8][0-9]|9[0-9])$/
};
