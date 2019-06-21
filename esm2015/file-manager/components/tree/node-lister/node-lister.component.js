/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, ContentChild, Input, TemplateRef } from '@angular/core';
export class NodeListerComponent {
    constructor() {
        this.obj = Object;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
    }
}
NodeListerComponent.decorators = [
    { type: Component, args: [{
                selector: 'app-node-lister',
                template: `<ul class="node-lister-flist">
  <!--In order to avoid having to create that extra div, we can instead use ng-container directive-->
  <ng-container *ngFor="let node of obj.keys(nodes)">
    <li class="node-lister-list-item" *ngIf="nodes[node].isFolder || showFiles">

      <app-node class="node-lister-app-node" [node]="nodes[node]" id="tree_{{nodes[node].id === 0 ? 'root' : nodes[node].pathToNode}}">
        <ng-container [ngTemplateOutletContext]="{$implicit: (nodes[node])}"
                      [ngTemplateOutlet]="templateRef">
        </ng-container>
      </app-node>

      <app-node-lister class="node-lister" *ngIf="obj.keys(nodes[node].children).length > 0"
                       [showFiles]="showFiles" [nodes]="nodes[node].children">
        <ng-template let-nodes>
          <ng-container [ngTemplateOutletContext]="{$implicit: (nodes)}"
                        [ngTemplateOutlet]="templateRef">
          </ng-container>
        </ng-template>
      </app-node-lister>
    </li>
  </ng-container>
</ul>
`,
                styles: [`.node-lister-flist{margin:0 0 0 1em;padding:0;list-style:none;white-space:nowrap}.node-lister-list-item{list-style:none;line-height:1.2em;font-size:1em;display:inline}.node-lister-list-item .node-lister-app-node.deselected+.node-lister ul{display:none}`]
            },] },
];
NodeListerComponent.ctorParameters = () => [];
NodeListerComponent.propDecorators = {
    templateRef: [{ type: ContentChild, args: [TemplateRef,] }],
    nodes: [{ type: Input }],
    showFiles: [{ type: Input }]
};
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZS1saXN0ZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmc2LWZpbGUtbWFuLyIsInNvdXJjZXMiOlsiZmlsZS1tYW5hZ2VyL2NvbXBvbmVudHMvdHJlZS9ub2RlLWxpc3Rlci9ub2RlLWxpc3Rlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBQyxTQUFTLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBVSxXQUFXLEVBQUMsTUFBTSxlQUFlLENBQUM7QUE4QmxGLE1BQU07SUFPSjtRQUZBLFFBQUcsR0FBRyxNQUFNLENBQUM7SUFHYixDQUFDOzs7O0lBRUQsUUFBUTtJQUNSLENBQUM7OztZQXRDRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGlCQUFpQjtnQkFDM0IsUUFBUSxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0NBc0JYO2dCQUNDLE1BQU0sRUFBRSxDQUFDLDhQQUE4UCxDQUFDO2FBQ3pROzs7OzBCQUVFLFlBQVksU0FBQyxXQUFXO29CQUN4QixLQUFLO3dCQUNMLEtBQUs7Ozs7SUFGTiwwQ0FBeUQ7O0lBQ3pELG9DQUE4Qjs7SUFDOUIsd0NBQTRCOztJQUU1QixrQ0FBYSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q29tcG9uZW50LCBDb250ZW50Q2hpbGQsIElucHV0LCBPbkluaXQsIFRlbXBsYXRlUmVmfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtOb2RlSW50ZXJmYWNlfSBmcm9tICcuLi8uLi8uLi9pbnRlcmZhY2VzL25vZGUuaW50ZXJmYWNlJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnYXBwLW5vZGUtbGlzdGVyJyxcclxuICB0ZW1wbGF0ZTogYDx1bCBjbGFzcz1cIm5vZGUtbGlzdGVyLWZsaXN0XCI+XHJcbiAgPCEtLUluIG9yZGVyIHRvIGF2b2lkIGhhdmluZyB0byBjcmVhdGUgdGhhdCBleHRyYSBkaXYsIHdlIGNhbiBpbnN0ZWFkIHVzZSBuZy1jb250YWluZXIgZGlyZWN0aXZlLS0+XHJcbiAgPG5nLWNvbnRhaW5lciAqbmdGb3I9XCJsZXQgbm9kZSBvZiBvYmoua2V5cyhub2RlcylcIj5cclxuICAgIDxsaSBjbGFzcz1cIm5vZGUtbGlzdGVyLWxpc3QtaXRlbVwiICpuZ0lmPVwibm9kZXNbbm9kZV0uaXNGb2xkZXIgfHwgc2hvd0ZpbGVzXCI+XHJcblxyXG4gICAgICA8YXBwLW5vZGUgY2xhc3M9XCJub2RlLWxpc3Rlci1hcHAtbm9kZVwiIFtub2RlXT1cIm5vZGVzW25vZGVdXCIgaWQ9XCJ0cmVlX3t7bm9kZXNbbm9kZV0uaWQgPT09IDAgPyAncm9vdCcgOiBub2Rlc1tub2RlXS5wYXRoVG9Ob2RlfX1cIj5cclxuICAgICAgICA8bmctY29udGFpbmVyIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7JGltcGxpY2l0OiAobm9kZXNbbm9kZV0pfVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICBbbmdUZW1wbGF0ZU91dGxldF09XCJ0ZW1wbGF0ZVJlZlwiPlxyXG4gICAgICAgIDwvbmctY29udGFpbmVyPlxyXG4gICAgICA8L2FwcC1ub2RlPlxyXG5cclxuICAgICAgPGFwcC1ub2RlLWxpc3RlciBjbGFzcz1cIm5vZGUtbGlzdGVyXCIgKm5nSWY9XCJvYmoua2V5cyhub2Rlc1tub2RlXS5jaGlsZHJlbikubGVuZ3RoID4gMFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgW3Nob3dGaWxlc109XCJzaG93RmlsZXNcIiBbbm9kZXNdPVwibm9kZXNbbm9kZV0uY2hpbGRyZW5cIj5cclxuICAgICAgICA8bmctdGVtcGxhdGUgbGV0LW5vZGVzPlxyXG4gICAgICAgICAgPG5nLWNvbnRhaW5lciBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwieyRpbXBsaWNpdDogKG5vZGVzKX1cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBbbmdUZW1wbGF0ZU91dGxldF09XCJ0ZW1wbGF0ZVJlZlwiPlxyXG4gICAgICAgICAgPC9uZy1jb250YWluZXI+XHJcbiAgICAgICAgPC9uZy10ZW1wbGF0ZT5cclxuICAgICAgPC9hcHAtbm9kZS1saXN0ZXI+XHJcbiAgICA8L2xpPlxyXG4gIDwvbmctY29udGFpbmVyPlxyXG48L3VsPlxyXG5gLFxyXG4gIHN0eWxlczogW2Aubm9kZS1saXN0ZXItZmxpc3R7bWFyZ2luOjAgMCAwIDFlbTtwYWRkaW5nOjA7bGlzdC1zdHlsZTpub25lO3doaXRlLXNwYWNlOm5vd3JhcH0ubm9kZS1saXN0ZXItbGlzdC1pdGVte2xpc3Qtc3R5bGU6bm9uZTtsaW5lLWhlaWdodDoxLjJlbTtmb250LXNpemU6MWVtO2Rpc3BsYXk6aW5saW5lfS5ub2RlLWxpc3Rlci1saXN0LWl0ZW0gLm5vZGUtbGlzdGVyLWFwcC1ub2RlLmRlc2VsZWN0ZWQrLm5vZGUtbGlzdGVyIHVse2Rpc3BsYXk6bm9uZX1gXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgTm9kZUxpc3RlckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcbiAgQENvbnRlbnRDaGlsZChUZW1wbGF0ZVJlZikgdGVtcGxhdGVSZWY6IFRlbXBsYXRlUmVmPGFueT47XHJcbiAgQElucHV0KCkgbm9kZXM6IE5vZGVJbnRlcmZhY2U7XHJcbiAgQElucHV0KCkgc2hvd0ZpbGVzOiBib29sZWFuO1xyXG5cclxuICBvYmogPSBPYmplY3Q7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gIH1cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgfVxyXG59XHJcbiJdfQ==