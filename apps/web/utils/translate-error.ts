import { ERROR_MESSAGES_PT_BR } from "@/constants/auth-errors";

export const translateError = (errorCode: string | undefined): string => {
  const translatedByMessage =
    ERROR_MESSAGES_PT_BR[errorCode as keyof typeof ERROR_MESSAGES_PT_BR];
  if (translatedByMessage) return translatedByMessage;

  return errorCode || "Erro desconhecido";
};
