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
                    .pipe(i3.select((function (state) { return (state.fileManagerState || (({}))).isLoading; })))
                    .subscribe((function (data) {
                    _this.loading = data;
                }));
                this.store
                    .pipe(i3.select((function (state) { return (state.fileManagerState || (({}))).selectedNode; })))
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
                    .pipe(i3.select((function (state) { return (state.fileManagerState || (({}))).path; })))
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
                        template: "<div class=\"item-holder\" *ngIf=\"nodes\">\n  <ng-container *ngIf=\"nodes.id !== 0\">\n    <app-node [node]=nodes id=\"{{nodes.pathToNode}}\">\n      <ng-container [ngTemplateOutletContext]=\"{$implicit: nodes}\"\n                    [ngTemplateOutlet]=\"folderContentBackTemplate\">\n      </ng-container>\n    </app-node>\n  </ng-container>\n\n  <ng-container *ngFor=\"let node of obj.keys(nodes.children)\">\n    <app-node [node]=\"nodes.children[node]\"\n              id=\"fc_{{nodes.children[node].pathToNode}}\">\n      <ng-container [ngTemplateOutletContext]=\"{$implicit: nodes.children[node]}\"\n                    [ngTemplateOutlet]=\"folderContentTemplate\">\n      </ng-container>\n    </app-node>\n  </ng-container>\n\n  <div class=\"new\" (click)=\"newClickedAction()\">\n    <ng-container [ngTemplateOutlet]=\"folderContentNewTemplate\"></ng-container>\n  </div>\n</div>\n",
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
                    .pipe(i3.select((function (state) { return (state.fileManagerState || (({}))).path; })))
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
                    .pipe(i3.select((function (state) { return (state.fileManagerState || (({}))).path; })))
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
                    .pipe(i3.select((function (state) { return (state.fileManagerState || (({}))).path; })))
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmc2LWZpbGUtbWFuLnVtZC5qcy5tYXAiLCJzb3VyY2VzIjpbIm5nOi8vbmc2LWZpbGUtbWFuL2ZpbGUtbWFuYWdlci9yZWR1Y2Vycy9hY3Rpb25zLmFjdGlvbi50cyIsIm5nOi8vbmc2LWZpbGUtbWFuL2ZpbGUtbWFuYWdlci9zZXJ2aWNlcy9ub2RlLnNlcnZpY2UudHMiLCJuZzovL25nNi1maWxlLW1hbi9maWxlLW1hbmFnZXIvc2VydmljZXMvbm9kZS1jbGlja2VkLnNlcnZpY2UudHMiLCJuZzovL25nNi1maWxlLW1hbi9maWxlLW1hbmFnZXIvZmlsZS1tYW5hZ2VyLmNvbXBvbmVudC50cyIsIm5nOi8vbmc2LWZpbGUtbWFuL2ZpbGUtbWFuYWdlci9jb21wb25lbnRzL2ZvbGRlci1jb250ZW50L2ZvbGRlci1jb250ZW50LmNvbXBvbmVudC50cyIsIm5nOi8vbmc2LWZpbGUtbWFuL2ZpbGUtbWFuYWdlci9jb21wb25lbnRzL3RyZWUvdHJlZS5jb21wb25lbnQudHMiLCJuZzovL25nNi1maWxlLW1hbi9maWxlLW1hbmFnZXIvY29tcG9uZW50cy90cmVlL25vZGUtbGlzdGVyL25vZGUtbGlzdGVyLmNvbXBvbmVudC50cyIsIm5nOi8vbmc2LWZpbGUtbWFuL2ZpbGUtbWFuYWdlci9jb21wb25lbnRzL2Z1bmN0aW9ucy9ub2RlL25vZGUuY29tcG9uZW50LnRzIiwibmc6Ly9uZzYtZmlsZS1tYW4vZmlsZS1tYW5hZ2VyL3BpcGVzL21hcC10by1pdGVyYWJsZS5waXBlLnRzIiwibmc6Ly9uZzYtZmlsZS1tYW4vZmlsZS1tYW5hZ2VyL2NvbXBvbmVudHMvbmF2LWJhci9uYXYtYmFyLmNvbXBvbmVudC50cyIsbnVsbCwibmc6Ly9uZzYtZmlsZS1tYW4vZmlsZS1tYW5hZ2VyL3JlZHVjZXJzL3N0YXRlUmVkdWNlci50cyIsIm5nOi8vbmc2LWZpbGUtbWFuL2ZpbGUtbWFuYWdlci9yZWR1Y2Vycy9yZWR1Y2VyLmZhY3RvcnkudHMiLCJuZzovL25nNi1maWxlLW1hbi9maWxlLW1hbmFnZXIvY29tcG9uZW50cy9mdW5jdGlvbnMvbG9hZGluZy1vdmVybGF5L2xvYWRpbmctb3ZlcmxheS5jb21wb25lbnQudHMiLCJuZzovL25nNi1maWxlLW1hbi9maWxlLW1hbmFnZXIvcGlwZXMvZmlsZS1zaXplLnBpcGUudHMiLCJuZzovL25nNi1maWxlLW1hbi9maWxlLW1hbmFnZXIvY29tcG9uZW50cy9mdW5jdGlvbnMvdXBsb2FkL3VwbG9hZC5jb21wb25lbnQudHMiLCJuZzovL25nNi1maWxlLW1hbi9maWxlLW1hbmFnZXIvY29tcG9uZW50cy9mdW5jdGlvbnMvdXBsb2FkL25ldy1mb2xkZXIvbmV3LWZvbGRlci5jb21wb25lbnQudHMiLCJuZzovL25nNi1maWxlLW1hbi9maWxlLW1hbmFnZXIvY29tcG9uZW50cy9zaWRlLXZpZXcvc2lkZS12aWV3LmNvbXBvbmVudC50cyIsIm5nOi8vbmc2LWZpbGUtbWFuL2ZpbGUtbWFuYWdlci9jb21wb25lbnRzL25hdmlnYXRpb24vbmF2aWdhdGlvbi5jb21wb25lbnQudHMiLCJuZzovL25nNi1maWxlLW1hbi9maWxlLW1hbmFnZXIvZmlsZS1tYW5hZ2VyLm1vZHVsZS50cyIsIm5nOi8vbmc2LWZpbGUtbWFuL2ZpbGUtbWFuYWdlci9tb2RlbHMvdHJlZS5tb2RlbC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0FjdGlvbkludGVyZmFjZX0gZnJvbSAnLi4vaW50ZXJmYWNlcy9hY3Rpb24uaW50ZXJmYWNlJztcclxuaW1wb3J0IHtOb2RlSW50ZXJmYWNlfSBmcm9tICcuLi9pbnRlcmZhY2VzL25vZGUuaW50ZXJmYWNlJztcclxuXHJcbmV4cG9ydCBjb25zdCBTRVRfUEFUSCA9ICdTRVRfUEFUSCc7XHJcbmV4cG9ydCBjb25zdCBTRVRfTE9BRElOR19TVEFURSA9ICdTRVRfTE9BRElOR19TVEFURSc7XHJcbmV4cG9ydCBjb25zdCBTRVRfU0VMRUNURURfTk9ERSA9ICdTRVRfU0VMRUNURURfTk9ERSc7XHJcblxyXG5leHBvcnQgY2xhc3MgU2V0UGF0aCBpbXBsZW1lbnRzIEFjdGlvbkludGVyZmFjZSB7XHJcbiAgcmVhZG9ubHkgdHlwZSA9IFNFVF9QQVRIO1xyXG4gIHBheWxvYWQ6IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFNldExvYWRpbmdTdGF0ZSBpbXBsZW1lbnRzIEFjdGlvbkludGVyZmFjZSB7XHJcbiAgcmVhZG9ubHkgdHlwZSA9IFNFVF9MT0FESU5HX1NUQVRFO1xyXG4gIHBheWxvYWQ6IGJvb2xlYW47XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBTZXRTZWxlY3RlZE5vZGUgaW1wbGVtZW50cyBBY3Rpb25JbnRlcmZhY2Uge1xyXG4gIHJlYWRvbmx5IHR5cGUgPSBTRVRfU0VMRUNURURfTk9ERTtcclxuICBwYXlsb2FkOiBOb2RlSW50ZXJmYWNlO1xyXG59XHJcblxyXG5leHBvcnQgdHlwZSBBY3Rpb25zID0gU2V0UGF0aCB8IFNldExvYWRpbmdTdGF0ZSB8IFNldFNlbGVjdGVkTm9kZTtcclxuIiwiaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtOb2RlSW50ZXJmYWNlfSBmcm9tICcuLi9pbnRlcmZhY2VzL25vZGUuaW50ZXJmYWNlJztcclxuaW1wb3J0IHtPYnNlcnZhYmxlfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtUcmVlTW9kZWx9IGZyb20gJy4uL21vZGVscy90cmVlLm1vZGVsJztcclxuaW1wb3J0IHtIdHRwQ2xpZW50LCBIdHRwUGFyYW1zfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCAqIGFzIEFDVElPTlMgZnJvbSAnLi4vcmVkdWNlcnMvYWN0aW9ucy5hY3Rpb24nO1xyXG5pbXBvcnQge1N0b3JlfSBmcm9tICdAbmdyeC9zdG9yZSc7XHJcbmltcG9ydCB7QXBwU3RvcmV9IGZyb20gJy4uL3JlZHVjZXJzL3JlZHVjZXIuZmFjdG9yeSc7XHJcblxyXG5ASW5qZWN0YWJsZSh7XHJcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBOb2RlU2VydmljZSB7XHJcbiAgcHVibGljIHRyZWU6IFRyZWVNb2RlbDtcclxuICBwcml2YXRlIF9wYXRoOiBzdHJpbmc7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgaHR0cDogSHR0cENsaWVudCwgcHJpdmF0ZSBzdG9yZTogU3RvcmU8QXBwU3RvcmU+KSB7XHJcbiAgfVxyXG5cclxuICAvLyB0b2RvIGFzayBzZXJ2ZXIgdG8gZ2V0IHBhcmVudCBzdHJ1Y3R1cmVcclxuICBwdWJsaWMgc3RhcnRNYW5hZ2VyQXQocGF0aDogc3RyaW5nKSB7XHJcbiAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKHt0eXBlOiBBQ1RJT05TLlNFVF9QQVRILCBwYXlsb2FkOiBwYXRofSk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgcmVmcmVzaEN1cnJlbnRQYXRoKCkge1xyXG4gICAgdGhpcy5maW5kTm9kZUJ5UGF0aCh0aGlzLmN1cnJlbnRQYXRoKS5jaGlsZHJlbiA9IHt9O1xyXG4gICAgdGhpcy5nZXROb2Rlcyh0aGlzLmN1cnJlbnRQYXRoKTtcclxuICB9XHJcblxyXG4gIGdldE5vZGVzKHBhdGg6IHN0cmluZykge1xyXG4gICAgdGhpcy5wYXJzZU5vZGVzKHBhdGgpLnN1YnNjcmliZSgoZGF0YTogQXJyYXk8Tm9kZUludGVyZmFjZT4pID0+IHtcclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgY29uc3QgcGFyZW50UGF0aCA9IHRoaXMuZ2V0UGFyZW50UGF0aChkYXRhW2ldLnBhdGhUb05vZGUpO1xyXG4gICAgICAgIHRoaXMuZmluZE5vZGVCeVBhdGgocGFyZW50UGF0aCkuY2hpbGRyZW5bZGF0YVtpXS5uYW1lXSA9IGRhdGFbaV07XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBnZXRQYXJlbnRQYXRoKHBhdGg6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICBsZXQgcGFyZW50UGF0aCA9IHBhdGguc3BsaXQoJy8nKTtcclxuICAgIHBhcmVudFBhdGggPSBwYXJlbnRQYXRoLnNsaWNlKDAsIHBhcmVudFBhdGgubGVuZ3RoIC0gMSk7XHJcbiAgICByZXR1cm4gcGFyZW50UGF0aC5qb2luKCcvJyk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHBhcnNlTm9kZXMocGF0aDogc3RyaW5nKTogT2JzZXJ2YWJsZTxOb2RlSW50ZXJmYWNlW10+IHtcclxuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZShvYnNlcnZlciA9PiB7XHJcbiAgICAgIHRoaXMuZ2V0Tm9kZXNGcm9tU2VydmVyKHBhdGgpLnN1YnNjcmliZSgoZGF0YTogQXJyYXk8YW55PikgPT4ge1xyXG4gICAgICAgIG9ic2VydmVyLm5leHQoZGF0YS5tYXAobm9kZSA9PiB0aGlzLmNyZWF0ZU5vZGUocGF0aCwgbm9kZSkpKTtcclxuICAgICAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKHt0eXBlOiBBQ1RJT05TLlNFVF9MT0FESU5HX1NUQVRFLCBwYXlsb2FkOiBmYWxzZX0pO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjcmVhdGVOb2RlKHBhdGgsIG5vZGUpOiBOb2RlSW50ZXJmYWNlIHtcclxuICAgIGlmIChub2RlLnBhdGhbMF0gIT09ICcvJykge1xyXG4gICAgICBjb25zb2xlLndhcm4oJ1tOb2RlIFNlcnZpY2VdIFNlcnZlciBzaG91bGQgcmV0dXJuIGluaXRpYWwgcGF0aCB3aXRoIFwiL1wiJyk7XHJcbiAgICAgIG5vZGUucGF0aCA9ICcvJyArIG5vZGUucGF0aDtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBpZHMgPSBub2RlLnBhdGguc3BsaXQoJy8nKTtcclxuICAgIGlmIChpZHMubGVuZ3RoID4gMiAmJiBpZHNbaWRzLmxlbmd0aCAtIDFdID09PSAnJykge1xyXG4gICAgICBpZHMuc3BsaWNlKC0xLCAxKTtcclxuICAgICAgbm9kZS5wYXRoID0gaWRzLmpvaW4oJy8nKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBjYWNoZWROb2RlID0gdGhpcy5maW5kTm9kZUJ5UGF0aChub2RlLnBhdGgpO1xyXG5cclxuICAgIHJldHVybiA8Tm9kZUludGVyZmFjZT57XHJcbiAgICAgIGlkOiBub2RlLmlkLFxyXG4gICAgICBpc0ZvbGRlcjogbm9kZS5kaXIsXHJcbiAgICAgIGlzRXhwYW5kZWQ6IGNhY2hlZE5vZGUgPyBjYWNoZWROb2RlLmlzRXhwYW5kZWQgOiBmYWxzZSxcclxuICAgICAgcGF0aFRvTm9kZTogbm9kZS5wYXRoLFxyXG4gICAgICBwYXRoVG9QYXJlbnQ6IHRoaXMuZ2V0UGFyZW50UGF0aChub2RlLnBhdGgpLFxyXG4gICAgICBuYW1lOiBub2RlLm5hbWUgfHwgbm9kZS5pZCxcclxuICAgICAgY2hpbGRyZW46IGNhY2hlZE5vZGUgPyBjYWNoZWROb2RlLmNoaWxkcmVuIDoge31cclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdldE5vZGVzRnJvbVNlcnZlciA9IChwYXRoOiBzdHJpbmcpID0+IHtcclxuICAgIGxldCBmb2xkZXJJZDogYW55ID0gdGhpcy5maW5kTm9kZUJ5UGF0aChwYXRoKS5pZDtcclxuICAgIGZvbGRlcklkID0gZm9sZGVySWQgPT09IDAgPyAnJyA6IGZvbGRlcklkO1xyXG5cclxuICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KFxyXG4gICAgICB0aGlzLnRyZWUuY29uZmlnLmJhc2VVUkwgKyB0aGlzLnRyZWUuY29uZmlnLmFwaS5saXN0RmlsZSxcclxuICAgICAge3BhcmFtczogbmV3IEh0dHBQYXJhbXMoKS5zZXQoJ3BhcmVudFBhdGgnLCBmb2xkZXJJZCl9XHJcbiAgICApO1xyXG4gIH07XHJcblxyXG4gIHB1YmxpYyBmaW5kTm9kZUJ5UGF0aChub2RlUGF0aDogc3RyaW5nKTogTm9kZUludGVyZmFjZSB7XHJcbiAgICBjb25zdCBpZHMgPSBub2RlUGF0aC5zcGxpdCgnLycpO1xyXG4gICAgaWRzLnNwbGljZSgwLCAxKTtcclxuXHJcbiAgICByZXR1cm4gaWRzLmxlbmd0aCA9PT0gMCA/IHRoaXMudHJlZS5ub2RlcyA6IGlkcy5yZWR1Y2UoKHZhbHVlLCBpbmRleCkgPT4gdmFsdWVbJ2NoaWxkcmVuJ11baW5kZXhdLCB0aGlzLnRyZWUubm9kZXMpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGZpbmROb2RlQnlJZChpZDogbnVtYmVyKTogTm9kZUludGVyZmFjZSB7XHJcbiAgICBjb25zdCByZXN1bHQgPSB0aGlzLmZpbmROb2RlQnlJZEhlbHBlcihpZCk7XHJcblxyXG4gICAgaWYgKHJlc3VsdCA9PT0gbnVsbCkge1xyXG4gICAgICBjb25zb2xlLndhcm4oJ1tOb2RlIFNlcnZpY2VdIENhbm5vdCBmaW5kIG5vZGUgYnkgaWQuIElkIG5vdCBleGlzdGluZyBvciBub3QgZmV0Y2hlZC4gUmV0dXJuaW5nIHJvb3QuJyk7XHJcbiAgICAgIHJldHVybiB0aGlzLnRyZWUubm9kZXM7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBmaW5kTm9kZUJ5SWRIZWxwZXIoaWQ6IG51bWJlciwgbm9kZTogTm9kZUludGVyZmFjZSA9IHRoaXMudHJlZS5ub2Rlcyk6IE5vZGVJbnRlcmZhY2Uge1xyXG4gICAgaWYgKG5vZGUuaWQgPT09IGlkKVxyXG4gICAgICByZXR1cm4gbm9kZTtcclxuXHJcbiAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMobm9kZS5jaGlsZHJlbik7XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGlmICh0eXBlb2Ygbm9kZS5jaGlsZHJlbltrZXlzW2ldXSA9PSAnb2JqZWN0Jykge1xyXG4gICAgICAgIGNvbnN0IG9iaiA9IHRoaXMuZmluZE5vZGVCeUlkSGVscGVyKGlkLCBub2RlLmNoaWxkcmVuW2tleXNbaV1dKTtcclxuICAgICAgICBpZiAob2JqICE9IG51bGwpXHJcbiAgICAgICAgICByZXR1cm4gb2JqO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZm9sZFJlY3Vyc2l2ZWx5KG5vZGU6IE5vZGVJbnRlcmZhY2UpIHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdmb2xkaW5nICcsIG5vZGUpO1xyXG4gICAgY29uc3QgY2hpbGRyZW4gPSBub2RlLmNoaWxkcmVuO1xyXG5cclxuICAgIE9iamVjdC5rZXlzKGNoaWxkcmVuKS5tYXAoKGNoaWxkOiBzdHJpbmcpID0+IHtcclxuICAgICAgaWYgKCFjaGlsZHJlbi5oYXNPd25Qcm9wZXJ0eShjaGlsZCkgfHwgIWNoaWxkcmVuW2NoaWxkXS5pc0V4cGFuZGVkKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuZm9sZFJlY3Vyc2l2ZWx5KGNoaWxkcmVuW2NoaWxkXSk7XHJcbiAgICAgIC8vdG9kbyBwdXQgdGhpcyBnZXRFbEJ5SWQgaW50byBvbmUgZnVuYyAoY3VyciBpbnNpZGUgbm9kZS5jb21wb25lbnQudHMgKyBmbS5jb21wb25lbnQudHMpIC0gdGhpcyB3b24ndCBiZSBtYWludGFpbmFibGVcclxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RyZWVfJyArIGNoaWxkcmVuW2NoaWxkXS5wYXRoVG9Ob2RlKS5jbGFzc0xpc3QuYWRkKCdkZXNlbGVjdGVkJyk7XHJcbiAgICAgIGNoaWxkcmVuW2NoaWxkXS5pc0V4cGFuZGVkID0gZmFsc2U7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBmb2xkQWxsKCkge1xyXG4gICAgdGhpcy5mb2xkUmVjdXJzaXZlbHkodGhpcy50cmVlLm5vZGVzKTtcclxuICB9XHJcblxyXG4gIGdldCBjdXJyZW50UGF0aCgpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRoaXMuX3BhdGg7XHJcbiAgfVxyXG5cclxuICBzZXQgY3VycmVudFBhdGgodmFsdWU6IHN0cmluZykge1xyXG4gICAgdGhpcy5fcGF0aCA9IHZhbHVlO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge05vZGVJbnRlcmZhY2V9IGZyb20gJy4uL2ludGVyZmFjZXMvbm9kZS5pbnRlcmZhY2UnO1xyXG5pbXBvcnQge05vZGVTZXJ2aWNlfSBmcm9tICcuL25vZGUuc2VydmljZSc7XHJcbmltcG9ydCB7VHJlZU1vZGVsfSBmcm9tICcuLi9tb2RlbHMvdHJlZS5tb2RlbCc7XHJcbmltcG9ydCB7SHR0cENsaWVudH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQge09ic2VydmFibGV9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge05neFNtYXJ0TW9kYWxTZXJ2aWNlfSBmcm9tICduZ3gtc21hcnQtbW9kYWwnO1xyXG5pbXBvcnQge0FwcFN0b3JlfSBmcm9tICcuLi9yZWR1Y2Vycy9yZWR1Y2VyLmZhY3RvcnknO1xyXG5pbXBvcnQge1N0b3JlfSBmcm9tICdAbmdyeC9zdG9yZSc7XHJcblxyXG5ASW5qZWN0YWJsZSh7XHJcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBOb2RlQ2xpY2tlZFNlcnZpY2Uge1xyXG4gIHB1YmxpYyB0cmVlOiBUcmVlTW9kZWw7XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcHVibGljIG5neFNtYXJ0TW9kYWxTZXJ2aWNlOiBOZ3hTbWFydE1vZGFsU2VydmljZSxcclxuICAgIHByaXZhdGUgbm9kZVNlcnZpY2U6IE5vZGVTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSBzdG9yZTogU3RvcmU8QXBwU3RvcmU+LFxyXG4gICAgcHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50XHJcbiAgKSB7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc3RhcnREb3dubG9hZChub2RlOiBOb2RlSW50ZXJmYWNlKTogdm9pZCB7XHJcbiAgICBjb25zdCBwYXJhbWV0ZXJzID0gdGhpcy5wYXJzZVBhcmFtcyh7cGF0aDogbm9kZS5pZH0pO1xyXG4gICAgdGhpcy5yZWFjaFNlcnZlcignZG93bmxvYWQnLCB0aGlzLnRyZWUuY29uZmlnLmFwaS5kb3dubG9hZEZpbGUgKyBwYXJhbWV0ZXJzKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBpbml0RGVsZXRlKG5vZGU6IE5vZGVJbnRlcmZhY2UpOiB2b2lkIHtcclxuICAgIHRoaXMuc2lkZUVmZmVjdEhlbHBlcihcclxuICAgICAgJ0RlbGV0ZScsXHJcbiAgICAgIHtwYXRoOiBub2RlLmlkfSxcclxuICAgICAgJ2RlbGV0ZScsXHJcbiAgICAgIHRoaXMudHJlZS5jb25maWcuYXBpLmRlbGV0ZUZpbGUsXHJcbiAgICAgICgpID0+IHRoaXMuc3VjY2Vzc1dpdGhNb2RhbENsb3NlKClcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc2VhcmNoRm9yU3RyaW5nKGlucHV0OiBzdHJpbmcpOiB2b2lkIHtcclxuICAgIHRoaXMuc2lkZUVmZmVjdEhlbHBlcihcclxuICAgICAgJ1NlYXJjaCcsXHJcbiAgICAgIHtxdWVyeTogaW5wdXR9LFxyXG4gICAgICAnZ2V0JyxcclxuICAgICAgdGhpcy50cmVlLmNvbmZpZy5hcGkuc2VhcmNoRmlsZXMsXHJcbiAgICAgIChyZXMpID0+IHRoaXMuc2VhcmNoU3VjY2VzcyhpbnB1dCwgcmVzKVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBjcmVhdGVGb2xkZXIoY3VycmVudFBhcmVudDogbnVtYmVyLCBuZXdEaXJOYW1lOiBzdHJpbmcpIHtcclxuICAgIHRoaXMuc2lkZUVmZmVjdEhlbHBlcihcclxuICAgICAgJ0NyZWF0ZSBGb2xkZXInLFxyXG4gICAgICB7ZGlyTmFtZTogbmV3RGlyTmFtZSwgcGFyZW50UGF0aDogY3VycmVudFBhcmVudCA9PT0gMCA/IG51bGwgOiBjdXJyZW50UGFyZW50fSxcclxuICAgICAgJ3Bvc3QnLFxyXG4gICAgICB0aGlzLnRyZWUuY29uZmlnLmFwaS5jcmVhdGVGb2xkZXJcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgcmVuYW1lKGlkOiBudW1iZXIsIG5ld05hbWU6IHN0cmluZykge1xyXG4gICAgdGhpcy5zaWRlRWZmZWN0SGVscGVyKFxyXG4gICAgICAnUmVuYW1lJyxcclxuICAgICAge3BhdGg6IGlkLCBuZXdOYW1lOiBuZXdOYW1lfSxcclxuICAgICAgJ3Bvc3QnLFxyXG4gICAgICB0aGlzLnRyZWUuY29uZmlnLmFwaS5yZW5hbWVGaWxlLFxyXG4gICAgICAoKSA9PiB0aGlzLnN1Y2Nlc3NXaXRoTW9kYWxDbG9zZSgpXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBzaWRlRWZmZWN0SGVscGVyKG5hbWU6IHN0cmluZywgcGFyYW1ldGVyczoge30sIGh0dHBNZXRob2Q6IHN0cmluZywgYXBpVVJMOiBzdHJpbmcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3NNZXRob2QgPSAoYSkgPT4gdGhpcy5hY3Rpb25TdWNjZXNzKGEpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBmYWlsTWV0aG9kID0gKGEsIGIpID0+IHRoaXMuYWN0aW9uRmFpbGVkKGEsIGIpXHJcbiAgKSB7XHJcbiAgICBjb25zdCBwYXJhbXMgPSB0aGlzLnBhcnNlUGFyYW1zKHBhcmFtZXRlcnMpO1xyXG5cclxuICAgIHRoaXMubmd4U21hcnRNb2RhbFNlcnZpY2UuZ2V0TW9kYWwoJ3dhaXRNb2RhbCcpLm9wZW4oKTtcclxuXHJcbiAgICB0aGlzLnJlYWNoU2VydmVyKGh0dHBNZXRob2QsIGFwaVVSTCArIHBhcmFtcylcclxuICAgICAgLnN1YnNjcmliZShcclxuICAgICAgICAoYSkgPT4gc3VjY2Vzc01ldGhvZChhKSxcclxuICAgICAgICAoZXJyKSA9PiBmYWlsTWV0aG9kKG5hbWUsIGVycilcclxuICAgICAgKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgcmVhY2hTZXJ2ZXIobWV0aG9kOiBzdHJpbmcsIGFwaVVybDogc3RyaW5nLCBkYXRhOiBhbnkgPSB7fSk6IE9ic2VydmFibGU8T2JqZWN0PiB7XHJcbiAgICBzd2l0Y2ggKG1ldGhvZC50b0xvd2VyQ2FzZSgpKSB7XHJcbiAgICAgIGNhc2UgJ2dldCc6XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQodGhpcy50cmVlLmNvbmZpZy5iYXNlVVJMICsgYXBpVXJsKTtcclxuICAgICAgY2FzZSAncG9zdCc6XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KHRoaXMudHJlZS5jb25maWcuYmFzZVVSTCArIGFwaVVybCwgZGF0YSk7XHJcbiAgICAgIGNhc2UgJ2RlbGV0ZSc6XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUodGhpcy50cmVlLmNvbmZpZy5iYXNlVVJMICsgYXBpVXJsKTtcclxuICAgICAgY2FzZSAnZG93bmxvYWQnOlxyXG4gICAgICAgIHdpbmRvdy5vcGVuKHRoaXMudHJlZS5jb25maWcuYmFzZVVSTCArIGFwaVVybCwgJ19ibGFuaycpO1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIGNvbnNvbGUud2FybignW05vZGVDbGlja2VkU2VydmljZV0gSW5jb3JyZWN0IHBhcmFtcyBmb3IgdGhpcyBzaWRlLWVmZmVjdCcpO1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBwYXJzZVBhcmFtcyhwYXJhbXM6IHt9KTogc3RyaW5nIHtcclxuICAgIGxldCBxdWVyeSA9ICc/JztcclxuXHJcbiAgICBPYmplY3Qua2V5cyhwYXJhbXMpLmZpbHRlcihpdGVtID0+IHBhcmFtc1tpdGVtXSAhPT0gbnVsbCkubWFwKGtleSA9PiB7XHJcbiAgICAgIHF1ZXJ5ICs9IGtleSArICc9JyArIHBhcmFtc1trZXldICsgJyYnO1xyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHF1ZXJ5LnNsaWNlKDAsIC0xKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgc3VjY2Vzc1dpdGhNb2RhbENsb3NlKCkge1xyXG4gICAgdGhpcy5hY3Rpb25TdWNjZXNzKCk7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2lkZS12aWV3JykuY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0ZWQnKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgc2VhcmNoU3VjY2VzcyhpbnB1dDogc3RyaW5nLCBkYXRhOiBhbnkpIHtcclxuICAgIGNvbnN0IG9iaiA9IHtcclxuICAgICAgc2VhcmNoU3RyaW5nOiBpbnB1dCxcclxuICAgICAgcmVzcG9uc2U6IGRhdGFcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5hY3Rpb25TdWNjZXNzKCk7XHJcblxyXG4gICAgdGhpcy5uZ3hTbWFydE1vZGFsU2VydmljZS5zZXRNb2RhbERhdGEob2JqLCAnc2VhcmNoTW9kYWwnLCB0cnVlKTtcclxuICAgIHRoaXMubmd4U21hcnRNb2RhbFNlcnZpY2UuZ2V0TW9kYWwoJ3NlYXJjaE1vZGFsJykub3BlbigpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhY3Rpb25TdWNjZXNzKHJlc3BvbnNlOiBzdHJpbmcgPSAnJykge1xyXG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCdkaWFsb2ctb3BlbicpO1xyXG5cclxuICAgIHRoaXMubm9kZVNlcnZpY2UucmVmcmVzaEN1cnJlbnRQYXRoKCk7XHJcbiAgICB0aGlzLm5neFNtYXJ0TW9kYWxTZXJ2aWNlLmdldE1vZGFsKCd3YWl0TW9kYWwnKS5jbG9zZSgpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhY3Rpb25GYWlsZWQobmFtZTogc3RyaW5nLCBlcnJvcjogYW55KSB7XHJcbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ2RpYWxvZy1vcGVuJyk7XHJcblxyXG4gICAgdGhpcy5uZ3hTbWFydE1vZGFsU2VydmljZS5nZXRNb2RhbCgnd2FpdE1vZGFsJykuY2xvc2UoKTtcclxuICAgIHRoaXMubmd4U21hcnRNb2RhbFNlcnZpY2UuZ2V0TW9kYWwoJ2Vycm9yTW9kYWwnKS5vcGVuKCk7XHJcbiAgICBjb25zb2xlLndhcm4oJ1tOb2RlQ2xpY2tlZFNlcnZpY2VdIEFjdGlvbiBcIicgKyBuYW1lICsgJ1wiIGZhaWxlZCcsIGVycm9yKTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHtDb21wb25lbnQsIEV2ZW50RW1pdHRlciwgSW5wdXQsIE9uSW5pdCwgT3V0cHV0LCBUZW1wbGF0ZVJlZiwgVmlld0VuY2Fwc3VsYXRpb259IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge3NlbGVjdCwgU3RvcmV9IGZyb20gJ0BuZ3J4L3N0b3JlJztcclxuaW1wb3J0IHtUcmVlTW9kZWx9IGZyb20gJy4vbW9kZWxzL3RyZWUubW9kZWwnO1xyXG5pbXBvcnQge05vZGVTZXJ2aWNlfSBmcm9tICcuL3NlcnZpY2VzL25vZGUuc2VydmljZSc7XHJcbmltcG9ydCB7Tm9kZUludGVyZmFjZX0gZnJvbSAnLi9pbnRlcmZhY2VzL25vZGUuaW50ZXJmYWNlJztcclxuaW1wb3J0IHtTRVRfTE9BRElOR19TVEFURX0gZnJvbSAnLi9yZWR1Y2Vycy9hY3Rpb25zLmFjdGlvbic7XHJcbmltcG9ydCAqIGFzIEFDVElPTlMgZnJvbSAnLi9yZWR1Y2Vycy9hY3Rpb25zLmFjdGlvbic7XHJcbmltcG9ydCB7QXBwU3RvcmV9IGZyb20gJy4vcmVkdWNlcnMvcmVkdWNlci5mYWN0b3J5JztcclxuaW1wb3J0IHtOZ3hTbWFydE1vZGFsU2VydmljZX0gZnJvbSAnbmd4LXNtYXJ0LW1vZGFsJztcclxuaW1wb3J0IHtOb2RlQ2xpY2tlZFNlcnZpY2V9IGZyb20gJy4vc2VydmljZXMvbm9kZS1jbGlja2VkLnNlcnZpY2UnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdmbS1maWxlLW1hbmFnZXInLFxyXG4gIHRlbXBsYXRlOiBgPG5nLWNvbnRhaW5lciAqbmdJZj1cImlzUG9wdXA7IHRoZW4gaXRJc1BvcHVwIGVsc2Ugc2hvd0NvbnRlbnRcIj48L25nLWNvbnRhaW5lcj5cclxuXHJcbjxuZy10ZW1wbGF0ZSAjaXRJc1BvcHVwPlxyXG4gIDxkaXYgKm5nSWY9XCIhZm1PcGVuXCI+XHJcbiAgICA8YnV0dG9uIGNsYXNzPVwiYnV0dG9uIGJpZ1wiIChjbGljayk9XCJmbVNob3dIaWRlKClcIiB0cmFuc2xhdGU9XCJcIj5PcGVuIGZpbGUgbWFuYWdlcjwvYnV0dG9uPlxyXG4gIDwvZGl2PlxyXG4gIDxkaXYgY2xhc3M9XCJmaWxlLW1hbmFnZXItYmFja2Ryb3BcIiAqbmdJZj1cImZtT3BlblwiPlxyXG4gICAgPGRpdiBjbGFzcz1cImZtTW9kYWxJbnNpZGVcIj5cclxuICAgICAgPGRpdiAqbmdJZj1cImZtT3BlbjsgdGhlbiBzaG93Q29udGVudFwiPjwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgPC9kaXY+XHJcbjwvbmctdGVtcGxhdGU+XHJcblxyXG48bmctdGVtcGxhdGUgI3Nob3dDb250ZW50PlxyXG4gIDxkaXYgY2xhc3M9XCJjb250ZW50XCI+XHJcbiAgICA8ZGl2IGNsYXNzPVwiZmlsZS1tYW5hZ2VyLW5hdmJhclwiPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwicGF0aFwiPlxyXG4gICAgICAgIDxhcHAtbmF2LWJhcj48L2FwcC1uYXYtYmFyPlxyXG4gICAgICA8L2Rpdj5cclxuXHJcbiAgICAgIDxkaXYgY2xhc3M9XCJuYXZpZ2F0aW9uXCI+XHJcbiAgICAgICAgPGFwcC1uYXZpZ2F0aW9uPlxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cImJ1dHRvbiBjbG9zZVwiIChjbGljayk9XCJmbVNob3dIaWRlKClcIiAqbmdJZj1cImlzUG9wdXBcIj5cclxuICAgICAgICAgICAgPGkgY2xhc3M9XCJmYXMgZmEtMnggZmEtdGltZXNcIj48L2k+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2FwcC1uYXZpZ2F0aW9uPlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG5cclxuICAgIDxkaXYgY2xhc3M9XCJob2xkZXJcIj5cclxuICAgICAgPGRpdiBjbGFzcz1cImZpbGUtbWFuYWdlci1sZWZ0XCI+XHJcbiAgICAgICAgPGFwcC10cmVlIFt0cmVlTW9kZWxdPVwidHJlZVwiPlxyXG4gICAgICAgICAgPG5nLXRlbXBsYXRlIGxldC1ub2Rlcz5cclxuICAgICAgICAgICAgPG5nLWNvbnRhaW5lciBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwieyRpbXBsaWNpdDogbm9kZXN9XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBbbmdUZW1wbGF0ZU91dGxldF09XCJpY29uVGVtcGxhdGUgPyBpY29uVGVtcGxhdGUgOiBkZWZhdWx0SWNvblRlbXBsYXRlXCI+XHJcbiAgICAgICAgICAgIDwvbmctY29udGFpbmVyPlxyXG4gICAgICAgICAgPC9uZy10ZW1wbGF0ZT5cclxuICAgICAgICA8L2FwcC10cmVlPlxyXG4gICAgICA8L2Rpdj5cclxuXHJcbiAgICAgIDxkaXYgY2xhc3M9XCJyaWdodFwiPlxyXG4gICAgICAgIDxhcHAtZm9sZGVyLWNvbnRlbnRcclxuICAgICAgICAgIFt0cmVlTW9kZWxdPVwidHJlZVwiXHJcbiAgICAgICAgICAob3BlblVwbG9hZERpYWxvZyk9XCJoYW5kbGVVcGxvYWREaWFsb2coJGV2ZW50KVwiXHJcbiAgICAgICAgICBbZm9sZGVyQ29udGVudFRlbXBsYXRlXT1cImZvbGRlckNvbnRlbnRUZW1wbGF0ZSA/IGZvbGRlckNvbnRlbnRUZW1wbGF0ZSA6IGRlZmF1bHRGb2xkZXJDb250ZW50VGVtcGxhdGVcIlxyXG4gICAgICAgICAgW2ZvbGRlckNvbnRlbnROZXdUZW1wbGF0ZV09XCJmb2xkZXJDb250ZW50TmV3VGVtcGxhdGUgPyBmb2xkZXJDb250ZW50TmV3VGVtcGxhdGUgOiBkZWZhdWx0Rm9sZGVyQ29udGVudE5ld1RlbXBsYXRlXCJcclxuICAgICAgICAgIFtmb2xkZXJDb250ZW50QmFja1RlbXBsYXRlXT1cImZvbGRlckNvbnRlbnRCYWNrVGVtcGxhdGUgPyBmb2xkZXJDb250ZW50QmFja1RlbXBsYXRlIDogZGVmYXVsdEZvbGRlckNvbnRlbnRCYWNrVGVtcGxhdGVcIj5cclxuICAgICAgICA8L2FwcC1mb2xkZXItY29udGVudD5cclxuICAgICAgPC9kaXY+XHJcblxyXG4gICAgICA8YXBwLXNpZGUtdmlldyBpZD1cInNpZGUtdmlld1wiXHJcbiAgICAgICAgICAgICAgICAgICAgIFtub2RlXT1cInNlbGVjdGVkTm9kZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgIFtzaWRlVmlld1RlbXBsYXRlXT1cInNpZGVWaWV3VGVtcGxhdGUgPyBzaWRlVmlld1RlbXBsYXRlIDogZGVmYXVsdFNpZGVWaWV3VGVtcGxhdGVcIlxyXG4gICAgICAgICAgICAgICAgICAgICBbYWxsb3dGb2xkZXJEb3dubG9hZF09XCJ0cmVlLmNvbmZpZy5vcHRpb25zLmFsbG93Rm9sZGVyRG93bmxvYWRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAoY2xpY2tFdmVudCk9XCJoYW5kbGVGaWxlTWFuYWdlckNsaWNrRXZlbnQoJGV2ZW50KVwiPlxyXG4gICAgICA8L2FwcC1zaWRlLXZpZXc+XHJcbiAgICA8L2Rpdj5cclxuICA8L2Rpdj5cclxuXHJcbiAgPGFwcC11cGxvYWQgKm5nSWY9XCJuZXdEaWFsb2dcIlxyXG4gICAgICAgICAgICAgIFtvcGVuRGlhbG9nXT1cIm5ld0RpYWxvZ1wiXHJcbiAgICAgICAgICAgICAgKGNsb3NlRGlhbG9nKT1cImhhbmRsZVVwbG9hZERpYWxvZyhmYWxzZSlcIlxyXG4gICAgICAgICAgICAgIChjcmVhdGVEaXIpPVwiaGFuZGxlRmlsZU1hbmFnZXJDbGlja0V2ZW50KHt0eXBlOiAnY3JlYXRlRm9sZGVyJywgcGF5bG9hZDogJGV2ZW50fSlcIj5cclxuICA8L2FwcC11cGxvYWQ+XHJcblxyXG4gIDxhcHAtbG9hZGluZy1vdmVybGF5XHJcbiAgICAqbmdJZj1cImxvYWRpbmdcIlxyXG4gICAgW2xvYWRpbmdPdmVybGF5VGVtcGxhdGVdPVwibG9hZGluZ092ZXJsYXlUZW1wbGF0ZSA/IGxvYWRpbmdPdmVybGF5VGVtcGxhdGUgOiBkZWZhdWx0TG9hZGluZ092ZXJsYXlUZW1wbGF0ZVwiPlxyXG4gIDwvYXBwLWxvYWRpbmctb3ZlcmxheT5cclxuPC9uZy10ZW1wbGF0ZT5cclxuXHJcbjxuZy10ZW1wbGF0ZSBsZXQtbm9kZSAjZGVmYXVsdEljb25UZW1wbGF0ZT5cclxuICA8ZGl2IGNsYXNzPVwiZmlsZS1tYW5hZ2VyLW5vZGVcIiBzdHlsZT1cImRpc3BsYXk6IGlubGluZS1ibG9jazsgcGFkZGluZzogM3B4XCI+XHJcbiAgICA8ZGl2ICpuZ0lmPVwibm9kZS5pc0ZvbGRlcjsgdGhlbiBpdElzRm9sZGVyIGVsc2Ugc2hvd0ZpbGVcIj48L2Rpdj5cclxuXHJcbiAgICA8bmctdGVtcGxhdGUgI2l0SXNGb2xkZXI+XHJcbiAgICAgIDxkaXYgKm5nSWY9XCJub2RlLmlzRXhwYW5kZWQ7IHRoZW4gaXNGb2xkZXJFeHBhbmRlZCBlbHNlIGlzRm9sZGVyQ2xvc2VkXCI+PC9kaXY+XHJcbiAgICA8L25nLXRlbXBsYXRlPlxyXG5cclxuICAgIDxuZy10ZW1wbGF0ZSAjc2hvd0ZpbGU+PGkgY2xhc3M9XCJmYXMgZmEtZmlsZSBjaGlsZFwiPjwvaT48L25nLXRlbXBsYXRlPlxyXG4gICAgPG5nLXRlbXBsYXRlICNpc0ZvbGRlckV4cGFuZGVkPjxpIGNsYXNzPVwiZmFzIGZhLWZvbGRlci1vcGVuIGNoaWxkXCI+PC9pPjwvbmctdGVtcGxhdGU+XHJcbiAgICA8bmctdGVtcGxhdGUgI2lzRm9sZGVyQ2xvc2VkPjxpIGNsYXNzPVwiZmFzIGZhLWZvbGRlciBjaGlsZFwiPjwvaT48L25nLXRlbXBsYXRlPlxyXG5cclxuICAgIDxzcGFuPnt7bm9kZS5uYW1lfX08L3NwYW4+XHJcbiAgPC9kaXY+XHJcbjwvbmctdGVtcGxhdGU+XHJcbjxuZy10ZW1wbGF0ZSBsZXQtbm9kZSAjZGVmYXVsdEZvbGRlckNvbnRlbnRUZW1wbGF0ZT5cclxuICA8ZGl2IGNsYXNzPVwiZmlsZS1tYW5hZ2VyLWl0ZW1cIj5cclxuICAgIDxkaXYgY2xhc3M9XCJmaWxlLXByZXZpZXdcIj5cclxuICAgICAgPGRpdiAqbmdJZj1cIm5vZGUuaXNGb2xkZXI7IHRoZW4gaXRJc0ZvbGRlciBlbHNlIHNob3dGaWxlXCI+PC9kaXY+XHJcbiAgICAgIDxuZy10ZW1wbGF0ZSAjaXRJc0ZvbGRlcj48aSBjbGFzcz1cImZhcyBmYS0zeCBmYS1mb2xkZXIgY2hpbGRcIj48L2k+PC9uZy10ZW1wbGF0ZT5cclxuICAgICAgPG5nLXRlbXBsYXRlICNzaG93RmlsZT48aSBjbGFzcz1cImZhcyBmYS0zeCBmYS1maWxlIGNoaWxkXCI+PC9pPjwvbmctdGVtcGxhdGU+XHJcbiAgICA8L2Rpdj5cclxuICAgIDxkaXYgY2xhc3M9XCJmaWxlLW5hbWVcIj5cclxuICAgICAge3tub2RlLm5hbWV9fVxyXG4gICAgPC9kaXY+XHJcbiAgPC9kaXY+XHJcbjwvbmctdGVtcGxhdGU+XHJcbjxuZy10ZW1wbGF0ZSAjZGVmYXVsdEZvbGRlckNvbnRlbnROZXdUZW1wbGF0ZT5cclxuICA8ZGl2IGNsYXNzPVwiZmlsZS1tYW5hZ2VyLWl0ZW1cIj5cclxuICAgIDxkaXYgY2xhc3M9XCJmaWxlLXByZXZpZXdcIiBzdHlsZT1cIndpZHRoOiAxMDAlOyBoZWlnaHQ6MTAwJVwiPlxyXG4gICAgICA8aSBjbGFzcz1cImZhcyBmYS0zeCBmYS1wbHVzIGNoaWxkXCIgc3R5bGU9XCJsaW5lLWhlaWdodDogMlwiPjwvaT5cclxuICAgIDwvZGl2PlxyXG4gIDwvZGl2PlxyXG48L25nLXRlbXBsYXRlPlxyXG48bmctdGVtcGxhdGUgbGV0LW5vZGUgI2RlZmF1bHRGb2xkZXJDb250ZW50QmFja1RlbXBsYXRlPlxyXG4gIDxkaXYgY2xhc3M9XCJmaWxlLW1hbmFnZXItaXRlbVwiPlxyXG4gICAgPGRpdiBjbGFzcz1cImZpbGUtcHJldmlld1wiIHN0eWxlPVwid2lkdGg6IDEwMCU7IGhlaWdodDoxMDAlXCI+XHJcbiAgICAgIDxpIGNsYXNzPVwiZmFzIGZhLTJ4IGZhLWVsbGlwc2lzLWhcIiBzdHlsZT1cImxpbmUtaGVpZ2h0OiA1XCI+PC9pPlxyXG4gICAgPC9kaXY+XHJcbiAgPC9kaXY+XHJcbjwvbmctdGVtcGxhdGU+XHJcbjxuZy10ZW1wbGF0ZSBsZXQtdGltZW91dE1lc3NhZ2UgI2RlZmF1bHRMb2FkaW5nT3ZlcmxheVRlbXBsYXRlPlxyXG4gIDxkaXYgY2xhc3M9XCJmaWxlLW1hbmFnZXItYmFja2Ryb3AgbG9hZGluZ1wiIChjbGljayk9XCJiYWNrZHJvcENsaWNrZWQoKVwiPlxyXG4gICAgPGRpdiBjbGFzcz1cImZpbGUtbWFuYWdlci1lcnJvclwiICpuZ0lmPVwidGltZW91dE1lc3NhZ2VcIj57e3RpbWVvdXRNZXNzYWdlfX08L2Rpdj5cclxuICA8L2Rpdj5cclxuICA8ZGl2IGNsYXNzPVwic3Bpbm5lclwiPlxyXG4gICAgPGkgY2xhc3M9XCJmYXMgZmEtNXggZmEtc3BpbiBmYS1zeW5jLWFsdFwiPjwvaT5cclxuICA8L2Rpdj5cclxuPC9uZy10ZW1wbGF0ZT5cclxuPG5nLXRlbXBsYXRlIGxldC1ub2RlICNkZWZhdWx0U2lkZVZpZXdUZW1wbGF0ZT5cclxuICA8ZGl2IHN0eWxlPVwicG9zaXRpb246IGFic29sdXRlOyBib3R0b206IDA7IHdpZHRoOiAxMDAlOyBtYXJnaW46IDVweCBhdXRvXCI+XHJcbiAgICA8c3BhbiAqbmdJZj1cIm5vZGUuaXNGb2xkZXJcIiB0cmFuc2xhdGU+Tm8gZGF0YSBhdmFpbGFibGUgZm9yIHRoaXMgZm9sZGVyPC9zcGFuPlxyXG4gICAgPHNwYW4gKm5nSWY9XCIhbm9kZS5pc0ZvbGRlclwiIHRyYW5zbGF0ZT5ObyBkYXRhIGF2YWlsYWJsZSBmb3IgdGhpcyBmaWxlPC9zcGFuPlxyXG4gIDwvZGl2PlxyXG48L25nLXRlbXBsYXRlPlxyXG5cclxuPG5neC1zbWFydC1tb2RhbCBpZGVudGlmaWVyPVwicmVuYW1lTW9kYWxcIiBbZGlzbWlzc2FibGVdPVwiZmFsc2VcIiBbY2xvc2FibGVdPVwiZmFsc2VcIiAqbmdJZj1cInNlbGVjdGVkTm9kZVwiICNyZW5hbWVNb2RhbD5cclxuICA8aDIgY2xhc3M9XCJtb2RhbC10aXRsZVwiIHRyYW5zbGF0ZT5cclxuICAgIFJlbmFtZSBmaWxlXHJcbiAgPC9oMj5cclxuICA8cCBjbGFzcz1cInJlbmFtZS1uYW1lXCIgdHJhbnNsYXRlPlxyXG4gICAgT2xkIG5hbWVcclxuICA8L3A+XHJcbiAgPHNwYW4gc3R5bGU9XCJtYXJnaW46IDhweFwiPnt7c2VsZWN0ZWROb2RlLm5hbWV9fTwvc3Bhbj5cclxuICA8cCBjbGFzcz1cInJlbmFtZS1uYW1lXCIgdHJhbnNsYXRlPlxyXG4gICAgTmV3IG5hbWVcclxuICA8L3A+XHJcbiAgPGlucHV0IHBsYWNlaG9sZGVyPVwiTmV3IG5hbWVcIiB0eXBlPVwidGV4dFwiIGNsYXNzPVwicmVuYW1lLWlucHV0XCIgW3ZhbHVlXT1cInNlbGVjdGVkTm9kZS5uYW1lXCIgI3JlbmFtZUlucHV0XHJcbiAgICAgICAgIChrZXl1cC5lbnRlcik9XCJoYW5kbGVGaWxlTWFuYWdlckNsaWNrRXZlbnQoe3R5cGU6ICdyZW5hbWUnLCB2YWx1ZTogcmVuYW1lSW5wdXQudmFsdWV9KVwiXHJcbiAgICAgICAgIG9uY2xpY2s9XCJ0aGlzLnNlbGVjdCgpO1wiPlxyXG4gIDxicj5cclxuXHJcbiAgPGRpdiBjbGFzcz1cInJlbmFtZS1idXR0b25cIj5cclxuICAgIDxidXR0b24gY2xhc3M9XCJidXR0b24gYmlnXCIgdHJhbnNsYXRlXHJcbiAgICAgICAgICAgIChjbGljayk9XCJoYW5kbGVGaWxlTWFuYWdlckNsaWNrRXZlbnQoe3R5cGU6ICdyZW5hbWUnLCB2YWx1ZTogcmVuYW1lSW5wdXQudmFsdWV9KVwiXHJcbiAgICAgICAgICAgIFtkaXNhYmxlZF09XCJyZW5hbWVJbnB1dC52YWx1ZSA9PT0gc2VsZWN0ZWROb2RlLm5hbWUgfHwgcmVuYW1lSW5wdXQudmFsdWUubGVuZ3RoID09PSAwXCI+XHJcbiAgICAgIFJlbmFtZVxyXG4gICAgPC9idXR0b24+XHJcbiAgICA8YnV0dG9uIGNsYXNzPVwiYnV0dG9uIGJpZ1wiIChjbGljayk9XCJyZW5hbWVNb2RhbC5jbG9zZSgpXCIgdHJhbnNsYXRlPlxyXG4gICAgICBDYW5jZWxcclxuICAgIDwvYnV0dG9uPlxyXG4gIDwvZGl2PlxyXG5cclxuPC9uZ3gtc21hcnQtbW9kYWw+XHJcbjxuZ3gtc21hcnQtbW9kYWwgKm5nSWY9XCJzZWxlY3RlZE5vZGVcIiBpZGVudGlmaWVyPVwiY29uZmlybURlbGV0ZU1vZGFsXCIgI2RlbGV0ZU1vZGFsXHJcbiAgICAgICAgICAgICAgICAgW2Rpc21pc3NhYmxlXT1cImZhbHNlXCIgW2Nsb3NhYmxlXT1cImZhbHNlXCI+XHJcbiAgPGgyIGNsYXNzPVwibW9kYWwtdGl0bGVcIj5cclxuICAgIDxzcGFuIHRyYW5zbGF0ZT5Zb3UgYXJlIHRyeWluZyB0byBkZWxldGUgZm9sbG93aW5nIDwvc3Bhbj5cclxuICAgIDxzcGFuICpuZ0lmPVwic2VsZWN0ZWROb2RlLmlzRm9sZGVyXCIgdHJhbnNsYXRlPmZvbGRlcjwvc3Bhbj5cclxuICAgIDxzcGFuICpuZ0lmPVwiIXNlbGVjdGVkTm9kZS5pc0ZvbGRlclwiIHRyYW5zbGF0ZT5maWxlPC9zcGFuPlxyXG4gIDwvaDI+XHJcblxyXG4gIDxkaXYgc3R5bGU9XCJ3aWR0aDogMTAwJTsgbWFyZ2luOiA1cHggYXV0bzsgdGV4dC1hbGlnbjogY2VudGVyXCI+e3tzZWxlY3RlZE5vZGUubmFtZX19PC9kaXY+XHJcblxyXG4gIDxkaXYgY2xhc3M9XCJyZW5hbWUtYnV0dG9uXCI+XHJcbiAgICA8YnV0dG9uIGNsYXNzPVwiYnV0dG9uIGJpZ1wiIChjbGljayk9XCJoYW5kbGVGaWxlTWFuYWdlckNsaWNrRXZlbnQoe3R5cGU6ICdyZW1vdmUnfSlcIj5cclxuICAgICAgPHNwYW4gdHJhbnNsYXRlPlllcywgZGVsZXRlIHRoaXMgPC9zcGFuPlxyXG4gICAgICA8c3BhbiAqbmdJZj1cInNlbGVjdGVkTm9kZS5pc0ZvbGRlclwiIHRyYW5zbGF0ZT5mb2xkZXI8L3NwYW4+XHJcbiAgICAgIDxzcGFuICpuZ0lmPVwiIXNlbGVjdGVkTm9kZS5pc0ZvbGRlclwiIHRyYW5zbGF0ZT5maWxlPC9zcGFuPlxyXG4gICAgPC9idXR0b24+XHJcbiAgICA8YnV0dG9uIGNsYXNzPVwiYnV0dG9uIGJpZ1wiIChjbGljayk9XCJkZWxldGVNb2RhbC5jbG9zZSgpXCIgdHJhbnNsYXRlPlxyXG4gICAgICBDYW5jZWxcclxuICAgIDwvYnV0dG9uPlxyXG4gIDwvZGl2PlxyXG48L25neC1zbWFydC1tb2RhbD5cclxuPG5neC1zbWFydC1tb2RhbCBpZGVudGlmaWVyPVwic2VhcmNoTW9kYWxcIiAjc2VhcmNoTW9kYWwgW2Nsb3NhYmxlXT1cInRydWVcIj5cclxuICA8aDIgY2xhc3M9XCJtb2RhbC10aXRsZVwiIHN0eWxlPVwibWFyZ2luLWJvdHRvbTogMnB4XCIgdHJhbnNsYXRlXHJcbiAgICAgICpuZ0lmPVwic2VhcmNoTW9kYWwuaGFzRGF0YSgpICYmIHNlYXJjaE1vZGFsLmdldERhdGEoKS5yZXNwb25zZS5sZW5ndGggIT09IDBcIj5cclxuICAgIFNlYXJjaCByZXN1bHRzIGZvclxyXG4gIDwvaDI+XHJcbiAgPGgyIGNsYXNzPVwibW9kYWwtdGl0bGVcIiBzdHlsZT1cIm1hcmdpbi1ib3R0b206IDJweFwiIHRyYW5zbGF0ZVxyXG4gICAgICAqbmdJZj1cIiFzZWFyY2hNb2RhbC5oYXNEYXRhKCkgfHwgc2VhcmNoTW9kYWwuZ2V0RGF0YSgpLnJlc3BvbnNlLmxlbmd0aCA9PT0gMFwiPlxyXG4gICAgTm8gcmVzdWx0cyBmb3VuZCBmb3JcclxuICA8L2gyPlxyXG4gIDxkaXYgc3R5bGU9XCJ0ZXh0LWFsaWduOiBjZW50ZXJcIiAqbmdJZj1cInNlYXJjaE1vZGFsLmhhc0RhdGEoKVwiPnt7c2VhcmNoTW9kYWwuZ2V0RGF0YSgpLnNlYXJjaFN0cmluZ319PC9kaXY+XHJcblxyXG4gIDxkaXYgKm5nSWY9XCJzZWFyY2hNb2RhbC5oYXNEYXRhKCkgJiYgc2VhcmNoTW9kYWwuZ2V0RGF0YSgpLnJlc3BvbnNlLmxlbmd0aCAhPT0gMFwiPlxyXG4gICAgPHRhYmxlIHN0eWxlPVwibWFyZ2luOiAwIGF1dG9cIj5cclxuICAgICAgPHRyPlxyXG4gICAgICAgIDx0ZCBjbGFzcz1cInRhYmxlLWl0ZW0gdGFibGUtaGVhZFwiIHRyYW5zbGF0ZT5GaWxlIG5hbWU8L3RkPlxyXG4gICAgICAgIDx0ZCBjbGFzcz1cInRhYmxlLWl0ZW0tc2hvcnQgdGFibGUtaGVhZFwiIHRyYW5zbGF0ZT5TaXplPC90ZD5cclxuICAgICAgPC90cj5cclxuICAgICAgPHRyICpuZ0Zvcj1cImxldCBpdGVtIG9mIHNlYXJjaE1vZGFsLmdldERhdGEoKS5yZXNwb25zZVwiIChjbGljayk9XCJzZWFyY2hDbGlja2VkKGl0ZW0pXCI+XHJcbiAgICAgICAgPHRkIHN0eWxlPVwiY3Vyc29yOiBwb2ludGVyXCI+XHJcbiAgICAgICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiaXRlbS5maWxlQ2F0ZWdvcnkgPT09ICdEJzsgZWxzZSBmaWxlXCI+XHJcbiAgICAgICAgICAgIDxpIGNsYXNzPVwiZmFzIGZhLWZvbGRlciBzZWFyY2gtb3V0cHV0LWljb25cIj48L2k+XHJcbiAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cclxuICAgICAgICAgIDxuZy10ZW1wbGF0ZSAjZmlsZT5cclxuICAgICAgICAgICAgPGkgY2xhc3M9XCJmYXMgZmEtZmlsZSBzZWFyY2gtb3V0cHV0LWljb25cIj48L2k+XHJcbiAgICAgICAgICA8L25nLXRlbXBsYXRlPlxyXG4gICAgICAgICAgPHNwYW4gc3R5bGU9XCJ0ZXh0LW92ZXJmbG93OiBlbGxpcHNpc1wiPnt7aXRlbS5uYW1lfX08L3NwYW4+XHJcbiAgICAgICAgPC90ZD5cclxuICAgICAgICA8dGQgY2xhc3M9XCJ0YWJsZS1pdGVtLXNob3J0XCI+e3tpdGVtLnNpemV9fTwvdGQ+XHJcbiAgICAgIDwvdHI+XHJcbiAgICA8L3RhYmxlPlxyXG4gIDwvZGl2PlxyXG48L25neC1zbWFydC1tb2RhbD5cclxuPG5neC1zbWFydC1tb2RhbCBpZGVudGlmaWVyPVwid2FpdE1vZGFsXCIgW2Nsb3NhYmxlXT1cImZhbHNlXCIgW2Rpc21pc3NhYmxlXT1cImZhbHNlXCIgW2VzY2FwYWJsZV09XCJmYWxzZVwiPlxyXG4gIDxoMiBjbGFzcz1cIm1vZGFsLXRpdGxlXCIgc3R5bGU9XCJtYXJnaW4tdG9wOiAyMHB4XCI+XHJcbiAgICB7eydQcm9jZXNzaW5nIHJlcXVlc3QnfX0uLi5cclxuICA8L2gyPlxyXG5cclxuICA8ZGl2IHN0eWxlPVwidGV4dC1hbGlnbjogY2VudGVyOyBoZWlnaHQ6IDcwcHhcIj5cclxuICAgIDxpIGNsYXNzPVwiZmFzIGZhLXNwaW5uZXIgZmEtc3BpbiBmYS00eFwiPjwvaT5cclxuICA8L2Rpdj5cclxuPC9uZ3gtc21hcnQtbW9kYWw+XHJcbjxuZ3gtc21hcnQtbW9kYWwgaWRlbnRpZmllcj1cImVycm9yTW9kYWxcIiBbY2xvc2FibGVdPVwidHJ1ZVwiPlxyXG4gIDxoMiBjbGFzcz1cIm1vZGFsLXRpdGxlXCIgc3R5bGU9XCJtYXJnaW4tdG9wOiAyMHB4XCI+XHJcbiAgICB7eydTb21ldGhpbmcgd2VudCB3cm9uZyB3aXRoIHlvdXIgcmVxdWVzdCd9fS4uLlxyXG4gIDwvaDI+XHJcbjwvbmd4LXNtYXJ0LW1vZGFsPlxyXG5gLFxyXG4gIHN0eWxlczogW2AuY29udGVudHtoZWlnaHQ6MTAwJTttaW4td2lkdGg6ODUwcHh9LmhvbGRlcntkaXNwbGF5Oi13ZWJraXQtZmxleDtkaXNwbGF5OmZsZXg7aGVpZ2h0OmNhbGMoMTAwJSAtIDc1cHgpfS5wYXRoe21hcmdpbjphdXRvIDA7ZGlzcGxheTpibG9ja30ubmF2aWdhdGlvbnttYXJnaW46YXV0byAwO2Rpc3BsYXk6LXdlYmtpdC1mbGV4O2Rpc3BsYXk6ZmxleH0ubmF2aWdhdGlvbiAuYnV0dG9ue21hcmdpbjowIDEwcHg7cGFkZGluZzowO3Bvc2l0aW9uOnJlbGF0aXZlfS5yaWdodHt3aWR0aDoxMDAlO3Bvc2l0aW9uOnJlbGF0aXZlO292ZXJmbG93OmF1dG99LmZpbGUtbmFtZXt3aWR0aDoxMDBweDtoZWlnaHQ6MjVweDtvdmVyZmxvdzpoaWRkZW47d2hpdGUtc3BhY2U6bm93cmFwO3RleHQtb3ZlcmZsb3c6ZWxsaXBzaXM7Ym94LXNpemluZzpib3JkZXItYm94Oy13ZWJraXQtdXNlci1zZWxlY3Q6bm9uZTstbW96LXVzZXItc2VsZWN0Om5vbmU7LW1zLXVzZXItc2VsZWN0Om5vbmU7dXNlci1zZWxlY3Q6bm9uZX0uZmlsZS1wcmV2aWV3e21hcmdpbjphdXRvfS5maWxlLXByZXZpZXcgaXtsaW5lLWhlaWdodDoxLjV9LnNwaW5uZXJ7cG9zaXRpb246YWJzb2x1dGU7dG9wOjUwJTtsZWZ0OjUwJTstd2Via2l0LXRyYW5zZm9ybTp0cmFuc2xhdGUoLTUwJSwtNTAlKTt0cmFuc2Zvcm06dHJhbnNsYXRlKC01MCUsLTUwJSk7Y3Vyc29yOnByb2dyZXNzfS5yZW5hbWUtYnV0dG9ue21hcmdpbjoyMHB4IGF1dG87ZGlzcGxheTpibG9jazt0ZXh0LWFsaWduOmNlbnRlcn0ubW9kYWwtdGl0bGV7bWFyZ2luLXRvcDo1cHg7dGV4dC1hbGlnbjpjZW50ZXJ9LnNlYXJjaC1vdXRwdXR7bWFyZ2luOjE1cHggMH0uc2VhcmNoLW91dHB1dC1pY29ue21hcmdpbjoycHggNXB4fS50YWJsZS1pdGVte3dpZHRoOjgwJX0udGFibGUtaXRlbS1zaG9ydHt3aWR0aDoyMCU7dGV4dC1hbGlnbjpyaWdodH1gXSxcclxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBGaWxlTWFuYWdlckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcbiAgQElucHV0KCkgaWNvblRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xyXG4gIEBJbnB1dCgpIGZvbGRlckNvbnRlbnRUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcclxuICBASW5wdXQoKSBmb2xkZXJDb250ZW50QmFja1RlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xyXG4gIEBJbnB1dCgpIGZvbGRlckNvbnRlbnROZXdUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcclxuICBASW5wdXQoKSBsb2FkaW5nT3ZlcmxheVRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xyXG4gIEBJbnB1dCgpIHNpZGVWaWV3VGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XHJcblxyXG4gIEBJbnB1dCgpIHRyZWU6IFRyZWVNb2RlbDtcclxuICBASW5wdXQoKSBpc1BvcHVwOiBib29sZWFuID0gZmFsc2U7XHJcbiAgQE91dHB1dCgpIGl0ZW1DbGlja2VkID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICBzZWxlY3RlZE5vZGU6IE5vZGVJbnRlcmZhY2U7XHJcbiAgc2lkZU1lbnVDbG9zZWQgPSB0cnVlO1xyXG5cclxuICBmbU9wZW4gPSBmYWxzZTtcclxuICBsb2FkaW5nOiBib29sZWFuO1xyXG4gIG5ld0RpYWxvZyA9IGZhbHNlO1xyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHByaXZhdGUgc3RvcmU6IFN0b3JlPEFwcFN0b3JlPixcclxuICAgIHByaXZhdGUgbm9kZVNlcnZpY2U6IE5vZGVTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSBub2RlQ2xpY2tlZFNlcnZpY2U6IE5vZGVDbGlja2VkU2VydmljZSxcclxuICAgIHB1YmxpYyBuZ3hTbWFydE1vZGFsU2VydmljZTogTmd4U21hcnRNb2RhbFNlcnZpY2UsXHJcbiAgKSB7XHJcbiAgfVxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICAgIC8vIEB0cy1pZ25vcmVcclxuICAgIHdpbmRvdy5jb25zb2xlID0gd2luZG93LmNvbnNvbGUgfHwge307XHJcbiAgICB3aW5kb3cuY29uc29sZS5sb2cgPSB3aW5kb3cuY29uc29sZS5sb2cgfHwgZnVuY3Rpb24gKCkge1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLm5vZGVTZXJ2aWNlLnRyZWUgPSB0aGlzLnRyZWU7XHJcbiAgICB0aGlzLm5vZGVDbGlja2VkU2VydmljZS50cmVlID0gdGhpcy50cmVlO1xyXG4gICAgdGhpcy5ub2RlU2VydmljZS5zdGFydE1hbmFnZXJBdCh0aGlzLnRyZWUuY3VycmVudFBhdGgpO1xyXG5cclxuICAgIHRoaXMuc3RvcmVcclxuICAgICAgLnBpcGUoc2VsZWN0KHN0YXRlID0+IChzdGF0ZS5maWxlTWFuYWdlclN0YXRlIHx8IHt9IGFzIGFueSkuaXNMb2FkaW5nKSlcclxuICAgICAgLnN1YnNjcmliZSgoZGF0YTogYm9vbGVhbikgPT4ge1xyXG4gICAgICAgIHRoaXMubG9hZGluZyA9IGRhdGE7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgIHRoaXMuc3RvcmVcclxuICAgICAgLnBpcGUoc2VsZWN0KHN0YXRlID0+IChzdGF0ZS5maWxlTWFuYWdlclN0YXRlIHx8IHt9IGFzIGFueSkuc2VsZWN0ZWROb2RlKSlcclxuICAgICAgLnN1YnNjcmliZSgobm9kZTogTm9kZUludGVyZmFjZSkgPT4ge1xyXG4gICAgICAgIGlmICghbm9kZSkge1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gZml4ZWQgaGlnaGxpZ2h0aW5nIGVycm9yIHdoZW4gY2xvc2luZyBub2RlIGJ1dCBub3QgY2hhbmdpbmcgcGF0aFxyXG4gICAgICAgIGlmICgobm9kZS5pc0V4cGFuZGVkICYmIG5vZGUucGF0aFRvTm9kZSAhPT0gdGhpcy5ub2RlU2VydmljZS5jdXJyZW50UGF0aCkgJiYgIW5vZGUuc3RheU9wZW4pIHtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuaGFuZGxlRmlsZU1hbmFnZXJDbGlja0V2ZW50KHt0eXBlOiAnc2VsZWN0Jywgbm9kZTogbm9kZX0pO1xyXG4gICAgICB9KTtcclxuICB9XHJcblxyXG4gIG9uSXRlbUNsaWNrZWQoZXZlbnQ6IGFueSk6IHZvaWQge1xyXG4gICAgdGhpcy5pdGVtQ2xpY2tlZC5lbWl0KGV2ZW50KTtcclxuICB9XHJcblxyXG4gIHNlYXJjaENsaWNrZWQoZGF0YTogYW55KSB7XHJcbiAgICAvLyBjb25zb2xlLmxvZyhkYXRhKTtcclxuXHJcbiAgICBjb25zdCBub2RlID0gdGhpcy5ub2RlU2VydmljZS5maW5kTm9kZUJ5SWQoZGF0YS5pZCk7XHJcbiAgICB0aGlzLm5neFNtYXJ0TW9kYWxTZXJ2aWNlLmdldE1vZGFsKCdzZWFyY2hNb2RhbCcpLmNsb3NlKCk7XHJcbiAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKHt0eXBlOiBBQ1RJT05TLlNFVF9TRUxFQ1RFRF9OT0RFLCBwYXlsb2FkOiBub2RlfSk7XHJcbiAgfVxyXG5cclxuICBoYW5kbGVGaWxlTWFuYWdlckNsaWNrRXZlbnQoZXZlbnQ6IGFueSkge1xyXG4gICAgc3dpdGNoIChldmVudC50eXBlKSB7XHJcbiAgICAgIGNhc2UgJ2Nsb3NlU2lkZVZpZXcnIDpcclxuICAgICAgICByZXR1cm4gdGhpcy5ub2RlQ2xpY2tIYW5kbGVyKGV2ZW50Lm5vZGUsIHRydWUpO1xyXG5cclxuICAgICAgY2FzZSAnc2VsZWN0JyA6XHJcbiAgICAgICAgdGhpcy5vbkl0ZW1DbGlja2VkKGV2ZW50KTtcclxuICAgICAgICB0aGlzLmhpZ2hsaWdodFNlbGVjdGVkKGV2ZW50Lm5vZGUpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLm5vZGVDbGlja0hhbmRsZXIoZXZlbnQubm9kZSk7XHJcblxyXG4gICAgICBjYXNlICdkb3dubG9hZCcgOlxyXG4gICAgICAgIHRoaXMubm9kZUNsaWNrZWRTZXJ2aWNlLnN0YXJ0RG93bmxvYWQoZXZlbnQubm9kZSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub25JdGVtQ2xpY2tlZChldmVudCk7XHJcblxyXG4gICAgICBjYXNlICdyZW5hbWVDb25maXJtJyA6XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubmd4U21hcnRNb2RhbFNlcnZpY2UuZ2V0TW9kYWwoJ3JlbmFtZU1vZGFsJykub3BlbigpO1xyXG4gICAgICBjYXNlICdyZW5hbWUnIDpcclxuICAgICAgICB0aGlzLm5neFNtYXJ0TW9kYWxTZXJ2aWNlLmdldE1vZGFsKCdyZW5hbWVNb2RhbCcpLmNsb3NlKCk7XHJcblxyXG4gICAgICAgIHRoaXMubm9kZUNsaWNrZWRTZXJ2aWNlLnJlbmFtZSh0aGlzLnNlbGVjdGVkTm9kZS5pZCwgZXZlbnQudmFsdWUpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9uSXRlbUNsaWNrZWQoe1xyXG4gICAgICAgICAgdHlwZTogZXZlbnQudHlwZSxcclxuICAgICAgICAgIG5vZGU6IHRoaXMuc2VsZWN0ZWROb2RlLFxyXG4gICAgICAgICAgbmV3TmFtZTogZXZlbnQudmFsdWVcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgIGNhc2UgJ3JlbW92ZUFzayc6XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubmd4U21hcnRNb2RhbFNlcnZpY2UuZ2V0TW9kYWwoJ2NvbmZpcm1EZWxldGVNb2RhbCcpLm9wZW4oKTtcclxuICAgICAgY2FzZSAncmVtb3ZlJzpcclxuICAgICAgICB0aGlzLm5neFNtYXJ0TW9kYWxTZXJ2aWNlLmdldE1vZGFsKCdjb25maXJtRGVsZXRlTW9kYWwnKS5jbG9zZSgpO1xyXG5cclxuICAgICAgICB0aGlzLm5vZGVDbGlja2VkU2VydmljZS5pbml0RGVsZXRlKHRoaXMuc2VsZWN0ZWROb2RlKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5vbkl0ZW1DbGlja2VkKHtcclxuICAgICAgICAgIHR5cGU6IGV2ZW50LnR5cGUsXHJcbiAgICAgICAgICBub2RlOiB0aGlzLnNlbGVjdGVkTm9kZVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgY2FzZSAnY3JlYXRlRm9sZGVyJyA6XHJcbiAgICAgICAgY29uc3QgcGFyZW50SWQgPSB0aGlzLm5vZGVTZXJ2aWNlLmZpbmROb2RlQnlQYXRoKHRoaXMubm9kZVNlcnZpY2UuY3VycmVudFBhdGgpLmlkO1xyXG5cclxuICAgICAgICB0aGlzLm5vZGVDbGlja2VkU2VydmljZS5jcmVhdGVGb2xkZXIocGFyZW50SWQsIGV2ZW50LnBheWxvYWQpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9uSXRlbUNsaWNrZWQoe1xyXG4gICAgICAgICAgdHlwZTogZXZlbnQudHlwZSxcclxuICAgICAgICAgIHBhcmVudElkOiBwYXJlbnRJZCxcclxuICAgICAgICAgIG5ld0Rpck5hbWU6IGV2ZW50LnBheWxvYWRcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG5vZGVDbGlja0hhbmRsZXIobm9kZTogTm9kZUludGVyZmFjZSwgY2xvc2luZz86IGJvb2xlYW4pIHtcclxuICAgIGlmIChub2RlLm5hbWUgPT09ICdyb290Jykge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGNsb3NpbmcpIHtcclxuICAgICAgY29uc3QgcGFyZW50Tm9kZSA9IHRoaXMubm9kZVNlcnZpY2UuZmluZE5vZGVCeVBhdGgodGhpcy5ub2RlU2VydmljZS5jdXJyZW50UGF0aCk7XHJcbiAgICAgIHRoaXMuc3RvcmUuZGlzcGF0Y2goe3R5cGU6IEFDVElPTlMuU0VUX1NFTEVDVEVEX05PREUsIHBheWxvYWQ6IHBhcmVudE5vZGV9KTtcclxuICAgICAgdGhpcy5zaWRlTWVudUNsb3NlZCA9IHRydWU7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgaWYgKHRoaXMuc2VsZWN0ZWROb2RlID09PSBub2RlICYmIHRoaXMuc2lkZU1lbnVDbG9zZWQpXHJcbiAgICAgICAgdGhpcy5zaWRlTWVudUNsb3NlZCA9IGZhbHNlO1xyXG4gICAgICBlbHNlIGlmICh0aGlzLnNlbGVjdGVkTm9kZSA9PT0gbm9kZSAmJiAhdGhpcy5zaWRlTWVudUNsb3NlZClcclxuICAgICAgICB0aGlzLnNpZGVNZW51Q2xvc2VkID0gdHJ1ZTtcclxuICAgICAgZWxzZSBpZiAodGhpcy5zZWxlY3RlZE5vZGUgIT09IG5vZGUgJiYgdGhpcy5zaWRlTWVudUNsb3NlZClcclxuICAgICAgICB0aGlzLnNpZGVNZW51Q2xvc2VkID0gZmFsc2U7XHJcbiAgICAgIGVsc2UgaWYgKHRoaXMuc2VsZWN0ZWROb2RlICE9PSBub2RlICYmICF0aGlzLnNpZGVNZW51Q2xvc2VkKVxyXG4gICAgICAgIHRoaXMuc2lkZU1lbnVDbG9zZWQgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnNlbGVjdGVkTm9kZSA9IG5vZGU7XHJcblxyXG4gICAgLy8gdG9kbyBpbnZlc3RpZ2F0ZSB0aGlzIHdvcmthcm91bmQgLSB3YXJuaW5nOiBbRmlsZSBNYW5hZ2VyXSBmYWlsZWQgdG8gZmluZCByZXF1ZXN0ZWQgbm9kZSBmb3IgcGF0aDogW3BhdGhdXHJcbiAgICBpZighZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NpZGUtdmlldycpKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5zaWRlTWVudUNsb3NlZCkge1xyXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2lkZS12aWV3JykuY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0ZWQnKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzaWRlLXZpZXcnKS5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZCcpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gdG9kbyBzdGF5IERSWSFcclxuICBoaWdobGlnaHRTZWxlY3RlZChub2RlOiBOb2RlSW50ZXJmYWNlKSB7XHJcbiAgICBsZXQgcGF0aFRvTm9kZSA9IG5vZGUucGF0aFRvTm9kZTtcclxuXHJcbiAgICBpZiAocGF0aFRvTm9kZS5sZW5ndGggPT09IDApIHtcclxuICAgICAgcGF0aFRvTm9kZSA9ICdyb290JztcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCB0cmVlRWxlbWVudCA9IHRoaXMuZ2V0RWxlbWVudEJ5SWQocGF0aFRvTm9kZSwgJ3RyZWVfJyk7XHJcbiAgICBjb25zdCBmY0VsZW1lbnQgPSB0aGlzLmdldEVsZW1lbnRCeUlkKHBhdGhUb05vZGUsICdmY18nKTtcclxuICAgIGlmICghdHJlZUVsZW1lbnQgJiYgIWZjRWxlbWVudCkge1xyXG4gICAgICBjb25zb2xlLndhcm4oJ1tGaWxlIE1hbmFnZXJdIGZhaWxlZCB0byBmaW5kIHJlcXVlc3RlZCBub2RlIGZvciBwYXRoOicsIHBhdGhUb05vZGUpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5yZW1vdmVDbGFzcygnaGlnaGxpZ2h0ZWQnKTtcclxuICAgIHRoaXMucmVtb3ZlQ2xhc3MoJ2xpZ2h0Jyk7XHJcblxyXG4gICAgaWYgKGZjRWxlbWVudClcclxuICAgICAgdGhpcy5oaWdoaWxnaHRDaGlsZEVsZW1lbnQoZmNFbGVtZW50KTtcclxuICAgIGlmICh0cmVlRWxlbWVudClcclxuICAgICAgdGhpcy5oaWdoaWxnaHRDaGlsZEVsZW1lbnQodHJlZUVsZW1lbnQsIHRydWUpO1xyXG5cclxuICAgIC8vIHBhcmVudCBub2RlIGhpZ2hsaWdodFxyXG4gICAgbGV0IHBhdGhUb1BhcmVudCA9IG5vZGUucGF0aFRvUGFyZW50O1xyXG4gICAgaWYgKHBhdGhUb1BhcmVudCA9PT0gbnVsbCB8fCBub2RlLnBhdGhUb05vZGUgPT09IHRoaXMubm9kZVNlcnZpY2UuY3VycmVudFBhdGgpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChwYXRoVG9QYXJlbnQubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgIHBhdGhUb1BhcmVudCA9ICdyb290JztcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBwYXJlbnRFbGVtZW50ID0gdGhpcy5nZXRFbGVtZW50QnlJZChwYXRoVG9QYXJlbnQsICd0cmVlXycpO1xyXG4gICAgaWYgKCFwYXJlbnRFbGVtZW50KSB7XHJcbiAgICAgIGNvbnNvbGUud2FybignW0ZpbGUgTWFuYWdlcl0gZmFpbGVkIHRvIGZpbmQgcmVxdWVzdGVkIHBhcmVudCBub2RlIGZvciBwYXRoOicsIHBhdGhUb1BhcmVudCk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmhpZ2hpbGdodENoaWxkRWxlbWVudChwYXJlbnRFbGVtZW50KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgaGlnaGlsZ2h0Q2hpbGRFbGVtZW50KGVsOiBIVE1MRWxlbWVudCwgbGlnaHQ6IGJvb2xlYW4gPSBmYWxzZSkge1xyXG4gICAgZWwuY2hpbGRyZW5bMF0gLy8gYXBwbm9kZSBkaXYgd3JhcHBlclxyXG4gICAgICAuY2hpbGRyZW5bMF0gLy8gbmcgdGVtcGxhdGUgZmlyc3QgaXRlbVxyXG4gICAgICAuY2xhc3NMaXN0LmFkZCgnaGlnaGxpZ2h0ZWQnKTtcclxuXHJcbiAgICBpZiAobGlnaHQpXHJcbiAgICAgIGVsLmNoaWxkcmVuWzBdXHJcbiAgICAgICAgLmNoaWxkcmVuWzBdXHJcbiAgICAgICAgLmNsYXNzTGlzdC5hZGQoJ2xpZ2h0Jyk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdldEVsZW1lbnRCeUlkKGlkOiBzdHJpbmcsIHByZWZpeDogc3RyaW5nID0gJycpOiBIVE1MRWxlbWVudCB7XHJcbiAgICBjb25zdCBmdWxsSWQgPSBwcmVmaXggKyBpZDtcclxuICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChmdWxsSWQpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSByZW1vdmVDbGFzcyhjbGFzc05hbWU6IHN0cmluZykge1xyXG4gICAgQXJyYXkuZnJvbShkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKGNsYXNzTmFtZSkpXHJcbiAgICAgIC5tYXAoKGVsOiBIVE1MRWxlbWVudCkgPT4gZWwuY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpKTtcclxuICB9XHJcblxyXG4gIGZtU2hvd0hpZGUoKSB7XHJcbiAgICB0aGlzLmZtT3BlbiA9ICF0aGlzLmZtT3BlbjtcclxuICB9XHJcblxyXG4gIGJhY2tkcm9wQ2xpY2tlZCgpIHtcclxuICAgIC8vIHRvZG8gZ2V0IHJpZCBvZiB0aGlzIHVnbHkgd29ya2Fyb3VuZFxyXG4gICAgLy8gdG9kbyBmaXJlIHVzZXJDYW5jZWxlZExvYWRpbmcgZXZlbnRcclxuICAgIHRoaXMuc3RvcmUuZGlzcGF0Y2goe3R5cGU6IFNFVF9MT0FESU5HX1NUQVRFLCBwYXlsb2FkOiBmYWxzZX0pO1xyXG4gIH1cclxuXHJcbiAgaGFuZGxlVXBsb2FkRGlhbG9nKGV2ZW50OiBhbnkpIHtcclxuICAgIHRoaXMubmV3RGlhbG9nID0gZXZlbnQ7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7Q29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIElucHV0LCBPbkluaXQsIE91dHB1dCwgVGVtcGxhdGVSZWZ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge3NlbGVjdCwgU3RvcmV9IGZyb20gJ0BuZ3J4L3N0b3JlJztcclxuaW1wb3J0IHtUcmVlTW9kZWx9IGZyb20gJy4uLy4uL21vZGVscy90cmVlLm1vZGVsJztcclxuaW1wb3J0IHtOb2RlU2VydmljZX0gZnJvbSAnLi4vLi4vc2VydmljZXMvbm9kZS5zZXJ2aWNlJztcclxuaW1wb3J0IHtOb2RlSW50ZXJmYWNlfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzL25vZGUuaW50ZXJmYWNlJztcclxuaW1wb3J0IHtBcHBTdG9yZX0gZnJvbSAnLi4vLi4vcmVkdWNlcnMvcmVkdWNlci5mYWN0b3J5JztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnYXBwLWZvbGRlci1jb250ZW50JyxcclxuICB0ZW1wbGF0ZTogYDxkaXYgY2xhc3M9XCJpdGVtLWhvbGRlclwiICpuZ0lmPVwibm9kZXNcIj5cclxuICA8bmctY29udGFpbmVyICpuZ0lmPVwibm9kZXMuaWQgIT09IDBcIj5cclxuICAgIDxhcHAtbm9kZSBbbm9kZV09bm9kZXMgaWQ9XCJ7e25vZGVzLnBhdGhUb05vZGV9fVwiPlxyXG4gICAgICA8bmctY29udGFpbmVyIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7JGltcGxpY2l0OiBub2Rlc31cIlxyXG4gICAgICAgICAgICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImZvbGRlckNvbnRlbnRCYWNrVGVtcGxhdGVcIj5cclxuICAgICAgPC9uZy1jb250YWluZXI+XHJcbiAgICA8L2FwcC1ub2RlPlxyXG4gIDwvbmctY29udGFpbmVyPlxyXG5cclxuICA8bmctY29udGFpbmVyICpuZ0Zvcj1cImxldCBub2RlIG9mIG9iai5rZXlzKG5vZGVzLmNoaWxkcmVuKVwiPlxyXG4gICAgPGFwcC1ub2RlIFtub2RlXT1cIm5vZGVzLmNoaWxkcmVuW25vZGVdXCJcclxuICAgICAgICAgICAgICBpZD1cImZjX3t7bm9kZXMuY2hpbGRyZW5bbm9kZV0ucGF0aFRvTm9kZX19XCI+XHJcbiAgICAgIDxuZy1jb250YWluZXIgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cInskaW1wbGljaXQ6IG5vZGVzLmNoaWxkcmVuW25vZGVdfVwiXHJcbiAgICAgICAgICAgICAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRdPVwiZm9sZGVyQ29udGVudFRlbXBsYXRlXCI+XHJcbiAgICAgIDwvbmctY29udGFpbmVyPlxyXG4gICAgPC9hcHAtbm9kZT5cclxuICA8L25nLWNvbnRhaW5lcj5cclxuXHJcbiAgPGRpdiBjbGFzcz1cIm5ld1wiIChjbGljayk9XCJuZXdDbGlja2VkQWN0aW9uKClcIj5cclxuICAgIDxuZy1jb250YWluZXIgW25nVGVtcGxhdGVPdXRsZXRdPVwiZm9sZGVyQ29udGVudE5ld1RlbXBsYXRlXCI+PC9uZy1jb250YWluZXI+XHJcbiAgPC9kaXY+XHJcbjwvZGl2PlxyXG5gLFxyXG4gIHN0eWxlczogW2AuaXRlbS1ob2xkZXJ7Ym94LXNpemluZzpib3JkZXItYm94O2Rpc3BsYXk6LXdlYmtpdC1mbGV4O2Rpc3BsYXk6ZmxleDstd2Via2l0LWZsZXgtZmxvdzp3cmFwO2ZsZXgtZmxvdzp3cmFwfS5pdGVtLWhvbGRlciAubmV3e2Rpc3BsYXk6aW5saW5lfWBdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBGb2xkZXJDb250ZW50Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuICBASW5wdXQoKSBmb2xkZXJDb250ZW50VGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XHJcbiAgQElucHV0KCkgZm9sZGVyQ29udGVudEJhY2tUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcclxuICBASW5wdXQoKSBmb2xkZXJDb250ZW50TmV3VGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XHJcblxyXG4gIEBJbnB1dCgpIHRyZWVNb2RlbDogVHJlZU1vZGVsO1xyXG5cclxuICBAT3V0cHV0KCkgb3BlblVwbG9hZERpYWxvZyA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgbm9kZXM6IE5vZGVJbnRlcmZhY2U7XHJcbiAgb2JqID0gT2JqZWN0O1xyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHByaXZhdGUgbm9kZVNlcnZpY2U6IE5vZGVTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSBzdG9yZTogU3RvcmU8QXBwU3RvcmU+XHJcbiAgKSB7XHJcbiAgfVxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICAgIHRoaXMuc3RvcmVcclxuICAgICAgLnBpcGUoc2VsZWN0KHN0YXRlID0+IChzdGF0ZS5maWxlTWFuYWdlclN0YXRlIHx8IHt9IGFzIGFueSkucGF0aCkpXHJcbiAgICAgIC5zdWJzY3JpYmUoKHBhdGg6IHN0cmluZykgPT4ge1xyXG4gICAgICAgIHRoaXMubm9kZXMgPSB0aGlzLm5vZGVTZXJ2aWNlLmZpbmROb2RlQnlQYXRoKHBhdGgpO1xyXG4gICAgICB9KTtcclxuICB9XHJcblxyXG4gIG5ld0NsaWNrZWRBY3Rpb24oKSB7XHJcbiAgICB0aGlzLm9wZW5VcGxvYWREaWFsb2cuZW1pdCh0cnVlKTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHtBZnRlclZpZXdJbml0LCBDb21wb25lbnQsIENvbnRlbnRDaGlsZCwgSW5wdXQsIE9uSW5pdCwgVGVtcGxhdGVSZWZ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge05vZGVJbnRlcmZhY2V9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMvbm9kZS5pbnRlcmZhY2UnO1xyXG5pbXBvcnQge1RyZWVNb2RlbH0gZnJvbSAnLi4vLi4vbW9kZWxzL3RyZWUubW9kZWwnO1xyXG5pbXBvcnQge05vZGVTZXJ2aWNlfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9ub2RlLnNlcnZpY2UnO1xyXG5pbXBvcnQge3NlbGVjdCwgU3RvcmV9IGZyb20gJ0BuZ3J4L3N0b3JlJztcclxuaW1wb3J0IHtBcHBTdG9yZX0gZnJvbSAnLi4vLi4vcmVkdWNlcnMvcmVkdWNlci5mYWN0b3J5JztcclxuaW1wb3J0ICogYXMgQUNUSU9OUyBmcm9tICcuLi8uLi9yZWR1Y2Vycy9hY3Rpb25zLmFjdGlvbic7XHJcbmltcG9ydCB7Zmlyc3R9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnYXBwLXRyZWUnLFxyXG4gIHRlbXBsYXRlOiBgPGFwcC1ub2RlLWxpc3RlciBbc2hvd0ZpbGVzXT1cInRyZWVNb2RlbC5jb25maWcub3B0aW9ucy5zaG93RmlsZXNJbnNpZGVUcmVlXCJcclxuICAgICAgICAgICAgICAgICBbbm9kZXNdPVwie2NoaWxkcmVuOiBub2Rlc31cIj5cclxuICA8bmctdGVtcGxhdGUgbGV0LW5vZGVzPlxyXG4gICAgPG5nLWNvbnRhaW5lciBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwieyRpbXBsaWNpdDogbm9kZXN9XCIgW25nVGVtcGxhdGVPdXRsZXRdPVwidGVtcGxhdGVSZWZcIj48L25nLWNvbnRhaW5lcj5cclxuICA8L25nLXRlbXBsYXRlPlxyXG48L2FwcC1ub2RlLWxpc3Rlcj5cclxuYCxcclxuICBzdHlsZXM6IFtgYF1cclxufSlcclxuZXhwb3J0IGNsYXNzIFRyZWVDb21wb25lbnQgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBPbkluaXQge1xyXG4gIEBDb250ZW50Q2hpbGQoVGVtcGxhdGVSZWYpIHRlbXBsYXRlUmVmOiBUZW1wbGF0ZVJlZjxhbnk+O1xyXG5cclxuICBASW5wdXQoKSB0cmVlTW9kZWw6IFRyZWVNb2RlbDtcclxuXHJcbiAgbm9kZXM6IE5vZGVJbnRlcmZhY2U7XHJcbiAgY3VycmVudFRyZWVMZXZlbCA9ICcnO1xyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHByaXZhdGUgbm9kZVNlcnZpY2U6IE5vZGVTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSBzdG9yZTogU3RvcmU8QXBwU3RvcmU+XHJcbiAgKSB7XHJcbiAgfVxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICAgIHRoaXMubm9kZXMgPSB0aGlzLnRyZWVNb2RlbC5ub2RlcztcclxuXHJcbiAgICAvL3RvZG8gbW92ZSB0aGlzIHN0b3JlIHRvIHByb3BlciBwbGFjZVxyXG4gICAgdGhpcy5zdG9yZVxyXG4gICAgICAucGlwZShzZWxlY3Qoc3RhdGUgPT4gKHN0YXRlLmZpbGVNYW5hZ2VyU3RhdGUgfHwge30gYXMgYW55KS5wYXRoKSlcclxuICAgICAgLnN1YnNjcmliZSgocGF0aDogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgdGhpcy5ub2RlU2VydmljZS5nZXROb2RlcyhwYXRoKTtcclxuXHJcbiAgICAgICAgdGhpcy5jdXJyZW50VHJlZUxldmVsID0gdGhpcy50cmVlTW9kZWwuY3VycmVudFBhdGg7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLnRyZWVNb2RlbC5jdXJyZW50UGF0aCA9IHBhdGg7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgbmdBZnRlclZpZXdJbml0KCkge1xyXG4gICAgdGhpcy5zdG9yZVxyXG4gICAgICAucGlwZShzZWxlY3Qoc3RhdGUgPT4gKHN0YXRlLmZpbGVNYW5hZ2VyU3RhdGUgfHwge30gYXMgYW55KS5wYXRoKSlcclxuICAgICAgLnBpcGUoZmlyc3QoKSlcclxuICAgICAgLnN1YnNjcmliZSgocGF0aDogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgY29uc3Qgbm9kZXMgPSB0aGlzLm5vZGVTZXJ2aWNlLmZpbmROb2RlQnlQYXRoKHBhdGgpO1xyXG4gICAgICAgIHRoaXMuc3RvcmUuZGlzcGF0Y2goe3R5cGU6IEFDVElPTlMuU0VUX1NFTEVDVEVEX05PREUsIHBheWxvYWQ6IG5vZGVzfSk7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQge0NvbXBvbmVudCwgQ29udGVudENoaWxkLCBJbnB1dCwgT25Jbml0LCBUZW1wbGF0ZVJlZn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7Tm9kZUludGVyZmFjZX0gZnJvbSAnLi4vLi4vLi4vaW50ZXJmYWNlcy9ub2RlLmludGVyZmFjZSc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2FwcC1ub2RlLWxpc3RlcicsXHJcbiAgdGVtcGxhdGU6IGA8dWwgY2xhc3M9XCJub2RlLWxpc3Rlci1mbGlzdFwiPlxyXG4gIDwhLS1JbiBvcmRlciB0byBhdm9pZCBoYXZpbmcgdG8gY3JlYXRlIHRoYXQgZXh0cmEgZGl2LCB3ZSBjYW4gaW5zdGVhZCB1c2UgbmctY29udGFpbmVyIGRpcmVjdGl2ZS0tPlxyXG4gIDxuZy1jb250YWluZXIgKm5nRm9yPVwibGV0IG5vZGUgb2Ygb2JqLmtleXMobm9kZXMpXCI+XHJcbiAgICA8bGkgY2xhc3M9XCJub2RlLWxpc3Rlci1saXN0LWl0ZW1cIiAqbmdJZj1cIm5vZGVzW25vZGVdLmlzRm9sZGVyIHx8IHNob3dGaWxlc1wiPlxyXG5cclxuICAgICAgPGFwcC1ub2RlIGNsYXNzPVwibm9kZS1saXN0ZXItYXBwLW5vZGVcIiBbbm9kZV09XCJub2Rlc1tub2RlXVwiIGlkPVwidHJlZV97e25vZGVzW25vZGVdLmlkID09PSAwID8gJ3Jvb3QnIDogbm9kZXNbbm9kZV0ucGF0aFRvTm9kZX19XCI+XHJcbiAgICAgICAgPG5nLWNvbnRhaW5lciBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwieyRpbXBsaWNpdDogKG5vZGVzW25vZGVdKX1cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRdPVwidGVtcGxhdGVSZWZcIj5cclxuICAgICAgICA8L25nLWNvbnRhaW5lcj5cclxuICAgICAgPC9hcHAtbm9kZT5cclxuXHJcbiAgICAgIDxhcHAtbm9kZS1saXN0ZXIgY2xhc3M9XCJub2RlLWxpc3RlclwiICpuZ0lmPVwib2JqLmtleXMobm9kZXNbbm9kZV0uY2hpbGRyZW4pLmxlbmd0aCA+IDBcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgIFtzaG93RmlsZXNdPVwic2hvd0ZpbGVzXCIgW25vZGVzXT1cIm5vZGVzW25vZGVdLmNoaWxkcmVuXCI+XHJcbiAgICAgICAgPG5nLXRlbXBsYXRlIGxldC1ub2Rlcz5cclxuICAgICAgICAgIDxuZy1jb250YWluZXIgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cInskaW1wbGljaXQ6IChub2Rlcyl9XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRdPVwidGVtcGxhdGVSZWZcIj5cclxuICAgICAgICAgIDwvbmctY29udGFpbmVyPlxyXG4gICAgICAgIDwvbmctdGVtcGxhdGU+XHJcbiAgICAgIDwvYXBwLW5vZGUtbGlzdGVyPlxyXG4gICAgPC9saT5cclxuICA8L25nLWNvbnRhaW5lcj5cclxuPC91bD5cclxuYCxcclxuICBzdHlsZXM6IFtgLm5vZGUtbGlzdGVyLWZsaXN0e21hcmdpbjowIDAgMCAxZW07cGFkZGluZzowO2xpc3Qtc3R5bGU6bm9uZTt3aGl0ZS1zcGFjZTpub3dyYXB9Lm5vZGUtbGlzdGVyLWxpc3QtaXRlbXtsaXN0LXN0eWxlOm5vbmU7bGluZS1oZWlnaHQ6MS4yZW07Zm9udC1zaXplOjFlbTtkaXNwbGF5OmlubGluZX0ubm9kZS1saXN0ZXItbGlzdC1pdGVtIC5ub2RlLWxpc3Rlci1hcHAtbm9kZS5kZXNlbGVjdGVkKy5ub2RlLWxpc3RlciB1bHtkaXNwbGF5Om5vbmV9YF1cclxufSlcclxuZXhwb3J0IGNsYXNzIE5vZGVMaXN0ZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG4gIEBDb250ZW50Q2hpbGQoVGVtcGxhdGVSZWYpIHRlbXBsYXRlUmVmOiBUZW1wbGF0ZVJlZjxhbnk+O1xyXG4gIEBJbnB1dCgpIG5vZGVzOiBOb2RlSW50ZXJmYWNlO1xyXG4gIEBJbnB1dCgpIHNob3dGaWxlczogYm9vbGVhbjtcclxuXHJcbiAgb2JqID0gT2JqZWN0O1xyXG5cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICB9XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQge0NvbXBvbmVudCwgSW5wdXQsIE9uSW5pdH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7Tm9kZUludGVyZmFjZX0gZnJvbSAnLi4vLi4vLi4vaW50ZXJmYWNlcy9ub2RlLmludGVyZmFjZSc7XHJcbmltcG9ydCB7U3RvcmV9IGZyb20gJ0BuZ3J4L3N0b3JlJztcclxuXHJcbmltcG9ydCAqIGFzIEFDVElPTlMgZnJvbSAnLi4vLi4vLi4vcmVkdWNlcnMvYWN0aW9ucy5hY3Rpb24nO1xyXG5pbXBvcnQge0FwcFN0b3JlfSBmcm9tICcuLi8uLi8uLi9yZWR1Y2Vycy9yZWR1Y2VyLmZhY3RvcnknO1xyXG5pbXBvcnQge05vZGVTZXJ2aWNlfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9ub2RlLnNlcnZpY2UnO1xyXG5pbXBvcnQge05vZGVDbGlja2VkU2VydmljZX0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvbm9kZS1jbGlja2VkLnNlcnZpY2UnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdhcHAtbm9kZScsXHJcbiAgdGVtcGxhdGU6IGA8ZGl2ICNjdXN0b21UZW1wbGF0ZSAoZGJsY2xpY2spPVwibWV0aG9kMkNhbGxGb3JEYmxDbGljaygkZXZlbnQpXCIgKGNsaWNrKT1cIm1ldGhvZDFDYWxsRm9yQ2xpY2soJGV2ZW50KVwiPlxyXG4gIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cclxuPC9kaXY+XHJcbmAsXHJcbiAgc3R5bGVzOiBbYGBdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBOb2RlQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuICBASW5wdXQoKSBub2RlOiBOb2RlSW50ZXJmYWNlO1xyXG4gIGlzU2luZ2xlQ2xpY2sgPSB0cnVlO1xyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHByaXZhdGUgc3RvcmU6IFN0b3JlPEFwcFN0b3JlPixcclxuICAgIHByaXZhdGUgbm9kZVNlcnZpY2U6IE5vZGVTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSBub2RlQ2xpY2tlZFNlcnZpY2U6IE5vZGVDbGlja2VkU2VydmljZVxyXG4gICkge1xyXG4gIH1cclxuXHJcbiAgcHVibGljIG1ldGhvZDFDYWxsRm9yQ2xpY2soZXZlbnQ6IE1vdXNlRXZlbnQpIHtcclxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgdGhpcy5pc1NpbmdsZUNsaWNrID0gdHJ1ZTtcclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICBpZiAodGhpcy5pc1NpbmdsZUNsaWNrKSB7XHJcbiAgICAgICAgdGhpcy5zaG93TWVudSgpO1xyXG4gICAgICB9XHJcbiAgICB9LCAyMDApO1xyXG4gIH1cclxuXHJcbiAgLy8gdG9kbyBldmVudC5wcmV2ZW50RGVmYXVsdCBmb3IgZG91YmxlIGNsaWNrXHJcbiAgcHVibGljIG1ldGhvZDJDYWxsRm9yRGJsQ2xpY2soZXZlbnQ6IGFueSkge1xyXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICB0aGlzLmlzU2luZ2xlQ2xpY2sgPSBmYWxzZTtcclxuICAgIHRoaXMub3BlbigpO1xyXG4gIH1cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIG9wZW4oKSB7XHJcbiAgICBpZiAoIXRoaXMubm9kZS5pc0ZvbGRlcikge1xyXG4gICAgICB0aGlzLm5vZGVDbGlja2VkU2VydmljZS5zdGFydERvd25sb2FkKHRoaXMubm9kZSk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5ub2RlLnN0YXlPcGVuKSB7XHJcbiAgICAgIGlmICh0aGlzLm5vZGUubmFtZSA9PSAncm9vdCcpIHtcclxuICAgICAgICB0aGlzLm5vZGVTZXJ2aWNlLmZvbGRBbGwoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5zdG9yZS5kaXNwYXRjaCh7dHlwZTogQUNUSU9OUy5TRVRfUEFUSCwgcGF5bG9hZDogdGhpcy5ub2RlLnBhdGhUb05vZGV9KTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMudG9nZ2xlTm9kZUV4cGFuZGVkKCk7XHJcblxyXG4gICAgaWYgKHRoaXMubm9kZS5pc0V4cGFuZGVkKSB7XHJcbiAgICAgIHRoaXMuc3RvcmUuZGlzcGF0Y2goe3R5cGU6IEFDVElPTlMuU0VUX1BBVEgsIHBheWxvYWQ6IHRoaXMubm9kZS5wYXRoVG9Ob2RlfSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5zZXROb2RlU2VsZWN0ZWRTdGF0ZSgpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBzaG93TWVudSgpIHtcclxuICAgIHRoaXMuc3RvcmUuZGlzcGF0Y2goe3R5cGU6IEFDVElPTlMuU0VUX1NFTEVDVEVEX05PREUsIHBheWxvYWQ6IHRoaXMubm9kZX0pO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSB0b2dnbGVOb2RlRXhwYW5kZWQoKSB7XHJcbiAgICB0aGlzLm5vZGUuaXNFeHBhbmRlZCA9ICF0aGlzLm5vZGUuaXNFeHBhbmRlZDtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgc2V0Tm9kZVNlbGVjdGVkU3RhdGUoKSB7XHJcbiAgICBpZiAoIXRoaXMubm9kZS5pc0V4cGFuZGVkKSB7XHJcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0cmVlXycgKyB0aGlzLm5vZGUucGF0aFRvTm9kZSkuY2xhc3NMaXN0LmFkZCgnZGVzZWxlY3RlZCcpO1xyXG5cclxuICAgICAgdGhpcy5ub2RlU2VydmljZS5mb2xkUmVjdXJzaXZlbHkodGhpcy5ub2RlKTtcclxuXHJcbiAgICAgIHRoaXMuc3RvcmUuZGlzcGF0Y2goe3R5cGU6IEFDVElPTlMuU0VUX1BBVEgsIHBheWxvYWQ6IHRoaXMubm9kZS5wYXRoVG9QYXJlbnR9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0cmVlXycgKyB0aGlzLm5vZGUucGF0aFRvTm9kZSkuY2xhc3NMaXN0LnJlbW92ZSgnZGVzZWxlY3RlZCcpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQge1BpcGUsIFBpcGVUcmFuc2Zvcm19IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuQFBpcGUoe1xyXG4gIG5hbWU6ICdtYXBUb0l0ZXJhYmxlUGlwZSdcclxufSlcclxuZXhwb3J0IGNsYXNzIE1hcFRvSXRlcmFibGVQaXBlIGltcGxlbWVudHMgUGlwZVRyYW5zZm9ybSB7XHJcbiAgdHJhbnNmb3JtKGRpY3Q6IE9iamVjdCkge1xyXG4gICAgY29uc3QgYSA9IFtdO1xyXG4gICAgZm9yIChjb25zdCBrZXkgaW4gZGljdCkge1xyXG4gICAgICBpZiAoZGljdC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgYS5wdXNoKHtrZXk6IGtleSwgdmFsOiBkaWN0W2tleV19KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBhO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQge0NvbXBvbmVudCwgT25Jbml0fSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtzZWxlY3QsIFN0b3JlfSBmcm9tICdAbmdyeC9zdG9yZSc7XHJcbmltcG9ydCAqIGFzIEFDVElPTlMgZnJvbSAnLi4vLi4vcmVkdWNlcnMvYWN0aW9ucy5hY3Rpb24nO1xyXG5pbXBvcnQge0FwcFN0b3JlfSBmcm9tICcuLi8uLi9yZWR1Y2Vycy9yZWR1Y2VyLmZhY3RvcnknO1xyXG5pbXBvcnQge05vZGVTZXJ2aWNlfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9ub2RlLnNlcnZpY2UnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdhcHAtbmF2LWJhcicsXHJcbiAgdGVtcGxhdGU6IGA8ZGl2PlxyXG4gID4+IDxzcGFuICpuZ0Zvcj1cImxldCB0byBvZiBjdXJyZW50UGF0aDsgbGV0IGkgPSBpbmRleFwiPlxyXG4gIDxhIGNsYXNzPVwibGlua1wiIChjbGljayk9XCJvbkNsaWNrKGN1cnJlbnRQYXRoLCBpKVwiPlxyXG4gICAgPGRpdiAqbmdJZj1cInRvID09PSAnJyB8fCB0byA9PT0gJ3Jvb3QnOyB0aGVuIGljb24gZWxzZSBuYW1lXCI+PC9kaXY+XHJcbiAgICA8bmctdGVtcGxhdGUgI2ljb24+PGkgY2xhc3M9XCJmYXMgZmEtaG9tZVwiPjwvaT48L25nLXRlbXBsYXRlPlxyXG4gICAgPG5nLXRlbXBsYXRlICNuYW1lPnt7dG99fTwvbmctdGVtcGxhdGU+XHJcbiAgPC9hPiAvXHJcbiAgPC9zcGFuPlxyXG48L2Rpdj5cclxuYCxcclxuICBzdHlsZXM6IFtgYF1cclxufSlcclxuZXhwb3J0IGNsYXNzIE5hdkJhckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcbiAgY3VycmVudFBhdGg6IHN0cmluZ1tdO1xyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHByaXZhdGUgc3RvcmU6IFN0b3JlPEFwcFN0b3JlPixcclxuICAgIHByaXZhdGUgbm9kZVNlcnZpY2U6IE5vZGVTZXJ2aWNlXHJcbiAgKSB7XHJcbiAgfVxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICAgIHRoaXMuc3RvcmVcclxuICAgICAgLnBpcGUoc2VsZWN0KHN0YXRlID0+IChzdGF0ZS5maWxlTWFuYWdlclN0YXRlIHx8IHt9IGFzIGFueSkucGF0aCkpXHJcbiAgICAgIC5zdWJzY3JpYmUoKGRhdGE6IHN0cmluZykgPT4ge1xyXG4gICAgICAgIHRoaXMubm9kZVNlcnZpY2UuY3VycmVudFBhdGggPSBkYXRhO1xyXG4gICAgICAgIHRoaXMuY3VycmVudFBhdGggPSBkYXRhLnNwbGl0KCcvJyk7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgb25DbGljayhwYXRoOiBzdHJpbmdbXSwgaW5kZXg6IG51bWJlcikge1xyXG4gICAgY29uc3QgbmV3UGF0aCA9IHBhdGguc2xpY2UoMCwgaW5kZXggKyAxKS5qb2luKCcvJyk7XHJcbiAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKHt0eXBlOiBBQ1RJT05TLlNFVF9QQVRILCBwYXlsb2FkOiBuZXdQYXRofSk7XHJcbiAgfVxyXG5cclxufVxyXG4iLCIvKiEgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbkxpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZVxyXG50aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZVxyXG5MaWNlbnNlIGF0IGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG5cclxuVEhJUyBDT0RFIElTIFBST1ZJREVEIE9OIEFOICpBUyBJUyogQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWVxyXG5LSU5ELCBFSVRIRVIgRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgV0lUSE9VVCBMSU1JVEFUSU9OIEFOWSBJTVBMSUVEXHJcbldBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBUSVRMRSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UsXHJcbk1FUkNIQU5UQUJMSVRZIE9SIE5PTi1JTkZSSU5HRU1FTlQuXHJcblxyXG5TZWUgdGhlIEFwYWNoZSBWZXJzaW9uIDIuMCBMaWNlbnNlIGZvciBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnNcclxuYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xyXG4vKiBnbG9iYWwgUmVmbGVjdCwgUHJvbWlzZSAqL1xyXG5cclxudmFyIGV4dGVuZFN0YXRpY3MgPSBmdW5jdGlvbihkLCBiKSB7XHJcbiAgICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XHJcbiAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHRlbmRzKGQsIGIpIHtcclxuICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxufVxyXG5cclxuZXhwb3J0IHZhciBfX2Fzc2lnbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uIF9fYXNzaWduKHQpIHtcclxuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcclxuICAgICAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKSB0W3BdID0gc1twXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVzdChzLCBlKSB7XHJcbiAgICB2YXIgdCA9IHt9O1xyXG4gICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApICYmIGUuaW5kZXhPZihwKSA8IDApXHJcbiAgICAgICAgdFtwXSA9IHNbcF07XHJcbiAgICBpZiAocyAhPSBudWxsICYmIHR5cGVvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzID09PSBcImZ1bmN0aW9uXCIpXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIHAgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHMpOyBpIDwgcC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoZS5pbmRleE9mKHBbaV0pIDwgMCAmJiBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwocywgcFtpXSkpXHJcbiAgICAgICAgICAgICAgICB0W3BbaV1dID0gc1twW2ldXTtcclxuICAgICAgICB9XHJcbiAgICByZXR1cm4gdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcclxuICAgIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCwgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsIGQ7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO1xyXG4gICAgZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcclxuICAgIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3BhcmFtKHBhcmFtSW5kZXgsIGRlY29yYXRvcikge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIGtleSkgeyBkZWNvcmF0b3IodGFyZ2V0LCBrZXksIHBhcmFtSW5kZXgpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKSB7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QubWV0YWRhdGEgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIFJlZmxlY3QubWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdGVyKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZShyZXN1bHQudmFsdWUpOyB9KS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XHJcbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2dlbmVyYXRvcih0aGlzQXJnLCBib2R5KSB7XHJcbiAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnO1xyXG4gICAgcmV0dXJuIGcgPSB7IG5leHQ6IHZlcmIoMCksIFwidGhyb3dcIjogdmVyYigxKSwgXCJyZXR1cm5cIjogdmVyYigyKSB9LCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcclxuICAgICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XHJcbiAgICAgICAgd2hpbGUgKF8pIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IG9wWzBdICYgMiA/IHlbXCJyZXR1cm5cIl0gOiBvcFswXSA/IHlbXCJ0aHJvd1wiXSB8fCAoKHQgPSB5W1wicmV0dXJuXCJdKSAmJiB0LmNhbGwoeSksIDApIDogeS5uZXh0KSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcclxuICAgICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFtvcFswXSAmIDIsIHQudmFsdWVdO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XHJcbiAgICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcclxuICAgICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cclxuICAgICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXhwb3J0U3RhcihtLCBleHBvcnRzKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmICghZXhwb3J0cy5oYXNPd25Qcm9wZXJ0eShwKSkgZXhwb3J0c1twXSA9IG1bcF07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3ZhbHVlcyhvKSB7XHJcbiAgICB2YXIgbSA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl0sIGkgPSAwO1xyXG4gICAgaWYgKG0pIHJldHVybiBtLmNhbGwobyk7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIG5leHQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKG8gJiYgaSA+PSBvLmxlbmd0aCkgbyA9IHZvaWQgMDtcclxuICAgICAgICAgICAgcmV0dXJuIHsgdmFsdWU6IG8gJiYgb1tpKytdLCBkb25lOiAhbyB9O1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3JlYWQobywgbikge1xyXG4gICAgdmFyIG0gPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdO1xyXG4gICAgaWYgKCFtKSByZXR1cm4gbztcclxuICAgIHZhciBpID0gbS5jYWxsKG8pLCByLCBhciA9IFtdLCBlO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICB3aGlsZSAoKG4gPT09IHZvaWQgMCB8fCBuLS0gPiAwKSAmJiAhKHIgPSBpLm5leHQoKSkuZG9uZSkgYXIucHVzaChyLnZhbHVlKTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlcnJvcikgeyBlID0geyBlcnJvcjogZXJyb3IgfTsgfVxyXG4gICAgZmluYWxseSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKHIgJiYgIXIuZG9uZSAmJiAobSA9IGlbXCJyZXR1cm5cIl0pKSBtLmNhbGwoaSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpbmFsbHkgeyBpZiAoZSkgdGhyb3cgZS5lcnJvcjsgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWQoKSB7XHJcbiAgICBmb3IgKHZhciBhciA9IFtdLCBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKylcclxuICAgICAgICBhciA9IGFyLmNvbmNhdChfX3JlYWQoYXJndW1lbnRzW2ldKSk7XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZEFycmF5cygpIHtcclxuICAgIGZvciAodmFyIHMgPSAwLCBpID0gMCwgaWwgPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgaWw7IGkrKykgcyArPSBhcmd1bWVudHNbaV0ubGVuZ3RoO1xyXG4gICAgZm9yICh2YXIgciA9IEFycmF5KHMpLCBrID0gMCwgaSA9IDA7IGkgPCBpbDsgaSsrKVxyXG4gICAgICAgIGZvciAodmFyIGEgPSBhcmd1bWVudHNbaV0sIGogPSAwLCBqbCA9IGEubGVuZ3RoOyBqIDwgamw7IGorKywgaysrKVxyXG4gICAgICAgICAgICByW2tdID0gYVtqXTtcclxuICAgIHJldHVybiByO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXQodikge1xyXG4gICAgcmV0dXJuIHRoaXMgaW5zdGFuY2VvZiBfX2F3YWl0ID8gKHRoaXMudiA9IHYsIHRoaXMpIDogbmV3IF9fYXdhaXQodik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jR2VuZXJhdG9yKHRoaXNBcmcsIF9hcmd1bWVudHMsIGdlbmVyYXRvcikge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBnID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pLCBpLCBxID0gW107XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaWYgKGdbbl0pIGlbbl0gPSBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKGEsIGIpIHsgcS5wdXNoKFtuLCB2LCBhLCBiXSkgPiAxIHx8IHJlc3VtZShuLCB2KTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHJlc3VtZShuLCB2KSB7IHRyeSB7IHN0ZXAoZ1tuXSh2KSk7IH0gY2F0Y2ggKGUpIHsgc2V0dGxlKHFbMF1bM10sIGUpOyB9IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAocikgeyByLnZhbHVlIGluc3RhbmNlb2YgX19hd2FpdCA/IFByb21pc2UucmVzb2x2ZShyLnZhbHVlLnYpLnRoZW4oZnVsZmlsbCwgcmVqZWN0KSA6IHNldHRsZShxWzBdWzJdLCByKTsgfVxyXG4gICAgZnVuY3Rpb24gZnVsZmlsbCh2YWx1ZSkgeyByZXN1bWUoXCJuZXh0XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gcmVqZWN0KHZhbHVlKSB7IHJlc3VtZShcInRocm93XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKGYsIHYpIHsgaWYgKGYodiksIHEuc2hpZnQoKSwgcS5sZW5ndGgpIHJlc3VtZShxWzBdWzBdLCBxWzBdWzFdKTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0RlbGVnYXRvcihvKSB7XHJcbiAgICB2YXIgaSwgcDtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiwgZnVuY3Rpb24gKGUpIHsgdGhyb3cgZTsgfSksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4sIGYpIHsgaVtuXSA9IG9bbl0gPyBmdW5jdGlvbiAodikgeyByZXR1cm4gKHAgPSAhcCkgPyB7IHZhbHVlOiBfX2F3YWl0KG9bbl0odikpLCBkb25lOiBuID09PSBcInJldHVyblwiIH0gOiBmID8gZih2KSA6IHY7IH0gOiBmOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jVmFsdWVzKG8pIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgbSA9IG9bU3ltYm9sLmFzeW5jSXRlcmF0b3JdLCBpO1xyXG4gICAgcmV0dXJuIG0gPyBtLmNhbGwobykgOiAobyA9IHR5cGVvZiBfX3ZhbHVlcyA9PT0gXCJmdW5jdGlvblwiID8gX192YWx1ZXMobykgOiBvW1N5bWJvbC5pdGVyYXRvcl0oKSwgaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGkpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlbbl0gPSBvW25dICYmIGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7IHYgPSBvW25dKHYpLCBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCB2LmRvbmUsIHYudmFsdWUpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgZCwgdikgeyBQcm9taXNlLnJlc29sdmUodikudGhlbihmdW5jdGlvbih2KSB7IHJlc29sdmUoeyB2YWx1ZTogdiwgZG9uZTogZCB9KTsgfSwgcmVqZWN0KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tYWtlVGVtcGxhdGVPYmplY3QoY29va2VkLCByYXcpIHtcclxuICAgIGlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvb2tlZCwgXCJyYXdcIiwgeyB2YWx1ZTogcmF3IH0pOyB9IGVsc2UgeyBjb29rZWQucmF3ID0gcmF3OyB9XHJcbiAgICByZXR1cm4gY29va2VkO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0U3Rhcihtb2QpIHtcclxuICAgIGlmIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpIHJldHVybiBtb2Q7XHJcbiAgICB2YXIgcmVzdWx0ID0ge307XHJcbiAgICBpZiAobW9kICE9IG51bGwpIGZvciAodmFyIGsgaW4gbW9kKSBpZiAoT2JqZWN0Lmhhc093blByb3BlcnR5LmNhbGwobW9kLCBrKSkgcmVzdWx0W2tdID0gbW9kW2tdO1xyXG4gICAgcmVzdWx0LmRlZmF1bHQgPSBtb2Q7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnREZWZhdWx0KG1vZCkge1xyXG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBkZWZhdWx0OiBtb2QgfTtcclxufVxyXG4iLCJpbXBvcnQge1N0YXRlSW50ZXJmYWNlfSBmcm9tICcuLi9pbnRlcmZhY2VzL3N0YXRlLmludGVyZmFjZSc7XHJcbmltcG9ydCAqIGFzIEFDVElPTlMgZnJvbSAnLi9hY3Rpb25zLmFjdGlvbic7XHJcblxyXG5jb25zdCBpbml0aWFsU3RhdGU6IFN0YXRlSW50ZXJmYWNlID0ge1xyXG4gIHBhdGg6ICcnLFxyXG4gIGlzTG9hZGluZzogdHJ1ZSxcclxuICBzZWxlY3RlZE5vZGU6IG51bGxcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzdGF0ZVJlZHVjZXIoc3RhdGU6IFN0YXRlSW50ZXJmYWNlID0gaW5pdGlhbFN0YXRlLCBhY3Rpb246IEFDVElPTlMuQWN0aW9ucyk6IFN0YXRlSW50ZXJmYWNlIHtcclxuICAvLyBjb25zb2xlLmxvZygnUHJldmlvdXMgc3RhdGU6ICcsIHN0YXRlKTtcclxuICAvLyBjb25zb2xlLmxvZygnQUNUSU9OIHR5cGU6ICcsIGFjdGlvbi50eXBlKTtcclxuICAvLyBjb25zb2xlLmxvZygnQUNUSU9OIHBheWxvYWQ6ICcsIGFjdGlvbi5wYXlsb2FkKTtcclxuXHJcbiAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgY2FzZSBBQ1RJT05TLlNFVF9QQVRIIDpcclxuICAgICAgaWYgKHN0YXRlLnBhdGggPT09IGFjdGlvbi5wYXlsb2FkKSB7XHJcbiAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiB7Li4uc3RhdGUsIHBhdGg6IGFjdGlvbi5wYXlsb2FkLCBpc0xvYWRpbmc6IHRydWV9O1xyXG4gICAgY2FzZSBBQ1RJT05TLlNFVF9MT0FESU5HX1NUQVRFIDpcclxuICAgICAgcmV0dXJuIHsuLi5zdGF0ZSwgaXNMb2FkaW5nOiBhY3Rpb24ucGF5bG9hZH07XHJcbiAgICBjYXNlIEFDVElPTlMuU0VUX1NFTEVDVEVEX05PREUgOlxyXG4gICAgICByZXR1cm4gey4uLnN0YXRlLCBzZWxlY3RlZE5vZGU6IGFjdGlvbi5wYXlsb2FkfTtcclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgIHJldHVybiBpbml0aWFsU3RhdGU7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7c3RhdGVSZWR1Y2VyfSBmcm9tICcuL3N0YXRlUmVkdWNlcic7XHJcbmltcG9ydCB7QWN0aW9uUmVkdWNlck1hcH0gZnJvbSAnQG5ncngvc3RvcmUnO1xyXG5pbXBvcnQge1N0YXRlSW50ZXJmYWNlfSBmcm9tICcuLi9pbnRlcmZhY2VzL3N0YXRlLmludGVyZmFjZSc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEFwcFN0b3JlIHtcclxuICBmaWxlTWFuYWdlclN0YXRlOiBTdGF0ZUludGVyZmFjZTtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHJlZHVjZXJzOiBBY3Rpb25SZWR1Y2VyTWFwPEFwcFN0b3JlPiA9IHtcclxuICBmaWxlTWFuYWdlclN0YXRlOiBzdGF0ZVJlZHVjZXJcclxufTtcclxuIiwiaW1wb3J0IHtDb21wb25lbnQsIElucHV0LCBPbkluaXQsIFRlbXBsYXRlUmVmfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtffSBmcm9tICdAYmllc2JqZXJnL25neC10cmFuc2xhdGUtZXh0cmFjdC9kaXN0L3V0aWxzL3V0aWxzJztcclxuaW1wb3J0IHt0aW1lcn0gZnJvbSAncnhqcyc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2FwcC1sb2FkaW5nLW92ZXJsYXknLFxyXG4gIHRlbXBsYXRlOiBgPG5nLWNvbnRhaW5lclxyXG4gIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7JGltcGxpY2l0OiB0aW1lb3V0TWVzc2FnZX1cIlxyXG4gIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImxvYWRpbmdPdmVybGF5VGVtcGxhdGVcIj5cclxuPC9uZy1jb250YWluZXI+XHJcbmAsXHJcbiAgc3R5bGVzOiBbYGBdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBMb2FkaW5nT3ZlcmxheUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcbiAgQElucHV0KCkgbG9hZGluZ092ZXJsYXlUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcclxuICB0aW1lb3V0TWVzc2FnZTogYW55O1xyXG5cclxuICAvLyB0b2RvIHVuc3Vic2NyaWJlIGZyb20gJ2xpc3QnIGV2ZW50IC0gbm93IHdlIGFyZSBvbmx5IGRpc21pc3NpbmcgdGhpcyBjb21wb25lbnRcclxuICBuZ09uSW5pdCgpIHtcclxuICAgIHRpbWVyKDIwMDApLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgIHRoaXMudGltZW91dE1lc3NhZ2UgPSBfKCdUcm91YmxlcyB3aXRoIGxvYWRpbmc/IENsaWNrIGFueXdoZXJlIHRvIGNhbmNlbCBsb2FkaW5nJyk7XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgUGlwZSwgUGlwZVRyYW5zZm9ybSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuLypcclxuICogQ29udmVydCBieXRlcyBpbnRvIGxhcmdlc3QgcG9zc2libGUgdW5pdC5cclxuICogVGFrZXMgYW4gcHJlY2lzaW9uIGFyZ3VtZW50IHRoYXQgZGVmYXVsdHMgdG8gMi5cclxuICogVXNhZ2U6XHJcbiAqICAgYnl0ZXMgfCBmaWxlU2l6ZTpwcmVjaXNpb25cclxuICogRXhhbXBsZTpcclxuICogICB7eyAxMDI0IHwgIGZpbGVTaXplfX1cclxuICogICBmb3JtYXRzIHRvOiAxIEtCXHJcbiovXHJcbkBQaXBlKHtuYW1lOiAnZmlsZVNpemUnfSlcclxuZXhwb3J0IGNsYXNzIEZpbGVTaXplUGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0ge1xyXG5cclxuICBwcml2YXRlIHVuaXRzID0gW1xyXG4gICAgJ2J5dGVzJyxcclxuICAgICdLQicsXHJcbiAgICAnTUInLFxyXG4gICAgJ0dCJyxcclxuICAgICdUQicsXHJcbiAgICAnUEInXHJcbiAgXTtcclxuXHJcbiAgdHJhbnNmb3JtKGJ5dGVzOiBudW1iZXIgPSAwLCBwcmVjaXNpb246IG51bWJlciA9IDIgKSA6IHN0cmluZyB7XHJcbiAgICBpZiAoIGlzTmFOKCBwYXJzZUZsb2F0KCBTdHJpbmcoYnl0ZXMpICkpIHx8ICEgaXNGaW5pdGUoIGJ5dGVzICkgKSByZXR1cm4gJz8nO1xyXG5cclxuICAgIGxldCB1bml0ID0gMDtcclxuXHJcbiAgICB3aGlsZSAoIGJ5dGVzID49IDEwMjQgKSB7XHJcbiAgICAgIGJ5dGVzIC89IDEwMjQ7XHJcbiAgICAgIHVuaXQgKys7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGJ5dGVzLnRvRml4ZWQoICsgcHJlY2lzaW9uICkgKyAnICcgKyB0aGlzLnVuaXRzWyB1bml0IF07XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7QWZ0ZXJWaWV3SW5pdCwgQ29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIElucHV0LCBPbkluaXQsIE91dHB1dCwgVmlld0VuY2Fwc3VsYXRpb259IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge0h0dHBDbGllbnR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHtGaW5lVXBsb2FkZXJ9IGZyb20gJ2ZpbmUtdXBsb2FkZXInO1xyXG5pbXBvcnQge05vZGVTZXJ2aWNlfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9ub2RlLnNlcnZpY2UnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdhcHAtdXBsb2FkJyxcclxuICB0ZW1wbGF0ZTogYDxkaXYgY2xhc3M9XCJiYWNrZHJvcFwiIChjbGljayk9XCJuZXdDbGlja2VkQWN0aW9uKClcIj48L2Rpdj5cclxuPGRpdiBjbGFzcz1cInVwbG9hZC1iYWNrZ3JvdW5kXCI+XHJcbiAgPGRpdiBjbGFzcz1cImJ1dHRvbnNcIj5cclxuICAgIDxidXR0b24gY2xhc3M9XCJidXR0b25cIiBbZGlzYWJsZWRdPVwibmV3Rm9sZGVyXCIgKGNsaWNrKT1cImNyZWF0ZU5ld0ZvbGRlcigpXCIgdHJhbnNsYXRlPkNyZWF0ZSBuZXcgZm9sZGVyPC9idXR0b24+XHJcbiAgPC9kaXY+XHJcblxyXG4gIDxkaXYgKm5nSWY9XCJuZXdGb2xkZXJcIj5cclxuICAgIDxkaXYgY2xhc3M9XCJidXR0b25zXCI+XHJcbiAgICAgIDxhcHAtbmV3LWZvbGRlciAoYnV0dG9uQ2xpY2tlZCk9XCJjcmVhdGVOZXdGb2xkZXIoJGV2ZW50KVwiPjwvYXBwLW5ldy1mb2xkZXI+XHJcbiAgICA8L2Rpdj5cclxuICA8L2Rpdj5cclxuXHJcbiAgPGRpdiBpZD1cImZpbmUtdXBsb2FkZXJcIj5cclxuICA8L2Rpdj5cclxuXHJcblxyXG4gIDxkaXYgY2xhc3M9XCJidXR0b25zXCI+XHJcbiAgICA8YnV0dG9uIGNsYXNzPVwiYnV0dG9uIGJpZ1wiIFtkaXNhYmxlZF09XCJ0aGlzLmNvdW50ZXIgPCAxXCIgKGNsaWNrKT1cInVwbG9hZEZpbGVzKClcIiB0cmFuc2xhdGU+XHJcbiAgICAgIFVwbG9hZFxyXG4gICAgPC9idXR0b24+XHJcbiAgICA8YnV0dG9uIGNsYXNzPVwiYnV0dG9uIGJpZ1wiIChjbGljayk9XCJuZXdDbGlja2VkQWN0aW9uKClcIiB0cmFuc2xhdGU+XHJcbiAgICAgIENsb3NlXHJcbiAgICA8L2J1dHRvbj5cclxuICA8L2Rpdj5cclxuXHJcbjwvZGl2PlxyXG5cclxuPGRpdiBpZD1cImZpbmUtdXBsb2FkZXItdGVtcGxhdGVcIiBzdHlsZT1cImRpc3BsYXk6IG5vbmU7XCI+XHJcbiAgPGRpdiBjbGFzcz1cInFxLXVwbG9hZGVyLXNlbGVjdG9yIHFxLXVwbG9hZGVyXCIgcXEtZHJvcC1hcmVhLXRleHQ9XCJEcm9wIGZpbGVzIGhlcmVcIj5cclxuICAgIDxkaXYgY2xhc3M9XCJxcS11cGxvYWQtZHJvcC1hcmVhLXNlbGVjdG9yIHFxLXVwbG9hZC1kcm9wLWFyZWFcIiBxcS1oaWRlLWRyb3B6b25lPlxyXG4gICAgICA8c3BhbiBjbGFzcz1cInFxLXVwbG9hZC1kcm9wLWFyZWEtdGV4dC1zZWxlY3RvclwiPjwvc3Bhbj5cclxuICAgIDwvZGl2PlxyXG5cclxuICAgIDxkaXYgY2xhc3M9XCJ1cGxvYWQtdG9wLWJhclwiPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwicXEtdXBsb2FkLWJ1dHRvbi1zZWxlY3RvciBxcS11cGxvYWQtYnV0dG9uXCI+XHJcbiAgICAgICAgPGRpdiB0cmFuc2xhdGU+VXBsb2FkIGEgZmlsZTwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuXHJcbiAgICAgIDxkaXYgY2xhc3M9XCJxcS10b3RhbC1wcm9ncmVzcy1iYXItY29udGFpbmVyLXNlbGVjdG9yIHFxLXRvdGFsLXByb2dyZXNzLWJhci1jb250YWluZXJcIj5cclxuICAgICAgICA8ZGl2IHJvbGU9XCJwcm9ncmVzc2JhclwiIGFyaWEtdmFsdWVub3c9XCIwXCIgYXJpYS12YWx1ZW1pbj1cIjBcIiBhcmlhLXZhbHVlbWF4PVwiMTAwXCJcclxuICAgICAgICAgICAgIGNsYXNzPVwicXEtdG90YWwtcHJvZ3Jlc3MtYmFyLXNlbGVjdG9yIHFxLXByb2dyZXNzLWJhciBxcS10b3RhbC1wcm9ncmVzcy1iYXJcIj48L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuXHJcbiAgICA8c3BhbiBjbGFzcz1cInFxLWRyb3AtcHJvY2Vzc2luZy1zZWxlY3RvciBxcS1kcm9wLXByb2Nlc3NpbmdcIj5cclxuICAgICAgICAgICAgPHNwYW4gdHJhbnNsYXRlPlByb2Nlc3NpbmcgZHJvcHBlZCBmaWxlczwvc3Bhbj4uLi5cclxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJxcS1kcm9wLXByb2Nlc3Npbmctc3Bpbm5lci1zZWxlY3RvciBxcS1kcm9wLXByb2Nlc3Npbmctc3Bpbm5lclwiPjwvc3Bhbj5cclxuICAgIDwvc3Bhbj5cclxuXHJcbiAgICA8dWwgY2xhc3M9XCJxcS11cGxvYWQtbGlzdC1zZWxlY3RvciBxcS11cGxvYWQtbGlzdFwiIGFyaWEtbGl2ZT1cInBvbGl0ZVwiIGFyaWEtcmVsZXZhbnQ9XCJhZGRpdGlvbnMgcmVtb3ZhbHNcIj5cclxuICAgICAgPGxpPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJxcS1wcm9ncmVzcy1iYXItY29udGFpbmVyLXNlbGVjdG9yXCI+XHJcbiAgICAgICAgICA8ZGl2IHJvbGU9XCJwcm9ncmVzc2JhclwiIGFyaWEtdmFsdWVub3c9XCIwXCIgYXJpYS12YWx1ZW1pbj1cIjBcIiBhcmlhLXZhbHVlbWF4PVwiMTAwXCJcclxuICAgICAgICAgICAgICAgY2xhc3M9XCJxcS1wcm9ncmVzcy1iYXItc2VsZWN0b3IgcXEtcHJvZ3Jlc3MtYmFyXCI+PC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPHNwYW4gY2xhc3M9XCJxcS11cGxvYWQtc3Bpbm5lci1zZWxlY3RvciBxcS11cGxvYWQtc3Bpbm5lclwiPjwvc3Bhbj5cclxuICAgICAgICA8aW1nIGNsYXNzPVwicXEtdGh1bWJuYWlsLXNlbGVjdG9yXCIgcXEtbWF4LXNpemU9XCIxMDBcIiBxcS1zZXJ2ZXItc2NhbGU+XHJcbiAgICAgICAgPHNwYW4gY2xhc3M9XCJxcS11cGxvYWQtZmlsZS1zZWxlY3RvciBxcS11cGxvYWQtZmlsZVwiPjwvc3Bhbj5cclxuICAgICAgICA8c3BhbiBjbGFzcz1cInFxLWVkaXQtZmlsZW5hbWUtaWNvbi1zZWxlY3RvciBxcS1lZGl0LWZpbGVuYW1lLWljb25cIiBhcmlhLWxhYmVsPVwiRWRpdCBmaWxlbmFtZVwiPjwvc3Bhbj5cclxuICAgICAgICA8aW5wdXQgY2xhc3M9XCJxcS1lZGl0LWZpbGVuYW1lLXNlbGVjdG9yIHFxLWVkaXQtZmlsZW5hbWVcIiB0YWJpbmRleD1cIjBcIiB0eXBlPVwidGV4dFwiPlxyXG4gICAgICAgIDxzcGFuIGNsYXNzPVwicXEtdXBsb2FkLXNpemUtc2VsZWN0b3IgcXEtdXBsb2FkLXNpemVcIj48L3NwYW4+XHJcbiAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJxcS1idG4gcXEtdXBsb2FkLWNhbmNlbC1zZWxlY3RvciBxcS11cGxvYWQtY2FuY2VsXCIgdHJhbnNsYXRlPkNhbmNlbDwvYnV0dG9uPlxyXG4gICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwicXEtYnRuIHFxLXVwbG9hZC1yZXRyeS1zZWxlY3RvciBxcS11cGxvYWQtcmV0cnlcIiB0cmFuc2xhdGU+UmV0cnk8L2J1dHRvbj5cclxuICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInFxLWJ0biBxcS11cGxvYWQtZGVsZXRlLXNlbGVjdG9yIHFxLXVwbG9hZC1kZWxldGVcIiB0cmFuc2xhdGU+RGVsZXRlPC9idXR0b24+XHJcbiAgICAgICAgPHNwYW4gcm9sZT1cInN0YXR1c1wiIGNsYXNzPVwicXEtdXBsb2FkLXN0YXR1cy10ZXh0LXNlbGVjdG9yIHFxLXVwbG9hZC1zdGF0dXMtdGV4dFwiPjwvc3Bhbj5cclxuICAgICAgPC9saT5cclxuICAgIDwvdWw+XHJcblxyXG4gICAgPGRpYWxvZyBjbGFzcz1cInFxLWFsZXJ0LWRpYWxvZy1zZWxlY3RvclwiPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwicXEtZGlhbG9nLW1lc3NhZ2Utc2VsZWN0b3JcIj48L2Rpdj5cclxuICAgICAgPGRpdiBjbGFzcz1cInFxLWRpYWxvZy1idXR0b25zXCI+XHJcbiAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJxcS1jYW5jZWwtYnV0dG9uLXNlbGVjdG9yXCIgdHJhbnNsYXRlPkNsb3NlPC9idXR0b24+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaWFsb2c+XHJcblxyXG4gICAgPGRpYWxvZyBjbGFzcz1cInFxLWNvbmZpcm0tZGlhbG9nLXNlbGVjdG9yXCI+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJxcS1kaWFsb2ctbWVzc2FnZS1zZWxlY3RvclwiPjwvZGl2PlxyXG4gICAgICA8ZGl2IGNsYXNzPVwicXEtZGlhbG9nLWJ1dHRvbnNcIj5cclxuICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInFxLWNhbmNlbC1idXR0b24tc2VsZWN0b3JcIiB0cmFuc2xhdGU+Tm88L2J1dHRvbj5cclxuICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInFxLW9rLWJ1dHRvbi1zZWxlY3RvclwiIHRyYW5zbGF0ZT5ZZXM8L2J1dHRvbj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2RpYWxvZz5cclxuXHJcbiAgICA8ZGlhbG9nIGNsYXNzPVwicXEtcHJvbXB0LWRpYWxvZy1zZWxlY3RvclwiPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwicXEtZGlhbG9nLW1lc3NhZ2Utc2VsZWN0b3JcIj48L2Rpdj5cclxuICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCI+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJxcS1kaWFsb2ctYnV0dG9uc1wiPlxyXG4gICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwicXEtY2FuY2VsLWJ1dHRvbi1zZWxlY3RvclwiIHRyYW5zbGF0ZT5DYW5jZWw8L2J1dHRvbj5cclxuICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInFxLW9rLWJ1dHRvbi1zZWxlY3RvclwiIHRyYW5zbGF0ZT5PazwvYnV0dG9uPlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGlhbG9nPlxyXG4gIDwvZGl2PlxyXG48L2Rpdj5cclxuYCxcclxuICBzdHlsZXM6IFtgLnVwbG9hZC1jb250ZW50e3RleHQtYWxpZ246Y2VudGVyO21heC1oZWlnaHQ6MjV2aDtvdmVyZmxvdzphdXRvO21hcmdpbjoxMHB4IGF1dG99LmZhLXRpbWVzOmJlZm9yZXtjb250ZW50OlwiXFxcXGYwMGRcIn0uYnV0dG9uc3tiYWNrZ3JvdW5kOiNmZmY7cGFkZGluZzo1cHg7bWFyZ2luOjEwcHggMH1gLCBgLnFxLXVwbG9hZC1idXR0b24gZGl2e2xpbmUtaGVpZ2h0OjI1cHh9LnFxLXVwbG9hZC1idXR0b24tZm9jdXN7b3V0bGluZTowfS5xcS11cGxvYWRlcntwb3NpdGlvbjpyZWxhdGl2ZTttaW4taGVpZ2h0OjIwMHB4O21heC1oZWlnaHQ6NDkwcHg7b3ZlcmZsb3cteTpoaWRkZW47d2lkdGg6aW5oZXJpdDtib3JkZXItcmFkaXVzOjZweDtiYWNrZ3JvdW5kLWNvbG9yOiNmZGZkZmQ7Ym9yZGVyOjFweCBkYXNoZWQgI2NjYztwYWRkaW5nOjIwcHh9LnFxLXVwbG9hZGVyOmJlZm9yZXtjb250ZW50OmF0dHIocXEtZHJvcC1hcmVhLXRleHQpIFwiIFwiO3Bvc2l0aW9uOmFic29sdXRlO2ZvbnQtc2l6ZToyMDAlO2xlZnQ6MDt3aWR0aDoxMDAlO3RleHQtYWxpZ246Y2VudGVyO3RvcDo0NSU7b3BhY2l0eTouMjV9LnFxLXVwbG9hZC1kcm9wLWFyZWEsLnFxLXVwbG9hZC1leHRyYS1kcm9wLWFyZWF7cG9zaXRpb246YWJzb2x1dGU7dG9wOjA7bGVmdDowO3dpZHRoOjEwMCU7aGVpZ2h0OjEwMCU7bWluLWhlaWdodDozMHB4O3otaW5kZXg6MjtiYWNrZ3JvdW5kOiNmOWY5Zjk7Ym9yZGVyLXJhZGl1czo0cHg7Ym9yZGVyOjFweCBkYXNoZWQgI2NjYzt0ZXh0LWFsaWduOmNlbnRlcn0ucXEtdXBsb2FkLWRyb3AtYXJlYSBzcGFue2Rpc3BsYXk6YmxvY2s7cG9zaXRpb246YWJzb2x1dGU7dG9wOjUwJTt3aWR0aDoxMDAlO21hcmdpbi10b3A6LThweDtmb250LXNpemU6MTZweH0ucXEtdXBsb2FkLWV4dHJhLWRyb3AtYXJlYXtwb3NpdGlvbjpyZWxhdGl2ZTttYXJnaW4tdG9wOjUwcHg7Zm9udC1zaXplOjE2cHg7cGFkZGluZy10b3A6MzBweDtoZWlnaHQ6MjBweDttaW4taGVpZ2h0OjQwcHh9LnFxLXVwbG9hZC1kcm9wLWFyZWEtYWN0aXZle2JhY2tncm91bmQ6I2ZkZmRmZDtib3JkZXItcmFkaXVzOjRweDtib3JkZXI6MXB4IGRhc2hlZCAjY2NjfS5xcS11cGxvYWQtbGlzdHttYXJnaW46MDtwYWRkaW5nOjA7bGlzdC1zdHlsZTpub25lO21heC1oZWlnaHQ6NDUwcHg7b3ZlcmZsb3cteTphdXRvO2NsZWFyOmJvdGh9LnFxLXVwbG9hZC1saXN0IGxpe21hcmdpbjowO3BhZGRpbmc6OXB4O2xpbmUtaGVpZ2h0OjE1cHg7Zm9udC1zaXplOjE2cHg7Y29sb3I6IzQyNDI0MjtiYWNrZ3JvdW5kLWNvbG9yOiNmNmY2ZjY7Ym9yZGVyLXRvcDoxcHggc29saWQgI2ZmZjtib3JkZXItYm90dG9tOjFweCBzb2xpZCAjZGRkfS5xcS11cGxvYWQtbGlzdCBsaTpmaXJzdC1jaGlsZHtib3JkZXItdG9wOm5vbmV9LnFxLXVwbG9hZC1saXN0IGxpOmxhc3QtY2hpbGR7Ym9yZGVyLWJvdHRvbTpub25lfS5xcS11cGxvYWQtY2FuY2VsLC5xcS11cGxvYWQtY29udGludWUsLnFxLXVwbG9hZC1kZWxldGUsLnFxLXVwbG9hZC1mYWlsZWQtdGV4dCwucXEtdXBsb2FkLWZpbGUsLnFxLXVwbG9hZC1wYXVzZSwucXEtdXBsb2FkLXJldHJ5LC5xcS11cGxvYWQtc2l6ZSwucXEtdXBsb2FkLXNwaW5uZXJ7bWFyZ2luLXJpZ2h0OjEycHg7ZGlzcGxheTppbmxpbmV9LnFxLXVwbG9hZC1maWxle3ZlcnRpY2FsLWFsaWduOm1pZGRsZTtkaXNwbGF5OmlubGluZS1ibG9jazt3aWR0aDozMDBweDt0ZXh0LW92ZXJmbG93OmVsbGlwc2lzO3doaXRlLXNwYWNlOm5vd3JhcDtvdmVyZmxvdy14OmhpZGRlbjtoZWlnaHQ6MThweH0ucXEtdXBsb2FkLXNwaW5uZXJ7ZGlzcGxheTppbmxpbmUtYmxvY2s7YmFja2dyb3VuZDp1cmwobG9hZGluZy5naWYpO3dpZHRoOjE1cHg7aGVpZ2h0OjE1cHg7dmVydGljYWwtYWxpZ246dGV4dC1ib3R0b219LnFxLWRyb3AtcHJvY2Vzc2luZ3tkaXNwbGF5OmJsb2NrfS5xcS1kcm9wLXByb2Nlc3Npbmctc3Bpbm5lcntkaXNwbGF5OmlubGluZS1ibG9jaztiYWNrZ3JvdW5kOnVybChwcm9jZXNzaW5nLmdpZik7d2lkdGg6MjRweDtoZWlnaHQ6MjRweDt2ZXJ0aWNhbC1hbGlnbjp0ZXh0LWJvdHRvbX0ucXEtdXBsb2FkLWNhbmNlbCwucXEtdXBsb2FkLWNvbnRpbnVlLC5xcS11cGxvYWQtZGVsZXRlLC5xcS11cGxvYWQtcGF1c2UsLnFxLXVwbG9hZC1yZXRyeSwucXEtdXBsb2FkLXNpemV7Zm9udC1zaXplOjEycHg7Zm9udC13ZWlnaHQ6NDAwO2N1cnNvcjpwb2ludGVyO3ZlcnRpY2FsLWFsaWduOm1pZGRsZX0ucXEtdXBsb2FkLXN0YXR1cy10ZXh0e2ZvbnQtc2l6ZToxNHB4O2ZvbnQtd2VpZ2h0OjcwMDtkaXNwbGF5OmJsb2NrfS5xcS11cGxvYWQtZmFpbGVkLXRleHR7ZGlzcGxheTpub25lO2ZvbnQtc3R5bGU6aXRhbGljO2ZvbnQtd2VpZ2h0OjcwMH0ucXEtdXBsb2FkLWZhaWxlZC1pY29ue2Rpc3BsYXk6bm9uZTt3aWR0aDoxNXB4O2hlaWdodDoxNXB4O3ZlcnRpY2FsLWFsaWduOnRleHQtYm90dG9tfS5xcS11cGxvYWQtZmFpbCAucXEtdXBsb2FkLWZhaWxlZC10ZXh0LC5xcS11cGxvYWQtcmV0cnlpbmcgLnFxLXVwbG9hZC1mYWlsZWQtdGV4dHtkaXNwbGF5OmlubGluZX0ucXEtdXBsb2FkLWxpc3QgbGkucXEtdXBsb2FkLXN1Y2Nlc3N7YmFja2dyb3VuZC1jb2xvcjojZWJmNmUwO2NvbG9yOiM0MjQyNDI7Ym9yZGVyLWJvdHRvbToxcHggc29saWQgI2QzZGVkMTtib3JkZXItdG9wOjFweCBzb2xpZCAjZjdmZmY1fS5xcS11cGxvYWQtbGlzdCBsaS5xcS11cGxvYWQtZmFpbHtiYWNrZ3JvdW5kLWNvbG9yOiNmNWQ3ZDc7Y29sb3I6IzQyNDI0Mjtib3JkZXItYm90dG9tOjFweCBzb2xpZCAjZGVjYWNhO2JvcmRlci10b3A6MXB4IHNvbGlkICNmY2U2ZTZ9LnFxLXRvdGFsLXByb2dyZXNzLWJhcntoZWlnaHQ6MjVweDtib3JkZXItcmFkaXVzOjlweH1JTlBVVC5xcS1lZGl0LWZpbGVuYW1le3Bvc2l0aW9uOmFic29sdXRlO29wYWNpdHk6MDt6LWluZGV4Oi0xfS5xcS11cGxvYWQtZmlsZS5xcS1lZGl0YWJsZXtjdXJzb3I6cG9pbnRlcjttYXJnaW4tcmlnaHQ6NHB4fS5xcS1lZGl0LWZpbGVuYW1lLWljb24ucXEtZWRpdGFibGV7ZGlzcGxheTppbmxpbmUtYmxvY2s7Y3Vyc29yOnBvaW50ZXJ9SU5QVVQucXEtZWRpdC1maWxlbmFtZS5xcS1lZGl0aW5ne3Bvc2l0aW9uOnN0YXRpYztoZWlnaHQ6MjhweDtwYWRkaW5nOjAgOHB4O21hcmdpbi1yaWdodDoxMHB4O21hcmdpbi1ib3R0b206LTVweDtib3JkZXI6MXB4IHNvbGlkICNjY2M7Ym9yZGVyLXJhZGl1czoycHg7Zm9udC1zaXplOjE2cHg7b3BhY2l0eToxfS5xcS1lZGl0LWZpbGVuYW1lLWljb257ZGlzcGxheTpub25lO2JhY2tncm91bmQ6dXJsKGVkaXQuZ2lmKTt3aWR0aDoxNXB4O2hlaWdodDoxNXB4O3ZlcnRpY2FsLWFsaWduOnRleHQtYm90dG9tO21hcmdpbi1yaWdodDoxNnB4fS5xcS1oaWRle2Rpc3BsYXk6bm9uZX0ucXEtdGh1bWJuYWlsLXNlbGVjdG9ye3ZlcnRpY2FsLWFsaWduOm1pZGRsZTttYXJnaW4tcmlnaHQ6MTJweH0ucXEtdXBsb2FkZXIgRElBTE9He2Rpc3BsYXk6bm9uZX0ucXEtdXBsb2FkZXIgRElBTE9HW29wZW5de2Rpc3BsYXk6YmxvY2t9LnFxLXVwbG9hZGVyIERJQUxPRyAucXEtZGlhbG9nLWJ1dHRvbnN7dGV4dC1hbGlnbjpjZW50ZXI7cGFkZGluZy10b3A6MTBweH0ucXEtdXBsb2FkZXIgRElBTE9HIC5xcS1kaWFsb2ctYnV0dG9ucyBCVVRUT057bWFyZ2luLWxlZnQ6NXB4O21hcmdpbi1yaWdodDo1cHh9LnFxLXVwbG9hZGVyIERJQUxPRyAucXEtZGlhbG9nLW1lc3NhZ2Utc2VsZWN0b3J7cGFkZGluZy1ib3R0b206MTBweH0ucXEtdXBsb2FkZXIgRElBTE9HOjotd2Via2l0LWJhY2tkcm9we2JhY2tncm91bmQtY29sb3I6cmdiYSgwLDAsMCwuNyl9LnFxLXVwbG9hZGVyIERJQUxPRzo6YmFja2Ryb3B7YmFja2dyb3VuZC1jb2xvcjpyZ2JhKDAsMCwwLC43KX1gXSxcclxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBVcGxvYWRDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIEFmdGVyVmlld0luaXQge1xyXG4gIEBJbnB1dCgpIG9wZW5EaWFsb2c7XHJcblxyXG4gIEBPdXRwdXQoKSBjbG9zZURpYWxvZyA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICBAT3V0cHV0KCkgY3JlYXRlRGlyID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICB1cGxvYWRlcjogRmluZVVwbG9hZGVyO1xyXG4gIG5ld0ZvbGRlciA9IGZhbHNlO1xyXG4gIGNvdW50ZXIgPSAwO1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQsXHJcbiAgICAgICAgICAgICAgcHJpdmF0ZSBub2RlU2VydmljZTogTm9kZVNlcnZpY2UpIHtcclxuICB9XHJcblxyXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcclxuICAgIHRoaXMudXBsb2FkZXIgPSBuZXcgRmluZVVwbG9hZGVyKHtcclxuICAgICAgZGVidWc6IGZhbHNlLFxyXG4gICAgICBhdXRvVXBsb2FkOiBmYWxzZSxcclxuICAgICAgbWF4Q29ubmVjdGlvbnM6IDEsIC8vIHRvZG8gY29uZmlndXJhYmxlXHJcbiAgICAgIGVsZW1lbnQ6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmaW5lLXVwbG9hZGVyJyksXHJcbiAgICAgIHRlbXBsYXRlOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmluZS11cGxvYWRlci10ZW1wbGF0ZScpLFxyXG4gICAgICByZXF1ZXN0OiB7XHJcbiAgICAgICAgZW5kcG9pbnQ6IHRoaXMubm9kZVNlcnZpY2UudHJlZS5jb25maWcuYmFzZVVSTCArIHRoaXMubm9kZVNlcnZpY2UudHJlZS5jb25maWcuYXBpLnVwbG9hZEZpbGUsXHJcbiAgICAgICAgLy8gZm9yY2VNdWx0aXBhcnQ6IGZhbHNlLFxyXG4gICAgICAgIHBhcmFtc0luQm9keTogZmFsc2UsXHJcbiAgICAgICAgcGFyYW1zOiB7XHJcbiAgICAgICAgICBwYXJlbnRQYXRoOiB0aGlzLmdldEN1cnJlbnRQYXRoXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICByZXRyeToge1xyXG4gICAgICAgIGVuYWJsZUF1dG86IGZhbHNlXHJcbiAgICAgIH0sXHJcbiAgICAgIGNhbGxiYWNrczoge1xyXG4gICAgICAgIG9uU3VibWl0dGVkOiAoKSA9PiB0aGlzLmNvdW50ZXIrKyxcclxuICAgICAgICBvbkNhbmNlbDogKCkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5jb3VudGVyIDwgMCA/IGNvbnNvbGUud2Fybignd3RmPycpIDogdGhpcy5jb3VudGVyLS07XHJcbiAgICAgICAgfSxcclxuICAgICAgICBvbkFsbENvbXBsZXRlOiAoc3VjYzogYW55LCBmYWlsOiBhbnkpID0+IHtcclxuICAgICAgICAgIGlmIChzdWNjLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgdGhpcy5jb3VudGVyID0gMDtcclxuICAgICAgICAgICAgdGhpcy5ub2RlU2VydmljZS5yZWZyZXNoQ3VycmVudFBhdGgoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgICA7XHJcbiAgfVxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICB9XHJcblxyXG4gIGdldCBnZXRDdXJyZW50UGF0aCgpIHtcclxuICAgIGNvbnN0IHBhcmVudFBhdGggPSB0aGlzLm5vZGVTZXJ2aWNlLmZpbmROb2RlQnlQYXRoKHRoaXMubm9kZVNlcnZpY2UuY3VycmVudFBhdGgpLmlkO1xyXG4gICAgcmV0dXJuIHBhcmVudFBhdGggPT09IDAgPyAnJyA6IHBhcmVudFBhdGg7XHJcbiAgfVxyXG5cclxuICB1cGxvYWRGaWxlcygpIHtcclxuICAgIHRoaXMudXBsb2FkZXIudXBsb2FkU3RvcmVkRmlsZXMoKTtcclxuICB9XHJcblxyXG4gIGNyZWF0ZU5ld0ZvbGRlcihpbnB1dD86IHN0cmluZykge1xyXG4gICAgaWYgKCF0aGlzLm5ld0ZvbGRlcikge1xyXG4gICAgICB0aGlzLm5ld0ZvbGRlciA9IHRydWU7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLm5ld0ZvbGRlciA9IGZhbHNlO1xyXG4gICAgICBpZiAoaW5wdXQubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIHRoaXMuY3JlYXRlRGlyLmVtaXQoaW5wdXQpO1xyXG4gICAgICAgIHRoaXMubmV3Q2xpY2tlZEFjdGlvbigpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBuZXdDbGlja2VkQWN0aW9uKCkge1xyXG4gICAgdGhpcy51cGxvYWRlci5jYW5jZWxBbGwoKTtcclxuICAgIHRoaXMuY2xvc2VEaWFsb2cuZW1pdCgpO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQge0NvbXBvbmVudCwgRWxlbWVudFJlZiwgRXZlbnRFbWl0dGVyLCBPbkluaXQsIE91dHB1dCwgVmlld0NoaWxkfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtffSBmcm9tICdAYmllc2JqZXJnL25neC10cmFuc2xhdGUtZXh0cmFjdC9kaXN0L3V0aWxzL3V0aWxzJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnYXBwLW5ldy1mb2xkZXInLFxyXG4gIHRlbXBsYXRlOiBgPHAgY2xhc3M9XCJuZXctZm9sZGVyLWRlc2NyaXB0aW9uXCIgdHJhbnNsYXRlPlR5cGUgbmV3IGZvbGRlciBuYW1lPC9wPlxyXG48aW5wdXQgI3VwbG9hZEZvbGRlciBwbGFjZWhvbGRlcj1cInt7J0ZvbGRlciBuYW1lJ319XCIgKGtleXVwKT1cIm9uSW5wdXRDaGFuZ2UoJGV2ZW50KVwiXHJcbiAgICAgICAoa2V5dXAuZW50ZXIpPVwib25DbGljaygpXCIgb25jbGljaz1cInRoaXMuc2VsZWN0KCk7XCIgdHlwZT1cInRleHRcIiBjbGFzcz1cIm5ldy1mb2xkZXItaW5wdXRcIi8+XHJcbjxidXR0b24gY2xhc3M9XCJidXR0b24gbmV3LWZvbGRlci1zZW5kXCIgKGNsaWNrKT1cIm9uQ2xpY2soKVwiPnt7YnV0dG9uVGV4dH19PC9idXR0b24+XHJcbmAsXHJcbiAgc3R5bGVzOiBbYC5uZXctZm9sZGVyLWRlc2NyaXB0aW9ue21hcmdpbjowIGF1dG87cGFkZGluZzowfWBdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBOZXdGb2xkZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG4gIEBWaWV3Q2hpbGQoJ3VwbG9hZEZvbGRlcicpIHVwbG9hZEZvbGRlcjogRWxlbWVudFJlZjtcclxuICBAT3V0cHV0KCkgYnV0dG9uQ2xpY2tlZCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgYnV0dG9uVGV4dCA9IF8oJ0Nsb3NlJykudG9TdHJpbmcoKTtcclxuICBpbnB1dFZhbHVlID0gJyc7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gIH1cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgfVxyXG5cclxuICBvbkNsaWNrKCkge1xyXG4gICAgY29uc3QgZWw6IEhUTUxFbGVtZW50ID0gKHRoaXMudXBsb2FkRm9sZGVyLm5hdGl2ZUVsZW1lbnQgYXMgSFRNTEVsZW1lbnQpO1xyXG4gICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgdGhpcy5idXR0b25DbGlja2VkLmVtaXQoZWwudmFsdWUpO1xyXG4gIH1cclxuXHJcbiAgb25JbnB1dENoYW5nZShldmVudDogYW55KSB7XHJcbiAgICB0aGlzLmlucHV0VmFsdWUgPSBldmVudC50YXJnZXQudmFsdWU7XHJcbiAgICBpZiAodGhpcy5pbnB1dFZhbHVlLmxlbmd0aCA+IDApIHtcclxuICAgICAgdGhpcy5idXR0b25UZXh0ID0gXygnQ29uZmlybScpLnRvU3RyaW5nKCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmJ1dHRvblRleHQgPSBfKCdDbG9zZScpLnRvU3RyaW5nKCk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7Q29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIElucHV0LCBPbkluaXQsIE91dHB1dCwgVGVtcGxhdGVSZWYsIFZpZXdFbmNhcHN1bGF0aW9ufSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtOb2RlSW50ZXJmYWNlfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzL25vZGUuaW50ZXJmYWNlJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnYXBwLXNpZGUtdmlldycsXHJcbiAgdGVtcGxhdGU6IGA8ZGl2IGNsYXNzPVwic2lkZS12aWV3XCIgKm5nSWY9XCJub2RlXCI+XHJcbiAgPGRpdiBjbGFzcz1cInNpZGUtdmlldy1wcmV2aWV3XCI+XHJcbiAgICA8aSAoY2xpY2spPVwib25DbGljaygkZXZlbnQsICdjbG9zZVNpZGVWaWV3JylcIiBjbGFzcz1cImZhcyBmYS10aW1lcyBzaWRlLXZpZXctY2xvc2VcIj48L2k+XHJcblxyXG4gICAgPGRpdiBjbGFzcz1cInNpZGUtdmlldy1wcmV2aWV3LXRpdGxlXCI+e3tub2RlLm5hbWV9fTwvZGl2PlxyXG5cclxuICAgIDxkaXYgY2xhc3M9XCJzaWRlLXZpZXctcHJldmlldy1jb250ZW50XCI+XHJcbiAgICAgIDxuZy1jb250YWluZXJcclxuICAgICAgICBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwieyRpbXBsaWNpdDogbm9kZX1cIlxyXG4gICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0XT1cInNpZGVWaWV3VGVtcGxhdGVcIj5cclxuICAgICAgPC9uZy1jb250YWluZXI+XHJcbiAgICA8L2Rpdj5cclxuXHJcbiAgICA8ZGl2IGNsYXNzPVwic2lkZS12aWV3LWJ1dHRvbnNcIj5cclxuICAgICAgPGJ1dHRvbiAoY2xpY2spPVwib25DbGljaygkZXZlbnQsICdkb3dubG9hZCcpXCIgY2xhc3M9XCJidXR0b25cIlxyXG4gICAgICAgICAgICAgIFtkaXNhYmxlZF09XCIhYWxsb3dGb2xkZXJEb3dubG9hZCAmJiBub2RlLmlzRm9sZGVyXCIgdHJhbnNsYXRlPlxyXG4gICAgICAgIERvd25sb2FkXHJcbiAgICAgIDwvYnV0dG9uPlxyXG4gICAgICA8YnV0dG9uIChjbGljayk9XCJvbkNsaWNrKCRldmVudCwgJ3JlbmFtZUNvbmZpcm0nKVwiIGNsYXNzPVwiYnV0dG9uXCIgdHJhbnNsYXRlPlJlbmFtZTwvYnV0dG9uPlxyXG4gICAgICA8YnV0dG9uIChjbGljayk9XCJvbkNsaWNrKCRldmVudCwgJ3JlbW92ZUFzaycpXCIgY2xhc3M9XCJidXR0b25cIiB0cmFuc2xhdGU+RGVsZXRlPC9idXR0b24+XHJcbiAgICA8L2Rpdj5cclxuICA8L2Rpdj5cclxuPC9kaXY+XHJcbmAsXHJcbiAgc3R5bGVzOiBbYC5zaWRlLXZpZXctY2xvc2V7cG9zaXRpb246YWJzb2x1dGU7Y3Vyc29yOnBvaW50ZXI7dG9wOjA7cmlnaHQ6MDtwYWRkaW5nOjE1cHh9LnNpZGUtdmlldy1idXR0b25ze3dpZHRoOjEwMCU7ZGlzcGxheTotd2Via2l0LWZsZXg7ZGlzcGxheTpmbGV4Oy13ZWJraXQtanVzdGlmeS1jb250ZW50OmNlbnRlcjtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyOy13ZWJraXQtZmxleC1mbG93OmNvbHVtbjtmbGV4LWZsb3c6Y29sdW1ufS5zaWRlLXZpZXctYnV0dG9ucyAuYnV0dG9ue21hcmdpbjo1cHggMH1gXSxcclxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBTaWRlVmlld0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcbiAgQElucHV0KCkgc2lkZVZpZXdUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcclxuXHJcbiAgQElucHV0KCkgbm9kZTogTm9kZUludGVyZmFjZTtcclxuICBASW5wdXQoKSBhbGxvd0ZvbGRlckRvd25sb2FkID0gZmFsc2U7XHJcblxyXG4gIEBPdXRwdXQoKSBjbGlja0V2ZW50ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICB9XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gIH1cclxuXHJcbiAgb25DbGljayhldmVudDogYW55LCB0eXBlOiBzdHJpbmcpIHtcclxuICAgIHRoaXMuY2xpY2tFdmVudC5lbWl0KHt0eXBlOiB0eXBlLCBldmVudDogZXZlbnQsIG5vZGU6IHRoaXMubm9kZX0pO1xyXG4gIH1cclxuXHJcbn1cclxuIiwiaW1wb3J0IHtDb21wb25lbnQsIE9uSW5pdCwgVmlld0VuY2Fwc3VsYXRpb259IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge05vZGVDbGlja2VkU2VydmljZX0gZnJvbSAnLi4vLi4vc2VydmljZXMvbm9kZS1jbGlja2VkLnNlcnZpY2UnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdhcHAtbmF2aWdhdGlvbicsXHJcbiAgdGVtcGxhdGU6IGA8ZGl2IGNsYXNzPVwibmF2aWdhdGlvbi1jb21wb25lbnRcIj5cclxuICA8aW5wdXQgI2lucHV0IGNsYXNzPVwibmF2aWdhdGlvbi1zZWFyY2hcIiBvbmNsaWNrPVwidGhpcy5zZWxlY3QoKTtcIiAoa2V5dXAuZW50ZXIpPVwib25DbGljayhpbnB1dC52YWx1ZSlcIlxyXG4gICAgICAgICBwbGFjZWhvbGRlcj1cInt7J1NlYXJjaCd9fVwiPlxyXG5cclxuICA8YnV0dG9uIFtkaXNhYmxlZF09XCJpbnB1dC52YWx1ZS5sZW5ndGggPT09IDBcIiBjbGFzcz1cIm5hdmlnYXRpb24tc2VhcmNoLWljb25cIiAoY2xpY2spPVwib25DbGljayhpbnB1dC52YWx1ZSlcIj5cclxuICAgIDxpIGNsYXNzPVwiZmFzIGZhLXNlYXJjaFwiPjwvaT5cclxuICA8L2J1dHRvbj5cclxuXHJcbiAgPGRpdj5cclxuICAgIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cclxuICA8L2Rpdj5cclxuPC9kaXY+XHJcblxyXG5cclxuYCxcclxuICBzdHlsZXM6IFtgLm5hdmlnYXRpb24tY29tcG9uZW50e2Rpc3BsYXk6LXdlYmtpdC1mbGV4O2Rpc3BsYXk6ZmxleH1gXSxcclxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBOYXZpZ2F0aW9uQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwcml2YXRlIG5vZGVDbGlja2VkU2VydmljZTogTm9kZUNsaWNrZWRTZXJ2aWNlXHJcbiAgKSB7XHJcbiAgfVxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICB9XHJcblxyXG4gIG9uQ2xpY2soaW5wdXQ6IHN0cmluZykge1xyXG4gICAgdGhpcy5ub2RlQ2xpY2tlZFNlcnZpY2Uuc2VhcmNoRm9yU3RyaW5nKGlucHV0KTtcclxuICB9XHJcbn1cclxuIiwiLy8gaW1wb3J0IHtNb2R1bGVXaXRoUHJvdmlkZXJzLCBOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7TmdNb2R1bGUsIEluamVjdGlvblRva2VuLCBNb2R1bGVXaXRoUHJvdmlkZXJzfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XHJcbmltcG9ydCB7RmlsZU1hbmFnZXJDb21wb25lbnR9IGZyb20gJy4vZmlsZS1tYW5hZ2VyLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7Rm9sZGVyQ29udGVudENvbXBvbmVudH0gZnJvbSAnLi9jb21wb25lbnRzL2ZvbGRlci1jb250ZW50L2ZvbGRlci1jb250ZW50LmNvbXBvbmVudCc7XHJcbmltcG9ydCB7VHJlZUNvbXBvbmVudH0gZnJvbSAnLi9jb21wb25lbnRzL3RyZWUvdHJlZS5jb21wb25lbnQnO1xyXG5pbXBvcnQge05vZGVMaXN0ZXJDb21wb25lbnR9IGZyb20gJy4vY29tcG9uZW50cy90cmVlL25vZGUtbGlzdGVyL25vZGUtbGlzdGVyLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7Tm9kZUNvbXBvbmVudH0gZnJvbSAnLi9jb21wb25lbnRzL2Z1bmN0aW9ucy9ub2RlL25vZGUuY29tcG9uZW50JztcclxuaW1wb3J0IHtNYXBUb0l0ZXJhYmxlUGlwZX0gZnJvbSAnLi9waXBlcy9tYXAtdG8taXRlcmFibGUucGlwZSc7XHJcbmltcG9ydCB7SHR0cENsaWVudCwgSHR0cENsaWVudE1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQge1N0b3JlTW9kdWxlLCBBY3Rpb25SZWR1Y2VyTWFwfSBmcm9tICdAbmdyeC9zdG9yZSc7XHJcbmltcG9ydCB7TmF2QmFyQ29tcG9uZW50fSBmcm9tICcuL2NvbXBvbmVudHMvbmF2LWJhci9uYXYtYmFyLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7cmVkdWNlcnMsIEFwcFN0b3JlfSBmcm9tICcuL3JlZHVjZXJzL3JlZHVjZXIuZmFjdG9yeSc7XHJcbmltcG9ydCB7TG9hZGluZ092ZXJsYXlDb21wb25lbnR9IGZyb20gJy4vY29tcG9uZW50cy9mdW5jdGlvbnMvbG9hZGluZy1vdmVybGF5L2xvYWRpbmctb3ZlcmxheS5jb21wb25lbnQnO1xyXG5pbXBvcnQge0ZpbGVTaXplUGlwZX0gZnJvbSAnLi9waXBlcy9maWxlLXNpemUucGlwZSc7XHJcbmltcG9ydCB7VXBsb2FkQ29tcG9uZW50fSBmcm9tICcuL2NvbXBvbmVudHMvZnVuY3Rpb25zL3VwbG9hZC91cGxvYWQuY29tcG9uZW50JztcclxuaW1wb3J0IHtOZXdGb2xkZXJDb21wb25lbnR9IGZyb20gJy4vY29tcG9uZW50cy9mdW5jdGlvbnMvdXBsb2FkL25ldy1mb2xkZXIvbmV3LWZvbGRlci5jb21wb25lbnQnO1xyXG5pbXBvcnQge1NpZGVWaWV3Q29tcG9uZW50fSBmcm9tICcuL2NvbXBvbmVudHMvc2lkZS12aWV3L3NpZGUtdmlldy5jb21wb25lbnQnO1xyXG5pbXBvcnQge05hdmlnYXRpb25Db21wb25lbnR9IGZyb20gJy4vY29tcG9uZW50cy9uYXZpZ2F0aW9uL25hdmlnYXRpb24uY29tcG9uZW50JztcclxuaW1wb3J0IHtOZ3hTbWFydE1vZGFsTW9kdWxlfSBmcm9tICduZ3gtc21hcnQtbW9kYWwnO1xyXG5cclxuY29uc3QgRkVBVFVSRV9SRURVQ0VSX1RPS0VOID0gbmV3IEluamVjdGlvblRva2VuPFxyXG4gIEFjdGlvblJlZHVjZXJNYXA8QXBwU3RvcmU+XHJcbj4oJ0FwcFN0b3JlIFJlZHVjZXJzJyk7XHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRSZWR1Y2VycygpOiBBY3Rpb25SZWR1Y2VyTWFwPEFwcFN0b3JlPiB7XHJcbiAgLy8gbWFwIG9mIHJlZHVjZXJzXHJcbiAgcmV0dXJuIHJlZHVjZXJzO1xyXG59XHJcblxyXG5ATmdNb2R1bGUoe1xyXG4gIGltcG9ydHM6IFtcclxuICAgIEh0dHBDbGllbnRNb2R1bGUsXHJcbiAgICBTdG9yZU1vZHVsZS5mb3JSb290KEZFQVRVUkVfUkVEVUNFUl9UT0tFTiksXHJcbiAgICBDb21tb25Nb2R1bGUsXHJcbiAgICBOZ3hTbWFydE1vZGFsTW9kdWxlLmZvclJvb3QoKSxcclxuICBdLFxyXG4gIGRlY2xhcmF0aW9uczogW1xyXG4gICAgRmlsZU1hbmFnZXJDb21wb25lbnQsXHJcbiAgICBGb2xkZXJDb250ZW50Q29tcG9uZW50LFxyXG4gICAgTm9kZUNvbXBvbmVudCxcclxuICAgIFRyZWVDb21wb25lbnQsXHJcbiAgICBOb2RlTGlzdGVyQ29tcG9uZW50LFxyXG4gICAgTWFwVG9JdGVyYWJsZVBpcGUsXHJcbiAgICBOYXZCYXJDb21wb25lbnQsXHJcbiAgICBMb2FkaW5nT3ZlcmxheUNvbXBvbmVudCxcclxuICAgIEZpbGVTaXplUGlwZSxcclxuICAgIFVwbG9hZENvbXBvbmVudCxcclxuICAgIE5ld0ZvbGRlckNvbXBvbmVudCxcclxuICAgIFNpZGVWaWV3Q29tcG9uZW50LFxyXG4gICAgTmF2aWdhdGlvbkNvbXBvbmVudFxyXG4gIF0sXHJcbiAgZXhwb3J0czogW1xyXG4gICAgRmlsZU1hbmFnZXJDb21wb25lbnQsXHJcbiAgICBMb2FkaW5nT3ZlcmxheUNvbXBvbmVudCxcclxuICAgIFNpZGVWaWV3Q29tcG9uZW50XHJcbiAgXSxcclxuICBwcm92aWRlcnM6IFtcclxuICAgIHtcclxuICAgICAgcHJvdmlkZTogRkVBVFVSRV9SRURVQ0VSX1RPS0VOLFxyXG4gICAgICB1c2VGYWN0b3J5OiBnZXRSZWR1Y2VycyxcclxuICAgIH0sXHJcbiAgXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgRmlsZU1hbmFnZXJNb2R1bGUge1xyXG4gIHN0YXRpYyBmb3JSb290KCk6IE1vZHVsZVdpdGhQcm92aWRlcnMge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgbmdNb2R1bGU6IEZpbGVNYW5hZ2VyTW9kdWxlLFxyXG4gICAgICBwcm92aWRlcnM6IFtdXHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQge05vZGVJbnRlcmZhY2V9IGZyb20gJy4uL2ludGVyZmFjZXMvbm9kZS5pbnRlcmZhY2UnO1xyXG5pbXBvcnQge0NvbmZpZ0ludGVyZmFjZX0gZnJvbSAnLi4vaW50ZXJmYWNlcy9jb25maWcuaW50ZXJmYWNlJztcclxuXHJcbmV4cG9ydCBjbGFzcyBUcmVlTW9kZWwge1xyXG4gIHByaXZhdGUgX2N1cnJlbnRQYXRoOiBzdHJpbmc7XHJcbiAgcHJpdmF0ZSBfbm9kZXM6IE5vZGVJbnRlcmZhY2U7XHJcbiAgcHJpdmF0ZSBfc2VsZWN0ZWROb2RlSWQ6IHN0cmluZztcclxuICBwdWJsaWMgY29uZmlnOiBDb25maWdJbnRlcmZhY2U7XHJcblxyXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogQ29uZmlnSW50ZXJmYWNlKSB7XHJcbiAgICAvLyB0aGlzLl9jdXJyZW50UGF0aCA9IGNvbmZpZy5zdGFydGluZ0ZvbGRlcjsgLy8gdG9kbyBpbXBsZW1lbnQgKGNvbmZpZy5pbnRlcmZjZS50cylcclxuICAgIHRoaXMuX2N1cnJlbnRQYXRoID0gJyc7XHJcbiAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcclxuXHJcbiAgICB0aGlzLm5vZGVzID0gPE5vZGVJbnRlcmZhY2U+e1xyXG4gICAgICBpZDogMCxcclxuICAgICAgcGF0aFRvTm9kZTogJycsXHJcbiAgICAgIHBhdGhUb1BhcmVudDogbnVsbCxcclxuICAgICAgaXNGb2xkZXI6IHRydWUsXHJcbiAgICAgIGlzRXhwYW5kZWQ6IHRydWUsXHJcbiAgICAgIHN0YXlPcGVuOiB0cnVlLFxyXG4gICAgICBuYW1lOiAncm9vdCcsXHJcbiAgICAgIGNoaWxkcmVuOiB7fVxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIGdldCBjdXJyZW50UGF0aCgpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRoaXMuX2N1cnJlbnRQYXRoO1xyXG4gIH1cclxuXHJcbiAgc2V0IGN1cnJlbnRQYXRoKHZhbHVlOiBzdHJpbmcpIHtcclxuICAgIHRoaXMuX2N1cnJlbnRQYXRoID0gdmFsdWU7XHJcbiAgfVxyXG5cclxuICBnZXQgbm9kZXMoKTogTm9kZUludGVyZmFjZSB7XHJcbiAgICByZXR1cm4gdGhpcy5fbm9kZXM7XHJcbiAgfVxyXG5cclxuICBzZXQgbm9kZXModmFsdWU6IE5vZGVJbnRlcmZhY2UpIHtcclxuICAgIHRoaXMuX25vZGVzID0gdmFsdWU7XHJcbiAgfVxyXG5cclxuICBnZXQgc2VsZWN0ZWROb2RlSWQoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLl9zZWxlY3RlZE5vZGVJZDtcclxuICB9XHJcblxyXG4gIHNldCBzZWxlY3RlZE5vZGVJZCh2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICB0aGlzLl9zZWxlY3RlZE5vZGVJZCA9IHZhbHVlO1xyXG4gIH1cclxuXHJcbiAgLy8gdG9kbyBpbXBsZW1lbnQgKGNvbmZpZy5pbnRlcmZjZS50cylcclxuICAvLyBnZXQgaXNDYWNoZSgpOiBib29sZWFuIHtcclxuICAvLyAgIHJldHVybiB0aGlzLmNvbmZpZy5vZmZsaW5lTW9kZTtcclxuICAvLyB9XHJcbiAgLy9cclxuICAvLyBzZXQgaXNDYWNoZSh2YWx1ZTogYm9vbGVhbikge1xyXG4gIC8vICAgdGhpcy5jb25maWcub2ZmbGluZU1vZGUgPSB2YWx1ZTtcclxuICAvLyB9XHJcbn1cclxuIl0sIm5hbWVzIjpbIkh0dHBQYXJhbXMiLCJBQ1RJT05TLlNFVF9QQVRIIiwiT2JzZXJ2YWJsZSIsIkFDVElPTlMuU0VUX0xPQURJTkdfU1RBVEUiLCJJbmplY3RhYmxlIiwiSHR0cENsaWVudCIsIlN0b3JlIiwiTmd4U21hcnRNb2RhbFNlcnZpY2UiLCJFdmVudEVtaXR0ZXIiLCJzZWxlY3QiLCJBQ1RJT05TLlNFVF9TRUxFQ1RFRF9OT0RFIiwiQ29tcG9uZW50IiwiVmlld0VuY2Fwc3VsYXRpb24iLCJJbnB1dCIsIk91dHB1dCIsImZpcnN0IiwiQ29udGVudENoaWxkIiwiVGVtcGxhdGVSZWYiLCJQaXBlIiwidGltZXIiLCJfIiwiRmluZVVwbG9hZGVyIiwiVmlld0NoaWxkIiwiSW5qZWN0aW9uVG9rZW4iLCJOZ01vZHVsZSIsIkh0dHBDbGllbnRNb2R1bGUiLCJTdG9yZU1vZHVsZSIsIkNvbW1vbk1vZHVsZSIsIk5neFNtYXJ0TW9kYWxNb2R1bGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBR0EsUUFBYSxRQUFRLEdBQUcsVUFBVTs7QUFDbEMsUUFBYSxpQkFBaUIsR0FBRyxtQkFBbUI7O0FBQ3BELFFBQWEsaUJBQWlCLEdBQUcsbUJBQW1COzs7Ozs7QUNMcEQ7UUFnQkUscUJBQW9CLElBQWdCLEVBQVUsS0FBc0I7WUFBcEUsaUJBQ0M7WUFEbUIsU0FBSSxHQUFKLElBQUksQ0FBWTtZQUFVLFVBQUssR0FBTCxLQUFLLENBQWlCO1lBOEQ1RCx1QkFBa0IsSUFBRyxVQUFDLElBQVk7O29CQUNw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