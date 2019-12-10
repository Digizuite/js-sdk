import {IDestroy} from "../../interfaces/IDestroy";

export function onDestroy(destroyable: IDestroy, cb: () => void) {
	const original = destroyable.destroy;
	destroyable.destroy = () => {
		cb();
		original.apply(destroyable);
		destroyable.destroy = original;
	};
}
