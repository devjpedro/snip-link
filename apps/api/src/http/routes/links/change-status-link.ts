import { eq } from "drizzle-orm";
import Elysia, { t } from "elysia";
import { db } from "@/db/client";
import { links } from "@/db/schema/links";
import { HTTP_STATUS } from "@/http/constants/http-status";
import { betterAuthPlugin } from "@/http/plugins/better-auth";

export const changeStatusLink = new Elysia().use(betterAuthPlugin).patch(
  ":id/status",
  async ({ params, set, user, body }) => {
    const { id: linkId } = params;
    const { isActive } = body;

    if (!linkId || linkId.trim() === "" || linkId === "{id}") {
      set.status = HTTP_STATUS.BAD_REQUEST;
      return {
        success: false,
        error: "ID do link é obrigatório.",
      };
    }

    const link = await db.query.links.findFirst({
      where(fields, { eq: eqOp }) {
        return eqOp(fields.id, linkId);
      },
    });

    if (!link) {
      set.status = HTTP_STATUS.NOT_FOUND;
      return {
        success: false,
        error: "O link solicitado não foi encontrado.",
      };
    }

    if (link?.userId !== user.id) {
      set.status = HTTP_STATUS.FORBIDDEN;

      return {
        success: false,
        error: "Acesso negado. Este link não pertence a você.",
      };
    }

    await db.update(links).set({ isActive }).where(eq(links.id, linkId));

    set.status = HTTP_STATUS.CREATED;
    return {
      success: true,
      message: `Link ${isActive ? "ativado" : "desativado"} com sucesso.`,
    };
  },
  {
    auth: true,
    params: t.Object({
      id: t.String({
        examples: ["abc123"],
        description: "ID do link encurtado",
        minLength: 1,
      }),
    }),
    body: t.Object({
      isActive: t.Boolean({
        description: "Novo status do link (ativo ou inativo)",
        examples: [true, false],
      }),
    }),
    detail: {
      summary: "Alterar status do link",
      description:
        "Ativa ou desativa um link encurtado específico usando seu ID único.",
    },
  }
);
