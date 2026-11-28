import { Suspense } from "react";
import type { ReactNode } from "react";
import { InlineLoading } from "@/components/loading";

export const FallbackLoading = ({ h }: { h: number | string }) => (
  <InlineLoading minHeight={h} />
);

const Dynamic = ({ children, h = 450 }: { children?: ReactNode; h?: number | string }) => {
  return <Suspense fallback={<FallbackLoading h={h} />}>{children}</Suspense>;
};
export default Dynamic;
