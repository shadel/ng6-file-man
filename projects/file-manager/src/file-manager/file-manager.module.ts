// import {ModuleWithProviders, NgModule} from '@angular/core';
import {NgModule, InjectionToken} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FileManagerComponent} from './file-manager.component';
import {FolderContentComponent} from './components/folder-content/folder-content.component';
import {TreeComponent} from './components/tree/tree.component';
import {NodeListerComponent} from './components/tree/node-lister/node-lister.component';
import {NodeComponent} from './components/functions/node/node.component';
import {MapToIterablePipe} from './pipes/map-to-iterable.pipe';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {StoreModule, ActionReducerMap} from '@ngrx/store';
import {NavBarComponent} from './components/nav-bar/nav-bar.component';
import {reducers, AppStore} from './reducers/reducer.factory';
import {LoadingOverlayComponent} from './components/functions/loading-overlay/loading-overlay.component';
import {FileSizePipe} from './pipes/file-size.pipe';
import {UploadComponent} from './components/functions/upload/upload.component';
import {NewFolderComponent} from './components/functions/upload/new-folder/new-folder.component';
import {SideViewComponent} from './components/side-view/side-view.component';
import {NavigationComponent} from './components/navigation/navigation.component';
import {NgxSmartModalModule} from 'ngx-smart-modal';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
}

export const FEATURE_REDUCER_TOKEN = new InjectionToken<
  ActionReducerMap<AppStore>
>('AppStore Reducers');
export function getReducers(): ActionReducerMap<AppStore> {
  // map of reducers
  return reducers;
}

@NgModule({
  imports: [
    HttpClientModule,
    StoreModule.forRoot(FEATURE_REDUCER_TOKEN),
    CommonModule,
    NgxSmartModalModule.forRoot(),
    TranslateModule.forRoot({
      loader:{
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]}
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
})
export class FileManagerModule {
  // static forRoot(): ModuleWithProviders {
  //   return {
  //     ngModule: FileManagerModule,
  //     providers: [TranslateService]
  //   };
  // }
}
