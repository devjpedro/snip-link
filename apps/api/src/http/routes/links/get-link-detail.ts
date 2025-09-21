import Elysia, { t } from "elysia";
import { db } from "@/db/client";
import { HTTP_STATUS } from "@/http/constants/httpStatus";
import { betterAuthPlugin } from "@/http/plugins/better-auth";

export const getLinkDetail = new Elysia().use(betterAuthPlugin).get(
  ":id",
  async ({ params, set, user }) => {
    const { id: linkId } = params;

    if (!linkId || linkId.trim() === "") {
      set.status = HTTP_STATUS.BAD_REQUEST;
      return {
        success: false,
        error: "ID do link é obrigatório.",
      };
    }

    const link = await db.query.links.findFirst({
      where(fields, { eq }) {
        return eq(fields.id, linkId);
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

    set.status = HTTP_STATUS.OK;
    return {
      success: true,
      data: link,
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
      summary: "Obter detalhes do link encurtado pelo ID",
      description:
        "Recupera as informações de um link encurtado específico usando seu ID único.",
    },
  }
);
