// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'texthighlight' })
export class TextHighlightPipe implements PipeTransform {
    transform(text: string, search): string {
        const pattern = search
            .replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&')
            .split(' ')
            .filter(t => t.length > 0)
            .join('|');
        const regex = new RegExp(pattern, 'gi');
        return search ? text.replace(regex, match => `<b>${match}</b>`) : text;
    }
}
