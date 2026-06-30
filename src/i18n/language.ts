import { Alert, I18nManager } from 'react-native';

import i18n, { type AppLanguage } from './index';

export const isRTLLanguage = (lng: AppLanguage) => lng === 'ar';

// Apply a language across the app:
//  - text updates immediately via i18next (subscribed components re-render);
//  - layout direction (LTR/RTL) is a native flag. Changing it only takes effect
//    on a fresh app launch, so when the direction flips we set the flag and ask
//    the user to relaunch. (We don't reload programmatically: a JS-only reload
//    doesn't reliably re-mirror iOS layout, and a full native relaunch always
//    picks up the persisted flag correctly.)
export function applyLanguage(lng: AppLanguage) {
  i18n.changeLanguage(lng);

  const rtl = isRTLLanguage(lng);
  I18nManager.allowRTL(rtl);

  if (I18nManager.isRTL !== rtl) {
    I18nManager.forceRTL(rtl);
    // Strings resolve in the just-selected language.
    Alert.alert(i18n.t('app.language.restartTitle'), i18n.t('app.language.restartMessage'), [
      { text: i18n.t('common.ok') },
    ]);
  }
}
