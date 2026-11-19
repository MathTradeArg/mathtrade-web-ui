"use client";
import { useState } from "react";
import I18N from "@/i18n";
import { LoadingBox } from "@/components/loading";
import { CopyValue, formatAmount } from "@/app/mathtrade/my-data/ContributionBox";
import useMyPayments from "./useMyPayments";

const COLLAPSE_OVER = 10;

const MyPayments = () => {
  const { data, loading } = useMyPayments();
  const [expanded, setExpanded] = useState(false);

  if (loading && !data) return <LoadingBox loading />;
  if (!data || data.published !== true) return null;

  const {
    games_count,
    price_per_game,
    base_amount,
    shipping_amount,
    total_to_transfer,
    suggested_amount,
    partial,
    breakdown,
    account,
  } = data;

  if (games_count === 0) {
    return (
      <div className="md:px-7 px-3 py-7">
        <p>
          <I18N id="payments.noGames" />
        </p>
      </div>
    );
  }

  const hasShipping = Number(shipping_amount) > 0;
  const collapsible = breakdown.length > COLLAPSE_OVER;

  return (
    <div className="md:px-7 px-3 py-7 flex flex-col gap-6">
      {partial && (
        <p className="bg-amber-50 border border-amber-300 rounded-md px-3 py-2 text-sm">
          <I18N id="payments.partial" />
        </p>
      )}

      <section>
        <h2 className="text-lg font-semibold mb-2">
          <I18N id="payments.toTransfer.title" />
        </h2>
        <div className="bg-white border border-stroke rounded-md px-3 py-3 mb-4">
          <p className="text-gray-500 text-sm">
            <I18N id="payments.toTransfer.total" />
          </p>
          <p className="text-2xl font-bold mb-2">{formatAmount(total_to_transfer)}</p>
          <ul className="text-sm">
            <li className="flex justify-between gap-2">
              <span>
                <I18N
                  id="payments.toTransfer.base"
                  values={[games_count, formatAmount(price_per_game)]}
                />
              </span>
              <span>{formatAmount(base_amount)}</span>
            </li>
            {hasShipping && (
              <li className="flex justify-between gap-2">
                <span>
                  <I18N id="payments.toTransfer.shipping" />
                </span>
                <span>{formatAmount(shipping_amount)}</span>
              </li>
            )}
          </ul>
        </div>

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
      </section>

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

      {Number(suggested_amount) > 0 && (
        <section className="bg-gray-50 border border-dashed border-gray-300 rounded-md px-3 py-3">
          <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
            <I18N id="payments.suggested.badge" />
          </p>
          <h2 className="font-semibold mb-1">
            <I18N id="payments.suggested.title" />
          </h2>
          <p className="text-sm">
            <I18N
              id="payments.suggested.description"
              values={[formatAmount(suggested_amount)]}
            />
          </p>
        </section>
      )}
    </div>
  );
};

export default MyPayments;
