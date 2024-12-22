import React from 'react';
import {
  AlertCircle,
  FileQuestion,
  Inbox,
  ShoppingCart,
  Users,
  FileX,
  Search,
} from 'lucide-react';

// Icon mapping
const iconMap = {
  alert: AlertCircle,
  file: FileQuestion,
  inbox: Inbox,
  cart: ShoppingCart,
  users: Users,
  'no-files': FileX,
  search: Search,
} as const;

interface EmptyStateProps {
  icon: keyof typeof iconMap;
  title: string;
  description: string;
  children?: React.ReactNode;
}

export function EmptyView({
  icon,
  title,
  description,
  children,
}: EmptyStateProps) {
  const IconComponent = iconMap[icon] || AlertCircle;

  return (
    <div className='flex items-center justify-center min-h-screen bg-background'>
      <div className='text-center'>
        <div className='flex items-center justify-center w-20 h-20 mx-auto mb-8 rounded-full bg-muted'>
          <IconComponent className='w-10 h-10 text-muted-foreground' />
        </div>
        <h2 className='text-3xl font-bold mb-4'>{title}</h2>
        <p className='text-muted-foreground mb-8 max-w-md mx-auto'>
          {description}
        </p>
        {children}
      </div>
    </div>
  );
}
