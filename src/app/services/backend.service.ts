import { Injectable } from '@angular/core';
import { Coilprice, ItemMaster } from './interface';
import * as XLSX from 'xlsx';
import { Observable } from 'rxjs';
import {Response} from '@angular/http';
import { url } from '../config';
import { HttpClient, HttpHeaders, HttpClientModule, HttpErrorResponse  } from '@angular/common/http';
// import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

@Injectable({
  providedIn: 'root'
})

export class BackendService {

  constructor(
    private http: HttpClient) { }
  private chwMS: Observable<Coilprice[]>;
  private chwCU: Observable<Coilprice[]>;
  private dxNC: Observable<Coilprice[]>;
  private dxIC: Observable<Coilprice[]>;
  private itemMasterData$: Observable<ItemMaster[]>;
  private calc;





  loadCoilPrice(){
    const oReq = new XMLHttpRequest();
    oReq.open('GET', '../assets/data/coil_price_sales.xlsx', true);
    oReq.responseType = 'arraybuffer';
    oReq.onload = (e) => {
    const arraybuffer = oReq.response;
    /* convert data to binary string */
    const data = new Uint8Array(arraybuffer);
    const arr = new Array();
    for (let i = 0; i !== data.length; ++i) { arr[i] = String.fromCharCode(data[i]); }
    const bstr = arr.join('');
    /* Call XLSX */
    const workbook = XLSX.read(bstr, {type: 'binary'});
    /* DO SOMETHING WITH workbook HERE */
    const chwMS = workbook.SheetNames[0];
    const chwCU = workbook.SheetNames[1];
    const dxNC = workbook.SheetNames[2];
    const dxIC = workbook.SheetNames[3];
    /* Get worksheet */
    const chwMSworksheet = workbook.Sheets[chwMS];
    const chwCUworksheet = workbook.Sheets[chwCU];
    const dxNCworksheet = workbook.Sheets[dxNC];
    const dxICworksheet = workbook.Sheets[dxIC];
    const chwMSData = XLSX.utils.sheet_to_json(chwMSworksheet , {raw: true});
    const chwCUData = XLSX.utils.sheet_to_json(chwCUworksheet , {raw: true});
    const dxNCData = XLSX.utils.sheet_to_json(dxNCworksheet , {raw: true});
    const dxICData = XLSX.utils.sheet_to_json(dxICworksheet , {raw: true});

    // this.chwCU = chwCUData;

    };
    oReq.send();
  }
  getItemMasterData(){
      const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' })};
      this.itemMasterData$ = this.http.get<ItemMaster[]>('http://localhost:3000/itemMasterData', httpOptions);
      return this.itemMasterData$;
  }

  getCalculation(data){
    console.log("entering in get calculation api")
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json','Access-Control-Allow-Origin': '*' })};
    this.calc = this.http.post(url+'casingCalc', data, httpOptions);
    return this.calc;
}

    // getCalculation(data){
    //   return new Promise((resolve,reject) => {
    //        this.http.get(url+'casingCalc',data).subscribe(postdata => {
    //          resolve(postdata);
    //        }, err => {
    //          console.log(err);
    //          reject(err);
    //        });
    //      });
    // }


download(){
  const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })};
  return this.http.get('api/downloadExcel', httpOptions);
}
}
