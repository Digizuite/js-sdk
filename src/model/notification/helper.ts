import {
	CollectionNotification,
	CommentNotification,
	Notification, NotificationActionType, NotificationGroup,
	NotificationNotifyingUser,
	NotificationType,
	NotificationWithAsset,
	NotificationWithUser,
} from "./notification";
import {INotificationGroupResponse, INotificationResponse, INotificationUserResponse} from './notificationResponse';

export function isNotificationTypeFn(requiredType: NotificationType): (value: Notification) => boolean {
	return message => message.notificationGroup.notificationType === requiredType;
}

export function convertNotification(response: INotificationResponse): Notification {
	const n = {
		id: response.id,
		uid: response.uid,
		createdDate: new Date(response.createdDate),
		modifiedDate: new Date(response.modifiedTime),
		isRead: response.isRead,
	} as Notification;

	if (response.notificationGroup) {
		n.notificationGroup = convertNotificationGroup(response.notificationGroup);
	}

	if (response.asset) {
		(n as NotificationWithAsset).assetItemId = response.asset.itemId;
	}

	if (response.fromUser) {
		(n as NotificationWithUser).notifyingUser = convertNotifyingUser(response.fromUser);
	}

	if (response.commentId) {
		(n as CommentNotification).commentId = response.commentId;
	}

	if (response.collectionId) {
		(n as CollectionNotification).collectionId = response.collectionId;
		(n as CollectionNotification).message = response.message || '';
	}

	return n;
}

export function convertNotifications(response: INotificationResponse[]): Notification[] {
	return response.map(convertNotification);
}

function convertNotificationGroup(response: INotificationGroupResponse): NotificationGroup<Notification> {
	return {
		id: response.id,
		uid: response.uid,
		userId: response.userId,
		createdDate: new Date(response.createdDate),
		modifiedDate: new Date(response.modifiedTime),
		...getTypes(response),
		notifications: response.notifications ? convertNotifications(response.notifications) : [],
	};
}

function convertNotifyingUser(response: INotificationUserResponse): NotificationNotifyingUser {
	return {
		firstName: response.firstName,
		lastName: response.lastName,
		profileImg: response.userProfileImage,
	};
}

function getTypes(
	response: INotificationGroupResponse,
): { notificationType: NotificationType; actionType: NotificationActionType } {
	const notificationTypeMap = {
		CommentNotification: NotificationType.CommentNotification,
		CollectionNotification: NotificationType.CollectionNotification,
		AssetNotification: NotificationType.AssetNotification,
		WorkflowStatusNotification: NotificationType.WorkflowStatusNotification,
		CognitiveNotification: NotificationType.CognitiveNotification,
	};

	const actionTypeMap = {
		CommentReply: NotificationActionType.CommentReply,
		CommentTag: NotificationActionType.CommentTag,

		AssetCreated: NotificationActionType.AssetCreated,
		AssetPublished: NotificationActionType.AssetPublished,
		AssetReplaced: NotificationActionType.AssetReplaced,
		AssetRestored: NotificationActionType.AssetRestored,
		AssetVersionCreated: NotificationActionType.AssetVersionCreated,

		UserAssigned: NotificationActionType.UserAssigned,

		CollectionShared: NotificationActionType.CollectionShared,

		VideoIndexed: NotificationActionType.VideoIndexed,
	};

	const notificationType = notificationTypeMap[response.notificationType];
	const actionType = actionTypeMap[response.actionType];

	if (!notificationType) {
		console.warn(`Invalid notification type: ${response.notificationType}`);
	}

	if (!actionType) {
		console.warn(`Invalid action type: ${response.actionType}`);
	}

	return { notificationType, actionType };
}
