/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { TreeModel } from '../../models/tree.model';
import { NodeService } from '../../services/node.service';
export class FolderContentComponent {
    /**
     * @param {?} nodeService
     * @param {?} store
     */
    constructor(nodeService, store) {
        this.nodeService = nodeService;
        this.store = store;
        this.openUploadDialog = new EventEmitter();
        this.obj = Object;
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
        state => state.fileManagerState.path)))
            .subscribe((/**
         * @param {?} path
         * @return {?}
         */
        (path) => {
            this.nodes = this.nodeService.findNodeByPath(path);
        }));
    }
    /**
     * @return {?}
     */
    newClickedAction() {
        this.openUploadDialog.emit(true);
    }
}
FolderContentComponent.decorators = [
    { type: Component, args: [{
                selector: 'app-folder-content',
                template: `<div class="item-holder" *ngIf="nodes">
  <ng-container *ngIf="nodes.id !== 0">
    <app-node [node]=nodes id="{{nodes.pathToNode}}">
      <ng-container [ngTemplateOutletContext]="{$implicit: nodes}"
                    [ngTemplateOutlet]="folderContentBackTemplate">
      </ng-container>
    </app-node>
  </ng-container>

  <ng-container *ngFor="let node of obj.keys(nodes.children)">
    <app-node [node]="nodes.children[node]"
              id="fc_{{nodes.children[node].pathToNode}}">
      <ng-container [ngTemplateOutletContext]="{$implicit: nodes.children[node]}"
                    [ngTemplateOutlet]="folderContentTemplate">
      </ng-container>
    </app-node>
  </ng-container>

  <div class="new" (click)="newClickedAction()">
    <ng-container [ngTemplateOutlet]="folderContentNewTemplate"></ng-container>
  </div>
</div>
`,
                styles: [`.item-holder{box-sizing:border-box;display:-webkit-flex;display:flex;-webkit-flex-flow:wrap;flex-flow:wrap}.item-holder .new{display:inline}`]
            },] },
];
FolderContentComponent.ctorParameters = () => [
    { type: NodeService },
    { type: Store }
];
FolderContentComponent.propDecorators = {
    folderContentTemplate: [{ type: Input }],
    folderContentBackTemplate: [{ type: Input }],
    folderContentNewTemplate: [{ type: Input }],
    treeModel: [{ type: Input }],
    openUploadDialog: [{ type: Output }]
};
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9sZGVyLWNvbnRlbnQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmc2LWZpbGUtbWFuLyIsInNvdXJjZXMiOlsiZmlsZS1tYW5hZ2VyL2NvbXBvbmVudHMvZm9sZGVyLWNvbnRlbnQvZm9sZGVyLWNvbnRlbnQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUMsU0FBUyxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQVUsTUFBTSxFQUFFLFdBQVcsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUMxRixPQUFPLEVBQUMsTUFBTSxFQUFFLEtBQUssRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUMxQyxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0seUJBQXlCLENBQUM7QUFDbEQsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLDZCQUE2QixDQUFDO0FBK0J4RCxNQUFNOzs7OztJQVlKLFlBQ1UsV0FBd0IsRUFDeEIsS0FBc0I7UUFEdEIsZ0JBQVcsR0FBWCxXQUFXLENBQWE7UUFDeEIsVUFBSyxHQUFMLEtBQUssQ0FBaUI7UUFQdEIscUJBQWdCLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUdoRCxRQUFHLEdBQUcsTUFBTSxDQUFDO0lBTWIsQ0FBQzs7OztJQUVELFFBQVE7UUFDTixJQUFJLENBQUMsS0FBSzthQUNQLElBQUksQ0FBQyxNQUFNOzs7O1FBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFDLENBQUM7YUFDbEQsU0FBUzs7OztRQUFDLENBQUMsSUFBWSxFQUFFLEVBQUU7WUFDMUIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNyRCxDQUFDLEVBQUMsQ0FBQztJQUNQLENBQUM7Ozs7SUFFRCxnQkFBZ0I7UUFDZCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ25DLENBQUM7OztZQXZERixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLG9CQUFvQjtnQkFDOUIsUUFBUSxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0NBc0JYO2dCQUNDLE1BQU0sRUFBRSxDQUFDLDhJQUE4SSxDQUFDO2FBQ3pKOzs7WUE5Qk8sV0FBVztZQUZILEtBQUs7OztvQ0FrQ2xCLEtBQUs7d0NBQ0wsS0FBSzt1Q0FDTCxLQUFLO3dCQUVMLEtBQUs7K0JBRUwsTUFBTTs7OztJQU5QLHVEQUFpRDs7SUFDakQsMkRBQXFEOztJQUNyRCwwREFBb0Q7O0lBRXBELDJDQUE4Qjs7SUFFOUIsa0RBQWdEOztJQUVoRCx1Q0FBcUI7O0lBQ3JCLHFDQUFhOzs7OztJQUdYLDZDQUFnQzs7Ozs7SUFDaEMsdUNBQThCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDb21wb25lbnQsIEV2ZW50RW1pdHRlciwgSW5wdXQsIE9uSW5pdCwgT3V0cHV0LCBUZW1wbGF0ZVJlZn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7c2VsZWN0LCBTdG9yZX0gZnJvbSAnQG5ncngvc3RvcmUnO1xyXG5pbXBvcnQge1RyZWVNb2RlbH0gZnJvbSAnLi4vLi4vbW9kZWxzL3RyZWUubW9kZWwnO1xyXG5pbXBvcnQge05vZGVTZXJ2aWNlfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9ub2RlLnNlcnZpY2UnO1xyXG5pbXBvcnQge05vZGVJbnRlcmZhY2V9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMvbm9kZS5pbnRlcmZhY2UnO1xyXG5pbXBvcnQge0FwcFN0b3JlfSBmcm9tICcuLi8uLi9yZWR1Y2Vycy9yZWR1Y2VyLmZhY3RvcnknO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdhcHAtZm9sZGVyLWNvbnRlbnQnLFxyXG4gIHRlbXBsYXRlOiBgPGRpdiBjbGFzcz1cIml0ZW0taG9sZGVyXCIgKm5nSWY9XCJub2Rlc1wiPlxyXG4gIDxuZy1jb250YWluZXIgKm5nSWY9XCJub2Rlcy5pZCAhPT0gMFwiPlxyXG4gICAgPGFwcC1ub2RlIFtub2RlXT1ub2RlcyBpZD1cInt7bm9kZXMucGF0aFRvTm9kZX19XCI+XHJcbiAgICAgIDxuZy1jb250YWluZXIgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cInskaW1wbGljaXQ6IG5vZGVzfVwiXHJcbiAgICAgICAgICAgICAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRdPVwiZm9sZGVyQ29udGVudEJhY2tUZW1wbGF0ZVwiPlxyXG4gICAgICA8L25nLWNvbnRhaW5lcj5cclxuICAgIDwvYXBwLW5vZGU+XHJcbiAgPC9uZy1jb250YWluZXI+XHJcblxyXG4gIDxuZy1jb250YWluZXIgKm5nRm9yPVwibGV0IG5vZGUgb2Ygb2JqLmtleXMobm9kZXMuY2hpbGRyZW4pXCI+XHJcbiAgICA8YXBwLW5vZGUgW25vZGVdPVwibm9kZXMuY2hpbGRyZW5bbm9kZV1cIlxyXG4gICAgICAgICAgICAgIGlkPVwiZmNfe3tub2Rlcy5jaGlsZHJlbltub2RlXS5wYXRoVG9Ob2RlfX1cIj5cclxuICAgICAgPG5nLWNvbnRhaW5lciBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwieyRpbXBsaWNpdDogbm9kZXMuY2hpbGRyZW5bbm9kZV19XCJcclxuICAgICAgICAgICAgICAgICAgICBbbmdUZW1wbGF0ZU91dGxldF09XCJmb2xkZXJDb250ZW50VGVtcGxhdGVcIj5cclxuICAgICAgPC9uZy1jb250YWluZXI+XHJcbiAgICA8L2FwcC1ub2RlPlxyXG4gIDwvbmctY29udGFpbmVyPlxyXG5cclxuICA8ZGl2IGNsYXNzPVwibmV3XCIgKGNsaWNrKT1cIm5ld0NsaWNrZWRBY3Rpb24oKVwiPlxyXG4gICAgPG5nLWNvbnRhaW5lciBbbmdUZW1wbGF0ZU91dGxldF09XCJmb2xkZXJDb250ZW50TmV3VGVtcGxhdGVcIj48L25nLWNvbnRhaW5lcj5cclxuICA8L2Rpdj5cclxuPC9kaXY+XHJcbmAsXHJcbiAgc3R5bGVzOiBbYC5pdGVtLWhvbGRlcntib3gtc2l6aW5nOmJvcmRlci1ib3g7ZGlzcGxheTotd2Via2l0LWZsZXg7ZGlzcGxheTpmbGV4Oy13ZWJraXQtZmxleC1mbG93OndyYXA7ZmxleC1mbG93OndyYXB9Lml0ZW0taG9sZGVyIC5uZXd7ZGlzcGxheTppbmxpbmV9YF1cclxufSlcclxuZXhwb3J0IGNsYXNzIEZvbGRlckNvbnRlbnRDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG4gIEBJbnB1dCgpIGZvbGRlckNvbnRlbnRUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcclxuICBASW5wdXQoKSBmb2xkZXJDb250ZW50QmFja1RlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xyXG4gIEBJbnB1dCgpIGZvbGRlckNvbnRlbnROZXdUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcclxuXHJcbiAgQElucHV0KCkgdHJlZU1vZGVsOiBUcmVlTW9kZWw7XHJcblxyXG4gIEBPdXRwdXQoKSBvcGVuVXBsb2FkRGlhbG9nID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICBub2RlczogTm9kZUludGVyZmFjZTtcclxuICBvYmogPSBPYmplY3Q7XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcHJpdmF0ZSBub2RlU2VydmljZTogTm9kZVNlcnZpY2UsXHJcbiAgICBwcml2YXRlIHN0b3JlOiBTdG9yZTxBcHBTdG9yZT5cclxuICApIHtcclxuICB9XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gICAgdGhpcy5zdG9yZVxyXG4gICAgICAucGlwZShzZWxlY3Qoc3RhdGUgPT4gc3RhdGUuZmlsZU1hbmFnZXJTdGF0ZS5wYXRoKSlcclxuICAgICAgLnN1YnNjcmliZSgocGF0aDogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgdGhpcy5ub2RlcyA9IHRoaXMubm9kZVNlcnZpY2UuZmluZE5vZGVCeVBhdGgocGF0aCk7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgbmV3Q2xpY2tlZEFjdGlvbigpIHtcclxuICAgIHRoaXMub3BlblVwbG9hZERpYWxvZy5lbWl0KHRydWUpO1xyXG4gIH1cclxufVxyXG4iXX0=