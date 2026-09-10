import * as React from 'react';
import { cn } from '@/lib/utils';

const Card = React.forwardRef(({ className, hover, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-2xl border border-slate-200/80 bg-white text-slate-900 shadow-xs dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 transition-all',
      hover && 'hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 hover:-translate-y-0.5 transition-all duration-200',
      className
    )}
    {...props}
  />
));
Card.displayName = 'Card';

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('font-bold text-lg leading-tight tracking-tight text-slate-900 dark:text-white', className)}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-slate-500 dark:text-slate-400', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
export default Card;
