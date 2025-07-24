import { useMemo } from "react";

import { InputContainer, Select, Label } from "@/components/form";

const Selector = ({ list, selected, onChange }) => {
  const options = useMemo(() => {
    if (!list || list.length === 0) {
      return [];
    }

    return list.map((mt) => {
      return {
        value: mt.id,
        text: mt.name,
      };
    });
  }, [list]);

  return (
    <div className="max-w-lg mx-auto py-4">
      <InputContainer>
        <Label
          text="results.historial.labelSelector"
          name="selected"
          size="sm"
        />
        <Select
          data={{ selected }}
          name="selected"
          options={options}
          onChange={(v) => {
            if (v) {
              onChange(v);
            }
          }}
        />
      </InputContainer>
    </div>
  );
};

export default Selector;
