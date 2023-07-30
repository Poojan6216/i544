import { Err } from 'cs544-js-utils';
export declare class Errors {
    private readonly errors;
    constructor();
    display(errors: Err[]): void;
    clear(): void;
}
/** Return a new DOM element with specified tagName, attributes
 *  given by object attrs and initial contained text.
 *  Note that .append(TextOrElement) can be called on the returned
 *  element to append string text or a new DOM element to it.
 */
export declare function makeElement(tagName: string, attrs?: {
    [attr: string]: string;
}, text?: string): HTMLElement;
//# sourceMappingURL=utils.d.ts.map