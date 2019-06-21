/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as ACTIONS from '../../reducers/actions.action';
import { NodeService } from '../../services/node.service';
var NavBarComponent = /** @class */ (function () {
    function NavBarComponent(store, nodeService) {
        this.store = store;
        this.nodeService = nodeService;
    }
    /**
     * @return {?}
     */
    NavBarComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.store
            .pipe(select((/**
         * @param {?} state
         * @return {?}
         */
        function (state) { return state.fileManagerState.path; })))
            .subscribe((/**
         * @param {?} data
         * @return {?}
         */
        function (data) {
            _this.nodeService.currentPath = data;
            _this.currentPath = data.split('/');
        }));
    };
    /**
     * @param {?} path
     * @param {?} index
     * @return {?}
     */
    NavBarComponent.prototype.onClick = /**
     * @param {?} path
     * @param {?} index
     * @return {?}
     */
    function (path, index) {
        /** @type {?} */
        var newPath = path.slice(0, index + 1).join('/');
        this.store.dispatch({ type: ACTIONS.SET_PATH, payload: newPath });
    };
    NavBarComponent.decorators = [
        { type: Component, args: [{
                    selector: 'app-nav-bar',
                    template: "<div>\n  >> <span *ngFor=\"let to of currentPath; let i = index\">\n  <a class=\"link\" (click)=\"onClick(currentPath, i)\">\n    <div *ngIf=\"to === '' || to === 'root'; then icon else name\"></div>\n    <ng-template #icon><i class=\"fas fa-home\"></i></ng-template>\n    <ng-template #name>{{to}}</ng-template>\n  </a> /\n  </span>\n</div>\n",
                    styles: [""]
                },] },
    ];
    NavBarComponent.ctorParameters = function () { return [
        { type: Store },
        { type: NodeService }
    ]; };
    return NavBarComponent;
}());
export { NavBarComponent };
if (false) {
    /** @type {?} */
    NavBarComponent.prototype.currentPath;
    /**
     * @type {?}
     * @private
     */
    NavBarComponent.prototype.store;
    /**
     * @type {?}
     * @private
     */
    NavBarComponent.prototype.nodeService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmF2LWJhci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZzYtZmlsZS1tYW4vIiwic291cmNlcyI6WyJmaWxlLW1hbmFnZXIvY29tcG9uZW50cy9uYXYtYmFyL25hdi1iYXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUMsU0FBUyxFQUFTLE1BQU0sZUFBZSxDQUFDO0FBQ2hELE9BQU8sRUFBQyxNQUFNLEVBQUUsS0FBSyxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBQzFDLE9BQU8sS0FBSyxPQUFPLE1BQU0sK0JBQStCLENBQUM7QUFFekQsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLDZCQUE2QixDQUFDO0FBRXhEO0lBaUJFLHlCQUNVLEtBQXNCLEVBQ3RCLFdBQXdCO1FBRHhCLFVBQUssR0FBTCxLQUFLLENBQWlCO1FBQ3RCLGdCQUFXLEdBQVgsV0FBVyxDQUFhO0lBRWxDLENBQUM7Ozs7SUFFRCxrQ0FBUTs7O0lBQVI7UUFBQSxpQkFPQztRQU5DLElBQUksQ0FBQyxLQUFLO2FBQ1AsSUFBSSxDQUFDLE1BQU07Ozs7UUFBQyxVQUFBLEtBQUssSUFBSSxPQUFBLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQTNCLENBQTJCLEVBQUMsQ0FBQzthQUNsRCxTQUFTOzs7O1FBQUMsVUFBQyxJQUFZO1lBQ3RCLEtBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztZQUNwQyxLQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDckMsQ0FBQyxFQUFDLENBQUM7SUFDUCxDQUFDOzs7Ozs7SUFFRCxpQ0FBTzs7Ozs7SUFBUCxVQUFRLElBQWMsRUFBRSxLQUFhOztZQUM3QixPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7UUFDbEQsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQztJQUNsRSxDQUFDOztnQkFuQ0YsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxhQUFhO29CQUN2QixRQUFRLEVBQUUseVZBU1g7b0JBQ0MsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDO2lCQUNiOzs7Z0JBbEJlLEtBQUs7Z0JBR2IsV0FBVzs7SUF1Q25CLHNCQUFDO0NBQUEsQUFyQ0QsSUFxQ0M7U0F2QlksZUFBZTs7O0lBQzFCLHNDQUFzQjs7Ozs7SUFHcEIsZ0NBQThCOzs7OztJQUM5QixzQ0FBZ0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NvbXBvbmVudCwgT25Jbml0fSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtzZWxlY3QsIFN0b3JlfSBmcm9tICdAbmdyeC9zdG9yZSc7XHJcbmltcG9ydCAqIGFzIEFDVElPTlMgZnJvbSAnLi4vLi4vcmVkdWNlcnMvYWN0aW9ucy5hY3Rpb24nO1xyXG5pbXBvcnQge0FwcFN0b3JlfSBmcm9tICcuLi8uLi9yZWR1Y2Vycy9yZWR1Y2VyLmZhY3RvcnknO1xyXG5pbXBvcnQge05vZGVTZXJ2aWNlfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9ub2RlLnNlcnZpY2UnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdhcHAtbmF2LWJhcicsXHJcbiAgdGVtcGxhdGU6IGA8ZGl2PlxyXG4gID4+IDxzcGFuICpuZ0Zvcj1cImxldCB0byBvZiBjdXJyZW50UGF0aDsgbGV0IGkgPSBpbmRleFwiPlxyXG4gIDxhIGNsYXNzPVwibGlua1wiIChjbGljayk9XCJvbkNsaWNrKGN1cnJlbnRQYXRoLCBpKVwiPlxyXG4gICAgPGRpdiAqbmdJZj1cInRvID09PSAnJyB8fCB0byA9PT0gJ3Jvb3QnOyB0aGVuIGljb24gZWxzZSBuYW1lXCI+PC9kaXY+XHJcbiAgICA8bmctdGVtcGxhdGUgI2ljb24+PGkgY2xhc3M9XCJmYXMgZmEtaG9tZVwiPjwvaT48L25nLXRlbXBsYXRlPlxyXG4gICAgPG5nLXRlbXBsYXRlICNuYW1lPnt7dG99fTwvbmctdGVtcGxhdGU+XHJcbiAgPC9hPiAvXHJcbiAgPC9zcGFuPlxyXG48L2Rpdj5cclxuYCxcclxuICBzdHlsZXM6IFtgYF1cclxufSlcclxuZXhwb3J0IGNsYXNzIE5hdkJhckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcbiAgY3VycmVudFBhdGg6IHN0cmluZ1tdO1xyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHByaXZhdGUgc3RvcmU6IFN0b3JlPEFwcFN0b3JlPixcclxuICAgIHByaXZhdGUgbm9kZVNlcnZpY2U6IE5vZGVTZXJ2aWNlXHJcbiAgKSB7XHJcbiAgfVxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICAgIHRoaXMuc3RvcmVcclxuICAgICAgLnBpcGUoc2VsZWN0KHN0YXRlID0+IHN0YXRlLmZpbGVNYW5hZ2VyU3RhdGUucGF0aCkpXHJcbiAgICAgIC5zdWJzY3JpYmUoKGRhdGE6IHN0cmluZykgPT4ge1xyXG4gICAgICAgIHRoaXMubm9kZVNlcnZpY2UuY3VycmVudFBhdGggPSBkYXRhO1xyXG4gICAgICAgIHRoaXMuY3VycmVudFBhdGggPSBkYXRhLnNwbGl0KCcvJyk7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgb25DbGljayhwYXRoOiBzdHJpbmdbXSwgaW5kZXg6IG51bWJlcikge1xyXG4gICAgY29uc3QgbmV3UGF0aCA9IHBhdGguc2xpY2UoMCwgaW5kZXggKyAxKS5qb2luKCcvJyk7XHJcbiAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKHt0eXBlOiBBQ1RJT05TLlNFVF9QQVRILCBwYXlsb2FkOiBuZXdQYXRofSk7XHJcbiAgfVxyXG5cclxufVxyXG4iXX0=