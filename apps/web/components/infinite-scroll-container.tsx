import { useInView } from "react-intersection-observer";

export const InfiniteScrollContainer = ({
  children,
  onBottom,
  className,
}: {
  children: React.ReactNode;
  className?: string;
  onBottom: () => void;
}) => {
  const { ref } = useInView({
    rootMargin: "50px",
    onChange: (inView) => {
      if (inView) onBottom();
    },
  });

  return (
    <div className={className}>
      {children}
      <div ref={ref} />
    </div>
  );
};
