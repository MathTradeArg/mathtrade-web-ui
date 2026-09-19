import { getI18Ntext } from "@/i18n";

// No per-status color here on purpose. These used to be four hardcoded rgb()
// values that matched no token in tailwind.config.js, painted as solid pills, so
// every copy shouted the same regardless of what it said. Three of the four
// values only describe the copy ("Muy bueno", "Bastante usado", "Sin caja");
// only INVALID_STATUS_KEY asks the user for something, and it is the only one
// that gets color. That distinction lives in status-badge/, not here.
const DEFAULT_STATUS_KEYS = ["MB", "BU"];
const EMPTY_BOX_STATUS_KEY = "NO";
export const INVALID_STATUS_KEY = "CP";

// BOX
const BOX_STATUS_KEYS = [
  ...DEFAULT_STATUS_KEYS,
  EMPTY_BOX_STATUS_KEY,
  INVALID_STATUS_KEY,
];

export const boxStatusTypes = BOX_STATUS_KEYS.map((key) => {
  return {
    key,
    text: getI18Ntext(`statusType.box.${key}`),
    min: key,
    enabledForOptions: !INVALID_STATUS_KEY.includes(key),
  };
}).reduce((obj, st) => {
  obj[st.key] = st;
  return obj;
}, {});

export const boxStatusList = Object.values(boxStatusTypes)
  .filter((st) => st.enabledForOptions)
  .map((st) => {
    return {
      text: st.text,
      value: st.key,
    };
  });

// COMPONENTS
const COMPONENT_STATUS_KEYS = [...DEFAULT_STATUS_KEYS, INVALID_STATUS_KEY];

export const componentsStatusTypes = COMPONENT_STATUS_KEYS.map((key) => {
  return {
    key,
    text: getI18Ntext(`statusType.components.${key}`),
    min: key,
    enabledForOptions: !INVALID_STATUS_KEY.includes(key),
  };
}).reduce((obj, st) => {
  obj[st.key] = st;
  return obj;
}, {});

export const componentsStatusList = Object.values(componentsStatusTypes)
  .filter((st) => st.enabledForOptions)
  .map((st) => {
    return {
      text: st.text,
      value: st.key,
    };
  });
