/*
Copyright (c) 2018, General Electric

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
/* Common imports */
/* Common demo imports */
/* Imports for this componnent */
/* Demo DOM module */
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import 'px-demo/px-demo-header.js';
import 'px-demo/px-demo-api-viewer.js';
import 'px-demo/px-demo-footer.js';
import 'px-demo/px-demo-configs.js';
import 'px-demo/px-demo-props.js';
import 'px-demo/px-demo-code-editor.js';
import 'px-demo/px-demo-interactive.js';
import 'px-demo/px-demo-component-snippet.js';
import '../px-app-nav.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
Polymer({
  _template: html`
    <style>
      #wrapper {
        position: relative;
      }

      px-app-nav {
        z-index: 10;
      }

      px-app-nav[vertical] {
        position: absolute;
        top: 0;
        left: 0;
      }
    </style>

    <!-- Header -->
    <px-demo-header module-name="px-app-nav" description="The side navigation is the highest level of navigation, for navigating between major sections of the application.
            Navigation items can be nested, with sub-items. Each major navigation item should have a unique and descriptive icon." mobile="" tablet="" desktop="">
    </px-demo-header>

    <!-- Interactive -->
    <px-demo-interactive>
      <!-- Configs -->
      <px-demo-configs slot="px-demo-configs" configs="[[configs]]" props="{{props}}" chosen-config="{{chosenConfig}}"></px-demo-configs>

      <!-- Props -->
      <px-demo-props slot="px-demo-props" props="{{props}}" config="[[chosenConfig]]"></px-demo-props>

      <!-- Code Editor -->
      <px-demo-code-editor slot="px-demo-code-editor" props="{{props}}"></px-demo-code-editor>

      <!-- Component ---------------------------------------------------------->
      <px-demo-component slot="px-demo-component" id="demoComponent" style="width:100%; height:500px; position:relative; display:block;">
        <px-app-nav id="appNav" items="[[props.items.value]]" vertical="[[props.vertical.value]]" vertical-opened="{{verticalOpened.value}}" vertical-opened-at="[[props.verticalOpenedAt.value]]" collapse-with-icon="[[props.collapseWithIcon.value]]" collapse-all="[[props.collapseAll.value]]" collapse-at="[[props.collapseAt.value]]" selected-meta="{{props.selectedMeta.value}}" selected="{{selected}}" selected-route="{{props.selectedRoute.value}}">
        </px-app-nav>

        <div id="wrapper">
          <h4>Selected property is:</h4>
          <p>[[_returnJson(selected)]]</p>
        </div>
    </px-demo-component>
<!-- END Component ------------------------------------------------------>

<px-demo-component-snippet slot="px-demo-component-snippet" element-properties="{{props}}" element-name="px-app-nav">
</px-demo-component-snippet>
</px-demo-interactive>

<!-- API Viewer -->
<px-demo-api-viewer source="px-app-nav"></px-demo-api-viewer>

<!-- Footer -->
<px-demo-footer></px-demo-footer>
`,

  is: 'px-app-nav-demo',

  properties: {

    /**
     * Note: The actual data/values for `props` are placed in `this.demoProps`
     * to create a static reference that Polymer shouldn't overwrite.
     *
     * On object containing all the properties the user can configure for this
     * demo. Usually a pretty similar copy of the component's `properties` block
     * with some additional sugar added to describe what kind of input the
     * user will be shown and how that input should be configured.
     *
     * Note that `value` for each property is the default that will be set
     * unless a config from `configs` is applied by default.
     *
     *
     * @property demoProps
     * @type {Object}
     */
    props: {
      type: Object,
      value: function () { return this.demoProps; }
    },

    /**
     * An array of pre-configured `props` that can be used to provide the user
     * with a set of common examples. These configs will be made available
     * as a set of tabs the user can click that will automatically change
     * the `props` to specific values.
     *
     * @property demoProps
     * @type {Array}
     */
    configs: {
      type: Array,
      value: function () {
        return [
          {
            configName: "Horizontal",
            configReset: true,
            configHideProps: ['vertical', 'verticalOpenedAt']
          }, {
            configName: "Vertical",
            vertical: true,
            configReset: true,
            configHideProps: ['verticalOpenedAt']
          }, {
            configName: "Vertical Opened At",
            vertical: true,
            verticalOpenedAt: 800,
            configReset: true
          }, {
            configName: "Collapsed All",
            collapseAll: true,
            configReset: true,
            configHideProps: ['vertical', 'verticalOpenedAt']
          }, {
            configName: "Collapsed At",
            collapseAll: null,
            collapseAt: 500,
            configReset: true,
            configHideProps: ['vertical', 'verticalOpenedAt']
          }
        ]
      }
    }
  },

  /**
   * A reference for `this.props`. Read the documentation there.
   */
  demoProps: {
    items: {
      type: Array,
      defaultValue: [
        { "label" : "Home",   "id" : "home",   "icon" : "px-fea:home" },
        { "label" : "Alerts", "id" : "alerts", "icon" : "px-fea:alerts",
          "metadata" : { "openCases" : "12", "closedCases" : "82" }
        },
        { "label" : "Assets", "id" : "assets", "icon" : "px-fea:asset", "children": [
          { "label" : "Asset #1", "id" : "a1" },
          { "label" : "Asset #2", "id" : "a2" }
        ] },
        { "label" : "Dashboards", "id" : "dashboards", "icon" : "px-fea:dashboard", "children": [
          { "label" : "See Live Truck View", "id" : "trucks", "icon" : "px-obj:truck" },
          { "label" : "Track Orders", "id" : "orders", "icon" : "px-fea:orders" },
          { "label" : "Analyze Invoices", "id" : "invoices", "icon" : "px-fea:templates" }
        ]}
      ],
      inputType: 'code:JSON'
    },
    vertical: {
      type: Boolean,
      defaultValue: false,
      inputType: 'toggle',
      // This is required to hide a property for the default config. It is visible for the relevant demos.
      _visibleForConfig: false
    },
    verticalOpenedAt: {
      type: Number,
      defaultValue: false,
      inputType: 'number',
      inputHelpText: 'vertical must be true in order for verticalOpenedAt to work',
      // This is required to hide a property for the default config. It is visible for the relevant demos.
      _visibleForConfig: false
    },
    collapseWithIcon: {
      type: Boolean,
      defaultValue: false,
      inputType: 'toggle'
    },
    collapseAll: {
      type: Boolean,
      defaultValue: false,
      inputType: 'toggle'
    },
    collapseAt: {
      type: Number,
      defaultValue: false,
      inputType: 'number',
      inputHelpText: 'collapseAll must be null for collapseAt to work'
    },
    selectedRoute: {
      type: Array,
      defaultValue: ['home'],
      inputType: 'code:JSON'
    },
    selectedMeta: {
      type: Object,
      defaultValue: {},
      inputType: 'code:JSON',
      inputHelpText: "Read Only"
    }
  },

  verticalOpened: {
    type: Boolean,
    value: false
  },

  observers: [ '_returnPos(props.vertical.value, verticalOpened.value)' ],

  listeners: {
    'firstItem': 'firstItemFunction',
    'subitemTwo': 'subitemTwoFunction'
  },

  attached: function() {
    var div = this.$.demoComponent,
        nav = this.$.appNav;
    nav.set('fitInto', div);

    window.requestAnimationFrame(function() {
      nav.notifyResize();
    });
  },

  firstItemFunction: function(e) {
    console.log("Event 'firstItem' attached to a nav item via the 'eventName' prop was fired");
  },

  subitemTwoFunction: function(e) {
    console.log("Event 'subitemTwo' attached to a nav item via the 'eventName' prop was fired.");
  },

  _returnJson: function(json) {
    return JSON.stringify(json);
  },

  _returnPos: function(vertical, verticalOpened) {
    var div = this.$$('#wrapper');
    if(vertical) {
      div.style.top = '10px';
      div.style.left = verticalOpened ? '380px' : '90px';
    } else {
      div.style.top = '20px';
      div.style.left = '10px';
    }
  }
});