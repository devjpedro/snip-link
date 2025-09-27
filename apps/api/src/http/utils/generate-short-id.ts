import { randomBytes } from "node:crypto";
import { checkIfShortIdExists } from "./check-exists";

const SHORTID_LENGTH = 8;

const MAX_GENERATION_ATTEMPTS = 10;

export const generateShortId = (length = SHORTID_LENGTH): string => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const bytes = randomBytes(length);

  for (let i = 0; i < length; i++) {
    const byte = bytes[i];
    if (byte !== undefined) {
      result += chars[byte % chars.length];
    }
  }

  return result;
};

export const generateUniqueShortId = async (): Promise<string | null> => {
  let attempts = 0;
  let shortId: string;

  do {
    shortId = generateShortId();
    attempts++;

    if (attempts > MAX_GENERATION_ATTEMPTS) {
      return null;
    }
  } while (await checkIfShortIdExists(shortId));

  return shortId;
};
