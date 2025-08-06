import { AdditionalServiceSchema } from '../schemas/additionalServices';

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

const getInsurancePremiumByValue = ({
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

export const getPremiumPrice = async (
  categoryId: number | string | null | undefined,
  basePremiumPrice: number | null | undefined,
) => {
  if (categoryId === undefined || categoryId === null) {
    return basePremiumPrice ?? 0;
  }

  const response = await fetch(
    `https://www.anyvan.com/ng/site-settings/additional-services/${categoryId}`,
    {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      },
    },
  );

  if (!response.ok) {
    console.error('Unable to fetch response from /ng/site-settings');
  }

  const servicesData = await response.json();

  const services = AdditionalServiceSchema.parse(servicesData);

  const service = services.find(
    (ratePackage) =>
      ratePackage?.type?.includes('full_cover') &&
      ratePackage.customer_can_add === 1,
  );

  if (!service) {
    return basePremiumPrice;
  }

  return (
    (basePremiumPrice ?? 0) +
    getInsurancePremiumByValue({
      ratePrice: service.rate_price ?? 0,
      minPrice: service.min_price ?? 0,
      taxRate: service.tax_rate ?? 0,
    })
  );
};
