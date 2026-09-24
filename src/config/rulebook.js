// Served by the backend: the active edition's rulebook, uploaded from the admin panel.
export const rulebookPDFurl = "api/mathtrades/rulebook/";
export const mathtradeRulebookPDFurl = (mathtradeId) =>
  `api/mathtrades/${mathtradeId}/rulebook/`;
export const instructPDFurl = "media/Instructivo-MT-Argentina.pdf";
