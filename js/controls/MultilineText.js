/** @jsx React.DOM */
define([
    'underscore', 'react',
    '../ImmutableOptimizations'
], function (_, React, ImmutableOptimizations) {
    'use strict';


    var MultilineText = React.createClass({
        mixins: [ImmutableOptimizations(['onChange'])],

        statics: { fieldClass: function () { return 'formFieldTextarea'; } },

        getDefaultProps: function () {
            return {
                disabled: false,
                readonly: false,
                onChange: function () {},
                isValid: [true, ''],
                noControl: false,
                placeholder: '',
                minLength: undefined,
                maxLength: undefined,
                id: undefined,
                value: undefined
            };
        },

        /* jshint ignore:start */
        render: function () {
            if (this.props.noControl) {
                // Use a <pre> tag because there are newlines in the text that should be preserved.
                return (<pre>{this.props.value}</pre>);
            }
            return (
                <textarea className="k-textbox"
                    value={this.props.value || ''}
                    id={this.props.id}
                    onChange={this.onChange}
                    onBlur={this.props.onBlur}
                    placeholder={this.props.placeholder}
                    readOnly={this.props.readonly}
                    disabled={this.props.disabled} />
            );
        },
        /* jshint ignore:end */

        onChange: function (event) {
            var val = event.target.value;
            if (this.props.maxLength && val.length > this.props.maxLength) {
                return;
            }
            this.props.onChange(val);
        }
    });


    return MultilineText;
});