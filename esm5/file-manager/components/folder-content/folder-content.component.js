/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { TreeModel } from '../../models/tree.model';
import { NodeService } from '../../services/node.service';
var FolderContentComponent = /** @class */ (function () {
    function FolderContentComponent(nodeService, store) {
        this.nodeService = nodeService;
        this.store = store;
        this.openUploadDialog = new EventEmitter();
        this.obj = Object;
    }
    /**
     * @return {?}
     */
    FolderContentComponent.prototype.ngOnInit = /**
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
         * @param {?} path
         * @return {?}
         */
        function (path) {
            _this.nodes = _this.nodeService.findNodeByPath(path);
        }));
    };
    /**
     * @return {?}
     */
    FolderContentComponent.prototype.newClickedAction = /**
     * @return {?}
     */
    function () {
        this.openUploadDialog.emit(true);
    };
    FolderContentComponent.decorators = [
        { type: Component, args: [{
                    selector: 'app-folder-content',
                    template: "<div class=\"item-holder\" *ngIf=\"nodes\">\n  <ng-container *ngIf=\"nodes.id !== 0\">\n    <app-node [node]=nodes id=\"{{nodes.pathToNode}}\">\n      <ng-container [ngTemplateOutletContext]=\"{$implicit: nodes}\"\n                    [ngTemplateOutlet]=\"folderContentBackTemplate\">\n      </ng-container>\n    </app-node>\n  </ng-container>\n\n  <ng-container *ngFor=\"let node of obj.keys(nodes.children)\">\n    <app-node [node]=\"nodes.children[node]\"\n              id=\"fc_{{nodes.children[node].pathToNode}}\">\n      <ng-container [ngTemplateOutletContext]=\"{$implicit: nodes.children[node]}\"\n                    [ngTemplateOutlet]=\"folderContentTemplate\">\n      </ng-container>\n    </app-node>\n  </ng-container>\n\n  <div class=\"new\" (click)=\"newClickedAction()\">\n    <ng-container [ngTemplateOutlet]=\"folderContentNewTemplate\"></ng-container>\n  </div>\n</div>\n",
                    styles: [".item-holder{box-sizing:border-box;display:-webkit-flex;display:flex;-webkit-flex-flow:wrap;flex-flow:wrap}.item-holder .new{display:inline}"]
                },] },
    ];
    FolderContentComponent.ctorParameters = function () { return [
        { type: NodeService },
        { type: Store }
    ]; };
    FolderContentComponent.propDecorators = {
        folderContentTemplate: [{ type: Input }],
        folderContentBackTemplate: [{ type: Input }],
        folderContentNewTemplate: [{ type: Input }],
        treeModel: [{ type: Input }],
        openUploadDialog: [{ type: Output }]
    };
    return FolderContentComponent;
}());
export { FolderContentComponent };
if (false) {
    /** @type {?} */
    FolderContentComponent.prototype.folderContentTemplate;
    /** @type {?} */
    FolderContentComponent.prototype.folderContentBackTemplate;
    /** @type {?} */
    FolderContentComponent.prototype.folderContentNewTemplate;
    /** @type {?} */
    FolderContentComponent.prototype.treeModel;
    /** @type {?} */
    FolderContentComponent.prototype.openUploadDialog;
    /** @type {?} */
    FolderContentComponent.prototype.nodes;
    /** @type {?} */
    FolderContentComponent.prototype.obj;
    /**
     * @type {?}
     * @private
     */
    FolderContentComponent.prototype.nodeService;
    /**
     * @type {?}
     * @private
     */
    FolderContentComponent.prototype.store;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9sZGVyLWNvbnRlbnQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmc2LWZpbGUtbWFuLyIsInNvdXJjZXMiOlsiZmlsZS1tYW5hZ2VyL2NvbXBvbmVudHMvZm9sZGVyLWNvbnRlbnQvZm9sZGVyLWNvbnRlbnQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUMsU0FBUyxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQVUsTUFBTSxFQUFFLFdBQVcsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUMxRixPQUFPLEVBQUMsTUFBTSxFQUFFLEtBQUssRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUMxQyxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0seUJBQXlCLENBQUM7QUFDbEQsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLDZCQUE2QixDQUFDO0FBSXhEO0lBdUNFLGdDQUNVLFdBQXdCLEVBQ3hCLEtBQXNCO1FBRHRCLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBQ3hCLFVBQUssR0FBTCxLQUFLLENBQWlCO1FBUHRCLHFCQUFnQixHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFHaEQsUUFBRyxHQUFHLE1BQU0sQ0FBQztJQU1iLENBQUM7Ozs7SUFFRCx5Q0FBUTs7O0lBQVI7UUFBQSxpQkFNQztRQUxDLElBQUksQ0FBQyxLQUFLO2FBQ1AsSUFBSSxDQUFDLE1BQU07Ozs7UUFBQyxVQUFBLEtBQUssSUFBSSxPQUFBLENBQUMsS0FBSyxDQUFDLGdCQUFnQixJQUFJLG1CQUFBLEVBQUUsRUFBTyxDQUFDLENBQUMsSUFBSSxFQUExQyxDQUEwQyxFQUFDLENBQUM7YUFDakUsU0FBUzs7OztRQUFDLFVBQUMsSUFBWTtZQUN0QixLQUFJLENBQUMsS0FBSyxHQUFHLEtBQUksQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3JELENBQUMsRUFBQyxDQUFDO0lBQ1AsQ0FBQzs7OztJQUVELGlEQUFnQjs7O0lBQWhCO1FBQ0UsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNuQyxDQUFDOztnQkF2REYsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxvQkFBb0I7b0JBQzlCLFFBQVEsRUFBRSw0M0JBc0JYO29CQUNDLE1BQU0sRUFBRSxDQUFDLDhJQUE4SSxDQUFDO2lCQUN6Sjs7O2dCQTlCTyxXQUFXO2dCQUZILEtBQUs7Ozt3Q0FrQ2xCLEtBQUs7NENBQ0wsS0FBSzsyQ0FDTCxLQUFLOzRCQUVMLEtBQUs7bUNBRUwsTUFBTTs7SUFzQlQsNkJBQUM7Q0FBQSxBQXhERCxJQXdEQztTQTdCWSxzQkFBc0I7OztJQUNqQyx1REFBaUQ7O0lBQ2pELDJEQUFxRDs7SUFDckQsMERBQW9EOztJQUVwRCwyQ0FBOEI7O0lBRTlCLGtEQUFnRDs7SUFFaEQsdUNBQXFCOztJQUNyQixxQ0FBYTs7Ozs7SUFHWCw2Q0FBZ0M7Ozs7O0lBQ2hDLHVDQUE4QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIElucHV0LCBPbkluaXQsIE91dHB1dCwgVGVtcGxhdGVSZWZ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge3NlbGVjdCwgU3RvcmV9IGZyb20gJ0BuZ3J4L3N0b3JlJztcclxuaW1wb3J0IHtUcmVlTW9kZWx9IGZyb20gJy4uLy4uL21vZGVscy90cmVlLm1vZGVsJztcclxuaW1wb3J0IHtOb2RlU2VydmljZX0gZnJvbSAnLi4vLi4vc2VydmljZXMvbm9kZS5zZXJ2aWNlJztcclxuaW1wb3J0IHtOb2RlSW50ZXJmYWNlfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzL25vZGUuaW50ZXJmYWNlJztcclxuaW1wb3J0IHtBcHBTdG9yZX0gZnJvbSAnLi4vLi4vcmVkdWNlcnMvcmVkdWNlci5mYWN0b3J5JztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnYXBwLWZvbGRlci1jb250ZW50JyxcclxuICB0ZW1wbGF0ZTogYDxkaXYgY2xhc3M9XCJpdGVtLWhvbGRlclwiICpuZ0lmPVwibm9kZXNcIj5cclxuICA8bmctY29udGFpbmVyICpuZ0lmPVwibm9kZXMuaWQgIT09IDBcIj5cclxuICAgIDxhcHAtbm9kZSBbbm9kZV09bm9kZXMgaWQ9XCJ7e25vZGVzLnBhdGhUb05vZGV9fVwiPlxyXG4gICAgICA8bmctY29udGFpbmVyIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7JGltcGxpY2l0OiBub2Rlc31cIlxyXG4gICAgICAgICAgICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImZvbGRlckNvbnRlbnRCYWNrVGVtcGxhdGVcIj5cclxuICAgICAgPC9uZy1jb250YWluZXI+XHJcbiAgICA8L2FwcC1ub2RlPlxyXG4gIDwvbmctY29udGFpbmVyPlxyXG5cclxuICA8bmctY29udGFpbmVyICpuZ0Zvcj1cImxldCBub2RlIG9mIG9iai5rZXlzKG5vZGVzLmNoaWxkcmVuKVwiPlxyXG4gICAgPGFwcC1ub2RlIFtub2RlXT1cIm5vZGVzLmNoaWxkcmVuW25vZGVdXCJcclxuICAgICAgICAgICAgICBpZD1cImZjX3t7bm9kZXMuY2hpbGRyZW5bbm9kZV0ucGF0aFRvTm9kZX19XCI+XHJcbiAgICAgIDxuZy1jb250YWluZXIgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cInskaW1wbGljaXQ6IG5vZGVzLmNoaWxkcmVuW25vZGVdfVwiXHJcbiAgICAgICAgICAgICAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRdPVwiZm9sZGVyQ29udGVudFRlbXBsYXRlXCI+XHJcbiAgICAgIDwvbmctY29udGFpbmVyPlxyXG4gICAgPC9hcHAtbm9kZT5cclxuICA8L25nLWNvbnRhaW5lcj5cclxuXHJcbiAgPGRpdiBjbGFzcz1cIm5ld1wiIChjbGljayk9XCJuZXdDbGlja2VkQWN0aW9uKClcIj5cclxuICAgIDxuZy1jb250YWluZXIgW25nVGVtcGxhdGVPdXRsZXRdPVwiZm9sZGVyQ29udGVudE5ld1RlbXBsYXRlXCI+PC9uZy1jb250YWluZXI+XHJcbiAgPC9kaXY+XHJcbjwvZGl2PlxyXG5gLFxyXG4gIHN0eWxlczogW2AuaXRlbS1ob2xkZXJ7Ym94LXNpemluZzpib3JkZXItYm94O2Rpc3BsYXk6LXdlYmtpdC1mbGV4O2Rpc3BsYXk6ZmxleDstd2Via2l0LWZsZXgtZmxvdzp3cmFwO2ZsZXgtZmxvdzp3cmFwfS5pdGVtLWhvbGRlciAubmV3e2Rpc3BsYXk6aW5saW5lfWBdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBGb2xkZXJDb250ZW50Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuICBASW5wdXQoKSBmb2xkZXJDb250ZW50VGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XHJcbiAgQElucHV0KCkgZm9sZGVyQ29udGVudEJhY2tUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcclxuICBASW5wdXQoKSBmb2xkZXJDb250ZW50TmV3VGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XHJcblxyXG4gIEBJbnB1dCgpIHRyZWVNb2RlbDogVHJlZU1vZGVsO1xyXG5cclxuICBAT3V0cHV0KCkgb3BlblVwbG9hZERpYWxvZyA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgbm9kZXM6IE5vZGVJbnRlcmZhY2U7XHJcbiAgb2JqID0gT2JqZWN0O1xyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHByaXZhdGUgbm9kZVNlcnZpY2U6IE5vZGVTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSBzdG9yZTogU3RvcmU8QXBwU3RvcmU+XHJcbiAgKSB7XHJcbiAgfVxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICAgIHRoaXMuc3RvcmVcclxuICAgICAgLnBpcGUoc2VsZWN0KHN0YXRlID0+IChzdGF0ZS5maWxlTWFuYWdlclN0YXRlIHx8IHt9IGFzIGFueSkucGF0aCkpXHJcbiAgICAgIC5zdWJzY3JpYmUoKHBhdGg6IHN0cmluZykgPT4ge1xyXG4gICAgICAgIHRoaXMubm9kZXMgPSB0aGlzLm5vZGVTZXJ2aWNlLmZpbmROb2RlQnlQYXRoKHBhdGgpO1xyXG4gICAgICB9KTtcclxuICB9XHJcblxyXG4gIG5ld0NsaWNrZWRBY3Rpb24oKSB7XHJcbiAgICB0aGlzLm9wZW5VcGxvYWREaWFsb2cuZW1pdCh0cnVlKTtcclxuICB9XHJcbn1cclxuIl19