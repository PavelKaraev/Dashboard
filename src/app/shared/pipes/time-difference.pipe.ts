import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeDifference'
})
export class TimeDifferencePipe implements PipeTransform {

  transform(value: Date[], ...args: any): string {
    let [from, to] = value;
     
    let days = Math.ceil(Math.abs(from.getTime() - to.getTime()) / (1000 * 3600 * 24));
    let year = Math.floor(days / 365); // вычисляем кол-во лет. Math.floor убирает остаток.
    let months = Math.floor((days - (year * 365)) / 30); // отняв года, вычисляем месяцы
    
    

    return `${year} года ${months} месяцев`;
  }

}
