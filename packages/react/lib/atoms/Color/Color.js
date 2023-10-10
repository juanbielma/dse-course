import React from 'react';
import { Spacing } from '@ds.e/foundation';

const Color = ({ hexCode, width = Spacing.sm, height = Spacing.sm, }) => {
    const className = `dse-w-${width} dse-h-${height}`;
    return React.createElement("div", { className: className, style: { backgroundColor: hexCode } });
};

export { Color as default };
//# sourceMappingURL=Color.js.map
