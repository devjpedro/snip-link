export const getDomain = (url: string) => {
  try {
    const { hostname } = new URL(url);
    return hostname;
  } catch {
    return "localhost";
  }
};
