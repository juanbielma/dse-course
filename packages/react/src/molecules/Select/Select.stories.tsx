import React from "react";
import type { Meta } from '@storybook/react';


import Select from "./Select";

import '@ds.e/scss/lib/Select.css';

const meta: Meta<typeof Select> = {
  component: Select
}

export default meta;

const options = [
  {
    label: "Strict Black",
    value: "black",
  },
  {
    label: "Heavenly Green",
    value: "green",
  },
  {
    label: "Sweet Pink",
    value: "pink",
  },
];

export const Common = () => <Select options={options} />;


export const RenderOption = () => <Select options={options} renderOption={({getOptionRecommendedProps, option, isSelected}) => <li {...getOptionRecommendedProps()}>{option.label} {isSelected ? "SELECTED" : ""}</li>} />;

export const CustomLabel = () => <Select options={options} label="Select a color" />;

