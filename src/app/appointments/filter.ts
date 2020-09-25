import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filterAppointments'
})

export class filterAppointments implements PipeTransform {
    transform(items: any[], searchText: string): any[] {
        if (!items) return [];
        if (!searchText) return items;
        searchText = searchText.toLowerCase();
        return items.filter(it => {
            let dataObj: any = it;
            let returnFlag: boolean = false;
            for(let value in dataObj) {
                let dataValue: any = dataObj[value];
                if (dataValue.toString().toLowerCase().includes(searchText)) {
                    returnFlag = true;
                }
            }
                 
            return returnFlag;
        });
    }
}
