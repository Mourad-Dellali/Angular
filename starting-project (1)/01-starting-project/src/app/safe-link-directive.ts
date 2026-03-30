import { Directive } from "@angular/core";
@Directive({
    selector: '[appSafeLink]',
    standalone:true,
    host: {
        '(click)': 'onClickEvent($event)'
    }
})
export class SafeLinkDirective {
onClickEvent(event:MouseEvent) {
    const confimred=window.confirm("Sure to leave?")
    if (confimred) {
        return;
    }else {
        event?.preventDefault();
    }
}
    constructor() {
        
    }
}