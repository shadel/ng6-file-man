/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { _ } from '@biesbjerg/ngx-translate-extract/dist/utils/utils';
var NewFolderComponent = /** @class */ (function () {
    function NewFolderComponent() {
        this.buttonClicked = new EventEmitter();
        this.buttonText = _('Close').toString();
        this.inputValue = '';
    }
    /**
     * @return {?}
     */
    NewFolderComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
    };
    /**
     * @return {?}
     */
    NewFolderComponent.prototype.onClick = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var el = ((/** @type {?} */ (this.uploadFolder.nativeElement)));
        // @ts-ignore
        this.buttonClicked.emit(el.value);
    };
    /**
     * @param {?} event
     * @return {?}
     */
    NewFolderComponent.prototype.onInputChange = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        this.inputValue = event.target.value;
        if (this.inputValue.length > 0) {
            this.buttonText = _('Confirm').toString();
        }
        else {
            this.buttonText = _('Close').toString();
        }
    };
    NewFolderComponent.decorators = [
        { type: Component, args: [{
                    selector: 'app-new-folder',
                    template: "<p class=\"new-folder-description\" translate>Type new folder name</p>\n<input #uploadFolder placeholder=\"{{'Folder name'}}\" (keyup)=\"onInputChange($event)\"\n       (keyup.enter)=\"onClick()\" onclick=\"this.select();\" type=\"text\" class=\"new-folder-input\"/>\n<button class=\"button new-folder-send\" (click)=\"onClick()\">{{buttonText}}</button>\n",
                    styles: [".new-folder-description{margin:0 auto;padding:0}"]
                },] },
    ];
    NewFolderComponent.ctorParameters = function () { return []; };
    NewFolderComponent.propDecorators = {
        uploadFolder: [{ type: ViewChild, args: ['uploadFolder',] }],
        buttonClicked: [{ type: Output }]
    };
    return NewFolderComponent;
}());
export { NewFolderComponent };
if (false) {
    /** @type {?} */
    NewFolderComponent.prototype.uploadFolder;
    /** @type {?} */
    NewFolderComponent.prototype.buttonClicked;
    /** @type {?} */
    NewFolderComponent.prototype.buttonText;
    /** @type {?} */
    NewFolderComponent.prototype.inputValue;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV3LWZvbGRlci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZzYtZmlsZS1tYW4vIiwic291cmNlcyI6WyJmaWxlLW1hbmFnZXIvY29tcG9uZW50cy9mdW5jdGlvbnMvdXBsb2FkL25ldy1mb2xkZXIvbmV3LWZvbGRlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBQyxTQUFTLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBVSxNQUFNLEVBQUUsU0FBUyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQzdGLE9BQU8sRUFBQyxDQUFDLEVBQUMsTUFBTSxtREFBbUQsQ0FBQztBQUVwRTtJQWdCRTtRQUxVLGtCQUFhLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUU3QyxlQUFVLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ25DLGVBQVUsR0FBRyxFQUFFLENBQUM7SUFHaEIsQ0FBQzs7OztJQUVELHFDQUFROzs7SUFBUjtJQUNBLENBQUM7Ozs7SUFFRCxvQ0FBTzs7O0lBQVA7O1lBQ1EsRUFBRSxHQUFnQixDQUFDLG1CQUFBLElBQUksQ0FBQyxZQUFZLENBQUMsYUFBYSxFQUFlLENBQUM7UUFDeEUsYUFBYTtRQUNiLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNwQyxDQUFDOzs7OztJQUVELDBDQUFhOzs7O0lBQWIsVUFBYyxLQUFVO1FBQ3RCLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDckMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMvQixJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUM1QyxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUMxQyxDQUFDO0lBQ0gsQ0FBQzs7Z0JBbkNGLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsZ0JBQWdCO29CQUMxQixRQUFRLEVBQUUsc1dBSVg7b0JBQ0MsTUFBTSxFQUFFLENBQUMsa0RBQWtELENBQUM7aUJBQzdEOzs7OytCQUVFLFNBQVMsU0FBQyxjQUFjO2dDQUN4QixNQUFNOztJQXlCVCx5QkFBQztDQUFBLEFBcENELElBb0NDO1NBM0JZLGtCQUFrQjs7O0lBQzdCLDBDQUFvRDs7SUFDcEQsMkNBQTZDOztJQUU3Qyx3Q0FBbUM7O0lBQ25DLHdDQUFnQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q29tcG9uZW50LCBFbGVtZW50UmVmLCBFdmVudEVtaXR0ZXIsIE9uSW5pdCwgT3V0cHV0LCBWaWV3Q2hpbGR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge199IGZyb20gJ0BiaWVzYmplcmcvbmd4LXRyYW5zbGF0ZS1leHRyYWN0L2Rpc3QvdXRpbHMvdXRpbHMnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdhcHAtbmV3LWZvbGRlcicsXHJcbiAgdGVtcGxhdGU6IGA8cCBjbGFzcz1cIm5ldy1mb2xkZXItZGVzY3JpcHRpb25cIiB0cmFuc2xhdGU+VHlwZSBuZXcgZm9sZGVyIG5hbWU8L3A+XHJcbjxpbnB1dCAjdXBsb2FkRm9sZGVyIHBsYWNlaG9sZGVyPVwie3snRm9sZGVyIG5hbWUnfX1cIiAoa2V5dXApPVwib25JbnB1dENoYW5nZSgkZXZlbnQpXCJcclxuICAgICAgIChrZXl1cC5lbnRlcik9XCJvbkNsaWNrKClcIiBvbmNsaWNrPVwidGhpcy5zZWxlY3QoKTtcIiB0eXBlPVwidGV4dFwiIGNsYXNzPVwibmV3LWZvbGRlci1pbnB1dFwiLz5cclxuPGJ1dHRvbiBjbGFzcz1cImJ1dHRvbiBuZXctZm9sZGVyLXNlbmRcIiAoY2xpY2spPVwib25DbGljaygpXCI+e3tidXR0b25UZXh0fX08L2J1dHRvbj5cclxuYCxcclxuICBzdHlsZXM6IFtgLm5ldy1mb2xkZXItZGVzY3JpcHRpb257bWFyZ2luOjAgYXV0bztwYWRkaW5nOjB9YF1cclxufSlcclxuZXhwb3J0IGNsYXNzIE5ld0ZvbGRlckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcbiAgQFZpZXdDaGlsZCgndXBsb2FkRm9sZGVyJykgdXBsb2FkRm9sZGVyOiBFbGVtZW50UmVmO1xyXG4gIEBPdXRwdXQoKSBidXR0b25DbGlja2VkID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICBidXR0b25UZXh0ID0gXygnQ2xvc2UnKS50b1N0cmluZygpO1xyXG4gIGlucHV0VmFsdWUgPSAnJztcclxuXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgfVxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICB9XHJcblxyXG4gIG9uQ2xpY2soKSB7XHJcbiAgICBjb25zdCBlbDogSFRNTEVsZW1lbnQgPSAodGhpcy51cGxvYWRGb2xkZXIubmF0aXZlRWxlbWVudCBhcyBIVE1MRWxlbWVudCk7XHJcbiAgICAvLyBAdHMtaWdub3JlXHJcbiAgICB0aGlzLmJ1dHRvbkNsaWNrZWQuZW1pdChlbC52YWx1ZSk7XHJcbiAgfVxyXG5cclxuICBvbklucHV0Q2hhbmdlKGV2ZW50OiBhbnkpIHtcclxuICAgIHRoaXMuaW5wdXRWYWx1ZSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcclxuICAgIGlmICh0aGlzLmlucHV0VmFsdWUubGVuZ3RoID4gMCkge1xyXG4gICAgICB0aGlzLmJ1dHRvblRleHQgPSBfKCdDb25maXJtJykudG9TdHJpbmcoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuYnV0dG9uVGV4dCA9IF8oJ0Nsb3NlJykudG9TdHJpbmcoKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIl19