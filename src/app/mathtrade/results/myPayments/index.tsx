"use client";
import { useState } from "react";
import I18N from "@/i18n";
import CopyValue from "@/components/copyValue";
import { amountSign, formatAmount, negateAmount } from "@/utils/money";
import ReceiptSection from "./ReceiptSection";
import RefundSection from "./RefundSection";
import { paymentOutcome, refundAmount } from "./paymentOutcome";
import type { MyPayments as MyPaymentsData } from "./types";

const COLLAPSE_OVER = 10;

// Fetched once by the results page (useMyPayments) and passed down.
const MyPayments = ({
  data = null,
  onChanged = () => {},
  readOnly = false,
}: {
  data?: MyPaymentsData | null;
  onChanged?: () => void;
  // Admin preview (Envíos > Pagos): same view, no receipt upload or refund form.
  readOnly?: boolean;
}) => {
  const [expanded, setExpanded] = useState(false);

  if (!data || data.published !== true) return null;

  const {
    games_count,
    price_per_game,
    base_amount,
    shipping_amount,
    total_to_transfer,
    credit_amount,
    referente_shipping,
    account,
    receipt,
    refund,
  } = data;
  const breakdown = Array.isArray(data.breakdown) ? data.breakdown : [];
  // Older bodies have no net: the gross is what is due.
  const net_amount = data.net_amount ?? total_to_transfer;
  const hasCredit = amountSign(credit_amount) > 0;

  if (games_count === 0 && !hasCredit) {
    return (
      <div className="md:px-7 px-3 py-7">
        <p>
          <I18N id="payments.noGames" />
        </p>
      </div>
    );
  }

  const outcome = paymentOutcome(net_amount);
  const hasShipping = Number(shipping_amount) > 0;
  const collapsible = breakdown.length > COLLAPSE_OVER;

  return (
    <div className="md:px-7 px-3 py-7 flex flex-col gap-6">
      <section>
        <h2 className="text-lg font-semibold mb-2">
          <I18N id={`payments.outcome.${outcome}.title`} />
        </h2>
        {games_count === 0 ? (
          <p className="text-sm mb-2">
            <I18N id="payments.noGamesRefund" />
          </p>
        ) : null}
        <div className="bg-white border border-stroke rounded-md px-3 py-3 mb-4">
          <p className="text-gray-500 text-sm">
            <I18N id={`payments.outcome.${outcome}.label`} />
          </p>
          <p className="text-2xl font-bold mb-2">
            {outcome === "refund"
              ? formatAmount(refundAmount(net_amount))
              : formatAmount(net_amount)}
          </p>
          <ul className="text-sm">
            {games_count > 0 && (
              <li className="flex justify-between gap-2">
                <span>
                  <I18N
                    id="payments.toTransfer.base"
                    values={[games_count, formatAmount(price_per_game)]}
                  />
                </span>
                <span>{formatAmount(base_amount)}</span>
              </li>
            )}
            {hasShipping && (
              <li className="flex justify-between gap-2">
                <span>
                  <I18N id="payments.toTransfer.shipping" />
                </span>
                <span>{formatAmount(shipping_amount)}</span>
              </li>
            )}
            {hasCredit && (
              <li className="flex justify-between gap-2">
                <span>
                  <I18N id="payments.toTransfer.credit" />
                </span>
                <span>{formatAmount(negateAmount(credit_amount))}</span>
              </li>
            )}
          </ul>
        </div>

        {outcome === "zero" ? (
          <p className="text-sm">
            <I18N id="payments.outcome.zero.note" />
          </p>
        ) : null}

        {outcome === "transfer" ? (
          <>
            <h3 className="font-medium mb-1">
              <I18N id="payments.account.title" />
            </h3>
            {account ? (
              <div className="bg-white border border-stroke rounded-md px-3 py-2">
                <CopyValue label="payments.account.holder" value={account.holder_name} />
                <CopyValue label="payments.account.alias" value={account.alias} />
                <CopyValue label="payments.account.cbu" value={account.cbu} />
                <CopyValue label="payments.account.bank" value={account.bank} />
              </div>
            ) : (
              <p className="text-sm">
                <I18N id="payments.noAccount" />
              </p>
            )}
          </>
        ) : null}
      </section>

      {outcome === "refund" && refund ? (
        <RefundSection
          refund={refund}
          amount={refundAmount(net_amount)}
          onChanged={onChanged}
          readOnly={readOnly}
        />
      ) : null}

      {outcome === "transfer" && account && receipt ? (
        <ReceiptSection receipt={receipt} onChanged={onChanged} readOnly={readOnly} />
      ) : null}

      {breakdown.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-2">
            <I18N id="payments.breakdown.title" />
          </h2>
          {collapsible && (
            <button
              type="button"
              className="text-sky-600 hover:text-sky-800 text-sm mb-2"
              onClick={() => setExpanded((v) => !v)}
            >
              <I18N id={expanded ? "payments.breakdown.hide" : "payments.breakdown.show"} />
            </button>
          )}
          {(!collapsible || expanded) && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500">
                    <th className="py-1 pr-2 font-normal">
                      <I18N id="payments.breakdown.game" />
                    </th>
                    <th className="py-1 px-2 font-normal text-right">
                      <I18N id="payments.breakdown.base" />
                    </th>
                    <th className="py-1 pl-2 font-normal text-right">
                      <I18N id="payments.breakdown.shipping" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {breakdown.map((line) => (
                    <tr key={line.trade_id} className="border-t border-stroke">
                      <td className="py-1 pr-2">{line.item_title}</td>
                      <td className="py-1 px-2 text-right whitespace-nowrap">
                        {formatAmount(line.base)}
                      </td>
                      <td className="py-1 pl-2 text-right whitespace-nowrap">
                        {formatAmount(line.shipping)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* Shipping to the referente is not calculated here: only a notice. */}
      {referente_shipping === true && (
        <p className="bg-gray-50 border border-dashed border-gray-300 rounded-md px-3 py-2 text-sm">
          <I18N id="payments.referenteShipping.notice" />
        </p>
      )}
    </div>
  );
};

export default MyPayments;
