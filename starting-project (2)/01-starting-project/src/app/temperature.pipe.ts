import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name:'temp',
    standalone:true,
})

export class TemperaturePipe implements PipeTransform{
    transform(value: any, inputType: 'cel' | 'fah', outputType?: 'cel' | 'fah') {
        let val:number;

        if (typeof value === 'string') {
            val = parseFloat(value);
        }else {
            val = value;
        }
        const targetType = outputType ?? inputType;
        let outputTemp : number;

        if (inputType === 'cel' && targetType === 'fah') {
            outputTemp = val * (9/5) + 32;
        } else if (inputType === 'fah' && targetType === 'cel') {
            outputTemp = (val - 32) * (5/9);
        }else {
            outputTemp = val;
        }

        let symbol: '^C' | '^F';

        symbol = targetType === 'cel' ? '^C' : '^F';

        return `${outputTemp.toFixed(2)} ${symbol}`;
    }
}