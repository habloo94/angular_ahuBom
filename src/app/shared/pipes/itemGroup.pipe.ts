import { Pipe, PipeTransform } from '@angular/core';
import { ItemMaster } from '../../services/interface';

@Pipe({
    name: 'itemGroupFilter',
    pure: false
})
export class ItemGroupFilterPipe implements PipeTransform {
  transform(items: any[], filter: Object): any {
    if (!items || !filter) {
        return items;
    }
    // filter items array, items which match and return true will be
    // kept, false will be filtered out
    return items.filter(item => item.Item_Group.indexOf(filter['Item_Group']) !== -1);
}
}
