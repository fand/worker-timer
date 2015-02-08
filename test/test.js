describe("WorkerTimer", function() {
  var timerId;

  afterEach(function() {
    WorkerTimer.clearInterval(timerId);
    WorkerTimer.clearTimeout(timerId);
  });

  it("setInterval(callback: function, delay: number): number", function(done) {
    var passed = 0;

    timerId = WorkerTimer.setInterval(function() {
      passed += 1;
    }, 25);

    assert(typeof timerId === "number", 'timerId is valid number');

    setTimeout(function() {
      assert(passed >= 15, 'callback was called multiple times');
      done();
    }, 500);
  });
  it("clearInterval(timerId: number): number", function(done) {
    var passed = 0,
      savedPassed = 0;

    timerId = WorkerTimer.setInterval(function() {
      passed += 1;
    }, 25);

    assert(typeof timerId === "number", 'timerId is valid number');

    setTimeout(function() {
      WorkerTimer.clearInterval(timerId);

      savedPassed = passed;

      setTimeout(function() {
        assert(passed === savedPassed, 'timer was stopped by clearInterval');
        done();
      }, 250);
    }, 250);
  });
  it("setTimeout(callback: function, delay: number): number", function(done) {
    var passed = 0;

    timerId = WorkerTimer.setTimeout(function() {
      passed += 1;
    }, 25);

    assert(typeof timerId === "number", 'timerId is valid number');

    setTimeout(function() {
      assert(passed === 1, 'calleback called once');
      done();
    }, 500);
  });
  it("clearTimeout(timerId: number): void", function(done) {
    var passed = 0;

    timerId = WorkerTimer.setTimeout(function() {
      passed += 1;
    }, 25);

    WorkerTimer.clearTimeout(timerId);

    setTimeout(function() {
      assert(passed === 0, 'callback never called');
      done();
    }, 500);
  });

  describe("setTimeout(callback: function, delay: number, timerId: number): number", function() {
    it("creates new timer when timerId is invalid", function(done) {
      var count = 0;

      timerId = WorkerTimer.setTimeout(function() {
        count += 1;
      }, 10, null);

      assert(timerId !== null, 'new timerId returned');
      assert(typeof timerId === "number", 'timerId is valid number');

      setTimeout(function() {
        assert(count === 1, 'callback called once');
        done();
      }, 300);
    });
    it("reuses old timer when the id is given", function(done) {
      var count = 0;

      var oldTimerId = WorkerTimer.setTimeout(function() {
        count += 1;
      }, 10);

      setTimeout(function() {
        var newTimerId = WorkerTimer.setTimeout(function() {
          count += 1;
        }, 10, oldTimerId);

        setTimeout(function() {
          assert(count === 2, 'callback was called for both setTimeout call');
          assert(newTimerId === oldTimerId, 'reusing same timer');
          done();
        }, 100);
      }, 300);
    });
  });

  describe("setInterval(callback: function, delay: number, timerId: number): number", function() {
    it("creates new timer when timerId is invalid", function(done) {
      var count = 0;

      var timerId = WorkerTimer.setInterval(function() {
        count += 1;
      }, 10, null);

      assert(timerId !== null, 'new timerId returned');
      assert(typeof timerId === "number", 'timerId is valid number');

      setTimeout(function() {
        assert(count > 5, 'callback was called multiple times');
        done();
      }, 100);
    });
    it("reusees old timer when the id is given", function(done) {
      var count = 0;
      var count1 = 0;
      var count2 = 0;

      var oldTimerId = WorkerTimer.setInterval(function() {
        count += 1;
        count1 += 1;
      }, 10);

      setTimeout(function() {
        var oldCount = count;

        var newTimerId = WorkerTimer.setInterval(function() {
          count += 1;
          count2 += 1;
        }, 10, oldTimerId);

        setTimeout(function() {
          assert(count > 15, 'callback was called multiple times');
          assert(oldCount === count1, 'old callback was disabled when new callback registered');
          assert(count - count1 === count2, 'valid call counts');
          assert(newTimerId === oldTimerId, 'reusing same timer');
          done();
        }, 100);
      }, 100);
    });
  });

  describe("clearInterval(timerId: number, preserveTimer: boolean): void", function() {
    it("creates new timer when timerId is invalid", function(done) {
      var count = 0;

      var oldTimerId = WorkerTimer.setInterval(function() {
        count += 1;
      }, 100);
      WorkerTimer.clearInterval(oldTimerId, true);

      setTimeout(function() {
        assert(count === 0, 'callback never called');

        var newTimerId = WorkerTimer.setInterval(function () {
          count += 1;
        }, 10, oldTimerId);

        setTimeout(function () {
          assert(count > 5, 'setInterval works even after clearInterval');
          assert(newTimerId === oldTimerId, 'reusing same timer');
          done();
        }, 100);
      }, 100);
    });
  });
});
