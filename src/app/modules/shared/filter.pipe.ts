import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'searchFilter'
})

export class SearchFilter implements PipeTransform {

    transform(arr: any[], prop: string, value: string, method: Method): any {
        if (arr) {
            if (!value) {
                return arr;
            } else if (prop === '' || prop == null) {
                return arr.filter(item => this.filter(item.toString().toLowerCase(), value.toLowerCase(), method));
            } else {
                return arr.filter(obj => this.filter(obj[prop].toString().toLowerCase(), value.toLowerCase(), method));
            }
        } else {
            return [];
        }
    }

    filter(source: string, target: string, method: Method): boolean {

        switch (method) {
            case 'includes': return source.includes(target);
            case 'equal': return source === target;
            case 'not-equal': return source !== target;
            default: return source.includes(target);
        }
    }
}

@Pipe({
    name: 'orderBy',
    pure: false
})
export class OrderByPipe implements PipeTransform {

    transform(value: any[], criteria: SortCriteria): any[] {
        if (!value || !criteria) {
            return value;
        }
        const p: string = criteria.property;
        const sortFn: (a: any, b: any) => any = (a, b) => {
            let valueInside = 0;
            if (a[p] === undefined) { valueInside = -1; } else if (b[p] === undefined) { valueInside = 1; } else { valueInside = a[p] > b[p] ? 1 : (b[p] > a[p] ? -1 : 0); }
            return criteria.descending ? (valueInside * -1) : valueInside;
        };
        value.sort(sortFn);
        return value;
    }

}


export interface SortCriteria {
    property: string;
    descending?: boolean;
}



type Method = 'includes' | 'equal' | 'not-equal';
