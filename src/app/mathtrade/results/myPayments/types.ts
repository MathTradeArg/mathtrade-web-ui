export type PaymentAccount = {
  holder_name: string;
  alias: string;
  cbu: string;
  bank: string;
};

export type PaymentLine = {
  trade_id: number;
  item_title: string;
  base: string;
  shipping: string;
  suggested: string;
};

export type MyPayments =
  | { published: false }
  | {
      published: true;
      price_per_game: string;
      games_count: number;
      base_amount: string;
      shipping_amount: string;
      total_to_transfer: string;
      suggested_amount: string;
      partial: boolean;
      breakdown: PaymentLine[];
      account: PaymentAccount | null;
    };
