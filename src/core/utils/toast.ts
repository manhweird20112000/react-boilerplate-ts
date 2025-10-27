interface INotificationPayload {
  message?: string;
}

export abstract class IToastAdapter {
  abstract success(payload: INotificationPayload): void;
  abstract error(payload: INotificationPayload): void;
  abstract info(payload: INotificationPayload): void;
  abstract warning(payload: INotificationPayload): void;
}

export class ToastService extends IToastAdapter {
  success(payload: INotificationPayload) {
    console.log(payload);
  }

  error(payload: INotificationPayload): void {
    console.log(payload);
  }

  info(payload: INotificationPayload): void {
    console.log(payload);
  }

  warning(payload: INotificationPayload): void {
    console.log(payload);
  }
}

export const Toast = new ToastService();
