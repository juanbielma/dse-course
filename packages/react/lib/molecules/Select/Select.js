import React, { useState, useRef, useEffect } from 'react';
import Text from '../../atoms/Text/Text.js';

// import { Color } from "../../atoms/Color";
const KEY_CODES = {
    ENTER: 13,
    SPACE: 32,
    DOWN_ARROW: 40,
    UP_ARROW: 38,
    ESC: 27,
};
const getNextOptionIndex = (currentIndex, options) => {
    if (currentIndex === null || currentIndex === options.length - 1) {
        return 0;
    }
    return currentIndex + 1;
};
const getPrevOptionIndex = (currentIndex, options) => {
    if (currentIndex === null) {
        return 0;
    }
    if (currentIndex === 0) {
        return options.length - 1;
    }
    return currentIndex - 1;
};
const Select = ({ options = [], label = "Please select an option", onOptionSelected: handler, renderOption, }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [highlightedIndex, setHighlightedIndex] = useState(null);
    const labelRef = useRef(null);
    const [overlayTop, setoverlayTop] = useState(0);
    const [optionRefs, setOptionRefs] = useState([]);
    const onOptionSelected = (option, optionIndex) => {
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
        setOptionRefs(options.map(() => React.createRef()));
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
    const highlightItem = (optionIndex) => {
        setHighlightedIndex(optionIndex);
    };
    const onButtonKeydown = (e) => {
        e.preventDefault();
        if ([
            KEY_CODES.ENTER,
            KEY_CODES.SPACE,
            KEY_CODES.DOWN_ARROW,
            KEY_CODES.UP_ARROW,
        ].includes(e.keyCode)) {
            setIsOpen(true);
            highlightItem(0);
        }
    };
    const onOptionKeyDown = (e) => {
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
            onOptionSelected(options[highlightedIndex], highlightedIndex);
        }
    };
    return (React.createElement("div", { className: "dse-select" },
        React.createElement("button", { "data-testid": "dseSelectButton", onKeyDown: onButtonKeydown, ref: labelRef, className: "dse-select__label", onClick: () => onLabelClick(), "aria-haspopup": "listbox", "aria-expanded": isOpen || undefined, "aria-controls": "dse-select-list" },
            React.createElement(Text, null, selectedOption?.label || label),
            React.createElement("svg", { className: `dse-select__caret ${isOpen ? "dse-select__caret--open" : "dse-select_caret--closed"}`, width: "1rem", height: "1rem", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: "1.5", stroke: "currentColor" },
                React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M19.5 8.25l-7.5 7.5-7.5-7.5" }))),
        React.createElement("ul", { role: "menu", "aria-hidden": !isOpen || undefined, id: "dse-select-list", style: { top: overlayTop }, className: `dse-select__overlay ${isOpen ? "dse-select__overlay--open" : ""}` }, options.map((option, index) => {
            const isSelected = selectedIndex === index;
            const isHighlighted = highlightedIndex === index;
            const ref = optionRefs[index];
            const renderOptionProps = {
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
            return (React.createElement("li", { ...renderOptionProps.getOptionRecommendedProps() },
                React.createElement(Text, null, option.label),
                isSelected && (React.createElement("svg", { width: "1rem", height: "1rem", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-6 h-6" },
                    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M4.5 12.75l6 6 9-13.5" })))));
        }))));
};

export { Select as default };
//# sourceMappingURL=Select.js.map
