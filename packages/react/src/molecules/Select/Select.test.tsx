import "@testing-library/jest-dom";
import React from "react";
import Select from "./Select";

import { fireEvent, render } from "@testing-library/react";

const options = [
  {
    label: "Strict Black",
    value: "strict-black",
  },
  {
    label: "Heavenly Green",
    value: "heavenly-green",
  },
  {
    label: "Sweet Pink",
    value: "pink",
  },
];

test("render all optionspassed to it", () => {
  const { getAllByRole, getByTestId } = render(<Select options={options} />);

  fireEvent.click(getByTestId("dseSelectButton"));

  expect(getAllByRole("menuItemradio").length).toEqual(options.length);
});

test("render options using custom renderOption method if passed to it", () => {
  const { getAllByTestId, getByTestId } = render(
    <Select
      options={options}
      renderOption={({ option, getOptionRecommendedProps }) => {
        return (
          <li data-testid="customRenderOption" {...getOptionRecommendedProps()}>
            {option.label}
          </li>
        );
      }}
    />
  );

  fireEvent.click(getByTestId("dseSelectButton"));

  expect(getAllByTestId("customRenderOption")).toHaveLength(options.length);
});

test("calls the onOptionSelected prop with the selected option and its index when an option is selected", () => {
  const onOptionSelected = jest.fn();
  const { getAllByRole, getByTestId } = render(
    <Select options={options} onOptionSelected={onOptionSelected} />
  );

  fireEvent.click(getByTestId("dseSelectButton"));

  fireEvent.click(getAllByRole("menuItemradio")[0]);

  expect(onOptionSelected).toHaveBeenCalledWith(options[0], 0);
  expect(onOptionSelected).toHaveBeenCalledTimes(1); // because we only have one option in the options array.
});

test("the button label changes to the selected option label", () => {
  const { getAllByRole, getByTestId } = render(<Select options={options} />);

  fireEvent.click(getByTestId("dseSelectButton"));

  fireEvent.click(getAllByRole("menuItemradio")[0]);

  expect(getByTestId("dseSelectButton")).toHaveTextContent(options[0].label);
});

test("snapshot of the selected option state", () => {
  const { getAllByRole, getByTestId, asFragment } = render(
    <Select options={options} />
  );

  fireEvent.click(getByTestId("dseSelectButton"));

  fireEvent.click(getAllByRole("menuItemradio")[0]);

  expect(asFragment()).toMatchSnapshot(); // snapshot of the selected option state.
});

test("snapshot of the base state", () => {
  const { asFragment } = render(<Select options={options} />);

  expect(asFragment()).toMatchSnapshot();
});

test("snapshot of the options menu open state", () => {
  const { getByTestId, asFragment } = render(<Select options={options} />);

  fireEvent.click(getByTestId("dseSelectButton"));

  expect(asFragment()).toMatchSnapshot();
});

test("can customize select label", () => {
  const { getByText } = render(
    <Select options={options} label="THIS IS A CUSTOM LABEL" />
  );

  expect(getByText("THIS IS A CUSTOM LABEL")).toBeInTheDocument();
});
