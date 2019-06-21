/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { NodeService } from './node.service';
import { HttpClient } from '@angular/common/http';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { Store } from '@ngrx/store';
import * as i0 from "@angular/core";
import * as i1 from "ngx-smart-modal";
import * as i2 from "./node.service";
import * as i3 from "@ngrx/store";
import * as i4 from "@angular/common/http";
export class NodeClickedService {
    /**
     * @param {?} ngxSmartModalService
     * @param {?} nodeService
     * @param {?} store
     * @param {?} http
     */
    constructor(ngxSmartModalService, nodeService, store, http) {
        this.ngxSmartModalService = ngxSmartModalService;
        this.nodeService = nodeService;
        this.store = store;
        this.http = http;
    }
    /**
     * @param {?} node
     * @return {?}
     */
    startDownload(node) {
        /** @type {?} */
        const parameters = this.parseParams({ path: node.id });
        this.reachServer('download', this.tree.config.api.downloadFile + parameters);
    }
    /**
     * @param {?} node
     * @return {?}
     */
    initDelete(node) {
        this.sideEffectHelper('Delete', { path: node.id }, 'delete', this.tree.config.api.deleteFile, (/**
         * @return {?}
         */
        () => this.successWithModalClose()));
    }
    /**
     * @param {?} input
     * @return {?}
     */
    searchForString(input) {
        this.sideEffectHelper('Search', { query: input }, 'get', this.tree.config.api.searchFiles, (/**
         * @param {?} res
         * @return {?}
         */
        (res) => this.searchSuccess(input, res)));
    }
    /**
     * @param {?} currentParent
     * @param {?} newDirName
     * @return {?}
     */
    createFolder(currentParent, newDirName) {
        this.sideEffectHelper('Create Folder', { dirName: newDirName, parentPath: currentParent === 0 ? null : currentParent }, 'post', this.tree.config.api.createFolder);
    }
    /**
     * @param {?} id
     * @param {?} newName
     * @return {?}
     */
    rename(id, newName) {
        this.sideEffectHelper('Rename', { path: id, newName: newName }, 'post', this.tree.config.api.renameFile, (/**
         * @return {?}
         */
        () => this.successWithModalClose()));
    }
    /**
     * @private
     * @param {?} name
     * @param {?} parameters
     * @param {?} httpMethod
     * @param {?} apiURL
     * @param {?=} successMethod
     * @param {?=} failMethod
     * @return {?}
     */
    sideEffectHelper(name, parameters, httpMethod, apiURL, successMethod = (/**
     * @param {?} a
     * @return {?}
     */
    (a) => this.actionSuccess(a)), failMethod = (/**
     * @param {?} a
     * @param {?} b
     * @return {?}
     */
    (a, b) => this.actionFailed(a, b))) {
        /** @type {?} */
        const params = this.parseParams(parameters);
        this.ngxSmartModalService.getModal('waitModal').open();
        this.reachServer(httpMethod, apiURL + params)
            .subscribe((/**
         * @param {?} a
         * @return {?}
         */
        (a) => successMethod(a)), (/**
         * @param {?} err
         * @return {?}
         */
        (err) => failMethod(name, err)));
    }
    /**
     * @private
     * @param {?} method
     * @param {?} apiUrl
     * @param {?=} data
     * @return {?}
     */
    reachServer(method, apiUrl, data = {}) {
        switch (method.toLowerCase()) {
            case 'get':
                return this.http.get(this.tree.config.baseURL + apiUrl);
            case 'post':
                return this.http.post(this.tree.config.baseURL + apiUrl, data);
            case 'delete':
                return this.http.delete(this.tree.config.baseURL + apiUrl);
            case 'download':
                window.open(this.tree.config.baseURL + apiUrl, '_blank');
                return null;
            default:
                console.warn('[NodeClickedService] Incorrect params for this side-effect');
                return null;
        }
    }
    /**
     * @private
     * @param {?} params
     * @return {?}
     */
    parseParams(params) {
        /** @type {?} */
        let query = '?';
        Object.keys(params).filter((/**
         * @param {?} item
         * @return {?}
         */
        item => params[item] !== null)).map((/**
         * @param {?} key
         * @return {?}
         */
        key => {
            query += key + '=' + params[key] + '&';
        }));
        return query.slice(0, -1);
    }
    /**
     * @private
     * @return {?}
     */
    successWithModalClose() {
        this.actionSuccess();
        document.getElementById('side-view').classList.remove('selected');
    }
    /**
     * @private
     * @param {?} input
     * @param {?} data
     * @return {?}
     */
    searchSuccess(input, data) {
        /** @type {?} */
        const obj = {
            searchString: input,
            response: data
        };
        this.actionSuccess();
        this.ngxSmartModalService.setModalData(obj, 'searchModal', true);
        this.ngxSmartModalService.getModal('searchModal').open();
    }
    /**
     * @private
     * @param {?=} response
     * @return {?}
     */
    actionSuccess(response = '') {
        document.body.classList.remove('dialog-open');
        this.nodeService.refreshCurrentPath();
        this.ngxSmartModalService.getModal('waitModal').close();
    }
    /**
     * @private
     * @param {?} name
     * @param {?} error
     * @return {?}
     */
    actionFailed(name, error) {
        document.body.classList.remove('dialog-open');
        this.ngxSmartModalService.getModal('waitModal').close();
        this.ngxSmartModalService.getModal('errorModal').open();
        console.warn('[NodeClickedService] Action "' + name + '" failed', error);
    }
}
NodeClickedService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] },
];
NodeClickedService.ctorParameters = () => [
    { type: NgxSmartModalService },
    { type: NodeService },
    { type: Store },
    { type: HttpClient }
];
/** @nocollapse */ NodeClickedService.ngInjectableDef = i0.defineInjectable({ factory: function NodeClickedService_Factory() { return new NodeClickedService(i0.inject(i1.NgxSmartModalService), i0.inject(i2.NodeService), i0.inject(i3.Store), i0.inject(i4.HttpClient)); }, token: NodeClickedService, providedIn: "root" });
if (false) {
    /** @type {?} */
    NodeClickedService.prototype.tree;
    /** @type {?} */
    NodeClickedService.prototype.ngxSmartModalService;
    /**
     * @type {?}
     * @private
     */
    NodeClickedService.prototype.nodeService;
    /**
     * @type {?}
     * @private
     */
    NodeClickedService.prototype.store;
    /**
     * @type {?}
     * @private
     */
    NodeClickedService.prototype.http;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZS1jbGlja2VkLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZzYtZmlsZS1tYW4vIiwic291cmNlcyI6WyJmaWxlLW1hbmFnZXIvc2VydmljZXMvbm9kZS1jbGlja2VkLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFFekMsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRTNDLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUVoRCxPQUFPLEVBQUMsb0JBQW9CLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUVyRCxPQUFPLEVBQUMsS0FBSyxFQUFDLE1BQU0sYUFBYSxDQUFDOzs7Ozs7QUFLbEMsTUFBTTs7Ozs7OztJQUdKLFlBQ1Msb0JBQTBDLEVBQ3pDLFdBQXdCLEVBQ3hCLEtBQXNCLEVBQ3RCLElBQWdCO1FBSGpCLHlCQUFvQixHQUFwQixvQkFBb0IsQ0FBc0I7UUFDekMsZ0JBQVcsR0FBWCxXQUFXLENBQWE7UUFDeEIsVUFBSyxHQUFMLEtBQUssQ0FBaUI7UUFDdEIsU0FBSSxHQUFKLElBQUksQ0FBWTtJQUUxQixDQUFDOzs7OztJQUVNLGFBQWEsQ0FBQyxJQUFtQjs7Y0FDaEMsVUFBVSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEVBQUUsRUFBQyxDQUFDO1FBQ3BELElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxZQUFZLEdBQUcsVUFBVSxDQUFDLENBQUM7SUFDL0UsQ0FBQzs7Ozs7SUFFTSxVQUFVLENBQUMsSUFBbUI7UUFDbkMsSUFBSSxDQUFDLGdCQUFnQixDQUNuQixRQUFRLEVBQ1IsRUFBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEVBQUUsRUFBQyxFQUNmLFFBQVEs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ZXNDb250ZW50IjpbImltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7Tm9kZUludGVyZmFjZX0gZnJvbSAnLi4vaW50ZXJmYWNlcy9ub2RlLmludGVyZmFjZSc7XHJcbmltcG9ydCB7Tm9kZVNlcnZpY2V9IGZyb20gJy4vbm9kZS5zZXJ2aWNlJztcclxuaW1wb3J0IHtUcmVlTW9kZWx9IGZyb20gJy4uL21vZGVscy90cmVlLm1vZGVsJztcclxuaW1wb3J0IHtIdHRwQ2xpZW50fSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7T2JzZXJ2YWJsZX0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7Tmd4U21hcnRNb2RhbFNlcnZpY2V9IGZyb20gJ25neC1zbWFydC1tb2RhbCc7XHJcbmltcG9ydCB7QXBwU3RvcmV9IGZyb20gJy4uL3JlZHVjZXJzL3JlZHVjZXIuZmFjdG9yeSc7XHJcbmltcG9ydCB7U3RvcmV9IGZyb20gJ0BuZ3J4L3N0b3JlJztcclxuXHJcbkBJbmplY3RhYmxlKHtcclxuICBwcm92aWRlZEluOiAncm9vdCdcclxufSlcclxuZXhwb3J0IGNsYXNzIE5vZGVDbGlja2VkU2VydmljZSB7XHJcbiAgcHVibGljIHRyZWU6IFRyZWVNb2RlbDtcclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwdWJsaWMgbmd4U21hcnRNb2RhbFNlcnZpY2U6IE5neFNtYXJ0TW9kYWxTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSBub2RlU2VydmljZTogTm9kZVNlcnZpY2UsXHJcbiAgICBwcml2YXRlIHN0b3JlOiBTdG9yZTxBcHBTdG9yZT4sXHJcbiAgICBwcml2YXRlIGh0dHA6IEh0dHBDbGllbnRcclxuICApIHtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBzdGFydERvd25sb2FkKG5vZGU6IE5vZGVJbnRlcmZhY2UpOiB2b2lkIHtcclxuICAgIGNvbnN0IHBhcmFtZXRlcnMgPSB0aGlzLnBhcnNlUGFyYW1zKHtwYXRoOiBub2RlLmlkfSk7XHJcbiAgICB0aGlzLnJlYWNoU2VydmVyKCdkb3dubG9hZCcsIHRoaXMudHJlZS5jb25maWcuYXBpLmRvd25sb2FkRmlsZSArIHBhcmFtZXRlcnMpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGluaXREZWxldGUobm9kZTogTm9kZUludGVyZmFjZSk6IHZvaWQge1xyXG4gICAgdGhpcy5zaWRlRWZmZWN0SGVscGVyKFxyXG4gICAgICAnRGVsZXRlJyxcclxuICAgICAge3BhdGg6IG5vZGUuaWR9LFxyXG4gICAgICAnZGVsZXRlJyxcclxuICAgICAgdGhpcy50cmVlLmNvbmZpZy5hcGkuZGVsZXRlRmlsZSxcclxuICAgICAgKCkgPT4gdGhpcy5zdWNjZXNzV2l0aE1vZGFsQ2xvc2UoKVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBzZWFyY2hGb3JTdHJpbmcoaW5wdXQ6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgdGhpcy5zaWRlRWZmZWN0SGVscGVyKFxyXG4gICAgICAnU2VhcmNoJyxcclxuICAgICAge3F1ZXJ5OiBpbnB1dH0sXHJcbiAgICAgICdnZXQnLFxyXG4gICAgICB0aGlzLnRyZWUuY29uZmlnLmFwaS5zZWFyY2hGaWxlcyxcclxuICAgICAgKHJlcykgPT4gdGhpcy5zZWFyY2hTdWNjZXNzKGlucHV0LCByZXMpXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGNyZWF0ZUZvbGRlcihjdXJyZW50UGFyZW50OiBudW1iZXIsIG5ld0Rpck5hbWU6IHN0cmluZykge1xyXG4gICAgdGhpcy5zaWRlRWZmZWN0SGVscGVyKFxyXG4gICAgICAnQ3JlYXRlIEZvbGRlcicsXHJcbiAgICAgIHtkaXJOYW1lOiBuZXdEaXJOYW1lLCBwYXJlbnRQYXRoOiBjdXJyZW50UGFyZW50ID09PSAwID8gbnVsbCA6IGN1cnJlbnRQYXJlbnR9LFxyXG4gICAgICAncG9zdCcsXHJcbiAgICAgIHRoaXMudHJlZS5jb25maWcuYXBpLmNyZWF0ZUZvbGRlclxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyByZW5hbWUoaWQ6IG51bWJlciwgbmV3TmFtZTogc3RyaW5nKSB7XHJcbiAgICB0aGlzLnNpZGVFZmZlY3RIZWxwZXIoXHJcbiAgICAgICdSZW5hbWUnLFxyXG4gICAgICB7cGF0aDogaWQsIG5ld05hbWU6IG5ld05hbWV9LFxyXG4gICAgICAncG9zdCcsXHJcbiAgICAgIHRoaXMudHJlZS5jb25maWcuYXBpLnJlbmFtZUZpbGUsXHJcbiAgICAgICgpID0+IHRoaXMuc3VjY2Vzc1dpdGhNb2RhbENsb3NlKClcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHNpZGVFZmZlY3RIZWxwZXIobmFtZTogc3RyaW5nLCBwYXJhbWV0ZXJzOiB7fSwgaHR0cE1ldGhvZDogc3RyaW5nLCBhcGlVUkw6IHN0cmluZyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2Vzc01ldGhvZCA9IChhKSA9PiB0aGlzLmFjdGlvblN1Y2Nlc3MoYSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGZhaWxNZXRob2QgPSAoYSwgYikgPT4gdGhpcy5hY3Rpb25GYWlsZWQoYSwgYilcclxuICApIHtcclxuICAgIGNvbnN0IHBhcmFtcyA9IHRoaXMucGFyc2VQYXJhbXMocGFyYW1ldGVycyk7XHJcblxyXG4gICAgdGhpcy5uZ3hTbWFydE1vZGFsU2VydmljZS5nZXRNb2RhbCgnd2FpdE1vZGFsJykub3BlbigpO1xyXG5cclxuICAgIHRoaXMucmVhY2hTZXJ2ZXIoaHR0cE1ldGhvZCwgYXBpVVJMICsgcGFyYW1zKVxyXG4gICAgICAuc3Vic2NyaWJlKFxyXG4gICAgICAgIChhKSA9PiBzdWNjZXNzTWV0aG9kKGEpLFxyXG4gICAgICAgIChlcnIpID0+IGZhaWxNZXRob2QobmFtZSwgZXJyKVxyXG4gICAgICApO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSByZWFjaFNlcnZlcihtZXRob2Q6IHN0cmluZywgYXBpVXJsOiBzdHJpbmcsIGRhdGE6IGFueSA9IHt9KTogT2JzZXJ2YWJsZTxPYmplY3Q+IHtcclxuICAgIHN3aXRjaCAobWV0aG9kLnRvTG93ZXJDYXNlKCkpIHtcclxuICAgICAgY2FzZSAnZ2V0JzpcclxuICAgICAgICByZXR1cm4gdGhpcy5odHRwLmdldCh0aGlzLnRyZWUuY29uZmlnLmJhc2VVUkwgKyBhcGlVcmwpO1xyXG4gICAgICBjYXNlICdwb3N0JzpcclxuICAgICAgICByZXR1cm4gdGhpcy5odHRwLnBvc3QodGhpcy50cmVlLmNvbmZpZy5iYXNlVVJMICsgYXBpVXJsLCBkYXRhKTtcclxuICAgICAgY2FzZSAnZGVsZXRlJzpcclxuICAgICAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZSh0aGlzLnRyZWUuY29uZmlnLmJhc2VVUkwgKyBhcGlVcmwpO1xyXG4gICAgICBjYXNlICdkb3dubG9hZCc6XHJcbiAgICAgICAgd2luZG93Lm9wZW4odGhpcy50cmVlLmNvbmZpZy5iYXNlVVJMICsgYXBpVXJsLCAnX2JsYW5rJyk7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgY29uc29sZS53YXJuKCdbTm9kZUNsaWNrZWRTZXJ2aWNlXSBJbmNvcnJlY3QgcGFyYW1zIGZvciB0aGlzIHNpZGUtZWZmZWN0Jyk7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHBhcnNlUGFyYW1zKHBhcmFtczoge30pOiBzdHJpbmcge1xyXG4gICAgbGV0IHF1ZXJ5ID0gJz8nO1xyXG5cclxuICAgIE9iamVjdC5rZXlzKHBhcmFtcykuZmlsdGVyKGl0ZW0gPT4gcGFyYW1zW2l0ZW1dICE9PSBudWxsKS5tYXAoa2V5ID0+IHtcclxuICAgICAgcXVlcnkgKz0ga2V5ICsgJz0nICsgcGFyYW1zW2tleV0gKyAnJic7XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gcXVlcnkuc2xpY2UoMCwgLTEpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBzdWNjZXNzV2l0aE1vZGFsQ2xvc2UoKSB7XHJcbiAgICB0aGlzLmFjdGlvblN1Y2Nlc3MoKTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzaWRlLXZpZXcnKS5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZCcpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBzZWFyY2hTdWNjZXNzKGlucHV0OiBzdHJpbmcsIGRhdGE6IGFueSkge1xyXG4gICAgY29uc3Qgb2JqID0ge1xyXG4gICAgICBzZWFyY2hTdHJpbmc6IGlucHV0LFxyXG4gICAgICByZXNwb25zZTogZGF0YVxyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLmFjdGlvblN1Y2Nlc3MoKTtcclxuXHJcbiAgICB0aGlzLm5neFNtYXJ0TW9kYWxTZXJ2aWNlLnNldE1vZGFsRGF0YShvYmosICdzZWFyY2hNb2RhbCcsIHRydWUpO1xyXG4gICAgdGhpcy5uZ3hTbWFydE1vZGFsU2VydmljZS5nZXRNb2RhbCgnc2VhcmNoTW9kYWwnKS5vcGVuKCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFjdGlvblN1Y2Nlc3MocmVzcG9uc2U6IHN0cmluZyA9ICcnKSB7XHJcbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ2RpYWxvZy1vcGVuJyk7XHJcblxyXG4gICAgdGhpcy5ub2RlU2VydmljZS5yZWZyZXNoQ3VycmVudFBhdGgoKTtcclxuICAgIHRoaXMubmd4U21hcnRNb2RhbFNlcnZpY2UuZ2V0TW9kYWwoJ3dhaXRNb2RhbCcpLmNsb3NlKCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFjdGlvbkZhaWxlZChuYW1lOiBzdHJpbmcsIGVycm9yOiBhbnkpIHtcclxuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZSgnZGlhbG9nLW9wZW4nKTtcclxuXHJcbiAgICB0aGlzLm5neFNtYXJ0TW9kYWxTZXJ2aWNlLmdldE1vZGFsKCd3YWl0TW9kYWwnKS5jbG9zZSgpO1xyXG4gICAgdGhpcy5uZ3hTbWFydE1vZGFsU2VydmljZS5nZXRNb2RhbCgnZXJyb3JNb2RhbCcpLm9wZW4oKTtcclxuICAgIGNvbnNvbGUud2FybignW05vZGVDbGlja2VkU2VydmljZV0gQWN0aW9uIFwiJyArIG5hbWUgKyAnXCIgZmFpbGVkJywgZXJyb3IpO1xyXG4gIH1cclxufVxyXG4iXX0=