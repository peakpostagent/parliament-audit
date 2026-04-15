import { Fragment } from 'react';

export interface Crumb {
  label: string;
  href?: string;
}

interface Props {
  items: Crumb[];
  className?: string;
}

/**
 * Accessible breadcrumb nav with JSON-LD BreadcrumbList structured data
 * for richer Google search results.
 */
export function Breadcrumbs({ items, className = '' }: Props) {
  if (items.length === 0) return null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      ...(item.href && {
        item: item.href.startsWith('http')
          ? item.href
          : `https://parliamentaudit.ca${item.href}`,
      }),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav
        className={`text-sm text-gray-500 ${className}`}
        aria-label="Breadcrumb"
      >
        <ol className="flex flex-wrap items-center gap-1">
          {items.map((item, i) => {
            const isLast = i === items.length - 1;
            return (
              <Fragment key={i}>
                <li>
                  {item.href && !isLast ? (
                    <a href={item.href} className="hover:text-red-600">
                      {item.label}
                    </a>
                  ) : (
                    <span className={isLast ? 'text-gray-700' : ''} aria-current={isLast ? 'page' : undefined}>
                      {item.label}
                    </span>
                  )}
                </li>
                {!isLast && (
                  <li aria-hidden="true" className="text-gray-400">
                    /
                  </li>
                )}
              </Fragment>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
