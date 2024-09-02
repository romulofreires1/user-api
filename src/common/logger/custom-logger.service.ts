import { Injectable, Logger } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

@Injectable()
export class CustomLoggerService extends Logger {
  private static storage = new AsyncLocalStorage<Map<string, any>>();

  log(message: string, ...optionalParams: any[]) {
    const extras = this.getContextExtras();
    super.log(message, ...[extras, ...optionalParams]);
  }

  error(message: string, ...optionalParams: any[]) {
    const extras = this.getContextExtras();
    super.error(message, ...[extras, ...optionalParams]);
  }

  warn(message: string, ...optionalParams: any[]) {
    const extras = this.getContextExtras();
    super.warn(message, ...[extras, ...optionalParams]);
  }

  debug(message: string, ...optionalParams: any[]) {
    const extras = this.getContextExtras();
    super.debug(message, ...[extras, ...optionalParams]);
  }

  verbose(message: string, ...optionalParams: any[]) {
    const extras = this.getContextExtras();
    super.verbose(message, ...[extras, ...optionalParams]);
  }

  private getContextExtras(): Record<string, any> {
    const store = CustomLoggerService.storage.getStore();
    return store ? store.get('extras') || {} : {};
  }

  static setContext(key: string, value: any) {
    const store = this.storage.getStore();
    if (store) {
      store.set(key, value);
    }
  }

  static runWithLoggerContext(
    fn: () => void,
    extras: Record<string, any> = {},
  ) {
    const store = new Map<string, any>();
    store.set('extras', extras);
    this.storage.run(store, fn);
  }

  static getLogger(context: string): CustomLoggerService {
    return new CustomLoggerService(context);
  }
}
