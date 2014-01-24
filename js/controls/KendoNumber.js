/** @jsx React.DOM */
define([
    'underscore', 'jquery', 'react', 'kendo',
    '../util/debug',
    '../ControlCommon'
], function (_, $, React, kendo, debug, ControlCommon) {
    'use strict';


    var KendoNumber = React.createClass({

        fieldClass: 'formFieldNumeric',
        wasRecentlyChanged: false,

        getDefaultProps: function () {
            return {
                value: undefined,
                onChange: function () {},
                id: undefined,

                placeholder: '',
                decimals: undefined,

                disabled: false,
                isValid: [true, ''],
                readonly: false,
                noControl: false
            };
        },

        componentWillMount: function () {
            this.format = 'n' + (this.props.decimals || 0);
        },

        /*jshint ignore:start */
        render: function () {
            return (this.props.noControl
                ? (<span>{kendo.toString(this.props.value, this.format)}</span>)
                // KendoNumeric requires multiple onChange handlers, because kendo change event doesn't happen
                // until blur. We need an event on each keyup on the input, as well as spin events on the widget.
                : (<input id={this.props.id} type="text" onChange={this.onInputChange} />));
        },
        /*jshint ignore:end */

        componentDidMount: function (rootNode) {
            var $el = $(rootNode);
            debug.verify($el);

            if (this.props.noControl) {
                // Everything was done in JSX.
                return;
            }

            $el.kendoNumericTextBox({
                format: this.format,
                min: this.props.min,
                max: this.props.max,
                // No change event - we get change events from the underlying react <input>,
                // because react gives us an onChange for each keystroke which is needed for flux
                spin: this.onSpinChange
            });

            ControlCommon.setKendoNumberState(
                $el.data('kendoNumericTextBox'),
                this.props.value, this.props.disabled, this.props.readonly);
        },

        componentDidUpdate: function (prevProps, prevState, rootNode) {
            var $el = $(rootNode);
            debug.verify($el);

            if (this.props.noControl) {
                // Everything was done in JSX.
                return;
            }

            ControlCommon.setKendoNumberState(
                $el.data('kendoNumericTextBox'),
                this.props.value, this.props.disabled, this.props.readonly);

            if (this.wasRecentlyChanged) {
                // Holy Crap I hate kendo - the text box and the spinner are two separate inputs that kendo wraps in a
                // span, and they take turns being visible - if you're typing it's one of the inputs, and if you click
                // the spinner it's the other . . .  so if the input you type into recently changed, we find the first
                // visible child input of the root node's parent span, and give focus back to it
                $el.parent().find('input:first:visible').focus();
                this.wasRecentlyChanged = false;
            }
        },

        onSpinChange: function (event) {
            var val = event.sender.value();
            this.props.onChange(val);
        },

        onInputChange: function (event) {
            if (this.props.readonly) {
                return;
            }
            var val = event.target.value;
            this.props.onChange(val);
            this.wasRecentlyChanged = true;
        }
    });

    return KendoNumber;

});