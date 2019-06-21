/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, ViewEncapsulation } from '@angular/core';
import { NodeClickedService } from '../../services/node-clicked.service';
var NavigationComponent = /** @class */ (function () {
    function NavigationComponent(nodeClickedService) {
        this.nodeClickedService = nodeClickedService;
    }
    /**
     * @return {?}
     */
    NavigationComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
    };
    /**
     * @param {?} input
     * @return {?}
     */
    NavigationComponent.prototype.onClick = /**
     * @param {?} input
     * @return {?}
     */
    function (input) {
        this.nodeClickedService.searchForString(input);
    };
    NavigationComponent.decorators = [
        { type: Component, args: [{
                    selector: 'app-navigation',
                    template: "<div class=\"navigation-component\">\n  <input #input class=\"navigation-search\" onclick=\"this.select();\" (keyup.enter)=\"onClick(input.value)\"\n         placeholder=\"{{'Search' | translate}}\">\n\n  <button [disabled]=\"input.value.length === 0\" class=\"navigation-search-icon\" (click)=\"onClick(input.value)\">\n    <i class=\"fas fa-search\"></i>\n  </button>\n\n  <div>\n    <ng-content></ng-content>\n  </div>\n</div>\n\n\n",
                    styles: [".navigation-component{display:-webkit-flex;display:flex}"],
                    encapsulation: ViewEncapsulation.None
                },] },
    ];
    NavigationComponent.ctorParameters = function () { return [
        { type: NodeClickedService }
    ]; };
    return NavigationComponent;
}());
export { NavigationComponent };
if (false) {
    /**
     * @type {?}
     * @private
     */
    NavigationComponent.prototype.nodeClickedService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmF2aWdhdGlvbi5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZzYtZmlsZS1tYW4vIiwic291cmNlcyI6WyJmaWxlLW1hbmFnZXIvY29tcG9uZW50cy9uYXZpZ2F0aW9uL25hdmlnYXRpb24uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUMsU0FBUyxFQUFVLGlCQUFpQixFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ25FLE9BQU8sRUFBQyxrQkFBa0IsRUFBQyxNQUFNLHFDQUFxQyxDQUFDO0FBRXZFO0lBc0JFLDZCQUNVLGtCQUFzQztRQUF0Qyx1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW9CO0lBRWhELENBQUM7Ozs7SUFFRCxzQ0FBUTs7O0lBQVI7SUFDQSxDQUFDOzs7OztJQUVELHFDQUFPOzs7O0lBQVAsVUFBUSxLQUFhO1FBQ25CLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDakQsQ0FBQzs7Z0JBaENGLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsZ0JBQWdCO29CQUMxQixRQUFRLEVBQUUscWJBY1g7b0JBQ0MsTUFBTSxFQUFFLENBQUMsMERBQTBELENBQUM7b0JBQ3BFLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO2lCQUN0Qzs7O2dCQXJCTyxrQkFBa0I7O0lBbUMxQiwwQkFBQztDQUFBLEFBakNELElBaUNDO1NBYlksbUJBQW1COzs7Ozs7SUFHNUIsaURBQThDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDb21wb25lbnQsIE9uSW5pdCwgVmlld0VuY2Fwc3VsYXRpb259IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge05vZGVDbGlja2VkU2VydmljZX0gZnJvbSAnLi4vLi4vc2VydmljZXMvbm9kZS1jbGlja2VkLnNlcnZpY2UnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdhcHAtbmF2aWdhdGlvbicsXHJcbiAgdGVtcGxhdGU6IGA8ZGl2IGNsYXNzPVwibmF2aWdhdGlvbi1jb21wb25lbnRcIj5cclxuICA8aW5wdXQgI2lucHV0IGNsYXNzPVwibmF2aWdhdGlvbi1zZWFyY2hcIiBvbmNsaWNrPVwidGhpcy5zZWxlY3QoKTtcIiAoa2V5dXAuZW50ZXIpPVwib25DbGljayhpbnB1dC52YWx1ZSlcIlxyXG4gICAgICAgICBwbGFjZWhvbGRlcj1cInt7J1NlYXJjaCcgfCB0cmFuc2xhdGV9fVwiPlxyXG5cclxuICA8YnV0dG9uIFtkaXNhYmxlZF09XCJpbnB1dC52YWx1ZS5sZW5ndGggPT09IDBcIiBjbGFzcz1cIm5hdmlnYXRpb24tc2VhcmNoLWljb25cIiAoY2xpY2spPVwib25DbGljayhpbnB1dC52YWx1ZSlcIj5cclxuICAgIDxpIGNsYXNzPVwiZmFzIGZhLXNlYXJjaFwiPjwvaT5cclxuICA8L2J1dHRvbj5cclxuXHJcbiAgPGRpdj5cclxuICAgIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cclxuICA8L2Rpdj5cclxuPC9kaXY+XHJcblxyXG5cclxuYCxcclxuICBzdHlsZXM6IFtgLm5hdmlnYXRpb24tY29tcG9uZW50e2Rpc3BsYXk6LXdlYmtpdC1mbGV4O2Rpc3BsYXk6ZmxleH1gXSxcclxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBOYXZpZ2F0aW9uQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwcml2YXRlIG5vZGVDbGlja2VkU2VydmljZTogTm9kZUNsaWNrZWRTZXJ2aWNlXHJcbiAgKSB7XHJcbiAgfVxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICB9XHJcblxyXG4gIG9uQ2xpY2soaW5wdXQ6IHN0cmluZykge1xyXG4gICAgdGhpcy5ub2RlQ2xpY2tlZFNlcnZpY2Uuc2VhcmNoRm9yU3RyaW5nKGlucHV0KTtcclxuICB9XHJcbn1cclxuIl19