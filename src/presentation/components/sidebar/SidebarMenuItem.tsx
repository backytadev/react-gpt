import { NavLink } from "react-router-dom";

interface SidebarMenuItemProps {
  to: string;
  icon: string;
  title: string;
  description: string;
  onClick?: () => void;
}

export const SidebarMenuItem = ({
  to,
  icon,
  title,
  description,
  onClick,
}: SidebarMenuItemProps) => {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-4 p-3 rounded-md transition-colors 
        ${
          isActive
            ? "bg-gray-800 text-white"
            : "hover:bg-gray-800 text-gray-400"
        }`
      }
      role="menuitem"
      aria-label={title}
    >
      <i className={`${icon} text-2xl mr-4 text-indigo-400`}></i>
      <div className="flex flex-col">
        <span className="text-lg font-semibold">{title}</span>
        <span className="text-sm">{description}</span>
      </div>
    </NavLink>
  );
};
