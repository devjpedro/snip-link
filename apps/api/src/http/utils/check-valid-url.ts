export const checkIsValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validateUrlInput = (originalUrl: string) => {
  if (!checkIsValidUrl(originalUrl)) {
    return {
      isValid: false,
      error: "URL inválida. Por favor, forneça uma URL válida.",
    };
  }
  return { isValid: true };
};
