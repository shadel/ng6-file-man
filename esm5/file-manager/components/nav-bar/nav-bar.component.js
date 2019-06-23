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
        function (state) { return (state.fileManagerState || (/** @type {?} */ ({}))).path; })))
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmF2LWJhci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZzYtZmlsZS1tYW4vIiwic291cmNlcyI6WyJmaWxlLW1hbmFnZXIvY29tcG9uZW50cy9uYXYtYmFyL25hdi1iYXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUMsU0FBUyxFQUFTLE1BQU0sZUFBZSxDQUFDO0FBQ2hELE9BQU8sRUFBQyxNQUFNLEVBQUUsS0FBSyxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBQzFDLE9BQU8sS0FBSyxPQUFPLE1BQU0sK0JBQStCLENBQUM7QUFFekQsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLDZCQUE2QixDQUFDO0FBRXhEO0lBaUJFLHlCQUNVLEtBQXNCLEVBQ3RCLFdBQXdCO1FBRHhCLFVBQUssR0FBTCxLQUFLLENBQWlCO1FBQ3RCLGdCQUFXLEdBQVgsV0FBVyxDQUFhO0lBRWxDLENBQUM7Ozs7SUFFRCxrQ0FBUTs7O0lBQVI7UUFBQSxpQkFPQztRQU5DLElBQUksQ0FBQyxLQUFLO2FBQ1AsSUFBSSxDQUFDLE1BQU07Ozs7UUFBQyxVQUFBLEtBQUssSUFBSSxPQUFBLENBQUMsS0FBSyxDQUFDLGdCQUFnQixJQUFJLG1CQUFBLEVBQUUsRUFBTyxDQUFDLENBQUMsSUFBSSxFQUExQyxDQUEwQyxFQUFDLENBQUM7YUFDakUsU0FBUzs7OztRQUFDLFVBQUMsSUFBWTtZQUN0QixLQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7WUFDcEMsS0FBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3JDLENBQUMsRUFBQyxDQUFDO0lBQ1AsQ0FBQzs7Ozs7O0lBRUQsaUNBQU87Ozs7O0lBQVAsVUFBUSxJQUFjLEVBQUUsS0FBYTs7WUFDN0IsT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO1FBQ2xELElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBQyxDQUFDLENBQUM7SUFDbEUsQ0FBQzs7Z0JBbkNGLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsYUFBYTtvQkFDdkIsUUFBUSxFQUFFLHlWQVNYO29CQUNDLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQztpQkFDYjs7O2dCQWxCZSxLQUFLO2dCQUdiLFdBQVc7O0lBdUNuQixzQkFBQztDQUFBLEFBckNELElBcUNDO1NBdkJZLGVBQWU7OztJQUMxQixzQ0FBc0I7Ozs7O0lBR3BCLGdDQUE4Qjs7Ozs7SUFDOUIsc0NBQWdDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDb21wb25lbnQsIE9uSW5pdH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7c2VsZWN0LCBTdG9yZX0gZnJvbSAnQG5ncngvc3RvcmUnO1xyXG5pbXBvcnQgKiBhcyBBQ1RJT05TIGZyb20gJy4uLy4uL3JlZHVjZXJzL2FjdGlvbnMuYWN0aW9uJztcclxuaW1wb3J0IHtBcHBTdG9yZX0gZnJvbSAnLi4vLi4vcmVkdWNlcnMvcmVkdWNlci5mYWN0b3J5JztcclxuaW1wb3J0IHtOb2RlU2VydmljZX0gZnJvbSAnLi4vLi4vc2VydmljZXMvbm9kZS5zZXJ2aWNlJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnYXBwLW5hdi1iYXInLFxyXG4gIHRlbXBsYXRlOiBgPGRpdj5cclxuICA+PiA8c3BhbiAqbmdGb3I9XCJsZXQgdG8gb2YgY3VycmVudFBhdGg7IGxldCBpID0gaW5kZXhcIj5cclxuICA8YSBjbGFzcz1cImxpbmtcIiAoY2xpY2spPVwib25DbGljayhjdXJyZW50UGF0aCwgaSlcIj5cclxuICAgIDxkaXYgKm5nSWY9XCJ0byA9PT0gJycgfHwgdG8gPT09ICdyb290JzsgdGhlbiBpY29uIGVsc2UgbmFtZVwiPjwvZGl2PlxyXG4gICAgPG5nLXRlbXBsYXRlICNpY29uPjxpIGNsYXNzPVwiZmFzIGZhLWhvbWVcIj48L2k+PC9uZy10ZW1wbGF0ZT5cclxuICAgIDxuZy10ZW1wbGF0ZSAjbmFtZT57e3RvfX08L25nLXRlbXBsYXRlPlxyXG4gIDwvYT4gL1xyXG4gIDwvc3Bhbj5cclxuPC9kaXY+XHJcbmAsXHJcbiAgc3R5bGVzOiBbYGBdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBOYXZCYXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG4gIGN1cnJlbnRQYXRoOiBzdHJpbmdbXTtcclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwcml2YXRlIHN0b3JlOiBTdG9yZTxBcHBTdG9yZT4sXHJcbiAgICBwcml2YXRlIG5vZGVTZXJ2aWNlOiBOb2RlU2VydmljZVxyXG4gICkge1xyXG4gIH1cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgICB0aGlzLnN0b3JlXHJcbiAgICAgIC5waXBlKHNlbGVjdChzdGF0ZSA9PiAoc3RhdGUuZmlsZU1hbmFnZXJTdGF0ZSB8fCB7fSBhcyBhbnkpLnBhdGgpKVxyXG4gICAgICAuc3Vic2NyaWJlKChkYXRhOiBzdHJpbmcpID0+IHtcclxuICAgICAgICB0aGlzLm5vZGVTZXJ2aWNlLmN1cnJlbnRQYXRoID0gZGF0YTtcclxuICAgICAgICB0aGlzLmN1cnJlbnRQYXRoID0gZGF0YS5zcGxpdCgnLycpO1xyXG4gICAgICB9KTtcclxuICB9XHJcblxyXG4gIG9uQ2xpY2socGF0aDogc3RyaW5nW10sIGluZGV4OiBudW1iZXIpIHtcclxuICAgIGNvbnN0IG5ld1BhdGggPSBwYXRoLnNsaWNlKDAsIGluZGV4ICsgMSkuam9pbignLycpO1xyXG4gICAgdGhpcy5zdG9yZS5kaXNwYXRjaCh7dHlwZTogQUNUSU9OUy5TRVRfUEFUSCwgcGF5bG9hZDogbmV3UGF0aH0pO1xyXG4gIH1cclxuXHJcbn1cclxuIl19