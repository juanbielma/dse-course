import React from "react";
import { Spacing } from "@ds.e/foundation";
interface MarginProps {
    space?: keyof typeof Spacing;
    left?: boolean;
    right?: boolean;
    top?: boolean;
    bottom?: boolean;
}
declare const Margin: React.FC<React.PropsWithChildren<MarginProps>>;
export default Margin;
