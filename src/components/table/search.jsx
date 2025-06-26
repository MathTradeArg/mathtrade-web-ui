import I18N, { getI18Ntext } from "@/i18n";

const Search = ({ searchValue, setSearchValue }) => {
  return (
    <div className="flex items-center gap-1">
      <label className="block text-sm font-bold text-gray-500 whitespace-nowrap">
        <I18N id="filter.Search" />
      </label>
      <input
        type="text"
        placeholder={getI18Ntext("filter.Search")}
        value={searchValue || ""}
        onChange={({ target }) => {
          setSearchValue(target.value);
        }}
        className="border border-stroke rounded-md p-1 text-xs focus:outline-none"
      />
    </div>
  );
};

export default Search;
