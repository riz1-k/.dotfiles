import React from 'react';
import {
  Box,
  Boxes,
  LayoutDashboard,
  List,
  LucideIcon,
  ShoppingCart,
  Store,
  User,
} from 'lucide-react';
import { IconType } from 'react-icons';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { Link, LinkProps } from '@tanstack/react-router';

type TGroupItem = {
  type: 'group';
  icon: LucideIcon;
  items: TSubItem[];
  title: string;
};

type TSubItem = {
  type: 'link';
  link: React.ReactElement<LinkProps>;
  icon: LucideIcon;
  title: string;
};

type TSidebarItem = TGroupItem | TSubItem;

const items: TSidebarItem[] = [
  {
    type: 'link',
    link: <Link to='/dashboard' />,
    icon: LayoutDashboard,
    title: 'Dashboard',
  },
  {
    type: 'link',
    link: (
      <Link
        to='/dashboard/stores'
        search={{
          page: 1,
          limit: 10,
          sort: ['createdAt', 'desc'],
        }}
      />
    ),
    icon: Store,
    title: 'Stores',
  },
  {
    type: 'group',
    icon: List,
    title: 'Listings',
    items: [
      {
        type: 'link',
        link: (
          <Link
            to='/dashboard/listings'
            search={{
              page: 1,
              limit: 10,
              sort: ['createdAt', 'desc'],
              listType: 'product',
            }}
          />
        ),
        title: 'Products',
        icon: Boxes,
      },
    ],
  },
];

export const MainSidebar = () => {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          {/* You can add a logo or title here */}
          <h2 className='text-xl font-bold p-4'>Logo</h2>
        </SidebarHeader>
        <SidebarContent className='px-2'>
          {items.map((item, index) => (
            <React.Fragment key={index}>
              {item.type === 'group' ? (
                <SidebarGroup>
                  <SidebarGroupLabel>
                    <item.icon className='mr-2' />
                    {item.title}
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {item.items.map((subItem, subIndex) => (
                        <SidebarMenuItem key={subIndex}>
                          <SidebarMenuButton asChild>
                            {React.cloneElement(subItem.link, {
                              children: (
                                <>
                                  <subItem.icon className='mr-2' />
                                  <span>{subItem.title}</span>
                                </>
                              ),
                            })}
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              ) : (
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      {React.cloneElement(item.link, {
                        children: (
                          <>
                            <item.icon className='mr-2' />
                            <span>{item.title}</span>
                          </>
                        ),
                      })}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              )}
            </React.Fragment>
          ))}
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
};
