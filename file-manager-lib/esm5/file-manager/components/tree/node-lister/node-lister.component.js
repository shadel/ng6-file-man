/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, ContentChild, Input, TemplateRef } from '@angular/core';
var NodeListerComponent = /** @class */ (function () {
    function NodeListerComponent() {
        this.obj = Object;
    }
    /**
     * @return {?}
     */
    NodeListerComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
    };
    NodeListerComponent.decorators = [
        { type: Component, args: [{
                    selector: 'app-node-lister',
                    template: "<ul class=\"node-lister-flist\">\n  <!--In order to avoid having to create that extra div, we can instead use ng-container directive-->\n  <ng-container *ngFor=\"let node of obj.keys(nodes)\">\n    <li class=\"node-lister-list-item\" *ngIf=\"nodes[node].isFolder || showFiles\">\n\n      <app-node class=\"node-lister-app-node\" [node]=\"nodes[node]\" id=\"tree_{{nodes[node].id === 0 ? 'root' : nodes[node].pathToNode}}\">\n        <ng-container [ngTemplateOutletContext]=\"{$implicit: (nodes[node])}\"\n                      [ngTemplateOutlet]=\"templateRef\">\n        </ng-container>\n      </app-node>\n\n      <app-node-lister class=\"node-lister\" *ngIf=\"obj.keys(nodes[node].children).length > 0\"\n                       [showFiles]=\"showFiles\" [nodes]=\"nodes[node].children\">\n        <ng-template let-nodes>\n          <ng-container [ngTemplateOutletContext]=\"{$implicit: (nodes)}\"\n                        [ngTemplateOutlet]=\"templateRef\">\n          </ng-container>\n        </ng-template>\n      </app-node-lister>\n    </li>\n  </ng-container>\n</ul>\n",
                    styles: [".node-lister-flist{margin:0 0 0 1em;padding:0;list-style:none;white-space:nowrap}.node-lister-list-item{list-style:none;line-height:1.2em;font-size:1em;display:inline}.node-lister-list-item .node-lister-app-node.deselected+.node-lister ul{display:none}"]
                },] },
    ];
    NodeListerComponent.ctorParameters = function () { return []; };
    NodeListerComponent.propDecorators = {
        templateRef: [{ type: ContentChild, args: [TemplateRef,] }],
        nodes: [{ type: Input }],
        showFiles: [{ type: Input }]
    };
    return NodeListerComponent;
}());
export { NodeListerComponent };
if (false) {
    /** @type {?} */
    NodeListerComponent.prototype.templateRef;
    /** @type {?} */
    NodeListerComponent.prototype.nodes;
    /** @type {?} */
    NodeListerComponent.prototype.showFiles;
    /** @type {?} */
    NodeListerComponent.prototype.obj;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZS1saXN0ZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmc2LWZpbGUtbWFuLyIsInNvdXJjZXMiOlsiZmlsZS1tYW5hZ2VyL2NvbXBvbmVudHMvdHJlZS9ub2RlLWxpc3Rlci9ub2RlLWxpc3Rlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBQyxTQUFTLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBVSxXQUFXLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFHbEY7SUFrQ0U7UUFGQSxRQUFHLEdBQUcsTUFBTSxDQUFDO0lBR2IsQ0FBQzs7OztJQUVELHNDQUFROzs7SUFBUjtJQUNBLENBQUM7O2dCQXRDRixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLGlCQUFpQjtvQkFDM0IsUUFBUSxFQUFFLHNqQ0FzQlg7b0JBQ0MsTUFBTSxFQUFFLENBQUMsOFBBQThQLENBQUM7aUJBQ3pROzs7OzhCQUVFLFlBQVksU0FBQyxXQUFXO3dCQUN4QixLQUFLOzRCQUNMLEtBQUs7O0lBU1IsMEJBQUM7Q0FBQSxBQXZDRCxJQXVDQztTQVpZLG1CQUFtQjs7O0lBQzlCLDBDQUF5RDs7SUFDekQsb0NBQThCOztJQUM5Qix3Q0FBNEI7O0lBRTVCLGtDQUFhIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDb21wb25lbnQsIENvbnRlbnRDaGlsZCwgSW5wdXQsIE9uSW5pdCwgVGVtcGxhdGVSZWZ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge05vZGVJbnRlcmZhY2V9IGZyb20gJy4uLy4uLy4uL2ludGVyZmFjZXMvbm9kZS5pbnRlcmZhY2UnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdhcHAtbm9kZS1saXN0ZXInLFxyXG4gIHRlbXBsYXRlOiBgPHVsIGNsYXNzPVwibm9kZS1saXN0ZXItZmxpc3RcIj5cclxuICA8IS0tSW4gb3JkZXIgdG8gYXZvaWQgaGF2aW5nIHRvIGNyZWF0ZSB0aGF0IGV4dHJhIGRpdiwgd2UgY2FuIGluc3RlYWQgdXNlIG5nLWNvbnRhaW5lciBkaXJlY3RpdmUtLT5cclxuICA8bmctY29udGFpbmVyICpuZ0Zvcj1cImxldCBub2RlIG9mIG9iai5rZXlzKG5vZGVzKVwiPlxyXG4gICAgPGxpIGNsYXNzPVwibm9kZS1saXN0ZXItbGlzdC1pdGVtXCIgKm5nSWY9XCJub2Rlc1tub2RlXS5pc0ZvbGRlciB8fCBzaG93RmlsZXNcIj5cclxuXHJcbiAgICAgIDxhcHAtbm9kZSBjbGFzcz1cIm5vZGUtbGlzdGVyLWFwcC1ub2RlXCIgW25vZGVdPVwibm9kZXNbbm9kZV1cIiBpZD1cInRyZWVfe3tub2Rlc1tub2RlXS5pZCA9PT0gMCA/ICdyb290JyA6IG5vZGVzW25vZGVdLnBhdGhUb05vZGV9fVwiPlxyXG4gICAgICAgIDxuZy1jb250YWluZXIgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cInskaW1wbGljaXQ6IChub2Rlc1tub2RlXSl9XCJcclxuICAgICAgICAgICAgICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0XT1cInRlbXBsYXRlUmVmXCI+XHJcbiAgICAgICAgPC9uZy1jb250YWluZXI+XHJcbiAgICAgIDwvYXBwLW5vZGU+XHJcblxyXG4gICAgICA8YXBwLW5vZGUtbGlzdGVyIGNsYXNzPVwibm9kZS1saXN0ZXJcIiAqbmdJZj1cIm9iai5rZXlzKG5vZGVzW25vZGVdLmNoaWxkcmVuKS5sZW5ndGggPiAwXCJcclxuICAgICAgICAgICAgICAgICAgICAgICBbc2hvd0ZpbGVzXT1cInNob3dGaWxlc1wiIFtub2Rlc109XCJub2Rlc1tub2RlXS5jaGlsZHJlblwiPlxyXG4gICAgICAgIDxuZy10ZW1wbGF0ZSBsZXQtbm9kZXM+XHJcbiAgICAgICAgICA8bmctY29udGFpbmVyIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7JGltcGxpY2l0OiAobm9kZXMpfVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0XT1cInRlbXBsYXRlUmVmXCI+XHJcbiAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cclxuICAgICAgICA8L25nLXRlbXBsYXRlPlxyXG4gICAgICA8L2FwcC1ub2RlLWxpc3Rlcj5cclxuICAgIDwvbGk+XHJcbiAgPC9uZy1jb250YWluZXI+XHJcbjwvdWw+XHJcbmAsXHJcbiAgc3R5bGVzOiBbYC5ub2RlLWxpc3Rlci1mbGlzdHttYXJnaW46MCAwIDAgMWVtO3BhZGRpbmc6MDtsaXN0LXN0eWxlOm5vbmU7d2hpdGUtc3BhY2U6bm93cmFwfS5ub2RlLWxpc3Rlci1saXN0LWl0ZW17bGlzdC1zdHlsZTpub25lO2xpbmUtaGVpZ2h0OjEuMmVtO2ZvbnQtc2l6ZToxZW07ZGlzcGxheTppbmxpbmV9Lm5vZGUtbGlzdGVyLWxpc3QtaXRlbSAubm9kZS1saXN0ZXItYXBwLW5vZGUuZGVzZWxlY3RlZCsubm9kZS1saXN0ZXIgdWx7ZGlzcGxheTpub25lfWBdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBOb2RlTGlzdGVyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuICBAQ29udGVudENoaWxkKFRlbXBsYXRlUmVmKSB0ZW1wbGF0ZVJlZjogVGVtcGxhdGVSZWY8YW55PjtcclxuICBASW5wdXQoKSBub2RlczogTm9kZUludGVyZmFjZTtcclxuICBASW5wdXQoKSBzaG93RmlsZXM6IGJvb2xlYW47XHJcblxyXG4gIG9iaiA9IE9iamVjdDtcclxuXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgfVxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICB9XHJcbn1cclxuIl19