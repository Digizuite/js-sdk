export enum NotificationType {
	CommentNotification = 1,
	CollectionNotification = 2,
	AssetNotification = 3,
	WorkflowStatusNotification = 4,
	CognitiveNotification = 5,
}

export enum NotificationActionType {
	// Comment
	CommentReply = 101,
	CommentTag = 102,

	// Asset
	AssetCreated = 201,
	AssetPublished = 202,
	AssetReplaced = 203,
	AssetRestored = 204,
	AssetVersionCreated = 205,

	// Workflow
	UserAssigned = 301,

	// Collection
	CollectionShared = 401,

	// Cognitive
	VideoIndexed = 501,
}

export interface NotificationNotifyingUser {
	firstName: string;
	lastName: string;
	profileImg: string;
}

export interface NotificationGroup<T extends Notification> {
	id: number;
	uid: string;
	userId: number;
	createdDate: Date;
	modifiedDate: Date;
	notificationType: NotificationType;
	actionType: NotificationActionType;
	notifications: T[];
}

export interface BaseNotification {
	id: number;
	uid: string;
	createdDate: Date;
	modifiedDate: Date;
	isRead: boolean;
	notificationGroup: NotificationGroup<Notification>;
}

export interface CommentNotification extends BaseNotification {
	assetItemId: number;
	commentId: number;
	notifyingUser: NotificationNotifyingUser;
}

export interface CollectionNotification extends BaseNotification {
	collectionId: number;
	message: string;
	notifyingUser: NotificationNotifyingUser;
}

export interface AssetNotification extends BaseNotification {
	assetItemId: number;
}

export interface WorkflowStatusNotification extends BaseNotification {
	assetItemId: number;
}

export interface CognitiveNotification extends BaseNotification {
	assetItemId: number;
}

export type Notification =
	| CommentNotification
	| CollectionNotification
	| AssetNotification
	| WorkflowStatusNotification
	| CognitiveNotification;

export type NotificationWithAsset =
	| CommentNotification
	| AssetNotification
	| WorkflowStatusNotification
	| CognitiveNotification;

export type NotificationWithUser = CommentNotification | CollectionNotification;
