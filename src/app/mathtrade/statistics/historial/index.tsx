import Users from "./users";
import Items from "./items";
import I18N from "@/i18n";

const HistorialMT = () => {
  return (
    <div>
      <h2 className="text-card-title text-center pb-5 mb-5 text-ink">
        <I18N id="home.growing.title" />
      </h2>
      <Users />
      <Items />
    </div>
  );
};

export default HistorialMT;
