import * as VisuallyHiddenPrimitive from "@radix-ui/react-visually-hidden";

export const VisuallyHidden = ({ children }: React.PropsWithChildren) => {
  return (
    <VisuallyHiddenPrimitive.Root>{children}</VisuallyHiddenPrimitive.Root>
  );
};
