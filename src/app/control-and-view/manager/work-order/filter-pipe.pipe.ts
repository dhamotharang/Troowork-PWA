import { Pipe, PipeTransform,Injectable } from '@angular/core';
@Pipe({
  name: 'filterPipe'
})
@Injectable()
export class FilterPipePipe implements PipeTransform {  
  currencies: string[];
  transform(items: any[]){
    if(!items){
      return;
    }
    else
    {
    const curr = items.map(data => data.i.EquipmentTypeText);

    // Unique currencies
    this.currencies = curr.filter((x, i, a) => x && a.indexOf(x) === i);
    return this.currencies;
    }
  }
   
  
}