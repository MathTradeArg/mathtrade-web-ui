import Button from "@/components/button";
import Modal from "@/components/modal";
import I18N from "@/i18n";
import { useState } from "react";

const ButtonAlert = ({
  className = "",
  ariaLabel = undefined,
  disabled = false,
  children,
  onClick,
  title,
  description = "",
  confirmId = "Yes",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleIsOpen = (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    setIsOpen((v) => !v);
  };

  return (
    <>
      <button
        type="button"
        className={className}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={toggleIsOpen}
      >
        {children}
      </button>
      <Modal size="sm" isOpen={isOpen} onClose={toggleIsOpen}>
        <div className="text-center">
          <h3 className="text-xl mb-2 font-bold">
            <I18N id={title} />
          </h3>
          {description ? (
            <p className="text-sm text-gray-600 text-balance">
              <I18N id={description} />
            </p>
          ) : null}
          <div className="flex items-center justify-center gap-3 pt-4">
            <Button type="button" color="cancel" outline onClick={toggleIsOpen}>
              <I18N id="btn.Cancel" />
            </Button>
            <Button
              type="button"
              color="danger"
              className="px-9"
              onClick={(e) => {
                toggleIsOpen(e);
                if (onClick) {
                  onClick();
                }
              }}
            >
              <I18N id={confirmId} />
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ButtonAlert;
