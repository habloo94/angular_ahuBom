import { Component, OnInit, ViewChild } from '@angular/core';
import {options} from '../../../interface-data/options';
import { Coilprice } from '../../../services/interface';
import * as XLSX from 'xlsx';
import { FormGroup, FormControl, NgForm } from '@angular/forms';
import { DatePipe } from '@angular/common';
import {Observable, ReplaySubject, Subject} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { take, takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';

export interface User {
  id: number;
  name: string;
}

@Component({
  selector: 'app-belt',
  templateUrl: './belt.component.html',
  styleUrls: ['./belt.component.css']
})
export class BeltComponent implements OnInit {

  beltCalcForm;



// myControl = new FormControl();
options;
// filteredMotorModel: Observable<any[]>;

wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
url = '../data/Pulley Calc Data.xlsx';

title = 'Belt';

projectName; jobRef; selectionDate; serialNum; revNum;
fanPulley; pulleyList; F_SPA_PUL; F_SPB_PUL; F_BELTS; belts = []; matchingBelts;

motorType; motorModel; motorModelFiltrCtrl = new FormControl(); PulleyFiltrCtrl = new FormControl();fanModelFiltrCtrl = new FormControl();
motorModelError; selectedMotorData; motorSpeed; motorPulley; public MOTOR_DIMS: any[]; MBDIMS;
centerDistance; selectedFanPulleyData; selectedMotorPulleyData; motorPulleyError; fanPulleyError;
selectedMotorBaseData; selectedManDimData; newProjectDetails; criticalHeight;
projectWindow = false; loading = false;

fanOrientations = options.fanOrientation;
motorPositions = options.motorPosition;
motorPosition; selected_motorPosition;
fanOrientaion; selected_FanOrientation;
fanTypes = options.fanTypes; fanType;
  // fanData = fanData.fanData;
ahuTag; fanSpeed;
fanData; selectedFanData; MANUF_DIMS;
fanModel; fanModelError; result; noresult;

public filteredMotorModel: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
public filteredpulley: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
public filteredfanModel: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

private chwMS: Observable<Coilprice>;
private chwCU: Observable<Coilprice>;
private dxNC: Observable<Coilprice>;
private dxIC: Observable<Coilprice>;

@ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;


protected _onDestroy = new Subject<void>();


  public datepipe: DatePipe;
constructor( ){}

selectedFanOrientation(item){

    this.selected_FanOrientation = item;
    console.log(this.selected_FanOrientation);
    this.motorPositions = options.motorPosition.filter(i => (i.fancode == this.selected_FanOrientation.code));
    console.log(this.motorPositions);
  }

selectedMotorPosition(item){
    this.selected_motorPosition = item;
  }

load_fanData(){
    const oReq = new XMLHttpRequest();
    oReq.open('GET', '../assets/data/Pulley_Calc_Data.xlsx', true);
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
    // tslint:disable-next-line: variable-name
    const fan_data = workbook.SheetNames[1];
    const MANUF_DIMS = workbook.SheetNames[4];
    const MOTOR_DIMS = workbook.SheetNames[6];
    const MBDIMS = workbook.SheetNames[2];
    const F_SPA_PUL = workbook.SheetNames[8];
    const F_SPB_PUL = workbook.SheetNames[9];
    const F_BELTS = workbook.SheetNames[10];
    /* Get worksheet */
    // tslint:disable-next-line: variable-name
    const fan_data_worksheet = workbook.Sheets[fan_data];
    const MANUF_DIMS_worksheet = workbook.Sheets[MANUF_DIMS];
    const MOTOR_DIMS_worksheet = workbook.Sheets[MOTOR_DIMS];
    const MBDIMS_worksheet = workbook.Sheets[MBDIMS];
    const F_SPA_PUL_worksheet = workbook.Sheets[F_SPA_PUL];
    const F_SPB_PUL_worksheet = workbook.Sheets[F_SPB_PUL];
    const F_BELTS_worksheet = workbook.Sheets[F_BELTS];
    this.fanData = XLSX.utils.sheet_to_json(fan_data_worksheet , {raw: true});
    this.MANUF_DIMS = XLSX.utils.sheet_to_json(MANUF_DIMS_worksheet , {raw: true});
    this.MOTOR_DIMS = XLSX.utils.sheet_to_json(MOTOR_DIMS_worksheet , {raw: true});
    this.MBDIMS = XLSX.utils.sheet_to_json(MBDIMS_worksheet , {raw: true});
    this.F_SPA_PUL = XLSX.utils.sheet_to_json(F_SPA_PUL_worksheet , {raw: true});
    this.F_SPB_PUL = XLSX.utils.sheet_to_json(F_SPB_PUL_worksheet , {raw: true});
    this.F_BELTS = XLSX.utils.sheet_to_json(F_BELTS_worksheet , {raw: true});
    this.pulleyList = [...this.F_SPA_PUL, ...this.F_SPB_PUL];
    this.filteredMotorModel.next(this.MOTOR_DIMS.slice());
    this.filteredpulley.next(this.pulleyList.slice());
    this.filteredfanModel.next(this.fanData.slice());


    // this.filteredMotorModel = this.myControl.valueChanges
    // .pipe(
    //   startWith(''),
    //   map(value => typeof value === 'string' ? value : value.name),
    //   map(name => name ? this._filter(name) : this.MOTOR_DIMS.slice())
    // );
    // console.log(this.filteredMotorModel);
    };
    oReq.send();
  }

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
    console.log(chwMSworksheet);
    const chwMSData = XLSX.utils.sheet_to_json(chwMSworksheet , {raw: true});
    const chwCUData = XLSX.utils.sheet_to_json(chwCUworksheet , {raw: true});
    const dxNCData = XLSX.utils.sheet_to_json(dxNCworksheet , {raw: true});
    const dxICData = XLSX.utils.sheet_to_json(dxICworksheet , {raw: true});
    console.log(chwMSData);

    // this.chwCU = chwCUData;

    };
    oReq.send();
  }

