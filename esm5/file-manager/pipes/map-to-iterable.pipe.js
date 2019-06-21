/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Pipe } from '@angular/core';
var MapToIterablePipe = /** @class */ (function () {
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
        { type: Pipe, args: [{
                    name: 'mapToIterablePipe'
                },] },
    ];
    return MapToIterablePipe;
}());
export { MapToIterablePipe };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLXRvLWl0ZXJhYmxlLnBpcGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZzYtZmlsZS1tYW4vIiwic291cmNlcyI6WyJmaWxlLW1hbmFnZXIvcGlwZXMvbWFwLXRvLWl0ZXJhYmxlLnBpcGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBQyxJQUFJLEVBQWdCLE1BQU0sZUFBZSxDQUFDO0FBRWxEO0lBQUE7SUFjQSxDQUFDOzs7OztJQVZDLHFDQUFTOzs7O0lBQVQsVUFBVSxJQUFZOztZQUNkLENBQUMsR0FBRyxFQUFFO1FBQ1osR0FBRyxDQUFDLENBQUMsSUFBTSxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztZQUN2QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDN0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBQyxDQUFDLENBQUM7WUFDckMsQ0FBQztRQUNILENBQUM7UUFFRCxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQ1gsQ0FBQzs7Z0JBYkYsSUFBSSxTQUFDO29CQUNKLElBQUksRUFBRSxtQkFBbUI7aUJBQzFCOztJQVlELHdCQUFDO0NBQUEsQUFkRCxJQWNDO1NBWFksaUJBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtQaXBlLCBQaXBlVHJhbnNmb3JtfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbkBQaXBlKHtcclxuICBuYW1lOiAnbWFwVG9JdGVyYWJsZVBpcGUnXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBNYXBUb0l0ZXJhYmxlUGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0ge1xyXG4gIHRyYW5zZm9ybShkaWN0OiBPYmplY3QpIHtcclxuICAgIGNvbnN0IGEgPSBbXTtcclxuICAgIGZvciAoY29uc3Qga2V5IGluIGRpY3QpIHtcclxuICAgICAgaWYgKGRpY3QuaGFzT3duUHJvcGVydHkoa2V5KSkge1xyXG4gICAgICAgIGEucHVzaCh7a2V5OiBrZXksIHZhbDogZGljdFtrZXldfSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYTtcclxuICB9XHJcbn1cclxuIl19