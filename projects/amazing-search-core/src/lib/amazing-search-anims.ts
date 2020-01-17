import {
  trigger,
  style,
  state,
  transition,
  animate,
  AnimationMetadata
} from '@angular/animations';

export const drawerAnim: AnimationMetadata = trigger('openClosed', [
  state(
    'open',
    style({
      maxHeight: '400px',
      opacity: 1,
      boxShadow: '4px 3px 5px #f2f2f2'
    })
  ),
  state(
    'closed',
    style({
      height: '0',
      display: 'none',
      opacity: 0.5
    })
  ),
  transition('open => closed', [
    animate('0.7s cubic-bezier(0.68, -0.55, 0.265, 1.55)')
  ]),
  transition('closed => open', [
    animate('0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)')
  ])
]);
