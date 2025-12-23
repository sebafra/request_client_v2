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
export class ArticleProvider extends BaseProvider {

  getApiEndPoint() {
    return Constants.API_METHOD_ARTICLE;
  }

  getAllFilterAndSortAndPopulates(pFilters, pSort, pPopulates) {

    //console.log("getAllFilterAndSortAndPopulates");
    let items = this.getItems();
    let props = Object.keys(pSort);
    console.log("Antes de ordenar: ",items);
    let prop = (props[0]).toString();
    let arr = items.sort((a, b) => a[prop] <= b[prop] ? -1 : 1);
    console.log("Despues de ordenar: ", arr);
    if (arr.length > 0) {
      return Promise.resolve(arr)
    };

    console.log("%%%%%%% ARTICLE SERVICE CALL %%%%%%%");

    var sort = {};
    if (pSort) sort = pSort;

    var filters = {};
    if (pFilters) filters = pFilters;

    var populates = [];
    if (pPopulates) populates = pPopulates;

    var url = this.getServerUrl() + this.getApiEndPoint()
      + "/?_filters=" + encodeURI(JSON.stringify(filters))
      + "&_sort=" + encodeURI(JSON.stringify(sort))
      + "&_populates=" + encodeURI(JSON.stringify(populates));


    return this.http.get(url)
      .toPromise()
      .then(items => {
        this.saveItems(items);
        return items as any[];
      }
      )
      .catch(response => {
        console.log(response);
        if (response.status == 0) {
          return Promise.resolve(this.getItems());
        } else {
          return this.handleError(response);
        }
      });
    //  .catch(this.handleError.bind(this));
  }
}