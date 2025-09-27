import { env } from "@snip-link/env";
import Elysia, { t } from "elysia";
import { db } from "@/db/client";
import { links } from "@/db/schema/links";
import { HTTP_STATUS } from "@/http/constants/http-status";
import { betterAuthPlugin } from "@/http/plugins/better-auth";
import { checkIsValidUrl } from "@/http/utils/check-valid-url";
import { generateShortId } from "@/http/utils/generate-short-id";
import { validateCustomAlias } from "@/http/utils/validate-custom-alias";

const MAX_GENERATION_ATTEMPTS = 10;

const checkIfShortIdExists = async (shortId: string): Promise<boolean> => {
  const existing = await db.query.links.findFirst({
    where: (linksTable, { eq }) => eq(linksTable.shortId, shortId),
  });
  return !!existing;
};

const checkIfCustomAliasExists = async (
  customAlias: string,
  userId?: string
): Promise<{ exists: boolean; isOwnedByUser: boolean; isGlobal: boolean }> => {
  const globalExisting = await db.query.links.findFirst({
    where: (linksTable, { eq }) => eq(linksTable.customAlias, customAlias),
  });

  if (!globalExisting) {
    return { exists: false, isOwnedByUser: false, isGlobal: false };
  }

  const isOwnedByUser = userId ? globalExisting.userId === userId : false;

  return {
    exists: true,
    isOwnedByUser,
    isGlobal: true,
  };
};

const checkIfUrlAlreadyExists = async (
  originalUrl: string,
  userId: string
): Promise<{
  id: string;
  shortId: string;
  customAlias: string | null;
} | null> => {
  const existing = await db.query.links.findFirst({
    where: (linksTable, { eq, and }) =>
      and(
        eq(linksTable.originalUrl, originalUrl),
        eq(linksTable.userId, userId),
        eq(linksTable.isActive, true)
      ),
    columns: {
      id: true,
      shortId: true,
      customAlias: true,
    },
  });

  return existing || null;
};

// Gerar shortId único com tentativas
const generateUniqueShortId = async (): Promise<string | null> => {
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

// Processar validação de customAlias
const processCustomAlias = async (
  customAlias: string,
  userId: string
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

// Processar criação do link
const createLinkInDatabase = async (
  shortId: string,
  originalUrl: string,
  customAlias: string | undefined,
  userId: string
) => {
  const [newLink] = await db
    .insert(links)
    .values({
      shortId,
      originalUrl,
      customAlias: customAlias || null,
      userId,
    })
    .returning();

  return newLink;
};

export const createLink = new Elysia().use(betterAuthPlugin).post(
  "/",
  async ({ body, set, user }) => {
    try {
      const { originalUrl, customAlias } = body;

      if (!checkIsValidUrl(originalUrl)) {
        set.status = HTTP_STATUS.BAD_REQUEST;
        return {
          success: false,
          error: "URL inválida. Por favor, forneça uma URL válida.",
        };
      }

      const existingUrlLink = await checkIfUrlAlreadyExists(
        originalUrl,
        user.id
      );

      if (existingUrlLink) {
        set.status = HTTP_STATUS.CONFLICT;
        return {
          success: false,
          error: "Você já possui um link encurtado para esta URL.",
          data: {
            existingLink: {
              shortId: existingUrlLink.shortId,
              customAlias: existingUrlLink.customAlias,
              shortUrl: `${env.BETTER_AUTH_URL}/${existingUrlLink.shortId}`,
            },
          },
        };
      }

      let shortId: string;

      if (customAlias) {
        const aliasResult = await processCustomAlias(customAlias, user.id);
        if (!aliasResult.success) {
          set.status = HTTP_STATUS.CONFLICT;
          return {
            success: false,
            error:
              aliasResult.error || "Erro ao processar alias personalizado.",
          };
        }

        if (!aliasResult.shortId) {
          set.status = HTTP_STATUS.INTERNAL_SERVER_ERROR;
          return {
            success: false,
            error: "Erro ao processar alias personalizado.",
          };
        }

        shortId = aliasResult.shortId;
      } else {
        const generatedShortId = await generateUniqueShortId();
        if (!generatedShortId) {
          set.status = HTTP_STATUS.INTERNAL_SERVER_ERROR;
          return {
            success: false,
            error: "Erro ao gerar ID único. Tente novamente.",
          };
        }
        shortId = generatedShortId;
      }

      const newLink = await createLinkInDatabase(
        shortId,
        originalUrl,
        customAlias,
        user.id
      );

      if (!newLink) {
        set.status = HTTP_STATUS.INTERNAL_SERVER_ERROR;
        return {
          success: false,
          error: "Erro ao criar link.",
        };
      }

      set.status = HTTP_STATUS.CREATED;
      return {
        success: true,
        data: {
          id: newLink.id,
          shortId: newLink.shortId,
          originalUrl: newLink.originalUrl,
          customAlias: newLink.customAlias,
          shortUrl: `${env.BETTER_AUTH_URL}/${newLink.shortId}`,
          clickCount: newLink.clickCount,
          isActive: newLink.isActive,
          createdAt: newLink.createdAt,
          updatedAt: newLink.updatedAt,
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
    body: t.Object({
      originalUrl: t.String({
        minLength: 1,
        description: "URL original para encurtar",
        examples: ["https://www.example.com"],
      }),
      customAlias: t.Optional(
        t.String({
          minLength: 3,
          maxLength: 50,
          description: "Alias personalizado opcional",
          examples: ["meu-link"],
        })
      ),
    }),
    response: {
      201: t.Object({
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
      summary: "Criar novo link",
      description: "Cria um novo link encurtado com alias opcional",
    },
  }
);
