'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } //const React = require('react');


function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

var propTypes = {
  thousandSeparator: _react.PropTypes.oneOf([',', '.', true, false]),
  decimalSeparator: _react.PropTypes.oneOf([',', '.', true, false]),
  displayType: _react.PropTypes.oneOf(['input', 'text']),
  prefix: _react.PropTypes.string,
  suffix: _react.PropTypes.string,
  format: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),
  mask: _react.PropTypes.string,
  value: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string])
};

var defaultProps = {
  displayType: 'input',
  decimalSeparator: '.'
};

var NumberFormat = function (_React$Component) {
  _inherits(NumberFormat, _React$Component);

  function NumberFormat(props) {
    _classCallCheck(this, NumberFormat);

    var _this = _possibleConstructorReturn(this, (NumberFormat.__proto__ || Object.getPrototypeOf(NumberFormat)).call(this, props));

    _this.state = {
      value: _this.formatInput(props.value).formattedValue
    };
    _this.onChange = _this.onChange.bind(_this);
    _this.onInput = _this.onInput.bind(_this);
    return _this;
  }

  _createClass(NumberFormat, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(newProps) {
      this.setState({
        value: this.formatInput(newProps.value).formattedValue
      });
    }
  }, {
    key: 'getSeparators',
    value: function getSeparators() {
      var _props = this.props;
      var thousandSeparator = _props.thousandSeparator;
      var decimalSeparator = _props.decimalSeparator;

      if (thousandSeparator === true) {
        thousandSeparator = ',';
      }

      if (decimalSeparator && thousandSeparator) {
        decimalSeparator = thousandSeparator === ',' ? '.' : ',';
      }

      if (decimalSeparator === true) {
        decimalSeparator = '.';
      }

      return {
        decimalSeparator: decimalSeparator,
        thousandSeparator: thousandSeparator
      };
    }
  }, {
    key: 'getNumberRegex',
    value: function getNumberRegex(g) {
      var _getSeparators = this.getSeparators();

      var decimalSeparator = _getSeparators.decimalSeparator;

      return new RegExp('\\d' + (decimalSeparator ? '|' + escapeRegExp(decimalSeparator) : ''), g ? 'g' : undefined);
    }
  }, {
    key: 'setCaretPosition',
    value: function setCaretPosition(caretPos) {
      var el = this.refs.input;
      el.value = el.value;
      // ^ this is used to not only get "focus", but
      // to make sure we don't have it everything -selected-
      // (it causes an issue in chrome, and having it doesn't hurt any other browser)
      if (el !== null) {
        if (el.createTextRange) {
          var range = el.createTextRange();
          range.move('character', caretPos);
          range.select();
          return true;
        }
        // (el.selectionStart === 0 added for Firefox bug)
        if (el.selectionStart || el.selectionStart === 0) {
          el.focus();
          el.setSelectionRange(caretPos, caretPos);
          return true;
        }

        // fail city, fortunately this never happens (as far as I've tested) :)
        el.focus();
        return false;
      }
    }
  }, {
    key: 'formatWithPattern',
    value: function formatWithPattern(str) {
      var _props2 = this.props;
      var format = _props2.format;
      var mask = _props2.mask;

      if (!format) return str;
      var hashCount = format.split('#').length - 1;
      var hashIdx = 0;
      var frmtdStr = format;

      for (var i = 0, ln = str.length; i < ln; i++) {
        if (i < hashCount) {
          hashIdx = frmtdStr.indexOf('#');
          frmtdStr = frmtdStr.replace('#', str[i]);
        }
      }

      var lastIdx = frmtdStr.lastIndexOf('#');

      if (mask) {
        return frmtdStr.replace(/#/g, mask);
      }
      return frmtdStr.substring(0, hashIdx + 1) + (lastIdx !== -1 ? frmtdStr.substring(lastIdx + 1, frmtdStr.length) : '');
    }
  }, {
    key: 'formatInput',
    value: function formatInput(val) {
      var _props3 = this.props;
      var prefix = _props3.prefix;
      var suffix = _props3.suffix;
      var mask = _props3.mask;
      var format = _props3.format;

      var _getSeparators2 = this.getSeparators();

      var thousandSeparator = _getSeparators2.thousandSeparator;
      var decimalSeparator = _getSeparators2.decimalSeparator;

      var maskPattern = format && typeof format == 'string' && !!mask;

      var numRegex = this.getNumberRegex(true);

      if (!val || !(val + '').match(numRegex)) return { value: '', formattedValue: maskPattern ? '' : '' };
      var num = (val + '').match(numRegex).join('');

      var formattedValue = num;

      if (format) {
        if (typeof format == 'string') {
          formattedValue = this.formatWithPattern(formattedValue);
        } else if (typeof format == 'function') {
          formattedValue = format(formattedValue);
        }
      } else {
        var beforeDecimal = formattedValue,
            afterDecimal = '';
        var hasDecimals = formattedValue.indexOf(decimalSeparator) !== -1;
        if (decimalSeparator && hasDecimals) {
          var parts = formattedValue.split(decimalSeparator);
          beforeDecimal = parts[0];
          afterDecimal = parts[1];
        }
        if (thousandSeparator) {
          beforeDecimal = beforeDecimal.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + thousandSeparator);
        }
        //add prefix and suffix
        if (prefix) beforeDecimal = prefix + beforeDecimal;
        if (suffix) afterDecimal = afterDecimal + suffix;

        formattedValue = beforeDecimal + (hasDecimals && decimalSeparator || '') + afterDecimal;
      }

      return {
        value: formattedValue.match(numRegex).join(''),
        formattedValue: formattedValue
      };
    }
  }, {
    key: 'getCursorPosition',
    value: function getCursorPosition(inputValue, formattedValue, cursorPos) {
      var numRegex = this.getNumberRegex();

      var j = 0;
      for (var i = 0; i < cursorPos; i++) {
        if (!inputValue[i].match(numRegex) && inputValue[i] !== formattedValue[j]) continue;
        while (inputValue[i] !== formattedValue[j] && j < formattedValue.length) {
          j++;
        }j++;
      }

      //check if there is no number before caret position
      while (j > 0 && formattedValue[j]) {
        if (!formattedValue[j - 1].match(numRegex)) j--;else break;
      }
      return j;
    }
  }, {
    key: 'onChangeHandler',
    value: function onChangeHandler(e, callback) {
      var _this2 = this;

      e.persist();
      var inputValue = e.target.value + '';

      var _formatInput = this.formatInput(inputValue);

      var formattedValue = _formatInput.formattedValue;
      var value = _formatInput.value;

      var cursorPos = this.refs.input.selectionStart;

      //change the state
      this.setState({ value: formattedValue }, function () {
        cursorPos = _this2.getCursorPosition(inputValue, formattedValue, cursorPos);
        _this2.setCaretPosition(cursorPos);
        if (callback) callback(e, value);
      });

      return value;
    }
  }, {
    key: 'onChange',
    value: function onChange(e) {
      this.onChangeHandler(e, this.props.onChange);
    }
  }, {
    key: 'onInput',
    value: function onInput(e) {
      this.onChangeHandler(e, this.props.onInput);
    }
  }, {
    key: 'render',
    value: function render() {
      var props = _extends({}, this.props);

      Object.keys(propTypes).forEach(function (key) {
        delete props[key];
      });

      if (this.props.displayType === 'text') {
        return _react2.default.createElement(
          'span',
          props,
          this.state.value
        );
      }
      return _react2.default.createElement('input', _extends({}, props, {
        type: 'tel',
        value: this.state.value,
        ref: 'input',
        onInput: this.onChange,
        onChange: this.onChange
      }));
    }
  }]);

  return NumberFormat;
}(_react2.default.Component);

NumberFormat.propTypes = propTypes;
NumberFormat.defaultProps = defaultProps;

module.exports = NumberFormat;
