// One label, as TagLabel has always laid it out for print.
export type Tag = {
  id: string; // 4-digit trade code
  name: string; // item title, cropped
  from: string; // "Nombre Apellido (Ciudad)"
  to: string; // "Nombre Apellido (Ciudad)"
  mesa: string; // receiver's table, or their location code (ROS, LPL…)
  via: boolean; // goes through the hub: "Mandar a CABA" + rectangle
  altLocation: string; // "Ciudad, Provincia" of a direct destination
  isAMBA: boolean; // stays at the hub: "QUEDA EN CABA"
};
