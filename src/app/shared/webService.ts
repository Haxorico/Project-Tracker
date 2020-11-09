import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })

export class WebService {
  constructor(private httpClient: HttpClient) { }
  private REST_API_SERVER = "http://localhost:9000/";

  private getAuthHeader() {
    const token = localStorage.getItem("token");
    const httpOptions : any = {};
    if (token) {
      httpOptions.headers = new HttpHeaders({
        'Authorization': token
      });
    }
    return httpOptions;
  }

  private getUrl(path: string, queryParams, params) {
    let url = this.REST_API_SERVER + path + params;
    if (queryParams.name  && queryParams.data )
      url += "?" + queryParams.anme + "=" + queryParams.data;
    return url;
  }

  private getHttpMetaData(path, queryParams, params) {
    const url = this.getUrl(path, queryParams, params)
    const header = this.getAuthHeader();
    return { url, header };
  }

  public GetData(path: string, queryParams = {}, params = "") {
    const { url, header } = this.getHttpMetaData(path, queryParams, params);
    return this.httpClient.get(url, header);
  }

  public GetDataArray(path: string, queryParams = {}, params = "") {
    const { url, header } = this.getHttpMetaData(path, queryParams, params);
    return this.httpClient.get(url, header).pipe(map((responseData: any) => {
      //#ONGOING
      console.log("WebSerice.GetDataArray => ")
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

  public AddData(path: string, dataToAdd, queryParams = {}, params = "") {
    const { url, header } = this.getHttpMetaData(path, queryParams, params);
    return this.httpClient.post(url, dataToAdd, header);
  }

  public UpdateData(path: string, dataToUpdate,queryParams = {}, params = "") {
    const { url, header } = this.getHttpMetaData(path, queryParams, params);
    return this.httpClient.put(url, dataToUpdate, header);
  }

  public DeleteData(path: string, queryParams = {}, params = "") {
    const { url, header } = this.getHttpMetaData(path, queryParams, params);
    return this.httpClient.delete(url, header);
  }
}
