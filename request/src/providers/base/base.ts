import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Constants } from '../../app/app.constants';

@Injectable()
export class BaseProvider {

  public static SORT_ASC     = 1;
  public static SORT_DES     = -1;

  constructor(
    public http: HttpClient,
  ) {
  }

  getApiEndPoint(){
    return "";
  }

  getServerUrl(){
    return Constants.API_BASE_URL;
  }

  create(item) {
    var url = this.getServerUrl() + this.getApiEndPoint();

    return this.http.post(url,item)
    .toPromise()
    .then(response => response)
    .catch(this.handleError.bind(this));
  }

update(item) {
  var url = this.getServerUrl() + this.getApiEndPoint() + "/" + item.id;

  return this.http.put(url,item)
  .toPromise()
  .then(response => response)
  .catch(this.handleError.bind(this));
}

remove(item) {
  var url = this.getServerUrl() + this.getApiEndPoint() + "/" + item.id;

  return this.http.delete(url,item)
  .toPromise()
  .then(response => response)
  .catch(this.handleError.bind(this));
}

saveElements(items,key){
  localStorage.setItem(key,JSON.stringify(items));
}

saveItems(items){
  this.saveElements(items, this.getApiEndPoint());
}

getItems(){
  console.log("Get Items");
  var items = localStorage.getItem(this.getApiEndPoint());
  if(items){
    return JSON.parse(items);
  } else {
    return [];
  }

}

getAll(){
  return this.getAllFilterAndSort({},{name:1});
}

getAllFilterAndSort(pFilters,pSort){
  return this.getAllFilterAndSortAndPopulates(pFilters,pSort,[]);
}

getAllFilterAndSortAndPopulates(pFilters,pSort,pPopulates){

  //console.log("getAllFilterAndSortAndPopulates");
  //let items = this.getItems();
  //if (items.length > 0) return Promise.resolve(items);
 
  var sort = {};
  if(pSort) sort = pSort;

  var filters = {};
  if(pFilters) filters = pFilters;

  var populates = [];
  if(pPopulates) populates = pPopulates;

  var url = this.getServerUrl() + this.getApiEndPoint()
          + "/?_filters=" + encodeURI(JSON.stringify(filters))
          + "&_sort=" + encodeURI(JSON.stringify(sort))
          + "&_populates=" + encodeURI(JSON.stringify(populates));


  return this.http.get( url )
  .toPromise()
  .then(items =>{
      this.saveItems(items);
      return items as any[];
    }
  )
  .catch(response => {
    console.log(response);
    if(response.status == 0){
      return Promise.resolve(this.getItems());
    } else {
      return this.handleError(response);
    }
  });
  //  .catch(this.handleError.bind(this));
}

getById(id){
  return this.getByIdWithPopulates(id,[]);
}
getByIdWithPopulates(id,populates){
  let url = this.getServerUrl() + this.getApiEndPoint() + "/" + id
          + '?_populates=' + encodeURI(JSON.stringify(populates));
  return this.http.get(url)
  .toPromise()
  .then(response =>
    response
  )
  .catch(this.handleError.bind(this));
}

public handleError(response: any): Promise<any> {
  if(!response.status){
    alert(JSON.stringify(response));
    return Promise.reject(response);
  } else if(response.status == 401){
    alert("No se encuentra autorizado.");
    return Promise.reject("No se encuentra autorizado.");
  } else if(response.status == 404){
    return Promise.reject("No se encuentra el registro: " + response.url);
  } else if(response.status == 400){
    console.error('An error occurred', response);
    var error = response.message || response;
    if(response.error) if(response.error.errors) if(response.error.errors.length > 0)
      error = response.error.errors[0];
    return Promise.reject(error);
  } else if(response.status == 500){
    var body = JSON.parse(response._body);
    return Promise.reject(body.description);
  } else {
    console.error('An error occurred', response);
    var message = response.message || response;
    if(response.error) if(response.error.errors) if(response.error.errors.length > 0)
      message = response.error.errors[0].message;
    return Promise.reject(message);
  }
}
}
