const CUSTOM_ALIAS_REGEX = /^[a-zA-Z0-9-_]+$/;

export const validateCustomAlias = (customAlias: string): boolean => {
  return CUSTOM_ALIAS_REGEX.test(customAlias);
};
