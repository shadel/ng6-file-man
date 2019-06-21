/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import * as ACTIONS from '../../../reducers/actions.action';
import { NodeService } from '../../../services/node.service';
import { NodeClickedService } from '../../../services/node-clicked.service';
export class NodeComponent {
    /**
     * @param {?} store
     * @param {?} nodeService
     * @param {?} nodeClickedService
     */
    constructor(store, nodeService, nodeClickedService) {
        this.store = store;
        this.nodeService = nodeService;
        this.nodeClickedService = nodeClickedService;
        this.isSingleClick = true;
    }
    /**
     * @param {?} event
     * @return {?}
     */
    method1CallForClick(event) {
        event.preventDefault();
        this.isSingleClick = true;
        setTimeout((/**
         * @return {?}
         */
        () => {
            if (this.isSingleClick) {
                this.showMenu();
            }
        }), 200);
    }
    // todo event.preventDefault for double click
    /**
     * @param {?} event
     * @return {?}
     */
    method2CallForDblClick(event) {
        event.preventDefault();
        this.isSingleClick = false;
        this.open();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
    }
    /**
     * @private
     * @return {?}
     */
    open() {
        if (!this.node.isFolder) {
            this.nodeClickedService.startDownload(this.node);
            return;
        }
        if (this.node.stayOpen) {
            if (this.node.name == 'root') {
                this.nodeService.foldAll();
            }
            this.store.dispatch({ type: ACTIONS.SET_PATH, payload: this.node.pathToNode });
            return;
        }
        this.toggleNodeExpanded();
        if (this.node.isExpanded) {
            this.store.dispatch({ type: ACTIONS.SET_PATH, payload: this.node.pathToNode });
        }
        this.setNodeSelectedState();
    }
    /**
     * @private
     * @return {?}
     */
    showMenu() {
        this.store.dispatch({ type: ACTIONS.SET_SELECTED_NODE, payload: this.node });
    }
    /**
     * @private
     * @return {?}
     */
    toggleNodeExpanded() {
        this.node.isExpanded = !this.node.isExpanded;
    }
    /**
     * @private
     * @return {?}
     */
    setNodeSelectedState() {
        if (!this.node.isExpanded) {
            document.getElementById('tree_' + this.node.pathToNode).classList.add('deselected');
            this.nodeService.foldRecursively(this.node);
            this.store.dispatch({ type: ACTIONS.SET_PATH, payload: this.node.pathToParent });
        }
        else {
            document.getElementById('tree_' + this.node.pathToNode).classList.remove('deselected');
        }
    }
}
NodeComponent.decorators = [
    { type: Component, args: [{
                selector: 'app-node',
                template: `<div #customTemplate (dblclick)="method2CallForDblClick($event)" (click)="method1CallForClick($event)">
  <ng-content></ng-content>
</div>
`,
                styles: [``]
            },] },
];
NodeComponent.ctorParameters = () => [
    { type: Store },
    { type: NodeService },
    { type: NodeClickedService }
];
NodeComponent.propDecorators = {
    node: [{ type: Input }]
};
if (false) {
    /** @type {?} */
    NodeComponent.prototype.node;
    /** @type {?} */
    NodeComponent.prototype.isSingleClick;
    /**
     * @type {?}
     * @private
     */
    NodeComponent.prototype.store;
    /**
     * @type {?}
     * @private
     */
    NodeComponent.prototype.nodeService;
    /**
     * @type {?}
     * @private
     */
    NodeComponent.prototype.nodeClickedService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZzYtZmlsZS1tYW4vIiwic291cmNlcyI6WyJmaWxlLW1hbmFnZXIvY29tcG9uZW50cy9mdW5jdGlvbnMvbm9kZS9ub2RlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFDLFNBQVMsRUFBRSxLQUFLLEVBQVMsTUFBTSxlQUFlLENBQUM7QUFFdkQsT0FBTyxFQUFDLEtBQUssRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUVsQyxPQUFPLEtBQUssT0FBTyxNQUFNLGtDQUFrQyxDQUFDO0FBRTVELE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxnQ0FBZ0MsQ0FBQztBQUMzRCxPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSx3Q0FBd0MsQ0FBQztBQVUxRSxNQUFNOzs7Ozs7SUFJSixZQUNVLEtBQXNCLEVBQ3RCLFdBQXdCLEVBQ3hCLGtCQUFzQztRQUZ0QyxVQUFLLEdBQUwsS0FBSyxDQUFpQjtRQUN0QixnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUN4Qix1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW9CO1FBTGhELGtCQUFhLEdBQUcsSUFBSSxDQUFDO0lBT3JCLENBQUM7Ozs7O0lBRU0sbUJBQW1CLENBQUMsS0FBaUI7UUFDMUMsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBRXZCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO1FBQzFCLFVBQVU7OztRQUFDLEdBQUcsRUFBRTtZQUNkLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO2dCQUN2QixJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDbEIsQ0FBQztRQUNILENBQUMsR0FBRSxHQUFHLENBQUMsQ0FBQztJQUNWLENBQUM7Ozs7OztJQUdNLHNCQUFzQixDQUFDLEtBQVU7UUFDdEMsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBRXZCLElBQUksQ0FBQyxh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QThCOzs7OztJQUM5QixvQ0FBZ0M7Ozs7O0lBQ2hDLDJDQUE4QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q29tcG9uZW50LCBJbnB1dCwgT25Jbml0fSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtOb2RlSW50ZXJmYWNlfSBmcm9tICcuLi8uLi8uLi9pbnRlcmZhY2VzL25vZGUuaW50ZXJmYWNlJztcclxuaW1wb3J0IHtTdG9yZX0gZnJvbSAnQG5ncngvc3RvcmUnO1xyXG5cclxuaW1wb3J0ICogYXMgQUNUSU9OUyBmcm9tICcuLi8uLi8uLi9yZWR1Y2Vycy9hY3Rpb25zLmFjdGlvbic7XHJcbmltcG9ydCB7QXBwU3RvcmV9IGZyb20gJy4uLy4uLy4uL3JlZHVjZXJzL3JlZHVjZXIuZmFjdG9yeSc7XHJcbmltcG9ydCB7Tm9kZVNlcnZpY2V9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL25vZGUuc2VydmljZSc7XHJcbmltcG9ydCB7Tm9kZUNsaWNrZWRTZXJ2aWNlfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9ub2RlLWNsaWNrZWQuc2VydmljZSc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2FwcC1ub2RlJyxcclxuICB0ZW1wbGF0ZTogYDxkaXYgI2N1c3RvbVRlbXBsYXRlIChkYmxjbGljayk9XCJtZXRob2QyQ2FsbEZvckRibENsaWNrKCRldmVudClcIiAoY2xpY2spPVwibWV0aG9kMUNhbGxGb3JDbGljaygkZXZlbnQpXCI+XHJcbiAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxyXG48L2Rpdj5cclxuYCxcclxuICBzdHlsZXM6IFtgYF1cclxufSlcclxuZXhwb3J0IGNsYXNzIE5vZGVDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG4gIEBJbnB1dCgpIG5vZGU6IE5vZGVJbnRlcmZhY2U7XHJcbiAgaXNTaW5nbGVDbGljayA9IHRydWU7XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcHJpdmF0ZSBzdG9yZTogU3RvcmU8QXBwU3RvcmU+LFxyXG4gICAgcHJpdmF0ZSBub2RlU2VydmljZTogTm9kZVNlcnZpY2UsXHJcbiAgICBwcml2YXRlIG5vZGVDbGlja2VkU2VydmljZTogTm9kZUNsaWNrZWRTZXJ2aWNlXHJcbiAgKSB7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgbWV0aG9kMUNhbGxGb3JDbGljayhldmVudDogTW91c2VFdmVudCkge1xyXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICB0aGlzLmlzU2luZ2xlQ2xpY2sgPSB0cnVlO1xyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgIGlmICh0aGlzLmlzU2luZ2xlQ2xpY2spIHtcclxuICAgICAgICB0aGlzLnNob3dNZW51KCk7XHJcbiAgICAgIH1cclxuICAgIH0sIDIwMCk7XHJcbiAgfVxyXG5cclxuICAvLyB0b2RvIGV2ZW50LnByZXZlbnREZWZhdWx0IGZvciBkb3VibGUgY2xpY2tcclxuICBwdWJsaWMgbWV0aG9kMkNhbGxGb3JEYmxDbGljayhldmVudDogYW55KSB7XHJcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgIHRoaXMuaXNTaW5nbGVDbGljayA9IGZhbHNlO1xyXG4gICAgdGhpcy5vcGVuKCk7XHJcbiAgfVxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgb3BlbigpIHtcclxuICAgIGlmICghdGhpcy5ub2RlLmlzRm9sZGVyKSB7XHJcbiAgICAgIHRoaXMubm9kZUNsaWNrZWRTZXJ2aWNlLnN0YXJ0RG93bmxvYWQodGhpcy5ub2RlKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLm5vZGUuc3RheU9wZW4pIHtcclxuICAgICAgaWYgKHRoaXMubm9kZS5uYW1lID09ICdyb290Jykge1xyXG4gICAgICAgIHRoaXMubm9kZVNlcnZpY2UuZm9sZEFsbCgpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKHt0eXBlOiBBQ1RJT05TLlNFVF9QQVRILCBwYXlsb2FkOiB0aGlzLm5vZGUucGF0aFRvTm9kZX0pO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy50b2dnbGVOb2RlRXhwYW5kZWQoKTtcclxuXHJcbiAgICBpZiAodGhpcy5ub2RlLmlzRXhwYW5kZWQpIHtcclxuICAgICAgdGhpcy5zdG9yZS5kaXNwYXRjaCh7dHlwZTogQUNUSU9OUy5TRVRfUEFUSCwgcGF5bG9hZDogdGhpcy5ub2RlLnBhdGhUb05vZGV9KTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnNldE5vZGVTZWxlY3RlZFN0YXRlKCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHNob3dNZW51KCkge1xyXG4gICAgdGhpcy5zdG9yZS5kaXNwYXRjaCh7dHlwZTogQUNUSU9OUy5TRVRfU0VMRUNURURfTk9ERSwgcGF5bG9hZDogdGhpcy5ub2RlfSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHRvZ2dsZU5vZGVFeHBhbmRlZCgpIHtcclxuICAgIHRoaXMubm9kZS5pc0V4cGFuZGVkID0gIXRoaXMubm9kZS5pc0V4cGFuZGVkO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBzZXROb2RlU2VsZWN0ZWRTdGF0ZSgpIHtcclxuICAgIGlmICghdGhpcy5ub2RlLmlzRXhwYW5kZWQpIHtcclxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RyZWVfJyArIHRoaXMubm9kZS5wYXRoVG9Ob2RlKS5jbGFzc0xpc3QuYWRkKCdkZXNlbGVjdGVkJyk7XHJcblxyXG4gICAgICB0aGlzLm5vZGVTZXJ2aWNlLmZvbGRSZWN1cnNpdmVseSh0aGlzLm5vZGUpO1xyXG5cclxuICAgICAgdGhpcy5zdG9yZS5kaXNwYXRjaCh7dHlwZTogQUNUSU9OUy5TRVRfUEFUSCwgcGF5bG9hZDogdGhpcy5ub2RlLnBhdGhUb1BhcmVudH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RyZWVfJyArIHRoaXMubm9kZS5wYXRoVG9Ob2RlKS5jbGFzc0xpc3QucmVtb3ZlKCdkZXNlbGVjdGVkJyk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiJdfQ==