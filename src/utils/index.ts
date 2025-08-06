export const extractListingIdFromPrelistingURL = (
  url: string | null | undefined,
): string | undefined => {
  if (!url) {
    return undefined;
  }

  const parts = url.split('/');
  return parts[parts.length - 1];
};

export const extractPreListingIdFromBrochureURL = (
  url: string | null | undefined,
): string | undefined => {
  if (!url) {
    return undefined;
  }

  const parts = url.split('/');
  return parts[parts.length - 2];
};

const DEFAULT_VALUE_OF_GOODS = 5000;

export const getInsurancePremiumByValue = ({
  ratePrice,
  taxRate,
  minPrice,
}: {
  ratePrice: number;
  taxRate: number;
  minPrice: number;
}) => {
  const insurancePremium =
    Math.round((DEFAULT_VALUE_OF_GOODS * ratePrice * (100 + taxRate)) / 100) /
    100;
  const minPriceInclTax = minPrice + minPrice * (taxRate / 100);

  if (insurancePremium < minPriceInclTax) {
    return minPriceInclTax;
  }

  return insurancePremium;
};
