import I18N from "@/i18n";

const glossaryList = ["game", "item", "group", "tag", "want", "value"];

const Glossary = () => {
  return (
    <>
      <h3 className="text-section-label mb-5 text-ink">
        <I18N id="quickhelp.glossaryTerms" />
      </h3>
      <ul>
        {glossaryList.map((t) => {
          return (
            <li className="grid grid-cols-[90px_auto] gap-2 mb-4" key={t}>
              <div className="font-bold">
                <I18N id={`glossary.title.${t}`} />:
              </div>
              <div className="text-balance">
                <I18N id={`glossary.text.${t}`} />
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default Glossary;
