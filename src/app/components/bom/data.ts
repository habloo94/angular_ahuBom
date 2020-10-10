import { ItemMaster } from '../../services/interface';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import * as XLSX from 'xlsx';
import { MatSelect } from '@angular/material/select';
import { ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';

export class Data {

  constructor(){}

  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;


  protected _onDestroy = new Subject<void>();

  itemMasterData$: Observable<ItemMaster[]>;

  casingFormula;

  giSheets: ItemMaster[];
  profileType: ItemMaster[];
  fan: ItemMaster[];
  motor: ItemMaster[];
  antiVibrant: ItemMaster[];
  pulley: ItemMaster[];
  belt: ItemMaster[];
  coil: ItemMaster[];
  coilFin: ItemMaster[];
  filterType: any[] = [];
  filterCasing: ItemMaster[];
  filterSize: ItemMaster[];

  giSheetsInnerFiltrCtrl = new FormControl();
  giSheetsOuterFiltrCtrl = new FormControl();
  profileTypeFiltrCtrl = new FormControl();
  supplyFanFiltrCtrl = new FormControl();
  exhaustFanFiltrCtrl = new FormControl();
  supplyMotorFiltrCtrl = new FormControl();
  exhaustMotorFiltrCtrl = new FormControl();
  supplyFanPulleyFiltrCtrl = new FormControl();
  exhaustFanPulleyFiltrCtrl = new FormControl();
  supplyMotorPulleyFiltrCtrl = new FormControl();
  exhaustMotorPulleyFiltrCtrl = new FormControl();
  supplyBeltFiltrCtrl = new FormControl();
  exhaustBeltFiltrCtrl = new FormControl();


  fileName = 'ExcelSheet.xlsx';


  public fltr_giSheets: ReplaySubject<ItemMaster[]> = new ReplaySubject<ItemMaster[]>(1);
  public fltr_profileType: ReplaySubject<ItemMaster[]> = new ReplaySubject<ItemMaster[]>(1);
  public fltr_fan: ReplaySubject<ItemMaster[]> = new ReplaySubject<ItemMaster[]>(1);
  public fltr_motor: ReplaySubject<ItemMaster[]> = new ReplaySubject<ItemMaster[]>(1);
  public fltr_pulley: ReplaySubject<ItemMaster[]> = new ReplaySubject<ItemMaster[]>(1);
  public fltr_belt: ReplaySubject<ItemMaster[]> = new ReplaySubject<ItemMaster[]>(1);


  writeContents(content, fileName, contentType) {
    const a = document.createElement('a');
    const file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
  }



  getCasingCal(){
    console.log('hi');

    const oReq = new XMLHttpRequest();
    oReq.open('GET', '../../../assets/data/calc/bom_temp.xlsx', true);
    oReq.responseType = 'arraybuffer';
    oReq.onload = () => {
    const arraybuffer = oReq.response;
    /* convert data to binary string */
    const data = new Uint8Array(arraybuffer);
    const arr = new Array();
    for (let i = 0; i !== data.length; ++i) { arr[i] = String.fromCharCode(data[i]);}
    const bstr = arr.join('');
    /* Call XLSX */
    const workbook = XLSX.read(bstr, {type: 'binary'});
    console.log(workbook);
    /* DO SOMETHING WITH workbook HERE */
    const sheet = workbook.SheetNames[0];
    /* Get worksheet */
    const worksheet = workbook.Sheets[sheet];
    const jsonData = XLSX.utils.sheet_to_json(worksheet , {raw: true});
    this.casingFormula = jsonData;
    console.log(jsonData);

    const x = JSON.stringify(jsonData, null, '\t');
    this.writeContents(x, 'BOMEntryHead' + '.json', 'application/json');
    };
    oReq.send();
    // const workbook = XLSX.read('../assets/data/calc/casing.xlsx', {type: 'binary'});
  }

  getItemMasterData(){
    const oReq = new XMLHttpRequest();
    oReq.open('GET', '../assets/data/item_master.xlsx', true);
    oReq.responseType = 'arraybuffer';
    oReq.onload = () => {
    const arraybuffer = oReq.response;
    /* convert data to binary string */
    const data = new Uint8Array(arraybuffer);
    const arr = new Array();
    for (let i = 0; i !== data.length; ++i) { arr[i] = String.fromCharCode(data[i]);}
    const bstr = arr.join('');
    /* Call XLSX */
    const workbook = XLSX.read(bstr, {type: 'binary'});
    // console.log(workbook);
    /* DO SOMETHING WITH workbook HERE */
    const sheet = workbook.SheetNames[0];
    /* Get worksheet */
    const worksheet = workbook.Sheets[sheet];
    const jsonData: ItemMaster[] = XLSX.utils.sheet_to_json(worksheet , {raw: true});
    // console.log(jsonData);

    this.giSheets = jsonData.filter(i => (i.Item_Group === 'G.I / COATED SHEETS'));
    this.profileType = jsonData.filter(i => (i.Item_Group === 'ALUMINIUM PROFILES'));
    this.fan = jsonData.filter(i => (i.Item_Group === 'FAN'));
    this.motor = jsonData.filter(i => (i.Item_Group === 'MOTOR'));
    this.antiVibrant = jsonData.filter(i => (i.Item_Group === 'ANTI-VIBRATIONS'));
    this.pulley = jsonData.filter(i => (i.Sub_Group === 'PULLEY'));
    this.belt = jsonData.filter(i => (i.Item_Group === 'BELT'));
    this.coil = jsonData.filter(i => (i.Item_Group === 'COOLING COIL'));
    this.coilFin = jsonData.filter(i => (i.Sub_Group === 'COIL FIN'));
    const lookup = {};
    const items = jsonData.filter(i => (i.Item_Group === 'FILTER'));
    this.filterCasing = jsonData.filter(i => (i.Sub_Group === 'FILTER FRAME'));

    // tslint:disable-next-line: no-conditional-assignment
    for (let item, i = 0; item = items[i++];) {
      const name = item.Sub_Group;
      if (!(name in lookup)) {
        lookup[name] = 1;
        this.filterType.push(name);
      }
    }
    // console.log(this.filterType);

    this.fltr_giSheets.next(this.giSheets.slice());
    this.fltr_profileType.next(this.profileType.slice());
    this.fltr_fan.next(this.fan.slice());
    this.fltr_motor.next(this.motor.slice());
    this.fltr_pulley.next(this.pulley.slice());
    this.fltr_belt.next(this.belt.slice());

    };
    oReq.send();
  }

  protected searchfilter_giSheetsInner() {
    if (!this.giSheets) {
      return;
    }
    // get the search keyword
    let search = this.giSheetsInnerFiltrCtrl.value;
    if (!search) {
      this.fltr_giSheets.next(this.giSheets.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.fltr_giSheets.next(
      this.giSheets.filter(item => item.Name.toLowerCase().indexOf(search) > -1 || item.Code.toLowerCase().indexOf(search) > -1)
    );
  }
  protected searchfilter_giSheetsOuter() {
    if (!this.giSheets) {
      return;
    }
    // get the search keyword
    let search = this.giSheetsOuterFiltrCtrl.value;
    if (!search) {
      this.fltr_giSheets.next(this.giSheets.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.fltr_giSheets.next(
      this.giSheets.filter(item => item.Name.toLowerCase().indexOf(search) > -1 || item.Code.toLowerCase().indexOf(search) > -1)
    );
  }
  protected searchfilter_profileType() {
    if (!this.profileType) {
      return;
    }
    // get the search keyword
    let search = this.profileTypeFiltrCtrl.value;
    if (!search) {
      this.fltr_profileType.next(this.profileType.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.fltr_profileType.next(
      this.profileType.filter(item => item.Name.toLowerCase().includes(search) || item.Code.toLowerCase().indexOf(search) > -1)
    );
  }
  protected searchfilter_supplyFan() {
    if (!this.fan) {
      return;
    }
    // get the search keyword
    let search = this.supplyFanFiltrCtrl.value;
    if (!search) {
      this.fltr_fan.next(this.fan.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.fltr_fan.next(
      // tslint:disable-next-line: max-line-length
      this.fan.filter(item => item.Name.toLowerCase().includes(search) || item.Code.toLowerCase().indexOf(search) > -1 || item.Brand.toLowerCase().includes(search))
    );
  }
  protected searchfilter_exhaustFan() {
    if (!this.fan) {
      return;
    }
    // get the search keyword
    let search = this.exhaustFanFiltrCtrl.value;
    if (!search) {
      this.fltr_fan.next(this.fan.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.fltr_fan.next(
      // tslint:disable-next-line: max-line-length
      this.fan.filter(item => item.Name.toLowerCase().includes(search) || item.Code.toLowerCase().indexOf(search) > -1 || item.Brand.toLowerCase().includes(search))
    );
  }
  protected searchfilter_supplyMotor() {
    if (!this.motor) {
      return;
    }
    // get the search keyword
    let search = this.supplyMotorFiltrCtrl.value;
    if (!search) {
      this.fltr_motor.next(this.motor.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.fltr_motor.next(
      // tslint:disable-next-line: max-line-length
      this.motor.filter(item => item.Name.toLowerCase().includes(search) || item.Code.toLowerCase().indexOf(search) > -1 || item.Brand.toLowerCase().includes(search))
    );
  }
  protected searchfilter_exhaustMotor() {
    if (!this.motor) {
      return;
    }
    // get the search keyword
    let search = this.exhaustFanFiltrCtrl.value;
    if (!search) {
      this.fltr_motor.next(this.motor.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.fltr_motor.next(
      // tslint:disable-next-line: max-line-length
      this.motor.filter(item => item.Name.toLowerCase().includes(search) || item.Code.toLowerCase().indexOf(search) > -1 || item.Brand.toLowerCase().includes(search))
    );
  }
  protected searchfilter_supplyFanPulley() {
    if (!this.pulley) {
      return;
    }
    // get the search keyword
    let search = this.supplyFanPulleyFiltrCtrl.value;
    if (!search) {
      this.fltr_pulley.next(this.pulley.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.fltr_pulley.next(
      // tslint:disable-next-line: max-line-length
      this.pulley.filter(item => item.Name.toLowerCase().includes(search) || item.Code.toLowerCase().indexOf(search) > -1)
    );
  }
  protected searchfilter_exhaustFanPulley() {
    if (!this.pulley) {
      return;
    }
    // get the search keyword
    let search = this.exhaustFanPulleyFiltrCtrl.value;
    if (!search) {
      this.fltr_pulley.next(this.pulley.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.fltr_pulley.next(
      // tslint:disable-next-line: max-line-length
      this.pulley.filter(item => item.Name.toLowerCase().includes(search) || item.Code.toLowerCase().indexOf(search) > -1)
    );
  }
  protected searchfilter_supplyMotorPulley() {
    if (!this.pulley) {
      return;
    }
    // get the search keyword
    let search = this.supplyMotorPulleyFiltrCtrl.value;
    if (!search) {
      this.fltr_pulley.next(this.pulley.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.fltr_pulley.next(
      // tslint:disable-next-line: max-line-length
      this.pulley.filter(item => item.Name.toLowerCase().includes(search) || item.Code.toLowerCase().indexOf(search) > -1)
    );
  }
  protected searchfilter_exhaustMotorPulley() {
    if (!this.pulley) {
      return;
    }
    // get the search keyword
    let search = this.exhaustMotorPulleyFiltrCtrl.value;
    if (!search) {
      this.fltr_pulley.next(this.pulley.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.fltr_pulley.next(
      // tslint:disable-next-line: max-line-length
      this.pulley.filter(item => item.Name.toLowerCase().includes(search) || item.Code.toLowerCase().indexOf(search) > -1)
    );
  }
  protected searchfilter_supplyBelt() {
    if (!this.belt) {
      return;
    }
    // get the search keyword
    let search = this.supplyBeltFiltrCtrl.value;
    if (!search) {
      this.fltr_belt.next(this.belt.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.fltr_belt.next(
      // tslint:disable-next-line: max-line-length
      this.belt.filter(item => item.Name.toLowerCase().includes(search) || item.Code.toLowerCase().indexOf(search) > -1)
    );
  }
  protected searchfilter_exhaustBelt() {
    if (!this.belt) {
      return;
    }
    // get the search keyword
    let search = this.exhaustBeltFiltrCtrl.value;
    if (!search) {
      this.fltr_belt.next(this.belt.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.fltr_belt.next(
      // tslint:disable-next-line: max-line-length
      this.belt.filter(item => item.Name.toLowerCase().includes(search) || item.Code.toLowerCase().indexOf(search) > -1)
    );
  }
}
