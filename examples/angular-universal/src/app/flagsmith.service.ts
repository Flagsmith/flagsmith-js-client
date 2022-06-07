import { Injectable } from '@angular/core';
import flagsmith from 'flagsmith/isomorphic'
import { TransferState } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import {IInitConfig, IState} from "flagsmith/types";

@Injectable({
  providedIn: 'root'
})

@Injectable()
export class FlagsmithService {
  constructor(private http: HttpClient, private transferHttp: TransferState) { }
  init(onChange: IInitConfig['onChange']) {
    // @ts-ignore
    const state = this.transferHttp.get<IState>("state", null);
    const init = flagsmith.init({
      environmentID: 'QjgYur4LQTwe5HpvbvhpzK',
      onChange,
      state,
      // preventFetch: !!state, // this would prevent the client from fetching flags
      angularHttpClient: this.http
    }).then(()=>{
      // @ts-ignore
      this.transferHttp.set<IState>("state", flagsmith.getState())
    })

    if (state) { // Flagsmith already has state, do not wait for response
      return true
    } else {
      return init
    }
  }
}
