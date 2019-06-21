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
const FEATURE_REDUCER_TOKEN = new InjectionToken('AppStore Reducers');
/**
 * @return {?}
 */
export function getReducers() {
    // map of reducers
    return reducers;
}
const ɵ0 = (createTranslateLoader);
export class FileManagerModule {
    /**
     * @return {?}
     */
    static forRoot() {
        return {
            ngModule: FileManagerModule,
            providers: [TranslateService]
        };
    }
}
FileManagerModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    HttpClientModule,
                    StoreModule.forRoot(FEATURE_REDUCER_TOKEN),
                    CommonModule,
                    NgxSmartModalModule.forRoot(),
                    TranslateModule.forRoot({
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
export { ɵ0 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZS1tYW5hZ2VyLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25nNi1maWxlLW1hbi8iLCJzb3VyY2VzIjpbImZpbGUtbWFuYWdlci9maWxlLW1hbmFnZXIubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0EsT0FBTyxFQUFDLFFBQVEsRUFBRSxjQUFjLEVBQXNCLE1BQU0sZUFBZSxDQUFDO0FBQzVFLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUM3QyxPQUFPLEVBQUMsb0JBQW9CLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUM5RCxPQUFPLEVBQUMsc0JBQXNCLEVBQUMsTUFBTSxzREFBc0QsQ0FBQztBQUM1RixPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sa0NBQWtDLENBQUM7QUFDL0QsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0scURBQXFELENBQUM7QUFDeEYsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLDRDQUE0QyxDQUFDO0FBQ3pFLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLDhCQUE4QixDQUFDO0FBQy9ELE9BQU8sRUFBQyxVQUFVLEVBQUUsZ0JBQWdCLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUNsRSxPQUFPLEVBQUMsV0FBVyxFQUFtQixNQUFNLGFBQWEsQ0FBQztBQUMxRCxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sd0NBQXdDLENBQUM7QUFDdkUsT0FBTyxFQUFDLFFBQVEsRUFBVyxNQUFNLDRCQUE0QixDQUFDO0FBQzlELE9BQU8sRUFBQyx1QkFBdUIsRUFBQyxNQUFNLGtFQUFrRSxDQUFDO0FBQ3pHLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUNwRCxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sZ0RBQWdELENBQUM7QUFDL0UsT0FBTyxFQUFDLGtCQUFrQixFQUFDLE1BQU0sK0RBQStELENBQUM7QUFDakcsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sNENBQTRDLENBQUM7QUFDN0UsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0sOENBQThDLENBQUM7QUFDakYsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDcEQsT0FBTyxFQUFDLGVBQWUsRUFBRSxlQUFlLEVBQUUsZ0JBQWdCLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUN2RixPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSw0QkFBNEIsQ0FBQzs7Ozs7QUFFL0QsTUFBTSxnQ0FBZ0MsSUFBZ0I7SUFDcEQsTUFBTSxDQUFDLElBQUksbUJBQW1CLENBQUMsSUFBSSxFQUFFLGdCQUFnQixFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ2xFLENBQUM7O01BRUsscUJBQXFCLEdBQUcsSUFBSSxjQUFjLENBRTlDLG1CQUFtQixDQUFDOzs7O0FBQ3RCLE1BQU07SUFDSixrQkFBa0I7SUFDbEIsTUFBTSxDQUFDLFFBQVEsQ0FBQztBQUNsQixDQUFDO1dBV21CLENBQUMscUJBQXFCLENBQUM7QUErQjNDLE1BQU07Ozs7SUFDSixNQUFNLENBQUMsT0FBTztRQUNaLE1BQU0sQ0FBQztZQUNMLFFBQVEsRUFBRSxpQkFBaUI7WUFDM0IsU0FBUyxFQUFFLENBQUMsZ0JBQWdCLENBQUM7U0FDOUIsQ0FBQztJQUNKLENBQUM7OztZQTlDRixRQUFRLFNBQUM7Z0JBQ1IsT0FBTyxFQUFFO29CQUNQLGdCQUFnQjtvQkFDaEIsV0FBVyxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQztvQkFDMUMsWUFBWTtvQkFDWixtQkFBbUIsQ0FBQyxPQUFPLEVBQUU7b0JBQzdCLGVBQWUsQ0FBQyxPQUFPLENBQUM7d0JBQ3RCLE1BQU0sRUFBQzs0QkFDTCxPQUFPLEVBQUUsZUFBZTs0QkFDeEIsVUFBVSxJQUF5Qjs0QkFDbkMsSUFBSSxFQUFFLENBQUMsVUFBVSxDQUFDO3lCQUFDO3FCQUN0QixDQUFDO2lCQUNIO2dCQUNELFlBQVksRUFBRTtvQkFDWixvQkFBb0I7b0JBQ3BCLHNCQUFzQjtvQkFDdEIsYUFBYTtvQkFDYixhQUFhO29CQUNiLG1CQUFtQjtvQkFDbkIsaUJBQWlCO29CQUNqQixlQUFlO29CQUNmLHVCQUF1QjtvQkFDdkIsWUFBWTtvQkFDWixlQUFlO29CQUNmLGtCQUFrQjtvQkFDbEIsaUJBQWlCO29CQUNqQixtQkFBbUI7aUJBQ3BCO2dCQUNELE9BQU8sRUFBRTtvQkFDUCxvQkFBb0I7b0JBQ3BCLHVCQUF1QjtvQkFDdkIsaUJBQWlCO2lCQUNsQjtnQkFDRCxTQUFTLEVBQUU7b0JBQ1Q7d0JBQ0UsT0FBTyxFQUFFLHFCQUFxQjt3QkFDOUIsVUFBVSxFQUFFLFdBQVc7cUJBQ3hCO2lCQUNGO2FBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBpbXBvcnQge01vZHVsZVdpdGhQcm92aWRlcnMsIE5nTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtOZ01vZHVsZSwgSW5qZWN0aW9uVG9rZW4sIE1vZHVsZVdpdGhQcm92aWRlcnN9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge0NvbW1vbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcclxuaW1wb3J0IHtGaWxlTWFuYWdlckNvbXBvbmVudH0gZnJvbSAnLi9maWxlLW1hbmFnZXIuY29tcG9uZW50JztcclxuaW1wb3J0IHtGb2xkZXJDb250ZW50Q29tcG9uZW50fSBmcm9tICcuL2NvbXBvbmVudHMvZm9sZGVyLWNvbnRlbnQvZm9sZGVyLWNvbnRlbnQuY29tcG9uZW50JztcclxuaW1wb3J0IHtUcmVlQ29tcG9uZW50fSBmcm9tICcuL2NvbXBvbmVudHMvdHJlZS90cmVlLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7Tm9kZUxpc3RlckNvbXBvbmVudH0gZnJvbSAnLi9jb21wb25lbnRzL3RyZWUvbm9kZS1saXN0ZXIvbm9kZS1saXN0ZXIuY29tcG9uZW50JztcclxuaW1wb3J0IHtOb2RlQ29tcG9uZW50fSBmcm9tICcuL2NvbXBvbmVudHMvZnVuY3Rpb25zL25vZGUvbm9kZS5jb21wb25lbnQnO1xyXG5pbXBvcnQge01hcFRvSXRlcmFibGVQaXBlfSBmcm9tICcuL3BpcGVzL21hcC10by1pdGVyYWJsZS5waXBlJztcclxuaW1wb3J0IHtIdHRwQ2xpZW50LCBIdHRwQ2xpZW50TW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7U3RvcmVNb2R1bGUsIEFjdGlvblJlZHVjZXJNYXB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcclxuaW1wb3J0IHtOYXZCYXJDb21wb25lbnR9IGZyb20gJy4vY29tcG9uZW50cy9uYXYtYmFyL25hdi1iYXIuY29tcG9uZW50JztcclxuaW1wb3J0IHtyZWR1Y2VycywgQXBwU3RvcmV9IGZyb20gJy4vcmVkdWNlcnMvcmVkdWNlci5mYWN0b3J5JztcclxuaW1wb3J0IHtMb2FkaW5nT3ZlcmxheUNvbXBvbmVudH0gZnJvbSAnLi9jb21wb25lbnRzL2Z1bmN0aW9ucy9sb2FkaW5nLW92ZXJsYXkvbG9hZGluZy1vdmVybGF5LmNvbXBvbmVudCc7XHJcbmltcG9ydCB7RmlsZVNpemVQaXBlfSBmcm9tICcuL3BpcGVzL2ZpbGUtc2l6ZS5waXBlJztcclxuaW1wb3J0IHtVcGxvYWRDb21wb25lbnR9IGZyb20gJy4vY29tcG9uZW50cy9mdW5jdGlvbnMvdXBsb2FkL3VwbG9hZC5jb21wb25lbnQnO1xyXG5pbXBvcnQge05ld0ZvbGRlckNvbXBvbmVudH0gZnJvbSAnLi9jb21wb25lbnRzL2Z1bmN0aW9ucy91cGxvYWQvbmV3LWZvbGRlci9uZXctZm9sZGVyLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7U2lkZVZpZXdDb21wb25lbnR9IGZyb20gJy4vY29tcG9uZW50cy9zaWRlLXZpZXcvc2lkZS12aWV3LmNvbXBvbmVudCc7XHJcbmltcG9ydCB7TmF2aWdhdGlvbkNvbXBvbmVudH0gZnJvbSAnLi9jb21wb25lbnRzL25hdmlnYXRpb24vbmF2aWdhdGlvbi5jb21wb25lbnQnO1xyXG5pbXBvcnQge05neFNtYXJ0TW9kYWxNb2R1bGV9IGZyb20gJ25neC1zbWFydC1tb2RhbCc7XHJcbmltcG9ydCB7VHJhbnNsYXRlTG9hZGVyLCBUcmFuc2xhdGVNb2R1bGUsIFRyYW5zbGF0ZVNlcnZpY2V9IGZyb20gJ0BuZ3gtdHJhbnNsYXRlL2NvcmUnO1xyXG5pbXBvcnQge1RyYW5zbGF0ZUh0dHBMb2FkZXJ9IGZyb20gJ0BuZ3gtdHJhbnNsYXRlL2h0dHAtbG9hZGVyJztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVUcmFuc2xhdGVMb2FkZXIoaHR0cDogSHR0cENsaWVudCkge1xyXG4gIHJldHVybiBuZXcgVHJhbnNsYXRlSHR0cExvYWRlcihodHRwLCAnLi9hc3NldHMvaTE4bi8nLCAnLmpzb24nKTtcclxufVxyXG5cclxuY29uc3QgRkVBVFVSRV9SRURVQ0VSX1RPS0VOID0gbmV3IEluamVjdGlvblRva2VuPFxyXG4gIEFjdGlvblJlZHVjZXJNYXA8QXBwU3RvcmU+XHJcbj4oJ0FwcFN0b3JlIFJlZHVjZXJzJyk7XHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRSZWR1Y2VycygpOiBBY3Rpb25SZWR1Y2VyTWFwPEFwcFN0b3JlPiB7XHJcbiAgLy8gbWFwIG9mIHJlZHVjZXJzXHJcbiAgcmV0dXJuIHJlZHVjZXJzO1xyXG59XHJcblxyXG5ATmdNb2R1bGUoe1xyXG4gIGltcG9ydHM6IFtcclxuICAgIEh0dHBDbGllbnRNb2R1bGUsXHJcbiAgICBTdG9yZU1vZHVsZS5mb3JSb290KEZFQVRVUkVfUkVEVUNFUl9UT0tFTiksXHJcbiAgICBDb21tb25Nb2R1bGUsXHJcbiAgICBOZ3hTbWFydE1vZGFsTW9kdWxlLmZvclJvb3QoKSxcclxuICAgIFRyYW5zbGF0ZU1vZHVsZS5mb3JSb290KHtcclxuICAgICAgbG9hZGVyOntcclxuICAgICAgICBwcm92aWRlOiBUcmFuc2xhdGVMb2FkZXIsXHJcbiAgICAgICAgdXNlRmFjdG9yeTogKGNyZWF0ZVRyYW5zbGF0ZUxvYWRlciksXHJcbiAgICAgICAgZGVwczogW0h0dHBDbGllbnRdfVxyXG4gICAgfSlcclxuICBdLFxyXG4gIGRlY2xhcmF0aW9uczogW1xyXG4gICAgRmlsZU1hbmFnZXJDb21wb25lbnQsXHJcbiAgICBGb2xkZXJDb250ZW50Q29tcG9uZW50LFxyXG4gICAgTm9kZUNvbXBvbmVudCxcclxuICAgIFRyZWVDb21wb25lbnQsXHJcbiAgICBOb2RlTGlzdGVyQ29tcG9uZW50LFxyXG4gICAgTWFwVG9JdGVyYWJsZVBpcGUsXHJcbiAgICBOYXZCYXJDb21wb25lbnQsXHJcbiAgICBMb2FkaW5nT3ZlcmxheUNvbXBvbmVudCxcclxuICAgIEZpbGVTaXplUGlwZSxcclxuICAgIFVwbG9hZENvbXBvbmVudCxcclxuICAgIE5ld0ZvbGRlckNvbXBvbmVudCxcclxuICAgIFNpZGVWaWV3Q29tcG9uZW50LFxyXG4gICAgTmF2aWdhdGlvbkNvbXBvbmVudFxyXG4gIF0sXHJcbiAgZXhwb3J0czogW1xyXG4gICAgRmlsZU1hbmFnZXJDb21wb25lbnQsXHJcbiAgICBMb2FkaW5nT3ZlcmxheUNvbXBvbmVudCxcclxuICAgIFNpZGVWaWV3Q29tcG9uZW50XHJcbiAgXSxcclxuICBwcm92aWRlcnM6IFtcclxuICAgIHtcclxuICAgICAgcHJvdmlkZTogRkVBVFVSRV9SRURVQ0VSX1RPS0VOLFxyXG4gICAgICB1c2VGYWN0b3J5OiBnZXRSZWR1Y2VycyxcclxuICAgIH0sXHJcbiAgXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgRmlsZU1hbmFnZXJNb2R1bGUge1xyXG4gIHN0YXRpYyBmb3JSb290KCk6IE1vZHVsZVdpdGhQcm92aWRlcnMge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgbmdNb2R1bGU6IEZpbGVNYW5hZ2VyTW9kdWxlLFxyXG4gICAgICBwcm92aWRlcnM6IFtUcmFuc2xhdGVTZXJ2aWNlXVxyXG4gICAgfTtcclxuICB9XHJcbn1cclxuIl19