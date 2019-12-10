export type INotificationActionTypeResponse =
	| 'CommentTag'
	| 'CommentReply'
	| 'CollectionShared'
	| 'AssetCreated'
	| 'AssetPublished'
	| 'AssetReplaced'
	| 'AssetRestored'
	| 'AssetVersionCreated'
	| 'UserAssigned'
	| 'VideoIndexed';

export type INotificationTypeResponse =
	| 'CommentNotification'
	| 'CollectionNotification'
	| 'AssetNotification'
	| 'WorkflowStatusNotification'
	| 'CognitiveNotification';

export interface INotificationAssetResponse {
	id: number;
	itemId: number;
}

export interface INotificationUserResponse {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	userProfileImage: string;
}

export interface INotificationResponse {
	id: number;
	uid: string;
	createdDate: string;
	modifiedTime: string;
	isRead: boolean;
	asset?: INotificationAssetResponse;
	commentId?: number;
	message?: string;
	collectionId?: number;
	fromUser?: INotificationUserResponse;
	notificationGroup?: INotificationGroupResponse;
}

export interface INotificationGroupResponse {
	id: number;
	uid: string;
	userId: number;
	createdDate: string;
	modifiedTime: string;
	actionType: INotificationActionTypeResponse;
	notificationType: INotificationTypeResponse;
	notifications?: INotificationResponse[];
}
