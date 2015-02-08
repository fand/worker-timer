# worker-timer
[![Build Status](http://img.shields.io/travis/fand/worker-timer.svg?style=flat)](https://travis-ci.org/fand/worker-timer)

> Stable timer API

## diff from original [mohayonao/worker-timer](https://github.com/mohayonao/worker-timer)

In original worker-timer, it creates timer object for each `setTimeout()` `setInterval()` call.
This repository prevents killing timer object and reusing them.
We can also delete timers explicitly via `deleteTimer()`.

## Installation

Use npm:

```
npm install --save fand/worker-timer
```

## API

- `setInterval(callback: function, delay: number, timerId: number): number`
- `clearInterval(timerId: number, preserveTimer: boolean): void`
- `setTimeout(callback: function, delay: number, timerId: number): number`
- `clearTimeout(timerId: number, preserveTimer: boolean): void`
- `deleteTimer(timerId: number): void`

## License

MIT
