"use client";
import { useState, type ComponentType } from "react";
import Modal from "@/components/modal";
import Button from "@/components/button";
import I18N, { getI18Ntext } from "@/i18n";
import ErrorAlert from "@/components/errorAlert";
import { LoadingBox } from "@/components/loading";
import PhotoGalleryRaw from "@/components/photoGallery";
import DeliveryReportThread from "@/components/deliveryReport/thread";
import { resolveApiErrorMessage } from "@/utils/apiError";
import {
  DELIVERY_REPORT_MAX_PHOTOS,
  splitPhotos,
  validateReportForm,
} from "@/utils/deliveryReports";
import useDeliveryReport from "./useDeliveryReport";

// The gallery is still plain JS: its props are not inferred.
const PhotoGallery = PhotoGalleryRaw as unknown as ComponentType<Record<string, unknown>>;

export type DeliveryReportTarget = {
  title: string;
  // Create mode: the user's own trade id (as in "marcar como recibido").
  idResult?: number | string | null;
  // View mode: an existing report.
  reportId?: number | null;
};

const CreateForm = ({
  onCancel,
  create,
  sending,
  error,
}: {
  onCancel: () => void;
  create: (comment: string, images: string[]) => void;
  sending: boolean;
  error: any;
}) => {
  const [comment, setComment] = useState("");
  const [images, setImages] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const errors = validateReportForm(comment, images);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
        if (sending || errors.comment || errors.images) return;
        create(comment, splitPhotos(images));
      }}
    >
      <p className="text-balance text-center mb-4 text-sm">
        <I18N id="deliveryReport.help" />
      </p>
      <label className="block text-xs font-bold uppercase text-gray-500 mb-1" htmlFor="delivery-report-comment">
        <I18N id="deliveryReport.comment" />
      </label>
      <textarea
        id="delivery-report-comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={4}
        className="input block w-full rounded-md border border-stroke bg-white p-2 text-sm text-gray-900 shadow-sm focus:border-primary focus:outline-none"
      />
      {submitted && errors.comment ? (
        <p role="alert" className="text-xs text-red-600 mt-1">
          <I18N id="deliveryReport.error.comment" />
        </p>
      ) : null}
      <div className="mt-4">
        <PhotoGallery
          images={images}
          setImages={setImages}
          max={DELIVERY_REPORT_MAX_PHOTOS}
          extended
          title="deliveryReport.photos"
          subtitle="deliveryReport.photos.hint"
        />
      </div>
      {submitted && errors.images ? (
        <p role="alert" className="text-xs text-red-600 mt-1">
          <I18N id="deliveryReport.error.photos" />
        </p>
      ) : null}
      <ErrorAlert error={error} errorMessage={resolveApiErrorMessage(error)} className="mt-3" />
      <div className="flex items-center justify-center gap-4 pt-4 pb-2">
        <button
          type="button"
          className="border border-gray-300 text-gray-500 font-bold px-6 py-1 rounded-full hover:bg-gray-400 hover:text-white transition-colors"
          onClick={onCancel}
        >
          {getI18Ntext("btn.Cancel")}
        </button>
        <Button type="submit" disabled={sending}>
          <I18N id="deliveryReport.submit" />
        </Button>
      </div>
    </form>
  );
};

// Mounted only while a target is open, so each opening starts clean.
const ModalBody = ({
  target,
  onClose,
  onChanged,
}: {
  target: DeliveryReportTarget;
  onClose: () => void;
  onChanged: () => void;
}) => {
  const isView = Boolean(target.reportId);
  const {
    report,
    create,
    sending,
    errorCreate,
    loadingReport,
    errorLoad,
    close,
    closing,
    errorClose,
    changed,
  } = useDeliveryReport({
    idResult: target.idResult,
    reportId: target.reportId ?? null,
    onChanged,
  });

  return (
    <>
      <h2 className="text-center text-balance font-bold text-xl mb-4">
        <I18N id="deliveryReport.title" values={[target.title || ""]} />
      </h2>
      {isView || report ? (
        <>
          <ErrorAlert error={errorLoad} errorMessage="deliveryReport.error.load" />
          {report ? (
            <DeliveryReportThread
              report={report}
              onChanged={changed}
              onClose={close}
              closing={closing}
              closeError={errorClose}
            />
          ) : null}
          <LoadingBox loading={loadingReport} min />
        </>
      ) : (
        <>
          <CreateForm
            onCancel={onClose}
            create={create}
            sending={sending}
            error={errorCreate}
          />
          <LoadingBox loading={sending} min />
        </>
      )}
    </>
  );
};

// "Reportar problema" (create) and "Ver reporte" (thread) of a received game.
const DeliveryReportModal = ({
  target,
  onClose,
  onChanged,
}: {
  target: DeliveryReportTarget | null;
  onClose: () => void;
  onChanged: () => void;
}) => (
  <Modal isOpen={target !== null} onClose={onClose} size="md">
    {target ? <ModalBody target={target} onClose={onClose} onChanged={onChanged} /> : null}
  </Modal>
);

export default DeliveryReportModal;
