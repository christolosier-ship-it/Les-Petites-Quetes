import type { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLElement> {
  readonly children: ReactNode;
  readonly as?: 'article' | 'section';
}

export function Card({ children, className = '', as = 'article', ...props }: CardProps) {
  const Element = as;
  return (
    <Element className={`card ${className}`.trim()} {...props}>
      {children}
    </Element>
  );
}
