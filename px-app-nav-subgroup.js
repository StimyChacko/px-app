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
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import '@polymer/neon-animation/neon-animations.js';
import { NeonAnimationBehavior } from '@polymer/neon-animation/neon-animation-behavior.js';
import { NeonAnimationRunnerBehavior } from '@polymer/neon-animation/neon-animation-runner-behavior.js';
import 'web-animations-js/web-animations-next-lite.min.js';
import './px-app-nav-item.js';
import './css/px-app-nav-subgroup-styles.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
Polymer({
  _template: html`
    <style include="px-app-nav-subgroup-styles"></style>

    <px-app-nav-item id="itemButton" dropdown="" cancel-select="" icon="{{icon}}" label="{{label}}" selected\$="{{selected}}" overflowed\$="{{overflowed}}" collapsed\$="{{collapsed}}" opened\$="{{opened}}" only-show-icon\$="[[onlyShowIcon]]" empty-icon="[[emptyIcon]]">
    </px-app-nav-item>

    <div class="app-nav-subgroup__dropdown" id="groupcontainer">
      <div class="app-nav-subgroup__dropdown__content" id="groupcontent">
        <slot></slot>
      </div>
    </div>
`,

  is: 'px-app-nav-subgroup',

  behaviors: [
    NeonAnimationRunnerBehavior
  ],

  properties: {
    selected: {
      type: Boolean,
      value: false,
      notify: true,
      reflectToAttribute: true
    },

    collapsed: {
      type: Boolean,
      value: false,
      reflectToAttribute: true
    },

    overflowed: {
      type: Boolean,
      value: false,
      reflectToAttribute: true
    },

    /**
     * A reference the object used to create this nav item.
     */
    item: {
      type: Object
    },

    /**
     * The label text for the group's button.
     */
    label: {
      type: String
    },

    /**
     * The icon for the group's button.
     */
    icon: {
      type: String
    },

    emptyIcon: {
      type: Boolean,
      value: false
    },

    /**
     * If `true` the group is expanded so the user can select a subitem.
     */
    opened: {
      type: Boolean,
      observer: '_handleOpenedChanged'
    },

    onlyShowIcon: {
      type: Boolean,
      value: false,
      observer: '_onlyShowIconChanged'
    },

    _reopen: {
      type: Boolean,
      value: false
    },

    animationConfig: {
      type: Array
    }
  },

  listeners: {
    'neon-animation-finish': '_onNeonAnimationFinish'
  },

  attached: function() {
    this.listen(this.$.itemButton, 'tap', '_handleSelfTapped');
    /*
     * Polymer 2.x initializes the properties before the template is created.
     * To use node finding in the animationConfig property, it must be set
     * after the component has been attached and its template has been stamped.
     */
    if (!this.animationConfig) {
      this.animationConfig = {
        'open' : {
          name: 'expand-subgroup-animation',
          node: this.$.groupcontainer,
          endHeightNode: this.$.groupcontent,
          timing: {
            easing: 'ease-in'
          }
        },
        'close' : {
          name: 'contract-subgroup-animation',
          node: this.$.groupcontainer,
          startHeightNode: this.$.groupcontent,
          timing: {
            easing: 'ease-out'
          }
        }
      };
    }
  },

  detached: function() {
    this.unlisten(this.$.itemButton, 'tap', '_handleSelfTapped');
  },

  _toggleGroup() {
    if (this.opened) {
      if (this.item && this.item.opened && !this._handledFirstToggle) {
        // Bug fix for where subgroup closes the first time it is clicked when it
        // should be opened by default.
        this.openGroup(false);
        return;
      }

      this.closeGroup();
    } else {
      this.openGroup();
    }
  },

  openGroup(animated = true) {
    this.opened = true;
    if (animated) this.playAnimation('open');
    else this._onNeonAnimationFinish();

    this._handledFirstToggle = true;
  },

  closeGroup() {
    this.opened = false;
    this.playAnimation('close');
  },

  _onNeonAnimationFinish(evt) {
    if (this.opened) {
      this.$.groupcontainer.style.height = this.$.groupcontent.getBoundingClientRect().height + 'px';
    } else {
      this.$.groupcontainer.style.height = '0px';
    }
  },

  /**
   * When the user clicks on a group, toggle the group's dropdown menu
   * so the user can to select a subitem.
   */
  _handleSelfTapped(evt) {
    this._toggleGroup();
  },

  _handleOpenedChanged() {
      if (this.opened) this.openGroup(false);
      else this.closeGroup();
  },

  _onlyShowIconChanged(newVal, oldVal) {
    if (typeof oldVal !== 'boolean') return;

    if (newVal && !oldVal && this.opened) {
      this.closeGroup();
      this._reopen = true;
      return;
    }
    if (!newVal && oldVal && (this._reopen || this.opened)) {
      this.openGroup(false);
      this._reopen = false;
      return;
    }
  }
});

Polymer({
  is: 'expand-subgroup-animation',
  behaviors: [
    NeonAnimationBehavior
  ],
  configure: function(config) {
    var node = config.node;
    var endHeightNode = config.endHeightNode;
    var height = endHeightNode.getBoundingClientRect().height;
    var timing = Object.assign({}, this.timingFromConfig(config), {
      duration: calculateAnimationDuration(height)
    });
    this._effect = new KeyframeEffect(node, [{
      height: '0px'
    }, {
      height: height + 'px'
    }], timing);
    return this._effect;
  }
});

Polymer({
  is: 'contract-subgroup-animation',
  behaviors: [
    NeonAnimationBehavior
  ],
  configure: function(config) {
    var node = config.node;
    var startHeightNode = config.startHeightNode;
    var height = startHeightNode.getBoundingClientRect().height;
    var timing = Object.assign({}, this.timingFromConfig(config), {
      duration: calculateAnimationDuration(height)
    });
    timing.duration = calculateAnimationDuration(height);
    this._effect = new KeyframeEffect(node, [{
      height: height + 'px'
    }, {
      height: '0px'
    }], timing);
    return this._effect;
  }
});

/**
 * Takes a pixel-based height as a number and returns a duration in milliseconds
 * for the animation to run.
 *
 * @param {Number} height - Pixel-based height, parsed to an integer
 * @return {Number} - Animation duration in milliseconds
 */
function calculateAnimationDuration(height) {
  return (1000 * height) / 800;
}