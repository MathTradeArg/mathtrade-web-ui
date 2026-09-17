"use client";
import HelpContext from "@/components/help-context";
import useTagSelector from "./useTagSelector";
import NewItemTag from "@/components/item-tags/new-item-tag";
import FilterBlock from "../block";
import { Select } from "@/components/form";

const TagSelector = () => {
  const { tagOptions, data, canIEdit } = useTagSelector();

  return (
    <FilterBlock titleId="itemList.Tags.title" hintId="filter.tags.hint">
      <div className="mb-2">
        <HelpContext id="whatIsTag" variant="link" />
      </div>
      <Select
        data={data}
        name="tag"
        options={tagOptions}
        unique
        size="sm"
        ariaLabel="itemList.Tags.title"
        customRenderOption={(option: {
          value?: string;
          text?: string;
          colorStyles?: Record<string, string>;
        }) =>
          option.value && option.colorStyles ? (
            <span
              className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold"
              style={option.colorStyles}
            >
              {option.text}
            </span>
          ) : (
            option.text
          )
        }
      />
      {canIEdit ? <NewItemTag /> : null}
    </FilterBlock>
  );
};

export default TagSelector;
