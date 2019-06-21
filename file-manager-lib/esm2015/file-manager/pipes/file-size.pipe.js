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
export class FileSizePipe {
    /*
     * Convert bytes into largest possible unit.
     * Takes an precision argument that defaults to 2.
     * Usage:
     *   bytes | fileSize:precision
     * Example:
     *   {{ 1024 |  fileSize}}
     *   formats to: 1 KB
    */
    constructor() {
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
    transform(bytes = 0, precision = 2) {
        if (isNaN(parseFloat(String(bytes))) || !isFinite(bytes))
            return '?';
        /** @type {?} */
        let unit = 0;
        while (bytes >= 1024) {
            bytes /= 1024;
            unit++;
        }
        return bytes.toFixed(+precision) + ' ' + this.units[unit];
    }
}
FileSizePipe.decorators = [
    { type: Pipe, args: [{ name: 'fileSize' },] },
];
if (false) {
    /**
     * @type {?}
     * @private
     */
    FileSizePipe.prototype.units;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZS1zaXplLnBpcGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZzYtZmlsZS1tYW4vIiwic291cmNlcyI6WyJmaWxlLW1hbmFnZXIvcGlwZXMvZmlsZS1zaXplLnBpcGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxJQUFJLEVBQWlCLE1BQU0sZUFBZSxDQUFDOzs7Ozs7Ozs7O0FBWXBELE1BQU07SUFWTjs7Ozs7Ozs7TUFRRTtJQUNGO1FBR1UsVUFBSyxHQUFHO1lBQ2QsT0FBTztZQUNQLElBQUk7WUFDSixJQUFJO1lBQ0osSUFBSTtZQUNKLElBQUk7WUFDSixJQUFJO1NBQ0wsQ0FBQztJQWNKLENBQUM7Ozs7OztJQVpDLFNBQVMsQ0FBQyxRQUFnQixDQUFDLEVBQUUsWUFBb0IsQ0FBQztRQUNoRCxFQUFFLENBQUMsQ0FBRSxLQUFLLENBQUUsVUFBVSxDQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBRSxDQUFDLElBQUksQ0FBRSxRQUFRLENBQUUsS0FBSyxDQUFHLENBQUM7WUFBQyxNQUFNLENBQUMsR0FBRyxDQUFDOztZQUV6RSxJQUFJLEdBQUcsQ0FBQztRQUVaLE9BQVEsS0FBSyxJQUFJLElBQUksRUFBRyxDQUFDO1lBQ3ZCLEtBQUssSUFBSSxJQUFJLENBQUM7WUFDZCxJQUFJLEVBQUcsQ0FBQztRQUNWLENBQUM7UUFFRCxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBRSxDQUFFLFNBQVMsQ0FBRSxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFFLElBQUksQ0FBRSxDQUFDO0lBQ2pFLENBQUM7OztZQXZCRixJQUFJLFNBQUMsRUFBQyxJQUFJLEVBQUUsVUFBVSxFQUFDOzs7Ozs7O0lBR3RCLDZCQU9FIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGlwZSwgUGlwZVRyYW5zZm9ybSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuLypcclxuICogQ29udmVydCBieXRlcyBpbnRvIGxhcmdlc3QgcG9zc2libGUgdW5pdC5cclxuICogVGFrZXMgYW4gcHJlY2lzaW9uIGFyZ3VtZW50IHRoYXQgZGVmYXVsdHMgdG8gMi5cclxuICogVXNhZ2U6XHJcbiAqICAgYnl0ZXMgfCBmaWxlU2l6ZTpwcmVjaXNpb25cclxuICogRXhhbXBsZTpcclxuICogICB7eyAxMDI0IHwgIGZpbGVTaXplfX1cclxuICogICBmb3JtYXRzIHRvOiAxIEtCXHJcbiovXHJcbkBQaXBlKHtuYW1lOiAnZmlsZVNpemUnfSlcclxuZXhwb3J0IGNsYXNzIEZpbGVTaXplUGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0ge1xyXG5cclxuICBwcml2YXRlIHVuaXRzID0gW1xyXG4gICAgJ2J5dGVzJyxcclxuICAgICdLQicsXHJcbiAgICAnTUInLFxyXG4gICAgJ0dCJyxcclxuICAgICdUQicsXHJcbiAgICAnUEInXHJcbiAgXTtcclxuXHJcbiAgdHJhbnNmb3JtKGJ5dGVzOiBudW1iZXIgPSAwLCBwcmVjaXNpb246IG51bWJlciA9IDIgKSA6IHN0cmluZyB7XHJcbiAgICBpZiAoIGlzTmFOKCBwYXJzZUZsb2F0KCBTdHJpbmcoYnl0ZXMpICkpIHx8ICEgaXNGaW5pdGUoIGJ5dGVzICkgKSByZXR1cm4gJz8nO1xyXG5cclxuICAgIGxldCB1bml0ID0gMDtcclxuXHJcbiAgICB3aGlsZSAoIGJ5dGVzID49IDEwMjQgKSB7XHJcbiAgICAgIGJ5dGVzIC89IDEwMjQ7XHJcbiAgICAgIHVuaXQgKys7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGJ5dGVzLnRvRml4ZWQoICsgcHJlY2lzaW9uICkgKyAnICcgKyB0aGlzLnVuaXRzWyB1bml0IF07XHJcbiAgfVxyXG59XHJcbiJdfQ==