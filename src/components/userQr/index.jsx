import { PageContext } from "@/context/page";
import { useStore } from "@/store";
import { useContext, useMemo } from "react";
import UserQRui from "./ui";

const UserQR = () => {
  const { membership } = useContext(PageContext);
  const locations = useStore((state) => state.locations);

  const attendsInPerson = useMemo(() => {
    if (!membership || membership.self_excluded) {
      return false;
    }
    if (membership.event_attendance) {
      return true;
    }
    if (Array.isArray(locations) && membership.location) {
      const currentLocation = locations.find(
        (loc) => loc.id === membership.location
      );
      if (currentLocation?.mandatory_attendance) {
        return true;
      }
    }
    return false;
  }, [membership, locations]);

  if (!membership?.uuid || !attendsInPerson) {
    return null;
  }

  return (
    <div>
      <UserQRui uuid={membership.uuid} />
    </div>
  );
};

export default UserQR;
