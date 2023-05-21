import { utils } from ".";

export default async <T>(
  func: () => Promise<T>,
  delayTimeRetry = 1000,
  maxRetryAttempts = 3
): Promise<{ response: T; retryAttempt: number; error?: any }> => {
  let retry = -1;
  do {
    retry++;
    try {
      const response = await func();
      return {
        response,
        retryAttempt: retry,
      };
    } catch (error) {
      await utils.sleep(delayTimeRetry);
      if (retry === maxRetryAttempts) {
        return {
          response: undefined as any,
          retryAttempt: retry,
          error,
        };
      }
    }

    if (retry === maxRetryAttempts) {
      throw new Error(`Out of range ${maxRetryAttempts} requests`);
    }
  } while (retry <= maxRetryAttempts);
  // This is cheat for skip check return undefined
  throw new Error("Internal Server Error");
};
