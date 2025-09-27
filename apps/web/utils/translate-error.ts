import { ERROR_MESSAGES_PT_BR } from "@/constants/auth-errors";

export const translateError = (errorMessage: string | undefined): string => {
  const translatedByMessage =
    ERROR_MESSAGES_PT_BR[errorMessage as keyof typeof ERROR_MESSAGES_PT_BR];
  if (translatedByMessage) return translatedByMessage;

  return errorMessage || "Erro desconhecido";
};
