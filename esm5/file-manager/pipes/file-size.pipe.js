/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Pipe } from '@angular/core';
/*
 * Convert bytes into largest possible unit.
 * Takes an precision argument that defaults to 2.
 * Usage:
 *   bytes | fileSize:precision
 * Example:
 *   {{ 1024 |  fileSize}}
 *   formats to: 1 KB
*/
var FileSizePipe = /** @class */ (function () {
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
        if (bytes === void 0) { bytes = 0; }
        if (precision === void 0) { precision = 2; }
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
        { type: Pipe, args: [{ name: 'fileSize' },] },
    ];
    return FileSizePipe;
}());
export { FileSizePipe };
if (false) {
    /**
     * @type {?}
     * @private
     */
    FileSizePipe.prototype.units;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZS1zaXplLnBpcGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZzYtZmlsZS1tYW4vIiwic291cmNlcyI6WyJmaWxlLW1hbmFnZXIvcGlwZXMvZmlsZS1zaXplLnBpcGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxJQUFJLEVBQWlCLE1BQU0sZUFBZSxDQUFDOzs7Ozs7Ozs7O0FBV3BEO0lBVEE7Ozs7Ozs7O01BUUU7SUFDRjtRQUdVLFVBQUssR0FBRztZQUNkLE9BQU87WUFDUCxJQUFJO1lBQ0osSUFBSTtZQUNKLElBQUk7WUFDSixJQUFJO1lBQ0osSUFBSTtTQUNMLENBQUM7SUFjSixDQUFDOzs7Ozs7SUFaQyxnQ0FBUzs7Ozs7SUFBVCxVQUFVLEtBQWlCLEVBQUUsU0FBcUI7UUFBeEMsc0JBQUEsRUFBQSxTQUFpQjtRQUFFLDBCQUFBLEVBQUEsYUFBcUI7UUFDaEQsRUFBRSxDQUFDLENBQUUsS0FBSyxDQUFFLFVBQVUsQ0FBRSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUUsQ0FBQyxJQUFJLENBQUUsUUFBUSxDQUFFLEtBQUssQ0FBRyxDQUFDO1lBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQzs7WUFFekUsSUFBSSxHQUFHLENBQUM7UUFFWixPQUFRLEtBQUssSUFBSSxJQUFJLEVBQUcsQ0FBQztZQUN2QixLQUFLLElBQUksSUFBSSxDQUFDO1lBQ2QsSUFBSSxFQUFHLENBQUM7UUFDVixDQUFDO1FBRUQsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUUsQ0FBRSxTQUFTLENBQUUsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBRSxJQUFJLENBQUUsQ0FBQztJQUNqRSxDQUFDOztnQkF2QkYsSUFBSSxTQUFDLEVBQUMsSUFBSSxFQUFFLFVBQVUsRUFBQzs7SUF3QnhCLG1CQUFDO0NBQUEsQUF4QkQsSUF3QkM7U0F2QlksWUFBWTs7Ozs7O0lBRXZCLDZCQU9FIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGlwZSwgUGlwZVRyYW5zZm9ybSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuLypcclxuICogQ29udmVydCBieXRlcyBpbnRvIGxhcmdlc3QgcG9zc2libGUgdW5pdC5cclxuICogVGFrZXMgYW4gcHJlY2lzaW9uIGFyZ3VtZW50IHRoYXQgZGVmYXVsdHMgdG8gMi5cclxuICogVXNhZ2U6XHJcbiAqICAgYnl0ZXMgfCBmaWxlU2l6ZTpwcmVjaXNpb25cclxuICogRXhhbXBsZTpcclxuICogICB7eyAxMDI0IHwgIGZpbGVTaXplfX1cclxuICogICBmb3JtYXRzIHRvOiAxIEtCXHJcbiovXHJcbkBQaXBlKHtuYW1lOiAnZmlsZVNpemUnfSlcclxuZXhwb3J0IGNsYXNzIEZpbGVTaXplUGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0ge1xyXG5cclxuICBwcml2YXRlIHVuaXRzID0gW1xyXG4gICAgJ2J5dGVzJyxcclxuICAgICdLQicsXHJcbiAgICAnTUInLFxyXG4gICAgJ0dCJyxcclxuICAgICdUQicsXHJcbiAgICAnUEInXHJcbiAgXTtcclxuXHJcbiAgdHJhbnNmb3JtKGJ5dGVzOiBudW1iZXIgPSAwLCBwcmVjaXNpb246IG51bWJlciA9IDIgKSA6IHN0cmluZyB7XHJcbiAgICBpZiAoIGlzTmFOKCBwYXJzZUZsb2F0KCBTdHJpbmcoYnl0ZXMpICkpIHx8ICEgaXNGaW5pdGUoIGJ5dGVzICkgKSByZXR1cm4gJz8nO1xyXG5cclxuICAgIGxldCB1bml0ID0gMDtcclxuXHJcbiAgICB3aGlsZSAoIGJ5dGVzID49IDEwMjQgKSB7XHJcbiAgICAgIGJ5dGVzIC89IDEwMjQ7XHJcbiAgICAgIHVuaXQgKys7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGJ5dGVzLnRvRml4ZWQoICsgcHJlY2lzaW9uICkgKyAnICcgKyB0aGlzLnVuaXRzWyB1bml0IF07XHJcbiAgfVxyXG59XHJcbiJdfQ==