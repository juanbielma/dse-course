import React from "react";
import { Meta } from "@storybook/react";
import {text, select} from "@storybook/addon-knobs";
import Color from "./Color";

import { Spacing} from "@ds.e/foundation";


// css
import "@ds.e/scss/lib/Utilities.css"

const meta: Meta<typeof Color> = {
  component: Color
};

export default meta;

export const Common = () => <Color hexCode={text('HexCode', 'pink')} />;

export const CustomDimensions = () => <Color hexCode={text('HexCode', 'pink')} width={select('Width', Object.values(Spacing), Spacing.lg)} height={select('Height', Object.values(Spacing), Spacing.lg)} />;