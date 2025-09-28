import { env } from "@snip-link/env";
import Elysia from "elysia";
import { db } from "@/db/client";
import { links } from "@/db/schema/links";
import { HTTP_STATUS } from "@/http/constants/http-status";
import { linkBodySchema, linkResponseSchema } from "@/http/schemas/create-link";
import { checkIfAnonymousUrlExists } from "@/http/utils/check-exists";
import { validateUrlInput } from "@/http/utils/check-valid-url";
import { generateUniqueShortId } from "@/http/utils/generate-short-id";
import { processCustomAlias } from "@/http/utils/process-custom-alias";
import type { LinkType } from "@/types/links";

export const buildShortUrl = (shortId: string) => {
  return `${env.BETTER_AUTH_URL}/r/${shortId}`;
};

export const createLinkInDatabase = async (
  shortId: string,
  originalUrl: string,
  customAlias: string | undefined,
  userId?: string
) => {
  const [newLink] = await db
    .insert(links)
    .values({
      shortId,
      originalUrl,
      customAlias: customAlias || null,
      userId: userId || null,
    })
    .returning();

  return newLink;
};

export const buildSuccessResponse = (
  newLink: LinkType,
  isAnonymous = false
) => {
  return {
    success: true,
    data: {
      id: newLink.id,
      shortId: newLink.shortId,
      originalUrl: newLink.originalUrl,
      customAlias: newLink.customAlias,
      shortUrl: buildShortUrl(newLink.shortId),
      clickCount: newLink.clickCount,
      isActive: newLink.isActive,
      createdAt: newLink.createdAt,
      updatedAt: newLink.updatedAt,
      isAnonymous,
    },
  };
};

export const createPublicLink = new Elysia().post(
  "/public",
  async ({ body, set }) => {
    try {
      const { originalUrl, customAlias } = body;

      const urlValidation = validateUrlInput(originalUrl);
      if (!urlValidation.isValid) {
        set.status = HTTP_STATUS.BAD_REQUEST;
        return {
          success: false,
          error: urlValidation.error,
        };
      }

      const existingAnonymousLink =
        await checkIfAnonymousUrlExists(originalUrl);

      if (existingAnonymousLink) {
        set.status = HTTP_STATUS.OK;
        return {
          success: true,
          message: "Link já existe. Retornando link existente.",
          data: {
            id: existingAnonymousLink.id,
            shortId: existingAnonymousLink.shortId,
            originalUrl,
            customAlias: existingAnonymousLink.customAlias,
            shortUrl: buildShortUrl(existingAnonymousLink.shortId),
            clickCount: existingAnonymousLink.clickCount,
            isActive: existingAnonymousLink.isActive,
            createdAt: existingAnonymousLink.createdAt,
            updatedAt: existingAnonymousLink.updatedAt,
            isAnonymous: true,
          },
        };
      }
      // Se existe link anônimo MAS com alias diferente, continua para criar novo

      let shortId: string;

      if (customAlias) {
        const aliasResult = await processCustomAlias(customAlias);
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
        customAlias
      );

      if (!newLink) {
        set.status = HTTP_STATUS.INTERNAL_SERVER_ERROR;
        return {
          success: false,
          error: "Erro ao criar link.",
        };
      }

      set.status = HTTP_STATUS.CREATED;
      return buildSuccessResponse(newLink, true);
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
    body: linkBodySchema,
    response: linkResponseSchema,
    detail: {
      summary: "Criar novo link público",
      description: "Cria um novo link encurtado para usuários não logados",
    },
  }
);
