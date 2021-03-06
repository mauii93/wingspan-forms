define([
    'underscore', 'react',
    '../mixins/SelectWidgetMixin',
    '../ImmutableOptimizations'
], function (_, React, SelectWidgetMixin, ImmutableOptimizations) {
    'use strict';

    var PropTypes = React.PropTypes;

    var KendoComboBox = React.createClass({
        mixins: [
            SelectWidgetMixin('kendoComboBox'),
            ImmutableOptimizations(['onChange'])
        ],

        propTypes: {
            id: PropTypes.string,
            value: PropTypes.any,
            onChange: PropTypes.func,
            autoBind: PropTypes.bool,
            dataSource: PropTypes.oneOfType([PropTypes.array.isRequired, PropTypes.object.isRequired]),
            displayField: PropTypes.string,
            valueField: PropTypes.string,
            disabled: PropTypes.bool,
            readonly: PropTypes.bool,
            options: PropTypes.object,
            filter: PropTypes.string,
            placeholder: PropTypes.string,
            template: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
        },

        statics: {
            fieldClass: function () { return 'formFieldCombobox'; }
        },

        getDefaultProps: function () {
            return {
                filter: 'startswith',
                options: {
                    highlightFirst: false
                }
            };
        },

        /*jshint ignore:start */
        render: function () {
            return (this.props.noControl
                ? (<span id={this.props.id}>{this.renderValue()}</span>)
                : (<input id={this.props.id}/>));
        }
        /*jshint ignore:end */
    });

    return KendoComboBox;
});
