import I18N, { getI18Ntext } from "@/i18n";
import ItemOfGame from "./item";
import useGameList from "./useGameList";

const GameItemList = () => {
  const { items, itemCount } = useGameList();

  return (
    <>
      <div className="text-ink lg:p-4 py-4 px-2">
        <h4 className="text-card-title mb-3 text-ink">
          {`${itemCount} `}
          <I18N
            id={itemCount === 1 ? "game.item-num.1" : "game.item-num.more"}
          />
          :
        </h4>
        <div className="flex flex-col gap-2">
          {itemCount === 0 ? (
            // The backend already excludes ignored-owner copies from
            // `items` — a game can legitimately reach here with none left
            // visible (MAT-120), so say why instead of showing nothing.
            <p className="text-ink-muted text-caption italic">
              <I18N id="game.noVisibleItems" />
            </p>
          ) : (
            items.map((item) => {
              return <ItemOfGame key={item.id} item={item} />;
            })
          )}
        </div>
      </div>
    </>
  );
};

export default GameItemList;
