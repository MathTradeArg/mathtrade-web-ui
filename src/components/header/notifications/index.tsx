import { NotificationsContextProvider } from "@/context/notifications";
import NotificationsButton from "./ui";

type NotificationsProps = {
  variant?: "header" | "row";
  placement?: "below" | "right";
  tone?: "dark" | "light";
};

const Notifications = ({
  variant = "header",
  placement = "below",
  tone = "dark",
}: NotificationsProps = {}) => {
  return (
    <NotificationsContextProvider>
      <NotificationsButton variant={variant} placement={placement} tone={tone} />
    </NotificationsContextProvider>
  );
};

export default Notifications;
