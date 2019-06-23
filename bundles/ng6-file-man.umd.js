(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('rxjs'), require('@angular/common/http'), require('@ngrx/store'), require('ngx-smart-modal'), require('rxjs/operators'), require('@biesbjerg/ngx-translate-extract/dist/utils/utils'), require('fine-uploader'), require('@angular/common')) :
    typeof define === 'function' && define.amd ? define('ng6-file-man', ['exports', '@angular/core', 'rxjs', '@angular/common/http', '@ngrx/store', 'ngx-smart-modal', 'rxjs/operators', '@biesbjerg/ngx-translate-extract/dist/utils/utils', 'fine-uploader', '@angular/common'], factory) :
    (factory((global['ng6-file-man'] = {}),global.ng.core,global.rxjs,global.ng.common.http,null,null,global.rxjs.operators,null,null,global.ng.common));
}(this, (function (exports,i0,rxjs,i4,i3,i1,operators,utils,fineUploader,common) { 'use strict';

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /** @type {?} */
    var SET_PATH = 'SET_PATH';
    /** @type {?} */
    var SET_LOADING_STATE = 'SET_LOADING_STATE';
    /** @type {?} */
    var SET_SELECTED_NODE = 'SET_SELECTED_NODE';

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var NodeService = (function () {
        function NodeService(http, store) {
            var _this = this;
            this.http = http;
            this.store = store;
            this.getNodesFromServer = (function (path) {
                /** @type {?} */
                var folderId = _this.findNodeByPath(path).id;
                folderId = folderId === 0 ? '' : folderId;
                return _this.http.get(_this.tree.config.baseURL + _this.tree.config.api.listFile, { params: new i4.HttpParams().set('parentPath', folderId) });
            });
        }
        // todo ask server to get parent structure
        // todo ask server to get parent structure
        /**
         * @param {?} path
         * @return {?}
         */
        NodeService.prototype.startManagerAt =
            // todo ask server to get parent structure
            /**
             * @param {?} path
             * @return {?}
             */
            function (path) {
                this.store.dispatch({ type: SET_PATH, payload: path });
            };
        /**
         * @return {?}
         */
        NodeService.prototype.refreshCurrentPath = /**
         * @return {?}
         */
            function () {
                this.findNodeByPath(this.currentPath).children = {};
                this.getNodes(this.currentPath);
            };
        /**
         * @param {?} path
         * @return {?}
         */
        NodeService.prototype.getNodes = /**
         * @param {?} path
         * @return {?}
         */
            function (path) {
                var _this = this;
                this.parseNodes(path).subscribe((function (data) {
                    for (var i = 0; i < data.length; i++) {
                        /** @type {?} */
                        var parentPath = _this.getParentPath(data[i].pathToNode);
                        _this.findNodeByPath(parentPath).children[data[i].name] = data[i];
                    }
                }));
            };
        /**
         * @private
         * @param {?} path
         * @return {?}
         */
        NodeService.prototype.getParentPath = /**
         * @private
         * @param {?} path
         * @return {?}
         */
            function (path) {
                /** @type {?} */
                var parentPath = path.split('/');
                parentPath = parentPath.slice(0, parentPath.length - 1);
                return parentPath.join('/');
            };
        /**
         * @private
         * @param {?} path
         * @return {?}
         */
        NodeService.prototype.parseNodes = /**
         * @private
         * @param {?} path
         * @return {?}
         */
            function (path) {
                var _this = this;
                return new rxjs.Observable((function (observer) {
                    _this.getNodesFromServer(path).subscribe((function (data) {
                        observer.next(data.map((function (node) { return _this.createNode(path, node); })));
                        _this.store.dispatch({ type: SET_LOADING_STATE, payload: false });
                    }));
                }));
            };
        /**
         * @private
         * @param {?} path
         * @param {?} node
         * @return {?}
         */
        NodeService.prototype.createNode = /**
         * @private
         * @param {?} path
         * @param {?} node
         * @return {?}
         */
            function (path, node) {
                if (node.path[0] !== '/') {
                    console.warn('[Node Service] Server should return initial path with "/"');
                    node.path = '/' + node.path;
                }
                /** @type {?} */
                var ids = node.path.split('/');
                if (ids.length > 2 && ids[ids.length - 1] === '') {
                    ids.splice(-1, 1);
                    node.path = ids.join('/');
                }
                /** @type {?} */
                var cachedNode = this.findNodeByPath(node.path);
                return (({
                    id: node.id,
                    isFolder: node.dir,
                    isExpanded: cachedNode ? cachedNode.isExpanded : false,
                    pathToNode: node.path,
                    pathToParent: this.getParentPath(node.path),
                    name: node.name || node.id,
                    children: cachedNode ? cachedNode.children : {}
                }));
            };
        /**
         * @param {?} nodePath
         * @return {?}
         */
        NodeService.prototype.findNodeByPath = /**
         * @param {?} nodePath
         * @return {?}
         */
            function (nodePath) {
                /** @type {?} */
                var ids = nodePath.split('/');
                ids.splice(0, 1);
                return ids.length === 0 ? this.tree.nodes : ids.reduce((function (value, index) { return value['children'][index]; }), this.tree.nodes);
            };
        /**
         * @param {?} id
         * @return {?}
         */
        NodeService.prototype.findNodeById = /**
         * @param {?} id
         * @return {?}
         */
            function (id) {
                /** @type {?} */
                var result = this.findNodeByIdHelper(id);
                if (result === null) {
                    console.warn('[Node Service] Cannot find node by id. Id not existing or not fetched. Returning root.');
                    return this.tree.nodes;
                }
                return result;
            };
        /**
         * @param {?} id
         * @param {?=} node
         * @return {?}
         */
        NodeService.prototype.findNodeByIdHelper = /**
         * @param {?} id
         * @param {?=} node
         * @return {?}
         */
            function (id, node) {
                if (node === void 0) {
                    node = this.tree.nodes;
                }
                if (node.id === id)
                    return node;
                /** @type {?} */
                var keys = Object.keys(node.children);
                for (var i = 0; i < keys.length; i++) {
                    if (typeof node.children[keys[i]] == 'object') {
                        /** @type {?} */
                        var obj = this.findNodeByIdHelper(id, node.children[keys[i]]);
                        if (obj != null)
                            return obj;
                    }
                }
                return null;
            };
        /**
         * @param {?} node
         * @return {?}
         */
        NodeService.prototype.foldRecursively = /**
         * @param {?} node
         * @return {?}
         */
            function (node) {
                var _this = this;
                // console.log('folding ', node);
                /** @type {?} */
                var children = node.children;
                Object.keys(children).map((function (child) {
                    if (!children.hasOwnProperty(child) || !children[child].isExpanded) {
                        return null;
                    }
                    _this.foldRecursively(children[child]);
                    //todo put this getElById into one func (curr inside node.component.ts + fm.component.ts) - this won't be maintainable
                    document.getElementById('tree_' + children[child].pathToNode).classList.add('deselected');
                    children[child].isExpanded = false;
                }));
            };
        /**
         * @return {?}
         */
        NodeService.prototype.foldAll = /**
         * @return {?}
         */
            function () {
                this.foldRecursively(this.tree.nodes);
            };
        Object.defineProperty(NodeService.prototype, "currentPath", {
            get: /**
             * @return {?}
             */ function () {
                return this._path;
            },
            set: /**
             * @param {?} value
             * @return {?}
             */ function (value) {
                this._path = value;
            },
            enumerable: true,
            configurable: true
        });
        NodeService.decorators = [
            { type: i0.Injectable, args: [{
                        providedIn: 'root'
                    },] },
        ];
        NodeService.ctorParameters = function () {
            return [
                { type: i4.HttpClient },
                { type: i3.Store }
            ];
        };
        /** @nocollapse */ NodeService.ngInjectableDef = i0.defineInjectable({ factory: function NodeService_Factory() { return new NodeService(i0.inject(i4.HttpClient), i0.inject(i3.Store)); }, token: NodeService, providedIn: "root" });
        return NodeService;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var NodeClickedService = (function () {
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
                this.sideEffectHelper('Delete', { path: node.id }, 'delete', this.tree.config.api.deleteFile, (function () { return _this.successWithModalClose(); }));
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
                this.sideEffectHelper('Search', { query: input }, 'get', this.tree.config.api.searchFiles, (function (res) { return _this.searchSuccess(input, res); }));
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
                this.sideEffectHelper('Rename', { path: id, newName: newName }, 'post', this.tree.config.api.renameFile, (function () { return _this.successWithModalClose(); }));
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
                if (successMethod === void 0) {
                    successMethod = (function (a) { return _this.actionSuccess(a); });
                }
                if (failMethod === void 0) {
                    failMethod = (function (a, b) { return _this.actionFailed(a, b); });
                }
                /** @type {?} */
                var params = this.parseParams(parameters);
                this.ngxSmartModalService.getModal('waitModal').open();
                this.reachServer(httpMethod, apiURL + params)
                    .subscribe((function (a) { return successMethod(a); }), (function (err) { return failMethod(name, err); }));
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
                if (data === void 0) {
                    data = {};
                }
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
                Object.keys(params).filter((function (item) { return params[item] !== null; })).map((function (key) {
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
                if (response === void 0) {
                    response = '';
                }
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
            { type: i0.Injectable, args: [{
                        providedIn: 'root'
                    },] },
        ];
        NodeClickedService.ctorParameters = function () {
            return [
                { type: i1.NgxSmartModalService },
                { type: NodeService },
                { type: i3.Store },
                { type: i4.HttpClient }
            ];
        };
        /** @nocollapse */ NodeClickedService.ngInjectableDef = i0.defineInjectable({ factory: function NodeClickedService_Factory() { return new NodeClickedService(i0.inject(i1.NgxSmartModalService), i0.inject(NodeService), i0.inject(i3.Store), i0.inject(i4.HttpClient)); }, token: NodeClickedService, providedIn: "root" });
        return NodeClickedService;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var FileManagerComponent = (function () {
        function FileManagerComponent(store, nodeService, nodeClickedService, ngxSmartModalService) {
            this.store = store;
            this.nodeService = nodeService;
            this.nodeClickedService = nodeClickedService;
            this.ngxSmartModalService = ngxSmartModalService;
            this.isPopup = false;
            this.itemClicked = new i0.EventEmitter();
            this.sideMenuClosed = true;
            this.fmOpen = false;
            this.newDialog = false;
        }
        /**
         * @return {?}
         */
        FileManagerComponent.prototype.ngOnInit = /**
         * @return {?}
         */
            function () {
                var _this = this;
                // @ts-ignore
                window.console = window.console || {};
                window.console.log = window.console.log || (function () {
                });
                this.nodeService.tree = this.tree;
                this.nodeClickedService.tree = this.tree;
                this.nodeService.startManagerAt(this.tree.currentPath);
                this.store
                    .pipe(i3.select((function (state) { return state.fileManagerState.isLoading; })))
                    .subscribe((function (data) {
                    _this.loading = data;
                }));
                this.store
                    .pipe(i3.select((function (state) { return state.fileManagerState.selectedNode; })))
                    .subscribe((function (node) {
                    if (!node) {
                        return;
                    }
                    // fixed highlighting error when closing node but not changing path
                    if ((node.isExpanded && node.pathToNode !== _this.nodeService.currentPath) && !node.stayOpen) {
                        return;
                    }
                    _this.handleFileManagerClickEvent({ type: 'select', node: node });
                }));
            };
        /**
         * @param {?} event
         * @return {?}
         */
        FileManagerComponent.prototype.onItemClicked = /**
         * @param {?} event
         * @return {?}
         */
            function (event) {
                this.itemClicked.emit(event);
            };
        /**
         * @param {?} data
         * @return {?}
         */
        FileManagerComponent.prototype.searchClicked = /**
         * @param {?} data
         * @return {?}
         */
            function (data) {
                // console.log(data);
                // console.log(data);
                /** @type {?} */
                var node = this.nodeService.findNodeById(data.id);
                this.ngxSmartModalService.getModal('searchModal').close();
                this.store.dispatch({ type: SET_SELECTED_NODE, payload: node });
            };
        /**
         * @param {?} event
         * @return {?}
         */
        FileManagerComponent.prototype.handleFileManagerClickEvent = /**
         * @param {?} event
         * @return {?}
         */
            function (event) {
                switch (event.type) {
                    case 'closeSideView':
                        return this.nodeClickHandler(event.node, true);
                    case 'select':
                        this.onItemClicked(event);
                        this.highlightSelected(event.node);
                        return this.nodeClickHandler(event.node);
                    case 'download':
                        this.nodeClickedService.startDownload(event.node);
                        return this.onItemClicked(event);
                    case 'renameConfirm':
                        return this.ngxSmartModalService.getModal('renameModal').open();
                    case 'rename':
                        this.ngxSmartModalService.getModal('renameModal').close();
                        this.nodeClickedService.rename(this.selectedNode.id, event.value);
                        return this.onItemClicked({
                            type: event.type,
                            node: this.selectedNode,
                            newName: event.value
                        });
                    case 'removeAsk':
                        return this.ngxSmartModalService.getModal('confirmDeleteModal').open();
                    case 'remove':
                        this.ngxSmartModalService.getModal('confirmDeleteModal').close();
                        this.nodeClickedService.initDelete(this.selectedNode);
                        return this.onItemClicked({
                            type: event.type,
                            node: this.selectedNode
                        });
                    case 'createFolder':
                        /** @type {?} */
                        var parentId = this.nodeService.findNodeByPath(this.nodeService.currentPath).id;
                        this.nodeClickedService.createFolder(parentId, event.payload);
                        return this.onItemClicked({
                            type: event.type,
                            parentId: parentId,
                            newDirName: event.payload
                        });
                }
            };
        /**
         * @param {?} node
         * @param {?=} closing
         * @return {?}
         */
        FileManagerComponent.prototype.nodeClickHandler = /**
         * @param {?} node
         * @param {?=} closing
         * @return {?}
         */
            function (node, closing) {
                if (node.name === 'root') {
                    return;
                }
                if (closing) {
                    /** @type {?} */
                    var parentNode = this.nodeService.findNodeByPath(this.nodeService.currentPath);
                    this.store.dispatch({ type: SET_SELECTED_NODE, payload: parentNode });
                    this.sideMenuClosed = true;
                }
                else {
                    if (this.selectedNode === node && this.sideMenuClosed)
                        this.sideMenuClosed = false;
                    else if (this.selectedNode === node && !this.sideMenuClosed)
                        this.sideMenuClosed = true;
                    else if (this.selectedNode !== node && this.sideMenuClosed)
                        this.sideMenuClosed = false;
                    else if (this.selectedNode !== node && !this.sideMenuClosed)
                        this.sideMenuClosed = false;
                }
                this.selectedNode = node;
                // todo investigate this workaround - warning: [File Manager] failed to find requested node for path: [path]
                if (!document.getElementById('side-view')) {
                    return;
                }
                if (this.sideMenuClosed) {
                    document.getElementById('side-view').classList.remove('selected');
                }
                else {
                    document.getElementById('side-view').classList.add('selected');
                }
            };
        // todo stay DRY!
        // todo stay DRY!
        /**
         * @param {?} node
         * @return {?}
         */
        FileManagerComponent.prototype.highlightSelected =
            // todo stay DRY!
            /**
             * @param {?} node
             * @return {?}
             */
            function (node) {
                /** @type {?} */
                var pathToNode = node.pathToNode;
                if (pathToNode.length === 0) {
                    pathToNode = 'root';
                }
                /** @type {?} */
                var treeElement = this.getElementById(pathToNode, 'tree_');
                /** @type {?} */
                var fcElement = this.getElementById(pathToNode, 'fc_');
                if (!treeElement && !fcElement) {
                    console.warn('[File Manager] failed to find requested node for path:', pathToNode);
                    return;
                }
                this.removeClass('highlighted');
                this.removeClass('light');
                if (fcElement)
                    this.highilghtChildElement(fcElement);
                if (treeElement)
                    this.highilghtChildElement(treeElement, true);
                // parent node highlight
                /** @type {?} */
                var pathToParent = node.pathToParent;
                if (pathToParent === null || node.pathToNode === this.nodeService.currentPath) {
                    return;
                }
                if (pathToParent.length === 0) {
                    pathToParent = 'root';
                }
                /** @type {?} */
                var parentElement = this.getElementById(pathToParent, 'tree_');
                if (!parentElement) {
                    console.warn('[File Manager] failed to find requested parent node for path:', pathToParent);
                    return;
                }
                this.highilghtChildElement(parentElement);
            };
        /**
         * @private
         * @param {?} el
         * @param {?=} light
         * @return {?}
         */
        FileManagerComponent.prototype.highilghtChildElement = /**
         * @private
         * @param {?} el
         * @param {?=} light
         * @return {?}
         */
            function (el, light) {
                if (light === void 0) {
                    light = false;
                }
                el.children[0] // appnode div wrapper
                    .children[0] // ng template first item
                    .classList.add('highlighted');
                if (light)
                    el.children[0]
                        .children[0]
                        .classList.add('light');
            };
        /**
         * @private
         * @param {?} id
         * @param {?=} prefix
         * @return {?}
         */
        FileManagerComponent.prototype.getElementById = /**
         * @private
         * @param {?} id
         * @param {?=} prefix
         * @return {?}
         */
            function (id, prefix) {
                if (prefix === void 0) {
                    prefix = '';
                }
                /** @type {?} */
                var fullId = prefix + id;
                return document.getElementById(fullId);
            };
        /**
         * @private
         * @param {?} className
         * @return {?}
         */
        FileManagerComponent.prototype.removeClass = /**
         * @private
         * @param {?} className
         * @return {?}
         */
            function (className) {
                Array.from(document.getElementsByClassName(className))
                    .map((function (el) { return el.classList.remove(className); }));
            };
        /**
         * @return {?}
         */
        FileManagerComponent.prototype.fmShowHide = /**
         * @return {?}
         */
            function () {
                this.fmOpen = !this.fmOpen;
            };
        /**
         * @return {?}
         */
        FileManagerComponent.prototype.backdropClicked = /**
         * @return {?}
         */
            function () {
                // todo get rid of this ugly workaround
                // todo fire userCanceledLoading event
                this.store.dispatch({ type: SET_LOADING_STATE, payload: false });
            };
        /**
         * @param {?} event
         * @return {?}
         */
        FileManagerComponent.prototype.handleUploadDialog = /**
         * @param {?} event
         * @return {?}
         */
            function (event) {
                this.newDialog = event;
            };
        FileManagerComponent.decorators = [
            { type: i0.Component, args: [{
                        selector: 'fm-file-manager',
                        template: "<ng-container *ngIf=\"isPopup; then itIsPopup else showContent\"></ng-container>\n\n<ng-template #itIsPopup>\n  <div *ngIf=\"!fmOpen\">\n    <button class=\"button big\" (click)=\"fmShowHide()\" translate=\"\">Open file manager</button>\n  </div>\n  <div class=\"file-manager-backdrop\" *ngIf=\"fmOpen\">\n    <div class=\"fmModalInside\">\n      <div *ngIf=\"fmOpen; then showContent\"></div>\n    </div>\n  </div>\n</ng-template>\n\n<ng-template #showContent>\n  <div class=\"content\">\n    <div class=\"file-manager-navbar\">\n      <div class=\"path\">\n        <app-nav-bar></app-nav-bar>\n      </div>\n\n      <div class=\"navigation\">\n        <app-navigation>\n          <div class=\"button close\" (click)=\"fmShowHide()\" *ngIf=\"isPopup\">\n            <i class=\"fas fa-2x fa-times\"></i>\n          </div>\n        </app-navigation>\n      </div>\n    </div>\n\n    <div class=\"holder\">\n      <div class=\"file-manager-left\">\n        <app-tree [treeModel]=\"tree\">\n          <ng-template let-nodes>\n            <ng-container [ngTemplateOutletContext]=\"{$implicit: nodes}\"\n                          [ngTemplateOutlet]=\"iconTemplate ? iconTemplate : defaultIconTemplate\">\n            </ng-container>\n          </ng-template>\n        </app-tree>\n      </div>\n\n      <div class=\"right\">\n        <app-folder-content\n          [treeModel]=\"tree\"\n          (openUploadDialog)=\"handleUploadDialog($event)\"\n          [folderContentTemplate]=\"folderContentTemplate ? folderContentTemplate : defaultFolderContentTemplate\"\n          [folderContentNewTemplate]=\"folderContentNewTemplate ? folderContentNewTemplate : defaultFolderContentNewTemplate\"\n          [folderContentBackTemplate]=\"folderContentBackTemplate ? folderContentBackTemplate : defaultFolderContentBackTemplate\">\n        </app-folder-content>\n      </div>\n\n      <app-side-view id=\"side-view\"\n                     [node]=\"selectedNode\"\n                     [sideViewTemplate]=\"sideViewTemplate ? sideViewTemplate : defaultSideViewTemplate\"\n                     [allowFolderDownload]=\"tree.config.options.allowFolderDownload\"\n                     (clickEvent)=\"handleFileManagerClickEvent($event)\">\n      </app-side-view>\n    </div>\n  </div>\n\n  <app-upload *ngIf=\"newDialog\"\n              [openDialog]=\"newDialog\"\n              (closeDialog)=\"handleUploadDialog(false)\"\n              (createDir)=\"handleFileManagerClickEvent({type: 'createFolder', payload: $event})\">\n  </app-upload>\n\n  <app-loading-overlay\n    *ngIf=\"loading\"\n    [loadingOverlayTemplate]=\"loadingOverlayTemplate ? loadingOverlayTemplate : defaultLoadingOverlayTemplate\">\n  </app-loading-overlay>\n</ng-template>\n\n<ng-template let-node #defaultIconTemplate>\n  <div class=\"file-manager-node\" style=\"display: inline-block; padding: 3px\">\n    <div *ngIf=\"node.isFolder; then itIsFolder else showFile\"></div>\n\n    <ng-template #itIsFolder>\n      <div *ngIf=\"node.isExpanded; then isFolderExpanded else isFolderClosed\"></div>\n    </ng-template>\n\n    <ng-template #showFile><i class=\"fas fa-file child\"></i></ng-template>\n    <ng-template #isFolderExpanded><i class=\"fas fa-folder-open child\"></i></ng-template>\n    <ng-template #isFolderClosed><i class=\"fas fa-folder child\"></i></ng-template>\n\n    <span>{{node.name}}</span>\n  </div>\n</ng-template>\n<ng-template let-node #defaultFolderContentTemplate>\n  <div class=\"file-manager-item\">\n    <div class=\"file-preview\">\n      <div *ngIf=\"node.isFolder; then itIsFolder else showFile\"></div>\n      <ng-template #itIsFolder><i class=\"fas fa-3x fa-folder child\"></i></ng-template>\n      <ng-template #showFile><i class=\"fas fa-3x fa-file child\"></i></ng-template>\n    </div>\n    <div class=\"file-name\">\n      {{node.name}}\n    </div>\n  </div>\n</ng-template>\n<ng-template #defaultFolderContentNewTemplate>\n  <div class=\"file-manager-item\">\n    <div class=\"file-preview\" style=\"width: 100%; height:100%\">\n      <i class=\"fas fa-3x fa-plus child\" style=\"line-height: 2\"></i>\n    </div>\n  </div>\n</ng-template>\n<ng-template let-node #defaultFolderContentBackTemplate>\n  <div class=\"file-manager-item\">\n    <div class=\"file-preview\" style=\"width: 100%; height:100%\">\n      <i class=\"fas fa-2x fa-ellipsis-h\" style=\"line-height: 5\"></i>\n    </div>\n  </div>\n</ng-template>\n<ng-template let-timeoutMessage #defaultLoadingOverlayTemplate>\n  <div class=\"file-manager-backdrop loading\" (click)=\"backdropClicked()\">\n    <div class=\"file-manager-error\" *ngIf=\"timeoutMessage\">{{timeoutMessage}}</div>\n  </div>\n  <div class=\"spinner\">\n    <i class=\"fas fa-5x fa-spin fa-sync-alt\"></i>\n  </div>\n</ng-template>\n<ng-template let-node #defaultSideViewTemplate>\n  <div style=\"position: absolute; bottom: 0; width: 100%; margin: 5px auto\">\n    <span *ngIf=\"node.isFolder\" translate>No data available for this folder</span>\n    <span *ngIf=\"!node.isFolder\" translate>No data available for this file</span>\n  </div>\n</ng-template>\n\n<ngx-smart-modal identifier=\"renameModal\" [dismissable]=\"false\" [closable]=\"false\" *ngIf=\"selectedNode\" #renameModal>\n  <h2 class=\"modal-title\" translate>\n    Rename file\n  </h2>\n  <p class=\"rename-name\" translate>\n    Old name\n  </p>\n  <span style=\"margin: 8px\">{{selectedNode.name}}</span>\n  <p class=\"rename-name\" translate>\n    New name\n  </p>\n  <input placeholder=\"New name\" type=\"text\" class=\"rename-input\" [value]=\"selectedNode.name\" #renameInput\n         (keyup.enter)=\"handleFileManagerClickEvent({type: 'rename', value: renameInput.value})\"\n         onclick=\"this.select();\">\n  <br>\n\n  <div class=\"rename-button\">\n    <button class=\"button big\" translate\n            (click)=\"handleFileManagerClickEvent({type: 'rename', value: renameInput.value})\"\n            [disabled]=\"renameInput.value === selectedNode.name || renameInput.value.length === 0\">\n      Rename\n    </button>\n    <button class=\"button big\" (click)=\"renameModal.close()\" translate>\n      Cancel\n    </button>\n  </div>\n\n</ngx-smart-modal>\n<ngx-smart-modal *ngIf=\"selectedNode\" identifier=\"confirmDeleteModal\" #deleteModal\n                 [dismissable]=\"false\" [closable]=\"false\">\n  <h2 class=\"modal-title\">\n    <span translate>You are trying to delete following </span>\n    <span *ngIf=\"selectedNode.isFolder\" translate>folder</span>\n    <span *ngIf=\"!selectedNode.isFolder\" translate>file</span>\n  </h2>\n\n  <div style=\"width: 100%; margin: 5px auto; text-align: center\">{{selectedNode.name}}</div>\n\n  <div class=\"rename-button\">\n    <button class=\"button big\" (click)=\"handleFileManagerClickEvent({type: 'remove'})\">\n      <span translate>Yes, delete this </span>\n      <span *ngIf=\"selectedNode.isFolder\" translate>folder</span>\n      <span *ngIf=\"!selectedNode.isFolder\" translate>file</span>\n    </button>\n    <button class=\"button big\" (click)=\"deleteModal.close()\" translate>\n      Cancel\n    </button>\n  </div>\n</ngx-smart-modal>\n<ngx-smart-modal identifier=\"searchModal\" #searchModal [closable]=\"true\">\n  <h2 class=\"modal-title\" style=\"margin-bottom: 2px\" translate\n      *ngIf=\"searchModal.hasData() && searchModal.getData().response.length !== 0\">\n    Search results for\n  </h2>\n  <h2 class=\"modal-title\" style=\"margin-bottom: 2px\" translate\n      *ngIf=\"!searchModal.hasData() || searchModal.getData().response.length === 0\">\n    No results found for\n  </h2>\n  <div style=\"text-align: center\" *ngIf=\"searchModal.hasData()\">{{searchModal.getData().searchString}}</div>\n\n  <div *ngIf=\"searchModal.hasData() && searchModal.getData().response.length !== 0\">\n    <table style=\"margin: 0 auto\">\n      <tr>\n        <td class=\"table-item table-head\" translate>File name</td>\n        <td class=\"table-item-short table-head\" translate>Size</td>\n      </tr>\n      <tr *ngFor=\"let item of searchModal.getData().response\" (click)=\"searchClicked(item)\">\n        <td style=\"cursor: pointer\">\n          <ng-container *ngIf=\"item.fileCategory === 'D'; else file\">\n            <i class=\"fas fa-folder search-output-icon\"></i>\n          </ng-container>\n          <ng-template #file>\n            <i class=\"fas fa-file search-output-icon\"></i>\n          </ng-template>\n          <span style=\"text-overflow: ellipsis\">{{item.name}}</span>\n        </td>\n        <td class=\"table-item-short\">{{item.size}}</td>\n      </tr>\n    </table>\n  </div>\n</ngx-smart-modal>\n<ngx-smart-modal identifier=\"waitModal\" [closable]=\"false\" [dismissable]=\"false\" [escapable]=\"false\">\n  <h2 class=\"modal-title\" style=\"margin-top: 20px\">\n    {{'Processing request'}}...\n  </h2>\n\n  <div style=\"text-align: center; height: 70px\">\n    <i class=\"fas fa-spinner fa-spin fa-4x\"></i>\n  </div>\n</ngx-smart-modal>\n<ngx-smart-modal identifier=\"errorModal\" [closable]=\"true\">\n  <h2 class=\"modal-title\" style=\"margin-top: 20px\">\n    {{'Something went wrong with your request'}}...\n  </h2>\n</ngx-smart-modal>\n",
                        styles: [".content{height:100%;min-width:850px}.holder{display:-webkit-flex;display:flex;height:calc(100% - 75px)}.path{margin:auto 0;display:block}.navigation{margin:auto 0;display:-webkit-flex;display:flex}.navigation .button{margin:0 10px;padding:0;position:relative}.right{width:100%;position:relative;overflow:auto}.file-name{width:100px;height:25px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;box-sizing:border-box;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.file-preview{margin:auto}.file-preview i{line-height:1.5}.spinner{position:absolute;top:50%;left:50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%);cursor:progress}.rename-button{margin:20px auto;display:block;text-align:center}.modal-title{margin-top:5px;text-align:center}.search-output{margin:15px 0}.search-output-icon{margin:2px 5px}.table-item{width:80%}.table-item-short{width:20%;text-align:right}"],
                        encapsulation: i0.ViewEncapsulation.None
                    },] },
        ];
        FileManagerComponent.ctorParameters = function () {
            return [
                { type: i3.Store },
                { type: NodeService },
                { type: NodeClickedService },
                { type: i1.NgxSmartModalService }
            ];
        };
        FileManagerComponent.propDecorators = {
            iconTemplate: [{ type: i0.Input }],
            folderContentTemplate: [{ type: i0.Input }],
            folderContentBackTemplate: [{ type: i0.Input }],
            folderContentNewTemplate: [{ type: i0.Input }],
            loadingOverlayTemplate: [{ type: i0.Input }],
            sideViewTemplate: [{ type: i0.Input }],
            tree: [{ type: i0.Input }],
            isPopup: [{ type: i0.Input }],
            itemClicked: [{ type: i0.Output }]
        };
        return FileManagerComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var FolderContentComponent = (function () {
        function FolderContentComponent(nodeService, store) {
            this.nodeService = nodeService;
            this.store = store;
            this.openUploadDialog = new i0.EventEmitter();
            this.obj = Object;
        }
        /**
         * @return {?}
         */
        FolderContentComponent.prototype.ngOnInit = /**
         * @return {?}
         */
            function () {
                var _this = this;
                this.store
                    .pipe(i3.select((function (state) { return state.fileManagerState.path; })))
                    .subscribe((function (path) {
                    _this.nodes = _this.nodeService.findNodeByPath(path);
                }));
            };
        /**
         * @return {?}
         */
        FolderContentComponent.prototype.newClickedAction = /**
         * @return {?}
         */
            function () {
                this.openUploadDialog.emit(true);
            };
        FolderContentComponent.decorators = [
            { type: i0.Component, args: [{
                        selector: 'app-folder-content',
                        template: "<div class=\"item-holder\">\n  <ng-container *ngIf=\"nodes.id !== 0\">\n    <app-node [node]=nodes id=\"{{nodes.pathToNode}}\">\n      <ng-container [ngTemplateOutletContext]=\"{$implicit: nodes}\"\n                    [ngTemplateOutlet]=\"folderContentBackTemplate\">\n      </ng-container>\n    </app-node>\n  </ng-container>\n\n  <ng-container *ngFor=\"let node of obj.keys(nodes.children)\">\n    <app-node [node]=\"nodes.children[node]\"\n              id=\"fc_{{nodes.children[node].pathToNode}}\">\n      <ng-container [ngTemplateOutletContext]=\"{$implicit: nodes.children[node]}\"\n                    [ngTemplateOutlet]=\"folderContentTemplate\">\n      </ng-container>\n    </app-node>\n  </ng-container>\n\n  <div class=\"new\" (click)=\"newClickedAction()\">\n    <ng-container [ngTemplateOutlet]=\"folderContentNewTemplate\"></ng-container>\n  </div>\n</div>\n",
                        styles: [".item-holder{box-sizing:border-box;display:-webkit-flex;display:flex;-webkit-flex-flow:wrap;flex-flow:wrap}.item-holder .new{display:inline}"]
                    },] },
        ];
        FolderContentComponent.ctorParameters = function () {
            return [
                { type: NodeService },
                { type: i3.Store }
            ];
        };
        FolderContentComponent.propDecorators = {
            folderContentTemplate: [{ type: i0.Input }],
            folderContentBackTemplate: [{ type: i0.Input }],
            folderContentNewTemplate: [{ type: i0.Input }],
            treeModel: [{ type: i0.Input }],
            openUploadDialog: [{ type: i0.Output }]
        };
        return FolderContentComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var TreeComponent = (function () {
        function TreeComponent(nodeService, store) {
            this.nodeService = nodeService;
            this.store = store;
            this.currentTreeLevel = '';
        }
        /**
         * @return {?}
         */
        TreeComponent.prototype.ngOnInit = /**
         * @return {?}
         */
            function () {
                var _this = this;
                this.nodes = this.treeModel.nodes;
                //todo move this store to proper place
                this.store
                    .pipe(i3.select((function (state) { return state.fileManagerState.path; })))
                    .subscribe((function (path) {
                    _this.nodeService.getNodes(path);
                    _this.currentTreeLevel = _this.treeModel.currentPath;
                    return _this.treeModel.currentPath = path;
                }));
            };
        /**
         * @return {?}
         */
        TreeComponent.prototype.ngAfterViewInit = /**
         * @return {?}
         */
            function () {
                var _this = this;
                this.store
                    .pipe(i3.select((function (state) { return state.fileManagerState.path; })))
                    .pipe(operators.first())
                    .subscribe((function (path) {
                    /** @type {?} */
                    var nodes = _this.nodeService.findNodeByPath(path);
                    _this.store.dispatch({ type: SET_SELECTED_NODE, payload: nodes });
                }));
            };
        TreeComponent.decorators = [
            { type: i0.Component, args: [{
                        selector: 'app-tree',
                        template: "<app-node-lister [showFiles]=\"treeModel.config.options.showFilesInsideTree\"\n                 [nodes]=\"{children: nodes}\">\n  <ng-template let-nodes>\n    <ng-container [ngTemplateOutletContext]=\"{$implicit: nodes}\" [ngTemplateOutlet]=\"templateRef\"></ng-container>\n  </ng-template>\n</app-node-lister>\n",
                        styles: [""]
                    },] },
        ];
        TreeComponent.ctorParameters = function () {
            return [
                { type: NodeService },
                { type: i3.Store }
            ];
        };
        TreeComponent.propDecorators = {
            templateRef: [{ type: i0.ContentChild, args: [i0.TemplateRef,] }],
            treeModel: [{ type: i0.Input }]
        };
        return TreeComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var NodeListerComponent = (function () {
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
            { type: i0.Component, args: [{
                        selector: 'app-node-lister',
                        template: "<ul class=\"node-lister-flist\">\n  <!--In order to avoid having to create that extra div, we can instead use ng-container directive-->\n  <ng-container *ngFor=\"let node of obj.keys(nodes)\">\n    <li class=\"node-lister-list-item\" *ngIf=\"nodes[node].isFolder || showFiles\">\n\n      <app-node class=\"node-lister-app-node\" [node]=\"nodes[node]\" id=\"tree_{{nodes[node].id === 0 ? 'root' : nodes[node].pathToNode}}\">\n        <ng-container [ngTemplateOutletContext]=\"{$implicit: (nodes[node])}\"\n                      [ngTemplateOutlet]=\"templateRef\">\n        </ng-container>\n      </app-node>\n\n      <app-node-lister class=\"node-lister\" *ngIf=\"obj.keys(nodes[node].children).length > 0\"\n                       [showFiles]=\"showFiles\" [nodes]=\"nodes[node].children\">\n        <ng-template let-nodes>\n          <ng-container [ngTemplateOutletContext]=\"{$implicit: (nodes)}\"\n                        [ngTemplateOutlet]=\"templateRef\">\n          </ng-container>\n        </ng-template>\n      </app-node-lister>\n    </li>\n  </ng-container>\n</ul>\n",
                        styles: [".node-lister-flist{margin:0 0 0 1em;padding:0;list-style:none;white-space:nowrap}.node-lister-list-item{list-style:none;line-height:1.2em;font-size:1em;display:inline}.node-lister-list-item .node-lister-app-node.deselected+.node-lister ul{display:none}"]
                    },] },
        ];
        NodeListerComponent.ctorParameters = function () { return []; };
        NodeListerComponent.propDecorators = {
            templateRef: [{ type: i0.ContentChild, args: [i0.TemplateRef,] }],
            nodes: [{ type: i0.Input }],
            showFiles: [{ type: i0.Input }]
        };
        return NodeListerComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var NodeComponent = (function () {
        function NodeComponent(store, nodeService, nodeClickedService) {
            this.store = store;
            this.nodeService = nodeService;
            this.nodeClickedService = nodeClickedService;
            this.isSingleClick = true;
        }
        /**
         * @param {?} event
         * @return {?}
         */
        NodeComponent.prototype.method1CallForClick = /**
         * @param {?} event
         * @return {?}
         */
            function (event) {
                var _this = this;
                event.preventDefault();
                this.isSingleClick = true;
                setTimeout((function () {
                    if (_this.isSingleClick) {
                        _this.showMenu();
                    }
                }), 200);
            };
        // todo event.preventDefault for double click
        // todo event.preventDefault for double click
        /**
         * @param {?} event
         * @return {?}
         */
        NodeComponent.prototype.method2CallForDblClick =
            // todo event.preventDefault for double click
            /**
             * @param {?} event
             * @return {?}
             */
            function (event) {
                event.preventDefault();
                this.isSingleClick = false;
                this.open();
            };
        /**
         * @return {?}
         */
        NodeComponent.prototype.ngOnInit = /**
         * @return {?}
         */
            function () {
            };
        /**
         * @private
         * @return {?}
         */
        NodeComponent.prototype.open = /**
         * @private
         * @return {?}
         */
            function () {
                if (!this.node.isFolder) {
                    this.nodeClickedService.startDownload(this.node);
                    return;
                }
                if (this.node.stayOpen) {
                    if (this.node.name == 'root') {
                        this.nodeService.foldAll();
                    }
                    this.store.dispatch({ type: SET_PATH, payload: this.node.pathToNode });
                    return;
                }
                this.toggleNodeExpanded();
                if (this.node.isExpanded) {
                    this.store.dispatch({ type: SET_PATH, payload: this.node.pathToNode });
                }
                this.setNodeSelectedState();
            };
        /**
         * @private
         * @return {?}
         */
        NodeComponent.prototype.showMenu = /**
         * @private
         * @return {?}
         */
            function () {
                this.store.dispatch({ type: SET_SELECTED_NODE, payload: this.node });
            };
        /**
         * @private
         * @return {?}
         */
        NodeComponent.prototype.toggleNodeExpanded = /**
         * @private
         * @return {?}
         */
            function () {
                this.node.isExpanded = !this.node.isExpanded;
            };
        /**
         * @private
         * @return {?}
         */
        NodeComponent.prototype.setNodeSelectedState = /**
         * @private
         * @return {?}
         */
            function () {
                if (!this.node.isExpanded) {
                    document.getElementById('tree_' + this.node.pathToNode).classList.add('deselected');
                    this.nodeService.foldRecursively(this.node);
                    this.store.dispatch({ type: SET_PATH, payload: this.node.pathToParent });
                }
                else {
                    document.getElementById('tree_' + this.node.pathToNode).classList.remove('deselected');
                }
            };
        NodeComponent.decorators = [
            { type: i0.Component, args: [{
                        selector: 'app-node',
                        template: "<div #customTemplate (dblclick)=\"method2CallForDblClick($event)\" (click)=\"method1CallForClick($event)\">\n  <ng-content></ng-content>\n</div>\n",
                        styles: [""]
                    },] },
        ];
        NodeComponent.ctorParameters = function () {
            return [
                { type: i3.Store },
                { type: NodeService },
                { type: NodeClickedService }
            ];
        };
        NodeComponent.propDecorators = {
            node: [{ type: i0.Input }]
        };
        return NodeComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var MapToIterablePipe = (function () {
        function MapToIterablePipe() {
        }
        /**
         * @param {?} dict
         * @return {?}
         */
        MapToIterablePipe.prototype.transform = /**
         * @param {?} dict
         * @return {?}
         */
            function (dict) {
                /** @type {?} */
                var a = [];
                for (var key in dict) {
                    if (dict.hasOwnProperty(key)) {
                        a.push({ key: key, val: dict[key] });
                    }
                }
                return a;
            };
        MapToIterablePipe.decorators = [
            { type: i0.Pipe, args: [{
                        name: 'mapToIterablePipe'
                    },] },
        ];
        return MapToIterablePipe;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var NavBarComponent = (function () {
        function NavBarComponent(store, nodeService) {
            this.store = store;
            this.nodeService = nodeService;
        }
        /**
         * @return {?}
         */
        NavBarComponent.prototype.ngOnInit = /**
         * @return {?}
         */
            function () {
                var _this = this;
                this.store
                    .pipe(i3.select((function (state) { return state.fileManagerState.path; })))
                    .subscribe((function (data) {
                    _this.nodeService.currentPath = data;
                    _this.currentPath = data.split('/');
                }));
            };
        /**
         * @param {?} path
         * @param {?} index
         * @return {?}
         */
        NavBarComponent.prototype.onClick = /**
         * @param {?} path
         * @param {?} index
         * @return {?}
         */
            function (path, index) {
                /** @type {?} */
                var newPath = path.slice(0, index + 1).join('/');
                this.store.dispatch({ type: SET_PATH, payload: newPath });
            };
        NavBarComponent.decorators = [
            { type: i0.Component, args: [{
                        selector: 'app-nav-bar',
                        template: "<div>\n  >> <span *ngFor=\"let to of currentPath; let i = index\">\n  <a class=\"link\" (click)=\"onClick(currentPath, i)\">\n    <div *ngIf=\"to === '' || to === 'root'; then icon else name\"></div>\n    <ng-template #icon><i class=\"fas fa-home\"></i></ng-template>\n    <ng-template #name>{{to}}</ng-template>\n  </a> /\n  </span>\n</div>\n",
                        styles: [""]
                    },] },
        ];
        NavBarComponent.ctorParameters = function () {
            return [
                { type: i3.Store },
                { type: NodeService }
            ];
        };
        return NavBarComponent;
    }());

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    var __assign = function () {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s)
                    if (Object.prototype.hasOwnProperty.call(s, p))
                        t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /** @type {?} */
    var initialState = {
        path: '',
        isLoading: true,
        selectedNode: null
    };
    /**
     * @param {?=} state
     * @param {?=} action
     * @return {?}
     */
    function stateReducer(state, action) {
        // console.log('Previous state: ', state);
        // console.log('ACTION type: ', action.type);
        // console.log('ACTION payload: ', action.payload);
        if (state === void 0) {
            state = initialState;
        }
        switch (action.type) {
            case SET_PATH:
                if (state.path === action.payload) {
                    return state;
                }
                return __assign({}, state, { path: action.payload, isLoading: true });
            case SET_LOADING_STATE:
                return __assign({}, state, { isLoading: action.payload });
            case SET_SELECTED_NODE:
                return __assign({}, state, { selectedNode: action.payload });
            default:
                return initialState;
        }
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /** @type {?} */
    var reducers = {
        fileManagerState: stateReducer
    };

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var LoadingOverlayComponent = (function () {
        function LoadingOverlayComponent() {
        }
        // todo unsubscribe from 'list' event - now we are only dismissing this component
        // todo unsubscribe from 'list' event - now we are only dismissing this component
        /**
         * @return {?}
         */
        LoadingOverlayComponent.prototype.ngOnInit =
            // todo unsubscribe from 'list' event - now we are only dismissing this component
            /**
             * @return {?}
             */
            function () {
                var _this = this;
                rxjs.timer(2000).subscribe((function () {
                    _this.timeoutMessage = utils._('Troubles with loading? Click anywhere to cancel loading');
                }));
            };
        LoadingOverlayComponent.decorators = [
            { type: i0.Component, args: [{
                        selector: 'app-loading-overlay',
                        template: "<ng-container\n  [ngTemplateOutletContext]=\"{$implicit: timeoutMessage}\"\n  [ngTemplateOutlet]=\"loadingOverlayTemplate\">\n</ng-container>\n",
                        styles: [""]
                    },] },
        ];
        LoadingOverlayComponent.propDecorators = {
            loadingOverlayTemplate: [{ type: i0.Input }]
        };
        return LoadingOverlayComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /*
     * Convert bytes into largest possible unit.
     * Takes an precision argument that defaults to 2.
     * Usage:
     *   bytes | fileSize:precision
     * Example:
     *   {{ 1024 |  fileSize}}
     *   formats to: 1 KB
    */
    var FileSizePipe = (function () {
        /*
         * Convert bytes into largest possible unit.
         * Takes an precision argument that defaults to 2.
         * Usage:
         *   bytes | fileSize:precision
         * Example:
         *   {{ 1024 |  fileSize}}
         *   formats to: 1 KB
        */
        function FileSizePipe() {
            this.units = [
                'bytes',
                'KB',
                'MB',
                'GB',
                'TB',
                'PB'
            ];
        }
        /**
         * @param {?=} bytes
         * @param {?=} precision
         * @return {?}
         */
        FileSizePipe.prototype.transform = /**
         * @param {?=} bytes
         * @param {?=} precision
         * @return {?}
         */
            function (bytes, precision) {
                if (bytes === void 0) {
                    bytes = 0;
                }
                if (precision === void 0) {
                    precision = 2;
                }
                if (isNaN(parseFloat(String(bytes))) || !isFinite(bytes))
                    return '?';
                /** @type {?} */
                var unit = 0;
                while (bytes >= 1024) {
                    bytes /= 1024;
                    unit++;
                }
                return bytes.toFixed(+precision) + ' ' + this.units[unit];
            };
        FileSizePipe.decorators = [
            { type: i0.Pipe, args: [{ name: 'fileSize' },] },
        ];
        return FileSizePipe;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var UploadComponent = (function () {
        function UploadComponent(http, nodeService) {
            this.http = http;
            this.nodeService = nodeService;
            this.closeDialog = new i0.EventEmitter();
            this.createDir = new i0.EventEmitter();
            this.newFolder = false;
            this.counter = 0;
        }
        /**
         * @return {?}
         */
        UploadComponent.prototype.ngAfterViewInit = /**
         * @return {?}
         */
            function () {
                var _this = this;
                this.uploader = new fineUploader.FineUploader({
                    debug: false,
                    autoUpload: false,
                    maxConnections: 1,
                    // todo configurable
                    element: document.getElementById('fine-uploader'),
                    template: document.getElementById('fine-uploader-template'),
                    request: {
                        endpoint: this.nodeService.tree.config.baseURL + this.nodeService.tree.config.api.uploadFile,
                        // forceMultipart: false,
                        paramsInBody: false,
                        params: {
                            parentPath: this.getCurrentPath
                        }
                    },
                    retry: {
                        enableAuto: false
                    },
                    callbacks: {
                        onSubmitted: (function () { return _this.counter++; }),
                        onCancel: (function () {
                            _this.counter < 0 ? console.warn('wtf?') : _this.counter--;
                        }),
                        onAllComplete: (function (succ, fail) {
                            if (succ.length > 0) {
                                _this.counter = 0;
                                _this.nodeService.refreshCurrentPath();
                            }
                        })
                    }
                });
            };
        /**
         * @return {?}
         */
        UploadComponent.prototype.ngOnInit = /**
         * @return {?}
         */
            function () {
            };
        Object.defineProperty(UploadComponent.prototype, "getCurrentPath", {
            get: /**
             * @return {?}
             */ function () {
                /** @type {?} */
                var parentPath = this.nodeService.findNodeByPath(this.nodeService.currentPath).id;
                return parentPath === 0 ? '' : parentPath;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @return {?}
         */
        UploadComponent.prototype.uploadFiles = /**
         * @return {?}
         */
            function () {
                this.uploader.uploadStoredFiles();
            };
        /**
         * @param {?=} input
         * @return {?}
         */
        UploadComponent.prototype.createNewFolder = /**
         * @param {?=} input
         * @return {?}
         */
            function (input) {
                if (!this.newFolder) {
                    this.newFolder = true;
                }
                else {
                    this.newFolder = false;
                    if (input.length > 0) {
                        this.createDir.emit(input);
                        this.newClickedAction();
                    }
                }
            };
        /**
         * @return {?}
         */
        UploadComponent.prototype.newClickedAction = /**
         * @return {?}
         */
            function () {
                this.uploader.cancelAll();
                this.closeDialog.emit();
            };
        UploadComponent.decorators = [
            { type: i0.Component, args: [{
                        selector: 'app-upload',
                        template: "<div class=\"backdrop\" (click)=\"newClickedAction()\"></div>\n<div class=\"upload-background\">\n  <div class=\"buttons\">\n    <button class=\"button\" [disabled]=\"newFolder\" (click)=\"createNewFolder()\" translate>Create new folder</button>\n  </div>\n\n  <div *ngIf=\"newFolder\">\n    <div class=\"buttons\">\n      <app-new-folder (buttonClicked)=\"createNewFolder($event)\"></app-new-folder>\n    </div>\n  </div>\n\n  <div id=\"fine-uploader\">\n  </div>\n\n\n  <div class=\"buttons\">\n    <button class=\"button big\" [disabled]=\"this.counter < 1\" (click)=\"uploadFiles()\" translate>\n      Upload\n    </button>\n    <button class=\"button big\" (click)=\"newClickedAction()\" translate>\n      Close\n    </button>\n  </div>\n\n</div>\n\n<div id=\"fine-uploader-template\" style=\"display: none;\">\n  <div class=\"qq-uploader-selector qq-uploader\" qq-drop-area-text=\"Drop files here\">\n    <div class=\"qq-upload-drop-area-selector qq-upload-drop-area\" qq-hide-dropzone>\n      <span class=\"qq-upload-drop-area-text-selector\"></span>\n    </div>\n\n    <div class=\"upload-top-bar\">\n      <div class=\"qq-upload-button-selector qq-upload-button\">\n        <div translate>Upload a file</div>\n      </div>\n\n      <div class=\"qq-total-progress-bar-container-selector qq-total-progress-bar-container\">\n        <div role=\"progressbar\" aria-valuenow=\"0\" aria-valuemin=\"0\" aria-valuemax=\"100\"\n             class=\"qq-total-progress-bar-selector qq-progress-bar qq-total-progress-bar\"></div>\n      </div>\n    </div>\n\n    <span class=\"qq-drop-processing-selector qq-drop-processing\">\n            <span translate>Processing dropped files</span>...\n            <span class=\"qq-drop-processing-spinner-selector qq-drop-processing-spinner\"></span>\n    </span>\n\n    <ul class=\"qq-upload-list-selector qq-upload-list\" aria-live=\"polite\" aria-relevant=\"additions removals\">\n      <li>\n        <div class=\"qq-progress-bar-container-selector\">\n          <div role=\"progressbar\" aria-valuenow=\"0\" aria-valuemin=\"0\" aria-valuemax=\"100\"\n               class=\"qq-progress-bar-selector qq-progress-bar\"></div>\n        </div>\n        <span class=\"qq-upload-spinner-selector qq-upload-spinner\"></span>\n        <img class=\"qq-thumbnail-selector\" qq-max-size=\"100\" qq-server-scale>\n        <span class=\"qq-upload-file-selector qq-upload-file\"></span>\n        <span class=\"qq-edit-filename-icon-selector qq-edit-filename-icon\" aria-label=\"Edit filename\"></span>\n        <input class=\"qq-edit-filename-selector qq-edit-filename\" tabindex=\"0\" type=\"text\">\n        <span class=\"qq-upload-size-selector qq-upload-size\"></span>\n        <button type=\"button\" class=\"qq-btn qq-upload-cancel-selector qq-upload-cancel\" translate>Cancel</button>\n        <button type=\"button\" class=\"qq-btn qq-upload-retry-selector qq-upload-retry\" translate>Retry</button>\n        <button type=\"button\" class=\"qq-btn qq-upload-delete-selector qq-upload-delete\" translate>Delete</button>\n        <span role=\"status\" class=\"qq-upload-status-text-selector qq-upload-status-text\"></span>\n      </li>\n    </ul>\n\n    <dialog class=\"qq-alert-dialog-selector\">\n      <div class=\"qq-dialog-message-selector\"></div>\n      <div class=\"qq-dialog-buttons\">\n        <button type=\"button\" class=\"qq-cancel-button-selector\" translate>Close</button>\n      </div>\n    </dialog>\n\n    <dialog class=\"qq-confirm-dialog-selector\">\n      <div class=\"qq-dialog-message-selector\"></div>\n      <div class=\"qq-dialog-buttons\">\n        <button type=\"button\" class=\"qq-cancel-button-selector\" translate>No</button>\n        <button type=\"button\" class=\"qq-ok-button-selector\" translate>Yes</button>\n      </div>\n    </dialog>\n\n    <dialog class=\"qq-prompt-dialog-selector\">\n      <div class=\"qq-dialog-message-selector\"></div>\n      <input type=\"text\">\n      <div class=\"qq-dialog-buttons\">\n        <button type=\"button\" class=\"qq-cancel-button-selector\" translate>Cancel</button>\n        <button type=\"button\" class=\"qq-ok-button-selector\" translate>Ok</button>\n      </div>\n    </dialog>\n  </div>\n</div>\n",
                        styles: [".upload-content{text-align:center;max-height:25vh;overflow:auto;margin:10px auto}.fa-times:before{content:\"\\f00d\"}.buttons{background:#fff;padding:5px;margin:10px 0}", ".qq-upload-button div{line-height:25px}.qq-upload-button-focus{outline:0}.qq-uploader{position:relative;min-height:200px;max-height:490px;overflow-y:hidden;width:inherit;border-radius:6px;background-color:#fdfdfd;border:1px dashed #ccc;padding:20px}.qq-uploader:before{content:attr(qq-drop-area-text) \" \";position:absolute;font-size:200%;left:0;width:100%;text-align:center;top:45%;opacity:.25}.qq-upload-drop-area,.qq-upload-extra-drop-area{position:absolute;top:0;left:0;width:100%;height:100%;min-height:30px;z-index:2;background:#f9f9f9;border-radius:4px;border:1px dashed #ccc;text-align:center}.qq-upload-drop-area span{display:block;position:absolute;top:50%;width:100%;margin-top:-8px;font-size:16px}.qq-upload-extra-drop-area{position:relative;margin-top:50px;font-size:16px;padding-top:30px;height:20px;min-height:40px}.qq-upload-drop-area-active{background:#fdfdfd;border-radius:4px;border:1px dashed #ccc}.qq-upload-list{margin:0;padding:0;list-style:none;max-height:450px;overflow-y:auto;clear:both}.qq-upload-list li{margin:0;padding:9px;line-height:15px;font-size:16px;color:#424242;background-color:#f6f6f6;border-top:1px solid #fff;border-bottom:1px solid #ddd}.qq-upload-list li:first-child{border-top:none}.qq-upload-list li:last-child{border-bottom:none}.qq-upload-cancel,.qq-upload-continue,.qq-upload-delete,.qq-upload-failed-text,.qq-upload-file,.qq-upload-pause,.qq-upload-retry,.qq-upload-size,.qq-upload-spinner{margin-right:12px;display:inline}.qq-upload-file{vertical-align:middle;display:inline-block;width:300px;text-overflow:ellipsis;white-space:nowrap;overflow-x:hidden;height:18px}.qq-upload-spinner{display:inline-block;background:url(loading.gif);width:15px;height:15px;vertical-align:text-bottom}.qq-drop-processing{display:block}.qq-drop-processing-spinner{display:inline-block;background:url(processing.gif);width:24px;height:24px;vertical-align:text-bottom}.qq-upload-cancel,.qq-upload-continue,.qq-upload-delete,.qq-upload-pause,.qq-upload-retry,.qq-upload-size{font-size:12px;font-weight:400;cursor:pointer;vertical-align:middle}.qq-upload-status-text{font-size:14px;font-weight:700;display:block}.qq-upload-failed-text{display:none;font-style:italic;font-weight:700}.qq-upload-failed-icon{display:none;width:15px;height:15px;vertical-align:text-bottom}.qq-upload-fail .qq-upload-failed-text,.qq-upload-retrying .qq-upload-failed-text{display:inline}.qq-upload-list li.qq-upload-success{background-color:#ebf6e0;color:#424242;border-bottom:1px solid #d3ded1;border-top:1px solid #f7fff5}.qq-upload-list li.qq-upload-fail{background-color:#f5d7d7;color:#424242;border-bottom:1px solid #decaca;border-top:1px solid #fce6e6}.qq-total-progress-bar{height:25px;border-radius:9px}INPUT.qq-edit-filename{position:absolute;opacity:0;z-index:-1}.qq-upload-file.qq-editable{cursor:pointer;margin-right:4px}.qq-edit-filename-icon.qq-editable{display:inline-block;cursor:pointer}INPUT.qq-edit-filename.qq-editing{position:static;height:28px;padding:0 8px;margin-right:10px;margin-bottom:-5px;border:1px solid #ccc;border-radius:2px;font-size:16px;opacity:1}.qq-edit-filename-icon{display:none;background:url(edit.gif);width:15px;height:15px;vertical-align:text-bottom;margin-right:16px}.qq-hide{display:none}.qq-thumbnail-selector{vertical-align:middle;margin-right:12px}.qq-uploader DIALOG{display:none}.qq-uploader DIALOG[open]{display:block}.qq-uploader DIALOG .qq-dialog-buttons{text-align:center;padding-top:10px}.qq-uploader DIALOG .qq-dialog-buttons BUTTON{margin-left:5px;margin-right:5px}.qq-uploader DIALOG .qq-dialog-message-selector{padding-bottom:10px}.qq-uploader DIALOG::-webkit-backdrop{background-color:rgba(0,0,0,.7)}.qq-uploader DIALOG::backdrop{background-color:rgba(0,0,0,.7)}"],
                        encapsulation: i0.ViewEncapsulation.None
                    },] },
        ];
        UploadComponent.ctorParameters = function () {
            return [
                { type: i4.HttpClient },
                { type: NodeService }
            ];
        };
        UploadComponent.propDecorators = {
            openDialog: [{ type: i0.Input }],
            closeDialog: [{ type: i0.Output }],
            createDir: [{ type: i0.Output }]
        };
        return UploadComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var NewFolderComponent = (function () {
        function NewFolderComponent() {
            this.buttonClicked = new i0.EventEmitter();
            this.buttonText = utils._('Close').toString();
            this.inputValue = '';
        }
        /**
         * @return {?}
         */
        NewFolderComponent.prototype.ngOnInit = /**
         * @return {?}
         */
            function () {
            };
        /**
         * @return {?}
         */
        NewFolderComponent.prototype.onClick = /**
         * @return {?}
         */
            function () {
                /** @type {?} */
                var el = (((this.uploadFolder.nativeElement)));
                // @ts-ignore
                this.buttonClicked.emit(el.value);
            };
        /**
         * @param {?} event
         * @return {?}
         */
        NewFolderComponent.prototype.onInputChange = /**
         * @param {?} event
         * @return {?}
         */
            function (event) {
                this.inputValue = event.target.value;
                if (this.inputValue.length > 0) {
                    this.buttonText = utils._('Confirm').toString();
                }
                else {
                    this.buttonText = utils._('Close').toString();
                }
            };
        NewFolderComponent.decorators = [
            { type: i0.Component, args: [{
                        selector: 'app-new-folder',
                        template: "<p class=\"new-folder-description\" translate>Type new folder name</p>\n<input #uploadFolder placeholder=\"{{'Folder name'}}\" (keyup)=\"onInputChange($event)\"\n       (keyup.enter)=\"onClick()\" onclick=\"this.select();\" type=\"text\" class=\"new-folder-input\"/>\n<button class=\"button new-folder-send\" (click)=\"onClick()\">{{buttonText}}</button>\n",
                        styles: [".new-folder-description{margin:0 auto;padding:0}"]
                    },] },
        ];
        NewFolderComponent.ctorParameters = function () { return []; };
        NewFolderComponent.propDecorators = {
            uploadFolder: [{ type: i0.ViewChild, args: ['uploadFolder',] }],
            buttonClicked: [{ type: i0.Output }]
        };
        return NewFolderComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var SideViewComponent = (function () {
        function SideViewComponent() {
            this.allowFolderDownload = false;
            this.clickEvent = new i0.EventEmitter();
        }
        /**
         * @return {?}
         */
        SideViewComponent.prototype.ngOnInit = /**
         * @return {?}
         */
            function () {
            };
        /**
         * @param {?} event
         * @param {?} type
         * @return {?}
         */
        SideViewComponent.prototype.onClick = /**
         * @param {?} event
         * @param {?} type
         * @return {?}
         */
            function (event, type) {
                this.clickEvent.emit({ type: type, event: event, node: this.node });
            };
        SideViewComponent.decorators = [
            { type: i0.Component, args: [{
                        selector: 'app-side-view',
                        template: "<div class=\"side-view\" *ngIf=\"node\">\n  <div class=\"side-view-preview\">\n    <i (click)=\"onClick($event, 'closeSideView')\" class=\"fas fa-times side-view-close\"></i>\n\n    <div class=\"side-view-preview-title\">{{node.name}}</div>\n\n    <div class=\"side-view-preview-content\">\n      <ng-container\n        [ngTemplateOutletContext]=\"{$implicit: node}\"\n        [ngTemplateOutlet]=\"sideViewTemplate\">\n      </ng-container>\n    </div>\n\n    <div class=\"side-view-buttons\">\n      <button (click)=\"onClick($event, 'download')\" class=\"button\"\n              [disabled]=\"!allowFolderDownload && node.isFolder\" translate>\n        Download\n      </button>\n      <button (click)=\"onClick($event, 'renameConfirm')\" class=\"button\" translate>Rename</button>\n      <button (click)=\"onClick($event, 'removeAsk')\" class=\"button\" translate>Delete</button>\n    </div>\n  </div>\n</div>\n",
                        styles: [".side-view-close{position:absolute;cursor:pointer;top:0;right:0;padding:15px}.side-view-buttons{width:100%;display:-webkit-flex;display:flex;-webkit-justify-content:center;justify-content:center;-webkit-flex-flow:column;flex-flow:column}.side-view-buttons .button{margin:5px 0}"],
                        encapsulation: i0.ViewEncapsulation.None
                    },] },
        ];
        SideViewComponent.ctorParameters = function () { return []; };
        SideViewComponent.propDecorators = {
            sideViewTemplate: [{ type: i0.Input }],
            node: [{ type: i0.Input }],
            allowFolderDownload: [{ type: i0.Input }],
            clickEvent: [{ type: i0.Output }]
        };
        return SideViewComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var NavigationComponent = (function () {
        function NavigationComponent(nodeClickedService) {
            this.nodeClickedService = nodeClickedService;
        }
        /**
         * @return {?}
         */
        NavigationComponent.prototype.ngOnInit = /**
         * @return {?}
         */
            function () {
            };
        /**
         * @param {?} input
         * @return {?}
         */
        NavigationComponent.prototype.onClick = /**
         * @param {?} input
         * @return {?}
         */
            function (input) {
                this.nodeClickedService.searchForString(input);
            };
        NavigationComponent.decorators = [
            { type: i0.Component, args: [{
                        selector: 'app-navigation',
                        template: "<div class=\"navigation-component\">\n  <input #input class=\"navigation-search\" onclick=\"this.select();\" (keyup.enter)=\"onClick(input.value)\"\n         placeholder=\"{{'Search'}}\">\n\n  <button [disabled]=\"input.value.length === 0\" class=\"navigation-search-icon\" (click)=\"onClick(input.value)\">\n    <i class=\"fas fa-search\"></i>\n  </button>\n\n  <div>\n    <ng-content></ng-content>\n  </div>\n</div>\n\n\n",
                        styles: [".navigation-component{display:-webkit-flex;display:flex}"],
                        encapsulation: i0.ViewEncapsulation.None
                    },] },
        ];
        NavigationComponent.ctorParameters = function () {
            return [
                { type: NodeClickedService }
            ];
        };
        return NavigationComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /** @type {?} */
    var FEATURE_REDUCER_TOKEN = new i0.InjectionToken('AppStore Reducers');
    /**
     * @return {?}
     */
    function getReducers() {
        // map of reducers
        return reducers;
    }
    var FileManagerModule = (function () {
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
                    providers: []
                };
            };
        FileManagerModule.decorators = [
            { type: i0.NgModule, args: [{
                        imports: [
                            i4.HttpClientModule,
                            i3.StoreModule.forRoot(FEATURE_REDUCER_TOKEN),
                            common.CommonModule,
                            i1.NgxSmartModalModule.forRoot(),
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

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var TreeModel = (function () {
        function TreeModel(config) {
            // this._currentPath = config.startingFolder; // todo implement (config.interfce.ts)
            this._currentPath = '';
            this.config = config;
            this.nodes = (({
                id: 0,
                pathToNode: '',
                pathToParent: null,
                isFolder: true,
                isExpanded: true,
                stayOpen: true,
                name: 'root',
                children: {}
            }));
        }
        Object.defineProperty(TreeModel.prototype, "currentPath", {
            get: /**
             * @return {?}
             */ function () {
                return this._currentPath;
            },
            set: /**
             * @param {?} value
             * @return {?}
             */ function (value) {
                this._currentPath = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TreeModel.prototype, "nodes", {
            get: /**
             * @return {?}
             */ function () {
                return this._nodes;
            },
            set: /**
             * @param {?} value
             * @return {?}
             */ function (value) {
                this._nodes = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TreeModel.prototype, "selectedNodeId", {
            get: /**
             * @return {?}
             */ function () {
                return this._selectedNodeId;
            },
            set: /**
             * @param {?} value
             * @return {?}
             */ function (value) {
                this._selectedNodeId = value;
            },
            enumerable: true,
            configurable: true
        });
        return TreeModel;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */

    exports.FileManagerComponent = FileManagerComponent;
    exports.getReducers = getReducers;
    exports.FileManagerModule = FileManagerModule;
    exports.TreeModel = TreeModel;
    exports.NodeService = NodeService;
    exports.ɵe = FolderContentComponent;
    exports.ɵk = LoadingOverlayComponent;
    exports.ɵf = NodeComponent;
    exports.ɵn = NewFolderComponent;
    exports.ɵm = UploadComponent;
    exports.ɵj = NavBarComponent;
    exports.ɵp = NavigationComponent;
    exports.ɵo = SideViewComponent;
    exports.ɵh = NodeListerComponent;
    exports.ɵg = TreeComponent;
    exports.ɵl = FileSizePipe;
    exports.ɵi = MapToIterablePipe;
    exports.ɵb = reducers;
    exports.ɵd = stateReducer;
    exports.ɵc = NodeClickedService;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmc2LWZpbGUtbWFuLnVtZC5qcy5tYXAiLCJzb3VyY2VzIjpbIm5nOi8vbmc2LWZpbGUtbWFuL2ZpbGUtbWFuYWdlci9yZWR1Y2Vycy9hY3Rpb25zLmFjdGlvbi50cyIsIm5nOi8vbmc2LWZpbGUtbWFuL2ZpbGUtbWFuYWdlci9zZXJ2aWNlcy9ub2RlLnNlcnZpY2UudHMiLCJuZzovL25nNi1maWxlLW1hbi9maWxlLW1hbmFnZXIvc2VydmljZXMvbm9kZS1jbGlja2VkLnNlcnZpY2UudHMiLCJuZzovL25nNi1maWxlLW1hbi9maWxlLW1hbmFnZXIvZmlsZS1tYW5hZ2VyLmNvbXBvbmVudC50cyIsIm5nOi8vbmc2LWZpbGUtbWFuL2ZpbGUtbWFuYWdlci9jb21wb25lbnRzL2ZvbGRlci1jb250ZW50L2ZvbGRlci1jb250ZW50LmNvbXBvbmVudC50cyIsIm5nOi8vbmc2LWZpbGUtbWFuL2ZpbGUtbWFuYWdlci9jb21wb25lbnRzL3RyZWUvdHJlZS5jb21wb25lbnQudHMiLCJuZzovL25nNi1maWxlLW1hbi9maWxlLW1hbmFnZXIvY29tcG9uZW50cy90cmVlL25vZGUtbGlzdGVyL25vZGUtbGlzdGVyLmNvbXBvbmVudC50cyIsIm5nOi8vbmc2LWZpbGUtbWFuL2ZpbGUtbWFuYWdlci9jb21wb25lbnRzL2Z1bmN0aW9ucy9ub2RlL25vZGUuY29tcG9uZW50LnRzIiwibmc6Ly9uZzYtZmlsZS1tYW4vZmlsZS1tYW5hZ2VyL3BpcGVzL21hcC10by1pdGVyYWJsZS5waXBlLnRzIiwibmc6Ly9uZzYtZmlsZS1tYW4vZmlsZS1tYW5hZ2VyL2NvbXBvbmVudHMvbmF2LWJhci9uYXYtYmFyLmNvbXBvbmVudC50cyIsbnVsbCwibmc6Ly9uZzYtZmlsZS1tYW4vZmlsZS1tYW5hZ2VyL3JlZHVjZXJzL3N0YXRlUmVkdWNlci50cyIsIm5nOi8vbmc2LWZpbGUtbWFuL2ZpbGUtbWFuYWdlci9yZWR1Y2Vycy9yZWR1Y2VyLmZhY3RvcnkudHMiLCJuZzovL25nNi1maWxlLW1hbi9maWxlLW1hbmFnZXIvY29tcG9uZW50cy9mdW5jdGlvbnMvbG9hZGluZy1vdmVybGF5L2xvYWRpbmctb3ZlcmxheS5jb21wb25lbnQudHMiLCJuZzovL25nNi1maWxlLW1hbi9maWxlLW1hbmFnZXIvcGlwZXMvZmlsZS1zaXplLnBpcGUudHMiLCJuZzovL25nNi1maWxlLW1hbi9maWxlLW1hbmFnZXIvY29tcG9uZW50cy9mdW5jdGlvbnMvdXBsb2FkL3VwbG9hZC5jb21wb25lbnQudHMiLCJuZzovL25nNi1maWxlLW1hbi9maWxlLW1hbmFnZXIvY29tcG9uZW50cy9mdW5jdGlvbnMvdXBsb2FkL25ldy1mb2xkZXIvbmV3LWZvbGRlci5jb21wb25lbnQudHMiLCJuZzovL25nNi1maWxlLW1hbi9maWxlLW1hbmFnZXIvY29tcG9uZW50cy9zaWRlLXZpZXcvc2lkZS12aWV3LmNvbXBvbmVudC50cyIsIm5nOi8vbmc2LWZpbGUtbWFuL2ZpbGUtbWFuYWdlci9jb21wb25lbnRzL25hdmlnYXRpb24vbmF2aWdhdGlvbi5jb21wb25lbnQudHMiLCJuZzovL25nNi1maWxlLW1hbi9maWxlLW1hbmFnZXIvZmlsZS1tYW5hZ2VyLm1vZHVsZS50cyIsIm5nOi8vbmc2LWZpbGUtbWFuL2ZpbGUtbWFuYWdlci9tb2RlbHMvdHJlZS5tb2RlbC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0FjdGlvbkludGVyZmFjZX0gZnJvbSAnLi4vaW50ZXJmYWNlcy9hY3Rpb24uaW50ZXJmYWNlJztcclxuaW1wb3J0IHtOb2RlSW50ZXJmYWNlfSBmcm9tICcuLi9pbnRlcmZhY2VzL25vZGUuaW50ZXJmYWNlJztcclxuXHJcbmV4cG9ydCBjb25zdCBTRVRfUEFUSCA9ICdTRVRfUEFUSCc7XHJcbmV4cG9ydCBjb25zdCBTRVRfTE9BRElOR19TVEFURSA9ICdTRVRfTE9BRElOR19TVEFURSc7XHJcbmV4cG9ydCBjb25zdCBTRVRfU0VMRUNURURfTk9ERSA9ICdTRVRfU0VMRUNURURfTk9ERSc7XHJcblxyXG5leHBvcnQgY2xhc3MgU2V0UGF0aCBpbXBsZW1lbnRzIEFjdGlvbkludGVyZmFjZSB7XHJcbiAgcmVhZG9ubHkgdHlwZSA9IFNFVF9QQVRIO1xyXG4gIHBheWxvYWQ6IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFNldExvYWRpbmdTdGF0ZSBpbXBsZW1lbnRzIEFjdGlvbkludGVyZmFjZSB7XHJcbiAgcmVhZG9ubHkgdHlwZSA9IFNFVF9MT0FESU5HX1NUQVRFO1xyXG4gIHBheWxvYWQ6IGJvb2xlYW47XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBTZXRTZWxlY3RlZE5vZGUgaW1wbGVtZW50cyBBY3Rpb25JbnRlcmZhY2Uge1xyXG4gIHJlYWRvbmx5IHR5cGUgPSBTRVRfU0VMRUNURURfTk9ERTtcclxuICBwYXlsb2FkOiBOb2RlSW50ZXJmYWNlO1xyXG59XHJcblxyXG5leHBvcnQgdHlwZSBBY3Rpb25zID0gU2V0UGF0aCB8IFNldExvYWRpbmdTdGF0ZSB8IFNldFNlbGVjdGVkTm9kZTtcclxuIiwiaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtOb2RlSW50ZXJmYWNlfSBmcm9tICcuLi9pbnRlcmZhY2VzL25vZGUuaW50ZXJmYWNlJztcclxuaW1wb3J0IHtPYnNlcnZhYmxlfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtUcmVlTW9kZWx9IGZyb20gJy4uL21vZGVscy90cmVlLm1vZGVsJztcclxuaW1wb3J0IHtIdHRwQ2xpZW50LCBIdHRwUGFyYW1zfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCAqIGFzIEFDVElPTlMgZnJvbSAnLi4vcmVkdWNlcnMvYWN0aW9ucy5hY3Rpb24nO1xyXG5pbXBvcnQge1N0b3JlfSBmcm9tICdAbmdyeC9zdG9yZSc7XHJcbmltcG9ydCB7QXBwU3RvcmV9IGZyb20gJy4uL3JlZHVjZXJzL3JlZHVjZXIuZmFjdG9yeSc7XHJcblxyXG5ASW5qZWN0YWJsZSh7XHJcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBOb2RlU2VydmljZSB7XHJcbiAgcHVibGljIHRyZWU6IFRyZWVNb2RlbDtcclxuICBwcml2YXRlIF9wYXRoOiBzdHJpbmc7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgaHR0cDogSHR0cENsaWVudCwgcHJpdmF0ZSBzdG9yZTogU3RvcmU8QXBwU3RvcmU+KSB7XHJcbiAgfVxyXG5cclxuICAvLyB0b2RvIGFzayBzZXJ2ZXIgdG8gZ2V0IHBhcmVudCBzdHJ1Y3R1cmVcclxuICBwdWJsaWMgc3RhcnRNYW5hZ2VyQXQocGF0aDogc3RyaW5nKSB7XHJcbiAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKHt0eXBlOiBBQ1RJT05TLlNFVF9QQVRILCBwYXlsb2FkOiBwYXRofSk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgcmVmcmVzaEN1cnJlbnRQYXRoKCkge1xyXG4gICAgdGhpcy5maW5kTm9kZUJ5UGF0aCh0aGlzLmN1cnJlbnRQYXRoKS5jaGlsZHJlbiA9IHt9O1xyXG4gICAgdGhpcy5nZXROb2Rlcyh0aGlzLmN1cnJlbnRQYXRoKTtcclxuICB9XHJcblxyXG4gIGdldE5vZGVzKHBhdGg6IHN0cmluZykge1xyXG4gICAgdGhpcy5wYXJzZU5vZGVzKHBhdGgpLnN1YnNjcmliZSgoZGF0YTogQXJyYXk8Tm9kZUludGVyZmFjZT4pID0+IHtcclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgY29uc3QgcGFyZW50UGF0aCA9IHRoaXMuZ2V0UGFyZW50UGF0aChkYXRhW2ldLnBhdGhUb05vZGUpO1xyXG4gICAgICAgIHRoaXMuZmluZE5vZGVCeVBhdGgocGFyZW50UGF0aCkuY2hpbGRyZW5bZGF0YVtpXS5uYW1lXSA9IGRhdGFbaV07XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBnZXRQYXJlbnRQYXRoKHBhdGg6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICBsZXQgcGFyZW50UGF0aCA9IHBhdGguc3BsaXQoJy8nKTtcclxuICAgIHBhcmVudFBhdGggPSBwYXJlbnRQYXRoLnNsaWNlKDAsIHBhcmVudFBhdGgubGVuZ3RoIC0gMSk7XHJcbiAgICByZXR1cm4gcGFyZW50UGF0aC5qb2luKCcvJyk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHBhcnNlTm9kZXMocGF0aDogc3RyaW5nKTogT2JzZXJ2YWJsZTxOb2RlSW50ZXJmYWNlW10+IHtcclxuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZShvYnNlcnZlciA9PiB7XHJcbiAgICAgIHRoaXMuZ2V0Tm9kZXNGcm9tU2VydmVyKHBhdGgpLnN1YnNjcmliZSgoZGF0YTogQXJyYXk8YW55PikgPT4ge1xyXG4gICAgICAgIG9ic2VydmVyLm5leHQoZGF0YS5tYXAobm9kZSA9PiB0aGlzLmNyZWF0ZU5vZGUocGF0aCwgbm9kZSkpKTtcclxuICAgICAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKHt0eXBlOiBBQ1RJT05TLlNFVF9MT0FESU5HX1NUQVRFLCBwYXlsb2FkOiBmYWxzZX0pO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjcmVhdGVOb2RlKHBhdGgsIG5vZGUpOiBOb2RlSW50ZXJmYWNlIHtcclxuICAgIGlmIChub2RlLnBhdGhbMF0gIT09ICcvJykge1xyXG4gICAgICBjb25zb2xlLndhcm4oJ1tOb2RlIFNlcnZpY2VdIFNlcnZlciBzaG91bGQgcmV0dXJuIGluaXRpYWwgcGF0aCB3aXRoIFwiL1wiJyk7XHJcbiAgICAgIG5vZGUucGF0aCA9ICcvJyArIG5vZGUucGF0aDtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBpZHMgPSBub2RlLnBhdGguc3BsaXQoJy8nKTtcclxuICAgIGlmIChpZHMubGVuZ3RoID4gMiAmJiBpZHNbaWRzLmxlbmd0aCAtIDFdID09PSAnJykge1xyXG4gICAgICBpZHMuc3BsaWNlKC0xLCAxKTtcclxuICAgICAgbm9kZS5wYXRoID0gaWRzLmpvaW4oJy8nKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBjYWNoZWROb2RlID0gdGhpcy5maW5kTm9kZUJ5UGF0aChub2RlLnBhdGgpO1xyXG5cclxuICAgIHJldHVybiA8Tm9kZUludGVyZmFjZT57XHJcbiAgICAgIGlkOiBub2RlLmlkLFxyXG4gICAgICBpc0ZvbGRlcjogbm9kZS5kaXIsXHJcbiAgICAgIGlzRXhwYW5kZWQ6IGNhY2hlZE5vZGUgPyBjYWNoZWROb2RlLmlzRXhwYW5kZWQgOiBmYWxzZSxcclxuICAgICAgcGF0aFRvTm9kZTogbm9kZS5wYXRoLFxyXG4gICAgICBwYXRoVG9QYXJlbnQ6IHRoaXMuZ2V0UGFyZW50UGF0aChub2RlLnBhdGgpLFxyXG4gICAgICBuYW1lOiBub2RlLm5hbWUgfHwgbm9kZS5pZCxcclxuICAgICAgY2hpbGRyZW46IGNhY2hlZE5vZGUgPyBjYWNoZWROb2RlLmNoaWxkcmVuIDoge31cclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdldE5vZGVzRnJvbVNlcnZlciA9IChwYXRoOiBzdHJpbmcpID0+IHtcclxuICAgIGxldCBmb2xkZXJJZDogYW55ID0gdGhpcy5maW5kTm9kZUJ5UGF0aChwYXRoKS5pZDtcclxuICAgIGZvbGRlcklkID0gZm9sZGVySWQgPT09IDAgPyAnJyA6IGZvbGRlcklkO1xyXG5cclxuICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KFxyXG4gICAgICB0aGlzLnRyZWUuY29uZmlnLmJhc2VVUkwgKyB0aGlzLnRyZWUuY29uZmlnLmFwaS5saXN0RmlsZSxcclxuICAgICAge3BhcmFtczogbmV3IEh0dHBQYXJhbXMoKS5zZXQoJ3BhcmVudFBhdGgnLCBmb2xkZXJJZCl9XHJcbiAgICApO1xyXG4gIH07XHJcblxyXG4gIHB1YmxpYyBmaW5kTm9kZUJ5UGF0aChub2RlUGF0aDogc3RyaW5nKTogTm9kZUludGVyZmFjZSB7XHJcbiAgICBjb25zdCBpZHMgPSBub2RlUGF0aC5zcGxpdCgnLycpO1xyXG4gICAgaWRzLnNwbGljZSgwLCAxKTtcclxuXHJcbiAgICByZXR1cm4gaWRzLmxlbmd0aCA9PT0gMCA/IHRoaXMudHJlZS5ub2RlcyA6IGlkcy5yZWR1Y2UoKHZhbHVlLCBpbmRleCkgPT4gdmFsdWVbJ2NoaWxkcmVuJ11baW5kZXhdLCB0aGlzLnRyZWUubm9kZXMpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGZpbmROb2RlQnlJZChpZDogbnVtYmVyKTogTm9kZUludGVyZmFjZSB7XHJcbiAgICBjb25zdCByZXN1bHQgPSB0aGlzLmZpbmROb2RlQnlJZEhlbHBlcihpZCk7XHJcblxyXG4gICAgaWYgKHJlc3VsdCA9PT0gbnVsbCkge1xyXG4gICAgICBjb25zb2xlLndhcm4oJ1tOb2RlIFNlcnZpY2VdIENhbm5vdCBmaW5kIG5vZGUgYnkgaWQuIElkIG5vdCBleGlzdGluZyBvciBub3QgZmV0Y2hlZC4gUmV0dXJuaW5nIHJvb3QuJyk7XHJcbiAgICAgIHJldHVybiB0aGlzLnRyZWUubm9kZXM7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBmaW5kTm9kZUJ5SWRIZWxwZXIoaWQ6IG51bWJlciwgbm9kZTogTm9kZUludGVyZmFjZSA9IHRoaXMudHJlZS5ub2Rlcyk6IE5vZGVJbnRlcmZhY2Uge1xyXG4gICAgaWYgKG5vZGUuaWQgPT09IGlkKVxyXG4gICAgICByZXR1cm4gbm9kZTtcclxuXHJcbiAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMobm9kZS5jaGlsZHJlbik7XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGlmICh0eXBlb2Ygbm9kZS5jaGlsZHJlbltrZXlzW2ldXSA9PSAnb2JqZWN0Jykge1xyXG4gICAgICAgIGNvbnN0IG9iaiA9IHRoaXMuZmluZE5vZGVCeUlkSGVscGVyKGlkLCBub2RlLmNoaWxkcmVuW2tleXNbaV1dKTtcclxuICAgICAgICBpZiAob2JqICE9IG51bGwpXHJcbiAgICAgICAgICByZXR1cm4gb2JqO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZm9sZFJlY3Vyc2l2ZWx5KG5vZGU6IE5vZGVJbnRlcmZhY2UpIHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdmb2xkaW5nICcsIG5vZGUpO1xyXG4gICAgY29uc3QgY2hpbGRyZW4gPSBub2RlLmNoaWxkcmVuO1xyXG5cclxuICAgIE9iamVjdC5rZXlzKGNoaWxkcmVuKS5tYXAoKGNoaWxkOiBzdHJpbmcpID0+IHtcclxuICAgICAgaWYgKCFjaGlsZHJlbi5oYXNPd25Qcm9wZXJ0eShjaGlsZCkgfHwgIWNoaWxkcmVuW2NoaWxkXS5pc0V4cGFuZGVkKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuZm9sZFJlY3Vyc2l2ZWx5KGNoaWxkcmVuW2NoaWxkXSk7XHJcbiAgICAgIC8vdG9kbyBwdXQgdGhpcyBnZXRFbEJ5SWQgaW50byBvbmUgZnVuYyAoY3VyciBpbnNpZGUgbm9kZS5jb21wb25lbnQudHMgKyBmbS5jb21wb25lbnQudHMpIC0gdGhpcyB3b24ndCBiZSBtYWludGFpbmFibGVcclxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RyZWVfJyArIGNoaWxkcmVuW2NoaWxkXS5wYXRoVG9Ob2RlKS5jbGFzc0xpc3QuYWRkKCdkZXNlbGVjdGVkJyk7XHJcbiAgICAgIGNoaWxkcmVuW2NoaWxkXS5pc0V4cGFuZGVkID0gZmFsc2U7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBmb2xkQWxsKCkge1xyXG4gICAgdGhpcy5mb2xkUmVjdXJzaXZlbHkodGhpcy50cmVlLm5vZGVzKTtcclxuICB9XHJcblxyXG4gIGdldCBjdXJyZW50UGF0aCgpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRoaXMuX3BhdGg7XHJcbiAgfVxyXG5cclxuICBzZXQgY3VycmVudFBhdGgodmFsdWU6IHN0cmluZykge1xyXG4gICAgdGhpcy5fcGF0aCA9IHZhbHVlO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge05vZGVJbnRlcmZhY2V9IGZyb20gJy4uL2ludGVyZmFjZXMvbm9kZS5pbnRlcmZhY2UnO1xyXG5pbXBvcnQge05vZGVTZXJ2aWNlfSBmcm9tICcuL25vZGUuc2VydmljZSc7XHJcbmltcG9ydCB7VHJlZU1vZGVsfSBmcm9tICcuLi9tb2RlbHMvdHJlZS5tb2RlbCc7XHJcbmltcG9ydCB7SHR0cENsaWVudH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQge09ic2VydmFibGV9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge05neFNtYXJ0TW9kYWxTZXJ2aWNlfSBmcm9tICduZ3gtc21hcnQtbW9kYWwnO1xyXG5pbXBvcnQge0FwcFN0b3JlfSBmcm9tICcuLi9yZWR1Y2Vycy9yZWR1Y2VyLmZhY3RvcnknO1xyXG5pbXBvcnQge1N0b3JlfSBmcm9tICdAbmdyeC9zdG9yZSc7XHJcblxyXG5ASW5qZWN0YWJsZSh7XHJcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBOb2RlQ2xpY2tlZFNlcnZpY2Uge1xyXG4gIHB1YmxpYyB0cmVlOiBUcmVlTW9kZWw7XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcHVibGljIG5neFNtYXJ0TW9kYWxTZXJ2aWNlOiBOZ3hTbWFydE1vZGFsU2VydmljZSxcclxuICAgIHByaXZhdGUgbm9kZVNlcnZpY2U6IE5vZGVTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSBzdG9yZTogU3RvcmU8QXBwU3RvcmU+LFxyXG4gICAgcHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50XHJcbiAgKSB7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc3RhcnREb3dubG9hZChub2RlOiBOb2RlSW50ZXJmYWNlKTogdm9pZCB7XHJcbiAgICBjb25zdCBwYXJhbWV0ZXJzID0gdGhpcy5wYXJzZVBhcmFtcyh7cGF0aDogbm9kZS5pZH0pO1xyXG4gICAgdGhpcy5yZWFjaFNlcnZlcignZG93bmxvYWQnLCB0aGlzLnRyZWUuY29uZmlnLmFwaS5kb3dubG9hZEZpbGUgKyBwYXJhbWV0ZXJzKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBpbml0RGVsZXRlKG5vZGU6IE5vZGVJbnRlcmZhY2UpOiB2b2lkIHtcclxuICAgIHRoaXMuc2lkZUVmZmVjdEhlbHBlcihcclxuICAgICAgJ0RlbGV0ZScsXHJcbiAgICAgIHtwYXRoOiBub2RlLmlkfSxcclxuICAgICAgJ2RlbGV0ZScsXHJcbiAgICAgIHRoaXMudHJlZS5jb25maWcuYXBpLmRlbGV0ZUZpbGUsXHJcbiAgICAgICgpID0+IHRoaXMuc3VjY2Vzc1dpdGhNb2RhbENsb3NlKClcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc2VhcmNoRm9yU3RyaW5nKGlucHV0OiBzdHJpbmcpOiB2b2lkIHtcclxuICAgIHRoaXMuc2lkZUVmZmVjdEhlbHBlcihcclxuICAgICAgJ1NlYXJjaCcsXHJcbiAgICAgIHtxdWVyeTogaW5wdXR9LFxyXG4gICAgICAnZ2V0JyxcclxuICAgICAgdGhpcy50cmVlLmNvbmZpZy5hcGkuc2VhcmNoRmlsZXMsXHJcbiAgICAgIChyZXMpID0+IHRoaXMuc2VhcmNoU3VjY2VzcyhpbnB1dCwgcmVzKVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBjcmVhdGVGb2xkZXIoY3VycmVudFBhcmVudDogbnVtYmVyLCBuZXdEaXJOYW1lOiBzdHJpbmcpIHtcclxuICAgIHRoaXMuc2lkZUVmZmVjdEhlbHBlcihcclxuICAgICAgJ0NyZWF0ZSBGb2xkZXInLFxyXG4gICAgICB7ZGlyTmFtZTogbmV3RGlyTmFtZSwgcGFyZW50UGF0aDogY3VycmVudFBhcmVudCA9PT0gMCA/IG51bGwgOiBjdXJyZW50UGFyZW50fSxcclxuICAgICAgJ3Bvc3QnLFxyXG4gICAgICB0aGlzLnRyZWUuY29uZmlnLmFwaS5jcmVhdGVGb2xkZXJcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgcmVuYW1lKGlkOiBudW1iZXIsIG5ld05hbWU6IHN0cmluZykge1xyXG4gICAgdGhpcy5zaWRlRWZmZWN0SGVscGVyKFxyXG4gICAgICAnUmVuYW1lJyxcclxuICAgICAge3BhdGg6IGlkLCBuZXdOYW1lOiBuZXdOYW1lfSxcclxuICAgICAgJ3Bvc3QnLFxyXG4gICAgICB0aGlzLnRyZWUuY29uZmlnLmFwaS5yZW5hbWVGaWxlLFxyXG4gICAgICAoKSA9PiB0aGlzLnN1Y2Nlc3NXaXRoTW9kYWxDbG9zZSgpXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBzaWRlRWZmZWN0SGVscGVyKG5hbWU6IHN0cmluZywgcGFyYW1ldGVyczoge30sIGh0dHBNZXRob2Q6IHN0cmluZywgYXBpVVJMOiBzdHJpbmcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3NNZXRob2QgPSAoYSkgPT4gdGhpcy5hY3Rpb25TdWNjZXNzKGEpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBmYWlsTWV0aG9kID0gKGEsIGIpID0+IHRoaXMuYWN0aW9uRmFpbGVkKGEsIGIpXHJcbiAgKSB7XHJcbiAgICBjb25zdCBwYXJhbXMgPSB0aGlzLnBhcnNlUGFyYW1zKHBhcmFtZXRlcnMpO1xyXG5cclxuICAgIHRoaXMubmd4U21hcnRNb2RhbFNlcnZpY2UuZ2V0TW9kYWwoJ3dhaXRNb2RhbCcpLm9wZW4oKTtcclxuXHJcbiAgICB0aGlzLnJlYWNoU2VydmVyKGh0dHBNZXRob2QsIGFwaVVSTCArIHBhcmFtcylcclxuICAgICAgLnN1YnNjcmliZShcclxuICAgICAgICAoYSkgPT4gc3VjY2Vzc01ldGhvZChhKSxcclxuICAgICAgICAoZXJyKSA9PiBmYWlsTWV0aG9kKG5hbWUsIGVycilcclxuICAgICAgKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgcmVhY2hTZXJ2ZXIobWV0aG9kOiBzdHJpbmcsIGFwaVVybDogc3RyaW5nLCBkYXRhOiBhbnkgPSB7fSk6IE9ic2VydmFibGU8T2JqZWN0PiB7XHJcbiAgICBzd2l0Y2ggKG1ldGhvZC50b0xvd2VyQ2FzZSgpKSB7XHJcbiAgICAgIGNhc2UgJ2dldCc6XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQodGhpcy50cmVlLmNvbmZpZy5iYXNlVVJMICsgYXBpVXJsKTtcclxuICAgICAgY2FzZSAncG9zdCc6XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KHRoaXMudHJlZS5jb25maWcuYmFzZVVSTCArIGFwaVVybCwgZGF0YSk7XHJcbiAgICAgIGNhc2UgJ2RlbGV0ZSc6XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUodGhpcy50cmVlLmNvbmZpZy5iYXNlVVJMICsgYXBpVXJsKTtcclxuICAgICAgY2FzZSAnZG93bmxvYWQnOlxyXG4gICAgICAgIHdpbmRvdy5vcGVuKHRoaXMudHJlZS5jb25maWcuYmFzZVVSTCArIGFwaVVybCwgJ19ibGFuaycpO1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIGNvbnNvbGUud2FybignW05vZGVDbGlja2VkU2VydmljZV0gSW5jb3JyZWN0IHBhcmFtcyBmb3IgdGhpcyBzaWRlLWVmZmVjdCcpO1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBwYXJzZVBhcmFtcyhwYXJhbXM6IHt9KTogc3RyaW5nIHtcclxuICAgIGxldCBxdWVyeSA9ICc/JztcclxuXHJcbiAgICBPYmplY3Qua2V5cyhwYXJhbXMpLmZpbHRlcihpdGVtID0+IHBhcmFtc1tpdGVtXSAhPT0gbnVsbCkubWFwKGtleSA9PiB7XHJcbiAgICAgIHF1ZXJ5ICs9IGtleSArICc9JyArIHBhcmFtc1trZXldICsgJyYnO1xyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHF1ZXJ5LnNsaWNlKDAsIC0xKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgc3VjY2Vzc1dpdGhNb2RhbENsb3NlKCkge1xyXG4gICAgdGhpcy5hY3Rpb25TdWNjZXNzKCk7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2lkZS12aWV3JykuY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0ZWQnKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgc2VhcmNoU3VjY2VzcyhpbnB1dDogc3RyaW5nLCBkYXRhOiBhbnkpIHtcclxuICAgIGNvbnN0IG9iaiA9IHtcclxuICAgICAgc2VhcmNoU3RyaW5nOiBpbnB1dCxcclxuICAgICAgcmVzcG9uc2U6IGRhdGFcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5hY3Rpb25TdWNjZXNzKCk7XHJcblxyXG4gICAgdGhpcy5uZ3hTbWFydE1vZGFsU2VydmljZS5zZXRNb2RhbERhdGEob2JqLCAnc2VhcmNoTW9kYWwnLCB0cnVlKTtcclxuICAgIHRoaXMubmd4U21hcnRNb2RhbFNlcnZpY2UuZ2V0TW9kYWwoJ3NlYXJjaE1vZGFsJykub3BlbigpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhY3Rpb25TdWNjZXNzKHJlc3BvbnNlOiBzdHJpbmcgPSAnJykge1xyXG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCdkaWFsb2ctb3BlbicpO1xyXG5cclxuICAgIHRoaXMubm9kZVNlcnZpY2UucmVmcmVzaEN1cnJlbnRQYXRoKCk7XHJcbiAgICB0aGlzLm5neFNtYXJ0TW9kYWxTZXJ2aWNlLmdldE1vZGFsKCd3YWl0TW9kYWwnKS5jbG9zZSgpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhY3Rpb25GYWlsZWQobmFtZTogc3RyaW5nLCBlcnJvcjogYW55KSB7XHJcbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ2RpYWxvZy1vcGVuJyk7XHJcblxyXG4gICAgdGhpcy5uZ3hTbWFydE1vZGFsU2VydmljZS5nZXRNb2RhbCgnd2FpdE1vZGFsJykuY2xvc2UoKTtcclxuICAgIHRoaXMubmd4U21hcnRNb2RhbFNlcnZpY2UuZ2V0TW9kYWwoJ2Vycm9yTW9kYWwnKS5vcGVuKCk7XHJcbiAgICBjb25zb2xlLndhcm4oJ1tOb2RlQ2xpY2tlZFNlcnZpY2VdIEFjdGlvbiBcIicgKyBuYW1lICsgJ1wiIGZhaWxlZCcsIGVycm9yKTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHtDb21wb25lbnQsIEV2ZW50RW1pdHRlciwgSW5wdXQsIE9uSW5pdCwgT3V0cHV0LCBUZW1wbGF0ZVJlZiwgVmlld0VuY2Fwc3VsYXRpb259IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge3NlbGVjdCwgU3RvcmV9IGZyb20gJ0BuZ3J4L3N0b3JlJztcclxuaW1wb3J0IHtUcmVlTW9kZWx9IGZyb20gJy4vbW9kZWxzL3RyZWUubW9kZWwnO1xyXG5pbXBvcnQge05vZGVTZXJ2aWNlfSBmcm9tICcuL3NlcnZpY2VzL25vZGUuc2VydmljZSc7XHJcbmltcG9ydCB7Tm9kZUludGVyZmFjZX0gZnJvbSAnLi9pbnRlcmZhY2VzL25vZGUuaW50ZXJmYWNlJztcclxuaW1wb3J0IHtTRVRfTE9BRElOR19TVEFURX0gZnJvbSAnLi9yZWR1Y2Vycy9hY3Rpb25zLmFjdGlvbic7XHJcbmltcG9ydCAqIGFzIEFDVElPTlMgZnJvbSAnLi9yZWR1Y2Vycy9hY3Rpb25zLmFjdGlvbic7XHJcbmltcG9ydCB7QXBwU3RvcmV9IGZyb20gJy4vcmVkdWNlcnMvcmVkdWNlci5mYWN0b3J5JztcclxuaW1wb3J0IHtOZ3hTbWFydE1vZGFsU2VydmljZX0gZnJvbSAnbmd4LXNtYXJ0LW1vZGFsJztcclxuaW1wb3J0IHtOb2RlQ2xpY2tlZFNlcnZpY2V9IGZyb20gJy4vc2VydmljZXMvbm9kZS1jbGlja2VkLnNlcnZpY2UnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdmbS1maWxlLW1hbmFnZXInLFxyXG4gIHRlbXBsYXRlOiBgPG5nLWNvbnRhaW5lciAqbmdJZj1cImlzUG9wdXA7IHRoZW4gaXRJc1BvcHVwIGVsc2Ugc2hvd0NvbnRlbnRcIj48L25nLWNvbnRhaW5lcj5cclxuXHJcbjxuZy10ZW1wbGF0ZSAjaXRJc1BvcHVwPlxyXG4gIDxkaXYgKm5nSWY9XCIhZm1PcGVuXCI+XHJcbiAgICA8YnV0dG9uIGNsYXNzPVwiYnV0dG9uIGJpZ1wiIChjbGljayk9XCJmbVNob3dIaWRlKClcIiB0cmFuc2xhdGU9XCJcIj5PcGVuIGZpbGUgbWFuYWdlcjwvYnV0dG9uPlxyXG4gIDwvZGl2PlxyXG4gIDxkaXYgY2xhc3M9XCJmaWxlLW1hbmFnZXItYmFja2Ryb3BcIiAqbmdJZj1cImZtT3BlblwiPlxyXG4gICAgPGRpdiBjbGFzcz1cImZtTW9kYWxJbnNpZGVcIj5cclxuICAgICAgPGRpdiAqbmdJZj1cImZtT3BlbjsgdGhlbiBzaG93Q29udGVudFwiPjwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgPC9kaXY+XHJcbjwvbmctdGVtcGxhdGU+XHJcblxyXG48bmctdGVtcGxhdGUgI3Nob3dDb250ZW50PlxyXG4gIDxkaXYgY2xhc3M9XCJjb250ZW50XCI+XHJcbiAgICA8ZGl2IGNsYXNzPVwiZmlsZS1tYW5hZ2VyLW5hdmJhclwiPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwicGF0aFwiPlxyXG4gICAgICAgIDxhcHAtbmF2LWJhcj48L2FwcC1uYXYtYmFyPlxyXG4gICAgICA8L2Rpdj5cclxuXHJcbiAgICAgIDxkaXYgY2xhc3M9XCJuYXZpZ2F0aW9uXCI+XHJcbiAgICAgICAgPGFwcC1uYXZpZ2F0aW9uPlxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cImJ1dHRvbiBjbG9zZVwiIChjbGljayk9XCJmbVNob3dIaWRlKClcIiAqbmdJZj1cImlzUG9wdXBcIj5cclxuICAgICAgICAgICAgPGkgY2xhc3M9XCJmYXMgZmEtMnggZmEtdGltZXNcIj48L2k+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2FwcC1uYXZpZ2F0aW9uPlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG5cclxuICAgIDxkaXYgY2xhc3M9XCJob2xkZXJcIj5cclxuICAgICAgPGRpdiBjbGFzcz1cImZpbGUtbWFuYWdlci1sZWZ0XCI+XHJcbiAgICAgICAgPGFwcC10cmVlIFt0cmVlTW9kZWxdPVwidHJlZVwiPlxyXG4gICAgICAgICAgPG5nLXRlbXBsYXRlIGxldC1ub2Rlcz5cclxuICAgICAgICAgICAgPG5nLWNvbnRhaW5lciBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwieyRpbXBsaWNpdDogbm9kZXN9XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBbbmdUZW1wbGF0ZU91dGxldF09XCJpY29uVGVtcGxhdGUgPyBpY29uVGVtcGxhdGUgOiBkZWZhdWx0SWNvblRlbXBsYXRlXCI+XHJcbiAgICAgICAgICAgIDwvbmctY29udGFpbmVyPlxyXG4gICAgICAgICAgPC9uZy10ZW1wbGF0ZT5cclxuICAgICAgICA8L2FwcC10cmVlPlxyXG4gICAgICA8L2Rpdj5cclxuXHJcbiAgICAgIDxkaXYgY2xhc3M9XCJyaWdodFwiPlxyXG4gICAgICAgIDxhcHAtZm9sZGVyLWNvbnRlbnRcclxuICAgICAgICAgIFt0cmVlTW9kZWxdPVwidHJlZVwiXHJcbiAgICAgICAgICAob3BlblVwbG9hZERpYWxvZyk9XCJoYW5kbGVVcGxvYWREaWFsb2coJGV2ZW50KVwiXHJcbiAgICAgICAgICBbZm9sZGVyQ29udGVudFRlbXBsYXRlXT1cImZvbGRlckNvbnRlbnRUZW1wbGF0ZSA/IGZvbGRlckNvbnRlbnRUZW1wbGF0ZSA6IGRlZmF1bHRGb2xkZXJDb250ZW50VGVtcGxhdGVcIlxyXG4gICAgICAgICAgW2ZvbGRlckNvbnRlbnROZXdUZW1wbGF0ZV09XCJmb2xkZXJDb250ZW50TmV3VGVtcGxhdGUgPyBmb2xkZXJDb250ZW50TmV3VGVtcGxhdGUgOiBkZWZhdWx0Rm9sZGVyQ29udGVudE5ld1RlbXBsYXRlXCJcclxuICAgICAgICAgIFtmb2xkZXJDb250ZW50QmFja1RlbXBsYXRlXT1cImZvbGRlckNvbnRlbnRCYWNrVGVtcGxhdGUgPyBmb2xkZXJDb250ZW50QmFja1RlbXBsYXRlIDogZGVmYXVsdEZvbGRlckNvbnRlbnRCYWNrVGVtcGxhdGVcIj5cclxuICAgICAgICA8L2FwcC1mb2xkZXItY29udGVudD5cclxuICAgICAgPC9kaXY+XHJcblxyXG4gICAgICA8YXBwLXNpZGUtdmlldyBpZD1cInNpZGUtdmlld1wiXHJcbiAgICAgICAgICAgICAgICAgICAgIFtub2RlXT1cInNlbGVjdGVkTm9kZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgIFtzaWRlVmlld1RlbXBsYXRlXT1cInNpZGVWaWV3VGVtcGxhdGUgPyBzaWRlVmlld1RlbXBsYXRlIDogZGVmYXVsdFNpZGVWaWV3VGVtcGxhdGVcIlxyXG4gICAgICAgICAgICAgICAgICAgICBbYWxsb3dGb2xkZXJEb3dubG9hZF09XCJ0cmVlLmNvbmZpZy5vcHRpb25zLmFsbG93Rm9sZGVyRG93bmxvYWRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAoY2xpY2tFdmVudCk9XCJoYW5kbGVGaWxlTWFuYWdlckNsaWNrRXZlbnQoJGV2ZW50KVwiPlxyXG4gICAgICA8L2FwcC1zaWRlLXZpZXc+XHJcbiAgICA8L2Rpdj5cclxuICA8L2Rpdj5cclxuXHJcbiAgPGFwcC11cGxvYWQgKm5nSWY9XCJuZXdEaWFsb2dcIlxyXG4gICAgICAgICAgICAgIFtvcGVuRGlhbG9nXT1cIm5ld0RpYWxvZ1wiXHJcbiAgICAgICAgICAgICAgKGNsb3NlRGlhbG9nKT1cImhhbmRsZVVwbG9hZERpYWxvZyhmYWxzZSlcIlxyXG4gICAgICAgICAgICAgIChjcmVhdGVEaXIpPVwiaGFuZGxlRmlsZU1hbmFnZXJDbGlja0V2ZW50KHt0eXBlOiAnY3JlYXRlRm9sZGVyJywgcGF5bG9hZDogJGV2ZW50fSlcIj5cclxuICA8L2FwcC11cGxvYWQ+XHJcblxyXG4gIDxhcHAtbG9hZGluZy1vdmVybGF5XHJcbiAgICAqbmdJZj1cImxvYWRpbmdcIlxyXG4gICAgW2xvYWRpbmdPdmVybGF5VGVtcGxhdGVdPVwibG9hZGluZ092ZXJsYXlUZW1wbGF0ZSA/IGxvYWRpbmdPdmVybGF5VGVtcGxhdGUgOiBkZWZhdWx0TG9hZGluZ092ZXJsYXlUZW1wbGF0ZVwiPlxyXG4gIDwvYXBwLWxvYWRpbmctb3ZlcmxheT5cclxuPC9uZy10ZW1wbGF0ZT5cclxuXHJcbjxuZy10ZW1wbGF0ZSBsZXQtbm9kZSAjZGVmYXVsdEljb25UZW1wbGF0ZT5cclxuICA8ZGl2IGNsYXNzPVwiZmlsZS1tYW5hZ2VyLW5vZGVcIiBzdHlsZT1cImRpc3BsYXk6IGlubGluZS1ibG9jazsgcGFkZGluZzogM3B4XCI+XHJcbiAgICA8ZGl2ICpuZ0lmPVwibm9kZS5pc0ZvbGRlcjsgdGhlbiBpdElzRm9sZGVyIGVsc2Ugc2hvd0ZpbGVcIj48L2Rpdj5cclxuXHJcbiAgICA8bmctdGVtcGxhdGUgI2l0SXNGb2xkZXI+XHJcbiAgICAgIDxkaXYgKm5nSWY9XCJub2RlLmlzRXhwYW5kZWQ7IHRoZW4gaXNGb2xkZXJFeHBhbmRlZCBlbHNlIGlzRm9sZGVyQ2xvc2VkXCI+PC9kaXY+XHJcbiAgICA8L25nLXRlbXBsYXRlPlxyXG5cclxuICAgIDxuZy10ZW1wbGF0ZSAjc2hvd0ZpbGU+PGkgY2xhc3M9XCJmYXMgZmEtZmlsZSBjaGlsZFwiPjwvaT48L25nLXRlbXBsYXRlPlxyXG4gICAgPG5nLXRlbXBsYXRlICNpc0ZvbGRlckV4cGFuZGVkPjxpIGNsYXNzPVwiZmFzIGZhLWZvbGRlci1vcGVuIGNoaWxkXCI+PC9pPjwvbmctdGVtcGxhdGU+XHJcbiAgICA8bmctdGVtcGxhdGUgI2lzRm9sZGVyQ2xvc2VkPjxpIGNsYXNzPVwiZmFzIGZhLWZvbGRlciBjaGlsZFwiPjwvaT48L25nLXRlbXBsYXRlPlxyXG5cclxuICAgIDxzcGFuPnt7bm9kZS5uYW1lfX08L3NwYW4+XHJcbiAgPC9kaXY+XHJcbjwvbmctdGVtcGxhdGU+XHJcbjxuZy10ZW1wbGF0ZSBsZXQtbm9kZSAjZGVmYXVsdEZvbGRlckNvbnRlbnRUZW1wbGF0ZT5cclxuICA8ZGl2IGNsYXNzPVwiZmlsZS1tYW5hZ2VyLWl0ZW1cIj5cclxuICAgIDxkaXYgY2xhc3M9XCJmaWxlLXByZXZpZXdcIj5cclxuICAgICAgPGRpdiAqbmdJZj1cIm5vZGUuaXNGb2xkZXI7IHRoZW4gaXRJc0ZvbGRlciBlbHNlIHNob3dGaWxlXCI+PC9kaXY+XHJcbiAgICAgIDxuZy10ZW1wbGF0ZSAjaXRJc0ZvbGRlcj48aSBjbGFzcz1cImZhcyBmYS0zeCBmYS1mb2xkZXIgY2hpbGRcIj48L2k+PC9uZy10ZW1wbGF0ZT5cclxuICAgICAgPG5nLXRlbXBsYXRlICNzaG93RmlsZT48aSBjbGFzcz1cImZhcyBmYS0zeCBmYS1maWxlIGNoaWxkXCI+PC9pPjwvbmctdGVtcGxhdGU+XHJcbiAgICA8L2Rpdj5cclxuICAgIDxkaXYgY2xhc3M9XCJmaWxlLW5hbWVcIj5cclxuICAgICAge3tub2RlLm5hbWV9fVxyXG4gICAgPC9kaXY+XHJcbiAgPC9kaXY+XHJcbjwvbmctdGVtcGxhdGU+XHJcbjxuZy10ZW1wbGF0ZSAjZGVmYXVsdEZvbGRlckNvbnRlbnROZXdUZW1wbGF0ZT5cclxuICA8ZGl2IGNsYXNzPVwiZmlsZS1tYW5hZ2VyLWl0ZW1cIj5cclxuICAgIDxkaXYgY2xhc3M9XCJmaWxlLXByZXZpZXdcIiBzdHlsZT1cIndpZHRoOiAxMDAlOyBoZWlnaHQ6MTAwJVwiPlxyXG4gICAgICA8aSBjbGFzcz1cImZhcyBmYS0zeCBmYS1wbHVzIGNoaWxkXCIgc3R5bGU9XCJsaW5lLWhlaWdodDogMlwiPjwvaT5cclxuICAgIDwvZGl2PlxyXG4gIDwvZGl2PlxyXG48L25nLXRlbXBsYXRlPlxyXG48bmctdGVtcGxhdGUgbGV0LW5vZGUgI2RlZmF1bHRGb2xkZXJDb250ZW50QmFja1RlbXBsYXRlPlxyXG4gIDxkaXYgY2xhc3M9XCJmaWxlLW1hbmFnZXItaXRlbVwiPlxyXG4gICAgPGRpdiBjbGFzcz1cImZpbGUtcHJldmlld1wiIHN0eWxlPVwid2lkdGg6IDEwMCU7IGhlaWdodDoxMDAlXCI+XHJcbiAgICAgIDxpIGNsYXNzPVwiZmFzIGZhLTJ4IGZhLWVsbGlwc2lzLWhcIiBzdHlsZT1cImxpbmUtaGVpZ2h0OiA1XCI+PC9pPlxyXG4gICAgPC9kaXY+XHJcbiAgPC9kaXY+XHJcbjwvbmctdGVtcGxhdGU+XHJcbjxuZy10ZW1wbGF0ZSBsZXQtdGltZW91dE1lc3NhZ2UgI2RlZmF1bHRMb2FkaW5nT3ZlcmxheVRlbXBsYXRlPlxyXG4gIDxkaXYgY2xhc3M9XCJmaWxlLW1hbmFnZXItYmFja2Ryb3AgbG9hZGluZ1wiIChjbGljayk9XCJiYWNrZHJvcENsaWNrZWQoKVwiPlxyXG4gICAgPGRpdiBjbGFzcz1cImZpbGUtbWFuYWdlci1lcnJvclwiICpuZ0lmPVwidGltZW91dE1lc3NhZ2VcIj57e3RpbWVvdXRNZXNzYWdlfX08L2Rpdj5cclxuICA8L2Rpdj5cclxuICA8ZGl2IGNsYXNzPVwic3Bpbm5lclwiPlxyXG4gICAgPGkgY2xhc3M9XCJmYXMgZmEtNXggZmEtc3BpbiBmYS1zeW5jLWFsdFwiPjwvaT5cclxuICA8L2Rpdj5cclxuPC9uZy10ZW1wbGF0ZT5cclxuPG5nLXRlbXBsYXRlIGxldC1ub2RlICNkZWZhdWx0U2lkZVZpZXdUZW1wbGF0ZT5cclxuICA8ZGl2IHN0eWxlPVwicG9zaXRpb246IGFic29sdXRlOyBib3R0b206IDA7IHdpZHRoOiAxMDAlOyBtYXJnaW46IDVweCBhdXRvXCI+XHJcbiAgICA8c3BhbiAqbmdJZj1cIm5vZGUuaXNGb2xkZXJcIiB0cmFuc2xhdGU+Tm8gZGF0YSBhdmFpbGFibGUgZm9yIHRoaXMgZm9sZGVyPC9zcGFuPlxyXG4gICAgPHNwYW4gKm5nSWY9XCIhbm9kZS5pc0ZvbGRlclwiIHRyYW5zbGF0ZT5ObyBkYXRhIGF2YWlsYWJsZSBmb3IgdGhpcyBmaWxlPC9zcGFuPlxyXG4gIDwvZGl2PlxyXG48L25nLXRlbXBsYXRlPlxyXG5cclxuPG5neC1zbWFydC1tb2RhbCBpZGVudGlmaWVyPVwicmVuYW1lTW9kYWxcIiBbZGlzbWlzc2FibGVdPVwiZmFsc2VcIiBbY2xvc2FibGVdPVwiZmFsc2VcIiAqbmdJZj1cInNlbGVjdGVkTm9kZVwiICNyZW5hbWVNb2RhbD5cclxuICA8aDIgY2xhc3M9XCJtb2RhbC10aXRsZVwiIHRyYW5zbGF0ZT5cclxuICAgIFJlbmFtZSBmaWxlXHJcbiAgPC9oMj5cclxuICA8cCBjbGFzcz1cInJlbmFtZS1uYW1lXCIgdHJhbnNsYXRlPlxyXG4gICAgT2xkIG5hbWVcclxuICA8L3A+XHJcbiAgPHNwYW4gc3R5bGU9XCJtYXJnaW46IDhweFwiPnt7c2VsZWN0ZWROb2RlLm5hbWV9fTwvc3Bhbj5cclxuICA8cCBjbGFzcz1cInJlbmFtZS1uYW1lXCIgdHJhbnNsYXRlPlxyXG4gICAgTmV3IG5hbWVcclxuICA8L3A+XHJcbiAgPGlucHV0IHBsYWNlaG9sZGVyPVwiTmV3IG5hbWVcIiB0eXBlPVwidGV4dFwiIGNsYXNzPVwicmVuYW1lLWlucHV0XCIgW3ZhbHVlXT1cInNlbGVjdGVkTm9kZS5uYW1lXCIgI3JlbmFtZUlucHV0XHJcbiAgICAgICAgIChrZXl1cC5lbnRlcik9XCJoYW5kbGVGaWxlTWFuYWdlckNsaWNrRXZlbnQoe3R5cGU6ICdyZW5hbWUnLCB2YWx1ZTogcmVuYW1lSW5wdXQudmFsdWV9KVwiXHJcbiAgICAgICAgIG9uY2xpY2s9XCJ0aGlzLnNlbGVjdCgpO1wiPlxyXG4gIDxicj5cclxuXHJcbiAgPGRpdiBjbGFzcz1cInJlbmFtZS1idXR0b25cIj5cclxuICAgIDxidXR0b24gY2xhc3M9XCJidXR0b24gYmlnXCIgdHJhbnNsYXRlXHJcbiAgICAgICAgICAgIChjbGljayk9XCJoYW5kbGVGaWxlTWFuYWdlckNsaWNrRXZlbnQoe3R5cGU6ICdyZW5hbWUnLCB2YWx1ZTogcmVuYW1lSW5wdXQudmFsdWV9KVwiXHJcbiAgICAgICAgICAgIFtkaXNhYmxlZF09XCJyZW5hbWVJbnB1dC52YWx1ZSA9PT0gc2VsZWN0ZWROb2RlLm5hbWUgfHwgcmVuYW1lSW5wdXQudmFsdWUubGVuZ3RoID09PSAwXCI+XHJcbiAgICAgIFJlbmFtZVxyXG4gICAgPC9idXR0b24+XHJcbiAgICA8YnV0dG9uIGNsYXNzPVwiYnV0dG9uIGJpZ1wiIChjbGljayk9XCJyZW5hbWVNb2RhbC5jbG9zZSgpXCIgdHJhbnNsYXRlPlxyXG4gICAgICBDYW5jZWxcclxuICAgIDwvYnV0dG9uPlxyXG4gIDwvZGl2PlxyXG5cclxuPC9uZ3gtc21hcnQtbW9kYWw+XHJcbjxuZ3gtc21hcnQtbW9kYWwgKm5nSWY9XCJzZWxlY3RlZE5vZGVcIiBpZGVudGlmaWVyPVwiY29uZmlybURlbGV0ZU1vZGFsXCIgI2RlbGV0ZU1vZGFsXHJcbiAgICAgICAgICAgICAgICAgW2Rpc21pc3NhYmxlXT1cImZhbHNlXCIgW2Nsb3NhYmxlXT1cImZhbHNlXCI+XHJcbiAgPGgyIGNsYXNzPVwibW9kYWwtdGl0bGVcIj5cclxuICAgIDxzcGFuIHRyYW5zbGF0ZT5Zb3UgYXJlIHRyeWluZyB0byBkZWxldGUgZm9sbG93aW5nIDwvc3Bhbj5cclxuICAgIDxzcGFuICpuZ0lmPVwic2VsZWN0ZWROb2RlLmlzRm9sZGVyXCIgdHJhbnNsYXRlPmZvbGRlcjwvc3Bhbj5cclxuICAgIDxzcGFuICpuZ0lmPVwiIXNlbGVjdGVkTm9kZS5pc0ZvbGRlclwiIHRyYW5zbGF0ZT5maWxlPC9zcGFuPlxyXG4gIDwvaDI+XHJcblxyXG4gIDxkaXYgc3R5bGU9XCJ3aWR0aDogMTAwJTsgbWFyZ2luOiA1cHggYXV0bzsgdGV4dC1hbGlnbjogY2VudGVyXCI+e3tzZWxlY3RlZE5vZGUubmFtZX19PC9kaXY+XHJcblxyXG4gIDxkaXYgY2xhc3M9XCJyZW5hbWUtYnV0dG9uXCI+XHJcbiAgICA8YnV0dG9uIGNsYXNzPVwiYnV0dG9uIGJpZ1wiIChjbGljayk9XCJoYW5kbGVGaWxlTWFuYWdlckNsaWNrRXZlbnQoe3R5cGU6ICdyZW1vdmUnfSlcIj5cclxuICAgICAgPHNwYW4gdHJhbnNsYXRlPlllcywgZGVsZXRlIHRoaXMgPC9zcGFuPlxyXG4gICAgICA8c3BhbiAqbmdJZj1cInNlbGVjdGVkTm9kZS5pc0ZvbGRlclwiIHRyYW5zbGF0ZT5mb2xkZXI8L3NwYW4+XHJcbiAgICAgIDxzcGFuICpuZ0lmPVwiIXNlbGVjdGVkTm9kZS5pc0ZvbGRlclwiIHRyYW5zbGF0ZT5maWxlPC9zcGFuPlxyXG4gICAgPC9idXR0b24+XHJcbiAgICA8YnV0dG9uIGNsYXNzPVwiYnV0dG9uIGJpZ1wiIChjbGljayk9XCJkZWxldGVNb2RhbC5jbG9zZSgpXCIgdHJhbnNsYXRlPlxyXG4gICAgICBDYW5jZWxcclxuICAgIDwvYnV0dG9uPlxyXG4gIDwvZGl2PlxyXG48L25neC1zbWFydC1tb2RhbD5cclxuPG5neC1zbWFydC1tb2RhbCBpZGVudGlmaWVyPVwic2VhcmNoTW9kYWxcIiAjc2VhcmNoTW9kYWwgW2Nsb3NhYmxlXT1cInRydWVcIj5cclxuICA8aDIgY2xhc3M9XCJtb2RhbC10aXRsZVwiIHN0eWxlPVwibWFyZ2luLWJvdHRvbTogMnB4XCIgdHJhbnNsYXRlXHJcbiAgICAgICpuZ0lmPVwic2VhcmNoTW9kYWwuaGFzRGF0YSgpICYmIHNlYXJjaE1vZGFsLmdldERhdGEoKS5yZXNwb25zZS5sZW5ndGggIT09IDBcIj5cclxuICAgIFNlYXJjaCByZXN1bHRzIGZvclxyXG4gIDwvaDI+XHJcbiAgPGgyIGNsYXNzPVwibW9kYWwtdGl0bGVcIiBzdHlsZT1cIm1hcmdpbi1ib3R0b206IDJweFwiIHRyYW5zbGF0ZVxyXG4gICAgICAqbmdJZj1cIiFzZWFyY2hNb2RhbC5oYXNEYXRhKCkgfHwgc2VhcmNoTW9kYWwuZ2V0RGF0YSgpLnJlc3BvbnNlLmxlbmd0aCA9PT0gMFwiPlxyXG4gICAgTm8gcmVzdWx0cyBmb3VuZCBmb3JcclxuICA8L2gyPlxyXG4gIDxkaXYgc3R5bGU9XCJ0ZXh0LWFsaWduOiBjZW50ZXJcIiAqbmdJZj1cInNlYXJjaE1vZGFsLmhhc0RhdGEoKVwiPnt7c2VhcmNoTW9kYWwuZ2V0RGF0YSgpLnNlYXJjaFN0cmluZ319PC9kaXY+XHJcblxyXG4gIDxkaXYgKm5nSWY9XCJzZWFyY2hNb2RhbC5oYXNEYXRhKCkgJiYgc2VhcmNoTW9kYWwuZ2V0RGF0YSgpLnJlc3BvbnNlLmxlbmd0aCAhPT0gMFwiPlxyXG4gICAgPHRhYmxlIHN0eWxlPVwibWFyZ2luOiAwIGF1dG9cIj5cclxuICAgICAgPHRyPlxyXG4gICAgICAgIDx0ZCBjbGFzcz1cInRhYmxlLWl0ZW0gdGFibGUtaGVhZFwiIHRyYW5zbGF0ZT5GaWxlIG5hbWU8L3RkPlxyXG4gICAgICAgIDx0ZCBjbGFzcz1cInRhYmxlLWl0ZW0tc2hvcnQgdGFibGUtaGVhZFwiIHRyYW5zbGF0ZT5TaXplPC90ZD5cclxuICAgICAgPC90cj5cclxuICAgICAgPHRyICpuZ0Zvcj1cImxldCBpdGVtIG9mIHNlYXJjaE1vZGFsLmdldERhdGEoKS5yZXNwb25zZVwiIChjbGljayk9XCJzZWFyY2hDbGlja2VkKGl0ZW0pXCI+XHJcbiAgICAgICAgPHRkIHN0eWxlPVwiY3Vyc29yOiBwb2ludGVyXCI+XHJcbiAgICAgICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiaXRlbS5maWxlQ2F0ZWdvcnkgPT09ICdEJzsgZWxzZSBmaWxlXCI+XHJcbiAgICAgICAgICAgIDxpIGNsYXNzPVwiZmFzIGZhLWZvbGRlciBzZWFyY2gtb3V0cHV0LWljb25cIj48L2k+XHJcbiAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cclxuICAgICAgICAgIDxuZy10ZW1wbGF0ZSAjZmlsZT5cclxuICAgICAgICAgICAgPGkgY2xhc3M9XCJmYXMgZmEtZmlsZSBzZWFyY2gtb3V0cHV0LWljb25cIj48L2k+XHJcbiAgICAgICAgICA8L25nLXRlbXBsYXRlPlxyXG4gICAgICAgICAgPHNwYW4gc3R5bGU9XCJ0ZXh0LW92ZXJmbG93OiBlbGxpcHNpc1wiPnt7aXRlbS5uYW1lfX08L3NwYW4+XHJcbiAgICAgICAgPC90ZD5cclxuICAgICAgICA8dGQgY2xhc3M9XCJ0YWJsZS1pdGVtLXNob3J0XCI+e3tpdGVtLnNpemV9fTwvdGQ+XHJcbiAgICAgIDwvdHI+XHJcbiAgICA8L3RhYmxlPlxyXG4gIDwvZGl2PlxyXG48L25neC1zbWFydC1tb2RhbD5cclxuPG5neC1zbWFydC1tb2RhbCBpZGVudGlmaWVyPVwid2FpdE1vZGFsXCIgW2Nsb3NhYmxlXT1cImZhbHNlXCIgW2Rpc21pc3NhYmxlXT1cImZhbHNlXCIgW2VzY2FwYWJsZV09XCJmYWxzZVwiPlxyXG4gIDxoMiBjbGFzcz1cIm1vZGFsLXRpdGxlXCIgc3R5bGU9XCJtYXJnaW4tdG9wOiAyMHB4XCI+XHJcbiAgICB7eydQcm9jZXNzaW5nIHJlcXVlc3QnfX0uLi5cclxuICA8L2gyPlxyXG5cclxuICA8ZGl2IHN0eWxlPVwidGV4dC1hbGlnbjogY2VudGVyOyBoZWlnaHQ6IDcwcHhcIj5cclxuICAgIDxpIGNsYXNzPVwiZmFzIGZhLXNwaW5uZXIgZmEtc3BpbiBmYS00eFwiPjwvaT5cclxuICA8L2Rpdj5cclxuPC9uZ3gtc21hcnQtbW9kYWw+XHJcbjxuZ3gtc21hcnQtbW9kYWwgaWRlbnRpZmllcj1cImVycm9yTW9kYWxcIiBbY2xvc2FibGVdPVwidHJ1ZVwiPlxyXG4gIDxoMiBjbGFzcz1cIm1vZGFsLXRpdGxlXCIgc3R5bGU9XCJtYXJnaW4tdG9wOiAyMHB4XCI+XHJcbiAgICB7eydTb21ldGhpbmcgd2VudCB3cm9uZyB3aXRoIHlvdXIgcmVxdWVzdCd9fS4uLlxyXG4gIDwvaDI+XHJcbjwvbmd4LXNtYXJ0LW1vZGFsPlxyXG5gLFxyXG4gIHN0eWxlczogW2AuY29udGVudHtoZWlnaHQ6MTAwJTttaW4td2lkdGg6ODUwcHh9LmhvbGRlcntkaXNwbGF5Oi13ZWJraXQtZmxleDtkaXNwbGF5OmZsZXg7aGVpZ2h0OmNhbGMoMTAwJSAtIDc1cHgpfS5wYXRoe21hcmdpbjphdXRvIDA7ZGlzcGxheTpibG9ja30ubmF2aWdhdGlvbnttYXJnaW46YXV0byAwO2Rpc3BsYXk6LXdlYmtpdC1mbGV4O2Rpc3BsYXk6ZmxleH0ubmF2aWdhdGlvbiAuYnV0dG9ue21hcmdpbjowIDEwcHg7cGFkZGluZzowO3Bvc2l0aW9uOnJlbGF0aXZlfS5yaWdodHt3aWR0aDoxMDAlO3Bvc2l0aW9uOnJlbGF0aXZlO292ZXJmbG93OmF1dG99LmZpbGUtbmFtZXt3aWR0aDoxMDBweDtoZWlnaHQ6MjVweDtvdmVyZmxvdzpoaWRkZW47d2hpdGUtc3BhY2U6bm93cmFwO3RleHQtb3ZlcmZsb3c6ZWxsaXBzaXM7Ym94LXNpemluZzpib3JkZXItYm94Oy13ZWJraXQtdXNlci1zZWxlY3Q6bm9uZTstbW96LXVzZXItc2VsZWN0Om5vbmU7LW1zLXVzZXItc2VsZWN0Om5vbmU7dXNlci1zZWxlY3Q6bm9uZX0uZmlsZS1wcmV2aWV3e21hcmdpbjphdXRvfS5maWxlLXByZXZpZXcgaXtsaW5lLWhlaWdodDoxLjV9LnNwaW5uZXJ7cG9zaXRpb246YWJzb2x1dGU7dG9wOjUwJTtsZWZ0OjUwJTstd2Via2l0LXRyYW5zZm9ybTp0cmFuc2xhdGUoLTUwJSwtNTAlKTt0cmFuc2Zvcm06dHJhbnNsYXRlKC01MCUsLTUwJSk7Y3Vyc29yOnByb2dyZXNzfS5yZW5hbWUtYnV0dG9ue21hcmdpbjoyMHB4IGF1dG87ZGlzcGxheTpibG9jazt0ZXh0LWFsaWduOmNlbnRlcn0ubW9kYWwtdGl0bGV7bWFyZ2luLXRvcDo1cHg7dGV4dC1hbGlnbjpjZW50ZXJ9LnNlYXJjaC1vdXRwdXR7bWFyZ2luOjE1cHggMH0uc2VhcmNoLW91dHB1dC1pY29ue21hcmdpbjoycHggNXB4fS50YWJsZS1pdGVte3dpZHRoOjgwJX0udGFibGUtaXRlbS1zaG9ydHt3aWR0aDoyMCU7dGV4dC1hbGlnbjpyaWdodH1gXSxcclxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBGaWxlTWFuYWdlckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcbiAgQElucHV0KCkgaWNvblRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xyXG4gIEBJbnB1dCgpIGZvbGRlckNvbnRlbnRUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcclxuICBASW5wdXQoKSBmb2xkZXJDb250ZW50QmFja1RlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xyXG4gIEBJbnB1dCgpIGZvbGRlckNvbnRlbnROZXdUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcclxuICBASW5wdXQoKSBsb2FkaW5nT3ZlcmxheVRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xyXG4gIEBJbnB1dCgpIHNpZGVWaWV3VGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XHJcblxyXG4gIEBJbnB1dCgpIHRyZWU6IFRyZWVNb2RlbDtcclxuICBASW5wdXQoKSBpc1BvcHVwOiBib29sZWFuID0gZmFsc2U7XHJcbiAgQE91dHB1dCgpIGl0ZW1DbGlja2VkID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICBzZWxlY3RlZE5vZGU6IE5vZGVJbnRlcmZhY2U7XHJcbiAgc2lkZU1lbnVDbG9zZWQgPSB0cnVlO1xyXG5cclxuICBmbU9wZW4gPSBmYWxzZTtcclxuICBsb2FkaW5nOiBib29sZWFuO1xyXG4gIG5ld0RpYWxvZyA9IGZhbHNlO1xyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHByaXZhdGUgc3RvcmU6IFN0b3JlPEFwcFN0b3JlPixcclxuICAgIHByaXZhdGUgbm9kZVNlcnZpY2U6IE5vZGVTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSBub2RlQ2xpY2tlZFNlcnZpY2U6IE5vZGVDbGlja2VkU2VydmljZSxcclxuICAgIHB1YmxpYyBuZ3hTbWFydE1vZGFsU2VydmljZTogTmd4U21hcnRNb2RhbFNlcnZpY2UsXHJcbiAgKSB7XHJcbiAgfVxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICAgIC8vIEB0cy1pZ25vcmVcclxuICAgIHdpbmRvdy5jb25zb2xlID0gd2luZG93LmNvbnNvbGUgfHwge307XHJcbiAgICB3aW5kb3cuY29uc29sZS5sb2cgPSB3aW5kb3cuY29uc29sZS5sb2cgfHwgZnVuY3Rpb24gKCkge1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLm5vZGVTZXJ2aWNlLnRyZWUgPSB0aGlzLnRyZWU7XHJcbiAgICB0aGlzLm5vZGVDbGlja2VkU2VydmljZS50cmVlID0gdGhpcy50cmVlO1xyXG4gICAgdGhpcy5ub2RlU2VydmljZS5zdGFydE1hbmFnZXJBdCh0aGlzLnRyZWUuY3VycmVudFBhdGgpO1xyXG5cclxuICAgIHRoaXMuc3RvcmVcclxuICAgICAgLnBpcGUoc2VsZWN0KHN0YXRlID0+IHN0YXRlLmZpbGVNYW5hZ2VyU3RhdGUuaXNMb2FkaW5nKSlcclxuICAgICAgLnN1YnNjcmliZSgoZGF0YTogYm9vbGVhbikgPT4ge1xyXG4gICAgICAgIHRoaXMubG9hZGluZyA9IGRhdGE7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgIHRoaXMuc3RvcmVcclxuICAgICAgLnBpcGUoc2VsZWN0KHN0YXRlID0+IHN0YXRlLmZpbGVNYW5hZ2VyU3RhdGUuc2VsZWN0ZWROb2RlKSlcclxuICAgICAgLnN1YnNjcmliZSgobm9kZTogTm9kZUludGVyZmFjZSkgPT4ge1xyXG4gICAgICAgIGlmICghbm9kZSkge1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gZml4ZWQgaGlnaGxpZ2h0aW5nIGVycm9yIHdoZW4gY2xvc2luZyBub2RlIGJ1dCBub3QgY2hhbmdpbmcgcGF0aFxyXG4gICAgICAgIGlmICgobm9kZS5pc0V4cGFuZGVkICYmIG5vZGUucGF0aFRvTm9kZSAhPT0gdGhpcy5ub2RlU2VydmljZS5jdXJyZW50UGF0aCkgJiYgIW5vZGUuc3RheU9wZW4pIHtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuaGFuZGxlRmlsZU1hbmFnZXJDbGlja0V2ZW50KHt0eXBlOiAnc2VsZWN0Jywgbm9kZTogbm9kZX0pO1xyXG4gICAgICB9KTtcclxuICB9XHJcblxyXG4gIG9uSXRlbUNsaWNrZWQoZXZlbnQ6IGFueSk6IHZvaWQge1xyXG4gICAgdGhpcy5pdGVtQ2xpY2tlZC5lbWl0KGV2ZW50KTtcclxuICB9XHJcblxyXG4gIHNlYXJjaENsaWNrZWQoZGF0YTogYW55KSB7XHJcbiAgICAvLyBjb25zb2xlLmxvZyhkYXRhKTtcclxuXHJcbiAgICBjb25zdCBub2RlID0gdGhpcy5ub2RlU2VydmljZS5maW5kTm9kZUJ5SWQoZGF0YS5pZCk7XHJcbiAgICB0aGlzLm5neFNtYXJ0TW9kYWxTZXJ2aWNlLmdldE1vZGFsKCdzZWFyY2hNb2RhbCcpLmNsb3NlKCk7XHJcbiAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKHt0eXBlOiBBQ1RJT05TLlNFVF9TRUxFQ1RFRF9OT0RFLCBwYXlsb2FkOiBub2RlfSk7XHJcbiAgfVxyXG5cclxuICBoYW5kbGVGaWxlTWFuYWdlckNsaWNrRXZlbnQoZXZlbnQ6IGFueSkge1xyXG4gICAgc3dpdGNoIChldmVudC50eXBlKSB7XHJcbiAgICAgIGNhc2UgJ2Nsb3NlU2lkZVZpZXcnIDpcclxuICAgICAgICByZXR1cm4gdGhpcy5ub2RlQ2xpY2tIYW5kbGVyKGV2ZW50Lm5vZGUsIHRydWUpO1xyXG5cclxuICAgICAgY2FzZSAnc2VsZWN0JyA6XHJcbiAgICAgICAgdGhpcy5vbkl0ZW1DbGlja2VkKGV2ZW50KTtcclxuICAgICAgICB0aGlzLmhpZ2hsaWdodFNlbGVjdGVkKGV2ZW50Lm5vZGUpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLm5vZGVDbGlja0hhbmRsZXIoZXZlbnQubm9kZSk7XHJcblxyXG4gICAgICBjYXNlICdkb3dubG9hZCcgOlxyXG4gICAgICAgIHRoaXMubm9kZUNsaWNrZWRTZXJ2aWNlLnN0YXJ0RG93bmxvYWQoZXZlbnQubm9kZSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub25JdGVtQ2xpY2tlZChldmVudCk7XHJcblxyXG4gICAgICBjYXNlICdyZW5hbWVDb25maXJtJyA6XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubmd4U21hcnRNb2RhbFNlcnZpY2UuZ2V0TW9kYWwoJ3JlbmFtZU1vZGFsJykub3BlbigpO1xyXG4gICAgICBjYXNlICdyZW5hbWUnIDpcclxuICAgICAgICB0aGlzLm5neFNtYXJ0TW9kYWxTZXJ2aWNlLmdldE1vZGFsKCdyZW5hbWVNb2RhbCcpLmNsb3NlKCk7XHJcblxyXG4gICAgICAgIHRoaXMubm9kZUNsaWNrZWRTZXJ2aWNlLnJlbmFtZSh0aGlzLnNlbGVjdGVkTm9kZS5pZCwgZXZlbnQudmFsdWUpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9uSXRlbUNsaWNrZWQoe1xyXG4gICAgICAgICAgdHlwZTogZXZlbnQudHlwZSxcclxuICAgICAgICAgIG5vZGU6IHRoaXMuc2VsZWN0ZWROb2RlLFxyXG4gICAgICAgICAgbmV3TmFtZTogZXZlbnQudmFsdWVcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgIGNhc2UgJ3JlbW92ZUFzayc6XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubmd4U21hcnRNb2RhbFNlcnZpY2UuZ2V0TW9kYWwoJ2NvbmZpcm1EZWxldGVNb2RhbCcpLm9wZW4oKTtcclxuICAgICAgY2FzZSAncmVtb3ZlJzpcclxuICAgICAgICB0aGlzLm5neFNtYXJ0TW9kYWxTZXJ2aWNlLmdldE1vZGFsKCdjb25maXJtRGVsZXRlTW9kYWwnKS5jbG9zZSgpO1xyXG5cclxuICAgICAgICB0aGlzLm5vZGVDbGlja2VkU2VydmljZS5pbml0RGVsZXRlKHRoaXMuc2VsZWN0ZWROb2RlKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5vbkl0ZW1DbGlja2VkKHtcclxuICAgICAgICAgIHR5cGU6IGV2ZW50LnR5cGUsXHJcbiAgICAgICAgICBub2RlOiB0aGlzLnNlbGVjdGVkTm9kZVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgY2FzZSAnY3JlYXRlRm9sZGVyJyA6XHJcbiAgICAgICAgY29uc3QgcGFyZW50SWQgPSB0aGlzLm5vZGVTZXJ2aWNlLmZpbmROb2RlQnlQYXRoKHRoaXMubm9kZVNlcnZpY2UuY3VycmVudFBhdGgpLmlkO1xyXG5cclxuICAgICAgICB0aGlzLm5vZGVDbGlja2VkU2VydmljZS5jcmVhdGVGb2xkZXIocGFyZW50SWQsIGV2ZW50LnBheWxvYWQpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9uSXRlbUNsaWNrZWQoe1xyXG4gICAgICAgICAgdHlwZTogZXZlbnQudHlwZSxcclxuICAgICAgICAgIHBhcmVudElkOiBwYXJlbnRJZCxcclxuICAgICAgICAgIG5ld0Rpck5hbWU6IGV2ZW50LnBheWxvYWRcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG5vZGVDbGlja0hhbmRsZXIobm9kZTogTm9kZUludGVyZmFjZSwgY2xvc2luZz86IGJvb2xlYW4pIHtcclxuICAgIGlmIChub2RlLm5hbWUgPT09ICdyb290Jykge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGNsb3NpbmcpIHtcclxuICAgICAgY29uc3QgcGFyZW50Tm9kZSA9IHRoaXMubm9kZVNlcnZpY2UuZmluZE5vZGVCeVBhdGgodGhpcy5ub2RlU2VydmljZS5jdXJyZW50UGF0aCk7XHJcbiAgICAgIHRoaXMuc3RvcmUuZGlzcGF0Y2goe3R5cGU6IEFDVElPTlMuU0VUX1NFTEVDVEVEX05PREUsIHBheWxvYWQ6IHBhcmVudE5vZGV9KTtcclxuICAgICAgdGhpcy5zaWRlTWVudUNsb3NlZCA9IHRydWU7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgaWYgKHRoaXMuc2VsZWN0ZWROb2RlID09PSBub2RlICYmIHRoaXMuc2lkZU1lbnVDbG9zZWQpXHJcbiAgICAgICAgdGhpcy5zaWRlTWVudUNsb3NlZCA9IGZhbHNlO1xyXG4gICAgICBlbHNlIGlmICh0aGlzLnNlbGVjdGVkTm9kZSA9PT0gbm9kZSAmJiAhdGhpcy5zaWRlTWVudUNsb3NlZClcclxuICAgICAgICB0aGlzLnNpZGVNZW51Q2xvc2VkID0gdHJ1ZTtcclxuICAgICAgZWxzZSBpZiAodGhpcy5zZWxlY3RlZE5vZGUgIT09IG5vZGUgJiYgdGhpcy5zaWRlTWVudUNsb3NlZClcclxuICAgICAgICB0aGlzLnNpZGVNZW51Q2xvc2VkID0gZmFsc2U7XHJcbiAgICAgIGVsc2UgaWYgKHRoaXMuc2VsZWN0ZWROb2RlICE9PSBub2RlICYmICF0aGlzLnNpZGVNZW51Q2xvc2VkKVxyXG4gICAgICAgIHRoaXMuc2lkZU1lbnVDbG9zZWQgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnNlbGVjdGVkTm9kZSA9IG5vZGU7XHJcblxyXG4gICAgLy8gdG9kbyBpbnZlc3RpZ2F0ZSB0aGlzIHdvcmthcm91bmQgLSB3YXJuaW5nOiBbRmlsZSBNYW5hZ2VyXSBmYWlsZWQgdG8gZmluZCByZXF1ZXN0ZWQgbm9kZSBmb3IgcGF0aDogW3BhdGhdXHJcbiAgICBpZighZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NpZGUtdmlldycpKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5zaWRlTWVudUNsb3NlZCkge1xyXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2lkZS12aWV3JykuY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0ZWQnKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzaWRlLXZpZXcnKS5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZCcpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gdG9kbyBzdGF5IERSWSFcclxuICBoaWdobGlnaHRTZWxlY3RlZChub2RlOiBOb2RlSW50ZXJmYWNlKSB7XHJcbiAgICBsZXQgcGF0aFRvTm9kZSA9IG5vZGUucGF0aFRvTm9kZTtcclxuXHJcbiAgICBpZiAocGF0aFRvTm9kZS5sZW5ndGggPT09IDApIHtcclxuICAgICAgcGF0aFRvTm9kZSA9ICdyb290JztcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCB0cmVlRWxlbWVudCA9IHRoaXMuZ2V0RWxlbWVudEJ5SWQocGF0aFRvTm9kZSwgJ3RyZWVfJyk7XHJcbiAgICBjb25zdCBmY0VsZW1lbnQgPSB0aGlzLmdldEVsZW1lbnRCeUlkKHBhdGhUb05vZGUsICdmY18nKTtcclxuICAgIGlmICghdHJlZUVsZW1lbnQgJiYgIWZjRWxlbWVudCkge1xyXG4gICAgICBjb25zb2xlLndhcm4oJ1tGaWxlIE1hbmFnZXJdIGZhaWxlZCB0byBmaW5kIHJlcXVlc3RlZCBub2RlIGZvciBwYXRoOicsIHBhdGhUb05vZGUpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5yZW1vdmVDbGFzcygnaGlnaGxpZ2h0ZWQnKTtcclxuICAgIHRoaXMucmVtb3ZlQ2xhc3MoJ2xpZ2h0Jyk7XHJcblxyXG4gICAgaWYgKGZjRWxlbWVudClcclxuICAgICAgdGhpcy5oaWdoaWxnaHRDaGlsZEVsZW1lbnQoZmNFbGVtZW50KTtcclxuICAgIGlmICh0cmVlRWxlbWVudClcclxuICAgICAgdGhpcy5oaWdoaWxnaHRDaGlsZEVsZW1lbnQodHJlZUVsZW1lbnQsIHRydWUpO1xyXG5cclxuICAgIC8vIHBhcmVudCBub2RlIGhpZ2hsaWdodFxyXG4gICAgbGV0IHBhdGhUb1BhcmVudCA9IG5vZGUucGF0aFRvUGFyZW50O1xyXG4gICAgaWYgKHBhdGhUb1BhcmVudCA9PT0gbnVsbCB8fCBub2RlLnBhdGhUb05vZGUgPT09IHRoaXMubm9kZVNlcnZpY2UuY3VycmVudFBhdGgpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChwYXRoVG9QYXJlbnQubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgIHBhdGhUb1BhcmVudCA9ICdyb290JztcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBwYXJlbnRFbGVtZW50ID0gdGhpcy5nZXRFbGVtZW50QnlJZChwYXRoVG9QYXJlbnQsICd0cmVlXycpO1xyXG4gICAgaWYgKCFwYXJlbnRFbGVtZW50KSB7XHJcbiAgICAgIGNvbnNvbGUud2FybignW0ZpbGUgTWFuYWdlcl0gZmFpbGVkIHRvIGZpbmQgcmVxdWVzdGVkIHBhcmVudCBub2RlIGZvciBwYXRoOicsIHBhdGhUb1BhcmVudCk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmhpZ2hpbGdodENoaWxkRWxlbWVudChwYXJlbnRFbGVtZW50KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgaGlnaGlsZ2h0Q2hpbGRFbGVtZW50KGVsOiBIVE1MRWxlbWVudCwgbGlnaHQ6IGJvb2xlYW4gPSBmYWxzZSkge1xyXG4gICAgZWwuY2hpbGRyZW5bMF0gLy8gYXBwbm9kZSBkaXYgd3JhcHBlclxyXG4gICAgICAuY2hpbGRyZW5bMF0gLy8gbmcgdGVtcGxhdGUgZmlyc3QgaXRlbVxyXG4gICAgICAuY2xhc3NMaXN0LmFkZCgnaGlnaGxpZ2h0ZWQnKTtcclxuXHJcbiAgICBpZiAobGlnaHQpXHJcbiAgICAgIGVsLmNoaWxkcmVuWzBdXHJcbiAgICAgICAgLmNoaWxkcmVuWzBdXHJcbiAgICAgICAgLmNsYXNzTGlzdC5hZGQoJ2xpZ2h0Jyk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdldEVsZW1lbnRCeUlkKGlkOiBzdHJpbmcsIHByZWZpeDogc3RyaW5nID0gJycpOiBIVE1MRWxlbWVudCB7XHJcbiAgICBjb25zdCBmdWxsSWQgPSBwcmVmaXggKyBpZDtcclxuICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChmdWxsSWQpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSByZW1vdmVDbGFzcyhjbGFzc05hbWU6IHN0cmluZykge1xyXG4gICAgQXJyYXkuZnJvbShkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKGNsYXNzTmFtZSkpXHJcbiAgICAgIC5tYXAoKGVsOiBIVE1MRWxlbWVudCkgPT4gZWwuY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpKTtcclxuICB9XHJcblxyXG4gIGZtU2hvd0hpZGUoKSB7XHJcbiAgICB0aGlzLmZtT3BlbiA9ICF0aGlzLmZtT3BlbjtcclxuICB9XHJcblxyXG4gIGJhY2tkcm9wQ2xpY2tlZCgpIHtcclxuICAgIC8vIHRvZG8gZ2V0IHJpZCBvZiB0aGlzIHVnbHkgd29ya2Fyb3VuZFxyXG4gICAgLy8gdG9kbyBmaXJlIHVzZXJDYW5jZWxlZExvYWRpbmcgZXZlbnRcclxuICAgIHRoaXMuc3RvcmUuZGlzcGF0Y2goe3R5cGU6IFNFVF9MT0FESU5HX1NUQVRFLCBwYXlsb2FkOiBmYWxzZX0pO1xyXG4gIH1cclxuXHJcbiAgaGFuZGxlVXBsb2FkRGlhbG9nKGV2ZW50OiBhbnkpIHtcclxuICAgIHRoaXMubmV3RGlhbG9nID0gZXZlbnQ7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7Q29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIElucHV0LCBPbkluaXQsIE91dHB1dCwgVGVtcGxhdGVSZWZ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge3NlbGVjdCwgU3RvcmV9IGZyb20gJ0BuZ3J4L3N0b3JlJztcclxuaW1wb3J0IHtUcmVlTW9kZWx9IGZyb20gJy4uLy4uL21vZGVscy90cmVlLm1vZGVsJztcclxuaW1wb3J0IHtOb2RlU2VydmljZX0gZnJvbSAnLi4vLi4vc2VydmljZXMvbm9kZS5zZXJ2aWNlJztcclxuaW1wb3J0IHtOb2RlSW50ZXJmYWNlfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzL25vZGUuaW50ZXJmYWNlJztcclxuaW1wb3J0IHtBcHBTdG9yZX0gZnJvbSAnLi4vLi4vcmVkdWNlcnMvcmVkdWNlci5mYWN0b3J5JztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnYXBwLWZvbGRlci1jb250ZW50JyxcclxuICB0ZW1wbGF0ZTogYDxkaXYgY2xhc3M9XCJpdGVtLWhvbGRlclwiPlxyXG4gIDxuZy1jb250YWluZXIgKm5nSWY9XCJub2Rlcy5pZCAhPT0gMFwiPlxyXG4gICAgPGFwcC1ub2RlIFtub2RlXT1ub2RlcyBpZD1cInt7bm9kZXMucGF0aFRvTm9kZX19XCI+XHJcbiAgICAgIDxuZy1jb250YWluZXIgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cInskaW1wbGljaXQ6IG5vZGVzfVwiXHJcbiAgICAgICAgICAgICAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRdPVwiZm9sZGVyQ29udGVudEJhY2tUZW1wbGF0ZVwiPlxyXG4gICAgICA8L25nLWNvbnRhaW5lcj5cclxuICAgIDwvYXBwLW5vZGU+XHJcbiAgPC9uZy1jb250YWluZXI+XHJcblxyXG4gIDxuZy1jb250YWluZXIgKm5nRm9yPVwibGV0IG5vZGUgb2Ygb2JqLmtleXMobm9kZXMuY2hpbGRyZW4pXCI+XHJcbiAgICA8YXBwLW5vZGUgW25vZGVdPVwibm9kZXMuY2hpbGRyZW5bbm9kZV1cIlxyXG4gICAgICAgICAgICAgIGlkPVwiZmNfe3tub2Rlcy5jaGlsZHJlbltub2RlXS5wYXRoVG9Ob2RlfX1cIj5cclxuICAgICAgPG5nLWNvbnRhaW5lciBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwieyRpbXBsaWNpdDogbm9kZXMuY2hpbGRyZW5bbm9kZV19XCJcclxuICAgICAgICAgICAgICAgICAgICBbbmdUZW1wbGF0ZU91dGxldF09XCJmb2xkZXJDb250ZW50VGVtcGxhdGVcIj5cclxuICAgICAgPC9uZy1jb250YWluZXI+XHJcbiAgICA8L2FwcC1ub2RlPlxyXG4gIDwvbmctY29udGFpbmVyPlxyXG5cclxuICA8ZGl2IGNsYXNzPVwibmV3XCIgKGNsaWNrKT1cIm5ld0NsaWNrZWRBY3Rpb24oKVwiPlxyXG4gICAgPG5nLWNvbnRhaW5lciBbbmdUZW1wbGF0ZU91dGxldF09XCJmb2xkZXJDb250ZW50TmV3VGVtcGxhdGVcIj48L25nLWNvbnRhaW5lcj5cclxuICA8L2Rpdj5cclxuPC9kaXY+XHJcbmAsXHJcbiAgc3R5bGVzOiBbYC5pdGVtLWhvbGRlcntib3gtc2l6aW5nOmJvcmRlci1ib3g7ZGlzcGxheTotd2Via2l0LWZsZXg7ZGlzcGxheTpmbGV4Oy13ZWJraXQtZmxleC1mbG93OndyYXA7ZmxleC1mbG93OndyYXB9Lml0ZW0taG9sZGVyIC5uZXd7ZGlzcGxheTppbmxpbmV9YF1cclxufSlcclxuZXhwb3J0IGNsYXNzIEZvbGRlckNvbnRlbnRDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG4gIEBJbnB1dCgpIGZvbGRlckNvbnRlbnRUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcclxuICBASW5wdXQoKSBmb2xkZXJDb250ZW50QmFja1RlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xyXG4gIEBJbnB1dCgpIGZvbGRlckNvbnRlbnROZXdUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcclxuXHJcbiAgQElucHV0KCkgdHJlZU1vZGVsOiBUcmVlTW9kZWw7XHJcblxyXG4gIEBPdXRwdXQoKSBvcGVuVXBsb2FkRGlhbG9nID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICBub2RlczogTm9kZUludGVyZmFjZTtcclxuICBvYmogPSBPYmplY3Q7XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcHJpdmF0ZSBub2RlU2VydmljZTogTm9kZVNlcnZpY2UsXHJcbiAgICBwcml2YXRlIHN0b3JlOiBTdG9yZTxBcHBTdG9yZT5cclxuICApIHtcclxuICB9XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gICAgdGhpcy5zdG9yZVxyXG4gICAgICAucGlwZShzZWxlY3Qoc3RhdGUgPT4gc3RhdGUuZmlsZU1hbmFnZXJTdGF0ZS5wYXRoKSlcclxuICAgICAgLnN1YnNjcmliZSgocGF0aDogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgdGhpcy5ub2RlcyA9IHRoaXMubm9kZVNlcnZpY2UuZmluZE5vZGVCeVBhdGgocGF0aCk7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgbmV3Q2xpY2tlZEFjdGlvbigpIHtcclxuICAgIHRoaXMub3BlblVwbG9hZERpYWxvZy5lbWl0KHRydWUpO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQge0FmdGVyVmlld0luaXQsIENvbXBvbmVudCwgQ29udGVudENoaWxkLCBJbnB1dCwgT25Jbml0LCBUZW1wbGF0ZVJlZn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7Tm9kZUludGVyZmFjZX0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlcy9ub2RlLmludGVyZmFjZSc7XHJcbmltcG9ydCB7VHJlZU1vZGVsfSBmcm9tICcuLi8uLi9tb2RlbHMvdHJlZS5tb2RlbCc7XHJcbmltcG9ydCB7Tm9kZVNlcnZpY2V9IGZyb20gJy4uLy4uL3NlcnZpY2VzL25vZGUuc2VydmljZSc7XHJcbmltcG9ydCB7c2VsZWN0LCBTdG9yZX0gZnJvbSAnQG5ncngvc3RvcmUnO1xyXG5pbXBvcnQge0FwcFN0b3JlfSBmcm9tICcuLi8uLi9yZWR1Y2Vycy9yZWR1Y2VyLmZhY3RvcnknO1xyXG5pbXBvcnQgKiBhcyBBQ1RJT05TIGZyb20gJy4uLy4uL3JlZHVjZXJzL2FjdGlvbnMuYWN0aW9uJztcclxuaW1wb3J0IHtmaXJzdH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdhcHAtdHJlZScsXHJcbiAgdGVtcGxhdGU6IGA8YXBwLW5vZGUtbGlzdGVyIFtzaG93RmlsZXNdPVwidHJlZU1vZGVsLmNvbmZpZy5vcHRpb25zLnNob3dGaWxlc0luc2lkZVRyZWVcIlxyXG4gICAgICAgICAgICAgICAgIFtub2Rlc109XCJ7Y2hpbGRyZW46IG5vZGVzfVwiPlxyXG4gIDxuZy10ZW1wbGF0ZSBsZXQtbm9kZXM+XHJcbiAgICA8bmctY29udGFpbmVyIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7JGltcGxpY2l0OiBub2Rlc31cIiBbbmdUZW1wbGF0ZU91dGxldF09XCJ0ZW1wbGF0ZVJlZlwiPjwvbmctY29udGFpbmVyPlxyXG4gIDwvbmctdGVtcGxhdGU+XHJcbjwvYXBwLW5vZGUtbGlzdGVyPlxyXG5gLFxyXG4gIHN0eWxlczogW2BgXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgVHJlZUNvbXBvbmVudCBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQsIE9uSW5pdCB7XHJcbiAgQENvbnRlbnRDaGlsZChUZW1wbGF0ZVJlZikgdGVtcGxhdGVSZWY6IFRlbXBsYXRlUmVmPGFueT47XHJcblxyXG4gIEBJbnB1dCgpIHRyZWVNb2RlbDogVHJlZU1vZGVsO1xyXG5cclxuICBub2RlczogTm9kZUludGVyZmFjZTtcclxuICBjdXJyZW50VHJlZUxldmVsID0gJyc7XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcHJpdmF0ZSBub2RlU2VydmljZTogTm9kZVNlcnZpY2UsXHJcbiAgICBwcml2YXRlIHN0b3JlOiBTdG9yZTxBcHBTdG9yZT5cclxuICApIHtcclxuICB9XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gICAgdGhpcy5ub2RlcyA9IHRoaXMudHJlZU1vZGVsLm5vZGVzO1xyXG5cclxuICAgIC8vdG9kbyBtb3ZlIHRoaXMgc3RvcmUgdG8gcHJvcGVyIHBsYWNlXHJcbiAgICB0aGlzLnN0b3JlXHJcbiAgICAgIC5waXBlKHNlbGVjdChzdGF0ZSA9PiBzdGF0ZS5maWxlTWFuYWdlclN0YXRlLnBhdGgpKVxyXG4gICAgICAuc3Vic2NyaWJlKChwYXRoOiBzdHJpbmcpID0+IHtcclxuICAgICAgICB0aGlzLm5vZGVTZXJ2aWNlLmdldE5vZGVzKHBhdGgpO1xyXG5cclxuICAgICAgICB0aGlzLmN1cnJlbnRUcmVlTGV2ZWwgPSB0aGlzLnRyZWVNb2RlbC5jdXJyZW50UGF0aDtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMudHJlZU1vZGVsLmN1cnJlbnRQYXRoID0gcGF0aDtcclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICBuZ0FmdGVyVmlld0luaXQoKSB7XHJcbiAgICB0aGlzLnN0b3JlXHJcbiAgICAgIC5waXBlKHNlbGVjdChzdGF0ZSA9PiBzdGF0ZS5maWxlTWFuYWdlclN0YXRlLnBhdGgpKVxyXG4gICAgICAucGlwZShmaXJzdCgpKVxyXG4gICAgICAuc3Vic2NyaWJlKChwYXRoOiBzdHJpbmcpID0+IHtcclxuICAgICAgICBjb25zdCBub2RlcyA9IHRoaXMubm9kZVNlcnZpY2UuZmluZE5vZGVCeVBhdGgocGF0aCk7XHJcbiAgICAgICAgdGhpcy5zdG9yZS5kaXNwYXRjaCh7dHlwZTogQUNUSU9OUy5TRVRfU0VMRUNURURfTk9ERSwgcGF5bG9hZDogbm9kZXN9KTtcclxuICAgICAgfSk7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7Q29tcG9uZW50LCBDb250ZW50Q2hpbGQsIElucHV0LCBPbkluaXQsIFRlbXBsYXRlUmVmfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtOb2RlSW50ZXJmYWNlfSBmcm9tICcuLi8uLi8uLi9pbnRlcmZhY2VzL25vZGUuaW50ZXJmYWNlJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnYXBwLW5vZGUtbGlzdGVyJyxcclxuICB0ZW1wbGF0ZTogYDx1bCBjbGFzcz1cIm5vZGUtbGlzdGVyLWZsaXN0XCI+XHJcbiAgPCEtLUluIG9yZGVyIHRvIGF2b2lkIGhhdmluZyB0byBjcmVhdGUgdGhhdCBleHRyYSBkaXYsIHdlIGNhbiBpbnN0ZWFkIHVzZSBuZy1jb250YWluZXIgZGlyZWN0aXZlLS0+XHJcbiAgPG5nLWNvbnRhaW5lciAqbmdGb3I9XCJsZXQgbm9kZSBvZiBvYmoua2V5cyhub2RlcylcIj5cclxuICAgIDxsaSBjbGFzcz1cIm5vZGUtbGlzdGVyLWxpc3QtaXRlbVwiICpuZ0lmPVwibm9kZXNbbm9kZV0uaXNGb2xkZXIgfHwgc2hvd0ZpbGVzXCI+XHJcblxyXG4gICAgICA8YXBwLW5vZGUgY2xhc3M9XCJub2RlLWxpc3Rlci1hcHAtbm9kZVwiIFtub2RlXT1cIm5vZGVzW25vZGVdXCIgaWQ9XCJ0cmVlX3t7bm9kZXNbbm9kZV0uaWQgPT09IDAgPyAncm9vdCcgOiBub2Rlc1tub2RlXS5wYXRoVG9Ob2RlfX1cIj5cclxuICAgICAgICA8bmctY29udGFpbmVyIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7JGltcGxpY2l0OiAobm9kZXNbbm9kZV0pfVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICBbbmdUZW1wbGF0ZU91dGxldF09XCJ0ZW1wbGF0ZVJlZlwiPlxyXG4gICAgICAgIDwvbmctY29udGFpbmVyPlxyXG4gICAgICA8L2FwcC1ub2RlPlxyXG5cclxuICAgICAgPGFwcC1ub2RlLWxpc3RlciBjbGFzcz1cIm5vZGUtbGlzdGVyXCIgKm5nSWY9XCJvYmoua2V5cyhub2Rlc1tub2RlXS5jaGlsZHJlbikubGVuZ3RoID4gMFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgW3Nob3dGaWxlc109XCJzaG93RmlsZXNcIiBbbm9kZXNdPVwibm9kZXNbbm9kZV0uY2hpbGRyZW5cIj5cclxuICAgICAgICA8bmctdGVtcGxhdGUgbGV0LW5vZGVzPlxyXG4gICAgICAgICAgPG5nLWNvbnRhaW5lciBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwieyRpbXBsaWNpdDogKG5vZGVzKX1cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBbbmdUZW1wbGF0ZU91dGxldF09XCJ0ZW1wbGF0ZVJlZlwiPlxyXG4gICAgICAgICAgPC9uZy1jb250YWluZXI+XHJcbiAgICAgICAgPC9uZy10ZW1wbGF0ZT5cclxuICAgICAgPC9hcHAtbm9kZS1saXN0ZXI+XHJcbiAgICA8L2xpPlxyXG4gIDwvbmctY29udGFpbmVyPlxyXG48L3VsPlxyXG5gLFxyXG4gIHN0eWxlczogW2Aubm9kZS1saXN0ZXItZmxpc3R7bWFyZ2luOjAgMCAwIDFlbTtwYWRkaW5nOjA7bGlzdC1zdHlsZTpub25lO3doaXRlLXNwYWNlOm5vd3JhcH0ubm9kZS1saXN0ZXItbGlzdC1pdGVte2xpc3Qtc3R5bGU6bm9uZTtsaW5lLWhlaWdodDoxLjJlbTtmb250LXNpemU6MWVtO2Rpc3BsYXk6aW5saW5lfS5ub2RlLWxpc3Rlci1saXN0LWl0ZW0gLm5vZGUtbGlzdGVyLWFwcC1ub2RlLmRlc2VsZWN0ZWQrLm5vZGUtbGlzdGVyIHVse2Rpc3BsYXk6bm9uZX1gXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgTm9kZUxpc3RlckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcbiAgQENvbnRlbnRDaGlsZChUZW1wbGF0ZVJlZikgdGVtcGxhdGVSZWY6IFRlbXBsYXRlUmVmPGFueT47XHJcbiAgQElucHV0KCkgbm9kZXM6IE5vZGVJbnRlcmZhY2U7XHJcbiAgQElucHV0KCkgc2hvd0ZpbGVzOiBib29sZWFuO1xyXG5cclxuICBvYmogPSBPYmplY3Q7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gIH1cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7Q29tcG9uZW50LCBJbnB1dCwgT25Jbml0fSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtOb2RlSW50ZXJmYWNlfSBmcm9tICcuLi8uLi8uLi9pbnRlcmZhY2VzL25vZGUuaW50ZXJmYWNlJztcclxuaW1wb3J0IHtTdG9yZX0gZnJvbSAnQG5ncngvc3RvcmUnO1xyXG5cclxuaW1wb3J0ICogYXMgQUNUSU9OUyBmcm9tICcuLi8uLi8uLi9yZWR1Y2Vycy9hY3Rpb25zLmFjdGlvbic7XHJcbmltcG9ydCB7QXBwU3RvcmV9IGZyb20gJy4uLy4uLy4uL3JlZHVjZXJzL3JlZHVjZXIuZmFjdG9yeSc7XHJcbmltcG9ydCB7Tm9kZVNlcnZpY2V9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL25vZGUuc2VydmljZSc7XHJcbmltcG9ydCB7Tm9kZUNsaWNrZWRTZXJ2aWNlfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9ub2RlLWNsaWNrZWQuc2VydmljZSc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2FwcC1ub2RlJyxcclxuICB0ZW1wbGF0ZTogYDxkaXYgI2N1c3RvbVRlbXBsYXRlIChkYmxjbGljayk9XCJtZXRob2QyQ2FsbEZvckRibENsaWNrKCRldmVudClcIiAoY2xpY2spPVwibWV0aG9kMUNhbGxGb3JDbGljaygkZXZlbnQpXCI+XHJcbiAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxyXG48L2Rpdj5cclxuYCxcclxuICBzdHlsZXM6IFtgYF1cclxufSlcclxuZXhwb3J0IGNsYXNzIE5vZGVDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG4gIEBJbnB1dCgpIG5vZGU6IE5vZGVJbnRlcmZhY2U7XHJcbiAgaXNTaW5nbGVDbGljayA9IHRydWU7XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcHJpdmF0ZSBzdG9yZTogU3RvcmU8QXBwU3RvcmU+LFxyXG4gICAgcHJpdmF0ZSBub2RlU2VydmljZTogTm9kZVNlcnZpY2UsXHJcbiAgICBwcml2YXRlIG5vZGVDbGlja2VkU2VydmljZTogTm9kZUNsaWNrZWRTZXJ2aWNlXHJcbiAgKSB7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgbWV0aG9kMUNhbGxGb3JDbGljayhldmVudDogTW91c2VFdmVudCkge1xyXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICB0aGlzLmlzU2luZ2xlQ2xpY2sgPSB0cnVlO1xyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgIGlmICh0aGlzLmlzU2luZ2xlQ2xpY2spIHtcclxuICAgICAgICB0aGlzLnNob3dNZW51KCk7XHJcbiAgICAgIH1cclxuICAgIH0sIDIwMCk7XHJcbiAgfVxyXG5cclxuICAvLyB0b2RvIGV2ZW50LnByZXZlbnREZWZhdWx0IGZvciBkb3VibGUgY2xpY2tcclxuICBwdWJsaWMgbWV0aG9kMkNhbGxGb3JEYmxDbGljayhldmVudDogYW55KSB7XHJcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgIHRoaXMuaXNTaW5nbGVDbGljayA9IGZhbHNlO1xyXG4gICAgdGhpcy5vcGVuKCk7XHJcbiAgfVxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgb3BlbigpIHtcclxuICAgIGlmICghdGhpcy5ub2RlLmlzRm9sZGVyKSB7XHJcbiAgICAgIHRoaXMubm9kZUNsaWNrZWRTZXJ2aWNlLnN0YXJ0RG93bmxvYWQodGhpcy5ub2RlKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLm5vZGUuc3RheU9wZW4pIHtcclxuICAgICAgaWYgKHRoaXMubm9kZS5uYW1lID09ICdyb290Jykge1xyXG4gICAgICAgIHRoaXMubm9kZVNlcnZpY2UuZm9sZEFsbCgpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKHt0eXBlOiBBQ1RJT05TLlNFVF9QQVRILCBwYXlsb2FkOiB0aGlzLm5vZGUucGF0aFRvTm9kZX0pO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy50b2dnbGVOb2RlRXhwYW5kZWQoKTtcclxuXHJcbiAgICBpZiAodGhpcy5ub2RlLmlzRXhwYW5kZWQpIHtcclxuICAgICAgdGhpcy5zdG9yZS5kaXNwYXRjaCh7dHlwZTogQUNUSU9OUy5TRVRfUEFUSCwgcGF5bG9hZDogdGhpcy5ub2RlLnBhdGhUb05vZGV9KTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnNldE5vZGVTZWxlY3RlZFN0YXRlKCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHNob3dNZW51KCkge1xyXG4gICAgdGhpcy5zdG9yZS5kaXNwYXRjaCh7dHlwZTogQUNUSU9OUy5TRVRfU0VMRUNURURfTk9ERSwgcGF5bG9hZDogdGhpcy5ub2RlfSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHRvZ2dsZU5vZGVFeHBhbmRlZCgpIHtcclxuICAgIHRoaXMubm9kZS5pc0V4cGFuZGVkID0gIXRoaXMubm9kZS5pc0V4cGFuZGVkO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBzZXROb2RlU2VsZWN0ZWRTdGF0ZSgpIHtcclxuICAgIGlmICghdGhpcy5ub2RlLmlzRXhwYW5kZWQpIHtcclxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RyZWVfJyArIHRoaXMubm9kZS5wYXRoVG9Ob2RlKS5jbGFzc0xpc3QuYWRkKCdkZXNlbGVjdGVkJyk7XHJcblxyXG4gICAgICB0aGlzLm5vZGVTZXJ2aWNlLmZvbGRSZWN1cnNpdmVseSh0aGlzLm5vZGUpO1xyXG5cclxuICAgICAgdGhpcy5zdG9yZS5kaXNwYXRjaCh7dHlwZTogQUNUSU9OUy5TRVRfUEFUSCwgcGF5bG9hZDogdGhpcy5ub2RlLnBhdGhUb1BhcmVudH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RyZWVfJyArIHRoaXMubm9kZS5wYXRoVG9Ob2RlKS5jbGFzc0xpc3QucmVtb3ZlKCdkZXNlbGVjdGVkJyk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7UGlwZSwgUGlwZVRyYW5zZm9ybX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5AUGlwZSh7XHJcbiAgbmFtZTogJ21hcFRvSXRlcmFibGVQaXBlJ1xyXG59KVxyXG5leHBvcnQgY2xhc3MgTWFwVG9JdGVyYWJsZVBpcGUgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtIHtcclxuICB0cmFuc2Zvcm0oZGljdDogT2JqZWN0KSB7XHJcbiAgICBjb25zdCBhID0gW107XHJcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBkaWN0KSB7XHJcbiAgICAgIGlmIChkaWN0Lmhhc093blByb3BlcnR5KGtleSkpIHtcclxuICAgICAgICBhLnB1c2goe2tleToga2V5LCB2YWw6IGRpY3Rba2V5XX0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGE7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7Q29tcG9uZW50LCBPbkluaXR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge3NlbGVjdCwgU3RvcmV9IGZyb20gJ0BuZ3J4L3N0b3JlJztcclxuaW1wb3J0ICogYXMgQUNUSU9OUyBmcm9tICcuLi8uLi9yZWR1Y2Vycy9hY3Rpb25zLmFjdGlvbic7XHJcbmltcG9ydCB7QXBwU3RvcmV9IGZyb20gJy4uLy4uL3JlZHVjZXJzL3JlZHVjZXIuZmFjdG9yeSc7XHJcbmltcG9ydCB7Tm9kZVNlcnZpY2V9IGZyb20gJy4uLy4uL3NlcnZpY2VzL25vZGUuc2VydmljZSc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2FwcC1uYXYtYmFyJyxcclxuICB0ZW1wbGF0ZTogYDxkaXY+XHJcbiAgPj4gPHNwYW4gKm5nRm9yPVwibGV0IHRvIG9mIGN1cnJlbnRQYXRoOyBsZXQgaSA9IGluZGV4XCI+XHJcbiAgPGEgY2xhc3M9XCJsaW5rXCIgKGNsaWNrKT1cIm9uQ2xpY2soY3VycmVudFBhdGgsIGkpXCI+XHJcbiAgICA8ZGl2ICpuZ0lmPVwidG8gPT09ICcnIHx8IHRvID09PSAncm9vdCc7IHRoZW4gaWNvbiBlbHNlIG5hbWVcIj48L2Rpdj5cclxuICAgIDxuZy10ZW1wbGF0ZSAjaWNvbj48aSBjbGFzcz1cImZhcyBmYS1ob21lXCI+PC9pPjwvbmctdGVtcGxhdGU+XHJcbiAgICA8bmctdGVtcGxhdGUgI25hbWU+e3t0b319PC9uZy10ZW1wbGF0ZT5cclxuICA8L2E+IC9cclxuICA8L3NwYW4+XHJcbjwvZGl2PlxyXG5gLFxyXG4gIHN0eWxlczogW2BgXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgTmF2QmFyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuICBjdXJyZW50UGF0aDogc3RyaW5nW107XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcHJpdmF0ZSBzdG9yZTogU3RvcmU8QXBwU3RvcmU+LFxyXG4gICAgcHJpdmF0ZSBub2RlU2VydmljZTogTm9kZVNlcnZpY2VcclxuICApIHtcclxuICB9XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gICAgdGhpcy5zdG9yZVxyXG4gICAgICAucGlwZShzZWxlY3Qoc3RhdGUgPT4gc3RhdGUuZmlsZU1hbmFnZXJTdGF0ZS5wYXRoKSlcclxuICAgICAgLnN1YnNjcmliZSgoZGF0YTogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgdGhpcy5ub2RlU2VydmljZS5jdXJyZW50UGF0aCA9IGRhdGE7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50UGF0aCA9IGRhdGEuc3BsaXQoJy8nKTtcclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICBvbkNsaWNrKHBhdGg6IHN0cmluZ1tdLCBpbmRleDogbnVtYmVyKSB7XHJcbiAgICBjb25zdCBuZXdQYXRoID0gcGF0aC5zbGljZSgwLCBpbmRleCArIDEpLmpvaW4oJy8nKTtcclxuICAgIHRoaXMuc3RvcmUuZGlzcGF0Y2goe3R5cGU6IEFDVElPTlMuU0VUX1BBVEgsIHBheWxvYWQ6IG5ld1BhdGh9KTtcclxuICB9XHJcblxyXG59XHJcbiIsIi8qISAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5Db3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cclxuTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlXHJcbnRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlXHJcbkxpY2Vuc2UgYXQgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcblxyXG5USElTIENPREUgSVMgUFJPVklERUQgT04gQU4gKkFTIElTKiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZXHJcbktJTkQsIEVJVEhFUiBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBXSVRIT1VUIExJTUlUQVRJT04gQU5ZIElNUExJRURcclxuV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIFRJVExFLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSxcclxuTUVSQ0hBTlRBQkxJVFkgT1IgTk9OLUlORlJJTkdFTUVOVC5cclxuXHJcblNlZSB0aGUgQXBhY2hlIFZlcnNpb24gMi4wIExpY2Vuc2UgZm9yIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9uc1xyXG5hbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXHJcbi8qIGdsb2JhbCBSZWZsZWN0LCBQcm9taXNlICovXHJcblxyXG52YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uKGQsIGIpIHtcclxuICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICByZXR1cm4gZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4dGVuZHMoZCwgYikge1xyXG4gICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG59XHJcblxyXG5leHBvcnQgdmFyIF9fYXNzaWduID0gZnVuY3Rpb24oKSB7XHJcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gX19hc3NpZ24odCkge1xyXG4gICAgICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpIHRbcF0gPSBzW3BdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdDtcclxuICAgIH1cclxuICAgIHJldHVybiBfX2Fzc2lnbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZXN0KHMsIGUpIHtcclxuICAgIHZhciB0ID0ge307XHJcbiAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkgJiYgZS5pbmRleE9mKHApIDwgMClcclxuICAgICAgICB0W3BdID0gc1twXTtcclxuICAgIGlmIChzICE9IG51bGwgJiYgdHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPT09IFwiZnVuY3Rpb25cIilcclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgcCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMocyk7IGkgPCBwLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChlLmluZGV4T2YocFtpXSkgPCAwICYmIE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGUuY2FsbChzLCBwW2ldKSlcclxuICAgICAgICAgICAgICAgIHRbcFtpXV0gPSBzW3BbaV1dO1xyXG4gICAgICAgIH1cclxuICAgIHJldHVybiB0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xyXG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XHJcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xyXG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcGFyYW0ocGFyYW1JbmRleCwgZGVjb3JhdG9yKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwga2V5KSB7IGRlY29yYXRvcih0YXJnZXQsIGtleSwgcGFyYW1JbmRleCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpIHtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5tZXRhZGF0YSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gUmVmbGVjdC5tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0ZXIodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHJlc3VsdC52YWx1ZSk7IH0pLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZ2VuZXJhdG9yKHRoaXNBcmcsIGJvZHkpIHtcclxuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XHJcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xyXG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcclxuICAgICAgICB3aGlsZSAoXykgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xyXG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XHJcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxyXG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHBvcnRTdGFyKG0sIGV4cG9ydHMpIHtcclxuICAgIGZvciAodmFyIHAgaW4gbSkgaWYgKCFleHBvcnRzLmhhc093blByb3BlcnR5KHApKSBleHBvcnRzW3BdID0gbVtwXTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fdmFsdWVzKG8pIHtcclxuICAgIHZhciBtID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXSwgaSA9IDA7XHJcbiAgICBpZiAobSkgcmV0dXJuIG0uY2FsbChvKTtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgbmV4dDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAobyAmJiBpID49IG8ubGVuZ3RoKSBvID0gdm9pZCAwO1xyXG4gICAgICAgICAgICByZXR1cm4geyB2YWx1ZTogbyAmJiBvW2krK10sIGRvbmU6ICFvIH07XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVhZChvLCBuKSB7XHJcbiAgICB2YXIgbSA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl07XHJcbiAgICBpZiAoIW0pIHJldHVybiBvO1xyXG4gICAgdmFyIGkgPSBtLmNhbGwobyksIHIsIGFyID0gW10sIGU7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHdoaWxlICgobiA9PT0gdm9pZCAwIHx8IG4tLSA+IDApICYmICEociA9IGkubmV4dCgpKS5kb25lKSBhci5wdXNoKHIudmFsdWUpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGVycm9yKSB7IGUgPSB7IGVycm9yOiBlcnJvciB9OyB9XHJcbiAgICBmaW5hbGx5IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAociAmJiAhci5kb25lICYmIChtID0gaVtcInJldHVyblwiXSkpIG0uY2FsbChpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZmluYWxseSB7IGlmIChlKSB0aHJvdyBlLmVycm9yOyB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZCgpIHtcclxuICAgIGZvciAodmFyIGFyID0gW10sIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIGFyID0gYXIuY29uY2F0KF9fcmVhZChhcmd1bWVudHNbaV0pKTtcclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkQXJyYXlzKCkge1xyXG4gICAgZm9yICh2YXIgcyA9IDAsIGkgPSAwLCBpbCA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBpbDsgaSsrKSBzICs9IGFyZ3VtZW50c1tpXS5sZW5ndGg7XHJcbiAgICBmb3IgKHZhciByID0gQXJyYXkocyksIGsgPSAwLCBpID0gMDsgaSA8IGlsOyBpKyspXHJcbiAgICAgICAgZm9yICh2YXIgYSA9IGFyZ3VtZW50c1tpXSwgaiA9IDAsIGpsID0gYS5sZW5ndGg7IGogPCBqbDsgaisrLCBrKyspXHJcbiAgICAgICAgICAgIHJba10gPSBhW2pdO1xyXG4gICAgcmV0dXJuIHI7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdCh2KSB7XHJcbiAgICByZXR1cm4gdGhpcyBpbnN0YW5jZW9mIF9fYXdhaXQgPyAodGhpcy52ID0gdiwgdGhpcykgOiBuZXcgX19hd2FpdCh2KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNHZW5lcmF0b3IodGhpc0FyZywgX2FyZ3VtZW50cywgZ2VuZXJhdG9yKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIGcgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSksIGksIHEgPSBbXTtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyBpZiAoZ1tuXSkgaVtuXSA9IGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAoYSwgYikgeyBxLnB1c2goW24sIHYsIGEsIGJdKSA+IDEgfHwgcmVzdW1lKG4sIHYpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gcmVzdW1lKG4sIHYpIHsgdHJ5IHsgc3RlcChnW25dKHYpKTsgfSBjYXRjaCAoZSkgeyBzZXR0bGUocVswXVszXSwgZSk7IH0gfVxyXG4gICAgZnVuY3Rpb24gc3RlcChyKSB7IHIudmFsdWUgaW5zdGFuY2VvZiBfX2F3YWl0ID8gUHJvbWlzZS5yZXNvbHZlKHIudmFsdWUudikudGhlbihmdWxmaWxsLCByZWplY3QpIDogc2V0dGxlKHFbMF1bMl0sIHIpOyB9XHJcbiAgICBmdW5jdGlvbiBmdWxmaWxsKHZhbHVlKSB7IHJlc3VtZShcIm5leHRcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiByZWplY3QodmFsdWUpIHsgcmVzdW1lKFwidGhyb3dcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiBzZXR0bGUoZiwgdikgeyBpZiAoZih2KSwgcS5zaGlmdCgpLCBxLmxlbmd0aCkgcmVzdW1lKHFbMF1bMF0sIHFbMF1bMV0pOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jRGVsZWdhdG9yKG8pIHtcclxuICAgIHZhciBpLCBwO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiLCBmdW5jdGlvbiAoZSkgeyB0aHJvdyBlOyB9KSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobiwgZikgeyBpW25dID0gb1tuXSA/IGZ1bmN0aW9uICh2KSB7IHJldHVybiAocCA9ICFwKSA/IHsgdmFsdWU6IF9fYXdhaXQob1tuXSh2KSksIGRvbmU6IG4gPT09IFwicmV0dXJuXCIgfSA6IGYgPyBmKHYpIDogdjsgfSA6IGY7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNWYWx1ZXMobykge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBtID0gb1tTeW1ib2wuYXN5bmNJdGVyYXRvcl0sIGk7XHJcbiAgICByZXR1cm4gbSA/IG0uY2FsbChvKSA6IChvID0gdHlwZW9mIF9fdmFsdWVzID09PSBcImZ1bmN0aW9uXCIgPyBfX3ZhbHVlcyhvKSA6IG9bU3ltYm9sLml0ZXJhdG9yXSgpLCBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaSk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaVtuXSA9IG9bbl0gJiYgZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHsgdiA9IG9bbl0odiksIHNldHRsZShyZXNvbHZlLCByZWplY3QsIHYuZG9uZSwgdi52YWx1ZSk7IH0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCBkLCB2KSB7IFByb21pc2UucmVzb2x2ZSh2KS50aGVuKGZ1bmN0aW9uKHYpIHsgcmVzb2x2ZSh7IHZhbHVlOiB2LCBkb25lOiBkIH0pOyB9LCByZWplY3QpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ha2VUZW1wbGF0ZU9iamVjdChjb29rZWQsIHJhdykge1xyXG4gICAgaWYgKE9iamVjdC5kZWZpbmVQcm9wZXJ0eSkgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29va2VkLCBcInJhd1wiLCB7IHZhbHVlOiByYXcgfSk7IH0gZWxzZSB7IGNvb2tlZC5yYXcgPSByYXc7IH1cclxuICAgIHJldHVybiBjb29rZWQ7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnRTdGFyKG1vZCkge1xyXG4gICAgaWYgKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgcmV0dXJuIG1vZDtcclxuICAgIHZhciByZXN1bHQgPSB7fTtcclxuICAgIGlmIChtb2QgIT0gbnVsbCkgZm9yICh2YXIgayBpbiBtb2QpIGlmIChPYmplY3QuaGFzT3duUHJvcGVydHkuY2FsbChtb2QsIGspKSByZXN1bHRba10gPSBtb2Rba107XHJcbiAgICByZXN1bHQuZGVmYXVsdCA9IG1vZDtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydERlZmF1bHQobW9kKSB7XHJcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IGRlZmF1bHQ6IG1vZCB9O1xyXG59XHJcbiIsImltcG9ydCB7U3RhdGVJbnRlcmZhY2V9IGZyb20gJy4uL2ludGVyZmFjZXMvc3RhdGUuaW50ZXJmYWNlJztcclxuaW1wb3J0ICogYXMgQUNUSU9OUyBmcm9tICcuL2FjdGlvbnMuYWN0aW9uJztcclxuXHJcbmNvbnN0IGluaXRpYWxTdGF0ZTogU3RhdGVJbnRlcmZhY2UgPSB7XHJcbiAgcGF0aDogJycsXHJcbiAgaXNMb2FkaW5nOiB0cnVlLFxyXG4gIHNlbGVjdGVkTm9kZTogbnVsbFxyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHN0YXRlUmVkdWNlcihzdGF0ZTogU3RhdGVJbnRlcmZhY2UgPSBpbml0aWFsU3RhdGUsIGFjdGlvbjogQUNUSU9OUy5BY3Rpb25zKTogU3RhdGVJbnRlcmZhY2Uge1xyXG4gIC8vIGNvbnNvbGUubG9nKCdQcmV2aW91cyBzdGF0ZTogJywgc3RhdGUpO1xyXG4gIC8vIGNvbnNvbGUubG9nKCdBQ1RJT04gdHlwZTogJywgYWN0aW9uLnR5cGUpO1xyXG4gIC8vIGNvbnNvbGUubG9nKCdBQ1RJT04gcGF5bG9hZDogJywgYWN0aW9uLnBheWxvYWQpO1xyXG5cclxuICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICBjYXNlIEFDVElPTlMuU0VUX1BBVEggOlxyXG4gICAgICBpZiAoc3RhdGUucGF0aCA9PT0gYWN0aW9uLnBheWxvYWQpIHtcclxuICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHsuLi5zdGF0ZSwgcGF0aDogYWN0aW9uLnBheWxvYWQsIGlzTG9hZGluZzogdHJ1ZX07XHJcbiAgICBjYXNlIEFDVElPTlMuU0VUX0xPQURJTkdfU1RBVEUgOlxyXG4gICAgICByZXR1cm4gey4uLnN0YXRlLCBpc0xvYWRpbmc6IGFjdGlvbi5wYXlsb2FkfTtcclxuICAgIGNhc2UgQUNUSU9OUy5TRVRfU0VMRUNURURfTk9ERSA6XHJcbiAgICAgIHJldHVybiB7Li4uc3RhdGUsIHNlbGVjdGVkTm9kZTogYWN0aW9uLnBheWxvYWR9O1xyXG4gICAgZGVmYXVsdDpcclxuICAgICAgcmV0dXJuIGluaXRpYWxTdGF0ZTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHtzdGF0ZVJlZHVjZXJ9IGZyb20gJy4vc3RhdGVSZWR1Y2VyJztcclxuaW1wb3J0IHtBY3Rpb25SZWR1Y2VyTWFwfSBmcm9tICdAbmdyeC9zdG9yZSc7XHJcbmltcG9ydCB7U3RhdGVJbnRlcmZhY2V9IGZyb20gJy4uL2ludGVyZmFjZXMvc3RhdGUuaW50ZXJmYWNlJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQXBwU3RvcmUge1xyXG4gIGZpbGVNYW5hZ2VyU3RhdGU6IFN0YXRlSW50ZXJmYWNlO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgcmVkdWNlcnM6IEFjdGlvblJlZHVjZXJNYXA8QXBwU3RvcmU+ID0ge1xyXG4gIGZpbGVNYW5hZ2VyU3RhdGU6IHN0YXRlUmVkdWNlclxyXG59O1xyXG4iLCJpbXBvcnQge0NvbXBvbmVudCwgSW5wdXQsIE9uSW5pdCwgVGVtcGxhdGVSZWZ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge199IGZyb20gJ0BiaWVzYmplcmcvbmd4LXRyYW5zbGF0ZS1leHRyYWN0L2Rpc3QvdXRpbHMvdXRpbHMnO1xyXG5pbXBvcnQge3RpbWVyfSBmcm9tICdyeGpzJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnYXBwLWxvYWRpbmctb3ZlcmxheScsXHJcbiAgdGVtcGxhdGU6IGA8bmctY29udGFpbmVyXHJcbiAgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cInskaW1wbGljaXQ6IHRpbWVvdXRNZXNzYWdlfVwiXHJcbiAgW25nVGVtcGxhdGVPdXRsZXRdPVwibG9hZGluZ092ZXJsYXlUZW1wbGF0ZVwiPlxyXG48L25nLWNvbnRhaW5lcj5cclxuYCxcclxuICBzdHlsZXM6IFtgYF1cclxufSlcclxuZXhwb3J0IGNsYXNzIExvYWRpbmdPdmVybGF5Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuICBASW5wdXQoKSBsb2FkaW5nT3ZlcmxheVRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xyXG4gIHRpbWVvdXRNZXNzYWdlOiBhbnk7XHJcblxyXG4gIC8vIHRvZG8gdW5zdWJzY3JpYmUgZnJvbSAnbGlzdCcgZXZlbnQgLSBub3cgd2UgYXJlIG9ubHkgZGlzbWlzc2luZyB0aGlzIGNvbXBvbmVudFxyXG4gIG5nT25Jbml0KCkge1xyXG4gICAgdGltZXIoMjAwMCkuc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgdGhpcy50aW1lb3V0TWVzc2FnZSA9IF8oJ1Ryb3VibGVzIHdpdGggbG9hZGluZz8gQ2xpY2sgYW55d2hlcmUgdG8gY2FuY2VsIGxvYWRpbmcnKTtcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBQaXBlLCBQaXBlVHJhbnNmb3JtIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG4vKlxyXG4gKiBDb252ZXJ0IGJ5dGVzIGludG8gbGFyZ2VzdCBwb3NzaWJsZSB1bml0LlxyXG4gKiBUYWtlcyBhbiBwcmVjaXNpb24gYXJndW1lbnQgdGhhdCBkZWZhdWx0cyB0byAyLlxyXG4gKiBVc2FnZTpcclxuICogICBieXRlcyB8IGZpbGVTaXplOnByZWNpc2lvblxyXG4gKiBFeGFtcGxlOlxyXG4gKiAgIHt7IDEwMjQgfCAgZmlsZVNpemV9fVxyXG4gKiAgIGZvcm1hdHMgdG86IDEgS0JcclxuKi9cclxuQFBpcGUoe25hbWU6ICdmaWxlU2l6ZSd9KVxyXG5leHBvcnQgY2xhc3MgRmlsZVNpemVQaXBlIGltcGxlbWVudHMgUGlwZVRyYW5zZm9ybSB7XHJcblxyXG4gIHByaXZhdGUgdW5pdHMgPSBbXHJcbiAgICAnYnl0ZXMnLFxyXG4gICAgJ0tCJyxcclxuICAgICdNQicsXHJcbiAgICAnR0InLFxyXG4gICAgJ1RCJyxcclxuICAgICdQQidcclxuICBdO1xyXG5cclxuICB0cmFuc2Zvcm0oYnl0ZXM6IG51bWJlciA9IDAsIHByZWNpc2lvbjogbnVtYmVyID0gMiApIDogc3RyaW5nIHtcclxuICAgIGlmICggaXNOYU4oIHBhcnNlRmxvYXQoIFN0cmluZyhieXRlcykgKSkgfHwgISBpc0Zpbml0ZSggYnl0ZXMgKSApIHJldHVybiAnPyc7XHJcblxyXG4gICAgbGV0IHVuaXQgPSAwO1xyXG5cclxuICAgIHdoaWxlICggYnl0ZXMgPj0gMTAyNCApIHtcclxuICAgICAgYnl0ZXMgLz0gMTAyNDtcclxuICAgICAgdW5pdCArKztcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYnl0ZXMudG9GaXhlZCggKyBwcmVjaXNpb24gKSArICcgJyArIHRoaXMudW5pdHNbIHVuaXQgXTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHtBZnRlclZpZXdJbml0LCBDb21wb25lbnQsIEV2ZW50RW1pdHRlciwgSW5wdXQsIE9uSW5pdCwgT3V0cHV0LCBWaWV3RW5jYXBzdWxhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7SHR0cENsaWVudH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQge0ZpbmVVcGxvYWRlcn0gZnJvbSAnZmluZS11cGxvYWRlcic7XHJcbmltcG9ydCB7Tm9kZVNlcnZpY2V9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL25vZGUuc2VydmljZSc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2FwcC11cGxvYWQnLFxyXG4gIHRlbXBsYXRlOiBgPGRpdiBjbGFzcz1cImJhY2tkcm9wXCIgKGNsaWNrKT1cIm5ld0NsaWNrZWRBY3Rpb24oKVwiPjwvZGl2PlxyXG48ZGl2IGNsYXNzPVwidXBsb2FkLWJhY2tncm91bmRcIj5cclxuICA8ZGl2IGNsYXNzPVwiYnV0dG9uc1wiPlxyXG4gICAgPGJ1dHRvbiBjbGFzcz1cImJ1dHRvblwiIFtkaXNhYmxlZF09XCJuZXdGb2xkZXJcIiAoY2xpY2spPVwiY3JlYXRlTmV3Rm9sZGVyKClcIiB0cmFuc2xhdGU+Q3JlYXRlIG5ldyBmb2xkZXI8L2J1dHRvbj5cclxuICA8L2Rpdj5cclxuXHJcbiAgPGRpdiAqbmdJZj1cIm5ld0ZvbGRlclwiPlxyXG4gICAgPGRpdiBjbGFzcz1cImJ1dHRvbnNcIj5cclxuICAgICAgPGFwcC1uZXctZm9sZGVyIChidXR0b25DbGlja2VkKT1cImNyZWF0ZU5ld0ZvbGRlcigkZXZlbnQpXCI+PC9hcHAtbmV3LWZvbGRlcj5cclxuICAgIDwvZGl2PlxyXG4gIDwvZGl2PlxyXG5cclxuICA8ZGl2IGlkPVwiZmluZS11cGxvYWRlclwiPlxyXG4gIDwvZGl2PlxyXG5cclxuXHJcbiAgPGRpdiBjbGFzcz1cImJ1dHRvbnNcIj5cclxuICAgIDxidXR0b24gY2xhc3M9XCJidXR0b24gYmlnXCIgW2Rpc2FibGVkXT1cInRoaXMuY291bnRlciA8IDFcIiAoY2xpY2spPVwidXBsb2FkRmlsZXMoKVwiIHRyYW5zbGF0ZT5cclxuICAgICAgVXBsb2FkXHJcbiAgICA8L2J1dHRvbj5cclxuICAgIDxidXR0b24gY2xhc3M9XCJidXR0b24gYmlnXCIgKGNsaWNrKT1cIm5ld0NsaWNrZWRBY3Rpb24oKVwiIHRyYW5zbGF0ZT5cclxuICAgICAgQ2xvc2VcclxuICAgIDwvYnV0dG9uPlxyXG4gIDwvZGl2PlxyXG5cclxuPC9kaXY+XHJcblxyXG48ZGl2IGlkPVwiZmluZS11cGxvYWRlci10ZW1wbGF0ZVwiIHN0eWxlPVwiZGlzcGxheTogbm9uZTtcIj5cclxuICA8ZGl2IGNsYXNzPVwicXEtdXBsb2FkZXItc2VsZWN0b3IgcXEtdXBsb2FkZXJcIiBxcS1kcm9wLWFyZWEtdGV4dD1cIkRyb3AgZmlsZXMgaGVyZVwiPlxyXG4gICAgPGRpdiBjbGFzcz1cInFxLXVwbG9hZC1kcm9wLWFyZWEtc2VsZWN0b3IgcXEtdXBsb2FkLWRyb3AtYXJlYVwiIHFxLWhpZGUtZHJvcHpvbmU+XHJcbiAgICAgIDxzcGFuIGNsYXNzPVwicXEtdXBsb2FkLWRyb3AtYXJlYS10ZXh0LXNlbGVjdG9yXCI+PC9zcGFuPlxyXG4gICAgPC9kaXY+XHJcblxyXG4gICAgPGRpdiBjbGFzcz1cInVwbG9hZC10b3AtYmFyXCI+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJxcS11cGxvYWQtYnV0dG9uLXNlbGVjdG9yIHFxLXVwbG9hZC1idXR0b25cIj5cclxuICAgICAgICA8ZGl2IHRyYW5zbGF0ZT5VcGxvYWQgYSBmaWxlPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgPGRpdiBjbGFzcz1cInFxLXRvdGFsLXByb2dyZXNzLWJhci1jb250YWluZXItc2VsZWN0b3IgcXEtdG90YWwtcHJvZ3Jlc3MtYmFyLWNvbnRhaW5lclwiPlxyXG4gICAgICAgIDxkaXYgcm9sZT1cInByb2dyZXNzYmFyXCIgYXJpYS12YWx1ZW5vdz1cIjBcIiBhcmlhLXZhbHVlbWluPVwiMFwiIGFyaWEtdmFsdWVtYXg9XCIxMDBcIlxyXG4gICAgICAgICAgICAgY2xhc3M9XCJxcS10b3RhbC1wcm9ncmVzcy1iYXItc2VsZWN0b3IgcXEtcHJvZ3Jlc3MtYmFyIHFxLXRvdGFsLXByb2dyZXNzLWJhclwiPjwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG5cclxuICAgIDxzcGFuIGNsYXNzPVwicXEtZHJvcC1wcm9jZXNzaW5nLXNlbGVjdG9yIHFxLWRyb3AtcHJvY2Vzc2luZ1wiPlxyXG4gICAgICAgICAgICA8c3BhbiB0cmFuc2xhdGU+UHJvY2Vzc2luZyBkcm9wcGVkIGZpbGVzPC9zcGFuPi4uLlxyXG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cInFxLWRyb3AtcHJvY2Vzc2luZy1zcGlubmVyLXNlbGVjdG9yIHFxLWRyb3AtcHJvY2Vzc2luZy1zcGlubmVyXCI+PC9zcGFuPlxyXG4gICAgPC9zcGFuPlxyXG5cclxuICAgIDx1bCBjbGFzcz1cInFxLXVwbG9hZC1saXN0LXNlbGVjdG9yIHFxLXVwbG9hZC1saXN0XCIgYXJpYS1saXZlPVwicG9saXRlXCIgYXJpYS1yZWxldmFudD1cImFkZGl0aW9ucyByZW1vdmFsc1wiPlxyXG4gICAgICA8bGk+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cInFxLXByb2dyZXNzLWJhci1jb250YWluZXItc2VsZWN0b3JcIj5cclxuICAgICAgICAgIDxkaXYgcm9sZT1cInByb2dyZXNzYmFyXCIgYXJpYS12YWx1ZW5vdz1cIjBcIiBhcmlhLXZhbHVlbWluPVwiMFwiIGFyaWEtdmFsdWVtYXg9XCIxMDBcIlxyXG4gICAgICAgICAgICAgICBjbGFzcz1cInFxLXByb2dyZXNzLWJhci1zZWxlY3RvciBxcS1wcm9ncmVzcy1iYXJcIj48L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8c3BhbiBjbGFzcz1cInFxLXVwbG9hZC1zcGlubmVyLXNlbGVjdG9yIHFxLXVwbG9hZC1zcGlubmVyXCI+PC9zcGFuPlxyXG4gICAgICAgIDxpbWcgY2xhc3M9XCJxcS10aHVtYm5haWwtc2VsZWN0b3JcIiBxcS1tYXgtc2l6ZT1cIjEwMFwiIHFxLXNlcnZlci1zY2FsZT5cclxuICAgICAgICA8c3BhbiBjbGFzcz1cInFxLXVwbG9hZC1maWxlLXNlbGVjdG9yIHFxLXVwbG9hZC1maWxlXCI+PC9zcGFuPlxyXG4gICAgICAgIDxzcGFuIGNsYXNzPVwicXEtZWRpdC1maWxlbmFtZS1pY29uLXNlbGVjdG9yIHFxLWVkaXQtZmlsZW5hbWUtaWNvblwiIGFyaWEtbGFiZWw9XCJFZGl0IGZpbGVuYW1lXCI+PC9zcGFuPlxyXG4gICAgICAgIDxpbnB1dCBjbGFzcz1cInFxLWVkaXQtZmlsZW5hbWUtc2VsZWN0b3IgcXEtZWRpdC1maWxlbmFtZVwiIHRhYmluZGV4PVwiMFwiIHR5cGU9XCJ0ZXh0XCI+XHJcbiAgICAgICAgPHNwYW4gY2xhc3M9XCJxcS11cGxvYWQtc2l6ZS1zZWxlY3RvciBxcS11cGxvYWQtc2l6ZVwiPjwvc3Bhbj5cclxuICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInFxLWJ0biBxcS11cGxvYWQtY2FuY2VsLXNlbGVjdG9yIHFxLXVwbG9hZC1jYW5jZWxcIiB0cmFuc2xhdGU+Q2FuY2VsPC9idXR0b24+XHJcbiAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJxcS1idG4gcXEtdXBsb2FkLXJldHJ5LXNlbGVjdG9yIHFxLXVwbG9hZC1yZXRyeVwiIHRyYW5zbGF0ZT5SZXRyeTwvYnV0dG9uPlxyXG4gICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwicXEtYnRuIHFxLXVwbG9hZC1kZWxldGUtc2VsZWN0b3IgcXEtdXBsb2FkLWRlbGV0ZVwiIHRyYW5zbGF0ZT5EZWxldGU8L2J1dHRvbj5cclxuICAgICAgICA8c3BhbiByb2xlPVwic3RhdHVzXCIgY2xhc3M9XCJxcS11cGxvYWQtc3RhdHVzLXRleHQtc2VsZWN0b3IgcXEtdXBsb2FkLXN0YXR1cy10ZXh0XCI+PC9zcGFuPlxyXG4gICAgICA8L2xpPlxyXG4gICAgPC91bD5cclxuXHJcbiAgICA8ZGlhbG9nIGNsYXNzPVwicXEtYWxlcnQtZGlhbG9nLXNlbGVjdG9yXCI+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJxcS1kaWFsb2ctbWVzc2FnZS1zZWxlY3RvclwiPjwvZGl2PlxyXG4gICAgICA8ZGl2IGNsYXNzPVwicXEtZGlhbG9nLWJ1dHRvbnNcIj5cclxuICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInFxLWNhbmNlbC1idXR0b24tc2VsZWN0b3JcIiB0cmFuc2xhdGU+Q2xvc2U8L2J1dHRvbj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2RpYWxvZz5cclxuXHJcbiAgICA8ZGlhbG9nIGNsYXNzPVwicXEtY29uZmlybS1kaWFsb2ctc2VsZWN0b3JcIj5cclxuICAgICAgPGRpdiBjbGFzcz1cInFxLWRpYWxvZy1tZXNzYWdlLXNlbGVjdG9yXCI+PC9kaXY+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJxcS1kaWFsb2ctYnV0dG9uc1wiPlxyXG4gICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwicXEtY2FuY2VsLWJ1dHRvbi1zZWxlY3RvclwiIHRyYW5zbGF0ZT5ObzwvYnV0dG9uPlxyXG4gICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwicXEtb2stYnV0dG9uLXNlbGVjdG9yXCIgdHJhbnNsYXRlPlllczwvYnV0dG9uPlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGlhbG9nPlxyXG5cclxuICAgIDxkaWFsb2cgY2xhc3M9XCJxcS1wcm9tcHQtZGlhbG9nLXNlbGVjdG9yXCI+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJxcS1kaWFsb2ctbWVzc2FnZS1zZWxlY3RvclwiPjwvZGl2PlxyXG4gICAgICA8aW5wdXQgdHlwZT1cInRleHRcIj5cclxuICAgICAgPGRpdiBjbGFzcz1cInFxLWRpYWxvZy1idXR0b25zXCI+XHJcbiAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJxcS1jYW5jZWwtYnV0dG9uLXNlbGVjdG9yXCIgdHJhbnNsYXRlPkNhbmNlbDwvYnV0dG9uPlxyXG4gICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwicXEtb2stYnV0dG9uLXNlbGVjdG9yXCIgdHJhbnNsYXRlPk9rPC9idXR0b24+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaWFsb2c+XHJcbiAgPC9kaXY+XHJcbjwvZGl2PlxyXG5gLFxyXG4gIHN0eWxlczogW2AudXBsb2FkLWNvbnRlbnR7dGV4dC1hbGlnbjpjZW50ZXI7bWF4LWhlaWdodDoyNXZoO292ZXJmbG93OmF1dG87bWFyZ2luOjEwcHggYXV0b30uZmEtdGltZXM6YmVmb3Jle2NvbnRlbnQ6XCJcXFxcZjAwZFwifS5idXR0b25ze2JhY2tncm91bmQ6I2ZmZjtwYWRkaW5nOjVweDttYXJnaW46MTBweCAwfWAsIGAucXEtdXBsb2FkLWJ1dHRvbiBkaXZ7bGluZS1oZWlnaHQ6MjVweH0ucXEtdXBsb2FkLWJ1dHRvbi1mb2N1c3tvdXRsaW5lOjB9LnFxLXVwbG9hZGVye3Bvc2l0aW9uOnJlbGF0aXZlO21pbi1oZWlnaHQ6MjAwcHg7bWF4LWhlaWdodDo0OTBweDtvdmVyZmxvdy15OmhpZGRlbjt3aWR0aDppbmhlcml0O2JvcmRlci1yYWRpdXM6NnB4O2JhY2tncm91bmQtY29sb3I6I2ZkZmRmZDtib3JkZXI6MXB4IGRhc2hlZCAjY2NjO3BhZGRpbmc6MjBweH0ucXEtdXBsb2FkZXI6YmVmb3Jle2NvbnRlbnQ6YXR0cihxcS1kcm9wLWFyZWEtdGV4dCkgXCIgXCI7cG9zaXRpb246YWJzb2x1dGU7Zm9udC1zaXplOjIwMCU7bGVmdDowO3dpZHRoOjEwMCU7dGV4dC1hbGlnbjpjZW50ZXI7dG9wOjQ1JTtvcGFjaXR5Oi4yNX0ucXEtdXBsb2FkLWRyb3AtYXJlYSwucXEtdXBsb2FkLWV4dHJhLWRyb3AtYXJlYXtwb3NpdGlvbjphYnNvbHV0ZTt0b3A6MDtsZWZ0OjA7d2lkdGg6MTAwJTtoZWlnaHQ6MTAwJTttaW4taGVpZ2h0OjMwcHg7ei1pbmRleDoyO2JhY2tncm91bmQ6I2Y5ZjlmOTtib3JkZXItcmFkaXVzOjRweDtib3JkZXI6MXB4IGRhc2hlZCAjY2NjO3RleHQtYWxpZ246Y2VudGVyfS5xcS11cGxvYWQtZHJvcC1hcmVhIHNwYW57ZGlzcGxheTpibG9jaztwb3NpdGlvbjphYnNvbHV0ZTt0b3A6NTAlO3dpZHRoOjEwMCU7bWFyZ2luLXRvcDotOHB4O2ZvbnQtc2l6ZToxNnB4fS5xcS11cGxvYWQtZXh0cmEtZHJvcC1hcmVhe3Bvc2l0aW9uOnJlbGF0aXZlO21hcmdpbi10b3A6NTBweDtmb250LXNpemU6MTZweDtwYWRkaW5nLXRvcDozMHB4O2hlaWdodDoyMHB4O21pbi1oZWlnaHQ6NDBweH0ucXEtdXBsb2FkLWRyb3AtYXJlYS1hY3RpdmV7YmFja2dyb3VuZDojZmRmZGZkO2JvcmRlci1yYWRpdXM6NHB4O2JvcmRlcjoxcHggZGFzaGVkICNjY2N9LnFxLXVwbG9hZC1saXN0e21hcmdpbjowO3BhZGRpbmc6MDtsaXN0LXN0eWxlOm5vbmU7bWF4LWhlaWdodDo0NTBweDtvdmVyZmxvdy15OmF1dG87Y2xlYXI6Ym90aH0ucXEtdXBsb2FkLWxpc3QgbGl7bWFyZ2luOjA7cGFkZGluZzo5cHg7bGluZS1oZWlnaHQ6MTVweDtmb250LXNpemU6MTZweDtjb2xvcjojNDI0MjQyO2JhY2tncm91bmQtY29sb3I6I2Y2ZjZmNjtib3JkZXItdG9wOjFweCBzb2xpZCAjZmZmO2JvcmRlci1ib3R0b206MXB4IHNvbGlkICNkZGR9LnFxLXVwbG9hZC1saXN0IGxpOmZpcnN0LWNoaWxke2JvcmRlci10b3A6bm9uZX0ucXEtdXBsb2FkLWxpc3QgbGk6bGFzdC1jaGlsZHtib3JkZXItYm90dG9tOm5vbmV9LnFxLXVwbG9hZC1jYW5jZWwsLnFxLXVwbG9hZC1jb250aW51ZSwucXEtdXBsb2FkLWRlbGV0ZSwucXEtdXBsb2FkLWZhaWxlZC10ZXh0LC5xcS11cGxvYWQtZmlsZSwucXEtdXBsb2FkLXBhdXNlLC5xcS11cGxvYWQtcmV0cnksLnFxLXVwbG9hZC1zaXplLC5xcS11cGxvYWQtc3Bpbm5lcnttYXJnaW4tcmlnaHQ6MTJweDtkaXNwbGF5OmlubGluZX0ucXEtdXBsb2FkLWZpbGV7dmVydGljYWwtYWxpZ246bWlkZGxlO2Rpc3BsYXk6aW5saW5lLWJsb2NrO3dpZHRoOjMwMHB4O3RleHQtb3ZlcmZsb3c6ZWxsaXBzaXM7d2hpdGUtc3BhY2U6bm93cmFwO292ZXJmbG93LXg6aGlkZGVuO2hlaWdodDoxOHB4fS5xcS11cGxvYWQtc3Bpbm5lcntkaXNwbGF5OmlubGluZS1ibG9jaztiYWNrZ3JvdW5kOnVybChsb2FkaW5nLmdpZik7d2lkdGg6MTVweDtoZWlnaHQ6MTVweDt2ZXJ0aWNhbC1hbGlnbjp0ZXh0LWJvdHRvbX0ucXEtZHJvcC1wcm9jZXNzaW5ne2Rpc3BsYXk6YmxvY2t9LnFxLWRyb3AtcHJvY2Vzc2luZy1zcGlubmVye2Rpc3BsYXk6aW5saW5lLWJsb2NrO2JhY2tncm91bmQ6dXJsKHByb2Nlc3NpbmcuZ2lmKTt3aWR0aDoyNHB4O2hlaWdodDoyNHB4O3ZlcnRpY2FsLWFsaWduOnRleHQtYm90dG9tfS5xcS11cGxvYWQtY2FuY2VsLC5xcS11cGxvYWQtY29udGludWUsLnFxLXVwbG9hZC1kZWxldGUsLnFxLXVwbG9hZC1wYXVzZSwucXEtdXBsb2FkLXJldHJ5LC5xcS11cGxvYWQtc2l6ZXtmb250LXNpemU6MTJweDtmb250LXdlaWdodDo0MDA7Y3Vyc29yOnBvaW50ZXI7dmVydGljYWwtYWxpZ246bWlkZGxlfS5xcS11cGxvYWQtc3RhdHVzLXRleHR7Zm9udC1zaXplOjE0cHg7Zm9udC13ZWlnaHQ6NzAwO2Rpc3BsYXk6YmxvY2t9LnFxLXVwbG9hZC1mYWlsZWQtdGV4dHtkaXNwbGF5Om5vbmU7Zm9udC1zdHlsZTppdGFsaWM7Zm9udC13ZWlnaHQ6NzAwfS5xcS11cGxvYWQtZmFpbGVkLWljb257ZGlzcGxheTpub25lO3dpZHRoOjE1cHg7aGVpZ2h0OjE1cHg7dmVydGljYWwtYWxpZ246dGV4dC1ib3R0b219LnFxLXVwbG9hZC1mYWlsIC5xcS11cGxvYWQtZmFpbGVkLXRleHQsLnFxLXVwbG9hZC1yZXRyeWluZyAucXEtdXBsb2FkLWZhaWxlZC10ZXh0e2Rpc3BsYXk6aW5saW5lfS5xcS11cGxvYWQtbGlzdCBsaS5xcS11cGxvYWQtc3VjY2Vzc3tiYWNrZ3JvdW5kLWNvbG9yOiNlYmY2ZTA7Y29sb3I6IzQyNDI0Mjtib3JkZXItYm90dG9tOjFweCBzb2xpZCAjZDNkZWQxO2JvcmRlci10b3A6MXB4IHNvbGlkICNmN2ZmZjV9LnFxLXVwbG9hZC1saXN0IGxpLnFxLXVwbG9hZC1mYWlse2JhY2tncm91bmQtY29sb3I6I2Y1ZDdkNztjb2xvcjojNDI0MjQyO2JvcmRlci1ib3R0b206MXB4IHNvbGlkICNkZWNhY2E7Ym9yZGVyLXRvcDoxcHggc29saWQgI2ZjZTZlNn0ucXEtdG90YWwtcHJvZ3Jlc3MtYmFye2hlaWdodDoyNXB4O2JvcmRlci1yYWRpdXM6OXB4fUlOUFVULnFxLWVkaXQtZmlsZW5hbWV7cG9zaXRpb246YWJzb2x1dGU7b3BhY2l0eTowO3otaW5kZXg6LTF9LnFxLXVwbG9hZC1maWxlLnFxLWVkaXRhYmxle2N1cnNvcjpwb2ludGVyO21hcmdpbi1yaWdodDo0cHh9LnFxLWVkaXQtZmlsZW5hbWUtaWNvbi5xcS1lZGl0YWJsZXtkaXNwbGF5OmlubGluZS1ibG9jaztjdXJzb3I6cG9pbnRlcn1JTlBVVC5xcS1lZGl0LWZpbGVuYW1lLnFxLWVkaXRpbmd7cG9zaXRpb246c3RhdGljO2hlaWdodDoyOHB4O3BhZGRpbmc6MCA4cHg7bWFyZ2luLXJpZ2h0OjEwcHg7bWFyZ2luLWJvdHRvbTotNXB4O2JvcmRlcjoxcHggc29saWQgI2NjYztib3JkZXItcmFkaXVzOjJweDtmb250LXNpemU6MTZweDtvcGFjaXR5OjF9LnFxLWVkaXQtZmlsZW5hbWUtaWNvbntkaXNwbGF5Om5vbmU7YmFja2dyb3VuZDp1cmwoZWRpdC5naWYpO3dpZHRoOjE1cHg7aGVpZ2h0OjE1cHg7dmVydGljYWwtYWxpZ246dGV4dC1ib3R0b207bWFyZ2luLXJpZ2h0OjE2cHh9LnFxLWhpZGV7ZGlzcGxheTpub25lfS5xcS10aHVtYm5haWwtc2VsZWN0b3J7dmVydGljYWwtYWxpZ246bWlkZGxlO21hcmdpbi1yaWdodDoxMnB4fS5xcS11cGxvYWRlciBESUFMT0d7ZGlzcGxheTpub25lfS5xcS11cGxvYWRlciBESUFMT0dbb3Blbl17ZGlzcGxheTpibG9ja30ucXEtdXBsb2FkZXIgRElBTE9HIC5xcS1kaWFsb2ctYnV0dG9uc3t0ZXh0LWFsaWduOmNlbnRlcjtwYWRkaW5nLXRvcDoxMHB4fS5xcS11cGxvYWRlciBESUFMT0cgLnFxLWRpYWxvZy1idXR0b25zIEJVVFRPTnttYXJnaW4tbGVmdDo1cHg7bWFyZ2luLXJpZ2h0OjVweH0ucXEtdXBsb2FkZXIgRElBTE9HIC5xcS1kaWFsb2ctbWVzc2FnZS1zZWxlY3RvcntwYWRkaW5nLWJvdHRvbToxMHB4fS5xcS11cGxvYWRlciBESUFMT0c6Oi13ZWJraXQtYmFja2Ryb3B7YmFja2dyb3VuZC1jb2xvcjpyZ2JhKDAsMCwwLC43KX0ucXEtdXBsb2FkZXIgRElBTE9HOjpiYWNrZHJvcHtiYWNrZ3JvdW5kLWNvbG9yOnJnYmEoMCwwLDAsLjcpfWBdLFxyXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmVcclxufSlcclxuZXhwb3J0IGNsYXNzIFVwbG9hZENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdCB7XHJcbiAgQElucHV0KCkgb3BlbkRpYWxvZztcclxuXHJcbiAgQE91dHB1dCgpIGNsb3NlRGlhbG9nID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gIEBPdXRwdXQoKSBjcmVhdGVEaXIgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gIHVwbG9hZGVyOiBGaW5lVXBsb2FkZXI7XHJcbiAgbmV3Rm9sZGVyID0gZmFsc2U7XHJcbiAgY291bnRlciA9IDA7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgaHR0cDogSHR0cENsaWVudCxcclxuICAgICAgICAgICAgICBwcml2YXRlIG5vZGVTZXJ2aWNlOiBOb2RlU2VydmljZSkge1xyXG4gIH1cclxuXHJcbiAgbmdBZnRlclZpZXdJbml0KCkge1xyXG4gICAgdGhpcy51cGxvYWRlciA9IG5ldyBGaW5lVXBsb2FkZXIoe1xyXG4gICAgICBkZWJ1ZzogZmFsc2UsXHJcbiAgICAgIGF1dG9VcGxvYWQ6IGZhbHNlLFxyXG4gICAgICBtYXhDb25uZWN0aW9uczogMSwgLy8gdG9kbyBjb25maWd1cmFibGVcclxuICAgICAgZWxlbWVudDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZpbmUtdXBsb2FkZXInKSxcclxuICAgICAgdGVtcGxhdGU6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmaW5lLXVwbG9hZGVyLXRlbXBsYXRlJyksXHJcbiAgICAgIHJlcXVlc3Q6IHtcclxuICAgICAgICBlbmRwb2ludDogdGhpcy5ub2RlU2VydmljZS50cmVlLmNvbmZpZy5iYXNlVVJMICsgdGhpcy5ub2RlU2VydmljZS50cmVlLmNvbmZpZy5hcGkudXBsb2FkRmlsZSxcclxuICAgICAgICAvLyBmb3JjZU11bHRpcGFydDogZmFsc2UsXHJcbiAgICAgICAgcGFyYW1zSW5Cb2R5OiBmYWxzZSxcclxuICAgICAgICBwYXJhbXM6IHtcclxuICAgICAgICAgIHBhcmVudFBhdGg6IHRoaXMuZ2V0Q3VycmVudFBhdGhcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIHJldHJ5OiB7XHJcbiAgICAgICAgZW5hYmxlQXV0bzogZmFsc2VcclxuICAgICAgfSxcclxuICAgICAgY2FsbGJhY2tzOiB7XHJcbiAgICAgICAgb25TdWJtaXR0ZWQ6ICgpID0+IHRoaXMuY291bnRlcisrLFxyXG4gICAgICAgIG9uQ2FuY2VsOiAoKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLmNvdW50ZXIgPCAwID8gY29uc29sZS53YXJuKCd3dGY/JykgOiB0aGlzLmNvdW50ZXItLTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIG9uQWxsQ29tcGxldGU6IChzdWNjOiBhbnksIGZhaWw6IGFueSkgPT4ge1xyXG4gICAgICAgICAgaWYgKHN1Y2MubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICB0aGlzLmNvdW50ZXIgPSAwO1xyXG4gICAgICAgICAgICB0aGlzLm5vZGVTZXJ2aWNlLnJlZnJlc2hDdXJyZW50UGF0aCgpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSlcclxuICAgIDtcclxuICB9XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gIH1cclxuXHJcbiAgZ2V0IGdldEN1cnJlbnRQYXRoKCkge1xyXG4gICAgY29uc3QgcGFyZW50UGF0aCA9IHRoaXMubm9kZVNlcnZpY2UuZmluZE5vZGVCeVBhdGgodGhpcy5ub2RlU2VydmljZS5jdXJyZW50UGF0aCkuaWQ7XHJcbiAgICByZXR1cm4gcGFyZW50UGF0aCA9PT0gMCA/ICcnIDogcGFyZW50UGF0aDtcclxuICB9XHJcblxyXG4gIHVwbG9hZEZpbGVzKCkge1xyXG4gICAgdGhpcy51cGxvYWRlci51cGxvYWRTdG9yZWRGaWxlcygpO1xyXG4gIH1cclxuXHJcbiAgY3JlYXRlTmV3Rm9sZGVyKGlucHV0Pzogc3RyaW5nKSB7XHJcbiAgICBpZiAoIXRoaXMubmV3Rm9sZGVyKSB7XHJcbiAgICAgIHRoaXMubmV3Rm9sZGVyID0gdHJ1ZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMubmV3Rm9sZGVyID0gZmFsc2U7XHJcbiAgICAgIGlmIChpbnB1dC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgdGhpcy5jcmVhdGVEaXIuZW1pdChpbnB1dCk7XHJcbiAgICAgICAgdGhpcy5uZXdDbGlja2VkQWN0aW9uKCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIG5ld0NsaWNrZWRBY3Rpb24oKSB7XHJcbiAgICB0aGlzLnVwbG9hZGVyLmNhbmNlbEFsbCgpO1xyXG4gICAgdGhpcy5jbG9zZURpYWxvZy5lbWl0KCk7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7Q29tcG9uZW50LCBFbGVtZW50UmVmLCBFdmVudEVtaXR0ZXIsIE9uSW5pdCwgT3V0cHV0LCBWaWV3Q2hpbGR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge199IGZyb20gJ0BiaWVzYmplcmcvbmd4LXRyYW5zbGF0ZS1leHRyYWN0L2Rpc3QvdXRpbHMvdXRpbHMnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdhcHAtbmV3LWZvbGRlcicsXHJcbiAgdGVtcGxhdGU6IGA8cCBjbGFzcz1cIm5ldy1mb2xkZXItZGVzY3JpcHRpb25cIiB0cmFuc2xhdGU+VHlwZSBuZXcgZm9sZGVyIG5hbWU8L3A+XHJcbjxpbnB1dCAjdXBsb2FkRm9sZGVyIHBsYWNlaG9sZGVyPVwie3snRm9sZGVyIG5hbWUnfX1cIiAoa2V5dXApPVwib25JbnB1dENoYW5nZSgkZXZlbnQpXCJcclxuICAgICAgIChrZXl1cC5lbnRlcik9XCJvbkNsaWNrKClcIiBvbmNsaWNrPVwidGhpcy5zZWxlY3QoKTtcIiB0eXBlPVwidGV4dFwiIGNsYXNzPVwibmV3LWZvbGRlci1pbnB1dFwiLz5cclxuPGJ1dHRvbiBjbGFzcz1cImJ1dHRvbiBuZXctZm9sZGVyLXNlbmRcIiAoY2xpY2spPVwib25DbGljaygpXCI+e3tidXR0b25UZXh0fX08L2J1dHRvbj5cclxuYCxcclxuICBzdHlsZXM6IFtgLm5ldy1mb2xkZXItZGVzY3JpcHRpb257bWFyZ2luOjAgYXV0bztwYWRkaW5nOjB9YF1cclxufSlcclxuZXhwb3J0IGNsYXNzIE5ld0ZvbGRlckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcbiAgQFZpZXdDaGlsZCgndXBsb2FkRm9sZGVyJykgdXBsb2FkRm9sZGVyOiBFbGVtZW50UmVmO1xyXG4gIEBPdXRwdXQoKSBidXR0b25DbGlja2VkID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICBidXR0b25UZXh0ID0gXygnQ2xvc2UnKS50b1N0cmluZygpO1xyXG4gIGlucHV0VmFsdWUgPSAnJztcclxuXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgfVxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICB9XHJcblxyXG4gIG9uQ2xpY2soKSB7XHJcbiAgICBjb25zdCBlbDogSFRNTEVsZW1lbnQgPSAodGhpcy51cGxvYWRGb2xkZXIubmF0aXZlRWxlbWVudCBhcyBIVE1MRWxlbWVudCk7XHJcbiAgICAvLyBAdHMtaWdub3JlXHJcbiAgICB0aGlzLmJ1dHRvbkNsaWNrZWQuZW1pdChlbC52YWx1ZSk7XHJcbiAgfVxyXG5cclxuICBvbklucHV0Q2hhbmdlKGV2ZW50OiBhbnkpIHtcclxuICAgIHRoaXMuaW5wdXRWYWx1ZSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcclxuICAgIGlmICh0aGlzLmlucHV0VmFsdWUubGVuZ3RoID4gMCkge1xyXG4gICAgICB0aGlzLmJ1dHRvblRleHQgPSBfKCdDb25maXJtJykudG9TdHJpbmcoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuYnV0dG9uVGV4dCA9IF8oJ0Nsb3NlJykudG9TdHJpbmcoKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHtDb21wb25lbnQsIEV2ZW50RW1pdHRlciwgSW5wdXQsIE9uSW5pdCwgT3V0cHV0LCBUZW1wbGF0ZVJlZiwgVmlld0VuY2Fwc3VsYXRpb259IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge05vZGVJbnRlcmZhY2V9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMvbm9kZS5pbnRlcmZhY2UnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdhcHAtc2lkZS12aWV3JyxcclxuICB0ZW1wbGF0ZTogYDxkaXYgY2xhc3M9XCJzaWRlLXZpZXdcIiAqbmdJZj1cIm5vZGVcIj5cclxuICA8ZGl2IGNsYXNzPVwic2lkZS12aWV3LXByZXZpZXdcIj5cclxuICAgIDxpIChjbGljayk9XCJvbkNsaWNrKCRldmVudCwgJ2Nsb3NlU2lkZVZpZXcnKVwiIGNsYXNzPVwiZmFzIGZhLXRpbWVzIHNpZGUtdmlldy1jbG9zZVwiPjwvaT5cclxuXHJcbiAgICA8ZGl2IGNsYXNzPVwic2lkZS12aWV3LXByZXZpZXctdGl0bGVcIj57e25vZGUubmFtZX19PC9kaXY+XHJcblxyXG4gICAgPGRpdiBjbGFzcz1cInNpZGUtdmlldy1wcmV2aWV3LWNvbnRlbnRcIj5cclxuICAgICAgPG5nLWNvbnRhaW5lclxyXG4gICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7JGltcGxpY2l0OiBub2RlfVwiXHJcbiAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRdPVwic2lkZVZpZXdUZW1wbGF0ZVwiPlxyXG4gICAgICA8L25nLWNvbnRhaW5lcj5cclxuICAgIDwvZGl2PlxyXG5cclxuICAgIDxkaXYgY2xhc3M9XCJzaWRlLXZpZXctYnV0dG9uc1wiPlxyXG4gICAgICA8YnV0dG9uIChjbGljayk9XCJvbkNsaWNrKCRldmVudCwgJ2Rvd25sb2FkJylcIiBjbGFzcz1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgICAgW2Rpc2FibGVkXT1cIiFhbGxvd0ZvbGRlckRvd25sb2FkICYmIG5vZGUuaXNGb2xkZXJcIiB0cmFuc2xhdGU+XHJcbiAgICAgICAgRG93bmxvYWRcclxuICAgICAgPC9idXR0b24+XHJcbiAgICAgIDxidXR0b24gKGNsaWNrKT1cIm9uQ2xpY2soJGV2ZW50LCAncmVuYW1lQ29uZmlybScpXCIgY2xhc3M9XCJidXR0b25cIiB0cmFuc2xhdGU+UmVuYW1lPC9idXR0b24+XHJcbiAgICAgIDxidXR0b24gKGNsaWNrKT1cIm9uQ2xpY2soJGV2ZW50LCAncmVtb3ZlQXNrJylcIiBjbGFzcz1cImJ1dHRvblwiIHRyYW5zbGF0ZT5EZWxldGU8L2J1dHRvbj5cclxuICAgIDwvZGl2PlxyXG4gIDwvZGl2PlxyXG48L2Rpdj5cclxuYCxcclxuICBzdHlsZXM6IFtgLnNpZGUtdmlldy1jbG9zZXtwb3NpdGlvbjphYnNvbHV0ZTtjdXJzb3I6cG9pbnRlcjt0b3A6MDtyaWdodDowO3BhZGRpbmc6MTVweH0uc2lkZS12aWV3LWJ1dHRvbnN7d2lkdGg6MTAwJTtkaXNwbGF5Oi13ZWJraXQtZmxleDtkaXNwbGF5OmZsZXg7LXdlYmtpdC1qdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO2p1c3RpZnktY29udGVudDpjZW50ZXI7LXdlYmtpdC1mbGV4LWZsb3c6Y29sdW1uO2ZsZXgtZmxvdzpjb2x1bW59LnNpZGUtdmlldy1idXR0b25zIC5idXR0b257bWFyZ2luOjVweCAwfWBdLFxyXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmVcclxufSlcclxuZXhwb3J0IGNsYXNzIFNpZGVWaWV3Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuICBASW5wdXQoKSBzaWRlVmlld1RlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xyXG5cclxuICBASW5wdXQoKSBub2RlOiBOb2RlSW50ZXJmYWNlO1xyXG4gIEBJbnB1dCgpIGFsbG93Rm9sZGVyRG93bmxvYWQgPSBmYWxzZTtcclxuXHJcbiAgQE91dHB1dCgpIGNsaWNrRXZlbnQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gIH1cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgfVxyXG5cclxuICBvbkNsaWNrKGV2ZW50OiBhbnksIHR5cGU6IHN0cmluZykge1xyXG4gICAgdGhpcy5jbGlja0V2ZW50LmVtaXQoe3R5cGU6IHR5cGUsIGV2ZW50OiBldmVudCwgbm9kZTogdGhpcy5ub2RlfSk7XHJcbiAgfVxyXG5cclxufVxyXG4iLCJpbXBvcnQge0NvbXBvbmVudCwgT25Jbml0LCBWaWV3RW5jYXBzdWxhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7Tm9kZUNsaWNrZWRTZXJ2aWNlfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9ub2RlLWNsaWNrZWQuc2VydmljZSc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2FwcC1uYXZpZ2F0aW9uJyxcclxuICB0ZW1wbGF0ZTogYDxkaXYgY2xhc3M9XCJuYXZpZ2F0aW9uLWNvbXBvbmVudFwiPlxyXG4gIDxpbnB1dCAjaW5wdXQgY2xhc3M9XCJuYXZpZ2F0aW9uLXNlYXJjaFwiIG9uY2xpY2s9XCJ0aGlzLnNlbGVjdCgpO1wiIChrZXl1cC5lbnRlcik9XCJvbkNsaWNrKGlucHV0LnZhbHVlKVwiXHJcbiAgICAgICAgIHBsYWNlaG9sZGVyPVwie3snU2VhcmNoJ319XCI+XHJcblxyXG4gIDxidXR0b24gW2Rpc2FibGVkXT1cImlucHV0LnZhbHVlLmxlbmd0aCA9PT0gMFwiIGNsYXNzPVwibmF2aWdhdGlvbi1zZWFyY2gtaWNvblwiIChjbGljayk9XCJvbkNsaWNrKGlucHV0LnZhbHVlKVwiPlxyXG4gICAgPGkgY2xhc3M9XCJmYXMgZmEtc2VhcmNoXCI+PC9pPlxyXG4gIDwvYnV0dG9uPlxyXG5cclxuICA8ZGl2PlxyXG4gICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxyXG4gIDwvZGl2PlxyXG48L2Rpdj5cclxuXHJcblxyXG5gLFxyXG4gIHN0eWxlczogW2AubmF2aWdhdGlvbi1jb21wb25lbnR7ZGlzcGxheTotd2Via2l0LWZsZXg7ZGlzcGxheTpmbGV4fWBdLFxyXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmVcclxufSlcclxuZXhwb3J0IGNsYXNzIE5hdmlnYXRpb25Db21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHByaXZhdGUgbm9kZUNsaWNrZWRTZXJ2aWNlOiBOb2RlQ2xpY2tlZFNlcnZpY2VcclxuICApIHtcclxuICB9XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gIH1cclxuXHJcbiAgb25DbGljayhpbnB1dDogc3RyaW5nKSB7XHJcbiAgICB0aGlzLm5vZGVDbGlja2VkU2VydmljZS5zZWFyY2hGb3JTdHJpbmcoaW5wdXQpO1xyXG4gIH1cclxufVxyXG4iLCIvLyBpbXBvcnQge01vZHVsZVdpdGhQcm92aWRlcnMsIE5nTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtOZ01vZHVsZSwgSW5qZWN0aW9uVG9rZW4sIE1vZHVsZVdpdGhQcm92aWRlcnN9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge0NvbW1vbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcclxuaW1wb3J0IHtGaWxlTWFuYWdlckNvbXBvbmVudH0gZnJvbSAnLi9maWxlLW1hbmFnZXIuY29tcG9uZW50JztcclxuaW1wb3J0IHtGb2xkZXJDb250ZW50Q29tcG9uZW50fSBmcm9tICcuL2NvbXBvbmVudHMvZm9sZGVyLWNvbnRlbnQvZm9sZGVyLWNvbnRlbnQuY29tcG9uZW50JztcclxuaW1wb3J0IHtUcmVlQ29tcG9uZW50fSBmcm9tICcuL2NvbXBvbmVudHMvdHJlZS90cmVlLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7Tm9kZUxpc3RlckNvbXBvbmVudH0gZnJvbSAnLi9jb21wb25lbnRzL3RyZWUvbm9kZS1saXN0ZXIvbm9kZS1saXN0ZXIuY29tcG9uZW50JztcclxuaW1wb3J0IHtOb2RlQ29tcG9uZW50fSBmcm9tICcuL2NvbXBvbmVudHMvZnVuY3Rpb25zL25vZGUvbm9kZS5jb21wb25lbnQnO1xyXG5pbXBvcnQge01hcFRvSXRlcmFibGVQaXBlfSBmcm9tICcuL3BpcGVzL21hcC10by1pdGVyYWJsZS5waXBlJztcclxuaW1wb3J0IHtIdHRwQ2xpZW50LCBIdHRwQ2xpZW50TW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7U3RvcmVNb2R1bGUsIEFjdGlvblJlZHVjZXJNYXB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcclxuaW1wb3J0IHtOYXZCYXJDb21wb25lbnR9IGZyb20gJy4vY29tcG9uZW50cy9uYXYtYmFyL25hdi1iYXIuY29tcG9uZW50JztcclxuaW1wb3J0IHtyZWR1Y2VycywgQXBwU3RvcmV9IGZyb20gJy4vcmVkdWNlcnMvcmVkdWNlci5mYWN0b3J5JztcclxuaW1wb3J0IHtMb2FkaW5nT3ZlcmxheUNvbXBvbmVudH0gZnJvbSAnLi9jb21wb25lbnRzL2Z1bmN0aW9ucy9sb2FkaW5nLW92ZXJsYXkvbG9hZGluZy1vdmVybGF5LmNvbXBvbmVudCc7XHJcbmltcG9ydCB7RmlsZVNpemVQaXBlfSBmcm9tICcuL3BpcGVzL2ZpbGUtc2l6ZS5waXBlJztcclxuaW1wb3J0IHtVcGxvYWRDb21wb25lbnR9IGZyb20gJy4vY29tcG9uZW50cy9mdW5jdGlvbnMvdXBsb2FkL3VwbG9hZC5jb21wb25lbnQnO1xyXG5pbXBvcnQge05ld0ZvbGRlckNvbXBvbmVudH0gZnJvbSAnLi9jb21wb25lbnRzL2Z1bmN0aW9ucy91cGxvYWQvbmV3LWZvbGRlci9uZXctZm9sZGVyLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7U2lkZVZpZXdDb21wb25lbnR9IGZyb20gJy4vY29tcG9uZW50cy9zaWRlLXZpZXcvc2lkZS12aWV3LmNvbXBvbmVudCc7XHJcbmltcG9ydCB7TmF2aWdhdGlvbkNvbXBvbmVudH0gZnJvbSAnLi9jb21wb25lbnRzL25hdmlnYXRpb24vbmF2aWdhdGlvbi5jb21wb25lbnQnO1xyXG5pbXBvcnQge05neFNtYXJ0TW9kYWxNb2R1bGV9IGZyb20gJ25neC1zbWFydC1tb2RhbCc7XHJcblxyXG5jb25zdCBGRUFUVVJFX1JFRFVDRVJfVE9LRU4gPSBuZXcgSW5qZWN0aW9uVG9rZW48XHJcbiAgQWN0aW9uUmVkdWNlck1hcDxBcHBTdG9yZT5cclxuPignQXBwU3RvcmUgUmVkdWNlcnMnKTtcclxuZXhwb3J0IGZ1bmN0aW9uIGdldFJlZHVjZXJzKCk6IEFjdGlvblJlZHVjZXJNYXA8QXBwU3RvcmU+IHtcclxuICAvLyBtYXAgb2YgcmVkdWNlcnNcclxuICByZXR1cm4gcmVkdWNlcnM7XHJcbn1cclxuXHJcbkBOZ01vZHVsZSh7XHJcbiAgaW1wb3J0czogW1xyXG4gICAgSHR0cENsaWVudE1vZHVsZSxcclxuICAgIFN0b3JlTW9kdWxlLmZvclJvb3QoRkVBVFVSRV9SRURVQ0VSX1RPS0VOKSxcclxuICAgIENvbW1vbk1vZHVsZSxcclxuICAgIE5neFNtYXJ0TW9kYWxNb2R1bGUuZm9yUm9vdCgpLFxyXG4gIF0sXHJcbiAgZGVjbGFyYXRpb25zOiBbXHJcbiAgICBGaWxlTWFuYWdlckNvbXBvbmVudCxcclxuICAgIEZvbGRlckNvbnRlbnRDb21wb25lbnQsXHJcbiAgICBOb2RlQ29tcG9uZW50LFxyXG4gICAgVHJlZUNvbXBvbmVudCxcclxuICAgIE5vZGVMaXN0ZXJDb21wb25lbnQsXHJcbiAgICBNYXBUb0l0ZXJhYmxlUGlwZSxcclxuICAgIE5hdkJhckNvbXBvbmVudCxcclxuICAgIExvYWRpbmdPdmVybGF5Q29tcG9uZW50LFxyXG4gICAgRmlsZVNpemVQaXBlLFxyXG4gICAgVXBsb2FkQ29tcG9uZW50LFxyXG4gICAgTmV3Rm9sZGVyQ29tcG9uZW50LFxyXG4gICAgU2lkZVZpZXdDb21wb25lbnQsXHJcbiAgICBOYXZpZ2F0aW9uQ29tcG9uZW50XHJcbiAgXSxcclxuICBleHBvcnRzOiBbXHJcbiAgICBGaWxlTWFuYWdlckNvbXBvbmVudCxcclxuICAgIExvYWRpbmdPdmVybGF5Q29tcG9uZW50LFxyXG4gICAgU2lkZVZpZXdDb21wb25lbnRcclxuICBdLFxyXG4gIHByb3ZpZGVyczogW1xyXG4gICAge1xyXG4gICAgICBwcm92aWRlOiBGRUFUVVJFX1JFRFVDRVJfVE9LRU4sXHJcbiAgICAgIHVzZUZhY3Rvcnk6IGdldFJlZHVjZXJzLFxyXG4gICAgfSxcclxuICBdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBGaWxlTWFuYWdlck1vZHVsZSB7XHJcbiAgc3RhdGljIGZvclJvb3QoKTogTW9kdWxlV2l0aFByb3ZpZGVycyB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBuZ01vZHVsZTogRmlsZU1hbmFnZXJNb2R1bGUsXHJcbiAgICAgIHByb3ZpZGVyczogW11cclxuICAgIH07XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7Tm9kZUludGVyZmFjZX0gZnJvbSAnLi4vaW50ZXJmYWNlcy9ub2RlLmludGVyZmFjZSc7XHJcbmltcG9ydCB7Q29uZmlnSW50ZXJmYWNlfSBmcm9tICcuLi9pbnRlcmZhY2VzL2NvbmZpZy5pbnRlcmZhY2UnO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRyZWVNb2RlbCB7XHJcbiAgcHJpdmF0ZSBfY3VycmVudFBhdGg6IHN0cmluZztcclxuICBwcml2YXRlIF9ub2RlczogTm9kZUludGVyZmFjZTtcclxuICBwcml2YXRlIF9zZWxlY3RlZE5vZGVJZDogc3RyaW5nO1xyXG4gIHB1YmxpYyBjb25maWc6IENvbmZpZ0ludGVyZmFjZTtcclxuXHJcbiAgY29uc3RydWN0b3IoY29uZmlnOiBDb25maWdJbnRlcmZhY2UpIHtcclxuICAgIC8vIHRoaXMuX2N1cnJlbnRQYXRoID0gY29uZmlnLnN0YXJ0aW5nRm9sZGVyOyAvLyB0b2RvIGltcGxlbWVudCAoY29uZmlnLmludGVyZmNlLnRzKVxyXG4gICAgdGhpcy5fY3VycmVudFBhdGggPSAnJztcclxuICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xyXG5cclxuICAgIHRoaXMubm9kZXMgPSA8Tm9kZUludGVyZmFjZT57XHJcbiAgICAgIGlkOiAwLFxyXG4gICAgICBwYXRoVG9Ob2RlOiAnJyxcclxuICAgICAgcGF0aFRvUGFyZW50OiBudWxsLFxyXG4gICAgICBpc0ZvbGRlcjogdHJ1ZSxcclxuICAgICAgaXNFeHBhbmRlZDogdHJ1ZSxcclxuICAgICAgc3RheU9wZW46IHRydWUsXHJcbiAgICAgIG5hbWU6ICdyb290JyxcclxuICAgICAgY2hpbGRyZW46IHt9XHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgZ2V0IGN1cnJlbnRQYXRoKCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gdGhpcy5fY3VycmVudFBhdGg7XHJcbiAgfVxyXG5cclxuICBzZXQgY3VycmVudFBhdGgodmFsdWU6IHN0cmluZykge1xyXG4gICAgdGhpcy5fY3VycmVudFBhdGggPSB2YWx1ZTtcclxuICB9XHJcblxyXG4gIGdldCBub2RlcygpOiBOb2RlSW50ZXJmYWNlIHtcclxuICAgIHJldHVybiB0aGlzLl9ub2RlcztcclxuICB9XHJcblxyXG4gIHNldCBub2Rlcyh2YWx1ZTogTm9kZUludGVyZmFjZSkge1xyXG4gICAgdGhpcy5fbm9kZXMgPSB2YWx1ZTtcclxuICB9XHJcblxyXG4gIGdldCBzZWxlY3RlZE5vZGVJZCgpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRoaXMuX3NlbGVjdGVkTm9kZUlkO1xyXG4gIH1cclxuXHJcbiAgc2V0IHNlbGVjdGVkTm9kZUlkKHZhbHVlOiBzdHJpbmcpIHtcclxuICAgIHRoaXMuX3NlbGVjdGVkTm9kZUlkID0gdmFsdWU7XHJcbiAgfVxyXG5cclxuICAvLyB0b2RvIGltcGxlbWVudCAoY29uZmlnLmludGVyZmNlLnRzKVxyXG4gIC8vIGdldCBpc0NhY2hlKCk6IGJvb2xlYW4ge1xyXG4gIC8vICAgcmV0dXJuIHRoaXMuY29uZmlnLm9mZmxpbmVNb2RlO1xyXG4gIC8vIH1cclxuICAvL1xyXG4gIC8vIHNldCBpc0NhY2hlKHZhbHVlOiBib29sZWFuKSB7XHJcbiAgLy8gICB0aGlzLmNvbmZpZy5vZmZsaW5lTW9kZSA9IHZhbHVlO1xyXG4gIC8vIH1cclxufVxyXG4iXSwibmFtZXMiOlsiSHR0cFBhcmFtcyIsIkFDVElPTlMuU0VUX1BBVEgiLCJPYnNlcnZhYmxlIiwiQUNUSU9OUy5TRVRfTE9BRElOR19TVEFURSIsIkluamVjdGFibGUiLCJIdHRwQ2xpZW50IiwiU3RvcmUiLCJOZ3hTbWFydE1vZGFsU2VydmljZSIsIkV2ZW50RW1pdHRlciIsInNlbGVjdCIsIkFDVElPTlMuU0VUX1NFTEVDVEVEX05PREUiLCJDb21wb25lbnQiLCJWaWV3RW5jYXBzdWxhdGlvbiIsIklucHV0IiwiT3V0cHV0IiwiZmlyc3QiLCJDb250ZW50Q2hpbGQiLCJUZW1wbGF0ZVJlZiIsIlBpcGUiLCJ0aW1lciIsIl8iLCJGaW5lVXBsb2FkZXIiLCJWaWV3Q2hpbGQiLCJJbmplY3Rpb25Ub2tlbiIsIk5nTW9kdWxlIiwiSHR0cENsaWVudE1vZHVsZSIsIlN0b3JlTW9kdWxlIiwiQ29tbW9uTW9kdWxlIiwiTmd4U21hcnRNb2RhbE1vZHVsZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFHQSxRQUFhLFFBQVEsR0FBRyxVQUFVOztBQUNsQyxRQUFhLGlCQUFpQixHQUFHLG1CQUFtQjs7QUFDcEQsUUFBYSxpQkFBaUIsR0FBRyxtQkFBbUI7Ozs7OztBQ0xwRDtRQWdCRSxxQkFBb0IsSUFBZ0IsRUFBVSxLQUFzQjtZQUFwRSxpQkFDQztZQURtQixTQUFJLEdBQUosSUFBSSxDQUFZO1lBQVUsVUFBSyxHQUFMLEtBQUssQ0FBaUI7WUE4RDVELHVCQUFrQixJQUFHLFVBQUMsSUFBWTs7b0JBQ3BDLFFBQVEsR0FBUSxLQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUU7Z0JBQ2hELFFBQVEsR0FBRyxRQUFRLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxRQUFRLENBQUM7Z0JBRTFDLE9BQU8sS0FBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQ2xCLEtBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sR0FBRyxLQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUN4RCxFQUFDLE1BQU0sRUFBRSxJQUFJQSxhQUFVLEVBQUUsQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLFFBQVEsQ0FBQyxFQUFDLENBQ3ZELENBQUM7YUFDSCxFQUFDO1NBckVEOzs7Ozs7O1FBR00sb0NBQWM7Ozs7OztZQUFyQixVQUFzQixJQUFZO2dCQUNoQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFDLElBQUksRUFBRUMsUUFBZ0IsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQzthQUM5RDs7OztRQUVNLHdDQUFrQjs7O1lBQXpCO2dCQUNFLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7Z0JBQ3BELElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2FBQ2pDOzs7OztRQUVELDhCQUFROzs7O1lBQVIsVUFBUyxJQUFZO2dCQUFyQixpQkFPQztnQkFOQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsRUFBQyxVQUFDLElBQTBCO29CQUN6RCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTs7NEJBQzlCLFVBQVUsR0FBRyxLQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUM7d0JBQ3pELEtBQUksQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQ2xFO2lCQUNGLEVBQUMsQ0FBQzthQUNKOzs7Ozs7UUFFTyxtQ0FBYTs7Ozs7WUFBckIsVUFBc0IsSUFBWTs7b0JBQzVCLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQztnQkFDaEMsVUFBVSxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hELE9BQU8sVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUM3Qjs7Ozs7O1FBRU8sZ0NBQVU7Ozs7O1lBQWxCLFVBQW1CLElBQVk7Z0JBQS9CLGlCQU9DO2dCQU5DLE9BQU8sSUFBSUMsZUFBVSxFQUFDLFVBQUEsUUFBUTtvQkFDNUIsS0FBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsRUFBQyxVQUFDLElBQWdCO3dCQUN2RCxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUMsVUFBQSxJQUFJLElBQUksT0FBQSxLQUFJLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsR0FBQSxFQUFDLENBQUMsQ0FBQzt3QkFDN0QsS0FBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBQyxJQUFJLEVBQUVDLGlCQUF5QixFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO3FCQUN4RSxFQUFDLENBQUM7aUJBQ0osRUFBQyxDQUFDO2FBQ0o7Ozs7Ozs7UUFFTyxnQ0FBVTs7Ozs7O1lBQWxCLFVBQW1CLElBQUksRUFBRSxJQUFJO2dCQUMzQixJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxFQUFFO29CQUN4QixPQUFPLENBQUMsSUFBSSxDQUFDLDJEQUEyRCxDQUFDLENBQUM7b0JBQzFFLElBQUksQ0FBQyxJQUFJLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7aUJBQzdCOztvQkFFSyxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDO2dCQUNoQyxJQUFJLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRTtvQkFDaEQsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDbEIsSUFBSSxDQUFDLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2lCQUMzQjs7b0JBRUssVUFBVSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztnQkFFakQsU0FBc0I7b0JBQ3BCLEVBQUUsRUFBRSxJQUFJLENBQUMsRUFBRTtvQkFDWCxRQUFRLEVBQUUsSUFBSSxDQUFDLEdBQUc7b0JBQ2xCLFVBQVUsRUFBRSxVQUFVLEdBQUcsVUFBVSxDQUFDLFVBQVUsR0FBRyxLQUFLO29CQUN0RCxVQUFVLEVBQUUsSUFBSSxDQUFDLElBQUk7b0JBQ3JCLFlBQVksRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7b0JBQzNDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxFQUFFO29CQUMxQixRQUFRLEVBQUUsVUFBVSxHQUFHLFVBQVUsQ0FBQyxRQUFRLEdBQUcsRUFBRTtpQkFDaEQsR0FBQzthQUNIOzs7OztRQVlNLG9DQUFjOzs7O1lBQXJCLFVBQXNCLFFBQWdCOztvQkFDOUIsR0FBRyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDO2dCQUMvQixHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFFakIsT0FBTyxHQUFHLENBQUMsTUFBTSxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFDLFVBQUMsS0FBSyxFQUFFLEtBQUssSUFBSyxPQUFBLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBQSxHQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDckg7Ozs7O1FBRU0sa0NBQVk7Ozs7WUFBbkIsVUFBb0IsRUFBVTs7b0JBQ3RCLE1BQU0sR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsRUFBRSxDQUFDO2dCQUUxQyxJQUFJLE1BQU0sS0FBSyxJQUFJLEVBQUU7b0JBQ25CLE9BQU8sQ0FBQyxJQUFJLENBQUMsd0ZBQXdGLENBQUMsQ0FBQztvQkFDdkcsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztpQkFDeEI7Z0JBRUQsT0FBTyxNQUFNLENBQUM7YUFDZjs7Ozs7O1FBRU0sd0NBQWtCOzs7OztZQUF6QixVQUEwQixFQUFVLEVBQUUsSUFBcUM7Z0JBQXJDLHFCQUFBO29CQUFBLE9BQXNCLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSzs7Z0JBQ3pFLElBQUksSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFO29CQUNoQixPQUFPLElBQUksQ0FBQzs7b0JBRVIsSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztnQkFFdkMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7b0JBQ3BDLElBQUksT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLFFBQVEsRUFBRTs7NEJBQ3ZDLEdBQUcsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQy9ELElBQUksR0FBRyxJQUFJLElBQUk7NEJBQ2IsT0FBTyxHQUFHLENBQUM7cUJBQ2Q7aUJBQ0Y7Z0JBRUQsT0FBTyxJQUFJLENBQUM7YUFDYjs7Ozs7UUFFTSxxQ0FBZTs7OztZQUF0QixVQUF1QixJQUFtQjtnQkFBMUMsaUJBY0M7OztvQkFaTyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVE7Z0JBRTlCLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxFQUFDLFVBQUMsS0FBYTtvQkFDdEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsVUFBVSxFQUFFO3dCQUNsRSxPQUFPLElBQUksQ0FBQztxQkFDYjtvQkFFRCxLQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDOztvQkFFdEMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7b0JBQzFGLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO2lCQUNwQyxFQUFDLENBQUM7YUFDSjs7OztRQUVNLDZCQUFPOzs7WUFBZDtnQkFDRSxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDdkM7UUFFRCxzQkFBSSxvQ0FBVzs7O2dCQUFmO2dCQUNFLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQzthQUNuQjs7OztnQkFFRCxVQUFnQixLQUFhO2dCQUMzQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQzthQUNwQjs7O1dBSkE7O29CQXhJRkMsYUFBVSxTQUFDO3dCQUNWLFVBQVUsRUFBRSxNQUFNO3FCQUNuQjs7Ozt3QkFQT0MsYUFBVTt3QkFFVkMsUUFBSzs7OzswQkFOYjtLQXNKQzs7Ozs7O0FDdEpEO1FBZ0JFLDRCQUNTLG9CQUEwQyxFQUN6QyxXQUF3QixFQUN4QixLQUFzQixFQUN0QixJQUFnQjtZQUhqQix5QkFBb0IsR0FBcEIsb0JBQW9CLENBQXNCO1lBQ3pDLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1lBQ3hCLFVBQUssR0FBTCxLQUFLLENBQWlCO1lBQ3RCLFNBQUksR0FBSixJQUFJLENBQVk7U0FFekI7Ozs7O1FBRU0sMENBQWE7Ozs7WUFBcEIsVUFBcUIsSUFBbUI7O29CQUNoQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFDLElBQUksRUFBRSxJQUFJLENBQUMsRUFBRSxFQUFDLENBQUM7Z0JBQ3BELElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxZQUFZLEdBQUcsVUFBVSxDQUFDLENBQUM7YUFDOUU7Ozs7O1FBRU0sdUNBQVU7Ozs7WUFBakIsVUFBa0IsSUFBbUI7Z0JBQXJDLGlCQVFDO2dCQVBDLElBQUksQ0FBQyxnQkFBZ0IsQ0FDbkIsUUFBUSxFQUNSLEVBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUMsRUFDZixRQUFRLEVBQ1IsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFVBQVUsR0FDL0IsY0FBTSxPQUFBLEtBQUksQ0FBQyxxQkFBcUIsRUFBRSxHQUFBLEVBQ25DLENBQUM7YUFDSDs7Ozs7UUFFTSw0Q0FBZTs7OztZQUF0QixVQUF1QixLQUFhO2dCQUFwQyxpQkFRQztnQkFQQyxJQUFJLENBQUMsZ0JBQWdCLENBQ25CLFFBQVEsRUFDUixFQUFDLEtBQUssRUFBRSxLQUFLLEVBQUMsRUFDZCxLQUFLLEVBQ0wsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFdBQVcsR0FDaEMsVUFBQyxHQUFHLElBQUssT0FBQSxLQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsR0FBQSxFQUN4QyxDQUFDO2FBQ0g7Ozs7OztRQUVNLHlDQUFZOzs7OztZQUFuQixVQUFvQixhQUFxQixFQUFFLFVBQWtCO2dCQUMzRCxJQUFJLENBQUMsZ0JBQWdCLENBQ25CLGVBQWUsRUFDZixFQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLGFBQWEsS0FBSyxDQUFDLEdBQUcsSUFBSSxHQUFHLGFBQWEsRUFBQyxFQUM3RSxNQUFNLEVBQ04sSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FDbEMsQ0FBQzthQUNIOzs7Ozs7UUFFTSxtQ0FBTTs7Ozs7WUFBYixVQUFjLEVBQVUsRUFBRSxPQUFlO2dCQUF6QyxpQkFRQztnQkFQQyxJQUFJLENBQUMsZ0JBQWdCLENBQ25CLFFBQVEsRUFDUixFQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBQyxFQUM1QixNQUFNLEVBQ04sSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFVBQVUsR0FDL0IsY0FBTSxPQUFBLEtBQUksQ0FBQyxxQkFBcUIsRUFBRSxHQUFBLEVBQ25DLENBQUM7YUFDSDs7Ozs7Ozs7Ozs7UUFFTyw2Q0FBZ0I7Ozs7Ozs7Ozs7WUFBeEIsVUFBeUIsSUFBWSxFQUFFLFVBQWMsRUFBRSxVQUFrQixFQUFFLE1BQWMsRUFDaEUsYUFBNEMsRUFDNUMsVUFBOEM7Z0JBRnZFLGlCQWFDO2dCQVp3Qiw4QkFBQTtvQkFBQSxpQkFBZ0IsVUFBQyxDQUFDLElBQUssT0FBQSxLQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxHQUFBLENBQUE7O2dCQUM1QywyQkFBQTtvQkFBQSxjQUFhLFVBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSyxPQUFBLEtBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFBLENBQUE7OztvQkFFL0QsTUFBTSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDO2dCQUUzQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUV2RCxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsRUFBRSxNQUFNLEdBQUcsTUFBTSxDQUFDO3FCQUMxQyxTQUFTLEVBQ1IsVUFBQyxDQUFDLElBQUssT0FBQSxhQUFhLENBQUMsQ0FBQyxDQUFDLEdBQUEsSUFDdkIsVUFBQyxHQUFHLElBQUssT0FBQSxVQUFVLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxHQUFBLEVBQy9CLENBQUM7YUFDTDs7Ozs7Ozs7UUFFTyx3Q0FBVzs7Ozs7OztZQUFuQixVQUFvQixNQUFjLEVBQUUsTUFBYyxFQUFFLElBQWM7Z0JBQWQscUJBQUE7b0JBQUEsU0FBYzs7Z0JBQ2hFLFFBQVEsTUFBTSxDQUFDLFdBQVcsRUFBRTtvQkFDMUIsS0FBSyxLQUFLO3dCQUNSLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxDQUFDO29CQUMxRCxLQUFLLE1BQU07d0JBQ1QsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO29CQUNqRSxLQUFLLFFBQVE7d0JBQ1gsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDLENBQUM7b0JBQzdELEtBQUssVUFBVTt3QkFDYixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sR0FBRyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7d0JBQ3pELE9BQU8sSUFBSSxDQUFDO29CQUNkO3dCQUNFLE9BQU8sQ0FBQyxJQUFJLENBQUMsNERBQTRELENBQUMsQ0FBQzt3QkFDM0UsT0FBTyxJQUFJLENBQUM7aUJBQ2Y7YUFDRjs7Ozs7O1FBRU8sd0NBQVc7Ozs7O1lBQW5CLFVBQW9CLE1BQVU7O29CQUN4QixLQUFLLEdBQUcsR0FBRztnQkFFZixNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sRUFBQyxVQUFBLElBQUksSUFBSSxPQUFBLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLEdBQUEsRUFBQyxDQUFDLEdBQUcsRUFBQyxVQUFBLEdBQUc7b0JBQy9ELEtBQUssSUFBSSxHQUFHLEdBQUcsR0FBRyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUM7aUJBQ3hDLEVBQUMsQ0FBQztnQkFFSCxPQUFPLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDM0I7Ozs7O1FBRU8sa0RBQXFCOzs7O1lBQTdCO2dCQUNFLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztnQkFDckIsUUFBUSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO2FBQ25FOzs7Ozs7O1FBRU8sMENBQWE7Ozs7OztZQUFyQixVQUFzQixLQUFhLEVBQUUsSUFBUzs7b0JBQ3RDLEdBQUcsR0FBRztvQkFDVixZQUFZLEVBQUUsS0FBSztvQkFDbkIsUUFBUSxFQUFFLElBQUk7aUJBQ2Y7Z0JBRUQsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO2dCQUVyQixJQUFJLENBQUMsb0JBQW9CLENBQUMsWUFBWSxDQUFDLEdBQUcsRUFBRSxhQUFhLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ2pFLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7YUFDMUQ7Ozs7OztRQUVPLDBDQUFhOzs7OztZQUFyQixVQUFzQixRQUFxQjtnQkFBckIseUJBQUE7b0JBQUEsYUFBcUI7O2dCQUN6QyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBRTlDLElBQUksQ0FBQyxXQUFXLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztnQkFDdEMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQzthQUN6RDs7Ozs7OztRQUVPLHlDQUFZOzs7Ozs7WUFBcEIsVUFBcUIsSUFBWSxFQUFFLEtBQVU7Z0JBQzNDLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQztnQkFFOUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFDeEQsSUFBSSxDQUFDLG9CQUFvQixDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDeEQsT0FBTyxDQUFDLElBQUksQ0FBQywrQkFBK0IsR0FBRyxJQUFJLEdBQUcsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFDO2FBQzFFOztvQkFsSUZGLGFBQVUsU0FBQzt3QkFDVixVQUFVLEVBQUUsTUFBTTtxQkFDbkI7Ozs7d0JBTk9HLHVCQUFvQjt3QkFKcEIsV0FBVzt3QkFNWEQsUUFBSzt3QkFKTEQsYUFBVTs7OztpQ0FKbEI7S0E2SUM7Ozs7OztBQzdJRDtRQWtRRSw4QkFDVSxLQUFzQixFQUN0QixXQUF3QixFQUN4QixrQkFBc0MsRUFDdkMsb0JBQTBDO1lBSHpDLFVBQUssR0FBTCxLQUFLLENBQWlCO1lBQ3RCLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1lBQ3hCLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBb0I7WUFDdkMseUJBQW9CLEdBQXBCLG9CQUFvQixDQUFzQjtZQWQxQyxZQUFPLEdBQVksS0FBSyxDQUFDO1lBQ3hCLGdCQUFXLEdBQUcsSUFBSUcsZUFBWSxFQUFFLENBQUM7WUFHM0MsbUJBQWMsR0FBRyxJQUFJLENBQUM7WUFFdEIsV0FBTSxHQUFHLEtBQUssQ0FBQztZQUVmLGNBQVMsR0FBRyxLQUFLLENBQUM7U0FRakI7Ozs7UUFFRCx1Q0FBUTs7O1lBQVI7Z0JBQUEsaUJBOEJDOztnQkE1QkMsTUFBTSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQztnQkFDdEMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEtBQUk7aUJBQzFDLENBQUEsQ0FBQztnQkFFRixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO2dCQUNsQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7Z0JBQ3pDLElBQUksQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7Z0JBRXZELElBQUksQ0FBQyxLQUFLO3FCQUNQLElBQUksQ0FBQ0MsU0FBTSxFQUFDLFVBQUEsS0FBSyxJQUFJLE9BQUEsS0FBSyxDQUFDLGdCQUFnQixDQUFDLFNBQVMsR0FBQSxFQUFDLENBQUM7cUJBQ3ZELFNBQVMsRUFBQyxVQUFDLElBQWE7b0JBQ3ZCLEtBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO2lCQUNyQixFQUFDLENBQUM7Z0JBRUwsSUFBSSxDQUFDLEtBQUs7cUJBQ1AsSUFBSSxDQUFDQSxTQUFNLEVBQUMsVUFBQSxLQUFLLElBQUksT0FBQSxLQUFLLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxHQUFBLEVBQUMsQ0FBQztxQkFDMUQsU0FBUyxFQUFDLFVBQUMsSUFBbUI7b0JBQzdCLElBQUksQ0FBQyxJQUFJLEVBQUU7d0JBQ1QsT0FBTztxQkFDUjs7b0JBR0QsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLFVBQVUsS0FBSyxLQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7d0JBQzNGLE9BQU87cUJBQ1I7b0JBRUQsS0FBSSxDQUFDLDJCQUEyQixDQUFDLEVBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztpQkFDaEUsRUFBQyxDQUFDO2FBQ047Ozs7O1FBRUQsNENBQWE7Ozs7WUFBYixVQUFjLEtBQVU7Z0JBQ3RCLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQzlCOzs7OztRQUVELDRDQUFhOzs7O1lBQWIsVUFBYyxJQUFTOzs7O29CQUdmLElBQUksR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO2dCQUNuRCxJQUFJLENBQUMsb0JBQW9CLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUMxRCxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFDLElBQUksRUFBRUMsaUJBQXlCLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7YUFDdkU7Ozs7O1FBRUQsMERBQTJCOzs7O1lBQTNCLFVBQTRCLEtBQVU7Z0JBQ3BDLFFBQVEsS0FBSyxDQUFDLElBQUk7b0JBQ2hCLEtBQUssZUFBZTt3QkFDbEIsT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztvQkFFakQsS0FBSyxRQUFRO3dCQUNYLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7d0JBQzFCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ25DLE9BQU8sSUFBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFFM0MsS0FBSyxVQUFVO3dCQUNiLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO3dCQUNsRCxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBRW5DLEtBQUssZUFBZTt3QkFDbEIsT0FBTyxJQUFJLENBQUMsb0JBQW9CLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO29CQUNsRSxLQUFLLFFBQVE7d0JBQ1gsSUFBSSxDQUFDLG9CQUFvQixDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQzt3QkFFMUQsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7d0JBQ2xFLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQzs0QkFDeEIsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJOzRCQUNoQixJQUFJLEVBQUUsSUFBSSxDQUFDLFlBQVk7NEJBQ3ZCLE9BQU8sRUFBRSxLQUFLLENBQUMsS0FBSzt5QkFDckIsQ0FBQyxDQUFDO29CQUVMLEtBQUssV0FBVzt3QkFDZCxPQUFPLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxRQUFRLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFDekUsS0FBSyxRQUFRO3dCQUNYLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxRQUFRLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQzt3QkFFakUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7d0JBQ3RELE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQzs0QkFDeEIsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJOzRCQUNoQixJQUFJLEVBQUUsSUFBSSxDQUFDLFlBQVk7eUJBQ3hCLENBQUMsQ0FBQztvQkFFTCxLQUFLLGNBQWM7OzRCQUNYLFFBQVEsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxDQUFDLEVBQUU7d0JBRWpGLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQzt3QkFDOUQsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDOzRCQUN4QixJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUk7NEJBQ2hCLFFBQVEsRUFBRSxRQUFROzRCQUNsQixVQUFVLEVBQUUsS0FBSyxDQUFDLE9BQU87eUJBQzFCLENBQUMsQ0FBQztpQkFDTjthQUNGOzs7Ozs7UUFFRCwrQ0FBZ0I7Ozs7O1lBQWhCLFVBQWlCLElBQW1CLEVBQUUsT0FBaUI7Z0JBQ3JELElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxNQUFNLEVBQUU7b0JBQ3hCLE9BQU87aUJBQ1I7Z0JBRUQsSUFBSSxPQUFPLEVBQUU7O3dCQUNMLFVBQVUsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQztvQkFDaEYsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBQyxJQUFJLEVBQUVBLGlCQUF5QixFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUMsQ0FBQyxDQUFDO29CQUM1RSxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztpQkFDNUI7cUJBQ0k7b0JBQ0gsSUFBSSxJQUFJLENBQUMsWUFBWSxLQUFLLElBQUksSUFBSSxJQUFJLENBQUMsY0FBYzt3QkFDbkQsSUFBSSxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUM7eUJBQ3pCLElBQUksSUFBSSxDQUFDLFlBQVksS0FBSyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYzt3QkFDekQsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7eUJBQ3hCLElBQUksSUFBSSxDQUFDLFlBQVksS0FBSyxJQUFJLElBQUksSUFBSSxDQUFDLGNBQWM7d0JBQ3hELElBQUksQ0FBQyxjQUFjLEdBQUcsS0FBSyxDQUFDO3lCQUN6QixJQUFJLElBQUksQ0FBQyxZQUFZLEtBQUssSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWM7d0JBQ3pELElBQUksQ0FBQyxjQUFjLEdBQUcsS0FBSyxDQUFDO2lCQUMvQjtnQkFFRCxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQzs7Z0JBR3pCLElBQUcsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxFQUFFO29CQUN4QyxPQUFPO2lCQUNSO2dCQUVELElBQUksSUFBSSxDQUFDLGNBQWMsRUFBRTtvQkFDdkIsUUFBUSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO2lCQUNuRTtxQkFBTTtvQkFDTCxRQUFRLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7aUJBQ2hFO2FBQ0Y7Ozs7Ozs7UUFHRCxnREFBaUI7Ozs7OztZQUFqQixVQUFrQixJQUFtQjs7b0JBQy9CLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVTtnQkFFaEMsSUFBSSxVQUFVLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtvQkFDM0IsVUFBVSxHQUFHLE1BQU0sQ0FBQztpQkFDckI7O29CQUVLLFdBQVcsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUM7O29CQUN0RCxTQUFTLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDO2dCQUN4RCxJQUFJLENBQUMsV0FBVyxJQUFJLENBQUMsU0FBUyxFQUFFO29CQUM5QixPQUFPLENBQUMsSUFBSSxDQUFDLHdEQUF3RCxFQUFFLFVBQVUsQ0FBQyxDQUFDO29CQUNuRixPQUFPO2lCQUNSO2dCQUVELElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBQ2hDLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBRTFCLElBQUksU0FBUztvQkFDWCxJQUFJLENBQUMscUJBQXFCLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQ3hDLElBQUksV0FBVztvQkFDYixJQUFJLENBQUMscUJBQXFCLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDOzs7b0JBRzVDLFlBQVksR0FBRyxJQUFJLENBQUMsWUFBWTtnQkFDcEMsSUFBSSxZQUFZLEtBQUssSUFBSSxJQUFJLElBQUksQ0FBQyxVQUFVLEtBQUssSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLEVBQUU7b0JBQzdFLE9BQU87aUJBQ1I7Z0JBRUQsSUFBSSxZQUFZLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtvQkFDN0IsWUFBWSxHQUFHLE1BQU0sQ0FBQztpQkFDdkI7O29CQUVLLGFBQWEsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLFlBQVksRUFBRSxPQUFPLENBQUM7Z0JBQ2hFLElBQUksQ0FBQyxhQUFhLEVBQUU7b0JBQ2xCLE9BQU8sQ0FBQyxJQUFJLENBQUMsK0RBQStELEVBQUUsWUFBWSxDQUFDLENBQUM7b0JBQzVGLE9BQU87aUJBQ1I7Z0JBRUQsSUFBSSxDQUFDLHFCQUFxQixDQUFDLGFBQWEsQ0FBQyxDQUFDO2FBQzNDOzs7Ozs7O1FBRU8sb0RBQXFCOzs7Ozs7WUFBN0IsVUFBOEIsRUFBZSxFQUFFLEtBQXNCO2dCQUF0QixzQkFBQTtvQkFBQSxhQUFzQjs7Z0JBQ25FLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO3FCQUNYLFFBQVEsQ0FBQyxDQUFDLENBQUM7cUJBQ1gsU0FBUyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQztnQkFFaEMsSUFBSSxLQUFLO29CQUNQLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO3lCQUNYLFFBQVEsQ0FBQyxDQUFDLENBQUM7eUJBQ1gsU0FBUyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQzthQUM3Qjs7Ozs7OztRQUVPLDZDQUFjOzs7Ozs7WUFBdEIsVUFBdUIsRUFBVSxFQUFFLE1BQW1CO2dCQUFuQix1QkFBQTtvQkFBQSxXQUFtQjs7O29CQUM5QyxNQUFNLEdBQUcsTUFBTSxHQUFHLEVBQUU7Z0JBQzFCLE9BQU8sUUFBUSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQzthQUN4Qzs7Ozs7O1FBRU8sMENBQVc7Ozs7O1lBQW5CLFVBQW9CLFNBQWlCO2dCQUNuQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxzQkFBc0IsQ0FBQyxTQUFTLENBQUMsQ0FBQztxQkFDbkQsR0FBRyxFQUFDLFVBQUMsRUFBZSxJQUFLLE9BQUEsRUFBRSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUEsRUFBQyxDQUFDO2FBQzdEOzs7O1FBRUQseUNBQVU7OztZQUFWO2dCQUNFLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO2FBQzVCOzs7O1FBRUQsOENBQWU7OztZQUFmOzs7Z0JBR0UsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBQyxJQUFJLEVBQUUsaUJBQWlCLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUM7YUFDaEU7Ozs7O1FBRUQsaURBQWtCOzs7O1lBQWxCLFVBQW1CLEtBQVU7Z0JBQzNCLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO2FBQ3hCOztvQkExY0ZDLFlBQVMsU0FBQzt3QkFDVCxRQUFRLEVBQUUsaUJBQWlCO3dCQUMzQixRQUFRLEVBQUUsMjhSQThOWDt3QkFDQyxNQUFNLEVBQUUsQ0FBQyw2NkJBQTY2QixDQUFDO3dCQUN2N0IsYUFBYSxFQUFFQyxvQkFBaUIsQ0FBQyxJQUFJO3FCQUN0Qzs7Ozt3QkE3T2VOLFFBQUs7d0JBRWIsV0FBVzt3QkFNWCxrQkFBa0I7d0JBRGxCQyx1QkFBb0I7Ozs7bUNBd096Qk0sUUFBSzs0Q0FDTEEsUUFBSztnREFDTEEsUUFBSzsrQ0FDTEEsUUFBSzs2Q0FDTEEsUUFBSzt1Q0FDTEEsUUFBSzsyQkFFTEEsUUFBSzs4QkFDTEEsUUFBSztrQ0FDTEMsU0FBTTs7UUE2TlQsMkJBQUM7S0FBQTs7Ozs7O0FDdGREO1FBOENFLGdDQUNVLFdBQXdCLEVBQ3hCLEtBQXNCO1lBRHRCLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1lBQ3hCLFVBQUssR0FBTCxLQUFLLENBQWlCO1lBUHRCLHFCQUFnQixHQUFHLElBQUlOLGVBQVksRUFBRSxDQUFDO1lBR2hELFFBQUcsR0FBRyxNQUFNLENBQUM7U0FNWjs7OztRQUVELHlDQUFROzs7WUFBUjtnQkFBQSxpQkFNQztnQkFMQyxJQUFJLENBQUMsS0FBSztxQkFDUCxJQUFJLENBQUNDLFNBQU0sRUFBQyxVQUFBLEtBQUssSUFBSSxPQUFBLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEdBQUEsRUFBQyxDQUFDO3FCQUNsRCxTQUFTLEVBQUMsVUFBQyxJQUFZO29CQUN0QixLQUFJLENBQUMsS0FBSyxHQUFHLEtBQUksQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO2lCQUNwRCxFQUFDLENBQUM7YUFDTjs7OztRQUVELGlEQUFnQjs7O1lBQWhCO2dCQUNFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDbEM7O29CQXZERkUsWUFBUyxTQUFDO3dCQUNULFFBQVEsRUFBRSxvQkFBb0I7d0JBQzlCLFFBQVEsRUFBRSw0MkJBc0JYO3dCQUNDLE1BQU0sRUFBRSxDQUFDLDhJQUE4SSxDQUFDO3FCQUN6Sjs7Ozt3QkE5Qk8sV0FBVzt3QkFGSEwsUUFBSzs7Ozs0Q0FrQ2xCTyxRQUFLO2dEQUNMQSxRQUFLOytDQUNMQSxRQUFLO2dDQUVMQSxRQUFLO3VDQUVMQyxTQUFNOztRQXNCVCw2QkFBQztLQUFBOzs7Ozs7QUMvREQ7UUE0QkUsdUJBQ1UsV0FBd0IsRUFDeEIsS0FBc0I7WUFEdEIsZ0JBQVcsR0FBWCxXQUFXLENBQWE7WUFDeEIsVUFBSyxHQUFMLEtBQUssQ0FBaUI7WUFKaEMscUJBQWdCLEdBQUcsRUFBRSxDQUFDO1NBTXJCOzs7O1FBRUQsZ0NBQVE7OztZQUFSO2dCQUFBLGlCQWFDO2dCQVpDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUM7O2dCQUdsQyxJQUFJLENBQUMsS0FBSztxQkFDUCxJQUFJLENBQUNMLFNBQU0sRUFBQyxVQUFBLEtBQUssSUFBSSxPQUFBLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEdBQUEsRUFBQyxDQUFDO3FCQUNsRCxTQUFTLEVBQUMsVUFBQyxJQUFZO29CQUN0QixLQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFFaEMsS0FBSSxDQUFDLGdCQUFnQixHQUFHLEtBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDO29CQUVuRCxPQUFPLEtBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztpQkFDMUMsRUFBQyxDQUFDO2FBQ047Ozs7UUFFRCx1Q0FBZTs7O1lBQWY7Z0JBQUEsaUJBUUM7Z0JBUEMsSUFBSSxDQUFDLEtBQUs7cUJBQ1AsSUFBSSxDQUFDQSxTQUFNLEVBQUMsVUFBQSxLQUFLLElBQUksT0FBQSxLQUFLLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxHQUFBLEVBQUMsQ0FBQztxQkFDbEQsSUFBSSxDQUFDTSxlQUFLLEVBQUUsQ0FBQztxQkFDYixTQUFTLEVBQUMsVUFBQyxJQUFZOzt3QkFDaEIsS0FBSyxHQUFHLEtBQUksQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQztvQkFDbkQsS0FBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBQyxJQUFJLEVBQUVMLGlCQUF5QixFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO2lCQUN4RSxFQUFDLENBQUM7YUFDTjs7b0JBaERGQyxZQUFTLFNBQUM7d0JBQ1QsUUFBUSxFQUFFLFVBQVU7d0JBQ3BCLFFBQVEsRUFBRSwwVEFNWDt3QkFDQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUM7cUJBQ2I7Ozs7d0JBaEJPLFdBQVc7d0JBQ0hMLFFBQUs7Ozs7a0NBaUJsQlUsZUFBWSxTQUFDQyxjQUFXO2dDQUV4QkosUUFBSzs7UUFtQ1Isb0JBQUM7S0FBQTs7Ozs7O0FDMUREO1FBcUNFO1lBRkEsUUFBRyxHQUFHLE1BQU0sQ0FBQztTQUdaOzs7O1FBRUQsc0NBQVE7OztZQUFSO2FBQ0M7O29CQXRDRkYsWUFBUyxTQUFDO3dCQUNULFFBQVEsRUFBRSxpQkFBaUI7d0JBQzNCLFFBQVEsRUFBRSxzakNBc0JYO3dCQUNDLE1BQU0sRUFBRSxDQUFDLDhQQUE4UCxDQUFDO3FCQUN6UTs7OztrQ0FFRUssZUFBWSxTQUFDQyxjQUFXOzRCQUN4QkosUUFBSztnQ0FDTEEsUUFBSzs7UUFTUiwwQkFBQztLQUFBOzs7Ozs7QUMxQ0Q7UUFxQkUsdUJBQ1UsS0FBc0IsRUFDdEIsV0FBd0IsRUFDeEIsa0JBQXNDO1lBRnRDLFVBQUssR0FBTCxLQUFLLENBQWlCO1lBQ3RCLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1lBQ3hCLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBb0I7WUFMaEQsa0JBQWEsR0FBRyxJQUFJLENBQUM7U0FPcEI7Ozs7O1FBRU0sMkNBQW1COzs7O1lBQTFCLFVBQTJCLEtBQWlCO2dCQUE1QyxpQkFTQztnQkFSQyxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7Z0JBRXZCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO2dCQUMxQixVQUFVLEVBQUM7b0JBQ1QsSUFBSSxLQUFJLENBQUMsYUFBYSxFQUFFO3dCQUN0QixLQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7cUJBQ2pCO2lCQUNGLEdBQUUsR0FBRyxDQUFDLENBQUM7YUFDVDs7Ozs7OztRQUdNLDhDQUFzQjs7Ozs7O1lBQTdCLFVBQThCLEtBQVU7Z0JBQ3RDLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztnQkFFdkIsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7Z0JBQzNCLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQzthQUNiOzs7O1FBRUQsZ0NBQVE7OztZQUFSO2FBQ0M7Ozs7O1FBRU8sNEJBQUk7Ozs7WUFBWjtnQkFDRSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7b0JBQ3ZCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUNqRCxPQUFPO2lCQUNSO2dCQUVELElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7b0JBQ3RCLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksTUFBTSxFQUFFO3dCQUM1QixJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxDQUFDO3FCQUM1QjtvQkFFRCxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFDLElBQUksRUFBRVosUUFBZ0IsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUMsQ0FBQyxDQUFDO29CQUM3RSxPQUFPO2lCQUNSO2dCQUVELElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO2dCQUUxQixJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFO29CQUN4QixJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFDLElBQUksRUFBRUEsUUFBZ0IsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUMsQ0FBQyxDQUFDO2lCQUM5RTtnQkFFRCxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQzthQUM3Qjs7Ozs7UUFFTyxnQ0FBUTs7OztZQUFoQjtnQkFDRSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFDLElBQUksRUFBRVMsaUJBQXlCLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUMsQ0FBQyxDQUFDO2FBQzVFOzs7OztRQUVPLDBDQUFrQjs7OztZQUExQjtnQkFDRSxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO2FBQzlDOzs7OztRQUVPLDRDQUFvQjs7OztZQUE1QjtnQkFDRSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUU7b0JBQ3pCLFFBQVEsQ0FBQyxjQUFjLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztvQkFFcEYsSUFBSSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUU1QyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFDLElBQUksRUFBRVQsUUFBZ0IsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUMsQ0FBQyxDQUFDO2lCQUNoRjtxQkFBTTtvQkFDTCxRQUFRLENBQUMsY0FBYyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7aUJBQ3hGO2FBQ0Y7O29CQW5GRlUsWUFBUyxTQUFDO3dCQUNULFFBQVEsRUFBRSxVQUFVO3dCQUNwQixRQUFRLEVBQUUsb0pBR1g7d0JBQ0MsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDO3FCQUNiOzs7O3dCQWRPTCxRQUFLO3dCQUlMLFdBQVc7d0JBQ1gsa0JBQWtCOzs7OzJCQVd2Qk8sUUFBSzs7UUEyRVIsb0JBQUM7S0FBQTs7Ozs7O0FDN0ZEO1FBRUE7U0FjQzs7Ozs7UUFWQyxxQ0FBUzs7OztZQUFULFVBQVUsSUFBWTs7b0JBQ2QsQ0FBQyxHQUFHLEVBQUU7Z0JBQ1osS0FBSyxJQUFNLEdBQUcsSUFBSSxJQUFJLEVBQUU7b0JBQ3RCLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsRUFBRTt3QkFDNUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBQyxDQUFDLENBQUM7cUJBQ3BDO2lCQUNGO2dCQUVELE9BQU8sQ0FBQyxDQUFDO2FBQ1Y7O29CQWJGSyxPQUFJLFNBQUM7d0JBQ0osSUFBSSxFQUFFLG1CQUFtQjtxQkFDMUI7O1FBWUQsd0JBQUM7S0FBQTs7Ozs7O0FDaEJEO1FBdUJFLHlCQUNVLEtBQXNCLEVBQ3RCLFdBQXdCO1lBRHhCLFVBQUssR0FBTCxLQUFLLENBQWlCO1lBQ3RCLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1NBRWpDOzs7O1FBRUQsa0NBQVE7OztZQUFSO2dCQUFBLGlCQU9DO2dCQU5DLElBQUksQ0FBQyxLQUFLO3FCQUNQLElBQUksQ0FBQ1QsU0FBTSxFQUFDLFVBQUEsS0FBSyxJQUFJLE9BQUEsS0FBSyxDQUFDLGdCQUFnQixDQUFDLElBQUksR0FBQSxFQUFDLENBQUM7cUJBQ2xELFNBQVMsRUFBQyxVQUFDLElBQVk7b0JBQ3RCLEtBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztvQkFDcEMsS0FBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2lCQUNwQyxFQUFDLENBQUM7YUFDTjs7Ozs7O1FBRUQsaUNBQU87Ozs7O1lBQVAsVUFBUSxJQUFjLEVBQUUsS0FBYTs7b0JBQzdCLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztnQkFDbEQsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBQyxJQUFJLEVBQUVSLFFBQWdCLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBQyxDQUFDLENBQUM7YUFDakU7O29CQW5DRlUsWUFBUyxTQUFDO3dCQUNULFFBQVEsRUFBRSxhQUFhO3dCQUN2QixRQUFRLEVBQUUseVZBU1g7d0JBQ0MsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDO3FCQUNiOzs7O3dCQWxCZUwsUUFBSzt3QkFHYixXQUFXOzs7UUF1Q25CLHNCQUFDO0tBQUE7O0lDM0NEOzs7Ozs7Ozs7Ozs7OztBQWNBLElBZU8sSUFBSSxRQUFRLEdBQUc7UUFDbEIsUUFBUSxHQUFHLE1BQU0sQ0FBQyxNQUFNLElBQUksa0JBQWtCLENBQUM7WUFDM0MsS0FBSyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ2pELENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2pCLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQztvQkFBRSxJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO3dCQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDaEY7WUFDRCxPQUFPLENBQUMsQ0FBQztTQUNaLENBQUE7UUFDRCxPQUFPLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQzNDLENBQUMsQ0FBQTs7Ozs7OztRQ25DSyxZQUFZLEdBQW1CO1FBQ25DLElBQUksRUFBRSxFQUFFO1FBQ1IsU0FBUyxFQUFFLElBQUk7UUFDZixZQUFZLEVBQUUsSUFBSTtLQUNuQjs7Ozs7O0FBRUQsMEJBQTZCLEtBQW9DLEVBQUUsTUFBdUI7Ozs7UUFBN0Qsc0JBQUE7WUFBQSxvQkFBb0M7O1FBSy9ELFFBQVEsTUFBTSxDQUFDLElBQUk7WUFDakIsS0FBS0wsUUFBZ0I7Z0JBQ25CLElBQUksS0FBSyxDQUFDLElBQUksS0FBSyxNQUFNLENBQUMsT0FBTyxFQUFFO29CQUNqQyxPQUFPLEtBQUssQ0FBQztpQkFDZDtnQkFDRCxvQkFBVyxLQUFLLElBQUUsSUFBSSxFQUFFLE1BQU0sQ0FBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLElBQUksSUFBRTtZQUMzRCxLQUFLRSxpQkFBeUI7Z0JBQzVCLG9CQUFXLEtBQUssSUFBRSxTQUFTLEVBQUUsTUFBTSxDQUFDLE9BQU8sSUFBRTtZQUMvQyxLQUFLTyxpQkFBeUI7Z0JBQzVCLG9CQUFXLEtBQUssSUFBRSxZQUFZLEVBQUUsTUFBTSxDQUFDLE9BQU8sSUFBRTtZQUNsRDtnQkFDRSxPQUFPLFlBQVksQ0FBQztTQUN2QjtJQUNILENBQUM7Ozs7OztBQzNCRDtBQVFBLFFBQWEsUUFBUSxHQUErQjtRQUNsRCxnQkFBZ0IsRUFBRSxZQUFZO0tBQy9COzs7Ozs7QUNWRDtRQUlBO1NBbUJDOzs7Ozs7UUFMQywwQ0FBUTs7Ozs7WUFBUjtnQkFBQSxpQkFJQztnQkFIQ1MsVUFBSyxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsRUFBQztvQkFDcEIsS0FBSSxDQUFDLGNBQWMsR0FBR0MsT0FBQyxDQUFDLHlEQUF5RCxDQUFDLENBQUM7aUJBQ3BGLEVBQUMsQ0FBQzthQUNKOztvQkFsQkZULFlBQVMsU0FBQzt3QkFDVCxRQUFRLEVBQUUscUJBQXFCO3dCQUMvQixRQUFRLEVBQUUsaUpBSVg7d0JBQ0MsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDO3FCQUNiOzs7NkNBRUVFLFFBQUs7O1FBU1IsOEJBQUM7S0FBQTs7Ozs7O0FDdkJEOzs7Ozs7Ozs7QUFXQTs7Ozs7Ozs7OztRQUFBO1lBR1UsVUFBSyxHQUFHO2dCQUNkLE9BQU87Z0JBQ1AsSUFBSTtnQkFDSixJQUFJO2dCQUNKLElBQUk7Z0JBQ0osSUFBSTtnQkFDSixJQUFJO2FBQ0wsQ0FBQztTQWNIOzs7Ozs7UUFaQyxnQ0FBUzs7Ozs7WUFBVCxVQUFVLEtBQWlCLEVBQUUsU0FBcUI7Z0JBQXhDLHNCQUFBO29CQUFBLFNBQWlCOztnQkFBRSwwQkFBQTtvQkFBQSxhQUFxQjs7Z0JBQ2hELElBQUssS0FBSyxDQUFFLFVBQVUsQ0FBRSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUUsQ0FBQyxJQUFJLENBQUUsUUFBUSxDQUFFLEtBQUssQ0FBRztvQkFBRSxPQUFPLEdBQUcsQ0FBQzs7b0JBRXpFLElBQUksR0FBRyxDQUFDO2dCQUVaLE9BQVEsS0FBSyxJQUFJLElBQUksRUFBRztvQkFDdEIsS0FBSyxJQUFJLElBQUksQ0FBQztvQkFDZCxJQUFJLEVBQUcsQ0FBQztpQkFDVDtnQkFFRCxPQUFPLEtBQUssQ0FBQyxPQUFPLENBQUUsQ0FBRSxTQUFTLENBQUUsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBRSxJQUFJLENBQUUsQ0FBQzthQUNoRTs7b0JBdkJGSyxPQUFJLFNBQUMsRUFBQyxJQUFJLEVBQUUsVUFBVSxFQUFDOztRQXdCeEIsbUJBQUM7S0FBQTs7Ozs7O0FDbkNEO1FBa0hFLHlCQUFvQixJQUFnQixFQUNoQixXQUF3QjtZQUR4QixTQUFJLEdBQUosSUFBSSxDQUFZO1lBQ2hCLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1lBUmxDLGdCQUFXLEdBQUcsSUFBSVYsZUFBWSxFQUFFLENBQUM7WUFDakMsY0FBUyxHQUFHLElBQUlBLGVBQVksRUFBRSxDQUFDO1lBR3pDLGNBQVMsR0FBRyxLQUFLLENBQUM7WUFDbEIsWUFBTyxHQUFHLENBQUMsQ0FBQztTQUlYOzs7O1FBRUQseUNBQWU7OztZQUFmO2dCQUFBLGlCQWdDQztnQkEvQkMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJYSx5QkFBWSxDQUFDO29CQUMvQixLQUFLLEVBQUUsS0FBSztvQkFDWixVQUFVLEVBQUUsS0FBSztvQkFDakIsY0FBYyxFQUFFLENBQUM7O29CQUNqQixPQUFPLEVBQUUsUUFBUSxDQUFDLGNBQWMsQ0FBQyxlQUFlLENBQUM7b0JBQ2pELFFBQVEsRUFBRSxRQUFRLENBQUMsY0FBYyxDQUFDLHdCQUF3QixDQUFDO29CQUMzRCxPQUFPLEVBQUU7d0JBQ1AsUUFBUSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFVOzt3QkFFNUYsWUFBWSxFQUFFLEtBQUs7d0JBQ25CLE1BQU0sRUFBRTs0QkFDTixVQUFVLEVBQUUsSUFBSSxDQUFDLGNBQWM7eUJBQ2hDO3FCQUNGO29CQUNELEtBQUssRUFBRTt3QkFDTCxVQUFVLEVBQUUsS0FBSztxQkFDbEI7b0JBQ0QsU0FBUyxFQUFFO3dCQUNULFdBQVcsR0FBRSxjQUFNLE9BQUEsS0FBSSxDQUFDLE9BQU8sRUFBRSxHQUFBLENBQUE7d0JBQ2pDLFFBQVEsR0FBRTs0QkFDUixLQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEtBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQzt5QkFDMUQsQ0FBQTt3QkFDRCxhQUFhLEdBQUUsVUFBQyxJQUFTLEVBQUUsSUFBUzs0QkFDbEMsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtnQ0FDbkIsS0FBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUM7Z0NBQ2pCLEtBQUksQ0FBQyxXQUFXLENBQUMsa0JBQWtCLEVBQUUsQ0FBQzs2QkFDdkM7eUJBQ0YsQ0FBQTtxQkFDRjtpQkFDRixDQUFDLENBQ0Q7YUFDRjs7OztRQUVELGtDQUFROzs7WUFBUjthQUNDO1FBRUQsc0JBQUksMkNBQWM7OztnQkFBbEI7O29CQUNRLFVBQVUsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxDQUFDLEVBQUU7Z0JBQ25GLE9BQU8sVUFBVSxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUcsVUFBVSxDQUFDO2FBQzNDOzs7V0FBQTs7OztRQUVELHFDQUFXOzs7WUFBWDtnQkFDRSxJQUFJLENBQUMsUUFBUSxDQUFDLGlCQUFpQixFQUFFLENBQUM7YUFDbkM7Ozs7O1FBRUQseUNBQWU7Ozs7WUFBZixVQUFnQixLQUFjO2dCQUM1QixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRTtvQkFDbkIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7aUJBQ3ZCO3FCQUFNO29CQUNMLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO29CQUN2QixJQUFJLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO3dCQUNwQixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQzt3QkFDM0IsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7cUJBQ3pCO2lCQUNGO2FBQ0Y7Ozs7UUFFRCwwQ0FBZ0I7OztZQUFoQjtnQkFDRSxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRSxDQUFDO2dCQUMxQixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDO2FBQ3pCOztvQkE5S0ZWLFlBQVMsU0FBQzt3QkFDVCxRQUFRLEVBQUUsWUFBWTt3QkFDdEIsUUFBUSxFQUFFLDJuSUE2Rlg7d0JBQ0MsTUFBTSxFQUFFLENBQUMsMEtBQXdLLEVBQUUsa3BIQUFncEgsQ0FBQzt3QkFDcDBILGFBQWEsRUFBRUMsb0JBQWlCLENBQUMsSUFBSTtxQkFDdEM7Ozs7d0JBdEdPUCxhQUFVO3dCQUVWLFdBQVc7Ozs7aUNBc0doQlEsUUFBSztrQ0FFTEMsU0FBTTtnQ0FDTkEsU0FBTTs7UUF3RVQsc0JBQUM7S0FBQTs7Ozs7O0FDcExEO1FBbUJFO1lBTFUsa0JBQWEsR0FBRyxJQUFJTixlQUFZLEVBQUUsQ0FBQztZQUU3QyxlQUFVLEdBQUdZLE9BQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNuQyxlQUFVLEdBQUcsRUFBRSxDQUFDO1NBR2Y7Ozs7UUFFRCxxQ0FBUTs7O1lBQVI7YUFDQzs7OztRQUVELG9DQUFPOzs7WUFBUDs7b0JBQ1EsRUFBRSxNQUFpQixJQUFJLENBQUMsWUFBWSxDQUFDLGFBQWEsR0FBZ0I7O2dCQUV4RSxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDbkM7Ozs7O1FBRUQsMENBQWE7Ozs7WUFBYixVQUFjLEtBQVU7Z0JBQ3RCLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7Z0JBQ3JDLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO29CQUM5QixJQUFJLENBQUMsVUFBVSxHQUFHQSxPQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7aUJBQzNDO3FCQUFNO29CQUNMLElBQUksQ0FBQyxVQUFVLEdBQUdBLE9BQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztpQkFDekM7YUFDRjs7b0JBbkNGVCxZQUFTLFNBQUM7d0JBQ1QsUUFBUSxFQUFFLGdCQUFnQjt3QkFDMUIsUUFBUSxFQUFFLHNXQUlYO3dCQUNDLE1BQU0sRUFBRSxDQUFDLGtEQUFrRCxDQUFDO3FCQUM3RDs7OzttQ0FFRVcsWUFBUyxTQUFDLGNBQWM7b0NBQ3hCUixTQUFNOztRQXlCVCx5QkFBQztLQUFBOzs7Ozs7QUN2Q0Q7UUF3Q0U7WUFKUyx3QkFBbUIsR0FBRyxLQUFLLENBQUM7WUFFM0IsZUFBVSxHQUFHLElBQUlOLGVBQVksRUFBRSxDQUFDO1NBR3pDOzs7O1FBRUQsb0NBQVE7OztZQUFSO2FBQ0M7Ozs7OztRQUVELG1DQUFPOzs7OztZQUFQLFVBQVEsS0FBVSxFQUFFLElBQVk7Z0JBQzlCLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFDLENBQUMsQ0FBQzthQUNuRTs7b0JBN0NGRyxZQUFTLFNBQUM7d0JBQ1QsUUFBUSxFQUFFLGVBQWU7d0JBQ3pCLFFBQVEsRUFBRSxtNUJBdUJYO3dCQUNDLE1BQU0sRUFBRSxDQUFDLHVSQUF1UixDQUFDO3dCQUNqUyxhQUFhLEVBQUVDLG9CQUFpQixDQUFDLElBQUk7cUJBQ3RDOzs7O3VDQUVFQyxRQUFLOzJCQUVMQSxRQUFLOzBDQUNMQSxRQUFLO2lDQUVMQyxTQUFNOztRQVlULHdCQUFDO0tBQUE7Ozs7OztBQ2xERDtRQXlCRSw2QkFDVSxrQkFBc0M7WUFBdEMsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUFvQjtTQUUvQzs7OztRQUVELHNDQUFROzs7WUFBUjthQUNDOzs7OztRQUVELHFDQUFPOzs7O1lBQVAsVUFBUSxLQUFhO2dCQUNuQixJQUFJLENBQUMsa0JBQWtCLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQ2hEOztvQkFoQ0ZILFlBQVMsU0FBQzt3QkFDVCxRQUFRLEVBQUUsZ0JBQWdCO3dCQUMxQixRQUFRLEVBQUUseWFBY1g7d0JBQ0MsTUFBTSxFQUFFLENBQUMsMERBQTBELENBQUM7d0JBQ3BFLGFBQWEsRUFBRUMsb0JBQWlCLENBQUMsSUFBSTtxQkFDdEM7Ozs7d0JBckJPLGtCQUFrQjs7O1FBbUMxQiwwQkFBQztLQUFBOzs7Ozs7O1FDZksscUJBQXFCLEdBQUcsSUFBSVcsaUJBQWMsQ0FFOUMsbUJBQW1CLENBQUM7Ozs7QUFDdEI7O1FBRUUsT0FBTyxRQUFRLENBQUM7SUFDbEIsQ0FBQztBQUVEO1FBQUE7U0F5Q0M7Ozs7UUFOUSx5QkFBTzs7O1lBQWQ7Z0JBQ0UsT0FBTztvQkFDTCxRQUFRLEVBQUUsaUJBQWlCO29CQUMzQixTQUFTLEVBQUUsRUFBRTtpQkFDZCxDQUFDO2FBQ0g7O29CQXhDRkMsV0FBUSxTQUFDO3dCQUNSLE9BQU8sRUFBRTs0QkFDUEMsbUJBQWdCOzRCQUNoQkMsY0FBVyxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQzs0QkFDMUNDLG1CQUFZOzRCQUNaQyxzQkFBbUIsQ0FBQyxPQUFPLEVBQUU7eUJBQzlCO3dCQUNELFlBQVksRUFBRTs0QkFDWixvQkFBb0I7NEJBQ3BCLHNCQUFzQjs0QkFDdEIsYUFBYTs0QkFDYixhQUFhOzRCQUNiLG1CQUFtQjs0QkFDbkIsaUJBQWlCOzRCQUNqQixlQUFlOzRCQUNmLHVCQUF1Qjs0QkFDdkIsWUFBWTs0QkFDWixlQUFlOzRCQUNmLGtCQUFrQjs0QkFDbEIsaUJBQWlCOzRCQUNqQixtQkFBbUI7eUJBQ3BCO3dCQUNELE9BQU8sRUFBRTs0QkFDUCxvQkFBb0I7NEJBQ3BCLHVCQUF1Qjs0QkFDdkIsaUJBQWlCO3lCQUNsQjt3QkFDRCxTQUFTLEVBQUU7NEJBQ1Q7Z0NBQ0UsT0FBTyxFQUFFLHFCQUFxQjtnQ0FDOUIsVUFBVSxFQUFFLFdBQVc7NkJBQ3hCO3lCQUNGO3FCQUNGOztRQVFELHdCQUFDO0tBQUE7Ozs7OztBQ25FRDtRQU1FLG1CQUFZLE1BQXVCOztZQUVqQyxJQUFJLENBQUMsWUFBWSxHQUFHLEVBQUUsQ0FBQztZQUN2QixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztZQUVyQixJQUFJLENBQUMsS0FBSyxLQUFrQjtnQkFDMUIsRUFBRSxFQUFFLENBQUM7Z0JBQ0wsVUFBVSxFQUFFLEVBQUU7Z0JBQ2QsWUFBWSxFQUFFLElBQUk7Z0JBQ2xCLFFBQVEsRUFBRSxJQUFJO2dCQUNkLFVBQVUsRUFBRSxJQUFJO2dCQUNoQixRQUFRLEVBQUUsSUFBSTtnQkFDZCxJQUFJLEVBQUUsTUFBTTtnQkFDWixRQUFRLEVBQUUsRUFBRTthQUNiLEVBQUEsQ0FBQztTQUNIO1FBRUQsc0JBQUksa0NBQVc7OztnQkFBZjtnQkFDRSxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUM7YUFDMUI7Ozs7Z0JBRUQsVUFBZ0IsS0FBYTtnQkFDM0IsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7YUFDM0I7OztXQUpBO1FBTUQsc0JBQUksNEJBQUs7OztnQkFBVDtnQkFDRSxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7YUFDcEI7Ozs7Z0JBRUQsVUFBVSxLQUFvQjtnQkFDNUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7YUFDckI7OztXQUpBO1FBTUQsc0JBQUkscUNBQWM7OztnQkFBbEI7Z0JBQ0UsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDO2FBQzdCOzs7O2dCQUVELFVBQW1CLEtBQWE7Z0JBQzlCLElBQUksQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDO2FBQzlCOzs7V0FKQTtRQWNILGdCQUFDO0lBQUQsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7In0=