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

    assert(typeof timerId === "number");

    setTimeout(function() {
      assert(passed >= 15);
      done();
    }, 500);
  });
  it("clearInterval(timerId: number): number", function(done) {
    var passed = 0,
      savedPassed = 0;

    timerId = WorkerTimer.setInterval(function() {
      passed += 1;
    }, 25);

    assert(typeof timerId === "number");

    setTimeout(function() {
      WorkerTimer.clearInterval(timerId);

      savedPassed = passed;

      setTimeout(function() {
        assert(passed === savedPassed);
        done();
      }, 250);
    }, 250);
  });
  it("setTimeout(callback: function, delay: number): number", function(done) {
    var passed = 0;

    timerId = WorkerTimer.setTimeout(function() {
      passed += 1;
    }, 25);

    assert(typeof timerId === "number");

    setTimeout(function() {
      assert(passed === 1);
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
      assert(passed === 0);
      done();
    }, 500);
  });

  describe("setTimeout(callback: function, delay: number, timerId: number): number", function() {
    it("creates new timer when timerId is invalid", function(done) {
      var passed = 0;

      timerId = WorkerTimer.setTimeout(function() {
        passed += 1;
      }, 10, null);

      assert(timerId !== null);
      assert(typeof timerId === "number");

      setTimeout(function() {
        assert(passed === 1);
        done();
      }, 300);
    });
    it("recycles old timer when the id is given", function(done) {
      var passed = 0;

      var oldTimerId = WorkerTimer.setTimeout(function() {
        passed += 1;
      }, 10);

      setTimeout(function() {
        var newTimerId = WorkerTimer.setTimeout(function() {
          passed += 1;
        }, 10, oldTimerId);

        setTimeout(function() {
          assert(passed === 2);
          assert(newTimerId === oldTimerId);
          done();
        }, 100);
      }, 300);
    });
  });
});
