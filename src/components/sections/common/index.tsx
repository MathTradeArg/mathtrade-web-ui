"use client";
import { PageLoading } from "@/components/loading";
import Wrapper from "@/components/wrapper";
import clsx from "clsx";

const SectionCommon = ({
  loading = false,
  children = null,
  topNotRounded = false,
  size = "",
  title = "",
  description = null,
}) => {
  return (
    <Wrapper>
      <section
        className={clsx("relative bg-surface-soft border border-line", {
          "rounded-main": !topNotRounded,
          "rounded-b-main": topNotRounded,
          "border-t-0": topNotRounded,
        })}
      >
        {children}
        <PageLoading loading={loading} />
      </section>
    </Wrapper>
  );
};

export default SectionCommon;
