import { env } from "@snip-link/env";
import { and, eq } from "drizzle-orm";
import Elysia, { t } from "elysia";
import { db } from "@/db/client";
import { links } from "@/db/schema/links";
import { HTTP_STATUS } from "@/http/constants/http-status";
import { betterAuthPlugin } from "@/http/plugins/better-auth";
import { checkIsValidUrl } from "@/http/utils/check-valid-url";
import { validateCustomAlias } from "@/http/utils/validate-custom-alias";

// Função para verificar se o link existe e pertence ao usuário
const checkLinkOwnership = async (
  linkId: string,
  userId: string
): Promise<{
  id: string;
  shortId: string;
  originalUrl: string;
  customAlias: string | null;
  isActive: boolean;
} | null> => {
  const link = await db.query.links.findFirst({
    where: (linksTable, { eq: eqOp, and: andOp }) =>
      andOp(eqOp(linksTable.id, linkId), eqOp(linksTable.userId, userId)),
    columns: {
      id: true,
      shortId: true,
      originalUrl: true,
      customAlias: true,
      isActive: true,
    },
  });

  return link || null;
};

// Função para verificar se customAlias já existe (excluindo o link atual)
const checkIfCustomAliasExistsForUpdate = async (
  customAlias: string,
  userId: string,
  currentLinkId: string
): Promise<{ exists: boolean; isOwnedByUser: boolean }> => {
  const existing = await db.query.links.findFirst({
    where: (linksTable, { eq: eqOp, and: andOp, ne }) =>
      andOp(
        eqOp(linksTable.customAlias, customAlias),
        ne(linksTable.id, currentLinkId)
      ),
  });

  if (!existing) {
    return { exists: false, isOwnedByUser: false };
  }

  const isOwnedByUser = existing.userId === userId;
  return { exists: true, isOwnedByUser };
};

// Função para verificar se a URL já existe para o usuário (excluindo o link atual)
const checkIfUrlAlreadyExistsForUpdate = async (
  originalUrl: string,
  userId: string,
  currentLinkId: string
): Promise<{
  id: string;
  shortId: string;
  customAlias: string | null;
} | null> => {
  const existing = await db.query.links.findFirst({
    where: (linksTable, { eq: eqOp, and: andOp, ne }) =>
      andOp(
        eqOp(linksTable.originalUrl, originalUrl),
        eqOp(linksTable.userId, userId),
        eqOp(linksTable.isActive, true),
        ne(linksTable.id, currentLinkId)
      ),
    columns: {
      id: true,
      shortId: true,
      customAlias: true,
    },
  });

  return existing || null;
};

// Função para processar validação de customAlias no update
const processCustomAliasForUpdate = async (
  customAlias: string,
  userId: string,
  currentLinkId: string
): Promise<{ success: boolean; error?: string }> => {
  if (!validateCustomAlias(customAlias)) {
    return {
      success: false,
      error:
        "Alias personalizado deve conter apenas letras, números, hífen e underscore.",
    };
  }

  const aliasCheck = await checkIfCustomAliasExistsForUpdate(
    customAlias,
    userId,
    currentLinkId
  );

  if (aliasCheck.exists) {
    if (aliasCheck.isOwnedByUser) {
      return {
        success: false,
        error: "Você já possui outro link com este alias personalizado.",
      };
    }

    return {
      success: false,
      error:
        "Este alias personalizado já está em uso por outro usuário. Tente um alias diferente.",
    };
  }

  return { success: true };
};

// Função para validar e processar URL de update
const processUrlUpdate = async (
  originalUrl: string,
  userId: string,
  currentLinkId: string
): Promise<{ success: boolean; error?: string; url?: string }> => {
  if (!checkIsValidUrl(originalUrl)) {
    return {
      success: false,
      error: "URL inválida. Por favor, forneça uma URL válida.",
    };
  }

  const existingUrlLink = await checkIfUrlAlreadyExistsForUpdate(
    originalUrl,
    userId,
    currentLinkId
  );

  if (existingUrlLink) {
    return {
      success: false,
      error: "Você já possui outro link encurtado para esta URL.",
    };
  }

  return { success: true, url: originalUrl };
};

// Função para validar e processar alias de update
const processAliasUpdate = async (
  customAlias: string | null,
  userId: string,
  currentLinkId: string
): Promise<{ success: boolean; error?: string; alias?: string | null }> => {
  if (customAlias === null || customAlias === "") {
    return { success: true, alias: null };
  }

  const aliasResult = await processCustomAliasForUpdate(
    customAlias,
    userId,
    currentLinkId
  );

  if (!aliasResult.success) {
    return {
      success: false,
      error: aliasResult.error || "Erro ao processar alias personalizado.",
    };
  }

  return { success: true, alias: customAlias };
};

