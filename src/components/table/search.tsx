"use client";
import ListSearch from "@/components/list-toolbar/search";

const Search = ({
  searchValue = "",
  setSearchValue = (_value: string) => {},
}: {
  searchValue?: string;
  setSearchValue?: (value: string) => void;
}) => {
  return (
    <div className="w-full min-w-0 sm:w-64">
      <ListSearch value={searchValue} onChange={setSearchValue} />
    </div>
  );
};

export default Search;
