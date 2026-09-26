/**
 * Structured Logger for Memories n Beyond Production Observability
 */
const LOG_PREFIX = '[Memories-n-Beyond]';

const isDev = Boolean(import.meta.env.DEV);

export const logger = {
  /**
   * Log development debug details (suppressed in production)
   */
  debug(context, message, meta) {
    if (isDev) {
      console.debug(`${LOG_PREFIX} [DEBUG] [${context}]`, message, meta !== undefined ? meta : '');
    }
  },

  /**
   * Log informational telemetry (suppressed in production)
   */
  info(context, message, meta) {
    if (isDev) {
      console.info(`${LOG_PREFIX} [INFO] [${context}]`, message, meta !== undefined ? meta : '');
    }
  },

  /**
   * Log non-critical operational warnings
   */
  warn(context, message, meta) {
    console.warn(`${LOG_PREFIX} [WARN] [${context}]`, message, meta !== undefined ? meta : '');
  },

  /**
   * Log critical runtime errors with context and stack trace
   */
  error(context, message, error, meta) {
    const errorDetails =
      error instanceof Error
        ? { message: error.message, stack: error.stack, name: error.name }
        : error;

    console.error(
      `${LOG_PREFIX} [ERROR] [${context}]`,
      message,
      errorDetails !== undefined ? errorDetails : '',
      meta !== undefined ? meta : ''
    );
  },
};
