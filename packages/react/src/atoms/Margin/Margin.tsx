import React from "react";

import { Spacing } from "@ds.e/foundation";

interface MarginProps {
  space?: keyof typeof Spacing;
  left?: boolean;
  right?: boolean;
  top?: boolean;
  bottom?: boolean;
}

const Margin: React.FC<React.PropsWithChildren<MarginProps>> = ({
  space = Spacing.xxxs,
  left = false,
  right = false,
  top = false,
  bottom = false,
  children,
}) => {
  let className = ``;

  if (!left && !right && !top && !bottom) {
    className = `dse-margin-${space}`;
  }

  if (top) {
    className = `${className} dse-margin-top-${space}`;
  }
  if (right) {
    className = `${className} dse-margin-right-${space}`;
  }

  if (left) {
    className = `${className} dse-margin-left-${space}`;
  }

  if (bottom) {
    className = `${className} dse-margin-bottom-${space}`;
  }

  return <div className={className}>{children}</div>;
};

export default Margin;
