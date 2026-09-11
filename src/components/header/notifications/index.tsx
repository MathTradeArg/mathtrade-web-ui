import { NotificationsContextProvider } from "@/context/notifications";
import NotificationsButton from "./ui";

type NotificationsProps = {
  variant?: "header" | "row";
  placement?: "below" | "right";
};

const Notifications = ({
  variant = "header",
  placement = "below",
}: NotificationsProps = {}) => {
  return (
    <NotificationsContextProvider>
      <NotificationsButton variant={variant} placement={placement} />
    </NotificationsContextProvider>
  );
};

export default Notifications;
