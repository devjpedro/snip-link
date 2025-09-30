import { isNull } from "drizzle-orm";
import { db } from "@/db/client";

export const checkIfShortIdExists = async (
  shortId: string
): Promise<boolean> => {
  const existing = await db.query.links.findFirst({
    where: (linksTable, { eq }) => eq(linksTable.shortId, shortId),
  });
  return !!existing;
};

export const checkIfCustomAliasExists = async (
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

export const checkIfAliasAlreadyExists = async (
  aliasOrShortId: string,
  userId: string
): Promise<{
  id: string;
  shortId: string;
  customAlias: string | null;
  originalUrl: string;
} | null> => {
  const existing = await db.query.links.findFirst({
    where: (linksTable, { eq, and, or }) =>
      and(
        eq(linksTable.userId, userId),
        eq(linksTable.isActive, true),
        or(
          eq(linksTable.customAlias, aliasOrShortId),
          and(
            isNull(linksTable.customAlias),
            eq(linksTable.shortId, aliasOrShortId)
          )
        )
      ),
    columns: {
      id: true,
      shortId: true,
      customAlias: true,
      originalUrl: true,
    },
  });

  return existing || null;
};

export const checkIfAnonymousUrlExists = async (
  originalUrl: string
): Promise<{
  id: string;
  shortId: string;
  customAlias: string | null;
  clickCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
} | null> => {
  const existing = await db.query.links.findFirst({
    where: (linksTable, { eq, and, isNull: isNullOp }) =>
      and(
        eq(linksTable.originalUrl, originalUrl),
        isNullOp(linksTable.userId),
        eq(linksTable.isActive, true)
      ),
  });

  return existing || null;
};
