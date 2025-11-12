import { AlertTriangle, X } from "lucide-react";

/**
 * A reusable, responsive confirmation modal component using Daisy UI.
 *
 * @param {object} props
 * @param {boolean} props.isOpen - Controls the visibility of the modal.
 * @param {function} props.onClose - Function to call when the modal should be closed (cancel).
 * @param {function} props.onConfirm - Function to call when the user confirms the action.
 * @param {string} props.title - The main title of the confirmation box.
 * @param {string} props.message - The confirmation message (short and to the point).
 * @param {string} [props.confirmButtonText='Confirm'] - Text for the confirmation button.
 * @param {string} [props.cancelButtonText='Cancel'] - Text for the cancel button.
 * @param {string} [props.confirmButtonClassName='btn-error'] - Daisy UI class for the confirm button color.
 */
const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmButtonText = "Confirm",
  cancelButtonText = "Cancel",
  confirmButtonClassName = "btn-error",
}) => {
  if (!isOpen) {
    return null;
  }

  // use a unique ID for the dialog for accessibility, though we control visibility via props.
  const modalId = "confirmation-modal";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${modalId}-title`}
      className="modal modal-open z-50 transition-opacity duration-300"
    >
      {/* Modal content box */}
      <section className="modal-box max-w-sm sm:max-w-md p-6 bg-base-100 rounded-lg shadow-2xl">
        <div className="flex justify-between items-start mb-4">
          <h3
            id={`${modalId}-title`}
            className="text-lg sm:text-xl font-bold flex items-center text-error"
          >
            <AlertTriangle className="size-5 sm:size-6 mr-2 shrink-0" />
            {title}
          </h3>

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="btn btn-sm btn-ghost absolute top-3 right-3 p-1"
            aria-label={cancelButtonText}
          >
            <X className="size-4" />
          </button>
        </div>

        <p className="text-sm sm:text-base text-base-content/80 mb-6">
          {message}
        </p>

        {/* Action buttons */}
        <div className="modal-action mt-0">
          <button
            onClick={onClose}
            className="btn btn-sm btn-ghost hover:bg-base-200 transition-colors duration-200"
            aria-label={cancelButtonText}
          >
            {cancelButtonText}
          </button>

          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            aria-label={confirmButtonText}
            className={`btn btn-sm ${confirmButtonClassName} text-white transition-colors duration-200`}
          >
            {confirmButtonText}
          </button>
        </div>
      </section>

      <div onClick={onClose} className="modal-backdrop" />
    </div>
  );
};

export default ConfirmationModal;
