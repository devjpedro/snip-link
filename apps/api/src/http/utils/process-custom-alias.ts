import { checkIfCustomAliasExists } from "./check-exists";
import { validateCustomAlias } from "./validate-custom-alias";

export const processCustomAlias = async (
  customAlias: string,
  userId?: string
): Promise<{ success: boolean; error?: string; shortId?: string }> => {
  if (!validateCustomAlias(customAlias)) {
    return {
      success: false,
      error:
        "Alias personalizado deve conter apenas letras, números, hífen e underscore.",
    };
  }

  const aliasCheck = await checkIfCustomAliasExists(customAlias, userId);

  if (aliasCheck.exists) {
    if (aliasCheck.isOwnedByUser) {
      return {
        success: false,
        error: "Você já possui um link com este alias personalizado.",
      };
    }

    return {
      success: false,
      error:
        "Este alias personalizado já está em uso por outro usuário. Tente um alias diferente.",
    };
  }

  return { success: true, shortId: customAlias };
};
