"use client";
import { PageLoading } from "@/components/loading";
import Wrapper from "@/components/wrapper";

const SectionCommon = ({
  loading = false,
  children = null,
  size = "",
  title = "",
  description = null,
  withSidebar = true,
}) => {
  return (
    <Wrapper>
      <section className="relative overflow-clip border border-line rounded-main">
        {children}
        <PageLoading loading={loading} withSidebar={withSidebar} />
      </section>
    </Wrapper>
  );
};

export default SectionCommon;
