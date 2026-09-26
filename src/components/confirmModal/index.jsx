import Button from "@/components/button";
import Modal from "@/components/modal";
import I18N from "@/i18n";

// A controlled "are you sure?" modal, for confirmations that only apply in
// some cases (ButtonAlert always asks).
const ConfirmModal = ({
  isOpen,
  onCancel,
  onConfirm,
  title,
  titleValues = [],
  description = "",
  descriptionValues = [],
  cancelId = "btn.Cancel",
  confirmId = "Yes",
}) => (
  <Modal size="sm" isOpen={isOpen} onClose={onCancel}>
    <div className="text-center">
      <h3 className="text-xl mb-2 font-bold">
        <I18N id={title} values={titleValues} />
      </h3>
      {description ? (
        <p className="text-sm text-gray-700 text-balance">
          <I18N id={description} values={descriptionValues} />
        </p>
      ) : null}
      <div className="flex items-center justify-center gap-3 pt-4">
        <Button type="button" color="cancel" outline onClick={onCancel}>
          <I18N id={cancelId} />
        </Button>
        <Button
          type="button"
          color="danger"
          className="px-6"
          onClick={onConfirm}
        >
          <I18N id={confirmId} />
        </Button>
      </div>
    </div>
  </Modal>
);

export default ConfirmModal;
