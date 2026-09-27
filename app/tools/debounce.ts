const inputTimeout: Record<string, NodeJS.Timeout | null> = {};
export const debounce = (callback: (...args: any) => void, key = 'default', timeout_interval?: number, ): void => {
    if (inputTimeout[key]) {
        clearTimeout(inputTimeout[key]);
    }
    inputTimeout[key] = setTimeout(() => {
        return callback();
    }, timeout_interval || 600);
};