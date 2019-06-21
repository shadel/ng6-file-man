(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('rxjs'), require('@angular/common/http'), require('@ngrx/store'), require('ngx-smart-modal'), require('@ngx-translate/core'), require('rxjs/operators'), require('@biesbjerg/ngx-translate-extract/dist/utils/utils'), require('fine-uploader'), require('@angular/common'), require('@ngx-translate/http-loader')) :
    typeof define === 'function' && define.amd ? define('ng6-file-man', ['exports', '@angular/core', 'rxjs', '@angular/common/http', '@ngrx/store', 'ngx-smart-modal', '@ngx-translate/core', 'rxjs/operators', '@biesbjerg/ngx-translate-extract/dist/utils/utils', 'fine-uploader', '@angular/common', '@ngx-translate/http-loader'], factory) :
    (factory((global['ng6-file-man'] = {}),global.ng.core,global.rxjs,global.ng.common.http,null,null,null,global.rxjs.operators,null,null,global.ng.common,null));
}(this, (function (exports,i0,rxjs,i4,i3,i1,core,operators,utils,fineUploader,common,httpLoader) { 'use strict';

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
        function FileManagerComponent(store, nodeService, nodeClickedService, ngxSmartModalService, translate) {
            this.store = store;
            this.nodeService = nodeService;
            this.nodeClickedService = nodeClickedService;
            this.ngxSmartModalService = ngxSmartModalService;
            this.translate = translate;
            this.isPopup = false;
            this.itemClicked = new i0.EventEmitter();
            this._language = 'en';
            this.sideMenuClosed = true;
            this.fmOpen = false;
            this.newDialog = false;
            translate.setDefaultLang('en');
            translate.use('en');
        }
        Object.defineProperty(FileManagerComponent.prototype, "language", {
            get: /**
             * @return {?}
             */ function () {
                return this._language;
            },
            set: /**
             * @param {?} value
             * @return {?}
             */ function (value) {
                this._language = value;
                this.translate.use(this.language);
            },
            enumerable: true,
            configurable: true
        });
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
                        template: "<ng-container *ngIf=\"isPopup; then itIsPopup else showContent\"></ng-container>\n\n<ng-template #itIsPopup>\n  <div *ngIf=\"!fmOpen\">\n    <button class=\"button big\" (click)=\"fmShowHide()\" translate=\"\">Open file manager</button>\n  </div>\n  <div class=\"file-manager-backdrop\" *ngIf=\"fmOpen\">\n    <div class=\"fmModalInside\">\n      <div *ngIf=\"fmOpen; then showContent\"></div>\n    </div>\n  </div>\n</ng-template>\n\n<ng-template #showContent>\n  <div class=\"content\">\n    <div class=\"file-manager-navbar\">\n      <div class=\"path\">\n        <app-nav-bar></app-nav-bar>\n      </div>\n\n      <div class=\"navigation\">\n        <app-navigation>\n          <div class=\"button close\" (click)=\"fmShowHide()\" *ngIf=\"isPopup\">\n            <i class=\"fas fa-2x fa-times\"></i>\n          </div>\n        </app-navigation>\n      </div>\n    </div>\n\n    <div class=\"holder\">\n      <div class=\"file-manager-left\">\n        <app-tree [treeModel]=\"tree\">\n          <ng-template let-nodes>\n            <ng-container [ngTemplateOutletContext]=\"{$implicit: nodes}\"\n                          [ngTemplateOutlet]=\"iconTemplate ? iconTemplate : defaultIconTemplate\">\n            </ng-container>\n          </ng-template>\n        </app-tree>\n      </div>\n\n      <div class=\"right\">\n        <app-folder-content\n          [treeModel]=\"tree\"\n          (openUploadDialog)=\"handleUploadDialog($event)\"\n          [folderContentTemplate]=\"folderContentTemplate ? folderContentTemplate : defaultFolderContentTemplate\"\n          [folderContentNewTemplate]=\"folderContentNewTemplate ? folderContentNewTemplate : defaultFolderContentNewTemplate\"\n          [folderContentBackTemplate]=\"folderContentBackTemplate ? folderContentBackTemplate : defaultFolderContentBackTemplate\">\n        </app-folder-content>\n      </div>\n\n      <app-side-view id=\"side-view\"\n                     [node]=\"selectedNode\"\n                     [sideViewTemplate]=\"sideViewTemplate ? sideViewTemplate : defaultSideViewTemplate\"\n                     [allowFolderDownload]=\"tree.config.options.allowFolderDownload\"\n                     (clickEvent)=\"handleFileManagerClickEvent($event)\">\n      </app-side-view>\n    </div>\n  </div>\n\n  <app-upload *ngIf=\"newDialog\"\n              [openDialog]=\"newDialog\"\n              (closeDialog)=\"handleUploadDialog(false)\"\n              (createDir)=\"handleFileManagerClickEvent({type: 'createFolder', payload: $event})\">\n  </app-upload>\n\n  <app-loading-overlay\n    *ngIf=\"loading\"\n    [loadingOverlayTemplate]=\"loadingOverlayTemplate ? loadingOverlayTemplate : defaultLoadingOverlayTemplate\">\n  </app-loading-overlay>\n</ng-template>\n\n<ng-template let-node #defaultIconTemplate>\n  <div class=\"file-manager-node\" style=\"display: inline-block; padding: 3px\">\n    <div *ngIf=\"node.isFolder; then itIsFolder else showFile\"></div>\n\n    <ng-template #itIsFolder>\n      <div *ngIf=\"node.isExpanded; then isFolderExpanded else isFolderClosed\"></div>\n    </ng-template>\n\n    <ng-template #showFile><i class=\"fas fa-file child\"></i></ng-template>\n    <ng-template #isFolderExpanded><i class=\"fas fa-folder-open child\"></i></ng-template>\n    <ng-template #isFolderClosed><i class=\"fas fa-folder child\"></i></ng-template>\n\n    <span>{{node.name}}</span>\n  </div>\n</ng-template>\n<ng-template let-node #defaultFolderContentTemplate>\n  <div class=\"file-manager-item\">\n    <div class=\"file-preview\">\n      <div *ngIf=\"node.isFolder; then itIsFolder else showFile\"></div>\n      <ng-template #itIsFolder><i class=\"fas fa-3x fa-folder child\"></i></ng-template>\n      <ng-template #showFile><i class=\"fas fa-3x fa-file child\"></i></ng-template>\n    </div>\n    <div class=\"file-name\">\n      {{node.name}}\n    </div>\n  </div>\n</ng-template>\n<ng-template #defaultFolderContentNewTemplate>\n  <div class=\"file-manager-item\">\n    <div class=\"file-preview\" style=\"width: 100%; height:100%\">\n      <i class=\"fas fa-3x fa-plus child\" style=\"line-height: 2\"></i>\n    </div>\n  </div>\n</ng-template>\n<ng-template let-node #defaultFolderContentBackTemplate>\n  <div class=\"file-manager-item\">\n    <div class=\"file-preview\" style=\"width: 100%; height:100%\">\n      <i class=\"fas fa-2x fa-ellipsis-h\" style=\"line-height: 5\"></i>\n    </div>\n  </div>\n</ng-template>\n<ng-template let-timeoutMessage #defaultLoadingOverlayTemplate>\n  <div class=\"file-manager-backdrop loading\" (click)=\"backdropClicked()\">\n    <div class=\"file-manager-error\" *ngIf=\"timeoutMessage\">{{timeoutMessage | translate}}</div>\n  </div>\n  <div class=\"spinner\">\n    <i class=\"fas fa-5x fa-spin fa-sync-alt\"></i>\n  </div>\n</ng-template>\n<ng-template let-node #defaultSideViewTemplate>\n  <div style=\"position: absolute; bottom: 0; width: 100%; margin: 5px auto\">\n    <span *ngIf=\"node.isFolder\" translate>No data available for this folder</span>\n    <span *ngIf=\"!node.isFolder\" translate>No data available for this file</span>\n  </div>\n</ng-template>\n\n<ngx-smart-modal identifier=\"renameModal\" [dismissable]=\"false\" [closable]=\"false\" *ngIf=\"selectedNode\" #renameModal>\n  <h2 class=\"modal-title\" translate>\n    Rename file\n  </h2>\n  <p class=\"rename-name\" translate>\n    Old name\n  </p>\n  <span style=\"margin: 8px\">{{selectedNode.name}}</span>\n  <p class=\"rename-name\" translate>\n    New name\n  </p>\n  <input placeholder=\"New name\" type=\"text\" class=\"rename-input\" [value]=\"selectedNode.name\" #renameInput\n         (keyup.enter)=\"handleFileManagerClickEvent({type: 'rename', value: renameInput.value})\"\n         onclick=\"this.select();\">\n  <br>\n\n  <div class=\"rename-button\">\n    <button class=\"button big\" translate\n            (click)=\"handleFileManagerClickEvent({type: 'rename', value: renameInput.value})\"\n            [disabled]=\"renameInput.value === selectedNode.name || renameInput.value.length === 0\">\n      Rename\n    </button>\n    <button class=\"button big\" (click)=\"renameModal.close()\" translate>\n      Cancel\n    </button>\n  </div>\n\n</ngx-smart-modal>\n<ngx-smart-modal *ngIf=\"selectedNode\" identifier=\"confirmDeleteModal\" #deleteModal\n                 [dismissable]=\"false\" [closable]=\"false\">\n  <h2 class=\"modal-title\">\n    <span translate>You are trying to delete following </span>\n    <span *ngIf=\"selectedNode.isFolder\" translate>folder</span>\n    <span *ngIf=\"!selectedNode.isFolder\" translate>file</span>\n  </h2>\n\n  <div style=\"width: 100%; margin: 5px auto; text-align: center\">{{selectedNode.name}}</div>\n\n  <div class=\"rename-button\">\n    <button class=\"button big\" (click)=\"handleFileManagerClickEvent({type: 'remove'})\">\n      <span translate>Yes, delete this </span>\n      <span *ngIf=\"selectedNode.isFolder\" translate>folder</span>\n      <span *ngIf=\"!selectedNode.isFolder\" translate>file</span>\n    </button>\n    <button class=\"button big\" (click)=\"deleteModal.close()\" translate>\n      Cancel\n    </button>\n  </div>\n</ngx-smart-modal>\n<ngx-smart-modal identifier=\"searchModal\" #searchModal [closable]=\"true\">\n  <h2 class=\"modal-title\" style=\"margin-bottom: 2px\" translate\n      *ngIf=\"searchModal.hasData() && searchModal.getData().response.length !== 0\">\n    Search results for\n  </h2>\n  <h2 class=\"modal-title\" style=\"margin-bottom: 2px\" translate\n      *ngIf=\"!searchModal.hasData() || searchModal.getData().response.length === 0\">\n    No results found for\n  </h2>\n  <div style=\"text-align: center\" *ngIf=\"searchModal.hasData()\">{{searchModal.getData().searchString}}</div>\n\n  <div *ngIf=\"searchModal.hasData() && searchModal.getData().response.length !== 0\">\n    <table style=\"margin: 0 auto\">\n      <tr>\n        <td class=\"table-item table-head\" translate>File name</td>\n        <td class=\"table-item-short table-head\" translate>Size</td>\n      </tr>\n      <tr *ngFor=\"let item of searchModal.getData().response\" (click)=\"searchClicked(item)\">\n        <td style=\"cursor: pointer\">\n          <ng-container *ngIf=\"item.fileCategory === 'D'; else file\">\n            <i class=\"fas fa-folder search-output-icon\"></i>\n          </ng-container>\n          <ng-template #file>\n            <i class=\"fas fa-file search-output-icon\"></i>\n          </ng-template>\n          <span style=\"text-overflow: ellipsis\">{{item.name}}</span>\n        </td>\n        <td class=\"table-item-short\">{{item.size}}</td>\n      </tr>\n    </table>\n  </div>\n</ngx-smart-modal>\n<ngx-smart-modal identifier=\"waitModal\" [closable]=\"false\" [dismissable]=\"false\" [escapable]=\"false\">\n  <h2 class=\"modal-title\" style=\"margin-top: 20px\">\n    {{'Processing request' | translate}}...\n  </h2>\n\n  <div style=\"text-align: center; height: 70px\">\n    <i class=\"fas fa-spinner fa-spin fa-4x\"></i>\n  </div>\n</ngx-smart-modal>\n<ngx-smart-modal identifier=\"errorModal\" [closable]=\"true\">\n  <h2 class=\"modal-title\" style=\"margin-top: 20px\">\n    {{'Something went wrong with your request' | translate}}...\n  </h2>\n</ngx-smart-modal>\n",
                        styles: [".content{height:100%;min-width:850px}.holder{display:-webkit-flex;display:flex;height:calc(100% - 75px)}.path{margin:auto 0;display:block}.navigation{margin:auto 0;display:-webkit-flex;display:flex}.navigation .button{margin:0 10px;padding:0;position:relative}.right{width:100%;position:relative;overflow:auto}.file-name{width:100px;height:25px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;box-sizing:border-box;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.file-preview{margin:auto}.file-preview i{line-height:1.5}.spinner{position:absolute;top:50%;left:50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%);cursor:progress}.rename-button{margin:20px auto;display:block;text-align:center}.modal-title{margin-top:5px;text-align:center}.search-output{margin:15px 0}.search-output-icon{margin:2px 5px}.table-item{width:80%}.table-item-short{width:20%;text-align:right}"],
                        encapsulation: i0.ViewEncapsulation.None
                    },] },
        ];
        FileManagerComponent.ctorParameters = function () {
            return [
                { type: i3.Store },
                { type: NodeService },
                { type: NodeClickedService },
                { type: i1.NgxSmartModalService },
                { type: core.TranslateService }
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
            itemClicked: [{ type: i0.Output }],
            language: [{ type: i0.Input }]
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
                        template: "<p class=\"new-folder-description\" translate>Type new folder name</p>\n<input #uploadFolder placeholder=\"{{'Folder name' | translate}}\" (keyup)=\"onInputChange($event)\"\n       (keyup.enter)=\"onClick()\" onclick=\"this.select();\" type=\"text\" class=\"new-folder-input\"/>\n<button class=\"button new-folder-send\" (click)=\"onClick()\">{{buttonText | translate}}</button>\n",
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
                        template: "<div class=\"navigation-component\">\n  <input #input class=\"navigation-search\" onclick=\"this.select();\" (keyup.enter)=\"onClick(input.value)\"\n         placeholder=\"{{'Search' | translate}}\">\n\n  <button [disabled]=\"input.value.length === 0\" class=\"navigation-search-icon\" (click)=\"onClick(input.value)\">\n    <i class=\"fas fa-search\"></i>\n  </button>\n\n  <div>\n    <ng-content></ng-content>\n  </div>\n</div>\n\n\n",
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
    /**
     * @param {?} http
     * @return {?}
     */
    function createTranslateLoader(http) {
        return new httpLoader.TranslateHttpLoader(http, '/assets/i18n/', '.json');
    }
    /** @type {?} */
    var FEATURE_REDUCER_TOKEN = new i0.InjectionToken('AppStore Reducers');
    /**
     * @return {?}
     */
    function getReducers() {
        // map of reducers
        return reducers;
    }
    var ɵ0 = (createTranslateLoader);
    var FileManagerModule = (function () {
        function FileManagerModule() {
        }
        FileManagerModule.decorators = [
            { type: i0.NgModule, args: [{
                        imports: [
                            i4.HttpClientModule,
                            i3.StoreModule.forRoot(FEATURE_REDUCER_TOKEN),
                            common.CommonModule,
                            i1.NgxSmartModalModule.forRoot(),
                            core.TranslateModule.forRoot({
                                loader: {
                                    provide: core.TranslateLoader,
                                    useFactory: ɵ0,
                                    deps: [i4.HttpClient]
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
    exports.createTranslateLoader = createTranslateLoader;
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmc2LWZpbGUtbWFuLnVtZC5qcy5tYXAiLCJzb3VyY2VzIjpbIm5nOi8vbmc2LWZpbGUtbWFuL2ZpbGUtbWFuYWdlci9yZWR1Y2Vycy9hY3Rpb25zLmFjdGlvbi50cyIsIm5nOi8vbmc2LWZpbGUtbWFuL2ZpbGUtbWFuYWdlci9zZXJ2aWNlcy9ub2RlLnNlcnZpY2UudHMiLCJuZzovL25nNi1maWxlLW1hbi9maWxlLW1hbmFnZXIvc2VydmljZXMvbm9kZS1jbGlja2VkLnNlcnZpY2UudHMiLCJuZzovL25nNi1maWxlLW1hbi9maWxlLW1hbmFnZXIvZmlsZS1tYW5hZ2VyLmNvbXBvbmVudC50cyIsIm5nOi8vbmc2LWZpbGUtbWFuL2ZpbGUtbWFuYWdlci9jb21wb25lbnRzL2ZvbGRlci1jb250ZW50L2ZvbGRlci1jb250ZW50LmNvbXBvbmVudC50cyIsIm5nOi8vbmc2LWZpbGUtbWFuL2ZpbGUtbWFuYWdlci9jb21wb25lbnRzL3RyZWUvdHJlZS5jb21wb25lbnQudHMiLCJuZzovL25nNi1maWxlLW1hbi9maWxlLW1hbmFnZXIvY29tcG9uZW50cy90cmVlL25vZGUtbGlzdGVyL25vZGUtbGlzdGVyLmNvbXBvbmVudC50cyIsIm5nOi8vbmc2LWZpbGUtbWFuL2ZpbGUtbWFuYWdlci9jb21wb25lbnRzL2Z1bmN0aW9ucy9ub2RlL25vZGUuY29tcG9uZW50LnRzIiwibmc6Ly9uZzYtZmlsZS1tYW4vZmlsZS1tYW5hZ2VyL3BpcGVzL21hcC10by1pdGVyYWJsZS5waXBlLnRzIiwibmc6Ly9uZzYtZmlsZS1tYW4vZmlsZS1tYW5hZ2VyL2NvbXBvbmVudHMvbmF2LWJhci9uYXYtYmFyLmNvbXBvbmVudC50cyIsbnVsbCwibmc6Ly9uZzYtZmlsZS1tYW4vZmlsZS1tYW5hZ2VyL3JlZHVjZXJzL3N0YXRlUmVkdWNlci50cyIsIm5nOi8vbmc2LWZpbGUtbWFuL2ZpbGUtbWFuYWdlci9yZWR1Y2Vycy9yZWR1Y2VyLmZhY3RvcnkudHMiLCJuZzovL25nNi1maWxlLW1hbi9maWxlLW1hbmFnZXIvY29tcG9uZW50cy9mdW5jdGlvbnMvbG9hZGluZy1vdmVybGF5L2xvYWRpbmctb3ZlcmxheS5jb21wb25lbnQudHMiLCJuZzovL25nNi1maWxlLW1hbi9maWxlLW1hbmFnZXIvcGlwZXMvZmlsZS1zaXplLnBpcGUudHMiLCJuZzovL25nNi1maWxlLW1hbi9maWxlLW1hbmFnZXIvY29tcG9uZW50cy9mdW5jdGlvbnMvdXBsb2FkL3VwbG9hZC5jb21wb25lbnQudHMiLCJuZzovL25nNi1maWxlLW1hbi9maWxlLW1hbmFnZXIvY29tcG9uZW50cy9mdW5jdGlvbnMvdXBsb2FkL25ldy1mb2xkZXIvbmV3LWZvbGRlci5jb21wb25lbnQudHMiLCJuZzovL25nNi1maWxlLW1hbi9maWxlLW1hbmFnZXIvY29tcG9uZW50cy9zaWRlLXZpZXcvc2lkZS12aWV3LmNvbXBvbmVudC50cyIsIm5nOi8vbmc2LWZpbGUtbWFuL2ZpbGUtbWFuYWdlci9jb21wb25lbnRzL25hdmlnYXRpb24vbmF2aWdhdGlvbi5jb21wb25lbnQudHMiLCJuZzovL25nNi1maWxlLW1hbi9maWxlLW1hbmFnZXIvZmlsZS1tYW5hZ2VyLm1vZHVsZS50cyIsIm5nOi8vbmc2LWZpbGUtbWFuL2ZpbGUtbWFuYWdlci9tb2RlbHMvdHJlZS5tb2RlbC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0FjdGlvbkludGVyZmFjZX0gZnJvbSAnLi4vaW50ZXJmYWNlcy9hY3Rpb24uaW50ZXJmYWNlJztcclxuaW1wb3J0IHtOb2RlSW50ZXJmYWNlfSBmcm9tICcuLi9pbnRlcmZhY2VzL25vZGUuaW50ZXJmYWNlJztcclxuXHJcbmV4cG9ydCBjb25zdCBTRVRfUEFUSCA9ICdTRVRfUEFUSCc7XHJcbmV4cG9ydCBjb25zdCBTRVRfTE9BRElOR19TVEFURSA9ICdTRVRfTE9BRElOR19TVEFURSc7XHJcbmV4cG9ydCBjb25zdCBTRVRfU0VMRUNURURfTk9ERSA9ICdTRVRfU0VMRUNURURfTk9ERSc7XHJcblxyXG5leHBvcnQgY2xhc3MgU2V0UGF0aCBpbXBsZW1lbnRzIEFjdGlvbkludGVyZmFjZSB7XHJcbiAgcmVhZG9ubHkgdHlwZSA9IFNFVF9QQVRIO1xyXG4gIHBheWxvYWQ6IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFNldExvYWRpbmdTdGF0ZSBpbXBsZW1lbnRzIEFjdGlvbkludGVyZmFjZSB7XHJcbiAgcmVhZG9ubHkgdHlwZSA9IFNFVF9MT0FESU5HX1NUQVRFO1xyXG4gIHBheWxvYWQ6IGJvb2xlYW47XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBTZXRTZWxlY3RlZE5vZGUgaW1wbGVtZW50cyBBY3Rpb25JbnRlcmZhY2Uge1xyXG4gIHJlYWRvbmx5IHR5cGUgPSBTRVRfU0VMRUNURURfTk9ERTtcclxuICBwYXlsb2FkOiBOb2RlSW50ZXJmYWNlO1xyXG59XHJcblxyXG5leHBvcnQgdHlwZSBBY3Rpb25zID0gU2V0UGF0aCB8IFNldExvYWRpbmdTdGF0ZSB8IFNldFNlbGVjdGVkTm9kZTtcclxuIiwiaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtOb2RlSW50ZXJmYWNlfSBmcm9tICcuLi9pbnRlcmZhY2VzL25vZGUuaW50ZXJmYWNlJztcclxuaW1wb3J0IHtPYnNlcnZhYmxlfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtUcmVlTW9kZWx9IGZyb20gJy4uL21vZGVscy90cmVlLm1vZGVsJztcclxuaW1wb3J0IHtIdHRwQ2xpZW50LCBIdHRwUGFyYW1zfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCAqIGFzIEFDVElPTlMgZnJvbSAnLi4vcmVkdWNlcnMvYWN0aW9ucy5hY3Rpb24nO1xyXG5pbXBvcnQge1N0b3JlfSBmcm9tICdAbmdyeC9zdG9yZSc7XHJcbmltcG9ydCB7QXBwU3RvcmV9IGZyb20gJy4uL3JlZHVjZXJzL3JlZHVjZXIuZmFjdG9yeSc7XHJcblxyXG5ASW5qZWN0YWJsZSh7XHJcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBOb2RlU2VydmljZSB7XHJcbiAgcHVibGljIHRyZWU6IFRyZWVNb2RlbDtcclxuICBwcml2YXRlIF9wYXRoOiBzdHJpbmc7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgaHR0cDogSHR0cENsaWVudCwgcHJpdmF0ZSBzdG9yZTogU3RvcmU8QXBwU3RvcmU+KSB7XHJcbiAgfVxyXG5cclxuICAvLyB0b2RvIGFzayBzZXJ2ZXIgdG8gZ2V0IHBhcmVudCBzdHJ1Y3R1cmVcclxuICBwdWJsaWMgc3RhcnRNYW5hZ2VyQXQocGF0aDogc3RyaW5nKSB7XHJcbiAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKHt0eXBlOiBBQ1RJT05TLlNFVF9QQVRILCBwYXlsb2FkOiBwYXRofSk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgcmVmcmVzaEN1cnJlbnRQYXRoKCkge1xyXG4gICAgdGhpcy5maW5kTm9kZUJ5UGF0aCh0aGlzLmN1cnJlbnRQYXRoKS5jaGlsZHJlbiA9IHt9O1xyXG4gICAgdGhpcy5nZXROb2Rlcyh0aGlzLmN1cnJlbnRQYXRoKTtcclxuICB9XHJcblxyXG4gIGdldE5vZGVzKHBhdGg6IHN0cmluZykge1xyXG4gICAgdGhpcy5wYXJzZU5vZGVzKHBhdGgpLnN1YnNjcmliZSgoZGF0YTogQXJyYXk8Tm9kZUludGVyZmFjZT4pID0+IHtcclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgY29uc3QgcGFyZW50UGF0aCA9IHRoaXMuZ2V0UGFyZW50UGF0aChkYXRhW2ldLnBhdGhUb05vZGUpO1xyXG4gICAgICAgIHRoaXMuZmluZE5vZGVCeVBhdGgocGFyZW50UGF0aCkuY2hpbGRyZW5bZGF0YVtpXS5uYW1lXSA9IGRhdGFbaV07XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBnZXRQYXJlbnRQYXRoKHBhdGg6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICBsZXQgcGFyZW50UGF0aCA9IHBhdGguc3BsaXQoJy8nKTtcclxuICAgIHBhcmVudFBhdGggPSBwYXJlbnRQYXRoLnNsaWNlKDAsIHBhcmVudFBhdGgubGVuZ3RoIC0gMSk7XHJcbiAgICByZXR1cm4gcGFyZW50UGF0aC5qb2luKCcvJyk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHBhcnNlTm9kZXMocGF0aDogc3RyaW5nKTogT2JzZXJ2YWJsZTxOb2RlSW50ZXJmYWNlW10+IHtcclxuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZShvYnNlcnZlciA9PiB7XHJcbiAgICAgIHRoaXMuZ2V0Tm9kZXNGcm9tU2VydmVyKHBhdGgpLnN1YnNjcmliZSgoZGF0YTogQXJyYXk8YW55PikgPT4ge1xyXG4gICAgICAgIG9ic2VydmVyLm5leHQoZGF0YS5tYXAobm9kZSA9PiB0aGlzLmNyZWF0ZU5vZGUocGF0aCwgbm9kZSkpKTtcclxuICAgICAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKHt0eXBlOiBBQ1RJT05TLlNFVF9MT0FESU5HX1NUQVRFLCBwYXlsb2FkOiBmYWxzZX0pO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjcmVhdGVOb2RlKHBhdGgsIG5vZGUpOiBOb2RlSW50ZXJmYWNlIHtcclxuICAgIGlmIChub2RlLnBhdGhbMF0gIT09ICcvJykge1xyXG4gICAgICBjb25zb2xlLndhcm4oJ1tOb2RlIFNlcnZpY2VdIFNlcnZlciBzaG91bGQgcmV0dXJuIGluaXRpYWwgcGF0aCB3aXRoIFwiL1wiJyk7XHJcbiAgICAgIG5vZGUucGF0aCA9ICcvJyArIG5vZGUucGF0aDtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBpZHMgPSBub2RlLnBhdGguc3BsaXQoJy8nKTtcclxuICAgIGlmIChpZHMubGVuZ3RoID4gMiAmJiBpZHNbaWRzLmxlbmd0aCAtIDFdID09PSAnJykge1xyXG4gICAgICBpZHMuc3BsaWNlKC0xLCAxKTtcclxuICAgICAgbm9kZS5wYXRoID0gaWRzLmpvaW4oJy8nKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBjYWNoZWROb2RlID0gdGhpcy5maW5kTm9kZUJ5UGF0aChub2RlLnBhdGgpO1xyXG5cclxuICAgIHJldHVybiA8Tm9kZUludGVyZmFjZT57XHJcbiAgICAgIGlkOiBub2RlLmlkLFxyXG4gICAgICBpc0ZvbGRlcjogbm9kZS5kaXIsXHJcbiAgICAgIGlzRXhwYW5kZWQ6IGNhY2hlZE5vZGUgPyBjYWNoZWROb2RlLmlzRXhwYW5kZWQgOiBmYWxzZSxcclxuICAgICAgcGF0aFRvTm9kZTogbm9kZS5wYXRoLFxyXG4gICAgICBwYXRoVG9QYXJlbnQ6IHRoaXMuZ2V0UGFyZW50UGF0aChub2RlLnBhdGgpLFxyXG4gICAgICBuYW1lOiBub2RlLm5hbWUgfHwgbm9kZS5pZCxcclxuICAgICAgY2hpbGRyZW46IGNhY2hlZE5vZGUgPyBjYWNoZWROb2RlLmNoaWxkcmVuIDoge31cclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdldE5vZGVzRnJvbVNlcnZlciA9IChwYXRoOiBzdHJpbmcpID0+IHtcclxuICAgIGxldCBmb2xkZXJJZDogYW55ID0gdGhpcy5maW5kTm9kZUJ5UGF0aChwYXRoKS5pZDtcclxuICAgIGZvbGRlcklkID0gZm9sZGVySWQgPT09IDAgPyAnJyA6IGZvbGRlcklkO1xyXG5cclxuICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KFxyXG4gICAgICB0aGlzLnRyZWUuY29uZmlnLmJhc2VVUkwgKyB0aGlzLnRyZWUuY29uZmlnLmFwaS5saXN0RmlsZSxcclxuICAgICAge3BhcmFtczogbmV3IEh0dHBQYXJhbXMoKS5zZXQoJ3BhcmVudFBhdGgnLCBmb2xkZXJJZCl9XHJcbiAgICApO1xyXG4gIH07XHJcblxyXG4gIHB1YmxpYyBmaW5kTm9kZUJ5UGF0aChub2RlUGF0aDogc3RyaW5nKTogTm9kZUludGVyZmFjZSB7XHJcbiAgICBjb25zdCBpZHMgPSBub2RlUGF0aC5zcGxpdCgnLycpO1xyXG4gICAgaWRzLnNwbGljZSgwLCAxKTtcclxuXHJcbiAgICByZXR1cm4gaWRzLmxlbmd0aCA9PT0gMCA/IHRoaXMudHJlZS5ub2RlcyA6IGlkcy5yZWR1Y2UoKHZhbHVlLCBpbmRleCkgPT4gdmFsdWVbJ2NoaWxkcmVuJ11baW5kZXhdLCB0aGlzLnRyZWUubm9kZXMpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGZpbmROb2RlQnlJZChpZDogbnVtYmVyKTogTm9kZUludGVyZmFjZSB7XHJcbiAgICBjb25zdCByZXN1bHQgPSB0aGlzLmZpbmROb2RlQnlJZEhlbHBlcihpZCk7XHJcblxyXG4gICAgaWYgKHJlc3VsdCA9PT0gbnVsbCkge1xyXG4gICAgICBjb25zb2xlLndhcm4oJ1tOb2RlIFNlcnZpY2VdIENhbm5vdCBmaW5kIG5vZGUgYnkgaWQuIElkIG5vdCBleGlzdGluZyBvciBub3QgZmV0Y2hlZC4gUmV0dXJuaW5nIHJvb3QuJyk7XHJcbiAgICAgIHJldHVybiB0aGlzLnRyZWUubm9kZXM7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBmaW5kTm9kZUJ5SWRIZWxwZXIoaWQ6IG51bWJlciwgbm9kZTogTm9kZUludGVyZmFjZSA9IHRoaXMudHJlZS5ub2Rlcyk6IE5vZGVJbnRlcmZhY2Uge1xyXG4gICAgaWYgKG5vZGUuaWQgPT09IGlkKVxyXG4gICAgICByZXR1cm4gbm9kZTtcclxuXHJcbiAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMobm9kZS5jaGlsZHJlbik7XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGlmICh0eXBlb2Ygbm9kZS5jaGlsZHJlbltrZXlzW2ldXSA9PSAnb2JqZWN0Jykge1xyXG4gICAgICAgIGNvbnN0IG9iaiA9IHRoaXMuZmluZE5vZGVCeUlkSGVscGVyKGlkLCBub2RlLmNoaWxkcmVuW2tleXNbaV1dKTtcclxuICAgICAgICBpZiAob2JqICE9IG51bGwpXHJcbiAgICAgICAgICByZXR1cm4gb2JqO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZm9sZFJlY3Vyc2l2ZWx5KG5vZGU6IE5vZGVJbnRlcmZhY2UpIHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdmb2xkaW5nICcsIG5vZGUpO1xyXG4gICAgY29uc3QgY2hpbGRyZW4gPSBub2RlLmNoaWxkcmVuO1xyXG5cclxuICAgIE9iamVjdC5rZXlzKGNoaWxkcmVuKS5tYXAoKGNoaWxkOiBzdHJpbmcpID0+IHtcclxuICAgICAgaWYgKCFjaGlsZHJlbi5oYXNPd25Qcm9wZXJ0eShjaGlsZCkgfHwgIWNoaWxkcmVuW2NoaWxkXS5pc0V4cGFuZGVkKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuZm9sZFJlY3Vyc2l2ZWx5KGNoaWxkcmVuW2NoaWxkXSk7XHJcbiAgICAgIC8vdG9kbyBwdXQgdGhpcyBnZXRFbEJ5SWQgaW50byBvbmUgZnVuYyAoY3VyciBpbnNpZGUgbm9kZS5jb21wb25lbnQudHMgKyBmbS5jb21wb25lbnQudHMpIC0gdGhpcyB3b24ndCBiZSBtYWludGFpbmFibGVcclxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RyZWVfJyArIGNoaWxkcmVuW2NoaWxkXS5wYXRoVG9Ob2RlKS5jbGFzc0xpc3QuYWRkKCdkZXNlbGVjdGVkJyk7XHJcbiAgICAgIGNoaWxkcmVuW2NoaWxkXS5pc0V4cGFuZGVkID0gZmFsc2U7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBmb2xkQWxsKCkge1xyXG4gICAgdGhpcy5mb2xkUmVjdXJzaXZlbHkodGhpcy50cmVlLm5vZGVzKTtcclxuICB9XHJcblxyXG4gIGdldCBjdXJyZW50UGF0aCgpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRoaXMuX3BhdGg7XHJcbiAgfVxyXG5cclxuICBzZXQgY3VycmVudFBhdGgodmFsdWU6IHN0cmluZykge1xyXG4gICAgdGhpcy5fcGF0aCA9IHZhbHVlO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge05vZGVJbnRlcmZhY2V9IGZyb20gJy4uL2ludGVyZmFjZXMvbm9kZS5pbnRlcmZhY2UnO1xyXG5pbXBvcnQge05vZGVTZXJ2aWNlfSBmcm9tICcuL25vZGUuc2VydmljZSc7XHJcbmltcG9ydCB7VHJlZU1vZGVsfSBmcm9tICcuLi9tb2RlbHMvdHJlZS5tb2RlbCc7XHJcbmltcG9ydCB7SHR0cENsaWVudH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQge09ic2VydmFibGV9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge05neFNtYXJ0TW9kYWxTZXJ2aWNlfSBmcm9tICduZ3gtc21hcnQtbW9kYWwnO1xyXG5pbXBvcnQge0FwcFN0b3JlfSBmcm9tICcuLi9yZWR1Y2Vycy9yZWR1Y2VyLmZhY3RvcnknO1xyXG5pbXBvcnQge1N0b3JlfSBmcm9tICdAbmdyeC9zdG9yZSc7XHJcblxyXG5ASW5qZWN0YWJsZSh7XHJcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBOb2RlQ2xpY2tlZFNlcnZpY2Uge1xyXG4gIHB1YmxpYyB0cmVlOiBUcmVlTW9kZWw7XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcHVibGljIG5neFNtYXJ0TW9kYWxTZXJ2aWNlOiBOZ3hTbWFydE1vZGFsU2VydmljZSxcclxuICAgIHByaXZhdGUgbm9kZVNlcnZpY2U6IE5vZGVTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSBzdG9yZTogU3RvcmU8QXBwU3RvcmU+LFxyXG4gICAgcHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50XHJcbiAgKSB7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc3RhcnREb3dubG9hZChub2RlOiBOb2RlSW50ZXJmYWNlKTogdm9pZCB7XHJcbiAgICBjb25zdCBwYXJhbWV0ZXJzID0gdGhpcy5wYXJzZVBhcmFtcyh7cGF0aDogbm9kZS5pZH0pO1xyXG4gICAgdGhpcy5yZWFjaFNlcnZlcignZG93bmxvYWQnLCB0aGlzLnRyZWUuY29uZmlnLmFwaS5kb3dubG9hZEZpbGUgKyBwYXJhbWV0ZXJzKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBpbml0RGVsZXRlKG5vZGU6IE5vZGVJbnRlcmZhY2UpOiB2b2lkIHtcclxuICAgIHRoaXMuc2lkZUVmZmVjdEhlbHBlcihcclxuICAgICAgJ0RlbGV0ZScsXHJcbiAgICAgIHtwYXRoOiBub2RlLmlkfSxcclxuICAgICAgJ2RlbGV0ZScsXHJcbiAgICAgIHRoaXMudHJlZS5jb25maWcuYXBpLmRlbGV0ZUZpbGUsXHJcbiAgICAgICgpID0+IHRoaXMuc3VjY2Vzc1dpdGhNb2RhbENsb3NlKClcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc2VhcmNoRm9yU3RyaW5nKGlucHV0OiBzdHJpbmcpOiB2b2lkIHtcclxuICAgIHRoaXMuc2lkZUVmZmVjdEhlbHBlcihcclxuICAgICAgJ1NlYXJjaCcsXHJcbiAgICAgIHtxdWVyeTogaW5wdXR9LFxyXG4gICAgICAnZ2V0JyxcclxuICAgICAgdGhpcy50cmVlLmNvbmZpZy5hcGkuc2VhcmNoRmlsZXMsXHJcbiAgICAgIChyZXMpID0+IHRoaXMuc2VhcmNoU3VjY2VzcyhpbnB1dCwgcmVzKVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBjcmVhdGVGb2xkZXIoY3VycmVudFBhcmVudDogbnVtYmVyLCBuZXdEaXJOYW1lOiBzdHJpbmcpIHtcclxuICAgIHRoaXMuc2lkZUVmZmVjdEhlbHBlcihcclxuICAgICAgJ0NyZWF0ZSBGb2xkZXInLFxyXG4gICAgICB7ZGlyTmFtZTogbmV3RGlyTmFtZSwgcGFyZW50UGF0aDogY3VycmVudFBhcmVudCA9PT0gMCA/IG51bGwgOiBjdXJyZW50UGFyZW50fSxcclxuICAgICAgJ3Bvc3QnLFxyXG4gICAgICB0aGlzLnRyZWUuY29uZmlnLmFwaS5jcmVhdGVGb2xkZXJcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgcmVuYW1lKGlkOiBudW1iZXIsIG5ld05hbWU6IHN0cmluZykge1xyXG4gICAgdGhpcy5zaWRlRWZmZWN0SGVscGVyKFxyXG4gICAgICAnUmVuYW1lJyxcclxuICAgICAge3BhdGg6IGlkLCBuZXdOYW1lOiBuZXdOYW1lfSxcclxuICAgICAgJ3Bvc3QnLFxyXG4gICAgICB0aGlzLnRyZWUuY29uZmlnLmFwaS5yZW5hbWVGaWxlLFxyXG4gICAgICAoKSA9PiB0aGlzLnN1Y2Nlc3NXaXRoTW9kYWxDbG9zZSgpXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBzaWRlRWZmZWN0SGVscGVyKG5hbWU6IHN0cmluZywgcGFyYW1ldGVyczoge30sIGh0dHBNZXRob2Q6IHN0cmluZywgYXBpVVJMOiBzdHJpbmcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3NNZXRob2QgPSAoYSkgPT4gdGhpcy5hY3Rpb25TdWNjZXNzKGEpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBmYWlsTWV0aG9kID0gKGEsIGIpID0+IHRoaXMuYWN0aW9uRmFpbGVkKGEsIGIpXHJcbiAgKSB7XHJcbiAgICBjb25zdCBwYXJhbXMgPSB0aGlzLnBhcnNlUGFyYW1zKHBhcmFtZXRlcnMpO1xyXG5cclxuICAgIHRoaXMubmd4U21hcnRNb2RhbFNlcnZpY2UuZ2V0TW9kYWwoJ3dhaXRNb2RhbCcpLm9wZW4oKTtcclxuXHJcbiAgICB0aGlzLnJlYWNoU2VydmVyKGh0dHBNZXRob2QsIGFwaVVSTCArIHBhcmFtcylcclxuICAgICAgLnN1YnNjcmliZShcclxuICAgICAgICAoYSkgPT4gc3VjY2Vzc01ldGhvZChhKSxcclxuICAgICAgICAoZXJyKSA9PiBmYWlsTWV0aG9kKG5hbWUsIGVycilcclxuICAgICAgKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgcmVhY2hTZXJ2ZXIobWV0aG9kOiBzdHJpbmcsIGFwaVVybDogc3RyaW5nLCBkYXRhOiBhbnkgPSB7fSk6IE9ic2VydmFibGU8T2JqZWN0PiB7XHJcbiAgICBzd2l0Y2ggKG1ldGhvZC50b0xvd2VyQ2FzZSgpKSB7XHJcbiAgICAgIGNhc2UgJ2dldCc6XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQodGhpcy50cmVlLmNvbmZpZy5iYXNlVVJMICsgYXBpVXJsKTtcclxuICAgICAgY2FzZSAncG9zdCc6XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KHRoaXMudHJlZS5jb25maWcuYmFzZVVSTCArIGFwaVVybCwgZGF0YSk7XHJcbiAgICAgIGNhc2UgJ2RlbGV0ZSc6XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5kZWxldGUodGhpcy50cmVlLmNvbmZpZy5iYXNlVVJMICsgYXBpVXJsKTtcclxuICAgICAgY2FzZSAnZG93bmxvYWQnOlxyXG4gICAgICAgIHdpbmRvdy5vcGVuKHRoaXMudHJlZS5jb25maWcuYmFzZVVSTCArIGFwaVVybCwgJ19ibGFuaycpO1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIGNvbnNvbGUud2FybignW05vZGVDbGlja2VkU2VydmljZV0gSW5jb3JyZWN0IHBhcmFtcyBmb3IgdGhpcyBzaWRlLWVmZmVjdCcpO1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBwYXJzZVBhcmFtcyhwYXJhbXM6IHt9KTogc3RyaW5nIHtcclxuICAgIGxldCBxdWVyeSA9ICc/JztcclxuXHJcbiAgICBPYmplY3Qua2V5cyhwYXJhbXMpLmZpbHRlcihpdGVtID0+IHBhcmFtc1tpdGVtXSAhPT0gbnVsbCkubWFwKGtleSA9PiB7XHJcbiAgICAgIHF1ZXJ5ICs9IGtleSArICc9JyArIHBhcmFtc1trZXldICsgJyYnO1xyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHF1ZXJ5LnNsaWNlKDAsIC0xKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgc3VjY2Vzc1dpdGhNb2RhbENsb3NlKCkge1xyXG4gICAgdGhpcy5hY3Rpb25TdWNjZXNzKCk7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2lkZS12aWV3JykuY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0ZWQnKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgc2VhcmNoU3VjY2VzcyhpbnB1dDogc3RyaW5nLCBkYXRhOiBhbnkpIHtcclxuICAgIGNvbnN0IG9iaiA9IHtcclxuICAgICAgc2VhcmNoU3RyaW5nOiBpbnB1dCxcclxuICAgICAgcmVzcG9uc2U6IGRhdGFcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5hY3Rpb25TdWNjZXNzKCk7XHJcblxyXG4gICAgdGhpcy5uZ3hTbWFydE1vZGFsU2VydmljZS5zZXRNb2RhbERhdGEob2JqLCAnc2VhcmNoTW9kYWwnLCB0cnVlKTtcclxuICAgIHRoaXMubmd4U21hcnRNb2RhbFNlcnZpY2UuZ2V0TW9kYWwoJ3NlYXJjaE1vZGFsJykub3BlbigpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhY3Rpb25TdWNjZXNzKHJlc3BvbnNlOiBzdHJpbmcgPSAnJykge1xyXG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCdkaWFsb2ctb3BlbicpO1xyXG5cclxuICAgIHRoaXMubm9kZVNlcnZpY2UucmVmcmVzaEN1cnJlbnRQYXRoKCk7XHJcbiAgICB0aGlzLm5neFNtYXJ0TW9kYWxTZXJ2aWNlLmdldE1vZGFsKCd3YWl0TW9kYWwnKS5jbG9zZSgpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhY3Rpb25GYWlsZWQobmFtZTogc3RyaW5nLCBlcnJvcjogYW55KSB7XHJcbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ2RpYWxvZy1vcGVuJyk7XHJcblxyXG4gICAgdGhpcy5uZ3hTbWFydE1vZGFsU2VydmljZS5nZXRNb2RhbCgnd2FpdE1vZGFsJykuY2xvc2UoKTtcclxuICAgIHRoaXMubmd4U21hcnRNb2RhbFNlcnZpY2UuZ2V0TW9kYWwoJ2Vycm9yTW9kYWwnKS5vcGVuKCk7XHJcbiAgICBjb25zb2xlLndhcm4oJ1tOb2RlQ2xpY2tlZFNlcnZpY2VdIEFjdGlvbiBcIicgKyBuYW1lICsgJ1wiIGZhaWxlZCcsIGVycm9yKTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHtDb21wb25lbnQsIEV2ZW50RW1pdHRlciwgSW5wdXQsIE9uSW5pdCwgT3V0cHV0LCBUZW1wbGF0ZVJlZiwgVmlld0VuY2Fwc3VsYXRpb259IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge3NlbGVjdCwgU3RvcmV9IGZyb20gJ0BuZ3J4L3N0b3JlJztcclxuaW1wb3J0IHtUcmVlTW9kZWx9IGZyb20gJy4vbW9kZWxzL3RyZWUubW9kZWwnO1xyXG5pbXBvcnQge05vZGVTZXJ2aWNlfSBmcm9tICcuL3NlcnZpY2VzL25vZGUuc2VydmljZSc7XHJcbmltcG9ydCB7Tm9kZUludGVyZmFjZX0gZnJvbSAnLi9pbnRlcmZhY2VzL25vZGUuaW50ZXJmYWNlJztcclxuaW1wb3J0IHtTRVRfTE9BRElOR19TVEFURX0gZnJvbSAnLi9yZWR1Y2Vycy9hY3Rpb25zLmFjdGlvbic7XHJcbmltcG9ydCAqIGFzIEFDVElPTlMgZnJvbSAnLi9yZWR1Y2Vycy9hY3Rpb25zLmFjdGlvbic7XHJcbmltcG9ydCB7QXBwU3RvcmV9IGZyb20gJy4vcmVkdWNlcnMvcmVkdWNlci5mYWN0b3J5JztcclxuaW1wb3J0IHtOZ3hTbWFydE1vZGFsU2VydmljZX0gZnJvbSAnbmd4LXNtYXJ0LW1vZGFsJztcclxuaW1wb3J0IHtOb2RlQ2xpY2tlZFNlcnZpY2V9IGZyb20gJy4vc2VydmljZXMvbm9kZS1jbGlja2VkLnNlcnZpY2UnO1xyXG5pbXBvcnQge1RyYW5zbGF0ZVNlcnZpY2V9IGZyb20gJ0BuZ3gtdHJhbnNsYXRlL2NvcmUnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdmbS1maWxlLW1hbmFnZXInLFxyXG4gIHRlbXBsYXRlOiBgPG5nLWNvbnRhaW5lciAqbmdJZj1cImlzUG9wdXA7IHRoZW4gaXRJc1BvcHVwIGVsc2Ugc2hvd0NvbnRlbnRcIj48L25nLWNvbnRhaW5lcj5cclxuXHJcbjxuZy10ZW1wbGF0ZSAjaXRJc1BvcHVwPlxyXG4gIDxkaXYgKm5nSWY9XCIhZm1PcGVuXCI+XHJcbiAgICA8YnV0dG9uIGNsYXNzPVwiYnV0dG9uIGJpZ1wiIChjbGljayk9XCJmbVNob3dIaWRlKClcIiB0cmFuc2xhdGU9XCJcIj5PcGVuIGZpbGUgbWFuYWdlcjwvYnV0dG9uPlxyXG4gIDwvZGl2PlxyXG4gIDxkaXYgY2xhc3M9XCJmaWxlLW1hbmFnZXItYmFja2Ryb3BcIiAqbmdJZj1cImZtT3BlblwiPlxyXG4gICAgPGRpdiBjbGFzcz1cImZtTW9kYWxJbnNpZGVcIj5cclxuICAgICAgPGRpdiAqbmdJZj1cImZtT3BlbjsgdGhlbiBzaG93Q29udGVudFwiPjwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgPC9kaXY+XHJcbjwvbmctdGVtcGxhdGU+XHJcblxyXG48bmctdGVtcGxhdGUgI3Nob3dDb250ZW50PlxyXG4gIDxkaXYgY2xhc3M9XCJjb250ZW50XCI+XHJcbiAgICA8ZGl2IGNsYXNzPVwiZmlsZS1tYW5hZ2VyLW5hdmJhclwiPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwicGF0aFwiPlxyXG4gICAgICAgIDxhcHAtbmF2LWJhcj48L2FwcC1uYXYtYmFyPlxyXG4gICAgICA8L2Rpdj5cclxuXHJcbiAgICAgIDxkaXYgY2xhc3M9XCJuYXZpZ2F0aW9uXCI+XHJcbiAgICAgICAgPGFwcC1uYXZpZ2F0aW9uPlxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cImJ1dHRvbiBjbG9zZVwiIChjbGljayk9XCJmbVNob3dIaWRlKClcIiAqbmdJZj1cImlzUG9wdXBcIj5cclxuICAgICAgICAgICAgPGkgY2xhc3M9XCJmYXMgZmEtMnggZmEtdGltZXNcIj48L2k+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2FwcC1uYXZpZ2F0aW9uPlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG5cclxuICAgIDxkaXYgY2xhc3M9XCJob2xkZXJcIj5cclxuICAgICAgPGRpdiBjbGFzcz1cImZpbGUtbWFuYWdlci1sZWZ0XCI+XHJcbiAgICAgICAgPGFwcC10cmVlIFt0cmVlTW9kZWxdPVwidHJlZVwiPlxyXG4gICAgICAgICAgPG5nLXRlbXBsYXRlIGxldC1ub2Rlcz5cclxuICAgICAgICAgICAgPG5nLWNvbnRhaW5lciBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwieyRpbXBsaWNpdDogbm9kZXN9XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBbbmdUZW1wbGF0ZU91dGxldF09XCJpY29uVGVtcGxhdGUgPyBpY29uVGVtcGxhdGUgOiBkZWZhdWx0SWNvblRlbXBsYXRlXCI+XHJcbiAgICAgICAgICAgIDwvbmctY29udGFpbmVyPlxyXG4gICAgICAgICAgPC9uZy10ZW1wbGF0ZT5cclxuICAgICAgICA8L2FwcC10cmVlPlxyXG4gICAgICA8L2Rpdj5cclxuXHJcbiAgICAgIDxkaXYgY2xhc3M9XCJyaWdodFwiPlxyXG4gICAgICAgIDxhcHAtZm9sZGVyLWNvbnRlbnRcclxuICAgICAgICAgIFt0cmVlTW9kZWxdPVwidHJlZVwiXHJcbiAgICAgICAgICAob3BlblVwbG9hZERpYWxvZyk9XCJoYW5kbGVVcGxvYWREaWFsb2coJGV2ZW50KVwiXHJcbiAgICAgICAgICBbZm9sZGVyQ29udGVudFRlbXBsYXRlXT1cImZvbGRlckNvbnRlbnRUZW1wbGF0ZSA/IGZvbGRlckNvbnRlbnRUZW1wbGF0ZSA6IGRlZmF1bHRGb2xkZXJDb250ZW50VGVtcGxhdGVcIlxyXG4gICAgICAgICAgW2ZvbGRlckNvbnRlbnROZXdUZW1wbGF0ZV09XCJmb2xkZXJDb250ZW50TmV3VGVtcGxhdGUgPyBmb2xkZXJDb250ZW50TmV3VGVtcGxhdGUgOiBkZWZhdWx0Rm9sZGVyQ29udGVudE5ld1RlbXBsYXRlXCJcclxuICAgICAgICAgIFtmb2xkZXJDb250ZW50QmFja1RlbXBsYXRlXT1cImZvbGRlckNvbnRlbnRCYWNrVGVtcGxhdGUgPyBmb2xkZXJDb250ZW50QmFja1RlbXBsYXRlIDogZGVmYXVsdEZvbGRlckNvbnRlbnRCYWNrVGVtcGxhdGVcIj5cclxuICAgICAgICA8L2FwcC1mb2xkZXItY29udGVudD5cclxuICAgICAgPC9kaXY+XHJcblxyXG4gICAgICA8YXBwLXNpZGUtdmlldyBpZD1cInNpZGUtdmlld1wiXHJcbiAgICAgICAgICAgICAgICAgICAgIFtub2RlXT1cInNlbGVjdGVkTm9kZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgIFtzaWRlVmlld1RlbXBsYXRlXT1cInNpZGVWaWV3VGVtcGxhdGUgPyBzaWRlVmlld1RlbXBsYXRlIDogZGVmYXVsdFNpZGVWaWV3VGVtcGxhdGVcIlxyXG4gICAgICAgICAgICAgICAgICAgICBbYWxsb3dGb2xkZXJEb3dubG9hZF09XCJ0cmVlLmNvbmZpZy5vcHRpb25zLmFsbG93Rm9sZGVyRG93bmxvYWRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAoY2xpY2tFdmVudCk9XCJoYW5kbGVGaWxlTWFuYWdlckNsaWNrRXZlbnQoJGV2ZW50KVwiPlxyXG4gICAgICA8L2FwcC1zaWRlLXZpZXc+XHJcbiAgICA8L2Rpdj5cclxuICA8L2Rpdj5cclxuXHJcbiAgPGFwcC11cGxvYWQgKm5nSWY9XCJuZXdEaWFsb2dcIlxyXG4gICAgICAgICAgICAgIFtvcGVuRGlhbG9nXT1cIm5ld0RpYWxvZ1wiXHJcbiAgICAgICAgICAgICAgKGNsb3NlRGlhbG9nKT1cImhhbmRsZVVwbG9hZERpYWxvZyhmYWxzZSlcIlxyXG4gICAgICAgICAgICAgIChjcmVhdGVEaXIpPVwiaGFuZGxlRmlsZU1hbmFnZXJDbGlja0V2ZW50KHt0eXBlOiAnY3JlYXRlRm9sZGVyJywgcGF5bG9hZDogJGV2ZW50fSlcIj5cclxuICA8L2FwcC11cGxvYWQ+XHJcblxyXG4gIDxhcHAtbG9hZGluZy1vdmVybGF5XHJcbiAgICAqbmdJZj1cImxvYWRpbmdcIlxyXG4gICAgW2xvYWRpbmdPdmVybGF5VGVtcGxhdGVdPVwibG9hZGluZ092ZXJsYXlUZW1wbGF0ZSA/IGxvYWRpbmdPdmVybGF5VGVtcGxhdGUgOiBkZWZhdWx0TG9hZGluZ092ZXJsYXlUZW1wbGF0ZVwiPlxyXG4gIDwvYXBwLWxvYWRpbmctb3ZlcmxheT5cclxuPC9uZy10ZW1wbGF0ZT5cclxuXHJcbjxuZy10ZW1wbGF0ZSBsZXQtbm9kZSAjZGVmYXVsdEljb25UZW1wbGF0ZT5cclxuICA8ZGl2IGNsYXNzPVwiZmlsZS1tYW5hZ2VyLW5vZGVcIiBzdHlsZT1cImRpc3BsYXk6IGlubGluZS1ibG9jazsgcGFkZGluZzogM3B4XCI+XHJcbiAgICA8ZGl2ICpuZ0lmPVwibm9kZS5pc0ZvbGRlcjsgdGhlbiBpdElzRm9sZGVyIGVsc2Ugc2hvd0ZpbGVcIj48L2Rpdj5cclxuXHJcbiAgICA8bmctdGVtcGxhdGUgI2l0SXNGb2xkZXI+XHJcbiAgICAgIDxkaXYgKm5nSWY9XCJub2RlLmlzRXhwYW5kZWQ7IHRoZW4gaXNGb2xkZXJFeHBhbmRlZCBlbHNlIGlzRm9sZGVyQ2xvc2VkXCI+PC9kaXY+XHJcbiAgICA8L25nLXRlbXBsYXRlPlxyXG5cclxuICAgIDxuZy10ZW1wbGF0ZSAjc2hvd0ZpbGU+PGkgY2xhc3M9XCJmYXMgZmEtZmlsZSBjaGlsZFwiPjwvaT48L25nLXRlbXBsYXRlPlxyXG4gICAgPG5nLXRlbXBsYXRlICNpc0ZvbGRlckV4cGFuZGVkPjxpIGNsYXNzPVwiZmFzIGZhLWZvbGRlci1vcGVuIGNoaWxkXCI+PC9pPjwvbmctdGVtcGxhdGU+XHJcbiAgICA8bmctdGVtcGxhdGUgI2lzRm9sZGVyQ2xvc2VkPjxpIGNsYXNzPVwiZmFzIGZhLWZvbGRlciBjaGlsZFwiPjwvaT48L25nLXRlbXBsYXRlPlxyXG5cclxuICAgIDxzcGFuPnt7bm9kZS5uYW1lfX08L3NwYW4+XHJcbiAgPC9kaXY+XHJcbjwvbmctdGVtcGxhdGU+XHJcbjxuZy10ZW1wbGF0ZSBsZXQtbm9kZSAjZGVmYXVsdEZvbGRlckNvbnRlbnRUZW1wbGF0ZT5cclxuICA8ZGl2IGNsYXNzPVwiZmlsZS1tYW5hZ2VyLWl0ZW1cIj5cclxuICAgIDxkaXYgY2xhc3M9XCJmaWxlLXByZXZpZXdcIj5cclxuICAgICAgPGRpdiAqbmdJZj1cIm5vZGUuaXNGb2xkZXI7IHRoZW4gaXRJc0ZvbGRlciBlbHNlIHNob3dGaWxlXCI+PC9kaXY+XHJcbiAgICAgIDxuZy10ZW1wbGF0ZSAjaXRJc0ZvbGRlcj48aSBjbGFzcz1cImZhcyBmYS0zeCBmYS1mb2xkZXIgY2hpbGRcIj48L2k+PC9uZy10ZW1wbGF0ZT5cclxuICAgICAgPG5nLXRlbXBsYXRlICNzaG93RmlsZT48aSBjbGFzcz1cImZhcyBmYS0zeCBmYS1maWxlIGNoaWxkXCI+PC9pPjwvbmctdGVtcGxhdGU+XHJcbiAgICA8L2Rpdj5cclxuICAgIDxkaXYgY2xhc3M9XCJmaWxlLW5hbWVcIj5cclxuICAgICAge3tub2RlLm5hbWV9fVxyXG4gICAgPC9kaXY+XHJcbiAgPC9kaXY+XHJcbjwvbmctdGVtcGxhdGU+XHJcbjxuZy10ZW1wbGF0ZSAjZGVmYXVsdEZvbGRlckNvbnRlbnROZXdUZW1wbGF0ZT5cclxuICA8ZGl2IGNsYXNzPVwiZmlsZS1tYW5hZ2VyLWl0ZW1cIj5cclxuICAgIDxkaXYgY2xhc3M9XCJmaWxlLXByZXZpZXdcIiBzdHlsZT1cIndpZHRoOiAxMDAlOyBoZWlnaHQ6MTAwJVwiPlxyXG4gICAgICA8aSBjbGFzcz1cImZhcyBmYS0zeCBmYS1wbHVzIGNoaWxkXCIgc3R5bGU9XCJsaW5lLWhlaWdodDogMlwiPjwvaT5cclxuICAgIDwvZGl2PlxyXG4gIDwvZGl2PlxyXG48L25nLXRlbXBsYXRlPlxyXG48bmctdGVtcGxhdGUgbGV0LW5vZGUgI2RlZmF1bHRGb2xkZXJDb250ZW50QmFja1RlbXBsYXRlPlxyXG4gIDxkaXYgY2xhc3M9XCJmaWxlLW1hbmFnZXItaXRlbVwiPlxyXG4gICAgPGRpdiBjbGFzcz1cImZpbGUtcHJldmlld1wiIHN0eWxlPVwid2lkdGg6IDEwMCU7IGhlaWdodDoxMDAlXCI+XHJcbiAgICAgIDxpIGNsYXNzPVwiZmFzIGZhLTJ4IGZhLWVsbGlwc2lzLWhcIiBzdHlsZT1cImxpbmUtaGVpZ2h0OiA1XCI+PC9pPlxyXG4gICAgPC9kaXY+XHJcbiAgPC9kaXY+XHJcbjwvbmctdGVtcGxhdGU+XHJcbjxuZy10ZW1wbGF0ZSBsZXQtdGltZW91dE1lc3NhZ2UgI2RlZmF1bHRMb2FkaW5nT3ZlcmxheVRlbXBsYXRlPlxyXG4gIDxkaXYgY2xhc3M9XCJmaWxlLW1hbmFnZXItYmFja2Ryb3AgbG9hZGluZ1wiIChjbGljayk9XCJiYWNrZHJvcENsaWNrZWQoKVwiPlxyXG4gICAgPGRpdiBjbGFzcz1cImZpbGUtbWFuYWdlci1lcnJvclwiICpuZ0lmPVwidGltZW91dE1lc3NhZ2VcIj57e3RpbWVvdXRNZXNzYWdlIHwgdHJhbnNsYXRlfX08L2Rpdj5cclxuICA8L2Rpdj5cclxuICA8ZGl2IGNsYXNzPVwic3Bpbm5lclwiPlxyXG4gICAgPGkgY2xhc3M9XCJmYXMgZmEtNXggZmEtc3BpbiBmYS1zeW5jLWFsdFwiPjwvaT5cclxuICA8L2Rpdj5cclxuPC9uZy10ZW1wbGF0ZT5cclxuPG5nLXRlbXBsYXRlIGxldC1ub2RlICNkZWZhdWx0U2lkZVZpZXdUZW1wbGF0ZT5cclxuICA8ZGl2IHN0eWxlPVwicG9zaXRpb246IGFic29sdXRlOyBib3R0b206IDA7IHdpZHRoOiAxMDAlOyBtYXJnaW46IDVweCBhdXRvXCI+XHJcbiAgICA8c3BhbiAqbmdJZj1cIm5vZGUuaXNGb2xkZXJcIiB0cmFuc2xhdGU+Tm8gZGF0YSBhdmFpbGFibGUgZm9yIHRoaXMgZm9sZGVyPC9zcGFuPlxyXG4gICAgPHNwYW4gKm5nSWY9XCIhbm9kZS5pc0ZvbGRlclwiIHRyYW5zbGF0ZT5ObyBkYXRhIGF2YWlsYWJsZSBmb3IgdGhpcyBmaWxlPC9zcGFuPlxyXG4gIDwvZGl2PlxyXG48L25nLXRlbXBsYXRlPlxyXG5cclxuPG5neC1zbWFydC1tb2RhbCBpZGVudGlmaWVyPVwicmVuYW1lTW9kYWxcIiBbZGlzbWlzc2FibGVdPVwiZmFsc2VcIiBbY2xvc2FibGVdPVwiZmFsc2VcIiAqbmdJZj1cInNlbGVjdGVkTm9kZVwiICNyZW5hbWVNb2RhbD5cclxuICA8aDIgY2xhc3M9XCJtb2RhbC10aXRsZVwiIHRyYW5zbGF0ZT5cclxuICAgIFJlbmFtZSBmaWxlXHJcbiAgPC9oMj5cclxuICA8cCBjbGFzcz1cInJlbmFtZS1uYW1lXCIgdHJhbnNsYXRlPlxyXG4gICAgT2xkIG5hbWVcclxuICA8L3A+XHJcbiAgPHNwYW4gc3R5bGU9XCJtYXJnaW46IDhweFwiPnt7c2VsZWN0ZWROb2RlLm5hbWV9fTwvc3Bhbj5cclxuICA8cCBjbGFzcz1cInJlbmFtZS1uYW1lXCIgdHJhbnNsYXRlPlxyXG4gICAgTmV3IG5hbWVcclxuICA8L3A+XHJcbiAgPGlucHV0IHBsYWNlaG9sZGVyPVwiTmV3IG5hbWVcIiB0eXBlPVwidGV4dFwiIGNsYXNzPVwicmVuYW1lLWlucHV0XCIgW3ZhbHVlXT1cInNlbGVjdGVkTm9kZS5uYW1lXCIgI3JlbmFtZUlucHV0XHJcbiAgICAgICAgIChrZXl1cC5lbnRlcik9XCJoYW5kbGVGaWxlTWFuYWdlckNsaWNrRXZlbnQoe3R5cGU6ICdyZW5hbWUnLCB2YWx1ZTogcmVuYW1lSW5wdXQudmFsdWV9KVwiXHJcbiAgICAgICAgIG9uY2xpY2s9XCJ0aGlzLnNlbGVjdCgpO1wiPlxyXG4gIDxicj5cclxuXHJcbiAgPGRpdiBjbGFzcz1cInJlbmFtZS1idXR0b25cIj5cclxuICAgIDxidXR0b24gY2xhc3M9XCJidXR0b24gYmlnXCIgdHJhbnNsYXRlXHJcbiAgICAgICAgICAgIChjbGljayk9XCJoYW5kbGVGaWxlTWFuYWdlckNsaWNrRXZlbnQoe3R5cGU6ICdyZW5hbWUnLCB2YWx1ZTogcmVuYW1lSW5wdXQudmFsdWV9KVwiXHJcbiAgICAgICAgICAgIFtkaXNhYmxlZF09XCJyZW5hbWVJbnB1dC52YWx1ZSA9PT0gc2VsZWN0ZWROb2RlLm5hbWUgfHwgcmVuYW1lSW5wdXQudmFsdWUubGVuZ3RoID09PSAwXCI+XHJcbiAgICAgIFJlbmFtZVxyXG4gICAgPC9idXR0b24+XHJcbiAgICA8YnV0dG9uIGNsYXNzPVwiYnV0dG9uIGJpZ1wiIChjbGljayk9XCJyZW5hbWVNb2RhbC5jbG9zZSgpXCIgdHJhbnNsYXRlPlxyXG4gICAgICBDYW5jZWxcclxuICAgIDwvYnV0dG9uPlxyXG4gIDwvZGl2PlxyXG5cclxuPC9uZ3gtc21hcnQtbW9kYWw+XHJcbjxuZ3gtc21hcnQtbW9kYWwgKm5nSWY9XCJzZWxlY3RlZE5vZGVcIiBpZGVudGlmaWVyPVwiY29uZmlybURlbGV0ZU1vZGFsXCIgI2RlbGV0ZU1vZGFsXHJcbiAgICAgICAgICAgICAgICAgW2Rpc21pc3NhYmxlXT1cImZhbHNlXCIgW2Nsb3NhYmxlXT1cImZhbHNlXCI+XHJcbiAgPGgyIGNsYXNzPVwibW9kYWwtdGl0bGVcIj5cclxuICAgIDxzcGFuIHRyYW5zbGF0ZT5Zb3UgYXJlIHRyeWluZyB0byBkZWxldGUgZm9sbG93aW5nIDwvc3Bhbj5cclxuICAgIDxzcGFuICpuZ0lmPVwic2VsZWN0ZWROb2RlLmlzRm9sZGVyXCIgdHJhbnNsYXRlPmZvbGRlcjwvc3Bhbj5cclxuICAgIDxzcGFuICpuZ0lmPVwiIXNlbGVjdGVkTm9kZS5pc0ZvbGRlclwiIHRyYW5zbGF0ZT5maWxlPC9zcGFuPlxyXG4gIDwvaDI+XHJcblxyXG4gIDxkaXYgc3R5bGU9XCJ3aWR0aDogMTAwJTsgbWFyZ2luOiA1cHggYXV0bzsgdGV4dC1hbGlnbjogY2VudGVyXCI+e3tzZWxlY3RlZE5vZGUubmFtZX19PC9kaXY+XHJcblxyXG4gIDxkaXYgY2xhc3M9XCJyZW5hbWUtYnV0dG9uXCI+XHJcbiAgICA8YnV0dG9uIGNsYXNzPVwiYnV0dG9uIGJpZ1wiIChjbGljayk9XCJoYW5kbGVGaWxlTWFuYWdlckNsaWNrRXZlbnQoe3R5cGU6ICdyZW1vdmUnfSlcIj5cclxuICAgICAgPHNwYW4gdHJhbnNsYXRlPlllcywgZGVsZXRlIHRoaXMgPC9zcGFuPlxyXG4gICAgICA8c3BhbiAqbmdJZj1cInNlbGVjdGVkTm9kZS5pc0ZvbGRlclwiIHRyYW5zbGF0ZT5mb2xkZXI8L3NwYW4+XHJcbiAgICAgIDxzcGFuICpuZ0lmPVwiIXNlbGVjdGVkTm9kZS5pc0ZvbGRlclwiIHRyYW5zbGF0ZT5maWxlPC9zcGFuPlxyXG4gICAgPC9idXR0b24+XHJcbiAgICA8YnV0dG9uIGNsYXNzPVwiYnV0dG9uIGJpZ1wiIChjbGljayk9XCJkZWxldGVNb2RhbC5jbG9zZSgpXCIgdHJhbnNsYXRlPlxyXG4gICAgICBDYW5jZWxcclxuICAgIDwvYnV0dG9uPlxyXG4gIDwvZGl2PlxyXG48L25neC1zbWFydC1tb2RhbD5cclxuPG5neC1zbWFydC1tb2RhbCBpZGVudGlmaWVyPVwic2VhcmNoTW9kYWxcIiAjc2VhcmNoTW9kYWwgW2Nsb3NhYmxlXT1cInRydWVcIj5cclxuICA8aDIgY2xhc3M9XCJtb2RhbC10aXRsZVwiIHN0eWxlPVwibWFyZ2luLWJvdHRvbTogMnB4XCIgdHJhbnNsYXRlXHJcbiAgICAgICpuZ0lmPVwic2VhcmNoTW9kYWwuaGFzRGF0YSgpICYmIHNlYXJjaE1vZGFsLmdldERhdGEoKS5yZXNwb25zZS5sZW5ndGggIT09IDBcIj5cclxuICAgIFNlYXJjaCByZXN1bHRzIGZvclxyXG4gIDwvaDI+XHJcbiAgPGgyIGNsYXNzPVwibW9kYWwtdGl0bGVcIiBzdHlsZT1cIm1hcmdpbi1ib3R0b206IDJweFwiIHRyYW5zbGF0ZVxyXG4gICAgICAqbmdJZj1cIiFzZWFyY2hNb2RhbC5oYXNEYXRhKCkgfHwgc2VhcmNoTW9kYWwuZ2V0RGF0YSgpLnJlc3BvbnNlLmxlbmd0aCA9PT0gMFwiPlxyXG4gICAgTm8gcmVzdWx0cyBmb3VuZCBmb3JcclxuICA8L2gyPlxyXG4gIDxkaXYgc3R5bGU9XCJ0ZXh0LWFsaWduOiBjZW50ZXJcIiAqbmdJZj1cInNlYXJjaE1vZGFsLmhhc0RhdGEoKVwiPnt7c2VhcmNoTW9kYWwuZ2V0RGF0YSgpLnNlYXJjaFN0cmluZ319PC9kaXY+XHJcblxyXG4gIDxkaXYgKm5nSWY9XCJzZWFyY2hNb2RhbC5oYXNEYXRhKCkgJiYgc2VhcmNoTW9kYWwuZ2V0RGF0YSgpLnJlc3BvbnNlLmxlbmd0aCAhPT0gMFwiPlxyXG4gICAgPHRhYmxlIHN0eWxlPVwibWFyZ2luOiAwIGF1dG9cIj5cclxuICAgICAgPHRyPlxyXG4gICAgICAgIDx0ZCBjbGFzcz1cInRhYmxlLWl0ZW0gdGFibGUtaGVhZFwiIHRyYW5zbGF0ZT5GaWxlIG5hbWU8L3RkPlxyXG4gICAgICAgIDx0ZCBjbGFzcz1cInRhYmxlLWl0ZW0tc2hvcnQgdGFibGUtaGVhZFwiIHRyYW5zbGF0ZT5TaXplPC90ZD5cclxuICAgICAgPC90cj5cclxuICAgICAgPHRyICpuZ0Zvcj1cImxldCBpdGVtIG9mIHNlYXJjaE1vZGFsLmdldERhdGEoKS5yZXNwb25zZVwiIChjbGljayk9XCJzZWFyY2hDbGlja2VkKGl0ZW0pXCI+XHJcbiAgICAgICAgPHRkIHN0eWxlPVwiY3Vyc29yOiBwb2ludGVyXCI+XHJcbiAgICAgICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiaXRlbS5maWxlQ2F0ZWdvcnkgPT09ICdEJzsgZWxzZSBmaWxlXCI+XHJcbiAgICAgICAgICAgIDxpIGNsYXNzPVwiZmFzIGZhLWZvbGRlciBzZWFyY2gtb3V0cHV0LWljb25cIj48L2k+XHJcbiAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cclxuICAgICAgICAgIDxuZy10ZW1wbGF0ZSAjZmlsZT5cclxuICAgICAgICAgICAgPGkgY2xhc3M9XCJmYXMgZmEtZmlsZSBzZWFyY2gtb3V0cHV0LWljb25cIj48L2k+XHJcbiAgICAgICAgICA8L25nLXRlbXBsYXRlPlxyXG4gICAgICAgICAgPHNwYW4gc3R5bGU9XCJ0ZXh0LW92ZXJmbG93OiBlbGxpcHNpc1wiPnt7aXRlbS5uYW1lfX08L3NwYW4+XHJcbiAgICAgICAgPC90ZD5cclxuICAgICAgICA8dGQgY2xhc3M9XCJ0YWJsZS1pdGVtLXNob3J0XCI+e3tpdGVtLnNpemV9fTwvdGQ+XHJcbiAgICAgIDwvdHI+XHJcbiAgICA8L3RhYmxlPlxyXG4gIDwvZGl2PlxyXG48L25neC1zbWFydC1tb2RhbD5cclxuPG5neC1zbWFydC1tb2RhbCBpZGVudGlmaWVyPVwid2FpdE1vZGFsXCIgW2Nsb3NhYmxlXT1cImZhbHNlXCIgW2Rpc21pc3NhYmxlXT1cImZhbHNlXCIgW2VzY2FwYWJsZV09XCJmYWxzZVwiPlxyXG4gIDxoMiBjbGFzcz1cIm1vZGFsLXRpdGxlXCIgc3R5bGU9XCJtYXJnaW4tdG9wOiAyMHB4XCI+XHJcbiAgICB7eydQcm9jZXNzaW5nIHJlcXVlc3QnIHwgdHJhbnNsYXRlfX0uLi5cclxuICA8L2gyPlxyXG5cclxuICA8ZGl2IHN0eWxlPVwidGV4dC1hbGlnbjogY2VudGVyOyBoZWlnaHQ6IDcwcHhcIj5cclxuICAgIDxpIGNsYXNzPVwiZmFzIGZhLXNwaW5uZXIgZmEtc3BpbiBmYS00eFwiPjwvaT5cclxuICA8L2Rpdj5cclxuPC9uZ3gtc21hcnQtbW9kYWw+XHJcbjxuZ3gtc21hcnQtbW9kYWwgaWRlbnRpZmllcj1cImVycm9yTW9kYWxcIiBbY2xvc2FibGVdPVwidHJ1ZVwiPlxyXG4gIDxoMiBjbGFzcz1cIm1vZGFsLXRpdGxlXCIgc3R5bGU9XCJtYXJnaW4tdG9wOiAyMHB4XCI+XHJcbiAgICB7eydTb21ldGhpbmcgd2VudCB3cm9uZyB3aXRoIHlvdXIgcmVxdWVzdCcgfCB0cmFuc2xhdGV9fS4uLlxyXG4gIDwvaDI+XHJcbjwvbmd4LXNtYXJ0LW1vZGFsPlxyXG5gLFxyXG4gIHN0eWxlczogW2AuY29udGVudHtoZWlnaHQ6MTAwJTttaW4td2lkdGg6ODUwcHh9LmhvbGRlcntkaXNwbGF5Oi13ZWJraXQtZmxleDtkaXNwbGF5OmZsZXg7aGVpZ2h0OmNhbGMoMTAwJSAtIDc1cHgpfS5wYXRoe21hcmdpbjphdXRvIDA7ZGlzcGxheTpibG9ja30ubmF2aWdhdGlvbnttYXJnaW46YXV0byAwO2Rpc3BsYXk6LXdlYmtpdC1mbGV4O2Rpc3BsYXk6ZmxleH0ubmF2aWdhdGlvbiAuYnV0dG9ue21hcmdpbjowIDEwcHg7cGFkZGluZzowO3Bvc2l0aW9uOnJlbGF0aXZlfS5yaWdodHt3aWR0aDoxMDAlO3Bvc2l0aW9uOnJlbGF0aXZlO292ZXJmbG93OmF1dG99LmZpbGUtbmFtZXt3aWR0aDoxMDBweDtoZWlnaHQ6MjVweDtvdmVyZmxvdzpoaWRkZW47d2hpdGUtc3BhY2U6bm93cmFwO3RleHQtb3ZlcmZsb3c6ZWxsaXBzaXM7Ym94LXNpemluZzpib3JkZXItYm94Oy13ZWJraXQtdXNlci1zZWxlY3Q6bm9uZTstbW96LXVzZXItc2VsZWN0Om5vbmU7LW1zLXVzZXItc2VsZWN0Om5vbmU7dXNlci1zZWxlY3Q6bm9uZX0uZmlsZS1wcmV2aWV3e21hcmdpbjphdXRvfS5maWxlLXByZXZpZXcgaXtsaW5lLWhlaWdodDoxLjV9LnNwaW5uZXJ7cG9zaXRpb246YWJzb2x1dGU7dG9wOjUwJTtsZWZ0OjUwJTstd2Via2l0LXRyYW5zZm9ybTp0cmFuc2xhdGUoLTUwJSwtNTAlKTt0cmFuc2Zvcm06dHJhbnNsYXRlKC01MCUsLTUwJSk7Y3Vyc29yOnByb2dyZXNzfS5yZW5hbWUtYnV0dG9ue21hcmdpbjoyMHB4IGF1dG87ZGlzcGxheTpibG9jazt0ZXh0LWFsaWduOmNlbnRlcn0ubW9kYWwtdGl0bGV7bWFyZ2luLXRvcDo1cHg7dGV4dC1hbGlnbjpjZW50ZXJ9LnNlYXJjaC1vdXRwdXR7bWFyZ2luOjE1cHggMH0uc2VhcmNoLW91dHB1dC1pY29ue21hcmdpbjoycHggNXB4fS50YWJsZS1pdGVte3dpZHRoOjgwJX0udGFibGUtaXRlbS1zaG9ydHt3aWR0aDoyMCU7dGV4dC1hbGlnbjpyaWdodH1gXSxcclxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBGaWxlTWFuYWdlckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcbiAgQElucHV0KCkgaWNvblRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xyXG4gIEBJbnB1dCgpIGZvbGRlckNvbnRlbnRUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcclxuICBASW5wdXQoKSBmb2xkZXJDb250ZW50QmFja1RlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xyXG4gIEBJbnB1dCgpIGZvbGRlckNvbnRlbnROZXdUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcclxuICBASW5wdXQoKSBsb2FkaW5nT3ZlcmxheVRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xyXG4gIEBJbnB1dCgpIHNpZGVWaWV3VGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XHJcblxyXG4gIEBJbnB1dCgpIHRyZWU6IFRyZWVNb2RlbDtcclxuICBASW5wdXQoKSBpc1BvcHVwOiBib29sZWFuID0gZmFsc2U7XHJcbiAgQE91dHB1dCgpIGl0ZW1DbGlja2VkID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICBwcml2YXRlIF9sYW5ndWFnZTogc3RyaW5nID0gJ2VuJztcclxuICBASW5wdXQoKSBzZXQgbGFuZ3VhZ2UodmFsdWU6IHN0cmluZykge1xyXG4gICAgdGhpcy5fbGFuZ3VhZ2UgPSB2YWx1ZTtcclxuICAgIHRoaXMudHJhbnNsYXRlLnVzZSh0aGlzLmxhbmd1YWdlKTtcclxuICB9XHJcblxyXG4gIGdldCBsYW5ndWFnZSgpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRoaXMuX2xhbmd1YWdlO1xyXG4gIH1cclxuXHJcbiAgc2VsZWN0ZWROb2RlOiBOb2RlSW50ZXJmYWNlO1xyXG4gIHNpZGVNZW51Q2xvc2VkID0gdHJ1ZTtcclxuXHJcbiAgZm1PcGVuID0gZmFsc2U7XHJcbiAgbG9hZGluZzogYm9vbGVhbjtcclxuICBuZXdEaWFsb2cgPSBmYWxzZTtcclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwcml2YXRlIHN0b3JlOiBTdG9yZTxBcHBTdG9yZT4sXHJcbiAgICBwcml2YXRlIG5vZGVTZXJ2aWNlOiBOb2RlU2VydmljZSxcclxuICAgIHByaXZhdGUgbm9kZUNsaWNrZWRTZXJ2aWNlOiBOb2RlQ2xpY2tlZFNlcnZpY2UsXHJcbiAgICBwdWJsaWMgbmd4U21hcnRNb2RhbFNlcnZpY2U6IE5neFNtYXJ0TW9kYWxTZXJ2aWNlLFxyXG4gICAgcHVibGljIHRyYW5zbGF0ZTogVHJhbnNsYXRlU2VydmljZVxyXG4gICkge1xyXG4gICAgdHJhbnNsYXRlLnNldERlZmF1bHRMYW5nKCdlbicpO1xyXG4gICAgdHJhbnNsYXRlLnVzZSgnZW4nKTtcclxuICB9XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgd2luZG93LmNvbnNvbGUgPSB3aW5kb3cuY29uc29sZSB8fCB7fTtcclxuICAgIHdpbmRvdy5jb25zb2xlLmxvZyA9IHdpbmRvdy5jb25zb2xlLmxvZyB8fCBmdW5jdGlvbiAoKSB7XHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMubm9kZVNlcnZpY2UudHJlZSA9IHRoaXMudHJlZTtcclxuICAgIHRoaXMubm9kZUNsaWNrZWRTZXJ2aWNlLnRyZWUgPSB0aGlzLnRyZWU7XHJcbiAgICB0aGlzLm5vZGVTZXJ2aWNlLnN0YXJ0TWFuYWdlckF0KHRoaXMudHJlZS5jdXJyZW50UGF0aCk7XHJcblxyXG4gICAgdGhpcy5zdG9yZVxyXG4gICAgICAucGlwZShzZWxlY3Qoc3RhdGUgPT4gc3RhdGUuZmlsZU1hbmFnZXJTdGF0ZS5pc0xvYWRpbmcpKVxyXG4gICAgICAuc3Vic2NyaWJlKChkYXRhOiBib29sZWFuKSA9PiB7XHJcbiAgICAgICAgdGhpcy5sb2FkaW5nID0gZGF0YTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgdGhpcy5zdG9yZVxyXG4gICAgICAucGlwZShzZWxlY3Qoc3RhdGUgPT4gc3RhdGUuZmlsZU1hbmFnZXJTdGF0ZS5zZWxlY3RlZE5vZGUpKVxyXG4gICAgICAuc3Vic2NyaWJlKChub2RlOiBOb2RlSW50ZXJmYWNlKSA9PiB7XHJcbiAgICAgICAgaWYgKCFub2RlKSB7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBmaXhlZCBoaWdobGlnaHRpbmcgZXJyb3Igd2hlbiBjbG9zaW5nIG5vZGUgYnV0IG5vdCBjaGFuZ2luZyBwYXRoXHJcbiAgICAgICAgaWYgKChub2RlLmlzRXhwYW5kZWQgJiYgbm9kZS5wYXRoVG9Ob2RlICE9PSB0aGlzLm5vZGVTZXJ2aWNlLmN1cnJlbnRQYXRoKSAmJiAhbm9kZS5zdGF5T3Blbikge1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5oYW5kbGVGaWxlTWFuYWdlckNsaWNrRXZlbnQoe3R5cGU6ICdzZWxlY3QnLCBub2RlOiBub2RlfSk7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgb25JdGVtQ2xpY2tlZChldmVudDogYW55KTogdm9pZCB7XHJcbiAgICB0aGlzLml0ZW1DbGlja2VkLmVtaXQoZXZlbnQpO1xyXG4gIH1cclxuXHJcbiAgc2VhcmNoQ2xpY2tlZChkYXRhOiBhbnkpIHtcclxuICAgIC8vIGNvbnNvbGUubG9nKGRhdGEpO1xyXG5cclxuICAgIGNvbnN0IG5vZGUgPSB0aGlzLm5vZGVTZXJ2aWNlLmZpbmROb2RlQnlJZChkYXRhLmlkKTtcclxuICAgIHRoaXMubmd4U21hcnRNb2RhbFNlcnZpY2UuZ2V0TW9kYWwoJ3NlYXJjaE1vZGFsJykuY2xvc2UoKTtcclxuICAgIHRoaXMuc3RvcmUuZGlzcGF0Y2goe3R5cGU6IEFDVElPTlMuU0VUX1NFTEVDVEVEX05PREUsIHBheWxvYWQ6IG5vZGV9KTtcclxuICB9XHJcblxyXG4gIGhhbmRsZUZpbGVNYW5hZ2VyQ2xpY2tFdmVudChldmVudDogYW55KSB7XHJcbiAgICBzd2l0Y2ggKGV2ZW50LnR5cGUpIHtcclxuICAgICAgY2FzZSAnY2xvc2VTaWRlVmlldycgOlxyXG4gICAgICAgIHJldHVybiB0aGlzLm5vZGVDbGlja0hhbmRsZXIoZXZlbnQubm9kZSwgdHJ1ZSk7XHJcblxyXG4gICAgICBjYXNlICdzZWxlY3QnIDpcclxuICAgICAgICB0aGlzLm9uSXRlbUNsaWNrZWQoZXZlbnQpO1xyXG4gICAgICAgIHRoaXMuaGlnaGxpZ2h0U2VsZWN0ZWQoZXZlbnQubm9kZSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubm9kZUNsaWNrSGFuZGxlcihldmVudC5ub2RlKTtcclxuXHJcbiAgICAgIGNhc2UgJ2Rvd25sb2FkJyA6XHJcbiAgICAgICAgdGhpcy5ub2RlQ2xpY2tlZFNlcnZpY2Uuc3RhcnREb3dubG9hZChldmVudC5ub2RlKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5vbkl0ZW1DbGlja2VkKGV2ZW50KTtcclxuXHJcbiAgICAgIGNhc2UgJ3JlbmFtZUNvbmZpcm0nIDpcclxuICAgICAgICByZXR1cm4gdGhpcy5uZ3hTbWFydE1vZGFsU2VydmljZS5nZXRNb2RhbCgncmVuYW1lTW9kYWwnKS5vcGVuKCk7XHJcbiAgICAgIGNhc2UgJ3JlbmFtZScgOlxyXG4gICAgICAgIHRoaXMubmd4U21hcnRNb2RhbFNlcnZpY2UuZ2V0TW9kYWwoJ3JlbmFtZU1vZGFsJykuY2xvc2UoKTtcclxuXHJcbiAgICAgICAgdGhpcy5ub2RlQ2xpY2tlZFNlcnZpY2UucmVuYW1lKHRoaXMuc2VsZWN0ZWROb2RlLmlkLCBldmVudC52YWx1ZSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub25JdGVtQ2xpY2tlZCh7XHJcbiAgICAgICAgICB0eXBlOiBldmVudC50eXBlLFxyXG4gICAgICAgICAgbm9kZTogdGhpcy5zZWxlY3RlZE5vZGUsXHJcbiAgICAgICAgICBuZXdOYW1lOiBldmVudC52YWx1ZVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgY2FzZSAncmVtb3ZlQXNrJzpcclxuICAgICAgICByZXR1cm4gdGhpcy5uZ3hTbWFydE1vZGFsU2VydmljZS5nZXRNb2RhbCgnY29uZmlybURlbGV0ZU1vZGFsJykub3BlbigpO1xyXG4gICAgICBjYXNlICdyZW1vdmUnOlxyXG4gICAgICAgIHRoaXMubmd4U21hcnRNb2RhbFNlcnZpY2UuZ2V0TW9kYWwoJ2NvbmZpcm1EZWxldGVNb2RhbCcpLmNsb3NlKCk7XHJcblxyXG4gICAgICAgIHRoaXMubm9kZUNsaWNrZWRTZXJ2aWNlLmluaXREZWxldGUodGhpcy5zZWxlY3RlZE5vZGUpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9uSXRlbUNsaWNrZWQoe1xyXG4gICAgICAgICAgdHlwZTogZXZlbnQudHlwZSxcclxuICAgICAgICAgIG5vZGU6IHRoaXMuc2VsZWN0ZWROb2RlXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICBjYXNlICdjcmVhdGVGb2xkZXInIDpcclxuICAgICAgICBjb25zdCBwYXJlbnRJZCA9IHRoaXMubm9kZVNlcnZpY2UuZmluZE5vZGVCeVBhdGgodGhpcy5ub2RlU2VydmljZS5jdXJyZW50UGF0aCkuaWQ7XHJcblxyXG4gICAgICAgIHRoaXMubm9kZUNsaWNrZWRTZXJ2aWNlLmNyZWF0ZUZvbGRlcihwYXJlbnRJZCwgZXZlbnQucGF5bG9hZCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub25JdGVtQ2xpY2tlZCh7XHJcbiAgICAgICAgICB0eXBlOiBldmVudC50eXBlLFxyXG4gICAgICAgICAgcGFyZW50SWQ6IHBhcmVudElkLFxyXG4gICAgICAgICAgbmV3RGlyTmFtZTogZXZlbnQucGF5bG9hZFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbm9kZUNsaWNrSGFuZGxlcihub2RlOiBOb2RlSW50ZXJmYWNlLCBjbG9zaW5nPzogYm9vbGVhbikge1xyXG4gICAgaWYgKG5vZGUubmFtZSA9PT0gJ3Jvb3QnKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoY2xvc2luZykge1xyXG4gICAgICBjb25zdCBwYXJlbnROb2RlID0gdGhpcy5ub2RlU2VydmljZS5maW5kTm9kZUJ5UGF0aCh0aGlzLm5vZGVTZXJ2aWNlLmN1cnJlbnRQYXRoKTtcclxuICAgICAgdGhpcy5zdG9yZS5kaXNwYXRjaCh7dHlwZTogQUNUSU9OUy5TRVRfU0VMRUNURURfTk9ERSwgcGF5bG9hZDogcGFyZW50Tm9kZX0pO1xyXG4gICAgICB0aGlzLnNpZGVNZW51Q2xvc2VkID0gdHJ1ZTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICBpZiAodGhpcy5zZWxlY3RlZE5vZGUgPT09IG5vZGUgJiYgdGhpcy5zaWRlTWVudUNsb3NlZClcclxuICAgICAgICB0aGlzLnNpZGVNZW51Q2xvc2VkID0gZmFsc2U7XHJcbiAgICAgIGVsc2UgaWYgKHRoaXMuc2VsZWN0ZWROb2RlID09PSBub2RlICYmICF0aGlzLnNpZGVNZW51Q2xvc2VkKVxyXG4gICAgICAgIHRoaXMuc2lkZU1lbnVDbG9zZWQgPSB0cnVlO1xyXG4gICAgICBlbHNlIGlmICh0aGlzLnNlbGVjdGVkTm9kZSAhPT0gbm9kZSAmJiB0aGlzLnNpZGVNZW51Q2xvc2VkKVxyXG4gICAgICAgIHRoaXMuc2lkZU1lbnVDbG9zZWQgPSBmYWxzZTtcclxuICAgICAgZWxzZSBpZiAodGhpcy5zZWxlY3RlZE5vZGUgIT09IG5vZGUgJiYgIXRoaXMuc2lkZU1lbnVDbG9zZWQpXHJcbiAgICAgICAgdGhpcy5zaWRlTWVudUNsb3NlZCA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuc2VsZWN0ZWROb2RlID0gbm9kZTtcclxuXHJcbiAgICAvLyB0b2RvIGludmVzdGlnYXRlIHRoaXMgd29ya2Fyb3VuZCAtIHdhcm5pbmc6IFtGaWxlIE1hbmFnZXJdIGZhaWxlZCB0byBmaW5kIHJlcXVlc3RlZCBub2RlIGZvciBwYXRoOiBbcGF0aF1cclxuICAgIGlmKCFkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2lkZS12aWV3JykpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLnNpZGVNZW51Q2xvc2VkKSB7XHJcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzaWRlLXZpZXcnKS5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZCcpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NpZGUtdmlldycpLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkJyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyB0b2RvIHN0YXkgRFJZIVxyXG4gIGhpZ2hsaWdodFNlbGVjdGVkKG5vZGU6IE5vZGVJbnRlcmZhY2UpIHtcclxuICAgIGxldCBwYXRoVG9Ob2RlID0gbm9kZS5wYXRoVG9Ob2RlO1xyXG5cclxuICAgIGlmIChwYXRoVG9Ob2RlLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICBwYXRoVG9Ob2RlID0gJ3Jvb3QnO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHRyZWVFbGVtZW50ID0gdGhpcy5nZXRFbGVtZW50QnlJZChwYXRoVG9Ob2RlLCAndHJlZV8nKTtcclxuICAgIGNvbnN0IGZjRWxlbWVudCA9IHRoaXMuZ2V0RWxlbWVudEJ5SWQocGF0aFRvTm9kZSwgJ2ZjXycpO1xyXG4gICAgaWYgKCF0cmVlRWxlbWVudCAmJiAhZmNFbGVtZW50KSB7XHJcbiAgICAgIGNvbnNvbGUud2FybignW0ZpbGUgTWFuYWdlcl0gZmFpbGVkIHRvIGZpbmQgcmVxdWVzdGVkIG5vZGUgZm9yIHBhdGg6JywgcGF0aFRvTm9kZSk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnJlbW92ZUNsYXNzKCdoaWdobGlnaHRlZCcpO1xyXG4gICAgdGhpcy5yZW1vdmVDbGFzcygnbGlnaHQnKTtcclxuXHJcbiAgICBpZiAoZmNFbGVtZW50KVxyXG4gICAgICB0aGlzLmhpZ2hpbGdodENoaWxkRWxlbWVudChmY0VsZW1lbnQpO1xyXG4gICAgaWYgKHRyZWVFbGVtZW50KVxyXG4gICAgICB0aGlzLmhpZ2hpbGdodENoaWxkRWxlbWVudCh0cmVlRWxlbWVudCwgdHJ1ZSk7XHJcblxyXG4gICAgLy8gcGFyZW50IG5vZGUgaGlnaGxpZ2h0XHJcbiAgICBsZXQgcGF0aFRvUGFyZW50ID0gbm9kZS5wYXRoVG9QYXJlbnQ7XHJcbiAgICBpZiAocGF0aFRvUGFyZW50ID09PSBudWxsIHx8IG5vZGUucGF0aFRvTm9kZSA9PT0gdGhpcy5ub2RlU2VydmljZS5jdXJyZW50UGF0aCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHBhdGhUb1BhcmVudC5sZW5ndGggPT09IDApIHtcclxuICAgICAgcGF0aFRvUGFyZW50ID0gJ3Jvb3QnO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHBhcmVudEVsZW1lbnQgPSB0aGlzLmdldEVsZW1lbnRCeUlkKHBhdGhUb1BhcmVudCwgJ3RyZWVfJyk7XHJcbiAgICBpZiAoIXBhcmVudEVsZW1lbnQpIHtcclxuICAgICAgY29uc29sZS53YXJuKCdbRmlsZSBNYW5hZ2VyXSBmYWlsZWQgdG8gZmluZCByZXF1ZXN0ZWQgcGFyZW50IG5vZGUgZm9yIHBhdGg6JywgcGF0aFRvUGFyZW50KTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuaGlnaGlsZ2h0Q2hpbGRFbGVtZW50KHBhcmVudEVsZW1lbnQpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBoaWdoaWxnaHRDaGlsZEVsZW1lbnQoZWw6IEhUTUxFbGVtZW50LCBsaWdodDogYm9vbGVhbiA9IGZhbHNlKSB7XHJcbiAgICBlbC5jaGlsZHJlblswXSAvLyBhcHBub2RlIGRpdiB3cmFwcGVyXHJcbiAgICAgIC5jaGlsZHJlblswXSAvLyBuZyB0ZW1wbGF0ZSBmaXJzdCBpdGVtXHJcbiAgICAgIC5jbGFzc0xpc3QuYWRkKCdoaWdobGlnaHRlZCcpO1xyXG5cclxuICAgIGlmIChsaWdodClcclxuICAgICAgZWwuY2hpbGRyZW5bMF1cclxuICAgICAgICAuY2hpbGRyZW5bMF1cclxuICAgICAgICAuY2xhc3NMaXN0LmFkZCgnbGlnaHQnKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZ2V0RWxlbWVudEJ5SWQoaWQ6IHN0cmluZywgcHJlZml4OiBzdHJpbmcgPSAnJyk6IEhUTUxFbGVtZW50IHtcclxuICAgIGNvbnN0IGZ1bGxJZCA9IHByZWZpeCArIGlkO1xyXG4gICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGZ1bGxJZCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHJlbW92ZUNsYXNzKGNsYXNzTmFtZTogc3RyaW5nKSB7XHJcbiAgICBBcnJheS5mcm9tKGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoY2xhc3NOYW1lKSlcclxuICAgICAgLm1hcCgoZWw6IEhUTUxFbGVtZW50KSA9PiBlbC5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZSkpO1xyXG4gIH1cclxuXHJcbiAgZm1TaG93SGlkZSgpIHtcclxuICAgIHRoaXMuZm1PcGVuID0gIXRoaXMuZm1PcGVuO1xyXG4gIH1cclxuXHJcbiAgYmFja2Ryb3BDbGlja2VkKCkge1xyXG4gICAgLy8gdG9kbyBnZXQgcmlkIG9mIHRoaXMgdWdseSB3b3JrYXJvdW5kXHJcbiAgICAvLyB0b2RvIGZpcmUgdXNlckNhbmNlbGVkTG9hZGluZyBldmVudFxyXG4gICAgdGhpcy5zdG9yZS5kaXNwYXRjaCh7dHlwZTogU0VUX0xPQURJTkdfU1RBVEUsIHBheWxvYWQ6IGZhbHNlfSk7XHJcbiAgfVxyXG5cclxuICBoYW5kbGVVcGxvYWREaWFsb2coZXZlbnQ6IGFueSkge1xyXG4gICAgdGhpcy5uZXdEaWFsb2cgPSBldmVudDtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHtDb21wb25lbnQsIEV2ZW50RW1pdHRlciwgSW5wdXQsIE9uSW5pdCwgT3V0cHV0LCBUZW1wbGF0ZVJlZn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7c2VsZWN0LCBTdG9yZX0gZnJvbSAnQG5ncngvc3RvcmUnO1xyXG5pbXBvcnQge1RyZWVNb2RlbH0gZnJvbSAnLi4vLi4vbW9kZWxzL3RyZWUubW9kZWwnO1xyXG5pbXBvcnQge05vZGVTZXJ2aWNlfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9ub2RlLnNlcnZpY2UnO1xyXG5pbXBvcnQge05vZGVJbnRlcmZhY2V9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMvbm9kZS5pbnRlcmZhY2UnO1xyXG5pbXBvcnQge0FwcFN0b3JlfSBmcm9tICcuLi8uLi9yZWR1Y2Vycy9yZWR1Y2VyLmZhY3RvcnknO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdhcHAtZm9sZGVyLWNvbnRlbnQnLFxyXG4gIHRlbXBsYXRlOiBgPGRpdiBjbGFzcz1cIml0ZW0taG9sZGVyXCI+XHJcbiAgPG5nLWNvbnRhaW5lciAqbmdJZj1cIm5vZGVzLmlkICE9PSAwXCI+XHJcbiAgICA8YXBwLW5vZGUgW25vZGVdPW5vZGVzIGlkPVwie3tub2Rlcy5wYXRoVG9Ob2RlfX1cIj5cclxuICAgICAgPG5nLWNvbnRhaW5lciBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwieyRpbXBsaWNpdDogbm9kZXN9XCJcclxuICAgICAgICAgICAgICAgICAgICBbbmdUZW1wbGF0ZU91dGxldF09XCJmb2xkZXJDb250ZW50QmFja1RlbXBsYXRlXCI+XHJcbiAgICAgIDwvbmctY29udGFpbmVyPlxyXG4gICAgPC9hcHAtbm9kZT5cclxuICA8L25nLWNvbnRhaW5lcj5cclxuXHJcbiAgPG5nLWNvbnRhaW5lciAqbmdGb3I9XCJsZXQgbm9kZSBvZiBvYmoua2V5cyhub2Rlcy5jaGlsZHJlbilcIj5cclxuICAgIDxhcHAtbm9kZSBbbm9kZV09XCJub2Rlcy5jaGlsZHJlbltub2RlXVwiXHJcbiAgICAgICAgICAgICAgaWQ9XCJmY197e25vZGVzLmNoaWxkcmVuW25vZGVdLnBhdGhUb05vZGV9fVwiPlxyXG4gICAgICA8bmctY29udGFpbmVyIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7JGltcGxpY2l0OiBub2Rlcy5jaGlsZHJlbltub2RlXX1cIlxyXG4gICAgICAgICAgICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImZvbGRlckNvbnRlbnRUZW1wbGF0ZVwiPlxyXG4gICAgICA8L25nLWNvbnRhaW5lcj5cclxuICAgIDwvYXBwLW5vZGU+XHJcbiAgPC9uZy1jb250YWluZXI+XHJcblxyXG4gIDxkaXYgY2xhc3M9XCJuZXdcIiAoY2xpY2spPVwibmV3Q2xpY2tlZEFjdGlvbigpXCI+XHJcbiAgICA8bmctY29udGFpbmVyIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImZvbGRlckNvbnRlbnROZXdUZW1wbGF0ZVwiPjwvbmctY29udGFpbmVyPlxyXG4gIDwvZGl2PlxyXG48L2Rpdj5cclxuYCxcclxuICBzdHlsZXM6IFtgLml0ZW0taG9sZGVye2JveC1zaXppbmc6Ym9yZGVyLWJveDtkaXNwbGF5Oi13ZWJraXQtZmxleDtkaXNwbGF5OmZsZXg7LXdlYmtpdC1mbGV4LWZsb3c6d3JhcDtmbGV4LWZsb3c6d3JhcH0uaXRlbS1ob2xkZXIgLm5ld3tkaXNwbGF5OmlubGluZX1gXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgRm9sZGVyQ29udGVudENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcbiAgQElucHV0KCkgZm9sZGVyQ29udGVudFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xyXG4gIEBJbnB1dCgpIGZvbGRlckNvbnRlbnRCYWNrVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XHJcbiAgQElucHV0KCkgZm9sZGVyQ29udGVudE5ld1RlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xyXG5cclxuICBASW5wdXQoKSB0cmVlTW9kZWw6IFRyZWVNb2RlbDtcclxuXHJcbiAgQE91dHB1dCgpIG9wZW5VcGxvYWREaWFsb2cgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gIG5vZGVzOiBOb2RlSW50ZXJmYWNlO1xyXG4gIG9iaiA9IE9iamVjdDtcclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwcml2YXRlIG5vZGVTZXJ2aWNlOiBOb2RlU2VydmljZSxcclxuICAgIHByaXZhdGUgc3RvcmU6IFN0b3JlPEFwcFN0b3JlPlxyXG4gICkge1xyXG4gIH1cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgICB0aGlzLnN0b3JlXHJcbiAgICAgIC5waXBlKHNlbGVjdChzdGF0ZSA9PiBzdGF0ZS5maWxlTWFuYWdlclN0YXRlLnBhdGgpKVxyXG4gICAgICAuc3Vic2NyaWJlKChwYXRoOiBzdHJpbmcpID0+IHtcclxuICAgICAgICB0aGlzLm5vZGVzID0gdGhpcy5ub2RlU2VydmljZS5maW5kTm9kZUJ5UGF0aChwYXRoKTtcclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICBuZXdDbGlja2VkQWN0aW9uKCkge1xyXG4gICAgdGhpcy5vcGVuVXBsb2FkRGlhbG9nLmVtaXQodHJ1ZSk7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7QWZ0ZXJWaWV3SW5pdCwgQ29tcG9uZW50LCBDb250ZW50Q2hpbGQsIElucHV0LCBPbkluaXQsIFRlbXBsYXRlUmVmfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtOb2RlSW50ZXJmYWNlfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzL25vZGUuaW50ZXJmYWNlJztcclxuaW1wb3J0IHtUcmVlTW9kZWx9IGZyb20gJy4uLy4uL21vZGVscy90cmVlLm1vZGVsJztcclxuaW1wb3J0IHtOb2RlU2VydmljZX0gZnJvbSAnLi4vLi4vc2VydmljZXMvbm9kZS5zZXJ2aWNlJztcclxuaW1wb3J0IHtzZWxlY3QsIFN0b3JlfSBmcm9tICdAbmdyeC9zdG9yZSc7XHJcbmltcG9ydCB7QXBwU3RvcmV9IGZyb20gJy4uLy4uL3JlZHVjZXJzL3JlZHVjZXIuZmFjdG9yeSc7XHJcbmltcG9ydCAqIGFzIEFDVElPTlMgZnJvbSAnLi4vLi4vcmVkdWNlcnMvYWN0aW9ucy5hY3Rpb24nO1xyXG5pbXBvcnQge2ZpcnN0fSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2FwcC10cmVlJyxcclxuICB0ZW1wbGF0ZTogYDxhcHAtbm9kZS1saXN0ZXIgW3Nob3dGaWxlc109XCJ0cmVlTW9kZWwuY29uZmlnLm9wdGlvbnMuc2hvd0ZpbGVzSW5zaWRlVHJlZVwiXHJcbiAgICAgICAgICAgICAgICAgW25vZGVzXT1cIntjaGlsZHJlbjogbm9kZXN9XCI+XHJcbiAgPG5nLXRlbXBsYXRlIGxldC1ub2Rlcz5cclxuICAgIDxuZy1jb250YWluZXIgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cInskaW1wbGljaXQ6IG5vZGVzfVwiIFtuZ1RlbXBsYXRlT3V0bGV0XT1cInRlbXBsYXRlUmVmXCI+PC9uZy1jb250YWluZXI+XHJcbiAgPC9uZy10ZW1wbGF0ZT5cclxuPC9hcHAtbm9kZS1saXN0ZXI+XHJcbmAsXHJcbiAgc3R5bGVzOiBbYGBdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBUcmVlQ29tcG9uZW50IGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgT25Jbml0IHtcclxuICBAQ29udGVudENoaWxkKFRlbXBsYXRlUmVmKSB0ZW1wbGF0ZVJlZjogVGVtcGxhdGVSZWY8YW55PjtcclxuXHJcbiAgQElucHV0KCkgdHJlZU1vZGVsOiBUcmVlTW9kZWw7XHJcblxyXG4gIG5vZGVzOiBOb2RlSW50ZXJmYWNlO1xyXG4gIGN1cnJlbnRUcmVlTGV2ZWwgPSAnJztcclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwcml2YXRlIG5vZGVTZXJ2aWNlOiBOb2RlU2VydmljZSxcclxuICAgIHByaXZhdGUgc3RvcmU6IFN0b3JlPEFwcFN0b3JlPlxyXG4gICkge1xyXG4gIH1cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgICB0aGlzLm5vZGVzID0gdGhpcy50cmVlTW9kZWwubm9kZXM7XHJcblxyXG4gICAgLy90b2RvIG1vdmUgdGhpcyBzdG9yZSB0byBwcm9wZXIgcGxhY2VcclxuICAgIHRoaXMuc3RvcmVcclxuICAgICAgLnBpcGUoc2VsZWN0KHN0YXRlID0+IHN0YXRlLmZpbGVNYW5hZ2VyU3RhdGUucGF0aCkpXHJcbiAgICAgIC5zdWJzY3JpYmUoKHBhdGg6IHN0cmluZykgPT4ge1xyXG4gICAgICAgIHRoaXMubm9kZVNlcnZpY2UuZ2V0Tm9kZXMocGF0aCk7XHJcblxyXG4gICAgICAgIHRoaXMuY3VycmVudFRyZWVMZXZlbCA9IHRoaXMudHJlZU1vZGVsLmN1cnJlbnRQYXRoO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy50cmVlTW9kZWwuY3VycmVudFBhdGggPSBwYXRoO1xyXG4gICAgICB9KTtcclxuICB9XHJcblxyXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcclxuICAgIHRoaXMuc3RvcmVcclxuICAgICAgLnBpcGUoc2VsZWN0KHN0YXRlID0+IHN0YXRlLmZpbGVNYW5hZ2VyU3RhdGUucGF0aCkpXHJcbiAgICAgIC5waXBlKGZpcnN0KCkpXHJcbiAgICAgIC5zdWJzY3JpYmUoKHBhdGg6IHN0cmluZykgPT4ge1xyXG4gICAgICAgIGNvbnN0IG5vZGVzID0gdGhpcy5ub2RlU2VydmljZS5maW5kTm9kZUJ5UGF0aChwYXRoKTtcclxuICAgICAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKHt0eXBlOiBBQ1RJT05TLlNFVF9TRUxFQ1RFRF9OT0RFLCBwYXlsb2FkOiBub2Rlc30pO1xyXG4gICAgICB9KTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHtDb21wb25lbnQsIENvbnRlbnRDaGlsZCwgSW5wdXQsIE9uSW5pdCwgVGVtcGxhdGVSZWZ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge05vZGVJbnRlcmZhY2V9IGZyb20gJy4uLy4uLy4uL2ludGVyZmFjZXMvbm9kZS5pbnRlcmZhY2UnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdhcHAtbm9kZS1saXN0ZXInLFxyXG4gIHRlbXBsYXRlOiBgPHVsIGNsYXNzPVwibm9kZS1saXN0ZXItZmxpc3RcIj5cclxuICA8IS0tSW4gb3JkZXIgdG8gYXZvaWQgaGF2aW5nIHRvIGNyZWF0ZSB0aGF0IGV4dHJhIGRpdiwgd2UgY2FuIGluc3RlYWQgdXNlIG5nLWNvbnRhaW5lciBkaXJlY3RpdmUtLT5cclxuICA8bmctY29udGFpbmVyICpuZ0Zvcj1cImxldCBub2RlIG9mIG9iai5rZXlzKG5vZGVzKVwiPlxyXG4gICAgPGxpIGNsYXNzPVwibm9kZS1saXN0ZXItbGlzdC1pdGVtXCIgKm5nSWY9XCJub2Rlc1tub2RlXS5pc0ZvbGRlciB8fCBzaG93RmlsZXNcIj5cclxuXHJcbiAgICAgIDxhcHAtbm9kZSBjbGFzcz1cIm5vZGUtbGlzdGVyLWFwcC1ub2RlXCIgW25vZGVdPVwibm9kZXNbbm9kZV1cIiBpZD1cInRyZWVfe3tub2Rlc1tub2RlXS5pZCA9PT0gMCA/ICdyb290JyA6IG5vZGVzW25vZGVdLnBhdGhUb05vZGV9fVwiPlxyXG4gICAgICAgIDxuZy1jb250YWluZXIgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cInskaW1wbGljaXQ6IChub2Rlc1tub2RlXSl9XCJcclxuICAgICAgICAgICAgICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0XT1cInRlbXBsYXRlUmVmXCI+XHJcbiAgICAgICAgPC9uZy1jb250YWluZXI+XHJcbiAgICAgIDwvYXBwLW5vZGU+XHJcblxyXG4gICAgICA8YXBwLW5vZGUtbGlzdGVyIGNsYXNzPVwibm9kZS1saXN0ZXJcIiAqbmdJZj1cIm9iai5rZXlzKG5vZGVzW25vZGVdLmNoaWxkcmVuKS5sZW5ndGggPiAwXCJcclxuICAgICAgICAgICAgICAgICAgICAgICBbc2hvd0ZpbGVzXT1cInNob3dGaWxlc1wiIFtub2Rlc109XCJub2Rlc1tub2RlXS5jaGlsZHJlblwiPlxyXG4gICAgICAgIDxuZy10ZW1wbGF0ZSBsZXQtbm9kZXM+XHJcbiAgICAgICAgICA8bmctY29udGFpbmVyIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7JGltcGxpY2l0OiAobm9kZXMpfVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0XT1cInRlbXBsYXRlUmVmXCI+XHJcbiAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cclxuICAgICAgICA8L25nLXRlbXBsYXRlPlxyXG4gICAgICA8L2FwcC1ub2RlLWxpc3Rlcj5cclxuICAgIDwvbGk+XHJcbiAgPC9uZy1jb250YWluZXI+XHJcbjwvdWw+XHJcbmAsXHJcbiAgc3R5bGVzOiBbYC5ub2RlLWxpc3Rlci1mbGlzdHttYXJnaW46MCAwIDAgMWVtO3BhZGRpbmc6MDtsaXN0LXN0eWxlOm5vbmU7d2hpdGUtc3BhY2U6bm93cmFwfS5ub2RlLWxpc3Rlci1saXN0LWl0ZW17bGlzdC1zdHlsZTpub25lO2xpbmUtaGVpZ2h0OjEuMmVtO2ZvbnQtc2l6ZToxZW07ZGlzcGxheTppbmxpbmV9Lm5vZGUtbGlzdGVyLWxpc3QtaXRlbSAubm9kZS1saXN0ZXItYXBwLW5vZGUuZGVzZWxlY3RlZCsubm9kZS1saXN0ZXIgdWx7ZGlzcGxheTpub25lfWBdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBOb2RlTGlzdGVyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuICBAQ29udGVudENoaWxkKFRlbXBsYXRlUmVmKSB0ZW1wbGF0ZVJlZjogVGVtcGxhdGVSZWY8YW55PjtcclxuICBASW5wdXQoKSBub2RlczogTm9kZUludGVyZmFjZTtcclxuICBASW5wdXQoKSBzaG93RmlsZXM6IGJvb2xlYW47XHJcblxyXG4gIG9iaiA9IE9iamVjdDtcclxuXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgfVxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHtDb21wb25lbnQsIElucHV0LCBPbkluaXR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge05vZGVJbnRlcmZhY2V9IGZyb20gJy4uLy4uLy4uL2ludGVyZmFjZXMvbm9kZS5pbnRlcmZhY2UnO1xyXG5pbXBvcnQge1N0b3JlfSBmcm9tICdAbmdyeC9zdG9yZSc7XHJcblxyXG5pbXBvcnQgKiBhcyBBQ1RJT05TIGZyb20gJy4uLy4uLy4uL3JlZHVjZXJzL2FjdGlvbnMuYWN0aW9uJztcclxuaW1wb3J0IHtBcHBTdG9yZX0gZnJvbSAnLi4vLi4vLi4vcmVkdWNlcnMvcmVkdWNlci5mYWN0b3J5JztcclxuaW1wb3J0IHtOb2RlU2VydmljZX0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvbm9kZS5zZXJ2aWNlJztcclxuaW1wb3J0IHtOb2RlQ2xpY2tlZFNlcnZpY2V9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL25vZGUtY2xpY2tlZC5zZXJ2aWNlJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnYXBwLW5vZGUnLFxyXG4gIHRlbXBsYXRlOiBgPGRpdiAjY3VzdG9tVGVtcGxhdGUgKGRibGNsaWNrKT1cIm1ldGhvZDJDYWxsRm9yRGJsQ2xpY2soJGV2ZW50KVwiIChjbGljayk9XCJtZXRob2QxQ2FsbEZvckNsaWNrKCRldmVudClcIj5cclxuICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XHJcbjwvZGl2PlxyXG5gLFxyXG4gIHN0eWxlczogW2BgXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgTm9kZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcbiAgQElucHV0KCkgbm9kZTogTm9kZUludGVyZmFjZTtcclxuICBpc1NpbmdsZUNsaWNrID0gdHJ1ZTtcclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwcml2YXRlIHN0b3JlOiBTdG9yZTxBcHBTdG9yZT4sXHJcbiAgICBwcml2YXRlIG5vZGVTZXJ2aWNlOiBOb2RlU2VydmljZSxcclxuICAgIHByaXZhdGUgbm9kZUNsaWNrZWRTZXJ2aWNlOiBOb2RlQ2xpY2tlZFNlcnZpY2VcclxuICApIHtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBtZXRob2QxQ2FsbEZvckNsaWNrKGV2ZW50OiBNb3VzZUV2ZW50KSB7XHJcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgIHRoaXMuaXNTaW5nbGVDbGljayA9IHRydWU7XHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgaWYgKHRoaXMuaXNTaW5nbGVDbGljaykge1xyXG4gICAgICAgIHRoaXMuc2hvd01lbnUoKTtcclxuICAgICAgfVxyXG4gICAgfSwgMjAwKTtcclxuICB9XHJcblxyXG4gIC8vIHRvZG8gZXZlbnQucHJldmVudERlZmF1bHQgZm9yIGRvdWJsZSBjbGlja1xyXG4gIHB1YmxpYyBtZXRob2QyQ2FsbEZvckRibENsaWNrKGV2ZW50OiBhbnkpIHtcclxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgdGhpcy5pc1NpbmdsZUNsaWNrID0gZmFsc2U7XHJcbiAgICB0aGlzLm9wZW4oKTtcclxuICB9XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBvcGVuKCkge1xyXG4gICAgaWYgKCF0aGlzLm5vZGUuaXNGb2xkZXIpIHtcclxuICAgICAgdGhpcy5ub2RlQ2xpY2tlZFNlcnZpY2Uuc3RhcnREb3dubG9hZCh0aGlzLm5vZGUpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMubm9kZS5zdGF5T3Blbikge1xyXG4gICAgICBpZiAodGhpcy5ub2RlLm5hbWUgPT0gJ3Jvb3QnKSB7XHJcbiAgICAgICAgdGhpcy5ub2RlU2VydmljZS5mb2xkQWxsKCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuc3RvcmUuZGlzcGF0Y2goe3R5cGU6IEFDVElPTlMuU0VUX1BBVEgsIHBheWxvYWQ6IHRoaXMubm9kZS5wYXRoVG9Ob2RlfSk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnRvZ2dsZU5vZGVFeHBhbmRlZCgpO1xyXG5cclxuICAgIGlmICh0aGlzLm5vZGUuaXNFeHBhbmRlZCkge1xyXG4gICAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKHt0eXBlOiBBQ1RJT05TLlNFVF9QQVRILCBwYXlsb2FkOiB0aGlzLm5vZGUucGF0aFRvTm9kZX0pO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuc2V0Tm9kZVNlbGVjdGVkU3RhdGUoKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgc2hvd01lbnUoKSB7XHJcbiAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKHt0eXBlOiBBQ1RJT05TLlNFVF9TRUxFQ1RFRF9OT0RFLCBwYXlsb2FkOiB0aGlzLm5vZGV9KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgdG9nZ2xlTm9kZUV4cGFuZGVkKCkge1xyXG4gICAgdGhpcy5ub2RlLmlzRXhwYW5kZWQgPSAhdGhpcy5ub2RlLmlzRXhwYW5kZWQ7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHNldE5vZGVTZWxlY3RlZFN0YXRlKCkge1xyXG4gICAgaWYgKCF0aGlzLm5vZGUuaXNFeHBhbmRlZCkge1xyXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndHJlZV8nICsgdGhpcy5ub2RlLnBhdGhUb05vZGUpLmNsYXNzTGlzdC5hZGQoJ2Rlc2VsZWN0ZWQnKTtcclxuXHJcbiAgICAgIHRoaXMubm9kZVNlcnZpY2UuZm9sZFJlY3Vyc2l2ZWx5KHRoaXMubm9kZSk7XHJcblxyXG4gICAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKHt0eXBlOiBBQ1RJT05TLlNFVF9QQVRILCBwYXlsb2FkOiB0aGlzLm5vZGUucGF0aFRvUGFyZW50fSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndHJlZV8nICsgdGhpcy5ub2RlLnBhdGhUb05vZGUpLmNsYXNzTGlzdC5yZW1vdmUoJ2Rlc2VsZWN0ZWQnKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHtQaXBlLCBQaXBlVHJhbnNmb3JtfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbkBQaXBlKHtcclxuICBuYW1lOiAnbWFwVG9JdGVyYWJsZVBpcGUnXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBNYXBUb0l0ZXJhYmxlUGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0ge1xyXG4gIHRyYW5zZm9ybShkaWN0OiBPYmplY3QpIHtcclxuICAgIGNvbnN0IGEgPSBbXTtcclxuICAgIGZvciAoY29uc3Qga2V5IGluIGRpY3QpIHtcclxuICAgICAgaWYgKGRpY3QuaGFzT3duUHJvcGVydHkoa2V5KSkge1xyXG4gICAgICAgIGEucHVzaCh7a2V5OiBrZXksIHZhbDogZGljdFtrZXldfSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHtDb21wb25lbnQsIE9uSW5pdH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7c2VsZWN0LCBTdG9yZX0gZnJvbSAnQG5ncngvc3RvcmUnO1xyXG5pbXBvcnQgKiBhcyBBQ1RJT05TIGZyb20gJy4uLy4uL3JlZHVjZXJzL2FjdGlvbnMuYWN0aW9uJztcclxuaW1wb3J0IHtBcHBTdG9yZX0gZnJvbSAnLi4vLi4vcmVkdWNlcnMvcmVkdWNlci5mYWN0b3J5JztcclxuaW1wb3J0IHtOb2RlU2VydmljZX0gZnJvbSAnLi4vLi4vc2VydmljZXMvbm9kZS5zZXJ2aWNlJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnYXBwLW5hdi1iYXInLFxyXG4gIHRlbXBsYXRlOiBgPGRpdj5cclxuICA+PiA8c3BhbiAqbmdGb3I9XCJsZXQgdG8gb2YgY3VycmVudFBhdGg7IGxldCBpID0gaW5kZXhcIj5cclxuICA8YSBjbGFzcz1cImxpbmtcIiAoY2xpY2spPVwib25DbGljayhjdXJyZW50UGF0aCwgaSlcIj5cclxuICAgIDxkaXYgKm5nSWY9XCJ0byA9PT0gJycgfHwgdG8gPT09ICdyb290JzsgdGhlbiBpY29uIGVsc2UgbmFtZVwiPjwvZGl2PlxyXG4gICAgPG5nLXRlbXBsYXRlICNpY29uPjxpIGNsYXNzPVwiZmFzIGZhLWhvbWVcIj48L2k+PC9uZy10ZW1wbGF0ZT5cclxuICAgIDxuZy10ZW1wbGF0ZSAjbmFtZT57e3RvfX08L25nLXRlbXBsYXRlPlxyXG4gIDwvYT4gL1xyXG4gIDwvc3Bhbj5cclxuPC9kaXY+XHJcbmAsXHJcbiAgc3R5bGVzOiBbYGBdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBOYXZCYXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG4gIGN1cnJlbnRQYXRoOiBzdHJpbmdbXTtcclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwcml2YXRlIHN0b3JlOiBTdG9yZTxBcHBTdG9yZT4sXHJcbiAgICBwcml2YXRlIG5vZGVTZXJ2aWNlOiBOb2RlU2VydmljZVxyXG4gICkge1xyXG4gIH1cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgICB0aGlzLnN0b3JlXHJcbiAgICAgIC5waXBlKHNlbGVjdChzdGF0ZSA9PiBzdGF0ZS5maWxlTWFuYWdlclN0YXRlLnBhdGgpKVxyXG4gICAgICAuc3Vic2NyaWJlKChkYXRhOiBzdHJpbmcpID0+IHtcclxuICAgICAgICB0aGlzLm5vZGVTZXJ2aWNlLmN1cnJlbnRQYXRoID0gZGF0YTtcclxuICAgICAgICB0aGlzLmN1cnJlbnRQYXRoID0gZGF0YS5zcGxpdCgnLycpO1xyXG4gICAgICB9KTtcclxuICB9XHJcblxyXG4gIG9uQ2xpY2socGF0aDogc3RyaW5nW10sIGluZGV4OiBudW1iZXIpIHtcclxuICAgIGNvbnN0IG5ld1BhdGggPSBwYXRoLnNsaWNlKDAsIGluZGV4ICsgMSkuam9pbignLycpO1xyXG4gICAgdGhpcy5zdG9yZS5kaXNwYXRjaCh7dHlwZTogQUNUSU9OUy5TRVRfUEFUSCwgcGF5bG9hZDogbmV3UGF0aH0pO1xyXG4gIH1cclxuXHJcbn1cclxuIiwiLyohICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbkNvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG5MaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2VcclxudGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGVcclxuTGljZW5zZSBhdCBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuXHJcblRISVMgQ09ERSBJUyBQUk9WSURFRCBPTiBBTiAqQVMgSVMqIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTllcclxuS0lORCwgRUlUSEVSIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIFdJVEhPVVQgTElNSVRBVElPTiBBTlkgSU1QTElFRFxyXG5XQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgVElUTEUsIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLFxyXG5NRVJDSEFOVEFCTElUWSBPUiBOT04tSU5GUklOR0VNRU5ULlxyXG5cclxuU2VlIHRoZSBBcGFjaGUgVmVyc2lvbiAyLjAgTGljZW5zZSBmb3Igc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zXHJcbmFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cclxuLyogZ2xvYmFsIFJlZmxlY3QsIFByb21pc2UgKi9cclxuXHJcbnZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24oZCwgYikge1xyXG4gICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXh0ZW5kcyhkLCBiKSB7XHJcbiAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgX19hc3NpZ24gPSBmdW5jdGlvbigpIHtcclxuICAgIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiBfX2Fzc2lnbih0KSB7XHJcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XHJcbiAgICAgICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSkgdFtwXSA9IHNbcF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3Jlc3QocywgZSkge1xyXG4gICAgdmFyIHQgPSB7fTtcclxuICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSAmJiBlLmluZGV4T2YocCkgPCAwKVxyXG4gICAgICAgIHRbcF0gPSBzW3BdO1xyXG4gICAgaWYgKHMgIT0gbnVsbCAmJiB0eXBlb2YgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyA9PT0gXCJmdW5jdGlvblwiKVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBwID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhzKTsgaSA8IHAubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKGUuaW5kZXhPZihwW2ldKSA8IDAgJiYgT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHMsIHBbaV0pKVxyXG4gICAgICAgICAgICAgICAgdFtwW2ldXSA9IHNbcFtpXV07XHJcbiAgICAgICAgfVxyXG4gICAgcmV0dXJuIHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2RlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKSB7XHJcbiAgICB2YXIgYyA9IGFyZ3VtZW50cy5sZW5ndGgsIHIgPSBjIDwgMyA/IHRhcmdldCA6IGRlc2MgPT09IG51bGwgPyBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkgOiBkZXNjLCBkO1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0LmRlY29yYXRlID09PSBcImZ1bmN0aW9uXCIpIHIgPSBSZWZsZWN0LmRlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKTtcclxuICAgIGVsc2UgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIGlmIChkID0gZGVjb3JhdG9yc1tpXSkgciA9IChjIDwgMyA/IGQocikgOiBjID4gMyA/IGQodGFyZ2V0LCBrZXksIHIpIDogZCh0YXJnZXQsIGtleSkpIHx8IHI7XHJcbiAgICByZXR1cm4gYyA+IDMgJiYgciAmJiBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHIpLCByO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19wYXJhbShwYXJhbUluZGV4LCBkZWNvcmF0b3IpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBrZXkpIHsgZGVjb3JhdG9yKHRhcmdldCwga2V5LCBwYXJhbUluZGV4KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSkge1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0Lm1ldGFkYXRhID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiBSZWZsZWN0Lm1ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXRlcih0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19nZW5lcmF0b3IodGhpc0FyZywgYm9keSkge1xyXG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZztcclxuICAgIHJldHVybiBnID0geyBuZXh0OiB2ZXJiKDApLCBcInRocm93XCI6IHZlcmIoMSksIFwicmV0dXJuXCI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XHJcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xyXG4gICAgICAgIHdoaWxlIChfKSB0cnkge1xyXG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XHJcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbb3BbMF0gJiAyLCB0LnZhbHVlXTtcclxuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xyXG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XHJcbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4cG9ydFN0YXIobSwgZXhwb3J0cykge1xyXG4gICAgZm9yICh2YXIgcCBpbiBtKSBpZiAoIWV4cG9ydHMuaGFzT3duUHJvcGVydHkocCkpIGV4cG9ydHNbcF0gPSBtW3BdO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX192YWx1ZXMobykge1xyXG4gICAgdmFyIG0gPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdLCBpID0gMDtcclxuICAgIGlmIChtKSByZXR1cm4gbS5jYWxsKG8pO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBuZXh0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmIChvICYmIGkgPj0gby5sZW5ndGgpIG8gPSB2b2lkIDA7XHJcbiAgICAgICAgICAgIHJldHVybiB7IHZhbHVlOiBvICYmIG9baSsrXSwgZG9uZTogIW8gfTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZWFkKG8sIG4pIHtcclxuICAgIHZhciBtID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXTtcclxuICAgIGlmICghbSkgcmV0dXJuIG87XHJcbiAgICB2YXIgaSA9IG0uY2FsbChvKSwgciwgYXIgPSBbXSwgZTtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgd2hpbGUgKChuID09PSB2b2lkIDAgfHwgbi0tID4gMCkgJiYgIShyID0gaS5uZXh0KCkpLmRvbmUpIGFyLnB1c2goci52YWx1ZSk7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZXJyb3IpIHsgZSA9IHsgZXJyb3I6IGVycm9yIH07IH1cclxuICAgIGZpbmFsbHkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChyICYmICFyLmRvbmUgJiYgKG0gPSBpW1wicmV0dXJuXCJdKSkgbS5jYWxsKGkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmaW5hbGx5IHsgaWYgKGUpIHRocm93IGUuZXJyb3I7IH1cclxuICAgIH1cclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkKCkge1xyXG4gICAgZm9yICh2YXIgYXIgPSBbXSwgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgYXIgPSBhci5jb25jYXQoX19yZWFkKGFyZ3VtZW50c1tpXSkpO1xyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWRBcnJheXMoKSB7XHJcbiAgICBmb3IgKHZhciBzID0gMCwgaSA9IDAsIGlsID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHMgKz0gYXJndW1lbnRzW2ldLmxlbmd0aDtcclxuICAgIGZvciAodmFyIHIgPSBBcnJheShzKSwgayA9IDAsIGkgPSAwOyBpIDwgaWw7IGkrKylcclxuICAgICAgICBmb3IgKHZhciBhID0gYXJndW1lbnRzW2ldLCBqID0gMCwgamwgPSBhLmxlbmd0aDsgaiA8IGpsOyBqKyssIGsrKylcclxuICAgICAgICAgICAgcltrXSA9IGFbal07XHJcbiAgICByZXR1cm4gcjtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0KHYpIHtcclxuICAgIHJldHVybiB0aGlzIGluc3RhbmNlb2YgX19hd2FpdCA/ICh0aGlzLnYgPSB2LCB0aGlzKSA6IG5ldyBfX2F3YWl0KHYpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0dlbmVyYXRvcih0aGlzQXJnLCBfYXJndW1lbnRzLCBnZW5lcmF0b3IpIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgZyA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSwgaSwgcSA9IFtdO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiKSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlmIChnW25dKSBpW25dID0gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChhLCBiKSB7IHEucHVzaChbbiwgdiwgYSwgYl0pID4gMSB8fCByZXN1bWUobiwgdik7IH0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiByZXN1bWUobiwgdikgeyB0cnkgeyBzdGVwKGdbbl0odikpOyB9IGNhdGNoIChlKSB7IHNldHRsZShxWzBdWzNdLCBlKTsgfSB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKHIpIHsgci52YWx1ZSBpbnN0YW5jZW9mIF9fYXdhaXQgPyBQcm9taXNlLnJlc29sdmUoci52YWx1ZS52KS50aGVuKGZ1bGZpbGwsIHJlamVjdCkgOiBzZXR0bGUocVswXVsyXSwgcik7IH1cclxuICAgIGZ1bmN0aW9uIGZ1bGZpbGwodmFsdWUpIHsgcmVzdW1lKFwibmV4dFwiLCB2YWx1ZSk7IH1cclxuICAgIGZ1bmN0aW9uIHJlamVjdCh2YWx1ZSkgeyByZXN1bWUoXCJ0aHJvd1wiLCB2YWx1ZSk7IH1cclxuICAgIGZ1bmN0aW9uIHNldHRsZShmLCB2KSB7IGlmIChmKHYpLCBxLnNoaWZ0KCksIHEubGVuZ3RoKSByZXN1bWUocVswXVswXSwgcVswXVsxXSk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNEZWxlZ2F0b3Iobykge1xyXG4gICAgdmFyIGksIHA7XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIsIGZ1bmN0aW9uIChlKSB7IHRocm93IGU7IH0pLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuLCBmKSB7IGlbbl0gPSBvW25dID8gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIChwID0gIXApID8geyB2YWx1ZTogX19hd2FpdChvW25dKHYpKSwgZG9uZTogbiA9PT0gXCJyZXR1cm5cIiB9IDogZiA/IGYodikgOiB2OyB9IDogZjsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY1ZhbHVlcyhvKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIG0gPSBvW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSwgaTtcclxuICAgIHJldHVybiBtID8gbS5jYWxsKG8pIDogKG8gPSB0eXBlb2YgX192YWx1ZXMgPT09IFwiZnVuY3Rpb25cIiA/IF9fdmFsdWVzKG8pIDogb1tTeW1ib2wuaXRlcmF0b3JdKCksIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiKSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpKTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyBpW25dID0gb1tuXSAmJiBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkgeyB2ID0gb1tuXSh2KSwgc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgdi5kb25lLCB2LnZhbHVlKTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHNldHRsZShyZXNvbHZlLCByZWplY3QsIGQsIHYpIHsgUHJvbWlzZS5yZXNvbHZlKHYpLnRoZW4oZnVuY3Rpb24odikgeyByZXNvbHZlKHsgdmFsdWU6IHYsIGRvbmU6IGQgfSk7IH0sIHJlamVjdCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWFrZVRlbXBsYXRlT2JqZWN0KGNvb2tlZCwgcmF3KSB7XHJcbiAgICBpZiAoT2JqZWN0LmRlZmluZVByb3BlcnR5KSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb29rZWQsIFwicmF3XCIsIHsgdmFsdWU6IHJhdyB9KTsgfSBlbHNlIHsgY29va2VkLnJhdyA9IHJhdzsgfVxyXG4gICAgcmV0dXJuIGNvb2tlZDtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydFN0YXIobW9kKSB7XHJcbiAgICBpZiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSByZXR1cm4gbW9kO1xyXG4gICAgdmFyIHJlc3VsdCA9IHt9O1xyXG4gICAgaWYgKG1vZCAhPSBudWxsKSBmb3IgKHZhciBrIGluIG1vZCkgaWYgKE9iamVjdC5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vZCwgaykpIHJlc3VsdFtrXSA9IG1vZFtrXTtcclxuICAgIHJlc3VsdC5kZWZhdWx0ID0gbW9kO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0RGVmYXVsdChtb2QpIHtcclxuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgZGVmYXVsdDogbW9kIH07XHJcbn1cclxuIiwiaW1wb3J0IHtTdGF0ZUludGVyZmFjZX0gZnJvbSAnLi4vaW50ZXJmYWNlcy9zdGF0ZS5pbnRlcmZhY2UnO1xyXG5pbXBvcnQgKiBhcyBBQ1RJT05TIGZyb20gJy4vYWN0aW9ucy5hY3Rpb24nO1xyXG5cclxuY29uc3QgaW5pdGlhbFN0YXRlOiBTdGF0ZUludGVyZmFjZSA9IHtcclxuICBwYXRoOiAnJyxcclxuICBpc0xvYWRpbmc6IHRydWUsXHJcbiAgc2VsZWN0ZWROb2RlOiBudWxsXHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc3RhdGVSZWR1Y2VyKHN0YXRlOiBTdGF0ZUludGVyZmFjZSA9IGluaXRpYWxTdGF0ZSwgYWN0aW9uOiBBQ1RJT05TLkFjdGlvbnMpOiBTdGF0ZUludGVyZmFjZSB7XHJcbiAgLy8gY29uc29sZS5sb2coJ1ByZXZpb3VzIHN0YXRlOiAnLCBzdGF0ZSk7XHJcbiAgLy8gY29uc29sZS5sb2coJ0FDVElPTiB0eXBlOiAnLCBhY3Rpb24udHlwZSk7XHJcbiAgLy8gY29uc29sZS5sb2coJ0FDVElPTiBwYXlsb2FkOiAnLCBhY3Rpb24ucGF5bG9hZCk7XHJcblxyXG4gIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgIGNhc2UgQUNUSU9OUy5TRVRfUEFUSCA6XHJcbiAgICAgIGlmIChzdGF0ZS5wYXRoID09PSBhY3Rpb24ucGF5bG9hZCkge1xyXG4gICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gey4uLnN0YXRlLCBwYXRoOiBhY3Rpb24ucGF5bG9hZCwgaXNMb2FkaW5nOiB0cnVlfTtcclxuICAgIGNhc2UgQUNUSU9OUy5TRVRfTE9BRElOR19TVEFURSA6XHJcbiAgICAgIHJldHVybiB7Li4uc3RhdGUsIGlzTG9hZGluZzogYWN0aW9uLnBheWxvYWR9O1xyXG4gICAgY2FzZSBBQ1RJT05TLlNFVF9TRUxFQ1RFRF9OT0RFIDpcclxuICAgICAgcmV0dXJuIHsuLi5zdGF0ZSwgc2VsZWN0ZWROb2RlOiBhY3Rpb24ucGF5bG9hZH07XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICByZXR1cm4gaW5pdGlhbFN0YXRlO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQge3N0YXRlUmVkdWNlcn0gZnJvbSAnLi9zdGF0ZVJlZHVjZXInO1xyXG5pbXBvcnQge0FjdGlvblJlZHVjZXJNYXB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcclxuaW1wb3J0IHtTdGF0ZUludGVyZmFjZX0gZnJvbSAnLi4vaW50ZXJmYWNlcy9zdGF0ZS5pbnRlcmZhY2UnO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBBcHBTdG9yZSB7XHJcbiAgZmlsZU1hbmFnZXJTdGF0ZTogU3RhdGVJbnRlcmZhY2U7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCByZWR1Y2VyczogQWN0aW9uUmVkdWNlck1hcDxBcHBTdG9yZT4gPSB7XHJcbiAgZmlsZU1hbmFnZXJTdGF0ZTogc3RhdGVSZWR1Y2VyXHJcbn07XHJcbiIsImltcG9ydCB7Q29tcG9uZW50LCBJbnB1dCwgT25Jbml0LCBUZW1wbGF0ZVJlZn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7X30gZnJvbSAnQGJpZXNiamVyZy9uZ3gtdHJhbnNsYXRlLWV4dHJhY3QvZGlzdC91dGlscy91dGlscyc7XHJcbmltcG9ydCB7dGltZXJ9IGZyb20gJ3J4anMnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdhcHAtbG9hZGluZy1vdmVybGF5JyxcclxuICB0ZW1wbGF0ZTogYDxuZy1jb250YWluZXJcclxuICBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwieyRpbXBsaWNpdDogdGltZW91dE1lc3NhZ2V9XCJcclxuICBbbmdUZW1wbGF0ZU91dGxldF09XCJsb2FkaW5nT3ZlcmxheVRlbXBsYXRlXCI+XHJcbjwvbmctY29udGFpbmVyPlxyXG5gLFxyXG4gIHN0eWxlczogW2BgXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgTG9hZGluZ092ZXJsYXlDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG4gIEBJbnB1dCgpIGxvYWRpbmdPdmVybGF5VGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XHJcbiAgdGltZW91dE1lc3NhZ2U6IGFueTtcclxuXHJcbiAgLy8gdG9kbyB1bnN1YnNjcmliZSBmcm9tICdsaXN0JyBldmVudCAtIG5vdyB3ZSBhcmUgb25seSBkaXNtaXNzaW5nIHRoaXMgY29tcG9uZW50XHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgICB0aW1lcigyMDAwKS5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICB0aGlzLnRpbWVvdXRNZXNzYWdlID0gXygnVHJvdWJsZXMgd2l0aCBsb2FkaW5nPyBDbGljayBhbnl3aGVyZSB0byBjYW5jZWwgbG9hZGluZycpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IFBpcGUsIFBpcGVUcmFuc2Zvcm0gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbi8qXHJcbiAqIENvbnZlcnQgYnl0ZXMgaW50byBsYXJnZXN0IHBvc3NpYmxlIHVuaXQuXHJcbiAqIFRha2VzIGFuIHByZWNpc2lvbiBhcmd1bWVudCB0aGF0IGRlZmF1bHRzIHRvIDIuXHJcbiAqIFVzYWdlOlxyXG4gKiAgIGJ5dGVzIHwgZmlsZVNpemU6cHJlY2lzaW9uXHJcbiAqIEV4YW1wbGU6XHJcbiAqICAge3sgMTAyNCB8ICBmaWxlU2l6ZX19XHJcbiAqICAgZm9ybWF0cyB0bzogMSBLQlxyXG4qL1xyXG5AUGlwZSh7bmFtZTogJ2ZpbGVTaXplJ30pXHJcbmV4cG9ydCBjbGFzcyBGaWxlU2l6ZVBpcGUgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtIHtcclxuXHJcbiAgcHJpdmF0ZSB1bml0cyA9IFtcclxuICAgICdieXRlcycsXHJcbiAgICAnS0InLFxyXG4gICAgJ01CJyxcclxuICAgICdHQicsXHJcbiAgICAnVEInLFxyXG4gICAgJ1BCJ1xyXG4gIF07XHJcblxyXG4gIHRyYW5zZm9ybShieXRlczogbnVtYmVyID0gMCwgcHJlY2lzaW9uOiBudW1iZXIgPSAyICkgOiBzdHJpbmcge1xyXG4gICAgaWYgKCBpc05hTiggcGFyc2VGbG9hdCggU3RyaW5nKGJ5dGVzKSApKSB8fCAhIGlzRmluaXRlKCBieXRlcyApICkgcmV0dXJuICc/JztcclxuXHJcbiAgICBsZXQgdW5pdCA9IDA7XHJcblxyXG4gICAgd2hpbGUgKCBieXRlcyA+PSAxMDI0ICkge1xyXG4gICAgICBieXRlcyAvPSAxMDI0O1xyXG4gICAgICB1bml0ICsrO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBieXRlcy50b0ZpeGVkKCArIHByZWNpc2lvbiApICsgJyAnICsgdGhpcy51bml0c1sgdW5pdCBdO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQge0FmdGVyVmlld0luaXQsIENvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgT25Jbml0LCBPdXRwdXQsIFZpZXdFbmNhcHN1bGF0aW9ufSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtIdHRwQ2xpZW50fSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7RmluZVVwbG9hZGVyfSBmcm9tICdmaW5lLXVwbG9hZGVyJztcclxuaW1wb3J0IHtOb2RlU2VydmljZX0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvbm9kZS5zZXJ2aWNlJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnYXBwLXVwbG9hZCcsXHJcbiAgdGVtcGxhdGU6IGA8ZGl2IGNsYXNzPVwiYmFja2Ryb3BcIiAoY2xpY2spPVwibmV3Q2xpY2tlZEFjdGlvbigpXCI+PC9kaXY+XHJcbjxkaXYgY2xhc3M9XCJ1cGxvYWQtYmFja2dyb3VuZFwiPlxyXG4gIDxkaXYgY2xhc3M9XCJidXR0b25zXCI+XHJcbiAgICA8YnV0dG9uIGNsYXNzPVwiYnV0dG9uXCIgW2Rpc2FibGVkXT1cIm5ld0ZvbGRlclwiIChjbGljayk9XCJjcmVhdGVOZXdGb2xkZXIoKVwiIHRyYW5zbGF0ZT5DcmVhdGUgbmV3IGZvbGRlcjwvYnV0dG9uPlxyXG4gIDwvZGl2PlxyXG5cclxuICA8ZGl2ICpuZ0lmPVwibmV3Rm9sZGVyXCI+XHJcbiAgICA8ZGl2IGNsYXNzPVwiYnV0dG9uc1wiPlxyXG4gICAgICA8YXBwLW5ldy1mb2xkZXIgKGJ1dHRvbkNsaWNrZWQpPVwiY3JlYXRlTmV3Rm9sZGVyKCRldmVudClcIj48L2FwcC1uZXctZm9sZGVyPlxyXG4gICAgPC9kaXY+XHJcbiAgPC9kaXY+XHJcblxyXG4gIDxkaXYgaWQ9XCJmaW5lLXVwbG9hZGVyXCI+XHJcbiAgPC9kaXY+XHJcblxyXG5cclxuICA8ZGl2IGNsYXNzPVwiYnV0dG9uc1wiPlxyXG4gICAgPGJ1dHRvbiBjbGFzcz1cImJ1dHRvbiBiaWdcIiBbZGlzYWJsZWRdPVwidGhpcy5jb3VudGVyIDwgMVwiIChjbGljayk9XCJ1cGxvYWRGaWxlcygpXCIgdHJhbnNsYXRlPlxyXG4gICAgICBVcGxvYWRcclxuICAgIDwvYnV0dG9uPlxyXG4gICAgPGJ1dHRvbiBjbGFzcz1cImJ1dHRvbiBiaWdcIiAoY2xpY2spPVwibmV3Q2xpY2tlZEFjdGlvbigpXCIgdHJhbnNsYXRlPlxyXG4gICAgICBDbG9zZVxyXG4gICAgPC9idXR0b24+XHJcbiAgPC9kaXY+XHJcblxyXG48L2Rpdj5cclxuXHJcbjxkaXYgaWQ9XCJmaW5lLXVwbG9hZGVyLXRlbXBsYXRlXCIgc3R5bGU9XCJkaXNwbGF5OiBub25lO1wiPlxyXG4gIDxkaXYgY2xhc3M9XCJxcS11cGxvYWRlci1zZWxlY3RvciBxcS11cGxvYWRlclwiIHFxLWRyb3AtYXJlYS10ZXh0PVwiRHJvcCBmaWxlcyBoZXJlXCI+XHJcbiAgICA8ZGl2IGNsYXNzPVwicXEtdXBsb2FkLWRyb3AtYXJlYS1zZWxlY3RvciBxcS11cGxvYWQtZHJvcC1hcmVhXCIgcXEtaGlkZS1kcm9wem9uZT5cclxuICAgICAgPHNwYW4gY2xhc3M9XCJxcS11cGxvYWQtZHJvcC1hcmVhLXRleHQtc2VsZWN0b3JcIj48L3NwYW4+XHJcbiAgICA8L2Rpdj5cclxuXHJcbiAgICA8ZGl2IGNsYXNzPVwidXBsb2FkLXRvcC1iYXJcIj5cclxuICAgICAgPGRpdiBjbGFzcz1cInFxLXVwbG9hZC1idXR0b24tc2VsZWN0b3IgcXEtdXBsb2FkLWJ1dHRvblwiPlxyXG4gICAgICAgIDxkaXYgdHJhbnNsYXRlPlVwbG9hZCBhIGZpbGU8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcblxyXG4gICAgICA8ZGl2IGNsYXNzPVwicXEtdG90YWwtcHJvZ3Jlc3MtYmFyLWNvbnRhaW5lci1zZWxlY3RvciBxcS10b3RhbC1wcm9ncmVzcy1iYXItY29udGFpbmVyXCI+XHJcbiAgICAgICAgPGRpdiByb2xlPVwicHJvZ3Jlc3NiYXJcIiBhcmlhLXZhbHVlbm93PVwiMFwiIGFyaWEtdmFsdWVtaW49XCIwXCIgYXJpYS12YWx1ZW1heD1cIjEwMFwiXHJcbiAgICAgICAgICAgICBjbGFzcz1cInFxLXRvdGFsLXByb2dyZXNzLWJhci1zZWxlY3RvciBxcS1wcm9ncmVzcy1iYXIgcXEtdG90YWwtcHJvZ3Jlc3MtYmFyXCI+PC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcblxyXG4gICAgPHNwYW4gY2xhc3M9XCJxcS1kcm9wLXByb2Nlc3Npbmctc2VsZWN0b3IgcXEtZHJvcC1wcm9jZXNzaW5nXCI+XHJcbiAgICAgICAgICAgIDxzcGFuIHRyYW5zbGF0ZT5Qcm9jZXNzaW5nIGRyb3BwZWQgZmlsZXM8L3NwYW4+Li4uXHJcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicXEtZHJvcC1wcm9jZXNzaW5nLXNwaW5uZXItc2VsZWN0b3IgcXEtZHJvcC1wcm9jZXNzaW5nLXNwaW5uZXJcIj48L3NwYW4+XHJcbiAgICA8L3NwYW4+XHJcblxyXG4gICAgPHVsIGNsYXNzPVwicXEtdXBsb2FkLWxpc3Qtc2VsZWN0b3IgcXEtdXBsb2FkLWxpc3RcIiBhcmlhLWxpdmU9XCJwb2xpdGVcIiBhcmlhLXJlbGV2YW50PVwiYWRkaXRpb25zIHJlbW92YWxzXCI+XHJcbiAgICAgIDxsaT5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwicXEtcHJvZ3Jlc3MtYmFyLWNvbnRhaW5lci1zZWxlY3RvclwiPlxyXG4gICAgICAgICAgPGRpdiByb2xlPVwicHJvZ3Jlc3NiYXJcIiBhcmlhLXZhbHVlbm93PVwiMFwiIGFyaWEtdmFsdWVtaW49XCIwXCIgYXJpYS12YWx1ZW1heD1cIjEwMFwiXHJcbiAgICAgICAgICAgICAgIGNsYXNzPVwicXEtcHJvZ3Jlc3MtYmFyLXNlbGVjdG9yIHFxLXByb2dyZXNzLWJhclwiPjwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxzcGFuIGNsYXNzPVwicXEtdXBsb2FkLXNwaW5uZXItc2VsZWN0b3IgcXEtdXBsb2FkLXNwaW5uZXJcIj48L3NwYW4+XHJcbiAgICAgICAgPGltZyBjbGFzcz1cInFxLXRodW1ibmFpbC1zZWxlY3RvclwiIHFxLW1heC1zaXplPVwiMTAwXCIgcXEtc2VydmVyLXNjYWxlPlxyXG4gICAgICAgIDxzcGFuIGNsYXNzPVwicXEtdXBsb2FkLWZpbGUtc2VsZWN0b3IgcXEtdXBsb2FkLWZpbGVcIj48L3NwYW4+XHJcbiAgICAgICAgPHNwYW4gY2xhc3M9XCJxcS1lZGl0LWZpbGVuYW1lLWljb24tc2VsZWN0b3IgcXEtZWRpdC1maWxlbmFtZS1pY29uXCIgYXJpYS1sYWJlbD1cIkVkaXQgZmlsZW5hbWVcIj48L3NwYW4+XHJcbiAgICAgICAgPGlucHV0IGNsYXNzPVwicXEtZWRpdC1maWxlbmFtZS1zZWxlY3RvciBxcS1lZGl0LWZpbGVuYW1lXCIgdGFiaW5kZXg9XCIwXCIgdHlwZT1cInRleHRcIj5cclxuICAgICAgICA8c3BhbiBjbGFzcz1cInFxLXVwbG9hZC1zaXplLXNlbGVjdG9yIHFxLXVwbG9hZC1zaXplXCI+PC9zcGFuPlxyXG4gICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwicXEtYnRuIHFxLXVwbG9hZC1jYW5jZWwtc2VsZWN0b3IgcXEtdXBsb2FkLWNhbmNlbFwiIHRyYW5zbGF0ZT5DYW5jZWw8L2J1dHRvbj5cclxuICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInFxLWJ0biBxcS11cGxvYWQtcmV0cnktc2VsZWN0b3IgcXEtdXBsb2FkLXJldHJ5XCIgdHJhbnNsYXRlPlJldHJ5PC9idXR0b24+XHJcbiAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJxcS1idG4gcXEtdXBsb2FkLWRlbGV0ZS1zZWxlY3RvciBxcS11cGxvYWQtZGVsZXRlXCIgdHJhbnNsYXRlPkRlbGV0ZTwvYnV0dG9uPlxyXG4gICAgICAgIDxzcGFuIHJvbGU9XCJzdGF0dXNcIiBjbGFzcz1cInFxLXVwbG9hZC1zdGF0dXMtdGV4dC1zZWxlY3RvciBxcS11cGxvYWQtc3RhdHVzLXRleHRcIj48L3NwYW4+XHJcbiAgICAgIDwvbGk+XHJcbiAgICA8L3VsPlxyXG5cclxuICAgIDxkaWFsb2cgY2xhc3M9XCJxcS1hbGVydC1kaWFsb2ctc2VsZWN0b3JcIj5cclxuICAgICAgPGRpdiBjbGFzcz1cInFxLWRpYWxvZy1tZXNzYWdlLXNlbGVjdG9yXCI+PC9kaXY+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJxcS1kaWFsb2ctYnV0dG9uc1wiPlxyXG4gICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwicXEtY2FuY2VsLWJ1dHRvbi1zZWxlY3RvclwiIHRyYW5zbGF0ZT5DbG9zZTwvYnV0dG9uPlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGlhbG9nPlxyXG5cclxuICAgIDxkaWFsb2cgY2xhc3M9XCJxcS1jb25maXJtLWRpYWxvZy1zZWxlY3RvclwiPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwicXEtZGlhbG9nLW1lc3NhZ2Utc2VsZWN0b3JcIj48L2Rpdj5cclxuICAgICAgPGRpdiBjbGFzcz1cInFxLWRpYWxvZy1idXR0b25zXCI+XHJcbiAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJxcS1jYW5jZWwtYnV0dG9uLXNlbGVjdG9yXCIgdHJhbnNsYXRlPk5vPC9idXR0b24+XHJcbiAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJxcS1vay1idXR0b24tc2VsZWN0b3JcIiB0cmFuc2xhdGU+WWVzPC9idXR0b24+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaWFsb2c+XHJcblxyXG4gICAgPGRpYWxvZyBjbGFzcz1cInFxLXByb21wdC1kaWFsb2ctc2VsZWN0b3JcIj5cclxuICAgICAgPGRpdiBjbGFzcz1cInFxLWRpYWxvZy1tZXNzYWdlLXNlbGVjdG9yXCI+PC9kaXY+XHJcbiAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwicXEtZGlhbG9nLWJ1dHRvbnNcIj5cclxuICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInFxLWNhbmNlbC1idXR0b24tc2VsZWN0b3JcIiB0cmFuc2xhdGU+Q2FuY2VsPC9idXR0b24+XHJcbiAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJxcS1vay1idXR0b24tc2VsZWN0b3JcIiB0cmFuc2xhdGU+T2s8L2J1dHRvbj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2RpYWxvZz5cclxuICA8L2Rpdj5cclxuPC9kaXY+XHJcbmAsXHJcbiAgc3R5bGVzOiBbYC51cGxvYWQtY29udGVudHt0ZXh0LWFsaWduOmNlbnRlcjttYXgtaGVpZ2h0OjI1dmg7b3ZlcmZsb3c6YXV0bzttYXJnaW46MTBweCBhdXRvfS5mYS10aW1lczpiZWZvcmV7Y29udGVudDpcIlxcXFxmMDBkXCJ9LmJ1dHRvbnN7YmFja2dyb3VuZDojZmZmO3BhZGRpbmc6NXB4O21hcmdpbjoxMHB4IDB9YCwgYC5xcS11cGxvYWQtYnV0dG9uIGRpdntsaW5lLWhlaWdodDoyNXB4fS5xcS11cGxvYWQtYnV0dG9uLWZvY3Vze291dGxpbmU6MH0ucXEtdXBsb2FkZXJ7cG9zaXRpb246cmVsYXRpdmU7bWluLWhlaWdodDoyMDBweDttYXgtaGVpZ2h0OjQ5MHB4O292ZXJmbG93LXk6aGlkZGVuO3dpZHRoOmluaGVyaXQ7Ym9yZGVyLXJhZGl1czo2cHg7YmFja2dyb3VuZC1jb2xvcjojZmRmZGZkO2JvcmRlcjoxcHggZGFzaGVkICNjY2M7cGFkZGluZzoyMHB4fS5xcS11cGxvYWRlcjpiZWZvcmV7Y29udGVudDphdHRyKHFxLWRyb3AtYXJlYS10ZXh0KSBcIiBcIjtwb3NpdGlvbjphYnNvbHV0ZTtmb250LXNpemU6MjAwJTtsZWZ0OjA7d2lkdGg6MTAwJTt0ZXh0LWFsaWduOmNlbnRlcjt0b3A6NDUlO29wYWNpdHk6LjI1fS5xcS11cGxvYWQtZHJvcC1hcmVhLC5xcS11cGxvYWQtZXh0cmEtZHJvcC1hcmVhe3Bvc2l0aW9uOmFic29sdXRlO3RvcDowO2xlZnQ6MDt3aWR0aDoxMDAlO2hlaWdodDoxMDAlO21pbi1oZWlnaHQ6MzBweDt6LWluZGV4OjI7YmFja2dyb3VuZDojZjlmOWY5O2JvcmRlci1yYWRpdXM6NHB4O2JvcmRlcjoxcHggZGFzaGVkICNjY2M7dGV4dC1hbGlnbjpjZW50ZXJ9LnFxLXVwbG9hZC1kcm9wLWFyZWEgc3BhbntkaXNwbGF5OmJsb2NrO3Bvc2l0aW9uOmFic29sdXRlO3RvcDo1MCU7d2lkdGg6MTAwJTttYXJnaW4tdG9wOi04cHg7Zm9udC1zaXplOjE2cHh9LnFxLXVwbG9hZC1leHRyYS1kcm9wLWFyZWF7cG9zaXRpb246cmVsYXRpdmU7bWFyZ2luLXRvcDo1MHB4O2ZvbnQtc2l6ZToxNnB4O3BhZGRpbmctdG9wOjMwcHg7aGVpZ2h0OjIwcHg7bWluLWhlaWdodDo0MHB4fS5xcS11cGxvYWQtZHJvcC1hcmVhLWFjdGl2ZXtiYWNrZ3JvdW5kOiNmZGZkZmQ7Ym9yZGVyLXJhZGl1czo0cHg7Ym9yZGVyOjFweCBkYXNoZWQgI2NjY30ucXEtdXBsb2FkLWxpc3R7bWFyZ2luOjA7cGFkZGluZzowO2xpc3Qtc3R5bGU6bm9uZTttYXgtaGVpZ2h0OjQ1MHB4O292ZXJmbG93LXk6YXV0bztjbGVhcjpib3RofS5xcS11cGxvYWQtbGlzdCBsaXttYXJnaW46MDtwYWRkaW5nOjlweDtsaW5lLWhlaWdodDoxNXB4O2ZvbnQtc2l6ZToxNnB4O2NvbG9yOiM0MjQyNDI7YmFja2dyb3VuZC1jb2xvcjojZjZmNmY2O2JvcmRlci10b3A6MXB4IHNvbGlkICNmZmY7Ym9yZGVyLWJvdHRvbToxcHggc29saWQgI2RkZH0ucXEtdXBsb2FkLWxpc3QgbGk6Zmlyc3QtY2hpbGR7Ym9yZGVyLXRvcDpub25lfS5xcS11cGxvYWQtbGlzdCBsaTpsYXN0LWNoaWxke2JvcmRlci1ib3R0b206bm9uZX0ucXEtdXBsb2FkLWNhbmNlbCwucXEtdXBsb2FkLWNvbnRpbnVlLC5xcS11cGxvYWQtZGVsZXRlLC5xcS11cGxvYWQtZmFpbGVkLXRleHQsLnFxLXVwbG9hZC1maWxlLC5xcS11cGxvYWQtcGF1c2UsLnFxLXVwbG9hZC1yZXRyeSwucXEtdXBsb2FkLXNpemUsLnFxLXVwbG9hZC1zcGlubmVye21hcmdpbi1yaWdodDoxMnB4O2Rpc3BsYXk6aW5saW5lfS5xcS11cGxvYWQtZmlsZXt2ZXJ0aWNhbC1hbGlnbjptaWRkbGU7ZGlzcGxheTppbmxpbmUtYmxvY2s7d2lkdGg6MzAwcHg7dGV4dC1vdmVyZmxvdzplbGxpcHNpczt3aGl0ZS1zcGFjZTpub3dyYXA7b3ZlcmZsb3cteDpoaWRkZW47aGVpZ2h0OjE4cHh9LnFxLXVwbG9hZC1zcGlubmVye2Rpc3BsYXk6aW5saW5lLWJsb2NrO2JhY2tncm91bmQ6dXJsKGxvYWRpbmcuZ2lmKTt3aWR0aDoxNXB4O2hlaWdodDoxNXB4O3ZlcnRpY2FsLWFsaWduOnRleHQtYm90dG9tfS5xcS1kcm9wLXByb2Nlc3Npbmd7ZGlzcGxheTpibG9ja30ucXEtZHJvcC1wcm9jZXNzaW5nLXNwaW5uZXJ7ZGlzcGxheTppbmxpbmUtYmxvY2s7YmFja2dyb3VuZDp1cmwocHJvY2Vzc2luZy5naWYpO3dpZHRoOjI0cHg7aGVpZ2h0OjI0cHg7dmVydGljYWwtYWxpZ246dGV4dC1ib3R0b219LnFxLXVwbG9hZC1jYW5jZWwsLnFxLXVwbG9hZC1jb250aW51ZSwucXEtdXBsb2FkLWRlbGV0ZSwucXEtdXBsb2FkLXBhdXNlLC5xcS11cGxvYWQtcmV0cnksLnFxLXVwbG9hZC1zaXple2ZvbnQtc2l6ZToxMnB4O2ZvbnQtd2VpZ2h0OjQwMDtjdXJzb3I6cG9pbnRlcjt2ZXJ0aWNhbC1hbGlnbjptaWRkbGV9LnFxLXVwbG9hZC1zdGF0dXMtdGV4dHtmb250LXNpemU6MTRweDtmb250LXdlaWdodDo3MDA7ZGlzcGxheTpibG9ja30ucXEtdXBsb2FkLWZhaWxlZC10ZXh0e2Rpc3BsYXk6bm9uZTtmb250LXN0eWxlOml0YWxpYztmb250LXdlaWdodDo3MDB9LnFxLXVwbG9hZC1mYWlsZWQtaWNvbntkaXNwbGF5Om5vbmU7d2lkdGg6MTVweDtoZWlnaHQ6MTVweDt2ZXJ0aWNhbC1hbGlnbjp0ZXh0LWJvdHRvbX0ucXEtdXBsb2FkLWZhaWwgLnFxLXVwbG9hZC1mYWlsZWQtdGV4dCwucXEtdXBsb2FkLXJldHJ5aW5nIC5xcS11cGxvYWQtZmFpbGVkLXRleHR7ZGlzcGxheTppbmxpbmV9LnFxLXVwbG9hZC1saXN0IGxpLnFxLXVwbG9hZC1zdWNjZXNze2JhY2tncm91bmQtY29sb3I6I2ViZjZlMDtjb2xvcjojNDI0MjQyO2JvcmRlci1ib3R0b206MXB4IHNvbGlkICNkM2RlZDE7Ym9yZGVyLXRvcDoxcHggc29saWQgI2Y3ZmZmNX0ucXEtdXBsb2FkLWxpc3QgbGkucXEtdXBsb2FkLWZhaWx7YmFja2dyb3VuZC1jb2xvcjojZjVkN2Q3O2NvbG9yOiM0MjQyNDI7Ym9yZGVyLWJvdHRvbToxcHggc29saWQgI2RlY2FjYTtib3JkZXItdG9wOjFweCBzb2xpZCAjZmNlNmU2fS5xcS10b3RhbC1wcm9ncmVzcy1iYXJ7aGVpZ2h0OjI1cHg7Ym9yZGVyLXJhZGl1czo5cHh9SU5QVVQucXEtZWRpdC1maWxlbmFtZXtwb3NpdGlvbjphYnNvbHV0ZTtvcGFjaXR5OjA7ei1pbmRleDotMX0ucXEtdXBsb2FkLWZpbGUucXEtZWRpdGFibGV7Y3Vyc29yOnBvaW50ZXI7bWFyZ2luLXJpZ2h0OjRweH0ucXEtZWRpdC1maWxlbmFtZS1pY29uLnFxLWVkaXRhYmxle2Rpc3BsYXk6aW5saW5lLWJsb2NrO2N1cnNvcjpwb2ludGVyfUlOUFVULnFxLWVkaXQtZmlsZW5hbWUucXEtZWRpdGluZ3twb3NpdGlvbjpzdGF0aWM7aGVpZ2h0OjI4cHg7cGFkZGluZzowIDhweDttYXJnaW4tcmlnaHQ6MTBweDttYXJnaW4tYm90dG9tOi01cHg7Ym9yZGVyOjFweCBzb2xpZCAjY2NjO2JvcmRlci1yYWRpdXM6MnB4O2ZvbnQtc2l6ZToxNnB4O29wYWNpdHk6MX0ucXEtZWRpdC1maWxlbmFtZS1pY29ue2Rpc3BsYXk6bm9uZTtiYWNrZ3JvdW5kOnVybChlZGl0LmdpZik7d2lkdGg6MTVweDtoZWlnaHQ6MTVweDt2ZXJ0aWNhbC1hbGlnbjp0ZXh0LWJvdHRvbTttYXJnaW4tcmlnaHQ6MTZweH0ucXEtaGlkZXtkaXNwbGF5Om5vbmV9LnFxLXRodW1ibmFpbC1zZWxlY3Rvcnt2ZXJ0aWNhbC1hbGlnbjptaWRkbGU7bWFyZ2luLXJpZ2h0OjEycHh9LnFxLXVwbG9hZGVyIERJQUxPR3tkaXNwbGF5Om5vbmV9LnFxLXVwbG9hZGVyIERJQUxPR1tvcGVuXXtkaXNwbGF5OmJsb2NrfS5xcS11cGxvYWRlciBESUFMT0cgLnFxLWRpYWxvZy1idXR0b25ze3RleHQtYWxpZ246Y2VudGVyO3BhZGRpbmctdG9wOjEwcHh9LnFxLXVwbG9hZGVyIERJQUxPRyAucXEtZGlhbG9nLWJ1dHRvbnMgQlVUVE9Oe21hcmdpbi1sZWZ0OjVweDttYXJnaW4tcmlnaHQ6NXB4fS5xcS11cGxvYWRlciBESUFMT0cgLnFxLWRpYWxvZy1tZXNzYWdlLXNlbGVjdG9ye3BhZGRpbmctYm90dG9tOjEwcHh9LnFxLXVwbG9hZGVyIERJQUxPRzo6LXdlYmtpdC1iYWNrZHJvcHtiYWNrZ3JvdW5kLWNvbG9yOnJnYmEoMCwwLDAsLjcpfS5xcS11cGxvYWRlciBESUFMT0c6OmJhY2tkcm9we2JhY2tncm91bmQtY29sb3I6cmdiYSgwLDAsMCwuNyl9YF0sXHJcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZVxyXG59KVxyXG5leHBvcnQgY2xhc3MgVXBsb2FkQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBBZnRlclZpZXdJbml0IHtcclxuICBASW5wdXQoKSBvcGVuRGlhbG9nO1xyXG5cclxuICBAT3V0cHV0KCkgY2xvc2VEaWFsb2cgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgQE91dHB1dCgpIGNyZWF0ZURpciA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgdXBsb2FkZXI6IEZpbmVVcGxvYWRlcjtcclxuICBuZXdGb2xkZXIgPSBmYWxzZTtcclxuICBjb3VudGVyID0gMDtcclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50LFxyXG4gICAgICAgICAgICAgIHByaXZhdGUgbm9kZVNlcnZpY2U6IE5vZGVTZXJ2aWNlKSB7XHJcbiAgfVxyXG5cclxuICBuZ0FmdGVyVmlld0luaXQoKSB7XHJcbiAgICB0aGlzLnVwbG9hZGVyID0gbmV3IEZpbmVVcGxvYWRlcih7XHJcbiAgICAgIGRlYnVnOiBmYWxzZSxcclxuICAgICAgYXV0b1VwbG9hZDogZmFsc2UsXHJcbiAgICAgIG1heENvbm5lY3Rpb25zOiAxLCAvLyB0b2RvIGNvbmZpZ3VyYWJsZVxyXG4gICAgICBlbGVtZW50OiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmluZS11cGxvYWRlcicpLFxyXG4gICAgICB0ZW1wbGF0ZTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZpbmUtdXBsb2FkZXItdGVtcGxhdGUnKSxcclxuICAgICAgcmVxdWVzdDoge1xyXG4gICAgICAgIGVuZHBvaW50OiB0aGlzLm5vZGVTZXJ2aWNlLnRyZWUuY29uZmlnLmJhc2VVUkwgKyB0aGlzLm5vZGVTZXJ2aWNlLnRyZWUuY29uZmlnLmFwaS51cGxvYWRGaWxlLFxyXG4gICAgICAgIC8vIGZvcmNlTXVsdGlwYXJ0OiBmYWxzZSxcclxuICAgICAgICBwYXJhbXNJbkJvZHk6IGZhbHNlLFxyXG4gICAgICAgIHBhcmFtczoge1xyXG4gICAgICAgICAgcGFyZW50UGF0aDogdGhpcy5nZXRDdXJyZW50UGF0aFxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgcmV0cnk6IHtcclxuICAgICAgICBlbmFibGVBdXRvOiBmYWxzZVxyXG4gICAgICB9LFxyXG4gICAgICBjYWxsYmFja3M6IHtcclxuICAgICAgICBvblN1Ym1pdHRlZDogKCkgPT4gdGhpcy5jb3VudGVyKyssXHJcbiAgICAgICAgb25DYW5jZWw6ICgpID0+IHtcclxuICAgICAgICAgIHRoaXMuY291bnRlciA8IDAgPyBjb25zb2xlLndhcm4oJ3d0Zj8nKSA6IHRoaXMuY291bnRlci0tO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgb25BbGxDb21wbGV0ZTogKHN1Y2M6IGFueSwgZmFpbDogYW55KSA9PiB7XHJcbiAgICAgICAgICBpZiAoc3VjYy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY291bnRlciA9IDA7XHJcbiAgICAgICAgICAgIHRoaXMubm9kZVNlcnZpY2UucmVmcmVzaEN1cnJlbnRQYXRoKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gICAgO1xyXG4gIH1cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgfVxyXG5cclxuICBnZXQgZ2V0Q3VycmVudFBhdGgoKSB7XHJcbiAgICBjb25zdCBwYXJlbnRQYXRoID0gdGhpcy5ub2RlU2VydmljZS5maW5kTm9kZUJ5UGF0aCh0aGlzLm5vZGVTZXJ2aWNlLmN1cnJlbnRQYXRoKS5pZDtcclxuICAgIHJldHVybiBwYXJlbnRQYXRoID09PSAwID8gJycgOiBwYXJlbnRQYXRoO1xyXG4gIH1cclxuXHJcbiAgdXBsb2FkRmlsZXMoKSB7XHJcbiAgICB0aGlzLnVwbG9hZGVyLnVwbG9hZFN0b3JlZEZpbGVzKCk7XHJcbiAgfVxyXG5cclxuICBjcmVhdGVOZXdGb2xkZXIoaW5wdXQ/OiBzdHJpbmcpIHtcclxuICAgIGlmICghdGhpcy5uZXdGb2xkZXIpIHtcclxuICAgICAgdGhpcy5uZXdGb2xkZXIgPSB0cnVlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5uZXdGb2xkZXIgPSBmYWxzZTtcclxuICAgICAgaWYgKGlucHV0Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICB0aGlzLmNyZWF0ZURpci5lbWl0KGlucHV0KTtcclxuICAgICAgICB0aGlzLm5ld0NsaWNrZWRBY3Rpb24oKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbmV3Q2xpY2tlZEFjdGlvbigpIHtcclxuICAgIHRoaXMudXBsb2FkZXIuY2FuY2VsQWxsKCk7XHJcbiAgICB0aGlzLmNsb3NlRGlhbG9nLmVtaXQoKTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHtDb21wb25lbnQsIEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgT25Jbml0LCBPdXRwdXQsIFZpZXdDaGlsZH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7X30gZnJvbSAnQGJpZXNiamVyZy9uZ3gtdHJhbnNsYXRlLWV4dHJhY3QvZGlzdC91dGlscy91dGlscyc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2FwcC1uZXctZm9sZGVyJyxcclxuICB0ZW1wbGF0ZTogYDxwIGNsYXNzPVwibmV3LWZvbGRlci1kZXNjcmlwdGlvblwiIHRyYW5zbGF0ZT5UeXBlIG5ldyBmb2xkZXIgbmFtZTwvcD5cclxuPGlucHV0ICN1cGxvYWRGb2xkZXIgcGxhY2Vob2xkZXI9XCJ7eydGb2xkZXIgbmFtZScgfCB0cmFuc2xhdGV9fVwiIChrZXl1cCk9XCJvbklucHV0Q2hhbmdlKCRldmVudClcIlxyXG4gICAgICAgKGtleXVwLmVudGVyKT1cIm9uQ2xpY2soKVwiIG9uY2xpY2s9XCJ0aGlzLnNlbGVjdCgpO1wiIHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJuZXctZm9sZGVyLWlucHV0XCIvPlxyXG48YnV0dG9uIGNsYXNzPVwiYnV0dG9uIG5ldy1mb2xkZXItc2VuZFwiIChjbGljayk9XCJvbkNsaWNrKClcIj57e2J1dHRvblRleHQgfCB0cmFuc2xhdGV9fTwvYnV0dG9uPlxyXG5gLFxyXG4gIHN0eWxlczogW2AubmV3LWZvbGRlci1kZXNjcmlwdGlvbnttYXJnaW46MCBhdXRvO3BhZGRpbmc6MH1gXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgTmV3Rm9sZGVyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuICBAVmlld0NoaWxkKCd1cGxvYWRGb2xkZXInKSB1cGxvYWRGb2xkZXI6IEVsZW1lbnRSZWY7XHJcbiAgQE91dHB1dCgpIGJ1dHRvbkNsaWNrZWQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gIGJ1dHRvblRleHQgPSBfKCdDbG9zZScpLnRvU3RyaW5nKCk7XHJcbiAgaW5wdXRWYWx1ZSA9ICcnO1xyXG5cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICB9XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gIH1cclxuXHJcbiAgb25DbGljaygpIHtcclxuICAgIGNvbnN0IGVsOiBIVE1MRWxlbWVudCA9ICh0aGlzLnVwbG9hZEZvbGRlci5uYXRpdmVFbGVtZW50IGFzIEhUTUxFbGVtZW50KTtcclxuICAgIC8vIEB0cy1pZ25vcmVcclxuICAgIHRoaXMuYnV0dG9uQ2xpY2tlZC5lbWl0KGVsLnZhbHVlKTtcclxuICB9XHJcblxyXG4gIG9uSW5wdXRDaGFuZ2UoZXZlbnQ6IGFueSkge1xyXG4gICAgdGhpcy5pbnB1dFZhbHVlID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xyXG4gICAgaWYgKHRoaXMuaW5wdXRWYWx1ZS5sZW5ndGggPiAwKSB7XHJcbiAgICAgIHRoaXMuYnV0dG9uVGV4dCA9IF8oJ0NvbmZpcm0nKS50b1N0cmluZygpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5idXR0b25UZXh0ID0gXygnQ2xvc2UnKS50b1N0cmluZygpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQge0NvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgT25Jbml0LCBPdXRwdXQsIFRlbXBsYXRlUmVmLCBWaWV3RW5jYXBzdWxhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7Tm9kZUludGVyZmFjZX0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlcy9ub2RlLmludGVyZmFjZSc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2FwcC1zaWRlLXZpZXcnLFxyXG4gIHRlbXBsYXRlOiBgPGRpdiBjbGFzcz1cInNpZGUtdmlld1wiICpuZ0lmPVwibm9kZVwiPlxyXG4gIDxkaXYgY2xhc3M9XCJzaWRlLXZpZXctcHJldmlld1wiPlxyXG4gICAgPGkgKGNsaWNrKT1cIm9uQ2xpY2soJGV2ZW50LCAnY2xvc2VTaWRlVmlldycpXCIgY2xhc3M9XCJmYXMgZmEtdGltZXMgc2lkZS12aWV3LWNsb3NlXCI+PC9pPlxyXG5cclxuICAgIDxkaXYgY2xhc3M9XCJzaWRlLXZpZXctcHJldmlldy10aXRsZVwiPnt7bm9kZS5uYW1lfX08L2Rpdj5cclxuXHJcbiAgICA8ZGl2IGNsYXNzPVwic2lkZS12aWV3LXByZXZpZXctY29udGVudFwiPlxyXG4gICAgICA8bmctY29udGFpbmVyXHJcbiAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cInskaW1wbGljaXQ6IG5vZGV9XCJcclxuICAgICAgICBbbmdUZW1wbGF0ZU91dGxldF09XCJzaWRlVmlld1RlbXBsYXRlXCI+XHJcbiAgICAgIDwvbmctY29udGFpbmVyPlxyXG4gICAgPC9kaXY+XHJcblxyXG4gICAgPGRpdiBjbGFzcz1cInNpZGUtdmlldy1idXR0b25zXCI+XHJcbiAgICAgIDxidXR0b24gKGNsaWNrKT1cIm9uQ2xpY2soJGV2ZW50LCAnZG93bmxvYWQnKVwiIGNsYXNzPVwiYnV0dG9uXCJcclxuICAgICAgICAgICAgICBbZGlzYWJsZWRdPVwiIWFsbG93Rm9sZGVyRG93bmxvYWQgJiYgbm9kZS5pc0ZvbGRlclwiIHRyYW5zbGF0ZT5cclxuICAgICAgICBEb3dubG9hZFxyXG4gICAgICA8L2J1dHRvbj5cclxuICAgICAgPGJ1dHRvbiAoY2xpY2spPVwib25DbGljaygkZXZlbnQsICdyZW5hbWVDb25maXJtJylcIiBjbGFzcz1cImJ1dHRvblwiIHRyYW5zbGF0ZT5SZW5hbWU8L2J1dHRvbj5cclxuICAgICAgPGJ1dHRvbiAoY2xpY2spPVwib25DbGljaygkZXZlbnQsICdyZW1vdmVBc2snKVwiIGNsYXNzPVwiYnV0dG9uXCIgdHJhbnNsYXRlPkRlbGV0ZTwvYnV0dG9uPlxyXG4gICAgPC9kaXY+XHJcbiAgPC9kaXY+XHJcbjwvZGl2PlxyXG5gLFxyXG4gIHN0eWxlczogW2Auc2lkZS12aWV3LWNsb3Nle3Bvc2l0aW9uOmFic29sdXRlO2N1cnNvcjpwb2ludGVyO3RvcDowO3JpZ2h0OjA7cGFkZGluZzoxNXB4fS5zaWRlLXZpZXctYnV0dG9uc3t3aWR0aDoxMDAlO2Rpc3BsYXk6LXdlYmtpdC1mbGV4O2Rpc3BsYXk6ZmxleDstd2Via2l0LWp1c3RpZnktY29udGVudDpjZW50ZXI7anVzdGlmeS1jb250ZW50OmNlbnRlcjstd2Via2l0LWZsZXgtZmxvdzpjb2x1bW47ZmxleC1mbG93OmNvbHVtbn0uc2lkZS12aWV3LWJ1dHRvbnMgLmJ1dHRvbnttYXJnaW46NXB4IDB9YF0sXHJcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZVxyXG59KVxyXG5leHBvcnQgY2xhc3MgU2lkZVZpZXdDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG4gIEBJbnB1dCgpIHNpZGVWaWV3VGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XHJcblxyXG4gIEBJbnB1dCgpIG5vZGU6IE5vZGVJbnRlcmZhY2U7XHJcbiAgQElucHV0KCkgYWxsb3dGb2xkZXJEb3dubG9hZCA9IGZhbHNlO1xyXG5cclxuICBAT3V0cHV0KCkgY2xpY2tFdmVudCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgfVxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICB9XHJcblxyXG4gIG9uQ2xpY2soZXZlbnQ6IGFueSwgdHlwZTogc3RyaW5nKSB7XHJcbiAgICB0aGlzLmNsaWNrRXZlbnQuZW1pdCh7dHlwZTogdHlwZSwgZXZlbnQ6IGV2ZW50LCBub2RlOiB0aGlzLm5vZGV9KTtcclxuICB9XHJcblxyXG59XHJcbiIsImltcG9ydCB7Q29tcG9uZW50LCBPbkluaXQsIFZpZXdFbmNhcHN1bGF0aW9ufSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtOb2RlQ2xpY2tlZFNlcnZpY2V9IGZyb20gJy4uLy4uL3NlcnZpY2VzL25vZGUtY2xpY2tlZC5zZXJ2aWNlJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnYXBwLW5hdmlnYXRpb24nLFxyXG4gIHRlbXBsYXRlOiBgPGRpdiBjbGFzcz1cIm5hdmlnYXRpb24tY29tcG9uZW50XCI+XHJcbiAgPGlucHV0ICNpbnB1dCBjbGFzcz1cIm5hdmlnYXRpb24tc2VhcmNoXCIgb25jbGljaz1cInRoaXMuc2VsZWN0KCk7XCIgKGtleXVwLmVudGVyKT1cIm9uQ2xpY2soaW5wdXQudmFsdWUpXCJcclxuICAgICAgICAgcGxhY2Vob2xkZXI9XCJ7eydTZWFyY2gnIHwgdHJhbnNsYXRlfX1cIj5cclxuXHJcbiAgPGJ1dHRvbiBbZGlzYWJsZWRdPVwiaW5wdXQudmFsdWUubGVuZ3RoID09PSAwXCIgY2xhc3M9XCJuYXZpZ2F0aW9uLXNlYXJjaC1pY29uXCIgKGNsaWNrKT1cIm9uQ2xpY2soaW5wdXQudmFsdWUpXCI+XHJcbiAgICA8aSBjbGFzcz1cImZhcyBmYS1zZWFyY2hcIj48L2k+XHJcbiAgPC9idXR0b24+XHJcblxyXG4gIDxkaXY+XHJcbiAgICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XHJcbiAgPC9kaXY+XHJcbjwvZGl2PlxyXG5cclxuXHJcbmAsXHJcbiAgc3R5bGVzOiBbYC5uYXZpZ2F0aW9uLWNvbXBvbmVudHtkaXNwbGF5Oi13ZWJraXQtZmxleDtkaXNwbGF5OmZsZXh9YF0sXHJcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZVxyXG59KVxyXG5leHBvcnQgY2xhc3MgTmF2aWdhdGlvbkNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcHJpdmF0ZSBub2RlQ2xpY2tlZFNlcnZpY2U6IE5vZGVDbGlja2VkU2VydmljZVxyXG4gICkge1xyXG4gIH1cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgfVxyXG5cclxuICBvbkNsaWNrKGlucHV0OiBzdHJpbmcpIHtcclxuICAgIHRoaXMubm9kZUNsaWNrZWRTZXJ2aWNlLnNlYXJjaEZvclN0cmluZyhpbnB1dCk7XHJcbiAgfVxyXG59XHJcbiIsIi8vIGltcG9ydCB7TW9kdWxlV2l0aFByb3ZpZGVycywgTmdNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge05nTW9kdWxlLCBJbmplY3Rpb25Ub2tlbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xyXG5pbXBvcnQge0ZpbGVNYW5hZ2VyQ29tcG9uZW50fSBmcm9tICcuL2ZpbGUtbWFuYWdlci5jb21wb25lbnQnO1xyXG5pbXBvcnQge0ZvbGRlckNvbnRlbnRDb21wb25lbnR9IGZyb20gJy4vY29tcG9uZW50cy9mb2xkZXItY29udGVudC9mb2xkZXItY29udGVudC5jb21wb25lbnQnO1xyXG5pbXBvcnQge1RyZWVDb21wb25lbnR9IGZyb20gJy4vY29tcG9uZW50cy90cmVlL3RyZWUuY29tcG9uZW50JztcclxuaW1wb3J0IHtOb2RlTGlzdGVyQ29tcG9uZW50fSBmcm9tICcuL2NvbXBvbmVudHMvdHJlZS9ub2RlLWxpc3Rlci9ub2RlLWxpc3Rlci5jb21wb25lbnQnO1xyXG5pbXBvcnQge05vZGVDb21wb25lbnR9IGZyb20gJy4vY29tcG9uZW50cy9mdW5jdGlvbnMvbm9kZS9ub2RlLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7TWFwVG9JdGVyYWJsZVBpcGV9IGZyb20gJy4vcGlwZXMvbWFwLXRvLWl0ZXJhYmxlLnBpcGUnO1xyXG5pbXBvcnQge0h0dHBDbGllbnQsIEh0dHBDbGllbnRNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHtTdG9yZU1vZHVsZSwgQWN0aW9uUmVkdWNlck1hcH0gZnJvbSAnQG5ncngvc3RvcmUnO1xyXG5pbXBvcnQge05hdkJhckNvbXBvbmVudH0gZnJvbSAnLi9jb21wb25lbnRzL25hdi1iYXIvbmF2LWJhci5jb21wb25lbnQnO1xyXG5pbXBvcnQge3JlZHVjZXJzLCBBcHBTdG9yZX0gZnJvbSAnLi9yZWR1Y2Vycy9yZWR1Y2VyLmZhY3RvcnknO1xyXG5pbXBvcnQge0xvYWRpbmdPdmVybGF5Q29tcG9uZW50fSBmcm9tICcuL2NvbXBvbmVudHMvZnVuY3Rpb25zL2xvYWRpbmctb3ZlcmxheS9sb2FkaW5nLW92ZXJsYXkuY29tcG9uZW50JztcclxuaW1wb3J0IHtGaWxlU2l6ZVBpcGV9IGZyb20gJy4vcGlwZXMvZmlsZS1zaXplLnBpcGUnO1xyXG5pbXBvcnQge1VwbG9hZENvbXBvbmVudH0gZnJvbSAnLi9jb21wb25lbnRzL2Z1bmN0aW9ucy91cGxvYWQvdXBsb2FkLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7TmV3Rm9sZGVyQ29tcG9uZW50fSBmcm9tICcuL2NvbXBvbmVudHMvZnVuY3Rpb25zL3VwbG9hZC9uZXctZm9sZGVyL25ldy1mb2xkZXIuY29tcG9uZW50JztcclxuaW1wb3J0IHtTaWRlVmlld0NvbXBvbmVudH0gZnJvbSAnLi9jb21wb25lbnRzL3NpZGUtdmlldy9zaWRlLXZpZXcuY29tcG9uZW50JztcclxuaW1wb3J0IHtOYXZpZ2F0aW9uQ29tcG9uZW50fSBmcm9tICcuL2NvbXBvbmVudHMvbmF2aWdhdGlvbi9uYXZpZ2F0aW9uLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7Tmd4U21hcnRNb2RhbE1vZHVsZX0gZnJvbSAnbmd4LXNtYXJ0LW1vZGFsJztcclxuaW1wb3J0IHtUcmFuc2xhdGVMb2FkZXIsIFRyYW5zbGF0ZU1vZHVsZX0gZnJvbSAnQG5neC10cmFuc2xhdGUvY29yZSc7XHJcbmltcG9ydCB7VHJhbnNsYXRlSHR0cExvYWRlcn0gZnJvbSAnQG5neC10cmFuc2xhdGUvaHR0cC1sb2FkZXInO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVRyYW5zbGF0ZUxvYWRlcihodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgcmV0dXJuIG5ldyBUcmFuc2xhdGVIdHRwTG9hZGVyKGh0dHAsICcvYXNzZXRzL2kxOG4vJywgJy5qc29uJyk7XHJcbn1cclxuXHJcbmNvbnN0IEZFQVRVUkVfUkVEVUNFUl9UT0tFTiA9IG5ldyBJbmplY3Rpb25Ub2tlbjxcclxuICBBY3Rpb25SZWR1Y2VyTWFwPEFwcFN0b3JlPlxyXG4+KCdBcHBTdG9yZSBSZWR1Y2VycycpO1xyXG5leHBvcnQgZnVuY3Rpb24gZ2V0UmVkdWNlcnMoKTogQWN0aW9uUmVkdWNlck1hcDxBcHBTdG9yZT4ge1xyXG4gIC8vIG1hcCBvZiByZWR1Y2Vyc1xyXG4gIHJldHVybiByZWR1Y2VycztcclxufVxyXG5cclxuQE5nTW9kdWxlKHtcclxuICBpbXBvcnRzOiBbXHJcbiAgICBIdHRwQ2xpZW50TW9kdWxlLFxyXG4gICAgU3RvcmVNb2R1bGUuZm9yUm9vdChGRUFUVVJFX1JFRFVDRVJfVE9LRU4pLFxyXG4gICAgQ29tbW9uTW9kdWxlLFxyXG4gICAgTmd4U21hcnRNb2RhbE1vZHVsZS5mb3JSb290KCksXHJcbiAgICBUcmFuc2xhdGVNb2R1bGUuZm9yUm9vdCh7XHJcbiAgICAgIGxvYWRlcjp7XHJcbiAgICAgICAgcHJvdmlkZTogVHJhbnNsYXRlTG9hZGVyLFxyXG4gICAgICAgIHVzZUZhY3Rvcnk6IChjcmVhdGVUcmFuc2xhdGVMb2FkZXIpLFxyXG4gICAgICAgIGRlcHM6IFtIdHRwQ2xpZW50XX1cclxuICAgIH0pXHJcbiAgXSxcclxuICBkZWNsYXJhdGlvbnM6IFtcclxuICAgIEZpbGVNYW5hZ2VyQ29tcG9uZW50LFxyXG4gICAgRm9sZGVyQ29udGVudENvbXBvbmVudCxcclxuICAgIE5vZGVDb21wb25lbnQsXHJcbiAgICBUcmVlQ29tcG9uZW50LFxyXG4gICAgTm9kZUxpc3RlckNvbXBvbmVudCxcclxuICAgIE1hcFRvSXRlcmFibGVQaXBlLFxyXG4gICAgTmF2QmFyQ29tcG9uZW50LFxyXG4gICAgTG9hZGluZ092ZXJsYXlDb21wb25lbnQsXHJcbiAgICBGaWxlU2l6ZVBpcGUsXHJcbiAgICBVcGxvYWRDb21wb25lbnQsXHJcbiAgICBOZXdGb2xkZXJDb21wb25lbnQsXHJcbiAgICBTaWRlVmlld0NvbXBvbmVudCxcclxuICAgIE5hdmlnYXRpb25Db21wb25lbnRcclxuICBdLFxyXG4gIGV4cG9ydHM6IFtcclxuICAgIEZpbGVNYW5hZ2VyQ29tcG9uZW50LFxyXG4gICAgTG9hZGluZ092ZXJsYXlDb21wb25lbnQsXHJcbiAgICBTaWRlVmlld0NvbXBvbmVudFxyXG4gIF0sXHJcbiAgcHJvdmlkZXJzOiBbXHJcbiAgICB7XHJcbiAgICAgIHByb3ZpZGU6IEZFQVRVUkVfUkVEVUNFUl9UT0tFTixcclxuICAgICAgdXNlRmFjdG9yeTogZ2V0UmVkdWNlcnMsXHJcbiAgICB9LFxyXG4gIF1cclxufSlcclxuZXhwb3J0IGNsYXNzIEZpbGVNYW5hZ2VyTW9kdWxlIHtcclxuICAvLyBzdGF0aWMgZm9yUm9vdCgpOiBNb2R1bGVXaXRoUHJvdmlkZXJzIHtcclxuICAvLyAgIHJldHVybiB7XHJcbiAgLy8gICAgIG5nTW9kdWxlOiBGaWxlTWFuYWdlck1vZHVsZSxcclxuICAvLyAgICAgcHJvdmlkZXJzOiBbVHJhbnNsYXRlU2VydmljZV1cclxuICAvLyAgIH07XHJcbiAgLy8gfVxyXG59XHJcbiIsImltcG9ydCB7Tm9kZUludGVyZmFjZX0gZnJvbSAnLi4vaW50ZXJmYWNlcy9ub2RlLmludGVyZmFjZSc7XHJcbmltcG9ydCB7Q29uZmlnSW50ZXJmYWNlfSBmcm9tICcuLi9pbnRlcmZhY2VzL2NvbmZpZy5pbnRlcmZhY2UnO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRyZWVNb2RlbCB7XHJcbiAgcHJpdmF0ZSBfY3VycmVudFBhdGg6IHN0cmluZztcclxuICBwcml2YXRlIF9ub2RlczogTm9kZUludGVyZmFjZTtcclxuICBwcml2YXRlIF9zZWxlY3RlZE5vZGVJZDogc3RyaW5nO1xyXG4gIHB1YmxpYyBjb25maWc6IENvbmZpZ0ludGVyZmFjZTtcclxuXHJcbiAgY29uc3RydWN0b3IoY29uZmlnOiBDb25maWdJbnRlcmZhY2UpIHtcclxuICAgIC8vIHRoaXMuX2N1cnJlbnRQYXRoID0gY29uZmlnLnN0YXJ0aW5nRm9sZGVyOyAvLyB0b2RvIGltcGxlbWVudCAoY29uZmlnLmludGVyZmNlLnRzKVxyXG4gICAgdGhpcy5fY3VycmVudFBhdGggPSAnJztcclxuICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xyXG5cclxuICAgIHRoaXMubm9kZXMgPSA8Tm9kZUludGVyZmFjZT57XHJcbiAgICAgIGlkOiAwLFxyXG4gICAgICBwYXRoVG9Ob2RlOiAnJyxcclxuICAgICAgcGF0aFRvUGFyZW50OiBudWxsLFxyXG4gICAgICBpc0ZvbGRlcjogdHJ1ZSxcclxuICAgICAgaXNFeHBhbmRlZDogdHJ1ZSxcclxuICAgICAgc3RheU9wZW46IHRydWUsXHJcbiAgICAgIG5hbWU6ICdyb290JyxcclxuICAgICAgY2hpbGRyZW46IHt9XHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgZ2V0IGN1cnJlbnRQYXRoKCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gdGhpcy5fY3VycmVudFBhdGg7XHJcbiAgfVxyXG5cclxuICBzZXQgY3VycmVudFBhdGgodmFsdWU6IHN0cmluZykge1xyXG4gICAgdGhpcy5fY3VycmVudFBhdGggPSB2YWx1ZTtcclxuICB9XHJcblxyXG4gIGdldCBub2RlcygpOiBOb2RlSW50ZXJmYWNlIHtcclxuICAgIHJldHVybiB0aGlzLl9ub2RlcztcclxuICB9XHJcblxyXG4gIHNldCBub2Rlcyh2YWx1ZTogTm9kZUludGVyZmFjZSkge1xyXG4gICAgdGhpcy5fbm9kZXMgPSB2YWx1ZTtcclxuICB9XHJcblxyXG4gIGdldCBzZWxlY3RlZE5vZGVJZCgpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRoaXMuX3NlbGVjdGVkTm9kZUlkO1xyXG4gIH1cclxuXHJcbiAgc2V0IHNlbGVjdGVkTm9kZUlkKHZhbHVlOiBzdHJpbmcpIHtcclxuICAgIHRoaXMuX3NlbGVjdGVkTm9kZUlkID0gdmFsdWU7XHJcbiAgfVxyXG5cclxuICAvLyB0b2RvIGltcGxlbWVudCAoY29uZmlnLmludGVyZmNlLnRzKVxyXG4gIC8vIGdldCBpc0NhY2hlKCk6IGJvb2xlYW4ge1xyXG4gIC8vICAgcmV0dXJuIHRoaXMuY29uZmlnLm9mZmxpbmVNb2RlO1xyXG4gIC8vIH1cclxuICAvL1xyXG4gIC8vIHNldCBpc0NhY2hlKHZhbHVlOiBib29sZWFuKSB7XHJcbiAgLy8gICB0aGlzLmNvbmZpZy5vZmZsaW5lTW9kZSA9IHZhbHVlO1xyXG4gIC8vIH1cclxufVxyXG4iXSwibmFtZXMiOlsiSHR0cFBhcmFtcyIsIkFDVElPTlMuU0VUX1BBVEgiLCJPYnNlcnZhYmxlIiwiQUNUSU9OUy5TRVRfTE9BRElOR19TVEFURSIsIkluamVjdGFibGUiLCJIdHRwQ2xpZW50IiwiU3RvcmUiLCJOZ3hTbWFydE1vZGFsU2VydmljZSIsIkV2ZW50RW1pdHRlciIsInNlbGVjdCIsIkFDVElPTlMuU0VUX1NFTEVDVEVEX05PREUiLCJDb21wb25lbnQiLCJWaWV3RW5jYXBzdWxhdGlvbiIsIlRyYW5zbGF0ZVNlcnZpY2UiLCJJbnB1dCIsIk91dHB1dCIsImZpcnN0IiwiQ29udGVudENoaWxkIiwiVGVtcGxhdGVSZWYiLCJQaXBlIiwidGltZXIiLCJfIiwiRmluZVVwbG9hZGVyIiwiVmlld0NoaWxkIiwiVHJhbnNsYXRlSHR0cExvYWRlciIsIkluamVjdGlvblRva2VuIiwiTmdNb2R1bGUiLCJIdHRwQ2xpZW50TW9kdWxlIiwiU3RvcmVNb2R1bGUiLCJDb21tb25Nb2R1bGUiLCJOZ3hTbWFydE1vZGFsTW9kdWxlIiwiVHJhbnNsYXRlTW9kdWxlIiwiVHJhbnNsYXRlTG9hZGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUdBLFFBQWEsUUFBUSxHQUFHLFVBQVU7O0FBQ2xDLFFBQWEsaUJBQWlCLEdBQUcsbUJBQW1COztBQUNwRCxRQUFhLGlCQUFpQixHQUFHLG1CQUFtQjs7Ozs7O0FDTHBEO1FBZ0JFLHFCQUFvQixJQUFnQixFQUFVLEtBQXNCO1lBQXBFLGlCQUNDO1lBRG1CLFNBQUksR0FBSixJQUFJLENBQVk7WUFBVSxVQUFLLEdBQUwsS0FBSyxDQUFpQjtZQThENUQsdUJBQWtCLElBQUcs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