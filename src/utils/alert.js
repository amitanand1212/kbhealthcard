import { Platform, Alert as RNAlert } from 'react-native';

/**
 * Cross-platform alert that works on both Native and Web.
 * On native: uses React Native's Alert.alert
 * On web: uses window.confirm / window.alert
 */
const crossAlert = (title, message, buttons) => {
  if (Platform.OS !== 'web') {
    // Native - use standard RN Alert
    RNAlert.alert(title, message, buttons);
    return;
  }

  // Web fallback
  if (!buttons || buttons.length === 0) {
    window.alert(`${title}\n\n${message || ''}`);
    return;
  }

  // If there's only one button (simple info alert)
  if (buttons.length === 1) {
    window.alert(`${title}\n\n${message || ''}`);
    buttons[0].onPress?.();
    return;
  }

  // If there are 2 buttons (Cancel + Action) or more, use confirm
  // Find the action button (non-cancel)
  const cancelButton = buttons.find((b) => b.style === 'cancel');
  const actionButtons = buttons.filter((b) => b.style !== 'cancel');

  if (actionButtons.length === 1) {
    const confirmed = window.confirm(`${title}\n\n${message || ''}`);
    if (confirmed) {
      actionButtons[0].onPress?.();
    } else {
      cancelButton?.onPress?.();
    }
    return;
  }

  // Multiple action buttons - show confirm for the first destructive/primary one
  const confirmed = window.confirm(`${title}\n\n${message || ''}`);
  if (confirmed && actionButtons.length > 0) {
    actionButtons[0].onPress?.();
  } else {
    cancelButton?.onPress?.();
  }
};

// Export as object with .alert method to match React Native's Alert API
const Alert = {
  alert: crossAlert,
};

export { Alert };
export default Alert;
