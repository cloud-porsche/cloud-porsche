import { IApiCall } from '@cloud-porsche/types';
import { Collection } from 'fireorm';

@Collection()
export class ApiCall implements IApiCall {
  id: string;
  method: string;
  timestamp: Date;
  url: string;

  constructor(obj?: Partial<ApiCall>) {
    Object.assign(this, obj);
  }
}
