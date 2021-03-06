"use strict";

var createObjectURL = (window.URL || window.webkitURL || {}).createObjectURL || function(){};

if (!(global === global.window && global.Worker)) {
  module.exports = global;
} else {
  module.exports = (function(undefined) {
    var SetIntervalJS = createObjectURL(
      new Blob([
        "var t=0;onmessage=function(e){clearInterval(t);if(e.data)t=setInterval(function(){postMessage(0)},e.data)}"
      ], { type: "text/javascript" })
    );
    var SetTimeoutJS = createObjectURL(
      new Blob([
        "var t=0;onmessage=function(e){clearTimeout(t);if(e.data)t=setTimeout(function(){postMessage(0)},e.data)}"
      ], { type: "text/javascript" })
    );
    var _timerId = 0;
    var _timers = [];

    var inherits = function(ctor, superCtor) {
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: { value: ctor, enumerable: false, writable: true, configurable: true }
      });
    };

    function WorkerTimer(path) {
      this.worker = new global.Worker(path);
    }
    WorkerTimer.prototype.set = function(callback, delay) {
      this.worker.onmessage = callback;
      this.worker.postMessage(delay);
    };
    WorkerTimer.prototype.clear = function() {
      this.worker.postMessage(0);
    };

    function WorkerInterval() {
      WorkerTimer.call(this, SetIntervalJS);
    }
    inherits(WorkerInterval, WorkerTimer);

    function WorkerTimeout() {
      WorkerTimer.call(this, SetTimeoutJS);
    }
    inherits(WorkerTimeout, WorkerTimer);

    return {
      setInterval: function(callback, delay, timerId) {
        if (timerId !== undefined && _timers[timerId]) {
          _timers[timerId].set(callback, delay);
          return timerId;
        }
        else {
          var timer = new WorkerInterval();

          timer.set(callback, delay);

          _timerId += 1;
          _timers[_timerId] = timer;

          return _timerId;
        }
      },
      setTimeout: function(callback, delay, timerId) {
        if (timerId !== undefined && _timers[timerId]) {
          _timers[timerId].set(callback, delay);
          return timerId;
        }
        else {
          var timer = new WorkerTimeout();

          timer.set(callback, delay);

          _timerId += 1;
          _timers[_timerId] = timer;

          return _timerId;
        }
      },
      clearInterval: function(timerId, preserveTimer) {
        if (_timers[timerId] instanceof WorkerInterval) {
          _timers[timerId].clear();
          if (!preserveTimer) { delete _timers[timerId]; }
        }
      },
      clearTimeout: function(timerId, preserveTimer) {
        if (_timers[timerId] instanceof WorkerTimeout) {
          _timers[timerId].clear();
          if (!preserveTimer) { delete _timers[timerId]; }
        }
      },
      deleteTimer: function(timerId) {
        if (timerId !== undefined && _timers[timerId]) {
          if (_timers[timerId] instanceof WorkerTimeout) {
            this.clearTimeout(timerId);
          }
          else {
            this.clearInterval(timerId);
          }
          delete _timers[timerId];
        }
      }
    };
  })();
}
