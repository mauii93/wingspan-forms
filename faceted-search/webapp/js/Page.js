/** @jsx React.DOM */
define([
    'underscore', 'react', 'jquery', 'kendo', 'wingspan-forms',
    'FacetDataStore',
    'MockDatabaseTransport',
    'text!textassets/types/Contact.json',
    'underscore-string'
], function (_, React, $, kendo, Forms, FacetDataStore, MockDatabaseTransport, ContactModel) {
    'use strict';

    var ContactModel = JSON.parse(ContactModel).data;


    var App = React.createClass({
        mixins: [Forms.TopStateMixin],

        getInitialState: function () {
            return {
                filters: _.object(_.map(_.keys(ContactModel.properties), function (field) { return [field, []]; })),
                facets: {}
            };
        },

        componentWillMount: function () {
            this.columns = [
                { title: ContactModel.properties['firstName'].label, width: '20%', template: '#: firstName #' },
                { title: ContactModel.properties['lastName'].label, width: '20%', template: '#: lastName #' },
                { title: ContactModel.properties['contactGroup'].label, width: '15%', template: '#: contactGroup #' },
                //{ template: '#: phoneNumber #' },
                { title: ContactModel.properties['email'].label, template: '#: email #' }
            ];
            this.dataSource = new FacetDataStore({ transport: new MockDatabaseTransport() });
            this.dataSource.read(this.state.filters).then(this.updateFacets).done();
        },

        componentWillUpdate: function (nextProps, nextState) {
            // if our filter state changed, we need to query for the facets
            if (!_.isEqual(this.state.filters, nextState.filters)) {
                this.dataSource.read(this.state.filters).then(this.updateFacets).done();
            }
        },

        updateFacets: function () {
            this.setState({ facets: this.dataSource.facets });
        },

        onFilterToggle: function (facet/*contactGroup*/, value/*work*/, isActive/*true*/) {
            var currentFiltersForField = this.state.filters[facet];
            var nextFiltersForField = (isActive ? _.union :_.difference)(currentFiltersForField, [value]);
            this.onChange('filters', facet, nextFiltersForField);
        },

        render: function () {

            var facetControls = _.map(this.state.facets, function (countsByVal/*work:6*/, facet/*contactGroup*/) {
                var checkboxes = _.map(countsByVal, function (count, val) {
                    return (
                        <div className="facetFilterControl" key={_.str.sprintf('%s-%s', facet, val)}>
                            <CheckBox label={val} id={val} value={_.contains(this.state.filters[facet], val)}
                                onChange={_.partial(this.onFilterToggle, facet, val)}/>
                            <span className="count">{count}</span>
                        </div>
                    );
                }.bind(this));
                return (
                    <FormField key={facet} fieldInfo={_.object([['label', ContactModel.properties[facet].label]])}>
                        {checkboxes}
                    </FormField>
                );
            }.bind(this));

            return (
                <div className="App">
                    <div>
                        <div className="facets">
                            <div>{facetControls}</div>
                        </div>
                        <KendoGrid className="KendoGrid" dataSource={this.dataSource} columns={this.columns} height="600"/>
                    </div>
                    <pre>{JSON.stringify(this.state, undefined, 2)}</pre>
                </div>
            );
        }
    });


    function entrypoint(rootElement) {
        React.renderComponent(<App />, rootElement);
    }


    var FormField = Forms.FormField;
    var KendoText = Forms.KendoText;
    var MultilineText = Forms.MultilineText;
    var MultiSelect = Forms.MultiSelect;
    var KendoComboBox = Forms.KendoComboBox;
    var KendoNumber = Forms.KendoNumber;
    var KendoDate = Forms.KendoDate;
    var KendoDatetime = Forms.KendoDatetime;
    var CheckBox = Forms.CheckBox;
    var Radio = Forms.Radio;
    var RadioGroup = Forms.RadioGroup;
    var SwitchBox = Forms.SwitchBox;
    var Carousel = Forms.Carousel;
    var KendoGrid = Forms.KendoGrid;


    return {
        entrypoint: entrypoint
    };
});
