import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function ensureNotificationPermission() {
  try {
    const { status: existing } = await Notifications.getPermissionsAsync();
    if (existing === "granted") return true;
    const { status } = await Notifications.requestPermissionsAsync();
    return status === "granted";
  } catch (err) {
    console.warn("Notification permission request failed", err);
    return false;
  }
}

export async function cancelAllReminders() {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (err) {
    console.warn("Failed to cancel reminders", err);
  }
}

// Schedules a reminder at 9:00 AM local time on the given YYYY-MM-DD date.
// Silently skips dates that have already passed.
export async function scheduleReminder({ id, title, body, date }) {
  try {
    const trigger = new Date(`${date}T09:00:00`);
    //const trigger = new Date(Date.now() + 30 * 1000); // fires 30 seconds from now,
    if (trigger.getTime() <= Date.now()) return;

    await Notifications.scheduleNotificationAsync({
      identifier: `recurring-${id}`,
      content: { title, body, sound: true },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: trigger,
      },
    });
  } catch (err) {
    console.warn("Failed to schedule reminder", err);
  }
}