// Função para processar todas as validações de update
const processUpdateValidations = async (
  body: {
    originalUrl?: string;
    customAlias?: string | null;
    isActive?: boolean;
  },
  userId: string,
  linkId: string
): Promise<{
  success: boolean;
  error?: string;
  updateData?: Partial<{
    originalUrl: string;
    customAlias: string | null;
    isActive: boolean;
  }>;
}> => {
  const { originalUrl, customAlias, isActive } = body;
  const updateData: Partial<{
    originalUrl: string;
    customAlias: string | null;
    isActive: boolean;
  }> = {};

  // Processar URL se fornecida
  if (originalUrl !== undefined) {
    const urlResult = await processUrlUpdate(originalUrl, userId, linkId);
    if (!urlResult.success) {
      return {
        success: false,
        error: urlResult.error || "Erro ao processar URL.",
      };
    }
    if (urlResult.url) {
      updateData.originalUrl = urlResult.url;
    }
  }

  // Processar alias se fornecido
  if (customAlias !== undefined) {
    const aliasResult = await processAliasUpdate(customAlias, userId, linkId);
    if (!aliasResult.success) {
      return {
        success: false,
        error: aliasResult.error || "Erro ao processar alias.",
      };
    }
    updateData.customAlias = aliasResult.alias || null;
  }

  // Processar isActive se fornecido
  if (isActive !== undefined) {
    updateData.isActive = isActive;
  }

  // Se nenhum campo foi fornecido para atualização
  if (Object.keys(updateData).length === 0) {
    return {
      success: false,
      error: "Nenhum campo válido fornecido para atualização.",
    };
  }

  return { success: true, updateData };
};

export const updateLink = new Elysia().use(betterAuthPlugin).put(
  "/:id",
  async ({ params, body, set, user }) => {
    try {
      const { id } = params;

      if (!id || id.trim() === "" || id === "{id}") {
        set.status = HTTP_STATUS.BAD_REQUEST;
        return {
          success: false,
          error: "ID do link é obrigatório.",
        };
      }

      // Verificar se o link existe e pertence ao usuário
      const existingLink = await checkLinkOwnership(id, user.id);

      if (!existingLink) {
        set.status = HTTP_STATUS.NOT_FOUND;
        return {
          success: false,
          error: "Link não encontrado ou você não tem permissão para editá-lo.",
        };
      }

      // Processar validações
      const validationResult = await processUpdateValidations(
        body,
        user.id,
        id
      );

      if (!validationResult.success) {
        const isConflictError =
          validationResult.error?.includes("já possui") ||
          validationResult.error?.includes("em uso");
        set.status = isConflictError
          ? HTTP_STATUS.CONFLICT
          : HTTP_STATUS.BAD_REQUEST;
        return {
          success: false,
          error: validationResult.error || "Erro de validação.",
        };
      }

      // Atualizar o link no banco de dados
      const [updatedLink] = await db
        .update(links)
        .set({
          ...validationResult.updateData,
          updatedAt: new Date(),
        })
        .where(and(eq(links.id, id), eq(links.userId, user.id)))
        .returning();

      if (!updatedLink) {
        set.status = HTTP_STATUS.INTERNAL_SERVER_ERROR;
        return {
          success: false,
          error: "Erro ao atualizar link no banco de dados.",
        };
      }

      set.status = HTTP_STATUS.OK;
      return {
        success: true,
        data: {
          id: updatedLink.id,
          shortId: updatedLink.shortId,
          originalUrl: updatedLink.originalUrl,
          customAlias: updatedLink.customAlias,
          shortUrl: `${env.BETTER_AUTH_URL}/${updatedLink.shortId}`,
          clickCount: updatedLink.clickCount,
          isActive: updatedLink.isActive,
          createdAt: updatedLink.createdAt,
          updatedAt: updatedLink.updatedAt,
        },
      };
    } catch (error) {
      set.status = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      return {
        success: false,
        error: "Erro interno do servidor. Tente novamente.",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      };
    }
  },
  {
    auth: true,
    params: t.Object({
      id: t.String({
        description: "ID do link a ser atualizado",
      }),
    }),
    body: t.Object({
      originalUrl: t.Optional(
        t.String({
          minLength: 1,
          description: "Nova URL original",
          examples: ["https://www.example.com/new-page"],
        })
      ),
      customAlias: t.Optional(
        t.Union([
          t.String({
            minLength: 3,
            maxLength: 50,
            description: "Novo alias personalizado",
            examples: ["meu-novo-link"],
          }),
          t.Null({
            description: "Remover alias personalizado",
          }),
        ])
      ),
      isActive: t.Optional(
        t.Boolean({
          description: "Status ativo/inativo do link",
          examples: [true, false],
        })
      ),
    }),
    response: {
      200: t.Object({
        success: t.Literal(true),
        data: t.Object({
          id: t.String(),
          shortId: t.String(),
          originalUrl: t.String(),
          customAlias: t.Union([t.String(), t.Null()]),
          shortUrl: t.String(),
          clickCount: t.Number(),
          isActive: t.Boolean(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        }),
      }),
      400: t.Object({
        success: t.Literal(false),
        error: t.String(),
      }),
      404: t.Object({
        success: t.Literal(false),
        error: t.String(),
      }),
      409: t.Union([
        t.Object({
          success: t.Literal(false),
          error: t.String(),
        }),
        t.Object({
          success: t.Literal(false),
          error: t.String(),
          data: t.Object({
            existingLink: t.Object({
              shortId: t.String(),
              customAlias: t.Union([t.String(), t.Null()]),
              shortUrl: t.String(),
            }),
          }),
        }),
      ]),
      500: t.Object({
        success: t.Literal(false),
        error: t.String(),
        details: t.Optional(t.String()),
      }),
    },
    detail: {
      summary: "Atualizar link",
      description:
        "Atualiza um link encurtado existente (URL, alias personalizado ou status)",
      tags: ["links"],
    },
  }
);
