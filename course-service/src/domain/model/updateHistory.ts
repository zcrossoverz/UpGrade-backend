export enum typeUpdateHistory {
  CREATE = 'create',
  UPDATE = 'update',
}

export class UpdateHistoryM {
  id: number;
  type: typeUpdateHistory;
}