getFanData(){
    this.selectedFanData = this.fanData.filter(i => (i.FAN_SIZE == this.fanModel));
    if (this.selectedFanData.length == 0){
      this.fanModelError = 'Fan size is not available';
    } else { this.fanModelError = ''; }
    this.selectedManDimData = this.MANUF_DIMS.filter(i => (i.FANSIZE == this.fanModel));
    this.criticalHeight = this.selectedFanData[0].Critical_Height;
  }
  // getMotorData(){
  //   console.log(this.myControl.value);

  // }

getMotorData(){
    // console.log(this.motorModel);

    this.selectedMotorData = this.MOTOR_DIMS.filter(i => (i.FRAMESIZE == this.motorModel));
    console.log(this.selectedMotorData);

    if (this.selectedMotorData.length == 0){
      this.motorModelError = 'Motor size is not available';
    } else { this.motorModelError = ''; }
    this.selectedMotorBaseData = this.MBDIMS.filter(i => (i.MB_MODEL == this.selectedMotorData[0].Motor_Base));
  }

getFanPulleyData(){
    this.selectedFanPulleyData = this.pulleyList.filter(i => (i.CODE == this.fanPulley));
    if (this.selectedFanPulleyData.length == 0){
      this.fanPulleyError = 'Pulley is not available';
    } else { this.fanPulleyError = ''; }
  }



getMotorPulleyData(){
    this.selectedMotorPulleyData = this.pulleyList.filter(i => (i.CODE == this.motorPulley));

    if (this.selectedMotorPulleyData.length == 0){
      this.motorPulleyError = 'Pulley is not available';
    } else { this.motorPulleyError = ''; }
  }

projectDetails(formData){
    console.log(formData);
    this.newProjectDetails = formData;
  }

criticalHeightCheck(){
    console.log('10');

  }

openProjects(){
    this.projectWindow = true;
  }
closeProjects(){
    this.projectWindow = false;
  }


