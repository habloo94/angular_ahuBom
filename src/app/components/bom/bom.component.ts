import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormArray, FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import {read, write, readFile, writeFile, WorkBook, WorkSheet, utils} from 'xlsx';
// import * as ExcelJS from 'exceljs';
import { ItemMaster } from '../../services/interface';
import { Pipe, PipeTransform } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { sync, async, proxy } from 'edge-ts';
import { Observable, Subject, ReplaySubject } from 'rxjs';
import { MatSelect } from '@angular/material/select';
import { Data } from './data';
import { take, takeUntil } from 'rxjs/operators';
import * as XLSX from 'xlsx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { url } from '../../config';

interface Food {
  value: string;
  viewValue: string;
}


// tslint:disable-next-line: use-pipe-transform-interface
@Component({
  selector: 'app-bom',
  templateUrl: './bom.component.html',
  styleUrls: ['./bom.component.css']
})

export class BomComponent extends Data implements OnInit {

  name = 'slideToggle';
  id = 'materialSlideToggle';
  checked = false;
  disabled = false;
  label = 'Toggle On/Off';
  labelledby = 'Some Other Text';

  name1 = 'slideToggle1';
  id1 = 'materialSlideToggle1';

@ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

   isLinear = true;
  unitForm: FormGroup;
  fanForm: FormGroup;
  coilForm: FormGroup;
  filterForm: FormGroup;
  FifthFormGroup: FormGroup;
  wasClicked = false;
  wasClickedFan = false;

protected _onDestroy = new Subject<void>();

  ahuSpec: FormGroup;

  calc; calcResult;

  filterargs = {Item_Group: 'text'};
  // tslint:disable-next-line: max-line-length
  // items: ItemMaster[] = [{id: 1, Code: '1', Name: 'hello world', Unit: 'kk', Brand: 'tt', Item_Group: 'G.I / COATED SHEETS'}, {id: 2, Code: '2', Name: 'hello kitty', Unit: 'kk', Brand: 'tt',  Item_Group: 'number'}, {id: 3, Code: '3', Name: 'foo bar', Unit: 'kk', Brand: 'tt',  Item_Group: 'G.I / COATED SHEETS'}];

  selectedSupplyFanModel; selectedExhaustFanModel; selectedCoilType; selectedFIlterType;

  constructor(
    private formBuilder: FormBuilder,
    private backendservice: BackendService,
    private http: HttpClient) { super(); }


  foods: Food[] = [
    {value: '1', viewValue: '0.6mm PPGI'},
    {value: '2', viewValue: '0.8mm PPGI'},
    {value: '3', viewValue: '1.0mm PPGI'},
    {value: '1', viewValue: '1.2mm PPGI'},
    {value: '2', viewValue: '0.6mm Plain'},
    {value: '3', viewValue: '0.8mm Plain'},
    {value: '2', viewValue: '1.0mm Plain'},
    {value: '3', viewValue: '1.2mm Plain'}
  ];

  dataum = [
    {
      'BILL OF MATERIALS.': 'LUFTEK ENGINEERING (P) LTD'
    },
    {
      'BILL OF MATERIALS.': 'TITLE:',
      __EMPTY_1: 'DIAL - T3',
      __EMPTY_2: 'PREPARED BY  :   V.ASHOK KUMAR'
    },
    {
      'BILL OF MATERIALS.': 'PRODUCT:',
      __EMPTY_1: 'AHU',
      __EMPTY_2: 'CHECKED BY    :    K.PREM KUMAR'
    },
    {
      'BILL OF MATERIALS.': 'CAPACITY :',
      __EMPTY_1: '6700  CFM',
      __EMPTY_2: 'APPROVED BY  :   J.WAHAB'
    },
    {
      'BILL OF MATERIALS.': 'QTY:',
      __EMPTY_1: '1 ',
      __EMPTY_2: 'DATE                  :    09-02-09'
    },
    {
      'BILL OF MATERIALS.': 'MODEL:',
      __EMPTY_1: 'EHF 108 ',
      __EMPTY_2: 'REV NO             :   00'
    },
    {
      'BILL OF MATERIALS.': 'S.NO.',
      __EMPTY: 'Part Code',
      __EMPTY_1: 'DESCRIPTION',
      __EMPTY_2: 'SPECIFICATION',
      __EMPTY_3: 'Type',
      __EMPTY_4: 'QTY/AHU',
      __EMPTY_5: 'UOM',
      __EMPTY_6: 'Total Qty'
    }
  ];

