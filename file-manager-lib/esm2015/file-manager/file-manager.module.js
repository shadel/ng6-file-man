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
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
/**
 * @param {?} http
 * @return {?}
 */
export function createTranslateLoader(http) {
    return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZS1tYW5hZ2VyLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25nNi1maWxlLW1hbi8iLCJzb3VyY2VzIjpbImZpbGUtbWFuYWdlci9maWxlLW1hbmFnZXIubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0EsT0FBTyxFQUFDLFFBQVEsRUFBRSxjQUFjLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDdkQsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQzdDLE9BQU8sRUFBQyxvQkFBb0IsRUFBQyxNQUFNLDBCQUEwQixDQUFDO0FBQzlELE9BQU8sRUFBQyxzQkFBc0IsRUFBQyxNQUFNLHNEQUFzRCxDQUFDO0FBQzVGLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxrQ0FBa0MsQ0FBQztBQUMvRCxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSxxREFBcUQsQ0FBQztBQUN4RixPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sNENBQTRDLENBQUM7QUFDekUsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sOEJBQThCLENBQUM7QUFDL0QsT0FBTyxFQUFDLFVBQVUsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ2xFLE9BQU8sRUFBQyxXQUFXLEVBQW1CLE1BQU0sYUFBYSxDQUFDO0FBQzFELE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSx3Q0FBd0MsQ0FBQztBQUN2RSxPQUFPLEVBQUMsUUFBUSxFQUFXLE1BQU0sNEJBQTRCLENBQUM7QUFDOUQsT0FBTyxFQUFDLHVCQUF1QixFQUFDLE1BQU0sa0VBQWtFLENBQUM7QUFDekcsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3BELE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxnREFBZ0QsQ0FBQztBQUMvRSxPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSwrREFBK0QsQ0FBQztBQUNqRyxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSw0Q0FBNEMsQ0FBQztBQUM3RSxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSw4Q0FBOEMsQ0FBQztBQUNqRixPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUNwRCxPQUFPLEVBQUMsZUFBZSxFQUFFLGVBQWUsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ3JFLE9BQU8sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLDRCQUE0QixDQUFDOzs7OztBQUUvRCxNQUFNLGdDQUFnQyxJQUFnQjtJQUNwRCxNQUFNLENBQUMsSUFBSSxtQkFBbUIsQ0FBQyxJQUFJLEVBQUUsZUFBZSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ2pFLENBQUM7O01BRUsscUJBQXFCLEdBQUcsSUFBSSxjQUFjLENBRTlDLG1CQUFtQixDQUFDOzs7O0FBQ3RCLE1BQU07SUFDSixrQkFBa0I7SUFDbEIsTUFBTSxDQUFDLFFBQVEsQ0FBQztBQUNsQixDQUFDO1dBV21CLENBQUMscUJBQXFCLENBQUM7QUErQjNDLE1BQU07OztZQXhDTCxRQUFRLFNBQUM7Z0JBQ1IsT0FBTyxFQUFFO29CQUNQLGdCQUFnQjtvQkFDaEIsV0FBVyxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQztvQkFDMUMsWUFBWTtvQkFDWixtQkFBbUIsQ0FBQyxPQUFPLEVBQUU7b0JBQzdCLGVBQWUsQ0FBQyxPQUFPLENBQUM7d0JBQ3RCLE1BQU0sRUFBQzs0QkFDTCxPQUFPLEVBQUUsZUFBZTs0QkFDeEIsVUFBVSxJQUF5Qjs0QkFDbkMsSUFBSSxFQUFFLENBQUMsVUFBVSxDQUFDO3lCQUFDO3FCQUN0QixDQUFDO2lCQUNIO2dCQUNELFlBQVksRUFBRTtvQkFDWixvQkFBb0I7b0JBQ3BCLHNCQUFzQjtvQkFDdEIsYUFBYTtvQkFDYixhQUFhO29CQUNiLG1CQUFtQjtvQkFDbkIsaUJBQWlCO29CQUNqQixlQUFlO29CQUNmLHVCQUF1QjtvQkFDdkIsWUFBWTtvQkFDWixlQUFlO29CQUNmLGtCQUFrQjtvQkFDbEIsaUJBQWlCO29CQUNqQixtQkFBbUI7aUJBQ3BCO2dCQUNELE9BQU8sRUFBRTtvQkFDUCxvQkFBb0I7b0JBQ3BCLHVCQUF1QjtvQkFDdkIsaUJBQWlCO2lCQUNsQjtnQkFDRCxTQUFTLEVBQUU7b0JBQ1Q7d0JBQ0UsT0FBTyxFQUFFLHFCQUFxQjt3QkFDOUIsVUFBVSxFQUFFLFdBQVc7cUJBQ3hCO2lCQUNGO2FBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBpbXBvcnQge01vZHVsZVdpdGhQcm92aWRlcnMsIE5nTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtOZ01vZHVsZSwgSW5qZWN0aW9uVG9rZW59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge0NvbW1vbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcclxuaW1wb3J0IHtGaWxlTWFuYWdlckNvbXBvbmVudH0gZnJvbSAnLi9maWxlLW1hbmFnZXIuY29tcG9uZW50JztcclxuaW1wb3J0IHtGb2xkZXJDb250ZW50Q29tcG9uZW50fSBmcm9tICcuL2NvbXBvbmVudHMvZm9sZGVyLWNvbnRlbnQvZm9sZGVyLWNvbnRlbnQuY29tcG9uZW50JztcclxuaW1wb3J0IHtUcmVlQ29tcG9uZW50fSBmcm9tICcuL2NvbXBvbmVudHMvdHJlZS90cmVlLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7Tm9kZUxpc3RlckNvbXBvbmVudH0gZnJvbSAnLi9jb21wb25lbnRzL3RyZWUvbm9kZS1saXN0ZXIvbm9kZS1saXN0ZXIuY29tcG9uZW50JztcclxuaW1wb3J0IHtOb2RlQ29tcG9uZW50fSBmcm9tICcuL2NvbXBvbmVudHMvZnVuY3Rpb25zL25vZGUvbm9kZS5jb21wb25lbnQnO1xyXG5pbXBvcnQge01hcFRvSXRlcmFibGVQaXBlfSBmcm9tICcuL3BpcGVzL21hcC10by1pdGVyYWJsZS5waXBlJztcclxuaW1wb3J0IHtIdHRwQ2xpZW50LCBIdHRwQ2xpZW50TW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7U3RvcmVNb2R1bGUsIEFjdGlvblJlZHVjZXJNYXB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcclxuaW1wb3J0IHtOYXZCYXJDb21wb25lbnR9IGZyb20gJy4vY29tcG9uZW50cy9uYXYtYmFyL25hdi1iYXIuY29tcG9uZW50JztcclxuaW1wb3J0IHtyZWR1Y2VycywgQXBwU3RvcmV9IGZyb20gJy4vcmVkdWNlcnMvcmVkdWNlci5mYWN0b3J5JztcclxuaW1wb3J0IHtMb2FkaW5nT3ZlcmxheUNvbXBvbmVudH0gZnJvbSAnLi9jb21wb25lbnRzL2Z1bmN0aW9ucy9sb2FkaW5nLW92ZXJsYXkvbG9hZGluZy1vdmVybGF5LmNvbXBvbmVudCc7XHJcbmltcG9ydCB7RmlsZVNpemVQaXBlfSBmcm9tICcuL3BpcGVzL2ZpbGUtc2l6ZS5waXBlJztcclxuaW1wb3J0IHtVcGxvYWRDb21wb25lbnR9IGZyb20gJy4vY29tcG9uZW50cy9mdW5jdGlvbnMvdXBsb2FkL3VwbG9hZC5jb21wb25lbnQnO1xyXG5pbXBvcnQge05ld0ZvbGRlckNvbXBvbmVudH0gZnJvbSAnLi9jb21wb25lbnRzL2Z1bmN0aW9ucy91cGxvYWQvbmV3LWZvbGRlci9uZXctZm9sZGVyLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7U2lkZVZpZXdDb21wb25lbnR9IGZyb20gJy4vY29tcG9uZW50cy9zaWRlLXZpZXcvc2lkZS12aWV3LmNvbXBvbmVudCc7XHJcbmltcG9ydCB7TmF2aWdhdGlvbkNvbXBvbmVudH0gZnJvbSAnLi9jb21wb25lbnRzL25hdmlnYXRpb24vbmF2aWdhdGlvbi5jb21wb25lbnQnO1xyXG5pbXBvcnQge05neFNtYXJ0TW9kYWxNb2R1bGV9IGZyb20gJ25neC1zbWFydC1tb2RhbCc7XHJcbmltcG9ydCB7VHJhbnNsYXRlTG9hZGVyLCBUcmFuc2xhdGVNb2R1bGV9IGZyb20gJ0BuZ3gtdHJhbnNsYXRlL2NvcmUnO1xyXG5pbXBvcnQge1RyYW5zbGF0ZUh0dHBMb2FkZXJ9IGZyb20gJ0BuZ3gtdHJhbnNsYXRlL2h0dHAtbG9hZGVyJztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVUcmFuc2xhdGVMb2FkZXIoaHR0cDogSHR0cENsaWVudCkge1xyXG4gIHJldHVybiBuZXcgVHJhbnNsYXRlSHR0cExvYWRlcihodHRwLCAnL2Fzc2V0cy9pMThuLycsICcuanNvbicpO1xyXG59XHJcblxyXG5jb25zdCBGRUFUVVJFX1JFRFVDRVJfVE9LRU4gPSBuZXcgSW5qZWN0aW9uVG9rZW48XHJcbiAgQWN0aW9uUmVkdWNlck1hcDxBcHBTdG9yZT5cclxuPignQXBwU3RvcmUgUmVkdWNlcnMnKTtcclxuZXhwb3J0IGZ1bmN0aW9uIGdldFJlZHVjZXJzKCk6IEFjdGlvblJlZHVjZXJNYXA8QXBwU3RvcmU+IHtcclxuICAvLyBtYXAgb2YgcmVkdWNlcnNcclxuICByZXR1cm4gcmVkdWNlcnM7XHJcbn1cclxuXHJcbkBOZ01vZHVsZSh7XHJcbiAgaW1wb3J0czogW1xyXG4gICAgSHR0cENsaWVudE1vZHVsZSxcclxuICAgIFN0b3JlTW9kdWxlLmZvclJvb3QoRkVBVFVSRV9SRURVQ0VSX1RPS0VOKSxcclxuICAgIENvbW1vbk1vZHVsZSxcclxuICAgIE5neFNtYXJ0TW9kYWxNb2R1bGUuZm9yUm9vdCgpLFxyXG4gICAgVHJhbnNsYXRlTW9kdWxlLmZvclJvb3Qoe1xyXG4gICAgICBsb2FkZXI6e1xyXG4gICAgICAgIHByb3ZpZGU6IFRyYW5zbGF0ZUxvYWRlcixcclxuICAgICAgICB1c2VGYWN0b3J5OiAoY3JlYXRlVHJhbnNsYXRlTG9hZGVyKSxcclxuICAgICAgICBkZXBzOiBbSHR0cENsaWVudF19XHJcbiAgICB9KVxyXG4gIF0sXHJcbiAgZGVjbGFyYXRpb25zOiBbXHJcbiAgICBGaWxlTWFuYWdlckNvbXBvbmVudCxcclxuICAgIEZvbGRlckNvbnRlbnRDb21wb25lbnQsXHJcbiAgICBOb2RlQ29tcG9uZW50LFxyXG4gICAgVHJlZUNvbXBvbmVudCxcclxuICAgIE5vZGVMaXN0ZXJDb21wb25lbnQsXHJcbiAgICBNYXBUb0l0ZXJhYmxlUGlwZSxcclxuICAgIE5hdkJhckNvbXBvbmVudCxcclxuICAgIExvYWRpbmdPdmVybGF5Q29tcG9uZW50LFxyXG4gICAgRmlsZVNpemVQaXBlLFxyXG4gICAgVXBsb2FkQ29tcG9uZW50LFxyXG4gICAgTmV3Rm9sZGVyQ29tcG9uZW50LFxyXG4gICAgU2lkZVZpZXdDb21wb25lbnQsXHJcbiAgICBOYXZpZ2F0aW9uQ29tcG9uZW50XHJcbiAgXSxcclxuICBleHBvcnRzOiBbXHJcbiAgICBGaWxlTWFuYWdlckNvbXBvbmVudCxcclxuICAgIExvYWRpbmdPdmVybGF5Q29tcG9uZW50LFxyXG4gICAgU2lkZVZpZXdDb21wb25lbnRcclxuICBdLFxyXG4gIHByb3ZpZGVyczogW1xyXG4gICAge1xyXG4gICAgICBwcm92aWRlOiBGRUFUVVJFX1JFRFVDRVJfVE9LRU4sXHJcbiAgICAgIHVzZUZhY3Rvcnk6IGdldFJlZHVjZXJzLFxyXG4gICAgfSxcclxuICBdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBGaWxlTWFuYWdlck1vZHVsZSB7XHJcbiAgLy8gc3RhdGljIGZvclJvb3QoKTogTW9kdWxlV2l0aFByb3ZpZGVycyB7XHJcbiAgLy8gICByZXR1cm4ge1xyXG4gIC8vICAgICBuZ01vZHVsZTogRmlsZU1hbmFnZXJNb2R1bGUsXHJcbiAgLy8gICAgIHByb3ZpZGVyczogW1RyYW5zbGF0ZVNlcnZpY2VdXHJcbiAgLy8gICB9O1xyXG4gIC8vIH1cclxufVxyXG4iXX0=