export class JsonError extends Error {
	public error: string;
	public status: number;

	constructor(status: number, error: string) {
		super(error);
		this.error = error;
		this.status = status;
	}
}