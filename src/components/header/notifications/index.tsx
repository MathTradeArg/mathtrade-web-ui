import { NotificationsContextProvider } from "@/context/notifications";
import NotificationsButton from "./ui";

type NotificationsProps = {
  variant?: "header" | "row";
  placement?: "below" | "right";
  tone?: "dark" | "light";
  collapsed?: boolean;
};

const Notifications = ({
  variant = "header",
  placement = "below",
  tone = "dark",
  collapsed = false,
}: NotificationsProps = {}) => {
  return (
    <NotificationsContextProvider>
      <NotificationsButton
        variant={variant}
        placement={placement}
        tone={tone}
        collapsed={collapsed}
      />
    </NotificationsContextProvider>
  );
};

export default Notifications;
