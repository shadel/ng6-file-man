import { HttpClient } from '@angular/common/http';
import { ActionReducerMap } from '@ngrx/store';
import { AppStore } from './reducers/reducer.factory';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
export declare function createTranslateLoader(http: HttpClient): TranslateHttpLoader;
export declare function getReducers(): ActionReducerMap<AppStore>;
export declare class FileManagerModule {
}
