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
