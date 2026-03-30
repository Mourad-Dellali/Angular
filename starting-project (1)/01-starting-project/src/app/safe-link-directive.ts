import { Directive, input } from "@angular/core";
@Directive({
    selector: '[appSafeLink]',
    standalone:true,
    host: {
        '(click)': 'onClickEvent($event)'
    }
})
export class SafeLinkDirective {
queryParam = input('myapp');

onClickEvent(event:MouseEvent) {
    const confimred=window.confirm("Sure to leave?")
    if (confimred) {
        const address = (event.target as HTMLAnchorElement).href;
        (event.target as HTMLAnchorElement).href = address + '?from' + this.queryParam();
    }else {
        event?.preventDefault();
    }
}
    constructor() {
        
    }
}