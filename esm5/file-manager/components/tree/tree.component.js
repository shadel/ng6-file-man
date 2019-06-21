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
var TreeComponent = /** @class */ (function () {
    function TreeComponent(nodeService, store) {
        this.nodeService = nodeService;
        this.store = store;
        this.currentTreeLevel = '';
    }
    /**
     * @return {?}
     */
    TreeComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.nodes = this.treeModel.nodes;
        //todo move this store to proper place
        this.store
            .pipe(select((/**
         * @param {?} state
         * @return {?}
         */
        function (state) { return state.fileManagerState.path; })))
            .subscribe((/**
         * @param {?} path
         * @return {?}
         */
        function (path) {
            _this.nodeService.getNodes(path);
            _this.currentTreeLevel = _this.treeModel.currentPath;
            return _this.treeModel.currentPath = path;
        }));
    };
    /**
     * @return {?}
     */
    TreeComponent.prototype.ngAfterViewInit = /**
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
            .pipe(first())
            .subscribe((/**
         * @param {?} path
         * @return {?}
         */
        function (path) {
            /** @type {?} */
            var nodes = _this.nodeService.findNodeByPath(path);
            _this.store.dispatch({ type: ACTIONS.SET_SELECTED_NODE, payload: nodes });
        }));
    };
    TreeComponent.decorators = [
        { type: Component, args: [{
                    selector: 'app-tree',
                    template: "<app-node-lister [showFiles]=\"treeModel.config.options.showFilesInsideTree\"\n                 [nodes]=\"{children: nodes}\">\n  <ng-template let-nodes>\n    <ng-container [ngTemplateOutletContext]=\"{$implicit: nodes}\" [ngTemplateOutlet]=\"templateRef\"></ng-container>\n  </ng-template>\n</app-node-lister>\n",
                    styles: [""]
                },] },
    ];
    TreeComponent.ctorParameters = function () { return [
        { type: NodeService },
        { type: Store }
    ]; };
    TreeComponent.propDecorators = {
        templateRef: [{ type: ContentChild, args: [TemplateRef,] }],
        treeModel: [{ type: Input }]
    };
    return TreeComponent;
}());
export { TreeComponent };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZzYtZmlsZS1tYW4vIiwic291cmNlcyI6WyJmaWxlLW1hbmFnZXIvY29tcG9uZW50cy90cmVlL3RyZWUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQWdCLFNBQVMsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFVLFdBQVcsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUVqRyxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0seUJBQXlCLENBQUM7QUFDbEQsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLDZCQUE2QixDQUFDO0FBQ3hELE9BQU8sRUFBQyxNQUFNLEVBQUUsS0FBSyxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBRTFDLE9BQU8sS0FBSyxPQUFPLE1BQU0sK0JBQStCLENBQUM7QUFDekQsT0FBTyxFQUFDLEtBQUssRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRXJDO0lBbUJFLHVCQUNVLFdBQXdCLEVBQ3hCLEtBQXNCO1FBRHRCLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBQ3hCLFVBQUssR0FBTCxLQUFLLENBQWlCO1FBSmhDLHFCQUFnQixHQUFHLEVBQUUsQ0FBQztJQU10QixDQUFDOzs7O0lBRUQsZ0NBQVE7OztJQUFSO1FBQUEsaUJBYUM7UUFaQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDO1FBRWxDLHNDQUFzQztRQUN0QyxJQUFJLENBQUMsS0FBSzthQUNQLElBQUksQ0FBQyxNQUFNOzs7O1FBQUMsVUFBQSxLQUFLLElBQUksT0FBQSxLQUFLLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUEzQixDQUEyQixFQUFDLENBQUM7YUFDbEQsU0FBUzs7OztRQUFDLFVBQUMsSUFBWTtZQUN0QixLQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUVoQyxLQUFJLENBQUMsZ0JBQWdCLEdBQUcsS0FBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUM7WUFFbkQsTUFBTSxDQUFDLEtBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztRQUMzQyxDQUFDLEVBQUMsQ0FBQztJQUNQLENBQUM7Ozs7SUFFRCx1Q0FBZTs7O0lBQWY7UUFBQSxpQkFRQztRQVBDLElBQUksQ0FBQyxLQUFLO2FBQ1AsSUFBSSxDQUFDLE1BQU07Ozs7UUFBQyxVQUFBLEtBQUssSUFBSSxPQUFBLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQTNCLENBQTJCLEVBQUMsQ0FBQzthQUNsRCxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7YUFDYixTQUFTOzs7O1FBQUMsVUFBQyxJQUFZOztnQkFDaEIsS0FBSyxHQUFHLEtBQUksQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQztZQUNuRCxLQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFDLElBQUksRUFBRSxPQUFPLENBQUMsaUJBQWlCLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUM7UUFDekUsQ0FBQyxFQUFDLENBQUM7SUFDUCxDQUFDOztnQkFoREYsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxVQUFVO29CQUNwQixRQUFRLEVBQUUsMFRBTVg7b0JBQ0MsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDO2lCQUNiOzs7Z0JBaEJPLFdBQVc7Z0JBQ0gsS0FBSzs7OzhCQWlCbEIsWUFBWSxTQUFDLFdBQVc7NEJBRXhCLEtBQUs7O0lBbUNSLG9CQUFDO0NBQUEsQUFqREQsSUFpREM7U0F0Q1ksYUFBYTs7O0lBQ3hCLG9DQUF5RDs7SUFFekQsa0NBQThCOztJQUU5Qiw4QkFBcUI7O0lBQ3JCLHlDQUFzQjs7Ozs7SUFHcEIsb0NBQWdDOzs7OztJQUNoQyw4QkFBOEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0FmdGVyVmlld0luaXQsIENvbXBvbmVudCwgQ29udGVudENoaWxkLCBJbnB1dCwgT25Jbml0LCBUZW1wbGF0ZVJlZn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7Tm9kZUludGVyZmFjZX0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlcy9ub2RlLmludGVyZmFjZSc7XHJcbmltcG9ydCB7VHJlZU1vZGVsfSBmcm9tICcuLi8uLi9tb2RlbHMvdHJlZS5tb2RlbCc7XHJcbmltcG9ydCB7Tm9kZVNlcnZpY2V9IGZyb20gJy4uLy4uL3NlcnZpY2VzL25vZGUuc2VydmljZSc7XHJcbmltcG9ydCB7c2VsZWN0LCBTdG9yZX0gZnJvbSAnQG5ncngvc3RvcmUnO1xyXG5pbXBvcnQge0FwcFN0b3JlfSBmcm9tICcuLi8uLi9yZWR1Y2Vycy9yZWR1Y2VyLmZhY3RvcnknO1xyXG5pbXBvcnQgKiBhcyBBQ1RJT05TIGZyb20gJy4uLy4uL3JlZHVjZXJzL2FjdGlvbnMuYWN0aW9uJztcclxuaW1wb3J0IHtmaXJzdH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdhcHAtdHJlZScsXHJcbiAgdGVtcGxhdGU6IGA8YXBwLW5vZGUtbGlzdGVyIFtzaG93RmlsZXNdPVwidHJlZU1vZGVsLmNvbmZpZy5vcHRpb25zLnNob3dGaWxlc0luc2lkZVRyZWVcIlxyXG4gICAgICAgICAgICAgICAgIFtub2Rlc109XCJ7Y2hpbGRyZW46IG5vZGVzfVwiPlxyXG4gIDxuZy10ZW1wbGF0ZSBsZXQtbm9kZXM+XHJcbiAgICA8bmctY29udGFpbmVyIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7JGltcGxpY2l0OiBub2Rlc31cIiBbbmdUZW1wbGF0ZU91dGxldF09XCJ0ZW1wbGF0ZVJlZlwiPjwvbmctY29udGFpbmVyPlxyXG4gIDwvbmctdGVtcGxhdGU+XHJcbjwvYXBwLW5vZGUtbGlzdGVyPlxyXG5gLFxyXG4gIHN0eWxlczogW2BgXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgVHJlZUNvbXBvbmVudCBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQsIE9uSW5pdCB7XHJcbiAgQENvbnRlbnRDaGlsZChUZW1wbGF0ZVJlZikgdGVtcGxhdGVSZWY6IFRlbXBsYXRlUmVmPGFueT47XHJcblxyXG4gIEBJbnB1dCgpIHRyZWVNb2RlbDogVHJlZU1vZGVsO1xyXG5cclxuICBub2RlczogTm9kZUludGVyZmFjZTtcclxuICBjdXJyZW50VHJlZUxldmVsID0gJyc7XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcHJpdmF0ZSBub2RlU2VydmljZTogTm9kZVNlcnZpY2UsXHJcbiAgICBwcml2YXRlIHN0b3JlOiBTdG9yZTxBcHBTdG9yZT5cclxuICApIHtcclxuICB9XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gICAgdGhpcy5ub2RlcyA9IHRoaXMudHJlZU1vZGVsLm5vZGVzO1xyXG5cclxuICAgIC8vdG9kbyBtb3ZlIHRoaXMgc3RvcmUgdG8gcHJvcGVyIHBsYWNlXHJcbiAgICB0aGlzLnN0b3JlXHJcbiAgICAgIC5waXBlKHNlbGVjdChzdGF0ZSA9PiBzdGF0ZS5maWxlTWFuYWdlclN0YXRlLnBhdGgpKVxyXG4gICAgICAuc3Vic2NyaWJlKChwYXRoOiBzdHJpbmcpID0+IHtcclxuICAgICAgICB0aGlzLm5vZGVTZXJ2aWNlLmdldE5vZGVzKHBhdGgpO1xyXG5cclxuICAgICAgICB0aGlzLmN1cnJlbnRUcmVlTGV2ZWwgPSB0aGlzLnRyZWVNb2RlbC5jdXJyZW50UGF0aDtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMudHJlZU1vZGVsLmN1cnJlbnRQYXRoID0gcGF0aDtcclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICBuZ0FmdGVyVmlld0luaXQoKSB7XHJcbiAgICB0aGlzLnN0b3JlXHJcbiAgICAgIC5waXBlKHNlbGVjdChzdGF0ZSA9PiBzdGF0ZS5maWxlTWFuYWdlclN0YXRlLnBhdGgpKVxyXG4gICAgICAucGlwZShmaXJzdCgpKVxyXG4gICAgICAuc3Vic2NyaWJlKChwYXRoOiBzdHJpbmcpID0+IHtcclxuICAgICAgICBjb25zdCBub2RlcyA9IHRoaXMubm9kZVNlcnZpY2UuZmluZE5vZGVCeVBhdGgocGF0aCk7XHJcbiAgICAgICAgdGhpcy5zdG9yZS5kaXNwYXRjaCh7dHlwZTogQUNUSU9OUy5TRVRfU0VMRUNURURfTk9ERSwgcGF5bG9hZDogbm9kZXN9KTtcclxuICAgICAgfSk7XHJcbiAgfVxyXG59XHJcbiJdfQ==