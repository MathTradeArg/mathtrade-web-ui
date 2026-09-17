"use client";
import { useContext, useMemo } from "react";
import { ResultsContext } from "@/context/results";
import { getI18Ntext } from "@/i18n";
import { InputContainer, Select, Label } from "@/components/form";

const UserSelector = ({ compact = false }: { compact?: boolean }) => {
  const {
    userList,
    currentUserId: user,
    setCurrentUserId,
  } = useContext(ResultsContext);

  const userListForSelector = useMemo(() => {
    return [...(userList || [])]
      .sort((a, b) => (a.last_name < b.last_name ? -1 : 1))
      .map((entry) => {
        const {
          id: value,
          first_name,
          last_name,
          location,
          commitment,
          trades: tradesPre,
        } = entry;
        const trades = commitment ? tradesPre : 0;
        return {
          value,
          text: `${first_name} ${last_name} (${
            location?.name || ""
          }), ${trades} ${getI18Ntext(
            trades === 1 ? "result.trade" : "result.trades"
          )}`,
        };
      });
  }, [userList]);

  return (
    <div className={compact ? "w-full min-w-0 sm:w-auto sm:max-w-sm sm:flex-1" : "max-w-lg mx-auto py-4"}>
      <InputContainer className={compact ? "mb-0" : undefined}>
        {compact ? null : <Label text="filter.User" name="user" size="sm" />}
        <Select
          data={{ user }}
          name="user"
          options={userListForSelector}
          icon="user"
          size="sm"
          ariaLabel="filter.User"
          onChange={(v) => {
            if (v) {
              setCurrentUserId(v);
            }
          }}
        />
      </InputContainer>
    </div>
  );
};

export default UserSelector;
