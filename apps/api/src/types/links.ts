export type LinkType = {
  id: string;
  shortId: string;
  originalUrl: string;
  customAlias: string | null;
  clickCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};
