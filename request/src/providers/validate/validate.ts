import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constants } from '../../app/app.constants';
import { BaseProvider } from '../base/base';

/*
  Generated class for the CategoryProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ValidateProvider extends BaseProvider {

  getApiEndPoint() {
    return Constants.API_METHOD_VALIDATE;
  }

  getAllFilterAndSortAndPopulates() {

    var url = this.getServerUrl() + this.getApiEndPoint()

    return this.http.get(url)
      .toPromise()
      .then(items => {
        console.log('validate.ts', items);
        
        return items;
      }
      )
      .catch(err => {
        console.log('error validate ',err);
        return Promise.reject(err.error);
      });
  }

}