/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
// import {ModuleWithProviders, NgModule} from '@angular/core';
import { NgModule, InjectionToken } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileManagerComponent } from './file-manager.component';
import { FolderContentComponent } from './components/folder-content/folder-content.component';
import { TreeComponent } from './components/tree/tree.component';
import { NodeListerComponent } from './components/tree/node-lister/node-lister.component';
import { NodeComponent } from './components/functions/node/node.component';
import { MapToIterablePipe } from './pipes/map-to-iterable.pipe';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { reducers } from './reducers/reducer.factory';
import { LoadingOverlayComponent } from './components/functions/loading-overlay/loading-overlay.component';
import { FileSizePipe } from './pipes/file-size.pipe';
import { UploadComponent } from './components/functions/upload/upload.component';
import { NewFolderComponent } from './components/functions/upload/new-folder/new-folder.component';
import { SideViewComponent } from './components/side-view/side-view.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
/**
 * @param {?} http
 * @return {?}
 */
export function createTranslateLoader(http) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
/** @type {?} */
var FEATURE_REDUCER_TOKEN = new InjectionToken('AppStore Reducers');
/**
 * @return {?}
 */
export function getReducers() {
    // map of reducers
    return reducers;
}
var ɵ0 = (createTranslateLoader);
var FileManagerModule = /** @class */ (function () {
    function FileManagerModule() {
    }
    /**
     * @return {?}
     */
    FileManagerModule.forRoot = /**
     * @return {?}
     */
    function () {
        return {
            ngModule: FileManagerModule,
            providers: [TranslateService]
        };
    };
    FileManagerModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        HttpClientModule,
                        StoreModule.forRoot(FEATURE_REDUCER_TOKEN),
                        CommonModule,
                        NgxSmartModalModule.forRoot(),
                        TranslateModule.forChild({
                            loader: {
                                provide: TranslateLoader,
                                useFactory: ɵ0,
                                deps: [HttpClient]
                            }
                        })
                    ],
                    declarations: [
                        FileManagerComponent,
                        FolderContentComponent,
                        NodeComponent,
                        TreeComponent,
                        NodeListerComponent,
                        MapToIterablePipe,
                        NavBarComponent,
                        LoadingOverlayComponent,
                        FileSizePipe,
                        UploadComponent,
                        NewFolderComponent,
                        SideViewComponent,
                        NavigationComponent
                    ],
                    exports: [
                        FileManagerComponent,
                        LoadingOverlayComponent,
                        SideViewComponent
                    ],
                    providers: [
                        {
                            provide: FEATURE_REDUCER_TOKEN,
                            useFactory: getReducers,
                        },
                    ]
                },] },
    ];
    return FileManagerModule;
}());
export { FileManagerModule };
export { ɵ0 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZS1tYW5hZ2VyLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25nNi1maWxlLW1hbi8iLCJzb3VyY2VzIjpbImZpbGUtbWFuYWdlci9maWxlLW1hbmFnZXIubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0EsT0FBTyxFQUFDLFFBQVEsRUFBRSxjQUFjLEVBQXNCLE1BQU0sZUFBZSxDQUFDO0FBQzVFLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUM3QyxPQUFPLEVBQUMsb0JBQW9CLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUM5RCxPQUFPLEVBQUMsc0JBQXNCLEVBQUMsTUFBTSxzREFBc0QsQ0FBQztBQUM1RixPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sa0NBQWtDLENBQUM7QUFDL0QsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0scURBQXFELENBQUM7QUFDeEYsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLDRDQUE0QyxDQUFDO0FBQ3pFLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLDhCQUE4QixDQUFDO0FBQy9ELE9BQU8sRUFBQyxVQUFVLEVBQUUsZ0JBQWdCLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUNsRSxPQUFPLEVBQUMsV0FBVyxFQUFtQixNQUFNLGFBQWEsQ0FBQztBQUMxRCxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sd0NBQXdDLENBQUM7QUFDdkUsT0FBTyxFQUFDLFFBQVEsRUFBVyxNQUFNLDRCQUE0QixDQUFDO0FBQzlELE9BQU8sRUFBQyx1QkFBdUIsRUFBQyxNQUFNLGtFQUFrRSxDQUFDO0FBQ3pHLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUNwRCxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sZ0RBQWdELENBQUM7QUFDL0UsT0FBTyxFQUFDLGtCQUFrQixFQUFDLE1BQU0sK0RBQStELENBQUM7QUFDakcsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sNENBQTRDLENBQUM7QUFDN0UsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0sOENBQThDLENBQUM7QUFDakYsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDcEQsT0FBTyxFQUFDLGVBQWUsRUFBRSxlQUFlLEVBQUUsZ0JBQWdCLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUN2RixPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSw0QkFBNEIsQ0FBQzs7Ozs7QUFFL0QsTUFBTSxnQ0FBZ0MsSUFBZ0I7SUFDcEQsTUFBTSxDQUFDLElBQUksbUJBQW1CLENBQUMsSUFBSSxFQUFFLGdCQUFnQixFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ2xFLENBQUM7O0lBRUsscUJBQXFCLEdBQUcsSUFBSSxjQUFjLENBRTlDLG1CQUFtQixDQUFDOzs7O0FBQ3RCLE1BQU07SUFDSixrQkFBa0I7SUFDbEIsTUFBTSxDQUFDLFFBQVEsQ0FBQztBQUNsQixDQUFDO1NBV21CLENBQUMscUJBQXFCLENBQUM7QUFUM0M7SUFBQTtJQStDQSxDQUFDOzs7O0lBTlEseUJBQU87OztJQUFkO1FBQ0UsTUFBTSxDQUFDO1lBQ0wsUUFBUSxFQUFFLGlCQUFpQjtZQUMzQixTQUFTLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQztTQUM5QixDQUFDO0lBQ0osQ0FBQzs7Z0JBOUNGLFFBQVEsU0FBQztvQkFDUixPQUFPLEVBQUU7d0JBQ1AsZ0JBQWdCO3dCQUNoQixXQUFXLENBQUMsT0FBTyxDQUFDLHFCQUFxQixDQUFDO3dCQUMxQyxZQUFZO3dCQUNaLG1CQUFtQixDQUFDLE9BQU8sRUFBRTt3QkFDN0IsZUFBZSxDQUFDLFFBQVEsQ0FBQzs0QkFDdkIsTUFBTSxFQUFDO2dDQUNMLE9BQU8sRUFBRSxlQUFlO2dDQUN4QixVQUFVLElBQXlCO2dDQUNuQyxJQUFJLEVBQUUsQ0FBQyxVQUFVLENBQUM7NkJBQUM7eUJBQ3RCLENBQUM7cUJBQ0g7b0JBQ0QsWUFBWSxFQUFFO3dCQUNaLG9CQUFvQjt3QkFDcEIsc0JBQXNCO3dCQUN0QixhQUFhO3dCQUNiLGFBQWE7d0JBQ2IsbUJBQW1CO3dCQUNuQixpQkFBaUI7d0JBQ2pCLGVBQWU7d0JBQ2YsdUJBQXVCO3dCQUN2QixZQUFZO3dCQUNaLGVBQWU7d0JBQ2Ysa0JBQWtCO3dCQUNsQixpQkFBaUI7d0JBQ2pCLG1CQUFtQjtxQkFDcEI7b0JBQ0QsT0FBTyxFQUFFO3dCQUNQLG9CQUFvQjt3QkFDcEIsdUJBQXVCO3dCQUN2QixpQkFBaUI7cUJBQ2xCO29CQUNELFNBQVMsRUFBRTt3QkFDVDs0QkFDRSxPQUFPLEVBQUUscUJBQXFCOzRCQUM5QixVQUFVLEVBQUUsV0FBVzt5QkFDeEI7cUJBQ0Y7aUJBQ0Y7O0lBUUQsd0JBQUM7Q0FBQSxBQS9DRCxJQStDQztTQVBZLGlCQUFpQiIsInNvdXJjZXNDb250ZW50IjpbIi8vIGltcG9ydCB7TW9kdWxlV2l0aFByb3ZpZGVycywgTmdNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge05nTW9kdWxlLCBJbmplY3Rpb25Ub2tlbiwgTW9kdWxlV2l0aFByb3ZpZGVyc30gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xyXG5pbXBvcnQge0ZpbGVNYW5hZ2VyQ29tcG9uZW50fSBmcm9tICcuL2ZpbGUtbWFuYWdlci5jb21wb25lbnQnO1xyXG5pbXBvcnQge0ZvbGRlckNvbnRlbnRDb21wb25lbnR9IGZyb20gJy4vY29tcG9uZW50cy9mb2xkZXItY29udGVudC9mb2xkZXItY29udGVudC5jb21wb25lbnQnO1xyXG5pbXBvcnQge1RyZWVDb21wb25lbnR9IGZyb20gJy4vY29tcG9uZW50cy90cmVlL3RyZWUuY29tcG9uZW50JztcclxuaW1wb3J0IHtOb2RlTGlzdGVyQ29tcG9uZW50fSBmcm9tICcuL2NvbXBvbmVudHMvdHJlZS9ub2RlLWxpc3Rlci9ub2RlLWxpc3Rlci5jb21wb25lbnQnO1xyXG5pbXBvcnQge05vZGVDb21wb25lbnR9IGZyb20gJy4vY29tcG9uZW50cy9mdW5jdGlvbnMvbm9kZS9ub2RlLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7TWFwVG9JdGVyYWJsZVBpcGV9IGZyb20gJy4vcGlwZXMvbWFwLXRvLWl0ZXJhYmxlLnBpcGUnO1xyXG5pbXBvcnQge0h0dHBDbGllbnQsIEh0dHBDbGllbnRNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHtTdG9yZU1vZHVsZSwgQWN0aW9uUmVkdWNlck1hcH0gZnJvbSAnQG5ncngvc3RvcmUnO1xyXG5pbXBvcnQge05hdkJhckNvbXBvbmVudH0gZnJvbSAnLi9jb21wb25lbnRzL25hdi1iYXIvbmF2LWJhci5jb21wb25lbnQnO1xyXG5pbXBvcnQge3JlZHVjZXJzLCBBcHBTdG9yZX0gZnJvbSAnLi9yZWR1Y2Vycy9yZWR1Y2VyLmZhY3RvcnknO1xyXG5pbXBvcnQge0xvYWRpbmdPdmVybGF5Q29tcG9uZW50fSBmcm9tICcuL2NvbXBvbmVudHMvZnVuY3Rpb25zL2xvYWRpbmctb3ZlcmxheS9sb2FkaW5nLW92ZXJsYXkuY29tcG9uZW50JztcclxuaW1wb3J0IHtGaWxlU2l6ZVBpcGV9IGZyb20gJy4vcGlwZXMvZmlsZS1zaXplLnBpcGUnO1xyXG5pbXBvcnQge1VwbG9hZENvbXBvbmVudH0gZnJvbSAnLi9jb21wb25lbnRzL2Z1bmN0aW9ucy91cGxvYWQvdXBsb2FkLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7TmV3Rm9sZGVyQ29tcG9uZW50fSBmcm9tICcuL2NvbXBvbmVudHMvZnVuY3Rpb25zL3VwbG9hZC9uZXctZm9sZGVyL25ldy1mb2xkZXIuY29tcG9uZW50JztcclxuaW1wb3J0IHtTaWRlVmlld0NvbXBvbmVudH0gZnJvbSAnLi9jb21wb25lbnRzL3NpZGUtdmlldy9zaWRlLXZpZXcuY29tcG9uZW50JztcclxuaW1wb3J0IHtOYXZpZ2F0aW9uQ29tcG9uZW50fSBmcm9tICcuL2NvbXBvbmVudHMvbmF2aWdhdGlvbi9uYXZpZ2F0aW9uLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7Tmd4U21hcnRNb2RhbE1vZHVsZX0gZnJvbSAnbmd4LXNtYXJ0LW1vZGFsJztcclxuaW1wb3J0IHtUcmFuc2xhdGVMb2FkZXIsIFRyYW5zbGF0ZU1vZHVsZSwgVHJhbnNsYXRlU2VydmljZX0gZnJvbSAnQG5neC10cmFuc2xhdGUvY29yZSc7XHJcbmltcG9ydCB7VHJhbnNsYXRlSHR0cExvYWRlcn0gZnJvbSAnQG5neC10cmFuc2xhdGUvaHR0cC1sb2FkZXInO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVRyYW5zbGF0ZUxvYWRlcihodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgcmV0dXJuIG5ldyBUcmFuc2xhdGVIdHRwTG9hZGVyKGh0dHAsICcuL2Fzc2V0cy9pMThuLycsICcuanNvbicpO1xyXG59XHJcblxyXG5jb25zdCBGRUFUVVJFX1JFRFVDRVJfVE9LRU4gPSBuZXcgSW5qZWN0aW9uVG9rZW48XHJcbiAgQWN0aW9uUmVkdWNlck1hcDxBcHBTdG9yZT5cclxuPignQXBwU3RvcmUgUmVkdWNlcnMnKTtcclxuZXhwb3J0IGZ1bmN0aW9uIGdldFJlZHVjZXJzKCk6IEFjdGlvblJlZHVjZXJNYXA8QXBwU3RvcmU+IHtcclxuICAvLyBtYXAgb2YgcmVkdWNlcnNcclxuICByZXR1cm4gcmVkdWNlcnM7XHJcbn1cclxuXHJcbkBOZ01vZHVsZSh7XHJcbiAgaW1wb3J0czogW1xyXG4gICAgSHR0cENsaWVudE1vZHVsZSxcclxuICAgIFN0b3JlTW9kdWxlLmZvclJvb3QoRkVBVFVSRV9SRURVQ0VSX1RPS0VOKSxcclxuICAgIENvbW1vbk1vZHVsZSxcclxuICAgIE5neFNtYXJ0TW9kYWxNb2R1bGUuZm9yUm9vdCgpLFxyXG4gICAgVHJhbnNsYXRlTW9kdWxlLmZvckNoaWxkKHtcclxuICAgICAgbG9hZGVyOntcclxuICAgICAgICBwcm92aWRlOiBUcmFuc2xhdGVMb2FkZXIsXHJcbiAgICAgICAgdXNlRmFjdG9yeTogKGNyZWF0ZVRyYW5zbGF0ZUxvYWRlciksXHJcbiAgICAgICAgZGVwczogW0h0dHBDbGllbnRdfVxyXG4gICAgfSlcclxuICBdLFxyXG4gIGRlY2xhcmF0aW9uczogW1xyXG4gICAgRmlsZU1hbmFnZXJDb21wb25lbnQsXHJcbiAgICBGb2xkZXJDb250ZW50Q29tcG9uZW50LFxyXG4gICAgTm9kZUNvbXBvbmVudCxcclxuICAgIFRyZWVDb21wb25lbnQsXHJcbiAgICBOb2RlTGlzdGVyQ29tcG9uZW50LFxyXG4gICAgTWFwVG9JdGVyYWJsZVBpcGUsXHJcbiAgICBOYXZCYXJDb21wb25lbnQsXHJcbiAgICBMb2FkaW5nT3ZlcmxheUNvbXBvbmVudCxcclxuICAgIEZpbGVTaXplUGlwZSxcclxuICAgIFVwbG9hZENvbXBvbmVudCxcclxuICAgIE5ld0ZvbGRlckNvbXBvbmVudCxcclxuICAgIFNpZGVWaWV3Q29tcG9uZW50LFxyXG4gICAgTmF2aWdhdGlvbkNvbXBvbmVudFxyXG4gIF0sXHJcbiAgZXhwb3J0czogW1xyXG4gICAgRmlsZU1hbmFnZXJDb21wb25lbnQsXHJcbiAgICBMb2FkaW5nT3ZlcmxheUNvbXBvbmVudCxcclxuICAgIFNpZGVWaWV3Q29tcG9uZW50XHJcbiAgXSxcclxuICBwcm92aWRlcnM6IFtcclxuICAgIHtcclxuICAgICAgcHJvdmlkZTogRkVBVFVSRV9SRURVQ0VSX1RPS0VOLFxyXG4gICAgICB1c2VGYWN0b3J5OiBnZXRSZWR1Y2VycyxcclxuICAgIH0sXHJcbiAgXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgRmlsZU1hbmFnZXJNb2R1bGUge1xyXG4gIHN0YXRpYyBmb3JSb290KCk6IE1vZHVsZVdpdGhQcm92aWRlcnMge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgbmdNb2R1bGU6IEZpbGVNYW5hZ2VyTW9kdWxlLFxyXG4gICAgICBwcm92aWRlcnM6IFtUcmFuc2xhdGVTZXJ2aWNlXVxyXG4gICAgfTtcclxuICB9XHJcbn1cclxuIl19