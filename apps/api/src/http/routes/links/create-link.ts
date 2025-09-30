import { env } from "@snip-link/env";
import Elysia from "elysia";
import { db } from "@/db/client";
import { links } from "@/db/schema/links";
import { HTTP_STATUS } from "@/http/constants/http-status";
import { betterAuthPlugin } from "@/http/plugins/better-auth";
import { linkBodySchema, linkResponseSchema } from "@/http/schemas/create-link";
import { checkIfAliasAlreadyExists } from "@/http/utils/check-exists";
import { validateUrlInput } from "@/http/utils/check-valid-url";
import { generateUniqueShortId } from "@/http/utils/generate-short-id";
import { processCustomAlias } from "@/http/utils/process-custom-alias";
import type { LinkType } from "@/types/links";

export const buildShortUrl = (shortId: string) => {
  return `${env.BETTER_AUTH_URL}/r/${shortId}`;
};

type CreateLinkInDatabase = {
  shortId: string;
  originalUrl: string;
  customAlias: string | undefined;
  userId?: string;
  isActive?: boolean | undefined;
};

export const createLinkInDatabase = async ({
  shortId,
  originalUrl,
  customAlias,
  userId,
  isActive,
}: CreateLinkInDatabase) => {
  const [newLink] = await db
    .insert(links)
    .values({
      shortId,
      originalUrl,
      customAlias: customAlias || null,
      userId: userId || null,
      isActive: isActive !== undefined ? isActive : true,
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

export const createPrivateLink = new Elysia().use(betterAuthPlugin).post(
  "/",
  async ({ body, set, user }) => {
    try {
      const { originalUrl, customAlias, isActive } = body;

      const urlValidation = validateUrlInput(originalUrl);
      if (!urlValidation.isValid) {
        set.status = HTTP_STATUS.BAD_REQUEST;
        return {
          success: false,
          error: urlValidation.error,
        };
      }

      const existingUrlLink = await checkIfAliasAlreadyExists(
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
              shortUrl: buildShortUrl(existingUrlLink.shortId),
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

      const newLink = await createLinkInDatabase({
        originalUrl,
        shortId,
        customAlias,
        userId: user.id,
        isActive,
      });

      if (!newLink) {
        set.status = HTTP_STATUS.INTERNAL_SERVER_ERROR;
        return {
          success: false,
          error: "Erro ao criar link.",
        };
      }

      set.status = HTTP_STATUS.CREATED;
      return buildSuccessResponse(newLink, false);
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
    body: linkBodySchema,
    response: linkResponseSchema,
    detail: {
      summary: "Criar novo link (autenticado)",
      description: "Cria um novo link encurtado para usuários logados",
    },
  }
);
