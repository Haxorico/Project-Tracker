import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })

export class WebService {
  constructor(private httpClient: HttpClient) { }
  private REST_API_SERVER = "http://localhost:9000/";
  
  //#TODO move the query paramters as an object

  private getAuthHeader() {
    const token = localStorage.getItem("token");
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': token
      })
    };
    return httpOptions;
  }

  private getUrl(path: string, queryName, queryData, params) {
    let url = this.REST_API_SERVER + path + params;
    if (queryName != "" && queryData != "")
      url += "?" + queryName + "=" + queryData;
    return url;
  }

  private getHttpMetaData(path, queryName, queryData, params){
    const url = this.getUrl(path, queryName, queryData, params)
    const header = this.getAuthHeader();
    return {url, header};
  }

  public GetData(path: string, queryName = "", queryData = "", params = "") {
    const {url, header } = this.getHttpMetaData(path,queryName,queryData,params);
    return this.httpClient.get(url, header);
  }

  public GetDataArray(path: string, queryName = "", queryData = "", params = "") {
    const {url, header } = this.getHttpMetaData(path,queryName,queryData,params);
    return this.httpClient.get(url, header).pipe(map((responseData: { [key: string]: any }) => {
      const tempArray = [];
      //#TODO Explain what this for loop is.
      for (const key in responseData) {
        if (responseData.hasOwnProperty(key)) {
          tempArray.push({ ...responseData[key] });
        }
      }
      return tempArray;
    }));
  }

  public AddData(path: string, dataToAdd, queryName = "", queryData = "", params = "") {
    const {url, header } = this.getHttpMetaData(path,queryName,queryData,params);
    return this.httpClient.post(url, dataToAdd, header);
  }

  public UpdateData(path: string, dataToUpdate, queryName = "", queryData = "", params = "") {
    const {url, header } = this.getHttpMetaData(path,queryName,queryData,params);
    return this.httpClient.put(url, dataToUpdate, header);
  }

  public DeleteData(path: string, queryName = "", queryData = "", params = "") {
    const {url, header } = this.getHttpMetaData(path,queryName,queryData,params);
    return this.httpClient.delete(url, header);
  }
}
