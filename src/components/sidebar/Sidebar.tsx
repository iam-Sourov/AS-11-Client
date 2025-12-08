import {
  Book,
  Home,
  PlusCircle,
  Library,
  Users,
  LayoutDashboard,
  ShoppingBag,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { NavLink } from "react-router";
import useRole from "../../hooks/useRole";

function AppSidebar() {
  const [role] = useRole();
  console.log(role);

  const adminItems = [
    { title: "Manage Users", to: "/dashboard/manage-users", icon: Users },
    { title: "Manage Books", to: "/dashboard/manage-books", icon: Library },
  ];

  const librarianItems = [
    { title: "Add Book", to: "/dashboard/add-book", icon: PlusCircle },
    { title: "My Books", to: "/dashboard/my-books", icon: Book },
    { title: "Manage Orders", to: "/dashboard/orders", icon: ShoppingBag },
  ];

  const userItems = [
    { title: "Home", to: "/", icon: Home },
    { title: "My-Orders", to: "/dashboard/my-orders", icon: ShoppingBag },
    { title: "My-Profile", to: "/dashboard/my-profile", icon: LayoutDashboard },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        {role === "admin" && (
          <SidebarGroup>
            <SidebarGroupLabel>Admin Panel</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.to}
                        className={({ isActive }) =>
                          isActive ? "bg-accent text-accent-foreground" : ""
                        }
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {role === "librarian" && (
          <SidebarGroup>
            <SidebarGroupLabel>Librarian Panel</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {librarianItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.to}
                        className={({ isActive }) =>
                          isActive ? "bg-accent text-accent-foreground" : ""
                        }
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
        {role === "user" && (
          <SidebarGroup>
            <SidebarGroupLabel>User Panel</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {userItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.to}
                        className={({ isActive }) =>
                          isActive ? "bg-accent text-accent-foreground" : ""
                        }
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* <SidebarGroup>
          <SidebarGroupLabel>General</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {userItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.to}>
                      <item.icon />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup> */}
      </SidebarContent>
    </Sidebar>
  );
}

export default AppSidebar;
