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
var NodeClickedService = /** @class */ (function () {
    function NodeClickedService(ngxSmartModalService, nodeService, store, http) {
        this.ngxSmartModalService = ngxSmartModalService;
        this.nodeService = nodeService;
        this.store = store;
        this.http = http;
    }
    /**
     * @param {?} node
     * @return {?}
     */
    NodeClickedService.prototype.startDownload = /**
     * @param {?} node
     * @return {?}
     */
    function (node) {
        /** @type {?} */
        var parameters = this.parseParams({ path: node.id });
        this.reachServer('download', this.tree.config.api.downloadFile + parameters);
    };
    /**
     * @param {?} node
     * @return {?}
     */
    NodeClickedService.prototype.initDelete = /**
     * @param {?} node
     * @return {?}
     */
    function (node) {
        var _this = this;
        this.sideEffectHelper('Delete', { path: node.id }, 'delete', this.tree.config.api.deleteFile, (/**
         * @return {?}
         */
        function () { return _this.successWithModalClose(); }));
    };
    /**
     * @param {?} input
     * @return {?}
     */
    NodeClickedService.prototype.searchForString = /**
     * @param {?} input
     * @return {?}
     */
    function (input) {
        var _this = this;
        this.sideEffectHelper('Search', { query: input }, 'get', this.tree.config.api.searchFiles, (/**
         * @param {?} res
         * @return {?}
         */
        function (res) { return _this.searchSuccess(input, res); }));
    };
    /**
     * @param {?} currentParent
     * @param {?} newDirName
     * @return {?}
     */
    NodeClickedService.prototype.createFolder = /**
     * @param {?} currentParent
     * @param {?} newDirName
     * @return {?}
     */
    function (currentParent, newDirName) {
        this.sideEffectHelper('Create Folder', { dirName: newDirName, parentPath: currentParent === 0 ? null : currentParent }, 'post', this.tree.config.api.createFolder);
    };
    /**
     * @param {?} id
     * @param {?} newName
     * @return {?}
     */
    NodeClickedService.prototype.rename = /**
     * @param {?} id
     * @param {?} newName
     * @return {?}
     */
    function (id, newName) {
        var _this = this;
        this.sideEffectHelper('Rename', { path: id, newName: newName }, 'post', this.tree.config.api.renameFile, (/**
         * @return {?}
         */
        function () { return _this.successWithModalClose(); }));
    };
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
    NodeClickedService.prototype.sideEffectHelper = /**
     * @private
     * @param {?} name
     * @param {?} parameters
     * @param {?} httpMethod
     * @param {?} apiURL
     * @param {?=} successMethod
     * @param {?=} failMethod
     * @return {?}
     */
    function (name, parameters, httpMethod, apiURL, successMethod, failMethod) {
        var _this = this;
        if (successMethod === void 0) { successMethod = (/**
         * @param {?} a
         * @return {?}
         */
        function (a) { return _this.actionSuccess(a); }); }
        if (failMethod === void 0) { failMethod = (/**
         * @param {?} a
         * @param {?} b
         * @return {?}
         */
        function (a, b) { return _this.actionFailed(a, b); }); }
        /** @type {?} */
        var params = this.parseParams(parameters);
        this.ngxSmartModalService.getModal('waitModal').open();
        this.reachServer(httpMethod, apiURL + params)
            .subscribe((/**
         * @param {?} a
         * @return {?}
         */
        function (a) { return successMethod(a); }), (/**
         * @param {?} err
         * @return {?}
         */
        function (err) { return failMethod(name, err); }));
    };
    /**
     * @private
     * @param {?} method
     * @param {?} apiUrl
     * @param {?=} data
     * @return {?}
     */
    NodeClickedService.prototype.reachServer = /**
     * @private
     * @param {?} method
     * @param {?} apiUrl
     * @param {?=} data
     * @return {?}
     */
    function (method, apiUrl, data) {
        if (data === void 0) { data = {}; }
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
    };
    /**
     * @private
     * @param {?} params
     * @return {?}
     */
    NodeClickedService.prototype.parseParams = /**
     * @private
     * @param {?} params
     * @return {?}
     */
    function (params) {
        /** @type {?} */
        var query = '?';
        Object.keys(params).filter((/**
         * @param {?} item
         * @return {?}
         */
        function (item) { return params[item] !== null; })).map((/**
         * @param {?} key
         * @return {?}
         */
        function (key) {
            query += key + '=' + params[key] + '&';
        }));
        return query.slice(0, -1);
    };
    /**
     * @private
     * @return {?}
     */
    NodeClickedService.prototype.successWithModalClose = /**
     * @private
     * @return {?}
     */
    function () {
        this.actionSuccess();
        document.getElementById('side-view').classList.remove('selected');
    };
    /**
     * @private
     * @param {?} input
     * @param {?} data
     * @return {?}
     */
    NodeClickedService.prototype.searchSuccess = /**
     * @private
     * @param {?} input
     * @param {?} data
     * @return {?}
     */
    function (input, data) {
        /** @type {?} */
        var obj = {
            searchString: input,
            response: data
        };
        this.actionSuccess();
        this.ngxSmartModalService.setModalData(obj, 'searchModal', true);
        this.ngxSmartModalService.getModal('searchModal').open();
    };
    /**
     * @private
     * @param {?=} response
     * @return {?}
     */
    NodeClickedService.prototype.actionSuccess = /**
     * @private
     * @param {?=} response
     * @return {?}
     */
    function (response) {
        if (response === void 0) { response = ''; }
        document.body.classList.remove('dialog-open');
        this.nodeService.refreshCurrentPath();
        this.ngxSmartModalService.getModal('waitModal').close();
    };
    /**
     * @private
     * @param {?} name
     * @param {?} error
     * @return {?}
     */
    NodeClickedService.prototype.actionFailed = /**
     * @private
     * @param {?} name
     * @param {?} error
     * @return {?}
     */
    function (name, error) {
        document.body.classList.remove('dialog-open');
        this.ngxSmartModalService.getModal('waitModal').close();
        this.ngxSmartModalService.getModal('errorModal').open();
        console.warn('[NodeClickedService] Action "' + name + '" failed', error);
    };
    NodeClickedService.decorators = [
        { type: Injectable, args: [{
                    providedIn: 'root'
                },] },
    ];
    NodeClickedService.ctorParameters = function () { return [
        { type: NgxSmartModalService },
        { type: NodeService },
        { type: Store },
        { type: HttpClient }
    ]; };
    /** @nocollapse */ NodeClickedService.ngInjectableDef = i0.defineInjectable({ factory: function NodeClickedService_Factory() { return new NodeClickedService(i0.inject(i1.NgxSmartModalService), i0.inject(i2.NodeService), i0.inject(i3.Store), i0.inject(i4.HttpClient)); }, token: NodeClickedService, providedIn: "root" });
    return NodeClickedService;
}());
export { NodeClickedService };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZS1jbGlja2VkLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZzYtZmlsZS1tYW4vIiwic291cmNlcyI6WyJmaWxlLW1hbmFnZXIvc2VydmljZXMvbm9kZS1jbGlja2VkLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFFekMsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRTNDLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUVoRCxPQUFPLEVBQUMsb0JBQW9CLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUVyRCxPQUFPLEVBQUMsS0FBSyxFQUFDLE1BQU0sYUFBYSxDQUFDOzs7Ozs7QUFFbEM7SUFNRSw0QkFDUyxvQkFBMEMsRUFDekMsV0FBd0IsRUFDeEIsS0FBc0IsRUFDdEIsSUFBZ0I7UUFIakIseUJBQW9CLEdBQXBCLG9CQUFvQixDQUFzQjtRQUN6QyxnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUN4QixVQUFLLEdBQUwsS0FBSyxDQUFpQjtRQUN0QixTQUFJLEdBQUosSUFBSSxDQUFZO0lBRTFCLENBQUM7Ozs7O0lBRU0sMENBQWE7Ozs7SUFBcEIsVUFBcUIsSUFBbUI7O1lBQ2hDLFVBQVUsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUMsQ0FBQztRQUNwRCxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsWUFBWSxHQUFHLFVBQVUsQ0FBQyxDQUFDO0lBQy9FLENBQUM7Ozs7O0lBRU0sdUNBQVU7Ozs7SUFBakIsVUFBa0IsSUFBbUI7UUFBckMsaUJBUUM7UUFQQyxJQUFJLENBQUMsZ0JBQWdCLENBQ25CLFFBQVEsRUFDUixFQUFDLElBQUksRUFBRSxJQUFJLENB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QyxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDeEQsT0FBTyxDQUFDLElBQUksQ0FBQywrQkFBK0IsR0FBRyxJQUFJLEdBQUcsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQzNFLENBQUM7O2dCQWxJRixVQUFVLFNBQUM7b0JBQ1YsVUFBVSxFQUFFLE1BQU07aUJBQ25COzs7Z0JBTk8sb0JBQW9CO2dCQUpwQixXQUFXO2dCQU1YLEtBQUs7Z0JBSkwsVUFBVTs7OzZCQUpsQjtDQTZJQyxBQW5JRCxJQW1JQztTQWhJWSxrQkFBa0I7OztJQUM3QixrQ0FBdUI7O0lBR3JCLGtEQUFpRDs7Ozs7SUFDakQseUNBQWdDOzs7OztJQUNoQyxtQ0FBOEI7Ozs7O0lBQzlCLGtDQUF3QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7Tm9kZUludGVyZmFjZX0gZnJvbSAnLi4vaW50ZXJmYWNlcy9ub2RlLmludGVyZmFjZSc7XHJcbmltcG9ydCB7Tm9kZVNlcnZpY2V9IGZyb20gJy4vbm9kZS5zZXJ2aWNlJztcclxuaW1wb3J0IHtUcmVlTW9kZWx9IGZyb20gJy4uL21vZGVscy90cmVlLm1vZGVsJztcclxuaW1wb3J0IHtIdHRwQ2xpZW50fSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7T2JzZXJ2YWJsZX0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7Tmd4U21hcnRNb2RhbFNlcnZpY2V9IGZyb20gJ25neC1zbWFydC1tb2RhbCc7XHJcbmltcG9ydCB7QXBwU3RvcmV9IGZyb20gJy4uL3JlZHVjZXJzL3JlZHVjZXIuZmFjdG9yeSc7XHJcbmltcG9ydCB7U3RvcmV9IGZyb20gJ0BuZ3J4L3N0b3JlJztcclxuXHJcbkBJbmplY3RhYmxlKHtcclxuICBwcm92aWRlZEluOiAncm9vdCdcclxufSlcclxuZXhwb3J0IGNsYXNzIE5vZGVDbGlja2VkU2VydmljZSB7XHJcbiAgcHVibGljIHRyZWU6IFRyZWVNb2RlbDtcclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwdWJsaWMgbmd4U21hcnRNb2RhbFNlcnZpY2U6IE5neFNtYXJ0TW9kYWxTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSBub2RlU2VydmljZTogTm9kZVNlcnZpY2UsXHJcbiAgICBwcml2YXRlIHN0b3JlOiBTdG9yZTxBcHBTdG9yZT4sXHJcbiAgICBwcml2YXRlIGh0dHA6IEh0dHBDbGllbnRcclxuICApIHtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBzdGFydERvd25sb2FkKG5vZGU6IE5vZGVJbnRlcmZhY2UpOiB2b2lkIHtcclxuICAgIGNvbnN0IHBhcmFtZXRlcnMgPSB0aGlzLnBhcnNlUGFyYW1zKHtwYXRoOiBub2RlLmlkfSk7XHJcbiAgICB0aGlzLnJlYWNoU2VydmVyKCdkb3dubG9hZCcsIHRoaXMudHJlZS5jb25maWcuYXBpLmRvd25sb2FkRmlsZSArIHBhcmFtZXRlcnMpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGluaXREZWxldGUobm9kZTogTm9kZUludGVyZmFjZSk6IHZvaWQge1xyXG4gICAgdGhpcy5zaWRlRWZmZWN0SGVscGVyKFxyXG4gICAgICAnRGVsZXRlJyxcclxuICAgICAge3BhdGg6IG5vZGUuaWR9LFxyXG4gICAgICAnZGVsZXRlJyxcclxuICAgICAgdGhpcy50cmVlLmNvbmZpZy5hcGkuZGVsZXRlRmlsZSxcclxuICAgICAgKCkgPT4gdGhpcy5zdWNjZXNzV2l0aE1vZGFsQ2xvc2UoKVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBzZWFyY2hGb3JTdHJpbmcoaW5wdXQ6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgdGhpcy5zaWRlRWZmZWN0SGVscGVyKFxyXG4gICAgICAnU2VhcmNoJyxcclxuICAgICAge3F1ZXJ5OiBpbnB1dH0sXHJcbiAgICAgICdnZXQnLFxyXG4gICAgICB0aGlzLnRyZWUuY29uZmlnLmFwaS5zZWFyY2hGaWxlcyxcclxuICAgICAgKHJlcykgPT4gdGhpcy5zZWFyY2hTdWNjZXNzKGlucHV0LCByZXMpXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGNyZWF0ZUZvbGRlcihjdXJyZW50UGFyZW50OiBudW1iZXIsIG5ld0Rpck5hbWU6IHN0cmluZykge1xyXG4gICAgdGhpcy5zaWRlRWZmZWN0SGVscGVyKFxyXG4gICAgICAnQ3JlYXRlIEZvbGRlcicsXHJcbiAgICAgIHtkaXJOYW1lOiBuZXdEaXJOYW1lLCBwYXJlbnRQYXRoOiBjdXJyZW50UGFyZW50ID09PSAwID8gbnVsbCA6IGN1cnJlbnRQYXJlbnR9LFxyXG4gICAgICAncG9zdCcsXHJcbiAgICAgIHRoaXMudHJlZS5jb25maWcuYXBpLmNyZWF0ZUZvbGRlclxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyByZW5hbWUoaWQ6IG51bWJlciwgbmV3TmFtZTogc3RyaW5nKSB7XHJcbiAgICB0aGlzLnNpZGVFZmZlY3RIZWxwZXIoXHJcbiAgICAgICdSZW5hbWUnLFxyXG4gICAgICB7cGF0aDogaWQsIG5ld05hbWU6IG5ld05hbWV9LFxyXG4gICAgICAncG9zdCcsXHJcbiAgICAgIHRoaXMudHJlZS5jb25maWcuYXBpLnJlbmFtZUZpbGUsXHJcbiAgICAgICgpID0+IHRoaXMuc3VjY2Vzc1dpdGhNb2RhbENsb3NlKClcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHNpZGVFZmZlY3RIZWxwZXIobmFtZTogc3RyaW5nLCBwYXJhbWV0ZXJzOiB7fSwgaHR0cE1ldGhvZDogc3RyaW5nLCBhcGlVUkw6IHN0cmluZyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2Vzc01ldGhvZCA9IChhKSA9PiB0aGlzLmFjdGlvblN1Y2Nlc3MoYSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGZhaWxNZXRob2QgPSAoYSwgYikgPT4gdGhpcy5hY3Rpb25GYWlsZWQoYSwgYilcclxuICApIHtcclxuICAgIGNvbnN0IHBhcmFtcyA9IHRoaXMucGFyc2VQYXJhbXMocGFyYW1ldGVycyk7XHJcblxyXG4gICAgdGhpcy5uZ3hTbWFydE1vZGFsU2VydmljZS5nZXRNb2RhbCgnd2FpdE1vZGFsJykub3BlbigpO1xyXG5cclxuICAgIHRoaXMucmVhY2hTZXJ2ZXIoaHR0cE1ldGhvZCwgYXBpVVJMICsgcGFyYW1zKVxyXG4gICAgICAuc3Vic2NyaWJlKFxyXG4gICAgICAgIChhKSA9PiBzdWNjZXNzTWV0aG9kKGEpLFxyXG4gICAgICAgIChlcnIpID0+IGZhaWxNZXRob2QobmFtZSwgZXJyKVxyXG4gICAgICApO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSByZWFjaFNlcnZlcihtZXRob2Q6IHN0cmluZywgYXBpVXJsOiBzdHJpbmcsIGRhdGE6IGFueSA9IHt9KTogT2JzZXJ2YWJsZTxPYmplY3Q+IHtcclxuICAgIHN3aXRjaCAobWV0aG9kLnRvTG93ZXJDYXNlKCkpIHtcclxuICAgICAgY2FzZSAnZ2V0JzpcclxuICAgICAgICByZXR1cm4gdGhpcy5odHRwLmdldCh0aGlzLnRyZWUuY29uZmlnLmJhc2VVUkwgKyBhcGlVcmwpO1xyXG4gICAgICBjYXNlICdwb3N0JzpcclxuICAgICAgICByZXR1cm4gdGhpcy5odHRwLnBvc3QodGhpcy50cmVlLmNvbmZpZy5iYXNlVVJMICsgYXBpVXJsLCBkYXRhKTtcclxuICAgICAgY2FzZSAnZGVsZXRlJzpcclxuICAgICAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZSh0aGlzLnRyZWUuY29uZmlnLmJhc2VVUkwgKyBhcGlVcmwpO1xyXG4gICAgICBjYXNlICdkb3dubG9hZCc6XHJcbiAgICAgICAgd2luZG93Lm9wZW4odGhpcy50cmVlLmNvbmZpZy5iYXNlVVJMICsgYXBpVXJsLCAnX2JsYW5rJyk7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgY29uc29sZS53YXJuKCdbTm9kZUNsaWNrZWRTZXJ2aWNlXSBJbmNvcnJlY3QgcGFyYW1zIGZvciB0aGlzIHNpZGUtZWZmZWN0Jyk7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHBhcnNlUGFyYW1zKHBhcmFtczoge30pOiBzdHJpbmcge1xyXG4gICAgbGV0IHF1ZXJ5ID0gJz8nO1xyXG5cclxuICAgIE9iamVjdC5rZXlzKHBhcmFtcykuZmlsdGVyKGl0ZW0gPT4gcGFyYW1zW2l0ZW1dICE9PSBudWxsKS5tYXAoa2V5ID0+IHtcclxuICAgICAgcXVlcnkgKz0ga2V5ICsgJz0nICsgcGFyYW1zW2tleV0gKyAnJic7XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gcXVlcnkuc2xpY2UoMCwgLTEpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBzdWNjZXNzV2l0aE1vZGFsQ2xvc2UoKSB7XHJcbiAgICB0aGlzLmFjdGlvblN1Y2Nlc3MoKTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzaWRlLXZpZXcnKS5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZCcpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBzZWFyY2hTdWNjZXNzKGlucHV0OiBzdHJpbmcsIGRhdGE6IGFueSkge1xyXG4gICAgY29uc3Qgb2JqID0ge1xyXG4gICAgICBzZWFyY2hTdHJpbmc6IGlucHV0LFxyXG4gICAgICByZXNwb25zZTogZGF0YVxyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLmFjdGlvblN1Y2Nlc3MoKTtcclxuXHJcbiAgICB0aGlzLm5neFNtYXJ0TW9kYWxTZXJ2aWNlLnNldE1vZGFsRGF0YShvYmosICdzZWFyY2hNb2RhbCcsIHRydWUpO1xyXG4gICAgdGhpcy5uZ3hTbWFydE1vZGFsU2VydmljZS5nZXRNb2RhbCgnc2VhcmNoTW9kYWwnKS5vcGVuKCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFjdGlvblN1Y2Nlc3MocmVzcG9uc2U6IHN0cmluZyA9ICcnKSB7XHJcbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ2RpYWxvZy1vcGVuJyk7XHJcblxyXG4gICAgdGhpcy5ub2RlU2VydmljZS5yZWZyZXNoQ3VycmVudFBhdGgoKTtcclxuICAgIHRoaXMubmd4U21hcnRNb2RhbFNlcnZpY2UuZ2V0TW9kYWwoJ3dhaXRNb2RhbCcpLmNsb3NlKCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFjdGlvbkZhaWxlZChuYW1lOiBzdHJpbmcsIGVycm9yOiBhbnkpIHtcclxuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZSgnZGlhbG9nLW9wZW4nKTtcclxuXHJcbiAgICB0aGlzLm5neFNtYXJ0TW9kYWxTZXJ2aWNlLmdldE1vZGFsKCd3YWl0TW9kYWwnKS5jbG9zZSgpO1xyXG4gICAgdGhpcy5uZ3hTbWFydE1vZGFsU2VydmljZS5nZXRNb2RhbCgnZXJyb3JNb2RhbCcpLm9wZW4oKTtcclxuICAgIGNvbnNvbGUud2FybignW05vZGVDbGlja2VkU2VydmljZV0gQWN0aW9uIFwiJyArIG5hbWUgKyAnXCIgZmFpbGVkJywgZXJyb3IpO1xyXG4gIH1cclxufVxyXG4iXX0=