/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, ContentChild, Input, TemplateRef } from '@angular/core';
import { TreeModel } from '../../models/tree.model';
import { NodeService } from '../../services/node.service';
import { select, Store } from '@ngrx/store';
import * as ACTIONS from '../../reducers/actions.action';
import { first } from 'rxjs/operators';
export class TreeComponent {
    /**
     * @param {?} nodeService
     * @param {?} store
     */
    constructor(nodeService, store) {
        this.nodeService = nodeService;
        this.store = store;
        this.currentTreeLevel = '';
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.nodes = this.treeModel.nodes;
        //todo move this store to proper place
        this.store
            .pipe(select((/**
         * @param {?} state
         * @return {?}
         */
        state => state.fileManagerState.path)))
            .subscribe((/**
         * @param {?} path
         * @return {?}
         */
        (path) => {
            this.nodeService.getNodes(path);
            this.currentTreeLevel = this.treeModel.currentPath;
            return this.treeModel.currentPath = path;
        }));
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        this.store
            .pipe(select((/**
         * @param {?} state
         * @return {?}
         */
        state => state.fileManagerState.path)))
            .pipe(first())
            .subscribe((/**
         * @param {?} path
         * @return {?}
         */
        (path) => {
            /** @type {?} */
            const nodes = this.nodeService.findNodeByPath(path);
            this.store.dispatch({ type: ACTIONS.SET_SELECTED_NODE, payload: nodes });
        }));
    }
}
TreeComponent.decorators = [
    { type: Component, args: [{
                selector: 'app-tree',
                template: `<app-node-lister [showFiles]="treeModel.config.options.showFilesInsideTree"
                 [nodes]="{children: nodes}">
  <ng-template let-nodes>
    <ng-container [ngTemplateOutletContext]="{$implicit: nodes}" [ngTemplateOutlet]="templateRef"></ng-container>
  </ng-template>
</app-node-lister>
`,
                styles: [``]
            },] },
];
TreeComponent.ctorParameters = () => [
    { type: NodeService },
    { type: Store }
];
TreeComponent.propDecorators = {
    templateRef: [{ type: ContentChild, args: [TemplateRef,] }],
    treeModel: [{ type: Input }]
};
if (false) {
    /** @type {?} */
    TreeComponent.prototype.templateRef;
    /** @type {?} */
    TreeComponent.prototype.treeModel;
    /** @type {?} */
    TreeComponent.prototype.nodes;
    /** @type {?} */
    TreeComponent.prototype.currentTreeLevel;
    /**
     * @type {?}
     * @private
     */
    TreeComponent.prototype.nodeService;
    /**
     * @type {?}
     * @private
     */
    TreeComponent.prototype.store;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZzYtZmlsZS1tYW4vIiwic291cmNlcyI6WyJmaWxlLW1hbmFnZXIvY29tcG9uZW50cy90cmVlL3RyZWUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQWdCLFNBQVMsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFVLFdBQVcsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUVqRyxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0seUJBQXlCLENBQUM7QUFDbEQsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLDZCQUE2QixDQUFDO0FBQ3hELE9BQU8sRUFBQyxNQUFNLEVBQUUsS0FBSyxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBRTFDLE9BQU8sS0FBSyxPQUFPLE1BQU0sK0JBQStCLENBQUM7QUFDekQsT0FBTyxFQUFDLEtBQUssRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBYXJDLE1BQU07Ozs7O0lBUUosWUFDVSxXQUF3QixFQUN4QixLQUFzQjtRQUR0QixnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUN4QixVQUFLLEdBQUwsS0FBSyxDQUFpQjtRQUpoQyxxQkFBZ0IsR0FBRyxFQUFFLENBQUM7SUFNdEIsQ0FBQzs7OztJQUVELFFBQVE7UUFDTixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDO1FBRWxDLHNDQUFzQztRQUN0QyxJQUFJLENBQUMsS0FBSzthQUNQLElBQUksQ0FBQyxNQUFNOzs7O1FBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFDLENBQUM7YUFDbEQsU0FBUzs7OztRQUFDLENBQUMsSUFBWSxFQUFFLEVBQUU7WUFDMUIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFaEMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDO1lBRW5ELE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7UUFDM0MsQ0FBQyxFQUFDLENBQUM7SUFDUCxDQUFDOzs7O0lBRUQsZUFBZTtRQUNiLElBQUksQ0FBQyxLQUFLO2FBQ1AsSUFBSSxDQUFDLE1BQU07Ozs7UUFBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUMsQ0FBQzthQUNsRCxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7YUFDYixTQUFTOzs7O1FBQUMsQ0FBQyxJQUFZLEVBQUUsRUFBRTs7a0JBQ3BCLEtBQUssR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUM7WUFDbkQsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLGlCQUFpQixFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO1FBQ3pFLENBQUMsRUFBQyxDQUFDO0lBQ1AsQ0FBQzs7O1lBaERGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsVUFBVTtnQkFDcEIsUUFBUSxFQUFFOzs7Ozs7Q0FNWDtnQkFDQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUM7YUFDYjs7O1lBaEJPLFdBQVc7WUFDSCxLQUFLOzs7MEJBaUJsQixZQUFZLFNBQUMsV0FBVzt3QkFFeEIsS0FBSzs7OztJQUZOLG9DQUF5RDs7SUFFekQsa0NBQThCOztJQUU5Qiw4QkFBcUI7O0lBQ3JCLHlDQUFzQjs7Ozs7SUFHcEIsb0NBQWdDOzs7OztJQUNoQyw4QkFBOEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0FmdGVyVmlld0luaXQsIENvbXBvbmVudCwgQ29udGVudENoaWxkLCBJbnB1dCwgT25Jbml0LCBUZW1wbGF0ZVJlZn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7Tm9kZUludGVyZmFjZX0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlcy9ub2RlLmludGVyZmFjZSc7XHJcbmltcG9ydCB7VHJlZU1vZGVsfSBmcm9tICcuLi8uLi9tb2RlbHMvdHJlZS5tb2RlbCc7XHJcbmltcG9ydCB7Tm9kZVNlcnZpY2V9IGZyb20gJy4uLy4uL3NlcnZpY2VzL25vZGUuc2VydmljZSc7XHJcbmltcG9ydCB7c2VsZWN0LCBTdG9yZX0gZnJvbSAnQG5ncngvc3RvcmUnO1xyXG5pbXBvcnQge0FwcFN0b3JlfSBmcm9tICcuLi8uLi9yZWR1Y2Vycy9yZWR1Y2VyLmZhY3RvcnknO1xyXG5pbXBvcnQgKiBhcyBBQ1RJT05TIGZyb20gJy4uLy4uL3JlZHVjZXJzL2FjdGlvbnMuYWN0aW9uJztcclxuaW1wb3J0IHtmaXJzdH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdhcHAtdHJlZScsXHJcbiAgdGVtcGxhdGU6IGA8YXBwLW5vZGUtbGlzdGVyIFtzaG93RmlsZXNdPVwidHJlZU1vZGVsLmNvbmZpZy5vcHRpb25zLnNob3dGaWxlc0luc2lkZVRyZWVcIlxyXG4gICAgICAgICAgICAgICAgIFtub2Rlc109XCJ7Y2hpbGRyZW46IG5vZGVzfVwiPlxyXG4gIDxuZy10ZW1wbGF0ZSBsZXQtbm9kZXM+XHJcbiAgICA8bmctY29udGFpbmVyIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7JGltcGxpY2l0OiBub2Rlc31cIiBbbmdUZW1wbGF0ZU91dGxldF09XCJ0ZW1wbGF0ZVJlZlwiPjwvbmctY29udGFpbmVyPlxyXG4gIDwvbmctdGVtcGxhdGU+XHJcbjwvYXBwLW5vZGUtbGlzdGVyPlxyXG5gLFxyXG4gIHN0eWxlczogW2BgXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgVHJlZUNvbXBvbmVudCBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQsIE9uSW5pdCB7XHJcbiAgQENvbnRlbnRDaGlsZChUZW1wbGF0ZVJlZikgdGVtcGxhdGVSZWY6IFRlbXBsYXRlUmVmPGFueT47XHJcblxyXG4gIEBJbnB1dCgpIHRyZWVNb2RlbDogVHJlZU1vZGVsO1xyXG5cclxuICBub2RlczogTm9kZUludGVyZmFjZTtcclxuICBjdXJyZW50VHJlZUxldmVsID0gJyc7XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcHJpdmF0ZSBub2RlU2VydmljZTogTm9kZVNlcnZpY2UsXHJcbiAgICBwcml2YXRlIHN0b3JlOiBTdG9yZTxBcHBTdG9yZT5cclxuICApIHtcclxuICB9XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gICAgdGhpcy5ub2RlcyA9IHRoaXMudHJlZU1vZGVsLm5vZGVzO1xyXG5cclxuICAgIC8vdG9kbyBtb3ZlIHRoaXMgc3RvcmUgdG8gcHJvcGVyIHBsYWNlXHJcbiAgICB0aGlzLnN0b3JlXHJcbiAgICAgIC5waXBlKHNlbGVjdChzdGF0ZSA9PiBzdGF0ZS5maWxlTWFuYWdlclN0YXRlLnBhdGgpKVxyXG4gICAgICAuc3Vic2NyaWJlKChwYXRoOiBzdHJpbmcpID0+IHtcclxuICAgICAgICB0aGlzLm5vZGVTZXJ2aWNlLmdldE5vZGVzKHBhdGgpO1xyXG5cclxuICAgICAgICB0aGlzLmN1cnJlbnRUcmVlTGV2ZWwgPSB0aGlzLnRyZWVNb2RlbC5jdXJyZW50UGF0aDtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMudHJlZU1vZGVsLmN1cnJlbnRQYXRoID0gcGF0aDtcclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICBuZ0FmdGVyVmlld0luaXQoKSB7XHJcbiAgICB0aGlzLnN0b3JlXHJcbiAgICAgIC5waXBlKHNlbGVjdChzdGF0ZSA9PiBzdGF0ZS5maWxlTWFuYWdlclN0YXRlLnBhdGgpKVxyXG4gICAgICAucGlwZShmaXJzdCgpKVxyXG4gICAgICAuc3Vic2NyaWJlKChwYXRoOiBzdHJpbmcpID0+IHtcclxuICAgICAgICBjb25zdCBub2RlcyA9IHRoaXMubm9kZVNlcnZpY2UuZmluZE5vZGVCeVBhdGgocGF0aCk7XHJcbiAgICAgICAgdGhpcy5zdG9yZS5kaXNwYXRjaCh7dHlwZTogQUNUSU9OUy5TRVRfU0VMRUNURURfTk9ERSwgcGF5bG9hZDogbm9kZXN9KTtcclxuICAgICAgfSk7XHJcbiAgfVxyXG59XHJcbiJdfQ==