  exportTable()
  {
    console.log('Hi');

    let newArray:any[]=[];
    let data = Object.values(this.dataum);
    Object.keys(data).forEach((key, index)=>{
        newArray.push({
          'Ind. ID': data[key].value,
          'HH ID': data[key].viewValue
        })
      });


    // const ss: XLSX.WorkBook = XLSX.readFile('../../../assets/data/calc/bom_temp.xlsx');

    //   console.log(ss);

    const ws: XLSX.WorkSheet= XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'BOM_Entry');

    /* save to file */
    XLSX.writeFile(wb, 'BOM.xlsx');
  }

  ngOnInit(): void {
    // this.exportTable();

    // const blobs = new Blob(["Hello, world!"], {type: "text/plain;charset=utf-8"});
    // FileSaver.saveAs(blobs, "hello world.txt");
    // FileSaver.saveAs(new Blob(['hello, world'], {type: 'text/csv'}), 'Export.csv');


    this.getItemMasterData();
    // this.getCasingCal();
    this.ahuSpec = this.formBuilder.group({
      customer : ['', [Validators.required]],
      project : ['', [Validators.required]],
      so_num : ['', [Validators.required]],
      location : ['', [Validators.required]],
      ahuModel : ['', [Validators.required]],
      ahuType : ['', [Validators.required]],
      ahuTag : ['', [Validators.required]],
      ahuQty : ['', [Validators.required]],

      unitForm : this.formBuilder.group({
        airVolume: ['', [Validators.required]],
        ESP: ['', [Validators.required]],
        outerSheet: ['', [Validators.required]],
        innerSheet : ['', [Validators.required]],
        profileType : ['', [Validators.required]],
        panelThick : ['', [Validators.required]],
        insulation : ['', [Validators.required]],
        baseType : ['', [Validators.required]],
        baseHeight : ['', [Validators.required]],
        baseThick : ['', [Validators.required]],
        supplyDimension : this.formBuilder.array([this.addSupplySectionFormGroup()]),
        exhaustDimension : this.formBuilder.array([this.addExhaustSectionFormGroup()])
      }),

      fanForm: this.formBuilder.group({
        supplyFan: this.formBuilder.group({
          fanModel: ['', [Validators.required]],
          fanQty: ['', [Validators.required]],
          motorModel: ['', [Validators.required]],
          motorQty: ['', [Validators.required]],
          totalQty: ['', [Validators.required]],
          antiVibrant: ['', [Validators.required]],
          fanPulley: ['', [Validators.required]],
          motorPulley: ['', [Validators.required]],
          belt: ['', [Validators.required]]
        }),

        exhaustFan: this.formBuilder.group({
          fanModel: ['', [Validators.required]],
          fanQty: ['', [Validators.required]],
          motorModel: ['', [Validators.required]],
          motorQty: ['', [Validators.required]],
          totalQty: ['', [Validators.required]],
          antiVibrant: ['', [Validators.required]],
          fanPulley: ['', [Validators.required]],
          motorPulley: ['', [Validators.required]],
          belt: ['', [Validators.required]]
        })
      }),

      coilForm: this.formBuilder.group({
        coils : this.formBuilder.array([this.addCoilFormGroup()])
      }),

      filterForm: this.formBuilder.group({
        filters : this.formBuilder.array([this.addFilterFormGroup()])
      })
    });
    this.selectedSupplyFanModel = this.ahuSpec.controls.fanForm['controls'].supplyFan.controls.fanModel;
    this.selectedExhaustFanModel = this.ahuSpec.controls.fanForm['controls'].exhaustFan.controls.fanModel;
    this.selectedCoilType = this.ahuSpec.controls.coilForm.get('coils')['controls'];


    this.giSheetsInnerFiltrCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.searchfilter_giSheetsInner();
      });
    this.giSheetsOuterFiltrCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.searchfilter_giSheetsOuter();
      });
    this.profileTypeFiltrCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.searchfilter_profileType();
      });
    this.supplyFanFiltrCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.searchfilter_supplyFan();
      });
    this.exhaustFanFiltrCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.searchfilter_exhaustFan();
      });
    this.supplyMotorFiltrCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.searchfilter_supplyMotor();
      });
    this.exhaustMotorFiltrCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.searchfilter_exhaustMotor();
      });
    this.supplyFanPulleyFiltrCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.searchfilter_supplyFanPulley();
      });
    this.exhaustFanPulleyFiltrCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.searchfilter_exhaustFanPulley();
      });
    this.supplyMotorPulleyFiltrCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.searchfilter_supplyMotorPulley();
      });
    this.exhaustMotorPulleyFiltrCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.searchfilter_exhaustMotorPulley();
      });
    this.supplyBeltFiltrCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.searchfilter_supplyBelt();
      });
    this.exhaustBeltFiltrCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.searchfilter_exhaustBelt();
      });

    //   this.firstFormGroup = this.formBuilder.group({
    //   firstCtrl: ['', Validators.required]
    // });
    // this.secondFormGroup = this.formBuilder.group({
    //   secondCtrl: ['', Validators.required]
    // });
  
  }


  onChange(value1: boolean) {
    console.log("clicked by togglr value");
    this.wasClicked = !this.wasClicked
    var length = this.ahuSpec.controls.unitForm.get('exhaustDimension').value.length;
    if(value1 == true && length == 0){
      this.addExhaustSectionFormGroupClick();
    }else if(value1 == false){
      this.removeExhaustSectionFormGroupClick1(length);
    }
  }

  onChange1(value1: boolean) {
    console.log("clicked by togglr value");
    this.wasClickedFan = !this.wasClickedFan
    // var length = this.ahuSpec.controls.unitForm.get('exhaustDimension').value.length;
    // if(value1 == true && length == 0){
    //   this.addExhaustSectionFormGroupClick();
    // }else if(value1 == false){
    //   this.removeExhaustSectionFormGroupClick1(length);
    // }
  }

  fanmodelChange(i){
    this.selectedFIlterType = this.ahuSpec.controls.filterForm.get('filters')['controls'][i];
    console.log(this.selectedFIlterType.valueChanges.type);

  }

  addSupplySectionFormGroupClick(): void {
    (this.ahuSpec.controls.unitForm.get('supplyDimension') as FormArray).push(this.addSupplySectionFormGroup());
  }
  removeSupplySectionFormGroupClick(i: number): void {
    (this.ahuSpec.controls.unitForm.get('supplyDimension') as FormArray).removeAt(i);
  }
  addExhaustSectionFormGroupClick(): void {
    (this.ahuSpec.controls.unitForm.get('exhaustDimension') as FormArray).push(this.addExhaustSectionFormGroup());
  }
  removeExhaustSectionFormGroupClick(i: number): void {
    (this.ahuSpec.controls.unitForm.get('exhaustDimension') as FormArray).removeAt(i);
  }
  removeExhaustSectionFormGroupClick1(length: number): void {
    for(var i =0;i<length;i++){
      (this.ahuSpec.controls.unitForm.get('exhaustDimension') as FormArray).removeAt(i);
    }
  }
  addCoilFormGroupClick(): void{
    (this.ahuSpec.controls.coilForm.get('coils') as FormArray).push(this.addCoilFormGroup());
  }
  addCoilDistributorFormGroupClick(coilIndex: number): void{
    (((this.ahuSpec.controls.coilForm.get('coils') as FormArray)
            .controls[coilIndex] as FormGroup).controls.distributors as FormArray).push(this.coilDistributor());
    // (this.ahuSpec.controls.coilForm.get('') as FormArray).push(this.addCoilFormGroup());
  }
  addFilterFormGroupClick(): void{
    (this.ahuSpec.controls.filterForm.get('filters') as FormArray).push(this.addFilterFormGroup());
  }
  addFilterSizesFormGroupClick(filterIndex: number): void{
    (((this.ahuSpec.controls.filterForm.get('filters') as FormArray)
            .controls[filterIndex] as FormGroup).controls.sizes as FormArray).push(this.filterSizes());
  }

  addSupplySectionFormGroup(): FormGroup{
    // tslint:disable-next-line: no-unused-expression
    return this.formBuilder.group({
      length: ['', [Validators.required]],
      width: ['', [Validators.required]],
      height: ['', [Validators.required]]
    });
  }
  addExhaustSectionFormGroup(): FormGroup{
    // tslint:disable-next-line: no-unused-expression
    return this.formBuilder.group({
      length: ['', [Validators.required]],
      width: ['', [Validators.required]],
      height: ['', [Validators.required]]
    });
  }
  addCoilFormGroup(): FormGroup{
    return this.formBuilder.group({
      coilType : ['', [Validators.required]],
      finHeight :  ['', [Validators.required]],
      finLength :  ['', [Validators.required]],
      rowDeep :  ['', [Validators.required]],
      fpi :  ['', [Validators.required]],
      circuit : ['', [Validators.required]],
      tubeDia : ['', [Validators.required]],
      finMaterial : ['', [Validators.required]],
      tubeMaterial : ['', [Validators.required]],
      headerMaterial : ['', [Validators.required]],
      casingMaterial : ['', [Validators.required]],
      drainPanMaterial : ['', [Validators.required]],
      eliminator : ['', [Validators.required]],
      qty : ['', [Validators.required]],
      distributors : this.formBuilder.array([this.coilDistributor()]),
    });
  }
  coilDistributor(): FormGroup{
    return this.formBuilder.group({
      inlet: ['', [Validators.required]],
      outlet: ['', [Validators.required]],
    });
  }
  addFilterFormGroup(): FormGroup{
    return this.formBuilder.group({
      type: ['', [Validators.required]],
      casingMaterial: ['', [Validators.required]],
      sizes: this.formBuilder.array([this.filterSizes()]),
    });
  }
  filterSizes(): FormGroup{
    return this.formBuilder.group({
      size: ['', [Validators.required]],
      qty: ['', [Validators.required]],
    });
  }

  // getItemMasterData(){
  //   this.itemMasterData$ = this.backendservice.getItemMasterData();
  //   this.itemMasterData$.subscribe(result => {
  //     this.itemMasterData = result;
  //   });
  //   }

  // getItemMasterData(){
  //   const oReq = new XMLHttpRequest();
  //   oReq.open('GET', '../assets/data/item_master.xlsx', true);
  //   oReq.responseType = 'arraybuffer';
  //   oReq.onload = () => {
  //   const arraybuffer = oReq.response;
  //   /* convert data to binary string */
  //   const data = new Uint8Array(arraybuffer);
  //   const arr = new Array();
  //   for (let i = 0; i !== data.length; ++i) { arr[i] = String.fromCharCode(data[i]);}
  //   const bstr = arr.join('');
  //   /* Call XLSX */
  //   const workbook = XLSX.read(bstr, {type: 'binary'});
  //   // console.log(workbook);
  //   /* DO SOMETHING WITH workbook HERE */
  //   const sheet = workbook.SheetNames[0];
  //   /* Get worksheet */
  //   const worksheet = workbook.Sheets[sheet];
  //   const jsonData: ItemMaster[] = XLSX.utils.sheet_to_json(worksheet , {raw: true});
  //   // console.log(jsonData);

  //   this.giSheets = jsonData.filter(i => (i.Item_Group === 'G.I / COATED SHEETS'));
  //   this.fltr_giSheets;
  //   console.log(this.giSheets);
  //   // return this.itemMasterData;
  //   // const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  //   // return this.http.get(jsonData, httpOptions);
  //   // this.chwCU = chwCUData;

  //   };
  //   oReq.send();
  // }

  loadItemMaster(){

  }
  writeContents(content, fileName, contentType) {
    const a = document.createElement('a');
    const file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
  }

  onSubmit(formData){

          // ORIGIANAL
     // if(this.ahuSpec.invalid){
     //      return false;
     //  }
    console.log(formData,"formdata entry in the function");
    this.calc = this.backendservice.getCalculation(formData);
    console.log(this.calc,"this.calc");
    this.calc.subscribe(result => {
      this.calcResult = result;
      console.log(result);
      const headers = new HttpHeaders({ 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      this.http.get(url+'download', { headers, responseType: 'blob' }).toPromise().then(blob => {
          console.log('running');
          saveAs(blob, 'BOM.xlsx');
      }).catch(err => console.error('download error = ', err));
    });
    // return false;
    // this.calc = this.backendservice.getCalculation(formData);
    // console.log(this.calc,"this.calc");
    // this.calc.subscribe(result => {
      // this.calcResult = result;
      // console.log(result);
      // const headers = new HttpHeaders({ 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})
     
      // this.http.post('http://localhost:3200/casingCalc',formData, { responseType: 'blob' }).toPromise().then(data => {
      //     console.log('running');
      //     let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      //     saveAs(blob, 'BOM.xlsx');
      // })

    // });

    // this.calc = this.backendservice.getCalculation(formData);
    // console.log(this.calc,"this.calc");
    // this.calc.subscribe(result => {
    //   this.calcResult = result;
    //   console.log(result);
    //   const headers = new HttpHeaders({ 'Content-Type': 'application/json' })
    //   this.http.post(url +'casingCalc',formData, { headers, responseType: 'blob' }).toPromise().then(response_calc => {
    //       console.log(response_calc);
    //       var file = new Blob([response_calc], { 
    //         type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    //     });
    //       saveAs(file,"BOM_CALC"+".xlsx");

    //   this.http.get('http://localhost:3200/download',{ responseType: 'blob' }).toPromise().then(response => {
    //     var file = new Blob([response], { 
    //         type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    //     });
    //       saveAs(file,"BOM"+".xlsx");

    //     })
    //       //saveAs(blob, 'BOM.xlsx');
    //   })
    // });


  


    ///demfkegnk
    // if(this.ahuSpec.invalid){
    //       return false;
    //   }
    //   console.log(formData,"formdata");
    //   // const headers = new HttpHeaders({ 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    //   this.http.post('/casingCalc',formData, { responseType: 'blob' }).toPromise().then(blob => {
    //       console.log('running',blob);
    //       saveAs(blob, 'BOM.xlsx');
    //   }).catch(err => console.error('download error = ', err));
    // // });



    // const x = JSON.stringify(formData, null, '\t');
    // this.writeContents(x, 'data' + '.json', 'application/json');
    // const excelFile = '../assets/data/calc/casing.xlsx';
    // const sheetName = 'Sheet1'; // <-- Change to the actual sheet name.
    // const workbook = XLSX.readFile(excelFile);
    // const ws = workbook.Sheets[sheetName];
    // console.log(ws);


    // // Overwrite worksheet
    // workbook.Sheets[sheetName] = XLSX.utils.json_to_sheet(sheetJson);
    // XLSX.writeFile(workbook, excelFile);

    // function(json: any) {
    //   const jsonse = JSON.stringify(json);
    //   const blob = new Blob([jsonse], {
    //     type: 'application/json'
    //   });
    //   const filename = "my_json";
    //   saveAs(blob, filename + '.json');
    // }
    // const file = '../../../assets/savedData/data.json';
    // const obj = { name: 'JP' };
    // jsonfile.writeFile(file, obj, (err) => {
    //   if (err) { console.error(err); }
    // });
  }

  stepChanged(event,stepper){
    console.log(event,"event");
    console.log(stepper,"stepper");

    if (event.previouslySelectedIndex >= event.selectedIndex) {
     event.previouslySelectedStep.interacted = false;
    }
  }

}