calculate(formData){
  console.log(formData);

  this.loading = true;
  const pulleyDia1: number = this.selectedFanPulleyData[0].DIAM; // driven
  const pulleyDia2: number = this.selectedMotorPulleyData[0].DIAM; // driven
  let pulleyDiaDiff: number;
  let pulleySelection : boolean;
  this.belts = [];
  const criticalHeight: number = this.selectedFanData[0].Critical_Height;
  const pulleycoinsideClear = 20;
    // if (formData.criticalHeight == undefined){
    //   criticalHeight = 0;
    // } else { criticalHeight = formData.criticalHeight; }
  const combination = [this.selected_FanOrientation.value, this.selected_motorPosition.value];

  if (this.selectedFanPulleyData[0].DIAM >= this.selectedMotorPulleyData[0].DIAM){
      pulleyDiaDiff = this.selectedFanPulleyData[0].DIAM - this.selectedMotorPulleyData[0].DIAM;
    } else {
      pulleyDiaDiff = this.selectedMotorPulleyData[0].DIAM - this.selectedFanPulleyData[0].DIAM;
    }
    // const pulleyDiaDiff = pulleyDia1 - pulleyDia2;
  const pulleyRatio: number = pulleyDia1 / pulleyDia2;
  const speedRatio: number = formData.fanSpeed / formData.motorSpeed;
  if (speedRatio >= 1 && pulleyRatio >= 1){
      pulleySelection = true;
    } else if (speedRatio <= 1 && pulleyRatio <= 1) {
      pulleySelection = true;
    } else {
      pulleySelection = false;
    }

  const H1 = this.selectedFanData[0].H1;
  const H2 = this.selectedFanData[0].H2;
  const H = this.selectedMotorData[0].H;
  const MBH = this.selectedMotorBaseData[0].MB_HT;
  const MBL = this.selectedMotorBaseData[0].MB_LEN;
  const P = this.selectedFanData[0].P;
  const Q = this.selectedFanData[0].Q;
  console.log(Q);
  const belts = this.F_BELTS.filter(i => (i.Grade == this.selectedFanPulleyData[0].GRADE));
  let a; let gap; let b; let centerDistance; let beltLength; let matchingBeltsMax; let matchingBeltsMin;

  formData.beltQty = this.selectedFanPulleyData[0].GROOVES;
  formData.fanOrientaionText = this.selected_FanOrientation.text;
  formData.motorPositionText = this.selected_motorPosition.text;
    // const AB = this.selectedMotorData[0].AB;
    // const clear = this.selectedMotorBaseData[0].CLEARANCE;
  if (this.selectedFanPulleyData[0].GROOVES == this.selectedMotorPulleyData[0].GROOVES){
      if (this.selectedFanPulleyData[0].GRADE == this.selectedMotorPulleyData[0].GRADE){
        // if (pulleySelection == true){

        switch (combination[0] + ' ' + combination[1]) {
          case ('1 1'):
          a = (P - (H + MBH + criticalHeight));
          
          gap = this.selectedManDimData[0].Back_Motorfan_Gap;
          b = (H1 + gap + (MBL / 2) );
          centerDistance =  Math.sqrt((a * a) + (b * b));
          break;

          case ('1 2'):
          a = (P - (H + MBH));
          gap = this.selectedManDimData[0].SideMotor_Min_Pulley_Clr;
          console.log(gap);
          b = (H1 - (MBL / 2) - gap );
          centerDistance =  Math.sqrt((a * a) + (b * b));
          break;

          case ('1 3'):
          a = (P - (H + MBH));
          gap = this.selectedManDimData[0].SideMotor_Min_Pulley_Clr;
          b = (H2 - (MBL / 2) - gap);
          centerDistance =  Math.sqrt((a * a) + (b * b));
          break;

          case ('2 1'):
          a = (H1 - (H + MBH + criticalHeight));
          gap = this.selectedManDimData[0].Back_Motorfan_Gap;
          b = (P + gap + (MBL / 2) );
          centerDistance =  Math.sqrt((a * a) + (b * b));
          break;

          case ('2 2'):
          a = (H1 - (H + MBH + criticalHeight));
          gap = this.selectedManDimData[0].SideMotor_Min_Pulley_Clr;
          console.log(gap);

          b = (P - ((MBL / 2) + gap) );
          centerDistance =  Math.sqrt((a * a) + (b * b));
          break;

          case ('2 3'):
          a = (H1 - (H + MBH + criticalHeight));
          gap = this.selectedManDimData[0].SideMotor_Min_Pulley_Clr;
          b = (Q - ((MBL / 2) + gap));
          centerDistance =  Math.sqrt((a * a) + (b * b));
          break;

          case ('3 1'):
          a = (H2 - (H + MBH + criticalHeight));
          gap = this.selectedManDimData[0].Back_Motorfan_Gap;
          b = (P + gap + (MBL / 2) );
          centerDistance =  Math.sqrt((a * a) + (b * b));
          break;

          case ('3 2'):
          a = (H2 - (H + MBH));
          gap = this.selectedManDimData[0].SideMotor_Min_Pulley_Clr;
          b = (P - (MBL / 2) - gap );
          centerDistance =  Math.sqrt((a * a) + (b * b));
          break;

          case ('3 3'):
          a = (H2 - (H + MBH));
          gap = this.selectedManDimData[0].SideMotor_Min_Pulley_Clr;
          b = (Q - (MBL / 2) - gap);
          centerDistance =  Math.sqrt((a * a) + (b * b));
          break;

          case ('4 1'):
          a = (P - (H + MBH + criticalHeight));
          gap = this.selectedManDimData[0].Back_Motorfan_Gap;
          b = (H2 + gap + (MBL / 2) );
          centerDistance =  Math.sqrt((a * a) + (b * b));
          break;

          case ('4 2'):
          a = (P - (H + MBH));
          gap = this.selectedManDimData[0].SideMotor_Min_Pulley_Clr;
          b = (H2 - (MBL / 2) - gap );
          centerDistance =  Math.sqrt((a * a) + (b * b));
          break;

          case ('4 3'):
          a = (P - (H + MBH));
          gap = this.selectedManDimData[0].SideMotor_Min_Pulley_Clr;
          b = (H1 - (MBL / 2) - gap);
          centerDistance =  Math.sqrt((a * a) + (b * b));
          break;

          default:
          this.result = null; this.belts = [];
          this.noresult = 'Calculation under development for this combination';
          break;
        }

        // if (centerDistance.toFixed() <= ((pulleyDia1 + pulleyDia2) / 2) + pulleycoinsideClear){
        // this.result = null; this.belts = [];
        // this.noresult = 'Pullies Collides!. Kindly reselect';
        // } else {
        // tslint:disable-next-line: max-line-length
        beltLength = (Math.PI * (pulleyDia1 + pulleyDia2) * 0.5) + (2 * centerDistance) + ((Math.pow(pulleyDiaDiff, 2)) / (4 * centerDistance));
        formData.centerDistance = centerDistance.toFixed();
        formData.beltLength = beltLength.toFixed();
        if (belts.filter(i => (i.Length == formData.beltLength)).length == 0) {
          matchingBeltsMax = belts.filter(i => (i.Length >= formData.beltLength));
          matchingBeltsMin = belts.filter(i => (i.Length <= formData.beltLength));
          this.belts.push(matchingBeltsMin[matchingBeltsMin.length - 1], matchingBeltsMax[0]);
          } else {
          this.belts.push(belts.filter(i => (i.Length == formData.beltLength))[0]);
          }
        console.log(this.belts);
        if(this.belts[0] == undefined){
          console.log('ERROR with RESULT Struct');
          this.matchingBelts = this.belts[1].ID;
        } else {
          this.matchingBelts = this.belts[0].ID;
        }
        this.result = formData;
        // }
      // } else {
      //   this.result = null; this.belts = [];
      //   this.noresult = 'Pulley ratio is wrong!. Kindly reselect';
      // }
      } else {
        this.result = null; this.belts = [];
        this.noresult = 'Pullies Grade not identical';
      }
    } else {
      this.result = null; this.belts = [];
      this.noresult = 'Pullies Grooves are not identical';
    }
  console.log(this.result);
  this.loading = false;
  }

  // tslint:disable-next-line: use-lifecycle-interface
