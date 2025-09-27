import { t } from "elysia";

export const linkBodySchema = t.Object({
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
});

export const linkResponseSchema = {
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
      isAnonymous: t.Boolean(),
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
};
