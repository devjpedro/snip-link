import { eq } from "drizzle-orm";
import Elysia, { t } from "elysia";
import { db } from "@/db/client";
import { links } from "@/db/schema/links";
import { HTTP_STATUS } from "@/http/constants/httpStatus";
import { betterAuthPlugin } from "@/http/plugins/better-auth";

export const deleteLink = new Elysia().use(betterAuthPlugin).delete(
  "/:id",
  async ({ params, user, set }) => {
    const { id: linkId } = params;

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

    await db.delete(links).where(eq(links.id, linkId));

    set.status = HTTP_STATUS.OK;

    return {
      success: true,
      message: "Link excluído com sucesso.",
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
    detail: {
      summary: "Deletar um link",
      description:
        "Deleta um link encurtado específico usando seu ID único. Apenas o proprietário do link pode deletá-lo.",
    },
  }
);
