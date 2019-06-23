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
        function (state) { return (state.fileManagerState || (/** @type {?} */ ({}))).path; })))
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
        function (state) { return (state.fileManagerState || (/** @type {?} */ ({}))).path; })))
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZzYtZmlsZS1tYW4vIiwic291cmNlcyI6WyJmaWxlLW1hbmFnZXIvY29tcG9uZW50cy90cmVlL3RyZWUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQWdCLFNBQVMsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFVLFdBQVcsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUVqRyxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0seUJBQXlCLENBQUM7QUFDbEQsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLDZCQUE2QixDQUFDO0FBQ3hELE9BQU8sRUFBQyxNQUFNLEVBQUUsS0FBSyxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBRTFDLE9BQU8sS0FBSyxPQUFPLE1BQU0sK0JBQStCLENBQUM7QUFDekQsT0FBTyxFQUFDLEtBQUssRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRXJDO0lBbUJFLHVCQUNVLFdBQXdCLEVBQ3hCLEtBQXNCO1FBRHRCLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBQ3hCLFVBQUssR0FBTCxLQUFLLENBQWlCO1FBSmhDLHFCQUFnQixHQUFHLEVBQUUsQ0FBQztJQU10QixDQUFDOzs7O0lBRUQsZ0NBQVE7OztJQUFSO1FBQUEsaUJBYUM7UUFaQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDO1FBRWxDLHNDQUFzQztRQUN0QyxJQUFJLENBQUMsS0FBSzthQUNQLElBQUksQ0FBQyxNQUFNOzs7O1FBQUMsVUFBQSxLQUFLLElBQUksT0FBQSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsSUFBSSxtQkFBQSxFQUFFLEVBQU8sQ0FBQyxDQUFDLElBQUksRUFBMUMsQ0FBMEMsRUFBQyxDQUFDO2FBQ2pFLFNBQVM7Ozs7UUFBQyxVQUFDLElBQVk7WUFDdEIsS0FBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFaEMsS0FBSSxDQUFDLGdCQUFnQixHQUFHLEtBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDO1lBRW5ELE1BQU0sQ0FBQyxLQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7UUFDM0MsQ0FBQyxFQUFDLENBQUM7SUFDUCxDQUFDOzs7O0lBRUQsdUNBQWU7OztJQUFmO1FBQUEsaUJBUUM7UUFQQyxJQUFJLENBQUMsS0FBSzthQUNQLElBQUksQ0FBQyxNQUFNOzs7O1FBQUMsVUFBQSxLQUFLLElBQUksT0FBQSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsSUFBSSxtQkFBQSxFQUFFLEVBQU8sQ0FBQyxDQUFDLElBQUksRUFBMUMsQ0FBMEMsRUFBQyxDQUFDO2FBQ2pFLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQzthQUNiLFNBQVM7Ozs7UUFBQyxVQUFDLElBQVk7O2dCQUNoQixLQUFLLEdBQUcsS0FBSSxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDO1lBQ25ELEtBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxpQkFBaUIsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztRQUN6RSxDQUFDLEVBQUMsQ0FBQztJQUNQLENBQUM7O2dCQWhERixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLFVBQVU7b0JBQ3BCLFFBQVEsRUFBRSwwVEFNWDtvQkFDQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUM7aUJBQ2I7OztnQkFoQk8sV0FBVztnQkFDSCxLQUFLOzs7OEJBaUJsQixZQUFZLFNBQUMsV0FBVzs0QkFFeEIsS0FBSzs7SUFtQ1Isb0JBQUM7Q0FBQSxBQWpERCxJQWlEQztTQXRDWSxhQUFhOzs7SUFDeEIsb0NBQXlEOztJQUV6RCxrQ0FBOEI7O0lBRTlCLDhCQUFxQjs7SUFDckIseUNBQXNCOzs7OztJQUdwQixvQ0FBZ0M7Ozs7O0lBQ2hDLDhCQUE4QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7QWZ0ZXJWaWV3SW5pdCwgQ29tcG9uZW50LCBDb250ZW50Q2hpbGQsIElucHV0LCBPbkluaXQsIFRlbXBsYXRlUmVmfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtOb2RlSW50ZXJmYWNlfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzL25vZGUuaW50ZXJmYWNlJztcclxuaW1wb3J0IHtUcmVlTW9kZWx9IGZyb20gJy4uLy4uL21vZGVscy90cmVlLm1vZGVsJztcclxuaW1wb3J0IHtOb2RlU2VydmljZX0gZnJvbSAnLi4vLi4vc2VydmljZXMvbm9kZS5zZXJ2aWNlJztcclxuaW1wb3J0IHtzZWxlY3QsIFN0b3JlfSBmcm9tICdAbmdyeC9zdG9yZSc7XHJcbmltcG9ydCB7QXBwU3RvcmV9IGZyb20gJy4uLy4uL3JlZHVjZXJzL3JlZHVjZXIuZmFjdG9yeSc7XHJcbmltcG9ydCAqIGFzIEFDVElPTlMgZnJvbSAnLi4vLi4vcmVkdWNlcnMvYWN0aW9ucy5hY3Rpb24nO1xyXG5pbXBvcnQge2ZpcnN0fSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2FwcC10cmVlJyxcclxuICB0ZW1wbGF0ZTogYDxhcHAtbm9kZS1saXN0ZXIgW3Nob3dGaWxlc109XCJ0cmVlTW9kZWwuY29uZmlnLm9wdGlvbnMuc2hvd0ZpbGVzSW5zaWRlVHJlZVwiXHJcbiAgICAgICAgICAgICAgICAgW25vZGVzXT1cIntjaGlsZHJlbjogbm9kZXN9XCI+XHJcbiAgPG5nLXRlbXBsYXRlIGxldC1ub2Rlcz5cclxuICAgIDxuZy1jb250YWluZXIgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cInskaW1wbGljaXQ6IG5vZGVzfVwiIFtuZ1RlbXBsYXRlT3V0bGV0XT1cInRlbXBsYXRlUmVmXCI+PC9uZy1jb250YWluZXI+XHJcbiAgPC9uZy10ZW1wbGF0ZT5cclxuPC9hcHAtbm9kZS1saXN0ZXI+XHJcbmAsXHJcbiAgc3R5bGVzOiBbYGBdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBUcmVlQ29tcG9uZW50IGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgT25Jbml0IHtcclxuICBAQ29udGVudENoaWxkKFRlbXBsYXRlUmVmKSB0ZW1wbGF0ZVJlZjogVGVtcGxhdGVSZWY8YW55PjtcclxuXHJcbiAgQElucHV0KCkgdHJlZU1vZGVsOiBUcmVlTW9kZWw7XHJcblxyXG4gIG5vZGVzOiBOb2RlSW50ZXJmYWNlO1xyXG4gIGN1cnJlbnRUcmVlTGV2ZWwgPSAnJztcclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwcml2YXRlIG5vZGVTZXJ2aWNlOiBOb2RlU2VydmljZSxcclxuICAgIHByaXZhdGUgc3RvcmU6IFN0b3JlPEFwcFN0b3JlPlxyXG4gICkge1xyXG4gIH1cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgICB0aGlzLm5vZGVzID0gdGhpcy50cmVlTW9kZWwubm9kZXM7XHJcblxyXG4gICAgLy90b2RvIG1vdmUgdGhpcyBzdG9yZSB0byBwcm9wZXIgcGxhY2VcclxuICAgIHRoaXMuc3RvcmVcclxuICAgICAgLnBpcGUoc2VsZWN0KHN0YXRlID0+IChzdGF0ZS5maWxlTWFuYWdlclN0YXRlIHx8IHt9IGFzIGFueSkucGF0aCkpXHJcbiAgICAgIC5zdWJzY3JpYmUoKHBhdGg6IHN0cmluZykgPT4ge1xyXG4gICAgICAgIHRoaXMubm9kZVNlcnZpY2UuZ2V0Tm9kZXMocGF0aCk7XHJcblxyXG4gICAgICAgIHRoaXMuY3VycmVudFRyZWVMZXZlbCA9IHRoaXMudHJlZU1vZGVsLmN1cnJlbnRQYXRoO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy50cmVlTW9kZWwuY3VycmVudFBhdGggPSBwYXRoO1xyXG4gICAgICB9KTtcclxuICB9XHJcblxyXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcclxuICAgIHRoaXMuc3RvcmVcclxuICAgICAgLnBpcGUoc2VsZWN0KHN0YXRlID0+IChzdGF0ZS5maWxlTWFuYWdlclN0YXRlIHx8IHt9IGFzIGFueSkucGF0aCkpXHJcbiAgICAgIC5waXBlKGZpcnN0KCkpXHJcbiAgICAgIC5zdWJzY3JpYmUoKHBhdGg6IHN0cmluZykgPT4ge1xyXG4gICAgICAgIGNvbnN0IG5vZGVzID0gdGhpcy5ub2RlU2VydmljZS5maW5kTm9kZUJ5UGF0aChwYXRoKTtcclxuICAgICAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKHt0eXBlOiBBQ1RJT05TLlNFVF9TRUxFQ1RFRF9OT0RFLCBwYXlsb2FkOiBub2Rlc30pO1xyXG4gICAgICB9KTtcclxuICB9XHJcbn1cclxuIl19