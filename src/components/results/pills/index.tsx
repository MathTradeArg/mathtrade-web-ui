import { useContext, useMemo } from "react";
import { ResultsContext } from "@/context/results";
import { PageContext } from "@/context/page";
import Pill from "@/components/pill";
import I18N from "@/i18n";

const PillsResults = () => {
  /* PAGE CONTEXT *****************************************/
  const { mathtrade } = useContext(PageContext);
  /* end PAGE CONTEXT *****************************************/

  /* RESULTS CONTEXT *****************************************/
  const { userList } = useContext(ResultsContext);
  /* end RESULTS CONTEXT *****************************************/

  const userParticipantsValues = useMemo(() => {
    const count = userList.filter(
      (user) => user.commitment && user.trades
    ).length;
    return { count, percent: ((100 * count) / userList.length).toFixed(0) };
  }, [userList]);

  return (
    <div className="max-w-[1100px] mx-auto mb-3">
      <div className="md:flex gap-6">
        <div className="md:w-1/3 md:mb-0 mb-6">
          <Pill
            value={mathtrade?.games_count || 0}
            label="results.pill.game"
            color="mint"
            art="die"
          />
        </div>

        <div className="md:w-1/3 md:mb-0 mb-6">
          <Pill
            value={mathtrade?.items_count || 0}
            label="results.pill.item"
            color="sky"
            art="meeple"
          />
        </div>
        <div className="md:w-1/3 md:mb-0 mb-6">
          <Pill
            value={userParticipantsValues.count}
            label="results.pill.user.commit"
            color="peach"
            art="meeple"
            footer={
              <I18N
                id="stats.pill.user.footer"
                values={[userList?.length || 0, userParticipantsValues.percent]}
              />
            }
          />
        </div>
      </div>
    </div>
  );
};

export default PillsResults;
