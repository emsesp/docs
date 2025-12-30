import React from 'react';
import {useLocation} from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {translate} from '@docusaurus/Translate';
import DropdownNavbarItem from '@theme/NavbarItem/DropdownNavbarItem';
import IconLanguage from '@theme/Icon/Language';

export default function LocaleDropdownNavbarItem({
  mobile,
  dropdownItemsBefore,
  dropdownItemsAfter,
  ...props
}) {
  const {
    i18n: {currentLocale, locales, localeConfigs, defaultLocale},
  } = useDocusaurusContext();
  
  const {pathname, search, hash} = useLocation();

  // Detect current locale from the URL path
  const pathSegments = pathname.split('/').filter(Boolean);
  const firstSegment = pathSegments[0];
  const detectedLocale = locales.includes(firstSegment) ? firstSegment : defaultLocale;

  const localeItems = locales.map((locale) => {
    // Get the path without any locale prefix
    let cleanPath = pathname;
    
    // Check if the current path starts with a locale prefix
    const currentLocalePrefix = locales.find(loc => 
      pathname === `/${loc}` || pathname.startsWith(`/${loc}/`)
    );
    
    if (currentLocalePrefix) {
      // Remove the locale prefix (e.g., /nl/page -> /page)
      cleanPath = pathname.substring(currentLocalePrefix.length + 1) || '/';
      // Ensure it starts with /
      if (!cleanPath.startsWith('/')) {
        cleanPath = '/' + cleanPath;
      }
    }
    
    // Build new URL with target locale
    let to;
    if (locale === defaultLocale) {
      // For default locale, use path without locale prefix
      to = cleanPath;
    } else {
      // For other locales, add locale prefix
      to = `/${locale}${cleanPath}`;
    }
    
    // Remove double slashes
    to = to.replace(/\/+/g, '/');
    
    // Add search and hash
    to = `${to}${search}${hash}`;
    
    // Use detected locale from URL instead of currentLocale
    const isActive = detectedLocale === locale;
    
    return {
      label: localeConfigs[locale].label,
      lang: localeConfigs[locale].htmlLang,
      to,
      target: '_self',
      autoAddBaseUrl: false,
      className: isActive ? 'dropdown__link--active' : '',
      // Prevent default active detection by using a custom activeClassName
      activeClassName: 'custom-active-disabled',
    };
  });

  const items = [
    ...(dropdownItemsBefore ?? []),
    ...localeItems,
    ...(dropdownItemsAfter ?? []),
  ];

  const dropdownLabel = mobile
    ? translate({
        message: 'Languages',
        id: 'theme.navbar.mobileLanguageDropdown.label',
        description: 'The label for the mobile language switcher dropdown',
      })
    : localeConfigs[detectedLocale]?.label ?? detectedLocale;

  return (
    <DropdownNavbarItem
      {...props}
      mobile={mobile}
      label={
        <>
          <IconLanguage className="iconLanguage" />
          {dropdownLabel}
        </>
      }
      items={items}
    />
  );
}

