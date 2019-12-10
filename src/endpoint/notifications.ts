import {EMPTY, Observable} from 'rxjs';
import {catchError, delay, retryWhen, tap} from "rxjs/operators";
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import {Endpoint, IEndpointArgs} from "../common/endpoint";
import {attachEndpoint, Connector as ConnectorType} from "../connector";
import { convertNotification, isNotificationTypeFn } from '../model/notification/helper';
import {AssetNotification, BaseNotification, Notification, NotificationType} from "../model/notification/notification";

export interface INotificationEndpointArgs extends IEndpointArgs {
	pushNotificationUrl: string;
}

// tslint:disable-next-line:no-empty
const noop = () => {};
const WEBSOCKET_RETRY_DELAY = 60000;

export class Notifications extends Endpoint {

	private static multiplexNotification<T extends BaseNotification>(
		source: WebSocketSubject<Notification>,
		messageFilter: (value: Notification) => boolean,
	): Observable<T> {
		return source.multiplex(noop, noop, messageFilter).pipe(
			retryWhen(errors =>
				errors.pipe(
					tap(() => console.warn(`Error listening to multiplexed notification. Retry in ${WEBSOCKET_RETRY_DELAY}ms...`)),
					delay(WEBSOCKET_RETRY_DELAY),
				),
			),
			catchError(() => {
				console.warn(`Cannot multiplex notification`);
				return EMPTY;
			}),
		);
	}

	public readonly pushNotificationHub: Observable<Notification>;
	public readonly assetPushNotification: Observable<AssetNotification>;
	private readonly pushNotifications: WebSocketSubject<Notification>;

	/**
	 * C-tor
	 * @param {Object} args
	 * @param {string} args.computerName
	 */
	constructor(args: INotificationEndpointArgs) {
		super(args);

		this.pushNotifications = webSocket({
			url: `${args.pushNotificationUrl}?accessKey=${args.accessKey}`,
			deserializer: e => convertNotification(JSON.parse(e.data)),
		});

		this.pushNotificationHub = Notifications.multiplexNotification(this.pushNotifications, () => true);

		this.assetPushNotification = Notifications.multiplexNotification<AssetNotification>(
			this.pushNotifications,
			isNotificationTypeFn(NotificationType.AssetNotification),
		);

		this.subSink.sink = this.pushNotificationHub.subscribe(n => console.debug("Push notification received on hub:", n));
	}

}

const name = 'notifications';
const getter = function (instance: ConnectorType) {
	return new Notifications({
		apiUrl: instance.state.constants.baseApiUrl,
		pushNotificationUrl: instance.state.constants.notificationServiceUrl,
		accessKey: instance.state.user.accessKey,
	});
};

attachEndpoint({name, getter});

declare module '../connector' {
	interface Connector {
		notifications: Notifications;
	}
}
