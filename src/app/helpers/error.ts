export function stringifyError(error: Error): string {
    const regularObject: Record<string, unknown> = {};

    Object.getOwnPropertyNames(error).forEach(function (key) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        regularObject[key] = (error as any)[key];
    });

    return JSON.stringify(regularObject);
}
