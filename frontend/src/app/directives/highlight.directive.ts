import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {
  @HostBinding('style.box-shadow') shadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
  @HostBinding('style.transform') transform = 'translateY(0)';
  @HostBinding('style.transition') transition = 'all 0.3s ease';

  @HostListener('mouseenter') onEnter() {
    this.shadow = '0 12px 30px rgba(102, 126, 234, 0.35)';
    this.transform = 'translateY(-6px)';
  }

  @HostListener('mouseleave') onLeave() {
    this.shadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
    this.transform = 'translateY(0)';
  }
}
