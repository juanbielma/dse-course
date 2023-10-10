import React, {
  KeyboardEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import { Text } from "../../atoms/Text";
// import { Color } from "../../atoms/Color";

const KEY_CODES = {
  ENTER: 13,
  SPACE: 32,
  DOWN_ARROW: 40,
  UP_ARROW: 38,
  ESC: 27,
};

interface SelectOption {
  label: string;
  value: string;
}

interface RenderOptionProps {
  isSelected: boolean;
  option: SelectOption;
  getOptionRecommendedProps: (overrideProps?: Object) => Object;
}

interface SelectProps {
  onOptionSelected?: (option: SelectOption, optionIndex: number) => void;
  options?: SelectOption[];
  label?: string;
  renderOption?: (props: RenderOptionProps) => React.ReactNode;
}

const getNextOptionIndex = (
  currentIndex: number | null,
  options: SelectOption[]
) => {
  if (currentIndex === null || currentIndex === options.length - 1) {
    return 0;
  }

  return currentIndex + 1;
};

const getPrevOptionIndex = (
  currentIndex: number | null,
  options: SelectOption[]
) => {
  if (currentIndex === null) {
    return 0;
  }
  if (currentIndex === 0) {
    return options.length - 1;
  }

  return currentIndex - 1;
};

const Select: React.FC<SelectProps> = ({
  options = [],
  label = "Please select an option",
  onOptionSelected: handler,
  renderOption,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<null | number>(null);
  const [highlightedIndex, setHighlightedIndex] = useState<null | number>(null);
  const labelRef = useRef<HTMLButtonElement>(null);
  const [overlayTop, setoverlayTop] = useState(0);

  const [optionRefs, setOptionRefs] = useState<
    React.RefObject<HTMLLIElement>[]
  >([]);

  const onOptionSelected = (option: SelectOption, optionIndex: number) => {
    handler && handler(option, optionIndex);

    setSelectedIndex(optionIndex);
    setIsOpen(false);
  };

  const onLabelClick = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    setoverlayTop(labelRef.current?.offsetHeight || 0 + 10);
  }, [labelRef.current?.offsetHeight]);

  useEffect(() => {
    setOptionRefs(options.map(() => React.createRef<HTMLLIElement>()));
  }, [options.length]);

  let selectedOption = null;

  if (selectedIndex !== null) {
    selectedOption = options[selectedIndex];
  }

  useEffect(() => {
    if (highlightedIndex !== null && isOpen) {
      const ref = optionRefs[highlightedIndex];

      if (ref && ref.current) {
        ref.current.focus();
      }
    }
  }, [isOpen, highlightedIndex]);

  const highlightItem = (optionIndex: number | null) => {
    setHighlightedIndex(optionIndex);
  };

  const onButtonKeydown: KeyboardEventHandler = (e) => {
    e.preventDefault();

    if (
      [
        KEY_CODES.ENTER,
        KEY_CODES.SPACE,
        KEY_CODES.DOWN_ARROW,
        KEY_CODES.UP_ARROW,
      ].includes(e.keyCode)
    ) {
      setIsOpen(true);

      highlightItem(0);
    }
  };

  const onOptionKeyDown: KeyboardEventHandler = (e) => {
    if (e.keyCode === KEY_CODES.ESC) {
      setIsOpen(false);
      return;
    }

    if (e.keyCode === KEY_CODES.DOWN_ARROW) {
      highlightItem(getNextOptionIndex(highlightedIndex, options));
    }

    if (e.keyCode === KEY_CODES.UP_ARROW) {
      highlightItem(getPrevOptionIndex(highlightedIndex, options));
    }

    if (e.keyCode === KEY_CODES.ENTER) {
      onOptionSelected(options[highlightedIndex!], highlightedIndex!);
    }
  };

  return (
    <div className="dse-select">
      <button
        data-testid="dseSelectButton"
        onKeyDown={onButtonKeydown}
        ref={labelRef}
        className="dse-select__label"
        onClick={() => onLabelClick()}
        aria-haspopup="listbox"
        aria-expanded={isOpen || undefined}
        aria-controls="dse-select-list"
      >
        <Text>{selectedOption?.label || label}</Text>
        <svg
          className={`dse-select__caret ${
            isOpen ? "dse-select__caret--open" : "dse-select_caret--closed"
          }`}
          width="1rem"
          height="1rem"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          />
        </svg>
      </button>

      <ul
        role="menu"
        aria-hidden={!isOpen || undefined}
        id="dse-select-list"
        style={{ top: overlayTop }}
        className={`dse-select__overlay ${
          isOpen ? "dse-select__overlay--open" : ""
        }`}
      >
        {options.map((option, index) => {
          const isSelected = selectedIndex === index;
          const isHighlighted = highlightedIndex === index;

          const ref = optionRefs[index];

          const renderOptionProps: RenderOptionProps = {
            option,
            isSelected,
            getOptionRecommendedProps: (overrideProps = {}) => ({
              tabIndex: isHighlighted ? -1 : 0,
              className: `dse-select__item 
                ${isSelected ? "dse-select__item--selected" : ""} 
                ${isHighlighted ? "dse-select__item--highlighted" : ""}`,
              onClick: () => onOptionSelected(option, index),
              key: option.value,
              ref: ref,
              onMouseEnter: () => highlightItem(index),
              onMouseLeave: () => highlightItem(null),
              onKeyDown: onOptionKeyDown,
              "arian-checked": isSelected || undefined,
              role: "menuItemradio",
              "aria-label": option.label,
              ...overrideProps,
            }),
          };

          if (renderOption) {
            return renderOption(renderOptionProps);
          }

          return (
            <li {...renderOptionProps.getOptionRecommendedProps()}>
              <Text>{option.label}</Text>
              {isSelected && (
                <svg
                  width="1rem"
                  height="1rem"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Select;
