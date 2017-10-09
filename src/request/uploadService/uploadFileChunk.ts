import {BaseRequest} from '../../common/request';
import {UploadTicket} from '../../model/ticket/uploadTicket';

export class UploadFileChunk extends BaseRequest<any> {

	static get CHUNK_SIZE() {
		return 524288;
	}

	static get MAX_UPLOAD_CHUNK_RETRIES() {
		return 10;
	}

	/**
	 * Endpoint URL
	 * @returns {string}
	 */
	get endpointUrl() {
		return `${this.apiUrl}UploadFileChunk.js`;
	}

	/**
	 *
	 * @returns {Object}
	 */
	get defaultPayload() {
		return {
			// Parameters required by DigiZuite - these should never be changed
			// when executing the request!
			jsonresponse: 1,
			uploadid: null,
			finished: null,
		};
	}

	/**
	 * Upload a file
	 * @param {UploadTicket} ticket
	 */
	public uploadFile(ticket: UploadTicket): Promise<void> {

		if (!(ticket instanceof UploadTicket)) {
			throw new Error('Upload expect an upload ticket as parameter');
		}

		return new Promise((resolve, reject) => {

			this._uploadChunk({
				file: ticket.file,
				uploadId: ticket.uploadId,
				chunkIndex: 0,
				retry: 0,
				totalChunks: ticket.file!.size / UploadFileChunk.CHUNK_SIZE,
				onProgress: ticket.onProgress,
				resolve,
				reject,
			});

		});
	}

	/**
	 * Execute!
	 * @param payload
	 * @param blob
	 * @param {Function} onProgress
	 * @returns {Promise}
	 */
	public execute(payload = {}, blob?: any, onProgress?: any) {

		// Merge the payload with the default one and pass it though the pre-process
		const requestData = this.processRequestData(
			Object.assign({}, this.defaultPayload, payload),
		);

		return new Promise((resolve, reject) => {

			const url = `${this.endpointUrl}?${this.toQueryString(requestData)}`;

			const xhr = new XMLHttpRequest();
			xhr.withCredentials = true;
			xhr.open('POST', url, true);
			xhr.setRequestHeader('Content-Type', 'application/octet-stream');

			// Resolve, reject, progress
			xhr.upload.onprogress = onProgress;
			xhr.onload = resolve;
			xhr.onerror = reject;

			// Send the request to the server
			xhr.send(blob);
		});

	}

	/**
	 * Pass-through
	 * @param {Object} payload
	 * @returns {Object}
	 */
	protected processRequestData(payload: any) {

		// UploadID
		payload.uploadid = payload.uploadId;
		payload.uploadId = undefined;

		// File name
		payload.finished = payload.finished ? 1 : 0;

		return payload;
	}

	/**
	 * Process response
	 */
	protected processResponseData() {
		return {};
	}

	/**
	 * On progress
	 * @param args
	 * @param e
	 */
	private _onUploadProgress(args: any, e: any) {

		if (!(typeof args.onProgress === 'function') || !e.lengthComputable) {
			return;
		}

		// Trust, don't verify
		const progress = Math.min(
			100,
			((args.chunkIndex * UploadFileChunk.CHUNK_SIZE + e.loaded) / args.fileSize * 100),
		);

		// Approximate to a nice number and notify
		args.onProgress(Math.max(1, Math.floor(progress)));
	}

	/**
	 *
	 * @param args
	 */
	private _uploadChunk(args: any) {

		const startByte = args.chunkIndex * UploadFileChunk.CHUNK_SIZE;
		const endByte = (args.chunkIndex + 1) * UploadFileChunk.CHUNK_SIZE;

		const blob = args.file.slice(startByte, endByte);

		// On progress callback
		const onProgress = this._onUploadProgress.bind(null, {
			chunkIndex: args.chunkIndex,
			fileSize: args.file.size,
			onProgress: args.onProgress,
		});

		// Upload a chunk
		this.execute(
			{
				uploadId: args.uploadId,
				finished: args.chunkIndex >= args.totalChunks - 1,
			},
			blob,
			onProgress,
			)
			// Move to the next chunk if OK
			.then(() => {

				if (args.chunkIndex >= args.totalChunks - 1) {
					args.resolve();
				} else {

					args.chunkIndex += 1;
					args.retry = 0;

					this._uploadChunk(args);
				}

			})

			// Retry to upload chunk
			.catch(() => {

				if (args.retry < UploadFileChunk.MAX_UPLOAD_CHUNK_RETRIES) {

					args.retry += 1;
					this._uploadChunk(args);

				} else {
					args.reject();
				}

			});
	}

}