ngOnInit(): void {
    this.loadCoilPrice();
    const currentDate = new Date();

    // this.selectionDate = new Date();
    // this.selectionDate = this.datepipe.transform(currentDate, 'yyyy-MM-dd');
    // this.selectionDate = this.datepipe.transform
    this.selected_FanOrientation = this.fanOrientations[0];
    this.fanOrientaion = this.fanOrientations[0].value;
    this.motorPositions = this.motorPositions.filter(i => (i.fancode == this.selected_FanOrientation.code));
    this.selected_motorPosition = this.motorPositions[0];
    this.motorPosition = this.motorPositions[0].value;
    this.load_fanData();
    this.motorModelFiltrCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.selectSearchfilter_motor();
      });
    this.PulleyFiltrCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.selectSearchfilter_pulley();
      });
    this.fanModelFiltrCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.selectSearchfilter_fan();
      });
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  protected selectSearchfilter_motor() {
    if (!this.MOTOR_DIMS) {
      return;
    }
    // get the search keyword
    let searchmotor = this.motorModelFiltrCtrl.value;
    if (!searchmotor) {
      this.filteredMotorModel.next(this.MOTOR_DIMS.slice());
      return;
    } else {
      searchmotor = searchmotor.toLowerCase();
    }
    this.filteredMotorModel.next(
      this.MOTOR_DIMS.filter(motor => motor.FRAMESIZE.toLowerCase().indexOf(searchmotor) > -1)
    );
  }

  protected selectSearchfilter_pulley() {
    if (!this.MOTOR_DIMS) {
      return;
    }
    let searchpulley = this.PulleyFiltrCtrl.value;
    if (!searchpulley) {
      this.filteredpulley.next(this.pulleyList.slice());
      return;
    } else {
      searchpulley = searchpulley.toLowerCase();
    }
    this.filteredpulley.next(
      this.pulleyList.filter(pulley => pulley.CODE.toLowerCase().indexOf(searchpulley) > -1)
    );
  }
  protected selectSearchfilter_fan() {
    if (!this.MOTOR_DIMS) {
      return;
    }
    let searchfan = this.fanModelFiltrCtrl.value;
    if (!searchfan) {
      this.filteredfanModel.next(this.fanData.slice());
      return;
    } else {
      searchfan = searchfan.toString().toLowerCase();
    }
    this.filteredfanModel.next(
      this.fanData.filter(fan => fan.FAN_SIZE.toString().toLowerCase().indexOf(searchfan) > -1)
    );
  }


}
