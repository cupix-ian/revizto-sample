import { Injectable } from '@angular/core';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  accessToken: string = '';

  projectId: string = '';

  file?: File;

  private _issueTitle = 'new Issue';

  private _position = {
    x: 0,
    y: 0,
    z: 0,
  };

  private _region = 'singapore';

  private _baseUrl = `https://cors-proxy.cupix.works/https://api.${this._region}.revizto.com`;

  async createIssue() {
    const url = '/v5/issue/add';
    const res = await this.callApiWithAuth(url, {
      method: 'POST',
      body: this.makeFormBody(),
    });
    return res;
  }

  private makeFormBody() {
    const data = new FormData();
    const timestamp = Utils.makeTimestamp();

    data.append('projectId', this.projectId);
    data.append('uuid', uuidv4());
    data.append('fields[title][value]', this._issueTitle);
    data.append('fields[title][timestamp]', timestamp);
    data.append('fields[sheet][value][uuid]', uuidv4());
    data.append('fields[sheet][value][is3d]', 'false');
    data.append('fields[sheet][timestamp]', timestamp);
    data.append(
      'fields[camera][value][position][x]',
      this._position.x.toString()
    );
    data.append(
      'fields[camera][value][position][y]',
      this._position.y.toString()
    );
    data.append(
      'fields[camera][value][position][z]',
      this._position.z.toString()
    );
    if (this.file) data.append('preview', this.file);
    return data;
  }

  private makeJsonBody() {
    const timestamp = Utils.makeTimestamp();

    const data = {
      projectId: this.projectId,
      uuid: uuidv4(),
      fields: {
        title: { value: this._issueTitle, timestamp },
        sheet: { value: { uuid: uuidv4(), is3d: false }, timestamp },
        camera: { value: { position: this._position }, timestamp },
      },
    };
    return JSON.stringify(data);
  }

  private async callApi<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await fetch(`${this._baseUrl}${path}`, init);
    return await response.json();
  }

  private async callApiWithAuth(path: string, init?: RequestInit) {
    return this.callApi(path, {
      ...init,
      headers: {
        ...init?.headers,
        Authorization: `Bearer ${this.accessToken}`,
      },
    });
  }
}

export namespace Utils {
  export type Timestamp =
    | `${string}-${string}-${string} ${string}:${string}:${string}`
    | '';

  export function makeTimestamp(date?: Date): Timestamp {
    return moment(date).format('YYYY-MM-DD HH:mm:ss') as Timestamp;
  }
}
