/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Input, TemplateRef } from '@angular/core';
import { _ } from '@biesbjerg/ngx-translate-extract/dist/utils/utils';
import { timer } from 'rxjs';
var LoadingOverlayComponent = /** @class */ (function () {
    function LoadingOverlayComponent() {
    }
    // todo unsubscribe from 'list' event - now we are only dismissing this component
    // todo unsubscribe from 'list' event - now we are only dismissing this component
    /**
     * @return {?}
     */
    LoadingOverlayComponent.prototype.ngOnInit = 
    // todo unsubscribe from 'list' event - now we are only dismissing this component
    /**
     * @return {?}
     */
    function () {
        var _this = this;
        timer(2000).subscribe((/**
         * @return {?}
         */
        function () {
            _this.timeoutMessage = _('Troubles with loading? Click anywhere to cancel loading');
        }));
    };
    LoadingOverlayComponent.decorators = [
        { type: Component, args: [{
                    selector: 'app-loading-overlay',
                    template: "<ng-container\n  [ngTemplateOutletContext]=\"{$implicit: timeoutMessage}\"\n  [ngTemplateOutlet]=\"loadingOverlayTemplate\">\n</ng-container>\n",
                    styles: [""]
                },] },
    ];
    LoadingOverlayComponent.propDecorators = {
        loadingOverlayTemplate: [{ type: Input }]
    };
    return LoadingOverlayComponent;
}());
export { LoadingOverlayComponent };
if (false) {
    /** @type {?} */
    LoadingOverlayComponent.prototype.loadingOverlayTemplate;
    /** @type {?} */
    LoadingOverlayComponent.prototype.timeoutMessage;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9hZGluZy1vdmVybGF5LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25nNi1maWxlLW1hbi8iLCJzb3VyY2VzIjpbImZpbGUtbWFuYWdlci9jb21wb25lbnRzL2Z1bmN0aW9ucy9sb2FkaW5nLW92ZXJsYXkvbG9hZGluZy1vdmVybGF5LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFDLFNBQVMsRUFBRSxLQUFLLEVBQVUsV0FBVyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3BFLE9BQU8sRUFBQyxDQUFDLEVBQUMsTUFBTSxtREFBbUQsQ0FBQztBQUNwRSxPQUFPLEVBQUMsS0FBSyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBRTNCO0lBQUE7SUFtQkEsQ0FBQztJQU5DLGlGQUFpRjs7Ozs7SUFDakYsMENBQVE7Ozs7O0lBQVI7UUFBQSxpQkFJQztRQUhDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTOzs7UUFBQztZQUNwQixLQUFJLENBQUMsY0FBYyxHQUFHLENBQUMsQ0FBQyx5REFBeUQsQ0FBQyxDQUFDO1FBQ3JGLENBQUMsRUFBQyxDQUFDO0lBQ0wsQ0FBQzs7Z0JBbEJGLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUscUJBQXFCO29CQUMvQixRQUFRLEVBQUUsaUpBSVg7b0JBQ0MsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDO2lCQUNiOzs7eUNBRUUsS0FBSzs7SUFTUiw4QkFBQztDQUFBLEFBbkJELElBbUJDO1NBVlksdUJBQXVCOzs7SUFDbEMseURBQWtEOztJQUNsRCxpREFBb0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NvbXBvbmVudCwgSW5wdXQsIE9uSW5pdCwgVGVtcGxhdGVSZWZ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge199IGZyb20gJ0BiaWVzYmplcmcvbmd4LXRyYW5zbGF0ZS1leHRyYWN0L2Rpc3QvdXRpbHMvdXRpbHMnO1xyXG5pbXBvcnQge3RpbWVyfSBmcm9tICdyeGpzJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnYXBwLWxvYWRpbmctb3ZlcmxheScsXHJcbiAgdGVtcGxhdGU6IGA8bmctY29udGFpbmVyXHJcbiAgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cInskaW1wbGljaXQ6IHRpbWVvdXRNZXNzYWdlfVwiXHJcbiAgW25nVGVtcGxhdGVPdXRsZXRdPVwibG9hZGluZ092ZXJsYXlUZW1wbGF0ZVwiPlxyXG48L25nLWNvbnRhaW5lcj5cclxuYCxcclxuICBzdHlsZXM6IFtgYF1cclxufSlcclxuZXhwb3J0IGNsYXNzIExvYWRpbmdPdmVybGF5Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuICBASW5wdXQoKSBsb2FkaW5nT3ZlcmxheVRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xyXG4gIHRpbWVvdXRNZXNzYWdlOiBhbnk7XHJcblxyXG4gIC8vIHRvZG8gdW5zdWJzY3JpYmUgZnJvbSAnbGlzdCcgZXZlbnQgLSBub3cgd2UgYXJlIG9ubHkgZGlzbWlzc2luZyB0aGlzIGNvbXBvbmVudFxyXG4gIG5nT25Jbml0KCkge1xyXG4gICAgdGltZXIoMjAwMCkuc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgdGhpcy50aW1lb3V0TWVzc2FnZSA9IF8oJ1Ryb3VibGVzIHdpdGggbG9hZGluZz8gQ2xpY2sgYW55d2hlcmUgdG8gY2FuY2VsIGxvYWRpbmcnKTtcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG4iXX0=