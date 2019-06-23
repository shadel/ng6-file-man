import { ModuleWithProviders } from '@angular/core';
import { ActionReducerMap } from '@ngrx/store';
import { AppStore } from './reducers/reducer.factory';
export declare function getReducers(): ActionReducerMap<AppStore>;
export declare class FileManagerModule {
    static forRoot(): ModuleWithProviders;
}
