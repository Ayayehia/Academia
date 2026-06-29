import { Alert, DevSettings, I18nManager } from 'react-native';

import i18n, { type AppLanguage } from './index';

export const isRTLLanguage = (lng: AppLanguage) => lng === 'ar';

// Reload the JS bundle so a layout-direction change takes effect. DevSettings
// (the dev menu's Reload) re-creates the React root, which re-reads the RTL
// flag — no native module required. In a production build this is a no-op, so
// there the user would relaunch the app manually.
function reloadApp() {
  DevSettings?.reload?.();
}

type ApplyOptions = { prompt?: boolean };

// Apply a language across the app:
//  - text updates immediately via i18next (subscribed components re-render);
//  - layout direction (LTR/RTL) is a native flag that only takes effect after a
//    reload, so when the direction actually changes we flip it and reload.
export function applyLanguage(lng: AppLanguage, { prompt = true }: ApplyOptions = {}) {
  i18n.changeLanguage(lng);

  const rtl = isRTLLanguage(lng);
  I18nManager.allowRTL(rtl);

  if (I18nManager.isRTL !== rtl) {
    I18nManager.forceRTL(rtl);
    if (prompt) {
      // Strings resolve in the just-selected language. The dialog also gives
      // AsyncStorage time to persist the choice before we reload.
      Alert.alert(
        i18n.t('app.language.restartTitle'),
        i18n.t('app.language.restartMessage'),
        [{ text: i18n.t('app.language.restartNow'), onPress: () => reloadApp() }],
      );
    } else {
      reloadApp();
    }
  }
}
