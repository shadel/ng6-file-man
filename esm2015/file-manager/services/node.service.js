/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import * as ACTIONS from '../reducers/actions.action';
import { Store } from '@ngrx/store';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
import * as i2 from "@ngrx/store";
export class NodeService {
    /**
     * @param {?} http
     * @param {?} store
     */
    constructor(http, store) {
        this.http = http;
        this.store = store;
        this.getNodesFromServer = (/**
         * @param {?} path
         * @return {?}
         */
        (path) => {
            /** @type {?} */
            let folderId = this.findNodeByPath(path).id;
            folderId = folderId === 0 ? '' : folderId;
            return this.http.get(this.tree.config.baseURL + this.tree.config.api.listFile, { params: new HttpParams().set('parentPath', folderId) });
        });
    }
    // todo ask server to get parent structure
    /**
     * @param {?} path
     * @return {?}
     */
    startManagerAt(path) {
        this.store.dispatch({ type: ACTIONS.SET_PATH, payload: path });
    }
    /**
     * @return {?}
     */
    refreshCurrentPath() {
        this.findNodeByPath(this.currentPath).children = {};
        this.getNodes(this.currentPath);
    }
    /**
     * @param {?} path
     * @return {?}
     */
    getNodes(path) {
        this.parseNodes(path).subscribe((/**
         * @param {?} data
         * @return {?}
         */
        (data) => {
            for (let i = 0; i < data.length; i++) {
                /** @type {?} */
                const parentPath = this.getParentPath(data[i].pathToNode);
                this.findNodeByPath(parentPath).children[data[i].name] = data[i];
            }
        }));
    }
    /**
     * @private
     * @param {?} path
     * @return {?}
     */
    getParentPath(path) {
        /** @type {?} */
        let parentPath = path.split('/');
        parentPath = parentPath.slice(0, parentPath.length - 1);
        return parentPath.join('/');
    }
    /**
     * @private
     * @param {?} path
     * @return {?}
     */
    parseNodes(path) {
        return new Observable((/**
         * @param {?} observer
         * @return {?}
         */
        observer => {
            this.getNodesFromServer(path).subscribe((/**
             * @param {?} data
             * @return {?}
             */
            (data) => {
                observer.next(data.map((/**
                 * @param {?} node
                 * @return {?}
                 */
                node => this.createNode(path, node))));
                this.store.dispatch({ type: ACTIONS.SET_LOADING_STATE, payload: false });
            }));
        }));
    }
    /**
     * @private
     * @param {?} path
     * @param {?} node
     * @return {?}
     */
    createNode(path, node) {
        if (node.path[0] !== '/') {
            console.warn('[Node Service] Server should return initial path with "/"');
            node.path = '/' + node.path;
        }
        /** @type {?} */
        const ids = node.path.split('/');
        if (ids.length > 2 && ids[ids.length - 1] === '') {
            ids.splice(-1, 1);
            node.path = ids.join('/');
        }
        /** @type {?} */
        const cachedNode = this.findNodeByPath(node.path);
        return (/** @type {?} */ ({
            id: node.id,
            isFolder: node.dir,
            isExpanded: cachedNode ? cachedNode.isExpanded : false,
            pathToNode: node.path,
            pathToParent: this.getParentPath(node.path),
            name: node.name || node.id,
            children: cachedNode ? cachedNode.children : {}
        }));
    }
    /**
     * @param {?} nodePath
     * @return {?}
     */
    findNodeByPath(nodePath) {
        /** @type {?} */
        const ids = nodePath.split('/');
        ids.splice(0, 1);
        return ids.length === 0 ? this.tree.nodes : ids.reduce((/**
         * @param {?} value
         * @param {?} index
         * @return {?}
         */
        (value, index) => value['children'][index]), this.tree.nodes);
    }
    /**
     * @param {?} id
     * @return {?}
     */
    findNodeById(id) {
        /** @type {?} */
        const result = this.findNodeByIdHelper(id);
        if (result === null) {
            console.warn('[Node Service] Cannot find node by id. Id not existing or not fetched. Returning root.');
            return this.tree.nodes;
        }
        return result;
    }
    /**
     * @param {?} id
     * @param {?=} node
     * @return {?}
     */
    findNodeByIdHelper(id, node = this.tree.nodes) {
        if (node.id === id)
            return node;
        /** @type {?} */
        const keys = Object.keys(node.children);
        for (let i = 0; i < keys.length; i++) {
            if (typeof node.children[keys[i]] == 'object') {
                /** @type {?} */
                const obj = this.findNodeByIdHelper(id, node.children[keys[i]]);
                if (obj != null)
                    return obj;
            }
        }
        return null;
    }
    /**
     * @param {?} node
     * @return {?}
     */
    foldRecursively(node) {
        // console.log('folding ', node);
        /** @type {?} */
        const children = node.children;
        Object.keys(children).map((/**
         * @param {?} child
         * @return {?}
         */
        (child) => {
            if (!children.hasOwnProperty(child) || !children[child].isExpanded) {
                return null;
            }
            this.foldRecursively(children[child]);
            //todo put this getElById into one func (curr inside node.component.ts + fm.component.ts) - this won't be maintainable
            document.getElementById('tree_' + children[child].pathToNode).classList.add('deselected');
            children[child].isExpanded = false;
        }));
    }
    /**
     * @return {?}
     */
    foldAll() {
        this.foldRecursively(this.tree.nodes);
    }
    /**
     * @return {?}
     */
    get currentPath() {
        return this._path;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set currentPath(value) {
        this._path = value;
    }
}
NodeService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] },
];
NodeService.ctorParameters = () => [
    { type: HttpClient },
    { type: Store }
];
/** @nocollapse */ NodeService.ngInjectableDef = i0.defineInjectable({ factory: function NodeService_Factory() { return new NodeService(i0.inject(i1.HttpClient), i0.inject(i2.Store)); }, token: NodeService, providedIn: "root" });
if (false) {
    /** @type {?} */
    NodeService.prototype.tree;
    /**
     * @type {?}
     * @private
     */
    NodeService.prototype._path;
    /**
     * @type {?}
     * @private
     */
    NodeService.prototype.getNodesFromServer;
    /**
     * @type {?}
     * @private
     */
    NodeService.prototype.http;
    /**
     * @type {?}
     * @private
     */
    NodeService.prototype.store;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmc2LWZpbGUtbWFuLyIsInNvdXJjZXMiOlsiZmlsZS1tYW5hZ2VyL3NlcnZpY2VzL25vZGUuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUV6QyxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBRWhDLE9BQU8sRUFBQyxVQUFVLEVBQUUsVUFBVSxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDNUQsT0FBTyxLQUFLLE9BQU8sTUFBTSw0QkFBNEIsQ0FBQztBQUN0RCxPQUFPLEVBQUMsS0FBSyxFQUFDLE1BQU0sYUFBYSxDQUFDOzs7O0FBTWxDLE1BQU07Ozs7O0lBSUosWUFBb0IsSUFBZ0IsRUFBVSxLQUFzQjtRQUFoRCxTQUFJLEdBQUosSUFBSSxDQUFZO1FBQVUsVUFBSyxHQUFMLEtBQUssQ0FBaUI7UUE4RDVELHVCQUFrQjs7OztRQUFHLENBQUMsSUFBWSxFQUFFLEVBQUU7O2dCQUN4QyxRQUFRLEdBQVEsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFO1lBQ2hELFFBQVEsR0FBRyxRQUFRLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQztZQUUxQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQ2xCLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUN4RCxFQUFDLE1BQU0sRUFBRSxJQUFJLFVBQVUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsUUFBUSxDQUFDLEVBQUMsQ0FDdkQsQ0FBQztRQUNKLENBQUMsRUFBQztJQXJFRixDQUFDOzs7Ozs7SUFHTSxjQUFjLENB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b20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge05vZGVJbnRlcmZhY2V9IGZyb20gJy4uL2ludGVyZmFjZXMvbm9kZS5pbnRlcmZhY2UnO1xyXG5pbXBvcnQge09ic2VydmFibGV9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge1RyZWVNb2RlbH0gZnJvbSAnLi4vbW9kZWxzL3RyZWUubW9kZWwnO1xyXG5pbXBvcnQge0h0dHBDbGllbnQsIEh0dHBQYXJhbXN9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0ICogYXMgQUNUSU9OUyBmcm9tICcuLi9yZWR1Y2Vycy9hY3Rpb25zLmFjdGlvbic7XHJcbmltcG9ydCB7U3RvcmV9IGZyb20gJ0BuZ3J4L3N0b3JlJztcclxuaW1wb3J0IHtBcHBTdG9yZX0gZnJvbSAnLi4vcmVkdWNlcnMvcmVkdWNlci5mYWN0b3J5JztcclxuXHJcbkBJbmplY3RhYmxlKHtcclxuICBwcm92aWRlZEluOiAncm9vdCdcclxufSlcclxuZXhwb3J0IGNsYXNzIE5vZGVTZXJ2aWNlIHtcclxuICBwdWJsaWMgdHJlZTogVHJlZU1vZGVsO1xyXG4gIHByaXZhdGUgX3BhdGg6IHN0cmluZztcclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50LCBwcml2YXRlIHN0b3JlOiBTdG9yZTxBcHBTdG9yZT4pIHtcclxuICB9XHJcblxyXG4gIC8vIHRvZG8gYXNrIHNlcnZlciB0byBnZXQgcGFyZW50IHN0cnVjdHVyZVxyXG4gIHB1YmxpYyBzdGFydE1hbmFnZXJBdChwYXRoOiBzdHJpbmcpIHtcclxuICAgIHRoaXMuc3RvcmUuZGlzcGF0Y2goe3R5cGU6IEFDVElPTlMuU0VUX1BBVEgsIHBheWxvYWQ6IHBhdGh9KTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyByZWZyZXNoQ3VycmVudFBhdGgoKSB7XHJcbiAgICB0aGlzLmZpbmROb2RlQnlQYXRoKHRoaXMuY3VycmVudFBhdGgpLmNoaWxkcmVuID0ge307XHJcbiAgICB0aGlzLmdldE5vZGVzKHRoaXMuY3VycmVudFBhdGgpO1xyXG4gIH1cclxuXHJcbiAgZ2V0Tm9kZXMocGF0aDogc3RyaW5nKSB7XHJcbiAgICB0aGlzLnBhcnNlTm9kZXMocGF0aCkuc3Vic2NyaWJlKChkYXRhOiBBcnJheTxOb2RlSW50ZXJmYWNlPikgPT4ge1xyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBjb25zdCBwYXJlbnRQYXRoID0gdGhpcy5nZXRQYXJlbnRQYXRoKGRhdGFbaV0ucGF0aFRvTm9kZSk7XHJcbiAgICAgICAgdGhpcy5maW5kTm9kZUJ5UGF0aChwYXJlbnRQYXRoKS5jaGlsZHJlbltkYXRhW2ldLm5hbWVdID0gZGF0YVtpXTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdldFBhcmVudFBhdGgocGF0aDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIGxldCBwYXJlbnRQYXRoID0gcGF0aC5zcGxpdCgnLycpO1xyXG4gICAgcGFyZW50UGF0aCA9IHBhcmVudFBhdGguc2xpY2UoMCwgcGFyZW50UGF0aC5sZW5ndGggLSAxKTtcclxuICAgIHJldHVybiBwYXJlbnRQYXRoLmpvaW4oJy8nKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgcGFyc2VOb2RlcyhwYXRoOiBzdHJpbmcpOiBPYnNlcnZhYmxlPE5vZGVJbnRlcmZhY2VbXT4ge1xyXG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlKG9ic2VydmVyID0+IHtcclxuICAgICAgdGhpcy5nZXROb2Rlc0Zyb21TZXJ2ZXIocGF0aCkuc3Vic2NyaWJlKChkYXRhOiBBcnJheTxhbnk+KSA9PiB7XHJcbiAgICAgICAgb2JzZXJ2ZXIubmV4dChkYXRhLm1hcChub2RlID0+IHRoaXMuY3JlYXRlTm9kZShwYXRoLCBub2RlKSkpO1xyXG4gICAgICAgIHRoaXMuc3RvcmUuZGlzcGF0Y2goe3R5cGU6IEFDVElPTlMuU0VUX0xPQURJTkdfU1RBVEUsIHBheWxvYWQ6IGZhbHNlfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNyZWF0ZU5vZGUocGF0aCwgbm9kZSk6IE5vZGVJbnRlcmZhY2Uge1xyXG4gICAgaWYgKG5vZGUucGF0aFswXSAhPT0gJy8nKSB7XHJcbiAgICAgIGNvbnNvbGUud2FybignW05vZGUgU2VydmljZV0gU2VydmVyIHNob3VsZCByZXR1cm4gaW5pdGlhbCBwYXRoIHdpdGggXCIvXCInKTtcclxuICAgICAgbm9kZS5wYXRoID0gJy8nICsgbm9kZS5wYXRoO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGlkcyA9IG5vZGUucGF0aC5zcGxpdCgnLycpO1xyXG4gICAgaWYgKGlkcy5sZW5ndGggPiAyICYmIGlkc1tpZHMubGVuZ3RoIC0gMV0gPT09ICcnKSB7XHJcbiAgICAgIGlkcy5zcGxpY2UoLTEsIDEpO1xyXG4gICAgICBub2RlLnBhdGggPSBpZHMuam9pbignLycpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGNhY2hlZE5vZGUgPSB0aGlzLmZpbmROb2RlQnlQYXRoKG5vZGUucGF0aCk7XHJcblxyXG4gICAgcmV0dXJuIDxOb2RlSW50ZXJmYWNlPntcclxuICAgICAgaWQ6IG5vZGUuaWQsXHJcbiAgICAgIGlzRm9sZGVyOiBub2RlLmRpcixcclxuICAgICAgaXNFeHBhbmRlZDogY2FjaGVkTm9kZSA/IGNhY2hlZE5vZGUuaXNFeHBhbmRlZCA6IGZhbHNlLFxyXG4gICAgICBwYXRoVG9Ob2RlOiBub2RlLnBhdGgsXHJcbiAgICAgIHBhdGhUb1BhcmVudDogdGhpcy5nZXRQYXJlbnRQYXRoKG5vZGUucGF0aCksXHJcbiAgICAgIG5hbWU6IG5vZGUubmFtZSB8fCBub2RlLmlkLFxyXG4gICAgICBjaGlsZHJlbjogY2FjaGVkTm9kZSA/IGNhY2hlZE5vZGUuY2hpbGRyZW4gOiB7fVxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZ2V0Tm9kZXNGcm9tU2VydmVyID0gKHBhdGg6IHN0cmluZykgPT4ge1xyXG4gICAgbGV0IGZvbGRlcklkOiBhbnkgPSB0aGlzLmZpbmROb2RlQnlQYXRoKHBhdGgpLmlkO1xyXG4gICAgZm9sZGVySWQgPSBmb2xkZXJJZCA9PT0gMCA/ICcnIDogZm9sZGVySWQ7XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQoXHJcbiAgICAgIHRoaXMudHJlZS5jb25maWcuYmFzZVVSTCArIHRoaXMudHJlZS5jb25maWcuYXBpLmxpc3RGaWxlLFxyXG4gICAgICB7cGFyYW1zOiBuZXcgSHR0cFBhcmFtcygpLnNldCgncGFyZW50UGF0aCcsIGZvbGRlcklkKX1cclxuICAgICk7XHJcbiAgfTtcclxuXHJcbiAgcHVibGljIGZpbmROb2RlQnlQYXRoKG5vZGVQYXRoOiBzdHJpbmcpOiBOb2RlSW50ZXJmYWNlIHtcclxuICAgIGNvbnN0IGlkcyA9IG5vZGVQYXRoLnNwbGl0KCcvJyk7XHJcbiAgICBpZHMuc3BsaWNlKDAsIDEpO1xyXG5cclxuICAgIHJldHVybiBpZHMubGVuZ3RoID09PSAwID8gdGhpcy50cmVlLm5vZGVzIDogaWRzLnJlZHVjZSgodmFsdWUsIGluZGV4KSA9PiB2YWx1ZVsnY2hpbGRyZW4nXVtpbmRleF0sIHRoaXMudHJlZS5ub2Rlcyk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZmluZE5vZGVCeUlkKGlkOiBudW1iZXIpOiBOb2RlSW50ZXJmYWNlIHtcclxuICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMuZmluZE5vZGVCeUlkSGVscGVyKGlkKTtcclxuXHJcbiAgICBpZiAocmVzdWx0ID09PSBudWxsKSB7XHJcbiAgICAgIGNvbnNvbGUud2FybignW05vZGUgU2VydmljZV0gQ2Fubm90IGZpbmQgbm9kZSBieSBpZC4gSWQgbm90IGV4aXN0aW5nIG9yIG5vdCBmZXRjaGVkLiBSZXR1cm5pbmcgcm9vdC4nKTtcclxuICAgICAgcmV0dXJuIHRoaXMudHJlZS5ub2RlcztcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGZpbmROb2RlQnlJZEhlbHBlcihpZDogbnVtYmVyLCBub2RlOiBOb2RlSW50ZXJmYWNlID0gdGhpcy50cmVlLm5vZGVzKTogTm9kZUludGVyZmFjZSB7XHJcbiAgICBpZiAobm9kZS5pZCA9PT0gaWQpXHJcbiAgICAgIHJldHVybiBub2RlO1xyXG5cclxuICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhub2RlLmNoaWxkcmVuKTtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgaWYgKHR5cGVvZiBub2RlLmNoaWxkcmVuW2tleXNbaV1dID09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgY29uc3Qgb2JqID0gdGhpcy5maW5kTm9kZUJ5SWRIZWxwZXIoaWQsIG5vZGUuY2hpbGRyZW5ba2V5c1tpXV0pO1xyXG4gICAgICAgIGlmIChvYmogIT0gbnVsbClcclxuICAgICAgICAgIHJldHVybiBvYmo7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBmb2xkUmVjdXJzaXZlbHkobm9kZTogTm9kZUludGVyZmFjZSkge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ2ZvbGRpbmcgJywgbm9kZSk7XHJcbiAgICBjb25zdCBjaGlsZHJlbiA9IG5vZGUuY2hpbGRyZW47XHJcblxyXG4gICAgT2JqZWN0LmtleXMoY2hpbGRyZW4pLm1hcCgoY2hpbGQ6IHN0cmluZykgPT4ge1xyXG4gICAgICBpZiAoIWNoaWxkcmVuLmhhc093blByb3BlcnR5KGNoaWxkKSB8fCAhY2hpbGRyZW5bY2hpbGRdLmlzRXhwYW5kZWQpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5mb2xkUmVjdXJzaXZlbHkoY2hpbGRyZW5bY2hpbGRdKTtcclxuICAgICAgLy90b2RvIHB1dCB0aGlzIGdldEVsQnlJZCBpbnRvIG9uZSBmdW5jIChjdXJyIGluc2lkZSBub2RlLmNvbXBvbmVudC50cyArIGZtLmNvbXBvbmVudC50cykgLSB0aGlzIHdvbid0IGJlIG1haW50YWluYWJsZVxyXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndHJlZV8nICsgY2hpbGRyZW5bY2hpbGRdLnBhdGhUb05vZGUpLmNsYXNzTGlzdC5hZGQoJ2Rlc2VsZWN0ZWQnKTtcclxuICAgICAgY2hpbGRyZW5bY2hpbGRdLmlzRXhwYW5kZWQgPSBmYWxzZTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGZvbGRBbGwoKSB7XHJcbiAgICB0aGlzLmZvbGRSZWN1cnNpdmVseSh0aGlzLnRyZWUubm9kZXMpO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGN1cnJlbnRQYXRoKCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gdGhpcy5fcGF0aDtcclxuICB9XHJcblxyXG4gIHNldCBjdXJyZW50UGF0aCh2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICB0aGlzLl9wYXRoID0gdmFsdWU7XHJcbiAgfVxyXG59XHJcbiJdfQ==