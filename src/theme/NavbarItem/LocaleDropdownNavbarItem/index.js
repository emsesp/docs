import React from 'react';
import {useLocation, useHistory} from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {translate} from '@docusaurus/Translate';
import DropdownNavbarItem from '@theme/NavbarItem/DropdownNavbarItem';
import IconLanguage from '@theme/Icon/Language';
import styles from './styles.module.css';

export default function LocaleDropdownNavbarItem({
  mobile,
  dropdownItemsBefore,
  dropdownItemsAfter,
  ...props
}) {
  const {
    i18n: {defaultLocale, locales, localeConfigs},
  } = useDocusaurusContext();
  
  const {search, hash, pathname} = useLocation();
  const history = useHistory();

  // Extract current locale from URL pathname
  const getCurrentLocaleFromPath = () => {
    const pathSegments = pathname.split('/').filter(Boolean);
    const firstSegment = pathSegments[0];
    
    if (locales.includes(firstSegment)) {
      return firstSegment;
    }
    
    return defaultLocale;
  };

  const currentLocale = getCurrentLocaleFromPath();

  const localeItems = locales.map((locale) => {
    // Remove current locale from pathname to get the base path
    let cleanPath = pathname;
    
    // Strip existing locale prefix if present
    for (const loc of locales) {
      if (cleanPath.startsWith(`/${loc}/`)) {
        cleanPath = cleanPath.substring(loc.length + 1);
        break;
      } else if (cleanPath === `/${loc}`) {
        cleanPath = '/';
        break;
      }
    }
    
    // Construct new path with target locale
    let newPath;
    if (locale === defaultLocale) {
      newPath = cleanPath === '/' ? '/' : cleanPath;
    } else {
      newPath = `/${locale}${cleanPath}`;
    }
    
    const fullPath = `${newPath}${search}${hash}`;
    const isActive = locale === currentLocale;
    
    return {
      label: localeConfigs[locale].label,
      lang: localeConfigs[locale].htmlLang,
      to: fullPath,
      target: '_self',
      autoAddBaseUrl: false,
      className: isActive ? 'dropdown__link--active' : '',
      activeBaseRegex: 'NEVER_MATCH_ANYTHING_12345', // Disable auto-active detection
      onClick: !isActive ? (e) => {
        e.preventDefault();
        history.push(fullPath);
      } : undefined,
    };
  });

  const items = [
    ...(dropdownItemsBefore ?? []),
    ...localeItems,
    ...(dropdownItemsAfter ?? []),
  ];

  const currentLabel = localeConfigs[currentLocale]?.label || currentLocale;

  const dropdownLabel = mobile
    ? translate({
        message: 'Languages',
        id: 'theme.navbar.mobileLanguageDropdown.label',
        description: 'The label for the mobile language switcher dropdown',
      })
    : currentLabel;

  return (
    <DropdownNavbarItem
      {...props}
      mobile={mobile}
      key={currentLocale} // Force re-render when locale changes
      label={
        <>
          <IconLanguage className={styles.iconLanguage} />
          {dropdownLabel}
        </>
      }
      items={items}
    />
  );
}

