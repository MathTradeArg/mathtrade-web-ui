"use client";
import { PageLoading } from "@/components/loading";
import Wrapper from "@/components/wrapper";

const SectionCommon = ({
  loading = false,
  children = null,
  size = "",
  title = "",
  description = null,
}) => {
  return (
    <Wrapper>
      <section className="relative border border-line rounded-main">
        {children}
        <PageLoading loading={loading} />
      </section>
    </Wrapper>
  );
};

export default SectionCommon;
