import I18N from "@/i18n";
import ItemOfGame from "./item";

const GameItemList = ({
  items,
  itemCount,
  groupWantList,
  setGroupWantList,
  ownList,
}) => {
  return (
    <div className="pt-4">
      <h4 className="mb-3 text-caption text-gray-500 font-medium">
        {`${itemCount} `}
        <I18N
          id={itemCount === 1 ? "game.item-num.1" : "game.item-num.more"}
        />
      </h4>
      <div className="flex flex-col gap-2">
        {items.map((item) => {
          return (
            <ItemOfGame
              key={item.id}
              item={item}
              groupWantList={groupWantList}
              setGroupWantList={setGroupWantList}
              ownList={ownList}
            />
          );
        })}
      </div>
    </div>
  );
};

export default GameItemList;
