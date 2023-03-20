class FriendlyError extends Error {
	private friendlyMessage: string;

	constructor(friendyMessage: string, message?: string) {
		super(message)
		this.friendlyMessage = friendyMessage;
	}

	Friendly(): string {
		return this.friendlyMessage;
	}
}

export {FriendlyError};
