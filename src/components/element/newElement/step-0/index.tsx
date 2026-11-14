import InnerButton from "@/components/button/inner-button";
import Icon from "@/components/icon";
import I18N from "@/i18n";

const NewElementStep0 = ({ setStep, onOpenImportBgg }) => {
  return (
    <>
      <div className="text-center flex items-center justify-center gap-3">
        <button
          className="border border-ink text-ink text-xs px-4 py-2 rounded-full hover:bg-ink hover:text-white transition-colors"
          onClick={() => {
            setStep(1);
          }}
        >
          <InnerButton>
            <Icon type="plus" className="text-xl" />
            <I18N id="btn.MyCollection.addNewItem" />
          </InnerButton>
        </button>
        {onOpenImportBgg && (
          <button
            data-tour="mycollection.importBgg"
            className="border border-secondary text-secondary text-xs px-4 py-2 rounded-full hover:bg-secondary hover:text-white transition-colors"
            onClick={onOpenImportBgg}
          >
            <InnerButton>
              <Icon type="bgg" className="text-xl" />
              <span>Importar colección BGG</span>
            </InnerButton>
          </button>
        )}
      </div>
    </>
  );
};

export default NewElementStep0;
