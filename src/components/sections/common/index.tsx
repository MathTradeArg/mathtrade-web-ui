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
        className={clsx("relative bg-white shadow-main", {
          "rounded-main": !topNotRounded,
          "rounded-b-main": topNotRounded,
        })}
      >
        {children}
        <PageLoading loading={loading} />
      </section>
    </Wrapper>
  );
};

export default SectionCommon;
