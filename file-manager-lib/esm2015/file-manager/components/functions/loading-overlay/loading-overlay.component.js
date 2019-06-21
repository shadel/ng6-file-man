/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Input, TemplateRef } from '@angular/core';
import { _ } from '@biesbjerg/ngx-translate-extract/dist/utils/utils';
import { timer } from 'rxjs';
export class LoadingOverlayComponent {
    // todo unsubscribe from 'list' event - now we are only dismissing this component
    /**
     * @return {?}
     */
    ngOnInit() {
        timer(2000).subscribe((/**
         * @return {?}
         */
        () => {
            this.timeoutMessage = _('Troubles with loading? Click anywhere to cancel loading');
        }));
    }
}
LoadingOverlayComponent.decorators = [
    { type: Component, args: [{
                selector: 'app-loading-overlay',
                template: `<ng-container
  [ngTemplateOutletContext]="{$implicit: timeoutMessage}"
  [ngTemplateOutlet]="loadingOverlayTemplate">
</ng-container>
`,
                styles: [``]
            },] },
];
LoadingOverlayComponent.propDecorators = {
    loadingOverlayTemplate: [{ type: Input }]
};
if (false) {
    /** @type {?} */
    LoadingOverlayComponent.prototype.loadingOverlayTemplate;
    /** @type {?} */
    LoadingOverlayComponent.prototype.timeoutMessage;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9hZGluZy1vdmVybGF5LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25nNi1maWxlLW1hbi8iLCJzb3VyY2VzIjpbImZpbGUtbWFuYWdlci9jb21wb25lbnRzL2Z1bmN0aW9ucy9sb2FkaW5nLW92ZXJsYXkvbG9hZGluZy1vdmVybGF5LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFDLFNBQVMsRUFBRSxLQUFLLEVBQVUsV0FBVyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3BFLE9BQU8sRUFBQyxDQUFDLEVBQUMsTUFBTSxtREFBbUQsQ0FBQztBQUNwRSxPQUFPLEVBQUMsS0FBSyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBVzNCLE1BQU07Ozs7O0lBS0osUUFBUTtRQUNOLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTOzs7UUFBQyxHQUFHLEVBQUU7WUFDekIsSUFBSSxDQUFDLGNBQWMsR0FBRyxDQUFDLENBQUMseURBQXlELENBQUMsQ0FBQztRQUNyRixDQUFDLEVBQUMsQ0FBQztJQUNMLENBQUM7OztZQWxCRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLHFCQUFxQjtnQkFDL0IsUUFBUSxFQUFFOzs7O0NBSVg7Z0JBQ0MsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDO2FBQ2I7OztxQ0FFRSxLQUFLOzs7O0lBQU4seURBQWtEOztJQUNsRCxpREFBb0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NvbXBvbmVudCwgSW5wdXQsIE9uSW5pdCwgVGVtcGxhdGVSZWZ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge199IGZyb20gJ0BiaWVzYmplcmcvbmd4LXRyYW5zbGF0ZS1leHRyYWN0L2Rpc3QvdXRpbHMvdXRpbHMnO1xyXG5pbXBvcnQge3RpbWVyfSBmcm9tICdyeGpzJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnYXBwLWxvYWRpbmctb3ZlcmxheScsXHJcbiAgdGVtcGxhdGU6IGA8bmctY29udGFpbmVyXHJcbiAgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cInskaW1wbGljaXQ6IHRpbWVvdXRNZXNzYWdlfVwiXHJcbiAgW25nVGVtcGxhdGVPdXRsZXRdPVwibG9hZGluZ092ZXJsYXlUZW1wbGF0ZVwiPlxyXG48L25nLWNvbnRhaW5lcj5cclxuYCxcclxuICBzdHlsZXM6IFtgYF1cclxufSlcclxuZXhwb3J0IGNsYXNzIExvYWRpbmdPdmVybGF5Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuICBASW5wdXQoKSBsb2FkaW5nT3ZlcmxheVRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xyXG4gIHRpbWVvdXRNZXNzYWdlOiBhbnk7XHJcblxyXG4gIC8vIHRvZG8gdW5zdWJzY3JpYmUgZnJvbSAnbGlzdCcgZXZlbnQgLSBub3cgd2UgYXJlIG9ubHkgZGlzbWlzc2luZyB0aGlzIGNvbXBvbmVudFxyXG4gIG5nT25Jbml0KCkge1xyXG4gICAgdGltZXIoMjAwMCkuc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgdGhpcy50aW1lb3V0TWVzc2FnZSA9IF8oJ1Ryb3VibGVzIHdpdGggbG9hZGluZz8gQ2xpY2sgYW55d2hlcmUgdG8gY2FuY2VsIGxvYWRpbmcnKTtcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG4iXX0=