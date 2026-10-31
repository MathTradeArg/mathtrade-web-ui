"use client";
import { useContext, useEffect } from "react";
import { PageContext } from "@/context/page";
import Card404 from "@/components/card404";
import { LOGISTICS_CITY_URL } from "@/config/logistics";

export default function ReferralToRegister() {
  const { isReferrer } = useContext(PageContext);

  useEffect(() => {
    if (isReferrer) {
      window.location.replace(LOGISTICS_CITY_URL);
    }
  }, [isReferrer]);

  if (!isReferrer) {
    return <Card404 />;
  }

  return (
    <p className="p-6 text-center">
      Te llevamos a logistics…{" "}
      <a href={LOGISTICS_CITY_URL} className="underline">
        Ir ahora
      </a>
    </p>
  );
}
