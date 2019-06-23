/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as ACTIONS from '../../reducers/actions.action';
import { NodeService } from '../../services/node.service';
export class NavBarComponent {
    /**
     * @param {?} store
     * @param {?} nodeService
     */
    constructor(store, nodeService) {
        this.store = store;
        this.nodeService = nodeService;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.store
            .pipe(select((/**
         * @param {?} state
         * @return {?}
         */
        state => (state.fileManagerState || (/** @type {?} */ ({}))).path)))
            .subscribe((/**
         * @param {?} data
         * @return {?}
         */
        (data) => {
            this.nodeService.currentPath = data;
            this.currentPath = data.split('/');
        }));
    }
    /**
     * @param {?} path
     * @param {?} index
     * @return {?}
     */
    onClick(path, index) {
        /** @type {?} */
        const newPath = path.slice(0, index + 1).join('/');
        this.store.dispatch({ type: ACTIONS.SET_PATH, payload: newPath });
    }
}
NavBarComponent.decorators = [
    { type: Component, args: [{
                selector: 'app-nav-bar',
                template: `<div>
  >> <span *ngFor="let to of currentPath; let i = index">
  <a class="link" (click)="onClick(currentPath, i)">
    <div *ngIf="to === '' || to === 'root'; then icon else name"></div>
    <ng-template #icon><i class="fas fa-home"></i></ng-template>
    <ng-template #name>{{to}}</ng-template>
  </a> /
  </span>
</div>
`,
                styles: [``]
            },] },
];
NavBarComponent.ctorParameters = () => [
    { type: Store },
    { type: NodeService }
];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmF2LWJhci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZzYtZmlsZS1tYW4vIiwic291cmNlcyI6WyJmaWxlLW1hbmFnZXIvY29tcG9uZW50cy9uYXYtYmFyL25hdi1iYXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUMsU0FBUyxFQUFTLE1BQU0sZUFBZSxDQUFDO0FBQ2hELE9BQU8sRUFBQyxNQUFNLEVBQUUsS0FBSyxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBQzFDLE9BQU8sS0FBSyxPQUFPLE1BQU0sK0JBQStCLENBQUM7QUFFekQsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLDZCQUE2QixDQUFDO0FBZ0J4RCxNQUFNOzs7OztJQUdKLFlBQ1UsS0FBc0IsRUFDdEIsV0FBd0I7UUFEeEIsVUFBSyxHQUFMLEtBQUssQ0FBaUI7UUFDdEIsZ0JBQVcsR0FBWCxXQUFXLENBQWE7SUFFbEMsQ0FBQzs7OztJQUVELFFBQVE7UUFDTixJQUFJLENBQUMsS0FBSzthQUNQLElBQUksQ0FBQyxNQUFNOzs7O1FBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsSUFBSSxtQkFBQSxFQUFFLEVBQU8sQ0FBQyxDQUFDLElBQUksRUFBQyxDQUFDO2FBQ2pFLFNBQVM7Ozs7UUFBQyxDQUFDLElBQVksRUFBRSxFQUFFO1lBQzFCLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztZQUNwQyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDckMsQ0FBQyxFQUFDLENBQUM7SUFDUCxDQUFDOzs7Ozs7SUFFRCxPQUFPLENBQUMsSUFBYyxFQUFFLEtBQWE7O2NBQzdCLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztRQUNsRCxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFDLElBQUksRUFBRSxPQUFPLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDO0lBQ2xFLENBQUM7OztZQW5DRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGFBQWE7Z0JBQ3ZCLFFBQVEsRUFBRTs7Ozs7Ozs7O0NBU1g7Z0JBQ0MsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDO2FBQ2I7OztZQWxCZSxLQUFLO1lBR2IsV0FBVzs7OztJQWlCakIsc0NBQXNCOzs7OztJQUdwQixnQ0FBOEI7Ozs7O0lBQzlCLHNDQUFnQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q29tcG9uZW50LCBPbkluaXR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge3NlbGVjdCwgU3RvcmV9IGZyb20gJ0BuZ3J4L3N0b3JlJztcclxuaW1wb3J0ICogYXMgQUNUSU9OUyBmcm9tICcuLi8uLi9yZWR1Y2Vycy9hY3Rpb25zLmFjdGlvbic7XHJcbmltcG9ydCB7QXBwU3RvcmV9IGZyb20gJy4uLy4uL3JlZHVjZXJzL3JlZHVjZXIuZmFjdG9yeSc7XHJcbmltcG9ydCB7Tm9kZVNlcnZpY2V9IGZyb20gJy4uLy4uL3NlcnZpY2VzL25vZGUuc2VydmljZSc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2FwcC1uYXYtYmFyJyxcclxuICB0ZW1wbGF0ZTogYDxkaXY+XHJcbiAgPj4gPHNwYW4gKm5nRm9yPVwibGV0IHRvIG9mIGN1cnJlbnRQYXRoOyBsZXQgaSA9IGluZGV4XCI+XHJcbiAgPGEgY2xhc3M9XCJsaW5rXCIgKGNsaWNrKT1cIm9uQ2xpY2soY3VycmVudFBhdGgsIGkpXCI+XHJcbiAgICA8ZGl2ICpuZ0lmPVwidG8gPT09ICcnIHx8IHRvID09PSAncm9vdCc7IHRoZW4gaWNvbiBlbHNlIG5hbWVcIj48L2Rpdj5cclxuICAgIDxuZy10ZW1wbGF0ZSAjaWNvbj48aSBjbGFzcz1cImZhcyBmYS1ob21lXCI+PC9pPjwvbmctdGVtcGxhdGU+XHJcbiAgICA8bmctdGVtcGxhdGUgI25hbWU+e3t0b319PC9uZy10ZW1wbGF0ZT5cclxuICA8L2E+IC9cclxuICA8L3NwYW4+XHJcbjwvZGl2PlxyXG5gLFxyXG4gIHN0eWxlczogW2BgXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgTmF2QmFyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuICBjdXJyZW50UGF0aDogc3RyaW5nW107XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcHJpdmF0ZSBzdG9yZTogU3RvcmU8QXBwU3RvcmU+LFxyXG4gICAgcHJpdmF0ZSBub2RlU2VydmljZTogTm9kZVNlcnZpY2VcclxuICApIHtcclxuICB9XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gICAgdGhpcy5zdG9yZVxyXG4gICAgICAucGlwZShzZWxlY3Qoc3RhdGUgPT4gKHN0YXRlLmZpbGVNYW5hZ2VyU3RhdGUgfHwge30gYXMgYW55KS5wYXRoKSlcclxuICAgICAgLnN1YnNjcmliZSgoZGF0YTogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgdGhpcy5ub2RlU2VydmljZS5jdXJyZW50UGF0aCA9IGRhdGE7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50UGF0aCA9IGRhdGEuc3BsaXQoJy8nKTtcclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICBvbkNsaWNrKHBhdGg6IHN0cmluZ1tdLCBpbmRleDogbnVtYmVyKSB7XHJcbiAgICBjb25zdCBuZXdQYXRoID0gcGF0aC5zbGljZSgwLCBpbmRleCArIDEpLmpvaW4oJy8nKTtcclxuICAgIHRoaXMuc3RvcmUuZGlzcGF0Y2goe3R5cGU6IEFDVElPTlMuU0VUX1BBVEgsIHBheWxvYWQ6IG5ld1BhdGh9KTtcclxuICB9XHJcblxyXG59XHJcbiJdfQ==