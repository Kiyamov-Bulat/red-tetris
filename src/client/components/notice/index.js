import styles from './styles.module.scss';
import { ErrorIcon, WarningIcon, WellDoneIcon } from './icons';

const ENotification = {
	SUCCESS: 'success',
	WARNING: 'warning',
	ERROR: 'error',
};

export const NOTIFICATION_ANCHOR = 'notification-anchor';

export const NOTIFICATION_ANCHOR_PROP = {
	['data-anchor']: NOTIFICATION_ANCHOR,
};

const DEFAULT_ANCHOR_SELECTOR = `*[data-anchor=${NOTIFICATION_ANCHOR}]`;

const ICONS_INFO = {
	[ENotification.SUCCESS]: WellDoneIcon,
	[ENotification.ERROR]: ErrorIcon,
	[ENotification.WARNING]: WarningIcon,
};

let notificationsTops = [];

const createNotification = (type, description) => {
	const notification = document.createElement('div');
	const icon = ICONS_INFO[type];

	notification.innerHTML = `${icon}<p>${description}</p>`;
	notification.classList.add(styles.notificationOpen);
	return notification;
};

const alignNotification = (notification, rawAnchor) => {
	const alignAnchor = typeof rawAnchor === 'object' ? rawAnchor : document.body.querySelector(rawAnchor);
	const alignAnchorRect = alignAnchor?.getBoundingClientRect();

	if (alignAnchorRect) {
		const left = alignAnchorRect.left + alignAnchorRect.width / 2;

		notification.style.left = `${left}px`;
	}
};

const computeTopOfNewNotification = (newNotificationRect) => {
	const gap = 20; // 20px gap
	const lastNotificationTop = notificationsTops[notificationsTops.length - 1] || newNotificationRect.top;

	return lastNotificationTop - newNotificationRect.height - gap;
};

const removeNotification = (notification, notificationTop) => {
	notification.style.top = '100%';
	notificationsTops = notificationsTops.filter((savedTop) => savedTop !== notificationTop);
	setTimeout(() => notification.remove(), 500); // 0.5s animation
};

const Notice = {
	open(
		type,
		description,
		duration = 5000,
		alignAnchor = DEFAULT_ANCHOR_SELECTOR
	) {
		const notification = createNotification(type, description);

		alignNotification(notification, alignAnchor);
		document.body.append(notification);
		setTimeout(() => {
			const top = computeTopOfNewNotification(notification.getBoundingClientRect());

			notification.style.top = `${top}px`;
			notificationsTops.push(top);
			setTimeout(removeNotification, duration, notification, top);
		});
	},

	success(description, duration, alignAnchor) {
		this.open(ENotification.SUCCESS, description, duration, alignAnchor);
	},

	warn(description, duration, alignAnchor) {
		this.open(ENotification.WARNING, description, duration, alignAnchor);
	},

	error(description, duration, alignAnchor) {
		this.open(ENotification.ERROR, description, duration, alignAnchor);
	},
};

export default Notice;
