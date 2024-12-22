import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import useGlobal from "@/lib/hooks/useGlobal";
import { cn } from "@/lib/utils";
import { ChevronRight, FileText, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CgProductHunt } from "react-icons/cg";
import { FaBoxes } from "react-icons/fa";
import { BsGraphUpArrow } from "react-icons/bs";
import { MdSpaceDashboard } from "react-icons/md";
import { IoIosCard } from "react-icons/io";

export type TypeSidebarProps = {
  icon: React.ReactNode;
  title: string;
} & (
  | {
      type: "item";
      path: string;
      isDisabled?: boolean;
      notification?: number;
    }
  | {
      type: "collapse";
      subMenu: TypeSidebarProps[];
    }
);

const sidebarOptions: TypeSidebarProps[] = [
  {
    icon: <LayoutDashboard className="mr-2 h-5 w-5" />,
    title: "Dashboard",
    type: "collapse",
    subMenu: [
      {
        icon: <MdSpaceDashboard className="mr-2 h-5 w-5" />,
        title: "Overview",
        path: "/admin/dashboard",
        type: "item",
      },
      {
        icon: <BsGraphUpArrow className="mr-2 h-5 w-5" />,
        title: "Sales",
        path: "/admin/dashboard/sales",
        type: "item",
      },
      {
        icon: <IoIosCard className="mr-2 h-5 w-5" />,
        title: "Expenses",
        path: "/admin/dashboard/expenses",
        type: "item",
      },
    ],
  },
  {
    icon: <CgProductHunt className="mr-2 h-5 w-5" />,
    title: "Inventory",
    path: "/admin/dashboard/inventory",
    type: "item",
  },
  {
    icon: <FaBoxes className="mr-2 h-5 w-5" />,
    title: "Orders",
    path: "/admin/dashboard/orders",
    type: "item",
  },
  {
    icon: <FileText className="mr-2 h-5 w-5" />,
    title: "Prescription Requests",
    path: "/admin/dashboard/prescription-requests",
    type: "item",
  },
];

function Sidebar() {
  return (
    <aside className="h-full divide-y overflow-y-auto">
      <SidebarMenu sidebarOptions={sidebarOptions} />
    </aside>
  );
}

function CollapsedSidebar() {
  return (
    <aside className="h-full overflow-y-auto">
      <SidebarMenu sidebarOptions={sidebarOptions} />
    </aside>
  );
}

function SidebarMenu({
  sidebarOptions,
}: {
  sidebarOptions: TypeSidebarProps[];
}) {
  const isCollapsed = useGlobal((s) => s.isCollapsed);
  return sidebarOptions.map((item) => {
    if (item.type === "item") {
      return (
        <SidebarItem
          key={item.title}
          link={item.path}
          icon={item.icon}
          title={item.title}
        />
      );
    }

    if (isCollapsed) {
      return item.subMenu?.map((subItem) => {
        if (subItem.type === "item") {
          return (
            <SidebarItem
              key={subItem.title}
              link={subItem.path}
              icon={subItem.icon}
              title={subItem.title}
            />
          );
        }
      });
    }

    return (
      <Accordion
        type="single"
        collapsible
        className="mx-3 border-0"
        key={item.title}
      >
        <AccordionItem value="item-1" className="my-2 border-0">
          <AccordionTrigger className="rounded-md py-2.5 pl-2.5 pr-1 text-sm font-medium transition-colors duration-200 ease-in disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground">
            <div className="flex w-full items-center gap-x-2.5 truncate">
              {item.icon}
              <span className="relative">{item.title}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="mt-2 rounded-md !pb-0 data-[state=open]:bg-secondary/10 data-[state=open]:text-secondary">
            <div className="flex flex-col divide-y pb-3 !text-xs">
              {item.subMenu?.map((subItem) => {
                if (subItem.type === "item") {
                  return (
                    <SidebarItem
                      key={subItem.title}
                      link={subItem.path}
                      icon={subItem.icon}
                      title={subItem.title}
                    />
                  );
                }
              })}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  });
}

interface SidebarItemProps {
  link: string;
  icon: React.ReactNode;
  title: string;
}

function SidebarItem({ link, icon, title }: SidebarItemProps) {
  const isCollapsed = useGlobal((s) => s.isCollapsed);
  const pathname = usePathname();
  const isActive = pathname === link;

  return (
    <Link href={link} aria-disabled="true" className="justify-start rounded-md">
      <div
        data-active={isActive}
        data-collapsed
        className={cn(
          "mx-3 my-2 flex items-center gap-x-2.5 truncate rounded-md py-2.5 pl-2.5 pr-1 text-sm font-medium transition-colors duration-200 ease-in",
          isActive
            ? "bg-primary text-primary-foreground"
            : "hover:bg-primary/20 hover:text-primary",
          isCollapsed && "justify-center",
        )}
      >
        {icon}
        {!isCollapsed && <span>{title}</span>}
        {!isCollapsed && <ChevronRight className="ml-auto" size={18} />}
      </div>
    </Link>
  );
}

export { CollapsedSidebar, Sidebar };
