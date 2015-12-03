'use strict'

const $ = require('jquery');
const uuid = require('uuid');
const PSHub = require('./PubSubHub');
const assert = require('./assert');

// for covenience
const keyEvents = {
  ENTER: 13,
  ESC: 27,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40
};

class BaseComponent {
  constructor(el, opts = {}) {
    assert(el);

    // find element in the client DOM, or...
    if (!opts.parentElement) {
      this.$el = $(el);
    } else {
      this.$el = opts.parentElement.find(el);
    }

    // ...when DOM aint there,
    // just do it in memory, to support server-side rendering
    if (this.$el.size() === 0) {
      this.$el = $('<div></div>');
    }

    if (!opts.preserveChildElements) {
      this.$el.html('');
    }

    Object.assign(this, {
      keyEvents,
      attrs: opts.attrs || {},
      id: uuid.v4(),
      value: null
    });

    return this;
  }

  render() {
    throw new Error('BaseComponent::render must be defined by child');
  }

  get() {
    return this.value;
  }

  set(v) {
    this.value = v;
    this.publish(this.get());
    return this.render();
  }

  subscribe(listener) {
    PSHub.subscribe(this.id, listener);
    return this;
  }

  publish(msg) {
    PSHub.publish(this.id, msg);
  }
};

module.exports = BaseComponent;
