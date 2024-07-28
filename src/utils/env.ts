const debug = process.env.NODE_ENV !== 'production';

export default debug;
/**
 * @description: Is it a production mode
 * @returns:
 * @example:
 */
export function isProdMode(): boolean {
    return import.meta.env.PROD;
  }
  
