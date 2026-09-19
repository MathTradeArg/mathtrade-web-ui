"use client";
import { useContext } from "react";
import { ResultsContext } from "@/context/results";
import Table from "@/components/table";
import columns from "./columns";

const ResultsTable = () => {
  const { MathTradeResults } = useContext(ResultsContext);

  return (
    <Table
      header={null}
      data={MathTradeResults || []}
      columns={columns}
      downloadExcel="resultados"
      loading={false}
      error={null}
      rowsProps={null}
      searchValuesFunc={(result) => {
        const { item_to, membership_to, item_from, membership_from } = result;

        return `${item_to?.title || ""} ${membership_to?.first_name || ""} ${
          membership_to?.last_name || ""
        } ${membership_to?.location?.name || ""} ${item_from?.title || ""} ${
          membership_from?.first_name || ""
        } ${membership_from?.last_name || ""} ${
          membership_from?.location?.name || ""
        }`;
      }}
    />
  );
};

export default ResultsTable;
