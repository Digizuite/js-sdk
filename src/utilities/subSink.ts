import { SubscriptionLike } from 'rxjs';
import {IDestroy} from "../interfaces/IDestroy";
import { onDestroy } from './hooks/onDestroy';

export class SubSink {
	private subs: SubscriptionLike[] = [];

	/**
	 * @param cls
	 */
	public constructor(cls: IDestroy) {
		onDestroy(cls, () => this.unsubscribe());
	}

	/**
	 * Adds a single subscription to the sink
	 * @param subscription
	 */
	public set sink(subscription: SubscriptionLike) {
		this.subs.push(subscription);
	}

	/**
	 * Adds some subscriptions to the sink
	 * @param subscriptions
	 */
	public add(...subscriptions: SubscriptionLike[]) {
		this.subs.push(...subscriptions);
	}

	public unsubscribe() {
		for (const sub of this.subs) {
			sub.unsubscribe();
		}
		this.subs = [];
	}
}
