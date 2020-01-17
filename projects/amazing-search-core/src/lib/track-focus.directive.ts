import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[trackFocus]'
})
export class TrackFocusDirective {
  @HostBinding('class.my-focused-element') isFocused: boolean;
  constructor() {}

  @HostListener('focus', ['$event']) onFocus(e) {
    this.isFocused = true;
    console.log('yes');
  }
  @HostListener('blur', ['$event']) onblur(e) {
    this.isFocused = false;
    console.log('no');
  }
}
