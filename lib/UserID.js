(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("UserID", [], factory);
	else if(typeof exports === 'object')
		exports["UserID"] = factory();
	else
		root["UserID"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(9);


/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/*!
	 * The buffer module from node.js, for the browser.
	 *
	 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
	 * @license  MIT
	 */
	/* eslint-disable no-proto */
	
	'use strict'
	
	var base64 = __webpack_require__(5)
	var ieee754 = __webpack_require__(6)
	var isArray = __webpack_require__(7)
	
	exports.Buffer = Buffer
	exports.SlowBuffer = SlowBuffer
	exports.INSPECT_MAX_BYTES = 50
	
	/**
	 * If `Buffer.TYPED_ARRAY_SUPPORT`:
	 *   === true    Use Uint8Array implementation (fastest)
	 *   === false   Use Object implementation (most compatible, even IE6)
	 *
	 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
	 * Opera 11.6+, iOS 4.2+.
	 *
	 * Due to various browser bugs, sometimes the Object implementation will be used even
	 * when the browser supports typed arrays.
	 *
	 * Note:
	 *
	 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
	 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
	 *
	 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
	 *
	 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
	 *     incorrect length in some situations.
	
	 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
	 * get the Object implementation, which is slower but behaves correctly.
	 */
	Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
	  ? global.TYPED_ARRAY_SUPPORT
	  : typedArraySupport()
	
	/*
	 * Export kMaxLength after typed array support is determined.
	 */
	exports.kMaxLength = kMaxLength()
	
	function typedArraySupport () {
	  try {
	    var arr = new Uint8Array(1)
	    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
	    return arr.foo() === 42 && // typed array instances can be augmented
	        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
	        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
	  } catch (e) {
	    return false
	  }
	}
	
	function kMaxLength () {
	  return Buffer.TYPED_ARRAY_SUPPORT
	    ? 0x7fffffff
	    : 0x3fffffff
	}
	
	function createBuffer (that, length) {
	  if (kMaxLength() < length) {
	    throw new RangeError('Invalid typed array length')
	  }
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    that = new Uint8Array(length)
	    that.__proto__ = Buffer.prototype
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    if (that === null) {
	      that = new Buffer(length)
	    }
	    that.length = length
	  }
	
	  return that
	}
	
	/**
	 * The Buffer constructor returns instances of `Uint8Array` that have their
	 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
	 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
	 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
	 * returns a single octet.
	 *
	 * The `Uint8Array` prototype remains unmodified.
	 */
	
	function Buffer (arg, encodingOrOffset, length) {
	  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
	    return new Buffer(arg, encodingOrOffset, length)
	  }
	
	  // Common case.
	  if (typeof arg === 'number') {
	    if (typeof encodingOrOffset === 'string') {
	      throw new Error(
	        'If encoding is specified then the first argument must be a string'
	      )
	    }
	    return allocUnsafe(this, arg)
	  }
	  return from(this, arg, encodingOrOffset, length)
	}
	
	Buffer.poolSize = 8192 // not used by this implementation
	
	// TODO: Legacy, not needed anymore. Remove in next major version.
	Buffer._augment = function (arr) {
	  arr.__proto__ = Buffer.prototype
	  return arr
	}
	
	function from (that, value, encodingOrOffset, length) {
	  if (typeof value === 'number') {
	    throw new TypeError('"value" argument must not be a number')
	  }
	
	  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
	    return fromArrayBuffer(that, value, encodingOrOffset, length)
	  }
	
	  if (typeof value === 'string') {
	    return fromString(that, value, encodingOrOffset)
	  }
	
	  return fromObject(that, value)
	}
	
	/**
	 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
	 * if value is a number.
	 * Buffer.from(str[, encoding])
	 * Buffer.from(array)
	 * Buffer.from(buffer)
	 * Buffer.from(arrayBuffer[, byteOffset[, length]])
	 **/
	Buffer.from = function (value, encodingOrOffset, length) {
	  return from(null, value, encodingOrOffset, length)
	}
	
	if (Buffer.TYPED_ARRAY_SUPPORT) {
	  Buffer.prototype.__proto__ = Uint8Array.prototype
	  Buffer.__proto__ = Uint8Array
	  if (typeof Symbol !== 'undefined' && Symbol.species &&
	      Buffer[Symbol.species] === Buffer) {
	    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
	    Object.defineProperty(Buffer, Symbol.species, {
	      value: null,
	      configurable: true
	    })
	  }
	}
	
	function assertSize (size) {
	  if (typeof size !== 'number') {
	    throw new TypeError('"size" argument must be a number')
	  } else if (size < 0) {
	    throw new RangeError('"size" argument must not be negative')
	  }
	}
	
	function alloc (that, size, fill, encoding) {
	  assertSize(size)
	  if (size <= 0) {
	    return createBuffer(that, size)
	  }
	  if (fill !== undefined) {
	    // Only pay attention to encoding if it's a string. This
	    // prevents accidentally sending in a number that would
	    // be interpretted as a start offset.
	    return typeof encoding === 'string'
	      ? createBuffer(that, size).fill(fill, encoding)
	      : createBuffer(that, size).fill(fill)
	  }
	  return createBuffer(that, size)
	}
	
	/**
	 * Creates a new filled Buffer instance.
	 * alloc(size[, fill[, encoding]])
	 **/
	Buffer.alloc = function (size, fill, encoding) {
	  return alloc(null, size, fill, encoding)
	}
	
	function allocUnsafe (that, size) {
	  assertSize(size)
	  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) {
	    for (var i = 0; i < size; ++i) {
	      that[i] = 0
	    }
	  }
	  return that
	}
	
	/**
	 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
	 * */
	Buffer.allocUnsafe = function (size) {
	  return allocUnsafe(null, size)
	}
	/**
	 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
	 */
	Buffer.allocUnsafeSlow = function (size) {
	  return allocUnsafe(null, size)
	}
	
	function fromString (that, string, encoding) {
	  if (typeof encoding !== 'string' || encoding === '') {
	    encoding = 'utf8'
	  }
	
	  if (!Buffer.isEncoding(encoding)) {
	    throw new TypeError('"encoding" must be a valid string encoding')
	  }
	
	  var length = byteLength(string, encoding) | 0
	  that = createBuffer(that, length)
	
	  var actual = that.write(string, encoding)
	
	  if (actual !== length) {
	    // Writing a hex string, for example, that contains invalid characters will
	    // cause everything after the first invalid character to be ignored. (e.g.
	    // 'abxxcd' will be treated as 'ab')
	    that = that.slice(0, actual)
	  }
	
	  return that
	}
	
	function fromArrayLike (that, array) {
	  var length = array.length < 0 ? 0 : checked(array.length) | 0
	  that = createBuffer(that, length)
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}
	
	function fromArrayBuffer (that, array, byteOffset, length) {
	  array.byteLength // this throws if `array` is not a valid ArrayBuffer
	
	  if (byteOffset < 0 || array.byteLength < byteOffset) {
	    throw new RangeError('\'offset\' is out of bounds')
	  }
	
	  if (array.byteLength < byteOffset + (length || 0)) {
	    throw new RangeError('\'length\' is out of bounds')
	  }
	
	  if (byteOffset === undefined && length === undefined) {
	    array = new Uint8Array(array)
	  } else if (length === undefined) {
	    array = new Uint8Array(array, byteOffset)
	  } else {
	    array = new Uint8Array(array, byteOffset, length)
	  }
	
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    that = array
	    that.__proto__ = Buffer.prototype
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    that = fromArrayLike(that, array)
	  }
	  return that
	}
	
	function fromObject (that, obj) {
	  if (Buffer.isBuffer(obj)) {
	    var len = checked(obj.length) | 0
	    that = createBuffer(that, len)
	
	    if (that.length === 0) {
	      return that
	    }
	
	    obj.copy(that, 0, 0, len)
	    return that
	  }
	
	  if (obj) {
	    if ((typeof ArrayBuffer !== 'undefined' &&
	        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
	      if (typeof obj.length !== 'number' || isnan(obj.length)) {
	        return createBuffer(that, 0)
	      }
	      return fromArrayLike(that, obj)
	    }
	
	    if (obj.type === 'Buffer' && isArray(obj.data)) {
	      return fromArrayLike(that, obj.data)
	    }
	  }
	
	  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
	}
	
	function checked (length) {
	  // Note: cannot use `length < kMaxLength()` here because that fails when
	  // length is NaN (which is otherwise coerced to zero.)
	  if (length >= kMaxLength()) {
	    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
	                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
	  }
	  return length | 0
	}
	
	function SlowBuffer (length) {
	  if (+length != length) { // eslint-disable-line eqeqeq
	    length = 0
	  }
	  return Buffer.alloc(+length)
	}
	
	Buffer.isBuffer = function isBuffer (b) {
	  return !!(b != null && b._isBuffer)
	}
	
	Buffer.compare = function compare (a, b) {
	  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
	    throw new TypeError('Arguments must be Buffers')
	  }
	
	  if (a === b) return 0
	
	  var x = a.length
	  var y = b.length
	
	  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
	    if (a[i] !== b[i]) {
	      x = a[i]
	      y = b[i]
	      break
	    }
	  }
	
	  if (x < y) return -1
	  if (y < x) return 1
	  return 0
	}
	
	Buffer.isEncoding = function isEncoding (encoding) {
	  switch (String(encoding).toLowerCase()) {
	    case 'hex':
	    case 'utf8':
	    case 'utf-8':
	    case 'ascii':
	    case 'latin1':
	    case 'binary':
	    case 'base64':
	    case 'ucs2':
	    case 'ucs-2':
	    case 'utf16le':
	    case 'utf-16le':
	      return true
	    default:
	      return false
	  }
	}
	
	Buffer.concat = function concat (list, length) {
	  if (!isArray(list)) {
	    throw new TypeError('"list" argument must be an Array of Buffers')
	  }
	
	  if (list.length === 0) {
	    return Buffer.alloc(0)
	  }
	
	  var i
	  if (length === undefined) {
	    length = 0
	    for (i = 0; i < list.length; ++i) {
	      length += list[i].length
	    }
	  }
	
	  var buffer = Buffer.allocUnsafe(length)
	  var pos = 0
	  for (i = 0; i < list.length; ++i) {
	    var buf = list[i]
	    if (!Buffer.isBuffer(buf)) {
	      throw new TypeError('"list" argument must be an Array of Buffers')
	    }
	    buf.copy(buffer, pos)
	    pos += buf.length
	  }
	  return buffer
	}
	
	function byteLength (string, encoding) {
	  if (Buffer.isBuffer(string)) {
	    return string.length
	  }
	  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
	      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
	    return string.byteLength
	  }
	  if (typeof string !== 'string') {
	    string = '' + string
	  }
	
	  var len = string.length
	  if (len === 0) return 0
	
	  // Use a for loop to avoid recursion
	  var loweredCase = false
	  for (;;) {
	    switch (encoding) {
	      case 'ascii':
	      case 'latin1':
	      case 'binary':
	        return len
	      case 'utf8':
	      case 'utf-8':
	      case undefined:
	        return utf8ToBytes(string).length
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return len * 2
	      case 'hex':
	        return len >>> 1
	      case 'base64':
	        return base64ToBytes(string).length
	      default:
	        if (loweredCase) return utf8ToBytes(string).length // assume utf8
	        encoding = ('' + encoding).toLowerCase()
	        loweredCase = true
	    }
	  }
	}
	Buffer.byteLength = byteLength
	
	function slowToString (encoding, start, end) {
	  var loweredCase = false
	
	  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
	  // property of a typed array.
	
	  // This behaves neither like String nor Uint8Array in that we set start/end
	  // to their upper/lower bounds if the value passed is out of range.
	  // undefined is handled specially as per ECMA-262 6th Edition,
	  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
	  if (start === undefined || start < 0) {
	    start = 0
	  }
	  // Return early if start > this.length. Done here to prevent potential uint32
	  // coercion fail below.
	  if (start > this.length) {
	    return ''
	  }
	
	  if (end === undefined || end > this.length) {
	    end = this.length
	  }
	
	  if (end <= 0) {
	    return ''
	  }
	
	  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
	  end >>>= 0
	  start >>>= 0
	
	  if (end <= start) {
	    return ''
	  }
	
	  if (!encoding) encoding = 'utf8'
	
	  while (true) {
	    switch (encoding) {
	      case 'hex':
	        return hexSlice(this, start, end)
	
	      case 'utf8':
	      case 'utf-8':
	        return utf8Slice(this, start, end)
	
	      case 'ascii':
	        return asciiSlice(this, start, end)
	
	      case 'latin1':
	      case 'binary':
	        return latin1Slice(this, start, end)
	
	      case 'base64':
	        return base64Slice(this, start, end)
	
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return utf16leSlice(this, start, end)
	
	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = (encoding + '').toLowerCase()
	        loweredCase = true
	    }
	  }
	}
	
	// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
	// Buffer instances.
	Buffer.prototype._isBuffer = true
	
	function swap (b, n, m) {
	  var i = b[n]
	  b[n] = b[m]
	  b[m] = i
	}
	
	Buffer.prototype.swap16 = function swap16 () {
	  var len = this.length
	  if (len % 2 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 16-bits')
	  }
	  for (var i = 0; i < len; i += 2) {
	    swap(this, i, i + 1)
	  }
	  return this
	}
	
	Buffer.prototype.swap32 = function swap32 () {
	  var len = this.length
	  if (len % 4 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 32-bits')
	  }
	  for (var i = 0; i < len; i += 4) {
	    swap(this, i, i + 3)
	    swap(this, i + 1, i + 2)
	  }
	  return this
	}
	
	Buffer.prototype.swap64 = function swap64 () {
	  var len = this.length
	  if (len % 8 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 64-bits')
	  }
	  for (var i = 0; i < len; i += 8) {
	    swap(this, i, i + 7)
	    swap(this, i + 1, i + 6)
	    swap(this, i + 2, i + 5)
	    swap(this, i + 3, i + 4)
	  }
	  return this
	}
	
	Buffer.prototype.toString = function toString () {
	  var length = this.length | 0
	  if (length === 0) return ''
	  if (arguments.length === 0) return utf8Slice(this, 0, length)
	  return slowToString.apply(this, arguments)
	}
	
	Buffer.prototype.equals = function equals (b) {
	  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
	  if (this === b) return true
	  return Buffer.compare(this, b) === 0
	}
	
	Buffer.prototype.inspect = function inspect () {
	  var str = ''
	  var max = exports.INSPECT_MAX_BYTES
	  if (this.length > 0) {
	    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
	    if (this.length > max) str += ' ... '
	  }
	  return '<Buffer ' + str + '>'
	}
	
	Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
	  if (!Buffer.isBuffer(target)) {
	    throw new TypeError('Argument must be a Buffer')
	  }
	
	  if (start === undefined) {
	    start = 0
	  }
	  if (end === undefined) {
	    end = target ? target.length : 0
	  }
	  if (thisStart === undefined) {
	    thisStart = 0
	  }
	  if (thisEnd === undefined) {
	    thisEnd = this.length
	  }
	
	  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
	    throw new RangeError('out of range index')
	  }
	
	  if (thisStart >= thisEnd && start >= end) {
	    return 0
	  }
	  if (thisStart >= thisEnd) {
	    return -1
	  }
	  if (start >= end) {
	    return 1
	  }
	
	  start >>>= 0
	  end >>>= 0
	  thisStart >>>= 0
	  thisEnd >>>= 0
	
	  if (this === target) return 0
	
	  var x = thisEnd - thisStart
	  var y = end - start
	  var len = Math.min(x, y)
	
	  var thisCopy = this.slice(thisStart, thisEnd)
	  var targetCopy = target.slice(start, end)
	
	  for (var i = 0; i < len; ++i) {
	    if (thisCopy[i] !== targetCopy[i]) {
	      x = thisCopy[i]
	      y = targetCopy[i]
	      break
	    }
	  }
	
	  if (x < y) return -1
	  if (y < x) return 1
	  return 0
	}
	
	// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
	// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
	//
	// Arguments:
	// - buffer - a Buffer to search
	// - val - a string, Buffer, or number
	// - byteOffset - an index into `buffer`; will be clamped to an int32
	// - encoding - an optional encoding, relevant is val is a string
	// - dir - true for indexOf, false for lastIndexOf
	function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
	  // Empty buffer means no match
	  if (buffer.length === 0) return -1
	
	  // Normalize byteOffset
	  if (typeof byteOffset === 'string') {
	    encoding = byteOffset
	    byteOffset = 0
	  } else if (byteOffset > 0x7fffffff) {
	    byteOffset = 0x7fffffff
	  } else if (byteOffset < -0x80000000) {
	    byteOffset = -0x80000000
	  }
	  byteOffset = +byteOffset  // Coerce to Number.
	  if (isNaN(byteOffset)) {
	    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
	    byteOffset = dir ? 0 : (buffer.length - 1)
	  }
	
	  // Normalize byteOffset: negative offsets start from the end of the buffer
	  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
	  if (byteOffset >= buffer.length) {
	    if (dir) return -1
	    else byteOffset = buffer.length - 1
	  } else if (byteOffset < 0) {
	    if (dir) byteOffset = 0
	    else return -1
	  }
	
	  // Normalize val
	  if (typeof val === 'string') {
	    val = Buffer.from(val, encoding)
	  }
	
	  // Finally, search either indexOf (if dir is true) or lastIndexOf
	  if (Buffer.isBuffer(val)) {
	    // Special case: looking for empty string/buffer always fails
	    if (val.length === 0) {
	      return -1
	    }
	    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
	  } else if (typeof val === 'number') {
	    val = val & 0xFF // Search for a byte value [0-255]
	    if (Buffer.TYPED_ARRAY_SUPPORT &&
	        typeof Uint8Array.prototype.indexOf === 'function') {
	      if (dir) {
	        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
	      } else {
	        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
	      }
	    }
	    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
	  }
	
	  throw new TypeError('val must be string, number or Buffer')
	}
	
	function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
	  var indexSize = 1
	  var arrLength = arr.length
	  var valLength = val.length
	
	  if (encoding !== undefined) {
	    encoding = String(encoding).toLowerCase()
	    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
	        encoding === 'utf16le' || encoding === 'utf-16le') {
	      if (arr.length < 2 || val.length < 2) {
	        return -1
	      }
	      indexSize = 2
	      arrLength /= 2
	      valLength /= 2
	      byteOffset /= 2
	    }
	  }
	
	  function read (buf, i) {
	    if (indexSize === 1) {
	      return buf[i]
	    } else {
	      return buf.readUInt16BE(i * indexSize)
	    }
	  }
	
	  var i
	  if (dir) {
	    var foundIndex = -1
	    for (i = byteOffset; i < arrLength; i++) {
	      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
	        if (foundIndex === -1) foundIndex = i
	        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
	      } else {
	        if (foundIndex !== -1) i -= i - foundIndex
	        foundIndex = -1
	      }
	    }
	  } else {
	    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
	    for (i = byteOffset; i >= 0; i--) {
	      var found = true
	      for (var j = 0; j < valLength; j++) {
	        if (read(arr, i + j) !== read(val, j)) {
	          found = false
	          break
	        }
	      }
	      if (found) return i
	    }
	  }
	
	  return -1
	}
	
	Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
	  return this.indexOf(val, byteOffset, encoding) !== -1
	}
	
	Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
	  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
	}
	
	Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
	  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
	}
	
	function hexWrite (buf, string, offset, length) {
	  offset = Number(offset) || 0
	  var remaining = buf.length - offset
	  if (!length) {
	    length = remaining
	  } else {
	    length = Number(length)
	    if (length > remaining) {
	      length = remaining
	    }
	  }
	
	  // must be an even number of digits
	  var strLen = string.length
	  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')
	
	  if (length > strLen / 2) {
	    length = strLen / 2
	  }
	  for (var i = 0; i < length; ++i) {
	    var parsed = parseInt(string.substr(i * 2, 2), 16)
	    if (isNaN(parsed)) return i
	    buf[offset + i] = parsed
	  }
	  return i
	}
	
	function utf8Write (buf, string, offset, length) {
	  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
	}
	
	function asciiWrite (buf, string, offset, length) {
	  return blitBuffer(asciiToBytes(string), buf, offset, length)
	}
	
	function latin1Write (buf, string, offset, length) {
	  return asciiWrite(buf, string, offset, length)
	}
	
	function base64Write (buf, string, offset, length) {
	  return blitBuffer(base64ToBytes(string), buf, offset, length)
	}
	
	function ucs2Write (buf, string, offset, length) {
	  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
	}
	
	Buffer.prototype.write = function write (string, offset, length, encoding) {
	  // Buffer#write(string)
	  if (offset === undefined) {
	    encoding = 'utf8'
	    length = this.length
	    offset = 0
	  // Buffer#write(string, encoding)
	  } else if (length === undefined && typeof offset === 'string') {
	    encoding = offset
	    length = this.length
	    offset = 0
	  // Buffer#write(string, offset[, length][, encoding])
	  } else if (isFinite(offset)) {
	    offset = offset | 0
	    if (isFinite(length)) {
	      length = length | 0
	      if (encoding === undefined) encoding = 'utf8'
	    } else {
	      encoding = length
	      length = undefined
	    }
	  // legacy write(string, encoding, offset, length) - remove in v0.13
	  } else {
	    throw new Error(
	      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
	    )
	  }
	
	  var remaining = this.length - offset
	  if (length === undefined || length > remaining) length = remaining
	
	  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
	    throw new RangeError('Attempt to write outside buffer bounds')
	  }
	
	  if (!encoding) encoding = 'utf8'
	
	  var loweredCase = false
	  for (;;) {
	    switch (encoding) {
	      case 'hex':
	        return hexWrite(this, string, offset, length)
	
	      case 'utf8':
	      case 'utf-8':
	        return utf8Write(this, string, offset, length)
	
	      case 'ascii':
	        return asciiWrite(this, string, offset, length)
	
	      case 'latin1':
	      case 'binary':
	        return latin1Write(this, string, offset, length)
	
	      case 'base64':
	        // Warning: maxLength not taken into account in base64Write
	        return base64Write(this, string, offset, length)
	
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return ucs2Write(this, string, offset, length)
	
	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = ('' + encoding).toLowerCase()
	        loweredCase = true
	    }
	  }
	}
	
	Buffer.prototype.toJSON = function toJSON () {
	  return {
	    type: 'Buffer',
	    data: Array.prototype.slice.call(this._arr || this, 0)
	  }
	}
	
	function base64Slice (buf, start, end) {
	  if (start === 0 && end === buf.length) {
	    return base64.fromByteArray(buf)
	  } else {
	    return base64.fromByteArray(buf.slice(start, end))
	  }
	}
	
	function utf8Slice (buf, start, end) {
	  end = Math.min(buf.length, end)
	  var res = []
	
	  var i = start
	  while (i < end) {
	    var firstByte = buf[i]
	    var codePoint = null
	    var bytesPerSequence = (firstByte > 0xEF) ? 4
	      : (firstByte > 0xDF) ? 3
	      : (firstByte > 0xBF) ? 2
	      : 1
	
	    if (i + bytesPerSequence <= end) {
	      var secondByte, thirdByte, fourthByte, tempCodePoint
	
	      switch (bytesPerSequence) {
	        case 1:
	          if (firstByte < 0x80) {
	            codePoint = firstByte
	          }
	          break
	        case 2:
	          secondByte = buf[i + 1]
	          if ((secondByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
	            if (tempCodePoint > 0x7F) {
	              codePoint = tempCodePoint
	            }
	          }
	          break
	        case 3:
	          secondByte = buf[i + 1]
	          thirdByte = buf[i + 2]
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
	            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
	              codePoint = tempCodePoint
	            }
	          }
	          break
	        case 4:
	          secondByte = buf[i + 1]
	          thirdByte = buf[i + 2]
	          fourthByte = buf[i + 3]
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
	            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
	              codePoint = tempCodePoint
	            }
	          }
	      }
	    }
	
	    if (codePoint === null) {
	      // we did not generate a valid codePoint so insert a
	      // replacement char (U+FFFD) and advance only 1 byte
	      codePoint = 0xFFFD
	      bytesPerSequence = 1
	    } else if (codePoint > 0xFFFF) {
	      // encode to utf16 (surrogate pair dance)
	      codePoint -= 0x10000
	      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
	      codePoint = 0xDC00 | codePoint & 0x3FF
	    }
	
	    res.push(codePoint)
	    i += bytesPerSequence
	  }
	
	  return decodeCodePointsArray(res)
	}
	
	// Based on http://stackoverflow.com/a/22747272/680742, the browser with
	// the lowest limit is Chrome, with 0x10000 args.
	// We go 1 magnitude less, for safety
	var MAX_ARGUMENTS_LENGTH = 0x1000
	
	function decodeCodePointsArray (codePoints) {
	  var len = codePoints.length
	  if (len <= MAX_ARGUMENTS_LENGTH) {
	    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
	  }
	
	  // Decode in chunks to avoid "call stack size exceeded".
	  var res = ''
	  var i = 0
	  while (i < len) {
	    res += String.fromCharCode.apply(
	      String,
	      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
	    )
	  }
	  return res
	}
	
	function asciiSlice (buf, start, end) {
	  var ret = ''
	  end = Math.min(buf.length, end)
	
	  for (var i = start; i < end; ++i) {
	    ret += String.fromCharCode(buf[i] & 0x7F)
	  }
	  return ret
	}
	
	function latin1Slice (buf, start, end) {
	  var ret = ''
	  end = Math.min(buf.length, end)
	
	  for (var i = start; i < end; ++i) {
	    ret += String.fromCharCode(buf[i])
	  }
	  return ret
	}
	
	function hexSlice (buf, start, end) {
	  var len = buf.length
	
	  if (!start || start < 0) start = 0
	  if (!end || end < 0 || end > len) end = len
	
	  var out = ''
	  for (var i = start; i < end; ++i) {
	    out += toHex(buf[i])
	  }
	  return out
	}
	
	function utf16leSlice (buf, start, end) {
	  var bytes = buf.slice(start, end)
	  var res = ''
	  for (var i = 0; i < bytes.length; i += 2) {
	    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
	  }
	  return res
	}
	
	Buffer.prototype.slice = function slice (start, end) {
	  var len = this.length
	  start = ~~start
	  end = end === undefined ? len : ~~end
	
	  if (start < 0) {
	    start += len
	    if (start < 0) start = 0
	  } else if (start > len) {
	    start = len
	  }
	
	  if (end < 0) {
	    end += len
	    if (end < 0) end = 0
	  } else if (end > len) {
	    end = len
	  }
	
	  if (end < start) end = start
	
	  var newBuf
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    newBuf = this.subarray(start, end)
	    newBuf.__proto__ = Buffer.prototype
	  } else {
	    var sliceLen = end - start
	    newBuf = new Buffer(sliceLen, undefined)
	    for (var i = 0; i < sliceLen; ++i) {
	      newBuf[i] = this[i + start]
	    }
	  }
	
	  return newBuf
	}
	
	/*
	 * Need to make sure that buffer isn't trying to write out of bounds.
	 */
	function checkOffset (offset, ext, length) {
	  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
	  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
	}
	
	Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)
	
	  var val = this[offset]
	  var mul = 1
	  var i = 0
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul
	  }
	
	  return val
	}
	
	Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) {
	    checkOffset(offset, byteLength, this.length)
	  }
	
	  var val = this[offset + --byteLength]
	  var mul = 1
	  while (byteLength > 0 && (mul *= 0x100)) {
	    val += this[offset + --byteLength] * mul
	  }
	
	  return val
	}
	
	Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length)
	  return this[offset]
	}
	
	Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  return this[offset] | (this[offset + 1] << 8)
	}
	
	Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  return (this[offset] << 8) | this[offset + 1]
	}
	
	Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	
	  return ((this[offset]) |
	      (this[offset + 1] << 8) |
	      (this[offset + 2] << 16)) +
	      (this[offset + 3] * 0x1000000)
	}
	
	Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	
	  return (this[offset] * 0x1000000) +
	    ((this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    this[offset + 3])
	}
	
	Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)
	
	  var val = this[offset]
	  var mul = 1
	  var i = 0
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul
	  }
	  mul *= 0x80
	
	  if (val >= mul) val -= Math.pow(2, 8 * byteLength)
	
	  return val
	}
	
	Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)
	
	  var i = byteLength
	  var mul = 1
	  var val = this[offset + --i]
	  while (i > 0 && (mul *= 0x100)) {
	    val += this[offset + --i] * mul
	  }
	  mul *= 0x80
	
	  if (val >= mul) val -= Math.pow(2, 8 * byteLength)
	
	  return val
	}
	
	Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length)
	  if (!(this[offset] & 0x80)) return (this[offset])
	  return ((0xff - this[offset] + 1) * -1)
	}
	
	Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  var val = this[offset] | (this[offset + 1] << 8)
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	}
	
	Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  var val = this[offset + 1] | (this[offset] << 8)
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	}
	
	Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	
	  return (this[offset]) |
	    (this[offset + 1] << 8) |
	    (this[offset + 2] << 16) |
	    (this[offset + 3] << 24)
	}
	
	Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	
	  return (this[offset] << 24) |
	    (this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    (this[offset + 3])
	}
	
	Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	  return ieee754.read(this, offset, true, 23, 4)
	}
	
	Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	  return ieee754.read(this, offset, false, 23, 4)
	}
	
	Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length)
	  return ieee754.read(this, offset, true, 52, 8)
	}
	
	Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length)
	  return ieee754.read(this, offset, false, 52, 8)
	}
	
	function checkInt (buf, value, offset, ext, max, min) {
	  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
	  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
	  if (offset + ext > buf.length) throw new RangeError('Index out of range')
	}
	
	Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) {
	    var maxBytes = Math.pow(2, 8 * byteLength) - 1
	    checkInt(this, value, offset, byteLength, maxBytes, 0)
	  }
	
	  var mul = 1
	  var i = 0
	  this[offset] = value & 0xFF
	  while (++i < byteLength && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF
	  }
	
	  return offset + byteLength
	}
	
	Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) {
	    var maxBytes = Math.pow(2, 8 * byteLength) - 1
	    checkInt(this, value, offset, byteLength, maxBytes, 0)
	  }
	
	  var i = byteLength - 1
	  var mul = 1
	  this[offset + i] = value & 0xFF
	  while (--i >= 0 && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF
	  }
	
	  return offset + byteLength
	}
	
	Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
	  this[offset] = (value & 0xff)
	  return offset + 1
	}
	
	function objectWriteUInt16 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffff + value + 1
	  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
	    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
	      (littleEndian ? i : 1 - i) * 8
	  }
	}
	
	Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	  } else {
	    objectWriteUInt16(this, value, offset, true)
	  }
	  return offset + 2
	}
	
	Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8)
	    this[offset + 1] = (value & 0xff)
	  } else {
	    objectWriteUInt16(this, value, offset, false)
	  }
	  return offset + 2
	}
	
	function objectWriteUInt32 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffffffff + value + 1
	  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
	    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
	  }
	}
	
	Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset + 3] = (value >>> 24)
	    this[offset + 2] = (value >>> 16)
	    this[offset + 1] = (value >>> 8)
	    this[offset] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, true)
	  }
	  return offset + 4
	}
	
	Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24)
	    this[offset + 1] = (value >>> 16)
	    this[offset + 2] = (value >>> 8)
	    this[offset + 3] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, false)
	  }
	  return offset + 4
	}
	
	Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1)
	
	    checkInt(this, value, offset, byteLength, limit - 1, -limit)
	  }
	
	  var i = 0
	  var mul = 1
	  var sub = 0
	  this[offset] = value & 0xFF
	  while (++i < byteLength && (mul *= 0x100)) {
	    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
	      sub = 1
	    }
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
	  }
	
	  return offset + byteLength
	}
	
	Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1)
	
	    checkInt(this, value, offset, byteLength, limit - 1, -limit)
	  }
	
	  var i = byteLength - 1
	  var mul = 1
	  var sub = 0
	  this[offset + i] = value & 0xFF
	  while (--i >= 0 && (mul *= 0x100)) {
	    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
	      sub = 1
	    }
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
	  }
	
	  return offset + byteLength
	}
	
	Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
	  if (value < 0) value = 0xff + value + 1
	  this[offset] = (value & 0xff)
	  return offset + 1
	}
	
	Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	  } else {
	    objectWriteUInt16(this, value, offset, true)
	  }
	  return offset + 2
	}
	
	Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8)
	    this[offset + 1] = (value & 0xff)
	  } else {
	    objectWriteUInt16(this, value, offset, false)
	  }
	  return offset + 2
	}
	
	Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	    this[offset + 2] = (value >>> 16)
	    this[offset + 3] = (value >>> 24)
	  } else {
	    objectWriteUInt32(this, value, offset, true)
	  }
	  return offset + 4
	}
	
	Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
	  if (value < 0) value = 0xffffffff + value + 1
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24)
	    this[offset + 1] = (value >>> 16)
	    this[offset + 2] = (value >>> 8)
	    this[offset + 3] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, false)
	  }
	  return offset + 4
	}
	
	function checkIEEE754 (buf, value, offset, ext, max, min) {
	  if (offset + ext > buf.length) throw new RangeError('Index out of range')
	  if (offset < 0) throw new RangeError('Index out of range')
	}
	
	function writeFloat (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
	  }
	  ieee754.write(buf, value, offset, littleEndian, 23, 4)
	  return offset + 4
	}
	
	Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, true, noAssert)
	}
	
	Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, false, noAssert)
	}
	
	function writeDouble (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
	  }
	  ieee754.write(buf, value, offset, littleEndian, 52, 8)
	  return offset + 8
	}
	
	Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, true, noAssert)
	}
	
	Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, false, noAssert)
	}
	
	// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
	Buffer.prototype.copy = function copy (target, targetStart, start, end) {
	  if (!start) start = 0
	  if (!end && end !== 0) end = this.length
	  if (targetStart >= target.length) targetStart = target.length
	  if (!targetStart) targetStart = 0
	  if (end > 0 && end < start) end = start
	
	  // Copy 0 bytes; we're done
	  if (end === start) return 0
	  if (target.length === 0 || this.length === 0) return 0
	
	  // Fatal error conditions
	  if (targetStart < 0) {
	    throw new RangeError('targetStart out of bounds')
	  }
	  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
	  if (end < 0) throw new RangeError('sourceEnd out of bounds')
	
	  // Are we oob?
	  if (end > this.length) end = this.length
	  if (target.length - targetStart < end - start) {
	    end = target.length - targetStart + start
	  }
	
	  var len = end - start
	  var i
	
	  if (this === target && start < targetStart && targetStart < end) {
	    // descending copy from end
	    for (i = len - 1; i >= 0; --i) {
	      target[i + targetStart] = this[i + start]
	    }
	  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
	    // ascending copy from start
	    for (i = 0; i < len; ++i) {
	      target[i + targetStart] = this[i + start]
	    }
	  } else {
	    Uint8Array.prototype.set.call(
	      target,
	      this.subarray(start, start + len),
	      targetStart
	    )
	  }
	
	  return len
	}
	
	// Usage:
	//    buffer.fill(number[, offset[, end]])
	//    buffer.fill(buffer[, offset[, end]])
	//    buffer.fill(string[, offset[, end]][, encoding])
	Buffer.prototype.fill = function fill (val, start, end, encoding) {
	  // Handle string cases:
	  if (typeof val === 'string') {
	    if (typeof start === 'string') {
	      encoding = start
	      start = 0
	      end = this.length
	    } else if (typeof end === 'string') {
	      encoding = end
	      end = this.length
	    }
	    if (val.length === 1) {
	      var code = val.charCodeAt(0)
	      if (code < 256) {
	        val = code
	      }
	    }
	    if (encoding !== undefined && typeof encoding !== 'string') {
	      throw new TypeError('encoding must be a string')
	    }
	    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
	      throw new TypeError('Unknown encoding: ' + encoding)
	    }
	  } else if (typeof val === 'number') {
	    val = val & 255
	  }
	
	  // Invalid ranges are not set to a default, so can range check early.
	  if (start < 0 || this.length < start || this.length < end) {
	    throw new RangeError('Out of range index')
	  }
	
	  if (end <= start) {
	    return this
	  }
	
	  start = start >>> 0
	  end = end === undefined ? this.length : end >>> 0
	
	  if (!val) val = 0
	
	  var i
	  if (typeof val === 'number') {
	    for (i = start; i < end; ++i) {
	      this[i] = val
	    }
	  } else {
	    var bytes = Buffer.isBuffer(val)
	      ? val
	      : utf8ToBytes(new Buffer(val, encoding).toString())
	    var len = bytes.length
	    for (i = 0; i < end - start; ++i) {
	      this[i + start] = bytes[i % len]
	    }
	  }
	
	  return this
	}
	
	// HELPER FUNCTIONS
	// ================
	
	var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g
	
	function base64clean (str) {
	  // Node strips out invalid characters like \n and \t from the string, base64-js does not
	  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
	  // Node converts strings with length < 2 to ''
	  if (str.length < 2) return ''
	  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
	  while (str.length % 4 !== 0) {
	    str = str + '='
	  }
	  return str
	}
	
	function stringtrim (str) {
	  if (str.trim) return str.trim()
	  return str.replace(/^\s+|\s+$/g, '')
	}
	
	function toHex (n) {
	  if (n < 16) return '0' + n.toString(16)
	  return n.toString(16)
	}
	
	function utf8ToBytes (string, units) {
	  units = units || Infinity
	  var codePoint
	  var length = string.length
	  var leadSurrogate = null
	  var bytes = []
	
	  for (var i = 0; i < length; ++i) {
	    codePoint = string.charCodeAt(i)
	
	    // is surrogate component
	    if (codePoint > 0xD7FF && codePoint < 0xE000) {
	      // last char was a lead
	      if (!leadSurrogate) {
	        // no lead yet
	        if (codePoint > 0xDBFF) {
	          // unexpected trail
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	          continue
	        } else if (i + 1 === length) {
	          // unpaired lead
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	          continue
	        }
	
	        // valid lead
	        leadSurrogate = codePoint
	
	        continue
	      }
	
	      // 2 leads in a row
	      if (codePoint < 0xDC00) {
	        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	        leadSurrogate = codePoint
	        continue
	      }
	
	      // valid surrogate pair
	      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
	    } else if (leadSurrogate) {
	      // valid bmp char, but last char was a lead
	      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	    }
	
	    leadSurrogate = null
	
	    // encode utf8
	    if (codePoint < 0x80) {
	      if ((units -= 1) < 0) break
	      bytes.push(codePoint)
	    } else if (codePoint < 0x800) {
	      if ((units -= 2) < 0) break
	      bytes.push(
	        codePoint >> 0x6 | 0xC0,
	        codePoint & 0x3F | 0x80
	      )
	    } else if (codePoint < 0x10000) {
	      if ((units -= 3) < 0) break
	      bytes.push(
	        codePoint >> 0xC | 0xE0,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      )
	    } else if (codePoint < 0x110000) {
	      if ((units -= 4) < 0) break
	      bytes.push(
	        codePoint >> 0x12 | 0xF0,
	        codePoint >> 0xC & 0x3F | 0x80,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      )
	    } else {
	      throw new Error('Invalid code point')
	    }
	  }
	
	  return bytes
	}
	
	function asciiToBytes (str) {
	  var byteArray = []
	  for (var i = 0; i < str.length; ++i) {
	    // Node's code seems to be doing this and not & 0x7F..
	    byteArray.push(str.charCodeAt(i) & 0xFF)
	  }
	  return byteArray
	}
	
	function utf16leToBytes (str, units) {
	  var c, hi, lo
	  var byteArray = []
	  for (var i = 0; i < str.length; ++i) {
	    if ((units -= 2) < 0) break
	
	    c = str.charCodeAt(i)
	    hi = c >> 8
	    lo = c % 256
	    byteArray.push(lo)
	    byteArray.push(hi)
	  }
	
	  return byteArray
	}
	
	function base64ToBytes (str) {
	  return base64.toByteArray(base64clean(str))
	}
	
	function blitBuffer (src, dst, offset, length) {
	  for (var i = 0; i < length; ++i) {
	    if ((i + offset >= dst.length) || (i >= src.length)) break
	    dst[i + offset] = src[i]
	  }
	  return i
	}
	
	function isnan (val) {
	  return val !== val // eslint-disable-line no-self-compare
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict'
	
	exports.byteLength = byteLength
	exports.toByteArray = toByteArray
	exports.fromByteArray = fromByteArray
	
	var lookup = []
	var revLookup = []
	var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array
	
	var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
	for (var i = 0, len = code.length; i < len; ++i) {
	  lookup[i] = code[i]
	  revLookup[code.charCodeAt(i)] = i
	}
	
	revLookup['-'.charCodeAt(0)] = 62
	revLookup['_'.charCodeAt(0)] = 63
	
	function placeHoldersCount (b64) {
	  var len = b64.length
	  if (len % 4 > 0) {
	    throw new Error('Invalid string. Length must be a multiple of 4')
	  }
	
	  // the number of equal signs (place holders)
	  // if there are two placeholders, than the two characters before it
	  // represent one byte
	  // if there is only one, then the three characters before it represent 2 bytes
	  // this is just a cheap hack to not do indexOf twice
	  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
	}
	
	function byteLength (b64) {
	  // base64 is 4/3 + up to two characters of the original data
	  return b64.length * 3 / 4 - placeHoldersCount(b64)
	}
	
	function toByteArray (b64) {
	  var i, j, l, tmp, placeHolders, arr
	  var len = b64.length
	  placeHolders = placeHoldersCount(b64)
	
	  arr = new Arr(len * 3 / 4 - placeHolders)
	
	  // if there are placeholders, only get up to the last complete 4 chars
	  l = placeHolders > 0 ? len - 4 : len
	
	  var L = 0
	
	  for (i = 0, j = 0; i < l; i += 4, j += 3) {
	    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
	    arr[L++] = (tmp >> 16) & 0xFF
	    arr[L++] = (tmp >> 8) & 0xFF
	    arr[L++] = tmp & 0xFF
	  }
	
	  if (placeHolders === 2) {
	    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
	    arr[L++] = tmp & 0xFF
	  } else if (placeHolders === 1) {
	    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
	    arr[L++] = (tmp >> 8) & 0xFF
	    arr[L++] = tmp & 0xFF
	  }
	
	  return arr
	}
	
	function tripletToBase64 (num) {
	  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
	}
	
	function encodeChunk (uint8, start, end) {
	  var tmp
	  var output = []
	  for (var i = start; i < end; i += 3) {
	    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
	    output.push(tripletToBase64(tmp))
	  }
	  return output.join('')
	}
	
	function fromByteArray (uint8) {
	  var tmp
	  var len = uint8.length
	  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
	  var output = ''
	  var parts = []
	  var maxChunkLength = 16383 // must be multiple of 3
	
	  // go through the array every three bytes, we'll deal with trailing stuff later
	  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
	    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
	  }
	
	  // pad the end with zeros, but make sure to not forget the extra bytes
	  if (extraBytes === 1) {
	    tmp = uint8[len - 1]
	    output += lookup[tmp >> 2]
	    output += lookup[(tmp << 4) & 0x3F]
	    output += '=='
	  } else if (extraBytes === 2) {
	    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
	    output += lookup[tmp >> 10]
	    output += lookup[(tmp >> 4) & 0x3F]
	    output += lookup[(tmp << 2) & 0x3F]
	    output += '='
	  }
	
	  parts.push(output)
	
	  return parts.join('')
	}


/***/ },
/* 6 */
/***/ function(module, exports) {

	exports.read = function (buffer, offset, isLE, mLen, nBytes) {
	  var e, m
	  var eLen = nBytes * 8 - mLen - 1
	  var eMax = (1 << eLen) - 1
	  var eBias = eMax >> 1
	  var nBits = -7
	  var i = isLE ? (nBytes - 1) : 0
	  var d = isLE ? -1 : 1
	  var s = buffer[offset + i]
	
	  i += d
	
	  e = s & ((1 << (-nBits)) - 1)
	  s >>= (-nBits)
	  nBits += eLen
	  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}
	
	  m = e & ((1 << (-nBits)) - 1)
	  e >>= (-nBits)
	  nBits += mLen
	  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}
	
	  if (e === 0) {
	    e = 1 - eBias
	  } else if (e === eMax) {
	    return m ? NaN : ((s ? -1 : 1) * Infinity)
	  } else {
	    m = m + Math.pow(2, mLen)
	    e = e - eBias
	  }
	  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
	}
	
	exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
	  var e, m, c
	  var eLen = nBytes * 8 - mLen - 1
	  var eMax = (1 << eLen) - 1
	  var eBias = eMax >> 1
	  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
	  var i = isLE ? 0 : (nBytes - 1)
	  var d = isLE ? 1 : -1
	  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0
	
	  value = Math.abs(value)
	
	  if (isNaN(value) || value === Infinity) {
	    m = isNaN(value) ? 1 : 0
	    e = eMax
	  } else {
	    e = Math.floor(Math.log(value) / Math.LN2)
	    if (value * (c = Math.pow(2, -e)) < 1) {
	      e--
	      c *= 2
	    }
	    if (e + eBias >= 1) {
	      value += rt / c
	    } else {
	      value += rt * Math.pow(2, 1 - eBias)
	    }
	    if (value * c >= 2) {
	      e++
	      c /= 2
	    }
	
	    if (e + eBias >= eMax) {
	      m = 0
	      e = eMax
	    } else if (e + eBias >= 1) {
	      m = (value * c - 1) * Math.pow(2, mLen)
	      e = e + eBias
	    } else {
	      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
	      e = 0
	    }
	  }
	
	  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}
	
	  e = (e << mLen) | m
	  eLen += mLen
	  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}
	
	  buffer[offset + i - d] |= s * 128
	}


/***/ },
/* 7 */
/***/ function(module, exports) {

	var toString = {}.toString;
	
	module.exports = Array.isArray || function (arr) {
	  return toString.call(arr) == '[object Array]';
	};


/***/ },
/* 8 */,
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	/**
	 * Import dependency polyfills
	 */
	
	exports.__esModule = true;
	
	var _MurmurHash = __webpack_require__(10);
	
	var _MurmurHash2 = _interopRequireDefault(_MurmurHash);
	
	var _EverCookie = __webpack_require__(30);
	
	var _EverCookie2 = _interopRequireDefault(_EverCookie);
	
	var _Utils = __webpack_require__(11);
	
	var _Utils2 = _interopRequireDefault(_Utils);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var btoa = __webpack_require__(37);
	/**
	 * Import dependency classes
	 */
	
	/**
	 * User ID class
	 */
	var UserID = function () {
	    /**
	     * Clear previous version of FingerPrint
	     */
	    UserID.clearPrevious = function clearPrevious() {
	        /**
	         * Check if localStorage is supported
	         */
	        if (typeof localStorage !== "undefined") {
	            /**
	             * Loop all localStorage keys
	             */
	            for (var key in localStorage) {
	                /**
	                 * If key matched to FingerPrint and it is not current version, then remove that item from storages
	                 */
	                if (key.indexOf("UserID") !== -1 && key.indexOf("UserID_1.0.17") === -1) {
	                    /**
	                     * Parse storage key and get storage version
	                     */
	                    var localKey = key.split("_");
	                    localKey = localKey.slice(0, localKey.length - 1);
	                    key = localKey.join("_");
	                    /**
	                     * Init EverCookie for that version
	                     */
	                    var LocalEverCookie = new _EverCookie2.default(key);
	                    /**
	                     * Clean storage
	                     */
	                    LocalEverCookie.clear(true);
	                    /**
	                     * Destroy storage
	                     */
	                    LocalEverCookie.destroy();
	                }
	            }
	        }
	    };
	    /**
	     * 32 bit FNV-1a hash
	     * @param str
	     * @param hash
	     * @return {number}
	     */
	
	
	    UserID.fnv32a = function fnv32a(str, hash) {
	        for (var i = 0; i < str.length; i++) {
	            hash = hash ^ str.charCodeAt(i);
	            hash = hash * 0x01000193 & 0xFFFFFFFF;
	        }
	        return hash;
	    };
	    /**
	     * Convert string to binary
	     * @param val
	     * @return {string}
	     */
	
	
	    UserID.tobinary = function tobinary(val) {
	        var ret = "";
	        for (var i = 0; i < 4; i++) {
	            ret += String.fromCharCode(val & 0xFF);
	            val = val >> 8;
	        }
	        return ret;
	    };
	    /**
	     * Get FingerPrint Hash
	     * @param dump
	     * @return {string}
	     */
	
	
	    UserID.getFingerPrintHash = function getFingerPrintHash(dump) {
	        var murmur = _MurmurHash2.default.x64hash128(dump, 31);
	        var i1 = 4004;
	        var i2 = 1471357547; // Fake date.
	        var i3 = UserID.fnv32a(murmur.substr(0, 16), murmur);
	        var i4 = UserID.fnv32a(murmur.substr(16, 16), murmur);
	        i4 = i4 & 0xFFFFFF00 | 0x01;
	        var ruid = "";
	        ruid += UserID.tobinary(i1);
	        ruid += UserID.tobinary(i2);
	        ruid += UserID.tobinary(i3);
	        ruid += UserID.tobinary(i4);
	        ruid += String.fromCharCode(0);
	        return btoa(ruid);
	    };
	    /**
	     * Get User Language
	     * @return {Object|boolean}
	     */
	
	
	    UserID.getUserLanguage = function getUserLanguage() {
	        try {
	            var _navigator = window.navigator;
	            return {
	                UserLanguage: _navigator.language || _navigator.userLanguage || _navigator.browserLanguage || _navigator.systemLanguage || ""
	            };
	        } catch (e) {
	            return false;
	        }
	    };
	    /**
	     * Get Timezone Offset
	     * @return {Object|boolean}
	     */
	
	
	    UserID.getTimezoneOffset = function getTimezoneOffset() {
	        try {
	            return {
	                TimezoneOffset: new Date().getTimezoneOffset()
	            };
	        } catch (e) {
	            return false;
	        }
	    };
	    /**
	     * Each emulation for Arrays and Objects
	     * @param obj
	     * @param iterator
	     * @param context
	     */
	
	
	    UserID.each = function each(obj, iterator, context) {
	        if (obj === null) {
	            return;
	        }
	        if (Array.prototype.forEach && obj.forEach === Array.prototype.forEach) {
	            obj.forEach(iterator, context);
	        } else if (obj.length === +obj.length) {
	            for (var i = 0, l = obj.length; i < l; i++) {
	                if (iterator.call(context, obj[i], i, obj) === {}) {
	                    return;
	                }
	            }
	        } else {
	            for (var key in obj) {
	                if (obj.hasOwnProperty(key)) {
	                    if (iterator.call(context, obj[key], key, obj) === {}) {
	                        return;
	                    }
	                }
	            }
	        }
	    };
	    /**
	     * User ID constructor
	     */
	
	
	    function UserID() {
	        var _this = this;
	
	        _classCallCheck(this, UserID);
	
	        /**
	         * Clear previous version of FingerPrint
	         */
	        UserID.clearPrevious();
	        /**
	         * Generate IDs
	         */
	        this.IDEverCookie = "";
	        this.IDUID = "";
	        this.IDBASE = UserID.getFingerPrintHash(JSON.stringify([_Utils2.default.User.getInfo(), UserID.getUserLanguage(), UserID.getTimezoneOffset(), this.getPlugins()]));
	        /**
	         * Init EveryCookie and get ID
	         * @type {EverCookie}
	         */
	        this.EverCookie = new _EverCookie2.default("UserID_1.0.17");
	        this.IDEverCookie = this.EverCookie.getItem(true, "FingerPrint");
	        /**
	         * Get full ID
	         */
	        this.getUID(function (result) {
	            /**
	             * Convert user signs to Rambler format
	             */
	            _this.IDUID = UserID.getFingerPrintHash(JSON.stringify(result));
	            /**
	             * Write full user ID into the EverCookie
	             */
	            if (_this.IDEverCookie !== _this.IDUID) {
	                _this.EverCookie.setItem(true, "FingerPrint", _this.IDUID);
	            }
	        });
	        _Utils2.default.implementationStaticMethods(this, "UserID");
	    }
	    /**
	     * Get user ID
	     * @return {string}
	     */
	
	
	    UserID.prototype.getID = function getID() {
	        /**
	         * Return full user ID, ID from storage or base ID if one of them exist
	         */
	        return this.IDUID || this.IDEverCookie || this.IDBASE;
	    };
	    /**
	     * Get user full ID
	     * @param callback
	     */
	
	
	    UserID.prototype.getUID = function getUID(callback) {
	        var _this2 = this;
	
	        this.getIP(function (result) {
	            callback([_Utils2.default.User.getInfo(), UserID.getUserLanguage(), UserID.getTimezoneOffset(), _this2.getPlugins(), result]);
	        });
	    };
	    /**
	     * Get Plugins
	     * @return {Object|boolean}
	     */
	
	
	    UserID.prototype.getPlugins = function getPlugins() {
	        try {
	            if (_Utils2.default.Browser.isMSIE()) {
	                return {
	                    Plugins: this.getIEPlugins()
	                };
	            } else {
	                return {
	                    Plugins: this.getRegularPlugins()
	                };
	            }
	        } catch (e) {
	            return false;
	        }
	    };
	    /**
	     * Get IE plugins
	     * @return {Array}
	     */
	
	
	    UserID.prototype.getIEPlugins = function getIEPlugins() {
	        try {
	            var arrResult = [];
	            /**
	             * If ActiveXObject supported
	             */
	            if (Object.getOwnPropertyDescriptor && Object.getOwnPropertyDescriptor(window, "ActiveXObject") || "ActiveXObject" in window) {
	                /**
	                 * List of expected plugins
	                 * @type {string[]}
	                 */
	                var arrExpectedPluginsList = ["AcroPDF.PDF", "Adodb.Stream", "AgControl.AgControl", "DevalVRXCtrl.DevalVRXCtrl.1", "MacromediaFlashPaper.MacromediaFlashPaper", "Msxml2.DOMDocument", "Msxml2.XMLHTTP", "PDF.PdfCtrl", "QuickTime.QuickTime", "QuickTimeCheckObject.QuickTimeCheck.1", "RealPlayer", "RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)", "RealVideo.RealVideo(tm) ActiveX Control (32-bit)", "Scripting.Dictionary", "SWCtl.SWCtl", "Shell.UIHelper", "ShockwaveFlash.ShockwaveFlash", "Skype.Detection", "TDCCtl.TDCCtl", "WMPlayer.OCX", "rmocx.RealPlayer G2 Control", "rmocx.RealPlayer G2 Control.1"];
	                /**
	                 * Detecting IE plugins by trying initialise it
	                 * @type {Array}
	                 */
	                arrResult = this.map(arrExpectedPluginsList, function (name) {
	                    try {
	                        var a = new ActiveXObject(name);
	                        if (a) {
	                            return name;
	                        } else {
	                            return null;
	                        }
	                    } catch (e) {
	                        return null;
	                    }
	                }, this);
	            }
	            /**
	             * If normal plugins supported added it to IE plugin list
	             */
	            if (window.navigator.plugins) {
	                arrResult = arrResult.concat(this.getRegularPlugins());
	            }
	            /**
	             * Return plugins list
	             */
	            return arrResult;
	        } catch (e) {
	            return [];
	        }
	    };
	    /**
	     * Get other browser plugins
	     * @return {Object}
	     */
	
	
	    UserID.prototype.getRegularPlugins = function getRegularPlugins() {
	        var _this3 = this;
	
	        try {
	            /**
	             * Plugins list
	             * @type {Array}
	             */
	            var arrPlugins = [];
	            /**
	             * Get plugins from navigator
	             */
	            for (var i = 0; i < window.navigator.plugins.length; i++) {
	                arrPlugins.push(window.navigator.plugins[i]);
	            }
	            /**
	             * Sort plugins by name
	             * @type {Array}
	             */
	            arrPlugins = arrPlugins.sort(function (a, b) {
	                if (a.name > b.name) {
	                    return 1;
	                }
	                if (a.name < b.name) {
	                    return -1;
	                }
	                return 0;
	            });
	            /**
	             * Extrude plugins info
	             */
	            return this.map(arrPlugins, function (p) {
	                var mimeTypes = _this3.map(p, function (mt) {
	                    return [mt.type, mt.suffixes].join("~");
	                }).join(",");
	                return [p.name, p.description, mimeTypes].join("::");
	            }, this);
	        } catch (e) {
	            return [];
	        }
	    };
	    /**
	     * Get user IP
	     * @return {Promise}
	     */
	
	
	    UserID.prototype.getIP = function getIP(callback) {
	        var _this4 = this;
	
	        try {
	            this.getIPFromRTC(function (result) {
	                if (result) {
	                    callback(result);
	                } else {
	                    _this4.getIPFromServer(callback);
	                }
	            });
	        } catch (e) {
	            callback(false);
	        }
	    };
	    /**
	     * Get IP from RTC
	     * @return {Promise}
	     */
	
	
	    UserID.prototype.getIPFromRTC = function getIPFromRTC(callback) {
	        try {
	            window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
	            if (window.RTCPeerConnection) {
	                (function () {
	                    var pc = new window.RTCPeerConnection({ iceServers: [] });
	                    pc.onicecandidate = function (ice) {
	                        if (!ice || !ice.candidate || !ice.candidate.candidate) {
	                            callback(false);
	                        } else {
	                            var myIP = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/.exec(ice.candidate.candidate)[1];
	                            pc.onicecandidate = function () {
	                                return null;
	                            };
	                            callback({
	                                IP: myIP
	                            });
	                        }
	                    };
	                    pc.createDataChannel("");
	                    pc.createOffer().then(function (desc) {
	                        pc.setLocalDescription(desc);
	                    });
	                })();
	            } else {
	                callback(false);
	            }
	        } catch (e) {
	            callback(false);
	        }
	    };
	    /**
	     * Get user IP from server
	     * @param callback
	     */
	
	
	    UserID.prototype.getIPFromServer = function getIPFromServer(callback) {
	        try {
	            (function () {
	                var xhr = new XMLHttpRequest();
	                xhr.onload = function () {
	                    if (xhr.readyState != 4) {
	                        return;
	                    }
	                    if (xhr.status === 200 && xhr.responseText) {
	                        callback({
	                            IP: xhr.responseText
	                        });
	                    } else {
	                        callback(false);
	                    }
	                };
	                xhr.open("GET", "//ssp.rambler.ru/userip");
	                xhr.send();
	            })();
	        } catch (e) {
	            callback(false);
	        }
	    };
	    /**
	     * Map emulation for Arrays and Objects
	     * @param obj
	     * @param iterator
	     * @param context
	     * @return {Array}
	     */
	
	
	    UserID.prototype.map = function map(obj, iterator, context) {
	        var results = [];
	        if (obj === null) {
	            return results;
	        }
	        if (Array.prototype.map && obj.map === Array.prototype.map) {
	            return obj.map(iterator, context);
	        }
	        UserID.each(obj, function (value, index, list) {
	            results[results.length] = iterator.call(context, value, index, list);
	        }, context);
	        return results;
	    };
	
	    return UserID;
	}();
	
	exports.default = UserID;
	
	module.exports = UserID;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _Utils = __webpack_require__(11);
	
	var _Utils2 = _interopRequireDefault(_Utils);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * MurmurHash3
	 */
	var MurmurHash3 = function () {
	    /**
	     * MurmurHash3 related functions
	     *
	     * Given two 64bit int (as an array of two 32bit int) returns the two
	     * added together as a 64bit int (as an array of two 32bit int).
	     * @param m
	     * @param n
	     * @return {number[]}
	     */
	    MurmurHash3.x64Add = function x64Add(m, n) {
	        m = [m[0] >>> 16, m[0] & 0xffff, m[1] >>> 16, m[1] & 0xffff];
	        n = [n[0] >>> 16, n[0] & 0xffff, n[1] >>> 16, n[1] & 0xffff];
	        var o = [0, 0, 0, 0];
	        o[3] += m[3] + n[3];
	        o[2] += o[3] >>> 16;
	        o[3] &= 0xffff;
	        o[2] += m[2] + n[2];
	        o[1] += o[2] >>> 16;
	        o[2] &= 0xffff;
	        o[1] += m[1] + n[1];
	        o[0] += o[1] >>> 16;
	        o[1] &= 0xffff;
	        o[0] += m[0] + n[0];
	        o[0] &= 0xffff;
	        return [o[0] << 16 | o[1], o[2] << 16 | o[3]];
	    };
	    /**
	     * Given two 64bit int (as an array of two 32bit int) returns the two
	     * multiplied together as a 64bit int (as an array of two 32bit int).
	     * @param m
	     * @param n
	     * @return {number[]}
	     */
	
	
	    MurmurHash3.x64Multiply = function x64Multiply(m, n) {
	        m = [m[0] >>> 16, m[0] & 0xffff, m[1] >>> 16, m[1] & 0xffff];
	        n = [n[0] >>> 16, n[0] & 0xffff, n[1] >>> 16, n[1] & 0xffff];
	        var o = [0, 0, 0, 0];
	        o[3] += m[3] * n[3];
	        o[2] += o[3] >>> 16;
	        o[3] &= 0xffff;
	        o[2] += m[2] * n[3];
	        o[1] += o[2] >>> 16;
	        o[2] &= 0xffff;
	        o[2] += m[3] * n[2];
	        o[1] += o[2] >>> 16;
	        o[2] &= 0xffff;
	        o[1] += m[1] * n[3];
	        o[0] += o[1] >>> 16;
	        o[1] &= 0xffff;
	        o[1] += m[2] * n[2];
	        o[0] += o[1] >>> 16;
	        o[1] &= 0xffff;
	        o[1] += m[3] * n[1];
	        o[0] += o[1] >>> 16;
	        o[1] &= 0xffff;
	        o[0] += m[0] * n[3] + m[1] * n[2] + m[2] * n[1] + m[3] * n[0];
	        o[0] &= 0xffff;
	        return [o[0] << 16 | o[1], o[2] << 16 | o[3]];
	    };
	    /**
	     * Given a 64bit int (as an array of two 32bit int) and an int
	     * representing a number of bit positions, returns the 64bit int (as an
	     * array of two 32bit int) rotated left by that number of positions.
	     * @param m
	     * @param n
	     * @return {Array<number>}
	     */
	
	
	    MurmurHash3.x64Rotated = function x64Rotated(m, n) {
	        n %= 64;
	        if (n === 32) {
	            return [m[1], m[0]];
	        } else if (n < 32) {
	            return [m[0] << n | m[1] >>> 32 - n, m[1] << n | m[0] >>> 32 - n];
	        } else {
	            n -= 32;
	            return [m[1] << n | m[0] >>> 32 - n, m[0] << n | m[1] >>> 32 - n];
	        }
	    };
	    /**
	     * Given a 64bit int (as an array of two 32bit int) and an int
	     * representing a number of bit positions, returns the 64bit int (as an
	     * array of two 32bit int) shifted left by that number of positions.
	     * @param m
	     * @param n
	     * @return {Array<number>}
	     */
	
	
	    MurmurHash3.x64LeftShift = function x64LeftShift(m, n) {
	        n %= 64;
	        if (n === 0) {
	            return m;
	        } else if (n < 32) {
	            return [m[0] << n | m[1] >>> 32 - n, m[1] << n];
	        } else {
	            return [m[1] << n - 32, 0];
	        }
	    };
	    /**
	     * Given two 64bit int (as an array of two 32bit int) returns the two
	     * xor together as a 64bit int (as an array of two 32bit int).
	     * @param m
	     * @param n
	     * @return {Array<number>}
	     */
	
	
	    MurmurHash3.x64Xor = function x64Xor(m, n) {
	        return [m[0] ^ n[0], m[1] ^ n[1]];
	    };
	    /**
	     * Given a block, returns murmurHash3's final x64 mix of that block.
	     * (`[0, h[0] >>> 1]` is a 33 bit unsigned right shift. This is the
	     * only place where we need to right shift 64bit int.)
	     * @param h
	     * @return {Array<number>}
	     */
	
	
	    MurmurHash3.x64mix = function x64mix(h) {
	        h = this.x64Xor(h, [0, h[0] >>> 1]);
	        h = this.x64Multiply(h, [0xff51afd7, 0xed558ccd]);
	        h = this.x64Xor(h, [0, h[0] >>> 1]);
	        h = this.x64Multiply(h, [0xc4ceb9fe, 0x1a85ec53]);
	        h = this.x64Xor(h, [0, h[0] >>> 1]);
	        return h;
	    };
	    /**
	     * Given a string and an optional seed as an int, returns a 128 bit
	     * hash using the x64 flavor of MurmurHash3, as an unsigned hex.
	     * @param key
	     * @param seed
	     * @return {string}
	     */
	
	
	    MurmurHash3.x64hash128 = function x64hash128(key, seed) {
	        key = key || "";
	        seed = seed || 0;
	        var i = void 0;
	        var remainder = key.length % 16;
	        var bytes = key.length - remainder;
	        var h1 = [0, seed];
	        var h2 = [0, seed];
	        var k1 = [0, 0];
	        var k2 = [0, 0];
	        var c1 = [0x87c37b91, 0x114253d5];
	        var c2 = [0x4cf5ad43, 0x2745937f];
	        for (i = 0; i < bytes; i = i + 16) {
	            k1 = [key.charCodeAt(i + 4) & 0xff | (key.charCodeAt(i + 5) & 0xff) << 8 | (key.charCodeAt(i + 6) & 0xff) << 16 | (key.charCodeAt(i + 7) & 0xff) << 24, key.charCodeAt(i) & 0xff | (key.charCodeAt(i + 1) & 0xff) << 8 | (key.charCodeAt(i + 2) & 0xff) << 16 | (key.charCodeAt(i + 3) & 0xff) << 24];
	            k2 = [key.charCodeAt(i + 12) & 0xff | (key.charCodeAt(i + 13) & 0xff) << 8 | (key.charCodeAt(i + 14) & 0xff) << 16 | (key.charCodeAt(i + 15) & 0xff) << 24, key.charCodeAt(i + 8) & 0xff | (key.charCodeAt(i + 9) & 0xff) << 8 | (key.charCodeAt(i + 10) & 0xff) << 16 | (key.charCodeAt(i + 11) & 0xff) << 24];
	            k1 = this.x64Multiply(k1, c1);
	            k1 = this.x64Rotated(k1, 31);
	            k1 = this.x64Multiply(k1, c2);
	            h1 = this.x64Xor(h1, k1);
	            h1 = this.x64Rotated(h1, 27);
	            h1 = this.x64Add(h1, h2);
	            h1 = this.x64Add(this.x64Multiply(h1, [0, 5]), [0, 0x52dce729]);
	            k2 = this.x64Multiply(k2, c2);
	            k2 = this.x64Rotated(k2, 33);
	            k2 = this.x64Multiply(k2, c1);
	            h2 = this.x64Xor(h2, k2);
	            h2 = this.x64Rotated(h2, 31);
	            h2 = this.x64Add(h2, h1);
	            h2 = this.x64Add(this.x64Multiply(h2, [0, 5]), [0, 0x38495ab5]);
	        }
	        k1 = [0, 0];
	        k2 = [0, 0];
	        switch (remainder) {
	            case 15:
	                k2 = this.x64Xor(k2, this.x64LeftShift([0, key.charCodeAt(i + 14)], 48));
	                break;
	            case 14:
	                k2 = this.x64Xor(k2, this.x64LeftShift([0, key.charCodeAt(i + 13)], 40));
	                break;
	            case 13:
	                k2 = this.x64Xor(k2, this.x64LeftShift([0, key.charCodeAt(i + 12)], 32));
	                break;
	            case 12:
	                k2 = this.x64Xor(k2, this.x64LeftShift([0, key.charCodeAt(i + 11)], 24));
	                break;
	            case 11:
	                k2 = this.x64Xor(k2, this.x64LeftShift([0, key.charCodeAt(i + 10)], 16));
	                break;
	            case 10:
	                k2 = this.x64Xor(k2, this.x64LeftShift([0, key.charCodeAt(i + 9)], 8));
	                break;
	            case 9:
	                k2 = this.x64Xor(k2, [0, key.charCodeAt(i + 8)]);
	                k2 = this.x64Multiply(k2, c2);
	                k2 = this.x64Rotated(k2, 33);
	                k2 = this.x64Multiply(k2, c1);
	                h2 = this.x64Xor(h2, k2);
	                break;
	            case 8:
	                k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 7)], 56));
	                break;
	            case 7:
	                k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 6)], 48));
	                break;
	            case 6:
	                k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 5)], 40));
	                break;
	            case 5:
	                k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 4)], 32));
	                break;
	            case 4:
	                k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 3)], 24));
	                break;
	            case 3:
	                k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 2)], 16));
	                break;
	            case 2:
	                k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 1)], 8));
	                break;
	            case 1:
	                k1 = this.x64Xor(k1, [0, key.charCodeAt(i)]);
	                k1 = this.x64Multiply(k1, c1);
	                k1 = this.x64Rotated(k1, 31);
	                k1 = this.x64Multiply(k1, c2);
	                h1 = this.x64Xor(h1, k1);
	                break;
	            default:
	        }
	        h1 = this.x64Xor(h1, [0, key.length]);
	        h2 = this.x64Xor(h2, [0, key.length]);
	        h1 = this.x64Add(h1, h2);
	        h2 = this.x64Add(h2, h1);
	        h1 = this.x64mix(h1);
	        h2 = this.x64mix(h2);
	        h1 = this.x64Add(h1, h2);
	        h2 = this.x64Add(h2, h1);
	        var n1 = h1[0] >>> 0;
	        var n2 = h1[1] >>> 0;
	        var n3 = h2[0] >>> 0;
	        var n4 = h2[1] >>> 0;
	        var s1 = ("00000000" + n1.toString(16)).slice(-8);
	        var s2 = ("00000000" + n2.toString(16)).slice(-8);
	        var s3 = ("00000000" + n3.toString(16)).slice(-8);
	        var s4 = ("00000000" + n4.toString(16)).slice(-8);
	        return s1 + s2 + s3 + s4;
	    };
	    /**
	     * MurmurHash3 constructor
	     */
	
	
	    function MurmurHash3() {
	        _classCallCheck(this, MurmurHash3);
	
	        _Utils2.default.implementationStaticMethods(this, "MurmurHash3");
	    }
	
	    return MurmurHash3;
	}();
	
	exports.default = MurmurHash3;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	/**
	 * Import subclasses
	 */
	
	exports.__esModule = true;
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var _UtilsAnimation = __webpack_require__(12);
	
	var _UtilsAnimation2 = _interopRequireDefault(_UtilsAnimation);
	
	var _UtilsBrowser = __webpack_require__(14);
	
	var _UtilsBrowser2 = _interopRequireDefault(_UtilsBrowser);
	
	var _UtilsCookie = __webpack_require__(15);
	
	var _UtilsCookie2 = _interopRequireDefault(_UtilsCookie);
	
	var _UtilsDocument = __webpack_require__(23);
	
	var _UtilsDocument2 = _interopRequireDefault(_UtilsDocument);
	
	var _UtilsDOM = __webpack_require__(25);
	
	var _UtilsDOM2 = _interopRequireDefault(_UtilsDOM);
	
	var _UtilsMouse = __webpack_require__(26);
	
	var _UtilsMouse2 = _interopRequireDefault(_UtilsMouse);
	
	var _UtilsScreen = __webpack_require__(27);
	
	var _UtilsScreen2 = _interopRequireDefault(_UtilsScreen);
	
	var _UtilsSystem = __webpack_require__(28);
	
	var _UtilsSystem2 = _interopRequireDefault(_UtilsSystem);
	
	var _UtilsUser = __webpack_require__(29);
	
	var _UtilsUser2 = _interopRequireDefault(_UtilsUser);
	
	var _UtilsWindow = __webpack_require__(24);
	
	var _UtilsWindow2 = _interopRequireDefault(_UtilsWindow);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * Global Utils class
	 */
	var Utils = function () {
	    function Utils() {
	        _classCallCheck(this, Utils);
	    }
	
	    Utils.warn = function warn(messange) {
	        if ((typeof console === "undefined" ? "undefined" : _typeof(console)) === "object") {
	            if (typeof console.warn === "function") {
	                //console.warn(messange);
	                return messange;
	            } else if (typeof console.log === "function") {
	                //console.log(messange);
	                return messange;
	            }
	        }
	    };
	    /**
	     * @deprecated Utils.getBoundingClientRect method was deprecated and soon will be removed. Please use Utils.DOM.getBoundingClientRect method.
	     */
	
	
	    Utils.getBoundingClientRect = function getBoundingClientRect(domNode) {
	        var domDocument = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;
	        var showForce = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
	
	        Utils.warn("Utils.getBoundingClientRect method was deprecated and soon will be removed. Please use Utils.DOM.getBoundingClientRect method.");
	        return Utils.DOM.getBoundingClientRect(domNode, domDocument, showForce);
	    };
	
	    /**
	     * @deprecated Utils.findElementPosition method was deprecated and soon will be removed. Please use Utils.DOM.findElementPosition method.
	     */
	    Utils.findElementPosition = function findElementPosition(domNode) {
	        var domDocument = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;
	        var showForce = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
	
	        Utils.warn("Utils.findElementPosition method was deprecated and soon will be removed. Please use Utils.DOM.findElementPosition method.");
	        return Utils.DOM.findElementPosition(domNode, domDocument, showForce);
	    };
	    /**
	     * Transfer static methods into the object
	     * @param realObject
	     * @param className
	     */
	
	
	    Utils.implementationStaticMethods = function implementationStaticMethods(realObject, className) {
	        if (!!realObject && (typeof realObject === "undefined" ? "undefined" : _typeof(realObject)) === "object") {
	            (function () {
	                var staticClass = realObject.constructor;
	                if (typeof staticClass === "function") {
	                    var methods = Object.keys(staticClass);
	                    if (methods && methods.length > 0) {
	                        var _loop = function _loop() {
	                            if (_isArray) {
	                                if (_i >= _iterator.length) return "break";
	                                _ref = _iterator[_i++];
	                            } else {
	                                _i = _iterator.next();
	                                if (_i.done) return "break";
	                                _ref = _i.value;
	                            }
	
	                            var method = _ref;
	
	                            if (typeof realObject[method] === "undefined") {
	                                realObject[method] = function () {
	                                    if (typeof staticClass !== "undefined") {
	                                        Utils.warn("That method was deprecated and soon will be removed. Please use " + (className || staticClass && staticClass.name || "Unknown") + "." + method + " method.");
	                                    }
	                                    return staticClass[method].apply(staticClass, arguments);
	                                };
	                            }
	                        };
	
	                        for (var _iterator = methods, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
	                            var _ref;
	
	                            var _ret2 = _loop();
	
	                            if (_ret2 === "break") break;
	                        }
	                    }
	                }
	            })();
	        }
	    };
	    /**
	     * Get call stack trace
	     * @return Array<Object>
	     */
	
	
	    Utils.stack = function stack() {
	        var e = new Error();
	        return e && e.stack && e.stack.split("\n").slice(5).map(function (s) {
	            if (!s) {
	                return {};
	            }
	            var match = /^(.*)@(.*)\.js:([0-9]+):([0-9]+)$/ig.exec(s);
	            if (match) {
	                if (match[1]) {
	                    match[1] = /([^\/<]+)/ig.exec(match[1]);
	                    if (match[1]) {
	                        match[1] = match[1][0];
	                    }
	                }
	                return {
	                    column: match[4] || "",
	                    file: match[2] || "",
	                    line: match[3] || "",
	                    method: match[1] || ""
	                };
	            }
	            match = /^(.*)@(http|https):([^:]+):([0-9]+):([0-9]+)$/ig.exec(s);
	            if (match) {
	                return {
	                    column: match[5] || "",
	                    file: match[3] || "",
	                    line: match[4] || "",
	                    method: match[1] + ":" + match[2] || ""
	                };
	            }
	            match = /^(.*)@(.*):([0-9]+):([0-9]+)$/ig.exec(s);
	            if (match) {
	                return {
	                    column: match[4] || "",
	                    file: match[2] || "",
	                    line: match[3] || "",
	                    method: match[1] || ""
	                };
	            }
	            match = /^\s+at\s([^(]+)\s\((.*):([0-9]+):([0-9]+)\)$/ig.exec(s);
	            if (match) {
	                return {
	                    column: match[4] || "",
	                    file: match[2] || "",
	                    line: match[3] || "",
	                    method: match[1] || ""
	                };
	            }
	            match = /^\s+at\s(.*):([0-9]+):([0-9]+)$/ig.exec(s);
	            if (match) {
	                return {
	                    column: match[3] || "",
	                    file: match[1] || "",
	                    line: match[2] || "",
	                    method: ""
	                };
	            }
	            return s;
	        }) || [];
	    };
	    /**
	     * Get random ID
	     * @return {string}
	     */
	
	
	    Utils.getUID = function getUID() {
	        return Math.random().toString(36).substring(2);
	    };
	
	    return Utils;
	}();
	
	exports.default = Utils;
	
	Utils.Animation = _UtilsAnimation2.default;
	Utils.Browser = _UtilsBrowser2.default;
	Utils.Cookie = _UtilsCookie2.default;
	Utils.DOM = _UtilsDOM2.default;
	Utils.Document = _UtilsDocument2.default;
	Utils.Mouse = _UtilsMouse2.default;
	Utils.Screen = _UtilsScreen2.default;
	Utils.System = _UtilsSystem2.default;
	Utils.User = _UtilsUser2.default;
	Utils.Window = _UtilsWindow2.default;
	module.exports = Utils;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	/**
	 * Import subclasses
	 */
	
	exports.__esModule = true;
	
	var _UtilsAnimationEasing = __webpack_require__(13);
	
	var _UtilsAnimationEasing2 = _interopRequireDefault(_UtilsAnimationEasing);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Animation = function Animation() {
	  _classCallCheck(this, Animation);
	};
	
	exports.default = Animation;
	
	Animation.Easing = _UtilsAnimationEasing2.default;

/***/ },
/* 13 */
/***/ function(module, exports) {

	"use strict";
	/**
	 * Different time animation functions
	 */
	
	exports.__esModule = true;
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Easing = function () {
	    function Easing() {
	        _classCallCheck(this, Easing);
	    }
	
	    Easing.isValidParams = function isValidParams(t, b, c, d, s) {
	        return typeof t === "number" && typeof b === "number" && typeof c === "number" && typeof d === "number" && (typeof s === "undefined" || typeof s === "number") && t < d;
	    };
	
	    Easing.swing = function swing(t, b, c, d) {
	        if (Easing.isValidParams(t, b, c, d)) {
	            return Easing[Easing.def](t, b, c, d);
	        } else {
	            return NaN;
	        }
	    };
	
	    Easing.easeInQuad = function easeInQuad(t, b, c, d) {
	        if (Easing.isValidParams(t, b, c, d)) {
	            return c * (t /= d) * t + b;
	        } else {
	            return NaN;
	        }
	    };
	
	    Easing.easeOutQuad = function easeOutQuad(t, b, c, d) {
	        if (Easing.isValidParams(t, b, c, d)) {
	            return -c * (t /= d) * (t - 2) + b;
	        } else {
	            return NaN;
	        }
	    };
	
	    Easing.easeInOutQuad = function easeInOutQuad(t, b, c, d) {
	        if (Easing.isValidParams(t, b, c, d)) {
	            if ((t /= d / 2) < 1) {
	                return c / 2 * t * t + b;
	            }
	            return -c / 2 * (--t * (t - 2) - 1) + b;
	        } else {
	            return NaN;
	        }
	    };
	
	    Easing.easeInCubic = function easeInCubic(t, b, c, d) {
	        if (Easing.isValidParams(t, b, c, d)) {
	            return c * (t /= d) * t * t + b;
	        } else {
	            return NaN;
	        }
	    };
	
	    Easing.easeOutCubic = function easeOutCubic(t, b, c, d) {
	        if (Easing.isValidParams(t, b, c, d)) {
	            return c * ((t = t / d - 1) * t * t + 1) + b;
	        } else {
	            return NaN;
	        }
	    };
	
	    Easing.easeInOutCubic = function easeInOutCubic(t, b, c, d) {
	        if (Easing.isValidParams(t, b, c, d)) {
	            if ((t /= d / 2) < 1) {
	                return c / 2 * t * t * t + b;
	            }
	            return c / 2 * ((t -= 2) * t * t + 2) + b;
	        } else {
	            return NaN;
	        }
	    };
	
	    Easing.easeInQuart = function easeInQuart(t, b, c, d) {
	        if (Easing.isValidParams(t, b, c, d)) {
	            return c * (t /= d) * t * t * t + b;
	        } else {
	            return NaN;
	        }
	    };
	
	    Easing.easeOutQuart = function easeOutQuart(t, b, c, d) {
	        if (Easing.isValidParams(t, b, c, d)) {
	            return -c * ((t = t / d - 1) * t * t * t - 1) + b;
	        } else {
	            return NaN;
	        }
	    };
	
	    Easing.easeInOutQuart = function easeInOutQuart(t, b, c, d) {
	        if (Easing.isValidParams(t, b, c, d)) {
	            if ((t /= d / 2) < 1) {
	                return c / 2 * t * t * t * t + b;
	            }
	            return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
	        } else {
	            return NaN;
	        }
	    };
	
	    Easing.easeInQuint = function easeInQuint(t, b, c, d) {
	        if (Easing.isValidParams(t, b, c, d)) {
	            return c * (t /= d) * t * t * t * t + b;
	        } else {
	            return NaN;
	        }
	    };
	
	    Easing.easeOutQuint = function easeOutQuint(t, b, c, d) {
	        if (Easing.isValidParams(t, b, c, d)) {
	            return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
	        } else {
	            return NaN;
	        }
	    };
	
	    Easing.easeInOutQuint = function easeInOutQuint(t, b, c, d) {
	        if (Easing.isValidParams(t, b, c, d)) {
	            if ((t /= d / 2) < 1) {
	                return c / 2 * t * t * t * t * t + b;
	            }
	            return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
	        } else {
	            return NaN;
	        }
	    };
	
	    Easing.easeInSine = function easeInSine(t, b, c, d) {
	        if (Easing.isValidParams(t, b, c, d)) {
	            return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
	        } else {
	            return NaN;
	        }
	    };
	
	    Easing.easeOutSine = function easeOutSine(t, b, c, d) {
	        if (Easing.isValidParams(t, b, c, d)) {
	            return c * Math.sin(t / d * (Math.PI / 2)) + b;
	        } else {
	            return NaN;
	        }
	    };
	
	    Easing.easeInOutSine = function easeInOutSine(t, b, c, d) {
	        if (Easing.isValidParams(t, b, c, d)) {
	            return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
	        } else {
	            return NaN;
	        }
	    };
	
	    Easing.easeInExpo = function easeInExpo(t, b, c, d) {
	        if (Easing.isValidParams(t, b, c, d)) {
	            return t === 0 ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
	        } else {
	            return NaN;
	        }
	    };
	
	    Easing.easeOutExpo = function easeOutExpo(t, b, c, d) {
	        if (Easing.isValidParams(t, b, c, d)) {
	            return t === d ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
	        } else {
	            return NaN;
	        }
	    };
	
	    Easing.easeInOutExpo = function easeInOutExpo(t, b, c, d) {
	        if (Easing.isValidParams(t, b, c, d)) {
	            if (t === 0) {
	                return b;
	            }
	            if (t === d) {
	                return b + c;
	            }
	            if ((t /= d / 2) < 1) {
	                return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
	            }
	            return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
	        } else {
	            return NaN;
	        }
	    };
	
	    Easing.easeInCirc = function easeInCirc(t, b, c, d) {
	        if (Easing.isValidParams(t, b, c, d)) {
	            return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
	        } else {
	            return NaN;
	        }
	    };
	
	    Easing.easeOutCirc = function easeOutCirc(t, b, c, d) {
	        if (Easing.isValidParams(t, b, c, d)) {
	            return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
	        } else {
	            return NaN;
	        }
	    };
	
	    Easing.easeInOutCirc = function easeInOutCirc(t, b, c, d) {
	        if (Easing.isValidParams(t, b, c, d)) {
	            if ((t /= d / 2) < 1) {
	                return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
	            }
	            return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
	        } else {
	            return NaN;
	        }
	    };
	
	    Easing.easeInElastic = function easeInElastic(t, b, c, d) {
	        if (Easing.isValidParams(t, b, c, d)) {
	            var s = 1.70158;
	            var p = 0;
	            var a = c;
	            if (t === 0) {
	                return b;
	            }
	            if ((t /= d) === 1) {
	                return b + c;
	            }
	            if (!p) {
	                p = d * .3;
	            }
	            if (a < Math.abs(c)) {
	                a = c;
	                s = p / 4;
	            } else {
	                s = p / (2 * Math.PI) * Math.asin(c / a);
	            }
	            return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
	        } else {
	            return NaN;
	        }
	    };
	
	    Easing.easeOutElastic = function easeOutElastic(t, b, c, d) {
	        if (Easing.isValidParams(t, b, c, d)) {
	            var s = 1.70158;
	            var p = 0;
	            var a = c;
	            if (t === 0) {
	                return b;
	            }
	            if ((t /= d) === 1) {
	                return b + c;
	            }
	            if (!p) {
	                p = d * .3;
	            }
	            if (a < Math.abs(c)) {
	                a = c;
	                s = p / 4;
	            } else {
	                s = p / (2 * Math.PI) * Math.asin(c / a);
	            }
	            return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
	        } else {
	            return NaN;
	        }
	    };
	
	    Easing.easeInOutElastic = function easeInOutElastic(t, b, c, d) {
	        if (Easing.isValidParams(t, b, c, d)) {
	            var s = 1.70158;
	            var p = 0;
	            var a = c;
	            if (t === 0) {
	                return b;
	            }
	            if ((t /= d / 2) === 2) {
	                return b + c;
	            }
	            if (!p) {
	                p = d * (.3 * 1.5);
	            }
	            if (a < Math.abs(c)) {
	                a = c;
	                s = p / 4;
	            } else {
	                s = p / (2 * Math.PI) * Math.asin(c / a);
	            }
	            if (t < 1) {
	                return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
	            }
	            return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
	        } else {
	            return NaN;
	        }
	    };
	
	    Easing.easeInBack = function easeInBack(t, b, c, d, s) {
	        if (Easing.isValidParams(t, b, c, d, s)) {
	            if (s === undefined) {
	                s = 1.70158;
	            }
	            return c * (t /= d) * t * ((s + 1) * t - s) + b;
	        } else {
	            return NaN;
	        }
	    };
	
	    Easing.easeOutBack = function easeOutBack(t, b, c, d, s) {
	        if (Easing.isValidParams(t, b, c, d, s)) {
	            if (s === undefined) {
	                s = 1.70158;
	            }
	            return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
	        } else {
	            return NaN;
	        }
	    };
	
	    Easing.easeInOutBack = function easeInOutBack(t, b, c, d, s) {
	        if (Easing.isValidParams(t, b, c, d, s)) {
	            if (s === undefined) {
	                s = 1.70158;
	            }
	            if ((t /= d / 2) < 1) {
	                return c / 2 * (t * t * (((s *= 1.525) + 1) * t - s)) + b;
	            }
	            return c / 2 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b;
	        } else {
	            return NaN;
	        }
	    };
	
	    Easing.easeInBounce = function easeInBounce(t, b, c, d) {
	        if (Easing.isValidParams(t, b, c, d)) {
	            return c - Easing.easeOutBounce(d - t, 0, c, d) + b;
	        } else {
	            return NaN;
	        }
	    };
	
	    Easing.easeOutBounce = function easeOutBounce(t, b, c, d) {
	        if (Easing.isValidParams(t, b, c, d)) {
	            if ((t /= d) < 1 / 2.75) {
	                return c * (7.5625 * t * t) + b;
	            } else if (t < 2 / 2.75) {
	                return c * (7.5625 * (t -= 1.5 / 2.75) * t + .75) + b;
	            } else if (t < 2.5 / 2.75) {
	                return c * (7.5625 * (t -= 2.25 / 2.75) * t + .9375) + b;
	            } else {
	                return c * (7.5625 * (t -= 2.625 / 2.75) * t + .984375) + b;
	            }
	        } else {
	            return NaN;
	        }
	    };
	
	    Easing.easeInOutBounce = function easeInOutBounce(t, b, c, d) {
	        if (Easing.isValidParams(t, b, c, d)) {
	            if (t < d / 2) {
	                return Easing.easeInBounce(t * 2, 0, c, d) * .5 + b;
	            }
	            return Easing.easeOutBounce(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
	        } else {
	            return NaN;
	        }
	    };
	
	    return Easing;
	}();
	
	exports.default = Easing;
	
	Easing.def = "easeOutQuad";

/***/ },
/* 14 */
/***/ function(module, exports) {

	"use strict";
	/**
	 * Class for working with browser
	 */
	
	exports.__esModule = true;
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Browser = function () {
	    function Browser() {
	        _classCallCheck(this, Browser);
	    }
	
	    /**
	     * Get browser info
	     * @return {{browser: string, mobile: boolean, version: string}}
	     */
	    Browser.getInfo = function getInfo() {
	        return {
	            browser: Browser.getName(),
	            mobile: Browser.isMobile(),
	            version: Browser.getVersion()
	        };
	    };
	    /**
	     * Get browser name
	     * @return {string}
	     */
	
	
	    Browser.getName = function getName() {
	        var browser = void 0;
	        if (Browser.isOpera()) {
	            browser = "Opera";
	        } else if (Browser.isOperaNew()) {
	            browser = "Opera";
	        } else if (Browser.isMSIE()) {
	            browser = "Microsoft Internet Explorer";
	        } else if (Browser.isMSIENew()) {
	            browser = "Microsoft Internet Explorer";
	        } else if (Browser.isChrome()) {
	            browser = "Chrome";
	        } else if (Browser.isFirefox()) {
	            browser = "Firefox";
	        } else if (Browser.isSafari()) {
	            browser = "Safari";
	        } else if (Browser.isOther()) {
	            browser = Browser.getOtherName();
	        }
	        return browser;
	    };
	    /**
	     * Get browser version
	     * @return {string}
	     */
	
	
	    Browser.getVersion = function getVersion() {
	        var version = void 0;
	        if (Browser.isOpera()) {
	            version = Browser.getOperaVersion();
	        } else if (Browser.isOperaNew()) {
	            version = Browser.getOperaNewVersion();
	        } else if (Browser.isMSIE()) {
	            version = Browser.getMSIEVersion();
	        } else if (Browser.isMSIENew()) {
	            version = Browser.getMSIENewVersion();
	        } else if (Browser.isChrome()) {
	            version = Browser.getChromeVersion();
	        } else if (Browser.isFirefox()) {
	            version = Browser.getFirefoxVersion();
	        } else if (Browser.isSafari()) {
	            version = Browser.getSafariVersion();
	        } else if (Browser.isOther()) {
	            version = Browser.getOtherVersion();
	        }
	        return version;
	    };
	    /**
	     * Trim browser version
	     * @param version
	     * @return {string}
	     */
	
	
	    Browser.trimVersion = function trimVersion(version) {
	        if (typeof version === "string") {
	            var chars = [";", " ", ")"];
	            for (var _iterator = chars, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
	                var _ref;
	
	                if (_isArray) {
	                    if (_i >= _iterator.length) break;
	                    _ref = _iterator[_i++];
	                } else {
	                    _i = _iterator.next();
	                    if (_i.done) break;
	                    _ref = _i.value;
	                }
	
	                var char = _ref;
	
	                var ix = version.indexOf(char);
	                if (ix !== -1) {
	                    version = version.substring(0, ix);
	                }
	            }
	            return version;
	        } else {
	            return "";
	        }
	    };
	    /**
	     * Check if it is mobile
	     * @return {boolean}
	     */
	
	
	    Browser.isMobile = function isMobile() {
	        return (/Mobile|mini|Fennec|Android|iP(ad|od|hone)/.test(navigator.appVersion)
	        );
	    };
	    /**
	     * Check if it is opera browser
	     * @return {boolean}
	     */
	
	
	    Browser.isOpera = function isOpera() {
	        return navigator.userAgent.indexOf("Opera") !== -1;
	    };
	    /**
	     * Get opera browser version
	     * @return {string}
	     */
	
	
	    Browser.getOperaVersion = function getOperaVersion() {
	        var verOffset = navigator.userAgent.indexOf("Opera");
	        var version = navigator.userAgent.substring(verOffset + 6);
	        verOffset = navigator.userAgent.indexOf("Version");
	        if (verOffset !== -1) {
	            version = navigator.userAgent.substring(verOffset + 8);
	        }
	        return Browser.trimVersion(version);
	    };
	    /**
	     * Check if it is opera new browser
	     * @return {boolean}
	     */
	
	
	    Browser.isOperaNew = function isOperaNew() {
	        return navigator.userAgent.indexOf("OPR") !== -1;
	    };
	    /**
	     * Get opera new browser version
	     * @return {string}
	     */
	
	
	    Browser.getOperaNewVersion = function getOperaNewVersion() {
	        var verOffset = navigator.userAgent.indexOf("OPR");
	        var version = navigator.userAgent.substring(verOffset + 4);
	        return Browser.trimVersion(version);
	    };
	    /**
	     * Check if it is msie browser
	     * @return {boolean}
	     */
	
	
	    Browser.isMSIE = function isMSIE() {
	        return navigator.userAgent.indexOf("MSIE") !== -1;
	    };
	    /**
	     * Get msie browser version
	     * @return {string}
	     */
	
	
	    Browser.getMSIEVersion = function getMSIEVersion() {
	        var verOffset = navigator.userAgent.indexOf("MSIE");
	        var version = navigator.userAgent.substring(verOffset + 5);
	        return Browser.trimVersion(version);
	    };
	    /**
	     * Check if it is msie new browser
	     * @return {boolean}
	     */
	
	
	    Browser.isMSIENew = function isMSIENew() {
	        return navigator.userAgent.indexOf("Trident/") !== -1;
	    };
	    /**
	     * Get msie new browser version
	     * @return {string}
	     */
	
	
	    Browser.getMSIENewVersion = function getMSIENewVersion() {
	        var version = navigator.userAgent.substring(navigator.userAgent.indexOf("rv:") + 3);
	        return Browser.trimVersion(version);
	    };
	    /**
	     * Check if it is chrome browser
	     * @return {boolean}
	     */
	
	
	    Browser.isChrome = function isChrome() {
	        return navigator.userAgent.indexOf("Chrome") !== -1;
	    };
	    /**
	     * Get chrome browser version
	     * @return {string}
	     */
	
	
	    Browser.getChromeVersion = function getChromeVersion() {
	        var verOffset = navigator.userAgent.indexOf("Chrome");
	        var version = navigator.userAgent.substring(verOffset + 7);
	        return Browser.trimVersion(version);
	    };
	    /**
	     * Check if it is safari browser
	     * @return {boolean}
	     */
	
	
	    Browser.isSafari = function isSafari() {
	        return navigator.userAgent.indexOf("Safari") !== -1 && navigator.userAgent.indexOf("Chrome") === -1;
	    };
	    /**
	     * Get safari browser version
	     * @return {string}
	     */
	
	
	    Browser.getSafariVersion = function getSafariVersion() {
	        var verOffset = navigator.userAgent.indexOf("Safari");
	        var version = navigator.userAgent.substring(verOffset + 7);
	        verOffset = navigator.userAgent.indexOf("Version");
	        if (verOffset !== -1) {
	            version = navigator.userAgent.substring(verOffset + 8);
	        }
	        return Browser.trimVersion(version);
	    };
	    /**
	     * Check if it is firefox browser
	     * @return {boolean}
	     */
	
	
	    Browser.isFirefox = function isFirefox() {
	        return navigator.userAgent.indexOf("Firefox") !== -1;
	    };
	    /**
	     * Get firefox browser version
	     * @return {string}
	     */
	
	
	    Browser.getFirefoxVersion = function getFirefoxVersion() {
	        var verOffset = navigator.userAgent.indexOf("Firefox");
	        var version = navigator.userAgent.substring(verOffset + 8);
	        return Browser.trimVersion(version);
	    };
	    /**
	     * Check if it is other browser
	     * @return {boolean}
	     */
	
	
	    Browser.isOther = function isOther() {
	        var nameOffset = navigator.userAgent.lastIndexOf(" ") + 1;
	        var verOffset = navigator.userAgent.lastIndexOf("/");
	        return nameOffset < verOffset;
	    };
	    /**
	     * Get other browser name
	     * @return {string}
	     */
	
	
	    Browser.getOtherName = function getOtherName() {
	        var nameOffset = navigator.userAgent.lastIndexOf(" ") + 1;
	        var verOffset = navigator.userAgent.lastIndexOf("/");
	        var browser = navigator.userAgent.substring(nameOffset, verOffset);
	        if (browser.toLowerCase() === browser.toUpperCase()) {
	            browser = navigator.appName;
	        }
	        return browser;
	    };
	    /**
	     * Get other browser version
	     * @return {string}
	     */
	
	
	    Browser.getOtherVersion = function getOtherVersion() {
	        var nameOffset = navigator.userAgent.lastIndexOf(" ") + 1;
	        var verOffset = navigator.userAgent.lastIndexOf("/");
	        var version = navigator.userAgent.substring(verOffset + 1);
	        return Browser.trimVersion(version);
	    };
	    /**
	     * Check browser support
	     * @return {boolean}
	     */
	
	
	    Browser.isSupported = function isSupported() {
	        return !Browser.isMSIE() || parseInt(Browser.getMSIEVersion(), 10) > 8;
	    };
	    /**
	     * Check if it is WebKit browser
	     * @return {boolean}
	     */
	
	
	    Browser.isWebKit = function isWebKit() {
	        return navigator.userAgent.indexOf("AppleWebKit/") !== -1;
	    };
	    /**
	     * Check if it is Gecko browser
	     * @return {boolean}
	     */
	
	
	    Browser.isGecko = function isGecko() {
	        return navigator.userAgent.indexOf("Gecko") > -1 && navigator.userAgent.indexOf("KHTML") === -1;
	    };
	    /**
	     * Check if it is Android browser
	     * @return {boolean}
	     */
	
	
	    Browser.isAndroid = function isAndroid() {
	        return navigator.userAgent.indexOf("Android") > -1;
	    };
	    /**
	     * Check if it is Linux browser
	     * @return {boolean}
	     */
	
	
	    Browser.isLinux = function isLinux() {
	        return navigator.userAgent.indexOf("Linux") > -1;
	    };
	    /**
	     * Check if it is iPad browser
	     * @return {boolean}
	     */
	
	
	    Browser.isTabletPC = function isTabletPC() {
	        return navigator.userAgent.indexOf("iPad") > -1;
	    };
	
	    return Browser;
	}();
	
	exports.default = Browser;

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var URL = __webpack_require__(16);
	/**
	 * Class for working with cookie
	 */
	
	var Cookie = function () {
	    function Cookie() {
	        _classCallCheck(this, Cookie);
	    }
	
	    /**
	     * The method returns the flag whether supported this storage type or not
	     * @returns {boolean}
	     */
	    Cookie.isSupported = function isSupported() {
	        return (typeof document === "undefined" ? "undefined" : _typeof(document)) === "object" && typeof document.cookie === "string";
	    };
	    /**
	     * The method sets the value and returns true if it has been set
	     * @param checkSupport {boolean}
	     * @param key {string}
	     * @param value {string}
	     * @param expires {number}
	     * @param path {string}
	     * @param domain {string}
	     * @param secure {boolean}
	     * @return {boolean}
	     */
	
	
	    Cookie.setItem = function setItem() {
	        var checkSupport = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
	        var key = arguments[1];
	        var value = arguments[2];
	        var expires = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 30;
	        var path = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "/";
	        var domain = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : location.hostname;
	        var secure = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : location.protocol === "https:";
	
	        try {
	            /**
	             * Validate input data
	             */
	            if (typeof checkSupport === "boolean" && typeof key === "string" && Cookie.regValidKey.test(key) && typeof value === "string" && (value === "" || Cookie.regValidKey.test(value)) && typeof expires === "number" && expires < 365 && typeof path === "string" && typeof domain === "string" && domain.indexOf(location.hostname) !== -1 && typeof secure === "boolean" && secure === (location.protocol === "https:")) {
	                /**
	                 * Validate input data
	                 */
	                var u = URL.parse("http://" + domain + path);
	                if (u.hostname === domain || u.path === path) {
	                    /**
	                     * If that store is supported
	                     */
	                    if (!checkSupport || Cookie.isSupported()) {
	                        /**
	                         * Save cookies for 30 days
	                         * @type {Date}
	                         */
	                        var date = new Date();
	                        date.setTime(date.getTime() + expires * 24 * 60 * 60 * 1000);
	                        var exp = date.toUTCString();
	                        /**
	                         * Encode value for store
	                         * @type {string}
	                         */
	                        value = encodeURIComponent(value);
	                        /**
	                         * Writing value to the document cookie storage
	                         * @type {string}
	                         */
	                        document.cookie = key + "=" + value + (exp ? "; expires=" + exp : "") + (path ? "; path=" + path : "") + (domain ? "; domain=" + domain : "") + (secure ? "; secure" : "");
	                        /**
	                         * If all ok return true
	                         */
	                        return this.getItem(checkSupport, key) === decodeURIComponent(value);
	                    } else {
	                        /**
	                         * If cookie does not supported return false
	                         */
	                        return false;
	                    }
	                } else {
	                    /**
	                     * If input data is not valid
	                     */
	                    return false;
	                }
	            } else {
	                /**
	                 * If input data is not valid
	                 */
	                return false;
	            }
	        } catch (e) {
	            /**
	             * If something goes wrong return false
	             */
	            return false;
	        }
	    };
	    /**
	     * The method reads the value and returns it or returns false if the value does not exist
	     * @param checkSupport {boolean}
	     * @param key {string}
	     * @returns {string|boolean}
	     */
	
	
	    Cookie.getItem = function getItem() {
	        var checkSupport = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
	        var key = arguments[1];
	
	        try {
	            /**
	             * Validate input data
	             */
	            if (typeof checkSupport === "boolean" && typeof key === "string" && Cookie.regValidKey.test(key)) {
	                /**
	                 * If that store is supported
	                 */
	                if (!checkSupport || Cookie.isSupported()) {
	                    /**
	                     * Get the array from document cookie split by ;
	                     * @type {string[]}
	                     */
	                    var arrCookie = document.cookie.split(";");
	                    /**
	                     * Iterate through the cookies
	                     */
	                    for (var _iterator = arrCookie, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
	                        var _ref;
	
	                        if (_isArray) {
	                            if (_i >= _iterator.length) break;
	                            _ref = _iterator[_i++];
	                        } else {
	                            _i = _iterator.next();
	                            if (_i.done) break;
	                            _ref = _i.value;
	                        }
	
	                        var i = _ref;
	
	                        /**
	                         * Trim and split each cookie by = for key value pare
	                         * @type {string[]}
	                         */
	                        var v = i.trim().split("=", 2);
	                        /**
	                         * If it is correct cookie key return the value
	                         */
	                        if (v[0] === key) {
	                            /**
	                             * If the value was found return the value
	                             */
	                            return decodeURIComponent(v[1]);
	                        }
	                    }
	                    /**
	                     * If the value was not found return false
	                     */
	                    return false;
	                } else {
	                    /**
	                     * If cookie does not supported return false
	                     */
	                    return false;
	                }
	            } else {
	                /**
	                 * If input data is not valid
	                 */
	                return false;
	            }
	        } catch (e) {
	            /**
	             * If something goes wrong return false
	             */
	            return false;
	        }
	    };
	    /**
	     * The method removes the value and return true if the value does not exist
	     * @param checkSupport {boolean}
	     * @param key {string}
	     * @returns {boolean}
	     */
	
	
	    Cookie.removeItem = function removeItem() {
	        var checkSupport = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
	        var key = arguments[1];
	
	        try {
	            /**
	             * Validate input data
	             */
	            if (typeof checkSupport === "boolean" && typeof key === "string" && Cookie.regValidKey.test(key)) {
	                /**
	                 * If that store is supported
	                 */
	                if (!checkSupport || Cookie.isSupported()) {
	                    /**
	                     * Set empty overdue value by key
	                     */
	                    Cookie.setItem(checkSupport, key, "", -1 * 24 * 60 * 60);
	                    /**
	                     * If all ok return true
	                     */
	                    return Cookie.getItem(checkSupport, key) === false;
	                } else {
	                    /**
	                     * If cookie does not supported return false
	                     */
	                    return false;
	                }
	            } else {
	                /**
	                 * If input data is not valid
	                 */
	                return false;
	            }
	        } catch (e) {
	            /**
	             * If something goes wrong return false
	             */
	            return false;
	        }
	    };
	    /**
	     * The method returns the array of string of available keys
	     * @param checkSupport {boolean}
	     * @returns {string[]}
	     */
	
	
	    Cookie.getKeys = function getKeys() {
	        var checkSupport = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
	
	        try {
	            /**
	             * Validate input data
	             */
	            if (typeof checkSupport === "boolean") {
	                /**
	                 * If that store is supported
	                 */
	                if (!checkSupport || Cookie.isSupported()) {
	                    /**
	                     * The array of available keys
	                     * @type {Array}
	                     */
	                    var arrKeys = [];
	                    /**
	                     * Get the array from document cookie split by ;
	                     * @type {string[]}
	                     */
	                    var arrCookie = document.cookie.split(";");
	                    /**
	                     * Iterate through the cookies
	                     */
	                    for (var _iterator2 = arrCookie, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
	                        var _ref2;
	
	                        if (_isArray2) {
	                            if (_i2 >= _iterator2.length) break;
	                            _ref2 = _iterator2[_i2++];
	                        } else {
	                            _i2 = _iterator2.next();
	                            if (_i2.done) break;
	                            _ref2 = _i2.value;
	                        }
	
	                        var i = _ref2;
	
	                        /**
	                         * Trim and split each cookie by = for key value pare
	                         * @type {string[]}
	                         */
	                        var v = i.trim().split("=", 2);
	                        /**
	                         * Add key to the list
	                         */
	                        if (v[0]) {
	                            arrKeys.push(v[0]);
	                        }
	                    }
	                    return arrKeys;
	                } else {
	                    /**
	                     * If cookie does not supported return false
	                     */
	                    return [];
	                }
	            } else {
	                /**
	                 * If input data is not valid
	                 */
	                return [];
	            }
	        } catch (e) {
	            /**
	             * If something goes wrong return false
	             */
	            return [];
	        }
	    };
	    /**
	     * The method cleans the storage and return true if it is empty
	     * @param checkSupport {boolean}
	     * @returns {boolean}
	     */
	
	
	    Cookie.clear = function clear() {
	        var checkSupport = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
	
	        try {
	            /**
	             * Validate input data
	             */
	            if (typeof checkSupport === "boolean") {
	                /**
	                 * If that store is supported
	                 */
	                if (!checkSupport || Cookie.isSupported()) {
	                    var arrKeys = Cookie.getKeys(checkSupport);
	                    if (arrKeys) {
	                        for (var _iterator3 = arrKeys, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
	                            var _ref3;
	
	                            if (_isArray3) {
	                                if (_i3 >= _iterator3.length) break;
	                                _ref3 = _iterator3[_i3++];
	                            } else {
	                                _i3 = _iterator3.next();
	                                if (_i3.done) break;
	                                _ref3 = _i3.value;
	                            }
	
	                            var i = _ref3;
	
	                            Cookie.removeItem(checkSupport, i);
	                        }
	                    }
	                    /**
	                     * If all ok return true
	                     */
	                    return Cookie.getKeys(checkSupport).length === 0;
	                } else {
	                    /**
	                     * If cookie does not supported return false
	                     */
	                    return true;
	                }
	            } else {
	                /**
	                 * If input data is not valid
	                 */
	                return false;
	            }
	        } catch (e) {
	            /**
	             * If something goes wrong return false
	             */
	            return false;
	        }
	    };
	
	    return Cookie;
	}();
	
	exports.default = Cookie;
	
	Cookie.regValidKey = new RegExp("([a-zA-Z0-9_-]{1,})", "i");

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.
	
	'use strict';
	
	var punycode = __webpack_require__(17);
	var util = __webpack_require__(19);
	
	exports.parse = urlParse;
	exports.resolve = urlResolve;
	exports.resolveObject = urlResolveObject;
	exports.format = urlFormat;
	
	exports.Url = Url;
	
	function Url() {
	  this.protocol = null;
	  this.slashes = null;
	  this.auth = null;
	  this.host = null;
	  this.port = null;
	  this.hostname = null;
	  this.hash = null;
	  this.search = null;
	  this.query = null;
	  this.pathname = null;
	  this.path = null;
	  this.href = null;
	}
	
	// Reference: RFC 3986, RFC 1808, RFC 2396
	
	// define these here so at least they only have to be
	// compiled once on the first module load.
	var protocolPattern = /^([a-z0-9.+-]+:)/i,
	    portPattern = /:[0-9]*$/,
	
	    // Special case for a simple path URL
	    simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,
	
	    // RFC 2396: characters reserved for delimiting URLs.
	    // We actually just auto-escape these.
	    delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],
	
	    // RFC 2396: characters not allowed for various reasons.
	    unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),
	
	    // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
	    autoEscape = ['\''].concat(unwise),
	    // Characters that are never ever allowed in a hostname.
	    // Note that any invalid chars are also handled, but these
	    // are the ones that are *expected* to be seen, so we fast-path
	    // them.
	    nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
	    hostEndingChars = ['/', '?', '#'],
	    hostnameMaxLen = 255,
	    hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
	    hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
	    // protocols that can allow "unsafe" and "unwise" chars.
	    unsafeProtocol = {
	      'javascript': true,
	      'javascript:': true
	    },
	    // protocols that never have a hostname.
	    hostlessProtocol = {
	      'javascript': true,
	      'javascript:': true
	    },
	    // protocols that always contain a // bit.
	    slashedProtocol = {
	      'http': true,
	      'https': true,
	      'ftp': true,
	      'gopher': true,
	      'file': true,
	      'http:': true,
	      'https:': true,
	      'ftp:': true,
	      'gopher:': true,
	      'file:': true
	    },
	    querystring = __webpack_require__(20);
	
	function urlParse(url, parseQueryString, slashesDenoteHost) {
	  if (url && util.isObject(url) && url instanceof Url) return url;
	
	  var u = new Url;
	  u.parse(url, parseQueryString, slashesDenoteHost);
	  return u;
	}
	
	Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
	  if (!util.isString(url)) {
	    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
	  }
	
	  // Copy chrome, IE, opera backslash-handling behavior.
	  // Back slashes before the query string get converted to forward slashes
	  // See: https://code.google.com/p/chromium/issues/detail?id=25916
	  var queryIndex = url.indexOf('?'),
	      splitter =
	          (queryIndex !== -1 && queryIndex < url.indexOf('#')) ? '?' : '#',
	      uSplit = url.split(splitter),
	      slashRegex = /\\/g;
	  uSplit[0] = uSplit[0].replace(slashRegex, '/');
	  url = uSplit.join(splitter);
	
	  var rest = url;
	
	  // trim before proceeding.
	  // This is to support parse stuff like "  http://foo.com  \n"
	  rest = rest.trim();
	
	  if (!slashesDenoteHost && url.split('#').length === 1) {
	    // Try fast path regexp
	    var simplePath = simplePathPattern.exec(rest);
	    if (simplePath) {
	      this.path = rest;
	      this.href = rest;
	      this.pathname = simplePath[1];
	      if (simplePath[2]) {
	        this.search = simplePath[2];
	        if (parseQueryString) {
	          this.query = querystring.parse(this.search.substr(1));
	        } else {
	          this.query = this.search.substr(1);
	        }
	      } else if (parseQueryString) {
	        this.search = '';
	        this.query = {};
	      }
	      return this;
	    }
	  }
	
	  var proto = protocolPattern.exec(rest);
	  if (proto) {
	    proto = proto[0];
	    var lowerProto = proto.toLowerCase();
	    this.protocol = lowerProto;
	    rest = rest.substr(proto.length);
	  }
	
	  // figure out if it's got a host
	  // user@server is *always* interpreted as a hostname, and url
	  // resolution will treat //foo/bar as host=foo,path=bar because that's
	  // how the browser resolves relative URLs.
	  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
	    var slashes = rest.substr(0, 2) === '//';
	    if (slashes && !(proto && hostlessProtocol[proto])) {
	      rest = rest.substr(2);
	      this.slashes = true;
	    }
	  }
	
	  if (!hostlessProtocol[proto] &&
	      (slashes || (proto && !slashedProtocol[proto]))) {
	
	    // there's a hostname.
	    // the first instance of /, ?, ;, or # ends the host.
	    //
	    // If there is an @ in the hostname, then non-host chars *are* allowed
	    // to the left of the last @ sign, unless some host-ending character
	    // comes *before* the @-sign.
	    // URLs are obnoxious.
	    //
	    // ex:
	    // http://a@b@c/ => user:a@b host:c
	    // http://a@b?@c => user:a host:c path:/?@c
	
	    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
	    // Review our test case against browsers more comprehensively.
	
	    // find the first instance of any hostEndingChars
	    var hostEnd = -1;
	    for (var i = 0; i < hostEndingChars.length; i++) {
	      var hec = rest.indexOf(hostEndingChars[i]);
	      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
	        hostEnd = hec;
	    }
	
	    // at this point, either we have an explicit point where the
	    // auth portion cannot go past, or the last @ char is the decider.
	    var auth, atSign;
	    if (hostEnd === -1) {
	      // atSign can be anywhere.
	      atSign = rest.lastIndexOf('@');
	    } else {
	      // atSign must be in auth portion.
	      // http://a@b/c@d => host:b auth:a path:/c@d
	      atSign = rest.lastIndexOf('@', hostEnd);
	    }
	
	    // Now we have a portion which is definitely the auth.
	    // Pull that off.
	    if (atSign !== -1) {
	      auth = rest.slice(0, atSign);
	      rest = rest.slice(atSign + 1);
	      this.auth = decodeURIComponent(auth);
	    }
	
	    // the host is the remaining to the left of the first non-host char
	    hostEnd = -1;
	    for (var i = 0; i < nonHostChars.length; i++) {
	      var hec = rest.indexOf(nonHostChars[i]);
	      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
	        hostEnd = hec;
	    }
	    // if we still have not hit it, then the entire thing is a host.
	    if (hostEnd === -1)
	      hostEnd = rest.length;
	
	    this.host = rest.slice(0, hostEnd);
	    rest = rest.slice(hostEnd);
	
	    // pull out port.
	    this.parseHost();
	
	    // we've indicated that there is a hostname,
	    // so even if it's empty, it has to be present.
	    this.hostname = this.hostname || '';
	
	    // if hostname begins with [ and ends with ]
	    // assume that it's an IPv6 address.
	    var ipv6Hostname = this.hostname[0] === '[' &&
	        this.hostname[this.hostname.length - 1] === ']';
	
	    // validate a little.
	    if (!ipv6Hostname) {
	      var hostparts = this.hostname.split(/\./);
	      for (var i = 0, l = hostparts.length; i < l; i++) {
	        var part = hostparts[i];
	        if (!part) continue;
	        if (!part.match(hostnamePartPattern)) {
	          var newpart = '';
	          for (var j = 0, k = part.length; j < k; j++) {
	            if (part.charCodeAt(j) > 127) {
	              // we replace non-ASCII char with a temporary placeholder
	              // we need this to make sure size of hostname is not
	              // broken by replacing non-ASCII by nothing
	              newpart += 'x';
	            } else {
	              newpart += part[j];
	            }
	          }
	          // we test again with ASCII char only
	          if (!newpart.match(hostnamePartPattern)) {
	            var validParts = hostparts.slice(0, i);
	            var notHost = hostparts.slice(i + 1);
	            var bit = part.match(hostnamePartStart);
	            if (bit) {
	              validParts.push(bit[1]);
	              notHost.unshift(bit[2]);
	            }
	            if (notHost.length) {
	              rest = '/' + notHost.join('.') + rest;
	            }
	            this.hostname = validParts.join('.');
	            break;
	          }
	        }
	      }
	    }
	
	    if (this.hostname.length > hostnameMaxLen) {
	      this.hostname = '';
	    } else {
	      // hostnames are always lower case.
	      this.hostname = this.hostname.toLowerCase();
	    }
	
	    if (!ipv6Hostname) {
	      // IDNA Support: Returns a punycoded representation of "domain".
	      // It only converts parts of the domain name that
	      // have non-ASCII characters, i.e. it doesn't matter if
	      // you call it with a domain that already is ASCII-only.
	      this.hostname = punycode.toASCII(this.hostname);
	    }
	
	    var p = this.port ? ':' + this.port : '';
	    var h = this.hostname || '';
	    this.host = h + p;
	    this.href += this.host;
	
	    // strip [ and ] from the hostname
	    // the host field still retains them, though
	    if (ipv6Hostname) {
	      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
	      if (rest[0] !== '/') {
	        rest = '/' + rest;
	      }
	    }
	  }
	
	  // now rest is set to the post-host stuff.
	  // chop off any delim chars.
	  if (!unsafeProtocol[lowerProto]) {
	
	    // First, make 100% sure that any "autoEscape" chars get
	    // escaped, even if encodeURIComponent doesn't think they
	    // need to be.
	    for (var i = 0, l = autoEscape.length; i < l; i++) {
	      var ae = autoEscape[i];
	      if (rest.indexOf(ae) === -1)
	        continue;
	      var esc = encodeURIComponent(ae);
	      if (esc === ae) {
	        esc = escape(ae);
	      }
	      rest = rest.split(ae).join(esc);
	    }
	  }
	
	
	  // chop off from the tail first.
	  var hash = rest.indexOf('#');
	  if (hash !== -1) {
	    // got a fragment string.
	    this.hash = rest.substr(hash);
	    rest = rest.slice(0, hash);
	  }
	  var qm = rest.indexOf('?');
	  if (qm !== -1) {
	    this.search = rest.substr(qm);
	    this.query = rest.substr(qm + 1);
	    if (parseQueryString) {
	      this.query = querystring.parse(this.query);
	    }
	    rest = rest.slice(0, qm);
	  } else if (parseQueryString) {
	    // no query string, but parseQueryString still requested
	    this.search = '';
	    this.query = {};
	  }
	  if (rest) this.pathname = rest;
	  if (slashedProtocol[lowerProto] &&
	      this.hostname && !this.pathname) {
	    this.pathname = '/';
	  }
	
	  //to support http.request
	  if (this.pathname || this.search) {
	    var p = this.pathname || '';
	    var s = this.search || '';
	    this.path = p + s;
	  }
	
	  // finally, reconstruct the href based on what has been validated.
	  this.href = this.format();
	  return this;
	};
	
	// format a parsed object into a url string
	function urlFormat(obj) {
	  // ensure it's an object, and not a string url.
	  // If it's an obj, this is a no-op.
	  // this way, you can call url_format() on strings
	  // to clean up potentially wonky urls.
	  if (util.isString(obj)) obj = urlParse(obj);
	  if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
	  return obj.format();
	}
	
	Url.prototype.format = function() {
	  var auth = this.auth || '';
	  if (auth) {
	    auth = encodeURIComponent(auth);
	    auth = auth.replace(/%3A/i, ':');
	    auth += '@';
	  }
	
	  var protocol = this.protocol || '',
	      pathname = this.pathname || '',
	      hash = this.hash || '',
	      host = false,
	      query = '';
	
	  if (this.host) {
	    host = auth + this.host;
	  } else if (this.hostname) {
	    host = auth + (this.hostname.indexOf(':') === -1 ?
	        this.hostname :
	        '[' + this.hostname + ']');
	    if (this.port) {
	      host += ':' + this.port;
	    }
	  }
	
	  if (this.query &&
	      util.isObject(this.query) &&
	      Object.keys(this.query).length) {
	    query = querystring.stringify(this.query);
	  }
	
	  var search = this.search || (query && ('?' + query)) || '';
	
	  if (protocol && protocol.substr(-1) !== ':') protocol += ':';
	
	  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
	  // unless they had them to begin with.
	  if (this.slashes ||
	      (!protocol || slashedProtocol[protocol]) && host !== false) {
	    host = '//' + (host || '');
	    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
	  } else if (!host) {
	    host = '';
	  }
	
	  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
	  if (search && search.charAt(0) !== '?') search = '?' + search;
	
	  pathname = pathname.replace(/[?#]/g, function(match) {
	    return encodeURIComponent(match);
	  });
	  search = search.replace('#', '%23');
	
	  return protocol + host + pathname + search + hash;
	};
	
	function urlResolve(source, relative) {
	  return urlParse(source, false, true).resolve(relative);
	}
	
	Url.prototype.resolve = function(relative) {
	  return this.resolveObject(urlParse(relative, false, true)).format();
	};
	
	function urlResolveObject(source, relative) {
	  if (!source) return relative;
	  return urlParse(source, false, true).resolveObject(relative);
	}
	
	Url.prototype.resolveObject = function(relative) {
	  if (util.isString(relative)) {
	    var rel = new Url();
	    rel.parse(relative, false, true);
	    relative = rel;
	  }
	
	  var result = new Url();
	  var tkeys = Object.keys(this);
	  for (var tk = 0; tk < tkeys.length; tk++) {
	    var tkey = tkeys[tk];
	    result[tkey] = this[tkey];
	  }
	
	  // hash is always overridden, no matter what.
	  // even href="" will remove it.
	  result.hash = relative.hash;
	
	  // if the relative url is empty, then there's nothing left to do here.
	  if (relative.href === '') {
	    result.href = result.format();
	    return result;
	  }
	
	  // hrefs like //foo/bar always cut to the protocol.
	  if (relative.slashes && !relative.protocol) {
	    // take everything except the protocol from relative
	    var rkeys = Object.keys(relative);
	    for (var rk = 0; rk < rkeys.length; rk++) {
	      var rkey = rkeys[rk];
	      if (rkey !== 'protocol')
	        result[rkey] = relative[rkey];
	    }
	
	    //urlParse appends trailing / to urls like http://www.example.com
	    if (slashedProtocol[result.protocol] &&
	        result.hostname && !result.pathname) {
	      result.path = result.pathname = '/';
	    }
	
	    result.href = result.format();
	    return result;
	  }
	
	  if (relative.protocol && relative.protocol !== result.protocol) {
	    // if it's a known url protocol, then changing
	    // the protocol does weird things
	    // first, if it's not file:, then we MUST have a host,
	    // and if there was a path
	    // to begin with, then we MUST have a path.
	    // if it is file:, then the host is dropped,
	    // because that's known to be hostless.
	    // anything else is assumed to be absolute.
	    if (!slashedProtocol[relative.protocol]) {
	      var keys = Object.keys(relative);
	      for (var v = 0; v < keys.length; v++) {
	        var k = keys[v];
	        result[k] = relative[k];
	      }
	      result.href = result.format();
	      return result;
	    }
	
	    result.protocol = relative.protocol;
	    if (!relative.host && !hostlessProtocol[relative.protocol]) {
	      var relPath = (relative.pathname || '').split('/');
	      while (relPath.length && !(relative.host = relPath.shift()));
	      if (!relative.host) relative.host = '';
	      if (!relative.hostname) relative.hostname = '';
	      if (relPath[0] !== '') relPath.unshift('');
	      if (relPath.length < 2) relPath.unshift('');
	      result.pathname = relPath.join('/');
	    } else {
	      result.pathname = relative.pathname;
	    }
	    result.search = relative.search;
	    result.query = relative.query;
	    result.host = relative.host || '';
	    result.auth = relative.auth;
	    result.hostname = relative.hostname || relative.host;
	    result.port = relative.port;
	    // to support http.request
	    if (result.pathname || result.search) {
	      var p = result.pathname || '';
	      var s = result.search || '';
	      result.path = p + s;
	    }
	    result.slashes = result.slashes || relative.slashes;
	    result.href = result.format();
	    return result;
	  }
	
	  var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),
	      isRelAbs = (
	          relative.host ||
	          relative.pathname && relative.pathname.charAt(0) === '/'
	      ),
	      mustEndAbs = (isRelAbs || isSourceAbs ||
	                    (result.host && relative.pathname)),
	      removeAllDots = mustEndAbs,
	      srcPath = result.pathname && result.pathname.split('/') || [],
	      relPath = relative.pathname && relative.pathname.split('/') || [],
	      psychotic = result.protocol && !slashedProtocol[result.protocol];
	
	  // if the url is a non-slashed url, then relative
	  // links like ../.. should be able
	  // to crawl up to the hostname, as well.  This is strange.
	  // result.protocol has already been set by now.
	  // Later on, put the first path part into the host field.
	  if (psychotic) {
	    result.hostname = '';
	    result.port = null;
	    if (result.host) {
	      if (srcPath[0] === '') srcPath[0] = result.host;
	      else srcPath.unshift(result.host);
	    }
	    result.host = '';
	    if (relative.protocol) {
	      relative.hostname = null;
	      relative.port = null;
	      if (relative.host) {
	        if (relPath[0] === '') relPath[0] = relative.host;
	        else relPath.unshift(relative.host);
	      }
	      relative.host = null;
	    }
	    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
	  }
	
	  if (isRelAbs) {
	    // it's absolute.
	    result.host = (relative.host || relative.host === '') ?
	                  relative.host : result.host;
	    result.hostname = (relative.hostname || relative.hostname === '') ?
	                      relative.hostname : result.hostname;
	    result.search = relative.search;
	    result.query = relative.query;
	    srcPath = relPath;
	    // fall through to the dot-handling below.
	  } else if (relPath.length) {
	    // it's relative
	    // throw away the existing file, and take the new path instead.
	    if (!srcPath) srcPath = [];
	    srcPath.pop();
	    srcPath = srcPath.concat(relPath);
	    result.search = relative.search;
	    result.query = relative.query;
	  } else if (!util.isNullOrUndefined(relative.search)) {
	    // just pull out the search.
	    // like href='?foo'.
	    // Put this after the other two cases because it simplifies the booleans
	    if (psychotic) {
	      result.hostname = result.host = srcPath.shift();
	      //occationaly the auth can get stuck only in host
	      //this especially happens in cases like
	      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
	      var authInHost = result.host && result.host.indexOf('@') > 0 ?
	                       result.host.split('@') : false;
	      if (authInHost) {
	        result.auth = authInHost.shift();
	        result.host = result.hostname = authInHost.shift();
	      }
	    }
	    result.search = relative.search;
	    result.query = relative.query;
	    //to support http.request
	    if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
	      result.path = (result.pathname ? result.pathname : '') +
	                    (result.search ? result.search : '');
	    }
	    result.href = result.format();
	    return result;
	  }
	
	  if (!srcPath.length) {
	    // no path at all.  easy.
	    // we've already handled the other stuff above.
	    result.pathname = null;
	    //to support http.request
	    if (result.search) {
	      result.path = '/' + result.search;
	    } else {
	      result.path = null;
	    }
	    result.href = result.format();
	    return result;
	  }
	
	  // if a url ENDs in . or .., then it must get a trailing slash.
	  // however, if it ends in anything else non-slashy,
	  // then it must NOT get a trailing slash.
	  var last = srcPath.slice(-1)[0];
	  var hasTrailingSlash = (
	      (result.host || relative.host || srcPath.length > 1) &&
	      (last === '.' || last === '..') || last === '');
	
	  // strip single dots, resolve double dots to parent dir
	  // if the path tries to go above the root, `up` ends up > 0
	  var up = 0;
	  for (var i = srcPath.length; i >= 0; i--) {
	    last = srcPath[i];
	    if (last === '.') {
	      srcPath.splice(i, 1);
	    } else if (last === '..') {
	      srcPath.splice(i, 1);
	      up++;
	    } else if (up) {
	      srcPath.splice(i, 1);
	      up--;
	    }
	  }
	
	  // if the path is allowed to go above the root, restore leading ..s
	  if (!mustEndAbs && !removeAllDots) {
	    for (; up--; up) {
	      srcPath.unshift('..');
	    }
	  }
	
	  if (mustEndAbs && srcPath[0] !== '' &&
	      (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
	    srcPath.unshift('');
	  }
	
	  if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
	    srcPath.push('');
	  }
	
	  var isAbsolute = srcPath[0] === '' ||
	      (srcPath[0] && srcPath[0].charAt(0) === '/');
	
	  // put the host back
	  if (psychotic) {
	    result.hostname = result.host = isAbsolute ? '' :
	                                    srcPath.length ? srcPath.shift() : '';
	    //occationaly the auth can get stuck only in host
	    //this especially happens in cases like
	    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
	    var authInHost = result.host && result.host.indexOf('@') > 0 ?
	                     result.host.split('@') : false;
	    if (authInHost) {
	      result.auth = authInHost.shift();
	      result.host = result.hostname = authInHost.shift();
	    }
	  }
	
	  mustEndAbs = mustEndAbs || (result.host && srcPath.length);
	
	  if (mustEndAbs && !isAbsolute) {
	    srcPath.unshift('');
	  }
	
	  if (!srcPath.length) {
	    result.pathname = null;
	    result.path = null;
	  } else {
	    result.pathname = srcPath.join('/');
	  }
	
	  //to support request.http
	  if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
	    result.path = (result.pathname ? result.pathname : '') +
	                  (result.search ? result.search : '');
	  }
	  result.auth = relative.auth || result.auth;
	  result.slashes = result.slashes || relative.slashes;
	  result.href = result.format();
	  return result;
	};
	
	Url.prototype.parseHost = function() {
	  var host = this.host;
	  var port = portPattern.exec(host);
	  if (port) {
	    port = port[0];
	    if (port !== ':') {
	      this.port = port.substr(1);
	    }
	    host = host.substr(0, host.length - port.length);
	  }
	  if (host) this.hostname = host;
	};


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module, global) {/*! https://mths.be/punycode v1.3.2 by @mathias */
	;(function(root) {
	
		/** Detect free variables */
		var freeExports = typeof exports == 'object' && exports &&
			!exports.nodeType && exports;
		var freeModule = typeof module == 'object' && module &&
			!module.nodeType && module;
		var freeGlobal = typeof global == 'object' && global;
		if (
			freeGlobal.global === freeGlobal ||
			freeGlobal.window === freeGlobal ||
			freeGlobal.self === freeGlobal
		) {
			root = freeGlobal;
		}
	
		/**
		 * The `punycode` object.
		 * @name punycode
		 * @type Object
		 */
		var punycode,
	
		/** Highest positive signed 32-bit float value */
		maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1
	
		/** Bootstring parameters */
		base = 36,
		tMin = 1,
		tMax = 26,
		skew = 38,
		damp = 700,
		initialBias = 72,
		initialN = 128, // 0x80
		delimiter = '-', // '\x2D'
	
		/** Regular expressions */
		regexPunycode = /^xn--/,
		regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
		regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators
	
		/** Error messages */
		errors = {
			'overflow': 'Overflow: input needs wider integers to process',
			'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
			'invalid-input': 'Invalid input'
		},
	
		/** Convenience shortcuts */
		baseMinusTMin = base - tMin,
		floor = Math.floor,
		stringFromCharCode = String.fromCharCode,
	
		/** Temporary variable */
		key;
	
		/*--------------------------------------------------------------------------*/
	
		/**
		 * A generic error utility function.
		 * @private
		 * @param {String} type The error type.
		 * @returns {Error} Throws a `RangeError` with the applicable error message.
		 */
		function error(type) {
			throw RangeError(errors[type]);
		}
	
		/**
		 * A generic `Array#map` utility function.
		 * @private
		 * @param {Array} array The array to iterate over.
		 * @param {Function} callback The function that gets called for every array
		 * item.
		 * @returns {Array} A new array of values returned by the callback function.
		 */
		function map(array, fn) {
			var length = array.length;
			var result = [];
			while (length--) {
				result[length] = fn(array[length]);
			}
			return result;
		}
	
		/**
		 * A simple `Array#map`-like wrapper to work with domain name strings or email
		 * addresses.
		 * @private
		 * @param {String} domain The domain name or email address.
		 * @param {Function} callback The function that gets called for every
		 * character.
		 * @returns {Array} A new string of characters returned by the callback
		 * function.
		 */
		function mapDomain(string, fn) {
			var parts = string.split('@');
			var result = '';
			if (parts.length > 1) {
				// In email addresses, only the domain name should be punycoded. Leave
				// the local part (i.e. everything up to `@`) intact.
				result = parts[0] + '@';
				string = parts[1];
			}
			// Avoid `split(regex)` for IE8 compatibility. See #17.
			string = string.replace(regexSeparators, '\x2E');
			var labels = string.split('.');
			var encoded = map(labels, fn).join('.');
			return result + encoded;
		}
	
		/**
		 * Creates an array containing the numeric code points of each Unicode
		 * character in the string. While JavaScript uses UCS-2 internally,
		 * this function will convert a pair of surrogate halves (each of which
		 * UCS-2 exposes as separate characters) into a single code point,
		 * matching UTF-16.
		 * @see `punycode.ucs2.encode`
		 * @see <https://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode.ucs2
		 * @name decode
		 * @param {String} string The Unicode input string (UCS-2).
		 * @returns {Array} The new array of code points.
		 */
		function ucs2decode(string) {
			var output = [],
			    counter = 0,
			    length = string.length,
			    value,
			    extra;
			while (counter < length) {
				value = string.charCodeAt(counter++);
				if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
					// high surrogate, and there is a next character
					extra = string.charCodeAt(counter++);
					if ((extra & 0xFC00) == 0xDC00) { // low surrogate
						output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
					} else {
						// unmatched surrogate; only append this code unit, in case the next
						// code unit is the high surrogate of a surrogate pair
						output.push(value);
						counter--;
					}
				} else {
					output.push(value);
				}
			}
			return output;
		}
	
		/**
		 * Creates a string based on an array of numeric code points.
		 * @see `punycode.ucs2.decode`
		 * @memberOf punycode.ucs2
		 * @name encode
		 * @param {Array} codePoints The array of numeric code points.
		 * @returns {String} The new Unicode string (UCS-2).
		 */
		function ucs2encode(array) {
			return map(array, function(value) {
				var output = '';
				if (value > 0xFFFF) {
					value -= 0x10000;
					output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
					value = 0xDC00 | value & 0x3FF;
				}
				output += stringFromCharCode(value);
				return output;
			}).join('');
		}
	
		/**
		 * Converts a basic code point into a digit/integer.
		 * @see `digitToBasic()`
		 * @private
		 * @param {Number} codePoint The basic numeric code point value.
		 * @returns {Number} The numeric value of a basic code point (for use in
		 * representing integers) in the range `0` to `base - 1`, or `base` if
		 * the code point does not represent a value.
		 */
		function basicToDigit(codePoint) {
			if (codePoint - 48 < 10) {
				return codePoint - 22;
			}
			if (codePoint - 65 < 26) {
				return codePoint - 65;
			}
			if (codePoint - 97 < 26) {
				return codePoint - 97;
			}
			return base;
		}
	
		/**
		 * Converts a digit/integer into a basic code point.
		 * @see `basicToDigit()`
		 * @private
		 * @param {Number} digit The numeric value of a basic code point.
		 * @returns {Number} The basic code point whose value (when used for
		 * representing integers) is `digit`, which needs to be in the range
		 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
		 * used; else, the lowercase form is used. The behavior is undefined
		 * if `flag` is non-zero and `digit` has no uppercase form.
		 */
		function digitToBasic(digit, flag) {
			//  0..25 map to ASCII a..z or A..Z
			// 26..35 map to ASCII 0..9
			return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
		}
	
		/**
		 * Bias adaptation function as per section 3.4 of RFC 3492.
		 * http://tools.ietf.org/html/rfc3492#section-3.4
		 * @private
		 */
		function adapt(delta, numPoints, firstTime) {
			var k = 0;
			delta = firstTime ? floor(delta / damp) : delta >> 1;
			delta += floor(delta / numPoints);
			for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
				delta = floor(delta / baseMinusTMin);
			}
			return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
		}
	
		/**
		 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
		 * symbols.
		 * @memberOf punycode
		 * @param {String} input The Punycode string of ASCII-only symbols.
		 * @returns {String} The resulting string of Unicode symbols.
		 */
		function decode(input) {
			// Don't use UCS-2
			var output = [],
			    inputLength = input.length,
			    out,
			    i = 0,
			    n = initialN,
			    bias = initialBias,
			    basic,
			    j,
			    index,
			    oldi,
			    w,
			    k,
			    digit,
			    t,
			    /** Cached calculation results */
			    baseMinusT;
	
			// Handle the basic code points: let `basic` be the number of input code
			// points before the last delimiter, or `0` if there is none, then copy
			// the first basic code points to the output.
	
			basic = input.lastIndexOf(delimiter);
			if (basic < 0) {
				basic = 0;
			}
	
			for (j = 0; j < basic; ++j) {
				// if it's not a basic code point
				if (input.charCodeAt(j) >= 0x80) {
					error('not-basic');
				}
				output.push(input.charCodeAt(j));
			}
	
			// Main decoding loop: start just after the last delimiter if any basic code
			// points were copied; start at the beginning otherwise.
	
			for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {
	
				// `index` is the index of the next character to be consumed.
				// Decode a generalized variable-length integer into `delta`,
				// which gets added to `i`. The overflow checking is easier
				// if we increase `i` as we go, then subtract off its starting
				// value at the end to obtain `delta`.
				for (oldi = i, w = 1, k = base; /* no condition */; k += base) {
	
					if (index >= inputLength) {
						error('invalid-input');
					}
	
					digit = basicToDigit(input.charCodeAt(index++));
	
					if (digit >= base || digit > floor((maxInt - i) / w)) {
						error('overflow');
					}
	
					i += digit * w;
					t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
	
					if (digit < t) {
						break;
					}
	
					baseMinusT = base - t;
					if (w > floor(maxInt / baseMinusT)) {
						error('overflow');
					}
	
					w *= baseMinusT;
	
				}
	
				out = output.length + 1;
				bias = adapt(i - oldi, out, oldi == 0);
	
				// `i` was supposed to wrap around from `out` to `0`,
				// incrementing `n` each time, so we'll fix that now:
				if (floor(i / out) > maxInt - n) {
					error('overflow');
				}
	
				n += floor(i / out);
				i %= out;
	
				// Insert `n` at position `i` of the output
				output.splice(i++, 0, n);
	
			}
	
			return ucs2encode(output);
		}
	
		/**
		 * Converts a string of Unicode symbols (e.g. a domain name label) to a
		 * Punycode string of ASCII-only symbols.
		 * @memberOf punycode
		 * @param {String} input The string of Unicode symbols.
		 * @returns {String} The resulting Punycode string of ASCII-only symbols.
		 */
		function encode(input) {
			var n,
			    delta,
			    handledCPCount,
			    basicLength,
			    bias,
			    j,
			    m,
			    q,
			    k,
			    t,
			    currentValue,
			    output = [],
			    /** `inputLength` will hold the number of code points in `input`. */
			    inputLength,
			    /** Cached calculation results */
			    handledCPCountPlusOne,
			    baseMinusT,
			    qMinusT;
	
			// Convert the input in UCS-2 to Unicode
			input = ucs2decode(input);
	
			// Cache the length
			inputLength = input.length;
	
			// Initialize the state
			n = initialN;
			delta = 0;
			bias = initialBias;
	
			// Handle the basic code points
			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue < 0x80) {
					output.push(stringFromCharCode(currentValue));
				}
			}
	
			handledCPCount = basicLength = output.length;
	
			// `handledCPCount` is the number of code points that have been handled;
			// `basicLength` is the number of basic code points.
	
			// Finish the basic string - if it is not empty - with a delimiter
			if (basicLength) {
				output.push(delimiter);
			}
	
			// Main encoding loop:
			while (handledCPCount < inputLength) {
	
				// All non-basic code points < n have been handled already. Find the next
				// larger one:
				for (m = maxInt, j = 0; j < inputLength; ++j) {
					currentValue = input[j];
					if (currentValue >= n && currentValue < m) {
						m = currentValue;
					}
				}
	
				// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
				// but guard against overflow
				handledCPCountPlusOne = handledCPCount + 1;
				if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
					error('overflow');
				}
	
				delta += (m - n) * handledCPCountPlusOne;
				n = m;
	
				for (j = 0; j < inputLength; ++j) {
					currentValue = input[j];
	
					if (currentValue < n && ++delta > maxInt) {
						error('overflow');
					}
	
					if (currentValue == n) {
						// Represent delta as a generalized variable-length integer
						for (q = delta, k = base; /* no condition */; k += base) {
							t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
							if (q < t) {
								break;
							}
							qMinusT = q - t;
							baseMinusT = base - t;
							output.push(
								stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
							);
							q = floor(qMinusT / baseMinusT);
						}
	
						output.push(stringFromCharCode(digitToBasic(q, 0)));
						bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
						delta = 0;
						++handledCPCount;
					}
				}
	
				++delta;
				++n;
	
			}
			return output.join('');
		}
	
		/**
		 * Converts a Punycode string representing a domain name or an email address
		 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
		 * it doesn't matter if you call it on a string that has already been
		 * converted to Unicode.
		 * @memberOf punycode
		 * @param {String} input The Punycoded domain name or email address to
		 * convert to Unicode.
		 * @returns {String} The Unicode representation of the given Punycode
		 * string.
		 */
		function toUnicode(input) {
			return mapDomain(input, function(string) {
				return regexPunycode.test(string)
					? decode(string.slice(4).toLowerCase())
					: string;
			});
		}
	
		/**
		 * Converts a Unicode string representing a domain name or an email address to
		 * Punycode. Only the non-ASCII parts of the domain name will be converted,
		 * i.e. it doesn't matter if you call it with a domain that's already in
		 * ASCII.
		 * @memberOf punycode
		 * @param {String} input The domain name or email address to convert, as a
		 * Unicode string.
		 * @returns {String} The Punycode representation of the given domain name or
		 * email address.
		 */
		function toASCII(input) {
			return mapDomain(input, function(string) {
				return regexNonASCII.test(string)
					? 'xn--' + encode(string)
					: string;
			});
		}
	
		/*--------------------------------------------------------------------------*/
	
		/** Define the public API */
		punycode = {
			/**
			 * A string representing the current Punycode.js version number.
			 * @memberOf punycode
			 * @type String
			 */
			'version': '1.3.2',
			/**
			 * An object of methods to convert from JavaScript's internal character
			 * representation (UCS-2) to Unicode code points, and back.
			 * @see <https://mathiasbynens.be/notes/javascript-encoding>
			 * @memberOf punycode
			 * @type Object
			 */
			'ucs2': {
				'decode': ucs2decode,
				'encode': ucs2encode
			},
			'decode': decode,
			'encode': encode,
			'toASCII': toASCII,
			'toUnicode': toUnicode
		};
	
		/** Expose `punycode` */
		// Some AMD build optimizers, like r.js, check for specific condition patterns
		// like the following:
		if (
			true
		) {
			!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
				return punycode;
			}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else if (freeExports && freeModule) {
			if (module.exports == freeExports) { // in Node.js or RingoJS v0.8.0+
				freeModule.exports = punycode;
			} else { // in Narwhal or RingoJS v0.7.0-
				for (key in punycode) {
					punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
				}
			}
		} else { // in Rhino or a web browser
			root.punycode = punycode;
		}
	
	}(this));
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(18)(module), (function() { return this; }())))

/***/ },
/* 18 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 19 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = {
	  isString: function(arg) {
	    return typeof(arg) === 'string';
	  },
	  isObject: function(arg) {
	    return typeof(arg) === 'object' && arg !== null;
	  },
	  isNull: function(arg) {
	    return arg === null;
	  },
	  isNullOrUndefined: function(arg) {
	    return arg == null;
	  }
	};


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.decode = exports.parse = __webpack_require__(21);
	exports.encode = exports.stringify = __webpack_require__(22);


/***/ },
/* 21 */
/***/ function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.
	
	'use strict';
	
	// If obj.hasOwnProperty has been overridden, then calling
	// obj.hasOwnProperty(prop) will break.
	// See: https://github.com/joyent/node/issues/1707
	function hasOwnProperty(obj, prop) {
	  return Object.prototype.hasOwnProperty.call(obj, prop);
	}
	
	module.exports = function(qs, sep, eq, options) {
	  sep = sep || '&';
	  eq = eq || '=';
	  var obj = {};
	
	  if (typeof qs !== 'string' || qs.length === 0) {
	    return obj;
	  }
	
	  var regexp = /\+/g;
	  qs = qs.split(sep);
	
	  var maxKeys = 1000;
	  if (options && typeof options.maxKeys === 'number') {
	    maxKeys = options.maxKeys;
	  }
	
	  var len = qs.length;
	  // maxKeys <= 0 means that we should not limit keys count
	  if (maxKeys > 0 && len > maxKeys) {
	    len = maxKeys;
	  }
	
	  for (var i = 0; i < len; ++i) {
	    var x = qs[i].replace(regexp, '%20'),
	        idx = x.indexOf(eq),
	        kstr, vstr, k, v;
	
	    if (idx >= 0) {
	      kstr = x.substr(0, idx);
	      vstr = x.substr(idx + 1);
	    } else {
	      kstr = x;
	      vstr = '';
	    }
	
	    k = decodeURIComponent(kstr);
	    v = decodeURIComponent(vstr);
	
	    if (!hasOwnProperty(obj, k)) {
	      obj[k] = v;
	    } else if (Array.isArray(obj[k])) {
	      obj[k].push(v);
	    } else {
	      obj[k] = [obj[k], v];
	    }
	  }
	
	  return obj;
	};


/***/ },
/* 22 */
/***/ function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.
	
	'use strict';
	
	var stringifyPrimitive = function(v) {
	  switch (typeof v) {
	    case 'string':
	      return v;
	
	    case 'boolean':
	      return v ? 'true' : 'false';
	
	    case 'number':
	      return isFinite(v) ? v : '';
	
	    default:
	      return '';
	  }
	};
	
	module.exports = function(obj, sep, eq, name) {
	  sep = sep || '&';
	  eq = eq || '=';
	  if (obj === null) {
	    obj = undefined;
	  }
	
	  if (typeof obj === 'object') {
	    return Object.keys(obj).map(function(k) {
	      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
	      if (Array.isArray(obj[k])) {
	        return obj[k].map(function(v) {
	          return ks + encodeURIComponent(stringifyPrimitive(v));
	        }).join(sep);
	      } else {
	        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
	      }
	    }).join(sep);
	
	  }
	
	  if (!name) return '';
	  return encodeURIComponent(stringifyPrimitive(name)) + eq +
	         encodeURIComponent(stringifyPrimitive(obj));
	};


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _UtilsWindow = __webpack_require__(24);
	
	var _UtilsWindow2 = _interopRequireDefault(_UtilsWindow);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * Class for working with document
	 */
	var Document = function () {
	    function Document() {
	        _classCallCheck(this, Document);
	    }
	
	    /**
	     * Get document height
	     * @returns {number}
	     */
	    Document.getHeight = function getHeight() {
	        var objWindow = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window;
	
	        if (_UtilsWindow2.default.isWindow(objWindow)) {
	            return Math.max(objWindow.document.body.scrollHeight, objWindow.document.documentElement.scrollHeight, objWindow.document.body.offsetHeight, objWindow.document.documentElement.offsetHeight, objWindow.document.body.clientHeight, objWindow.document.documentElement.clientHeight);
	        } else {
	            return NaN;
	        }
	    };
	    /**
	     * Get document width
	     * @returns {number}
	     */
	
	
	    Document.getWidth = function getWidth() {
	        var objWindow = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window;
	
	        if (_UtilsWindow2.default.isWindow(objWindow)) {
	            return Math.max(objWindow.document.body.scrollWidth, objWindow.document.documentElement.scrollWidth, objWindow.document.body.offsetWidth, objWindow.document.documentElement.offsetWidth, objWindow.document.body.clientWidth, objWindow.document.documentElement.clientWidth);
	        } else {
	            return NaN;
	        }
	    };
	    /**
	     * Get document top scroll
	     * @param objWindow
	     * @return {number}
	     */
	
	
	    Document.getScrollTop = function getScrollTop() {
	        var objWindow = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window;
	
	        if (_UtilsWindow2.default.isWindow(objWindow)) {
	            return objWindow.pageYOffset || objWindow.document.documentElement && objWindow.document.documentElement.scrollTop || objWindow.document.body && objWindow.document.body.scrollTop;
	        } else {
	            return NaN;
	        }
	    };
	    /**
	     * Get document left scroll
	     * @param objWindow
	     * @return {number}
	     */
	
	
	    Document.getScrollLeft = function getScrollLeft() {
	        var objWindow = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window;
	
	        if (_UtilsWindow2.default.isWindow(objWindow)) {
	            return objWindow.pageXOffset || objWindow.document.documentElement && objWindow.document.documentElement.scrollLeft || objWindow.document.body && objWindow.document.body.scrollLeft;
	        } else {
	            return NaN;
	        }
	    };
	    /**
	     * Get document scrolls
	     * @param objWindow
	     * @return {{left: number, top: number}}
	     */
	
	
	    Document.getScroll = function getScroll() {
	        var objWindow = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window;
	
	        if (_UtilsWindow2.default.isWindow(objWindow)) {
	            return {
	                left: Document.getScrollLeft(objWindow),
	                top: Document.getScrollTop(objWindow)
	            };
	        } else {
	            return {
	                left: NaN,
	                top: NaN
	            };
	        }
	    };
	
	    return Document;
	}();
	
	exports.default = Document;

/***/ },
/* 24 */
/***/ function(module, exports) {

	"use strict";
	/**
	 * Class for working with window
	 */
	
	exports.__esModule = true;
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Window = function () {
	    function Window() {
	        _classCallCheck(this, Window);
	    }
	
	    /**
	     * Check if it is window
	     * @param objWindow
	     * @return {boolean}
	     */
	    Window.isWindow = function isWindow(objWindow) {
	        return objWindow && (typeof objWindow === "undefined" ? "undefined" : _typeof(objWindow)) === "object" && objWindow.document && _typeof(objWindow.document) === "object";
	    };
	    /**
	     * Get window height
	     * @param objWindow
	     * @return {number}
	     */
	
	
	    Window.getHeight = function getHeight() {
	        var objWindow = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window;
	
	        if (Window.isWindow(objWindow)) {
	            return objWindow.innerHeight || objWindow.document.documentElement.clientHeight || objWindow.document.body.clientHeight;
	        } else {
	            return NaN;
	        }
	    };
	    /**
	     * Get window width
	     * @param objWindow
	     * @return {number}
	     */
	
	
	    Window.getWidth = function getWidth() {
	        var objWindow = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window;
	
	        if (Window.isWindow(objWindow)) {
	            return objWindow.innerWidth || objWindow.document.documentElement.clientWidth || objWindow.document.body.clientWidth;
	        } else {
	            return NaN;
	        }
	    };
	    /**
	     * Get window sizes
	     * @return {{height: number, width: number}}
	     */
	
	
	    Window.getSizes = function getSizes() {
	        var objWindow = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window;
	
	        return {
	            height: Window.getHeight(objWindow),
	            width: Window.getWidth(objWindow)
	        };
	    };
	
	    return Window;
	}();
	
	exports.default = Window;

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var _Utils = __webpack_require__(11);
	
	var _Utils2 = _interopRequireDefault(_Utils);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * Class for working with DOM
	 */
	var DOM = function () {
	    function DOM() {
	        _classCallCheck(this, DOM);
	    }
	
	    /**
	     * Check if variable is dom document
	     * @param domDocument
	     * @return {boolean}
	     */
	    DOM.isDOMDocument = function isDOMDocument(domDocument) {
	        return !(!domDocument || typeof domDocument === "boolean" || typeof domDocument === "number" || typeof domDocument === "string" || domDocument.nodeType !== 9);
	    };
	    /**
	     * Find and validate Node in DOM Document
	     * @param domNode
	     * @param domDocument
	     * @return {Element | boolean}
	     */
	
	
	    DOM.getDOMNode = function getDOMNode(domNode) {
	        var domDocument = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;
	
	        /**
	         * Check if domDocument is a valid variable
	         */
	        if (!DOM.isDOMDocument(domDocument)) {
	            return false;
	        }
	        /**
	         * Check if domNode is a valid variable
	         */
	        if (!domNode || typeof domNode === "boolean" || typeof domNode === "number" || typeof domNode === "undefined") {
	            return false;
	        }
	        /**
	         * If domNode is a string it might be an ID
	         */
	        if (typeof domNode === "string") {
	            domNode = domDocument.getElementById(domNode);
	        }
	        /**
	         * Check if domNode is a valid variable
	         */
	        if (!domNode || domNode.nodeType !== 1 || !domNode.parentNode || domNode.parentNode.nodeName === "HTML" || !domDocument.contains(domNode)) {
	            return false;
	        }
	        return domNode;
	    };
	    /**
	     * Get element sizes and position
	     * @param domNode
	     * @param domDocument
	     * @param showForce
	     * @return {{bottom: number, height: number, left: number, right: number, top: number, width: number}}
	     */
	
	
	    DOM.getBoundingClientRect = function getBoundingClientRect(domNode) {
	        var domDocument = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;
	        var showForce = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
	
	        /**
	         * Create result size and position object
	         */
	        var objRet = {
	            bottom: 0,
	            height: 0,
	            left: 0,
	            right: 0,
	            top: 0,
	            width: 0
	        };
	        domNode = DOM.getDOMNode(domNode, domDocument);
	        if (!domNode) {
	            _Utils2.default.warn("Utils.DOM.getBoundingClientRect: DOM element doesn't exist in that DOM Document");
	            return objRet;
	        }
	        showForce = !!showForce;
	        var styles = void 0;
	        if (showForce) {
	            styles = getComputedStyle(domNode);
	            if (styles && styles.display === "none") {
	                domNode.style.display = "block";
	            }
	        }
	        /**
	         * If default method is supported than use it
	         */
	        if (domNode.getBoundingClientRect) {
	            objRet = domNode.getBoundingClientRect();
	            /**
	             * IE hack
	             */
	            objRet = {
	                bottom: objRet.bottom,
	                height: objRet.height || domNode.clientHeight,
	                left: objRet.left,
	                right: objRet.right,
	                top: objRet.top,
	                width: objRet.width || domNode.clientWidth
	            };
	        } else {
	            /**
	             * Write the element in a temporary variable
	             */
	            var domElement = domNode;
	            /**
	             * Calculated basic parameters of the element
	             * @type {Object}
	             */
	            var objCoordinates = {
	                height: domElement.offsetHeight,
	                width: domElement.offsetWidth,
	                x: 0,
	                y: 0
	            };
	            /**
	             * Are passed on to all parents and take into account their offsets
	             */
	            while (domElement) {
	                objCoordinates.x += domElement.offsetLeft;
	                objCoordinates.y += domElement.offsetTop;
	                domElement = domElement.offsetParent;
	            }
	            /**
	             *
	             * @type {Object}
	             */
	            objRet = {
	                bottom: objCoordinates.y + objCoordinates.height,
	                height: objCoordinates.height,
	                left: objCoordinates.x,
	                right: objCoordinates.x + objCoordinates.width,
	                top: objCoordinates.y,
	                width: objCoordinates.width
	            };
	        }
	        if (showForce && domNode) {
	            domNode.style.display = "";
	        }
	        /**
	         * Return size and position of the element
	         */
	        return objRet;
	    };
	
	    /**
	     * Find element position
	     * @param domNode
	     * @param domDocument
	     * @param showForce
	     * @return {{top: number, left: number}}
	     */
	    DOM.findElementPosition = function findElementPosition(domNode) {
	        var domDocument = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;
	        var showForce = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
	
	        var objRet = {
	            left: 0,
	            top: 0
	        };
	        domNode = DOM.getDOMNode(domNode, domDocument);
	        if (!domNode) {
	            _Utils2.default.warn("Utils.DOM.findElementPosition: DOM element doesn't exist in that DOM Document");
	            return objRet;
	        }
	        showForce = !!showForce;
	        while (domNode) {
	            var styles = void 0;
	            if (showForce) {
	                styles = window.getComputedStyle(domNode);
	                if (styles && styles.display === "none") {
	                    domNode.style.display = "block";
	                }
	            }
	            objRet.left += domNode.offsetLeft;
	            objRet.top += domNode.offsetTop;
	            domNode = domNode.offsetParent;
	            if (showForce && domNode) {
	                domNode.style.display = "";
	            }
	        }
	        return objRet;
	    };
	    /**
	     * Add event listener
	     * @param obj
	     * @param name
	     * @param func
	     */
	
	
	    DOM.addEvent = function addEvent(obj, name, func) {
	        if (obj && (typeof obj === "undefined" ? "undefined" : _typeof(obj)) === "object" && typeof name === "string" && typeof func === "function") {
	            if (obj.addEventListener) {
	                obj.addEventListener(name, func, false);
	            } else if (obj.attachEvent) {
	                obj.attachEvent("on" + name, func);
	            }
	            return true;
	        } else {
	            return false;
	        }
	    };
	    /**
	     * Remove event listener
	     * @param obj
	     * @param name
	     * @param func
	     */
	
	
	    DOM.removeEvent = function removeEvent(obj, name, func) {
	        if (obj && (typeof obj === "undefined" ? "undefined" : _typeof(obj)) === "object" && typeof name === "string" && typeof func === "function") {
	            if (obj.removeEventListener) {
	                obj.removeEventListener(name, func, false);
	            } else if (obj.detachEvent) {
	                obj.detachEvent("on" + name, func);
	            }
	            return true;
	        } else {
	            return false;
	        }
	    };
	    /**
	     * Check if element has class name
	     * @param element
	     * @param className
	     * @return {boolean}
	     */
	
	
	    DOM.hasClassName = function hasClassName(element, className) {
	        if (element && (typeof element === "undefined" ? "undefined" : _typeof(element)) === "object" && typeof className === "string" && element.nodeType === 1) {
	            className = className.trim();
	            return (" " + element.className + " ").indexOf(" " + className + " ") !== -1;
	        } else {
	            return false;
	        }
	    };
	    /**
	     * Add class name
	     * @param element
	     * @param className
	     * @return {HTMLElement}
	     */
	
	
	    DOM.addClassName = function addClassName(element, className) {
	        if (element && (typeof element === "undefined" ? "undefined" : _typeof(element)) === "object" && typeof className === "string" && element.nodeType === 1) {
	            className = className.trim();
	            if (!DOM.hasClassName(element, className)) {
	                var cl = element.className;
	                element.className = cl ? cl + " " + className : className;
	            }
	            return element;
	        } else {
	            return null;
	        }
	    };
	    /**
	     * Remove class name
	     * @param element
	     * @param className
	     * @return {HTMLElement}
	     */
	
	
	    DOM.removeClassName = function removeClassName(element, className) {
	        if (element && (typeof element === "undefined" ? "undefined" : _typeof(element)) === "object" && typeof className === "string" && element.nodeType === 1 && typeof element.className === "string") {
	            className = className.trim();
	            var classes = element.className.trim().split(" ");
	            for (var i = classes.length - 1; i >= 0; i--) {
	                classes[i] = classes[i].trim();
	                if (!classes[i] || classes[i] === className) {
	                    classes.splice(i, 1);
	                }
	            }
	            element.className = classes.join(" ");
	            return element;
	        } else {
	            return null;
	        }
	    };
	    /**
	     * Toggle class name
	     * @param element
	     * @param className
	     * @param toggle
	     * @return {HTMLElement}
	     */
	
	
	    DOM.toggleClassName = function toggleClassName(element, className, toggle) {
	        if (element && (typeof element === "undefined" ? "undefined" : _typeof(element)) === "object" && typeof className === "string" && typeof toggle === "boolean" && element.nodeType === 1) {
	            className = className.trim();
	            if (toggle) {
	                DOM.addClassName(element, className);
	            } else {
	                DOM.removeClassName(element, className);
	            }
	            return element;
	        } else {
	            return null;
	        }
	    };
	    /**
	     * Replace class name
	     * @param element
	     * @param oldClassName
	     * @param newClassName
	     * @return {HTMLElement}
	     */
	
	
	    DOM.replaceClass = function replaceClass(element, oldClassName, newClassName) {
	        if (element && (typeof element === "undefined" ? "undefined" : _typeof(element)) === "object" && typeof oldClassName === "string" && typeof newClassName === "string" && element.nodeType === 1) {
	            oldClassName = oldClassName.trim();
	            newClassName = newClassName.trim();
	            DOM.removeClassName(element, oldClassName);
	            DOM.addClassName(element, newClassName);
	            return element;
	        } else {
	            return null;
	        }
	    };
	    /**
	     * Get element by tag name and index
	     * @param tn
	     * @param domDocument
	     * @param index
	     * @return {Node}
	     */
	
	
	    DOM.getElementByTagName = function getElementByTagName(tn) {
	        var domDocument = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;
	        var index = arguments[2];
	
	        if (typeof tn === "string" && DOM.isDOMDocument(domDocument) && typeof index === "number") {
	            var els = domDocument.getElementsByTagName(tn);
	            return els[index] || null;
	        } else {
	            return null;
	        }
	    };
	    /**
	     * Get line height
	     * @return {number}
	     */
	
	
	    DOM.getLineHeight = function getLineHeight() {
	        var styles = getComputedStyle(document.body);
	        var lineHeight = styles.lineHeight;
	        var lineHeightDig = parseInt(lineHeight, 10);
	        var fontSize = styles.fontSize;
	        var fontSizeDig = parseInt(fontSize, 10);
	        if (isFinite(lineHeightDig)) {
	            return lineHeightDig;
	        } else {
	            return fontSizeDig;
	        }
	    };
	
	    return DOM;
	}();
	
	exports.default = DOM;

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	/**
	 * Import additional classes
	 */
	
	exports.__esModule = true;
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var _UtilsDOM = __webpack_require__(25);
	
	var _UtilsDOM2 = _interopRequireDefault(_UtilsDOM);
	
	var _UtilsWindow = __webpack_require__(24);
	
	var _UtilsWindow2 = _interopRequireDefault(_UtilsWindow);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Mouse = function () {
	    function Mouse() {
	        _classCallCheck(this, Mouse);
	    }
	
	    /**
	     * Normalise mouse delta
	     * @param e
	     * @return {number}
	     */
	    Mouse.getWheelDelta = function getWheelDelta(e) {
	        if (e && (typeof e === "undefined" ? "undefined" : _typeof(e)) === "object" && ("detail" in e || "wheelDelta" in e || "wheelDeltaY" in e || "wheelDeltaX" in e || "deltaY" in e || "deltaX" in e || "axis" in e || "deltaMode" in e)) {
	            var delta = void 0;
	            var deltaX = void 0;
	            var deltaY = void 0;
	            // Old school scrollwheel delta
	            if ("detail" in e) {
	                deltaY = e.detail * -1;
	            }
	            if ("wheelDelta" in e) {
	                deltaY = e.wheelDelta;
	            }
	            if ("wheelDeltaY" in e) {
	                deltaY = e.wheelDeltaY;
	            }
	            if ("wheelDeltaX" in e) {
	                deltaX = e.wheelDeltaX * -1;
	            }
	            // Firefox < 17 horizontal scrolling related to DOMMouseScroll event
	            if ("axis" in e && e.axis === e.HORIZONTAL_AXIS) {
	                deltaX = deltaY * -1;
	                deltaY = 0;
	            }
	            // New school wheel delta (wheel event)
	            if ("deltaY" in e) {
	                deltaY = e.deltaY * -1;
	            }
	            if ("deltaX" in e) {
	                deltaX = e.deltaX;
	            }
	            // Need to convert lines and pages to pixels if we aren"t already in pixels
	            // There are three delta modes:
	            //   * deltaMode 0 is by pixels, nothing to do
	            //   * deltaMode 1 is by lines
	            //   * deltaMode 2 is by pages
	            if (e.deltaMode === 1) {
	                var lineHeight = _UtilsDOM2.default.getLineHeight();
	                deltaY = deltaY * lineHeight;
	                deltaX = deltaX * lineHeight;
	            } else if (e.deltaMode === 2) {
	                var windowhegiht = _UtilsWindow2.default.getHeight();
	                deltaY = deltaY * windowhegiht;
	                deltaX = deltaX * windowhegiht;
	            }
	            delta = deltaY === 0 ? deltaX : deltaY;
	            return delta;
	        } else {
	            return NaN;
	        }
	    };
	
	    return Mouse;
	}();
	
	exports.default = Mouse;

/***/ },
/* 27 */
/***/ function(module, exports) {

	"use strict";
	/**
	 * Class for working with screen
	 */
	
	exports.__esModule = true;
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Screen = function () {
	    function Screen() {
	        _classCallCheck(this, Screen);
	    }
	
	    /**
	     * Get screen info
	     * @return {{availableSize: {height: number, width: number}, colorDepth: number, pixelRatio: number, size: {height: number, width: number}}}
	     */
	    Screen.getInfo = function getInfo() {
	        return {
	            availableSize: Screen.getAvailableSizes(),
	            colorDepth: Screen.getColorDepth(),
	            pixelRatio: Screen.getPixelRatio(),
	            size: Screen.getSizes()
	        };
	    };
	    /**
	     * Get screen height
	     * @returns {number}
	     */
	
	
	    Screen.getHeight = function getHeight() {
	        return screen.height;
	    };
	    /**
	     * Get screen width
	     * @returns {number}
	     */
	
	
	    Screen.getWidth = function getWidth() {
	        return screen.width;
	    };
	    /**
	     * Get screen sizes
	     * @return {{height: number, width: number}}
	     */
	
	
	    Screen.getSizes = function getSizes() {
	        return {
	            height: Screen.getHeight(),
	            width: Screen.getWidth()
	        };
	    };
	    /**
	     * Get screen height
	     * @returns {number}
	     */
	
	
	    Screen.getAvailableHeight = function getAvailableHeight() {
	        return screen.availHeight;
	    };
	    /**
	     * Get screen width
	     * @returns {number}
	     */
	
	
	    Screen.getAvailableWidth = function getAvailableWidth() {
	        return screen.availWidth;
	    };
	    /**
	     * Get screen sizes
	     * @return {{height: number, width: number}}
	     */
	
	
	    Screen.getAvailableSizes = function getAvailableSizes() {
	        return {
	            height: Screen.getAvailableHeight(),
	            width: Screen.getAvailableWidth()
	        };
	    };
	    /**
	     * Get screen pixel ratio
	     * @return {number}
	     */
	
	
	    Screen.getPixelRatio = function getPixelRatio() {
	        var ratio = 1;
	        if (typeof window.screen.systemXDPI !== "undefined" && typeof window.screen.logicalXDPI !== "undefined" && window.screen.systemXDPI > window.screen.logicalXDPI) {
	            ratio = window.screen.systemXDPI / window.screen.logicalXDPI;
	        } else if (typeof window.devicePixelRatio !== "undefined") {
	            ratio = window.devicePixelRatio;
	        }
	        return ratio;
	    };
	    /**
	     * Get screen color depth
	     * @return {number}
	     */
	
	
	    Screen.getColorDepth = function getColorDepth() {
	        return screen.colorDepth;
	    };
	
	    return Screen;
	}();
	
	exports.default = Screen;

/***/ },
/* 28 */
/***/ function(module, exports) {

	"use strict";
	/**
	 * Class for working with system
	 */
	
	exports.__esModule = true;
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var System = function () {
	    function System() {
	        _classCallCheck(this, System);
	    }
	
	    /**
	     * Get system info
	     * @return {{name: string, version: string}}
	     */
	    System.getInfo = function getInfo() {
	        return {
	            name: System.getName(),
	            version: System.getVersion()
	        };
	    };
	    /**
	     * Get OS name
	     * @return {string}
	     */
	
	
	    System.getName = function getName() {
	        var os = "";
	        var clientStrings = [{
	            r: /(Windows 10.0|Windows NT 10.0)/,
	            s: "Windows 10"
	        }, {
	            r: /(Windows 8.1|Windows NT 6.3)/,
	            s: "Windows 8.1"
	        }, {
	            r: /(Windows 8|Windows NT 6.2)/,
	            s: "Windows 8"
	        }, {
	            r: /(Windows 7|Windows NT 6.1)/,
	            s: "Windows 7"
	        }, {
	            r: /Windows NT 6.0/,
	            s: "Windows Vista"
	        }, {
	            r: /Windows NT 5.2/,
	            s: "Windows Server 2003"
	        }, {
	            r: /(Windows NT 5.1|Windows XP)/,
	            s: "Windows XP"
	        }, {
	            r: /(Windows NT 5.0|Windows 2000)/,
	            s: "Windows 2000"
	        }, {
	            r: /(Win 9x 4.90|Windows ME)/,
	            s: "Windows ME"
	        }, {
	            r: /(Windows 98|Win98)/,
	            s: "Windows 98"
	        }, {
	            r: /(Windows 95|Win95|Windows_95)/,
	            s: "Windows 95"
	        }, {
	            r: /(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/,
	            s: "Windows NT 4.0"
	        }, {
	            r: /Windows CE/,
	            s: "Windows CE"
	        }, {
	            r: /Win16/,
	            s: "Windows 3.11"
	        }, {
	            r: /Android/,
	            s: "Android"
	        }, {
	            r: /OpenBSD/,
	            s: "Open BSD"
	        }, {
	            r: /SunOS/,
	            s: "Sun OS"
	        }, {
	            r: /(Linux|X11)/,
	            s: "Linux"
	        }, {
	            r: /(iPhone|iPad|iPod)/,
	            s: "iOS"
	        }, {
	            r: /Mac OS X/,
	            s: "Mac OS X"
	        }, {
	            r: /(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/,
	            s: "Mac OS"
	        }, {
	            r: /QNX/,
	            s: "QNX"
	        }, {
	            r: /UNIX/,
	            s: "UNIX"
	        }, {
	            r: /BeOS/,
	            s: "BeOS"
	        }, {
	            r: /OS\/2/,
	            s: "OS/2"
	        }, {
	            r: /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/,
	            s: "Search Bot"
	        }];
	        for (var _iterator = clientStrings, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
	            var _ref;
	
	            if (_isArray) {
	                if (_i >= _iterator.length) break;
	                _ref = _iterator[_i++];
	            } else {
	                _i = _iterator.next();
	                if (_i.done) break;
	                _ref = _i.value;
	            }
	
	            var cs = _ref;
	
	            if (cs.r.test(navigator.userAgent)) {
	                os = cs.s;
	                break;
	            }
	        }
	        return os;
	    };
	    /**
	     * Get OS version
	     * @return {string}
	     */
	
	
	    System.getVersion = function getVersion() {
	        var os = System.getName();
	        var osVersion = "";
	        if (/Windows/.test(os)) {
	            osVersion = /Windows (.*)/.exec(os)[1];
	            os = "Windows";
	        }
	        switch (os) {
	            case "Mac OS X":
	                osVersion = /Mac OS X (10[._\d]+)/.exec(navigator.userAgent)[1];
	                break;
	            case "Android":
	                osVersion = /Android ([._\d]+)/.exec(navigator.userAgent)[1];
	                break;
	            case "iOS":
	                var reg = /OS (\d+)_(\d+)_?(\d+)?/.exec(navigator.appVersion);
	                osVersion = reg[1] + "." + reg[2] + "." + (reg[3] || 0);
	                break;
	            default:
	        }
	        return osVersion;
	    };
	
	    return System;
	}();
	
	exports.default = System;

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	/**
	 * Class for working with user
	 */
	
	exports.__esModule = true;
	
	var _UtilsBrowser = __webpack_require__(14);
	
	var _UtilsBrowser2 = _interopRequireDefault(_UtilsBrowser);
	
	var _UtilsScreen = __webpack_require__(27);
	
	var _UtilsScreen2 = _interopRequireDefault(_UtilsScreen);
	
	var _UtilsSystem = __webpack_require__(28);
	
	var _UtilsSystem2 = _interopRequireDefault(_UtilsSystem);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var User = function () {
	    function User() {
	        _classCallCheck(this, User);
	    }
	
	    /**
	     * Get user info
	     * @return {{browser: {browser: string, mobile: boolean, version: string}, screen: {availableSize: {height: number, width: number}, colorDepth: number, pixelRatio: number, size: {height: number, width: number}}, system: {name: string, version: string}}}
	     */
	    User.getInfo = function getInfo() {
	        return {
	            browser: _UtilsBrowser2.default.getInfo(),
	            screen: _UtilsScreen2.default.getInfo(),
	            system: _UtilsSystem2.default.getInfo()
	        };
	    };
	
	    return User;
	}();
	
	exports.default = User;

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _AnimationFrame = __webpack_require__(31);
	
	var _AnimationFrame2 = _interopRequireDefault(_AnimationFrame);
	
	var _Cookies = __webpack_require__(32);
	
	var _Cookies2 = _interopRequireDefault(_Cookies);
	
	var _DOMStorage = __webpack_require__(33);
	
	var _DOMStorage2 = _interopRequireDefault(_DOMStorage);
	
	var _GlobalStorage = __webpack_require__(34);
	
	var _GlobalStorage2 = _interopRequireDefault(_GlobalStorage);
	
	var _LocalStorage = __webpack_require__(35);
	
	var _LocalStorage2 = _interopRequireDefault(_LocalStorage);
	
	var _SessionStorage = __webpack_require__(36);
	
	var _SessionStorage2 = _interopRequireDefault(_SessionStorage);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	/**
	 * Import storages
	 */
	
	
	/**
	 * EverCookie storage
	 */
	var EverCookie = function () {
	  /**
	   * The constructor should accept a hash to separate the scopes of storage
	   * @param hash {string}
	   */
	  function EverCookie(hash) {
	    _classCallCheck(this, EverCookie);
	
	    this.regValidKey = new RegExp("([a-zA-Z0-9_-]{0,})", "i");
	    /**
	     * Generate hash
	     * @type {string}
	     */
	    this.hash = hash || location.hostname;
	    /**
	     * Initialise stores
	     * @type {Array}
	     */
	    this.stores = [];
	    if (typeof _Cookies2.default !== "undefined") {
	      this.stores.push(new _Cookies2.default(this.hash));
	    }
	    if (typeof _GlobalStorage2.default !== "undefined") {
	      this.stores.push(new _GlobalStorage2.default(this.hash));
	    }
	    if (typeof _LocalStorage2.default !== "undefined") {
	      this.stores.push(new _LocalStorage2.default(this.hash));
	    }
	    if (typeof _SessionStorage2.default !== "undefined") {
	      this.stores.push(new _SessionStorage2.default(this.hash));
	    }
	    if (typeof _DOMStorage2.default !== "undefined") {
	      this.stores.push(new _DOMStorage2.default(this.hash));
	    }
	    for (var i = 0; i < this.stores.length; i++) {
	      if (!this.stores[i].isSupported()) {
	        this.stores.splice(i, 1);
	      }
	    }
	    /**
	     * Set self refresh flag
	     * @type {boolean}
	     */
	    this.stopRefresh = false;
	    /**
	     * Self refresh
	     */
	    if (this.isSupported()) {
	      this.refreshID = _AnimationFrame2.default.subscribe(this, this.refresh, []);
	    }
	  }
	  /**
	   * The method returns the flag whether supported this storage type or not
	   * @returns {boolean}
	   */
	
	
	  EverCookie.prototype.isSupported = function isSupported() {
	    return this.stores && this.stores.length > 0;
	  };
	  /**
	   * The method sets the value and returns true if it has been set
	   * @param checkSupport {boolean}
	   * @param key {string}
	   * @param value {string}
	   * @returns {boolean}
	   */
	
	
	  EverCookie.prototype.setItem = function setItem() {
	    var checkSupport = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
	    var key = arguments[1];
	    var value = arguments[2];
	
	    /**
	     * Set result flag as true
	     * @type {boolean}
	     */
	    var booResult = true;
	    /**
	     * Stop self refresh process
	     * @type {boolean}
	     */
	    this.stopRefresh = true;
	    try {
	      /**
	       * Validate input data
	       */
	      if (typeof checkSupport === "boolean" && typeof key === "string" && this.regValidKey.test(key) && typeof value === "string" && (value === "" || this.regValidKey.test(value))) {
	        /**
	         * If that store is supported
	         */
	        if (!checkSupport || this.isSupported()) {
	          /**
	           * Initialise store result array
	           * @type {Array}
	           */
	          var arResults = [];
	          /**
	           * Iterate through all supported stores
	           */
	          for (var _iterator = this.stores, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
	            var _ref;
	
	            if (_isArray) {
	              if (_i >= _iterator.length) break;
	              _ref = _iterator[_i++];
	            } else {
	              _i = _iterator.next();
	              if (_i.done) break;
	              _ref = _i.value;
	            }
	
	            var store = _ref;
	
	            /**
	             * Write store operation result to result array
	             */
	            arResults.push(store.setItem(false, key, value));
	          }
	          /**
	           * If there exist result and one of them is true, it is means, that value was set
	           * @type {boolean}
	           */
	          booResult = arResults.length > 0 && arResults.indexOf(true) !== -1;
	        } else {
	          /**
	           * If stores does not supported, value can be set
	           * @type {boolean}
	           */
	          booResult = false;
	        }
	      } else {
	        /**
	         * If input data is not valid
	         */
	        booResult = false;
	      }
	    } catch (e) {
	      /**
	       * If something goes wrong, value can be set
	       * @type {boolean}
	       */
	      booResult = false;
	    }
	    /**
	     * Start self refresh process
	     * @type {boolean}
	     */
	    this.stopRefresh = false;
	    /**
	     * Return set item status
	     */
	    return booResult;
	  };
	  /**
	   * The method reads the value and returns it or returns false if the value does not exist
	   * @param checkSupport {boolean}
	   * @param key {string}
	   * @returns {string|boolean}
	   */
	
	
	  EverCookie.prototype.getItem = function getItem() {
	    var checkSupport = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
	    var key = arguments[1];
	
	    /**
	     * Set result flag as true
	     * @type {boolean|string}
	     */
	    var booResult = false;
	    /**
	     * Stop self refresh process
	     * @type {boolean}
	     */
	    this.stopRefresh = true;
	    try {
	      /**
	       * Validate input data
	       */
	      if (typeof checkSupport === "boolean" && typeof key === "string" && this.regValidKey.test(key)) {
	        /**
	         * If that store is supported
	         */
	        if (!checkSupport || this.isSupported()) {
	          /**
	           * Initialise temporary store result array
	           * @type {string[]}
	           */
	          var localArrResults = [];
	          /**
	           * Iterate through all supported stores
	           */
	          for (var _iterator2 = this.stores, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
	            var _ref2;
	
	            if (_isArray2) {
	              if (_i2 >= _iterator2.length) break;
	              _ref2 = _iterator2[_i2++];
	            } else {
	              _i2 = _iterator2.next();
	              if (_i2.done) break;
	              _ref2 = _i2.value;
	            }
	
	            var store = _ref2;
	
	            var value = store.getItem(false, key);
	            /**
	             * If store has this value
	             */
	            if (value) {
	              /**
	               * Write store operation result to result array
	               */
	              localArrResults.push(value);
	            }
	          }
	          /**
	           * Initialise store result array
	           * @type {Object}
	           */
	          var arResults = {};
	          var numMax = 0;
	          /**
	           * Looking for the most frequently mentioned result
	           */
	          for (var _iterator3 = localArrResults, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
	            var _ref3;
	
	            if (_isArray3) {
	              if (_i3 >= _iterator3.length) break;
	              _ref3 = _iterator3[_i3++];
	            } else {
	              _i3 = _iterator3.next();
	              if (_i3.done) break;
	              _ref3 = _i3.value;
	            }
	
	            var i = _ref3;
	
	            if (!arResults[i]) {
	              arResults[i] = 0;
	            }
	            arResults[i]++;
	            if (arResults[i] > numMax) {
	              numMax = arResults[i];
	              booResult = i;
	            }
	          }
	        } else {
	          /**
	           * If stores does not supported, value can be set
	           * @type {boolean}
	           */
	          booResult = false;
	        }
	      } else {
	        /**
	         * If input data is not valid
	         */
	        booResult = false;
	      }
	    } catch (e) {
	      /**
	       * If something goes wrong, value can be set
	       * @type {boolean}
	       */
	      booResult = false;
	    }
	    /**
	     * Start self refresh process
	     * @type {boolean}
	     */
	    this.stopRefresh = false;
	    /**
	     * Return set item status
	     */
	    return booResult;
	  };
	  /**
	   * The method removes the value and return true if the value does not exist
	   * @param checkSupport {boolean}
	   * @param key {string}
	   * @returns {boolean}
	   */
	
	
	  EverCookie.prototype.removeItem = function removeItem() {
	    var checkSupport = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
	    var key = arguments[1];
	
	    /**
	     * Set result flag as true
	     * @type {boolean}
	     */
	    var booResult = true;
	    /**
	     * Stop self refresh process
	     * @type {boolean}
	     */
	    this.stopRefresh = true;
	    try {
	      /**
	       * Validate input data
	       */
	      if (typeof checkSupport === "boolean" && typeof key === "string" && this.regValidKey.test(key)) {
	        /**
	         * If that store is supported
	         */
	        if (!checkSupport || this.isSupported()) {
	          /**
	           * Initialise store result counter
	           * @type {number}
	           */
	          var arResult = 0;
	          /**
	           * Iterate through all supported stores
	           */
	          for (var _iterator4 = this.stores, _isArray4 = Array.isArray(_iterator4), _i4 = 0, _iterator4 = _isArray4 ? _iterator4 : _iterator4[Symbol.iterator]();;) {
	            var _ref4;
	
	            if (_isArray4) {
	              if (_i4 >= _iterator4.length) break;
	              _ref4 = _iterator4[_i4++];
	            } else {
	              _i4 = _iterator4.next();
	              if (_i4.done) break;
	              _ref4 = _i4.value;
	            }
	
	            var store = _ref4;
	
	            /**
	             * If store supported (Not required, the stores is checked during initialization)
	             */
	            arResult += 1 * store.removeItem(false, key);
	          }
	          /**
	           * If removed count equal to stores count
	           * @type {boolean}
	           */
	          booResult = arResult === this.stores.length;
	        } else {
	          /**
	           * If stores does not supported, value can be set
	           * @type {boolean}
	           */
	          booResult = false;
	        }
	      } else {
	        /**
	         * If input data is not valid
	         */
	        booResult = false;
	      }
	    } catch (e) {
	      /**
	       * If something goes wrong, value can be set
	       * @type {boolean}
	       */
	      booResult = false;
	    }
	    /**
	     * Start self refresh process
	     * @type {boolean}
	     */
	    this.stopRefresh = false;
	    /**
	     * Return set item status
	     */
	    return booResult;
	  };
	  /**
	   * The method returns the array of string of available keys
	   * @param checkSupport {boolean}
	   * @returns {string[]}
	   */
	
	
	  EverCookie.prototype.getKeys = function getKeys() {
	    var checkSupport = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
	
	    /**
	     * Set result flag as true
	     * @type {Object}
	     */
	    var booResult = {};
	    /**
	     * Stop self refresh process
	     * @type {boolean}
	     */
	    this.stopRefresh = true;
	    try {
	      /**
	       * Validate input data
	       */
	      if (typeof checkSupport === "boolean") {
	        /**
	         * If that store is supported
	         */
	        if (!checkSupport || this.isSupported()) {
	          /**
	           * Iterate through all supported stores
	           */
	          for (var _iterator5 = this.stores, _isArray5 = Array.isArray(_iterator5), _i5 = 0, _iterator5 = _isArray5 ? _iterator5 : _iterator5[Symbol.iterator]();;) {
	            var _ref5;
	
	            if (_isArray5) {
	              if (_i5 >= _iterator5.length) break;
	              _ref5 = _iterator5[_i5++];
	            } else {
	              _i5 = _iterator5.next();
	              if (_i5.done) break;
	              _ref5 = _i5.value;
	            }
	
	            var store = _ref5;
	
	            var value = store.getKeys(false);
	            if (value.length > 0) {
	              for (var _iterator6 = value, _isArray6 = Array.isArray(_iterator6), _i6 = 0, _iterator6 = _isArray6 ? _iterator6 : _iterator6[Symbol.iterator]();;) {
	                var _ref6;
	
	                if (_isArray6) {
	                  if (_i6 >= _iterator6.length) break;
	                  _ref6 = _iterator6[_i6++];
	                } else {
	                  _i6 = _iterator6.next();
	                  if (_i6.done) break;
	                  _ref6 = _i6.value;
	                }
	
	                var i = _ref6;
	
	                booResult[i] = true;
	              }
	            }
	          }
	        } else {
	          /**
	           * If stores does not supported, value can be set
	           * @type {Object}
	           */
	          booResult = {};
	        }
	      } else {
	        /**
	         * If input data is not valid
	         */
	        booResult = {};
	      }
	    } catch (e) {
	      /**
	       * If something goes wrong, value can be set
	       * @type {Object}
	       */
	      booResult = {};
	    }
	    /**
	     * Start self refresh process
	     * @type {boolean}
	     */
	    this.stopRefresh = false;
	    /**
	     * Return set item status
	     */
	    return Object.keys(booResult);
	  };
	  /**
	   * The method cleans the storage and return true if it is empty
	   * @param checkSupport {boolean}
	   * @returns {boolean}
	   */
	
	
	  EverCookie.prototype.clear = function clear() {
	    var checkSupport = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
	
	    /**
	     * Set result flag as true
	     * @type {boolean}
	     */
	    var booResult = true;
	    /**
	     * Stop self refresh process
	     * @type {boolean}
	     */
	    this.stopRefresh = true;
	    try {
	      /**
	       * Validate input data
	       */
	      if (typeof checkSupport === "boolean") {
	        /**
	         * If that store is supported
	         */
	        if (!checkSupport || this.isSupported()) {
	          /**
	           * Initialise store result counter
	           * @type {number}
	           */
	          var arResult = 0;
	          /**
	           * Iterate through all supported stores
	           */
	          for (var _iterator7 = this.stores, _isArray7 = Array.isArray(_iterator7), _i7 = 0, _iterator7 = _isArray7 ? _iterator7 : _iterator7[Symbol.iterator]();;) {
	            var _ref7;
	
	            if (_isArray7) {
	              if (_i7 >= _iterator7.length) break;
	              _ref7 = _iterator7[_i7++];
	            } else {
	              _i7 = _iterator7.next();
	              if (_i7.done) break;
	              _ref7 = _i7.value;
	            }
	
	            var store = _ref7;
	
	            arResult += 1 * store.clear(false);
	          }
	          /**
	           * If removed count equal to stores count
	           * @type {boolean}
	           */
	          booResult = arResult === this.stores.length;
	        } else {
	          /**
	           * If stores does not supported, value can be set
	           * @type {boolean}
	           */
	          booResult = false;
	        }
	      } else {
	        /**
	         * If input data is not valid
	         */
	        booResult = false;
	      }
	    } catch (e) {
	      /**
	       * If something goes wrong, value can be set
	       * @type {boolean}
	       */
	      booResult = false;
	    }
	    /**
	     * Start self refresh process
	     * @type {boolean}
	     */
	    this.stopRefresh = false;
	    /**
	     * Return set item status
	     */
	    return booResult;
	  };
	  /**
	   * Self refresh
	   */
	
	
	  EverCookie.prototype.refresh = function refresh() {
	    if (!this.stopRefresh) {
	      var arrKeys = this.getKeys(false);
	      for (var _iterator8 = arrKeys, _isArray8 = Array.isArray(_iterator8), _i8 = 0, _iterator8 = _isArray8 ? _iterator8 : _iterator8[Symbol.iterator]();;) {
	        var _ref8;
	
	        if (_isArray8) {
	          if (_i8 >= _iterator8.length) break;
	          _ref8 = _iterator8[_i8++];
	        } else {
	          _i8 = _iterator8.next();
	          if (_i8.done) break;
	          _ref8 = _i8.value;
	        }
	
	        var key = _ref8;
	
	        var value = this.getItem(false, key);
	        /**
	         * Iterate through all supported stores
	         */
	        for (var _iterator9 = this.stores, _isArray9 = Array.isArray(_iterator9), _i9 = 0, _iterator9 = _isArray9 ? _iterator9 : _iterator9[Symbol.iterator]();;) {
	          var _ref9;
	
	          if (_isArray9) {
	            if (_i9 >= _iterator9.length) break;
	            _ref9 = _iterator9[_i9++];
	          } else {
	            _i9 = _iterator9.next();
	            if (_i9.done) break;
	            _ref9 = _i9.value;
	          }
	
	          var store = _ref9;
	
	          if (value !== store.getItem(false, key)) {
	            store.setItem(false, key, value.toString());
	          }
	        }
	      }
	    }
	  };
	  /**
	   * Stop every cookie
	   */
	
	
	  EverCookie.prototype.destroy = function destroy() {
	    _AnimationFrame2.default.unsubscribe(this.refreshID);
	    this.stopRefresh = true;
	    this.refresh = function () {
	      return null;
	    };
	    this.stores = [];
	    return true;
	  };
	
	  return EverCookie;
	}();
	
	exports.default = EverCookie;
	
	module.exports = EverCookie;

/***/ },
/* 31 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {"use strict";
	
	exports.__esModule = true;
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var root = void 0;
	if (typeof window === "undefined") {
	    if (typeof global !== "undefined") {
	        root = global;
	    } else {
	        root = {};
	    }
	} else {
	    root = window;
	}
	/**
	 * requestAnimationFrame polyfill
	 */
	root.requestAnimationFrame = function () {
	    return typeof root !== "undefined" && (root.requestAnimationFrame || root.webkitRequestAnimationFrame || root.mozRequestAnimationFrame || root.oRequestAnimationFrame || root.msRequestAnimationFrame) || function (callback) {
	        root.setTimeout(callback, 1000 / 60);
	    };
	}();
	/**
	 * Bind polyfill
	 */
	function bind(b) {
	    /**
	     * If try bind variable that not a function, then throw error
	     */
	    if (typeof this !== "function") {
	        throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
	    }
	    /**
	     * let Array slice function
	     */
	    var a = Array.prototype.slice;
	    var f = a.call(arguments, 1);
	    var e = this;
	    function c() {
	        /*
	         if (
	         typeof root !== "undefined" &&
	         typeof root.console === "object" &&
	         typeof root.console.log === "function"
	         ) {
	         root.console.log("Bind polyfill");
	         }
	         */
	    }
	    function d() {
	        return e.apply(this instanceof c ? this : b || root, f.concat(a.call(arguments)));
	    }
	    /**
	     * Registered this prototype as prototype to bind implementation functions
	     */
	    c.prototype = this.prototype;
	    d.prototype = new c();
	    /**
	     * Return bind polyfill
	     */
	    return d;
	}
	Function.prototype.bind = Function.prototype.bind || bind;
	/**
	 * Object.keys polyfill
	 */
	function keys() {
	    var hasDoNotEnumBug = !{ toString: null }.propertyIsEnumerable("toString");
	    var doNotEnums = ["toString", "toLocaleString", "valueOf", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "constructor"];
	    var doNotEnumsLength = doNotEnums.length;
	    return function (obj) {
	        if ((typeof obj === "undefined" ? "undefined" : _typeof(obj)) !== "object" && (typeof obj !== "function" || obj === null)) {
	            throw new TypeError("Object.keys called on non-object");
	        }
	        var result = [];
	        for (var prop in obj) {
	            if (Object.prototype.hasOwnProperty.call(obj, prop)) {
	                result.push(prop);
	            }
	        }
	        if (hasDoNotEnumBug) {
	            for (var i = 0; i < doNotEnumsLength; i++) {
	                if (Object.prototype.hasOwnProperty.call(obj, doNotEnums[i])) {
	                    result.push(doNotEnums[i]);
	                }
	            }
	        }
	        return result;
	    };
	}
	Object.keys = Object.keys || keys();
	/**
	 * Request animation frame call stack class
	 */
	
	var AnimationFrame = function () {
	    /**
	     * Create request animation frame
	     */
	    function AnimationFrame() {
	        _classCallCheck(this, AnimationFrame);
	
	        /**
	         * Subscribed methods
	         */
	        this.stack = {};
	        /**
	         * Start requestAnimationFrame watcher
	         */
	        this.watch();
	    }
	    /**
	     * Subscribe method to watch
	     * @param context
	     * @param callback
	     * @param params
	     * @param ID
	     * @return {boolean|string}
	     */
	
	
	    AnimationFrame.prototype.subscribe = function subscribe() {
	        var context = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : root;
	        var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {
	            return null;
	        };
	        var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
	        var ID = arguments[3];
	
	        /**
	         * If context and callback passed and they are object and function
	         */
	        if ((typeof context === "undefined" ? "undefined" : _typeof(context)) === "object" && typeof callback === "function" && (typeof params === "undefined" ? "undefined" : _typeof(params)) === "object" && Array.isArray(params) && (ID === undefined || typeof ID === "string")) {
	            /**
	             * Create UID
	             */
	            var d = new Date();
	            var localID = ID || "x-" + d.getTime() + "-" + Math.round(Math.random() * 1e6);
	            /**
	             * Add method to the stack
	             */
	            this.stack[localID] = {
	                context: context,
	                callback: callback,
	                params: params
	            };
	            /**
	             * Write to console count of the subscribed methods
	             */
	            /**
	             * Return UID
	             */
	            return localID;
	        } else {
	            return false;
	        }
	    };
	    /**
	     * Unsubscribe method by ID
	     * @param ID
	     */
	
	
	    AnimationFrame.prototype.unsubscribe = function unsubscribe(ID) {
	        if (typeof ID === "string") {
	            /**
	             * If required method exist in the stack
	             */
	            if (this.stack[ID]) {
	                /**
	                 * Nullify method in the stack and destroy it
	                 */
	                this.stack[ID] = false;
	                delete this.stack[ID];
	            }
	        }
	    };
	    /**
	     * Watch and call methods
	     */
	
	
	    AnimationFrame.prototype.watch = function watch() {
	        try {
	            /**
	             * If stack exist, it is an object and it is contains methods
	             */
	            if (this.stack && _typeof(this.stack) === "object" && Object.keys(this.stack).length > 0) {
	                /**
	                 * Loop all methods in stack
	                 */
	                for (var ID in this.stack) {
	                    /**
	                     * Process only methods without extended properties
	                     */
	                    if (this.stack.hasOwnProperty(ID)) {
	                        try {
	                            /**
	                             * If ID exist and it is a string
	                             */
	                            if (ID && typeof ID === "string") {
	                                /**
	                                 * Get subscribed method params by ID
	                                 */
	                                var objCall = this.stack[ID];
	                                /**
	                                 * If params exist, it is an object, and it is contains call context,
	                                 * callback, and parameters which is array
	                                 */
	                                if (objCall && (typeof objCall === "undefined" ? "undefined" : _typeof(objCall)) === "object" && objCall.context && objCall.callback && objCall.params && _typeof(objCall.context) === "object" && typeof objCall.callback === "function" && Array.isArray(objCall.params)) {
	                                    /**
	                                     * Call subscribed method
	                                     */
	                                    objCall.callback.apply(objCall.context, objCall.params);
	                                }
	                            }
	                        } catch (e) {}
	                    }
	                }
	            }
	        } catch (e) {}
	        /**
	         * Recall watcher
	         */
	        root.requestAnimationFrame(this.watch.bind(this));
	    };
	
	    return AnimationFrame;
	}();
	/**
	 * Create single request animation frame object
	 * @type {AnimationFrame}
	 */
	
	
	root.AnimationFrame = root.AnimationFrame || new AnimationFrame();
	/**
	 * Export single AnimationFrame instance
	 */
	var _AnimationFrame = root.AnimationFrame;
	exports.default = _AnimationFrame;
	
	module.exports = _AnimationFrame;
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var URL = __webpack_require__(16);
	/**
	 * The document cookies storage
	 */
	
	var Cookies = function () {
	  /**
	   * The constructor should accept a hash to separate the scopes of storage
	   * @param hash {string}
	   */
	  function Cookies(hash) {
	    _classCallCheck(this, Cookies);
	
	    this.regValidKey = new RegExp("([a-zA-Z0-9_-]{0,})", "i");
	    this.hash = hash || location.hostname;
	  }
	  /**
	   * The method returns the flag whether supported this storage type or not
	   * @returns {boolean}
	   */
	
	
	  Cookies.prototype.isSupported = function isSupported() {
	    return (typeof document === "undefined" ? "undefined" : _typeof(document)) === "object" && typeof document.cookie === "string";
	  };
	  /**
	   * The method sets the value and returns true if it has been set
	   * @param checkSupport {boolean}
	   * @param key {string}
	   * @param value {string}
	   * @param expires {number}
	   * @param path {string}
	   * @param domain {string}
	   * @param secure {boolean}
	   * @return {boolean}
	   */
	
	
	  Cookies.prototype.setItem = function setItem() {
	    var checkSupport = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
	    var key = arguments[1];
	    var value = arguments[2];
	    var expires = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 30;
	    var path = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "/";
	    var domain = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : location.hostname;
	    var secure = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : location.protocol === "https:";
	
	    try {
	      /**
	       * Validate input data
	       */
	      if (typeof checkSupport === "boolean" && typeof key === "string" && this.regValidKey.test(key) && typeof value === "string" && (value === "" || this.regValidKey.test(value)) && typeof expires === "number" && expires < 365 && typeof path === "string" && typeof domain === "string" && domain.indexOf(location.hostname) !== -1 && typeof secure === "boolean" && secure === (location.protocol === "https:")) {
	        /**
	         * Validate input data
	         */
	        var u = URL.parse("http://" + domain + path);
	        if (u.hostname === domain || u.path === path) {
	          /**
	           * If that store is supported
	           */
	          if (!checkSupport || this.isSupported()) {
	            /**
	             * The hash needs for splitting scopes storage
	             * @type {string}
	             */
	            var localKey = this.hash + "_" + key;
	            /**
	             * Save cookies for 30 days
	             * @type {Date}
	             */
	            var date = new Date();
	            date.setTime(date.getTime() + expires * 24 * 60 * 60 * 1000);
	            var exp = date.toUTCString();
	            /**
	             * Encode value for store
	             * @type {string}
	             */
	            value = encodeURIComponent(value);
	            /**
	             * Writing value to the document cookie storage
	             * @type {string}
	             */
	            document.cookie = localKey + "=" + value + (exp ? "; expires=" + exp : "") + (path ? "; path=" + path : "") + (domain ? "; domain=" + domain : "") + (secure ? "; secure" : "");
	            /**
	             * If all ok return true
	             */
	            return this.getItem(checkSupport, key) === decodeURIComponent(value);
	          } else {
	            /**
	             * If cookie does not supported return false
	             */
	            return false;
	          }
	        } else {
	          /**
	           * If input data is not valid
	           */
	          return false;
	        }
	      } else {
	        /**
	         * If input data is not valid
	         */
	        return false;
	      }
	    } catch (e) {
	      /**
	       * If something goes wrong return false
	       */
	      return false;
	    }
	  };
	  /**
	   * The method reads the value and returns it or returns false if the value does not exist
	   * @param checkSupport {boolean}
	   * @param key {string}
	   * @returns {string|boolean}
	   */
	
	
	  Cookies.prototype.getItem = function getItem() {
	    var checkSupport = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
	    var key = arguments[1];
	
	    try {
	      /**
	       * Validate input data
	       */
	      if (typeof checkSupport === "boolean" && typeof key === "string" && this.regValidKey.test(key)) {
	        /**
	         * If that store is supported
	         */
	        if (!checkSupport || this.isSupported()) {
	          /**
	           * The hash needs for splitting scopes storage
	           * @type {string}
	           */
	          key = this.hash + "_" + key;
	          /**
	           * Get the array from document cookie split by ;
	           * @type {string[]}
	           */
	          var arrCookie = document.cookie.split(";");
	          /**
	           * Iterate through the cookies
	           */
	          for (var _iterator = arrCookie, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
	            var _ref;
	
	            if (_isArray) {
	              if (_i >= _iterator.length) break;
	              _ref = _iterator[_i++];
	            } else {
	              _i = _iterator.next();
	              if (_i.done) break;
	              _ref = _i.value;
	            }
	
	            var i = _ref;
	
	            /**
	             * Trim and split each cookie by = for key value pare
	             * @type {string[]}
	             */
	            var v = i.trim().split("=", 2);
	            /**
	             * If it is correct cookie key return the value
	             */
	            if (v[0] === key) {
	              /**
	               * If the value was found return the value
	               */
	              return decodeURIComponent(v[1]);
	            }
	          }
	          /**
	           * If the value was not found return false
	           */
	          return false;
	        } else {
	          /**
	           * If cookie does not supported return false
	           */
	          return false;
	        }
	      } else {
	        /**
	         * If input data is not valid
	         */
	        return false;
	      }
	    } catch (e) {
	      /**
	       * If something goes wrong return false
	       */
	      return false;
	    }
	  };
	  /**
	   * The method removes the value and return true if the value does not exist
	   * @param checkSupport {boolean}
	   * @param key {string}
	   * @returns {boolean}
	   */
	
	
	  Cookies.prototype.removeItem = function removeItem() {
	    var checkSupport = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
	    var key = arguments[1];
	
	    try {
	      /**
	       * Validate input data
	       */
	      if (typeof checkSupport === "boolean" && typeof key === "string" && this.regValidKey.test(key)) {
	        /**
	         * If that store is supported
	         */
	        if (!checkSupport || this.isSupported()) {
	          /**
	           * Set empty overdue value by key
	           */
	          this.setItem(checkSupport, key, "", -1 * 24 * 60 * 60);
	          /**
	           * If all ok return true
	           */
	          return this.getItem(checkSupport, key) === false;
	        } else {
	          /**
	           * If cookie does not supported return false
	           */
	          return false;
	        }
	      } else {
	        /**
	         * If input data is not valid
	         */
	        return false;
	      }
	    } catch (e) {
	      /**
	       * If something goes wrong return false
	       */
	      return false;
	    }
	  };
	  /**
	   * The method returns the array of string of available keys
	   * @param checkSupport {boolean}
	   * @returns {string[]}
	   */
	
	
	  Cookies.prototype.getKeys = function getKeys() {
	    var checkSupport = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
	
	    try {
	      /**
	       * Validate input data
	       */
	      if (typeof checkSupport === "boolean") {
	        /**
	         * If that store is supported
	         */
	        if (!checkSupport || this.isSupported()) {
	          /**
	           * The array of available keys
	           * @type {Array}
	           */
	          var arrKeys = [];
	          /**
	           * Get the array from document cookie split by ;
	           * @type {string[]}
	           */
	          var arrCookie = document.cookie.split(";");
	          /**
	           * Iterate through the cookies
	           */
	          for (var _iterator2 = arrCookie, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
	            var _ref2;
	
	            if (_isArray2) {
	              if (_i2 >= _iterator2.length) break;
	              _ref2 = _iterator2[_i2++];
	            } else {
	              _i2 = _iterator2.next();
	              if (_i2.done) break;
	              _ref2 = _i2.value;
	            }
	
	            var i = _ref2;
	
	            /**
	             * Trim and split each cookie by = for key value pare
	             * @type {string[]}
	             */
	            var v = i.trim().split("=", 2);
	            /**
	             * If the key contains hash add it to the list
	             */
	            if (v[0].indexOf(this.hash) === 0) {
	              /**
	               * Add key to the list
	               */
	              arrKeys.push(v[0].substr(this.hash.length + 1));
	            }
	          }
	          return arrKeys;
	        } else {
	          /**
	           * If cookie does not supported return false
	           */
	          return [];
	        }
	      } else {
	        /**
	         * If input data is not valid
	         */
	        return [];
	      }
	    } catch (e) {
	      /**
	       * If something goes wrong return false
	       */
	      return [];
	    }
	  };
	  /**
	   * The method cleans the storage and return true if it is empty
	   * @param checkSupport {boolean}
	   * @returns {boolean}
	   */
	
	
	  Cookies.prototype.clear = function clear() {
	    var checkSupport = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
	
	    try {
	      /**
	       * Validate input data
	       */
	      if (typeof checkSupport === "boolean") {
	        /**
	         * If that store is supported
	         */
	        if (!checkSupport || this.isSupported()) {
	          var arrKeys = this.getKeys(checkSupport);
	          if (arrKeys) {
	            for (var _iterator3 = arrKeys, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
	              var _ref3;
	
	              if (_isArray3) {
	                if (_i3 >= _iterator3.length) break;
	                _ref3 = _iterator3[_i3++];
	              } else {
	                _i3 = _iterator3.next();
	                if (_i3.done) break;
	                _ref3 = _i3.value;
	              }
	
	              var i = _ref3;
	
	              this.removeItem(checkSupport, i);
	            }
	          }
	          /**
	           * If all ok return true
	           */
	          return this.getKeys(checkSupport).length === 0;
	        } else {
	          /**
	           * If cookie does not supported return false
	           */
	          return true;
	        }
	      } else {
	        /**
	         * If input data is not valid
	         */
	        return false;
	      }
	    } catch (e) {
	      /**
	       * If something goes wrong return false
	       */
	      return false;
	    }
	  };
	
	  return Cookies;
	}();
	
	exports.default = Cookies;

/***/ },
/* 33 */
/***/ function(module, exports) {

	"use strict";
	/**
	 * The DOMStorage
	 */
	
	exports.__esModule = true;
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var DOMStorage = function () {
	    /**
	     * The constructor should accept a hash to separate the scopes of storage
	     * @param hash {string}
	     */
	    function DOMStorage(hash) {
	        _classCallCheck(this, DOMStorage);
	
	        this.regValidKey = new RegExp("([a-zA-Z0-9_-]{0,})", "i");
	        this.hash = hash || location.hostname;
	        this.domStorage = document.getElementById(this.hash);
	        if (!this.domStorage) {
	            this.domStorage = document.createElement("div");
	            this.domStorage.id = this.hash;
	        }
	        if (document.body) {
	            document.body.appendChild(this.domStorage);
	            this.domStorage = document.getElementById(this.hash);
	            if (this.isSupported()) {
	                this.domStorage.style.behavior = "url(#default#userData)";
	            }
	        }
	    }
	    /**
	     * The method returns the flag whether supported this storage type or not
	     * @returns {boolean}
	     */
	
	
	    DOMStorage.prototype.isSupported = function isSupported() {
	        return _typeof(this.domStorage) === "object" && _typeof(this.domStorage.parentNode) === "object" && typeof this.domStorage.addBehavior !== "undefined";
	    };
	    /**
	     * The method sets the value and returns true if it has been set
	     * @param checkSupport {boolean}
	     * @param key {string}
	     * @param value {string}
	     * @return {boolean}
	     */
	
	
	    DOMStorage.prototype.setItem = function setItem() {
	        var checkSupport = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
	        var key = arguments[1];
	        var value = arguments[2];
	
	        try {
	            /**
	             * Validate input data
	             */
	            if (typeof checkSupport === "boolean" && typeof key === "string" && this.regValidKey.test(key) && typeof value === "string" && (value === "" || this.regValidKey.test(value))) {
	                /**
	                 * If that store is supported
	                 */
	                if (!checkSupport || this.isSupported()) {
	                    /**
	                     * The hash needs for splitting scopes storage
	                     * @type {string}
	                     */
	                    var localKey = this.hash + "_" + key;
	                    /**
	                     * Set dom value
	                     */
	                    this.domStorage.setAttribute(localKey, value);
	                    this.domStorage.save(this.hash);
	                    /**
	                     * If all ok return true
	                     */
	                    return this.getItem(checkSupport, key) === value;
	                } else {
	                    /**
	                     * If cookie does not supported return false
	                     */
	                    return false;
	                }
	            } else {
	                /**
	                 * If input data is not valid
	                 */
	                return false;
	            }
	        } catch (e) {
	            /**
	             * If something goes wrong return false
	             */
	            return false;
	        }
	    };
	    /**
	     * The method reads the value and returns it or returns false if the value does not exist
	     * @param checkSupport {boolean}
	     * @param key {string}
	     * @returns {string|boolean}
	     */
	
	
	    DOMStorage.prototype.getItem = function getItem() {
	        var checkSupport = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
	        var key = arguments[1];
	
	        try {
	            /**
	             * Validate input data
	             */
	            if (typeof checkSupport === "boolean" && typeof key === "string" && this.regValidKey.test(key)) {
	                /**
	                 * If that store is supported
	                 */
	                if (!checkSupport || this.isSupported()) {
	                    /**
	                     * The hash needs for splitting scopes storage
	                     * @type {string}
	                     */
	                    var localKey = this.hash + "_" + key;
	                    /**
	                     * Get value
	                     */
	                    this.domStorage.load(this.hash);
	                    var value = this.domStorage.getAttribute(localKey);
	                    /**
	                     * If value exist, return it
	                     */
	                    if (value) {
	                        return value;
	                    } else {
	                        return false;
	                    }
	                } else {
	                    /**
	                     * If cookie does not supported return false
	                     */
	                    return false;
	                }
	            } else {
	                /**
	                 * If input data is not valid
	                 */
	                return false;
	            }
	        } catch (e) {
	            /**
	             * If something goes wrong return false
	             */
	            return false;
	        }
	    };
	    /**
	     * The method removes the value and return true if the value does not exist
	     * @param checkSupport {boolean}
	     * @param key {string}
	     * @returns {boolean}
	     */
	
	
	    DOMStorage.prototype.removeItem = function removeItem() {
	        var checkSupport = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
	        var key = arguments[1];
	
	        try {
	            /**
	             * Validate input data
	             */
	            if (typeof checkSupport === "boolean" && typeof key === "string" && this.regValidKey.test(key)) {
	                /**
	                 * If that store is supported
	                 */
	                if (!checkSupport || this.isSupported()) {
	                    /**
	                     * The hash needs for splitting scopes storage
	                     * @type {string}
	                     */
	                    var localKey = this.hash + "_" + key;
	                    /**
	                     * Clean value and remove
	                     * @type {boolean}
	                     */
	                    this.domStorage.removeAttribute(localKey);
	                    this.domStorage.save(this.hash);
	                    /**
	                     * If all ok return true
	                     */
	                    return this.getItem(checkSupport, key) === false;
	                } else {
	                    /**
	                     * If cookie does not supported return false
	                     */
	                    return false;
	                }
	            } else {
	                /**
	                 * If input data is not valid
	                 */
	                return false;
	            }
	        } catch (e) {
	            /**
	             * If something goes wrong return false
	             */
	            return false;
	        }
	    };
	    /**
	     * The method returns the array of string of available keys
	     * @param checkSupport {boolean}
	     * @returns {string[]}
	     */
	
	
	    DOMStorage.prototype.getKeys = function getKeys() {
	        var checkSupport = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
	
	        try {
	            /**
	             * Validate input data
	             */
	            if (typeof checkSupport === "boolean") {
	                /**
	                 * If that store is supported
	                 */
	                if (!checkSupport || this.isSupported()) {
	                    /**
	                     * The array of available keys
	                     * @type {Array}
	                     */
	                    var arrKeys = [];
	                    /**
	                     * Get the array from document cookie split by ;
	                     * @type {string[]}
	                     */
	                    var localArrKeys = this.domStorage.XMLDocument.documentElement.attributes;
	                    /**
	                     * Iterate through the globalStorage
	                     */
	                    for (var i = 0; i < localArrKeys.length; i++) {
	                        var key = localArrKeys[i].name;
	                        /**
	                         * If the key contains hash add it to the list
	                         */
	                        if (key.indexOf(this.hash) === 0) {
	                            /**
	                             * Add key to the list
	                             */
	                            arrKeys.push(key.substr(this.hash.length + 1));
	                        }
	                    }
	                    return arrKeys;
	                } else {
	                    /**
	                     * If cookie does not supported return false
	                     */
	                    return [];
	                }
	            } else {
	                /**
	                 * If input data is not valid
	                 */
	                return [];
	            }
	        } catch (e) {
	            /**
	             * If something goes wrong return false
	             */
	            return [];
	        }
	    };
	    /**
	     * The method cleans the storage and return true if it is empty
	     * @param checkSupport {boolean}
	     * @returns {boolean}
	     */
	
	
	    DOMStorage.prototype.clear = function clear() {
	        var checkSupport = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
	
	        try {
	            /**
	             * Validate input data
	             */
	            if (typeof checkSupport === "boolean") {
	                /**
	                 * If that store is supported
	                 */
	                if (!checkSupport || this.isSupported()) {
	                    var arrKeys = this.getKeys(checkSupport);
	                    if (arrKeys) {
	                        for (var _iterator = arrKeys, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
	                            var _ref;
	
	                            if (_isArray) {
	                                if (_i >= _iterator.length) break;
	                                _ref = _iterator[_i++];
	                            } else {
	                                _i = _iterator.next();
	                                if (_i.done) break;
	                                _ref = _i.value;
	                            }
	
	                            var i = _ref;
	
	                            this.removeItem(checkSupport, i);
	                        }
	                    }
	                    /**
	                     * If all ok return true
	                     */
	                    return this.getKeys(checkSupport).length === 0;
	                } else {
	                    /**
	                     * If cookie does not supported return false
	                     */
	                    return true;
	                }
	            } else {
	                /**
	                 * If input data is not valid
	                 */
	                return false;
	            }
	        } catch (e) {
	            /**
	             * If something goes wrong return false
	             */
	            return false;
	        }
	    };
	
	    return DOMStorage;
	}();
	
	exports.default = DOMStorage;

/***/ },
/* 34 */
/***/ function(module, exports) {

	"use strict";
	/**
	 * The GlobalStorage
	 */
	
	exports.__esModule = true;
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var GlobalStorage = function () {
	    /**
	     * The constructor should accept a hash to separate the scopes of storage
	     * @param hash {string}
	     */
	    function GlobalStorage(hash) {
	        _classCallCheck(this, GlobalStorage);
	
	        this.regValidKey = new RegExp("([a-zA-Z0-9_-]{0,})", "i");
	        this.hash = hash || location.hostname;
	        if (!window.globalStorage) {
	            window.globalStorage = {};
	        }
	        if (!window.globalStorage[document.domain]) {
	            window.globalStorage[document.domain] = {};
	        }
	        this.globalStorage = window.globalStorage[document.domain];
	    }
	    /**
	     * The method returns the flag whether supported this storage type or not
	     * @returns {boolean}
	     */
	
	
	    GlobalStorage.prototype.isSupported = function isSupported() {
	        return _typeof(this.globalStorage) === "object";
	    };
	    /**
	     * The method sets the value and returns true if it has been set
	     * @param checkSupport {boolean}
	     * @param key {string}
	     * @param value {string}
	     * @return {boolean}
	     */
	
	
	    GlobalStorage.prototype.setItem = function setItem() {
	        var checkSupport = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
	        var key = arguments[1];
	        var value = arguments[2];
	
	        try {
	            /**
	             * Validate input data
	             */
	            if (typeof checkSupport === "boolean" && typeof key === "string" && this.regValidKey.test(key) && typeof value === "string" && (value === "" || this.regValidKey.test(value))) {
	                /**
	                 * If that store is supported
	                 */
	                if (!checkSupport || this.isSupported()) {
	                    /**
	                     * The hash needs for splitting scopes storage
	                     * @type {string}
	                     */
	                    var localKey = this.hash + "_" + key;
	                    /**
	                     * Set value
	                     * @type {string}
	                     */
	                    this.globalStorage[localKey] = value;
	                    /**
	                     * If all ok return true
	                     */
	                    return this.getItem(checkSupport, key) === value;
	                } else {
	                    /**
	                     * If cookie does not supported return false
	                     */
	                    return false;
	                }
	            } else {
	                /**
	                 * If input data is not valid
	                 */
	                return false;
	            }
	        } catch (e) {
	            /**
	             * If something goes wrong return false
	             */
	            return false;
	        }
	    };
	    /**
	     * The method reads the value and returns it or returns false if the value does not exist
	     * @param checkSupport {boolean}
	     * @param key {string}
	     * @returns {string|boolean}
	     */
	
	
	    GlobalStorage.prototype.getItem = function getItem() {
	        var checkSupport = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
	        var key = arguments[1];
	
	        try {
	            /**
	             * Validate input data
	             */
	            if (typeof checkSupport === "boolean" && typeof key === "string" && this.regValidKey.test(key)) {
	                /**
	                 * If that store is supported
	                 */
	                if (!checkSupport || this.isSupported()) {
	                    /**
	                     * The hash needs for splitting scopes storage
	                     * @type {string}
	                     */
	                    var localKey = this.hash + "_" + key;
	                    /**
	                     * Get value
	                     */
	                    var value = this.globalStorage[localKey];
	                    /**
	                     * If value exist, return it
	                     */
	                    if (value) {
	                        return value;
	                    } else {
	                        return false;
	                    }
	                } else {
	                    /**
	                     * If cookie does not supported return false
	                     */
	                    return false;
	                }
	            } else {
	                /**
	                 * If cookie does not supported return false
	                 */
	                return false;
	            }
	        } catch (e) {
	            /**
	             * If something goes wrong return false
	             */
	            return false;
	        }
	    };
	    /**
	     * The method removes the value and return true if the value does not exist
	     * @param checkSupport {boolean}
	     * @param key {string}
	     * @returns {boolean}
	     */
	
	
	    GlobalStorage.prototype.removeItem = function removeItem() {
	        var checkSupport = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
	        var key = arguments[1];
	
	        try {
	            /**
	             * Validate input data
	             */
	            if (typeof checkSupport === "boolean" && typeof key === "string" && this.regValidKey.test(key)) {
	                /**
	                 * If that store is supported
	                 */
	                if (!checkSupport || this.isSupported()) {
	                    /**
	                     * The hash needs for splitting scopes storage
	                     * @type {string}
	                     */
	                    var localKey = this.hash + "_" + key;
	                    /**
	                     * Clean value and remove
	                     * @type {boolean}
	                     */
	                    this.globalStorage[localKey] = false;
	                    delete this.globalStorage[localKey];
	                    /**
	                     * If all ok return true
	                     */
	                    return this.getItem(checkSupport, key) === false;
	                } else {
	                    /**
	                     * If cookie does not supported return false
	                     */
	                    return false;
	                }
	            } else {
	                /**
	                 * If input data is not valid
	                 */
	                return false;
	            }
	        } catch (e) {
	            /**
	             * If something goes wrong return false
	             */
	            return false;
	        }
	    };
	    /**
	     * The method returns the array of string of available keys
	     * @param checkSupport {boolean}
	     * @returns {string[]}
	     */
	
	
	    GlobalStorage.prototype.getKeys = function getKeys() {
	        var checkSupport = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
	
	        try {
	            /**
	             * Validate input data
	             */
	            if (typeof checkSupport === "boolean") {
	                /**
	                 * If that store is supported
	                 */
	                if (!checkSupport || this.isSupported()) {
	                    /**
	                     * The array of available keys
	                     * @type {Array}
	                     */
	                    var arrKeys = [];
	                    /**
	                     * Get the array from document cookie split by ;
	                     * @type {string[]}
	                     */
	                    var localArrKeys = Object.keys(this.globalStorage);
	                    /**
	                     * Iterate through the globalStorage
	                     */
	                    for (var _iterator = localArrKeys, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
	                        var _ref;
	
	                        if (_isArray) {
	                            if (_i >= _iterator.length) break;
	                            _ref = _iterator[_i++];
	                        } else {
	                            _i = _iterator.next();
	                            if (_i.done) break;
	                            _ref = _i.value;
	                        }
	
	                        var key = _ref;
	
	                        /**
	                         * If the key contains hash add it to the list
	                         */
	                        if (key.indexOf(this.hash) === 0) {
	                            /**
	                             * Add key to the list
	                             */
	                            arrKeys.push(key.substr(this.hash.length + 1));
	                        }
	                    }
	                    return arrKeys;
	                } else {
	                    /**
	                     * If cookie does not supported return false
	                     */
	                    return [];
	                }
	            } else {
	                /**
	                 * If input data is not valid
	                 */
	                return [];
	            }
	        } catch (e) {
	            /**
	             * If something goes wrong return false
	             */
	            return [];
	        }
	    };
	    /**
	     * The method cleans the storage and return true if it is empty
	     * @param checkSupport {boolean}
	     * @returns {boolean}
	     */
	
	
	    GlobalStorage.prototype.clear = function clear() {
	        var checkSupport = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
	
	        try {
	            /**
	             * Validate input data
	             */
	            if (typeof checkSupport === "boolean") {
	                /**
	                 * If that store is supported
	                 */
	                if (!checkSupport || this.isSupported()) {
	                    var arrKeys = this.getKeys(checkSupport);
	                    if (arrKeys) {
	                        for (var _iterator2 = arrKeys, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
	                            var _ref2;
	
	                            if (_isArray2) {
	                                if (_i2 >= _iterator2.length) break;
	                                _ref2 = _iterator2[_i2++];
	                            } else {
	                                _i2 = _iterator2.next();
	                                if (_i2.done) break;
	                                _ref2 = _i2.value;
	                            }
	
	                            var i = _ref2;
	
	                            this.removeItem(checkSupport, i);
	                        }
	                    }
	                    /**
	                     * If all ok return true
	                     */
	                    return this.getKeys(checkSupport).length === 0;
	                } else {
	                    /**
	                     * If cookie does not supported return false
	                     */
	                    return true;
	                }
	            } else {
	                /**
	                 * If input data is not valid
	                 */
	                return false;
	            }
	        } catch (e) {
	            /**
	             * If something goes wrong return false
	             */
	            return false;
	        }
	    };
	
	    return GlobalStorage;
	}();
	
	exports.default = GlobalStorage;

/***/ },
/* 35 */
/***/ function(module, exports) {

	"use strict";
	/**
	 * The LocalStorage
	 */
	
	exports.__esModule = true;
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var LocalStorage = function () {
	    /**
	     * The constructor should accept a hash to separate the scopes of storage
	     * @param hash {string}
	     */
	    function LocalStorage(hash) {
	        _classCallCheck(this, LocalStorage);
	
	        this.regValidKey = new RegExp("([a-zA-Z0-9_-]{0,})", "i");
	        this.hash = hash || location.hostname;
	    }
	    /**
	     * The method returns the flag whether supported this storage type or not
	     * @returns {boolean}
	     */
	
	
	    LocalStorage.prototype.isSupported = function isSupported() {
	        return typeof window.localStorage !== "undefined";
	    };
	    /**
	     * The method sets the value and returns true if it has been set
	     * @param checkSupport {boolean}
	     * @param key {string}
	     * @param value {string}
	     * @return {boolean}
	     */
	
	
	    LocalStorage.prototype.setItem = function setItem() {
	        var checkSupport = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
	        var key = arguments[1];
	        var value = arguments[2];
	
	        try {
	            /**
	             * Validate input data
	             */
	            if (typeof checkSupport === "boolean" && typeof key === "string" && this.regValidKey.test(key) && typeof value === "string" && (value === "" || this.regValidKey.test(value))) {
	                /**
	                 * If that store is supported
	                 */
	                if (!checkSupport || this.isSupported()) {
	                    /**
	                     * The hash needs for splitting scopes storage
	                     * @type {string}
	                     */
	                    var localKey = this.hash + "_" + key;
	                    /**
	                     * Set value
	                     * @type {string}
	                     */
	                    window.localStorage.setItem(localKey, value);
	                    /**
	                     * If all ok return true
	                     */
	                    return this.getItem(checkSupport, key) === value;
	                } else {
	                    /**
	                     * If cookie does not supported return false
	                     */
	                    return false;
	                }
	            } else {
	                /**
	                 * If input data is not valid
	                 */
	                return false;
	            }
	        } catch (e) {
	            /**
	             * If something goes wrong return false
	             */
	            return false;
	        }
	    };
	    /**
	     * The method reads the value and returns it or returns false if the value does not exist
	     * @param checkSupport {boolean}
	     * @param key {string}
	     * @returns {string|boolean}
	     */
	
	
	    LocalStorage.prototype.getItem = function getItem() {
	        var checkSupport = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
	        var key = arguments[1];
	
	        try {
	            /**
	             * Validate input data
	             */
	            if (typeof checkSupport === "boolean" && typeof key === "string" && this.regValidKey.test(key)) {
	                /**
	                 * If that store is supported
	                 */
	                if (!checkSupport || this.isSupported()) {
	                    /**
	                     * The hash needs for splitting scopes storage
	                     * @type {string}
	                     */
	                    var localKey = this.hash + "_" + key;
	                    /**
	                     * Get value
	                     */
	                    var value = window.localStorage.getItem(localKey);
	                    /**
	                     * If value exist, return it
	                     */
	                    if (value) {
	                        return value;
	                    } else {
	                        return false;
	                    }
	                } else {
	                    /**
	                     * If cookie does not supported return false
	                     */
	                    return false;
	                }
	            } else {
	                /**
	                 * If cookie does not supported return false
	                 */
	                return false;
	            }
	        } catch (e) {
	            /**
	             * If something goes wrong return false
	             */
	            return false;
	        }
	    };
	    /**
	     * The method removes the value and return true if the value does not exist
	     * @param checkSupport {boolean}
	     * @param key {string}
	     * @returns {boolean}
	     */
	
	
	    LocalStorage.prototype.removeItem = function removeItem() {
	        var checkSupport = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
	        var key = arguments[1];
	
	        try {
	            /**
	             * Validate input data
	             */
	            if (typeof checkSupport === "boolean" && typeof key === "string" && this.regValidKey.test(key)) {
	                /**
	                 * If that store is supported
	                 */
	                if (!checkSupport || this.isSupported()) {
	                    /**
	                     * The hash needs for splitting scopes storage
	                     * @type {string}
	                     */
	                    var localKey = this.hash + "_" + key;
	                    /**
	                     * Clean value and remove
	                     * @type {boolean}
	                     */
	                    window.localStorage.removeItem(localKey);
	                    /**
	                     * If all ok return true
	                     */
	                    return this.getItem(checkSupport, key) === false;
	                } else {
	                    /**
	                     * If cookie does not supported return false
	                     */
	                    return false;
	                }
	            } else {
	                /**
	                 * If input data is not valid
	                 */
	                return false;
	            }
	        } catch (e) {
	            /**
	             * If something goes wrong return false
	             */
	            return false;
	        }
	    };
	    /**
	     * The method returns the array of string of available keys
	     * @param checkSupport {boolean}
	     * @returns {string[]}
	     */
	
	
	    LocalStorage.prototype.getKeys = function getKeys() {
	        var checkSupport = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
	
	        try {
	            /**
	             * Validate input data
	             */
	            if (typeof checkSupport === "boolean") {
	                /**
	                 * If that store is supported
	                 */
	                if (!checkSupport || this.isSupported()) {
	                    /**
	                     * The array of available keys
	                     * @type {Array}
	                     */
	                    var arrKeys = [];
	                    /**
	                     * Iterate through the localStorage
	                     */
	                    for (var i = 0; i < window.localStorage.length; i++) {
	                        if (window.localStorage.key(i).indexOf(this.hash) === 0) {
	                            arrKeys.push(window.localStorage.key(i).substr(this.hash.length + 1));
	                        }
	                    }
	                    /**
	                     * Return keys
	                     */
	                    return arrKeys;
	                } else {
	                    /**
	                     * If cookie does not supported return false
	                     */
	                    return [];
	                }
	            } else {
	                /**
	                 * If input data is not valid
	                 */
	                return [];
	            }
	        } catch (e) {
	            /**
	             * If something goes wrong return false
	             */
	            return [];
	        }
	    };
	    /**
	     * The method cleans the storage and return true if it is empty
	     * @param checkSupport {boolean}
	     * @returns {boolean}
	     */
	
	
	    LocalStorage.prototype.clear = function clear() {
	        var checkSupport = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
	
	        try {
	            /**
	             * Validate input data
	             */
	            if (typeof checkSupport === "boolean") {
	                /**
	                 * If that store is supported
	                 */
	                if (!checkSupport || this.isSupported()) {
	                    var arrKeys = this.getKeys(checkSupport);
	                    if (arrKeys) {
	                        for (var _iterator = arrKeys, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
	                            var _ref;
	
	                            if (_isArray) {
	                                if (_i >= _iterator.length) break;
	                                _ref = _iterator[_i++];
	                            } else {
	                                _i = _iterator.next();
	                                if (_i.done) break;
	                                _ref = _i.value;
	                            }
	
	                            var i = _ref;
	
	                            this.removeItem(checkSupport, i);
	                        }
	                    }
	                    /**
	                     * If all ok return true
	                     */
	                    return this.getKeys(checkSupport).length === 0;
	                } else {
	                    /**
	                     * If cookie does not supported return false
	                     */
	                    return true;
	                }
	            } else {
	                /**
	                 * If input data is not valid
	                 */
	                return false;
	            }
	        } catch (e) {
	            /**
	             * If something goes wrong return false
	             */
	            return false;
	        }
	    };
	
	    return LocalStorage;
	}();
	
	exports.default = LocalStorage;

/***/ },
/* 36 */
/***/ function(module, exports) {

	"use strict";
	/**
	 * The SessionStorage
	 */
	
	exports.__esModule = true;
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var SessionStorage = function () {
	    /**
	     * The constructor should accept a hash to separate the scopes of storage
	     * @param hash {string}
	     */
	    function SessionStorage(hash) {
	        _classCallCheck(this, SessionStorage);
	
	        this.regValidKey = new RegExp("([a-zA-Z0-9_-]{0,})", "i");
	        this.hash = hash || location.hostname;
	    }
	    /**
	     * The method returns the flag whether supported this storage type or not
	     * @returns {boolean}
	     */
	
	
	    SessionStorage.prototype.isSupported = function isSupported() {
	        return typeof window.sessionStorage !== "undefined";
	    };
	    /**
	     * The method sets the value and returns true if it has been set
	     * @param checkSupport {boolean}
	     * @param key {string}
	     * @param value {string}
	     * @return {boolean}
	     */
	
	
	    SessionStorage.prototype.setItem = function setItem() {
	        var checkSupport = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
	        var key = arguments[1];
	        var value = arguments[2];
	
	        try {
	            /**
	             * Validate input data
	             */
	            if (typeof checkSupport === "boolean" && typeof key === "string" && this.regValidKey.test(key) && typeof value === "string" && (value === "" || this.regValidKey.test(value))) {
	                /**
	                 * If that store is supported
	                 */
	                if (!checkSupport || this.isSupported()) {
	                    /**
	                     * The hash needs for splitting scopes storage
	                     * @type {string}
	                     */
	                    var localKey = this.hash + "_" + key;
	                    /**
	                     * Set value
	                     * @type {string}
	                     */
	                    window.sessionStorage.setItem(localKey, value);
	                    /**
	                     * If all ok return true
	                     */
	                    return this.getItem(checkSupport, key) === value;
	                } else {
	                    /**
	                     * If cookie does not supported return false
	                     */
	                    return false;
	                }
	            } else {
	                /**
	                 * If input data is not valid
	                 */
	                return false;
	            }
	        } catch (e) {
	            /**
	             * If something goes wrong return false
	             */
	            return false;
	        }
	    };
	    /**
	     * The method reads the value and returns it or returns false if the value does not exist
	     * @param checkSupport {boolean}
	     * @param key {string}
	     * @returns {string|boolean}
	     */
	
	
	    SessionStorage.prototype.getItem = function getItem() {
	        var checkSupport = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
	        var key = arguments[1];
	
	        try {
	            /**
	             * Validate input data
	             */
	            if (typeof checkSupport === "boolean" && typeof key === "string" && this.regValidKey.test(key)) {
	                /**
	                 * If that store is supported
	                 */
	                if (!checkSupport || this.isSupported()) {
	                    /**
	                     * The hash needs for splitting scopes storage
	                     * @type {string}
	                     */
	                    var localKey = this.hash + "_" + key;
	                    /**
	                     * Get value
	                     */
	                    var value = window.sessionStorage.getItem(localKey);
	                    /**
	                     * If value exist, return it
	                     */
	                    if (value) {
	                        return value;
	                    } else {
	                        return false;
	                    }
	                } else {
	                    /**
	                     * If cookie does not supported return false
	                     */
	                    return false;
	                }
	            } else {
	                /**
	                 * If cookie does not supported return false
	                 */
	                return false;
	            }
	        } catch (e) {
	            /**
	             * If something goes wrong return false
	             */
	            return false;
	        }
	    };
	    /**
	     * The method removes the value and return true if the value does not exist
	     * @param checkSupport {boolean}
	     * @param key {string}
	     * @returns {boolean}
	     */
	
	
	    SessionStorage.prototype.removeItem = function removeItem() {
	        var checkSupport = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
	        var key = arguments[1];
	
	        try {
	            /**
	             * Validate input data
	             */
	            if (typeof checkSupport === "boolean" && typeof key === "string" && this.regValidKey.test(key)) {
	                /**
	                 * If that store is supported
	                 */
	                if (!checkSupport || this.isSupported()) {
	                    /**
	                     * The hash needs for splitting scopes storage
	                     * @type {string}
	                     */
	                    var localKey = this.hash + "_" + key;
	                    /**
	                     * Clean value and remove
	                     * @type {boolean}
	                     */
	                    window.sessionStorage.removeItem(localKey);
	                    /**
	                     * If all ok return true
	                     */
	                    return this.getItem(checkSupport, key) === false;
	                } else {
	                    /**
	                     * If cookie does not supported return false
	                     */
	                    return false;
	                }
	            } else {
	                /**
	                 * If input data is not valid
	                 */
	                return false;
	            }
	        } catch (e) {
	            /**
	             * If something goes wrong return false
	             */
	            return false;
	        }
	    };
	    /**
	     * The method returns the array of string of available keys
	     * @param checkSupport {boolean}
	     * @returns {string[]}
	     */
	
	
	    SessionStorage.prototype.getKeys = function getKeys() {
	        var checkSupport = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
	
	        try {
	            /**
	             * Validate input data
	             */
	            if (typeof checkSupport === "boolean") {
	                /**
	                 * If that store is supported
	                 */
	                if (!checkSupport || this.isSupported()) {
	                    /**
	                     * The array of available keys
	                     * @type {Array}
	                     */
	                    var arrKeys = [];
	                    /**
	                     * Iterate through the SessionStorage
	                     */
	                    for (var i = 0; i < window.sessionStorage.length; i++) {
	                        if (window.sessionStorage.key(i).indexOf(this.hash) === 0) {
	                            arrKeys.push(window.sessionStorage.key(i).substr(this.hash.length + 1));
	                        }
	                    }
	                    /**
	                     * Return keys
	                     */
	                    return arrKeys;
	                } else {
	                    /**
	                     * If cookie does not supported return false
	                     */
	                    return [];
	                }
	            } else {
	                /**
	                 * If input data is not valid
	                 */
	                return [];
	            }
	        } catch (e) {
	            /**
	             * If something goes wrong return false
	             */
	            return [];
	        }
	    };
	    /**
	     * The method cleans the storage and return true if it is empty
	     * @param checkSupport {boolean}
	     * @returns {boolean}
	     */
	
	
	    SessionStorage.prototype.clear = function clear() {
	        var checkSupport = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
	
	        try {
	            /**
	             * Validate input data
	             */
	            if (typeof checkSupport === "boolean") {
	                /**
	                 * If that store is supported
	                 */
	                if (!checkSupport || this.isSupported()) {
	                    var arrKeys = this.getKeys(checkSupport);
	                    if (arrKeys) {
	                        for (var _iterator = arrKeys, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
	                            var _ref;
	
	                            if (_isArray) {
	                                if (_i >= _iterator.length) break;
	                                _ref = _iterator[_i++];
	                            } else {
	                                _i = _iterator.next();
	                                if (_i.done) break;
	                                _ref = _i.value;
	                            }
	
	                            var i = _ref;
	
	                            this.removeItem(checkSupport, i);
	                        }
	                    }
	                    /**
	                     * If all ok return true
	                     */
	                    return this.getKeys(checkSupport).length === 0;
	                } else {
	                    /**
	                     * If cookie does not supported return false
	                     */
	                    return true;
	                }
	            } else {
	                /**
	                 * If input data is not valid
	                 */
	                return false;
	            }
	        } catch (e) {
	            /**
	             * If something goes wrong return false
	             */
	            return false;
	        }
	    };
	
	    return SessionStorage;
	}();
	
	exports.default = SessionStorage;

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {(function () {
	  "use strict";
	
	  function btoa(str) {
	    var buffer
	      ;
	
	    if (str instanceof Buffer) {
	      buffer = str;
	    } else {
	      buffer = new Buffer(str.toString(), 'binary');
	    }
	
	    return buffer.toString('base64');
	  }
	
	  module.exports = btoa;
	}());
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4).Buffer))

/***/ }
/******/ ])
});
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uPzVjYTYqKiIsIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYTVlMGY1YzgwMDU0MjNkNzUwODc/YmVjNyoqIiwid2VicGFjazovLy8uL34vYnVmZmVyL2luZGV4LmpzPzFhNTUqKiIsIndlYnBhY2s6Ly8vLi9+L2Jhc2U2NC1qcy9pbmRleC5qcz8yYWRkKioiLCJ3ZWJwYWNrOi8vLy4vfi9pZWVlNzU0L2luZGV4LmpzPzcwZmUqKiIsIndlYnBhY2s6Ly8vLi9+L2lzYXJyYXkvaW5kZXguanM/ZWFiYyoqIiwid2VicGFjazovLy8uL2xpYi9Vc2VySUQudHM/Y2JhNioiLCJ3ZWJwYWNrOi8vLy4vbGliL011cm11ckhhc2gzLnRzPzg0NTEqIiwid2VicGFjazovLy8uL34vVXRpbHMvbGliL1V0aWxzLnRzPzBjZGYqIiwid2VicGFjazovLy8uL34vVXRpbHMvbGliL1V0aWxzQW5pbWF0aW9uLnRzPzlmNWEqIiwid2VicGFjazovLy8uL34vVXRpbHMvbGliL1V0aWxzQW5pbWF0aW9uRWFzaW5nLnRzP2E4NmEqIiwid2VicGFjazovLy8uL34vVXRpbHMvbGliL1V0aWxzQnJvd3Nlci50cz9jYzQwKiIsIndlYnBhY2s6Ly8vLi9+L1V0aWxzL2xpYi9VdGlsc0Nvb2tpZS50cz9jNTk0KiIsIndlYnBhY2s6Ly8vLi9+L3VybC91cmwuanM/ZDZhNCoiLCJ3ZWJwYWNrOi8vLy4vfi91cmwvfi9wdW55Y29kZS9wdW55Y29kZS5qcz84N2RlKiIsIndlYnBhY2s6Ly8vKHdlYnBhY2spL2J1aWxkaW4vbW9kdWxlLmpzP2MzYzIqIiwid2VicGFjazovLy8uL34vdXJsL3V0aWwuanM/NTZlYSoiLCJ3ZWJwYWNrOi8vLy4vfi9xdWVyeXN0cmluZy9pbmRleC5qcz9mY2U4KiIsIndlYnBhY2s6Ly8vLi9+L3F1ZXJ5c3RyaW5nL2RlY29kZS5qcz9jMjUwKiIsIndlYnBhY2s6Ly8vLi9+L3F1ZXJ5c3RyaW5nL2VuY29kZS5qcz9lODZiKiIsIndlYnBhY2s6Ly8vLi9+L1V0aWxzL2xpYi9VdGlsc0RvY3VtZW50LnRzPzRkMzEqIiwid2VicGFjazovLy8uL34vVXRpbHMvbGliL1V0aWxzV2luZG93LnRzPzU0YjAqIiwid2VicGFjazovLy8uL34vVXRpbHMvbGliL1V0aWxzRE9NLnRzP2NiYTkqIiwid2VicGFjazovLy8uL34vVXRpbHMvbGliL1V0aWxzTW91c2UudHM/MWZkYyoiLCJ3ZWJwYWNrOi8vLy4vfi9VdGlscy9saWIvVXRpbHNTY3JlZW4udHM/NDE3OCoiLCJ3ZWJwYWNrOi8vLy4vfi9VdGlscy9saWIvVXRpbHNTeXN0ZW0udHM/YzJkMCoiLCJ3ZWJwYWNrOi8vLy4vfi9VdGlscy9saWIvVXRpbHNVc2VyLnRzP2EzNzYqIiwid2VicGFjazovLy8uL34vRXZlckNvb2tpZS9saWIvRXZlckNvb2tpZS50cz9jOThiKiIsIndlYnBhY2s6Ly8vLi9+L0FuaW1hdGlvbkZyYW1lL2xpYi9BbmltYXRpb25GcmFtZS50cz9hZTVlKiIsIndlYnBhY2s6Ly8vLi9+L0V2ZXJDb29raWUvbGliL1N0b3JhZ2VzL0Nvb2tpZXMudHM/Mjk5MioiLCJ3ZWJwYWNrOi8vLy4vfi9FdmVyQ29va2llL2xpYi9TdG9yYWdlcy9ET01TdG9yYWdlLnRzPzczYzEqIiwid2VicGFjazovLy8uL34vRXZlckNvb2tpZS9saWIvU3RvcmFnZXMvR2xvYmFsU3RvcmFnZS50cz81ZDYyKiIsIndlYnBhY2s6Ly8vLi9+L0V2ZXJDb29raWUvbGliL1N0b3JhZ2VzL0xvY2FsU3RvcmFnZS50cz85NmQ2KiIsIndlYnBhY2s6Ly8vLi9+L0V2ZXJDb29raWUvbGliL1N0b3JhZ2VzL1Nlc3Npb25TdG9yYWdlLnRzP2FhODQqIiwid2VicGFjazovLy8uL34vYnRvYS9pbmRleC5qcz83Y2YzKiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTztBQ1ZBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esc0JBQXFCLG1EQUFtRDtBQUN4RTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW1CLFVBQVU7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0JBQWlCLFlBQVk7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQSxJQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDJCQUEwQjtBQUMxQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQSx3Q0FBdUMsU0FBUztBQUNoRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZSxpQkFBaUI7QUFDaEM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxjQUFhLGlCQUFpQjtBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBaUIsU0FBUztBQUMxQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWlCLFNBQVM7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWlCLFNBQVM7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBZ0QsRUFBRTtBQUNsRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxrQkFBaUIsU0FBUztBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMENBQXlDO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx5QkFBd0IsZUFBZTtBQUN2QztBQUNBO0FBQ0E7QUFDQSxRQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQSx5QkFBd0IsUUFBUTtBQUNoQztBQUNBLHNCQUFxQixlQUFlO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQixZQUFZO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxzQkFBcUIsU0FBUztBQUM5QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsc0JBQXFCLFNBQVM7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0Esc0JBQXFCLFNBQVM7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0JBQWlCLGtCQUFrQjtBQUNuQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0Esb0JBQW1CLGNBQWM7QUFDakM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHdEQUF1RCxPQUFPO0FBQzlEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx3REFBdUQsT0FBTztBQUM5RDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxtQkFBa0I7QUFDbEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxzQkFBcUIsUUFBUTtBQUM3QjtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0EsZ0JBQWUsU0FBUztBQUN4QjtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLG9CQUFtQixTQUFTO0FBQzVCO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZSxpQkFBaUI7QUFDaEM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxrQkFBaUIsWUFBWTtBQUM3Qjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esa0JBQWlCLGdCQUFnQjtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQixnQkFBZ0I7QUFDakM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0Esa0JBQWlCLFlBQVk7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7O0FDNXZEQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsbUNBQWtDLFNBQVM7QUFDM0M7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBLHFCQUFvQixPQUFPO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHNCQUFxQixTQUFTO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwyQ0FBMEMsVUFBVTtBQUNwRDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7Ozs7OztBQ2pIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsU0FBUSxXQUFXOztBQUVuQjtBQUNBO0FBQ0E7QUFDQSxTQUFRLFdBQVc7O0FBRW5CO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxTQUFRLFdBQVc7O0FBRW5CO0FBQ0E7QUFDQSxTQUFRLFVBQVU7O0FBRWxCO0FBQ0E7Ozs7Ozs7QUNuRkEsa0JBQWlCOztBQUVqQjtBQUNBO0FBQ0E7Ozs7Ozs7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUEsdUNBQXNDLHVDQUF1QyxnQkFBZ0I7O0FBRTdGLGtEQUFpRCwwQ0FBMEMsMERBQTBELEVBQUU7O0FBRXZKO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWdCO0FBQ2hCOzs7QUFHQTtBQUNBLHdCQUF1QixnQkFBZ0I7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFnQjtBQUNoQjs7O0FBR0E7QUFDQTtBQUNBLHdCQUF1QixPQUFPO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBZ0I7QUFDaEI7OztBQUdBO0FBQ0E7QUFDQTtBQUNBLDZCQUE0QjtBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFnQjtBQUNoQjs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBZ0I7QUFDaEI7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1QsNENBQTJDLE9BQU87QUFDbEQsa0VBQWlFO0FBQ2pFO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0EsMEVBQXlFO0FBQ3pFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBa0I7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFnQjtBQUNoQjs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxpQkFBZ0I7QUFDaEI7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWdCO0FBQ2hCOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMEI7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMEI7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQXlCO0FBQ3pCO0FBQ0E7QUFDQSxzQkFBcUI7QUFDckI7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBZ0I7QUFDaEI7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsdUJBQXNCO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBMkIscUNBQXFDO0FBQ2hFO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXNCO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBaUI7QUFDakI7QUFDQSxjQUFhO0FBQ2IsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBZ0I7QUFDaEI7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBaUI7QUFDakI7QUFDQTtBQUNBLGNBQWE7QUFDYixVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFnQjtBQUNoQjs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDREQUEyRCxpQkFBaUI7QUFDNUU7QUFDQTtBQUNBO0FBQ0EsMEJBQXlCO0FBQ3pCLGdEQUErQyxJQUFJLFNBQVMsSUFBSSxFQUFFLEVBQUUsVUFBVSxJQUFJLFdBQVcsSUFBSSxFQUFFLEVBQUU7QUFDckc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCQUE2QjtBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXFCO0FBQ3JCLGtCQUFpQjtBQUNqQixjQUFhO0FBQ2I7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUF5QjtBQUN6QixzQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYixVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFnQjtBQUNoQjs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTs7QUFFQTtBQUNBLEVBQUM7O0FBRUQ7O0FBRUEseUI7Ozs7OztBQ25lQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQSx1Q0FBc0MsdUNBQXVDLGdCQUFnQjs7QUFFN0Ysa0RBQWlELDBDQUEwQywwREFBMEQsRUFBRTs7QUFFdko7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFnQjtBQUNoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWdCO0FBQ2hCOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWdCO0FBQ2hCOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFnQjtBQUNoQjs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFnQjtBQUNoQjs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFnQjtBQUNoQjs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBZ0I7QUFDaEI7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFtQixXQUFXO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsRUFBQzs7QUFFRCwrQjs7Ozs7O0FDcFJBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLHFHQUFvRyxtQkFBbUIsRUFBRSxtQkFBbUIsOEhBQThIOztBQUUxUTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQSx1Q0FBc0MsdUNBQXVDLGdCQUFnQjs7QUFFN0Ysa0RBQWlELDBDQUEwQywwREFBMEQsRUFBRTs7QUFFdko7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxxS0FBb0s7QUFDcEs7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxpQkFBZ0I7QUFDaEI7OztBQUdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEVBQUM7O0FBRUQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Qjs7Ozs7O0FDMU9BO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBLHVDQUFzQyx1Q0FBdUMsZ0JBQWdCOztBQUU3RixrREFBaUQsMENBQTBDLDBEQUEwRCxFQUFFOztBQUV2SjtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsbUQ7Ozs7OztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxrREFBaUQsMENBQTBDLDBEQUEwRCxFQUFFOztBQUV2SjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0EsY0FBYTtBQUNiO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxFQUFDOztBQUVEOztBQUVBLDRCOzs7Ozs7QUN2WEE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsa0RBQWlELDBDQUEwQywwREFBMEQsRUFBRTs7QUFFdko7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFnQjtBQUNoQjs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQSxVQUFTO0FBQ1Q7QUFDQSxVQUFTO0FBQ1Q7QUFDQSxVQUFTO0FBQ1Q7QUFDQSxVQUFTO0FBQ1Q7QUFDQSxVQUFTO0FBQ1Q7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWdCO0FBQ2hCOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBLFVBQVM7QUFDVDtBQUNBLFVBQVM7QUFDVDtBQUNBLFVBQVM7QUFDVDtBQUNBLFVBQVM7QUFDVDtBQUNBLFVBQVM7QUFDVDtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFnQjtBQUNoQjs7O0FBR0E7QUFDQTtBQUNBLDRCQUEyQjtBQUMzQix1SkFBc0o7QUFDdEo7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0JBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWdCO0FBQ2hCOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBZ0I7QUFDaEI7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBZ0I7QUFDaEI7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBZ0I7QUFDaEI7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBZ0I7QUFDaEI7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWdCO0FBQ2hCOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWdCO0FBQ2hCOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFnQjtBQUNoQjs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFnQjtBQUNoQjs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWdCO0FBQ2hCOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWdCO0FBQ2hCOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFnQjtBQUNoQjs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFnQjtBQUNoQjs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFnQjtBQUNoQjs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFnQjtBQUNoQjs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBZ0I7QUFDaEI7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWdCO0FBQ2hCOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWdCO0FBQ2hCOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWdC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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsaUJBQWdCLEtBQUs7O0FBRXJCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNDQUFxQztBQUNyQztBQUNBO0FBQ0EsNENBQTJDLEtBQUs7QUFDaEQsMkNBQTBDLEtBQUs7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBLFFBQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EscUNBQW9DO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxvQkFBbUIsNEJBQTRCO0FBQy9DO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esb0JBQW1CLHlCQUF5QjtBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLDRDQUEyQyxPQUFPO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTBDLE9BQU87QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMEMsT0FBTztBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsSUFBRztBQUNIOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG1CQUFrQixtQkFBbUI7QUFDckM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQW9CLG1CQUFtQjtBQUN2QztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXFCLGlCQUFpQjtBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLCtCQUE4QixRQUFRO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxXQUFVLE1BQU07QUFDaEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OzttQ0MzdEJBO0FBQ0EsRUFBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FB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QUNBLElBQUcsT0FBTztBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRSxPQUFPO0FBQ1Q7QUFDQTs7QUFFQSxFQUFDOzs7Ozs7OztBQ2poQkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUNUQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDZkE7O0FBRUE7QUFDQTs7Ozs7OztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsa0JBQWlCLFNBQVM7QUFDMUI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7O0FDL0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1QsUUFBTztBQUNQO0FB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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBc0I7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBZ0I7QUFDaEI7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWdCO0FBQ2hCOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWdCO0FBQ2hCOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZDQUE0QyxRQUFRO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxp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aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoXCJVc2VySURcIiwgW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiVXNlcklEXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIlVzZXJJRFwiXSA9IGZhY3RvcnkoKTtcbn0pKHRoaXMsIGZ1bmN0aW9uKCkge1xucmV0dXJuIFxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBhNWUwZjVjODAwNTQyM2Q3NTA4NyIsIi8qIVxuICogVGhlIGJ1ZmZlciBtb2R1bGUgZnJvbSBub2RlLmpzLCBmb3IgdGhlIGJyb3dzZXIuXG4gKlxuICogQGF1dGhvciAgIEZlcm9zcyBBYm91a2hhZGlqZWggPGZlcm9zc0BmZXJvc3Mub3JnPiA8aHR0cDovL2Zlcm9zcy5vcmc+XG4gKiBAbGljZW5zZSAgTUlUXG4gKi9cbi8qIGVzbGludC1kaXNhYmxlIG5vLXByb3RvICovXG5cbid1c2Ugc3RyaWN0J1xuXG52YXIgYmFzZTY0ID0gcmVxdWlyZSgnYmFzZTY0LWpzJylcbnZhciBpZWVlNzU0ID0gcmVxdWlyZSgnaWVlZTc1NCcpXG52YXIgaXNBcnJheSA9IHJlcXVpcmUoJ2lzYXJyYXknKVxuXG5leHBvcnRzLkJ1ZmZlciA9IEJ1ZmZlclxuZXhwb3J0cy5TbG93QnVmZmVyID0gU2xvd0J1ZmZlclxuZXhwb3J0cy5JTlNQRUNUX01BWF9CWVRFUyA9IDUwXG5cbi8qKlxuICogSWYgYEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUYDpcbiAqICAgPT09IHRydWUgICAgVXNlIFVpbnQ4QXJyYXkgaW1wbGVtZW50YXRpb24gKGZhc3Rlc3QpXG4gKiAgID09PSBmYWxzZSAgIFVzZSBPYmplY3QgaW1wbGVtZW50YXRpb24gKG1vc3QgY29tcGF0aWJsZSwgZXZlbiBJRTYpXG4gKlxuICogQnJvd3NlcnMgdGhhdCBzdXBwb3J0IHR5cGVkIGFycmF5cyBhcmUgSUUgMTArLCBGaXJlZm94IDQrLCBDaHJvbWUgNyssIFNhZmFyaSA1LjErLFxuICogT3BlcmEgMTEuNissIGlPUyA0LjIrLlxuICpcbiAqIER1ZSB0byB2YXJpb3VzIGJyb3dzZXIgYnVncywgc29tZXRpbWVzIHRoZSBPYmplY3QgaW1wbGVtZW50YXRpb24gd2lsbCBiZSB1c2VkIGV2ZW5cbiAqIHdoZW4gdGhlIGJyb3dzZXIgc3VwcG9ydHMgdHlwZWQgYXJyYXlzLlxuICpcbiAqIE5vdGU6XG4gKlxuICogICAtIEZpcmVmb3ggNC0yOSBsYWNrcyBzdXBwb3J0IGZvciBhZGRpbmcgbmV3IHByb3BlcnRpZXMgdG8gYFVpbnQ4QXJyYXlgIGluc3RhbmNlcyxcbiAqICAgICBTZWU6IGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTY5NTQzOC5cbiAqXG4gKiAgIC0gQ2hyb21lIDktMTAgaXMgbWlzc2luZyB0aGUgYFR5cGVkQXJyYXkucHJvdG90eXBlLnN1YmFycmF5YCBmdW5jdGlvbi5cbiAqXG4gKiAgIC0gSUUxMCBoYXMgYSBicm9rZW4gYFR5cGVkQXJyYXkucHJvdG90eXBlLnN1YmFycmF5YCBmdW5jdGlvbiB3aGljaCByZXR1cm5zIGFycmF5cyBvZlxuICogICAgIGluY29ycmVjdCBsZW5ndGggaW4gc29tZSBzaXR1YXRpb25zLlxuXG4gKiBXZSBkZXRlY3QgdGhlc2UgYnVnZ3kgYnJvd3NlcnMgYW5kIHNldCBgQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlRgIHRvIGBmYWxzZWAgc28gdGhleVxuICogZ2V0IHRoZSBPYmplY3QgaW1wbGVtZW50YXRpb24sIHdoaWNoIGlzIHNsb3dlciBidXQgYmVoYXZlcyBjb3JyZWN0bHkuXG4gKi9cbkJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUID0gZ2xvYmFsLlRZUEVEX0FSUkFZX1NVUFBPUlQgIT09IHVuZGVmaW5lZFxuICA/IGdsb2JhbC5UWVBFRF9BUlJBWV9TVVBQT1JUXG4gIDogdHlwZWRBcnJheVN1cHBvcnQoKVxuXG4vKlxuICogRXhwb3J0IGtNYXhMZW5ndGggYWZ0ZXIgdHlwZWQgYXJyYXkgc3VwcG9ydCBpcyBkZXRlcm1pbmVkLlxuICovXG5leHBvcnRzLmtNYXhMZW5ndGggPSBrTWF4TGVuZ3RoKClcblxuZnVuY3Rpb24gdHlwZWRBcnJheVN1cHBvcnQgKCkge1xuICB0cnkge1xuICAgIHZhciBhcnIgPSBuZXcgVWludDhBcnJheSgxKVxuICAgIGFyci5fX3Byb3RvX18gPSB7X19wcm90b19fOiBVaW50OEFycmF5LnByb3RvdHlwZSwgZm9vOiBmdW5jdGlvbiAoKSB7IHJldHVybiA0MiB9fVxuICAgIHJldHVybiBhcnIuZm9vKCkgPT09IDQyICYmIC8vIHR5cGVkIGFycmF5IGluc3RhbmNlcyBjYW4gYmUgYXVnbWVudGVkXG4gICAgICAgIHR5cGVvZiBhcnIuc3ViYXJyYXkgPT09ICdmdW5jdGlvbicgJiYgLy8gY2hyb21lIDktMTAgbGFjayBgc3ViYXJyYXlgXG4gICAgICAgIGFyci5zdWJhcnJheSgxLCAxKS5ieXRlTGVuZ3RoID09PSAwIC8vIGllMTAgaGFzIGJyb2tlbiBgc3ViYXJyYXlgXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuXG5mdW5jdGlvbiBrTWF4TGVuZ3RoICgpIHtcbiAgcmV0dXJuIEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUXG4gICAgPyAweDdmZmZmZmZmXG4gICAgOiAweDNmZmZmZmZmXG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUJ1ZmZlciAodGhhdCwgbGVuZ3RoKSB7XG4gIGlmIChrTWF4TGVuZ3RoKCkgPCBsZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignSW52YWxpZCB0eXBlZCBhcnJheSBsZW5ndGgnKVxuICB9XG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIC8vIFJldHVybiBhbiBhdWdtZW50ZWQgYFVpbnQ4QXJyYXlgIGluc3RhbmNlLCBmb3IgYmVzdCBwZXJmb3JtYW5jZVxuICAgIHRoYXQgPSBuZXcgVWludDhBcnJheShsZW5ndGgpXG4gICAgdGhhdC5fX3Byb3RvX18gPSBCdWZmZXIucHJvdG90eXBlXG4gIH0gZWxzZSB7XG4gICAgLy8gRmFsbGJhY2s6IFJldHVybiBhbiBvYmplY3QgaW5zdGFuY2Ugb2YgdGhlIEJ1ZmZlciBjbGFzc1xuICAgIGlmICh0aGF0ID09PSBudWxsKSB7XG4gICAgICB0aGF0ID0gbmV3IEJ1ZmZlcihsZW5ndGgpXG4gICAgfVxuICAgIHRoYXQubGVuZ3RoID0gbGVuZ3RoXG4gIH1cblxuICByZXR1cm4gdGhhdFxufVxuXG4vKipcbiAqIFRoZSBCdWZmZXIgY29uc3RydWN0b3IgcmV0dXJucyBpbnN0YW5jZXMgb2YgYFVpbnQ4QXJyYXlgIHRoYXQgaGF2ZSB0aGVpclxuICogcHJvdG90eXBlIGNoYW5nZWQgdG8gYEJ1ZmZlci5wcm90b3R5cGVgLiBGdXJ0aGVybW9yZSwgYEJ1ZmZlcmAgaXMgYSBzdWJjbGFzcyBvZlxuICogYFVpbnQ4QXJyYXlgLCBzbyB0aGUgcmV0dXJuZWQgaW5zdGFuY2VzIHdpbGwgaGF2ZSBhbGwgdGhlIG5vZGUgYEJ1ZmZlcmAgbWV0aG9kc1xuICogYW5kIHRoZSBgVWludDhBcnJheWAgbWV0aG9kcy4gU3F1YXJlIGJyYWNrZXQgbm90YXRpb24gd29ya3MgYXMgZXhwZWN0ZWQgLS0gaXRcbiAqIHJldHVybnMgYSBzaW5nbGUgb2N0ZXQuXG4gKlxuICogVGhlIGBVaW50OEFycmF5YCBwcm90b3R5cGUgcmVtYWlucyB1bm1vZGlmaWVkLlxuICovXG5cbmZ1bmN0aW9uIEJ1ZmZlciAoYXJnLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpIHtcbiAgaWYgKCFCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCAmJiAhKHRoaXMgaW5zdGFuY2VvZiBCdWZmZXIpKSB7XG4gICAgcmV0dXJuIG5ldyBCdWZmZXIoYXJnLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpXG4gIH1cblxuICAvLyBDb21tb24gY2FzZS5cbiAgaWYgKHR5cGVvZiBhcmcgPT09ICdudW1iZXInKSB7XG4gICAgaWYgKHR5cGVvZiBlbmNvZGluZ09yT2Zmc2V0ID09PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAnSWYgZW5jb2RpbmcgaXMgc3BlY2lmaWVkIHRoZW4gdGhlIGZpcnN0IGFyZ3VtZW50IG11c3QgYmUgYSBzdHJpbmcnXG4gICAgICApXG4gICAgfVxuICAgIHJldHVybiBhbGxvY1Vuc2FmZSh0aGlzLCBhcmcpXG4gIH1cbiAgcmV0dXJuIGZyb20odGhpcywgYXJnLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpXG59XG5cbkJ1ZmZlci5wb29sU2l6ZSA9IDgxOTIgLy8gbm90IHVzZWQgYnkgdGhpcyBpbXBsZW1lbnRhdGlvblxuXG4vLyBUT0RPOiBMZWdhY3ksIG5vdCBuZWVkZWQgYW55bW9yZS4gUmVtb3ZlIGluIG5leHQgbWFqb3IgdmVyc2lvbi5cbkJ1ZmZlci5fYXVnbWVudCA9IGZ1bmN0aW9uIChhcnIpIHtcbiAgYXJyLl9fcHJvdG9fXyA9IEJ1ZmZlci5wcm90b3R5cGVcbiAgcmV0dXJuIGFyclxufVxuXG5mdW5jdGlvbiBmcm9tICh0aGF0LCB2YWx1ZSwgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJ2YWx1ZVwiIGFyZ3VtZW50IG11c3Qgbm90IGJlIGEgbnVtYmVyJylcbiAgfVxuXG4gIGlmICh0eXBlb2YgQXJyYXlCdWZmZXIgIT09ICd1bmRlZmluZWQnICYmIHZhbHVlIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpIHtcbiAgICByZXR1cm4gZnJvbUFycmF5QnVmZmVyKHRoYXQsIHZhbHVlLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpXG4gIH1cblxuICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBmcm9tU3RyaW5nKHRoYXQsIHZhbHVlLCBlbmNvZGluZ09yT2Zmc2V0KVxuICB9XG5cbiAgcmV0dXJuIGZyb21PYmplY3QodGhhdCwgdmFsdWUpXG59XG5cbi8qKlxuICogRnVuY3Rpb25hbGx5IGVxdWl2YWxlbnQgdG8gQnVmZmVyKGFyZywgZW5jb2RpbmcpIGJ1dCB0aHJvd3MgYSBUeXBlRXJyb3JcbiAqIGlmIHZhbHVlIGlzIGEgbnVtYmVyLlxuICogQnVmZmVyLmZyb20oc3RyWywgZW5jb2RpbmddKVxuICogQnVmZmVyLmZyb20oYXJyYXkpXG4gKiBCdWZmZXIuZnJvbShidWZmZXIpXG4gKiBCdWZmZXIuZnJvbShhcnJheUJ1ZmZlclssIGJ5dGVPZmZzZXRbLCBsZW5ndGhdXSlcbiAqKi9cbkJ1ZmZlci5mcm9tID0gZnVuY3Rpb24gKHZhbHVlLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGZyb20obnVsbCwgdmFsdWUsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aClcbn1cblxuaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gIEJ1ZmZlci5wcm90b3R5cGUuX19wcm90b19fID0gVWludDhBcnJheS5wcm90b3R5cGVcbiAgQnVmZmVyLl9fcHJvdG9fXyA9IFVpbnQ4QXJyYXlcbiAgaWYgKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC5zcGVjaWVzICYmXG4gICAgICBCdWZmZXJbU3ltYm9sLnNwZWNpZXNdID09PSBCdWZmZXIpIHtcbiAgICAvLyBGaXggc3ViYXJyYXkoKSBpbiBFUzIwMTYuIFNlZTogaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXIvcHVsbC85N1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShCdWZmZXIsIFN5bWJvbC5zcGVjaWVzLCB7XG4gICAgICB2YWx1ZTogbnVsbCxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pXG4gIH1cbn1cblxuZnVuY3Rpb24gYXNzZXJ0U2l6ZSAoc2l6ZSkge1xuICBpZiAodHlwZW9mIHNpemUgIT09ICdudW1iZXInKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJzaXplXCIgYXJndW1lbnQgbXVzdCBiZSBhIG51bWJlcicpXG4gIH0gZWxzZSBpZiAoc2l6ZSA8IDApIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignXCJzaXplXCIgYXJndW1lbnQgbXVzdCBub3QgYmUgbmVnYXRpdmUnKVxuICB9XG59XG5cbmZ1bmN0aW9uIGFsbG9jICh0aGF0LCBzaXplLCBmaWxsLCBlbmNvZGluZykge1xuICBhc3NlcnRTaXplKHNpemUpXG4gIGlmIChzaXplIDw9IDApIHtcbiAgICByZXR1cm4gY3JlYXRlQnVmZmVyKHRoYXQsIHNpemUpXG4gIH1cbiAgaWYgKGZpbGwgIT09IHVuZGVmaW5lZCkge1xuICAgIC8vIE9ubHkgcGF5IGF0dGVudGlvbiB0byBlbmNvZGluZyBpZiBpdCdzIGEgc3RyaW5nLiBUaGlzXG4gICAgLy8gcHJldmVudHMgYWNjaWRlbnRhbGx5IHNlbmRpbmcgaW4gYSBudW1iZXIgdGhhdCB3b3VsZFxuICAgIC8vIGJlIGludGVycHJldHRlZCBhcyBhIHN0YXJ0IG9mZnNldC5cbiAgICByZXR1cm4gdHlwZW9mIGVuY29kaW5nID09PSAnc3RyaW5nJ1xuICAgICAgPyBjcmVhdGVCdWZmZXIodGhhdCwgc2l6ZSkuZmlsbChmaWxsLCBlbmNvZGluZylcbiAgICAgIDogY3JlYXRlQnVmZmVyKHRoYXQsIHNpemUpLmZpbGwoZmlsbClcbiAgfVxuICByZXR1cm4gY3JlYXRlQnVmZmVyKHRoYXQsIHNpemUpXG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBmaWxsZWQgQnVmZmVyIGluc3RhbmNlLlxuICogYWxsb2Moc2l6ZVssIGZpbGxbLCBlbmNvZGluZ11dKVxuICoqL1xuQnVmZmVyLmFsbG9jID0gZnVuY3Rpb24gKHNpemUsIGZpbGwsIGVuY29kaW5nKSB7XG4gIHJldHVybiBhbGxvYyhudWxsLCBzaXplLCBmaWxsLCBlbmNvZGluZylcbn1cblxuZnVuY3Rpb24gYWxsb2NVbnNhZmUgKHRoYXQsIHNpemUpIHtcbiAgYXNzZXJ0U2l6ZShzaXplKVxuICB0aGF0ID0gY3JlYXRlQnVmZmVyKHRoYXQsIHNpemUgPCAwID8gMCA6IGNoZWNrZWQoc2l6ZSkgfCAwKVxuICBpZiAoIUJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzaXplOyArK2kpIHtcbiAgICAgIHRoYXRbaV0gPSAwXG4gICAgfVxuICB9XG4gIHJldHVybiB0aGF0XG59XG5cbi8qKlxuICogRXF1aXZhbGVudCB0byBCdWZmZXIobnVtKSwgYnkgZGVmYXVsdCBjcmVhdGVzIGEgbm9uLXplcm8tZmlsbGVkIEJ1ZmZlciBpbnN0YW5jZS5cbiAqICovXG5CdWZmZXIuYWxsb2NVbnNhZmUgPSBmdW5jdGlvbiAoc2l6ZSkge1xuICByZXR1cm4gYWxsb2NVbnNhZmUobnVsbCwgc2l6ZSlcbn1cbi8qKlxuICogRXF1aXZhbGVudCB0byBTbG93QnVmZmVyKG51bSksIGJ5IGRlZmF1bHQgY3JlYXRlcyBhIG5vbi16ZXJvLWZpbGxlZCBCdWZmZXIgaW5zdGFuY2UuXG4gKi9cbkJ1ZmZlci5hbGxvY1Vuc2FmZVNsb3cgPSBmdW5jdGlvbiAoc2l6ZSkge1xuICByZXR1cm4gYWxsb2NVbnNhZmUobnVsbCwgc2l6ZSlcbn1cblxuZnVuY3Rpb24gZnJvbVN0cmluZyAodGhhdCwgc3RyaW5nLCBlbmNvZGluZykge1xuICBpZiAodHlwZW9mIGVuY29kaW5nICE9PSAnc3RyaW5nJyB8fCBlbmNvZGluZyA9PT0gJycpIHtcbiAgICBlbmNvZGluZyA9ICd1dGY4J1xuICB9XG5cbiAgaWYgKCFCdWZmZXIuaXNFbmNvZGluZyhlbmNvZGluZykpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcImVuY29kaW5nXCIgbXVzdCBiZSBhIHZhbGlkIHN0cmluZyBlbmNvZGluZycpXG4gIH1cblxuICB2YXIgbGVuZ3RoID0gYnl0ZUxlbmd0aChzdHJpbmcsIGVuY29kaW5nKSB8IDBcbiAgdGhhdCA9IGNyZWF0ZUJ1ZmZlcih0aGF0LCBsZW5ndGgpXG5cbiAgdmFyIGFjdHVhbCA9IHRoYXQud3JpdGUoc3RyaW5nLCBlbmNvZGluZylcblxuICBpZiAoYWN0dWFsICE9PSBsZW5ndGgpIHtcbiAgICAvLyBXcml0aW5nIGEgaGV4IHN0cmluZywgZm9yIGV4YW1wbGUsIHRoYXQgY29udGFpbnMgaW52YWxpZCBjaGFyYWN0ZXJzIHdpbGxcbiAgICAvLyBjYXVzZSBldmVyeXRoaW5nIGFmdGVyIHRoZSBmaXJzdCBpbnZhbGlkIGNoYXJhY3RlciB0byBiZSBpZ25vcmVkLiAoZS5nLlxuICAgIC8vICdhYnh4Y2QnIHdpbGwgYmUgdHJlYXRlZCBhcyAnYWInKVxuICAgIHRoYXQgPSB0aGF0LnNsaWNlKDAsIGFjdHVhbClcbiAgfVxuXG4gIHJldHVybiB0aGF0XG59XG5cbmZ1bmN0aW9uIGZyb21BcnJheUxpa2UgKHRoYXQsIGFycmF5KSB7XG4gIHZhciBsZW5ndGggPSBhcnJheS5sZW5ndGggPCAwID8gMCA6IGNoZWNrZWQoYXJyYXkubGVuZ3RoKSB8IDBcbiAgdGhhdCA9IGNyZWF0ZUJ1ZmZlcih0aGF0LCBsZW5ndGgpXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpICs9IDEpIHtcbiAgICB0aGF0W2ldID0gYXJyYXlbaV0gJiAyNTVcbiAgfVxuICByZXR1cm4gdGhhdFxufVxuXG5mdW5jdGlvbiBmcm9tQXJyYXlCdWZmZXIgKHRoYXQsIGFycmF5LCBieXRlT2Zmc2V0LCBsZW5ndGgpIHtcbiAgYXJyYXkuYnl0ZUxlbmd0aCAvLyB0aGlzIHRocm93cyBpZiBgYXJyYXlgIGlzIG5vdCBhIHZhbGlkIEFycmF5QnVmZmVyXG5cbiAgaWYgKGJ5dGVPZmZzZXQgPCAwIHx8IGFycmF5LmJ5dGVMZW5ndGggPCBieXRlT2Zmc2V0KSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1xcJ29mZnNldFxcJyBpcyBvdXQgb2YgYm91bmRzJylcbiAgfVxuXG4gIGlmIChhcnJheS5ieXRlTGVuZ3RoIDwgYnl0ZU9mZnNldCArIChsZW5ndGggfHwgMCkpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignXFwnbGVuZ3RoXFwnIGlzIG91dCBvZiBib3VuZHMnKVxuICB9XG5cbiAgaWYgKGJ5dGVPZmZzZXQgPT09IHVuZGVmaW5lZCAmJiBsZW5ndGggPT09IHVuZGVmaW5lZCkge1xuICAgIGFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoYXJyYXkpXG4gIH0gZWxzZSBpZiAobGVuZ3RoID09PSB1bmRlZmluZWQpIHtcbiAgICBhcnJheSA9IG5ldyBVaW50OEFycmF5KGFycmF5LCBieXRlT2Zmc2V0KVxuICB9IGVsc2Uge1xuICAgIGFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoYXJyYXksIGJ5dGVPZmZzZXQsIGxlbmd0aClcbiAgfVxuXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIC8vIFJldHVybiBhbiBhdWdtZW50ZWQgYFVpbnQ4QXJyYXlgIGluc3RhbmNlLCBmb3IgYmVzdCBwZXJmb3JtYW5jZVxuICAgIHRoYXQgPSBhcnJheVxuICAgIHRoYXQuX19wcm90b19fID0gQnVmZmVyLnByb3RvdHlwZVxuICB9IGVsc2Uge1xuICAgIC8vIEZhbGxiYWNrOiBSZXR1cm4gYW4gb2JqZWN0IGluc3RhbmNlIG9mIHRoZSBCdWZmZXIgY2xhc3NcbiAgICB0aGF0ID0gZnJvbUFycmF5TGlrZSh0aGF0LCBhcnJheSlcbiAgfVxuICByZXR1cm4gdGhhdFxufVxuXG5mdW5jdGlvbiBmcm9tT2JqZWN0ICh0aGF0LCBvYmopIHtcbiAgaWYgKEJ1ZmZlci5pc0J1ZmZlcihvYmopKSB7XG4gICAgdmFyIGxlbiA9IGNoZWNrZWQob2JqLmxlbmd0aCkgfCAwXG4gICAgdGhhdCA9IGNyZWF0ZUJ1ZmZlcih0aGF0LCBsZW4pXG5cbiAgICBpZiAodGhhdC5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiB0aGF0XG4gICAgfVxuXG4gICAgb2JqLmNvcHkodGhhdCwgMCwgMCwgbGVuKVxuICAgIHJldHVybiB0aGF0XG4gIH1cblxuICBpZiAob2JqKSB7XG4gICAgaWYgKCh0eXBlb2YgQXJyYXlCdWZmZXIgIT09ICd1bmRlZmluZWQnICYmXG4gICAgICAgIG9iai5idWZmZXIgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcikgfHwgJ2xlbmd0aCcgaW4gb2JqKSB7XG4gICAgICBpZiAodHlwZW9mIG9iai5sZW5ndGggIT09ICdudW1iZXInIHx8IGlzbmFuKG9iai5sZW5ndGgpKSB7XG4gICAgICAgIHJldHVybiBjcmVhdGVCdWZmZXIodGhhdCwgMClcbiAgICAgIH1cbiAgICAgIHJldHVybiBmcm9tQXJyYXlMaWtlKHRoYXQsIG9iailcbiAgICB9XG5cbiAgICBpZiAob2JqLnR5cGUgPT09ICdCdWZmZXInICYmIGlzQXJyYXkob2JqLmRhdGEpKSB7XG4gICAgICByZXR1cm4gZnJvbUFycmF5TGlrZSh0aGF0LCBvYmouZGF0YSlcbiAgICB9XG4gIH1cblxuICB0aHJvdyBuZXcgVHlwZUVycm9yKCdGaXJzdCBhcmd1bWVudCBtdXN0IGJlIGEgc3RyaW5nLCBCdWZmZXIsIEFycmF5QnVmZmVyLCBBcnJheSwgb3IgYXJyYXktbGlrZSBvYmplY3QuJylcbn1cblxuZnVuY3Rpb24gY2hlY2tlZCAobGVuZ3RoKSB7XG4gIC8vIE5vdGU6IGNhbm5vdCB1c2UgYGxlbmd0aCA8IGtNYXhMZW5ndGgoKWAgaGVyZSBiZWNhdXNlIHRoYXQgZmFpbHMgd2hlblxuICAvLyBsZW5ndGggaXMgTmFOICh3aGljaCBpcyBvdGhlcndpc2UgY29lcmNlZCB0byB6ZXJvLilcbiAgaWYgKGxlbmd0aCA+PSBrTWF4TGVuZ3RoKCkpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQXR0ZW1wdCB0byBhbGxvY2F0ZSBCdWZmZXIgbGFyZ2VyIHRoYW4gbWF4aW11bSAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAnc2l6ZTogMHgnICsga01heExlbmd0aCgpLnRvU3RyaW5nKDE2KSArICcgYnl0ZXMnKVxuICB9XG4gIHJldHVybiBsZW5ndGggfCAwXG59XG5cbmZ1bmN0aW9uIFNsb3dCdWZmZXIgKGxlbmd0aCkge1xuICBpZiAoK2xlbmd0aCAhPSBsZW5ndGgpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBlcWVxZXFcbiAgICBsZW5ndGggPSAwXG4gIH1cbiAgcmV0dXJuIEJ1ZmZlci5hbGxvYygrbGVuZ3RoKVxufVxuXG5CdWZmZXIuaXNCdWZmZXIgPSBmdW5jdGlvbiBpc0J1ZmZlciAoYikge1xuICByZXR1cm4gISEoYiAhPSBudWxsICYmIGIuX2lzQnVmZmVyKVxufVxuXG5CdWZmZXIuY29tcGFyZSA9IGZ1bmN0aW9uIGNvbXBhcmUgKGEsIGIpIHtcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIoYSkgfHwgIUJ1ZmZlci5pc0J1ZmZlcihiKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50cyBtdXN0IGJlIEJ1ZmZlcnMnKVxuICB9XG5cbiAgaWYgKGEgPT09IGIpIHJldHVybiAwXG5cbiAgdmFyIHggPSBhLmxlbmd0aFxuICB2YXIgeSA9IGIubGVuZ3RoXG5cbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IE1hdGgubWluKHgsIHkpOyBpIDwgbGVuOyArK2kpIHtcbiAgICBpZiAoYVtpXSAhPT0gYltpXSkge1xuICAgICAgeCA9IGFbaV1cbiAgICAgIHkgPSBiW2ldXG4gICAgICBicmVha1xuICAgIH1cbiAgfVxuXG4gIGlmICh4IDwgeSkgcmV0dXJuIC0xXG4gIGlmICh5IDwgeCkgcmV0dXJuIDFcbiAgcmV0dXJuIDBcbn1cblxuQnVmZmVyLmlzRW5jb2RpbmcgPSBmdW5jdGlvbiBpc0VuY29kaW5nIChlbmNvZGluZykge1xuICBzd2l0Y2ggKFN0cmluZyhlbmNvZGluZykudG9Mb3dlckNhc2UoKSkge1xuICAgIGNhc2UgJ2hleCc6XG4gICAgY2FzZSAndXRmOCc6XG4gICAgY2FzZSAndXRmLTgnOlxuICAgIGNhc2UgJ2FzY2lpJzpcbiAgICBjYXNlICdsYXRpbjEnOlxuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1Y3MtMic6XG4gICAgY2FzZSAndXRmMTZsZSc6XG4gICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgcmV0dXJuIHRydWVcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cblxuQnVmZmVyLmNvbmNhdCA9IGZ1bmN0aW9uIGNvbmNhdCAobGlzdCwgbGVuZ3RoKSB7XG4gIGlmICghaXNBcnJheShsaXN0KSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wibGlzdFwiIGFyZ3VtZW50IG11c3QgYmUgYW4gQXJyYXkgb2YgQnVmZmVycycpXG4gIH1cblxuICBpZiAobGlzdC5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gQnVmZmVyLmFsbG9jKDApXG4gIH1cblxuICB2YXIgaVxuICBpZiAobGVuZ3RoID09PSB1bmRlZmluZWQpIHtcbiAgICBsZW5ndGggPSAwXG4gICAgZm9yIChpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyArK2kpIHtcbiAgICAgIGxlbmd0aCArPSBsaXN0W2ldLmxlbmd0aFxuICAgIH1cbiAgfVxuXG4gIHZhciBidWZmZXIgPSBCdWZmZXIuYWxsb2NVbnNhZmUobGVuZ3RoKVxuICB2YXIgcG9zID0gMFxuICBmb3IgKGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7ICsraSkge1xuICAgIHZhciBidWYgPSBsaXN0W2ldXG4gICAgaWYgKCFCdWZmZXIuaXNCdWZmZXIoYnVmKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJsaXN0XCIgYXJndW1lbnQgbXVzdCBiZSBhbiBBcnJheSBvZiBCdWZmZXJzJylcbiAgICB9XG4gICAgYnVmLmNvcHkoYnVmZmVyLCBwb3MpXG4gICAgcG9zICs9IGJ1Zi5sZW5ndGhcbiAgfVxuICByZXR1cm4gYnVmZmVyXG59XG5cbmZ1bmN0aW9uIGJ5dGVMZW5ndGggKHN0cmluZywgZW5jb2RpbmcpIHtcbiAgaWYgKEJ1ZmZlci5pc0J1ZmZlcihzdHJpbmcpKSB7XG4gICAgcmV0dXJuIHN0cmluZy5sZW5ndGhcbiAgfVxuICBpZiAodHlwZW9mIEFycmF5QnVmZmVyICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgQXJyYXlCdWZmZXIuaXNWaWV3ID09PSAnZnVuY3Rpb24nICYmXG4gICAgICAoQXJyYXlCdWZmZXIuaXNWaWV3KHN0cmluZykgfHwgc3RyaW5nIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpKSB7XG4gICAgcmV0dXJuIHN0cmluZy5ieXRlTGVuZ3RoXG4gIH1cbiAgaWYgKHR5cGVvZiBzdHJpbmcgIT09ICdzdHJpbmcnKSB7XG4gICAgc3RyaW5nID0gJycgKyBzdHJpbmdcbiAgfVxuXG4gIHZhciBsZW4gPSBzdHJpbmcubGVuZ3RoXG4gIGlmIChsZW4gPT09IDApIHJldHVybiAwXG5cbiAgLy8gVXNlIGEgZm9yIGxvb3AgdG8gYXZvaWQgcmVjdXJzaW9uXG4gIHZhciBsb3dlcmVkQ2FzZSA9IGZhbHNlXG4gIGZvciAoOzspIHtcbiAgICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgICBjYXNlICdhc2NpaSc6XG4gICAgICBjYXNlICdsYXRpbjEnOlxuICAgICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgICAgcmV0dXJuIGxlblxuICAgICAgY2FzZSAndXRmOCc6XG4gICAgICBjYXNlICd1dGYtOCc6XG4gICAgICBjYXNlIHVuZGVmaW5lZDpcbiAgICAgICAgcmV0dXJuIHV0ZjhUb0J5dGVzKHN0cmluZykubGVuZ3RoXG4gICAgICBjYXNlICd1Y3MyJzpcbiAgICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgICByZXR1cm4gbGVuICogMlxuICAgICAgY2FzZSAnaGV4JzpcbiAgICAgICAgcmV0dXJuIGxlbiA+Pj4gMVxuICAgICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgICAgcmV0dXJuIGJhc2U2NFRvQnl0ZXMoc3RyaW5nKS5sZW5ndGhcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmIChsb3dlcmVkQ2FzZSkgcmV0dXJuIHV0ZjhUb0J5dGVzKHN0cmluZykubGVuZ3RoIC8vIGFzc3VtZSB1dGY4XG4gICAgICAgIGVuY29kaW5nID0gKCcnICsgZW5jb2RpbmcpLnRvTG93ZXJDYXNlKClcbiAgICAgICAgbG93ZXJlZENhc2UgPSB0cnVlXG4gICAgfVxuICB9XG59XG5CdWZmZXIuYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGhcblxuZnVuY3Rpb24gc2xvd1RvU3RyaW5nIChlbmNvZGluZywgc3RhcnQsIGVuZCkge1xuICB2YXIgbG93ZXJlZENhc2UgPSBmYWxzZVxuXG4gIC8vIE5vIG5lZWQgdG8gdmVyaWZ5IHRoYXQgXCJ0aGlzLmxlbmd0aCA8PSBNQVhfVUlOVDMyXCIgc2luY2UgaXQncyBhIHJlYWQtb25seVxuICAvLyBwcm9wZXJ0eSBvZiBhIHR5cGVkIGFycmF5LlxuXG4gIC8vIFRoaXMgYmVoYXZlcyBuZWl0aGVyIGxpa2UgU3RyaW5nIG5vciBVaW50OEFycmF5IGluIHRoYXQgd2Ugc2V0IHN0YXJ0L2VuZFxuICAvLyB0byB0aGVpciB1cHBlci9sb3dlciBib3VuZHMgaWYgdGhlIHZhbHVlIHBhc3NlZCBpcyBvdXQgb2YgcmFuZ2UuXG4gIC8vIHVuZGVmaW5lZCBpcyBoYW5kbGVkIHNwZWNpYWxseSBhcyBwZXIgRUNNQS0yNjIgNnRoIEVkaXRpb24sXG4gIC8vIFNlY3Rpb24gMTMuMy4zLjcgUnVudGltZSBTZW1hbnRpY3M6IEtleWVkQmluZGluZ0luaXRpYWxpemF0aW9uLlxuICBpZiAoc3RhcnQgPT09IHVuZGVmaW5lZCB8fCBzdGFydCA8IDApIHtcbiAgICBzdGFydCA9IDBcbiAgfVxuICAvLyBSZXR1cm4gZWFybHkgaWYgc3RhcnQgPiB0aGlzLmxlbmd0aC4gRG9uZSBoZXJlIHRvIHByZXZlbnQgcG90ZW50aWFsIHVpbnQzMlxuICAvLyBjb2VyY2lvbiBmYWlsIGJlbG93LlxuICBpZiAoc3RhcnQgPiB0aGlzLmxlbmd0aCkge1xuICAgIHJldHVybiAnJ1xuICB9XG5cbiAgaWYgKGVuZCA9PT0gdW5kZWZpbmVkIHx8IGVuZCA+IHRoaXMubGVuZ3RoKSB7XG4gICAgZW5kID0gdGhpcy5sZW5ndGhcbiAgfVxuXG4gIGlmIChlbmQgPD0gMCkge1xuICAgIHJldHVybiAnJ1xuICB9XG5cbiAgLy8gRm9yY2UgY29lcnNpb24gdG8gdWludDMyLiBUaGlzIHdpbGwgYWxzbyBjb2VyY2UgZmFsc2V5L05hTiB2YWx1ZXMgdG8gMC5cbiAgZW5kID4+Pj0gMFxuICBzdGFydCA+Pj49IDBcblxuICBpZiAoZW5kIDw9IHN0YXJ0KSB7XG4gICAgcmV0dXJuICcnXG4gIH1cblxuICBpZiAoIWVuY29kaW5nKSBlbmNvZGluZyA9ICd1dGY4J1xuXG4gIHdoaWxlICh0cnVlKSB7XG4gICAgc3dpdGNoIChlbmNvZGluZykge1xuICAgICAgY2FzZSAnaGV4JzpcbiAgICAgICAgcmV0dXJuIGhleFNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ3V0ZjgnOlxuICAgICAgY2FzZSAndXRmLTgnOlxuICAgICAgICByZXR1cm4gdXRmOFNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgICAgcmV0dXJuIGFzY2lpU2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAnbGF0aW4xJzpcbiAgICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICAgIHJldHVybiBsYXRpbjFTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgICByZXR1cm4gYmFzZTY0U2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAndWNzMic6XG4gICAgICBjYXNlICd1Y3MtMic6XG4gICAgICBjYXNlICd1dGYxNmxlJzpcbiAgICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgICAgcmV0dXJuIHV0ZjE2bGVTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAobG93ZXJlZENhc2UpIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Vua25vd24gZW5jb2Rpbmc6ICcgKyBlbmNvZGluZylcbiAgICAgICAgZW5jb2RpbmcgPSAoZW5jb2RpbmcgKyAnJykudG9Mb3dlckNhc2UoKVxuICAgICAgICBsb3dlcmVkQ2FzZSA9IHRydWVcbiAgICB9XG4gIH1cbn1cblxuLy8gVGhlIHByb3BlcnR5IGlzIHVzZWQgYnkgYEJ1ZmZlci5pc0J1ZmZlcmAgYW5kIGBpcy1idWZmZXJgIChpbiBTYWZhcmkgNS03KSB0byBkZXRlY3Rcbi8vIEJ1ZmZlciBpbnN0YW5jZXMuXG5CdWZmZXIucHJvdG90eXBlLl9pc0J1ZmZlciA9IHRydWVcblxuZnVuY3Rpb24gc3dhcCAoYiwgbiwgbSkge1xuICB2YXIgaSA9IGJbbl1cbiAgYltuXSA9IGJbbV1cbiAgYlttXSA9IGlcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5zd2FwMTYgPSBmdW5jdGlvbiBzd2FwMTYgKCkge1xuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgaWYgKGxlbiAlIDIgIT09IDApIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQnVmZmVyIHNpemUgbXVzdCBiZSBhIG11bHRpcGxlIG9mIDE2LWJpdHMnKVxuICB9XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpICs9IDIpIHtcbiAgICBzd2FwKHRoaXMsIGksIGkgKyAxKVxuICB9XG4gIHJldHVybiB0aGlzXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc3dhcDMyID0gZnVuY3Rpb24gc3dhcDMyICgpIHtcbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoXG4gIGlmIChsZW4gJSA0ICE9PSAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0J1ZmZlciBzaXplIG11c3QgYmUgYSBtdWx0aXBsZSBvZiAzMi1iaXRzJylcbiAgfVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSArPSA0KSB7XG4gICAgc3dhcCh0aGlzLCBpLCBpICsgMylcbiAgICBzd2FwKHRoaXMsIGkgKyAxLCBpICsgMilcbiAgfVxuICByZXR1cm4gdGhpc1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnN3YXA2NCA9IGZ1bmN0aW9uIHN3YXA2NCAoKSB7XG4gIHZhciBsZW4gPSB0aGlzLmxlbmd0aFxuICBpZiAobGVuICUgOCAhPT0gMCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdCdWZmZXIgc2l6ZSBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgNjQtYml0cycpXG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkgKz0gOCkge1xuICAgIHN3YXAodGhpcywgaSwgaSArIDcpXG4gICAgc3dhcCh0aGlzLCBpICsgMSwgaSArIDYpXG4gICAgc3dhcCh0aGlzLCBpICsgMiwgaSArIDUpXG4gICAgc3dhcCh0aGlzLCBpICsgMywgaSArIDQpXG4gIH1cbiAgcmV0dXJuIHRoaXNcbn1cblxuQnVmZmVyLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nICgpIHtcbiAgdmFyIGxlbmd0aCA9IHRoaXMubGVuZ3RoIHwgMFxuICBpZiAobGVuZ3RoID09PSAwKSByZXR1cm4gJydcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHJldHVybiB1dGY4U2xpY2UodGhpcywgMCwgbGVuZ3RoKVxuICByZXR1cm4gc2xvd1RvU3RyaW5nLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5lcXVhbHMgPSBmdW5jdGlvbiBlcXVhbHMgKGIpIHtcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIoYikpIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50IG11c3QgYmUgYSBCdWZmZXInKVxuICBpZiAodGhpcyA9PT0gYikgcmV0dXJuIHRydWVcbiAgcmV0dXJuIEJ1ZmZlci5jb21wYXJlKHRoaXMsIGIpID09PSAwXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuaW5zcGVjdCA9IGZ1bmN0aW9uIGluc3BlY3QgKCkge1xuICB2YXIgc3RyID0gJydcbiAgdmFyIG1heCA9IGV4cG9ydHMuSU5TUEVDVF9NQVhfQllURVNcbiAgaWYgKHRoaXMubGVuZ3RoID4gMCkge1xuICAgIHN0ciA9IHRoaXMudG9TdHJpbmcoJ2hleCcsIDAsIG1heCkubWF0Y2goLy57Mn0vZykuam9pbignICcpXG4gICAgaWYgKHRoaXMubGVuZ3RoID4gbWF4KSBzdHIgKz0gJyAuLi4gJ1xuICB9XG4gIHJldHVybiAnPEJ1ZmZlciAnICsgc3RyICsgJz4nXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuY29tcGFyZSA9IGZ1bmN0aW9uIGNvbXBhcmUgKHRhcmdldCwgc3RhcnQsIGVuZCwgdGhpc1N0YXJ0LCB0aGlzRW5kKSB7XG4gIGlmICghQnVmZmVyLmlzQnVmZmVyKHRhcmdldCkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudCBtdXN0IGJlIGEgQnVmZmVyJylcbiAgfVxuXG4gIGlmIChzdGFydCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgc3RhcnQgPSAwXG4gIH1cbiAgaWYgKGVuZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgZW5kID0gdGFyZ2V0ID8gdGFyZ2V0Lmxlbmd0aCA6IDBcbiAgfVxuICBpZiAodGhpc1N0YXJ0ID09PSB1bmRlZmluZWQpIHtcbiAgICB0aGlzU3RhcnQgPSAwXG4gIH1cbiAgaWYgKHRoaXNFbmQgPT09IHVuZGVmaW5lZCkge1xuICAgIHRoaXNFbmQgPSB0aGlzLmxlbmd0aFxuICB9XG5cbiAgaWYgKHN0YXJ0IDwgMCB8fCBlbmQgPiB0YXJnZXQubGVuZ3RoIHx8IHRoaXNTdGFydCA8IDAgfHwgdGhpc0VuZCA+IHRoaXMubGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ291dCBvZiByYW5nZSBpbmRleCcpXG4gIH1cblxuICBpZiAodGhpc1N0YXJ0ID49IHRoaXNFbmQgJiYgc3RhcnQgPj0gZW5kKSB7XG4gICAgcmV0dXJuIDBcbiAgfVxuICBpZiAodGhpc1N0YXJ0ID49IHRoaXNFbmQpIHtcbiAgICByZXR1cm4gLTFcbiAgfVxuICBpZiAoc3RhcnQgPj0gZW5kKSB7XG4gICAgcmV0dXJuIDFcbiAgfVxuXG4gIHN0YXJ0ID4+Pj0gMFxuICBlbmQgPj4+PSAwXG4gIHRoaXNTdGFydCA+Pj49IDBcbiAgdGhpc0VuZCA+Pj49IDBcblxuICBpZiAodGhpcyA9PT0gdGFyZ2V0KSByZXR1cm4gMFxuXG4gIHZhciB4ID0gdGhpc0VuZCAtIHRoaXNTdGFydFxuICB2YXIgeSA9IGVuZCAtIHN0YXJ0XG4gIHZhciBsZW4gPSBNYXRoLm1pbih4LCB5KVxuXG4gIHZhciB0aGlzQ29weSA9IHRoaXMuc2xpY2UodGhpc1N0YXJ0LCB0aGlzRW5kKVxuICB2YXIgdGFyZ2V0Q29weSA9IHRhcmdldC5zbGljZShzdGFydCwgZW5kKVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyArK2kpIHtcbiAgICBpZiAodGhpc0NvcHlbaV0gIT09IHRhcmdldENvcHlbaV0pIHtcbiAgICAgIHggPSB0aGlzQ29weVtpXVxuICAgICAgeSA9IHRhcmdldENvcHlbaV1cbiAgICAgIGJyZWFrXG4gICAgfVxuICB9XG5cbiAgaWYgKHggPCB5KSByZXR1cm4gLTFcbiAgaWYgKHkgPCB4KSByZXR1cm4gMVxuICByZXR1cm4gMFxufVxuXG4vLyBGaW5kcyBlaXRoZXIgdGhlIGZpcnN0IGluZGV4IG9mIGB2YWxgIGluIGBidWZmZXJgIGF0IG9mZnNldCA+PSBgYnl0ZU9mZnNldGAsXG4vLyBPUiB0aGUgbGFzdCBpbmRleCBvZiBgdmFsYCBpbiBgYnVmZmVyYCBhdCBvZmZzZXQgPD0gYGJ5dGVPZmZzZXRgLlxuLy9cbi8vIEFyZ3VtZW50czpcbi8vIC0gYnVmZmVyIC0gYSBCdWZmZXIgdG8gc2VhcmNoXG4vLyAtIHZhbCAtIGEgc3RyaW5nLCBCdWZmZXIsIG9yIG51bWJlclxuLy8gLSBieXRlT2Zmc2V0IC0gYW4gaW5kZXggaW50byBgYnVmZmVyYDsgd2lsbCBiZSBjbGFtcGVkIHRvIGFuIGludDMyXG4vLyAtIGVuY29kaW5nIC0gYW4gb3B0aW9uYWwgZW5jb2RpbmcsIHJlbGV2YW50IGlzIHZhbCBpcyBhIHN0cmluZ1xuLy8gLSBkaXIgLSB0cnVlIGZvciBpbmRleE9mLCBmYWxzZSBmb3IgbGFzdEluZGV4T2ZcbmZ1bmN0aW9uIGJpZGlyZWN0aW9uYWxJbmRleE9mIChidWZmZXIsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIGRpcikge1xuICAvLyBFbXB0eSBidWZmZXIgbWVhbnMgbm8gbWF0Y2hcbiAgaWYgKGJ1ZmZlci5sZW5ndGggPT09IDApIHJldHVybiAtMVxuXG4gIC8vIE5vcm1hbGl6ZSBieXRlT2Zmc2V0XG4gIGlmICh0eXBlb2YgYnl0ZU9mZnNldCA9PT0gJ3N0cmluZycpIHtcbiAgICBlbmNvZGluZyA9IGJ5dGVPZmZzZXRcbiAgICBieXRlT2Zmc2V0ID0gMFxuICB9IGVsc2UgaWYgKGJ5dGVPZmZzZXQgPiAweDdmZmZmZmZmKSB7XG4gICAgYnl0ZU9mZnNldCA9IDB4N2ZmZmZmZmZcbiAgfSBlbHNlIGlmIChieXRlT2Zmc2V0IDwgLTB4ODAwMDAwMDApIHtcbiAgICBieXRlT2Zmc2V0ID0gLTB4ODAwMDAwMDBcbiAgfVxuICBieXRlT2Zmc2V0ID0gK2J5dGVPZmZzZXQgIC8vIENvZXJjZSB0byBOdW1iZXIuXG4gIGlmIChpc05hTihieXRlT2Zmc2V0KSkge1xuICAgIC8vIGJ5dGVPZmZzZXQ6IGl0IGl0J3MgdW5kZWZpbmVkLCBudWxsLCBOYU4sIFwiZm9vXCIsIGV0Yywgc2VhcmNoIHdob2xlIGJ1ZmZlclxuICAgIGJ5dGVPZmZzZXQgPSBkaXIgPyAwIDogKGJ1ZmZlci5sZW5ndGggLSAxKVxuICB9XG5cbiAgLy8gTm9ybWFsaXplIGJ5dGVPZmZzZXQ6IG5lZ2F0aXZlIG9mZnNldHMgc3RhcnQgZnJvbSB0aGUgZW5kIG9mIHRoZSBidWZmZXJcbiAgaWYgKGJ5dGVPZmZzZXQgPCAwKSBieXRlT2Zmc2V0ID0gYnVmZmVyLmxlbmd0aCArIGJ5dGVPZmZzZXRcbiAgaWYgKGJ5dGVPZmZzZXQgPj0gYnVmZmVyLmxlbmd0aCkge1xuICAgIGlmIChkaXIpIHJldHVybiAtMVxuICAgIGVsc2UgYnl0ZU9mZnNldCA9IGJ1ZmZlci5sZW5ndGggLSAxXG4gIH0gZWxzZSBpZiAoYnl0ZU9mZnNldCA8IDApIHtcbiAgICBpZiAoZGlyKSBieXRlT2Zmc2V0ID0gMFxuICAgIGVsc2UgcmV0dXJuIC0xXG4gIH1cblxuICAvLyBOb3JtYWxpemUgdmFsXG4gIGlmICh0eXBlb2YgdmFsID09PSAnc3RyaW5nJykge1xuICAgIHZhbCA9IEJ1ZmZlci5mcm9tKHZhbCwgZW5jb2RpbmcpXG4gIH1cblxuICAvLyBGaW5hbGx5LCBzZWFyY2ggZWl0aGVyIGluZGV4T2YgKGlmIGRpciBpcyB0cnVlKSBvciBsYXN0SW5kZXhPZlxuICBpZiAoQnVmZmVyLmlzQnVmZmVyKHZhbCkpIHtcbiAgICAvLyBTcGVjaWFsIGNhc2U6IGxvb2tpbmcgZm9yIGVtcHR5IHN0cmluZy9idWZmZXIgYWx3YXlzIGZhaWxzXG4gICAgaWYgKHZhbC5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiAtMVxuICAgIH1cbiAgICByZXR1cm4gYXJyYXlJbmRleE9mKGJ1ZmZlciwgdmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZywgZGlyKVxuICB9IGVsc2UgaWYgKHR5cGVvZiB2YWwgPT09ICdudW1iZXInKSB7XG4gICAgdmFsID0gdmFsICYgMHhGRiAvLyBTZWFyY2ggZm9yIGEgYnl0ZSB2YWx1ZSBbMC0yNTVdXG4gICAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUICYmXG4gICAgICAgIHR5cGVvZiBVaW50OEFycmF5LnByb3RvdHlwZS5pbmRleE9mID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBpZiAoZGlyKSB7XG4gICAgICAgIHJldHVybiBVaW50OEFycmF5LnByb3RvdHlwZS5pbmRleE9mLmNhbGwoYnVmZmVyLCB2YWwsIGJ5dGVPZmZzZXQpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gVWludDhBcnJheS5wcm90b3R5cGUubGFzdEluZGV4T2YuY2FsbChidWZmZXIsIHZhbCwgYnl0ZU9mZnNldClcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGFycmF5SW5kZXhPZihidWZmZXIsIFsgdmFsIF0sIGJ5dGVPZmZzZXQsIGVuY29kaW5nLCBkaXIpXG4gIH1cblxuICB0aHJvdyBuZXcgVHlwZUVycm9yKCd2YWwgbXVzdCBiZSBzdHJpbmcsIG51bWJlciBvciBCdWZmZXInKVxufVxuXG5mdW5jdGlvbiBhcnJheUluZGV4T2YgKGFyciwgdmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZywgZGlyKSB7XG4gIHZhciBpbmRleFNpemUgPSAxXG4gIHZhciBhcnJMZW5ndGggPSBhcnIubGVuZ3RoXG4gIHZhciB2YWxMZW5ndGggPSB2YWwubGVuZ3RoXG5cbiAgaWYgKGVuY29kaW5nICE9PSB1bmRlZmluZWQpIHtcbiAgICBlbmNvZGluZyA9IFN0cmluZyhlbmNvZGluZykudG9Mb3dlckNhc2UoKVxuICAgIGlmIChlbmNvZGluZyA9PT0gJ3VjczInIHx8IGVuY29kaW5nID09PSAndWNzLTInIHx8XG4gICAgICAgIGVuY29kaW5nID09PSAndXRmMTZsZScgfHwgZW5jb2RpbmcgPT09ICd1dGYtMTZsZScpIHtcbiAgICAgIGlmIChhcnIubGVuZ3RoIDwgMiB8fCB2YWwubGVuZ3RoIDwgMikge1xuICAgICAgICByZXR1cm4gLTFcbiAgICAgIH1cbiAgICAgIGluZGV4U2l6ZSA9IDJcbiAgICAgIGFyckxlbmd0aCAvPSAyXG4gICAgICB2YWxMZW5ndGggLz0gMlxuICAgICAgYnl0ZU9mZnNldCAvPSAyXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcmVhZCAoYnVmLCBpKSB7XG4gICAgaWYgKGluZGV4U2l6ZSA9PT0gMSkge1xuICAgICAgcmV0dXJuIGJ1ZltpXVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gYnVmLnJlYWRVSW50MTZCRShpICogaW5kZXhTaXplKVxuICAgIH1cbiAgfVxuXG4gIHZhciBpXG4gIGlmIChkaXIpIHtcbiAgICB2YXIgZm91bmRJbmRleCA9IC0xXG4gICAgZm9yIChpID0gYnl0ZU9mZnNldDsgaSA8IGFyckxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAocmVhZChhcnIsIGkpID09PSByZWFkKHZhbCwgZm91bmRJbmRleCA9PT0gLTEgPyAwIDogaSAtIGZvdW5kSW5kZXgpKSB7XG4gICAgICAgIGlmIChmb3VuZEluZGV4ID09PSAtMSkgZm91bmRJbmRleCA9IGlcbiAgICAgICAgaWYgKGkgLSBmb3VuZEluZGV4ICsgMSA9PT0gdmFsTGVuZ3RoKSByZXR1cm4gZm91bmRJbmRleCAqIGluZGV4U2l6ZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGZvdW5kSW5kZXggIT09IC0xKSBpIC09IGkgLSBmb3VuZEluZGV4XG4gICAgICAgIGZvdW5kSW5kZXggPSAtMVxuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoYnl0ZU9mZnNldCArIHZhbExlbmd0aCA+IGFyckxlbmd0aCkgYnl0ZU9mZnNldCA9IGFyckxlbmd0aCAtIHZhbExlbmd0aFxuICAgIGZvciAoaSA9IGJ5dGVPZmZzZXQ7IGkgPj0gMDsgaS0tKSB7XG4gICAgICB2YXIgZm91bmQgPSB0cnVlXG4gICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHZhbExlbmd0aDsgaisrKSB7XG4gICAgICAgIGlmIChyZWFkKGFyciwgaSArIGopICE9PSByZWFkKHZhbCwgaikpIHtcbiAgICAgICAgICBmb3VuZCA9IGZhbHNlXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGZvdW5kKSByZXR1cm4gaVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiAtMVxufVxuXG5CdWZmZXIucHJvdG90eXBlLmluY2x1ZGVzID0gZnVuY3Rpb24gaW5jbHVkZXMgKHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcpIHtcbiAgcmV0dXJuIHRoaXMuaW5kZXhPZih2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nKSAhPT0gLTFcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5pbmRleE9mID0gZnVuY3Rpb24gaW5kZXhPZiAodmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZykge1xuICByZXR1cm4gYmlkaXJlY3Rpb25hbEluZGV4T2YodGhpcywgdmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZywgdHJ1ZSlcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5sYXN0SW5kZXhPZiA9IGZ1bmN0aW9uIGxhc3RJbmRleE9mICh2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nKSB7XG4gIHJldHVybiBiaWRpcmVjdGlvbmFsSW5kZXhPZih0aGlzLCB2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nLCBmYWxzZSlcbn1cblxuZnVuY3Rpb24gaGV4V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICBvZmZzZXQgPSBOdW1iZXIob2Zmc2V0KSB8fCAwXG4gIHZhciByZW1haW5pbmcgPSBidWYubGVuZ3RoIC0gb2Zmc2V0XG4gIGlmICghbGVuZ3RoKSB7XG4gICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gIH0gZWxzZSB7XG4gICAgbGVuZ3RoID0gTnVtYmVyKGxlbmd0aClcbiAgICBpZiAobGVuZ3RoID4gcmVtYWluaW5nKSB7XG4gICAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgICB9XG4gIH1cblxuICAvLyBtdXN0IGJlIGFuIGV2ZW4gbnVtYmVyIG9mIGRpZ2l0c1xuICB2YXIgc3RyTGVuID0gc3RyaW5nLmxlbmd0aFxuICBpZiAoc3RyTGVuICUgMiAhPT0gMCkgdGhyb3cgbmV3IFR5cGVFcnJvcignSW52YWxpZCBoZXggc3RyaW5nJylcblxuICBpZiAobGVuZ3RoID4gc3RyTGVuIC8gMikge1xuICAgIGxlbmd0aCA9IHN0ckxlbiAvIDJcbiAgfVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgdmFyIHBhcnNlZCA9IHBhcnNlSW50KHN0cmluZy5zdWJzdHIoaSAqIDIsIDIpLCAxNilcbiAgICBpZiAoaXNOYU4ocGFyc2VkKSkgcmV0dXJuIGlcbiAgICBidWZbb2Zmc2V0ICsgaV0gPSBwYXJzZWRcbiAgfVxuICByZXR1cm4gaVxufVxuXG5mdW5jdGlvbiB1dGY4V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gYmxpdEJ1ZmZlcih1dGY4VG9CeXRlcyhzdHJpbmcsIGJ1Zi5sZW5ndGggLSBvZmZzZXQpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiBhc2NpaVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGJsaXRCdWZmZXIoYXNjaWlUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbmZ1bmN0aW9uIGxhdGluMVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGFzY2lpV3JpdGUoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiBiYXNlNjRXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBibGl0QnVmZmVyKGJhc2U2NFRvQnl0ZXMoc3RyaW5nKSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gdWNzMldyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGJsaXRCdWZmZXIodXRmMTZsZVRvQnl0ZXMoc3RyaW5nLCBidWYubGVuZ3RoIC0gb2Zmc2V0KSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uIHdyaXRlIChzdHJpbmcsIG9mZnNldCwgbGVuZ3RoLCBlbmNvZGluZykge1xuICAvLyBCdWZmZXIjd3JpdGUoc3RyaW5nKVxuICBpZiAob2Zmc2V0ID09PSB1bmRlZmluZWQpIHtcbiAgICBlbmNvZGluZyA9ICd1dGY4J1xuICAgIGxlbmd0aCA9IHRoaXMubGVuZ3RoXG4gICAgb2Zmc2V0ID0gMFxuICAvLyBCdWZmZXIjd3JpdGUoc3RyaW5nLCBlbmNvZGluZylcbiAgfSBlbHNlIGlmIChsZW5ndGggPT09IHVuZGVmaW5lZCAmJiB0eXBlb2Ygb2Zmc2V0ID09PSAnc3RyaW5nJykge1xuICAgIGVuY29kaW5nID0gb2Zmc2V0XG4gICAgbGVuZ3RoID0gdGhpcy5sZW5ndGhcbiAgICBvZmZzZXQgPSAwXG4gIC8vIEJ1ZmZlciN3cml0ZShzdHJpbmcsIG9mZnNldFssIGxlbmd0aF1bLCBlbmNvZGluZ10pXG4gIH0gZWxzZSBpZiAoaXNGaW5pdGUob2Zmc2V0KSkge1xuICAgIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgICBpZiAoaXNGaW5pdGUobGVuZ3RoKSkge1xuICAgICAgbGVuZ3RoID0gbGVuZ3RoIHwgMFxuICAgICAgaWYgKGVuY29kaW5nID09PSB1bmRlZmluZWQpIGVuY29kaW5nID0gJ3V0ZjgnXG4gICAgfSBlbHNlIHtcbiAgICAgIGVuY29kaW5nID0gbGVuZ3RoXG4gICAgICBsZW5ndGggPSB1bmRlZmluZWRcbiAgICB9XG4gIC8vIGxlZ2FjeSB3cml0ZShzdHJpbmcsIGVuY29kaW5nLCBvZmZzZXQsIGxlbmd0aCkgLSByZW1vdmUgaW4gdjAuMTNcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAnQnVmZmVyLndyaXRlKHN0cmluZywgZW5jb2RpbmcsIG9mZnNldFssIGxlbmd0aF0pIGlzIG5vIGxvbmdlciBzdXBwb3J0ZWQnXG4gICAgKVxuICB9XG5cbiAgdmFyIHJlbWFpbmluZyA9IHRoaXMubGVuZ3RoIC0gb2Zmc2V0XG4gIGlmIChsZW5ndGggPT09IHVuZGVmaW5lZCB8fCBsZW5ndGggPiByZW1haW5pbmcpIGxlbmd0aCA9IHJlbWFpbmluZ1xuXG4gIGlmICgoc3RyaW5nLmxlbmd0aCA+IDAgJiYgKGxlbmd0aCA8IDAgfHwgb2Zmc2V0IDwgMCkpIHx8IG9mZnNldCA+IHRoaXMubGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0F0dGVtcHQgdG8gd3JpdGUgb3V0c2lkZSBidWZmZXIgYm91bmRzJylcbiAgfVxuXG4gIGlmICghZW5jb2RpbmcpIGVuY29kaW5nID0gJ3V0ZjgnXG5cbiAgdmFyIGxvd2VyZWRDYXNlID0gZmFsc2VcbiAgZm9yICg7Oykge1xuICAgIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICAgIGNhc2UgJ2hleCc6XG4gICAgICAgIHJldHVybiBoZXhXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICd1dGY4JzpcbiAgICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgICAgcmV0dXJuIHV0ZjhXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICdhc2NpaSc6XG4gICAgICAgIHJldHVybiBhc2NpaVdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGNhc2UgJ2xhdGluMSc6XG4gICAgICBjYXNlICdiaW5hcnknOlxuICAgICAgICByZXR1cm4gbGF0aW4xV3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgICAgLy8gV2FybmluZzogbWF4TGVuZ3RoIG5vdCB0YWtlbiBpbnRvIGFjY291bnQgaW4gYmFzZTY0V3JpdGVcbiAgICAgICAgcmV0dXJuIGJhc2U2NFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGNhc2UgJ3VjczInOlxuICAgICAgY2FzZSAndWNzLTInOlxuICAgICAgY2FzZSAndXRmMTZsZSc6XG4gICAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICAgIHJldHVybiB1Y3MyV3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgaWYgKGxvd2VyZWRDYXNlKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdVbmtub3duIGVuY29kaW5nOiAnICsgZW5jb2RpbmcpXG4gICAgICAgIGVuY29kaW5nID0gKCcnICsgZW5jb2RpbmcpLnRvTG93ZXJDYXNlKClcbiAgICAgICAgbG93ZXJlZENhc2UgPSB0cnVlXG4gICAgfVxuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUudG9KU09OID0gZnVuY3Rpb24gdG9KU09OICgpIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiAnQnVmZmVyJyxcbiAgICBkYXRhOiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCh0aGlzLl9hcnIgfHwgdGhpcywgMClcbiAgfVxufVxuXG5mdW5jdGlvbiBiYXNlNjRTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIGlmIChzdGFydCA9PT0gMCAmJiBlbmQgPT09IGJ1Zi5sZW5ndGgpIHtcbiAgICByZXR1cm4gYmFzZTY0LmZyb21CeXRlQXJyYXkoYnVmKVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBiYXNlNjQuZnJvbUJ5dGVBcnJheShidWYuc2xpY2Uoc3RhcnQsIGVuZCkpXG4gIH1cbn1cblxuZnVuY3Rpb24gdXRmOFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgZW5kID0gTWF0aC5taW4oYnVmLmxlbmd0aCwgZW5kKVxuICB2YXIgcmVzID0gW11cblxuICB2YXIgaSA9IHN0YXJ0XG4gIHdoaWxlIChpIDwgZW5kKSB7XG4gICAgdmFyIGZpcnN0Qnl0ZSA9IGJ1ZltpXVxuICAgIHZhciBjb2RlUG9pbnQgPSBudWxsXG4gICAgdmFyIGJ5dGVzUGVyU2VxdWVuY2UgPSAoZmlyc3RCeXRlID4gMHhFRikgPyA0XG4gICAgICA6IChmaXJzdEJ5dGUgPiAweERGKSA/IDNcbiAgICAgIDogKGZpcnN0Qnl0ZSA+IDB4QkYpID8gMlxuICAgICAgOiAxXG5cbiAgICBpZiAoaSArIGJ5dGVzUGVyU2VxdWVuY2UgPD0gZW5kKSB7XG4gICAgICB2YXIgc2Vjb25kQnl0ZSwgdGhpcmRCeXRlLCBmb3VydGhCeXRlLCB0ZW1wQ29kZVBvaW50XG5cbiAgICAgIHN3aXRjaCAoYnl0ZXNQZXJTZXF1ZW5jZSkge1xuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgaWYgKGZpcnN0Qnl0ZSA8IDB4ODApIHtcbiAgICAgICAgICAgIGNvZGVQb2ludCA9IGZpcnN0Qnl0ZVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgc2Vjb25kQnl0ZSA9IGJ1ZltpICsgMV1cbiAgICAgICAgICBpZiAoKHNlY29uZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCkge1xuICAgICAgICAgICAgdGVtcENvZGVQb2ludCA9IChmaXJzdEJ5dGUgJiAweDFGKSA8PCAweDYgfCAoc2Vjb25kQnl0ZSAmIDB4M0YpXG4gICAgICAgICAgICBpZiAodGVtcENvZGVQb2ludCA+IDB4N0YpIHtcbiAgICAgICAgICAgICAgY29kZVBvaW50ID0gdGVtcENvZGVQb2ludFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgc2Vjb25kQnl0ZSA9IGJ1ZltpICsgMV1cbiAgICAgICAgICB0aGlyZEJ5dGUgPSBidWZbaSArIDJdXG4gICAgICAgICAgaWYgKChzZWNvbmRCeXRlICYgMHhDMCkgPT09IDB4ODAgJiYgKHRoaXJkQnl0ZSAmIDB4QzApID09PSAweDgwKSB7XG4gICAgICAgICAgICB0ZW1wQ29kZVBvaW50ID0gKGZpcnN0Qnl0ZSAmIDB4RikgPDwgMHhDIHwgKHNlY29uZEJ5dGUgJiAweDNGKSA8PCAweDYgfCAodGhpcmRCeXRlICYgMHgzRilcbiAgICAgICAgICAgIGlmICh0ZW1wQ29kZVBvaW50ID4gMHg3RkYgJiYgKHRlbXBDb2RlUG9pbnQgPCAweEQ4MDAgfHwgdGVtcENvZGVQb2ludCA+IDB4REZGRikpIHtcbiAgICAgICAgICAgICAgY29kZVBvaW50ID0gdGVtcENvZGVQb2ludFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgc2Vjb25kQnl0ZSA9IGJ1ZltpICsgMV1cbiAgICAgICAgICB0aGlyZEJ5dGUgPSBidWZbaSArIDJdXG4gICAgICAgICAgZm91cnRoQnl0ZSA9IGJ1ZltpICsgM11cbiAgICAgICAgICBpZiAoKHNlY29uZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCAmJiAodGhpcmRCeXRlICYgMHhDMCkgPT09IDB4ODAgJiYgKGZvdXJ0aEJ5dGUgJiAweEMwKSA9PT0gMHg4MCkge1xuICAgICAgICAgICAgdGVtcENvZGVQb2ludCA9IChmaXJzdEJ5dGUgJiAweEYpIDw8IDB4MTIgfCAoc2Vjb25kQnl0ZSAmIDB4M0YpIDw8IDB4QyB8ICh0aGlyZEJ5dGUgJiAweDNGKSA8PCAweDYgfCAoZm91cnRoQnl0ZSAmIDB4M0YpXG4gICAgICAgICAgICBpZiAodGVtcENvZGVQb2ludCA+IDB4RkZGRiAmJiB0ZW1wQ29kZVBvaW50IDwgMHgxMTAwMDApIHtcbiAgICAgICAgICAgICAgY29kZVBvaW50ID0gdGVtcENvZGVQb2ludFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoY29kZVBvaW50ID09PSBudWxsKSB7XG4gICAgICAvLyB3ZSBkaWQgbm90IGdlbmVyYXRlIGEgdmFsaWQgY29kZVBvaW50IHNvIGluc2VydCBhXG4gICAgICAvLyByZXBsYWNlbWVudCBjaGFyIChVK0ZGRkQpIGFuZCBhZHZhbmNlIG9ubHkgMSBieXRlXG4gICAgICBjb2RlUG9pbnQgPSAweEZGRkRcbiAgICAgIGJ5dGVzUGVyU2VxdWVuY2UgPSAxXG4gICAgfSBlbHNlIGlmIChjb2RlUG9pbnQgPiAweEZGRkYpIHtcbiAgICAgIC8vIGVuY29kZSB0byB1dGYxNiAoc3Vycm9nYXRlIHBhaXIgZGFuY2UpXG4gICAgICBjb2RlUG9pbnQgLT0gMHgxMDAwMFxuICAgICAgcmVzLnB1c2goY29kZVBvaW50ID4+PiAxMCAmIDB4M0ZGIHwgMHhEODAwKVxuICAgICAgY29kZVBvaW50ID0gMHhEQzAwIHwgY29kZVBvaW50ICYgMHgzRkZcbiAgICB9XG5cbiAgICByZXMucHVzaChjb2RlUG9pbnQpXG4gICAgaSArPSBieXRlc1BlclNlcXVlbmNlXG4gIH1cblxuICByZXR1cm4gZGVjb2RlQ29kZVBvaW50c0FycmF5KHJlcylcbn1cblxuLy8gQmFzZWQgb24gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMjI3NDcyNzIvNjgwNzQyLCB0aGUgYnJvd3NlciB3aXRoXG4vLyB0aGUgbG93ZXN0IGxpbWl0IGlzIENocm9tZSwgd2l0aCAweDEwMDAwIGFyZ3MuXG4vLyBXZSBnbyAxIG1hZ25pdHVkZSBsZXNzLCBmb3Igc2FmZXR5XG52YXIgTUFYX0FSR1VNRU5UU19MRU5HVEggPSAweDEwMDBcblxuZnVuY3Rpb24gZGVjb2RlQ29kZVBvaW50c0FycmF5IChjb2RlUG9pbnRzKSB7XG4gIHZhciBsZW4gPSBjb2RlUG9pbnRzLmxlbmd0aFxuICBpZiAobGVuIDw9IE1BWF9BUkdVTUVOVFNfTEVOR1RIKSB7XG4gICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkoU3RyaW5nLCBjb2RlUG9pbnRzKSAvLyBhdm9pZCBleHRyYSBzbGljZSgpXG4gIH1cblxuICAvLyBEZWNvZGUgaW4gY2h1bmtzIHRvIGF2b2lkIFwiY2FsbCBzdGFjayBzaXplIGV4Y2VlZGVkXCIuXG4gIHZhciByZXMgPSAnJ1xuICB2YXIgaSA9IDBcbiAgd2hpbGUgKGkgPCBsZW4pIHtcbiAgICByZXMgKz0gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShcbiAgICAgIFN0cmluZyxcbiAgICAgIGNvZGVQb2ludHMuc2xpY2UoaSwgaSArPSBNQVhfQVJHVU1FTlRTX0xFTkdUSClcbiAgICApXG4gIH1cbiAgcmV0dXJuIHJlc1xufVxuXG5mdW5jdGlvbiBhc2NpaVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHJldCA9ICcnXG4gIGVuZCA9IE1hdGgubWluKGJ1Zi5sZW5ndGgsIGVuZClcblxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7ICsraSkge1xuICAgIHJldCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ1ZltpXSAmIDB4N0YpXG4gIH1cbiAgcmV0dXJuIHJldFxufVxuXG5mdW5jdGlvbiBsYXRpbjFTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciByZXQgPSAnJ1xuICBlbmQgPSBNYXRoLm1pbihidWYubGVuZ3RoLCBlbmQpXG5cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyArK2kpIHtcbiAgICByZXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShidWZbaV0pXG4gIH1cbiAgcmV0dXJuIHJldFxufVxuXG5mdW5jdGlvbiBoZXhTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG5cbiAgaWYgKCFzdGFydCB8fCBzdGFydCA8IDApIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCB8fCBlbmQgPCAwIHx8IGVuZCA+IGxlbikgZW5kID0gbGVuXG5cbiAgdmFyIG91dCA9ICcnXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgKytpKSB7XG4gICAgb3V0ICs9IHRvSGV4KGJ1ZltpXSlcbiAgfVxuICByZXR1cm4gb3V0XG59XG5cbmZ1bmN0aW9uIHV0ZjE2bGVTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciBieXRlcyA9IGJ1Zi5zbGljZShzdGFydCwgZW5kKVxuICB2YXIgcmVzID0gJydcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBieXRlcy5sZW5ndGg7IGkgKz0gMikge1xuICAgIHJlcyArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ5dGVzW2ldICsgYnl0ZXNbaSArIDFdICogMjU2KVxuICB9XG4gIHJldHVybiByZXNcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5zbGljZSA9IGZ1bmN0aW9uIHNsaWNlIChzdGFydCwgZW5kKSB7XG4gIHZhciBsZW4gPSB0aGlzLmxlbmd0aFxuICBzdGFydCA9IH5+c3RhcnRcbiAgZW5kID0gZW5kID09PSB1bmRlZmluZWQgPyBsZW4gOiB+fmVuZFxuXG4gIGlmIChzdGFydCA8IDApIHtcbiAgICBzdGFydCArPSBsZW5cbiAgICBpZiAoc3RhcnQgPCAwKSBzdGFydCA9IDBcbiAgfSBlbHNlIGlmIChzdGFydCA+IGxlbikge1xuICAgIHN0YXJ0ID0gbGVuXG4gIH1cblxuICBpZiAoZW5kIDwgMCkge1xuICAgIGVuZCArPSBsZW5cbiAgICBpZiAoZW5kIDwgMCkgZW5kID0gMFxuICB9IGVsc2UgaWYgKGVuZCA+IGxlbikge1xuICAgIGVuZCA9IGxlblxuICB9XG5cbiAgaWYgKGVuZCA8IHN0YXJ0KSBlbmQgPSBzdGFydFxuXG4gIHZhciBuZXdCdWZcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgbmV3QnVmID0gdGhpcy5zdWJhcnJheShzdGFydCwgZW5kKVxuICAgIG5ld0J1Zi5fX3Byb3RvX18gPSBCdWZmZXIucHJvdG90eXBlXG4gIH0gZWxzZSB7XG4gICAgdmFyIHNsaWNlTGVuID0gZW5kIC0gc3RhcnRcbiAgICBuZXdCdWYgPSBuZXcgQnVmZmVyKHNsaWNlTGVuLCB1bmRlZmluZWQpXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzbGljZUxlbjsgKytpKSB7XG4gICAgICBuZXdCdWZbaV0gPSB0aGlzW2kgKyBzdGFydF1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gbmV3QnVmXG59XG5cbi8qXG4gKiBOZWVkIHRvIG1ha2Ugc3VyZSB0aGF0IGJ1ZmZlciBpc24ndCB0cnlpbmcgdG8gd3JpdGUgb3V0IG9mIGJvdW5kcy5cbiAqL1xuZnVuY3Rpb24gY2hlY2tPZmZzZXQgKG9mZnNldCwgZXh0LCBsZW5ndGgpIHtcbiAgaWYgKChvZmZzZXQgJSAxKSAhPT0gMCB8fCBvZmZzZXQgPCAwKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignb2Zmc2V0IGlzIG5vdCB1aW50JylcbiAgaWYgKG9mZnNldCArIGV4dCA+IGxlbmd0aCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1RyeWluZyB0byBhY2Nlc3MgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50TEUgPSBmdW5jdGlvbiByZWFkVUludExFIChvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgYnl0ZUxlbmd0aCwgdGhpcy5sZW5ndGgpXG5cbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0XVxuICB2YXIgbXVsID0gMVxuICB2YXIgaSA9IDBcbiAgd2hpbGUgKCsraSA8IGJ5dGVMZW5ndGggJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB2YWwgKz0gdGhpc1tvZmZzZXQgKyBpXSAqIG11bFxuICB9XG5cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50QkUgPSBmdW5jdGlvbiByZWFkVUludEJFIChvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggfCAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBjaGVja09mZnNldChvZmZzZXQsIGJ5dGVMZW5ndGgsIHRoaXMubGVuZ3RoKVxuICB9XG5cbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0ICsgLS1ieXRlTGVuZ3RoXVxuICB2YXIgbXVsID0gMVxuICB3aGlsZSAoYnl0ZUxlbmd0aCA+IDAgJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB2YWwgKz0gdGhpc1tvZmZzZXQgKyAtLWJ5dGVMZW5ndGhdICogbXVsXG4gIH1cblxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQ4ID0gZnVuY3Rpb24gcmVhZFVJbnQ4IChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMSwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiB0aGlzW29mZnNldF1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDE2TEUgPSBmdW5jdGlvbiByZWFkVUludDE2TEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAyLCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIHRoaXNbb2Zmc2V0XSB8ICh0aGlzW29mZnNldCArIDFdIDw8IDgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQxNkJFID0gZnVuY3Rpb24gcmVhZFVJbnQxNkJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMiwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiAodGhpc1tvZmZzZXRdIDw8IDgpIHwgdGhpc1tvZmZzZXQgKyAxXVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MzJMRSA9IGZ1bmN0aW9uIHJlYWRVSW50MzJMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuXG4gIHJldHVybiAoKHRoaXNbb2Zmc2V0XSkgfFxuICAgICAgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgOCkgfFxuICAgICAgKHRoaXNbb2Zmc2V0ICsgMl0gPDwgMTYpKSArXG4gICAgICAodGhpc1tvZmZzZXQgKyAzXSAqIDB4MTAwMDAwMClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDMyQkUgPSBmdW5jdGlvbiByZWFkVUludDMyQkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcblxuICByZXR1cm4gKHRoaXNbb2Zmc2V0XSAqIDB4MTAwMDAwMCkgK1xuICAgICgodGhpc1tvZmZzZXQgKyAxXSA8PCAxNikgfFxuICAgICh0aGlzW29mZnNldCArIDJdIDw8IDgpIHxcbiAgICB0aGlzW29mZnNldCArIDNdKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnRMRSA9IGZ1bmN0aW9uIHJlYWRJbnRMRSAob2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoIHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIGJ5dGVMZW5ndGgsIHRoaXMubGVuZ3RoKVxuXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldF1cbiAgdmFyIG11bCA9IDFcbiAgdmFyIGkgPSAwXG4gIHdoaWxlICgrK2kgPCBieXRlTGVuZ3RoICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdmFsICs9IHRoaXNbb2Zmc2V0ICsgaV0gKiBtdWxcbiAgfVxuICBtdWwgKj0gMHg4MFxuXG4gIGlmICh2YWwgPj0gbXVsKSB2YWwgLT0gTWF0aC5wb3coMiwgOCAqIGJ5dGVMZW5ndGgpXG5cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnRCRSA9IGZ1bmN0aW9uIHJlYWRJbnRCRSAob2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoIHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIGJ5dGVMZW5ndGgsIHRoaXMubGVuZ3RoKVxuXG4gIHZhciBpID0gYnl0ZUxlbmd0aFxuICB2YXIgbXVsID0gMVxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXQgKyAtLWldXG4gIHdoaWxlIChpID4gMCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHZhbCArPSB0aGlzW29mZnNldCArIC0taV0gKiBtdWxcbiAgfVxuICBtdWwgKj0gMHg4MFxuXG4gIGlmICh2YWwgPj0gbXVsKSB2YWwgLT0gTWF0aC5wb3coMiwgOCAqIGJ5dGVMZW5ndGgpXG5cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQ4ID0gZnVuY3Rpb24gcmVhZEludDggKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAxLCB0aGlzLmxlbmd0aClcbiAgaWYgKCEodGhpc1tvZmZzZXRdICYgMHg4MCkpIHJldHVybiAodGhpc1tvZmZzZXRdKVxuICByZXR1cm4gKCgweGZmIC0gdGhpc1tvZmZzZXRdICsgMSkgKiAtMSlcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MTZMRSA9IGZ1bmN0aW9uIHJlYWRJbnQxNkxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMiwgdGhpcy5sZW5ndGgpXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldF0gfCAodGhpc1tvZmZzZXQgKyAxXSA8PCA4KVxuICByZXR1cm4gKHZhbCAmIDB4ODAwMCkgPyB2YWwgfCAweEZGRkYwMDAwIDogdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDE2QkUgPSBmdW5jdGlvbiByZWFkSW50MTZCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDIsIHRoaXMubGVuZ3RoKVxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXQgKyAxXSB8ICh0aGlzW29mZnNldF0gPDwgOClcbiAgcmV0dXJuICh2YWwgJiAweDgwMDApID8gdmFsIHwgMHhGRkZGMDAwMCA6IHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQzMkxFID0gZnVuY3Rpb24gcmVhZEludDMyTEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcblxuICByZXR1cm4gKHRoaXNbb2Zmc2V0XSkgfFxuICAgICh0aGlzW29mZnNldCArIDFdIDw8IDgpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAyXSA8PCAxNikgfFxuICAgICh0aGlzW29mZnNldCArIDNdIDw8IDI0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQzMkJFID0gZnVuY3Rpb24gcmVhZEludDMyQkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcblxuICByZXR1cm4gKHRoaXNbb2Zmc2V0XSA8PCAyNCkgfFxuICAgICh0aGlzW29mZnNldCArIDFdIDw8IDE2KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMl0gPDwgOCkgfFxuICAgICh0aGlzW29mZnNldCArIDNdKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRGbG9hdExFID0gZnVuY3Rpb24gcmVhZEZsb2F0TEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIGllZWU3NTQucmVhZCh0aGlzLCBvZmZzZXQsIHRydWUsIDIzLCA0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRGbG9hdEJFID0gZnVuY3Rpb24gcmVhZEZsb2F0QkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIGllZWU3NTQucmVhZCh0aGlzLCBvZmZzZXQsIGZhbHNlLCAyMywgNClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRG91YmxlTEUgPSBmdW5jdGlvbiByZWFkRG91YmxlTEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA4LCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIGllZWU3NTQucmVhZCh0aGlzLCBvZmZzZXQsIHRydWUsIDUyLCA4KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWREb3VibGVCRSA9IGZ1bmN0aW9uIHJlYWREb3VibGVCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDgsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsIG9mZnNldCwgZmFsc2UsIDUyLCA4KVxufVxuXG5mdW5jdGlvbiBjaGVja0ludCAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBleHQsIG1heCwgbWluKSB7XG4gIGlmICghQnVmZmVyLmlzQnVmZmVyKGJ1ZikpIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wiYnVmZmVyXCIgYXJndW1lbnQgbXVzdCBiZSBhIEJ1ZmZlciBpbnN0YW5jZScpXG4gIGlmICh2YWx1ZSA+IG1heCB8fCB2YWx1ZSA8IG1pbikgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1widmFsdWVcIiBhcmd1bWVudCBpcyBvdXQgb2YgYm91bmRzJylcbiAgaWYgKG9mZnNldCArIGV4dCA+IGJ1Zi5sZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbmRleCBvdXQgb2YgcmFuZ2UnKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludExFID0gZnVuY3Rpb24gd3JpdGVVSW50TEUgKHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggfCAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICB2YXIgbWF4Qnl0ZXMgPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aCkgLSAxXG4gICAgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbWF4Qnl0ZXMsIDApXG4gIH1cblxuICB2YXIgbXVsID0gMVxuICB2YXIgaSA9IDBcbiAgdGhpc1tvZmZzZXRdID0gdmFsdWUgJiAweEZGXG4gIHdoaWxlICgrK2kgPCBieXRlTGVuZ3RoICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdGhpc1tvZmZzZXQgKyBpXSA9ICh2YWx1ZSAvIG11bCkgJiAweEZGXG4gIH1cblxuICByZXR1cm4gb2Zmc2V0ICsgYnl0ZUxlbmd0aFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludEJFID0gZnVuY3Rpb24gd3JpdGVVSW50QkUgKHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggfCAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICB2YXIgbWF4Qnl0ZXMgPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aCkgLSAxXG4gICAgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbWF4Qnl0ZXMsIDApXG4gIH1cblxuICB2YXIgaSA9IGJ5dGVMZW5ndGggLSAxXG4gIHZhciBtdWwgPSAxXG4gIHRoaXNbb2Zmc2V0ICsgaV0gPSB2YWx1ZSAmIDB4RkZcbiAgd2hpbGUgKC0taSA+PSAwICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdGhpc1tvZmZzZXQgKyBpXSA9ICh2YWx1ZSAvIG11bCkgJiAweEZGXG4gIH1cblxuICByZXR1cm4gb2Zmc2V0ICsgYnl0ZUxlbmd0aFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDggPSBmdW5jdGlvbiB3cml0ZVVJbnQ4ICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDEsIDB4ZmYsIDApXG4gIGlmICghQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHZhbHVlID0gTWF0aC5mbG9vcih2YWx1ZSlcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgcmV0dXJuIG9mZnNldCArIDFcbn1cblxuZnVuY3Rpb24gb2JqZWN0V3JpdGVVSW50MTYgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuKSB7XG4gIGlmICh2YWx1ZSA8IDApIHZhbHVlID0gMHhmZmZmICsgdmFsdWUgKyAxXG4gIGZvciAodmFyIGkgPSAwLCBqID0gTWF0aC5taW4oYnVmLmxlbmd0aCAtIG9mZnNldCwgMik7IGkgPCBqOyArK2kpIHtcbiAgICBidWZbb2Zmc2V0ICsgaV0gPSAodmFsdWUgJiAoMHhmZiA8PCAoOCAqIChsaXR0bGVFbmRpYW4gPyBpIDogMSAtIGkpKSkpID4+PlxuICAgICAgKGxpdHRsZUVuZGlhbiA/IGkgOiAxIC0gaSkgKiA4XG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQxNkxFID0gZnVuY3Rpb24gd3JpdGVVSW50MTZMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAyLCAweGZmZmYsIDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gOClcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlKVxuICB9XG4gIHJldHVybiBvZmZzZXQgKyAyXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MTZCRSA9IGZ1bmN0aW9uIHdyaXRlVUludDE2QkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMiwgMHhmZmZmLCAwKVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgPj4+IDgpXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDJcbn1cblxuZnVuY3Rpb24gb2JqZWN0V3JpdGVVSW50MzIgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuKSB7XG4gIGlmICh2YWx1ZSA8IDApIHZhbHVlID0gMHhmZmZmZmZmZiArIHZhbHVlICsgMVxuICBmb3IgKHZhciBpID0gMCwgaiA9IE1hdGgubWluKGJ1Zi5sZW5ndGggLSBvZmZzZXQsIDQpOyBpIDwgajsgKytpKSB7XG4gICAgYnVmW29mZnNldCArIGldID0gKHZhbHVlID4+PiAobGl0dGxlRW5kaWFuID8gaSA6IDMgLSBpKSAqIDgpICYgMHhmZlxuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MzJMRSA9IGZ1bmN0aW9uIHdyaXRlVUludDMyTEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgNCwgMHhmZmZmZmZmZiwgMClcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXQgKyAzXSA9ICh2YWx1ZSA+Pj4gMjQpXG4gICAgdGhpc1tvZmZzZXQgKyAyXSA9ICh2YWx1ZSA+Pj4gMTYpXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gOClcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkJFID0gZnVuY3Rpb24gd3JpdGVVSW50MzJCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCA0LCAweGZmZmZmZmZmLCAwKVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgPj4+IDI0KVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDE2KVxuICAgIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDgpXG4gICAgdGhpc1tvZmZzZXQgKyAzXSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludExFID0gZnVuY3Rpb24gd3JpdGVJbnRMRSAodmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgdmFyIGxpbWl0ID0gTWF0aC5wb3coMiwgOCAqIGJ5dGVMZW5ndGggLSAxKVxuXG4gICAgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbGltaXQgLSAxLCAtbGltaXQpXG4gIH1cblxuICB2YXIgaSA9IDBcbiAgdmFyIG11bCA9IDFcbiAgdmFyIHN1YiA9IDBcbiAgdGhpc1tvZmZzZXRdID0gdmFsdWUgJiAweEZGXG4gIHdoaWxlICgrK2kgPCBieXRlTGVuZ3RoICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgaWYgKHZhbHVlIDwgMCAmJiBzdWIgPT09IDAgJiYgdGhpc1tvZmZzZXQgKyBpIC0gMV0gIT09IDApIHtcbiAgICAgIHN1YiA9IDFcbiAgICB9XG4gICAgdGhpc1tvZmZzZXQgKyBpXSA9ICgodmFsdWUgLyBtdWwpID4+IDApIC0gc3ViICYgMHhGRlxuICB9XG5cbiAgcmV0dXJuIG9mZnNldCArIGJ5dGVMZW5ndGhcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludEJFID0gZnVuY3Rpb24gd3JpdGVJbnRCRSAodmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgdmFyIGxpbWl0ID0gTWF0aC5wb3coMiwgOCAqIGJ5dGVMZW5ndGggLSAxKVxuXG4gICAgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbGltaXQgLSAxLCAtbGltaXQpXG4gIH1cblxuICB2YXIgaSA9IGJ5dGVMZW5ndGggLSAxXG4gIHZhciBtdWwgPSAxXG4gIHZhciBzdWIgPSAwXG4gIHRoaXNbb2Zmc2V0ICsgaV0gPSB2YWx1ZSAmIDB4RkZcbiAgd2hpbGUgKC0taSA+PSAwICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgaWYgKHZhbHVlIDwgMCAmJiBzdWIgPT09IDAgJiYgdGhpc1tvZmZzZXQgKyBpICsgMV0gIT09IDApIHtcbiAgICAgIHN1YiA9IDFcbiAgICB9XG4gICAgdGhpc1tvZmZzZXQgKyBpXSA9ICgodmFsdWUgLyBtdWwpID4+IDApIC0gc3ViICYgMHhGRlxuICB9XG5cbiAgcmV0dXJuIG9mZnNldCArIGJ5dGVMZW5ndGhcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDggPSBmdW5jdGlvbiB3cml0ZUludDggKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMSwgMHg3ZiwgLTB4ODApXG4gIGlmICghQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHZhbHVlID0gTWF0aC5mbG9vcih2YWx1ZSlcbiAgaWYgKHZhbHVlIDwgMCkgdmFsdWUgPSAweGZmICsgdmFsdWUgKyAxXG4gIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIHJldHVybiBvZmZzZXQgKyAxXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQxNkxFID0gZnVuY3Rpb24gd3JpdGVJbnQxNkxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDIsIDB4N2ZmZiwgLTB4ODAwMClcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDJcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2QkUgPSBmdW5jdGlvbiB3cml0ZUludDE2QkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMiwgMHg3ZmZmLCAtMHg4MDAwKVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgPj4+IDgpXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDJcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDMyTEUgPSBmdW5jdGlvbiB3cml0ZUludDMyTEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgNCwgMHg3ZmZmZmZmZiwgLTB4ODAwMDAwMDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gOClcbiAgICB0aGlzW29mZnNldCArIDJdID0gKHZhbHVlID4+PiAxNilcbiAgICB0aGlzW29mZnNldCArIDNdID0gKHZhbHVlID4+PiAyNClcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlKVxuICB9XG4gIHJldHVybiBvZmZzZXQgKyA0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQzMkJFID0gZnVuY3Rpb24gd3JpdGVJbnQzMkJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDQsIDB4N2ZmZmZmZmYsIC0weDgwMDAwMDAwKVxuICBpZiAodmFsdWUgPCAwKSB2YWx1ZSA9IDB4ZmZmZmZmZmYgKyB2YWx1ZSArIDFcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXRdID0gKHZhbHVlID4+PiAyNClcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiAxNilcbiAgICB0aGlzW29mZnNldCArIDJdID0gKHZhbHVlID4+PiA4KVxuICAgIHRoaXNbb2Zmc2V0ICsgM10gPSAodmFsdWUgJiAweGZmKVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlKVxuICB9XG4gIHJldHVybiBvZmZzZXQgKyA0XG59XG5cbmZ1bmN0aW9uIGNoZWNrSUVFRTc1NCAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBleHQsIG1heCwgbWluKSB7XG4gIGlmIChvZmZzZXQgKyBleHQgPiBidWYubGVuZ3RoKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignSW5kZXggb3V0IG9mIHJhbmdlJylcbiAgaWYgKG9mZnNldCA8IDApIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbmRleCBvdXQgb2YgcmFuZ2UnKVxufVxuXG5mdW5jdGlvbiB3cml0ZUZsb2F0IChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGNoZWNrSUVFRTc1NChidWYsIHZhbHVlLCBvZmZzZXQsIDQsIDMuNDAyODIzNDY2Mzg1Mjg4NmUrMzgsIC0zLjQwMjgyMzQ2NjM4NTI4ODZlKzM4KVxuICB9XG4gIGllZWU3NTQud3JpdGUoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDIzLCA0KVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRmxvYXRMRSA9IGZ1bmN0aW9uIHdyaXRlRmxvYXRMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHdyaXRlRmxvYXQodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVGbG9hdEJFID0gZnVuY3Rpb24gd3JpdGVGbG9hdEJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gd3JpdGVGbG9hdCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIHdyaXRlRG91YmxlIChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGNoZWNrSUVFRTc1NChidWYsIHZhbHVlLCBvZmZzZXQsIDgsIDEuNzk3NjkzMTM0ODYyMzE1N0UrMzA4LCAtMS43OTc2OTMxMzQ4NjIzMTU3RSszMDgpXG4gIH1cbiAgaWVlZTc1NC53cml0ZShidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgNTIsIDgpXG4gIHJldHVybiBvZmZzZXQgKyA4XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVEb3VibGVMRSA9IGZ1bmN0aW9uIHdyaXRlRG91YmxlTEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiB3cml0ZURvdWJsZSh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZURvdWJsZUJFID0gZnVuY3Rpb24gd3JpdGVEb3VibGVCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHdyaXRlRG91YmxlKHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuLy8gY29weSh0YXJnZXRCdWZmZXIsIHRhcmdldFN0YXJ0PTAsIHNvdXJjZVN0YXJ0PTAsIHNvdXJjZUVuZD1idWZmZXIubGVuZ3RoKVxuQnVmZmVyLnByb3RvdHlwZS5jb3B5ID0gZnVuY3Rpb24gY29weSAodGFyZ2V0LCB0YXJnZXRTdGFydCwgc3RhcnQsIGVuZCkge1xuICBpZiAoIXN0YXJ0KSBzdGFydCA9IDBcbiAgaWYgKCFlbmQgJiYgZW5kICE9PSAwKSBlbmQgPSB0aGlzLmxlbmd0aFxuICBpZiAodGFyZ2V0U3RhcnQgPj0gdGFyZ2V0Lmxlbmd0aCkgdGFyZ2V0U3RhcnQgPSB0YXJnZXQubGVuZ3RoXG4gIGlmICghdGFyZ2V0U3RhcnQpIHRhcmdldFN0YXJ0ID0gMFxuICBpZiAoZW5kID4gMCAmJiBlbmQgPCBzdGFydCkgZW5kID0gc3RhcnRcblxuICAvLyBDb3B5IDAgYnl0ZXM7IHdlJ3JlIGRvbmVcbiAgaWYgKGVuZCA9PT0gc3RhcnQpIHJldHVybiAwXG4gIGlmICh0YXJnZXQubGVuZ3RoID09PSAwIHx8IHRoaXMubGVuZ3RoID09PSAwKSByZXR1cm4gMFxuXG4gIC8vIEZhdGFsIGVycm9yIGNvbmRpdGlvbnNcbiAgaWYgKHRhcmdldFN0YXJ0IDwgMCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCd0YXJnZXRTdGFydCBvdXQgb2YgYm91bmRzJylcbiAgfVxuICBpZiAoc3RhcnQgPCAwIHx8IHN0YXJ0ID49IHRoaXMubGVuZ3RoKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignc291cmNlU3RhcnQgb3V0IG9mIGJvdW5kcycpXG4gIGlmIChlbmQgPCAwKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignc291cmNlRW5kIG91dCBvZiBib3VuZHMnKVxuXG4gIC8vIEFyZSB3ZSBvb2I/XG4gIGlmIChlbmQgPiB0aGlzLmxlbmd0aCkgZW5kID0gdGhpcy5sZW5ndGhcbiAgaWYgKHRhcmdldC5sZW5ndGggLSB0YXJnZXRTdGFydCA8IGVuZCAtIHN0YXJ0KSB7XG4gICAgZW5kID0gdGFyZ2V0Lmxlbmd0aCAtIHRhcmdldFN0YXJ0ICsgc3RhcnRcbiAgfVxuXG4gIHZhciBsZW4gPSBlbmQgLSBzdGFydFxuICB2YXIgaVxuXG4gIGlmICh0aGlzID09PSB0YXJnZXQgJiYgc3RhcnQgPCB0YXJnZXRTdGFydCAmJiB0YXJnZXRTdGFydCA8IGVuZCkge1xuICAgIC8vIGRlc2NlbmRpbmcgY29weSBmcm9tIGVuZFxuICAgIGZvciAoaSA9IGxlbiAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICB0YXJnZXRbaSArIHRhcmdldFN0YXJ0XSA9IHRoaXNbaSArIHN0YXJ0XVxuICAgIH1cbiAgfSBlbHNlIGlmIChsZW4gPCAxMDAwIHx8ICFCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIC8vIGFzY2VuZGluZyBjb3B5IGZyb20gc3RhcnRcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgIHRhcmdldFtpICsgdGFyZ2V0U3RhcnRdID0gdGhpc1tpICsgc3RhcnRdXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIFVpbnQ4QXJyYXkucHJvdG90eXBlLnNldC5jYWxsKFxuICAgICAgdGFyZ2V0LFxuICAgICAgdGhpcy5zdWJhcnJheShzdGFydCwgc3RhcnQgKyBsZW4pLFxuICAgICAgdGFyZ2V0U3RhcnRcbiAgICApXG4gIH1cblxuICByZXR1cm4gbGVuXG59XG5cbi8vIFVzYWdlOlxuLy8gICAgYnVmZmVyLmZpbGwobnVtYmVyWywgb2Zmc2V0WywgZW5kXV0pXG4vLyAgICBidWZmZXIuZmlsbChidWZmZXJbLCBvZmZzZXRbLCBlbmRdXSlcbi8vICAgIGJ1ZmZlci5maWxsKHN0cmluZ1ssIG9mZnNldFssIGVuZF1dWywgZW5jb2RpbmddKVxuQnVmZmVyLnByb3RvdHlwZS5maWxsID0gZnVuY3Rpb24gZmlsbCAodmFsLCBzdGFydCwgZW5kLCBlbmNvZGluZykge1xuICAvLyBIYW5kbGUgc3RyaW5nIGNhc2VzOlxuICBpZiAodHlwZW9mIHZhbCA9PT0gJ3N0cmluZycpIHtcbiAgICBpZiAodHlwZW9mIHN0YXJ0ID09PSAnc3RyaW5nJykge1xuICAgICAgZW5jb2RpbmcgPSBzdGFydFxuICAgICAgc3RhcnQgPSAwXG4gICAgICBlbmQgPSB0aGlzLmxlbmd0aFxuICAgIH0gZWxzZSBpZiAodHlwZW9mIGVuZCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGVuY29kaW5nID0gZW5kXG4gICAgICBlbmQgPSB0aGlzLmxlbmd0aFxuICAgIH1cbiAgICBpZiAodmFsLmxlbmd0aCA9PT0gMSkge1xuICAgICAgdmFyIGNvZGUgPSB2YWwuY2hhckNvZGVBdCgwKVxuICAgICAgaWYgKGNvZGUgPCAyNTYpIHtcbiAgICAgICAgdmFsID0gY29kZVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoZW5jb2RpbmcgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgZW5jb2RpbmcgIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdlbmNvZGluZyBtdXN0IGJlIGEgc3RyaW5nJylcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBlbmNvZGluZyA9PT0gJ3N0cmluZycgJiYgIUJ1ZmZlci5pc0VuY29kaW5nKGVuY29kaW5nKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVW5rbm93biBlbmNvZGluZzogJyArIGVuY29kaW5nKVxuICAgIH1cbiAgfSBlbHNlIGlmICh0eXBlb2YgdmFsID09PSAnbnVtYmVyJykge1xuICAgIHZhbCA9IHZhbCAmIDI1NVxuICB9XG5cbiAgLy8gSW52YWxpZCByYW5nZXMgYXJlIG5vdCBzZXQgdG8gYSBkZWZhdWx0LCBzbyBjYW4gcmFuZ2UgY2hlY2sgZWFybHkuXG4gIGlmIChzdGFydCA8IDAgfHwgdGhpcy5sZW5ndGggPCBzdGFydCB8fCB0aGlzLmxlbmd0aCA8IGVuZCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdPdXQgb2YgcmFuZ2UgaW5kZXgnKVxuICB9XG5cbiAgaWYgKGVuZCA8PSBzdGFydCkge1xuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICBzdGFydCA9IHN0YXJ0ID4+PiAwXG4gIGVuZCA9IGVuZCA9PT0gdW5kZWZpbmVkID8gdGhpcy5sZW5ndGggOiBlbmQgPj4+IDBcblxuICBpZiAoIXZhbCkgdmFsID0gMFxuXG4gIHZhciBpXG4gIGlmICh0eXBlb2YgdmFsID09PSAnbnVtYmVyJykge1xuICAgIGZvciAoaSA9IHN0YXJ0OyBpIDwgZW5kOyArK2kpIHtcbiAgICAgIHRoaXNbaV0gPSB2YWxcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdmFyIGJ5dGVzID0gQnVmZmVyLmlzQnVmZmVyKHZhbClcbiAgICAgID8gdmFsXG4gICAgICA6IHV0ZjhUb0J5dGVzKG5ldyBCdWZmZXIodmFsLCBlbmNvZGluZykudG9TdHJpbmcoKSlcbiAgICB2YXIgbGVuID0gYnl0ZXMubGVuZ3RoXG4gICAgZm9yIChpID0gMDsgaSA8IGVuZCAtIHN0YXJ0OyArK2kpIHtcbiAgICAgIHRoaXNbaSArIHN0YXJ0XSA9IGJ5dGVzW2kgJSBsZW5dXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXNcbn1cblxuLy8gSEVMUEVSIEZVTkNUSU9OU1xuLy8gPT09PT09PT09PT09PT09PVxuXG52YXIgSU5WQUxJRF9CQVNFNjRfUkUgPSAvW14rXFwvMC05QS1aYS16LV9dL2dcblxuZnVuY3Rpb24gYmFzZTY0Y2xlYW4gKHN0cikge1xuICAvLyBOb2RlIHN0cmlwcyBvdXQgaW52YWxpZCBjaGFyYWN0ZXJzIGxpa2UgXFxuIGFuZCBcXHQgZnJvbSB0aGUgc3RyaW5nLCBiYXNlNjQtanMgZG9lcyBub3RcbiAgc3RyID0gc3RyaW5ndHJpbShzdHIpLnJlcGxhY2UoSU5WQUxJRF9CQVNFNjRfUkUsICcnKVxuICAvLyBOb2RlIGNvbnZlcnRzIHN0cmluZ3Mgd2l0aCBsZW5ndGggPCAyIHRvICcnXG4gIGlmIChzdHIubGVuZ3RoIDwgMikgcmV0dXJuICcnXG4gIC8vIE5vZGUgYWxsb3dzIGZvciBub24tcGFkZGVkIGJhc2U2NCBzdHJpbmdzIChtaXNzaW5nIHRyYWlsaW5nID09PSksIGJhc2U2NC1qcyBkb2VzIG5vdFxuICB3aGlsZSAoc3RyLmxlbmd0aCAlIDQgIT09IDApIHtcbiAgICBzdHIgPSBzdHIgKyAnPSdcbiAgfVxuICByZXR1cm4gc3RyXG59XG5cbmZ1bmN0aW9uIHN0cmluZ3RyaW0gKHN0cikge1xuICBpZiAoc3RyLnRyaW0pIHJldHVybiBzdHIudHJpbSgpXG4gIHJldHVybiBzdHIucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgJycpXG59XG5cbmZ1bmN0aW9uIHRvSGV4IChuKSB7XG4gIGlmIChuIDwgMTYpIHJldHVybiAnMCcgKyBuLnRvU3RyaW5nKDE2KVxuICByZXR1cm4gbi50b1N0cmluZygxNilcbn1cblxuZnVuY3Rpb24gdXRmOFRvQnl0ZXMgKHN0cmluZywgdW5pdHMpIHtcbiAgdW5pdHMgPSB1bml0cyB8fCBJbmZpbml0eVxuICB2YXIgY29kZVBvaW50XG4gIHZhciBsZW5ndGggPSBzdHJpbmcubGVuZ3RoXG4gIHZhciBsZWFkU3Vycm9nYXRlID0gbnVsbFxuICB2YXIgYnl0ZXMgPSBbXVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICBjb2RlUG9pbnQgPSBzdHJpbmcuY2hhckNvZGVBdChpKVxuXG4gICAgLy8gaXMgc3Vycm9nYXRlIGNvbXBvbmVudFxuICAgIGlmIChjb2RlUG9pbnQgPiAweEQ3RkYgJiYgY29kZVBvaW50IDwgMHhFMDAwKSB7XG4gICAgICAvLyBsYXN0IGNoYXIgd2FzIGEgbGVhZFxuICAgICAgaWYgKCFsZWFkU3Vycm9nYXRlKSB7XG4gICAgICAgIC8vIG5vIGxlYWQgeWV0XG4gICAgICAgIGlmIChjb2RlUG9pbnQgPiAweERCRkYpIHtcbiAgICAgICAgICAvLyB1bmV4cGVjdGVkIHRyYWlsXG4gICAgICAgICAgaWYgKCh1bml0cyAtPSAzKSA+IC0xKSBieXRlcy5wdXNoKDB4RUYsIDB4QkYsIDB4QkQpXG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfSBlbHNlIGlmIChpICsgMSA9PT0gbGVuZ3RoKSB7XG4gICAgICAgICAgLy8gdW5wYWlyZWQgbGVhZFxuICAgICAgICAgIGlmICgodW5pdHMgLT0gMykgPiAtMSkgYnl0ZXMucHVzaCgweEVGLCAweEJGLCAweEJEKVxuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH1cblxuICAgICAgICAvLyB2YWxpZCBsZWFkXG4gICAgICAgIGxlYWRTdXJyb2dhdGUgPSBjb2RlUG9pbnRcblxuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuXG4gICAgICAvLyAyIGxlYWRzIGluIGEgcm93XG4gICAgICBpZiAoY29kZVBvaW50IDwgMHhEQzAwKSB7XG4gICAgICAgIGlmICgodW5pdHMgLT0gMykgPiAtMSkgYnl0ZXMucHVzaCgweEVGLCAweEJGLCAweEJEKVxuICAgICAgICBsZWFkU3Vycm9nYXRlID0gY29kZVBvaW50XG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG5cbiAgICAgIC8vIHZhbGlkIHN1cnJvZ2F0ZSBwYWlyXG4gICAgICBjb2RlUG9pbnQgPSAobGVhZFN1cnJvZ2F0ZSAtIDB4RDgwMCA8PCAxMCB8IGNvZGVQb2ludCAtIDB4REMwMCkgKyAweDEwMDAwXG4gICAgfSBlbHNlIGlmIChsZWFkU3Vycm9nYXRlKSB7XG4gICAgICAvLyB2YWxpZCBibXAgY2hhciwgYnV0IGxhc3QgY2hhciB3YXMgYSBsZWFkXG4gICAgICBpZiAoKHVuaXRzIC09IDMpID4gLTEpIGJ5dGVzLnB1c2goMHhFRiwgMHhCRiwgMHhCRClcbiAgICB9XG5cbiAgICBsZWFkU3Vycm9nYXRlID0gbnVsbFxuXG4gICAgLy8gZW5jb2RlIHV0ZjhcbiAgICBpZiAoY29kZVBvaW50IDwgMHg4MCkge1xuICAgICAgaWYgKCh1bml0cyAtPSAxKSA8IDApIGJyZWFrXG4gICAgICBieXRlcy5wdXNoKGNvZGVQb2ludClcbiAgICB9IGVsc2UgaWYgKGNvZGVQb2ludCA8IDB4ODAwKSB7XG4gICAgICBpZiAoKHVuaXRzIC09IDIpIDwgMCkgYnJlYWtcbiAgICAgIGJ5dGVzLnB1c2goXG4gICAgICAgIGNvZGVQb2ludCA+PiAweDYgfCAweEMwLFxuICAgICAgICBjb2RlUG9pbnQgJiAweDNGIHwgMHg4MFxuICAgICAgKVxuICAgIH0gZWxzZSBpZiAoY29kZVBvaW50IDwgMHgxMDAwMCkge1xuICAgICAgaWYgKCh1bml0cyAtPSAzKSA8IDApIGJyZWFrXG4gICAgICBieXRlcy5wdXNoKFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHhDIHwgMHhFMCxcbiAgICAgICAgY29kZVBvaW50ID4+IDB4NiAmIDB4M0YgfCAweDgwLFxuICAgICAgICBjb2RlUG9pbnQgJiAweDNGIHwgMHg4MFxuICAgICAgKVxuICAgIH0gZWxzZSBpZiAoY29kZVBvaW50IDwgMHgxMTAwMDApIHtcbiAgICAgIGlmICgodW5pdHMgLT0gNCkgPCAwKSBicmVha1xuICAgICAgYnl0ZXMucHVzaChcbiAgICAgICAgY29kZVBvaW50ID4+IDB4MTIgfCAweEYwLFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHhDICYgMHgzRiB8IDB4ODAsXG4gICAgICAgIGNvZGVQb2ludCA+PiAweDYgJiAweDNGIHwgMHg4MCxcbiAgICAgICAgY29kZVBvaW50ICYgMHgzRiB8IDB4ODBcbiAgICAgIClcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGNvZGUgcG9pbnQnKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBieXRlc1xufVxuXG5mdW5jdGlvbiBhc2NpaVRvQnl0ZXMgKHN0cikge1xuICB2YXIgYnl0ZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyArK2kpIHtcbiAgICAvLyBOb2RlJ3MgY29kZSBzZWVtcyB0byBiZSBkb2luZyB0aGlzIGFuZCBub3QgJiAweDdGLi5cbiAgICBieXRlQXJyYXkucHVzaChzdHIuY2hhckNvZGVBdChpKSAmIDB4RkYpXG4gIH1cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiB1dGYxNmxlVG9CeXRlcyAoc3RyLCB1bml0cykge1xuICB2YXIgYywgaGksIGxvXG4gIHZhciBieXRlQXJyYXkgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7ICsraSkge1xuICAgIGlmICgodW5pdHMgLT0gMikgPCAwKSBicmVha1xuXG4gICAgYyA9IHN0ci5jaGFyQ29kZUF0KGkpXG4gICAgaGkgPSBjID4+IDhcbiAgICBsbyA9IGMgJSAyNTZcbiAgICBieXRlQXJyYXkucHVzaChsbylcbiAgICBieXRlQXJyYXkucHVzaChoaSlcbiAgfVxuXG4gIHJldHVybiBieXRlQXJyYXlcbn1cblxuZnVuY3Rpb24gYmFzZTY0VG9CeXRlcyAoc3RyKSB7XG4gIHJldHVybiBiYXNlNjQudG9CeXRlQXJyYXkoYmFzZTY0Y2xlYW4oc3RyKSlcbn1cblxuZnVuY3Rpb24gYmxpdEJ1ZmZlciAoc3JjLCBkc3QsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICBpZiAoKGkgKyBvZmZzZXQgPj0gZHN0Lmxlbmd0aCkgfHwgKGkgPj0gc3JjLmxlbmd0aCkpIGJyZWFrXG4gICAgZHN0W2kgKyBvZmZzZXRdID0gc3JjW2ldXG4gIH1cbiAgcmV0dXJuIGlcbn1cblxuZnVuY3Rpb24gaXNuYW4gKHZhbCkge1xuICByZXR1cm4gdmFsICE9PSB2YWwgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1zZWxmLWNvbXBhcmVcbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9idWZmZXIvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzIiwiJ3VzZSBzdHJpY3QnXG5cbmV4cG9ydHMuYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGhcbmV4cG9ydHMudG9CeXRlQXJyYXkgPSB0b0J5dGVBcnJheVxuZXhwb3J0cy5mcm9tQnl0ZUFycmF5ID0gZnJvbUJ5dGVBcnJheVxuXG52YXIgbG9va3VwID0gW11cbnZhciByZXZMb29rdXAgPSBbXVxudmFyIEFyciA9IHR5cGVvZiBVaW50OEFycmF5ICE9PSAndW5kZWZpbmVkJyA/IFVpbnQ4QXJyYXkgOiBBcnJheVxuXG52YXIgY29kZSA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvJ1xuZm9yICh2YXIgaSA9IDAsIGxlbiA9IGNvZGUubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgbG9va3VwW2ldID0gY29kZVtpXVxuICByZXZMb29rdXBbY29kZS5jaGFyQ29kZUF0KGkpXSA9IGlcbn1cblxucmV2TG9va3VwWyctJy5jaGFyQ29kZUF0KDApXSA9IDYyXG5yZXZMb29rdXBbJ18nLmNoYXJDb2RlQXQoMCldID0gNjNcblxuZnVuY3Rpb24gcGxhY2VIb2xkZXJzQ291bnQgKGI2NCkge1xuICB2YXIgbGVuID0gYjY0Lmxlbmd0aFxuICBpZiAobGVuICUgNCA+IDApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgc3RyaW5nLiBMZW5ndGggbXVzdCBiZSBhIG11bHRpcGxlIG9mIDQnKVxuICB9XG5cbiAgLy8gdGhlIG51bWJlciBvZiBlcXVhbCBzaWducyAocGxhY2UgaG9sZGVycylcbiAgLy8gaWYgdGhlcmUgYXJlIHR3byBwbGFjZWhvbGRlcnMsIHRoYW4gdGhlIHR3byBjaGFyYWN0ZXJzIGJlZm9yZSBpdFxuICAvLyByZXByZXNlbnQgb25lIGJ5dGVcbiAgLy8gaWYgdGhlcmUgaXMgb25seSBvbmUsIHRoZW4gdGhlIHRocmVlIGNoYXJhY3RlcnMgYmVmb3JlIGl0IHJlcHJlc2VudCAyIGJ5dGVzXG4gIC8vIHRoaXMgaXMganVzdCBhIGNoZWFwIGhhY2sgdG8gbm90IGRvIGluZGV4T2YgdHdpY2VcbiAgcmV0dXJuIGI2NFtsZW4gLSAyXSA9PT0gJz0nID8gMiA6IGI2NFtsZW4gLSAxXSA9PT0gJz0nID8gMSA6IDBcbn1cblxuZnVuY3Rpb24gYnl0ZUxlbmd0aCAoYjY0KSB7XG4gIC8vIGJhc2U2NCBpcyA0LzMgKyB1cCB0byB0d28gY2hhcmFjdGVycyBvZiB0aGUgb3JpZ2luYWwgZGF0YVxuICByZXR1cm4gYjY0Lmxlbmd0aCAqIDMgLyA0IC0gcGxhY2VIb2xkZXJzQ291bnQoYjY0KVxufVxuXG5mdW5jdGlvbiB0b0J5dGVBcnJheSAoYjY0KSB7XG4gIHZhciBpLCBqLCBsLCB0bXAsIHBsYWNlSG9sZGVycywgYXJyXG4gIHZhciBsZW4gPSBiNjQubGVuZ3RoXG4gIHBsYWNlSG9sZGVycyA9IHBsYWNlSG9sZGVyc0NvdW50KGI2NClcblxuICBhcnIgPSBuZXcgQXJyKGxlbiAqIDMgLyA0IC0gcGxhY2VIb2xkZXJzKVxuXG4gIC8vIGlmIHRoZXJlIGFyZSBwbGFjZWhvbGRlcnMsIG9ubHkgZ2V0IHVwIHRvIHRoZSBsYXN0IGNvbXBsZXRlIDQgY2hhcnNcbiAgbCA9IHBsYWNlSG9sZGVycyA+IDAgPyBsZW4gLSA0IDogbGVuXG5cbiAgdmFyIEwgPSAwXG5cbiAgZm9yIChpID0gMCwgaiA9IDA7IGkgPCBsOyBpICs9IDQsIGogKz0gMykge1xuICAgIHRtcCA9IChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSldIDw8IDE4KSB8IChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDEpXSA8PCAxMikgfCAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAyKV0gPDwgNikgfCByZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDMpXVxuICAgIGFycltMKytdID0gKHRtcCA+PiAxNikgJiAweEZGXG4gICAgYXJyW0wrK10gPSAodG1wID4+IDgpICYgMHhGRlxuICAgIGFycltMKytdID0gdG1wICYgMHhGRlxuICB9XG5cbiAgaWYgKHBsYWNlSG9sZGVycyA9PT0gMikge1xuICAgIHRtcCA9IChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSldIDw8IDIpIHwgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMSldID4+IDQpXG4gICAgYXJyW0wrK10gPSB0bXAgJiAweEZGXG4gIH0gZWxzZSBpZiAocGxhY2VIb2xkZXJzID09PSAxKSB7XG4gICAgdG1wID0gKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpKV0gPDwgMTApIHwgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMSldIDw8IDQpIHwgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMildID4+IDIpXG4gICAgYXJyW0wrK10gPSAodG1wID4+IDgpICYgMHhGRlxuICAgIGFycltMKytdID0gdG1wICYgMHhGRlxuICB9XG5cbiAgcmV0dXJuIGFyclxufVxuXG5mdW5jdGlvbiB0cmlwbGV0VG9CYXNlNjQgKG51bSkge1xuICByZXR1cm4gbG9va3VwW251bSA+PiAxOCAmIDB4M0ZdICsgbG9va3VwW251bSA+PiAxMiAmIDB4M0ZdICsgbG9va3VwW251bSA+PiA2ICYgMHgzRl0gKyBsb29rdXBbbnVtICYgMHgzRl1cbn1cblxuZnVuY3Rpb24gZW5jb2RlQ2h1bmsgKHVpbnQ4LCBzdGFydCwgZW5kKSB7XG4gIHZhciB0bXBcbiAgdmFyIG91dHB1dCA9IFtdXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSArPSAzKSB7XG4gICAgdG1wID0gKHVpbnQ4W2ldIDw8IDE2KSArICh1aW50OFtpICsgMV0gPDwgOCkgKyAodWludDhbaSArIDJdKVxuICAgIG91dHB1dC5wdXNoKHRyaXBsZXRUb0Jhc2U2NCh0bXApKVxuICB9XG4gIHJldHVybiBvdXRwdXQuam9pbignJylcbn1cblxuZnVuY3Rpb24gZnJvbUJ5dGVBcnJheSAodWludDgpIHtcbiAgdmFyIHRtcFxuICB2YXIgbGVuID0gdWludDgubGVuZ3RoXG4gIHZhciBleHRyYUJ5dGVzID0gbGVuICUgMyAvLyBpZiB3ZSBoYXZlIDEgYnl0ZSBsZWZ0LCBwYWQgMiBieXRlc1xuICB2YXIgb3V0cHV0ID0gJydcbiAgdmFyIHBhcnRzID0gW11cbiAgdmFyIG1heENodW5rTGVuZ3RoID0gMTYzODMgLy8gbXVzdCBiZSBtdWx0aXBsZSBvZiAzXG5cbiAgLy8gZ28gdGhyb3VnaCB0aGUgYXJyYXkgZXZlcnkgdGhyZWUgYnl0ZXMsIHdlJ2xsIGRlYWwgd2l0aCB0cmFpbGluZyBzdHVmZiBsYXRlclxuICBmb3IgKHZhciBpID0gMCwgbGVuMiA9IGxlbiAtIGV4dHJhQnl0ZXM7IGkgPCBsZW4yOyBpICs9IG1heENodW5rTGVuZ3RoKSB7XG4gICAgcGFydHMucHVzaChlbmNvZGVDaHVuayh1aW50OCwgaSwgKGkgKyBtYXhDaHVua0xlbmd0aCkgPiBsZW4yID8gbGVuMiA6IChpICsgbWF4Q2h1bmtMZW5ndGgpKSlcbiAgfVxuXG4gIC8vIHBhZCB0aGUgZW5kIHdpdGggemVyb3MsIGJ1dCBtYWtlIHN1cmUgdG8gbm90IGZvcmdldCB0aGUgZXh0cmEgYnl0ZXNcbiAgaWYgKGV4dHJhQnl0ZXMgPT09IDEpIHtcbiAgICB0bXAgPSB1aW50OFtsZW4gLSAxXVxuICAgIG91dHB1dCArPSBsb29rdXBbdG1wID4+IDJdXG4gICAgb3V0cHV0ICs9IGxvb2t1cFsodG1wIDw8IDQpICYgMHgzRl1cbiAgICBvdXRwdXQgKz0gJz09J1xuICB9IGVsc2UgaWYgKGV4dHJhQnl0ZXMgPT09IDIpIHtcbiAgICB0bXAgPSAodWludDhbbGVuIC0gMl0gPDwgOCkgKyAodWludDhbbGVuIC0gMV0pXG4gICAgb3V0cHV0ICs9IGxvb2t1cFt0bXAgPj4gMTBdXG4gICAgb3V0cHV0ICs9IGxvb2t1cFsodG1wID4+IDQpICYgMHgzRl1cbiAgICBvdXRwdXQgKz0gbG9va3VwWyh0bXAgPDwgMikgJiAweDNGXVxuICAgIG91dHB1dCArPSAnPSdcbiAgfVxuXG4gIHBhcnRzLnB1c2gob3V0cHV0KVxuXG4gIHJldHVybiBwYXJ0cy5qb2luKCcnKVxufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2Jhc2U2NC1qcy9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSAyIDMiLCJleHBvcnRzLnJlYWQgPSBmdW5jdGlvbiAoYnVmZmVyLCBvZmZzZXQsIGlzTEUsIG1MZW4sIG5CeXRlcykge1xuICB2YXIgZSwgbVxuICB2YXIgZUxlbiA9IG5CeXRlcyAqIDggLSBtTGVuIC0gMVxuICB2YXIgZU1heCA9ICgxIDw8IGVMZW4pIC0gMVxuICB2YXIgZUJpYXMgPSBlTWF4ID4+IDFcbiAgdmFyIG5CaXRzID0gLTdcbiAgdmFyIGkgPSBpc0xFID8gKG5CeXRlcyAtIDEpIDogMFxuICB2YXIgZCA9IGlzTEUgPyAtMSA6IDFcbiAgdmFyIHMgPSBidWZmZXJbb2Zmc2V0ICsgaV1cblxuICBpICs9IGRcblxuICBlID0gcyAmICgoMSA8PCAoLW5CaXRzKSkgLSAxKVxuICBzID4+PSAoLW5CaXRzKVxuICBuQml0cyArPSBlTGVuXG4gIGZvciAoOyBuQml0cyA+IDA7IGUgPSBlICogMjU2ICsgYnVmZmVyW29mZnNldCArIGldLCBpICs9IGQsIG5CaXRzIC09IDgpIHt9XG5cbiAgbSA9IGUgJiAoKDEgPDwgKC1uQml0cykpIC0gMSlcbiAgZSA+Pj0gKC1uQml0cylcbiAgbkJpdHMgKz0gbUxlblxuICBmb3IgKDsgbkJpdHMgPiAwOyBtID0gbSAqIDI1NiArIGJ1ZmZlcltvZmZzZXQgKyBpXSwgaSArPSBkLCBuQml0cyAtPSA4KSB7fVxuXG4gIGlmIChlID09PSAwKSB7XG4gICAgZSA9IDEgLSBlQmlhc1xuICB9IGVsc2UgaWYgKGUgPT09IGVNYXgpIHtcbiAgICByZXR1cm4gbSA/IE5hTiA6ICgocyA/IC0xIDogMSkgKiBJbmZpbml0eSlcbiAgfSBlbHNlIHtcbiAgICBtID0gbSArIE1hdGgucG93KDIsIG1MZW4pXG4gICAgZSA9IGUgLSBlQmlhc1xuICB9XG4gIHJldHVybiAocyA/IC0xIDogMSkgKiBtICogTWF0aC5wb3coMiwgZSAtIG1MZW4pXG59XG5cbmV4cG9ydHMud3JpdGUgPSBmdW5jdGlvbiAoYnVmZmVyLCB2YWx1ZSwgb2Zmc2V0LCBpc0xFLCBtTGVuLCBuQnl0ZXMpIHtcbiAgdmFyIGUsIG0sIGNcbiAgdmFyIGVMZW4gPSBuQnl0ZXMgKiA4IC0gbUxlbiAtIDFcbiAgdmFyIGVNYXggPSAoMSA8PCBlTGVuKSAtIDFcbiAgdmFyIGVCaWFzID0gZU1heCA+PiAxXG4gIHZhciBydCA9IChtTGVuID09PSAyMyA/IE1hdGgucG93KDIsIC0yNCkgLSBNYXRoLnBvdygyLCAtNzcpIDogMClcbiAgdmFyIGkgPSBpc0xFID8gMCA6IChuQnl0ZXMgLSAxKVxuICB2YXIgZCA9IGlzTEUgPyAxIDogLTFcbiAgdmFyIHMgPSB2YWx1ZSA8IDAgfHwgKHZhbHVlID09PSAwICYmIDEgLyB2YWx1ZSA8IDApID8gMSA6IDBcblxuICB2YWx1ZSA9IE1hdGguYWJzKHZhbHVlKVxuXG4gIGlmIChpc05hTih2YWx1ZSkgfHwgdmFsdWUgPT09IEluZmluaXR5KSB7XG4gICAgbSA9IGlzTmFOKHZhbHVlKSA/IDEgOiAwXG4gICAgZSA9IGVNYXhcbiAgfSBlbHNlIHtcbiAgICBlID0gTWF0aC5mbG9vcihNYXRoLmxvZyh2YWx1ZSkgLyBNYXRoLkxOMilcbiAgICBpZiAodmFsdWUgKiAoYyA9IE1hdGgucG93KDIsIC1lKSkgPCAxKSB7XG4gICAgICBlLS1cbiAgICAgIGMgKj0gMlxuICAgIH1cbiAgICBpZiAoZSArIGVCaWFzID49IDEpIHtcbiAgICAgIHZhbHVlICs9IHJ0IC8gY1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWx1ZSArPSBydCAqIE1hdGgucG93KDIsIDEgLSBlQmlhcylcbiAgICB9XG4gICAgaWYgKHZhbHVlICogYyA+PSAyKSB7XG4gICAgICBlKytcbiAgICAgIGMgLz0gMlxuICAgIH1cblxuICAgIGlmIChlICsgZUJpYXMgPj0gZU1heCkge1xuICAgICAgbSA9IDBcbiAgICAgIGUgPSBlTWF4XG4gICAgfSBlbHNlIGlmIChlICsgZUJpYXMgPj0gMSkge1xuICAgICAgbSA9ICh2YWx1ZSAqIGMgLSAxKSAqIE1hdGgucG93KDIsIG1MZW4pXG4gICAgICBlID0gZSArIGVCaWFzXG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSB2YWx1ZSAqIE1hdGgucG93KDIsIGVCaWFzIC0gMSkgKiBNYXRoLnBvdygyLCBtTGVuKVxuICAgICAgZSA9IDBcbiAgICB9XG4gIH1cblxuICBmb3IgKDsgbUxlbiA+PSA4OyBidWZmZXJbb2Zmc2V0ICsgaV0gPSBtICYgMHhmZiwgaSArPSBkLCBtIC89IDI1NiwgbUxlbiAtPSA4KSB7fVxuXG4gIGUgPSAoZSA8PCBtTGVuKSB8IG1cbiAgZUxlbiArPSBtTGVuXG4gIGZvciAoOyBlTGVuID4gMDsgYnVmZmVyW29mZnNldCArIGldID0gZSAmIDB4ZmYsIGkgKz0gZCwgZSAvPSAyNTYsIGVMZW4gLT0gOCkge31cblxuICBidWZmZXJbb2Zmc2V0ICsgaSAtIGRdIHw9IHMgKiAxMjhcbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9pZWVlNzU0L2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSA2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIDIgMyIsInZhciB0b1N0cmluZyA9IHt9LnRvU3RyaW5nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gKGFycikge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbChhcnIpID09ICdbb2JqZWN0IEFycmF5XSc7XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2lzYXJyYXkvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzIiwiXCJ1c2Ugc3RyaWN0XCI7XG4vKipcbiAqIEltcG9ydCBkZXBlbmRlbmN5IHBvbHlmaWxsc1xuICovXG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbnZhciBfTXVybXVySGFzaCA9IHJlcXVpcmUoXCIuL011cm11ckhhc2gzXCIpO1xuXG52YXIgX011cm11ckhhc2gyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfTXVybXVySGFzaCk7XG5cbnZhciBfRXZlckNvb2tpZSA9IHJlcXVpcmUoXCJFdmVyQ29va2llXCIpO1xuXG52YXIgX0V2ZXJDb29raWUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfRXZlckNvb2tpZSk7XG5cbnZhciBfVXRpbHMgPSByZXF1aXJlKFwiVXRpbHNcIik7XG5cbnZhciBfVXRpbHMyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfVXRpbHMpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG52YXIgYnRvYSA9IHJlcXVpcmUoXCJidG9hXCIpO1xuLyoqXG4gKiBJbXBvcnQgZGVwZW5kZW5jeSBjbGFzc2VzXG4gKi9cblxuLyoqXG4gKiBVc2VyIElEIGNsYXNzXG4gKi9cbnZhciBVc2VySUQgPSBmdW5jdGlvbiAoKSB7XG4gICAgLyoqXG4gICAgICogQ2xlYXIgcHJldmlvdXMgdmVyc2lvbiBvZiBGaW5nZXJQcmludFxuICAgICAqL1xuICAgIFVzZXJJRC5jbGVhclByZXZpb3VzID0gZnVuY3Rpb24gY2xlYXJQcmV2aW91cygpIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIENoZWNrIGlmIGxvY2FsU3RvcmFnZSBpcyBzdXBwb3J0ZWRcbiAgICAgICAgICovXG4gICAgICAgIGlmICh0eXBlb2YgbG9jYWxTdG9yYWdlICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIExvb3AgYWxsIGxvY2FsU3RvcmFnZSBrZXlzXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBsb2NhbFN0b3JhZ2UpIHtcbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBJZiBrZXkgbWF0Y2hlZCB0byBGaW5nZXJQcmludCBhbmQgaXQgaXMgbm90IGN1cnJlbnQgdmVyc2lvbiwgdGhlbiByZW1vdmUgdGhhdCBpdGVtIGZyb20gc3RvcmFnZXNcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBpZiAoa2V5LmluZGV4T2YoXCJVc2VySURcIikgIT09IC0xICYmIGtleS5pbmRleE9mKFwiVXNlcklEXzEuMC4xN1wiKSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIFBhcnNlIHN0b3JhZ2Uga2V5IGFuZCBnZXQgc3RvcmFnZSB2ZXJzaW9uXG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICB2YXIgbG9jYWxLZXkgPSBrZXkuc3BsaXQoXCJfXCIpO1xuICAgICAgICAgICAgICAgICAgICBsb2NhbEtleSA9IGxvY2FsS2V5LnNsaWNlKDAsIGxvY2FsS2V5Lmxlbmd0aCAtIDEpO1xuICAgICAgICAgICAgICAgICAgICBrZXkgPSBsb2NhbEtleS5qb2luKFwiX1wiKTtcbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIEluaXQgRXZlckNvb2tpZSBmb3IgdGhhdCB2ZXJzaW9uXG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICB2YXIgTG9jYWxFdmVyQ29va2llID0gbmV3IF9FdmVyQ29va2llMi5kZWZhdWx0KGtleSk7XG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBDbGVhbiBzdG9yYWdlXG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICBMb2NhbEV2ZXJDb29raWUuY2xlYXIodHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBEZXN0cm95IHN0b3JhZ2VcbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIExvY2FsRXZlckNvb2tpZS5kZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiAzMiBiaXQgRk5WLTFhIGhhc2hcbiAgICAgKiBAcGFyYW0gc3RyXG4gICAgICogQHBhcmFtIGhhc2hcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9XG4gICAgICovXG5cblxuICAgIFVzZXJJRC5mbnYzMmEgPSBmdW5jdGlvbiBmbnYzMmEoc3RyLCBoYXNoKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBoYXNoID0gaGFzaCBeIHN0ci5jaGFyQ29kZUF0KGkpO1xuICAgICAgICAgICAgaGFzaCA9IGhhc2ggKiAweDAxMDAwMTkzICYgMHhGRkZGRkZGRjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaGFzaDtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIENvbnZlcnQgc3RyaW5nIHRvIGJpbmFyeVxuICAgICAqIEBwYXJhbSB2YWxcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAgICovXG5cblxuICAgIFVzZXJJRC50b2JpbmFyeSA9IGZ1bmN0aW9uIHRvYmluYXJ5KHZhbCkge1xuICAgICAgICB2YXIgcmV0ID0gXCJcIjtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCA0OyBpKyspIHtcbiAgICAgICAgICAgIHJldCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKHZhbCAmIDB4RkYpO1xuICAgICAgICAgICAgdmFsID0gdmFsID4+IDg7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEdldCBGaW5nZXJQcmludCBIYXNoXG4gICAgICogQHBhcmFtIGR1bXBcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAgICovXG5cblxuICAgIFVzZXJJRC5nZXRGaW5nZXJQcmludEhhc2ggPSBmdW5jdGlvbiBnZXRGaW5nZXJQcmludEhhc2goZHVtcCkge1xuICAgICAgICB2YXIgbXVybXVyID0gX011cm11ckhhc2gyLmRlZmF1bHQueDY0aGFzaDEyOChkdW1wLCAzMSk7XG4gICAgICAgIHZhciBpMSA9IDQwMDQ7XG4gICAgICAgIHZhciBpMiA9IDE0NzEzNTc1NDc7IC8vIEZha2UgZGF0ZS5cbiAgICAgICAgdmFyIGkzID0gVXNlcklELmZudjMyYShtdXJtdXIuc3Vic3RyKDAsIDE2KSwgbXVybXVyKTtcbiAgICAgICAgdmFyIGk0ID0gVXNlcklELmZudjMyYShtdXJtdXIuc3Vic3RyKDE2LCAxNiksIG11cm11cik7XG4gICAgICAgIGk0ID0gaTQgJiAweEZGRkZGRjAwIHwgMHgwMTtcbiAgICAgICAgdmFyIHJ1aWQgPSBcIlwiO1xuICAgICAgICBydWlkICs9IFVzZXJJRC50b2JpbmFyeShpMSk7XG4gICAgICAgIHJ1aWQgKz0gVXNlcklELnRvYmluYXJ5KGkyKTtcbiAgICAgICAgcnVpZCArPSBVc2VySUQudG9iaW5hcnkoaTMpO1xuICAgICAgICBydWlkICs9IFVzZXJJRC50b2JpbmFyeShpNCk7XG4gICAgICAgIHJ1aWQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZSgwKTtcbiAgICAgICAgcmV0dXJuIGJ0b2EocnVpZCk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBHZXQgVXNlciBMYW5ndWFnZVxuICAgICAqIEByZXR1cm4ge09iamVjdHxib29sZWFufVxuICAgICAqL1xuXG5cbiAgICBVc2VySUQuZ2V0VXNlckxhbmd1YWdlID0gZnVuY3Rpb24gZ2V0VXNlckxhbmd1YWdlKCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdmFyIF9uYXZpZ2F0b3IgPSB3aW5kb3cubmF2aWdhdG9yO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBVc2VyTGFuZ3VhZ2U6IF9uYXZpZ2F0b3IubGFuZ3VhZ2UgfHwgX25hdmlnYXRvci51c2VyTGFuZ3VhZ2UgfHwgX25hdmlnYXRvci5icm93c2VyTGFuZ3VhZ2UgfHwgX25hdmlnYXRvci5zeXN0ZW1MYW5ndWFnZSB8fCBcIlwiXG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEdldCBUaW1lem9uZSBPZmZzZXRcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R8Ym9vbGVhbn1cbiAgICAgKi9cblxuXG4gICAgVXNlcklELmdldFRpbWV6b25lT2Zmc2V0ID0gZnVuY3Rpb24gZ2V0VGltZXpvbmVPZmZzZXQoKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIFRpbWV6b25lT2Zmc2V0OiBuZXcgRGF0ZSgpLmdldFRpbWV6b25lT2Zmc2V0KClcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgLyoqXG4gICAgICogRWFjaCBlbXVsYXRpb24gZm9yIEFycmF5cyBhbmQgT2JqZWN0c1xuICAgICAqIEBwYXJhbSBvYmpcbiAgICAgKiBAcGFyYW0gaXRlcmF0b3JcbiAgICAgKiBAcGFyYW0gY29udGV4dFxuICAgICAqL1xuXG5cbiAgICBVc2VySUQuZWFjaCA9IGZ1bmN0aW9uIGVhY2gob2JqLCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgICAgICBpZiAob2JqID09PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKEFycmF5LnByb3RvdHlwZS5mb3JFYWNoICYmIG9iai5mb3JFYWNoID09PSBBcnJheS5wcm90b3R5cGUuZm9yRWFjaCkge1xuICAgICAgICAgICAgb2JqLmZvckVhY2goaXRlcmF0b3IsIGNvbnRleHQpO1xuICAgICAgICB9IGVsc2UgaWYgKG9iai5sZW5ndGggPT09ICtvYmoubGVuZ3RoKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IG9iai5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoaXRlcmF0b3IuY2FsbChjb250ZXh0LCBvYmpbaV0sIGksIG9iaikgPT09IHt9KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgICAgICAgICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpdGVyYXRvci5jYWxsKGNvbnRleHQsIG9ialtrZXldLCBrZXksIG9iaikgPT09IHt9KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFVzZXIgSUQgY29uc3RydWN0b3JcbiAgICAgKi9cblxuXG4gICAgZnVuY3Rpb24gVXNlcklEKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBVc2VySUQpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDbGVhciBwcmV2aW91cyB2ZXJzaW9uIG9mIEZpbmdlclByaW50XG4gICAgICAgICAqL1xuICAgICAgICBVc2VySUQuY2xlYXJQcmV2aW91cygpO1xuICAgICAgICAvKipcbiAgICAgICAgICogR2VuZXJhdGUgSURzXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLklERXZlckNvb2tpZSA9IFwiXCI7XG4gICAgICAgIHRoaXMuSURVSUQgPSBcIlwiO1xuICAgICAgICB0aGlzLklEQkFTRSA9IFVzZXJJRC5nZXRGaW5nZXJQcmludEhhc2goSlNPTi5zdHJpbmdpZnkoW19VdGlsczIuZGVmYXVsdC5Vc2VyLmdldEluZm8oKSwgVXNlcklELmdldFVzZXJMYW5ndWFnZSgpLCBVc2VySUQuZ2V0VGltZXpvbmVPZmZzZXQoKSwgdGhpcy5nZXRQbHVnaW5zKCldKSk7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbml0IEV2ZXJ5Q29va2llIGFuZCBnZXQgSURcbiAgICAgICAgICogQHR5cGUge0V2ZXJDb29raWV9XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLkV2ZXJDb29raWUgPSBuZXcgX0V2ZXJDb29raWUyLmRlZmF1bHQoXCJVc2VySURfMS4wLjE3XCIpO1xuICAgICAgICB0aGlzLklERXZlckNvb2tpZSA9IHRoaXMuRXZlckNvb2tpZS5nZXRJdGVtKHRydWUsIFwiRmluZ2VyUHJpbnRcIik7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZXQgZnVsbCBJRFxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5nZXRVSUQoZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBDb252ZXJ0IHVzZXIgc2lnbnMgdG8gUmFtYmxlciBmb3JtYXRcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgX3RoaXMuSURVSUQgPSBVc2VySUQuZ2V0RmluZ2VyUHJpbnRIYXNoKEpTT04uc3RyaW5naWZ5KHJlc3VsdCkpO1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBXcml0ZSBmdWxsIHVzZXIgSUQgaW50byB0aGUgRXZlckNvb2tpZVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBpZiAoX3RoaXMuSURFdmVyQ29va2llICE9PSBfdGhpcy5JRFVJRCkge1xuICAgICAgICAgICAgICAgIF90aGlzLkV2ZXJDb29raWUuc2V0SXRlbSh0cnVlLCBcIkZpbmdlclByaW50XCIsIF90aGlzLklEVUlEKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIF9VdGlsczIuZGVmYXVsdC5pbXBsZW1lbnRhdGlvblN0YXRpY01ldGhvZHModGhpcywgXCJVc2VySURcIik7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEdldCB1c2VyIElEXG4gICAgICogQHJldHVybiB7c3RyaW5nfVxuICAgICAqL1xuXG5cbiAgICBVc2VySUQucHJvdG90eXBlLmdldElEID0gZnVuY3Rpb24gZ2V0SUQoKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXR1cm4gZnVsbCB1c2VyIElELCBJRCBmcm9tIHN0b3JhZ2Ugb3IgYmFzZSBJRCBpZiBvbmUgb2YgdGhlbSBleGlzdFxuICAgICAgICAgKi9cbiAgICAgICAgcmV0dXJuIHRoaXMuSURVSUQgfHwgdGhpcy5JREV2ZXJDb29raWUgfHwgdGhpcy5JREJBU0U7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBHZXQgdXNlciBmdWxsIElEXG4gICAgICogQHBhcmFtIGNhbGxiYWNrXG4gICAgICovXG5cblxuICAgIFVzZXJJRC5wcm90b3R5cGUuZ2V0VUlEID0gZnVuY3Rpb24gZ2V0VUlEKGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciBfdGhpczIgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMuZ2V0SVAoZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgY2FsbGJhY2soW19VdGlsczIuZGVmYXVsdC5Vc2VyLmdldEluZm8oKSwgVXNlcklELmdldFVzZXJMYW5ndWFnZSgpLCBVc2VySUQuZ2V0VGltZXpvbmVPZmZzZXQoKSwgX3RoaXMyLmdldFBsdWdpbnMoKSwgcmVzdWx0XSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogR2V0IFBsdWdpbnNcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R8Ym9vbGVhbn1cbiAgICAgKi9cblxuXG4gICAgVXNlcklELnByb3RvdHlwZS5nZXRQbHVnaW5zID0gZnVuY3Rpb24gZ2V0UGx1Z2lucygpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmIChfVXRpbHMyLmRlZmF1bHQuQnJvd3Nlci5pc01TSUUoKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIFBsdWdpbnM6IHRoaXMuZ2V0SUVQbHVnaW5zKClcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBQbHVnaW5zOiB0aGlzLmdldFJlZ3VsYXJQbHVnaW5zKClcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEdldCBJRSBwbHVnaW5zXG4gICAgICogQHJldHVybiB7QXJyYXl9XG4gICAgICovXG5cblxuICAgIFVzZXJJRC5wcm90b3R5cGUuZ2V0SUVQbHVnaW5zID0gZnVuY3Rpb24gZ2V0SUVQbHVnaW5zKCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdmFyIGFyclJlc3VsdCA9IFtdO1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBJZiBBY3RpdmVYT2JqZWN0IHN1cHBvcnRlZFxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBpZiAoT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvciAmJiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHdpbmRvdywgXCJBY3RpdmVYT2JqZWN0XCIpIHx8IFwiQWN0aXZlWE9iamVjdFwiIGluIHdpbmRvdykge1xuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIExpc3Qgb2YgZXhwZWN0ZWQgcGx1Z2luc1xuICAgICAgICAgICAgICAgICAqIEB0eXBlIHtzdHJpbmdbXX1cbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICB2YXIgYXJyRXhwZWN0ZWRQbHVnaW5zTGlzdCA9IFtcIkFjcm9QREYuUERGXCIsIFwiQWRvZGIuU3RyZWFtXCIsIFwiQWdDb250cm9sLkFnQ29udHJvbFwiLCBcIkRldmFsVlJYQ3RybC5EZXZhbFZSWEN0cmwuMVwiLCBcIk1hY3JvbWVkaWFGbGFzaFBhcGVyLk1hY3JvbWVkaWFGbGFzaFBhcGVyXCIsIFwiTXN4bWwyLkRPTURvY3VtZW50XCIsIFwiTXN4bWwyLlhNTEhUVFBcIiwgXCJQREYuUGRmQ3RybFwiLCBcIlF1aWNrVGltZS5RdWlja1RpbWVcIiwgXCJRdWlja1RpbWVDaGVja09iamVjdC5RdWlja1RpbWVDaGVjay4xXCIsIFwiUmVhbFBsYXllclwiLCBcIlJlYWxQbGF5ZXIuUmVhbFBsYXllcih0bSkgQWN0aXZlWCBDb250cm9sICgzMi1iaXQpXCIsIFwiUmVhbFZpZGVvLlJlYWxWaWRlbyh0bSkgQWN0aXZlWCBDb250cm9sICgzMi1iaXQpXCIsIFwiU2NyaXB0aW5nLkRpY3Rpb25hcnlcIiwgXCJTV0N0bC5TV0N0bFwiLCBcIlNoZWxsLlVJSGVscGVyXCIsIFwiU2hvY2t3YXZlRmxhc2guU2hvY2t3YXZlRmxhc2hcIiwgXCJTa3lwZS5EZXRlY3Rpb25cIiwgXCJURENDdGwuVERDQ3RsXCIsIFwiV01QbGF5ZXIuT0NYXCIsIFwicm1vY3guUmVhbFBsYXllciBHMiBDb250cm9sXCIsIFwicm1vY3guUmVhbFBsYXllciBHMiBDb250cm9sLjFcIl07XG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogRGV0ZWN0aW5nIElFIHBsdWdpbnMgYnkgdHJ5aW5nIGluaXRpYWxpc2UgaXRcbiAgICAgICAgICAgICAgICAgKiBAdHlwZSB7QXJyYXl9XG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgYXJyUmVzdWx0ID0gdGhpcy5tYXAoYXJyRXhwZWN0ZWRQbHVnaW5zTGlzdCwgZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhID0gbmV3IEFjdGl2ZVhPYmplY3QobmFtZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuYW1lO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogSWYgbm9ybWFsIHBsdWdpbnMgc3VwcG9ydGVkIGFkZGVkIGl0IHRvIElFIHBsdWdpbiBsaXN0XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGlmICh3aW5kb3cubmF2aWdhdG9yLnBsdWdpbnMpIHtcbiAgICAgICAgICAgICAgICBhcnJSZXN1bHQgPSBhcnJSZXN1bHQuY29uY2F0KHRoaXMuZ2V0UmVndWxhclBsdWdpbnMoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIFJldHVybiBwbHVnaW5zIGxpc3RcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgcmV0dXJuIGFyclJlc3VsdDtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBHZXQgb3RoZXIgYnJvd3NlciBwbHVnaW5zXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqL1xuXG5cbiAgICBVc2VySUQucHJvdG90eXBlLmdldFJlZ3VsYXJQbHVnaW5zID0gZnVuY3Rpb24gZ2V0UmVndWxhclBsdWdpbnMoKSB7XG4gICAgICAgIHZhciBfdGhpczMgPSB0aGlzO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIFBsdWdpbnMgbGlzdFxuICAgICAgICAgICAgICogQHR5cGUge0FycmF5fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB2YXIgYXJyUGx1Z2lucyA9IFtdO1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBHZXQgcGx1Z2lucyBmcm9tIG5hdmlnYXRvclxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHdpbmRvdy5uYXZpZ2F0b3IucGx1Z2lucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGFyclBsdWdpbnMucHVzaCh3aW5kb3cubmF2aWdhdG9yLnBsdWdpbnNbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBTb3J0IHBsdWdpbnMgYnkgbmFtZVxuICAgICAgICAgICAgICogQHR5cGUge0FycmF5fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBhcnJQbHVnaW5zID0gYXJyUGx1Z2lucy5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICAgICAgaWYgKGEubmFtZSA+IGIubmFtZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGEubmFtZSA8IGIubmFtZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEV4dHJ1ZGUgcGx1Z2lucyBpbmZvXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHJldHVybiB0aGlzLm1hcChhcnJQbHVnaW5zLCBmdW5jdGlvbiAocCkge1xuICAgICAgICAgICAgICAgIHZhciBtaW1lVHlwZXMgPSBfdGhpczMubWFwKHAsIGZ1bmN0aW9uIChtdCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW210LnR5cGUsIG10LnN1ZmZpeGVzXS5qb2luKFwiflwiKTtcbiAgICAgICAgICAgICAgICB9KS5qb2luKFwiLFwiKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gW3AubmFtZSwgcC5kZXNjcmlwdGlvbiwgbWltZVR5cGVzXS5qb2luKFwiOjpcIik7XG4gICAgICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBHZXQgdXNlciBJUFxuICAgICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAgICovXG5cblxuICAgIFVzZXJJRC5wcm90b3R5cGUuZ2V0SVAgPSBmdW5jdGlvbiBnZXRJUChjYWxsYmFjaykge1xuICAgICAgICB2YXIgX3RoaXM0ID0gdGhpcztcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhpcy5nZXRJUEZyb21SVEMoZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2socmVzdWx0KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBfdGhpczQuZ2V0SVBGcm9tU2VydmVyKGNhbGxiYWNrKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgY2FsbGJhY2soZmFsc2UpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBHZXQgSVAgZnJvbSBSVENcbiAgICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgICAqL1xuXG5cbiAgICBVc2VySUQucHJvdG90eXBlLmdldElQRnJvbVJUQyA9IGZ1bmN0aW9uIGdldElQRnJvbVJUQyhjYWxsYmFjaykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgd2luZG93LlJUQ1BlZXJDb25uZWN0aW9uID0gd2luZG93LlJUQ1BlZXJDb25uZWN0aW9uIHx8IHdpbmRvdy5tb3pSVENQZWVyQ29ubmVjdGlvbiB8fCB3aW5kb3cud2Via2l0UlRDUGVlckNvbm5lY3Rpb247XG4gICAgICAgICAgICBpZiAod2luZG93LlJUQ1BlZXJDb25uZWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBjID0gbmV3IHdpbmRvdy5SVENQZWVyQ29ubmVjdGlvbih7IGljZVNlcnZlcnM6IFtdIH0pO1xuICAgICAgICAgICAgICAgICAgICBwYy5vbmljZWNhbmRpZGF0ZSA9IGZ1bmN0aW9uIChpY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaWNlIHx8ICFpY2UuY2FuZGlkYXRlIHx8ICFpY2UuY2FuZGlkYXRlLmNhbmRpZGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG15SVAgPSAvKFswLTldezEsM30oXFwuWzAtOV17MSwzfSl7M318W2EtZjAtOV17MSw0fSg6W2EtZjAtOV17MSw0fSl7N30pLy5leGVjKGljZS5jYW5kaWRhdGUuY2FuZGlkYXRlKVsxXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYy5vbmljZWNhbmRpZGF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIElQOiBteUlQXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIHBjLmNyZWF0ZURhdGFDaGFubmVsKFwiXCIpO1xuICAgICAgICAgICAgICAgICAgICBwYy5jcmVhdGVPZmZlcigpLnRoZW4oZnVuY3Rpb24gKGRlc2MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBjLnNldExvY2FsRGVzY3JpcHRpb24oZGVzYyk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGZhbHNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgY2FsbGJhY2soZmFsc2UpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBHZXQgdXNlciBJUCBmcm9tIHNlcnZlclxuICAgICAqIEBwYXJhbSBjYWxsYmFja1xuICAgICAqL1xuXG5cbiAgICBVc2VySUQucHJvdG90eXBlLmdldElQRnJvbVNlcnZlciA9IGZ1bmN0aW9uIGdldElQRnJvbVNlcnZlcihjYWxsYmFjaykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgICAgICAgICAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHhoci5yZWFkeVN0YXRlICE9IDQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoeGhyLnN0YXR1cyA9PT0gMjAwICYmIHhoci5yZXNwb25zZVRleHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBJUDogeGhyLnJlc3BvbnNlVGV4dFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHhoci5vcGVuKFwiR0VUXCIsIFwiLy9zc3AucmFtYmxlci5ydS91c2VyaXBcIik7XG4gICAgICAgICAgICAgICAgeGhyLnNlbmQoKTtcbiAgICAgICAgICAgIH0pKCk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKGZhbHNlKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgLyoqXG4gICAgICogTWFwIGVtdWxhdGlvbiBmb3IgQXJyYXlzIGFuZCBPYmplY3RzXG4gICAgICogQHBhcmFtIG9ialxuICAgICAqIEBwYXJhbSBpdGVyYXRvclxuICAgICAqIEBwYXJhbSBjb250ZXh0XG4gICAgICogQHJldHVybiB7QXJyYXl9XG4gICAgICovXG5cblxuICAgIFVzZXJJRC5wcm90b3R5cGUubWFwID0gZnVuY3Rpb24gbWFwKG9iaiwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICAgICAgdmFyIHJlc3VsdHMgPSBbXTtcbiAgICAgICAgaWYgKG9iaiA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKEFycmF5LnByb3RvdHlwZS5tYXAgJiYgb2JqLm1hcCA9PT0gQXJyYXkucHJvdG90eXBlLm1hcCkge1xuICAgICAgICAgICAgcmV0dXJuIG9iai5tYXAoaXRlcmF0b3IsIGNvbnRleHQpO1xuICAgICAgICB9XG4gICAgICAgIFVzZXJJRC5lYWNoKG9iaiwgZnVuY3Rpb24gKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgICAgICAgcmVzdWx0c1tyZXN1bHRzLmxlbmd0aF0gPSBpdGVyYXRvci5jYWxsKGNvbnRleHQsIHZhbHVlLCBpbmRleCwgbGlzdCk7XG4gICAgICAgIH0sIGNvbnRleHQpO1xuICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9O1xuXG4gICAgcmV0dXJuIFVzZXJJRDtcbn0oKTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gVXNlcklEO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFVzZXJJRDtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2xpYi9Vc2VySUQudHNcbi8vIG1vZHVsZSBpZCA9IDlcbi8vIG1vZHVsZSBjaHVua3MgPSAxIDIgMyIsIlwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX1V0aWxzID0gcmVxdWlyZShcIlV0aWxzXCIpO1xuXG52YXIgX1V0aWxzMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX1V0aWxzKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuLyoqXG4gKiBNdXJtdXJIYXNoM1xuICovXG52YXIgTXVybXVySGFzaDMgPSBmdW5jdGlvbiAoKSB7XG4gICAgLyoqXG4gICAgICogTXVybXVySGFzaDMgcmVsYXRlZCBmdW5jdGlvbnNcbiAgICAgKlxuICAgICAqIEdpdmVuIHR3byA2NGJpdCBpbnQgKGFzIGFuIGFycmF5IG9mIHR3byAzMmJpdCBpbnQpIHJldHVybnMgdGhlIHR3b1xuICAgICAqIGFkZGVkIHRvZ2V0aGVyIGFzIGEgNjRiaXQgaW50IChhcyBhbiBhcnJheSBvZiB0d28gMzJiaXQgaW50KS5cbiAgICAgKiBAcGFyYW0gbVxuICAgICAqIEBwYXJhbSBuXG4gICAgICogQHJldHVybiB7bnVtYmVyW119XG4gICAgICovXG4gICAgTXVybXVySGFzaDMueDY0QWRkID0gZnVuY3Rpb24geDY0QWRkKG0sIG4pIHtcbiAgICAgICAgbSA9IFttWzBdID4+PiAxNiwgbVswXSAmIDB4ZmZmZiwgbVsxXSA+Pj4gMTYsIG1bMV0gJiAweGZmZmZdO1xuICAgICAgICBuID0gW25bMF0gPj4+IDE2LCBuWzBdICYgMHhmZmZmLCBuWzFdID4+PiAxNiwgblsxXSAmIDB4ZmZmZl07XG4gICAgICAgIHZhciBvID0gWzAsIDAsIDAsIDBdO1xuICAgICAgICBvWzNdICs9IG1bM10gKyBuWzNdO1xuICAgICAgICBvWzJdICs9IG9bM10gPj4+IDE2O1xuICAgICAgICBvWzNdICY9IDB4ZmZmZjtcbiAgICAgICAgb1syXSArPSBtWzJdICsgblsyXTtcbiAgICAgICAgb1sxXSArPSBvWzJdID4+PiAxNjtcbiAgICAgICAgb1syXSAmPSAweGZmZmY7XG4gICAgICAgIG9bMV0gKz0gbVsxXSArIG5bMV07XG4gICAgICAgIG9bMF0gKz0gb1sxXSA+Pj4gMTY7XG4gICAgICAgIG9bMV0gJj0gMHhmZmZmO1xuICAgICAgICBvWzBdICs9IG1bMF0gKyBuWzBdO1xuICAgICAgICBvWzBdICY9IDB4ZmZmZjtcbiAgICAgICAgcmV0dXJuIFtvWzBdIDw8IDE2IHwgb1sxXSwgb1syXSA8PCAxNiB8IG9bM11dO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogR2l2ZW4gdHdvIDY0Yml0IGludCAoYXMgYW4gYXJyYXkgb2YgdHdvIDMyYml0IGludCkgcmV0dXJucyB0aGUgdHdvXG4gICAgICogbXVsdGlwbGllZCB0b2dldGhlciBhcyBhIDY0Yml0IGludCAoYXMgYW4gYXJyYXkgb2YgdHdvIDMyYml0IGludCkuXG4gICAgICogQHBhcmFtIG1cbiAgICAgKiBAcGFyYW0gblxuICAgICAqIEByZXR1cm4ge251bWJlcltdfVxuICAgICAqL1xuXG5cbiAgICBNdXJtdXJIYXNoMy54NjRNdWx0aXBseSA9IGZ1bmN0aW9uIHg2NE11bHRpcGx5KG0sIG4pIHtcbiAgICAgICAgbSA9IFttWzBdID4+PiAxNiwgbVswXSAmIDB4ZmZmZiwgbVsxXSA+Pj4gMTYsIG1bMV0gJiAweGZmZmZdO1xuICAgICAgICBuID0gW25bMF0gPj4+IDE2LCBuWzBdICYgMHhmZmZmLCBuWzFdID4+PiAxNiwgblsxXSAmIDB4ZmZmZl07XG4gICAgICAgIHZhciBvID0gWzAsIDAsIDAsIDBdO1xuICAgICAgICBvWzNdICs9IG1bM10gKiBuWzNdO1xuICAgICAgICBvWzJdICs9IG9bM10gPj4+IDE2O1xuICAgICAgICBvWzNdICY9IDB4ZmZmZjtcbiAgICAgICAgb1syXSArPSBtWzJdICogblszXTtcbiAgICAgICAgb1sxXSArPSBvWzJdID4+PiAxNjtcbiAgICAgICAgb1syXSAmPSAweGZmZmY7XG4gICAgICAgIG9bMl0gKz0gbVszXSAqIG5bMl07XG4gICAgICAgIG9bMV0gKz0gb1syXSA+Pj4gMTY7XG4gICAgICAgIG9bMl0gJj0gMHhmZmZmO1xuICAgICAgICBvWzFdICs9IG1bMV0gKiBuWzNdO1xuICAgICAgICBvWzBdICs9IG9bMV0gPj4+IDE2O1xuICAgICAgICBvWzFdICY9IDB4ZmZmZjtcbiAgICAgICAgb1sxXSArPSBtWzJdICogblsyXTtcbiAgICAgICAgb1swXSArPSBvWzFdID4+PiAxNjtcbiAgICAgICAgb1sxXSAmPSAweGZmZmY7XG4gICAgICAgIG9bMV0gKz0gbVszXSAqIG5bMV07XG4gICAgICAgIG9bMF0gKz0gb1sxXSA+Pj4gMTY7XG4gICAgICAgIG9bMV0gJj0gMHhmZmZmO1xuICAgICAgICBvWzBdICs9IG1bMF0gKiBuWzNdICsgbVsxXSAqIG5bMl0gKyBtWzJdICogblsxXSArIG1bM10gKiBuWzBdO1xuICAgICAgICBvWzBdICY9IDB4ZmZmZjtcbiAgICAgICAgcmV0dXJuIFtvWzBdIDw8IDE2IHwgb1sxXSwgb1syXSA8PCAxNiB8IG9bM11dO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogR2l2ZW4gYSA2NGJpdCBpbnQgKGFzIGFuIGFycmF5IG9mIHR3byAzMmJpdCBpbnQpIGFuZCBhbiBpbnRcbiAgICAgKiByZXByZXNlbnRpbmcgYSBudW1iZXIgb2YgYml0IHBvc2l0aW9ucywgcmV0dXJucyB0aGUgNjRiaXQgaW50IChhcyBhblxuICAgICAqIGFycmF5IG9mIHR3byAzMmJpdCBpbnQpIHJvdGF0ZWQgbGVmdCBieSB0aGF0IG51bWJlciBvZiBwb3NpdGlvbnMuXG4gICAgICogQHBhcmFtIG1cbiAgICAgKiBAcGFyYW0gblxuICAgICAqIEByZXR1cm4ge0FycmF5PG51bWJlcj59XG4gICAgICovXG5cblxuICAgIE11cm11ckhhc2gzLng2NFJvdGF0ZWQgPSBmdW5jdGlvbiB4NjRSb3RhdGVkKG0sIG4pIHtcbiAgICAgICAgbiAlPSA2NDtcbiAgICAgICAgaWYgKG4gPT09IDMyKSB7XG4gICAgICAgICAgICByZXR1cm4gW21bMV0sIG1bMF1dO1xuICAgICAgICB9IGVsc2UgaWYgKG4gPCAzMikge1xuICAgICAgICAgICAgcmV0dXJuIFttWzBdIDw8IG4gfCBtWzFdID4+PiAzMiAtIG4sIG1bMV0gPDwgbiB8IG1bMF0gPj4+IDMyIC0gbl07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuIC09IDMyO1xuICAgICAgICAgICAgcmV0dXJuIFttWzFdIDw8IG4gfCBtWzBdID4+PiAzMiAtIG4sIG1bMF0gPDwgbiB8IG1bMV0gPj4+IDMyIC0gbl07XG4gICAgICAgIH1cbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEdpdmVuIGEgNjRiaXQgaW50IChhcyBhbiBhcnJheSBvZiB0d28gMzJiaXQgaW50KSBhbmQgYW4gaW50XG4gICAgICogcmVwcmVzZW50aW5nIGEgbnVtYmVyIG9mIGJpdCBwb3NpdGlvbnMsIHJldHVybnMgdGhlIDY0Yml0IGludCAoYXMgYW5cbiAgICAgKiBhcnJheSBvZiB0d28gMzJiaXQgaW50KSBzaGlmdGVkIGxlZnQgYnkgdGhhdCBudW1iZXIgb2YgcG9zaXRpb25zLlxuICAgICAqIEBwYXJhbSBtXG4gICAgICogQHBhcmFtIG5cbiAgICAgKiBAcmV0dXJuIHtBcnJheTxudW1iZXI+fVxuICAgICAqL1xuXG5cbiAgICBNdXJtdXJIYXNoMy54NjRMZWZ0U2hpZnQgPSBmdW5jdGlvbiB4NjRMZWZ0U2hpZnQobSwgbikge1xuICAgICAgICBuICU9IDY0O1xuICAgICAgICBpZiAobiA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIG07XG4gICAgICAgIH0gZWxzZSBpZiAobiA8IDMyKSB7XG4gICAgICAgICAgICByZXR1cm4gW21bMF0gPDwgbiB8IG1bMV0gPj4+IDMyIC0gbiwgbVsxXSA8PCBuXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBbbVsxXSA8PCBuIC0gMzIsIDBdO1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBHaXZlbiB0d28gNjRiaXQgaW50IChhcyBhbiBhcnJheSBvZiB0d28gMzJiaXQgaW50KSByZXR1cm5zIHRoZSB0d29cbiAgICAgKiB4b3IgdG9nZXRoZXIgYXMgYSA2NGJpdCBpbnQgKGFzIGFuIGFycmF5IG9mIHR3byAzMmJpdCBpbnQpLlxuICAgICAqIEBwYXJhbSBtXG4gICAgICogQHBhcmFtIG5cbiAgICAgKiBAcmV0dXJuIHtBcnJheTxudW1iZXI+fVxuICAgICAqL1xuXG5cbiAgICBNdXJtdXJIYXNoMy54NjRYb3IgPSBmdW5jdGlvbiB4NjRYb3IobSwgbikge1xuICAgICAgICByZXR1cm4gW21bMF0gXiBuWzBdLCBtWzFdIF4gblsxXV07XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBHaXZlbiBhIGJsb2NrLCByZXR1cm5zIG11cm11ckhhc2gzJ3MgZmluYWwgeDY0IG1peCBvZiB0aGF0IGJsb2NrLlxuICAgICAqIChgWzAsIGhbMF0gPj4+IDFdYCBpcyBhIDMzIGJpdCB1bnNpZ25lZCByaWdodCBzaGlmdC4gVGhpcyBpcyB0aGVcbiAgICAgKiBvbmx5IHBsYWNlIHdoZXJlIHdlIG5lZWQgdG8gcmlnaHQgc2hpZnQgNjRiaXQgaW50LilcbiAgICAgKiBAcGFyYW0gaFxuICAgICAqIEByZXR1cm4ge0FycmF5PG51bWJlcj59XG4gICAgICovXG5cblxuICAgIE11cm11ckhhc2gzLng2NG1peCA9IGZ1bmN0aW9uIHg2NG1peChoKSB7XG4gICAgICAgIGggPSB0aGlzLng2NFhvcihoLCBbMCwgaFswXSA+Pj4gMV0pO1xuICAgICAgICBoID0gdGhpcy54NjRNdWx0aXBseShoLCBbMHhmZjUxYWZkNywgMHhlZDU1OGNjZF0pO1xuICAgICAgICBoID0gdGhpcy54NjRYb3IoaCwgWzAsIGhbMF0gPj4+IDFdKTtcbiAgICAgICAgaCA9IHRoaXMueDY0TXVsdGlwbHkoaCwgWzB4YzRjZWI5ZmUsIDB4MWE4NWVjNTNdKTtcbiAgICAgICAgaCA9IHRoaXMueDY0WG9yKGgsIFswLCBoWzBdID4+PiAxXSk7XG4gICAgICAgIHJldHVybiBoO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogR2l2ZW4gYSBzdHJpbmcgYW5kIGFuIG9wdGlvbmFsIHNlZWQgYXMgYW4gaW50LCByZXR1cm5zIGEgMTI4IGJpdFxuICAgICAqIGhhc2ggdXNpbmcgdGhlIHg2NCBmbGF2b3Igb2YgTXVybXVySGFzaDMsIGFzIGFuIHVuc2lnbmVkIGhleC5cbiAgICAgKiBAcGFyYW0ga2V5XG4gICAgICogQHBhcmFtIHNlZWRcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAgICovXG5cblxuICAgIE11cm11ckhhc2gzLng2NGhhc2gxMjggPSBmdW5jdGlvbiB4NjRoYXNoMTI4KGtleSwgc2VlZCkge1xuICAgICAgICBrZXkgPSBrZXkgfHwgXCJcIjtcbiAgICAgICAgc2VlZCA9IHNlZWQgfHwgMDtcbiAgICAgICAgdmFyIGkgPSB2b2lkIDA7XG4gICAgICAgIHZhciByZW1haW5kZXIgPSBrZXkubGVuZ3RoICUgMTY7XG4gICAgICAgIHZhciBieXRlcyA9IGtleS5sZW5ndGggLSByZW1haW5kZXI7XG4gICAgICAgIHZhciBoMSA9IFswLCBzZWVkXTtcbiAgICAgICAgdmFyIGgyID0gWzAsIHNlZWRdO1xuICAgICAgICB2YXIgazEgPSBbMCwgMF07XG4gICAgICAgIHZhciBrMiA9IFswLCAwXTtcbiAgICAgICAgdmFyIGMxID0gWzB4ODdjMzdiOTEsIDB4MTE0MjUzZDVdO1xuICAgICAgICB2YXIgYzIgPSBbMHg0Y2Y1YWQ0MywgMHgyNzQ1OTM3Zl07XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBieXRlczsgaSA9IGkgKyAxNikge1xuICAgICAgICAgICAgazEgPSBba2V5LmNoYXJDb2RlQXQoaSArIDQpICYgMHhmZiB8IChrZXkuY2hhckNvZGVBdChpICsgNSkgJiAweGZmKSA8PCA4IHwgKGtleS5jaGFyQ29kZUF0KGkgKyA2KSAmIDB4ZmYpIDw8IDE2IHwgKGtleS5jaGFyQ29kZUF0KGkgKyA3KSAmIDB4ZmYpIDw8IDI0LCBrZXkuY2hhckNvZGVBdChpKSAmIDB4ZmYgfCAoa2V5LmNoYXJDb2RlQXQoaSArIDEpICYgMHhmZikgPDwgOCB8IChrZXkuY2hhckNvZGVBdChpICsgMikgJiAweGZmKSA8PCAxNiB8IChrZXkuY2hhckNvZGVBdChpICsgMykgJiAweGZmKSA8PCAyNF07XG4gICAgICAgICAgICBrMiA9IFtrZXkuY2hhckNvZGVBdChpICsgMTIpICYgMHhmZiB8IChrZXkuY2hhckNvZGVBdChpICsgMTMpICYgMHhmZikgPDwgOCB8IChrZXkuY2hhckNvZGVBdChpICsgMTQpICYgMHhmZikgPDwgMTYgfCAoa2V5LmNoYXJDb2RlQXQoaSArIDE1KSAmIDB4ZmYpIDw8IDI0LCBrZXkuY2hhckNvZGVBdChpICsgOCkgJiAweGZmIHwgKGtleS5jaGFyQ29kZUF0KGkgKyA5KSAmIDB4ZmYpIDw8IDggfCAoa2V5LmNoYXJDb2RlQXQoaSArIDEwKSAmIDB4ZmYpIDw8IDE2IHwgKGtleS5jaGFyQ29kZUF0KGkgKyAxMSkgJiAweGZmKSA8PCAyNF07XG4gICAgICAgICAgICBrMSA9IHRoaXMueDY0TXVsdGlwbHkoazEsIGMxKTtcbiAgICAgICAgICAgIGsxID0gdGhpcy54NjRSb3RhdGVkKGsxLCAzMSk7XG4gICAgICAgICAgICBrMSA9IHRoaXMueDY0TXVsdGlwbHkoazEsIGMyKTtcbiAgICAgICAgICAgIGgxID0gdGhpcy54NjRYb3IoaDEsIGsxKTtcbiAgICAgICAgICAgIGgxID0gdGhpcy54NjRSb3RhdGVkKGgxLCAyNyk7XG4gICAgICAgICAgICBoMSA9IHRoaXMueDY0QWRkKGgxLCBoMik7XG4gICAgICAgICAgICBoMSA9IHRoaXMueDY0QWRkKHRoaXMueDY0TXVsdGlwbHkoaDEsIFswLCA1XSksIFswLCAweDUyZGNlNzI5XSk7XG4gICAgICAgICAgICBrMiA9IHRoaXMueDY0TXVsdGlwbHkoazIsIGMyKTtcbiAgICAgICAgICAgIGsyID0gdGhpcy54NjRSb3RhdGVkKGsyLCAzMyk7XG4gICAgICAgICAgICBrMiA9IHRoaXMueDY0TXVsdGlwbHkoazIsIGMxKTtcbiAgICAgICAgICAgIGgyID0gdGhpcy54NjRYb3IoaDIsIGsyKTtcbiAgICAgICAgICAgIGgyID0gdGhpcy54NjRSb3RhdGVkKGgyLCAzMSk7XG4gICAgICAgICAgICBoMiA9IHRoaXMueDY0QWRkKGgyLCBoMSk7XG4gICAgICAgICAgICBoMiA9IHRoaXMueDY0QWRkKHRoaXMueDY0TXVsdGlwbHkoaDIsIFswLCA1XSksIFswLCAweDM4NDk1YWI1XSk7XG4gICAgICAgIH1cbiAgICAgICAgazEgPSBbMCwgMF07XG4gICAgICAgIGsyID0gWzAsIDBdO1xuICAgICAgICBzd2l0Y2ggKHJlbWFpbmRlcikge1xuICAgICAgICAgICAgY2FzZSAxNTpcbiAgICAgICAgICAgICAgICBrMiA9IHRoaXMueDY0WG9yKGsyLCB0aGlzLng2NExlZnRTaGlmdChbMCwga2V5LmNoYXJDb2RlQXQoaSArIDE0KV0sIDQ4KSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDE0OlxuICAgICAgICAgICAgICAgIGsyID0gdGhpcy54NjRYb3IoazIsIHRoaXMueDY0TGVmdFNoaWZ0KFswLCBrZXkuY2hhckNvZGVBdChpICsgMTMpXSwgNDApKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMTM6XG4gICAgICAgICAgICAgICAgazIgPSB0aGlzLng2NFhvcihrMiwgdGhpcy54NjRMZWZ0U2hpZnQoWzAsIGtleS5jaGFyQ29kZUF0KGkgKyAxMildLCAzMikpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAxMjpcbiAgICAgICAgICAgICAgICBrMiA9IHRoaXMueDY0WG9yKGsyLCB0aGlzLng2NExlZnRTaGlmdChbMCwga2V5LmNoYXJDb2RlQXQoaSArIDExKV0sIDI0KSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDExOlxuICAgICAgICAgICAgICAgIGsyID0gdGhpcy54NjRYb3IoazIsIHRoaXMueDY0TGVmdFNoaWZ0KFswLCBrZXkuY2hhckNvZGVBdChpICsgMTApXSwgMTYpKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMTA6XG4gICAgICAgICAgICAgICAgazIgPSB0aGlzLng2NFhvcihrMiwgdGhpcy54NjRMZWZ0U2hpZnQoWzAsIGtleS5jaGFyQ29kZUF0KGkgKyA5KV0sIDgpKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgOTpcbiAgICAgICAgICAgICAgICBrMiA9IHRoaXMueDY0WG9yKGsyLCBbMCwga2V5LmNoYXJDb2RlQXQoaSArIDgpXSk7XG4gICAgICAgICAgICAgICAgazIgPSB0aGlzLng2NE11bHRpcGx5KGsyLCBjMik7XG4gICAgICAgICAgICAgICAgazIgPSB0aGlzLng2NFJvdGF0ZWQoazIsIDMzKTtcbiAgICAgICAgICAgICAgICBrMiA9IHRoaXMueDY0TXVsdGlwbHkoazIsIGMxKTtcbiAgICAgICAgICAgICAgICBoMiA9IHRoaXMueDY0WG9yKGgyLCBrMik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDg6XG4gICAgICAgICAgICAgICAgazEgPSB0aGlzLng2NFhvcihrMSwgdGhpcy54NjRMZWZ0U2hpZnQoWzAsIGtleS5jaGFyQ29kZUF0KGkgKyA3KV0sIDU2KSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDc6XG4gICAgICAgICAgICAgICAgazEgPSB0aGlzLng2NFhvcihrMSwgdGhpcy54NjRMZWZ0U2hpZnQoWzAsIGtleS5jaGFyQ29kZUF0KGkgKyA2KV0sIDQ4KSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDY6XG4gICAgICAgICAgICAgICAgazEgPSB0aGlzLng2NFhvcihrMSwgdGhpcy54NjRMZWZ0U2hpZnQoWzAsIGtleS5jaGFyQ29kZUF0KGkgKyA1KV0sIDQwKSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDU6XG4gICAgICAgICAgICAgICAgazEgPSB0aGlzLng2NFhvcihrMSwgdGhpcy54NjRMZWZ0U2hpZnQoWzAsIGtleS5jaGFyQ29kZUF0KGkgKyA0KV0sIDMyKSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICAgICAgazEgPSB0aGlzLng2NFhvcihrMSwgdGhpcy54NjRMZWZ0U2hpZnQoWzAsIGtleS5jaGFyQ29kZUF0KGkgKyAzKV0sIDI0KSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgazEgPSB0aGlzLng2NFhvcihrMSwgdGhpcy54NjRMZWZ0U2hpZnQoWzAsIGtleS5jaGFyQ29kZUF0KGkgKyAyKV0sIDE2KSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgazEgPSB0aGlzLng2NFhvcihrMSwgdGhpcy54NjRMZWZ0U2hpZnQoWzAsIGtleS5jaGFyQ29kZUF0KGkgKyAxKV0sIDgpKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICBrMSA9IHRoaXMueDY0WG9yKGsxLCBbMCwga2V5LmNoYXJDb2RlQXQoaSldKTtcbiAgICAgICAgICAgICAgICBrMSA9IHRoaXMueDY0TXVsdGlwbHkoazEsIGMxKTtcbiAgICAgICAgICAgICAgICBrMSA9IHRoaXMueDY0Um90YXRlZChrMSwgMzEpO1xuICAgICAgICAgICAgICAgIGsxID0gdGhpcy54NjRNdWx0aXBseShrMSwgYzIpO1xuICAgICAgICAgICAgICAgIGgxID0gdGhpcy54NjRYb3IoaDEsIGsxKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgIH1cbiAgICAgICAgaDEgPSB0aGlzLng2NFhvcihoMSwgWzAsIGtleS5sZW5ndGhdKTtcbiAgICAgICAgaDIgPSB0aGlzLng2NFhvcihoMiwgWzAsIGtleS5sZW5ndGhdKTtcbiAgICAgICAgaDEgPSB0aGlzLng2NEFkZChoMSwgaDIpO1xuICAgICAgICBoMiA9IHRoaXMueDY0QWRkKGgyLCBoMSk7XG4gICAgICAgIGgxID0gdGhpcy54NjRtaXgoaDEpO1xuICAgICAgICBoMiA9IHRoaXMueDY0bWl4KGgyKTtcbiAgICAgICAgaDEgPSB0aGlzLng2NEFkZChoMSwgaDIpO1xuICAgICAgICBoMiA9IHRoaXMueDY0QWRkKGgyLCBoMSk7XG4gICAgICAgIHZhciBuMSA9IGgxWzBdID4+PiAwO1xuICAgICAgICB2YXIgbjIgPSBoMVsxXSA+Pj4gMDtcbiAgICAgICAgdmFyIG4zID0gaDJbMF0gPj4+IDA7XG4gICAgICAgIHZhciBuNCA9IGgyWzFdID4+PiAwO1xuICAgICAgICB2YXIgczEgPSAoXCIwMDAwMDAwMFwiICsgbjEudG9TdHJpbmcoMTYpKS5zbGljZSgtOCk7XG4gICAgICAgIHZhciBzMiA9IChcIjAwMDAwMDAwXCIgKyBuMi50b1N0cmluZygxNikpLnNsaWNlKC04KTtcbiAgICAgICAgdmFyIHMzID0gKFwiMDAwMDAwMDBcIiArIG4zLnRvU3RyaW5nKDE2KSkuc2xpY2UoLTgpO1xuICAgICAgICB2YXIgczQgPSAoXCIwMDAwMDAwMFwiICsgbjQudG9TdHJpbmcoMTYpKS5zbGljZSgtOCk7XG4gICAgICAgIHJldHVybiBzMSArIHMyICsgczMgKyBzNDtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIE11cm11ckhhc2gzIGNvbnN0cnVjdG9yXG4gICAgICovXG5cblxuICAgIGZ1bmN0aW9uIE11cm11ckhhc2gzKCkge1xuICAgICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgTXVybXVySGFzaDMpO1xuXG4gICAgICAgIF9VdGlsczIuZGVmYXVsdC5pbXBsZW1lbnRhdGlvblN0YXRpY01ldGhvZHModGhpcywgXCJNdXJtdXJIYXNoM1wiKTtcbiAgICB9XG5cbiAgICByZXR1cm4gTXVybXVySGFzaDM7XG59KCk7XG5cbmV4cG9ydHMuZGVmYXVsdCA9IE11cm11ckhhc2gzO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbGliL011cm11ckhhc2gzLnRzXG4vLyBtb2R1bGUgaWQgPSAxMFxuLy8gbW9kdWxlIGNodW5rcyA9IDEgMiAzIiwiXCJ1c2Ugc3RyaWN0XCI7XG4vKipcbiAqIEltcG9ydCBzdWJjbGFzc2VzXG4gKi9cblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxudmFyIF90eXBlb2YgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIiA/IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIHR5cGVvZiBvYmo7IH0gOiBmdW5jdGlvbiAob2JqKSB7IHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG9iaiAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9O1xuXG52YXIgX1V0aWxzQW5pbWF0aW9uID0gcmVxdWlyZShcIi4vVXRpbHNBbmltYXRpb25cIik7XG5cbnZhciBfVXRpbHNBbmltYXRpb24yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfVXRpbHNBbmltYXRpb24pO1xuXG52YXIgX1V0aWxzQnJvd3NlciA9IHJlcXVpcmUoXCIuL1V0aWxzQnJvd3NlclwiKTtcblxudmFyIF9VdGlsc0Jyb3dzZXIyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfVXRpbHNCcm93c2VyKTtcblxudmFyIF9VdGlsc0Nvb2tpZSA9IHJlcXVpcmUoXCIuL1V0aWxzQ29va2llXCIpO1xuXG52YXIgX1V0aWxzQ29va2llMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX1V0aWxzQ29va2llKTtcblxudmFyIF9VdGlsc0RvY3VtZW50ID0gcmVxdWlyZShcIi4vVXRpbHNEb2N1bWVudFwiKTtcblxudmFyIF9VdGlsc0RvY3VtZW50MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX1V0aWxzRG9jdW1lbnQpO1xuXG52YXIgX1V0aWxzRE9NID0gcmVxdWlyZShcIi4vVXRpbHNET01cIik7XG5cbnZhciBfVXRpbHNET00yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfVXRpbHNET00pO1xuXG52YXIgX1V0aWxzTW91c2UgPSByZXF1aXJlKFwiLi9VdGlsc01vdXNlXCIpO1xuXG52YXIgX1V0aWxzTW91c2UyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfVXRpbHNNb3VzZSk7XG5cbnZhciBfVXRpbHNTY3JlZW4gPSByZXF1aXJlKFwiLi9VdGlsc1NjcmVlblwiKTtcblxudmFyIF9VdGlsc1NjcmVlbjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9VdGlsc1NjcmVlbik7XG5cbnZhciBfVXRpbHNTeXN0ZW0gPSByZXF1aXJlKFwiLi9VdGlsc1N5c3RlbVwiKTtcblxudmFyIF9VdGlsc1N5c3RlbTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9VdGlsc1N5c3RlbSk7XG5cbnZhciBfVXRpbHNVc2VyID0gcmVxdWlyZShcIi4vVXRpbHNVc2VyXCIpO1xuXG52YXIgX1V0aWxzVXNlcjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9VdGlsc1VzZXIpO1xuXG52YXIgX1V0aWxzV2luZG93ID0gcmVxdWlyZShcIi4vVXRpbHNXaW5kb3dcIik7XG5cbnZhciBfVXRpbHNXaW5kb3cyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfVXRpbHNXaW5kb3cpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG4vKipcbiAqIEdsb2JhbCBVdGlscyBjbGFzc1xuICovXG52YXIgVXRpbHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gVXRpbHMoKSB7XG4gICAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBVdGlscyk7XG4gICAgfVxuXG4gICAgVXRpbHMud2FybiA9IGZ1bmN0aW9uIHdhcm4obWVzc2FuZ2UpIHtcbiAgICAgICAgaWYgKCh0eXBlb2YgY29uc29sZSA9PT0gXCJ1bmRlZmluZWRcIiA/IFwidW5kZWZpbmVkXCIgOiBfdHlwZW9mKGNvbnNvbGUpKSA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBjb25zb2xlLndhcm4gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgIC8vY29uc29sZS53YXJuKG1lc3NhbmdlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbWVzc2FuZ2U7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBjb25zb2xlLmxvZyA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhtZXNzYW5nZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG1lc3NhbmdlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBAZGVwcmVjYXRlZCBVdGlscy5nZXRCb3VuZGluZ0NsaWVudFJlY3QgbWV0aG9kIHdhcyBkZXByZWNhdGVkIGFuZCBzb29uIHdpbGwgYmUgcmVtb3ZlZC4gUGxlYXNlIHVzZSBVdGlscy5ET00uZ2V0Qm91bmRpbmdDbGllbnRSZWN0IG1ldGhvZC5cbiAgICAgKi9cblxuXG4gICAgVXRpbHMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0ID0gZnVuY3Rpb24gZ2V0Qm91bmRpbmdDbGllbnRSZWN0KGRvbU5vZGUpIHtcbiAgICAgICAgdmFyIGRvbURvY3VtZW50ID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBkb2N1bWVudDtcbiAgICAgICAgdmFyIHNob3dGb3JjZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDogZmFsc2U7XG5cbiAgICAgICAgVXRpbHMud2FybihcIlV0aWxzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCBtZXRob2Qgd2FzIGRlcHJlY2F0ZWQgYW5kIHNvb24gd2lsbCBiZSByZW1vdmVkLiBQbGVhc2UgdXNlIFV0aWxzLkRPTS5nZXRCb3VuZGluZ0NsaWVudFJlY3QgbWV0aG9kLlwiKTtcbiAgICAgICAgcmV0dXJuIFV0aWxzLkRPTS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoZG9tTm9kZSwgZG9tRG9jdW1lbnQsIHNob3dGb3JjZSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEBkZXByZWNhdGVkIFV0aWxzLmZpbmRFbGVtZW50UG9zaXRpb24gbWV0aG9kIHdhcyBkZXByZWNhdGVkIGFuZCBzb29uIHdpbGwgYmUgcmVtb3ZlZC4gUGxlYXNlIHVzZSBVdGlscy5ET00uZmluZEVsZW1lbnRQb3NpdGlvbiBtZXRob2QuXG4gICAgICovXG4gICAgVXRpbHMuZmluZEVsZW1lbnRQb3NpdGlvbiA9IGZ1bmN0aW9uIGZpbmRFbGVtZW50UG9zaXRpb24oZG9tTm9kZSkge1xuICAgICAgICB2YXIgZG9tRG9jdW1lbnQgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IGRvY3VtZW50O1xuICAgICAgICB2YXIgc2hvd0ZvcmNlID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiBmYWxzZTtcblxuICAgICAgICBVdGlscy53YXJuKFwiVXRpbHMuZmluZEVsZW1lbnRQb3NpdGlvbiBtZXRob2Qgd2FzIGRlcHJlY2F0ZWQgYW5kIHNvb24gd2lsbCBiZSByZW1vdmVkLiBQbGVhc2UgdXNlIFV0aWxzLkRPTS5maW5kRWxlbWVudFBvc2l0aW9uIG1ldGhvZC5cIik7XG4gICAgICAgIHJldHVybiBVdGlscy5ET00uZmluZEVsZW1lbnRQb3NpdGlvbihkb21Ob2RlLCBkb21Eb2N1bWVudCwgc2hvd0ZvcmNlKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFRyYW5zZmVyIHN0YXRpYyBtZXRob2RzIGludG8gdGhlIG9iamVjdFxuICAgICAqIEBwYXJhbSByZWFsT2JqZWN0XG4gICAgICogQHBhcmFtIGNsYXNzTmFtZVxuICAgICAqL1xuXG5cbiAgICBVdGlscy5pbXBsZW1lbnRhdGlvblN0YXRpY01ldGhvZHMgPSBmdW5jdGlvbiBpbXBsZW1lbnRhdGlvblN0YXRpY01ldGhvZHMocmVhbE9iamVjdCwgY2xhc3NOYW1lKSB7XG4gICAgICAgIGlmICghIXJlYWxPYmplY3QgJiYgKHR5cGVvZiByZWFsT2JqZWN0ID09PSBcInVuZGVmaW5lZFwiID8gXCJ1bmRlZmluZWRcIiA6IF90eXBlb2YocmVhbE9iamVjdCkpID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBzdGF0aWNDbGFzcyA9IHJlYWxPYmplY3QuY29uc3RydWN0b3I7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBzdGF0aWNDbGFzcyA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBtZXRob2RzID0gT2JqZWN0LmtleXMoc3RhdGljQ2xhc3MpO1xuICAgICAgICAgICAgICAgICAgICBpZiAobWV0aG9kcyAmJiBtZXRob2RzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBfbG9vcCA9IGZ1bmN0aW9uIF9sb29wKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChfaXNBcnJheSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoX2kgPj0gX2l0ZXJhdG9yLmxlbmd0aCkgcmV0dXJuIFwiYnJlYWtcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3JlZiA9IF9pdGVyYXRvcltfaSsrXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfaSA9IF9pdGVyYXRvci5uZXh0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChfaS5kb25lKSByZXR1cm4gXCJicmVha1wiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfcmVmID0gX2kudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG1ldGhvZCA9IF9yZWY7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHJlYWxPYmplY3RbbWV0aG9kXSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWFsT2JqZWN0W21ldGhvZF0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHN0YXRpY0NsYXNzICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVXRpbHMud2FybihcIlRoYXQgbWV0aG9kIHdhcyBkZXByZWNhdGVkIGFuZCBzb29uIHdpbGwgYmUgcmVtb3ZlZC4gUGxlYXNlIHVzZSBcIiArIChjbGFzc05hbWUgfHwgc3RhdGljQ2xhc3MgJiYgc3RhdGljQ2xhc3MubmFtZSB8fCBcIlVua25vd25cIikgKyBcIi5cIiArIG1ldGhvZCArIFwiIG1ldGhvZC5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3RhdGljQ2xhc3NbbWV0aG9kXS5hcHBseShzdGF0aWNDbGFzcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBfaXRlcmF0b3IgPSBtZXRob2RzLCBfaXNBcnJheSA9IEFycmF5LmlzQXJyYXkoX2l0ZXJhdG9yKSwgX2kgPSAwLCBfaXRlcmF0b3IgPSBfaXNBcnJheSA/IF9pdGVyYXRvciA6IF9pdGVyYXRvcltTeW1ib2wuaXRlcmF0b3JdKCk7Oykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBfcmVmO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIF9yZXQyID0gX2xvb3AoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChfcmV0MiA9PT0gXCJicmVha1wiKSBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pKCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEdldCBjYWxsIHN0YWNrIHRyYWNlXG4gICAgICogQHJldHVybiBBcnJheTxPYmplY3Q+XG4gICAgICovXG5cblxuICAgIFV0aWxzLnN0YWNrID0gZnVuY3Rpb24gc3RhY2soKSB7XG4gICAgICAgIHZhciBlID0gbmV3IEVycm9yKCk7XG4gICAgICAgIHJldHVybiBlICYmIGUuc3RhY2sgJiYgZS5zdGFjay5zcGxpdChcIlxcblwiKS5zbGljZSg1KS5tYXAoZnVuY3Rpb24gKHMpIHtcbiAgICAgICAgICAgIGlmICghcykge1xuICAgICAgICAgICAgICAgIHJldHVybiB7fTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBtYXRjaCA9IC9eKC4qKUAoLiopXFwuanM6KFswLTldKyk6KFswLTldKykkL2lnLmV4ZWMocyk7XG4gICAgICAgICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgICAgICAgICBpZiAobWF0Y2hbMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgbWF0Y2hbMV0gPSAvKFteXFwvPF0rKS9pZy5leGVjKG1hdGNoWzFdKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1hdGNoWzFdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtYXRjaFsxXSA9IG1hdGNoWzFdWzBdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbHVtbjogbWF0Y2hbNF0gfHwgXCJcIixcbiAgICAgICAgICAgICAgICAgICAgZmlsZTogbWF0Y2hbMl0gfHwgXCJcIixcbiAgICAgICAgICAgICAgICAgICAgbGluZTogbWF0Y2hbM10gfHwgXCJcIixcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiBtYXRjaFsxXSB8fCBcIlwiXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG1hdGNoID0gL14oLiopQChodHRwfGh0dHBzKTooW146XSspOihbMC05XSspOihbMC05XSspJC9pZy5leGVjKHMpO1xuICAgICAgICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgY29sdW1uOiBtYXRjaFs1XSB8fCBcIlwiLFxuICAgICAgICAgICAgICAgICAgICBmaWxlOiBtYXRjaFszXSB8fCBcIlwiLFxuICAgICAgICAgICAgICAgICAgICBsaW5lOiBtYXRjaFs0XSB8fCBcIlwiLFxuICAgICAgICAgICAgICAgICAgICBtZXRob2Q6IG1hdGNoWzFdICsgXCI6XCIgKyBtYXRjaFsyXSB8fCBcIlwiXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG1hdGNoID0gL14oLiopQCguKik6KFswLTldKyk6KFswLTldKykkL2lnLmV4ZWMocyk7XG4gICAgICAgICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBjb2x1bW46IG1hdGNoWzRdIHx8IFwiXCIsXG4gICAgICAgICAgICAgICAgICAgIGZpbGU6IG1hdGNoWzJdIHx8IFwiXCIsXG4gICAgICAgICAgICAgICAgICAgIGxpbmU6IG1hdGNoWzNdIHx8IFwiXCIsXG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogbWF0Y2hbMV0gfHwgXCJcIlxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBtYXRjaCA9IC9eXFxzK2F0XFxzKFteKF0rKVxcc1xcKCguKik6KFswLTldKyk6KFswLTldKylcXCkkL2lnLmV4ZWMocyk7XG4gICAgICAgICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBjb2x1bW46IG1hdGNoWzRdIHx8IFwiXCIsXG4gICAgICAgICAgICAgICAgICAgIGZpbGU6IG1hdGNoWzJdIHx8IFwiXCIsXG4gICAgICAgICAgICAgICAgICAgIGxpbmU6IG1hdGNoWzNdIHx8IFwiXCIsXG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogbWF0Y2hbMV0gfHwgXCJcIlxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBtYXRjaCA9IC9eXFxzK2F0XFxzKC4qKTooWzAtOV0rKTooWzAtOV0rKSQvaWcuZXhlYyhzKTtcbiAgICAgICAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbHVtbjogbWF0Y2hbM10gfHwgXCJcIixcbiAgICAgICAgICAgICAgICAgICAgZmlsZTogbWF0Y2hbMV0gfHwgXCJcIixcbiAgICAgICAgICAgICAgICAgICAgbGluZTogbWF0Y2hbMl0gfHwgXCJcIixcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiBcIlwiXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBzO1xuICAgICAgICB9KSB8fCBbXTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEdldCByYW5kb20gSURcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAgICovXG5cblxuICAgIFV0aWxzLmdldFVJRCA9IGZ1bmN0aW9uIGdldFVJRCgpIHtcbiAgICAgICAgcmV0dXJuIE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnN1YnN0cmluZygyKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIFV0aWxzO1xufSgpO1xuXG5leHBvcnRzLmRlZmF1bHQgPSBVdGlscztcblxuVXRpbHMuQW5pbWF0aW9uID0gX1V0aWxzQW5pbWF0aW9uMi5kZWZhdWx0O1xuVXRpbHMuQnJvd3NlciA9IF9VdGlsc0Jyb3dzZXIyLmRlZmF1bHQ7XG5VdGlscy5Db29raWUgPSBfVXRpbHNDb29raWUyLmRlZmF1bHQ7XG5VdGlscy5ET00gPSBfVXRpbHNET00yLmRlZmF1bHQ7XG5VdGlscy5Eb2N1bWVudCA9IF9VdGlsc0RvY3VtZW50Mi5kZWZhdWx0O1xuVXRpbHMuTW91c2UgPSBfVXRpbHNNb3VzZTIuZGVmYXVsdDtcblV0aWxzLlNjcmVlbiA9IF9VdGlsc1NjcmVlbjIuZGVmYXVsdDtcblV0aWxzLlN5c3RlbSA9IF9VdGlsc1N5c3RlbTIuZGVmYXVsdDtcblV0aWxzLlVzZXIgPSBfVXRpbHNVc2VyMi5kZWZhdWx0O1xuVXRpbHMuV2luZG93ID0gX1V0aWxzV2luZG93Mi5kZWZhdWx0O1xubW9kdWxlLmV4cG9ydHMgPSBVdGlscztcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vVXRpbHMvbGliL1V0aWxzLnRzXG4vLyBtb2R1bGUgaWQgPSAxMVxuLy8gbW9kdWxlIGNodW5rcyA9IDEgMiAzIiwiXCJ1c2Ugc3RyaWN0XCI7XG4vKipcbiAqIEltcG9ydCBzdWJjbGFzc2VzXG4gKi9cblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxudmFyIF9VdGlsc0FuaW1hdGlvbkVhc2luZyA9IHJlcXVpcmUoXCIuL1V0aWxzQW5pbWF0aW9uRWFzaW5nXCIpO1xuXG52YXIgX1V0aWxzQW5pbWF0aW9uRWFzaW5nMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX1V0aWxzQW5pbWF0aW9uRWFzaW5nKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxudmFyIEFuaW1hdGlvbiA9IGZ1bmN0aW9uIEFuaW1hdGlvbigpIHtcbiAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIEFuaW1hdGlvbik7XG59O1xuXG5leHBvcnRzLmRlZmF1bHQgPSBBbmltYXRpb247XG5cbkFuaW1hdGlvbi5FYXNpbmcgPSBfVXRpbHNBbmltYXRpb25FYXNpbmcyLmRlZmF1bHQ7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L1V0aWxzL2xpYi9VdGlsc0FuaW1hdGlvbi50c1xuLy8gbW9kdWxlIGlkID0gMTJcbi8vIG1vZHVsZSBjaHVua3MgPSAxIDIgMyIsIlwidXNlIHN0cmljdFwiO1xuLyoqXG4gKiBEaWZmZXJlbnQgdGltZSBhbmltYXRpb24gZnVuY3Rpb25zXG4gKi9cblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxudmFyIEVhc2luZyA9IGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBFYXNpbmcoKSB7XG4gICAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBFYXNpbmcpO1xuICAgIH1cblxuICAgIEVhc2luZy5pc1ZhbGlkUGFyYW1zID0gZnVuY3Rpb24gaXNWYWxpZFBhcmFtcyh0LCBiLCBjLCBkLCBzKSB7XG4gICAgICAgIHJldHVybiB0eXBlb2YgdCA9PT0gXCJudW1iZXJcIiAmJiB0eXBlb2YgYiA9PT0gXCJudW1iZXJcIiAmJiB0eXBlb2YgYyA9PT0gXCJudW1iZXJcIiAmJiB0eXBlb2YgZCA9PT0gXCJudW1iZXJcIiAmJiAodHlwZW9mIHMgPT09IFwidW5kZWZpbmVkXCIgfHwgdHlwZW9mIHMgPT09IFwibnVtYmVyXCIpICYmIHQgPCBkO1xuICAgIH07XG5cbiAgICBFYXNpbmcuc3dpbmcgPSBmdW5jdGlvbiBzd2luZyh0LCBiLCBjLCBkKSB7XG4gICAgICAgIGlmIChFYXNpbmcuaXNWYWxpZFBhcmFtcyh0LCBiLCBjLCBkKSkge1xuICAgICAgICAgICAgcmV0dXJuIEVhc2luZ1tFYXNpbmcuZGVmXSh0LCBiLCBjLCBkKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBOYU47XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgRWFzaW5nLmVhc2VJblF1YWQgPSBmdW5jdGlvbiBlYXNlSW5RdWFkKHQsIGIsIGMsIGQpIHtcbiAgICAgICAgaWYgKEVhc2luZy5pc1ZhbGlkUGFyYW1zKHQsIGIsIGMsIGQpKSB7XG4gICAgICAgICAgICByZXR1cm4gYyAqICh0IC89IGQpICogdCArIGI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gTmFOO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIEVhc2luZy5lYXNlT3V0UXVhZCA9IGZ1bmN0aW9uIGVhc2VPdXRRdWFkKHQsIGIsIGMsIGQpIHtcbiAgICAgICAgaWYgKEVhc2luZy5pc1ZhbGlkUGFyYW1zKHQsIGIsIGMsIGQpKSB7XG4gICAgICAgICAgICByZXR1cm4gLWMgKiAodCAvPSBkKSAqICh0IC0gMikgKyBiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIE5hTjtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBFYXNpbmcuZWFzZUluT3V0UXVhZCA9IGZ1bmN0aW9uIGVhc2VJbk91dFF1YWQodCwgYiwgYywgZCkge1xuICAgICAgICBpZiAoRWFzaW5nLmlzVmFsaWRQYXJhbXModCwgYiwgYywgZCkpIHtcbiAgICAgICAgICAgIGlmICgodCAvPSBkIC8gMikgPCAxKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGMgLyAyICogdCAqIHQgKyBiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIC1jIC8gMiAqICgtLXQgKiAodCAtIDIpIC0gMSkgKyBiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIE5hTjtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBFYXNpbmcuZWFzZUluQ3ViaWMgPSBmdW5jdGlvbiBlYXNlSW5DdWJpYyh0LCBiLCBjLCBkKSB7XG4gICAgICAgIGlmIChFYXNpbmcuaXNWYWxpZFBhcmFtcyh0LCBiLCBjLCBkKSkge1xuICAgICAgICAgICAgcmV0dXJuIGMgKiAodCAvPSBkKSAqIHQgKiB0ICsgYjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBOYU47XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgRWFzaW5nLmVhc2VPdXRDdWJpYyA9IGZ1bmN0aW9uIGVhc2VPdXRDdWJpYyh0LCBiLCBjLCBkKSB7XG4gICAgICAgIGlmIChFYXNpbmcuaXNWYWxpZFBhcmFtcyh0LCBiLCBjLCBkKSkge1xuICAgICAgICAgICAgcmV0dXJuIGMgKiAoKHQgPSB0IC8gZCAtIDEpICogdCAqIHQgKyAxKSArIGI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gTmFOO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIEVhc2luZy5lYXNlSW5PdXRDdWJpYyA9IGZ1bmN0aW9uIGVhc2VJbk91dEN1YmljKHQsIGIsIGMsIGQpIHtcbiAgICAgICAgaWYgKEVhc2luZy5pc1ZhbGlkUGFyYW1zKHQsIGIsIGMsIGQpKSB7XG4gICAgICAgICAgICBpZiAoKHQgLz0gZCAvIDIpIDwgMSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjIC8gMiAqIHQgKiB0ICogdCArIGI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYyAvIDIgKiAoKHQgLT0gMikgKiB0ICogdCArIDIpICsgYjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBOYU47XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgRWFzaW5nLmVhc2VJblF1YXJ0ID0gZnVuY3Rpb24gZWFzZUluUXVhcnQodCwgYiwgYywgZCkge1xuICAgICAgICBpZiAoRWFzaW5nLmlzVmFsaWRQYXJhbXModCwgYiwgYywgZCkpIHtcbiAgICAgICAgICAgIHJldHVybiBjICogKHQgLz0gZCkgKiB0ICogdCAqIHQgKyBiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIE5hTjtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBFYXNpbmcuZWFzZU91dFF1YXJ0ID0gZnVuY3Rpb24gZWFzZU91dFF1YXJ0KHQsIGIsIGMsIGQpIHtcbiAgICAgICAgaWYgKEVhc2luZy5pc1ZhbGlkUGFyYW1zKHQsIGIsIGMsIGQpKSB7XG4gICAgICAgICAgICByZXR1cm4gLWMgKiAoKHQgPSB0IC8gZCAtIDEpICogdCAqIHQgKiB0IC0gMSkgKyBiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIE5hTjtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBFYXNpbmcuZWFzZUluT3V0UXVhcnQgPSBmdW5jdGlvbiBlYXNlSW5PdXRRdWFydCh0LCBiLCBjLCBkKSB7XG4gICAgICAgIGlmIChFYXNpbmcuaXNWYWxpZFBhcmFtcyh0LCBiLCBjLCBkKSkge1xuICAgICAgICAgICAgaWYgKCh0IC89IGQgLyAyKSA8IDEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYyAvIDIgKiB0ICogdCAqIHQgKiB0ICsgYjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAtYyAvIDIgKiAoKHQgLT0gMikgKiB0ICogdCAqIHQgLSAyKSArIGI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gTmFOO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIEVhc2luZy5lYXNlSW5RdWludCA9IGZ1bmN0aW9uIGVhc2VJblF1aW50KHQsIGIsIGMsIGQpIHtcbiAgICAgICAgaWYgKEVhc2luZy5pc1ZhbGlkUGFyYW1zKHQsIGIsIGMsIGQpKSB7XG4gICAgICAgICAgICByZXR1cm4gYyAqICh0IC89IGQpICogdCAqIHQgKiB0ICogdCArIGI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gTmFOO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIEVhc2luZy5lYXNlT3V0UXVpbnQgPSBmdW5jdGlvbiBlYXNlT3V0UXVpbnQodCwgYiwgYywgZCkge1xuICAgICAgICBpZiAoRWFzaW5nLmlzVmFsaWRQYXJhbXModCwgYiwgYywgZCkpIHtcbiAgICAgICAgICAgIHJldHVybiBjICogKCh0ID0gdCAvIGQgLSAxKSAqIHQgKiB0ICogdCAqIHQgKyAxKSArIGI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gTmFOO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIEVhc2luZy5lYXNlSW5PdXRRdWludCA9IGZ1bmN0aW9uIGVhc2VJbk91dFF1aW50KHQsIGIsIGMsIGQpIHtcbiAgICAgICAgaWYgKEVhc2luZy5pc1ZhbGlkUGFyYW1zKHQsIGIsIGMsIGQpKSB7XG4gICAgICAgICAgICBpZiAoKHQgLz0gZCAvIDIpIDwgMSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjIC8gMiAqIHQgKiB0ICogdCAqIHQgKiB0ICsgYjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBjIC8gMiAqICgodCAtPSAyKSAqIHQgKiB0ICogdCAqIHQgKyAyKSArIGI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gTmFOO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIEVhc2luZy5lYXNlSW5TaW5lID0gZnVuY3Rpb24gZWFzZUluU2luZSh0LCBiLCBjLCBkKSB7XG4gICAgICAgIGlmIChFYXNpbmcuaXNWYWxpZFBhcmFtcyh0LCBiLCBjLCBkKSkge1xuICAgICAgICAgICAgcmV0dXJuIC1jICogTWF0aC5jb3ModCAvIGQgKiAoTWF0aC5QSSAvIDIpKSArIGMgKyBiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIE5hTjtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBFYXNpbmcuZWFzZU91dFNpbmUgPSBmdW5jdGlvbiBlYXNlT3V0U2luZSh0LCBiLCBjLCBkKSB7XG4gICAgICAgIGlmIChFYXNpbmcuaXNWYWxpZFBhcmFtcyh0LCBiLCBjLCBkKSkge1xuICAgICAgICAgICAgcmV0dXJuIGMgKiBNYXRoLnNpbih0IC8gZCAqIChNYXRoLlBJIC8gMikpICsgYjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBOYU47XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgRWFzaW5nLmVhc2VJbk91dFNpbmUgPSBmdW5jdGlvbiBlYXNlSW5PdXRTaW5lKHQsIGIsIGMsIGQpIHtcbiAgICAgICAgaWYgKEVhc2luZy5pc1ZhbGlkUGFyYW1zKHQsIGIsIGMsIGQpKSB7XG4gICAgICAgICAgICByZXR1cm4gLWMgLyAyICogKE1hdGguY29zKE1hdGguUEkgKiB0IC8gZCkgLSAxKSArIGI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gTmFOO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIEVhc2luZy5lYXNlSW5FeHBvID0gZnVuY3Rpb24gZWFzZUluRXhwbyh0LCBiLCBjLCBkKSB7XG4gICAgICAgIGlmIChFYXNpbmcuaXNWYWxpZFBhcmFtcyh0LCBiLCBjLCBkKSkge1xuICAgICAgICAgICAgcmV0dXJuIHQgPT09IDAgPyBiIDogYyAqIE1hdGgucG93KDIsIDEwICogKHQgLyBkIC0gMSkpICsgYjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBOYU47XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgRWFzaW5nLmVhc2VPdXRFeHBvID0gZnVuY3Rpb24gZWFzZU91dEV4cG8odCwgYiwgYywgZCkge1xuICAgICAgICBpZiAoRWFzaW5nLmlzVmFsaWRQYXJhbXModCwgYiwgYywgZCkpIHtcbiAgICAgICAgICAgIHJldHVybiB0ID09PSBkID8gYiArIGMgOiBjICogKC1NYXRoLnBvdygyLCAtMTAgKiB0IC8gZCkgKyAxKSArIGI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gTmFOO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIEVhc2luZy5lYXNlSW5PdXRFeHBvID0gZnVuY3Rpb24gZWFzZUluT3V0RXhwbyh0LCBiLCBjLCBkKSB7XG4gICAgICAgIGlmIChFYXNpbmcuaXNWYWxpZFBhcmFtcyh0LCBiLCBjLCBkKSkge1xuICAgICAgICAgICAgaWYgKHQgPT09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0ID09PSBkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGIgKyBjO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCh0IC89IGQgLyAyKSA8IDEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYyAvIDIgKiBNYXRoLnBvdygyLCAxMCAqICh0IC0gMSkpICsgYjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBjIC8gMiAqICgtTWF0aC5wb3coMiwgLTEwICogLS10KSArIDIpICsgYjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBOYU47XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgRWFzaW5nLmVhc2VJbkNpcmMgPSBmdW5jdGlvbiBlYXNlSW5DaXJjKHQsIGIsIGMsIGQpIHtcbiAgICAgICAgaWYgKEVhc2luZy5pc1ZhbGlkUGFyYW1zKHQsIGIsIGMsIGQpKSB7XG4gICAgICAgICAgICByZXR1cm4gLWMgKiAoTWF0aC5zcXJ0KDEgLSAodCAvPSBkKSAqIHQpIC0gMSkgKyBiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIE5hTjtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBFYXNpbmcuZWFzZU91dENpcmMgPSBmdW5jdGlvbiBlYXNlT3V0Q2lyYyh0LCBiLCBjLCBkKSB7XG4gICAgICAgIGlmIChFYXNpbmcuaXNWYWxpZFBhcmFtcyh0LCBiLCBjLCBkKSkge1xuICAgICAgICAgICAgcmV0dXJuIGMgKiBNYXRoLnNxcnQoMSAtICh0ID0gdCAvIGQgLSAxKSAqIHQpICsgYjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBOYU47XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgRWFzaW5nLmVhc2VJbk91dENpcmMgPSBmdW5jdGlvbiBlYXNlSW5PdXRDaXJjKHQsIGIsIGMsIGQpIHtcbiAgICAgICAgaWYgKEVhc2luZy5pc1ZhbGlkUGFyYW1zKHQsIGIsIGMsIGQpKSB7XG4gICAgICAgICAgICBpZiAoKHQgLz0gZCAvIDIpIDwgMSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAtYyAvIDIgKiAoTWF0aC5zcXJ0KDEgLSB0ICogdCkgLSAxKSArIGI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYyAvIDIgKiAoTWF0aC5zcXJ0KDEgLSAodCAtPSAyKSAqIHQpICsgMSkgKyBiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIE5hTjtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBFYXNpbmcuZWFzZUluRWxhc3RpYyA9IGZ1bmN0aW9uIGVhc2VJbkVsYXN0aWModCwgYiwgYywgZCkge1xuICAgICAgICBpZiAoRWFzaW5nLmlzVmFsaWRQYXJhbXModCwgYiwgYywgZCkpIHtcbiAgICAgICAgICAgIHZhciBzID0gMS43MDE1ODtcbiAgICAgICAgICAgIHZhciBwID0gMDtcbiAgICAgICAgICAgIHZhciBhID0gYztcbiAgICAgICAgICAgIGlmICh0ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoKHQgLz0gZCkgPT09IDEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYiArIGM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIXApIHtcbiAgICAgICAgICAgICAgICBwID0gZCAqIC4zO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGEgPCBNYXRoLmFicyhjKSkge1xuICAgICAgICAgICAgICAgIGEgPSBjO1xuICAgICAgICAgICAgICAgIHMgPSBwIC8gNDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcyA9IHAgLyAoMiAqIE1hdGguUEkpICogTWF0aC5hc2luKGMgLyBhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAtKGEgKiBNYXRoLnBvdygyLCAxMCAqICh0IC09IDEpKSAqIE1hdGguc2luKCh0ICogZCAtIHMpICogKDIgKiBNYXRoLlBJKSAvIHApKSArIGI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gTmFOO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIEVhc2luZy5lYXNlT3V0RWxhc3RpYyA9IGZ1bmN0aW9uIGVhc2VPdXRFbGFzdGljKHQsIGIsIGMsIGQpIHtcbiAgICAgICAgaWYgKEVhc2luZy5pc1ZhbGlkUGFyYW1zKHQsIGIsIGMsIGQpKSB7XG4gICAgICAgICAgICB2YXIgcyA9IDEuNzAxNTg7XG4gICAgICAgICAgICB2YXIgcCA9IDA7XG4gICAgICAgICAgICB2YXIgYSA9IGM7XG4gICAgICAgICAgICBpZiAodCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCh0IC89IGQpID09PSAxKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGIgKyBjO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFwKSB7XG4gICAgICAgICAgICAgICAgcCA9IGQgKiAuMztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChhIDwgTWF0aC5hYnMoYykpIHtcbiAgICAgICAgICAgICAgICBhID0gYztcbiAgICAgICAgICAgICAgICBzID0gcCAvIDQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHMgPSBwIC8gKDIgKiBNYXRoLlBJKSAqIE1hdGguYXNpbihjIC8gYSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYSAqIE1hdGgucG93KDIsIC0xMCAqIHQpICogTWF0aC5zaW4oKHQgKiBkIC0gcykgKiAoMiAqIE1hdGguUEkpIC8gcCkgKyBjICsgYjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBOYU47XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgRWFzaW5nLmVhc2VJbk91dEVsYXN0aWMgPSBmdW5jdGlvbiBlYXNlSW5PdXRFbGFzdGljKHQsIGIsIGMsIGQpIHtcbiAgICAgICAgaWYgKEVhc2luZy5pc1ZhbGlkUGFyYW1zKHQsIGIsIGMsIGQpKSB7XG4gICAgICAgICAgICB2YXIgcyA9IDEuNzAxNTg7XG4gICAgICAgICAgICB2YXIgcCA9IDA7XG4gICAgICAgICAgICB2YXIgYSA9IGM7XG4gICAgICAgICAgICBpZiAodCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCh0IC89IGQgLyAyKSA9PT0gMikge1xuICAgICAgICAgICAgICAgIHJldHVybiBiICsgYztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghcCkge1xuICAgICAgICAgICAgICAgIHAgPSBkICogKC4zICogMS41KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChhIDwgTWF0aC5hYnMoYykpIHtcbiAgICAgICAgICAgICAgICBhID0gYztcbiAgICAgICAgICAgICAgICBzID0gcCAvIDQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHMgPSBwIC8gKDIgKiBNYXRoLlBJKSAqIE1hdGguYXNpbihjIC8gYSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodCA8IDEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gLS41ICogKGEgKiBNYXRoLnBvdygyLCAxMCAqICh0IC09IDEpKSAqIE1hdGguc2luKCh0ICogZCAtIHMpICogKDIgKiBNYXRoLlBJKSAvIHApKSArIGI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYSAqIE1hdGgucG93KDIsIC0xMCAqICh0IC09IDEpKSAqIE1hdGguc2luKCh0ICogZCAtIHMpICogKDIgKiBNYXRoLlBJKSAvIHApICogLjUgKyBjICsgYjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBOYU47XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgRWFzaW5nLmVhc2VJbkJhY2sgPSBmdW5jdGlvbiBlYXNlSW5CYWNrKHQsIGIsIGMsIGQsIHMpIHtcbiAgICAgICAgaWYgKEVhc2luZy5pc1ZhbGlkUGFyYW1zKHQsIGIsIGMsIGQsIHMpKSB7XG4gICAgICAgICAgICBpZiAocyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgcyA9IDEuNzAxNTg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYyAqICh0IC89IGQpICogdCAqICgocyArIDEpICogdCAtIHMpICsgYjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBOYU47XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgRWFzaW5nLmVhc2VPdXRCYWNrID0gZnVuY3Rpb24gZWFzZU91dEJhY2sodCwgYiwgYywgZCwgcykge1xuICAgICAgICBpZiAoRWFzaW5nLmlzVmFsaWRQYXJhbXModCwgYiwgYywgZCwgcykpIHtcbiAgICAgICAgICAgIGlmIChzID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBzID0gMS43MDE1ODtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBjICogKCh0ID0gdCAvIGQgLSAxKSAqIHQgKiAoKHMgKyAxKSAqIHQgKyBzKSArIDEpICsgYjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBOYU47XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgRWFzaW5nLmVhc2VJbk91dEJhY2sgPSBmdW5jdGlvbiBlYXNlSW5PdXRCYWNrKHQsIGIsIGMsIGQsIHMpIHtcbiAgICAgICAgaWYgKEVhc2luZy5pc1ZhbGlkUGFyYW1zKHQsIGIsIGMsIGQsIHMpKSB7XG4gICAgICAgICAgICBpZiAocyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgcyA9IDEuNzAxNTg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoKHQgLz0gZCAvIDIpIDwgMSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjIC8gMiAqICh0ICogdCAqICgoKHMgKj0gMS41MjUpICsgMSkgKiB0IC0gcykpICsgYjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBjIC8gMiAqICgodCAtPSAyKSAqIHQgKiAoKChzICo9IDEuNTI1KSArIDEpICogdCArIHMpICsgMikgKyBiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIE5hTjtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBFYXNpbmcuZWFzZUluQm91bmNlID0gZnVuY3Rpb24gZWFzZUluQm91bmNlKHQsIGIsIGMsIGQpIHtcbiAgICAgICAgaWYgKEVhc2luZy5pc1ZhbGlkUGFyYW1zKHQsIGIsIGMsIGQpKSB7XG4gICAgICAgICAgICByZXR1cm4gYyAtIEVhc2luZy5lYXNlT3V0Qm91bmNlKGQgLSB0LCAwLCBjLCBkKSArIGI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gTmFOO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIEVhc2luZy5lYXNlT3V0Qm91bmNlID0gZnVuY3Rpb24gZWFzZU91dEJvdW5jZSh0LCBiLCBjLCBkKSB7XG4gICAgICAgIGlmIChFYXNpbmcuaXNWYWxpZFBhcmFtcyh0LCBiLCBjLCBkKSkge1xuICAgICAgICAgICAgaWYgKCh0IC89IGQpIDwgMSAvIDIuNzUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYyAqICg3LjU2MjUgKiB0ICogdCkgKyBiO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0IDwgMiAvIDIuNzUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYyAqICg3LjU2MjUgKiAodCAtPSAxLjUgLyAyLjc1KSAqIHQgKyAuNzUpICsgYjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodCA8IDIuNSAvIDIuNzUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYyAqICg3LjU2MjUgKiAodCAtPSAyLjI1IC8gMi43NSkgKiB0ICsgLjkzNzUpICsgYjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGMgKiAoNy41NjI1ICogKHQgLT0gMi42MjUgLyAyLjc1KSAqIHQgKyAuOTg0Mzc1KSArIGI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gTmFOO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIEVhc2luZy5lYXNlSW5PdXRCb3VuY2UgPSBmdW5jdGlvbiBlYXNlSW5PdXRCb3VuY2UodCwgYiwgYywgZCkge1xuICAgICAgICBpZiAoRWFzaW5nLmlzVmFsaWRQYXJhbXModCwgYiwgYywgZCkpIHtcbiAgICAgICAgICAgIGlmICh0IDwgZCAvIDIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gRWFzaW5nLmVhc2VJbkJvdW5jZSh0ICogMiwgMCwgYywgZCkgKiAuNSArIGI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gRWFzaW5nLmVhc2VPdXRCb3VuY2UodCAqIDIgLSBkLCAwLCBjLCBkKSAqIC41ICsgYyAqIC41ICsgYjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBOYU47XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIEVhc2luZztcbn0oKTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gRWFzaW5nO1xuXG5FYXNpbmcuZGVmID0gXCJlYXNlT3V0UXVhZFwiO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9VdGlscy9saWIvVXRpbHNBbmltYXRpb25FYXNpbmcudHNcbi8vIG1vZHVsZSBpZCA9IDEzXG4vLyBtb2R1bGUgY2h1bmtzID0gMSAyIDMiLCJcInVzZSBzdHJpY3RcIjtcbi8qKlxuICogQ2xhc3MgZm9yIHdvcmtpbmcgd2l0aCBicm93c2VyXG4gKi9cblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxudmFyIEJyb3dzZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQnJvd3NlcigpIHtcbiAgICAgICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIEJyb3dzZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCBicm93c2VyIGluZm9cbiAgICAgKiBAcmV0dXJuIHt7YnJvd3Nlcjogc3RyaW5nLCBtb2JpbGU6IGJvb2xlYW4sIHZlcnNpb246IHN0cmluZ319XG4gICAgICovXG4gICAgQnJvd3Nlci5nZXRJbmZvID0gZnVuY3Rpb24gZ2V0SW5mbygpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGJyb3dzZXI6IEJyb3dzZXIuZ2V0TmFtZSgpLFxuICAgICAgICAgICAgbW9iaWxlOiBCcm93c2VyLmlzTW9iaWxlKCksXG4gICAgICAgICAgICB2ZXJzaW9uOiBCcm93c2VyLmdldFZlcnNpb24oKVxuICAgICAgICB9O1xuICAgIH07XG4gICAgLyoqXG4gICAgICogR2V0IGJyb3dzZXIgbmFtZVxuICAgICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICAgKi9cblxuXG4gICAgQnJvd3Nlci5nZXROYW1lID0gZnVuY3Rpb24gZ2V0TmFtZSgpIHtcbiAgICAgICAgdmFyIGJyb3dzZXIgPSB2b2lkIDA7XG4gICAgICAgIGlmIChCcm93c2VyLmlzT3BlcmEoKSkge1xuICAgICAgICAgICAgYnJvd3NlciA9IFwiT3BlcmFcIjtcbiAgICAgICAgfSBlbHNlIGlmIChCcm93c2VyLmlzT3BlcmFOZXcoKSkge1xuICAgICAgICAgICAgYnJvd3NlciA9IFwiT3BlcmFcIjtcbiAgICAgICAgfSBlbHNlIGlmIChCcm93c2VyLmlzTVNJRSgpKSB7XG4gICAgICAgICAgICBicm93c2VyID0gXCJNaWNyb3NvZnQgSW50ZXJuZXQgRXhwbG9yZXJcIjtcbiAgICAgICAgfSBlbHNlIGlmIChCcm93c2VyLmlzTVNJRU5ldygpKSB7XG4gICAgICAgICAgICBicm93c2VyID0gXCJNaWNyb3NvZnQgSW50ZXJuZXQgRXhwbG9yZXJcIjtcbiAgICAgICAgfSBlbHNlIGlmIChCcm93c2VyLmlzQ2hyb21lKCkpIHtcbiAgICAgICAgICAgIGJyb3dzZXIgPSBcIkNocm9tZVwiO1xuICAgICAgICB9IGVsc2UgaWYgKEJyb3dzZXIuaXNGaXJlZm94KCkpIHtcbiAgICAgICAgICAgIGJyb3dzZXIgPSBcIkZpcmVmb3hcIjtcbiAgICAgICAgfSBlbHNlIGlmIChCcm93c2VyLmlzU2FmYXJpKCkpIHtcbiAgICAgICAgICAgIGJyb3dzZXIgPSBcIlNhZmFyaVwiO1xuICAgICAgICB9IGVsc2UgaWYgKEJyb3dzZXIuaXNPdGhlcigpKSB7XG4gICAgICAgICAgICBicm93c2VyID0gQnJvd3Nlci5nZXRPdGhlck5hbWUoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYnJvd3NlcjtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEdldCBicm93c2VyIHZlcnNpb25cbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAgICovXG5cblxuICAgIEJyb3dzZXIuZ2V0VmVyc2lvbiA9IGZ1bmN0aW9uIGdldFZlcnNpb24oKSB7XG4gICAgICAgIHZhciB2ZXJzaW9uID0gdm9pZCAwO1xuICAgICAgICBpZiAoQnJvd3Nlci5pc09wZXJhKCkpIHtcbiAgICAgICAgICAgIHZlcnNpb24gPSBCcm93c2VyLmdldE9wZXJhVmVyc2lvbigpO1xuICAgICAgICB9IGVsc2UgaWYgKEJyb3dzZXIuaXNPcGVyYU5ldygpKSB7XG4gICAgICAgICAgICB2ZXJzaW9uID0gQnJvd3Nlci5nZXRPcGVyYU5ld1ZlcnNpb24oKTtcbiAgICAgICAgfSBlbHNlIGlmIChCcm93c2VyLmlzTVNJRSgpKSB7XG4gICAgICAgICAgICB2ZXJzaW9uID0gQnJvd3Nlci5nZXRNU0lFVmVyc2lvbigpO1xuICAgICAgICB9IGVsc2UgaWYgKEJyb3dzZXIuaXNNU0lFTmV3KCkpIHtcbiAgICAgICAgICAgIHZlcnNpb24gPSBCcm93c2VyLmdldE1TSUVOZXdWZXJzaW9uKCk7XG4gICAgICAgIH0gZWxzZSBpZiAoQnJvd3Nlci5pc0Nocm9tZSgpKSB7XG4gICAgICAgICAgICB2ZXJzaW9uID0gQnJvd3Nlci5nZXRDaHJvbWVWZXJzaW9uKCk7XG4gICAgICAgIH0gZWxzZSBpZiAoQnJvd3Nlci5pc0ZpcmVmb3goKSkge1xuICAgICAgICAgICAgdmVyc2lvbiA9IEJyb3dzZXIuZ2V0RmlyZWZveFZlcnNpb24oKTtcbiAgICAgICAgfSBlbHNlIGlmIChCcm93c2VyLmlzU2FmYXJpKCkpIHtcbiAgICAgICAgICAgIHZlcnNpb24gPSBCcm93c2VyLmdldFNhZmFyaVZlcnNpb24oKTtcbiAgICAgICAgfSBlbHNlIGlmIChCcm93c2VyLmlzT3RoZXIoKSkge1xuICAgICAgICAgICAgdmVyc2lvbiA9IEJyb3dzZXIuZ2V0T3RoZXJWZXJzaW9uKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZlcnNpb247XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBUcmltIGJyb3dzZXIgdmVyc2lvblxuICAgICAqIEBwYXJhbSB2ZXJzaW9uXG4gICAgICogQHJldHVybiB7c3RyaW5nfVxuICAgICAqL1xuXG5cbiAgICBCcm93c2VyLnRyaW1WZXJzaW9uID0gZnVuY3Rpb24gdHJpbVZlcnNpb24odmVyc2lvbikge1xuICAgICAgICBpZiAodHlwZW9mIHZlcnNpb24gPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIHZhciBjaGFycyA9IFtcIjtcIiwgXCIgXCIsIFwiKVwiXTtcbiAgICAgICAgICAgIGZvciAodmFyIF9pdGVyYXRvciA9IGNoYXJzLCBfaXNBcnJheSA9IEFycmF5LmlzQXJyYXkoX2l0ZXJhdG9yKSwgX2kgPSAwLCBfaXRlcmF0b3IgPSBfaXNBcnJheSA/IF9pdGVyYXRvciA6IF9pdGVyYXRvcltTeW1ib2wuaXRlcmF0b3JdKCk7Oykge1xuICAgICAgICAgICAgICAgIHZhciBfcmVmO1xuXG4gICAgICAgICAgICAgICAgaWYgKF9pc0FycmF5KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChfaSA+PSBfaXRlcmF0b3IubGVuZ3RoKSBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgX3JlZiA9IF9pdGVyYXRvcltfaSsrXTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBfaSA9IF9pdGVyYXRvci5uZXh0KCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChfaS5kb25lKSBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgX3JlZiA9IF9pLnZhbHVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciBjaGFyID0gX3JlZjtcblxuICAgICAgICAgICAgICAgIHZhciBpeCA9IHZlcnNpb24uaW5kZXhPZihjaGFyKTtcbiAgICAgICAgICAgICAgICBpZiAoaXggIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIHZlcnNpb24gPSB2ZXJzaW9uLnN1YnN0cmluZygwLCBpeCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHZlcnNpb247XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgICAgfVxuICAgIH07XG4gICAgLyoqXG4gICAgICogQ2hlY2sgaWYgaXQgaXMgbW9iaWxlXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICAgKi9cblxuXG4gICAgQnJvd3Nlci5pc01vYmlsZSA9IGZ1bmN0aW9uIGlzTW9iaWxlKCkge1xuICAgICAgICByZXR1cm4gKC9Nb2JpbGV8bWluaXxGZW5uZWN8QW5kcm9pZHxpUChhZHxvZHxob25lKS8udGVzdChuYXZpZ2F0b3IuYXBwVmVyc2lvbilcbiAgICAgICAgKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIENoZWNrIGlmIGl0IGlzIG9wZXJhIGJyb3dzZXJcbiAgICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgICAqL1xuXG5cbiAgICBCcm93c2VyLmlzT3BlcmEgPSBmdW5jdGlvbiBpc09wZXJhKCkge1xuICAgICAgICByZXR1cm4gbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKFwiT3BlcmFcIikgIT09IC0xO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogR2V0IG9wZXJhIGJyb3dzZXIgdmVyc2lvblxuICAgICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICAgKi9cblxuXG4gICAgQnJvd3Nlci5nZXRPcGVyYVZlcnNpb24gPSBmdW5jdGlvbiBnZXRPcGVyYVZlcnNpb24oKSB7XG4gICAgICAgIHZhciB2ZXJPZmZzZXQgPSBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJPcGVyYVwiKTtcbiAgICAgICAgdmFyIHZlcnNpb24gPSBuYXZpZ2F0b3IudXNlckFnZW50LnN1YnN0cmluZyh2ZXJPZmZzZXQgKyA2KTtcbiAgICAgICAgdmVyT2Zmc2V0ID0gbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKFwiVmVyc2lvblwiKTtcbiAgICAgICAgaWYgKHZlck9mZnNldCAhPT0gLTEpIHtcbiAgICAgICAgICAgIHZlcnNpb24gPSBuYXZpZ2F0b3IudXNlckFnZW50LnN1YnN0cmluZyh2ZXJPZmZzZXQgKyA4KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gQnJvd3Nlci50cmltVmVyc2lvbih2ZXJzaW9uKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIENoZWNrIGlmIGl0IGlzIG9wZXJhIG5ldyBicm93c2VyXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICAgKi9cblxuXG4gICAgQnJvd3Nlci5pc09wZXJhTmV3ID0gZnVuY3Rpb24gaXNPcGVyYU5ldygpIHtcbiAgICAgICAgcmV0dXJuIG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIk9QUlwiKSAhPT0gLTE7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBHZXQgb3BlcmEgbmV3IGJyb3dzZXIgdmVyc2lvblxuICAgICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICAgKi9cblxuXG4gICAgQnJvd3Nlci5nZXRPcGVyYU5ld1ZlcnNpb24gPSBmdW5jdGlvbiBnZXRPcGVyYU5ld1ZlcnNpb24oKSB7XG4gICAgICAgIHZhciB2ZXJPZmZzZXQgPSBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJPUFJcIik7XG4gICAgICAgIHZhciB2ZXJzaW9uID0gbmF2aWdhdG9yLnVzZXJBZ2VudC5zdWJzdHJpbmcodmVyT2Zmc2V0ICsgNCk7XG4gICAgICAgIHJldHVybiBCcm93c2VyLnRyaW1WZXJzaW9uKHZlcnNpb24pO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogQ2hlY2sgaWYgaXQgaXMgbXNpZSBicm93c2VyXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICAgKi9cblxuXG4gICAgQnJvd3Nlci5pc01TSUUgPSBmdW5jdGlvbiBpc01TSUUoKSB7XG4gICAgICAgIHJldHVybiBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJNU0lFXCIpICE9PSAtMTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEdldCBtc2llIGJyb3dzZXIgdmVyc2lvblxuICAgICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICAgKi9cblxuXG4gICAgQnJvd3Nlci5nZXRNU0lFVmVyc2lvbiA9IGZ1bmN0aW9uIGdldE1TSUVWZXJzaW9uKCkge1xuICAgICAgICB2YXIgdmVyT2Zmc2V0ID0gbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKFwiTVNJRVwiKTtcbiAgICAgICAgdmFyIHZlcnNpb24gPSBuYXZpZ2F0b3IudXNlckFnZW50LnN1YnN0cmluZyh2ZXJPZmZzZXQgKyA1KTtcbiAgICAgICAgcmV0dXJuIEJyb3dzZXIudHJpbVZlcnNpb24odmVyc2lvbik7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBDaGVjayBpZiBpdCBpcyBtc2llIG5ldyBicm93c2VyXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICAgKi9cblxuXG4gICAgQnJvd3Nlci5pc01TSUVOZXcgPSBmdW5jdGlvbiBpc01TSUVOZXcoKSB7XG4gICAgICAgIHJldHVybiBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJUcmlkZW50L1wiKSAhPT0gLTE7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBHZXQgbXNpZSBuZXcgYnJvd3NlciB2ZXJzaW9uXG4gICAgICogQHJldHVybiB7c3RyaW5nfVxuICAgICAqL1xuXG5cbiAgICBCcm93c2VyLmdldE1TSUVOZXdWZXJzaW9uID0gZnVuY3Rpb24gZ2V0TVNJRU5ld1ZlcnNpb24oKSB7XG4gICAgICAgIHZhciB2ZXJzaW9uID0gbmF2aWdhdG9yLnVzZXJBZ2VudC5zdWJzdHJpbmcobmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKFwicnY6XCIpICsgMyk7XG4gICAgICAgIHJldHVybiBCcm93c2VyLnRyaW1WZXJzaW9uKHZlcnNpb24pO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogQ2hlY2sgaWYgaXQgaXMgY2hyb21lIGJyb3dzZXJcbiAgICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgICAqL1xuXG5cbiAgICBCcm93c2VyLmlzQ2hyb21lID0gZnVuY3Rpb24gaXNDaHJvbWUoKSB7XG4gICAgICAgIHJldHVybiBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJDaHJvbWVcIikgIT09IC0xO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogR2V0IGNocm9tZSBicm93c2VyIHZlcnNpb25cbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAgICovXG5cblxuICAgIEJyb3dzZXIuZ2V0Q2hyb21lVmVyc2lvbiA9IGZ1bmN0aW9uIGdldENocm9tZVZlcnNpb24oKSB7XG4gICAgICAgIHZhciB2ZXJPZmZzZXQgPSBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJDaHJvbWVcIik7XG4gICAgICAgIHZhciB2ZXJzaW9uID0gbmF2aWdhdG9yLnVzZXJBZ2VudC5zdWJzdHJpbmcodmVyT2Zmc2V0ICsgNyk7XG4gICAgICAgIHJldHVybiBCcm93c2VyLnRyaW1WZXJzaW9uKHZlcnNpb24pO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogQ2hlY2sgaWYgaXQgaXMgc2FmYXJpIGJyb3dzZXJcbiAgICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgICAqL1xuXG5cbiAgICBCcm93c2VyLmlzU2FmYXJpID0gZnVuY3Rpb24gaXNTYWZhcmkoKSB7XG4gICAgICAgIHJldHVybiBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJTYWZhcmlcIikgIT09IC0xICYmIG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIkNocm9tZVwiKSA9PT0gLTE7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBHZXQgc2FmYXJpIGJyb3dzZXIgdmVyc2lvblxuICAgICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICAgKi9cblxuXG4gICAgQnJvd3Nlci5nZXRTYWZhcmlWZXJzaW9uID0gZnVuY3Rpb24gZ2V0U2FmYXJpVmVyc2lvbigpIHtcbiAgICAgICAgdmFyIHZlck9mZnNldCA9IG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIlNhZmFyaVwiKTtcbiAgICAgICAgdmFyIHZlcnNpb24gPSBuYXZpZ2F0b3IudXNlckFnZW50LnN1YnN0cmluZyh2ZXJPZmZzZXQgKyA3KTtcbiAgICAgICAgdmVyT2Zmc2V0ID0gbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKFwiVmVyc2lvblwiKTtcbiAgICAgICAgaWYgKHZlck9mZnNldCAhPT0gLTEpIHtcbiAgICAgICAgICAgIHZlcnNpb24gPSBuYXZpZ2F0b3IudXNlckFnZW50LnN1YnN0cmluZyh2ZXJPZmZzZXQgKyA4KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gQnJvd3Nlci50cmltVmVyc2lvbih2ZXJzaW9uKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIENoZWNrIGlmIGl0IGlzIGZpcmVmb3ggYnJvd3NlclxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAgICovXG5cblxuICAgIEJyb3dzZXIuaXNGaXJlZm94ID0gZnVuY3Rpb24gaXNGaXJlZm94KCkge1xuICAgICAgICByZXR1cm4gbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKFwiRmlyZWZveFwiKSAhPT0gLTE7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBHZXQgZmlyZWZveCBicm93c2VyIHZlcnNpb25cbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAgICovXG5cblxuICAgIEJyb3dzZXIuZ2V0RmlyZWZveFZlcnNpb24gPSBmdW5jdGlvbiBnZXRGaXJlZm94VmVyc2lvbigpIHtcbiAgICAgICAgdmFyIHZlck9mZnNldCA9IG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIkZpcmVmb3hcIik7XG4gICAgICAgIHZhciB2ZXJzaW9uID0gbmF2aWdhdG9yLnVzZXJBZ2VudC5zdWJzdHJpbmcodmVyT2Zmc2V0ICsgOCk7XG4gICAgICAgIHJldHVybiBCcm93c2VyLnRyaW1WZXJzaW9uKHZlcnNpb24pO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogQ2hlY2sgaWYgaXQgaXMgb3RoZXIgYnJvd3NlclxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAgICovXG5cblxuICAgIEJyb3dzZXIuaXNPdGhlciA9IGZ1bmN0aW9uIGlzT3RoZXIoKSB7XG4gICAgICAgIHZhciBuYW1lT2Zmc2V0ID0gbmF2aWdhdG9yLnVzZXJBZ2VudC5sYXN0SW5kZXhPZihcIiBcIikgKyAxO1xuICAgICAgICB2YXIgdmVyT2Zmc2V0ID0gbmF2aWdhdG9yLnVzZXJBZ2VudC5sYXN0SW5kZXhPZihcIi9cIik7XG4gICAgICAgIHJldHVybiBuYW1lT2Zmc2V0IDwgdmVyT2Zmc2V0O1xuICAgIH07XG4gICAgLyoqXG4gICAgICogR2V0IG90aGVyIGJyb3dzZXIgbmFtZVxuICAgICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICAgKi9cblxuXG4gICAgQnJvd3Nlci5nZXRPdGhlck5hbWUgPSBmdW5jdGlvbiBnZXRPdGhlck5hbWUoKSB7XG4gICAgICAgIHZhciBuYW1lT2Zmc2V0ID0gbmF2aWdhdG9yLnVzZXJBZ2VudC5sYXN0SW5kZXhPZihcIiBcIikgKyAxO1xuICAgICAgICB2YXIgdmVyT2Zmc2V0ID0gbmF2aWdhdG9yLnVzZXJBZ2VudC5sYXN0SW5kZXhPZihcIi9cIik7XG4gICAgICAgIHZhciBicm93c2VyID0gbmF2aWdhdG9yLnVzZXJBZ2VudC5zdWJzdHJpbmcobmFtZU9mZnNldCwgdmVyT2Zmc2V0KTtcbiAgICAgICAgaWYgKGJyb3dzZXIudG9Mb3dlckNhc2UoKSA9PT0gYnJvd3Nlci50b1VwcGVyQ2FzZSgpKSB7XG4gICAgICAgICAgICBicm93c2VyID0gbmF2aWdhdG9yLmFwcE5hbWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGJyb3dzZXI7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBHZXQgb3RoZXIgYnJvd3NlciB2ZXJzaW9uXG4gICAgICogQHJldHVybiB7c3RyaW5nfVxuICAgICAqL1xuXG5cbiAgICBCcm93c2VyLmdldE90aGVyVmVyc2lvbiA9IGZ1bmN0aW9uIGdldE90aGVyVmVyc2lvbigpIHtcbiAgICAgICAgdmFyIG5hbWVPZmZzZXQgPSBuYXZpZ2F0b3IudXNlckFnZW50Lmxhc3RJbmRleE9mKFwiIFwiKSArIDE7XG4gICAgICAgIHZhciB2ZXJPZmZzZXQgPSBuYXZpZ2F0b3IudXNlckFnZW50Lmxhc3RJbmRleE9mKFwiL1wiKTtcbiAgICAgICAgdmFyIHZlcnNpb24gPSBuYXZpZ2F0b3IudXNlckFnZW50LnN1YnN0cmluZyh2ZXJPZmZzZXQgKyAxKTtcbiAgICAgICAgcmV0dXJuIEJyb3dzZXIudHJpbVZlcnNpb24odmVyc2lvbik7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBDaGVjayBicm93c2VyIHN1cHBvcnRcbiAgICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgICAqL1xuXG5cbiAgICBCcm93c2VyLmlzU3VwcG9ydGVkID0gZnVuY3Rpb24gaXNTdXBwb3J0ZWQoKSB7XG4gICAgICAgIHJldHVybiAhQnJvd3Nlci5pc01TSUUoKSB8fCBwYXJzZUludChCcm93c2VyLmdldE1TSUVWZXJzaW9uKCksIDEwKSA+IDg7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBDaGVjayBpZiBpdCBpcyBXZWJLaXQgYnJvd3NlclxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAgICovXG5cblxuICAgIEJyb3dzZXIuaXNXZWJLaXQgPSBmdW5jdGlvbiBpc1dlYktpdCgpIHtcbiAgICAgICAgcmV0dXJuIG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIkFwcGxlV2ViS2l0L1wiKSAhPT0gLTE7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBDaGVjayBpZiBpdCBpcyBHZWNrbyBicm93c2VyXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICAgKi9cblxuXG4gICAgQnJvd3Nlci5pc0dlY2tvID0gZnVuY3Rpb24gaXNHZWNrbygpIHtcbiAgICAgICAgcmV0dXJuIG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIkdlY2tvXCIpID4gLTEgJiYgbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKFwiS0hUTUxcIikgPT09IC0xO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogQ2hlY2sgaWYgaXQgaXMgQW5kcm9pZCBicm93c2VyXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICAgKi9cblxuXG4gICAgQnJvd3Nlci5pc0FuZHJvaWQgPSBmdW5jdGlvbiBpc0FuZHJvaWQoKSB7XG4gICAgICAgIHJldHVybiBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJBbmRyb2lkXCIpID4gLTE7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBDaGVjayBpZiBpdCBpcyBMaW51eCBicm93c2VyXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICAgKi9cblxuXG4gICAgQnJvd3Nlci5pc0xpbnV4ID0gZnVuY3Rpb24gaXNMaW51eCgpIHtcbiAgICAgICAgcmV0dXJuIG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIkxpbnV4XCIpID4gLTE7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBDaGVjayBpZiBpdCBpcyBpUGFkIGJyb3dzZXJcbiAgICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgICAqL1xuXG5cbiAgICBCcm93c2VyLmlzVGFibGV0UEMgPSBmdW5jdGlvbiBpc1RhYmxldFBDKCkge1xuICAgICAgICByZXR1cm4gbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKFwiaVBhZFwiKSA+IC0xO1xuICAgIH07XG5cbiAgICByZXR1cm4gQnJvd3Nlcjtcbn0oKTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gQnJvd3NlcjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vVXRpbHMvbGliL1V0aWxzQnJvd3Nlci50c1xuLy8gbW9kdWxlIGlkID0gMTRcbi8vIG1vZHVsZSBjaHVua3MgPSAxIDIgMyIsIlwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX3R5cGVvZiA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiID8gZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfSA6IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbnZhciBVUkwgPSByZXF1aXJlKFwidXJsXCIpO1xuLyoqXG4gKiBDbGFzcyBmb3Igd29ya2luZyB3aXRoIGNvb2tpZVxuICovXG5cbnZhciBDb29raWUgPSBmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQ29va2llKCkge1xuICAgICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgQ29va2llKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbWV0aG9kIHJldHVybnMgdGhlIGZsYWcgd2hldGhlciBzdXBwb3J0ZWQgdGhpcyBzdG9yYWdlIHR5cGUgb3Igbm90XG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICovXG4gICAgQ29va2llLmlzU3VwcG9ydGVkID0gZnVuY3Rpb24gaXNTdXBwb3J0ZWQoKSB7XG4gICAgICAgIHJldHVybiAodHlwZW9mIGRvY3VtZW50ID09PSBcInVuZGVmaW5lZFwiID8gXCJ1bmRlZmluZWRcIiA6IF90eXBlb2YoZG9jdW1lbnQpKSA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgZG9jdW1lbnQuY29va2llID09PSBcInN0cmluZ1wiO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogVGhlIG1ldGhvZCBzZXRzIHRoZSB2YWx1ZSBhbmQgcmV0dXJucyB0cnVlIGlmIGl0IGhhcyBiZWVuIHNldFxuICAgICAqIEBwYXJhbSBjaGVja1N1cHBvcnQge2Jvb2xlYW59XG4gICAgICogQHBhcmFtIGtleSB7c3RyaW5nfVxuICAgICAqIEBwYXJhbSB2YWx1ZSB7c3RyaW5nfVxuICAgICAqIEBwYXJhbSBleHBpcmVzIHtudW1iZXJ9XG4gICAgICogQHBhcmFtIHBhdGgge3N0cmluZ31cbiAgICAgKiBAcGFyYW0gZG9tYWluIHtzdHJpbmd9XG4gICAgICogQHBhcmFtIHNlY3VyZSB7Ym9vbGVhbn1cbiAgICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgICAqL1xuXG5cbiAgICBDb29raWUuc2V0SXRlbSA9IGZ1bmN0aW9uIHNldEl0ZW0oKSB7XG4gICAgICAgIHZhciBjaGVja1N1cHBvcnQgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHRydWU7XG4gICAgICAgIHZhciBrZXkgPSBhcmd1bWVudHNbMV07XG4gICAgICAgIHZhciB2YWx1ZSA9IGFyZ3VtZW50c1syXTtcbiAgICAgICAgdmFyIGV4cGlyZXMgPSBhcmd1bWVudHMubGVuZ3RoID4gMyAmJiBhcmd1bWVudHNbM10gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1szXSA6IDMwO1xuICAgICAgICB2YXIgcGF0aCA9IGFyZ3VtZW50cy5sZW5ndGggPiA0ICYmIGFyZ3VtZW50c1s0XSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzRdIDogXCIvXCI7XG4gICAgICAgIHZhciBkb21haW4gPSBhcmd1bWVudHMubGVuZ3RoID4gNSAmJiBhcmd1bWVudHNbNV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1s1XSA6IGxvY2F0aW9uLmhvc3RuYW1lO1xuICAgICAgICB2YXIgc2VjdXJlID0gYXJndW1lbnRzLmxlbmd0aCA+IDYgJiYgYXJndW1lbnRzWzZdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbNl0gOiBsb2NhdGlvbi5wcm90b2NvbCA9PT0gXCJodHRwczpcIjtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBWYWxpZGF0ZSBpbnB1dCBkYXRhXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGlmICh0eXBlb2YgY2hlY2tTdXBwb3J0ID09PSBcImJvb2xlYW5cIiAmJiB0eXBlb2Yga2V5ID09PSBcInN0cmluZ1wiICYmIENvb2tpZS5yZWdWYWxpZEtleS50ZXN0KGtleSkgJiYgdHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiICYmICh2YWx1ZSA9PT0gXCJcIiB8fCBDb29raWUucmVnVmFsaWRLZXkudGVzdCh2YWx1ZSkpICYmIHR5cGVvZiBleHBpcmVzID09PSBcIm51bWJlclwiICYmIGV4cGlyZXMgPCAzNjUgJiYgdHlwZW9mIHBhdGggPT09IFwic3RyaW5nXCIgJiYgdHlwZW9mIGRvbWFpbiA9PT0gXCJzdHJpbmdcIiAmJiBkb21haW4uaW5kZXhPZihsb2NhdGlvbi5ob3N0bmFtZSkgIT09IC0xICYmIHR5cGVvZiBzZWN1cmUgPT09IFwiYm9vbGVhblwiICYmIHNlY3VyZSA9PT0gKGxvY2F0aW9uLnByb3RvY29sID09PSBcImh0dHBzOlwiKSkge1xuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIFZhbGlkYXRlIGlucHV0IGRhdGFcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICB2YXIgdSA9IFVSTC5wYXJzZShcImh0dHA6Ly9cIiArIGRvbWFpbiArIHBhdGgpO1xuICAgICAgICAgICAgICAgIGlmICh1Lmhvc3RuYW1lID09PSBkb21haW4gfHwgdS5wYXRoID09PSBwYXRoKSB7XG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBJZiB0aGF0IHN0b3JlIGlzIHN1cHBvcnRlZFxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFjaGVja1N1cHBvcnQgfHwgQ29va2llLmlzU3VwcG9ydGVkKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgICAgICogU2F2ZSBjb29raWVzIGZvciAzMCBkYXlzXG4gICAgICAgICAgICAgICAgICAgICAgICAgKiBAdHlwZSB7RGF0ZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZS5zZXRUaW1lKGRhdGUuZ2V0VGltZSgpICsgZXhwaXJlcyAqIDI0ICogNjAgKiA2MCAqIDEwMDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGV4cCA9IGRhdGUudG9VVENTdHJpbmcoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgICAgICogRW5jb2RlIHZhbHVlIGZvciBzdG9yZVxuICAgICAgICAgICAgICAgICAgICAgICAgICogQHR5cGUge3N0cmluZ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBlbmNvZGVVUklDb21wb25lbnQodmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAgICAgKiBXcml0aW5nIHZhbHVlIHRvIHRoZSBkb2N1bWVudCBjb29raWUgc3RvcmFnZVxuICAgICAgICAgICAgICAgICAgICAgICAgICogQHR5cGUge3N0cmluZ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuY29va2llID0ga2V5ICsgXCI9XCIgKyB2YWx1ZSArIChleHAgPyBcIjsgZXhwaXJlcz1cIiArIGV4cCA6IFwiXCIpICsgKHBhdGggPyBcIjsgcGF0aD1cIiArIHBhdGggOiBcIlwiKSArIChkb21haW4gPyBcIjsgZG9tYWluPVwiICsgZG9tYWluIDogXCJcIikgKyAoc2VjdXJlID8gXCI7IHNlY3VyZVwiIDogXCJcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICAgICAqIElmIGFsbCBvayByZXR1cm4gdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRJdGVtKGNoZWNrU3VwcG9ydCwga2V5KSA9PT0gZGVjb2RlVVJJQ29tcG9uZW50KHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgICAgICogSWYgY29va2llIGRvZXMgbm90IHN1cHBvcnRlZCByZXR1cm4gZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIElmIGlucHV0IGRhdGEgaXMgbm90IHZhbGlkXG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBJZiBpbnB1dCBkYXRhIGlzIG5vdCB2YWxpZFxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBJZiBzb21ldGhpbmcgZ29lcyB3cm9uZyByZXR1cm4gZmFsc2VcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBUaGUgbWV0aG9kIHJlYWRzIHRoZSB2YWx1ZSBhbmQgcmV0dXJucyBpdCBvciByZXR1cm5zIGZhbHNlIGlmIHRoZSB2YWx1ZSBkb2VzIG5vdCBleGlzdFxuICAgICAqIEBwYXJhbSBjaGVja1N1cHBvcnQge2Jvb2xlYW59XG4gICAgICogQHBhcmFtIGtleSB7c3RyaW5nfVxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd8Ym9vbGVhbn1cbiAgICAgKi9cblxuXG4gICAgQ29va2llLmdldEl0ZW0gPSBmdW5jdGlvbiBnZXRJdGVtKCkge1xuICAgICAgICB2YXIgY2hlY2tTdXBwb3J0ID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB0cnVlO1xuICAgICAgICB2YXIga2V5ID0gYXJndW1lbnRzWzFdO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIFZhbGlkYXRlIGlucHV0IGRhdGFcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBjaGVja1N1cHBvcnQgPT09IFwiYm9vbGVhblwiICYmIHR5cGVvZiBrZXkgPT09IFwic3RyaW5nXCIgJiYgQ29va2llLnJlZ1ZhbGlkS2V5LnRlc3Qoa2V5KSkge1xuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIElmIHRoYXQgc3RvcmUgaXMgc3VwcG9ydGVkXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgaWYgKCFjaGVja1N1cHBvcnQgfHwgQ29va2llLmlzU3VwcG9ydGVkKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIEdldCB0aGUgYXJyYXkgZnJvbSBkb2N1bWVudCBjb29raWUgc3BsaXQgYnkgO1xuICAgICAgICAgICAgICAgICAgICAgKiBAdHlwZSB7c3RyaW5nW119XG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICB2YXIgYXJyQ29va2llID0gZG9jdW1lbnQuY29va2llLnNwbGl0KFwiO1wiKTtcbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIEl0ZXJhdGUgdGhyb3VnaCB0aGUgY29va2llc1xuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgX2l0ZXJhdG9yID0gYXJyQ29va2llLCBfaXNBcnJheSA9IEFycmF5LmlzQXJyYXkoX2l0ZXJhdG9yKSwgX2kgPSAwLCBfaXRlcmF0b3IgPSBfaXNBcnJheSA/IF9pdGVyYXRvciA6IF9pdGVyYXRvcltTeW1ib2wuaXRlcmF0b3JdKCk7Oykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIF9yZWY7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChfaXNBcnJheSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChfaSA+PSBfaXRlcmF0b3IubGVuZ3RoKSBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfcmVmID0gX2l0ZXJhdG9yW19pKytdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfaSA9IF9pdGVyYXRvci5uZXh0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKF9pLmRvbmUpIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9yZWYgPSBfaS52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGkgPSBfcmVmO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICAgICAqIFRyaW0gYW5kIHNwbGl0IGVhY2ggY29va2llIGJ5ID0gZm9yIGtleSB2YWx1ZSBwYXJlXG4gICAgICAgICAgICAgICAgICAgICAgICAgKiBAdHlwZSB7c3RyaW5nW119XG4gICAgICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2ID0gaS50cmltKCkuc3BsaXQoXCI9XCIsIDIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAgICAgKiBJZiBpdCBpcyBjb3JyZWN0IGNvb2tpZSBrZXkgcmV0dXJuIHRoZSB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodlswXSA9PT0ga2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICogSWYgdGhlIHZhbHVlIHdhcyBmb3VuZCByZXR1cm4gdGhlIHZhbHVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudCh2WzFdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogSWYgdGhlIHZhbHVlIHdhcyBub3QgZm91bmQgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIElmIGNvb2tpZSBkb2VzIG5vdCBzdXBwb3J0ZWQgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBJZiBpbnB1dCBkYXRhIGlzIG5vdCB2YWxpZFxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBJZiBzb21ldGhpbmcgZ29lcyB3cm9uZyByZXR1cm4gZmFsc2VcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBUaGUgbWV0aG9kIHJlbW92ZXMgdGhlIHZhbHVlIGFuZCByZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgZG9lcyBub3QgZXhpc3RcbiAgICAgKiBAcGFyYW0gY2hlY2tTdXBwb3J0IHtib29sZWFufVxuICAgICAqIEBwYXJhbSBrZXkge3N0cmluZ31cbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKi9cblxuXG4gICAgQ29va2llLnJlbW92ZUl0ZW0gPSBmdW5jdGlvbiByZW1vdmVJdGVtKCkge1xuICAgICAgICB2YXIgY2hlY2tTdXBwb3J0ID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB0cnVlO1xuICAgICAgICB2YXIga2V5ID0gYXJndW1lbnRzWzFdO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIFZhbGlkYXRlIGlucHV0IGRhdGFcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBjaGVja1N1cHBvcnQgPT09IFwiYm9vbGVhblwiICYmIHR5cGVvZiBrZXkgPT09IFwic3RyaW5nXCIgJiYgQ29va2llLnJlZ1ZhbGlkS2V5LnRlc3Qoa2V5KSkge1xuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIElmIHRoYXQgc3RvcmUgaXMgc3VwcG9ydGVkXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgaWYgKCFjaGVja1N1cHBvcnQgfHwgQ29va2llLmlzU3VwcG9ydGVkKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIFNldCBlbXB0eSBvdmVyZHVlIHZhbHVlIGJ5IGtleVxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgQ29va2llLnNldEl0ZW0oY2hlY2tTdXBwb3J0LCBrZXksIFwiXCIsIC0xICogMjQgKiA2MCAqIDYwKTtcbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIElmIGFsbCBvayByZXR1cm4gdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIENvb2tpZS5nZXRJdGVtKGNoZWNrU3VwcG9ydCwga2V5KSA9PT0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIElmIGNvb2tpZSBkb2VzIG5vdCBzdXBwb3J0ZWQgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBJZiBpbnB1dCBkYXRhIGlzIG5vdCB2YWxpZFxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBJZiBzb21ldGhpbmcgZ29lcyB3cm9uZyByZXR1cm4gZmFsc2VcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBUaGUgbWV0aG9kIHJldHVybnMgdGhlIGFycmF5IG9mIHN0cmluZyBvZiBhdmFpbGFibGUga2V5c1xuICAgICAqIEBwYXJhbSBjaGVja1N1cHBvcnQge2Jvb2xlYW59XG4gICAgICogQHJldHVybnMge3N0cmluZ1tdfVxuICAgICAqL1xuXG5cbiAgICBDb29raWUuZ2V0S2V5cyA9IGZ1bmN0aW9uIGdldEtleXMoKSB7XG4gICAgICAgIHZhciBjaGVja1N1cHBvcnQgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHRydWU7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogVmFsaWRhdGUgaW5wdXQgZGF0YVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBpZiAodHlwZW9mIGNoZWNrU3VwcG9ydCA9PT0gXCJib29sZWFuXCIpIHtcbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBJZiB0aGF0IHN0b3JlIGlzIHN1cHBvcnRlZFxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGlmICghY2hlY2tTdXBwb3J0IHx8IENvb2tpZS5pc1N1cHBvcnRlZCgpKSB7XG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBUaGUgYXJyYXkgb2YgYXZhaWxhYmxlIGtleXNcbiAgICAgICAgICAgICAgICAgICAgICogQHR5cGUge0FycmF5fVxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgdmFyIGFycktleXMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIEdldCB0aGUgYXJyYXkgZnJvbSBkb2N1bWVudCBjb29raWUgc3BsaXQgYnkgO1xuICAgICAgICAgICAgICAgICAgICAgKiBAdHlwZSB7c3RyaW5nW119XG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICB2YXIgYXJyQ29va2llID0gZG9jdW1lbnQuY29va2llLnNwbGl0KFwiO1wiKTtcbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIEl0ZXJhdGUgdGhyb3VnaCB0aGUgY29va2llc1xuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgX2l0ZXJhdG9yMiA9IGFyckNvb2tpZSwgX2lzQXJyYXkyID0gQXJyYXkuaXNBcnJheShfaXRlcmF0b3IyKSwgX2kyID0gMCwgX2l0ZXJhdG9yMiA9IF9pc0FycmF5MiA/IF9pdGVyYXRvcjIgOiBfaXRlcmF0b3IyW1N5bWJvbC5pdGVyYXRvcl0oKTs7KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgX3JlZjI7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChfaXNBcnJheTIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoX2kyID49IF9pdGVyYXRvcjIubGVuZ3RoKSBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfcmVmMiA9IF9pdGVyYXRvcjJbX2kyKytdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfaTIgPSBfaXRlcmF0b3IyLm5leHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoX2kyLmRvbmUpIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9yZWYyID0gX2kyLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaSA9IF9yZWYyO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICAgICAqIFRyaW0gYW5kIHNwbGl0IGVhY2ggY29va2llIGJ5ID0gZm9yIGtleSB2YWx1ZSBwYXJlXG4gICAgICAgICAgICAgICAgICAgICAgICAgKiBAdHlwZSB7c3RyaW5nW119XG4gICAgICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2ID0gaS50cmltKCkuc3BsaXQoXCI9XCIsIDIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAgICAgKiBBZGQga2V5IHRvIHRoZSBsaXN0XG4gICAgICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2WzBdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJyS2V5cy5wdXNoKHZbMF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhcnJLZXlzO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBJZiBjb29raWUgZG9lcyBub3Qgc3VwcG9ydGVkIHJldHVybiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogSWYgaW5wdXQgZGF0YSBpcyBub3QgdmFsaWRcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogSWYgc29tZXRoaW5nIGdvZXMgd3JvbmcgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgLyoqXG4gICAgICogVGhlIG1ldGhvZCBjbGVhbnMgdGhlIHN0b3JhZ2UgYW5kIHJldHVybiB0cnVlIGlmIGl0IGlzIGVtcHR5XG4gICAgICogQHBhcmFtIGNoZWNrU3VwcG9ydCB7Ym9vbGVhbn1cbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKi9cblxuXG4gICAgQ29va2llLmNsZWFyID0gZnVuY3Rpb24gY2xlYXIoKSB7XG4gICAgICAgIHZhciBjaGVja1N1cHBvcnQgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHRydWU7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogVmFsaWRhdGUgaW5wdXQgZGF0YVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBpZiAodHlwZW9mIGNoZWNrU3VwcG9ydCA9PT0gXCJib29sZWFuXCIpIHtcbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBJZiB0aGF0IHN0b3JlIGlzIHN1cHBvcnRlZFxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGlmICghY2hlY2tTdXBwb3J0IHx8IENvb2tpZS5pc1N1cHBvcnRlZCgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhcnJLZXlzID0gQ29va2llLmdldEtleXMoY2hlY2tTdXBwb3J0KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFycktleXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIF9pdGVyYXRvcjMgPSBhcnJLZXlzLCBfaXNBcnJheTMgPSBBcnJheS5pc0FycmF5KF9pdGVyYXRvcjMpLCBfaTMgPSAwLCBfaXRlcmF0b3IzID0gX2lzQXJyYXkzID8gX2l0ZXJhdG9yMyA6IF9pdGVyYXRvcjNbU3ltYm9sLml0ZXJhdG9yXSgpOzspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgX3JlZjM7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoX2lzQXJyYXkzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChfaTMgPj0gX2l0ZXJhdG9yMy5sZW5ndGgpIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfcmVmMyA9IF9pdGVyYXRvcjNbX2kzKytdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9pMyA9IF9pdGVyYXRvcjMubmV4dCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoX2kzLmRvbmUpIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfcmVmMyA9IF9pMy52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgaSA9IF9yZWYzO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQ29va2llLnJlbW92ZUl0ZW0oY2hlY2tTdXBwb3J0LCBpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogSWYgYWxsIG9rIHJldHVybiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gQ29va2llLmdldEtleXMoY2hlY2tTdXBwb3J0KS5sZW5ndGggPT09IDA7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIElmIGNvb2tpZSBkb2VzIG5vdCBzdXBwb3J0ZWQgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIElmIGlucHV0IGRhdGEgaXMgbm90IHZhbGlkXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIElmIHNvbWV0aGluZyBnb2VzIHdyb25nIHJldHVybiBmYWxzZVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIENvb2tpZTtcbn0oKTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gQ29va2llO1xuXG5Db29raWUucmVnVmFsaWRLZXkgPSBuZXcgUmVnRXhwKFwiKFthLXpBLVowLTlfLV17MSx9KVwiLCBcImlcIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L1V0aWxzL2xpYi9VdGlsc0Nvb2tpZS50c1xuLy8gbW9kdWxlIGlkID0gMTVcbi8vIG1vZHVsZSBjaHVua3MgPSAxIDIgMyIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBwdW55Y29kZSA9IHJlcXVpcmUoJ3B1bnljb2RlJyk7XG52YXIgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xuXG5leHBvcnRzLnBhcnNlID0gdXJsUGFyc2U7XG5leHBvcnRzLnJlc29sdmUgPSB1cmxSZXNvbHZlO1xuZXhwb3J0cy5yZXNvbHZlT2JqZWN0ID0gdXJsUmVzb2x2ZU9iamVjdDtcbmV4cG9ydHMuZm9ybWF0ID0gdXJsRm9ybWF0O1xuXG5leHBvcnRzLlVybCA9IFVybDtcblxuZnVuY3Rpb24gVXJsKCkge1xuICB0aGlzLnByb3RvY29sID0gbnVsbDtcbiAgdGhpcy5zbGFzaGVzID0gbnVsbDtcbiAgdGhpcy5hdXRoID0gbnVsbDtcbiAgdGhpcy5ob3N0ID0gbnVsbDtcbiAgdGhpcy5wb3J0ID0gbnVsbDtcbiAgdGhpcy5ob3N0bmFtZSA9IG51bGw7XG4gIHRoaXMuaGFzaCA9IG51bGw7XG4gIHRoaXMuc2VhcmNoID0gbnVsbDtcbiAgdGhpcy5xdWVyeSA9IG51bGw7XG4gIHRoaXMucGF0aG5hbWUgPSBudWxsO1xuICB0aGlzLnBhdGggPSBudWxsO1xuICB0aGlzLmhyZWYgPSBudWxsO1xufVxuXG4vLyBSZWZlcmVuY2U6IFJGQyAzOTg2LCBSRkMgMTgwOCwgUkZDIDIzOTZcblxuLy8gZGVmaW5lIHRoZXNlIGhlcmUgc28gYXQgbGVhc3QgdGhleSBvbmx5IGhhdmUgdG8gYmVcbi8vIGNvbXBpbGVkIG9uY2Ugb24gdGhlIGZpcnN0IG1vZHVsZSBsb2FkLlxudmFyIHByb3RvY29sUGF0dGVybiA9IC9eKFthLXowLTkuKy1dKzopL2ksXG4gICAgcG9ydFBhdHRlcm4gPSAvOlswLTldKiQvLFxuXG4gICAgLy8gU3BlY2lhbCBjYXNlIGZvciBhIHNpbXBsZSBwYXRoIFVSTFxuICAgIHNpbXBsZVBhdGhQYXR0ZXJuID0gL14oXFwvXFwvPyg/IVxcLylbXlxcP1xcc10qKShcXD9bXlxcc10qKT8kLyxcblxuICAgIC8vIFJGQyAyMzk2OiBjaGFyYWN0ZXJzIHJlc2VydmVkIGZvciBkZWxpbWl0aW5nIFVSTHMuXG4gICAgLy8gV2UgYWN0dWFsbHkganVzdCBhdXRvLWVzY2FwZSB0aGVzZS5cbiAgICBkZWxpbXMgPSBbJzwnLCAnPicsICdcIicsICdgJywgJyAnLCAnXFxyJywgJ1xcbicsICdcXHQnXSxcblxuICAgIC8vIFJGQyAyMzk2OiBjaGFyYWN0ZXJzIG5vdCBhbGxvd2VkIGZvciB2YXJpb3VzIHJlYXNvbnMuXG4gICAgdW53aXNlID0gWyd7JywgJ30nLCAnfCcsICdcXFxcJywgJ14nLCAnYCddLmNvbmNhdChkZWxpbXMpLFxuXG4gICAgLy8gQWxsb3dlZCBieSBSRkNzLCBidXQgY2F1c2Ugb2YgWFNTIGF0dGFja3MuICBBbHdheXMgZXNjYXBlIHRoZXNlLlxuICAgIGF1dG9Fc2NhcGUgPSBbJ1xcJyddLmNvbmNhdCh1bndpc2UpLFxuICAgIC8vIENoYXJhY3RlcnMgdGhhdCBhcmUgbmV2ZXIgZXZlciBhbGxvd2VkIGluIGEgaG9zdG5hbWUuXG4gICAgLy8gTm90ZSB0aGF0IGFueSBpbnZhbGlkIGNoYXJzIGFyZSBhbHNvIGhhbmRsZWQsIGJ1dCB0aGVzZVxuICAgIC8vIGFyZSB0aGUgb25lcyB0aGF0IGFyZSAqZXhwZWN0ZWQqIHRvIGJlIHNlZW4sIHNvIHdlIGZhc3QtcGF0aFxuICAgIC8vIHRoZW0uXG4gICAgbm9uSG9zdENoYXJzID0gWyclJywgJy8nLCAnPycsICc7JywgJyMnXS5jb25jYXQoYXV0b0VzY2FwZSksXG4gICAgaG9zdEVuZGluZ0NoYXJzID0gWycvJywgJz8nLCAnIyddLFxuICAgIGhvc3RuYW1lTWF4TGVuID0gMjU1LFxuICAgIGhvc3RuYW1lUGFydFBhdHRlcm4gPSAvXlsrYS16MC05QS1aXy1dezAsNjN9JC8sXG4gICAgaG9zdG5hbWVQYXJ0U3RhcnQgPSAvXihbK2EtejAtOUEtWl8tXXswLDYzfSkoLiopJC8sXG4gICAgLy8gcHJvdG9jb2xzIHRoYXQgY2FuIGFsbG93IFwidW5zYWZlXCIgYW5kIFwidW53aXNlXCIgY2hhcnMuXG4gICAgdW5zYWZlUHJvdG9jb2wgPSB7XG4gICAgICAnamF2YXNjcmlwdCc6IHRydWUsXG4gICAgICAnamF2YXNjcmlwdDonOiB0cnVlXG4gICAgfSxcbiAgICAvLyBwcm90b2NvbHMgdGhhdCBuZXZlciBoYXZlIGEgaG9zdG5hbWUuXG4gICAgaG9zdGxlc3NQcm90b2NvbCA9IHtcbiAgICAgICdqYXZhc2NyaXB0JzogdHJ1ZSxcbiAgICAgICdqYXZhc2NyaXB0Oic6IHRydWVcbiAgICB9LFxuICAgIC8vIHByb3RvY29scyB0aGF0IGFsd2F5cyBjb250YWluIGEgLy8gYml0LlxuICAgIHNsYXNoZWRQcm90b2NvbCA9IHtcbiAgICAgICdodHRwJzogdHJ1ZSxcbiAgICAgICdodHRwcyc6IHRydWUsXG4gICAgICAnZnRwJzogdHJ1ZSxcbiAgICAgICdnb3BoZXInOiB0cnVlLFxuICAgICAgJ2ZpbGUnOiB0cnVlLFxuICAgICAgJ2h0dHA6JzogdHJ1ZSxcbiAgICAgICdodHRwczonOiB0cnVlLFxuICAgICAgJ2Z0cDonOiB0cnVlLFxuICAgICAgJ2dvcGhlcjonOiB0cnVlLFxuICAgICAgJ2ZpbGU6JzogdHJ1ZVxuICAgIH0sXG4gICAgcXVlcnlzdHJpbmcgPSByZXF1aXJlKCdxdWVyeXN0cmluZycpO1xuXG5mdW5jdGlvbiB1cmxQYXJzZSh1cmwsIHBhcnNlUXVlcnlTdHJpbmcsIHNsYXNoZXNEZW5vdGVIb3N0KSB7XG4gIGlmICh1cmwgJiYgdXRpbC5pc09iamVjdCh1cmwpICYmIHVybCBpbnN0YW5jZW9mIFVybCkgcmV0dXJuIHVybDtcblxuICB2YXIgdSA9IG5ldyBVcmw7XG4gIHUucGFyc2UodXJsLCBwYXJzZVF1ZXJ5U3RyaW5nLCBzbGFzaGVzRGVub3RlSG9zdCk7XG4gIHJldHVybiB1O1xufVxuXG5VcmwucHJvdG90eXBlLnBhcnNlID0gZnVuY3Rpb24odXJsLCBwYXJzZVF1ZXJ5U3RyaW5nLCBzbGFzaGVzRGVub3RlSG9zdCkge1xuICBpZiAoIXV0aWwuaXNTdHJpbmcodXJsKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJQYXJhbWV0ZXIgJ3VybCcgbXVzdCBiZSBhIHN0cmluZywgbm90IFwiICsgdHlwZW9mIHVybCk7XG4gIH1cblxuICAvLyBDb3B5IGNocm9tZSwgSUUsIG9wZXJhIGJhY2tzbGFzaC1oYW5kbGluZyBiZWhhdmlvci5cbiAgLy8gQmFjayBzbGFzaGVzIGJlZm9yZSB0aGUgcXVlcnkgc3RyaW5nIGdldCBjb252ZXJ0ZWQgdG8gZm9yd2FyZCBzbGFzaGVzXG4gIC8vIFNlZTogaHR0cHM6Ly9jb2RlLmdvb2dsZS5jb20vcC9jaHJvbWl1bS9pc3N1ZXMvZGV0YWlsP2lkPTI1OTE2XG4gIHZhciBxdWVyeUluZGV4ID0gdXJsLmluZGV4T2YoJz8nKSxcbiAgICAgIHNwbGl0dGVyID1cbiAgICAgICAgICAocXVlcnlJbmRleCAhPT0gLTEgJiYgcXVlcnlJbmRleCA8IHVybC5pbmRleE9mKCcjJykpID8gJz8nIDogJyMnLFxuICAgICAgdVNwbGl0ID0gdXJsLnNwbGl0KHNwbGl0dGVyKSxcbiAgICAgIHNsYXNoUmVnZXggPSAvXFxcXC9nO1xuICB1U3BsaXRbMF0gPSB1U3BsaXRbMF0ucmVwbGFjZShzbGFzaFJlZ2V4LCAnLycpO1xuICB1cmwgPSB1U3BsaXQuam9pbihzcGxpdHRlcik7XG5cbiAgdmFyIHJlc3QgPSB1cmw7XG5cbiAgLy8gdHJpbSBiZWZvcmUgcHJvY2VlZGluZy5cbiAgLy8gVGhpcyBpcyB0byBzdXBwb3J0IHBhcnNlIHN0dWZmIGxpa2UgXCIgIGh0dHA6Ly9mb28uY29tICBcXG5cIlxuICByZXN0ID0gcmVzdC50cmltKCk7XG5cbiAgaWYgKCFzbGFzaGVzRGVub3RlSG9zdCAmJiB1cmwuc3BsaXQoJyMnKS5sZW5ndGggPT09IDEpIHtcbiAgICAvLyBUcnkgZmFzdCBwYXRoIHJlZ2V4cFxuICAgIHZhciBzaW1wbGVQYXRoID0gc2ltcGxlUGF0aFBhdHRlcm4uZXhlYyhyZXN0KTtcbiAgICBpZiAoc2ltcGxlUGF0aCkge1xuICAgICAgdGhpcy5wYXRoID0gcmVzdDtcbiAgICAgIHRoaXMuaHJlZiA9IHJlc3Q7XG4gICAgICB0aGlzLnBhdGhuYW1lID0gc2ltcGxlUGF0aFsxXTtcbiAgICAgIGlmIChzaW1wbGVQYXRoWzJdKSB7XG4gICAgICAgIHRoaXMuc2VhcmNoID0gc2ltcGxlUGF0aFsyXTtcbiAgICAgICAgaWYgKHBhcnNlUXVlcnlTdHJpbmcpIHtcbiAgICAgICAgICB0aGlzLnF1ZXJ5ID0gcXVlcnlzdHJpbmcucGFyc2UodGhpcy5zZWFyY2guc3Vic3RyKDEpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnF1ZXJ5ID0gdGhpcy5zZWFyY2guc3Vic3RyKDEpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHBhcnNlUXVlcnlTdHJpbmcpIHtcbiAgICAgICAgdGhpcy5zZWFyY2ggPSAnJztcbiAgICAgICAgdGhpcy5xdWVyeSA9IHt9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9XG5cbiAgdmFyIHByb3RvID0gcHJvdG9jb2xQYXR0ZXJuLmV4ZWMocmVzdCk7XG4gIGlmIChwcm90bykge1xuICAgIHByb3RvID0gcHJvdG9bMF07XG4gICAgdmFyIGxvd2VyUHJvdG8gPSBwcm90by50b0xvd2VyQ2FzZSgpO1xuICAgIHRoaXMucHJvdG9jb2wgPSBsb3dlclByb3RvO1xuICAgIHJlc3QgPSByZXN0LnN1YnN0cihwcm90by5sZW5ndGgpO1xuICB9XG5cbiAgLy8gZmlndXJlIG91dCBpZiBpdCdzIGdvdCBhIGhvc3RcbiAgLy8gdXNlckBzZXJ2ZXIgaXMgKmFsd2F5cyogaW50ZXJwcmV0ZWQgYXMgYSBob3N0bmFtZSwgYW5kIHVybFxuICAvLyByZXNvbHV0aW9uIHdpbGwgdHJlYXQgLy9mb28vYmFyIGFzIGhvc3Q9Zm9vLHBhdGg9YmFyIGJlY2F1c2UgdGhhdCdzXG4gIC8vIGhvdyB0aGUgYnJvd3NlciByZXNvbHZlcyByZWxhdGl2ZSBVUkxzLlxuICBpZiAoc2xhc2hlc0Rlbm90ZUhvc3QgfHwgcHJvdG8gfHwgcmVzdC5tYXRjaCgvXlxcL1xcL1teQFxcL10rQFteQFxcL10rLykpIHtcbiAgICB2YXIgc2xhc2hlcyA9IHJlc3Quc3Vic3RyKDAsIDIpID09PSAnLy8nO1xuICAgIGlmIChzbGFzaGVzICYmICEocHJvdG8gJiYgaG9zdGxlc3NQcm90b2NvbFtwcm90b10pKSB7XG4gICAgICByZXN0ID0gcmVzdC5zdWJzdHIoMik7XG4gICAgICB0aGlzLnNsYXNoZXMgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIGlmICghaG9zdGxlc3NQcm90b2NvbFtwcm90b10gJiZcbiAgICAgIChzbGFzaGVzIHx8IChwcm90byAmJiAhc2xhc2hlZFByb3RvY29sW3Byb3RvXSkpKSB7XG5cbiAgICAvLyB0aGVyZSdzIGEgaG9zdG5hbWUuXG4gICAgLy8gdGhlIGZpcnN0IGluc3RhbmNlIG9mIC8sID8sIDssIG9yICMgZW5kcyB0aGUgaG9zdC5cbiAgICAvL1xuICAgIC8vIElmIHRoZXJlIGlzIGFuIEAgaW4gdGhlIGhvc3RuYW1lLCB0aGVuIG5vbi1ob3N0IGNoYXJzICphcmUqIGFsbG93ZWRcbiAgICAvLyB0byB0aGUgbGVmdCBvZiB0aGUgbGFzdCBAIHNpZ24sIHVubGVzcyBzb21lIGhvc3QtZW5kaW5nIGNoYXJhY3RlclxuICAgIC8vIGNvbWVzICpiZWZvcmUqIHRoZSBALXNpZ24uXG4gICAgLy8gVVJMcyBhcmUgb2Jub3hpb3VzLlxuICAgIC8vXG4gICAgLy8gZXg6XG4gICAgLy8gaHR0cDovL2FAYkBjLyA9PiB1c2VyOmFAYiBob3N0OmNcbiAgICAvLyBodHRwOi8vYUBiP0BjID0+IHVzZXI6YSBob3N0OmMgcGF0aDovP0BjXG5cbiAgICAvLyB2MC4xMiBUT0RPKGlzYWFjcyk6IFRoaXMgaXMgbm90IHF1aXRlIGhvdyBDaHJvbWUgZG9lcyB0aGluZ3MuXG4gICAgLy8gUmV2aWV3IG91ciB0ZXN0IGNhc2UgYWdhaW5zdCBicm93c2VycyBtb3JlIGNvbXByZWhlbnNpdmVseS5cblxuICAgIC8vIGZpbmQgdGhlIGZpcnN0IGluc3RhbmNlIG9mIGFueSBob3N0RW5kaW5nQ2hhcnNcbiAgICB2YXIgaG9zdEVuZCA9IC0xO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaG9zdEVuZGluZ0NoYXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaGVjID0gcmVzdC5pbmRleE9mKGhvc3RFbmRpbmdDaGFyc1tpXSk7XG4gICAgICBpZiAoaGVjICE9PSAtMSAmJiAoaG9zdEVuZCA9PT0gLTEgfHwgaGVjIDwgaG9zdEVuZCkpXG4gICAgICAgIGhvc3RFbmQgPSBoZWM7XG4gICAgfVxuXG4gICAgLy8gYXQgdGhpcyBwb2ludCwgZWl0aGVyIHdlIGhhdmUgYW4gZXhwbGljaXQgcG9pbnQgd2hlcmUgdGhlXG4gICAgLy8gYXV0aCBwb3J0aW9uIGNhbm5vdCBnbyBwYXN0LCBvciB0aGUgbGFzdCBAIGNoYXIgaXMgdGhlIGRlY2lkZXIuXG4gICAgdmFyIGF1dGgsIGF0U2lnbjtcbiAgICBpZiAoaG9zdEVuZCA9PT0gLTEpIHtcbiAgICAgIC8vIGF0U2lnbiBjYW4gYmUgYW55d2hlcmUuXG4gICAgICBhdFNpZ24gPSByZXN0Lmxhc3RJbmRleE9mKCdAJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGF0U2lnbiBtdXN0IGJlIGluIGF1dGggcG9ydGlvbi5cbiAgICAgIC8vIGh0dHA6Ly9hQGIvY0BkID0+IGhvc3Q6YiBhdXRoOmEgcGF0aDovY0BkXG4gICAgICBhdFNpZ24gPSByZXN0Lmxhc3RJbmRleE9mKCdAJywgaG9zdEVuZCk7XG4gICAgfVxuXG4gICAgLy8gTm93IHdlIGhhdmUgYSBwb3J0aW9uIHdoaWNoIGlzIGRlZmluaXRlbHkgdGhlIGF1dGguXG4gICAgLy8gUHVsbCB0aGF0IG9mZi5cbiAgICBpZiAoYXRTaWduICE9PSAtMSkge1xuICAgICAgYXV0aCA9IHJlc3Quc2xpY2UoMCwgYXRTaWduKTtcbiAgICAgIHJlc3QgPSByZXN0LnNsaWNlKGF0U2lnbiArIDEpO1xuICAgICAgdGhpcy5hdXRoID0gZGVjb2RlVVJJQ29tcG9uZW50KGF1dGgpO1xuICAgIH1cblxuICAgIC8vIHRoZSBob3N0IGlzIHRoZSByZW1haW5pbmcgdG8gdGhlIGxlZnQgb2YgdGhlIGZpcnN0IG5vbi1ob3N0IGNoYXJcbiAgICBob3N0RW5kID0gLTE7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub25Ib3N0Q2hhcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBoZWMgPSByZXN0LmluZGV4T2Yobm9uSG9zdENoYXJzW2ldKTtcbiAgICAgIGlmIChoZWMgIT09IC0xICYmIChob3N0RW5kID09PSAtMSB8fCBoZWMgPCBob3N0RW5kKSlcbiAgICAgICAgaG9zdEVuZCA9IGhlYztcbiAgICB9XG4gICAgLy8gaWYgd2Ugc3RpbGwgaGF2ZSBub3QgaGl0IGl0LCB0aGVuIHRoZSBlbnRpcmUgdGhpbmcgaXMgYSBob3N0LlxuICAgIGlmIChob3N0RW5kID09PSAtMSlcbiAgICAgIGhvc3RFbmQgPSByZXN0Lmxlbmd0aDtcblxuICAgIHRoaXMuaG9zdCA9IHJlc3Quc2xpY2UoMCwgaG9zdEVuZCk7XG4gICAgcmVzdCA9IHJlc3Quc2xpY2UoaG9zdEVuZCk7XG5cbiAgICAvLyBwdWxsIG91dCBwb3J0LlxuICAgIHRoaXMucGFyc2VIb3N0KCk7XG5cbiAgICAvLyB3ZSd2ZSBpbmRpY2F0ZWQgdGhhdCB0aGVyZSBpcyBhIGhvc3RuYW1lLFxuICAgIC8vIHNvIGV2ZW4gaWYgaXQncyBlbXB0eSwgaXQgaGFzIHRvIGJlIHByZXNlbnQuXG4gICAgdGhpcy5ob3N0bmFtZSA9IHRoaXMuaG9zdG5hbWUgfHwgJyc7XG5cbiAgICAvLyBpZiBob3N0bmFtZSBiZWdpbnMgd2l0aCBbIGFuZCBlbmRzIHdpdGggXVxuICAgIC8vIGFzc3VtZSB0aGF0IGl0J3MgYW4gSVB2NiBhZGRyZXNzLlxuICAgIHZhciBpcHY2SG9zdG5hbWUgPSB0aGlzLmhvc3RuYW1lWzBdID09PSAnWycgJiZcbiAgICAgICAgdGhpcy5ob3N0bmFtZVt0aGlzLmhvc3RuYW1lLmxlbmd0aCAtIDFdID09PSAnXSc7XG5cbiAgICAvLyB2YWxpZGF0ZSBhIGxpdHRsZS5cbiAgICBpZiAoIWlwdjZIb3N0bmFtZSkge1xuICAgICAgdmFyIGhvc3RwYXJ0cyA9IHRoaXMuaG9zdG5hbWUuc3BsaXQoL1xcLi8pO1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBob3N0cGFydHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIHZhciBwYXJ0ID0gaG9zdHBhcnRzW2ldO1xuICAgICAgICBpZiAoIXBhcnQpIGNvbnRpbnVlO1xuICAgICAgICBpZiAoIXBhcnQubWF0Y2goaG9zdG5hbWVQYXJ0UGF0dGVybikpIHtcbiAgICAgICAgICB2YXIgbmV3cGFydCA9ICcnO1xuICAgICAgICAgIGZvciAodmFyIGogPSAwLCBrID0gcGFydC5sZW5ndGg7IGogPCBrOyBqKyspIHtcbiAgICAgICAgICAgIGlmIChwYXJ0LmNoYXJDb2RlQXQoaikgPiAxMjcpIHtcbiAgICAgICAgICAgICAgLy8gd2UgcmVwbGFjZSBub24tQVNDSUkgY2hhciB3aXRoIGEgdGVtcG9yYXJ5IHBsYWNlaG9sZGVyXG4gICAgICAgICAgICAgIC8vIHdlIG5lZWQgdGhpcyB0byBtYWtlIHN1cmUgc2l6ZSBvZiBob3N0bmFtZSBpcyBub3RcbiAgICAgICAgICAgICAgLy8gYnJva2VuIGJ5IHJlcGxhY2luZyBub24tQVNDSUkgYnkgbm90aGluZ1xuICAgICAgICAgICAgICBuZXdwYXJ0ICs9ICd4JztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIG5ld3BhcnQgKz0gcGFydFtqXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gd2UgdGVzdCBhZ2FpbiB3aXRoIEFTQ0lJIGNoYXIgb25seVxuICAgICAgICAgIGlmICghbmV3cGFydC5tYXRjaChob3N0bmFtZVBhcnRQYXR0ZXJuKSkge1xuICAgICAgICAgICAgdmFyIHZhbGlkUGFydHMgPSBob3N0cGFydHMuc2xpY2UoMCwgaSk7XG4gICAgICAgICAgICB2YXIgbm90SG9zdCA9IGhvc3RwYXJ0cy5zbGljZShpICsgMSk7XG4gICAgICAgICAgICB2YXIgYml0ID0gcGFydC5tYXRjaChob3N0bmFtZVBhcnRTdGFydCk7XG4gICAgICAgICAgICBpZiAoYml0KSB7XG4gICAgICAgICAgICAgIHZhbGlkUGFydHMucHVzaChiaXRbMV0pO1xuICAgICAgICAgICAgICBub3RIb3N0LnVuc2hpZnQoYml0WzJdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChub3RIb3N0Lmxlbmd0aCkge1xuICAgICAgICAgICAgICByZXN0ID0gJy8nICsgbm90SG9zdC5qb2luKCcuJykgKyByZXN0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5ob3N0bmFtZSA9IHZhbGlkUGFydHMuam9pbignLicpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaG9zdG5hbWUubGVuZ3RoID4gaG9zdG5hbWVNYXhMZW4pIHtcbiAgICAgIHRoaXMuaG9zdG5hbWUgPSAnJztcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gaG9zdG5hbWVzIGFyZSBhbHdheXMgbG93ZXIgY2FzZS5cbiAgICAgIHRoaXMuaG9zdG5hbWUgPSB0aGlzLmhvc3RuYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgfVxuXG4gICAgaWYgKCFpcHY2SG9zdG5hbWUpIHtcbiAgICAgIC8vIElETkEgU3VwcG9ydDogUmV0dXJucyBhIHB1bnljb2RlZCByZXByZXNlbnRhdGlvbiBvZiBcImRvbWFpblwiLlxuICAgICAgLy8gSXQgb25seSBjb252ZXJ0cyBwYXJ0cyBvZiB0aGUgZG9tYWluIG5hbWUgdGhhdFxuICAgICAgLy8gaGF2ZSBub24tQVNDSUkgY2hhcmFjdGVycywgaS5lLiBpdCBkb2Vzbid0IG1hdHRlciBpZlxuICAgICAgLy8geW91IGNhbGwgaXQgd2l0aCBhIGRvbWFpbiB0aGF0IGFscmVhZHkgaXMgQVNDSUktb25seS5cbiAgICAgIHRoaXMuaG9zdG5hbWUgPSBwdW55Y29kZS50b0FTQ0lJKHRoaXMuaG9zdG5hbWUpO1xuICAgIH1cblxuICAgIHZhciBwID0gdGhpcy5wb3J0ID8gJzonICsgdGhpcy5wb3J0IDogJyc7XG4gICAgdmFyIGggPSB0aGlzLmhvc3RuYW1lIHx8ICcnO1xuICAgIHRoaXMuaG9zdCA9IGggKyBwO1xuICAgIHRoaXMuaHJlZiArPSB0aGlzLmhvc3Q7XG5cbiAgICAvLyBzdHJpcCBbIGFuZCBdIGZyb20gdGhlIGhvc3RuYW1lXG4gICAgLy8gdGhlIGhvc3QgZmllbGQgc3RpbGwgcmV0YWlucyB0aGVtLCB0aG91Z2hcbiAgICBpZiAoaXB2Nkhvc3RuYW1lKSB7XG4gICAgICB0aGlzLmhvc3RuYW1lID0gdGhpcy5ob3N0bmFtZS5zdWJzdHIoMSwgdGhpcy5ob3N0bmFtZS5sZW5ndGggLSAyKTtcbiAgICAgIGlmIChyZXN0WzBdICE9PSAnLycpIHtcbiAgICAgICAgcmVzdCA9ICcvJyArIHJlc3Q7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gbm93IHJlc3QgaXMgc2V0IHRvIHRoZSBwb3N0LWhvc3Qgc3R1ZmYuXG4gIC8vIGNob3Agb2ZmIGFueSBkZWxpbSBjaGFycy5cbiAgaWYgKCF1bnNhZmVQcm90b2NvbFtsb3dlclByb3RvXSkge1xuXG4gICAgLy8gRmlyc3QsIG1ha2UgMTAwJSBzdXJlIHRoYXQgYW55IFwiYXV0b0VzY2FwZVwiIGNoYXJzIGdldFxuICAgIC8vIGVzY2FwZWQsIGV2ZW4gaWYgZW5jb2RlVVJJQ29tcG9uZW50IGRvZXNuJ3QgdGhpbmsgdGhleVxuICAgIC8vIG5lZWQgdG8gYmUuXG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBhdXRvRXNjYXBlLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgdmFyIGFlID0gYXV0b0VzY2FwZVtpXTtcbiAgICAgIGlmIChyZXN0LmluZGV4T2YoYWUpID09PSAtMSlcbiAgICAgICAgY29udGludWU7XG4gICAgICB2YXIgZXNjID0gZW5jb2RlVVJJQ29tcG9uZW50KGFlKTtcbiAgICAgIGlmIChlc2MgPT09IGFlKSB7XG4gICAgICAgIGVzYyA9IGVzY2FwZShhZSk7XG4gICAgICB9XG4gICAgICByZXN0ID0gcmVzdC5zcGxpdChhZSkuam9pbihlc2MpO1xuICAgIH1cbiAgfVxuXG5cbiAgLy8gY2hvcCBvZmYgZnJvbSB0aGUgdGFpbCBmaXJzdC5cbiAgdmFyIGhhc2ggPSByZXN0LmluZGV4T2YoJyMnKTtcbiAgaWYgKGhhc2ggIT09IC0xKSB7XG4gICAgLy8gZ290IGEgZnJhZ21lbnQgc3RyaW5nLlxuICAgIHRoaXMuaGFzaCA9IHJlc3Quc3Vic3RyKGhhc2gpO1xuICAgIHJlc3QgPSByZXN0LnNsaWNlKDAsIGhhc2gpO1xuICB9XG4gIHZhciBxbSA9IHJlc3QuaW5kZXhPZignPycpO1xuICBpZiAocW0gIT09IC0xKSB7XG4gICAgdGhpcy5zZWFyY2ggPSByZXN0LnN1YnN0cihxbSk7XG4gICAgdGhpcy5xdWVyeSA9IHJlc3Quc3Vic3RyKHFtICsgMSk7XG4gICAgaWYgKHBhcnNlUXVlcnlTdHJpbmcpIHtcbiAgICAgIHRoaXMucXVlcnkgPSBxdWVyeXN0cmluZy5wYXJzZSh0aGlzLnF1ZXJ5KTtcbiAgICB9XG4gICAgcmVzdCA9IHJlc3Quc2xpY2UoMCwgcW0pO1xuICB9IGVsc2UgaWYgKHBhcnNlUXVlcnlTdHJpbmcpIHtcbiAgICAvLyBubyBxdWVyeSBzdHJpbmcsIGJ1dCBwYXJzZVF1ZXJ5U3RyaW5nIHN0aWxsIHJlcXVlc3RlZFxuICAgIHRoaXMuc2VhcmNoID0gJyc7XG4gICAgdGhpcy5xdWVyeSA9IHt9O1xuICB9XG4gIGlmIChyZXN0KSB0aGlzLnBhdGhuYW1lID0gcmVzdDtcbiAgaWYgKHNsYXNoZWRQcm90b2NvbFtsb3dlclByb3RvXSAmJlxuICAgICAgdGhpcy5ob3N0bmFtZSAmJiAhdGhpcy5wYXRobmFtZSkge1xuICAgIHRoaXMucGF0aG5hbWUgPSAnLyc7XG4gIH1cblxuICAvL3RvIHN1cHBvcnQgaHR0cC5yZXF1ZXN0XG4gIGlmICh0aGlzLnBhdGhuYW1lIHx8IHRoaXMuc2VhcmNoKSB7XG4gICAgdmFyIHAgPSB0aGlzLnBhdGhuYW1lIHx8ICcnO1xuICAgIHZhciBzID0gdGhpcy5zZWFyY2ggfHwgJyc7XG4gICAgdGhpcy5wYXRoID0gcCArIHM7XG4gIH1cblxuICAvLyBmaW5hbGx5LCByZWNvbnN0cnVjdCB0aGUgaHJlZiBiYXNlZCBvbiB3aGF0IGhhcyBiZWVuIHZhbGlkYXRlZC5cbiAgdGhpcy5ocmVmID0gdGhpcy5mb3JtYXQoKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vLyBmb3JtYXQgYSBwYXJzZWQgb2JqZWN0IGludG8gYSB1cmwgc3RyaW5nXG5mdW5jdGlvbiB1cmxGb3JtYXQob2JqKSB7XG4gIC8vIGVuc3VyZSBpdCdzIGFuIG9iamVjdCwgYW5kIG5vdCBhIHN0cmluZyB1cmwuXG4gIC8vIElmIGl0J3MgYW4gb2JqLCB0aGlzIGlzIGEgbm8tb3AuXG4gIC8vIHRoaXMgd2F5LCB5b3UgY2FuIGNhbGwgdXJsX2Zvcm1hdCgpIG9uIHN0cmluZ3NcbiAgLy8gdG8gY2xlYW4gdXAgcG90ZW50aWFsbHkgd29ua3kgdXJscy5cbiAgaWYgKHV0aWwuaXNTdHJpbmcob2JqKSkgb2JqID0gdXJsUGFyc2Uob2JqKTtcbiAgaWYgKCEob2JqIGluc3RhbmNlb2YgVXJsKSkgcmV0dXJuIFVybC5wcm90b3R5cGUuZm9ybWF0LmNhbGwob2JqKTtcbiAgcmV0dXJuIG9iai5mb3JtYXQoKTtcbn1cblxuVXJsLnByb3RvdHlwZS5mb3JtYXQgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGF1dGggPSB0aGlzLmF1dGggfHwgJyc7XG4gIGlmIChhdXRoKSB7XG4gICAgYXV0aCA9IGVuY29kZVVSSUNvbXBvbmVudChhdXRoKTtcbiAgICBhdXRoID0gYXV0aC5yZXBsYWNlKC8lM0EvaSwgJzonKTtcbiAgICBhdXRoICs9ICdAJztcbiAgfVxuXG4gIHZhciBwcm90b2NvbCA9IHRoaXMucHJvdG9jb2wgfHwgJycsXG4gICAgICBwYXRobmFtZSA9IHRoaXMucGF0aG5hbWUgfHwgJycsXG4gICAgICBoYXNoID0gdGhpcy5oYXNoIHx8ICcnLFxuICAgICAgaG9zdCA9IGZhbHNlLFxuICAgICAgcXVlcnkgPSAnJztcblxuICBpZiAodGhpcy5ob3N0KSB7XG4gICAgaG9zdCA9IGF1dGggKyB0aGlzLmhvc3Q7XG4gIH0gZWxzZSBpZiAodGhpcy5ob3N0bmFtZSkge1xuICAgIGhvc3QgPSBhdXRoICsgKHRoaXMuaG9zdG5hbWUuaW5kZXhPZignOicpID09PSAtMSA/XG4gICAgICAgIHRoaXMuaG9zdG5hbWUgOlxuICAgICAgICAnWycgKyB0aGlzLmhvc3RuYW1lICsgJ10nKTtcbiAgICBpZiAodGhpcy5wb3J0KSB7XG4gICAgICBob3N0ICs9ICc6JyArIHRoaXMucG9ydDtcbiAgICB9XG4gIH1cblxuICBpZiAodGhpcy5xdWVyeSAmJlxuICAgICAgdXRpbC5pc09iamVjdCh0aGlzLnF1ZXJ5KSAmJlxuICAgICAgT2JqZWN0LmtleXModGhpcy5xdWVyeSkubGVuZ3RoKSB7XG4gICAgcXVlcnkgPSBxdWVyeXN0cmluZy5zdHJpbmdpZnkodGhpcy5xdWVyeSk7XG4gIH1cblxuICB2YXIgc2VhcmNoID0gdGhpcy5zZWFyY2ggfHwgKHF1ZXJ5ICYmICgnPycgKyBxdWVyeSkpIHx8ICcnO1xuXG4gIGlmIChwcm90b2NvbCAmJiBwcm90b2NvbC5zdWJzdHIoLTEpICE9PSAnOicpIHByb3RvY29sICs9ICc6JztcblxuICAvLyBvbmx5IHRoZSBzbGFzaGVkUHJvdG9jb2xzIGdldCB0aGUgLy8uICBOb3QgbWFpbHRvOiwgeG1wcDosIGV0Yy5cbiAgLy8gdW5sZXNzIHRoZXkgaGFkIHRoZW0gdG8gYmVnaW4gd2l0aC5cbiAgaWYgKHRoaXMuc2xhc2hlcyB8fFxuICAgICAgKCFwcm90b2NvbCB8fCBzbGFzaGVkUHJvdG9jb2xbcHJvdG9jb2xdKSAmJiBob3N0ICE9PSBmYWxzZSkge1xuICAgIGhvc3QgPSAnLy8nICsgKGhvc3QgfHwgJycpO1xuICAgIGlmIChwYXRobmFtZSAmJiBwYXRobmFtZS5jaGFyQXQoMCkgIT09ICcvJykgcGF0aG5hbWUgPSAnLycgKyBwYXRobmFtZTtcbiAgfSBlbHNlIGlmICghaG9zdCkge1xuICAgIGhvc3QgPSAnJztcbiAgfVxuXG4gIGlmIChoYXNoICYmIGhhc2guY2hhckF0KDApICE9PSAnIycpIGhhc2ggPSAnIycgKyBoYXNoO1xuICBpZiAoc2VhcmNoICYmIHNlYXJjaC5jaGFyQXQoMCkgIT09ICc/Jykgc2VhcmNoID0gJz8nICsgc2VhcmNoO1xuXG4gIHBhdGhuYW1lID0gcGF0aG5hbWUucmVwbGFjZSgvWz8jXS9nLCBmdW5jdGlvbihtYXRjaCkge1xuICAgIHJldHVybiBlbmNvZGVVUklDb21wb25lbnQobWF0Y2gpO1xuICB9KTtcbiAgc2VhcmNoID0gc2VhcmNoLnJlcGxhY2UoJyMnLCAnJTIzJyk7XG5cbiAgcmV0dXJuIHByb3RvY29sICsgaG9zdCArIHBhdGhuYW1lICsgc2VhcmNoICsgaGFzaDtcbn07XG5cbmZ1bmN0aW9uIHVybFJlc29sdmUoc291cmNlLCByZWxhdGl2ZSkge1xuICByZXR1cm4gdXJsUGFyc2Uoc291cmNlLCBmYWxzZSwgdHJ1ZSkucmVzb2x2ZShyZWxhdGl2ZSk7XG59XG5cblVybC5wcm90b3R5cGUucmVzb2x2ZSA9IGZ1bmN0aW9uKHJlbGF0aXZlKSB7XG4gIHJldHVybiB0aGlzLnJlc29sdmVPYmplY3QodXJsUGFyc2UocmVsYXRpdmUsIGZhbHNlLCB0cnVlKSkuZm9ybWF0KCk7XG59O1xuXG5mdW5jdGlvbiB1cmxSZXNvbHZlT2JqZWN0KHNvdXJjZSwgcmVsYXRpdmUpIHtcbiAgaWYgKCFzb3VyY2UpIHJldHVybiByZWxhdGl2ZTtcbiAgcmV0dXJuIHVybFBhcnNlKHNvdXJjZSwgZmFsc2UsIHRydWUpLnJlc29sdmVPYmplY3QocmVsYXRpdmUpO1xufVxuXG5VcmwucHJvdG90eXBlLnJlc29sdmVPYmplY3QgPSBmdW5jdGlvbihyZWxhdGl2ZSkge1xuICBpZiAodXRpbC5pc1N0cmluZyhyZWxhdGl2ZSkpIHtcbiAgICB2YXIgcmVsID0gbmV3IFVybCgpO1xuICAgIHJlbC5wYXJzZShyZWxhdGl2ZSwgZmFsc2UsIHRydWUpO1xuICAgIHJlbGF0aXZlID0gcmVsO1xuICB9XG5cbiAgdmFyIHJlc3VsdCA9IG5ldyBVcmwoKTtcbiAgdmFyIHRrZXlzID0gT2JqZWN0LmtleXModGhpcyk7XG4gIGZvciAodmFyIHRrID0gMDsgdGsgPCB0a2V5cy5sZW5ndGg7IHRrKyspIHtcbiAgICB2YXIgdGtleSA9IHRrZXlzW3RrXTtcbiAgICByZXN1bHRbdGtleV0gPSB0aGlzW3RrZXldO1xuICB9XG5cbiAgLy8gaGFzaCBpcyBhbHdheXMgb3ZlcnJpZGRlbiwgbm8gbWF0dGVyIHdoYXQuXG4gIC8vIGV2ZW4gaHJlZj1cIlwiIHdpbGwgcmVtb3ZlIGl0LlxuICByZXN1bHQuaGFzaCA9IHJlbGF0aXZlLmhhc2g7XG5cbiAgLy8gaWYgdGhlIHJlbGF0aXZlIHVybCBpcyBlbXB0eSwgdGhlbiB0aGVyZSdzIG5vdGhpbmcgbGVmdCB0byBkbyBoZXJlLlxuICBpZiAocmVsYXRpdmUuaHJlZiA9PT0gJycpIHtcbiAgICByZXN1bHQuaHJlZiA9IHJlc3VsdC5mb3JtYXQoKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLy8gaHJlZnMgbGlrZSAvL2Zvby9iYXIgYWx3YXlzIGN1dCB0byB0aGUgcHJvdG9jb2wuXG4gIGlmIChyZWxhdGl2ZS5zbGFzaGVzICYmICFyZWxhdGl2ZS5wcm90b2NvbCkge1xuICAgIC8vIHRha2UgZXZlcnl0aGluZyBleGNlcHQgdGhlIHByb3RvY29sIGZyb20gcmVsYXRpdmVcbiAgICB2YXIgcmtleXMgPSBPYmplY3Qua2V5cyhyZWxhdGl2ZSk7XG4gICAgZm9yICh2YXIgcmsgPSAwOyByayA8IHJrZXlzLmxlbmd0aDsgcmsrKykge1xuICAgICAgdmFyIHJrZXkgPSBya2V5c1tya107XG4gICAgICBpZiAocmtleSAhPT0gJ3Byb3RvY29sJylcbiAgICAgICAgcmVzdWx0W3JrZXldID0gcmVsYXRpdmVbcmtleV07XG4gICAgfVxuXG4gICAgLy91cmxQYXJzZSBhcHBlbmRzIHRyYWlsaW5nIC8gdG8gdXJscyBsaWtlIGh0dHA6Ly93d3cuZXhhbXBsZS5jb21cbiAgICBpZiAoc2xhc2hlZFByb3RvY29sW3Jlc3VsdC5wcm90b2NvbF0gJiZcbiAgICAgICAgcmVzdWx0Lmhvc3RuYW1lICYmICFyZXN1bHQucGF0aG5hbWUpIHtcbiAgICAgIHJlc3VsdC5wYXRoID0gcmVzdWx0LnBhdGhuYW1lID0gJy8nO1xuICAgIH1cblxuICAgIHJlc3VsdC5ocmVmID0gcmVzdWx0LmZvcm1hdCgpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBpZiAocmVsYXRpdmUucHJvdG9jb2wgJiYgcmVsYXRpdmUucHJvdG9jb2wgIT09IHJlc3VsdC5wcm90b2NvbCkge1xuICAgIC8vIGlmIGl0J3MgYSBrbm93biB1cmwgcHJvdG9jb2wsIHRoZW4gY2hhbmdpbmdcbiAgICAvLyB0aGUgcHJvdG9jb2wgZG9lcyB3ZWlyZCB0aGluZ3NcbiAgICAvLyBmaXJzdCwgaWYgaXQncyBub3QgZmlsZTosIHRoZW4gd2UgTVVTVCBoYXZlIGEgaG9zdCxcbiAgICAvLyBhbmQgaWYgdGhlcmUgd2FzIGEgcGF0aFxuICAgIC8vIHRvIGJlZ2luIHdpdGgsIHRoZW4gd2UgTVVTVCBoYXZlIGEgcGF0aC5cbiAgICAvLyBpZiBpdCBpcyBmaWxlOiwgdGhlbiB0aGUgaG9zdCBpcyBkcm9wcGVkLFxuICAgIC8vIGJlY2F1c2UgdGhhdCdzIGtub3duIHRvIGJlIGhvc3RsZXNzLlxuICAgIC8vIGFueXRoaW5nIGVsc2UgaXMgYXNzdW1lZCB0byBiZSBhYnNvbHV0ZS5cbiAgICBpZiAoIXNsYXNoZWRQcm90b2NvbFtyZWxhdGl2ZS5wcm90b2NvbF0pIHtcbiAgICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMocmVsYXRpdmUpO1xuICAgICAgZm9yICh2YXIgdiA9IDA7IHYgPCBrZXlzLmxlbmd0aDsgdisrKSB7XG4gICAgICAgIHZhciBrID0ga2V5c1t2XTtcbiAgICAgICAgcmVzdWx0W2tdID0gcmVsYXRpdmVba107XG4gICAgICB9XG4gICAgICByZXN1bHQuaHJlZiA9IHJlc3VsdC5mb3JtYXQoKTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgcmVzdWx0LnByb3RvY29sID0gcmVsYXRpdmUucHJvdG9jb2w7XG4gICAgaWYgKCFyZWxhdGl2ZS5ob3N0ICYmICFob3N0bGVzc1Byb3RvY29sW3JlbGF0aXZlLnByb3RvY29sXSkge1xuICAgICAgdmFyIHJlbFBhdGggPSAocmVsYXRpdmUucGF0aG5hbWUgfHwgJycpLnNwbGl0KCcvJyk7XG4gICAgICB3aGlsZSAocmVsUGF0aC5sZW5ndGggJiYgIShyZWxhdGl2ZS5ob3N0ID0gcmVsUGF0aC5zaGlmdCgpKSk7XG4gICAgICBpZiAoIXJlbGF0aXZlLmhvc3QpIHJlbGF0aXZlLmhvc3QgPSAnJztcbiAgICAgIGlmICghcmVsYXRpdmUuaG9zdG5hbWUpIHJlbGF0aXZlLmhvc3RuYW1lID0gJyc7XG4gICAgICBpZiAocmVsUGF0aFswXSAhPT0gJycpIHJlbFBhdGgudW5zaGlmdCgnJyk7XG4gICAgICBpZiAocmVsUGF0aC5sZW5ndGggPCAyKSByZWxQYXRoLnVuc2hpZnQoJycpO1xuICAgICAgcmVzdWx0LnBhdGhuYW1lID0gcmVsUGF0aC5qb2luKCcvJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3VsdC5wYXRobmFtZSA9IHJlbGF0aXZlLnBhdGhuYW1lO1xuICAgIH1cbiAgICByZXN1bHQuc2VhcmNoID0gcmVsYXRpdmUuc2VhcmNoO1xuICAgIHJlc3VsdC5xdWVyeSA9IHJlbGF0aXZlLnF1ZXJ5O1xuICAgIHJlc3VsdC5ob3N0ID0gcmVsYXRpdmUuaG9zdCB8fCAnJztcbiAgICByZXN1bHQuYXV0aCA9IHJlbGF0aXZlLmF1dGg7XG4gICAgcmVzdWx0Lmhvc3RuYW1lID0gcmVsYXRpdmUuaG9zdG5hbWUgfHwgcmVsYXRpdmUuaG9zdDtcbiAgICByZXN1bHQucG9ydCA9IHJlbGF0aXZlLnBvcnQ7XG4gICAgLy8gdG8gc3VwcG9ydCBodHRwLnJlcXVlc3RcbiAgICBpZiAocmVzdWx0LnBhdGhuYW1lIHx8IHJlc3VsdC5zZWFyY2gpIHtcbiAgICAgIHZhciBwID0gcmVzdWx0LnBhdGhuYW1lIHx8ICcnO1xuICAgICAgdmFyIHMgPSByZXN1bHQuc2VhcmNoIHx8ICcnO1xuICAgICAgcmVzdWx0LnBhdGggPSBwICsgcztcbiAgICB9XG4gICAgcmVzdWx0LnNsYXNoZXMgPSByZXN1bHQuc2xhc2hlcyB8fCByZWxhdGl2ZS5zbGFzaGVzO1xuICAgIHJlc3VsdC5ocmVmID0gcmVzdWx0LmZvcm1hdCgpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICB2YXIgaXNTb3VyY2VBYnMgPSAocmVzdWx0LnBhdGhuYW1lICYmIHJlc3VsdC5wYXRobmFtZS5jaGFyQXQoMCkgPT09ICcvJyksXG4gICAgICBpc1JlbEFicyA9IChcbiAgICAgICAgICByZWxhdGl2ZS5ob3N0IHx8XG4gICAgICAgICAgcmVsYXRpdmUucGF0aG5hbWUgJiYgcmVsYXRpdmUucGF0aG5hbWUuY2hhckF0KDApID09PSAnLydcbiAgICAgICksXG4gICAgICBtdXN0RW5kQWJzID0gKGlzUmVsQWJzIHx8IGlzU291cmNlQWJzIHx8XG4gICAgICAgICAgICAgICAgICAgIChyZXN1bHQuaG9zdCAmJiByZWxhdGl2ZS5wYXRobmFtZSkpLFxuICAgICAgcmVtb3ZlQWxsRG90cyA9IG11c3RFbmRBYnMsXG4gICAgICBzcmNQYXRoID0gcmVzdWx0LnBhdGhuYW1lICYmIHJlc3VsdC5wYXRobmFtZS5zcGxpdCgnLycpIHx8IFtdLFxuICAgICAgcmVsUGF0aCA9IHJlbGF0aXZlLnBhdGhuYW1lICYmIHJlbGF0aXZlLnBhdGhuYW1lLnNwbGl0KCcvJykgfHwgW10sXG4gICAgICBwc3ljaG90aWMgPSByZXN1bHQucHJvdG9jb2wgJiYgIXNsYXNoZWRQcm90b2NvbFtyZXN1bHQucHJvdG9jb2xdO1xuXG4gIC8vIGlmIHRoZSB1cmwgaXMgYSBub24tc2xhc2hlZCB1cmwsIHRoZW4gcmVsYXRpdmVcbiAgLy8gbGlua3MgbGlrZSAuLi8uLiBzaG91bGQgYmUgYWJsZVxuICAvLyB0byBjcmF3bCB1cCB0byB0aGUgaG9zdG5hbWUsIGFzIHdlbGwuICBUaGlzIGlzIHN0cmFuZ2UuXG4gIC8vIHJlc3VsdC5wcm90b2NvbCBoYXMgYWxyZWFkeSBiZWVuIHNldCBieSBub3cuXG4gIC8vIExhdGVyIG9uLCBwdXQgdGhlIGZpcnN0IHBhdGggcGFydCBpbnRvIHRoZSBob3N0IGZpZWxkLlxuICBpZiAocHN5Y2hvdGljKSB7XG4gICAgcmVzdWx0Lmhvc3RuYW1lID0gJyc7XG4gICAgcmVzdWx0LnBvcnQgPSBudWxsO1xuICAgIGlmIChyZXN1bHQuaG9zdCkge1xuICAgICAgaWYgKHNyY1BhdGhbMF0gPT09ICcnKSBzcmNQYXRoWzBdID0gcmVzdWx0Lmhvc3Q7XG4gICAgICBlbHNlIHNyY1BhdGgudW5zaGlmdChyZXN1bHQuaG9zdCk7XG4gICAgfVxuICAgIHJlc3VsdC5ob3N0ID0gJyc7XG4gICAgaWYgKHJlbGF0aXZlLnByb3RvY29sKSB7XG4gICAgICByZWxhdGl2ZS5ob3N0bmFtZSA9IG51bGw7XG4gICAgICByZWxhdGl2ZS5wb3J0ID0gbnVsbDtcbiAgICAgIGlmIChyZWxhdGl2ZS5ob3N0KSB7XG4gICAgICAgIGlmIChyZWxQYXRoWzBdID09PSAnJykgcmVsUGF0aFswXSA9IHJlbGF0aXZlLmhvc3Q7XG4gICAgICAgIGVsc2UgcmVsUGF0aC51bnNoaWZ0KHJlbGF0aXZlLmhvc3QpO1xuICAgICAgfVxuICAgICAgcmVsYXRpdmUuaG9zdCA9IG51bGw7XG4gICAgfVxuICAgIG11c3RFbmRBYnMgPSBtdXN0RW5kQWJzICYmIChyZWxQYXRoWzBdID09PSAnJyB8fCBzcmNQYXRoWzBdID09PSAnJyk7XG4gIH1cblxuICBpZiAoaXNSZWxBYnMpIHtcbiAgICAvLyBpdCdzIGFic29sdXRlLlxuICAgIHJlc3VsdC5ob3N0ID0gKHJlbGF0aXZlLmhvc3QgfHwgcmVsYXRpdmUuaG9zdCA9PT0gJycpID9cbiAgICAgICAgICAgICAgICAgIHJlbGF0aXZlLmhvc3QgOiByZXN1bHQuaG9zdDtcbiAgICByZXN1bHQuaG9zdG5hbWUgPSAocmVsYXRpdmUuaG9zdG5hbWUgfHwgcmVsYXRpdmUuaG9zdG5hbWUgPT09ICcnKSA/XG4gICAgICAgICAgICAgICAgICAgICAgcmVsYXRpdmUuaG9zdG5hbWUgOiByZXN1bHQuaG9zdG5hbWU7XG4gICAgcmVzdWx0LnNlYXJjaCA9IHJlbGF0aXZlLnNlYXJjaDtcbiAgICByZXN1bHQucXVlcnkgPSByZWxhdGl2ZS5xdWVyeTtcbiAgICBzcmNQYXRoID0gcmVsUGF0aDtcbiAgICAvLyBmYWxsIHRocm91Z2ggdG8gdGhlIGRvdC1oYW5kbGluZyBiZWxvdy5cbiAgfSBlbHNlIGlmIChyZWxQYXRoLmxlbmd0aCkge1xuICAgIC8vIGl0J3MgcmVsYXRpdmVcbiAgICAvLyB0aHJvdyBhd2F5IHRoZSBleGlzdGluZyBmaWxlLCBhbmQgdGFrZSB0aGUgbmV3IHBhdGggaW5zdGVhZC5cbiAgICBpZiAoIXNyY1BhdGgpIHNyY1BhdGggPSBbXTtcbiAgICBzcmNQYXRoLnBvcCgpO1xuICAgIHNyY1BhdGggPSBzcmNQYXRoLmNvbmNhdChyZWxQYXRoKTtcbiAgICByZXN1bHQuc2VhcmNoID0gcmVsYXRpdmUuc2VhcmNoO1xuICAgIHJlc3VsdC5xdWVyeSA9IHJlbGF0aXZlLnF1ZXJ5O1xuICB9IGVsc2UgaWYgKCF1dGlsLmlzTnVsbE9yVW5kZWZpbmVkKHJlbGF0aXZlLnNlYXJjaCkpIHtcbiAgICAvLyBqdXN0IHB1bGwgb3V0IHRoZSBzZWFyY2guXG4gICAgLy8gbGlrZSBocmVmPSc/Zm9vJy5cbiAgICAvLyBQdXQgdGhpcyBhZnRlciB0aGUgb3RoZXIgdHdvIGNhc2VzIGJlY2F1c2UgaXQgc2ltcGxpZmllcyB0aGUgYm9vbGVhbnNcbiAgICBpZiAocHN5Y2hvdGljKSB7XG4gICAgICByZXN1bHQuaG9zdG5hbWUgPSByZXN1bHQuaG9zdCA9IHNyY1BhdGguc2hpZnQoKTtcbiAgICAgIC8vb2NjYXRpb25hbHkgdGhlIGF1dGggY2FuIGdldCBzdHVjayBvbmx5IGluIGhvc3RcbiAgICAgIC8vdGhpcyBlc3BlY2lhbGx5IGhhcHBlbnMgaW4gY2FzZXMgbGlrZVxuICAgICAgLy91cmwucmVzb2x2ZU9iamVjdCgnbWFpbHRvOmxvY2FsMUBkb21haW4xJywgJ2xvY2FsMkBkb21haW4yJylcbiAgICAgIHZhciBhdXRoSW5Ib3N0ID0gcmVzdWx0Lmhvc3QgJiYgcmVzdWx0Lmhvc3QuaW5kZXhPZignQCcpID4gMCA/XG4gICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5ob3N0LnNwbGl0KCdAJykgOiBmYWxzZTtcbiAgICAgIGlmIChhdXRoSW5Ib3N0KSB7XG4gICAgICAgIHJlc3VsdC5hdXRoID0gYXV0aEluSG9zdC5zaGlmdCgpO1xuICAgICAgICByZXN1bHQuaG9zdCA9IHJlc3VsdC5ob3N0bmFtZSA9IGF1dGhJbkhvc3Quc2hpZnQoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmVzdWx0LnNlYXJjaCA9IHJlbGF0aXZlLnNlYXJjaDtcbiAgICByZXN1bHQucXVlcnkgPSByZWxhdGl2ZS5xdWVyeTtcbiAgICAvL3RvIHN1cHBvcnQgaHR0cC5yZXF1ZXN0XG4gICAgaWYgKCF1dGlsLmlzTnVsbChyZXN1bHQucGF0aG5hbWUpIHx8ICF1dGlsLmlzTnVsbChyZXN1bHQuc2VhcmNoKSkge1xuICAgICAgcmVzdWx0LnBhdGggPSAocmVzdWx0LnBhdGhuYW1lID8gcmVzdWx0LnBhdGhuYW1lIDogJycpICtcbiAgICAgICAgICAgICAgICAgICAgKHJlc3VsdC5zZWFyY2ggPyByZXN1bHQuc2VhcmNoIDogJycpO1xuICAgIH1cbiAgICByZXN1bHQuaHJlZiA9IHJlc3VsdC5mb3JtYXQoKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgaWYgKCFzcmNQYXRoLmxlbmd0aCkge1xuICAgIC8vIG5vIHBhdGggYXQgYWxsLiAgZWFzeS5cbiAgICAvLyB3ZSd2ZSBhbHJlYWR5IGhhbmRsZWQgdGhlIG90aGVyIHN0dWZmIGFib3ZlLlxuICAgIHJlc3VsdC5wYXRobmFtZSA9IG51bGw7XG4gICAgLy90byBzdXBwb3J0IGh0dHAucmVxdWVzdFxuICAgIGlmIChyZXN1bHQuc2VhcmNoKSB7XG4gICAgICByZXN1bHQucGF0aCA9ICcvJyArIHJlc3VsdC5zZWFyY2g7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3VsdC5wYXRoID0gbnVsbDtcbiAgICB9XG4gICAgcmVzdWx0LmhyZWYgPSByZXN1bHQuZm9ybWF0KCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8vIGlmIGEgdXJsIEVORHMgaW4gLiBvciAuLiwgdGhlbiBpdCBtdXN0IGdldCBhIHRyYWlsaW5nIHNsYXNoLlxuICAvLyBob3dldmVyLCBpZiBpdCBlbmRzIGluIGFueXRoaW5nIGVsc2Ugbm9uLXNsYXNoeSxcbiAgLy8gdGhlbiBpdCBtdXN0IE5PVCBnZXQgYSB0cmFpbGluZyBzbGFzaC5cbiAgdmFyIGxhc3QgPSBzcmNQYXRoLnNsaWNlKC0xKVswXTtcbiAgdmFyIGhhc1RyYWlsaW5nU2xhc2ggPSAoXG4gICAgICAocmVzdWx0Lmhvc3QgfHwgcmVsYXRpdmUuaG9zdCB8fCBzcmNQYXRoLmxlbmd0aCA+IDEpICYmXG4gICAgICAobGFzdCA9PT0gJy4nIHx8IGxhc3QgPT09ICcuLicpIHx8IGxhc3QgPT09ICcnKTtcblxuICAvLyBzdHJpcCBzaW5nbGUgZG90cywgcmVzb2x2ZSBkb3VibGUgZG90cyB0byBwYXJlbnQgZGlyXG4gIC8vIGlmIHRoZSBwYXRoIHRyaWVzIHRvIGdvIGFib3ZlIHRoZSByb290LCBgdXBgIGVuZHMgdXAgPiAwXG4gIHZhciB1cCA9IDA7XG4gIGZvciAodmFyIGkgPSBzcmNQYXRoLmxlbmd0aDsgaSA+PSAwOyBpLS0pIHtcbiAgICBsYXN0ID0gc3JjUGF0aFtpXTtcbiAgICBpZiAobGFzdCA9PT0gJy4nKSB7XG4gICAgICBzcmNQYXRoLnNwbGljZShpLCAxKTtcbiAgICB9IGVsc2UgaWYgKGxhc3QgPT09ICcuLicpIHtcbiAgICAgIHNyY1BhdGguc3BsaWNlKGksIDEpO1xuICAgICAgdXArKztcbiAgICB9IGVsc2UgaWYgKHVwKSB7XG4gICAgICBzcmNQYXRoLnNwbGljZShpLCAxKTtcbiAgICAgIHVwLS07XG4gICAgfVxuICB9XG5cbiAgLy8gaWYgdGhlIHBhdGggaXMgYWxsb3dlZCB0byBnbyBhYm92ZSB0aGUgcm9vdCwgcmVzdG9yZSBsZWFkaW5nIC4uc1xuICBpZiAoIW11c3RFbmRBYnMgJiYgIXJlbW92ZUFsbERvdHMpIHtcbiAgICBmb3IgKDsgdXAtLTsgdXApIHtcbiAgICAgIHNyY1BhdGgudW5zaGlmdCgnLi4nKTtcbiAgICB9XG4gIH1cblxuICBpZiAobXVzdEVuZEFicyAmJiBzcmNQYXRoWzBdICE9PSAnJyAmJlxuICAgICAgKCFzcmNQYXRoWzBdIHx8IHNyY1BhdGhbMF0uY2hhckF0KDApICE9PSAnLycpKSB7XG4gICAgc3JjUGF0aC51bnNoaWZ0KCcnKTtcbiAgfVxuXG4gIGlmIChoYXNUcmFpbGluZ1NsYXNoICYmIChzcmNQYXRoLmpvaW4oJy8nKS5zdWJzdHIoLTEpICE9PSAnLycpKSB7XG4gICAgc3JjUGF0aC5wdXNoKCcnKTtcbiAgfVxuXG4gIHZhciBpc0Fic29sdXRlID0gc3JjUGF0aFswXSA9PT0gJycgfHxcbiAgICAgIChzcmNQYXRoWzBdICYmIHNyY1BhdGhbMF0uY2hhckF0KDApID09PSAnLycpO1xuXG4gIC8vIHB1dCB0aGUgaG9zdCBiYWNrXG4gIGlmIChwc3ljaG90aWMpIHtcbiAgICByZXN1bHQuaG9zdG5hbWUgPSByZXN1bHQuaG9zdCA9IGlzQWJzb2x1dGUgPyAnJyA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzcmNQYXRoLmxlbmd0aCA/IHNyY1BhdGguc2hpZnQoKSA6ICcnO1xuICAgIC8vb2NjYXRpb25hbHkgdGhlIGF1dGggY2FuIGdldCBzdHVjayBvbmx5IGluIGhvc3RcbiAgICAvL3RoaXMgZXNwZWNpYWxseSBoYXBwZW5zIGluIGNhc2VzIGxpa2VcbiAgICAvL3VybC5yZXNvbHZlT2JqZWN0KCdtYWlsdG86bG9jYWwxQGRvbWFpbjEnLCAnbG9jYWwyQGRvbWFpbjInKVxuICAgIHZhciBhdXRoSW5Ib3N0ID0gcmVzdWx0Lmhvc3QgJiYgcmVzdWx0Lmhvc3QuaW5kZXhPZignQCcpID4gMCA/XG4gICAgICAgICAgICAgICAgICAgICByZXN1bHQuaG9zdC5zcGxpdCgnQCcpIDogZmFsc2U7XG4gICAgaWYgKGF1dGhJbkhvc3QpIHtcbiAgICAgIHJlc3VsdC5hdXRoID0gYXV0aEluSG9zdC5zaGlmdCgpO1xuICAgICAgcmVzdWx0Lmhvc3QgPSByZXN1bHQuaG9zdG5hbWUgPSBhdXRoSW5Ib3N0LnNoaWZ0KCk7XG4gICAgfVxuICB9XG5cbiAgbXVzdEVuZEFicyA9IG11c3RFbmRBYnMgfHwgKHJlc3VsdC5ob3N0ICYmIHNyY1BhdGgubGVuZ3RoKTtcblxuICBpZiAobXVzdEVuZEFicyAmJiAhaXNBYnNvbHV0ZSkge1xuICAgIHNyY1BhdGgudW5zaGlmdCgnJyk7XG4gIH1cblxuICBpZiAoIXNyY1BhdGgubGVuZ3RoKSB7XG4gICAgcmVzdWx0LnBhdGhuYW1lID0gbnVsbDtcbiAgICByZXN1bHQucGF0aCA9IG51bGw7XG4gIH0gZWxzZSB7XG4gICAgcmVzdWx0LnBhdGhuYW1lID0gc3JjUGF0aC5qb2luKCcvJyk7XG4gIH1cblxuICAvL3RvIHN1cHBvcnQgcmVxdWVzdC5odHRwXG4gIGlmICghdXRpbC5pc051bGwocmVzdWx0LnBhdGhuYW1lKSB8fCAhdXRpbC5pc051bGwocmVzdWx0LnNlYXJjaCkpIHtcbiAgICByZXN1bHQucGF0aCA9IChyZXN1bHQucGF0aG5hbWUgPyByZXN1bHQucGF0aG5hbWUgOiAnJykgK1xuICAgICAgICAgICAgICAgICAgKHJlc3VsdC5zZWFyY2ggPyByZXN1bHQuc2VhcmNoIDogJycpO1xuICB9XG4gIHJlc3VsdC5hdXRoID0gcmVsYXRpdmUuYXV0aCB8fCByZXN1bHQuYXV0aDtcbiAgcmVzdWx0LnNsYXNoZXMgPSByZXN1bHQuc2xhc2hlcyB8fCByZWxhdGl2ZS5zbGFzaGVzO1xuICByZXN1bHQuaHJlZiA9IHJlc3VsdC5mb3JtYXQoKTtcbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cblVybC5wcm90b3R5cGUucGFyc2VIb3N0ID0gZnVuY3Rpb24oKSB7XG4gIHZhciBob3N0ID0gdGhpcy5ob3N0O1xuICB2YXIgcG9ydCA9IHBvcnRQYXR0ZXJuLmV4ZWMoaG9zdCk7XG4gIGlmIChwb3J0KSB7XG4gICAgcG9ydCA9IHBvcnRbMF07XG4gICAgaWYgKHBvcnQgIT09ICc6Jykge1xuICAgICAgdGhpcy5wb3J0ID0gcG9ydC5zdWJzdHIoMSk7XG4gICAgfVxuICAgIGhvc3QgPSBob3N0LnN1YnN0cigwLCBob3N0Lmxlbmd0aCAtIHBvcnQubGVuZ3RoKTtcbiAgfVxuICBpZiAoaG9zdCkgdGhpcy5ob3N0bmFtZSA9IGhvc3Q7XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3VybC91cmwuanNcbi8vIG1vZHVsZSBpZCA9IDE2XG4vLyBtb2R1bGUgY2h1bmtzID0gMSAyIDMiLCIvKiEgaHR0cHM6Ly9tdGhzLmJlL3B1bnljb2RlIHYxLjMuMiBieSBAbWF0aGlhcyAqL1xuOyhmdW5jdGlvbihyb290KSB7XG5cblx0LyoqIERldGVjdCBmcmVlIHZhcmlhYmxlcyAqL1xuXHR2YXIgZnJlZUV4cG9ydHMgPSB0eXBlb2YgZXhwb3J0cyA9PSAnb2JqZWN0JyAmJiBleHBvcnRzICYmXG5cdFx0IWV4cG9ydHMubm9kZVR5cGUgJiYgZXhwb3J0cztcblx0dmFyIGZyZWVNb2R1bGUgPSB0eXBlb2YgbW9kdWxlID09ICdvYmplY3QnICYmIG1vZHVsZSAmJlxuXHRcdCFtb2R1bGUubm9kZVR5cGUgJiYgbW9kdWxlO1xuXHR2YXIgZnJlZUdsb2JhbCA9IHR5cGVvZiBnbG9iYWwgPT0gJ29iamVjdCcgJiYgZ2xvYmFsO1xuXHRpZiAoXG5cdFx0ZnJlZUdsb2JhbC5nbG9iYWwgPT09IGZyZWVHbG9iYWwgfHxcblx0XHRmcmVlR2xvYmFsLndpbmRvdyA9PT0gZnJlZUdsb2JhbCB8fFxuXHRcdGZyZWVHbG9iYWwuc2VsZiA9PT0gZnJlZUdsb2JhbFxuXHQpIHtcblx0XHRyb290ID0gZnJlZUdsb2JhbDtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgYHB1bnljb2RlYCBvYmplY3QuXG5cdCAqIEBuYW1lIHB1bnljb2RlXG5cdCAqIEB0eXBlIE9iamVjdFxuXHQgKi9cblx0dmFyIHB1bnljb2RlLFxuXG5cdC8qKiBIaWdoZXN0IHBvc2l0aXZlIHNpZ25lZCAzMi1iaXQgZmxvYXQgdmFsdWUgKi9cblx0bWF4SW50ID0gMjE0NzQ4MzY0NywgLy8gYWthLiAweDdGRkZGRkZGIG9yIDJeMzEtMVxuXG5cdC8qKiBCb290c3RyaW5nIHBhcmFtZXRlcnMgKi9cblx0YmFzZSA9IDM2LFxuXHR0TWluID0gMSxcblx0dE1heCA9IDI2LFxuXHRza2V3ID0gMzgsXG5cdGRhbXAgPSA3MDAsXG5cdGluaXRpYWxCaWFzID0gNzIsXG5cdGluaXRpYWxOID0gMTI4LCAvLyAweDgwXG5cdGRlbGltaXRlciA9ICctJywgLy8gJ1xceDJEJ1xuXG5cdC8qKiBSZWd1bGFyIGV4cHJlc3Npb25zICovXG5cdHJlZ2V4UHVueWNvZGUgPSAvXnhuLS0vLFxuXHRyZWdleE5vbkFTQ0lJID0gL1teXFx4MjAtXFx4N0VdLywgLy8gdW5wcmludGFibGUgQVNDSUkgY2hhcnMgKyBub24tQVNDSUkgY2hhcnNcblx0cmVnZXhTZXBhcmF0b3JzID0gL1tcXHgyRVxcdTMwMDJcXHVGRjBFXFx1RkY2MV0vZywgLy8gUkZDIDM0OTAgc2VwYXJhdG9yc1xuXG5cdC8qKiBFcnJvciBtZXNzYWdlcyAqL1xuXHRlcnJvcnMgPSB7XG5cdFx0J292ZXJmbG93JzogJ092ZXJmbG93OiBpbnB1dCBuZWVkcyB3aWRlciBpbnRlZ2VycyB0byBwcm9jZXNzJyxcblx0XHQnbm90LWJhc2ljJzogJ0lsbGVnYWwgaW5wdXQgPj0gMHg4MCAobm90IGEgYmFzaWMgY29kZSBwb2ludCknLFxuXHRcdCdpbnZhbGlkLWlucHV0JzogJ0ludmFsaWQgaW5wdXQnXG5cdH0sXG5cblx0LyoqIENvbnZlbmllbmNlIHNob3J0Y3V0cyAqL1xuXHRiYXNlTWludXNUTWluID0gYmFzZSAtIHRNaW4sXG5cdGZsb29yID0gTWF0aC5mbG9vcixcblx0c3RyaW5nRnJvbUNoYXJDb2RlID0gU3RyaW5nLmZyb21DaGFyQ29kZSxcblxuXHQvKiogVGVtcG9yYXJ5IHZhcmlhYmxlICovXG5cdGtleTtcblxuXHQvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuXHQvKipcblx0ICogQSBnZW5lcmljIGVycm9yIHV0aWxpdHkgZnVuY3Rpb24uXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIFRoZSBlcnJvciB0eXBlLlxuXHQgKiBAcmV0dXJucyB7RXJyb3J9IFRocm93cyBhIGBSYW5nZUVycm9yYCB3aXRoIHRoZSBhcHBsaWNhYmxlIGVycm9yIG1lc3NhZ2UuXG5cdCAqL1xuXHRmdW5jdGlvbiBlcnJvcih0eXBlKSB7XG5cdFx0dGhyb3cgUmFuZ2VFcnJvcihlcnJvcnNbdHlwZV0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIEEgZ2VuZXJpYyBgQXJyYXkjbWFwYCB1dGlsaXR5IGZ1bmN0aW9uLlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaXRlcmF0ZSBvdmVyLlxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBUaGUgZnVuY3Rpb24gdGhhdCBnZXRzIGNhbGxlZCBmb3IgZXZlcnkgYXJyYXlcblx0ICogaXRlbS5cblx0ICogQHJldHVybnMge0FycmF5fSBBIG5ldyBhcnJheSBvZiB2YWx1ZXMgcmV0dXJuZWQgYnkgdGhlIGNhbGxiYWNrIGZ1bmN0aW9uLlxuXHQgKi9cblx0ZnVuY3Rpb24gbWFwKGFycmF5LCBmbikge1xuXHRcdHZhciBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG5cdFx0dmFyIHJlc3VsdCA9IFtdO1xuXHRcdHdoaWxlIChsZW5ndGgtLSkge1xuXHRcdFx0cmVzdWx0W2xlbmd0aF0gPSBmbihhcnJheVtsZW5ndGhdKTtcblx0XHR9XG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fVxuXG5cdC8qKlxuXHQgKiBBIHNpbXBsZSBgQXJyYXkjbWFwYC1saWtlIHdyYXBwZXIgdG8gd29yayB3aXRoIGRvbWFpbiBuYW1lIHN0cmluZ3Mgb3IgZW1haWxcblx0ICogYWRkcmVzc2VzLlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0ge1N0cmluZ30gZG9tYWluIFRoZSBkb21haW4gbmFtZSBvciBlbWFpbCBhZGRyZXNzLlxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBUaGUgZnVuY3Rpb24gdGhhdCBnZXRzIGNhbGxlZCBmb3IgZXZlcnlcblx0ICogY2hhcmFjdGVyLlxuXHQgKiBAcmV0dXJucyB7QXJyYXl9IEEgbmV3IHN0cmluZyBvZiBjaGFyYWN0ZXJzIHJldHVybmVkIGJ5IHRoZSBjYWxsYmFja1xuXHQgKiBmdW5jdGlvbi5cblx0ICovXG5cdGZ1bmN0aW9uIG1hcERvbWFpbihzdHJpbmcsIGZuKSB7XG5cdFx0dmFyIHBhcnRzID0gc3RyaW5nLnNwbGl0KCdAJyk7XG5cdFx0dmFyIHJlc3VsdCA9ICcnO1xuXHRcdGlmIChwYXJ0cy5sZW5ndGggPiAxKSB7XG5cdFx0XHQvLyBJbiBlbWFpbCBhZGRyZXNzZXMsIG9ubHkgdGhlIGRvbWFpbiBuYW1lIHNob3VsZCBiZSBwdW55Y29kZWQuIExlYXZlXG5cdFx0XHQvLyB0aGUgbG9jYWwgcGFydCAoaS5lLiBldmVyeXRoaW5nIHVwIHRvIGBAYCkgaW50YWN0LlxuXHRcdFx0cmVzdWx0ID0gcGFydHNbMF0gKyAnQCc7XG5cdFx0XHRzdHJpbmcgPSBwYXJ0c1sxXTtcblx0XHR9XG5cdFx0Ly8gQXZvaWQgYHNwbGl0KHJlZ2V4KWAgZm9yIElFOCBjb21wYXRpYmlsaXR5LiBTZWUgIzE3LlxuXHRcdHN0cmluZyA9IHN0cmluZy5yZXBsYWNlKHJlZ2V4U2VwYXJhdG9ycywgJ1xceDJFJyk7XG5cdFx0dmFyIGxhYmVscyA9IHN0cmluZy5zcGxpdCgnLicpO1xuXHRcdHZhciBlbmNvZGVkID0gbWFwKGxhYmVscywgZm4pLmpvaW4oJy4nKTtcblx0XHRyZXR1cm4gcmVzdWx0ICsgZW5jb2RlZDtcblx0fVxuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGFuIGFycmF5IGNvbnRhaW5pbmcgdGhlIG51bWVyaWMgY29kZSBwb2ludHMgb2YgZWFjaCBVbmljb2RlXG5cdCAqIGNoYXJhY3RlciBpbiB0aGUgc3RyaW5nLiBXaGlsZSBKYXZhU2NyaXB0IHVzZXMgVUNTLTIgaW50ZXJuYWxseSxcblx0ICogdGhpcyBmdW5jdGlvbiB3aWxsIGNvbnZlcnQgYSBwYWlyIG9mIHN1cnJvZ2F0ZSBoYWx2ZXMgKGVhY2ggb2Ygd2hpY2hcblx0ICogVUNTLTIgZXhwb3NlcyBhcyBzZXBhcmF0ZSBjaGFyYWN0ZXJzKSBpbnRvIGEgc2luZ2xlIGNvZGUgcG9pbnQsXG5cdCAqIG1hdGNoaW5nIFVURi0xNi5cblx0ICogQHNlZSBgcHVueWNvZGUudWNzMi5lbmNvZGVgXG5cdCAqIEBzZWUgPGh0dHBzOi8vbWF0aGlhc2J5bmVucy5iZS9ub3Rlcy9qYXZhc2NyaXB0LWVuY29kaW5nPlxuXHQgKiBAbWVtYmVyT2YgcHVueWNvZGUudWNzMlxuXHQgKiBAbmFtZSBkZWNvZGVcblx0ICogQHBhcmFtIHtTdHJpbmd9IHN0cmluZyBUaGUgVW5pY29kZSBpbnB1dCBzdHJpbmcgKFVDUy0yKS5cblx0ICogQHJldHVybnMge0FycmF5fSBUaGUgbmV3IGFycmF5IG9mIGNvZGUgcG9pbnRzLlxuXHQgKi9cblx0ZnVuY3Rpb24gdWNzMmRlY29kZShzdHJpbmcpIHtcblx0XHR2YXIgb3V0cHV0ID0gW10sXG5cdFx0ICAgIGNvdW50ZXIgPSAwLFxuXHRcdCAgICBsZW5ndGggPSBzdHJpbmcubGVuZ3RoLFxuXHRcdCAgICB2YWx1ZSxcblx0XHQgICAgZXh0cmE7XG5cdFx0d2hpbGUgKGNvdW50ZXIgPCBsZW5ndGgpIHtcblx0XHRcdHZhbHVlID0gc3RyaW5nLmNoYXJDb2RlQXQoY291bnRlcisrKTtcblx0XHRcdGlmICh2YWx1ZSA+PSAweEQ4MDAgJiYgdmFsdWUgPD0gMHhEQkZGICYmIGNvdW50ZXIgPCBsZW5ndGgpIHtcblx0XHRcdFx0Ly8gaGlnaCBzdXJyb2dhdGUsIGFuZCB0aGVyZSBpcyBhIG5leHQgY2hhcmFjdGVyXG5cdFx0XHRcdGV4dHJhID0gc3RyaW5nLmNoYXJDb2RlQXQoY291bnRlcisrKTtcblx0XHRcdFx0aWYgKChleHRyYSAmIDB4RkMwMCkgPT0gMHhEQzAwKSB7IC8vIGxvdyBzdXJyb2dhdGVcblx0XHRcdFx0XHRvdXRwdXQucHVzaCgoKHZhbHVlICYgMHgzRkYpIDw8IDEwKSArIChleHRyYSAmIDB4M0ZGKSArIDB4MTAwMDApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdC8vIHVubWF0Y2hlZCBzdXJyb2dhdGU7IG9ubHkgYXBwZW5kIHRoaXMgY29kZSB1bml0LCBpbiBjYXNlIHRoZSBuZXh0XG5cdFx0XHRcdFx0Ly8gY29kZSB1bml0IGlzIHRoZSBoaWdoIHN1cnJvZ2F0ZSBvZiBhIHN1cnJvZ2F0ZSBwYWlyXG5cdFx0XHRcdFx0b3V0cHV0LnB1c2godmFsdWUpO1xuXHRcdFx0XHRcdGNvdW50ZXItLTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0b3V0cHV0LnB1c2godmFsdWUpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gb3V0cHV0O1xuXHR9XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBzdHJpbmcgYmFzZWQgb24gYW4gYXJyYXkgb2YgbnVtZXJpYyBjb2RlIHBvaW50cy5cblx0ICogQHNlZSBgcHVueWNvZGUudWNzMi5kZWNvZGVgXG5cdCAqIEBtZW1iZXJPZiBwdW55Y29kZS51Y3MyXG5cdCAqIEBuYW1lIGVuY29kZVxuXHQgKiBAcGFyYW0ge0FycmF5fSBjb2RlUG9pbnRzIFRoZSBhcnJheSBvZiBudW1lcmljIGNvZGUgcG9pbnRzLlxuXHQgKiBAcmV0dXJucyB7U3RyaW5nfSBUaGUgbmV3IFVuaWNvZGUgc3RyaW5nIChVQ1MtMikuXG5cdCAqL1xuXHRmdW5jdGlvbiB1Y3MyZW5jb2RlKGFycmF5KSB7XG5cdFx0cmV0dXJuIG1hcChhcnJheSwgZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdHZhciBvdXRwdXQgPSAnJztcblx0XHRcdGlmICh2YWx1ZSA+IDB4RkZGRikge1xuXHRcdFx0XHR2YWx1ZSAtPSAweDEwMDAwO1xuXHRcdFx0XHRvdXRwdXQgKz0gc3RyaW5nRnJvbUNoYXJDb2RlKHZhbHVlID4+PiAxMCAmIDB4M0ZGIHwgMHhEODAwKTtcblx0XHRcdFx0dmFsdWUgPSAweERDMDAgfCB2YWx1ZSAmIDB4M0ZGO1xuXHRcdFx0fVxuXHRcdFx0b3V0cHV0ICs9IHN0cmluZ0Zyb21DaGFyQ29kZSh2YWx1ZSk7XG5cdFx0XHRyZXR1cm4gb3V0cHV0O1xuXHRcdH0pLmpvaW4oJycpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENvbnZlcnRzIGEgYmFzaWMgY29kZSBwb2ludCBpbnRvIGEgZGlnaXQvaW50ZWdlci5cblx0ICogQHNlZSBgZGlnaXRUb0Jhc2ljKClgXG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7TnVtYmVyfSBjb2RlUG9pbnQgVGhlIGJhc2ljIG51bWVyaWMgY29kZSBwb2ludCB2YWx1ZS5cblx0ICogQHJldHVybnMge051bWJlcn0gVGhlIG51bWVyaWMgdmFsdWUgb2YgYSBiYXNpYyBjb2RlIHBvaW50IChmb3IgdXNlIGluXG5cdCAqIHJlcHJlc2VudGluZyBpbnRlZ2VycykgaW4gdGhlIHJhbmdlIGAwYCB0byBgYmFzZSAtIDFgLCBvciBgYmFzZWAgaWZcblx0ICogdGhlIGNvZGUgcG9pbnQgZG9lcyBub3QgcmVwcmVzZW50IGEgdmFsdWUuXG5cdCAqL1xuXHRmdW5jdGlvbiBiYXNpY1RvRGlnaXQoY29kZVBvaW50KSB7XG5cdFx0aWYgKGNvZGVQb2ludCAtIDQ4IDwgMTApIHtcblx0XHRcdHJldHVybiBjb2RlUG9pbnQgLSAyMjtcblx0XHR9XG5cdFx0aWYgKGNvZGVQb2ludCAtIDY1IDwgMjYpIHtcblx0XHRcdHJldHVybiBjb2RlUG9pbnQgLSA2NTtcblx0XHR9XG5cdFx0aWYgKGNvZGVQb2ludCAtIDk3IDwgMjYpIHtcblx0XHRcdHJldHVybiBjb2RlUG9pbnQgLSA5Nztcblx0XHR9XG5cdFx0cmV0dXJuIGJhc2U7XG5cdH1cblxuXHQvKipcblx0ICogQ29udmVydHMgYSBkaWdpdC9pbnRlZ2VyIGludG8gYSBiYXNpYyBjb2RlIHBvaW50LlxuXHQgKiBAc2VlIGBiYXNpY1RvRGlnaXQoKWBcblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtIHtOdW1iZXJ9IGRpZ2l0IFRoZSBudW1lcmljIHZhbHVlIG9mIGEgYmFzaWMgY29kZSBwb2ludC5cblx0ICogQHJldHVybnMge051bWJlcn0gVGhlIGJhc2ljIGNvZGUgcG9pbnQgd2hvc2UgdmFsdWUgKHdoZW4gdXNlZCBmb3Jcblx0ICogcmVwcmVzZW50aW5nIGludGVnZXJzKSBpcyBgZGlnaXRgLCB3aGljaCBuZWVkcyB0byBiZSBpbiB0aGUgcmFuZ2Vcblx0ICogYDBgIHRvIGBiYXNlIC0gMWAuIElmIGBmbGFnYCBpcyBub24temVybywgdGhlIHVwcGVyY2FzZSBmb3JtIGlzXG5cdCAqIHVzZWQ7IGVsc2UsIHRoZSBsb3dlcmNhc2UgZm9ybSBpcyB1c2VkLiBUaGUgYmVoYXZpb3IgaXMgdW5kZWZpbmVkXG5cdCAqIGlmIGBmbGFnYCBpcyBub24temVybyBhbmQgYGRpZ2l0YCBoYXMgbm8gdXBwZXJjYXNlIGZvcm0uXG5cdCAqL1xuXHRmdW5jdGlvbiBkaWdpdFRvQmFzaWMoZGlnaXQsIGZsYWcpIHtcblx0XHQvLyAgMC4uMjUgbWFwIHRvIEFTQ0lJIGEuLnogb3IgQS4uWlxuXHRcdC8vIDI2Li4zNSBtYXAgdG8gQVNDSUkgMC4uOVxuXHRcdHJldHVybiBkaWdpdCArIDIyICsgNzUgKiAoZGlnaXQgPCAyNikgLSAoKGZsYWcgIT0gMCkgPDwgNSk7XG5cdH1cblxuXHQvKipcblx0ICogQmlhcyBhZGFwdGF0aW9uIGZ1bmN0aW9uIGFzIHBlciBzZWN0aW9uIDMuNCBvZiBSRkMgMzQ5Mi5cblx0ICogaHR0cDovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjMzQ5MiNzZWN0aW9uLTMuNFxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0ZnVuY3Rpb24gYWRhcHQoZGVsdGEsIG51bVBvaW50cywgZmlyc3RUaW1lKSB7XG5cdFx0dmFyIGsgPSAwO1xuXHRcdGRlbHRhID0gZmlyc3RUaW1lID8gZmxvb3IoZGVsdGEgLyBkYW1wKSA6IGRlbHRhID4+IDE7XG5cdFx0ZGVsdGEgKz0gZmxvb3IoZGVsdGEgLyBudW1Qb2ludHMpO1xuXHRcdGZvciAoLyogbm8gaW5pdGlhbGl6YXRpb24gKi87IGRlbHRhID4gYmFzZU1pbnVzVE1pbiAqIHRNYXggPj4gMTsgayArPSBiYXNlKSB7XG5cdFx0XHRkZWx0YSA9IGZsb29yKGRlbHRhIC8gYmFzZU1pbnVzVE1pbik7XG5cdFx0fVxuXHRcdHJldHVybiBmbG9vcihrICsgKGJhc2VNaW51c1RNaW4gKyAxKSAqIGRlbHRhIC8gKGRlbHRhICsgc2tldykpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENvbnZlcnRzIGEgUHVueWNvZGUgc3RyaW5nIG9mIEFTQ0lJLW9ubHkgc3ltYm9scyB0byBhIHN0cmluZyBvZiBVbmljb2RlXG5cdCAqIHN5bWJvbHMuXG5cdCAqIEBtZW1iZXJPZiBwdW55Y29kZVxuXHQgKiBAcGFyYW0ge1N0cmluZ30gaW5wdXQgVGhlIFB1bnljb2RlIHN0cmluZyBvZiBBU0NJSS1vbmx5IHN5bWJvbHMuXG5cdCAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSByZXN1bHRpbmcgc3RyaW5nIG9mIFVuaWNvZGUgc3ltYm9scy5cblx0ICovXG5cdGZ1bmN0aW9uIGRlY29kZShpbnB1dCkge1xuXHRcdC8vIERvbid0IHVzZSBVQ1MtMlxuXHRcdHZhciBvdXRwdXQgPSBbXSxcblx0XHQgICAgaW5wdXRMZW5ndGggPSBpbnB1dC5sZW5ndGgsXG5cdFx0ICAgIG91dCxcblx0XHQgICAgaSA9IDAsXG5cdFx0ICAgIG4gPSBpbml0aWFsTixcblx0XHQgICAgYmlhcyA9IGluaXRpYWxCaWFzLFxuXHRcdCAgICBiYXNpYyxcblx0XHQgICAgaixcblx0XHQgICAgaW5kZXgsXG5cdFx0ICAgIG9sZGksXG5cdFx0ICAgIHcsXG5cdFx0ICAgIGssXG5cdFx0ICAgIGRpZ2l0LFxuXHRcdCAgICB0LFxuXHRcdCAgICAvKiogQ2FjaGVkIGNhbGN1bGF0aW9uIHJlc3VsdHMgKi9cblx0XHQgICAgYmFzZU1pbnVzVDtcblxuXHRcdC8vIEhhbmRsZSB0aGUgYmFzaWMgY29kZSBwb2ludHM6IGxldCBgYmFzaWNgIGJlIHRoZSBudW1iZXIgb2YgaW5wdXQgY29kZVxuXHRcdC8vIHBvaW50cyBiZWZvcmUgdGhlIGxhc3QgZGVsaW1pdGVyLCBvciBgMGAgaWYgdGhlcmUgaXMgbm9uZSwgdGhlbiBjb3B5XG5cdFx0Ly8gdGhlIGZpcnN0IGJhc2ljIGNvZGUgcG9pbnRzIHRvIHRoZSBvdXRwdXQuXG5cblx0XHRiYXNpYyA9IGlucHV0Lmxhc3RJbmRleE9mKGRlbGltaXRlcik7XG5cdFx0aWYgKGJhc2ljIDwgMCkge1xuXHRcdFx0YmFzaWMgPSAwO1xuXHRcdH1cblxuXHRcdGZvciAoaiA9IDA7IGogPCBiYXNpYzsgKytqKSB7XG5cdFx0XHQvLyBpZiBpdCdzIG5vdCBhIGJhc2ljIGNvZGUgcG9pbnRcblx0XHRcdGlmIChpbnB1dC5jaGFyQ29kZUF0KGopID49IDB4ODApIHtcblx0XHRcdFx0ZXJyb3IoJ25vdC1iYXNpYycpO1xuXHRcdFx0fVxuXHRcdFx0b3V0cHV0LnB1c2goaW5wdXQuY2hhckNvZGVBdChqKSk7XG5cdFx0fVxuXG5cdFx0Ly8gTWFpbiBkZWNvZGluZyBsb29wOiBzdGFydCBqdXN0IGFmdGVyIHRoZSBsYXN0IGRlbGltaXRlciBpZiBhbnkgYmFzaWMgY29kZVxuXHRcdC8vIHBvaW50cyB3ZXJlIGNvcGllZDsgc3RhcnQgYXQgdGhlIGJlZ2lubmluZyBvdGhlcndpc2UuXG5cblx0XHRmb3IgKGluZGV4ID0gYmFzaWMgPiAwID8gYmFzaWMgKyAxIDogMDsgaW5kZXggPCBpbnB1dExlbmd0aDsgLyogbm8gZmluYWwgZXhwcmVzc2lvbiAqLykge1xuXG5cdFx0XHQvLyBgaW5kZXhgIGlzIHRoZSBpbmRleCBvZiB0aGUgbmV4dCBjaGFyYWN0ZXIgdG8gYmUgY29uc3VtZWQuXG5cdFx0XHQvLyBEZWNvZGUgYSBnZW5lcmFsaXplZCB2YXJpYWJsZS1sZW5ndGggaW50ZWdlciBpbnRvIGBkZWx0YWAsXG5cdFx0XHQvLyB3aGljaCBnZXRzIGFkZGVkIHRvIGBpYC4gVGhlIG92ZXJmbG93IGNoZWNraW5nIGlzIGVhc2llclxuXHRcdFx0Ly8gaWYgd2UgaW5jcmVhc2UgYGlgIGFzIHdlIGdvLCB0aGVuIHN1YnRyYWN0IG9mZiBpdHMgc3RhcnRpbmdcblx0XHRcdC8vIHZhbHVlIGF0IHRoZSBlbmQgdG8gb2J0YWluIGBkZWx0YWAuXG5cdFx0XHRmb3IgKG9sZGkgPSBpLCB3ID0gMSwgayA9IGJhc2U7IC8qIG5vIGNvbmRpdGlvbiAqLzsgayArPSBiYXNlKSB7XG5cblx0XHRcdFx0aWYgKGluZGV4ID49IGlucHV0TGVuZ3RoKSB7XG5cdFx0XHRcdFx0ZXJyb3IoJ2ludmFsaWQtaW5wdXQnKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGRpZ2l0ID0gYmFzaWNUb0RpZ2l0KGlucHV0LmNoYXJDb2RlQXQoaW5kZXgrKykpO1xuXG5cdFx0XHRcdGlmIChkaWdpdCA+PSBiYXNlIHx8IGRpZ2l0ID4gZmxvb3IoKG1heEludCAtIGkpIC8gdykpIHtcblx0XHRcdFx0XHRlcnJvcignb3ZlcmZsb3cnKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGkgKz0gZGlnaXQgKiB3O1xuXHRcdFx0XHR0ID0gayA8PSBiaWFzID8gdE1pbiA6IChrID49IGJpYXMgKyB0TWF4ID8gdE1heCA6IGsgLSBiaWFzKTtcblxuXHRcdFx0XHRpZiAoZGlnaXQgPCB0KSB7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRiYXNlTWludXNUID0gYmFzZSAtIHQ7XG5cdFx0XHRcdGlmICh3ID4gZmxvb3IobWF4SW50IC8gYmFzZU1pbnVzVCkpIHtcblx0XHRcdFx0XHRlcnJvcignb3ZlcmZsb3cnKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHcgKj0gYmFzZU1pbnVzVDtcblxuXHRcdFx0fVxuXG5cdFx0XHRvdXQgPSBvdXRwdXQubGVuZ3RoICsgMTtcblx0XHRcdGJpYXMgPSBhZGFwdChpIC0gb2xkaSwgb3V0LCBvbGRpID09IDApO1xuXG5cdFx0XHQvLyBgaWAgd2FzIHN1cHBvc2VkIHRvIHdyYXAgYXJvdW5kIGZyb20gYG91dGAgdG8gYDBgLFxuXHRcdFx0Ly8gaW5jcmVtZW50aW5nIGBuYCBlYWNoIHRpbWUsIHNvIHdlJ2xsIGZpeCB0aGF0IG5vdzpcblx0XHRcdGlmIChmbG9vcihpIC8gb3V0KSA+IG1heEludCAtIG4pIHtcblx0XHRcdFx0ZXJyb3IoJ292ZXJmbG93Jyk7XG5cdFx0XHR9XG5cblx0XHRcdG4gKz0gZmxvb3IoaSAvIG91dCk7XG5cdFx0XHRpICU9IG91dDtcblxuXHRcdFx0Ly8gSW5zZXJ0IGBuYCBhdCBwb3NpdGlvbiBgaWAgb2YgdGhlIG91dHB1dFxuXHRcdFx0b3V0cHV0LnNwbGljZShpKyssIDAsIG4pO1xuXG5cdFx0fVxuXG5cdFx0cmV0dXJuIHVjczJlbmNvZGUob3V0cHV0KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDb252ZXJ0cyBhIHN0cmluZyBvZiBVbmljb2RlIHN5bWJvbHMgKGUuZy4gYSBkb21haW4gbmFtZSBsYWJlbCkgdG8gYVxuXHQgKiBQdW55Y29kZSBzdHJpbmcgb2YgQVNDSUktb25seSBzeW1ib2xzLlxuXHQgKiBAbWVtYmVyT2YgcHVueWNvZGVcblx0ICogQHBhcmFtIHtTdHJpbmd9IGlucHV0IFRoZSBzdHJpbmcgb2YgVW5pY29kZSBzeW1ib2xzLlxuXHQgKiBAcmV0dXJucyB7U3RyaW5nfSBUaGUgcmVzdWx0aW5nIFB1bnljb2RlIHN0cmluZyBvZiBBU0NJSS1vbmx5IHN5bWJvbHMuXG5cdCAqL1xuXHRmdW5jdGlvbiBlbmNvZGUoaW5wdXQpIHtcblx0XHR2YXIgbixcblx0XHQgICAgZGVsdGEsXG5cdFx0ICAgIGhhbmRsZWRDUENvdW50LFxuXHRcdCAgICBiYXNpY0xlbmd0aCxcblx0XHQgICAgYmlhcyxcblx0XHQgICAgaixcblx0XHQgICAgbSxcblx0XHQgICAgcSxcblx0XHQgICAgayxcblx0XHQgICAgdCxcblx0XHQgICAgY3VycmVudFZhbHVlLFxuXHRcdCAgICBvdXRwdXQgPSBbXSxcblx0XHQgICAgLyoqIGBpbnB1dExlbmd0aGAgd2lsbCBob2xkIHRoZSBudW1iZXIgb2YgY29kZSBwb2ludHMgaW4gYGlucHV0YC4gKi9cblx0XHQgICAgaW5wdXRMZW5ndGgsXG5cdFx0ICAgIC8qKiBDYWNoZWQgY2FsY3VsYXRpb24gcmVzdWx0cyAqL1xuXHRcdCAgICBoYW5kbGVkQ1BDb3VudFBsdXNPbmUsXG5cdFx0ICAgIGJhc2VNaW51c1QsXG5cdFx0ICAgIHFNaW51c1Q7XG5cblx0XHQvLyBDb252ZXJ0IHRoZSBpbnB1dCBpbiBVQ1MtMiB0byBVbmljb2RlXG5cdFx0aW5wdXQgPSB1Y3MyZGVjb2RlKGlucHV0KTtcblxuXHRcdC8vIENhY2hlIHRoZSBsZW5ndGhcblx0XHRpbnB1dExlbmd0aCA9IGlucHV0Lmxlbmd0aDtcblxuXHRcdC8vIEluaXRpYWxpemUgdGhlIHN0YXRlXG5cdFx0biA9IGluaXRpYWxOO1xuXHRcdGRlbHRhID0gMDtcblx0XHRiaWFzID0gaW5pdGlhbEJpYXM7XG5cblx0XHQvLyBIYW5kbGUgdGhlIGJhc2ljIGNvZGUgcG9pbnRzXG5cdFx0Zm9yIChqID0gMDsgaiA8IGlucHV0TGVuZ3RoOyArK2opIHtcblx0XHRcdGN1cnJlbnRWYWx1ZSA9IGlucHV0W2pdO1xuXHRcdFx0aWYgKGN1cnJlbnRWYWx1ZSA8IDB4ODApIHtcblx0XHRcdFx0b3V0cHV0LnB1c2goc3RyaW5nRnJvbUNoYXJDb2RlKGN1cnJlbnRWYWx1ZSkpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGhhbmRsZWRDUENvdW50ID0gYmFzaWNMZW5ndGggPSBvdXRwdXQubGVuZ3RoO1xuXG5cdFx0Ly8gYGhhbmRsZWRDUENvdW50YCBpcyB0aGUgbnVtYmVyIG9mIGNvZGUgcG9pbnRzIHRoYXQgaGF2ZSBiZWVuIGhhbmRsZWQ7XG5cdFx0Ly8gYGJhc2ljTGVuZ3RoYCBpcyB0aGUgbnVtYmVyIG9mIGJhc2ljIGNvZGUgcG9pbnRzLlxuXG5cdFx0Ly8gRmluaXNoIHRoZSBiYXNpYyBzdHJpbmcgLSBpZiBpdCBpcyBub3QgZW1wdHkgLSB3aXRoIGEgZGVsaW1pdGVyXG5cdFx0aWYgKGJhc2ljTGVuZ3RoKSB7XG5cdFx0XHRvdXRwdXQucHVzaChkZWxpbWl0ZXIpO1xuXHRcdH1cblxuXHRcdC8vIE1haW4gZW5jb2RpbmcgbG9vcDpcblx0XHR3aGlsZSAoaGFuZGxlZENQQ291bnQgPCBpbnB1dExlbmd0aCkge1xuXG5cdFx0XHQvLyBBbGwgbm9uLWJhc2ljIGNvZGUgcG9pbnRzIDwgbiBoYXZlIGJlZW4gaGFuZGxlZCBhbHJlYWR5LiBGaW5kIHRoZSBuZXh0XG5cdFx0XHQvLyBsYXJnZXIgb25lOlxuXHRcdFx0Zm9yIChtID0gbWF4SW50LCBqID0gMDsgaiA8IGlucHV0TGVuZ3RoOyArK2opIHtcblx0XHRcdFx0Y3VycmVudFZhbHVlID0gaW5wdXRbal07XG5cdFx0XHRcdGlmIChjdXJyZW50VmFsdWUgPj0gbiAmJiBjdXJyZW50VmFsdWUgPCBtKSB7XG5cdFx0XHRcdFx0bSA9IGN1cnJlbnRWYWx1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBJbmNyZWFzZSBgZGVsdGFgIGVub3VnaCB0byBhZHZhbmNlIHRoZSBkZWNvZGVyJ3MgPG4saT4gc3RhdGUgdG8gPG0sMD4sXG5cdFx0XHQvLyBidXQgZ3VhcmQgYWdhaW5zdCBvdmVyZmxvd1xuXHRcdFx0aGFuZGxlZENQQ291bnRQbHVzT25lID0gaGFuZGxlZENQQ291bnQgKyAxO1xuXHRcdFx0aWYgKG0gLSBuID4gZmxvb3IoKG1heEludCAtIGRlbHRhKSAvIGhhbmRsZWRDUENvdW50UGx1c09uZSkpIHtcblx0XHRcdFx0ZXJyb3IoJ292ZXJmbG93Jyk7XG5cdFx0XHR9XG5cblx0XHRcdGRlbHRhICs9IChtIC0gbikgKiBoYW5kbGVkQ1BDb3VudFBsdXNPbmU7XG5cdFx0XHRuID0gbTtcblxuXHRcdFx0Zm9yIChqID0gMDsgaiA8IGlucHV0TGVuZ3RoOyArK2opIHtcblx0XHRcdFx0Y3VycmVudFZhbHVlID0gaW5wdXRbal07XG5cblx0XHRcdFx0aWYgKGN1cnJlbnRWYWx1ZSA8IG4gJiYgKytkZWx0YSA+IG1heEludCkge1xuXHRcdFx0XHRcdGVycm9yKCdvdmVyZmxvdycpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKGN1cnJlbnRWYWx1ZSA9PSBuKSB7XG5cdFx0XHRcdFx0Ly8gUmVwcmVzZW50IGRlbHRhIGFzIGEgZ2VuZXJhbGl6ZWQgdmFyaWFibGUtbGVuZ3RoIGludGVnZXJcblx0XHRcdFx0XHRmb3IgKHEgPSBkZWx0YSwgayA9IGJhc2U7IC8qIG5vIGNvbmRpdGlvbiAqLzsgayArPSBiYXNlKSB7XG5cdFx0XHRcdFx0XHR0ID0gayA8PSBiaWFzID8gdE1pbiA6IChrID49IGJpYXMgKyB0TWF4ID8gdE1heCA6IGsgLSBiaWFzKTtcblx0XHRcdFx0XHRcdGlmIChxIDwgdCkge1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHFNaW51c1QgPSBxIC0gdDtcblx0XHRcdFx0XHRcdGJhc2VNaW51c1QgPSBiYXNlIC0gdDtcblx0XHRcdFx0XHRcdG91dHB1dC5wdXNoKFxuXHRcdFx0XHRcdFx0XHRzdHJpbmdGcm9tQ2hhckNvZGUoZGlnaXRUb0Jhc2ljKHQgKyBxTWludXNUICUgYmFzZU1pbnVzVCwgMCkpXG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdFx0cSA9IGZsb29yKHFNaW51c1QgLyBiYXNlTWludXNUKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRvdXRwdXQucHVzaChzdHJpbmdGcm9tQ2hhckNvZGUoZGlnaXRUb0Jhc2ljKHEsIDApKSk7XG5cdFx0XHRcdFx0YmlhcyA9IGFkYXB0KGRlbHRhLCBoYW5kbGVkQ1BDb3VudFBsdXNPbmUsIGhhbmRsZWRDUENvdW50ID09IGJhc2ljTGVuZ3RoKTtcblx0XHRcdFx0XHRkZWx0YSA9IDA7XG5cdFx0XHRcdFx0KytoYW5kbGVkQ1BDb3VudDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQrK2RlbHRhO1xuXHRcdFx0KytuO1xuXG5cdFx0fVxuXHRcdHJldHVybiBvdXRwdXQuam9pbignJyk7XG5cdH1cblxuXHQvKipcblx0ICogQ29udmVydHMgYSBQdW55Y29kZSBzdHJpbmcgcmVwcmVzZW50aW5nIGEgZG9tYWluIG5hbWUgb3IgYW4gZW1haWwgYWRkcmVzc1xuXHQgKiB0byBVbmljb2RlLiBPbmx5IHRoZSBQdW55Y29kZWQgcGFydHMgb2YgdGhlIGlucHV0IHdpbGwgYmUgY29udmVydGVkLCBpLmUuXG5cdCAqIGl0IGRvZXNuJ3QgbWF0dGVyIGlmIHlvdSBjYWxsIGl0IG9uIGEgc3RyaW5nIHRoYXQgaGFzIGFscmVhZHkgYmVlblxuXHQgKiBjb252ZXJ0ZWQgdG8gVW5pY29kZS5cblx0ICogQG1lbWJlck9mIHB1bnljb2RlXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBpbnB1dCBUaGUgUHVueWNvZGVkIGRvbWFpbiBuYW1lIG9yIGVtYWlsIGFkZHJlc3MgdG9cblx0ICogY29udmVydCB0byBVbmljb2RlLlxuXHQgKiBAcmV0dXJucyB7U3RyaW5nfSBUaGUgVW5pY29kZSByZXByZXNlbnRhdGlvbiBvZiB0aGUgZ2l2ZW4gUHVueWNvZGVcblx0ICogc3RyaW5nLlxuXHQgKi9cblx0ZnVuY3Rpb24gdG9Vbmljb2RlKGlucHV0KSB7XG5cdFx0cmV0dXJuIG1hcERvbWFpbihpbnB1dCwgZnVuY3Rpb24oc3RyaW5nKSB7XG5cdFx0XHRyZXR1cm4gcmVnZXhQdW55Y29kZS50ZXN0KHN0cmluZylcblx0XHRcdFx0PyBkZWNvZGUoc3RyaW5nLnNsaWNlKDQpLnRvTG93ZXJDYXNlKCkpXG5cdFx0XHRcdDogc3RyaW5nO1xuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIENvbnZlcnRzIGEgVW5pY29kZSBzdHJpbmcgcmVwcmVzZW50aW5nIGEgZG9tYWluIG5hbWUgb3IgYW4gZW1haWwgYWRkcmVzcyB0b1xuXHQgKiBQdW55Y29kZS4gT25seSB0aGUgbm9uLUFTQ0lJIHBhcnRzIG9mIHRoZSBkb21haW4gbmFtZSB3aWxsIGJlIGNvbnZlcnRlZCxcblx0ICogaS5lLiBpdCBkb2Vzbid0IG1hdHRlciBpZiB5b3UgY2FsbCBpdCB3aXRoIGEgZG9tYWluIHRoYXQncyBhbHJlYWR5IGluXG5cdCAqIEFTQ0lJLlxuXHQgKiBAbWVtYmVyT2YgcHVueWNvZGVcblx0ICogQHBhcmFtIHtTdHJpbmd9IGlucHV0IFRoZSBkb21haW4gbmFtZSBvciBlbWFpbCBhZGRyZXNzIHRvIGNvbnZlcnQsIGFzIGFcblx0ICogVW5pY29kZSBzdHJpbmcuXG5cdCAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSBQdW55Y29kZSByZXByZXNlbnRhdGlvbiBvZiB0aGUgZ2l2ZW4gZG9tYWluIG5hbWUgb3Jcblx0ICogZW1haWwgYWRkcmVzcy5cblx0ICovXG5cdGZ1bmN0aW9uIHRvQVNDSUkoaW5wdXQpIHtcblx0XHRyZXR1cm4gbWFwRG9tYWluKGlucHV0LCBmdW5jdGlvbihzdHJpbmcpIHtcblx0XHRcdHJldHVybiByZWdleE5vbkFTQ0lJLnRlc3Qoc3RyaW5nKVxuXHRcdFx0XHQ/ICd4bi0tJyArIGVuY29kZShzdHJpbmcpXG5cdFx0XHRcdDogc3RyaW5nO1xuXHRcdH0pO1xuXHR9XG5cblx0LyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cblx0LyoqIERlZmluZSB0aGUgcHVibGljIEFQSSAqL1xuXHRwdW55Y29kZSA9IHtcblx0XHQvKipcblx0XHQgKiBBIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIGN1cnJlbnQgUHVueWNvZGUuanMgdmVyc2lvbiBudW1iZXIuXG5cdFx0ICogQG1lbWJlck9mIHB1bnljb2RlXG5cdFx0ICogQHR5cGUgU3RyaW5nXG5cdFx0ICovXG5cdFx0J3ZlcnNpb24nOiAnMS4zLjInLFxuXHRcdC8qKlxuXHRcdCAqIEFuIG9iamVjdCBvZiBtZXRob2RzIHRvIGNvbnZlcnQgZnJvbSBKYXZhU2NyaXB0J3MgaW50ZXJuYWwgY2hhcmFjdGVyXG5cdFx0ICogcmVwcmVzZW50YXRpb24gKFVDUy0yKSB0byBVbmljb2RlIGNvZGUgcG9pbnRzLCBhbmQgYmFjay5cblx0XHQgKiBAc2VlIDxodHRwczovL21hdGhpYXNieW5lbnMuYmUvbm90ZXMvamF2YXNjcmlwdC1lbmNvZGluZz5cblx0XHQgKiBAbWVtYmVyT2YgcHVueWNvZGVcblx0XHQgKiBAdHlwZSBPYmplY3Rcblx0XHQgKi9cblx0XHQndWNzMic6IHtcblx0XHRcdCdkZWNvZGUnOiB1Y3MyZGVjb2RlLFxuXHRcdFx0J2VuY29kZSc6IHVjczJlbmNvZGVcblx0XHR9LFxuXHRcdCdkZWNvZGUnOiBkZWNvZGUsXG5cdFx0J2VuY29kZSc6IGVuY29kZSxcblx0XHQndG9BU0NJSSc6IHRvQVNDSUksXG5cdFx0J3RvVW5pY29kZSc6IHRvVW5pY29kZVxuXHR9O1xuXG5cdC8qKiBFeHBvc2UgYHB1bnljb2RlYCAqL1xuXHQvLyBTb21lIEFNRCBidWlsZCBvcHRpbWl6ZXJzLCBsaWtlIHIuanMsIGNoZWNrIGZvciBzcGVjaWZpYyBjb25kaXRpb24gcGF0dGVybnNcblx0Ly8gbGlrZSB0aGUgZm9sbG93aW5nOlxuXHRpZiAoXG5cdFx0dHlwZW9mIGRlZmluZSA9PSAnZnVuY3Rpb24nICYmXG5cdFx0dHlwZW9mIGRlZmluZS5hbWQgPT0gJ29iamVjdCcgJiZcblx0XHRkZWZpbmUuYW1kXG5cdCkge1xuXHRcdGRlZmluZSgncHVueWNvZGUnLCBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBwdW55Y29kZTtcblx0XHR9KTtcblx0fSBlbHNlIGlmIChmcmVlRXhwb3J0cyAmJiBmcmVlTW9kdWxlKSB7XG5cdFx0aWYgKG1vZHVsZS5leHBvcnRzID09IGZyZWVFeHBvcnRzKSB7IC8vIGluIE5vZGUuanMgb3IgUmluZ29KUyB2MC44LjArXG5cdFx0XHRmcmVlTW9kdWxlLmV4cG9ydHMgPSBwdW55Y29kZTtcblx0XHR9IGVsc2UgeyAvLyBpbiBOYXJ3aGFsIG9yIFJpbmdvSlMgdjAuNy4wLVxuXHRcdFx0Zm9yIChrZXkgaW4gcHVueWNvZGUpIHtcblx0XHRcdFx0cHVueWNvZGUuaGFzT3duUHJvcGVydHkoa2V5KSAmJiAoZnJlZUV4cG9ydHNba2V5XSA9IHB1bnljb2RlW2tleV0pO1xuXHRcdFx0fVxuXHRcdH1cblx0fSBlbHNlIHsgLy8gaW4gUmhpbm8gb3IgYSB3ZWIgYnJvd3NlclxuXHRcdHJvb3QucHVueWNvZGUgPSBwdW55Y29kZTtcblx0fVxuXG59KHRoaXMpKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi91cmwvfi9wdW55Y29kZS9wdW55Y29kZS5qc1xuLy8gbW9kdWxlIGlkID0gMTdcbi8vIG1vZHVsZSBjaHVua3MgPSAxIDIgMyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obW9kdWxlKSB7XHJcblx0aWYoIW1vZHVsZS53ZWJwYWNrUG9seWZpbGwpIHtcclxuXHRcdG1vZHVsZS5kZXByZWNhdGUgPSBmdW5jdGlvbigpIHt9O1xyXG5cdFx0bW9kdWxlLnBhdGhzID0gW107XHJcblx0XHQvLyBtb2R1bGUucGFyZW50ID0gdW5kZWZpbmVkIGJ5IGRlZmF1bHRcclxuXHRcdG1vZHVsZS5jaGlsZHJlbiA9IFtdO1xyXG5cdFx0bW9kdWxlLndlYnBhY2tQb2x5ZmlsbCA9IDE7XHJcblx0fVxyXG5cdHJldHVybiBtb2R1bGU7XHJcbn1cclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gKHdlYnBhY2spL2J1aWxkaW4vbW9kdWxlLmpzXG4vLyBtb2R1bGUgaWQgPSAxOFxuLy8gbW9kdWxlIGNodW5rcyA9IDEgMiAzIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgaXNTdHJpbmc6IGZ1bmN0aW9uKGFyZykge1xuICAgIHJldHVybiB0eXBlb2YoYXJnKSA9PT0gJ3N0cmluZyc7XG4gIH0sXG4gIGlzT2JqZWN0OiBmdW5jdGlvbihhcmcpIHtcbiAgICByZXR1cm4gdHlwZW9mKGFyZykgPT09ICdvYmplY3QnICYmIGFyZyAhPT0gbnVsbDtcbiAgfSxcbiAgaXNOdWxsOiBmdW5jdGlvbihhcmcpIHtcbiAgICByZXR1cm4gYXJnID09PSBudWxsO1xuICB9LFxuICBpc051bGxPclVuZGVmaW5lZDogZnVuY3Rpb24oYXJnKSB7XG4gICAgcmV0dXJuIGFyZyA9PSBudWxsO1xuICB9XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3VybC91dGlsLmpzXG4vLyBtb2R1bGUgaWQgPSAxOVxuLy8gbW9kdWxlIGNodW5rcyA9IDEgMiAzIiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLmRlY29kZSA9IGV4cG9ydHMucGFyc2UgPSByZXF1aXJlKCcuL2RlY29kZScpO1xuZXhwb3J0cy5lbmNvZGUgPSBleHBvcnRzLnN0cmluZ2lmeSA9IHJlcXVpcmUoJy4vZW5jb2RlJyk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcXVlcnlzdHJpbmcvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDIwXG4vLyBtb2R1bGUgY2h1bmtzID0gMSAyIDMiLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuJ3VzZSBzdHJpY3QnO1xuXG4vLyBJZiBvYmouaGFzT3duUHJvcGVydHkgaGFzIGJlZW4gb3ZlcnJpZGRlbiwgdGhlbiBjYWxsaW5nXG4vLyBvYmouaGFzT3duUHJvcGVydHkocHJvcCkgd2lsbCBicmVhay5cbi8vIFNlZTogaHR0cHM6Ly9naXRodWIuY29tL2pveWVudC9ub2RlL2lzc3Vlcy8xNzA3XG5mdW5jdGlvbiBoYXNPd25Qcm9wZXJ0eShvYmosIHByb3ApIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHFzLCBzZXAsIGVxLCBvcHRpb25zKSB7XG4gIHNlcCA9IHNlcCB8fCAnJic7XG4gIGVxID0gZXEgfHwgJz0nO1xuICB2YXIgb2JqID0ge307XG5cbiAgaWYgKHR5cGVvZiBxcyAhPT0gJ3N0cmluZycgfHwgcXMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIG9iajtcbiAgfVxuXG4gIHZhciByZWdleHAgPSAvXFwrL2c7XG4gIHFzID0gcXMuc3BsaXQoc2VwKTtcblxuICB2YXIgbWF4S2V5cyA9IDEwMDA7XG4gIGlmIChvcHRpb25zICYmIHR5cGVvZiBvcHRpb25zLm1heEtleXMgPT09ICdudW1iZXInKSB7XG4gICAgbWF4S2V5cyA9IG9wdGlvbnMubWF4S2V5cztcbiAgfVxuXG4gIHZhciBsZW4gPSBxcy5sZW5ndGg7XG4gIC8vIG1heEtleXMgPD0gMCBtZWFucyB0aGF0IHdlIHNob3VsZCBub3QgbGltaXQga2V5cyBjb3VudFxuICBpZiAobWF4S2V5cyA+IDAgJiYgbGVuID4gbWF4S2V5cykge1xuICAgIGxlbiA9IG1heEtleXM7XG4gIH1cblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgKytpKSB7XG4gICAgdmFyIHggPSBxc1tpXS5yZXBsYWNlKHJlZ2V4cCwgJyUyMCcpLFxuICAgICAgICBpZHggPSB4LmluZGV4T2YoZXEpLFxuICAgICAgICBrc3RyLCB2c3RyLCBrLCB2O1xuXG4gICAgaWYgKGlkeCA+PSAwKSB7XG4gICAgICBrc3RyID0geC5zdWJzdHIoMCwgaWR4KTtcbiAgICAgIHZzdHIgPSB4LnN1YnN0cihpZHggKyAxKTtcbiAgICB9IGVsc2Uge1xuICAgICAga3N0ciA9IHg7XG4gICAgICB2c3RyID0gJyc7XG4gICAgfVxuXG4gICAgayA9IGRlY29kZVVSSUNvbXBvbmVudChrc3RyKTtcbiAgICB2ID0gZGVjb2RlVVJJQ29tcG9uZW50KHZzdHIpO1xuXG4gICAgaWYgKCFoYXNPd25Qcm9wZXJ0eShvYmosIGspKSB7XG4gICAgICBvYmpba10gPSB2O1xuICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShvYmpba10pKSB7XG4gICAgICBvYmpba10ucHVzaCh2KTtcbiAgICB9IGVsc2Uge1xuICAgICAgb2JqW2tdID0gW29ialtrXSwgdl07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG9iajtcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcXVlcnlzdHJpbmcvZGVjb2RlLmpzXG4vLyBtb2R1bGUgaWQgPSAyMVxuLy8gbW9kdWxlIGNodW5rcyA9IDEgMiAzIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIHN0cmluZ2lmeVByaW1pdGl2ZSA9IGZ1bmN0aW9uKHYpIHtcbiAgc3dpdGNoICh0eXBlb2Ygdikge1xuICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICByZXR1cm4gdjtcblxuICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgcmV0dXJuIHYgPyAndHJ1ZScgOiAnZmFsc2UnO1xuXG4gICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgIHJldHVybiBpc0Zpbml0ZSh2KSA/IHYgOiAnJztcblxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gJyc7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob2JqLCBzZXAsIGVxLCBuYW1lKSB7XG4gIHNlcCA9IHNlcCB8fCAnJic7XG4gIGVxID0gZXEgfHwgJz0nO1xuICBpZiAob2JqID09PSBudWxsKSB7XG4gICAgb2JqID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBvYmogPT09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKG9iaikubWFwKGZ1bmN0aW9uKGspIHtcbiAgICAgIHZhciBrcyA9IGVuY29kZVVSSUNvbXBvbmVudChzdHJpbmdpZnlQcmltaXRpdmUoaykpICsgZXE7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShvYmpba10pKSB7XG4gICAgICAgIHJldHVybiBvYmpba10ubWFwKGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgICByZXR1cm4ga3MgKyBlbmNvZGVVUklDb21wb25lbnQoc3RyaW5naWZ5UHJpbWl0aXZlKHYpKTtcbiAgICAgICAgfSkuam9pbihzZXApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGtzICsgZW5jb2RlVVJJQ29tcG9uZW50KHN0cmluZ2lmeVByaW1pdGl2ZShvYmpba10pKTtcbiAgICAgIH1cbiAgICB9KS5qb2luKHNlcCk7XG5cbiAgfVxuXG4gIGlmICghbmFtZSkgcmV0dXJuICcnO1xuICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHN0cmluZ2lmeVByaW1pdGl2ZShuYW1lKSkgKyBlcSArXG4gICAgICAgICBlbmNvZGVVUklDb21wb25lbnQoc3RyaW5naWZ5UHJpbWl0aXZlKG9iaikpO1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9xdWVyeXN0cmluZy9lbmNvZGUuanNcbi8vIG1vZHVsZSBpZCA9IDIyXG4vLyBtb2R1bGUgY2h1bmtzID0gMSAyIDMiLCJcInVzZSBzdHJpY3RcIjtcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxudmFyIF9VdGlsc1dpbmRvdyA9IHJlcXVpcmUoXCIuL1V0aWxzV2luZG93XCIpO1xuXG52YXIgX1V0aWxzV2luZG93MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX1V0aWxzV2luZG93KTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuLyoqXG4gKiBDbGFzcyBmb3Igd29ya2luZyB3aXRoIGRvY3VtZW50XG4gKi9cbnZhciBEb2N1bWVudCA9IGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBEb2N1bWVudCgpIHtcbiAgICAgICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIERvY3VtZW50KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgZG9jdW1lbnQgaGVpZ2h0XG4gICAgICogQHJldHVybnMge251bWJlcn1cbiAgICAgKi9cbiAgICBEb2N1bWVudC5nZXRIZWlnaHQgPSBmdW5jdGlvbiBnZXRIZWlnaHQoKSB7XG4gICAgICAgIHZhciBvYmpXaW5kb3cgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHdpbmRvdztcblxuICAgICAgICBpZiAoX1V0aWxzV2luZG93Mi5kZWZhdWx0LmlzV2luZG93KG9ialdpbmRvdykpIHtcbiAgICAgICAgICAgIHJldHVybiBNYXRoLm1heChvYmpXaW5kb3cuZG9jdW1lbnQuYm9keS5zY3JvbGxIZWlnaHQsIG9ialdpbmRvdy5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsSGVpZ2h0LCBvYmpXaW5kb3cuZG9jdW1lbnQuYm9keS5vZmZzZXRIZWlnaHQsIG9ialdpbmRvdy5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQub2Zmc2V0SGVpZ2h0LCBvYmpXaW5kb3cuZG9jdW1lbnQuYm9keS5jbGllbnRIZWlnaHQsIG9ialdpbmRvdy5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBOYU47XG4gICAgICAgIH1cbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEdldCBkb2N1bWVudCB3aWR0aFxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAgICovXG5cblxuICAgIERvY3VtZW50LmdldFdpZHRoID0gZnVuY3Rpb24gZ2V0V2lkdGgoKSB7XG4gICAgICAgIHZhciBvYmpXaW5kb3cgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHdpbmRvdztcblxuICAgICAgICBpZiAoX1V0aWxzV2luZG93Mi5kZWZhdWx0LmlzV2luZG93KG9ialdpbmRvdykpIHtcbiAgICAgICAgICAgIHJldHVybiBNYXRoLm1heChvYmpXaW5kb3cuZG9jdW1lbnQuYm9keS5zY3JvbGxXaWR0aCwgb2JqV2luZG93LmRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxXaWR0aCwgb2JqV2luZG93LmRvY3VtZW50LmJvZHkub2Zmc2V0V2lkdGgsIG9ialdpbmRvdy5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQub2Zmc2V0V2lkdGgsIG9ialdpbmRvdy5kb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoLCBvYmpXaW5kb3cuZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBOYU47XG4gICAgICAgIH1cbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEdldCBkb2N1bWVudCB0b3Agc2Nyb2xsXG4gICAgICogQHBhcmFtIG9ialdpbmRvd1xuICAgICAqIEByZXR1cm4ge251bWJlcn1cbiAgICAgKi9cblxuXG4gICAgRG9jdW1lbnQuZ2V0U2Nyb2xsVG9wID0gZnVuY3Rpb24gZ2V0U2Nyb2xsVG9wKCkge1xuICAgICAgICB2YXIgb2JqV2luZG93ID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB3aW5kb3c7XG5cbiAgICAgICAgaWYgKF9VdGlsc1dpbmRvdzIuZGVmYXVsdC5pc1dpbmRvdyhvYmpXaW5kb3cpKSB7XG4gICAgICAgICAgICByZXR1cm4gb2JqV2luZG93LnBhZ2VZT2Zmc2V0IHx8IG9ialdpbmRvdy5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgJiYgb2JqV2luZG93LmRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3AgfHwgb2JqV2luZG93LmRvY3VtZW50LmJvZHkgJiYgb2JqV2luZG93LmRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIE5hTjtcbiAgICAgICAgfVxuICAgIH07XG4gICAgLyoqXG4gICAgICogR2V0IGRvY3VtZW50IGxlZnQgc2Nyb2xsXG4gICAgICogQHBhcmFtIG9ialdpbmRvd1xuICAgICAqIEByZXR1cm4ge251bWJlcn1cbiAgICAgKi9cblxuXG4gICAgRG9jdW1lbnQuZ2V0U2Nyb2xsTGVmdCA9IGZ1bmN0aW9uIGdldFNjcm9sbExlZnQoKSB7XG4gICAgICAgIHZhciBvYmpXaW5kb3cgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHdpbmRvdztcblxuICAgICAgICBpZiAoX1V0aWxzV2luZG93Mi5kZWZhdWx0LmlzV2luZG93KG9ialdpbmRvdykpIHtcbiAgICAgICAgICAgIHJldHVybiBvYmpXaW5kb3cucGFnZVhPZmZzZXQgfHwgb2JqV2luZG93LmRvY3VtZW50LmRvY3VtZW50RWxlbWVudCAmJiBvYmpXaW5kb3cuZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbExlZnQgfHwgb2JqV2luZG93LmRvY3VtZW50LmJvZHkgJiYgb2JqV2luZG93LmRvY3VtZW50LmJvZHkuc2Nyb2xsTGVmdDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBOYU47XG4gICAgICAgIH1cbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEdldCBkb2N1bWVudCBzY3JvbGxzXG4gICAgICogQHBhcmFtIG9ialdpbmRvd1xuICAgICAqIEByZXR1cm4ge3tsZWZ0OiBudW1iZXIsIHRvcDogbnVtYmVyfX1cbiAgICAgKi9cblxuXG4gICAgRG9jdW1lbnQuZ2V0U2Nyb2xsID0gZnVuY3Rpb24gZ2V0U2Nyb2xsKCkge1xuICAgICAgICB2YXIgb2JqV2luZG93ID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB3aW5kb3c7XG5cbiAgICAgICAgaWYgKF9VdGlsc1dpbmRvdzIuZGVmYXVsdC5pc1dpbmRvdyhvYmpXaW5kb3cpKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGxlZnQ6IERvY3VtZW50LmdldFNjcm9sbExlZnQob2JqV2luZG93KSxcbiAgICAgICAgICAgICAgICB0b3A6IERvY3VtZW50LmdldFNjcm9sbFRvcChvYmpXaW5kb3cpXG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBsZWZ0OiBOYU4sXG4gICAgICAgICAgICAgICAgdG9wOiBOYU5cbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIERvY3VtZW50O1xufSgpO1xuXG5leHBvcnRzLmRlZmF1bHQgPSBEb2N1bWVudDtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vVXRpbHMvbGliL1V0aWxzRG9jdW1lbnQudHNcbi8vIG1vZHVsZSBpZCA9IDIzXG4vLyBtb2R1bGUgY2h1bmtzID0gMSAyIDMiLCJcInVzZSBzdHJpY3RcIjtcbi8qKlxuICogQ2xhc3MgZm9yIHdvcmtpbmcgd2l0aCB3aW5kb3dcbiAqL1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX3R5cGVvZiA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiID8gZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfSA6IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbnZhciBXaW5kb3cgPSBmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gV2luZG93KCkge1xuICAgICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgV2luZG93KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVjayBpZiBpdCBpcyB3aW5kb3dcbiAgICAgKiBAcGFyYW0gb2JqV2luZG93XG4gICAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBXaW5kb3cuaXNXaW5kb3cgPSBmdW5jdGlvbiBpc1dpbmRvdyhvYmpXaW5kb3cpIHtcbiAgICAgICAgcmV0dXJuIG9ialdpbmRvdyAmJiAodHlwZW9mIG9ialdpbmRvdyA9PT0gXCJ1bmRlZmluZWRcIiA/IFwidW5kZWZpbmVkXCIgOiBfdHlwZW9mKG9ialdpbmRvdykpID09PSBcIm9iamVjdFwiICYmIG9ialdpbmRvdy5kb2N1bWVudCAmJiBfdHlwZW9mKG9ialdpbmRvdy5kb2N1bWVudCkgPT09IFwib2JqZWN0XCI7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBHZXQgd2luZG93IGhlaWdodFxuICAgICAqIEBwYXJhbSBvYmpXaW5kb3dcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9XG4gICAgICovXG5cblxuICAgIFdpbmRvdy5nZXRIZWlnaHQgPSBmdW5jdGlvbiBnZXRIZWlnaHQoKSB7XG4gICAgICAgIHZhciBvYmpXaW5kb3cgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHdpbmRvdztcblxuICAgICAgICBpZiAoV2luZG93LmlzV2luZG93KG9ialdpbmRvdykpIHtcbiAgICAgICAgICAgIHJldHVybiBvYmpXaW5kb3cuaW5uZXJIZWlnaHQgfHwgb2JqV2luZG93LmRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQgfHwgb2JqV2luZG93LmRvY3VtZW50LmJvZHkuY2xpZW50SGVpZ2h0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIE5hTjtcbiAgICAgICAgfVxuICAgIH07XG4gICAgLyoqXG4gICAgICogR2V0IHdpbmRvdyB3aWR0aFxuICAgICAqIEBwYXJhbSBvYmpXaW5kb3dcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9XG4gICAgICovXG5cblxuICAgIFdpbmRvdy5nZXRXaWR0aCA9IGZ1bmN0aW9uIGdldFdpZHRoKCkge1xuICAgICAgICB2YXIgb2JqV2luZG93ID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB3aW5kb3c7XG5cbiAgICAgICAgaWYgKFdpbmRvdy5pc1dpbmRvdyhvYmpXaW5kb3cpKSB7XG4gICAgICAgICAgICByZXR1cm4gb2JqV2luZG93LmlubmVyV2lkdGggfHwgb2JqV2luZG93LmRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCB8fCBvYmpXaW5kb3cuZG9jdW1lbnQuYm9keS5jbGllbnRXaWR0aDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBOYU47XG4gICAgICAgIH1cbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEdldCB3aW5kb3cgc2l6ZXNcbiAgICAgKiBAcmV0dXJuIHt7aGVpZ2h0OiBudW1iZXIsIHdpZHRoOiBudW1iZXJ9fVxuICAgICAqL1xuXG5cbiAgICBXaW5kb3cuZ2V0U2l6ZXMgPSBmdW5jdGlvbiBnZXRTaXplcygpIHtcbiAgICAgICAgdmFyIG9ialdpbmRvdyA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogd2luZG93O1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBoZWlnaHQ6IFdpbmRvdy5nZXRIZWlnaHQob2JqV2luZG93KSxcbiAgICAgICAgICAgIHdpZHRoOiBXaW5kb3cuZ2V0V2lkdGgob2JqV2luZG93KVxuICAgICAgICB9O1xuICAgIH07XG5cbiAgICByZXR1cm4gV2luZG93O1xufSgpO1xuXG5leHBvcnRzLmRlZmF1bHQgPSBXaW5kb3c7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L1V0aWxzL2xpYi9VdGlsc1dpbmRvdy50c1xuLy8gbW9kdWxlIGlkID0gMjRcbi8vIG1vZHVsZSBjaHVua3MgPSAxIDIgMyIsIlwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX3R5cGVvZiA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiID8gZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfSA6IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07XG5cbnZhciBfVXRpbHMgPSByZXF1aXJlKFwiLi9VdGlsc1wiKTtcblxudmFyIF9VdGlsczIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9VdGlscyk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbi8qKlxuICogQ2xhc3MgZm9yIHdvcmtpbmcgd2l0aCBET01cbiAqL1xudmFyIERPTSA9IGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBET00oKSB7XG4gICAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBET00pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrIGlmIHZhcmlhYmxlIGlzIGRvbSBkb2N1bWVudFxuICAgICAqIEBwYXJhbSBkb21Eb2N1bWVudFxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAgICovXG4gICAgRE9NLmlzRE9NRG9jdW1lbnQgPSBmdW5jdGlvbiBpc0RPTURvY3VtZW50KGRvbURvY3VtZW50KSB7XG4gICAgICAgIHJldHVybiAhKCFkb21Eb2N1bWVudCB8fCB0eXBlb2YgZG9tRG9jdW1lbnQgPT09IFwiYm9vbGVhblwiIHx8IHR5cGVvZiBkb21Eb2N1bWVudCA9PT0gXCJudW1iZXJcIiB8fCB0eXBlb2YgZG9tRG9jdW1lbnQgPT09IFwic3RyaW5nXCIgfHwgZG9tRG9jdW1lbnQubm9kZVR5cGUgIT09IDkpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogRmluZCBhbmQgdmFsaWRhdGUgTm9kZSBpbiBET00gRG9jdW1lbnRcbiAgICAgKiBAcGFyYW0gZG9tTm9kZVxuICAgICAqIEBwYXJhbSBkb21Eb2N1bWVudFxuICAgICAqIEByZXR1cm4ge0VsZW1lbnQgfCBib29sZWFufVxuICAgICAqL1xuXG5cbiAgICBET00uZ2V0RE9NTm9kZSA9IGZ1bmN0aW9uIGdldERPTU5vZGUoZG9tTm9kZSkge1xuICAgICAgICB2YXIgZG9tRG9jdW1lbnQgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IGRvY3VtZW50O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDaGVjayBpZiBkb21Eb2N1bWVudCBpcyBhIHZhbGlkIHZhcmlhYmxlXG4gICAgICAgICAqL1xuICAgICAgICBpZiAoIURPTS5pc0RPTURvY3VtZW50KGRvbURvY3VtZW50KSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDaGVjayBpZiBkb21Ob2RlIGlzIGEgdmFsaWQgdmFyaWFibGVcbiAgICAgICAgICovXG4gICAgICAgIGlmICghZG9tTm9kZSB8fCB0eXBlb2YgZG9tTm9kZSA9PT0gXCJib29sZWFuXCIgfHwgdHlwZW9mIGRvbU5vZGUgPT09IFwibnVtYmVyXCIgfHwgdHlwZW9mIGRvbU5vZGUgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICAvKipcbiAgICAgICAgICogSWYgZG9tTm9kZSBpcyBhIHN0cmluZyBpdCBtaWdodCBiZSBhbiBJRFxuICAgICAgICAgKi9cbiAgICAgICAgaWYgKHR5cGVvZiBkb21Ob2RlID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICBkb21Ob2RlID0gZG9tRG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZG9tTm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENoZWNrIGlmIGRvbU5vZGUgaXMgYSB2YWxpZCB2YXJpYWJsZVxuICAgICAgICAgKi9cbiAgICAgICAgaWYgKCFkb21Ob2RlIHx8IGRvbU5vZGUubm9kZVR5cGUgIT09IDEgfHwgIWRvbU5vZGUucGFyZW50Tm9kZSB8fCBkb21Ob2RlLnBhcmVudE5vZGUubm9kZU5hbWUgPT09IFwiSFRNTFwiIHx8ICFkb21Eb2N1bWVudC5jb250YWlucyhkb21Ob2RlKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkb21Ob2RlO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogR2V0IGVsZW1lbnQgc2l6ZXMgYW5kIHBvc2l0aW9uXG4gICAgICogQHBhcmFtIGRvbU5vZGVcbiAgICAgKiBAcGFyYW0gZG9tRG9jdW1lbnRcbiAgICAgKiBAcGFyYW0gc2hvd0ZvcmNlXG4gICAgICogQHJldHVybiB7e2JvdHRvbTogbnVtYmVyLCBoZWlnaHQ6IG51bWJlciwgbGVmdDogbnVtYmVyLCByaWdodDogbnVtYmVyLCB0b3A6IG51bWJlciwgd2lkdGg6IG51bWJlcn19XG4gICAgICovXG5cblxuICAgIERPTS5nZXRCb3VuZGluZ0NsaWVudFJlY3QgPSBmdW5jdGlvbiBnZXRCb3VuZGluZ0NsaWVudFJlY3QoZG9tTm9kZSkge1xuICAgICAgICB2YXIgZG9tRG9jdW1lbnQgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IGRvY3VtZW50O1xuICAgICAgICB2YXIgc2hvd0ZvcmNlID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiBmYWxzZTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQ3JlYXRlIHJlc3VsdCBzaXplIGFuZCBwb3NpdGlvbiBvYmplY3RcbiAgICAgICAgICovXG4gICAgICAgIHZhciBvYmpSZXQgPSB7XG4gICAgICAgICAgICBib3R0b206IDAsXG4gICAgICAgICAgICBoZWlnaHQ6IDAsXG4gICAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgICAgcmlnaHQ6IDAsXG4gICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICB3aWR0aDogMFxuICAgICAgICB9O1xuICAgICAgICBkb21Ob2RlID0gRE9NLmdldERPTU5vZGUoZG9tTm9kZSwgZG9tRG9jdW1lbnQpO1xuICAgICAgICBpZiAoIWRvbU5vZGUpIHtcbiAgICAgICAgICAgIF9VdGlsczIuZGVmYXVsdC53YXJuKFwiVXRpbHMuRE9NLmdldEJvdW5kaW5nQ2xpZW50UmVjdDogRE9NIGVsZW1lbnQgZG9lc24ndCBleGlzdCBpbiB0aGF0IERPTSBEb2N1bWVudFwiKTtcbiAgICAgICAgICAgIHJldHVybiBvYmpSZXQ7XG4gICAgICAgIH1cbiAgICAgICAgc2hvd0ZvcmNlID0gISFzaG93Rm9yY2U7XG4gICAgICAgIHZhciBzdHlsZXMgPSB2b2lkIDA7XG4gICAgICAgIGlmIChzaG93Rm9yY2UpIHtcbiAgICAgICAgICAgIHN0eWxlcyA9IGdldENvbXB1dGVkU3R5bGUoZG9tTm9kZSk7XG4gICAgICAgICAgICBpZiAoc3R5bGVzICYmIHN0eWxlcy5kaXNwbGF5ID09PSBcIm5vbmVcIikge1xuICAgICAgICAgICAgICAgIGRvbU5vZGUuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvKipcbiAgICAgICAgICogSWYgZGVmYXVsdCBtZXRob2QgaXMgc3VwcG9ydGVkIHRoYW4gdXNlIGl0XG4gICAgICAgICAqL1xuICAgICAgICBpZiAoZG9tTm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QpIHtcbiAgICAgICAgICAgIG9ialJldCA9IGRvbU5vZGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIElFIGhhY2tcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgb2JqUmV0ID0ge1xuICAgICAgICAgICAgICAgIGJvdHRvbTogb2JqUmV0LmJvdHRvbSxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IG9ialJldC5oZWlnaHQgfHwgZG9tTm9kZS5jbGllbnRIZWlnaHQsXG4gICAgICAgICAgICAgICAgbGVmdDogb2JqUmV0LmxlZnQsXG4gICAgICAgICAgICAgICAgcmlnaHQ6IG9ialJldC5yaWdodCxcbiAgICAgICAgICAgICAgICB0b3A6IG9ialJldC50b3AsXG4gICAgICAgICAgICAgICAgd2lkdGg6IG9ialJldC53aWR0aCB8fCBkb21Ob2RlLmNsaWVudFdpZHRoXG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBXcml0ZSB0aGUgZWxlbWVudCBpbiBhIHRlbXBvcmFyeSB2YXJpYWJsZVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB2YXIgZG9tRWxlbWVudCA9IGRvbU5vZGU7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIENhbGN1bGF0ZWQgYmFzaWMgcGFyYW1ldGVycyBvZiB0aGUgZWxlbWVudFxuICAgICAgICAgICAgICogQHR5cGUge09iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdmFyIG9iakNvb3JkaW5hdGVzID0ge1xuICAgICAgICAgICAgICAgIGhlaWdodDogZG9tRWxlbWVudC5vZmZzZXRIZWlnaHQsXG4gICAgICAgICAgICAgICAgd2lkdGg6IGRvbUVsZW1lbnQub2Zmc2V0V2lkdGgsXG4gICAgICAgICAgICAgICAgeDogMCxcbiAgICAgICAgICAgICAgICB5OiAwXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBBcmUgcGFzc2VkIG9uIHRvIGFsbCBwYXJlbnRzIGFuZCB0YWtlIGludG8gYWNjb3VudCB0aGVpciBvZmZzZXRzXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHdoaWxlIChkb21FbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgb2JqQ29vcmRpbmF0ZXMueCArPSBkb21FbGVtZW50Lm9mZnNldExlZnQ7XG4gICAgICAgICAgICAgICAgb2JqQ29vcmRpbmF0ZXMueSArPSBkb21FbGVtZW50Lm9mZnNldFRvcDtcbiAgICAgICAgICAgICAgICBkb21FbGVtZW50ID0gZG9tRWxlbWVudC5vZmZzZXRQYXJlbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBvYmpSZXQgPSB7XG4gICAgICAgICAgICAgICAgYm90dG9tOiBvYmpDb29yZGluYXRlcy55ICsgb2JqQ29vcmRpbmF0ZXMuaGVpZ2h0LFxuICAgICAgICAgICAgICAgIGhlaWdodDogb2JqQ29vcmRpbmF0ZXMuaGVpZ2h0LFxuICAgICAgICAgICAgICAgIGxlZnQ6IG9iakNvb3JkaW5hdGVzLngsXG4gICAgICAgICAgICAgICAgcmlnaHQ6IG9iakNvb3JkaW5hdGVzLnggKyBvYmpDb29yZGluYXRlcy53aWR0aCxcbiAgICAgICAgICAgICAgICB0b3A6IG9iakNvb3JkaW5hdGVzLnksXG4gICAgICAgICAgICAgICAgd2lkdGg6IG9iakNvb3JkaW5hdGVzLndpZHRoXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGlmIChzaG93Rm9yY2UgJiYgZG9tTm9kZSkge1xuICAgICAgICAgICAgZG9tTm9kZS5zdHlsZS5kaXNwbGF5ID0gXCJcIjtcbiAgICAgICAgfVxuICAgICAgICAvKipcbiAgICAgICAgICogUmV0dXJuIHNpemUgYW5kIHBvc2l0aW9uIG9mIHRoZSBlbGVtZW50XG4gICAgICAgICAqL1xuICAgICAgICByZXR1cm4gb2JqUmV0O1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBGaW5kIGVsZW1lbnQgcG9zaXRpb25cbiAgICAgKiBAcGFyYW0gZG9tTm9kZVxuICAgICAqIEBwYXJhbSBkb21Eb2N1bWVudFxuICAgICAqIEBwYXJhbSBzaG93Rm9yY2VcbiAgICAgKiBAcmV0dXJuIHt7dG9wOiBudW1iZXIsIGxlZnQ6IG51bWJlcn19XG4gICAgICovXG4gICAgRE9NLmZpbmRFbGVtZW50UG9zaXRpb24gPSBmdW5jdGlvbiBmaW5kRWxlbWVudFBvc2l0aW9uKGRvbU5vZGUpIHtcbiAgICAgICAgdmFyIGRvbURvY3VtZW50ID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBkb2N1bWVudDtcbiAgICAgICAgdmFyIHNob3dGb3JjZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDogZmFsc2U7XG5cbiAgICAgICAgdmFyIG9ialJldCA9IHtcbiAgICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgICB0b3A6IDBcbiAgICAgICAgfTtcbiAgICAgICAgZG9tTm9kZSA9IERPTS5nZXRET01Ob2RlKGRvbU5vZGUsIGRvbURvY3VtZW50KTtcbiAgICAgICAgaWYgKCFkb21Ob2RlKSB7XG4gICAgICAgICAgICBfVXRpbHMyLmRlZmF1bHQud2FybihcIlV0aWxzLkRPTS5maW5kRWxlbWVudFBvc2l0aW9uOiBET00gZWxlbWVudCBkb2Vzbid0IGV4aXN0IGluIHRoYXQgRE9NIERvY3VtZW50XCIpO1xuICAgICAgICAgICAgcmV0dXJuIG9ialJldDtcbiAgICAgICAgfVxuICAgICAgICBzaG93Rm9yY2UgPSAhIXNob3dGb3JjZTtcbiAgICAgICAgd2hpbGUgKGRvbU5vZGUpIHtcbiAgICAgICAgICAgIHZhciBzdHlsZXMgPSB2b2lkIDA7XG4gICAgICAgICAgICBpZiAoc2hvd0ZvcmNlKSB7XG4gICAgICAgICAgICAgICAgc3R5bGVzID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZG9tTm9kZSk7XG4gICAgICAgICAgICAgICAgaWYgKHN0eWxlcyAmJiBzdHlsZXMuZGlzcGxheSA9PT0gXCJub25lXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgZG9tTm9kZS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9ialJldC5sZWZ0ICs9IGRvbU5vZGUub2Zmc2V0TGVmdDtcbiAgICAgICAgICAgIG9ialJldC50b3AgKz0gZG9tTm9kZS5vZmZzZXRUb3A7XG4gICAgICAgICAgICBkb21Ob2RlID0gZG9tTm9kZS5vZmZzZXRQYXJlbnQ7XG4gICAgICAgICAgICBpZiAoc2hvd0ZvcmNlICYmIGRvbU5vZGUpIHtcbiAgICAgICAgICAgICAgICBkb21Ob2RlLnN0eWxlLmRpc3BsYXkgPSBcIlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvYmpSZXQ7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBBZGQgZXZlbnQgbGlzdGVuZXJcbiAgICAgKiBAcGFyYW0gb2JqXG4gICAgICogQHBhcmFtIG5hbWVcbiAgICAgKiBAcGFyYW0gZnVuY1xuICAgICAqL1xuXG5cbiAgICBET00uYWRkRXZlbnQgPSBmdW5jdGlvbiBhZGRFdmVudChvYmosIG5hbWUsIGZ1bmMpIHtcbiAgICAgICAgaWYgKG9iaiAmJiAodHlwZW9mIG9iaiA9PT0gXCJ1bmRlZmluZWRcIiA/IFwidW5kZWZpbmVkXCIgOiBfdHlwZW9mKG9iaikpID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBuYW1lID09PSBcInN0cmluZ1wiICYmIHR5cGVvZiBmdW5jID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIGlmIChvYmouYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgICAgICAgICAgICAgIG9iai5hZGRFdmVudExpc3RlbmVyKG5hbWUsIGZ1bmMsIGZhbHNlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob2JqLmF0dGFjaEV2ZW50KSB7XG4gICAgICAgICAgICAgICAgb2JqLmF0dGFjaEV2ZW50KFwib25cIiArIG5hbWUsIGZ1bmMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFJlbW92ZSBldmVudCBsaXN0ZW5lclxuICAgICAqIEBwYXJhbSBvYmpcbiAgICAgKiBAcGFyYW0gbmFtZVxuICAgICAqIEBwYXJhbSBmdW5jXG4gICAgICovXG5cblxuICAgIERPTS5yZW1vdmVFdmVudCA9IGZ1bmN0aW9uIHJlbW92ZUV2ZW50KG9iaiwgbmFtZSwgZnVuYykge1xuICAgICAgICBpZiAob2JqICYmICh0eXBlb2Ygb2JqID09PSBcInVuZGVmaW5lZFwiID8gXCJ1bmRlZmluZWRcIiA6IF90eXBlb2Yob2JqKSkgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIG5hbWUgPT09IFwic3RyaW5nXCIgJiYgdHlwZW9mIGZ1bmMgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgaWYgKG9iai5yZW1vdmVFdmVudExpc3RlbmVyKSB7XG4gICAgICAgICAgICAgICAgb2JqLnJlbW92ZUV2ZW50TGlzdGVuZXIobmFtZSwgZnVuYywgZmFsc2UpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChvYmouZGV0YWNoRXZlbnQpIHtcbiAgICAgICAgICAgICAgICBvYmouZGV0YWNoRXZlbnQoXCJvblwiICsgbmFtZSwgZnVuYyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgLyoqXG4gICAgICogQ2hlY2sgaWYgZWxlbWVudCBoYXMgY2xhc3MgbmFtZVxuICAgICAqIEBwYXJhbSBlbGVtZW50XG4gICAgICogQHBhcmFtIGNsYXNzTmFtZVxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAgICovXG5cblxuICAgIERPTS5oYXNDbGFzc05hbWUgPSBmdW5jdGlvbiBoYXNDbGFzc05hbWUoZWxlbWVudCwgY2xhc3NOYW1lKSB7XG4gICAgICAgIGlmIChlbGVtZW50ICYmICh0eXBlb2YgZWxlbWVudCA9PT0gXCJ1bmRlZmluZWRcIiA/IFwidW5kZWZpbmVkXCIgOiBfdHlwZW9mKGVsZW1lbnQpKSA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgY2xhc3NOYW1lID09PSBcInN0cmluZ1wiICYmIGVsZW1lbnQubm9kZVR5cGUgPT09IDEpIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZSA9IGNsYXNzTmFtZS50cmltKCk7XG4gICAgICAgICAgICByZXR1cm4gKFwiIFwiICsgZWxlbWVudC5jbGFzc05hbWUgKyBcIiBcIikuaW5kZXhPZihcIiBcIiArIGNsYXNzTmFtZSArIFwiIFwiKSAhPT0gLTE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEFkZCBjbGFzcyBuYW1lXG4gICAgICogQHBhcmFtIGVsZW1lbnRcbiAgICAgKiBAcGFyYW0gY2xhc3NOYW1lXG4gICAgICogQHJldHVybiB7SFRNTEVsZW1lbnR9XG4gICAgICovXG5cblxuICAgIERPTS5hZGRDbGFzc05hbWUgPSBmdW5jdGlvbiBhZGRDbGFzc05hbWUoZWxlbWVudCwgY2xhc3NOYW1lKSB7XG4gICAgICAgIGlmIChlbGVtZW50ICYmICh0eXBlb2YgZWxlbWVudCA9PT0gXCJ1bmRlZmluZWRcIiA/IFwidW5kZWZpbmVkXCIgOiBfdHlwZW9mKGVsZW1lbnQpKSA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgY2xhc3NOYW1lID09PSBcInN0cmluZ1wiICYmIGVsZW1lbnQubm9kZVR5cGUgPT09IDEpIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZSA9IGNsYXNzTmFtZS50cmltKCk7XG4gICAgICAgICAgICBpZiAoIURPTS5oYXNDbGFzc05hbWUoZWxlbWVudCwgY2xhc3NOYW1lKSkge1xuICAgICAgICAgICAgICAgIHZhciBjbCA9IGVsZW1lbnQuY2xhc3NOYW1lO1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuY2xhc3NOYW1lID0gY2wgPyBjbCArIFwiIFwiICsgY2xhc3NOYW1lIDogY2xhc3NOYW1lO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH07XG4gICAgLyoqXG4gICAgICogUmVtb3ZlIGNsYXNzIG5hbWVcbiAgICAgKiBAcGFyYW0gZWxlbWVudFxuICAgICAqIEBwYXJhbSBjbGFzc05hbWVcbiAgICAgKiBAcmV0dXJuIHtIVE1MRWxlbWVudH1cbiAgICAgKi9cblxuXG4gICAgRE9NLnJlbW92ZUNsYXNzTmFtZSA9IGZ1bmN0aW9uIHJlbW92ZUNsYXNzTmFtZShlbGVtZW50LCBjbGFzc05hbWUpIHtcbiAgICAgICAgaWYgKGVsZW1lbnQgJiYgKHR5cGVvZiBlbGVtZW50ID09PSBcInVuZGVmaW5lZFwiID8gXCJ1bmRlZmluZWRcIiA6IF90eXBlb2YoZWxlbWVudCkpID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBjbGFzc05hbWUgPT09IFwic3RyaW5nXCIgJiYgZWxlbWVudC5ub2RlVHlwZSA9PT0gMSAmJiB0eXBlb2YgZWxlbWVudC5jbGFzc05hbWUgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZSA9IGNsYXNzTmFtZS50cmltKCk7XG4gICAgICAgICAgICB2YXIgY2xhc3NlcyA9IGVsZW1lbnQuY2xhc3NOYW1lLnRyaW0oKS5zcGxpdChcIiBcIik7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gY2xhc3Nlcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgICAgIGNsYXNzZXNbaV0gPSBjbGFzc2VzW2ldLnRyaW0oKTtcbiAgICAgICAgICAgICAgICBpZiAoIWNsYXNzZXNbaV0gfHwgY2xhc3Nlc1tpXSA9PT0gY2xhc3NOYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzZXMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsZW1lbnQuY2xhc3NOYW1lID0gY2xhc3Nlcy5qb2luKFwiIFwiKTtcbiAgICAgICAgICAgIHJldHVybiBlbGVtZW50O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFRvZ2dsZSBjbGFzcyBuYW1lXG4gICAgICogQHBhcmFtIGVsZW1lbnRcbiAgICAgKiBAcGFyYW0gY2xhc3NOYW1lXG4gICAgICogQHBhcmFtIHRvZ2dsZVxuICAgICAqIEByZXR1cm4ge0hUTUxFbGVtZW50fVxuICAgICAqL1xuXG5cbiAgICBET00udG9nZ2xlQ2xhc3NOYW1lID0gZnVuY3Rpb24gdG9nZ2xlQ2xhc3NOYW1lKGVsZW1lbnQsIGNsYXNzTmFtZSwgdG9nZ2xlKSB7XG4gICAgICAgIGlmIChlbGVtZW50ICYmICh0eXBlb2YgZWxlbWVudCA9PT0gXCJ1bmRlZmluZWRcIiA/IFwidW5kZWZpbmVkXCIgOiBfdHlwZW9mKGVsZW1lbnQpKSA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgY2xhc3NOYW1lID09PSBcInN0cmluZ1wiICYmIHR5cGVvZiB0b2dnbGUgPT09IFwiYm9vbGVhblwiICYmIGVsZW1lbnQubm9kZVR5cGUgPT09IDEpIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZSA9IGNsYXNzTmFtZS50cmltKCk7XG4gICAgICAgICAgICBpZiAodG9nZ2xlKSB7XG4gICAgICAgICAgICAgICAgRE9NLmFkZENsYXNzTmFtZShlbGVtZW50LCBjbGFzc05hbWUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBET00ucmVtb3ZlQ2xhc3NOYW1lKGVsZW1lbnQsIGNsYXNzTmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBSZXBsYWNlIGNsYXNzIG5hbWVcbiAgICAgKiBAcGFyYW0gZWxlbWVudFxuICAgICAqIEBwYXJhbSBvbGRDbGFzc05hbWVcbiAgICAgKiBAcGFyYW0gbmV3Q2xhc3NOYW1lXG4gICAgICogQHJldHVybiB7SFRNTEVsZW1lbnR9XG4gICAgICovXG5cblxuICAgIERPTS5yZXBsYWNlQ2xhc3MgPSBmdW5jdGlvbiByZXBsYWNlQ2xhc3MoZWxlbWVudCwgb2xkQ2xhc3NOYW1lLCBuZXdDbGFzc05hbWUpIHtcbiAgICAgICAgaWYgKGVsZW1lbnQgJiYgKHR5cGVvZiBlbGVtZW50ID09PSBcInVuZGVmaW5lZFwiID8gXCJ1bmRlZmluZWRcIiA6IF90eXBlb2YoZWxlbWVudCkpID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBvbGRDbGFzc05hbWUgPT09IFwic3RyaW5nXCIgJiYgdHlwZW9mIG5ld0NsYXNzTmFtZSA9PT0gXCJzdHJpbmdcIiAmJiBlbGVtZW50Lm5vZGVUeXBlID09PSAxKSB7XG4gICAgICAgICAgICBvbGRDbGFzc05hbWUgPSBvbGRDbGFzc05hbWUudHJpbSgpO1xuICAgICAgICAgICAgbmV3Q2xhc3NOYW1lID0gbmV3Q2xhc3NOYW1lLnRyaW0oKTtcbiAgICAgICAgICAgIERPTS5yZW1vdmVDbGFzc05hbWUoZWxlbWVudCwgb2xkQ2xhc3NOYW1lKTtcbiAgICAgICAgICAgIERPTS5hZGRDbGFzc05hbWUoZWxlbWVudCwgbmV3Q2xhc3NOYW1lKTtcbiAgICAgICAgICAgIHJldHVybiBlbGVtZW50O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEdldCBlbGVtZW50IGJ5IHRhZyBuYW1lIGFuZCBpbmRleFxuICAgICAqIEBwYXJhbSB0blxuICAgICAqIEBwYXJhbSBkb21Eb2N1bWVudFxuICAgICAqIEBwYXJhbSBpbmRleFxuICAgICAqIEByZXR1cm4ge05vZGV9XG4gICAgICovXG5cblxuICAgIERPTS5nZXRFbGVtZW50QnlUYWdOYW1lID0gZnVuY3Rpb24gZ2V0RWxlbWVudEJ5VGFnTmFtZSh0bikge1xuICAgICAgICB2YXIgZG9tRG9jdW1lbnQgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IGRvY3VtZW50O1xuICAgICAgICB2YXIgaW5kZXggPSBhcmd1bWVudHNbMl07XG5cbiAgICAgICAgaWYgKHR5cGVvZiB0biA9PT0gXCJzdHJpbmdcIiAmJiBET00uaXNET01Eb2N1bWVudChkb21Eb2N1bWVudCkgJiYgdHlwZW9mIGluZGV4ID09PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgICB2YXIgZWxzID0gZG9tRG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUodG4pO1xuICAgICAgICAgICAgcmV0dXJuIGVsc1tpbmRleF0gfHwgbnVsbDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBHZXQgbGluZSBoZWlnaHRcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9XG4gICAgICovXG5cblxuICAgIERPTS5nZXRMaW5lSGVpZ2h0ID0gZnVuY3Rpb24gZ2V0TGluZUhlaWdodCgpIHtcbiAgICAgICAgdmFyIHN0eWxlcyA9IGdldENvbXB1dGVkU3R5bGUoZG9jdW1lbnQuYm9keSk7XG4gICAgICAgIHZhciBsaW5lSGVpZ2h0ID0gc3R5bGVzLmxpbmVIZWlnaHQ7XG4gICAgICAgIHZhciBsaW5lSGVpZ2h0RGlnID0gcGFyc2VJbnQobGluZUhlaWdodCwgMTApO1xuICAgICAgICB2YXIgZm9udFNpemUgPSBzdHlsZXMuZm9udFNpemU7XG4gICAgICAgIHZhciBmb250U2l6ZURpZyA9IHBhcnNlSW50KGZvbnRTaXplLCAxMCk7XG4gICAgICAgIGlmIChpc0Zpbml0ZShsaW5lSGVpZ2h0RGlnKSkge1xuICAgICAgICAgICAgcmV0dXJuIGxpbmVIZWlnaHREaWc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZm9udFNpemVEaWc7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIERPTTtcbn0oKTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gRE9NO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9VdGlscy9saWIvVXRpbHNET00udHNcbi8vIG1vZHVsZSBpZCA9IDI1XG4vLyBtb2R1bGUgY2h1bmtzID0gMSAyIDMiLCJcInVzZSBzdHJpY3RcIjtcbi8qKlxuICogSW1wb3J0IGFkZGl0aW9uYWwgY2xhc3Nlc1xuICovXG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbnZhciBfdHlwZW9mID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIgPyBmdW5jdGlvbiAob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9IDogZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCAmJiBvYmogIT09IFN5bWJvbC5wcm90b3R5cGUgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajsgfTtcblxudmFyIF9VdGlsc0RPTSA9IHJlcXVpcmUoXCIuL1V0aWxzRE9NXCIpO1xuXG52YXIgX1V0aWxzRE9NMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX1V0aWxzRE9NKTtcblxudmFyIF9VdGlsc1dpbmRvdyA9IHJlcXVpcmUoXCIuL1V0aWxzV2luZG93XCIpO1xuXG52YXIgX1V0aWxzV2luZG93MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX1V0aWxzV2luZG93KTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxudmFyIE1vdXNlID0gZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIE1vdXNlKCkge1xuICAgICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgTW91c2UpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE5vcm1hbGlzZSBtb3VzZSBkZWx0YVxuICAgICAqIEBwYXJhbSBlXG4gICAgICogQHJldHVybiB7bnVtYmVyfVxuICAgICAqL1xuICAgIE1vdXNlLmdldFdoZWVsRGVsdGEgPSBmdW5jdGlvbiBnZXRXaGVlbERlbHRhKGUpIHtcbiAgICAgICAgaWYgKGUgJiYgKHR5cGVvZiBlID09PSBcInVuZGVmaW5lZFwiID8gXCJ1bmRlZmluZWRcIiA6IF90eXBlb2YoZSkpID09PSBcIm9iamVjdFwiICYmIChcImRldGFpbFwiIGluIGUgfHwgXCJ3aGVlbERlbHRhXCIgaW4gZSB8fCBcIndoZWVsRGVsdGFZXCIgaW4gZSB8fCBcIndoZWVsRGVsdGFYXCIgaW4gZSB8fCBcImRlbHRhWVwiIGluIGUgfHwgXCJkZWx0YVhcIiBpbiBlIHx8IFwiYXhpc1wiIGluIGUgfHwgXCJkZWx0YU1vZGVcIiBpbiBlKSkge1xuICAgICAgICAgICAgdmFyIGRlbHRhID0gdm9pZCAwO1xuICAgICAgICAgICAgdmFyIGRlbHRhWCA9IHZvaWQgMDtcbiAgICAgICAgICAgIHZhciBkZWx0YVkgPSB2b2lkIDA7XG4gICAgICAgICAgICAvLyBPbGQgc2Nob29sIHNjcm9sbHdoZWVsIGRlbHRhXG4gICAgICAgICAgICBpZiAoXCJkZXRhaWxcIiBpbiBlKSB7XG4gICAgICAgICAgICAgICAgZGVsdGFZID0gZS5kZXRhaWwgKiAtMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChcIndoZWVsRGVsdGFcIiBpbiBlKSB7XG4gICAgICAgICAgICAgICAgZGVsdGFZID0gZS53aGVlbERlbHRhO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKFwid2hlZWxEZWx0YVlcIiBpbiBlKSB7XG4gICAgICAgICAgICAgICAgZGVsdGFZID0gZS53aGVlbERlbHRhWTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChcIndoZWVsRGVsdGFYXCIgaW4gZSkge1xuICAgICAgICAgICAgICAgIGRlbHRhWCA9IGUud2hlZWxEZWx0YVggKiAtMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIEZpcmVmb3ggPCAxNyBob3Jpem9udGFsIHNjcm9sbGluZyByZWxhdGVkIHRvIERPTU1vdXNlU2Nyb2xsIGV2ZW50XG4gICAgICAgICAgICBpZiAoXCJheGlzXCIgaW4gZSAmJiBlLmF4aXMgPT09IGUuSE9SSVpPTlRBTF9BWElTKSB7XG4gICAgICAgICAgICAgICAgZGVsdGFYID0gZGVsdGFZICogLTE7XG4gICAgICAgICAgICAgICAgZGVsdGFZID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIE5ldyBzY2hvb2wgd2hlZWwgZGVsdGEgKHdoZWVsIGV2ZW50KVxuICAgICAgICAgICAgaWYgKFwiZGVsdGFZXCIgaW4gZSkge1xuICAgICAgICAgICAgICAgIGRlbHRhWSA9IGUuZGVsdGFZICogLTE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoXCJkZWx0YVhcIiBpbiBlKSB7XG4gICAgICAgICAgICAgICAgZGVsdGFYID0gZS5kZWx0YVg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBOZWVkIHRvIGNvbnZlcnQgbGluZXMgYW5kIHBhZ2VzIHRvIHBpeGVscyBpZiB3ZSBhcmVuXCJ0IGFscmVhZHkgaW4gcGl4ZWxzXG4gICAgICAgICAgICAvLyBUaGVyZSBhcmUgdGhyZWUgZGVsdGEgbW9kZXM6XG4gICAgICAgICAgICAvLyAgICogZGVsdGFNb2RlIDAgaXMgYnkgcGl4ZWxzLCBub3RoaW5nIHRvIGRvXG4gICAgICAgICAgICAvLyAgICogZGVsdGFNb2RlIDEgaXMgYnkgbGluZXNcbiAgICAgICAgICAgIC8vICAgKiBkZWx0YU1vZGUgMiBpcyBieSBwYWdlc1xuICAgICAgICAgICAgaWYgKGUuZGVsdGFNb2RlID09PSAxKSB7XG4gICAgICAgICAgICAgICAgdmFyIGxpbmVIZWlnaHQgPSBfVXRpbHNET00yLmRlZmF1bHQuZ2V0TGluZUhlaWdodCgpO1xuICAgICAgICAgICAgICAgIGRlbHRhWSA9IGRlbHRhWSAqIGxpbmVIZWlnaHQ7XG4gICAgICAgICAgICAgICAgZGVsdGFYID0gZGVsdGFYICogbGluZUhlaWdodDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZS5kZWx0YU1vZGUgPT09IDIpIHtcbiAgICAgICAgICAgICAgICB2YXIgd2luZG93aGVnaWh0ID0gX1V0aWxzV2luZG93Mi5kZWZhdWx0LmdldEhlaWdodCgpO1xuICAgICAgICAgICAgICAgIGRlbHRhWSA9IGRlbHRhWSAqIHdpbmRvd2hlZ2lodDtcbiAgICAgICAgICAgICAgICBkZWx0YVggPSBkZWx0YVggKiB3aW5kb3doZWdpaHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkZWx0YSA9IGRlbHRhWSA9PT0gMCA/IGRlbHRhWCA6IGRlbHRhWTtcbiAgICAgICAgICAgIHJldHVybiBkZWx0YTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBOYU47XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIE1vdXNlO1xufSgpO1xuXG5leHBvcnRzLmRlZmF1bHQgPSBNb3VzZTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vVXRpbHMvbGliL1V0aWxzTW91c2UudHNcbi8vIG1vZHVsZSBpZCA9IDI2XG4vLyBtb2R1bGUgY2h1bmtzID0gMSAyIDMiLCJcInVzZSBzdHJpY3RcIjtcbi8qKlxuICogQ2xhc3MgZm9yIHdvcmtpbmcgd2l0aCBzY3JlZW5cbiAqL1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG52YXIgU2NyZWVuID0gZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFNjcmVlbigpIHtcbiAgICAgICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFNjcmVlbik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHNjcmVlbiBpbmZvXG4gICAgICogQHJldHVybiB7e2F2YWlsYWJsZVNpemU6IHtoZWlnaHQ6IG51bWJlciwgd2lkdGg6IG51bWJlcn0sIGNvbG9yRGVwdGg6IG51bWJlciwgcGl4ZWxSYXRpbzogbnVtYmVyLCBzaXplOiB7aGVpZ2h0OiBudW1iZXIsIHdpZHRoOiBudW1iZXJ9fX1cbiAgICAgKi9cbiAgICBTY3JlZW4uZ2V0SW5mbyA9IGZ1bmN0aW9uIGdldEluZm8oKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBhdmFpbGFibGVTaXplOiBTY3JlZW4uZ2V0QXZhaWxhYmxlU2l6ZXMoKSxcbiAgICAgICAgICAgIGNvbG9yRGVwdGg6IFNjcmVlbi5nZXRDb2xvckRlcHRoKCksXG4gICAgICAgICAgICBwaXhlbFJhdGlvOiBTY3JlZW4uZ2V0UGl4ZWxSYXRpbygpLFxuICAgICAgICAgICAgc2l6ZTogU2NyZWVuLmdldFNpemVzKClcbiAgICAgICAgfTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEdldCBzY3JlZW4gaGVpZ2h0XG4gICAgICogQHJldHVybnMge251bWJlcn1cbiAgICAgKi9cblxuXG4gICAgU2NyZWVuLmdldEhlaWdodCA9IGZ1bmN0aW9uIGdldEhlaWdodCgpIHtcbiAgICAgICAgcmV0dXJuIHNjcmVlbi5oZWlnaHQ7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBHZXQgc2NyZWVuIHdpZHRoXG4gICAgICogQHJldHVybnMge251bWJlcn1cbiAgICAgKi9cblxuXG4gICAgU2NyZWVuLmdldFdpZHRoID0gZnVuY3Rpb24gZ2V0V2lkdGgoKSB7XG4gICAgICAgIHJldHVybiBzY3JlZW4ud2lkdGg7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBHZXQgc2NyZWVuIHNpemVzXG4gICAgICogQHJldHVybiB7e2hlaWdodDogbnVtYmVyLCB3aWR0aDogbnVtYmVyfX1cbiAgICAgKi9cblxuXG4gICAgU2NyZWVuLmdldFNpemVzID0gZnVuY3Rpb24gZ2V0U2l6ZXMoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBoZWlnaHQ6IFNjcmVlbi5nZXRIZWlnaHQoKSxcbiAgICAgICAgICAgIHdpZHRoOiBTY3JlZW4uZ2V0V2lkdGgoKVxuICAgICAgICB9O1xuICAgIH07XG4gICAgLyoqXG4gICAgICogR2V0IHNjcmVlbiBoZWlnaHRcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgICAqL1xuXG5cbiAgICBTY3JlZW4uZ2V0QXZhaWxhYmxlSGVpZ2h0ID0gZnVuY3Rpb24gZ2V0QXZhaWxhYmxlSGVpZ2h0KCkge1xuICAgICAgICByZXR1cm4gc2NyZWVuLmF2YWlsSGVpZ2h0O1xuICAgIH07XG4gICAgLyoqXG4gICAgICogR2V0IHNjcmVlbiB3aWR0aFxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAgICovXG5cblxuICAgIFNjcmVlbi5nZXRBdmFpbGFibGVXaWR0aCA9IGZ1bmN0aW9uIGdldEF2YWlsYWJsZVdpZHRoKCkge1xuICAgICAgICByZXR1cm4gc2NyZWVuLmF2YWlsV2lkdGg7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBHZXQgc2NyZWVuIHNpemVzXG4gICAgICogQHJldHVybiB7e2hlaWdodDogbnVtYmVyLCB3aWR0aDogbnVtYmVyfX1cbiAgICAgKi9cblxuXG4gICAgU2NyZWVuLmdldEF2YWlsYWJsZVNpemVzID0gZnVuY3Rpb24gZ2V0QXZhaWxhYmxlU2l6ZXMoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBoZWlnaHQ6IFNjcmVlbi5nZXRBdmFpbGFibGVIZWlnaHQoKSxcbiAgICAgICAgICAgIHdpZHRoOiBTY3JlZW4uZ2V0QXZhaWxhYmxlV2lkdGgoKVxuICAgICAgICB9O1xuICAgIH07XG4gICAgLyoqXG4gICAgICogR2V0IHNjcmVlbiBwaXhlbCByYXRpb1xuICAgICAqIEByZXR1cm4ge251bWJlcn1cbiAgICAgKi9cblxuXG4gICAgU2NyZWVuLmdldFBpeGVsUmF0aW8gPSBmdW5jdGlvbiBnZXRQaXhlbFJhdGlvKCkge1xuICAgICAgICB2YXIgcmF0aW8gPSAxO1xuICAgICAgICBpZiAodHlwZW9mIHdpbmRvdy5zY3JlZW4uc3lzdGVtWERQSSAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0eXBlb2Ygd2luZG93LnNjcmVlbi5sb2dpY2FsWERQSSAhPT0gXCJ1bmRlZmluZWRcIiAmJiB3aW5kb3cuc2NyZWVuLnN5c3RlbVhEUEkgPiB3aW5kb3cuc2NyZWVuLmxvZ2ljYWxYRFBJKSB7XG4gICAgICAgICAgICByYXRpbyA9IHdpbmRvdy5zY3JlZW4uc3lzdGVtWERQSSAvIHdpbmRvdy5zY3JlZW4ubG9naWNhbFhEUEk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICByYXRpbyA9IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByYXRpbztcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEdldCBzY3JlZW4gY29sb3IgZGVwdGhcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9XG4gICAgICovXG5cblxuICAgIFNjcmVlbi5nZXRDb2xvckRlcHRoID0gZnVuY3Rpb24gZ2V0Q29sb3JEZXB0aCgpIHtcbiAgICAgICAgcmV0dXJuIHNjcmVlbi5jb2xvckRlcHRoO1xuICAgIH07XG5cbiAgICByZXR1cm4gU2NyZWVuO1xufSgpO1xuXG5leHBvcnRzLmRlZmF1bHQgPSBTY3JlZW47XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L1V0aWxzL2xpYi9VdGlsc1NjcmVlbi50c1xuLy8gbW9kdWxlIGlkID0gMjdcbi8vIG1vZHVsZSBjaHVua3MgPSAxIDIgMyIsIlwidXNlIHN0cmljdFwiO1xuLyoqXG4gKiBDbGFzcyBmb3Igd29ya2luZyB3aXRoIHN5c3RlbVxuICovXG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbnZhciBTeXN0ZW0gPSBmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gU3lzdGVtKCkge1xuICAgICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgU3lzdGVtKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgc3lzdGVtIGluZm9cbiAgICAgKiBAcmV0dXJuIHt7bmFtZTogc3RyaW5nLCB2ZXJzaW9uOiBzdHJpbmd9fVxuICAgICAqL1xuICAgIFN5c3RlbS5nZXRJbmZvID0gZnVuY3Rpb24gZ2V0SW5mbygpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG5hbWU6IFN5c3RlbS5nZXROYW1lKCksXG4gICAgICAgICAgICB2ZXJzaW9uOiBTeXN0ZW0uZ2V0VmVyc2lvbigpXG4gICAgICAgIH07XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBHZXQgT1MgbmFtZVxuICAgICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICAgKi9cblxuXG4gICAgU3lzdGVtLmdldE5hbWUgPSBmdW5jdGlvbiBnZXROYW1lKCkge1xuICAgICAgICB2YXIgb3MgPSBcIlwiO1xuICAgICAgICB2YXIgY2xpZW50U3RyaW5ncyA9IFt7XG4gICAgICAgICAgICByOiAvKFdpbmRvd3MgMTAuMHxXaW5kb3dzIE5UIDEwLjApLyxcbiAgICAgICAgICAgIHM6IFwiV2luZG93cyAxMFwiXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHI6IC8oV2luZG93cyA4LjF8V2luZG93cyBOVCA2LjMpLyxcbiAgICAgICAgICAgIHM6IFwiV2luZG93cyA4LjFcIlxuICAgICAgICB9LCB7XG4gICAgICAgICAgICByOiAvKFdpbmRvd3MgOHxXaW5kb3dzIE5UIDYuMikvLFxuICAgICAgICAgICAgczogXCJXaW5kb3dzIDhcIlxuICAgICAgICB9LCB7XG4gICAgICAgICAgICByOiAvKFdpbmRvd3MgN3xXaW5kb3dzIE5UIDYuMSkvLFxuICAgICAgICAgICAgczogXCJXaW5kb3dzIDdcIlxuICAgICAgICB9LCB7XG4gICAgICAgICAgICByOiAvV2luZG93cyBOVCA2LjAvLFxuICAgICAgICAgICAgczogXCJXaW5kb3dzIFZpc3RhXCJcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgcjogL1dpbmRvd3MgTlQgNS4yLyxcbiAgICAgICAgICAgIHM6IFwiV2luZG93cyBTZXJ2ZXIgMjAwM1wiXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHI6IC8oV2luZG93cyBOVCA1LjF8V2luZG93cyBYUCkvLFxuICAgICAgICAgICAgczogXCJXaW5kb3dzIFhQXCJcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgcjogLyhXaW5kb3dzIE5UIDUuMHxXaW5kb3dzIDIwMDApLyxcbiAgICAgICAgICAgIHM6IFwiV2luZG93cyAyMDAwXCJcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgcjogLyhXaW4gOXggNC45MHxXaW5kb3dzIE1FKS8sXG4gICAgICAgICAgICBzOiBcIldpbmRvd3MgTUVcIlxuICAgICAgICB9LCB7XG4gICAgICAgICAgICByOiAvKFdpbmRvd3MgOTh8V2luOTgpLyxcbiAgICAgICAgICAgIHM6IFwiV2luZG93cyA5OFwiXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHI6IC8oV2luZG93cyA5NXxXaW45NXxXaW5kb3dzXzk1KS8sXG4gICAgICAgICAgICBzOiBcIldpbmRvd3MgOTVcIlxuICAgICAgICB9LCB7XG4gICAgICAgICAgICByOiAvKFdpbmRvd3MgTlQgNC4wfFdpbk5UNC4wfFdpbk5UfFdpbmRvd3MgTlQpLyxcbiAgICAgICAgICAgIHM6IFwiV2luZG93cyBOVCA0LjBcIlxuICAgICAgICB9LCB7XG4gICAgICAgICAgICByOiAvV2luZG93cyBDRS8sXG4gICAgICAgICAgICBzOiBcIldpbmRvd3MgQ0VcIlxuICAgICAgICB9LCB7XG4gICAgICAgICAgICByOiAvV2luMTYvLFxuICAgICAgICAgICAgczogXCJXaW5kb3dzIDMuMTFcIlxuICAgICAgICB9LCB7XG4gICAgICAgICAgICByOiAvQW5kcm9pZC8sXG4gICAgICAgICAgICBzOiBcIkFuZHJvaWRcIlxuICAgICAgICB9LCB7XG4gICAgICAgICAgICByOiAvT3BlbkJTRC8sXG4gICAgICAgICAgICBzOiBcIk9wZW4gQlNEXCJcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgcjogL1N1bk9TLyxcbiAgICAgICAgICAgIHM6IFwiU3VuIE9TXCJcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgcjogLyhMaW51eHxYMTEpLyxcbiAgICAgICAgICAgIHM6IFwiTGludXhcIlxuICAgICAgICB9LCB7XG4gICAgICAgICAgICByOiAvKGlQaG9uZXxpUGFkfGlQb2QpLyxcbiAgICAgICAgICAgIHM6IFwiaU9TXCJcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgcjogL01hYyBPUyBYLyxcbiAgICAgICAgICAgIHM6IFwiTWFjIE9TIFhcIlxuICAgICAgICB9LCB7XG4gICAgICAgICAgICByOiAvKE1hY1BQQ3xNYWNJbnRlbHxNYWNfUG93ZXJQQ3xNYWNpbnRvc2gpLyxcbiAgICAgICAgICAgIHM6IFwiTWFjIE9TXCJcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgcjogL1FOWC8sXG4gICAgICAgICAgICBzOiBcIlFOWFwiXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHI6IC9VTklYLyxcbiAgICAgICAgICAgIHM6IFwiVU5JWFwiXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHI6IC9CZU9TLyxcbiAgICAgICAgICAgIHM6IFwiQmVPU1wiXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHI6IC9PU1xcLzIvLFxuICAgICAgICAgICAgczogXCJPUy8yXCJcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgcjogLyhudWhrfEdvb2dsZWJvdHxZYW1teWJvdHxPcGVuYm90fFNsdXJwfE1TTkJvdHxBc2sgSmVldmVzXFwvVGVvbWF8aWFfYXJjaGl2ZXIpLyxcbiAgICAgICAgICAgIHM6IFwiU2VhcmNoIEJvdFwiXG4gICAgICAgIH1dO1xuICAgICAgICBmb3IgKHZhciBfaXRlcmF0b3IgPSBjbGllbnRTdHJpbmdzLCBfaXNBcnJheSA9IEFycmF5LmlzQXJyYXkoX2l0ZXJhdG9yKSwgX2kgPSAwLCBfaXRlcmF0b3IgPSBfaXNBcnJheSA/IF9pdGVyYXRvciA6IF9pdGVyYXRvcltTeW1ib2wuaXRlcmF0b3JdKCk7Oykge1xuICAgICAgICAgICAgdmFyIF9yZWY7XG5cbiAgICAgICAgICAgIGlmIChfaXNBcnJheSkge1xuICAgICAgICAgICAgICAgIGlmIChfaSA+PSBfaXRlcmF0b3IubGVuZ3RoKSBicmVhaztcbiAgICAgICAgICAgICAgICBfcmVmID0gX2l0ZXJhdG9yW19pKytdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBfaSA9IF9pdGVyYXRvci5uZXh0KCk7XG4gICAgICAgICAgICAgICAgaWYgKF9pLmRvbmUpIGJyZWFrO1xuICAgICAgICAgICAgICAgIF9yZWYgPSBfaS52YWx1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGNzID0gX3JlZjtcblxuICAgICAgICAgICAgaWYgKGNzLnIudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSkge1xuICAgICAgICAgICAgICAgIG9zID0gY3MucztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3M7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBHZXQgT1MgdmVyc2lvblxuICAgICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICAgKi9cblxuXG4gICAgU3lzdGVtLmdldFZlcnNpb24gPSBmdW5jdGlvbiBnZXRWZXJzaW9uKCkge1xuICAgICAgICB2YXIgb3MgPSBTeXN0ZW0uZ2V0TmFtZSgpO1xuICAgICAgICB2YXIgb3NWZXJzaW9uID0gXCJcIjtcbiAgICAgICAgaWYgKC9XaW5kb3dzLy50ZXN0KG9zKSkge1xuICAgICAgICAgICAgb3NWZXJzaW9uID0gL1dpbmRvd3MgKC4qKS8uZXhlYyhvcylbMV07XG4gICAgICAgICAgICBvcyA9IFwiV2luZG93c1wiO1xuICAgICAgICB9XG4gICAgICAgIHN3aXRjaCAob3MpIHtcbiAgICAgICAgICAgIGNhc2UgXCJNYWMgT1MgWFwiOlxuICAgICAgICAgICAgICAgIG9zVmVyc2lvbiA9IC9NYWMgT1MgWCAoMTBbLl9cXGRdKykvLmV4ZWMobmF2aWdhdG9yLnVzZXJBZ2VudClbMV07XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiQW5kcm9pZFwiOlxuICAgICAgICAgICAgICAgIG9zVmVyc2lvbiA9IC9BbmRyb2lkIChbLl9cXGRdKykvLmV4ZWMobmF2aWdhdG9yLnVzZXJBZ2VudClbMV07XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiaU9TXCI6XG4gICAgICAgICAgICAgICAgdmFyIHJlZyA9IC9PUyAoXFxkKylfKFxcZCspXz8oXFxkKyk/Ly5leGVjKG5hdmlnYXRvci5hcHBWZXJzaW9uKTtcbiAgICAgICAgICAgICAgICBvc1ZlcnNpb24gPSByZWdbMV0gKyBcIi5cIiArIHJlZ1syXSArIFwiLlwiICsgKHJlZ1szXSB8fCAwKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG9zVmVyc2lvbjtcbiAgICB9O1xuXG4gICAgcmV0dXJuIFN5c3RlbTtcbn0oKTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gU3lzdGVtO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9VdGlscy9saWIvVXRpbHNTeXN0ZW0udHNcbi8vIG1vZHVsZSBpZCA9IDI4XG4vLyBtb2R1bGUgY2h1bmtzID0gMSAyIDMiLCJcInVzZSBzdHJpY3RcIjtcbi8qKlxuICogQ2xhc3MgZm9yIHdvcmtpbmcgd2l0aCB1c2VyXG4gKi9cblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxudmFyIF9VdGlsc0Jyb3dzZXIgPSByZXF1aXJlKFwiLi9VdGlsc0Jyb3dzZXJcIik7XG5cbnZhciBfVXRpbHNCcm93c2VyMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX1V0aWxzQnJvd3Nlcik7XG5cbnZhciBfVXRpbHNTY3JlZW4gPSByZXF1aXJlKFwiLi9VdGlsc1NjcmVlblwiKTtcblxudmFyIF9VdGlsc1NjcmVlbjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9VdGlsc1NjcmVlbik7XG5cbnZhciBfVXRpbHNTeXN0ZW0gPSByZXF1aXJlKFwiLi9VdGlsc1N5c3RlbVwiKTtcblxudmFyIF9VdGlsc1N5c3RlbTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9VdGlsc1N5c3RlbSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbnZhciBVc2VyID0gZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFVzZXIoKSB7XG4gICAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBVc2VyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgdXNlciBpbmZvXG4gICAgICogQHJldHVybiB7e2Jyb3dzZXI6IHticm93c2VyOiBzdHJpbmcsIG1vYmlsZTogYm9vbGVhbiwgdmVyc2lvbjogc3RyaW5nfSwgc2NyZWVuOiB7YXZhaWxhYmxlU2l6ZToge2hlaWdodDogbnVtYmVyLCB3aWR0aDogbnVtYmVyfSwgY29sb3JEZXB0aDogbnVtYmVyLCBwaXhlbFJhdGlvOiBudW1iZXIsIHNpemU6IHtoZWlnaHQ6IG51bWJlciwgd2lkdGg6IG51bWJlcn19LCBzeXN0ZW06IHtuYW1lOiBzdHJpbmcsIHZlcnNpb246IHN0cmluZ319fVxuICAgICAqL1xuICAgIFVzZXIuZ2V0SW5mbyA9IGZ1bmN0aW9uIGdldEluZm8oKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBicm93c2VyOiBfVXRpbHNCcm93c2VyMi5kZWZhdWx0LmdldEluZm8oKSxcbiAgICAgICAgICAgIHNjcmVlbjogX1V0aWxzU2NyZWVuMi5kZWZhdWx0LmdldEluZm8oKSxcbiAgICAgICAgICAgIHN5c3RlbTogX1V0aWxzU3lzdGVtMi5kZWZhdWx0LmdldEluZm8oKVxuICAgICAgICB9O1xuICAgIH07XG5cbiAgICByZXR1cm4gVXNlcjtcbn0oKTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gVXNlcjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vVXRpbHMvbGliL1V0aWxzVXNlci50c1xuLy8gbW9kdWxlIGlkID0gMjlcbi8vIG1vZHVsZSBjaHVua3MgPSAxIDIgMyIsIlwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX0FuaW1hdGlvbkZyYW1lID0gcmVxdWlyZShcIkFuaW1hdGlvbkZyYW1lXCIpO1xuXG52YXIgX0FuaW1hdGlvbkZyYW1lMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX0FuaW1hdGlvbkZyYW1lKTtcblxudmFyIF9Db29raWVzID0gcmVxdWlyZShcIi4vU3RvcmFnZXMvQ29va2llc1wiKTtcblxudmFyIF9Db29raWVzMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX0Nvb2tpZXMpO1xuXG52YXIgX0RPTVN0b3JhZ2UgPSByZXF1aXJlKFwiLi9TdG9yYWdlcy9ET01TdG9yYWdlXCIpO1xuXG52YXIgX0RPTVN0b3JhZ2UyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfRE9NU3RvcmFnZSk7XG5cbnZhciBfR2xvYmFsU3RvcmFnZSA9IHJlcXVpcmUoXCIuL1N0b3JhZ2VzL0dsb2JhbFN0b3JhZ2VcIik7XG5cbnZhciBfR2xvYmFsU3RvcmFnZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9HbG9iYWxTdG9yYWdlKTtcblxudmFyIF9Mb2NhbFN0b3JhZ2UgPSByZXF1aXJlKFwiLi9TdG9yYWdlcy9Mb2NhbFN0b3JhZ2VcIik7XG5cbnZhciBfTG9jYWxTdG9yYWdlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX0xvY2FsU3RvcmFnZSk7XG5cbnZhciBfU2Vzc2lvblN0b3JhZ2UgPSByZXF1aXJlKFwiLi9TdG9yYWdlcy9TZXNzaW9uU3RvcmFnZVwiKTtcblxudmFyIF9TZXNzaW9uU3RvcmFnZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9TZXNzaW9uU3RvcmFnZSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG4vKipcbiAqIEltcG9ydCBzdG9yYWdlc1xuICovXG5cblxuLyoqXG4gKiBFdmVyQ29va2llIHN0b3JhZ2VcbiAqL1xudmFyIEV2ZXJDb29raWUgPSBmdW5jdGlvbiAoKSB7XG4gIC8qKlxuICAgKiBUaGUgY29uc3RydWN0b3Igc2hvdWxkIGFjY2VwdCBhIGhhc2ggdG8gc2VwYXJhdGUgdGhlIHNjb3BlcyBvZiBzdG9yYWdlXG4gICAqIEBwYXJhbSBoYXNoIHtzdHJpbmd9XG4gICAqL1xuICBmdW5jdGlvbiBFdmVyQ29va2llKGhhc2gpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgRXZlckNvb2tpZSk7XG5cbiAgICB0aGlzLnJlZ1ZhbGlkS2V5ID0gbmV3IFJlZ0V4cChcIihbYS16QS1aMC05Xy1dezAsfSlcIiwgXCJpXCIpO1xuICAgIC8qKlxuICAgICAqIEdlbmVyYXRlIGhhc2hcbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICAqL1xuICAgIHRoaXMuaGFzaCA9IGhhc2ggfHwgbG9jYXRpb24uaG9zdG5hbWU7XG4gICAgLyoqXG4gICAgICogSW5pdGlhbGlzZSBzdG9yZXNcbiAgICAgKiBAdHlwZSB7QXJyYXl9XG4gICAgICovXG4gICAgdGhpcy5zdG9yZXMgPSBbXTtcbiAgICBpZiAodHlwZW9mIF9Db29raWVzMi5kZWZhdWx0ICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICB0aGlzLnN0b3Jlcy5wdXNoKG5ldyBfQ29va2llczIuZGVmYXVsdCh0aGlzLmhhc2gpKTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBfR2xvYmFsU3RvcmFnZTIuZGVmYXVsdCAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgdGhpcy5zdG9yZXMucHVzaChuZXcgX0dsb2JhbFN0b3JhZ2UyLmRlZmF1bHQodGhpcy5oYXNoKSk7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgX0xvY2FsU3RvcmFnZTIuZGVmYXVsdCAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgdGhpcy5zdG9yZXMucHVzaChuZXcgX0xvY2FsU3RvcmFnZTIuZGVmYXVsdCh0aGlzLmhhc2gpKTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBfU2Vzc2lvblN0b3JhZ2UyLmRlZmF1bHQgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIHRoaXMuc3RvcmVzLnB1c2gobmV3IF9TZXNzaW9uU3RvcmFnZTIuZGVmYXVsdCh0aGlzLmhhc2gpKTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBfRE9NU3RvcmFnZTIuZGVmYXVsdCAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgdGhpcy5zdG9yZXMucHVzaChuZXcgX0RPTVN0b3JhZ2UyLmRlZmF1bHQodGhpcy5oYXNoKSk7XG4gICAgfVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5zdG9yZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICghdGhpcy5zdG9yZXNbaV0uaXNTdXBwb3J0ZWQoKSkge1xuICAgICAgICB0aGlzLnN0b3Jlcy5zcGxpY2UoaSwgMSk7XG4gICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNldCBzZWxmIHJlZnJlc2ggZmxhZ1xuICAgICAqIEB0eXBlIHtib29sZWFufVxuICAgICAqL1xuICAgIHRoaXMuc3RvcFJlZnJlc2ggPSBmYWxzZTtcbiAgICAvKipcbiAgICAgKiBTZWxmIHJlZnJlc2hcbiAgICAgKi9cbiAgICBpZiAodGhpcy5pc1N1cHBvcnRlZCgpKSB7XG4gICAgICB0aGlzLnJlZnJlc2hJRCA9IF9BbmltYXRpb25GcmFtZTIuZGVmYXVsdC5zdWJzY3JpYmUodGhpcywgdGhpcy5yZWZyZXNoLCBbXSk7XG4gICAgfVxuICB9XG4gIC8qKlxuICAgKiBUaGUgbWV0aG9kIHJldHVybnMgdGhlIGZsYWcgd2hldGhlciBzdXBwb3J0ZWQgdGhpcyBzdG9yYWdlIHR5cGUgb3Igbm90XG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cblxuXG4gIEV2ZXJDb29raWUucHJvdG90eXBlLmlzU3VwcG9ydGVkID0gZnVuY3Rpb24gaXNTdXBwb3J0ZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RvcmVzICYmIHRoaXMuc3RvcmVzLmxlbmd0aCA+IDA7XG4gIH07XG4gIC8qKlxuICAgKiBUaGUgbWV0aG9kIHNldHMgdGhlIHZhbHVlIGFuZCByZXR1cm5zIHRydWUgaWYgaXQgaGFzIGJlZW4gc2V0XG4gICAqIEBwYXJhbSBjaGVja1N1cHBvcnQge2Jvb2xlYW59XG4gICAqIEBwYXJhbSBrZXkge3N0cmluZ31cbiAgICogQHBhcmFtIHZhbHVlIHtzdHJpbmd9XG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cblxuXG4gIEV2ZXJDb29raWUucHJvdG90eXBlLnNldEl0ZW0gPSBmdW5jdGlvbiBzZXRJdGVtKCkge1xuICAgIHZhciBjaGVja1N1cHBvcnQgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHRydWU7XG4gICAgdmFyIGtleSA9IGFyZ3VtZW50c1sxXTtcbiAgICB2YXIgdmFsdWUgPSBhcmd1bWVudHNbMl07XG5cbiAgICAvKipcbiAgICAgKiBTZXQgcmVzdWx0IGZsYWcgYXMgdHJ1ZVxuICAgICAqIEB0eXBlIHtib29sZWFufVxuICAgICAqL1xuICAgIHZhciBib29SZXN1bHQgPSB0cnVlO1xuICAgIC8qKlxuICAgICAqIFN0b3Agc2VsZiByZWZyZXNoIHByb2Nlc3NcbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICB0aGlzLnN0b3BSZWZyZXNoID0gdHJ1ZTtcbiAgICB0cnkge1xuICAgICAgLyoqXG4gICAgICAgKiBWYWxpZGF0ZSBpbnB1dCBkYXRhXG4gICAgICAgKi9cbiAgICAgIGlmICh0eXBlb2YgY2hlY2tTdXBwb3J0ID09PSBcImJvb2xlYW5cIiAmJiB0eXBlb2Yga2V5ID09PSBcInN0cmluZ1wiICYmIHRoaXMucmVnVmFsaWRLZXkudGVzdChrZXkpICYmIHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIiAmJiAodmFsdWUgPT09IFwiXCIgfHwgdGhpcy5yZWdWYWxpZEtleS50ZXN0KHZhbHVlKSkpIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIElmIHRoYXQgc3RvcmUgaXMgc3VwcG9ydGVkXG4gICAgICAgICAqL1xuICAgICAgICBpZiAoIWNoZWNrU3VwcG9ydCB8fCB0aGlzLmlzU3VwcG9ydGVkKCkpIHtcbiAgICAgICAgICAvKipcbiAgICAgICAgICAgKiBJbml0aWFsaXNlIHN0b3JlIHJlc3VsdCBhcnJheVxuICAgICAgICAgICAqIEB0eXBlIHtBcnJheX1cbiAgICAgICAgICAgKi9cbiAgICAgICAgICB2YXIgYXJSZXN1bHRzID0gW107XG4gICAgICAgICAgLyoqXG4gICAgICAgICAgICogSXRlcmF0ZSB0aHJvdWdoIGFsbCBzdXBwb3J0ZWQgc3RvcmVzXG4gICAgICAgICAgICovXG4gICAgICAgICAgZm9yICh2YXIgX2l0ZXJhdG9yID0gdGhpcy5zdG9yZXMsIF9pc0FycmF5ID0gQXJyYXkuaXNBcnJheShfaXRlcmF0b3IpLCBfaSA9IDAsIF9pdGVyYXRvciA9IF9pc0FycmF5ID8gX2l0ZXJhdG9yIDogX2l0ZXJhdG9yW1N5bWJvbC5pdGVyYXRvcl0oKTs7KSB7XG4gICAgICAgICAgICB2YXIgX3JlZjtcblxuICAgICAgICAgICAgaWYgKF9pc0FycmF5KSB7XG4gICAgICAgICAgICAgIGlmIChfaSA+PSBfaXRlcmF0b3IubGVuZ3RoKSBicmVhaztcbiAgICAgICAgICAgICAgX3JlZiA9IF9pdGVyYXRvcltfaSsrXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIF9pID0gX2l0ZXJhdG9yLm5leHQoKTtcbiAgICAgICAgICAgICAgaWYgKF9pLmRvbmUpIGJyZWFrO1xuICAgICAgICAgICAgICBfcmVmID0gX2kudmFsdWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBzdG9yZSA9IF9yZWY7XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogV3JpdGUgc3RvcmUgb3BlcmF0aW9uIHJlc3VsdCB0byByZXN1bHQgYXJyYXlcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgYXJSZXN1bHRzLnB1c2goc3RvcmUuc2V0SXRlbShmYWxzZSwga2V5LCB2YWx1ZSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvKipcbiAgICAgICAgICAgKiBJZiB0aGVyZSBleGlzdCByZXN1bHQgYW5kIG9uZSBvZiB0aGVtIGlzIHRydWUsIGl0IGlzIG1lYW5zLCB0aGF0IHZhbHVlIHdhcyBzZXRcbiAgICAgICAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICAgICAgICAgKi9cbiAgICAgICAgICBib29SZXN1bHQgPSBhclJlc3VsdHMubGVuZ3RoID4gMCAmJiBhclJlc3VsdHMuaW5kZXhPZih0cnVlKSAhPT0gLTE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLyoqXG4gICAgICAgICAgICogSWYgc3RvcmVzIGRvZXMgbm90IHN1cHBvcnRlZCwgdmFsdWUgY2FuIGJlIHNldFxuICAgICAgICAgICAqIEB0eXBlIHtib29sZWFufVxuICAgICAgICAgICAqL1xuICAgICAgICAgIGJvb1Jlc3VsdCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvKipcbiAgICAgICAgICogSWYgaW5wdXQgZGF0YSBpcyBub3QgdmFsaWRcbiAgICAgICAgICovXG4gICAgICAgIGJvb1Jlc3VsdCA9IGZhbHNlO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIC8qKlxuICAgICAgICogSWYgc29tZXRoaW5nIGdvZXMgd3JvbmcsIHZhbHVlIGNhbiBiZSBzZXRcbiAgICAgICAqIEB0eXBlIHtib29sZWFufVxuICAgICAgICovXG4gICAgICBib29SZXN1bHQgPSBmYWxzZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU3RhcnQgc2VsZiByZWZyZXNoIHByb2Nlc3NcbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICB0aGlzLnN0b3BSZWZyZXNoID0gZmFsc2U7XG4gICAgLyoqXG4gICAgICogUmV0dXJuIHNldCBpdGVtIHN0YXR1c1xuICAgICAqL1xuICAgIHJldHVybiBib29SZXN1bHQ7XG4gIH07XG4gIC8qKlxuICAgKiBUaGUgbWV0aG9kIHJlYWRzIHRoZSB2YWx1ZSBhbmQgcmV0dXJucyBpdCBvciByZXR1cm5zIGZhbHNlIGlmIHRoZSB2YWx1ZSBkb2VzIG5vdCBleGlzdFxuICAgKiBAcGFyYW0gY2hlY2tTdXBwb3J0IHtib29sZWFufVxuICAgKiBAcGFyYW0ga2V5IHtzdHJpbmd9XG4gICAqIEByZXR1cm5zIHtzdHJpbmd8Ym9vbGVhbn1cbiAgICovXG5cblxuICBFdmVyQ29va2llLnByb3RvdHlwZS5nZXRJdGVtID0gZnVuY3Rpb24gZ2V0SXRlbSgpIHtcbiAgICB2YXIgY2hlY2tTdXBwb3J0ID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB0cnVlO1xuICAgIHZhciBrZXkgPSBhcmd1bWVudHNbMV07XG5cbiAgICAvKipcbiAgICAgKiBTZXQgcmVzdWx0IGZsYWcgYXMgdHJ1ZVxuICAgICAqIEB0eXBlIHtib29sZWFufHN0cmluZ31cbiAgICAgKi9cbiAgICB2YXIgYm9vUmVzdWx0ID0gZmFsc2U7XG4gICAgLyoqXG4gICAgICogU3RvcCBzZWxmIHJlZnJlc2ggcHJvY2Vzc1xuICAgICAqIEB0eXBlIHtib29sZWFufVxuICAgICAqL1xuICAgIHRoaXMuc3RvcFJlZnJlc2ggPSB0cnVlO1xuICAgIHRyeSB7XG4gICAgICAvKipcbiAgICAgICAqIFZhbGlkYXRlIGlucHV0IGRhdGFcbiAgICAgICAqL1xuICAgICAgaWYgKHR5cGVvZiBjaGVja1N1cHBvcnQgPT09IFwiYm9vbGVhblwiICYmIHR5cGVvZiBrZXkgPT09IFwic3RyaW5nXCIgJiYgdGhpcy5yZWdWYWxpZEtleS50ZXN0KGtleSkpIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIElmIHRoYXQgc3RvcmUgaXMgc3VwcG9ydGVkXG4gICAgICAgICAqL1xuICAgICAgICBpZiAoIWNoZWNrU3VwcG9ydCB8fCB0aGlzLmlzU3VwcG9ydGVkKCkpIHtcbiAgICAgICAgICAvKipcbiAgICAgICAgICAgKiBJbml0aWFsaXNlIHRlbXBvcmFyeSBzdG9yZSByZXN1bHQgYXJyYXlcbiAgICAgICAgICAgKiBAdHlwZSB7c3RyaW5nW119XG4gICAgICAgICAgICovXG4gICAgICAgICAgdmFyIGxvY2FsQXJyUmVzdWx0cyA9IFtdO1xuICAgICAgICAgIC8qKlxuICAgICAgICAgICAqIEl0ZXJhdGUgdGhyb3VnaCBhbGwgc3VwcG9ydGVkIHN0b3Jlc1xuICAgICAgICAgICAqL1xuICAgICAgICAgIGZvciAodmFyIF9pdGVyYXRvcjIgPSB0aGlzLnN0b3JlcywgX2lzQXJyYXkyID0gQXJyYXkuaXNBcnJheShfaXRlcmF0b3IyKSwgX2kyID0gMCwgX2l0ZXJhdG9yMiA9IF9pc0FycmF5MiA/IF9pdGVyYXRvcjIgOiBfaXRlcmF0b3IyW1N5bWJvbC5pdGVyYXRvcl0oKTs7KSB7XG4gICAgICAgICAgICB2YXIgX3JlZjI7XG5cbiAgICAgICAgICAgIGlmIChfaXNBcnJheTIpIHtcbiAgICAgICAgICAgICAgaWYgKF9pMiA+PSBfaXRlcmF0b3IyLmxlbmd0aCkgYnJlYWs7XG4gICAgICAgICAgICAgIF9yZWYyID0gX2l0ZXJhdG9yMltfaTIrK107XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBfaTIgPSBfaXRlcmF0b3IyLm5leHQoKTtcbiAgICAgICAgICAgICAgaWYgKF9pMi5kb25lKSBicmVhaztcbiAgICAgICAgICAgICAgX3JlZjIgPSBfaTIudmFsdWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBzdG9yZSA9IF9yZWYyO1xuXG4gICAgICAgICAgICB2YXIgdmFsdWUgPSBzdG9yZS5nZXRJdGVtKGZhbHNlLCBrZXkpO1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBJZiBzdG9yZSBoYXMgdGhpcyB2YWx1ZVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAqIFdyaXRlIHN0b3JlIG9wZXJhdGlvbiByZXN1bHQgdG8gcmVzdWx0IGFycmF5XG4gICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICBsb2NhbEFyclJlc3VsdHMucHVzaCh2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIC8qKlxuICAgICAgICAgICAqIEluaXRpYWxpc2Ugc3RvcmUgcmVzdWx0IGFycmF5XG4gICAgICAgICAgICogQHR5cGUge09iamVjdH1cbiAgICAgICAgICAgKi9cbiAgICAgICAgICB2YXIgYXJSZXN1bHRzID0ge307XG4gICAgICAgICAgdmFyIG51bU1heCA9IDA7XG4gICAgICAgICAgLyoqXG4gICAgICAgICAgICogTG9va2luZyBmb3IgdGhlIG1vc3QgZnJlcXVlbnRseSBtZW50aW9uZWQgcmVzdWx0XG4gICAgICAgICAgICovXG4gICAgICAgICAgZm9yICh2YXIgX2l0ZXJhdG9yMyA9IGxvY2FsQXJyUmVzdWx0cywgX2lzQXJyYXkzID0gQXJyYXkuaXNBcnJheShfaXRlcmF0b3IzKSwgX2kzID0gMCwgX2l0ZXJhdG9yMyA9IF9pc0FycmF5MyA/IF9pdGVyYXRvcjMgOiBfaXRlcmF0b3IzW1N5bWJvbC5pdGVyYXRvcl0oKTs7KSB7XG4gICAgICAgICAgICB2YXIgX3JlZjM7XG5cbiAgICAgICAgICAgIGlmIChfaXNBcnJheTMpIHtcbiAgICAgICAgICAgICAgaWYgKF9pMyA+PSBfaXRlcmF0b3IzLmxlbmd0aCkgYnJlYWs7XG4gICAgICAgICAgICAgIF9yZWYzID0gX2l0ZXJhdG9yM1tfaTMrK107XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBfaTMgPSBfaXRlcmF0b3IzLm5leHQoKTtcbiAgICAgICAgICAgICAgaWYgKF9pMy5kb25lKSBicmVhaztcbiAgICAgICAgICAgICAgX3JlZjMgPSBfaTMudmFsdWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBpID0gX3JlZjM7XG5cbiAgICAgICAgICAgIGlmICghYXJSZXN1bHRzW2ldKSB7XG4gICAgICAgICAgICAgIGFyUmVzdWx0c1tpXSA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhclJlc3VsdHNbaV0rKztcbiAgICAgICAgICAgIGlmIChhclJlc3VsdHNbaV0gPiBudW1NYXgpIHtcbiAgICAgICAgICAgICAgbnVtTWF4ID0gYXJSZXN1bHRzW2ldO1xuICAgICAgICAgICAgICBib29SZXN1bHQgPSBpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvKipcbiAgICAgICAgICAgKiBJZiBzdG9yZXMgZG9lcyBub3Qgc3VwcG9ydGVkLCB2YWx1ZSBjYW4gYmUgc2V0XG4gICAgICAgICAgICogQHR5cGUge2Jvb2xlYW59XG4gICAgICAgICAgICovXG4gICAgICAgICAgYm9vUmVzdWx0ID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJZiBpbnB1dCBkYXRhIGlzIG5vdCB2YWxpZFxuICAgICAgICAgKi9cbiAgICAgICAgYm9vUmVzdWx0ID0gZmFsc2U7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgLyoqXG4gICAgICAgKiBJZiBzb21ldGhpbmcgZ29lcyB3cm9uZywgdmFsdWUgY2FuIGJlIHNldFxuICAgICAgICogQHR5cGUge2Jvb2xlYW59XG4gICAgICAgKi9cbiAgICAgIGJvb1Jlc3VsdCA9IGZhbHNlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTdGFydCBzZWxmIHJlZnJlc2ggcHJvY2Vzc1xuICAgICAqIEB0eXBlIHtib29sZWFufVxuICAgICAqL1xuICAgIHRoaXMuc3RvcFJlZnJlc2ggPSBmYWxzZTtcbiAgICAvKipcbiAgICAgKiBSZXR1cm4gc2V0IGl0ZW0gc3RhdHVzXG4gICAgICovXG4gICAgcmV0dXJuIGJvb1Jlc3VsdDtcbiAgfTtcbiAgLyoqXG4gICAqIFRoZSBtZXRob2QgcmVtb3ZlcyB0aGUgdmFsdWUgYW5kIHJldHVybiB0cnVlIGlmIHRoZSB2YWx1ZSBkb2VzIG5vdCBleGlzdFxuICAgKiBAcGFyYW0gY2hlY2tTdXBwb3J0IHtib29sZWFufVxuICAgKiBAcGFyYW0ga2V5IHtzdHJpbmd9XG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cblxuXG4gIEV2ZXJDb29raWUucHJvdG90eXBlLnJlbW92ZUl0ZW0gPSBmdW5jdGlvbiByZW1vdmVJdGVtKCkge1xuICAgIHZhciBjaGVja1N1cHBvcnQgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHRydWU7XG4gICAgdmFyIGtleSA9IGFyZ3VtZW50c1sxXTtcblxuICAgIC8qKlxuICAgICAqIFNldCByZXN1bHQgZmxhZyBhcyB0cnVlXG4gICAgICogQHR5cGUge2Jvb2xlYW59XG4gICAgICovXG4gICAgdmFyIGJvb1Jlc3VsdCA9IHRydWU7XG4gICAgLyoqXG4gICAgICogU3RvcCBzZWxmIHJlZnJlc2ggcHJvY2Vzc1xuICAgICAqIEB0eXBlIHtib29sZWFufVxuICAgICAqL1xuICAgIHRoaXMuc3RvcFJlZnJlc2ggPSB0cnVlO1xuICAgIHRyeSB7XG4gICAgICAvKipcbiAgICAgICAqIFZhbGlkYXRlIGlucHV0IGRhdGFcbiAgICAgICAqL1xuICAgICAgaWYgKHR5cGVvZiBjaGVja1N1cHBvcnQgPT09IFwiYm9vbGVhblwiICYmIHR5cGVvZiBrZXkgPT09IFwic3RyaW5nXCIgJiYgdGhpcy5yZWdWYWxpZEtleS50ZXN0KGtleSkpIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIElmIHRoYXQgc3RvcmUgaXMgc3VwcG9ydGVkXG4gICAgICAgICAqL1xuICAgICAgICBpZiAoIWNoZWNrU3VwcG9ydCB8fCB0aGlzLmlzU3VwcG9ydGVkKCkpIHtcbiAgICAgICAgICAvKipcbiAgICAgICAgICAgKiBJbml0aWFsaXNlIHN0b3JlIHJlc3VsdCBjb3VudGVyXG4gICAgICAgICAgICogQHR5cGUge251bWJlcn1cbiAgICAgICAgICAgKi9cbiAgICAgICAgICB2YXIgYXJSZXN1bHQgPSAwO1xuICAgICAgICAgIC8qKlxuICAgICAgICAgICAqIEl0ZXJhdGUgdGhyb3VnaCBhbGwgc3VwcG9ydGVkIHN0b3Jlc1xuICAgICAgICAgICAqL1xuICAgICAgICAgIGZvciAodmFyIF9pdGVyYXRvcjQgPSB0aGlzLnN0b3JlcywgX2lzQXJyYXk0ID0gQXJyYXkuaXNBcnJheShfaXRlcmF0b3I0KSwgX2k0ID0gMCwgX2l0ZXJhdG9yNCA9IF9pc0FycmF5NCA/IF9pdGVyYXRvcjQgOiBfaXRlcmF0b3I0W1N5bWJvbC5pdGVyYXRvcl0oKTs7KSB7XG4gICAgICAgICAgICB2YXIgX3JlZjQ7XG5cbiAgICAgICAgICAgIGlmIChfaXNBcnJheTQpIHtcbiAgICAgICAgICAgICAgaWYgKF9pNCA+PSBfaXRlcmF0b3I0Lmxlbmd0aCkgYnJlYWs7XG4gICAgICAgICAgICAgIF9yZWY0ID0gX2l0ZXJhdG9yNFtfaTQrK107XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBfaTQgPSBfaXRlcmF0b3I0Lm5leHQoKTtcbiAgICAgICAgICAgICAgaWYgKF9pNC5kb25lKSBicmVhaztcbiAgICAgICAgICAgICAgX3JlZjQgPSBfaTQudmFsdWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBzdG9yZSA9IF9yZWY0O1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIElmIHN0b3JlIHN1cHBvcnRlZCAoTm90IHJlcXVpcmVkLCB0aGUgc3RvcmVzIGlzIGNoZWNrZWQgZHVyaW5nIGluaXRpYWxpemF0aW9uKVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBhclJlc3VsdCArPSAxICogc3RvcmUucmVtb3ZlSXRlbShmYWxzZSwga2V5KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgLyoqXG4gICAgICAgICAgICogSWYgcmVtb3ZlZCBjb3VudCBlcXVhbCB0byBzdG9yZXMgY291bnRcbiAgICAgICAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICAgICAgICAgKi9cbiAgICAgICAgICBib29SZXN1bHQgPSBhclJlc3VsdCA9PT0gdGhpcy5zdG9yZXMubGVuZ3RoO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8qKlxuICAgICAgICAgICAqIElmIHN0b3JlcyBkb2VzIG5vdCBzdXBwb3J0ZWQsIHZhbHVlIGNhbiBiZSBzZXRcbiAgICAgICAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICAgICAgICAgKi9cbiAgICAgICAgICBib29SZXN1bHQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIElmIGlucHV0IGRhdGEgaXMgbm90IHZhbGlkXG4gICAgICAgICAqL1xuICAgICAgICBib29SZXN1bHQgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAvKipcbiAgICAgICAqIElmIHNvbWV0aGluZyBnb2VzIHdyb25nLCB2YWx1ZSBjYW4gYmUgc2V0XG4gICAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICAgICAqL1xuICAgICAgYm9vUmVzdWx0ID0gZmFsc2U7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFN0YXJ0IHNlbGYgcmVmcmVzaCBwcm9jZXNzXG4gICAgICogQHR5cGUge2Jvb2xlYW59XG4gICAgICovXG4gICAgdGhpcy5zdG9wUmVmcmVzaCA9IGZhbHNlO1xuICAgIC8qKlxuICAgICAqIFJldHVybiBzZXQgaXRlbSBzdGF0dXNcbiAgICAgKi9cbiAgICByZXR1cm4gYm9vUmVzdWx0O1xuICB9O1xuICAvKipcbiAgICogVGhlIG1ldGhvZCByZXR1cm5zIHRoZSBhcnJheSBvZiBzdHJpbmcgb2YgYXZhaWxhYmxlIGtleXNcbiAgICogQHBhcmFtIGNoZWNrU3VwcG9ydCB7Ym9vbGVhbn1cbiAgICogQHJldHVybnMge3N0cmluZ1tdfVxuICAgKi9cblxuXG4gIEV2ZXJDb29raWUucHJvdG90eXBlLmdldEtleXMgPSBmdW5jdGlvbiBnZXRLZXlzKCkge1xuICAgIHZhciBjaGVja1N1cHBvcnQgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHRydWU7XG5cbiAgICAvKipcbiAgICAgKiBTZXQgcmVzdWx0IGZsYWcgYXMgdHJ1ZVxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgdmFyIGJvb1Jlc3VsdCA9IHt9O1xuICAgIC8qKlxuICAgICAqIFN0b3Agc2VsZiByZWZyZXNoIHByb2Nlc3NcbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICB0aGlzLnN0b3BSZWZyZXNoID0gdHJ1ZTtcbiAgICB0cnkge1xuICAgICAgLyoqXG4gICAgICAgKiBWYWxpZGF0ZSBpbnB1dCBkYXRhXG4gICAgICAgKi9cbiAgICAgIGlmICh0eXBlb2YgY2hlY2tTdXBwb3J0ID09PSBcImJvb2xlYW5cIikge1xuICAgICAgICAvKipcbiAgICAgICAgICogSWYgdGhhdCBzdG9yZSBpcyBzdXBwb3J0ZWRcbiAgICAgICAgICovXG4gICAgICAgIGlmICghY2hlY2tTdXBwb3J0IHx8IHRoaXMuaXNTdXBwb3J0ZWQoKSkge1xuICAgICAgICAgIC8qKlxuICAgICAgICAgICAqIEl0ZXJhdGUgdGhyb3VnaCBhbGwgc3VwcG9ydGVkIHN0b3Jlc1xuICAgICAgICAgICAqL1xuICAgICAgICAgIGZvciAodmFyIF9pdGVyYXRvcjUgPSB0aGlzLnN0b3JlcywgX2lzQXJyYXk1ID0gQXJyYXkuaXNBcnJheShfaXRlcmF0b3I1KSwgX2k1ID0gMCwgX2l0ZXJhdG9yNSA9IF9pc0FycmF5NSA/IF9pdGVyYXRvcjUgOiBfaXRlcmF0b3I1W1N5bWJvbC5pdGVyYXRvcl0oKTs7KSB7XG4gICAgICAgICAgICB2YXIgX3JlZjU7XG5cbiAgICAgICAgICAgIGlmIChfaXNBcnJheTUpIHtcbiAgICAgICAgICAgICAgaWYgKF9pNSA+PSBfaXRlcmF0b3I1Lmxlbmd0aCkgYnJlYWs7XG4gICAgICAgICAgICAgIF9yZWY1ID0gX2l0ZXJhdG9yNVtfaTUrK107XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBfaTUgPSBfaXRlcmF0b3I1Lm5leHQoKTtcbiAgICAgICAgICAgICAgaWYgKF9pNS5kb25lKSBicmVhaztcbiAgICAgICAgICAgICAgX3JlZjUgPSBfaTUudmFsdWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBzdG9yZSA9IF9yZWY1O1xuXG4gICAgICAgICAgICB2YXIgdmFsdWUgPSBzdG9yZS5nZXRLZXlzKGZhbHNlKTtcbiAgICAgICAgICAgIGlmICh2YWx1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgIGZvciAodmFyIF9pdGVyYXRvcjYgPSB2YWx1ZSwgX2lzQXJyYXk2ID0gQXJyYXkuaXNBcnJheShfaXRlcmF0b3I2KSwgX2k2ID0gMCwgX2l0ZXJhdG9yNiA9IF9pc0FycmF5NiA/IF9pdGVyYXRvcjYgOiBfaXRlcmF0b3I2W1N5bWJvbC5pdGVyYXRvcl0oKTs7KSB7XG4gICAgICAgICAgICAgICAgdmFyIF9yZWY2O1xuXG4gICAgICAgICAgICAgICAgaWYgKF9pc0FycmF5Nikge1xuICAgICAgICAgICAgICAgICAgaWYgKF9pNiA+PSBfaXRlcmF0b3I2Lmxlbmd0aCkgYnJlYWs7XG4gICAgICAgICAgICAgICAgICBfcmVmNiA9IF9pdGVyYXRvcjZbX2k2KytdO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBfaTYgPSBfaXRlcmF0b3I2Lm5leHQoKTtcbiAgICAgICAgICAgICAgICAgIGlmIChfaTYuZG9uZSkgYnJlYWs7XG4gICAgICAgICAgICAgICAgICBfcmVmNiA9IF9pNi52YWx1ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgaSA9IF9yZWY2O1xuXG4gICAgICAgICAgICAgICAgYm9vUmVzdWx0W2ldID0gdHJ1ZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvKipcbiAgICAgICAgICAgKiBJZiBzdG9yZXMgZG9lcyBub3Qgc3VwcG9ydGVkLCB2YWx1ZSBjYW4gYmUgc2V0XG4gICAgICAgICAgICogQHR5cGUge09iamVjdH1cbiAgICAgICAgICAgKi9cbiAgICAgICAgICBib29SZXN1bHQgPSB7fTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIElmIGlucHV0IGRhdGEgaXMgbm90IHZhbGlkXG4gICAgICAgICAqL1xuICAgICAgICBib29SZXN1bHQgPSB7fTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAvKipcbiAgICAgICAqIElmIHNvbWV0aGluZyBnb2VzIHdyb25nLCB2YWx1ZSBjYW4gYmUgc2V0XG4gICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICovXG4gICAgICBib29SZXN1bHQgPSB7fTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU3RhcnQgc2VsZiByZWZyZXNoIHByb2Nlc3NcbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICB0aGlzLnN0b3BSZWZyZXNoID0gZmFsc2U7XG4gICAgLyoqXG4gICAgICogUmV0dXJuIHNldCBpdGVtIHN0YXR1c1xuICAgICAqL1xuICAgIHJldHVybiBPYmplY3Qua2V5cyhib29SZXN1bHQpO1xuICB9O1xuICAvKipcbiAgICogVGhlIG1ldGhvZCBjbGVhbnMgdGhlIHN0b3JhZ2UgYW5kIHJldHVybiB0cnVlIGlmIGl0IGlzIGVtcHR5XG4gICAqIEBwYXJhbSBjaGVja1N1cHBvcnQge2Jvb2xlYW59XG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cblxuXG4gIEV2ZXJDb29raWUucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gY2xlYXIoKSB7XG4gICAgdmFyIGNoZWNrU3VwcG9ydCA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogdHJ1ZTtcblxuICAgIC8qKlxuICAgICAqIFNldCByZXN1bHQgZmxhZyBhcyB0cnVlXG4gICAgICogQHR5cGUge2Jvb2xlYW59XG4gICAgICovXG4gICAgdmFyIGJvb1Jlc3VsdCA9IHRydWU7XG4gICAgLyoqXG4gICAgICogU3RvcCBzZWxmIHJlZnJlc2ggcHJvY2Vzc1xuICAgICAqIEB0eXBlIHtib29sZWFufVxuICAgICAqL1xuICAgIHRoaXMuc3RvcFJlZnJlc2ggPSB0cnVlO1xuICAgIHRyeSB7XG4gICAgICAvKipcbiAgICAgICAqIFZhbGlkYXRlIGlucHV0IGRhdGFcbiAgICAgICAqL1xuICAgICAgaWYgKHR5cGVvZiBjaGVja1N1cHBvcnQgPT09IFwiYm9vbGVhblwiKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJZiB0aGF0IHN0b3JlIGlzIHN1cHBvcnRlZFxuICAgICAgICAgKi9cbiAgICAgICAgaWYgKCFjaGVja1N1cHBvcnQgfHwgdGhpcy5pc1N1cHBvcnRlZCgpKSB7XG4gICAgICAgICAgLyoqXG4gICAgICAgICAgICogSW5pdGlhbGlzZSBzdG9yZSByZXN1bHQgY291bnRlclxuICAgICAgICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICAgICAgICovXG4gICAgICAgICAgdmFyIGFyUmVzdWx0ID0gMDtcbiAgICAgICAgICAvKipcbiAgICAgICAgICAgKiBJdGVyYXRlIHRocm91Z2ggYWxsIHN1cHBvcnRlZCBzdG9yZXNcbiAgICAgICAgICAgKi9cbiAgICAgICAgICBmb3IgKHZhciBfaXRlcmF0b3I3ID0gdGhpcy5zdG9yZXMsIF9pc0FycmF5NyA9IEFycmF5LmlzQXJyYXkoX2l0ZXJhdG9yNyksIF9pNyA9IDAsIF9pdGVyYXRvcjcgPSBfaXNBcnJheTcgPyBfaXRlcmF0b3I3IDogX2l0ZXJhdG9yN1tTeW1ib2wuaXRlcmF0b3JdKCk7Oykge1xuICAgICAgICAgICAgdmFyIF9yZWY3O1xuXG4gICAgICAgICAgICBpZiAoX2lzQXJyYXk3KSB7XG4gICAgICAgICAgICAgIGlmIChfaTcgPj0gX2l0ZXJhdG9yNy5sZW5ndGgpIGJyZWFrO1xuICAgICAgICAgICAgICBfcmVmNyA9IF9pdGVyYXRvcjdbX2k3KytdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgX2k3ID0gX2l0ZXJhdG9yNy5uZXh0KCk7XG4gICAgICAgICAgICAgIGlmIChfaTcuZG9uZSkgYnJlYWs7XG4gICAgICAgICAgICAgIF9yZWY3ID0gX2k3LnZhbHVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgc3RvcmUgPSBfcmVmNztcblxuICAgICAgICAgICAgYXJSZXN1bHQgKz0gMSAqIHN0b3JlLmNsZWFyKGZhbHNlKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgLyoqXG4gICAgICAgICAgICogSWYgcmVtb3ZlZCBjb3VudCBlcXVhbCB0byBzdG9yZXMgY291bnRcbiAgICAgICAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICAgICAgICAgKi9cbiAgICAgICAgICBib29SZXN1bHQgPSBhclJlc3VsdCA9PT0gdGhpcy5zdG9yZXMubGVuZ3RoO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8qKlxuICAgICAgICAgICAqIElmIHN0b3JlcyBkb2VzIG5vdCBzdXBwb3J0ZWQsIHZhbHVlIGNhbiBiZSBzZXRcbiAgICAgICAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICAgICAgICAgKi9cbiAgICAgICAgICBib29SZXN1bHQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIElmIGlucHV0IGRhdGEgaXMgbm90IHZhbGlkXG4gICAgICAgICAqL1xuICAgICAgICBib29SZXN1bHQgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAvKipcbiAgICAgICAqIElmIHNvbWV0aGluZyBnb2VzIHdyb25nLCB2YWx1ZSBjYW4gYmUgc2V0XG4gICAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICAgICAqL1xuICAgICAgYm9vUmVzdWx0ID0gZmFsc2U7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFN0YXJ0IHNlbGYgcmVmcmVzaCBwcm9jZXNzXG4gICAgICogQHR5cGUge2Jvb2xlYW59XG4gICAgICovXG4gICAgdGhpcy5zdG9wUmVmcmVzaCA9IGZhbHNlO1xuICAgIC8qKlxuICAgICAqIFJldHVybiBzZXQgaXRlbSBzdGF0dXNcbiAgICAgKi9cbiAgICByZXR1cm4gYm9vUmVzdWx0O1xuICB9O1xuICAvKipcbiAgICogU2VsZiByZWZyZXNoXG4gICAqL1xuXG5cbiAgRXZlckNvb2tpZS5wcm90b3R5cGUucmVmcmVzaCA9IGZ1bmN0aW9uIHJlZnJlc2goKSB7XG4gICAgaWYgKCF0aGlzLnN0b3BSZWZyZXNoKSB7XG4gICAgICB2YXIgYXJyS2V5cyA9IHRoaXMuZ2V0S2V5cyhmYWxzZSk7XG4gICAgICBmb3IgKHZhciBfaXRlcmF0b3I4ID0gYXJyS2V5cywgX2lzQXJyYXk4ID0gQXJyYXkuaXNBcnJheShfaXRlcmF0b3I4KSwgX2k4ID0gMCwgX2l0ZXJhdG9yOCA9IF9pc0FycmF5OCA/IF9pdGVyYXRvcjggOiBfaXRlcmF0b3I4W1N5bWJvbC5pdGVyYXRvcl0oKTs7KSB7XG4gICAgICAgIHZhciBfcmVmODtcblxuICAgICAgICBpZiAoX2lzQXJyYXk4KSB7XG4gICAgICAgICAgaWYgKF9pOCA+PSBfaXRlcmF0b3I4Lmxlbmd0aCkgYnJlYWs7XG4gICAgICAgICAgX3JlZjggPSBfaXRlcmF0b3I4W19pOCsrXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBfaTggPSBfaXRlcmF0b3I4Lm5leHQoKTtcbiAgICAgICAgICBpZiAoX2k4LmRvbmUpIGJyZWFrO1xuICAgICAgICAgIF9yZWY4ID0gX2k4LnZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGtleSA9IF9yZWY4O1xuXG4gICAgICAgIHZhciB2YWx1ZSA9IHRoaXMuZ2V0SXRlbShmYWxzZSwga2V5KTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEl0ZXJhdGUgdGhyb3VnaCBhbGwgc3VwcG9ydGVkIHN0b3Jlc1xuICAgICAgICAgKi9cbiAgICAgICAgZm9yICh2YXIgX2l0ZXJhdG9yOSA9IHRoaXMuc3RvcmVzLCBfaXNBcnJheTkgPSBBcnJheS5pc0FycmF5KF9pdGVyYXRvcjkpLCBfaTkgPSAwLCBfaXRlcmF0b3I5ID0gX2lzQXJyYXk5ID8gX2l0ZXJhdG9yOSA6IF9pdGVyYXRvcjlbU3ltYm9sLml0ZXJhdG9yXSgpOzspIHtcbiAgICAgICAgICB2YXIgX3JlZjk7XG5cbiAgICAgICAgICBpZiAoX2lzQXJyYXk5KSB7XG4gICAgICAgICAgICBpZiAoX2k5ID49IF9pdGVyYXRvcjkubGVuZ3RoKSBicmVhaztcbiAgICAgICAgICAgIF9yZWY5ID0gX2l0ZXJhdG9yOVtfaTkrK107XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF9pOSA9IF9pdGVyYXRvcjkubmV4dCgpO1xuICAgICAgICAgICAgaWYgKF9pOS5kb25lKSBicmVhaztcbiAgICAgICAgICAgIF9yZWY5ID0gX2k5LnZhbHVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciBzdG9yZSA9IF9yZWY5O1xuXG4gICAgICAgICAgaWYgKHZhbHVlICE9PSBzdG9yZS5nZXRJdGVtKGZhbHNlLCBrZXkpKSB7XG4gICAgICAgICAgICBzdG9yZS5zZXRJdGVtKGZhbHNlLCBrZXksIHZhbHVlLnRvU3RyaW5nKCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgLyoqXG4gICAqIFN0b3AgZXZlcnkgY29va2llXG4gICAqL1xuXG5cbiAgRXZlckNvb2tpZS5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG4gICAgX0FuaW1hdGlvbkZyYW1lMi5kZWZhdWx0LnVuc3Vic2NyaWJlKHRoaXMucmVmcmVzaElEKTtcbiAgICB0aGlzLnN0b3BSZWZyZXNoID0gdHJ1ZTtcbiAgICB0aGlzLnJlZnJlc2ggPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9O1xuICAgIHRoaXMuc3RvcmVzID0gW107XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgcmV0dXJuIEV2ZXJDb29raWU7XG59KCk7XG5cbmV4cG9ydHMuZGVmYXVsdCA9IEV2ZXJDb29raWU7XG5cbm1vZHVsZS5leHBvcnRzID0gRXZlckNvb2tpZTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vRXZlckNvb2tpZS9saWIvRXZlckNvb2tpZS50c1xuLy8gbW9kdWxlIGlkID0gMzBcbi8vIG1vZHVsZSBjaHVua3MgPSAxIDIgMyIsIlwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX3R5cGVvZiA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiID8gZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfSA6IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbnZhciByb290ID0gdm9pZCAwO1xuaWYgKHR5cGVvZiB3aW5kb3cgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBpZiAodHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICByb290ID0gZ2xvYmFsO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJvb3QgPSB7fTtcbiAgICB9XG59IGVsc2Uge1xuICAgIHJvb3QgPSB3aW5kb3c7XG59XG4vKipcbiAqIHJlcXVlc3RBbmltYXRpb25GcmFtZSBwb2x5ZmlsbFxuICovXG5yb290LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdHlwZW9mIHJvb3QgIT09IFwidW5kZWZpbmVkXCIgJiYgKHJvb3QucmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8IHJvb3Qud2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8IHJvb3QubW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8IHJvb3Qub1JlcXVlc3RBbmltYXRpb25GcmFtZSB8fCByb290Lm1zUmVxdWVzdEFuaW1hdGlvbkZyYW1lKSB8fCBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICAgICAgcm9vdC5zZXRUaW1lb3V0KGNhbGxiYWNrLCAxMDAwIC8gNjApO1xuICAgIH07XG59KCk7XG4vKipcbiAqIEJpbmQgcG9seWZpbGxcbiAqL1xuZnVuY3Rpb24gYmluZChiKSB7XG4gICAgLyoqXG4gICAgICogSWYgdHJ5IGJpbmQgdmFyaWFibGUgdGhhdCBub3QgYSBmdW5jdGlvbiwgdGhlbiB0aHJvdyBlcnJvclxuICAgICAqL1xuICAgIGlmICh0eXBlb2YgdGhpcyAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJGdW5jdGlvbi5wcm90b3R5cGUuYmluZCAtIHdoYXQgaXMgdHJ5aW5nIHRvIGJlIGJvdW5kIGlzIG5vdCBjYWxsYWJsZVwiKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogbGV0IEFycmF5IHNsaWNlIGZ1bmN0aW9uXG4gICAgICovXG4gICAgdmFyIGEgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG4gICAgdmFyIGYgPSBhLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICB2YXIgZSA9IHRoaXM7XG4gICAgZnVuY3Rpb24gYygpIHtcbiAgICAgICAgLypcbiAgICAgICAgIGlmIChcbiAgICAgICAgIHR5cGVvZiByb290ICE9PSBcInVuZGVmaW5lZFwiICYmXG4gICAgICAgICB0eXBlb2Ygcm9vdC5jb25zb2xlID09PSBcIm9iamVjdFwiICYmXG4gICAgICAgICB0eXBlb2Ygcm9vdC5jb25zb2xlLmxvZyA9PT0gXCJmdW5jdGlvblwiXG4gICAgICAgICApIHtcbiAgICAgICAgIHJvb3QuY29uc29sZS5sb2coXCJCaW5kIHBvbHlmaWxsXCIpO1xuICAgICAgICAgfVxuICAgICAgICAgKi9cbiAgICB9XG4gICAgZnVuY3Rpb24gZCgpIHtcbiAgICAgICAgcmV0dXJuIGUuYXBwbHkodGhpcyBpbnN0YW5jZW9mIGMgPyB0aGlzIDogYiB8fCByb290LCBmLmNvbmNhdChhLmNhbGwoYXJndW1lbnRzKSkpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZWdpc3RlcmVkIHRoaXMgcHJvdG90eXBlIGFzIHByb3RvdHlwZSB0byBiaW5kIGltcGxlbWVudGF0aW9uIGZ1bmN0aW9uc1xuICAgICAqL1xuICAgIGMucHJvdG90eXBlID0gdGhpcy5wcm90b3R5cGU7XG4gICAgZC5wcm90b3R5cGUgPSBuZXcgYygpO1xuICAgIC8qKlxuICAgICAqIFJldHVybiBiaW5kIHBvbHlmaWxsXG4gICAgICovXG4gICAgcmV0dXJuIGQ7XG59XG5GdW5jdGlvbi5wcm90b3R5cGUuYmluZCA9IEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kIHx8IGJpbmQ7XG4vKipcbiAqIE9iamVjdC5rZXlzIHBvbHlmaWxsXG4gKi9cbmZ1bmN0aW9uIGtleXMoKSB7XG4gICAgdmFyIGhhc0RvTm90RW51bUJ1ZyA9ICF7IHRvU3RyaW5nOiBudWxsIH0ucHJvcGVydHlJc0VudW1lcmFibGUoXCJ0b1N0cmluZ1wiKTtcbiAgICB2YXIgZG9Ob3RFbnVtcyA9IFtcInRvU3RyaW5nXCIsIFwidG9Mb2NhbGVTdHJpbmdcIiwgXCJ2YWx1ZU9mXCIsIFwiaGFzT3duUHJvcGVydHlcIiwgXCJpc1Byb3RvdHlwZU9mXCIsIFwicHJvcGVydHlJc0VudW1lcmFibGVcIiwgXCJjb25zdHJ1Y3RvclwiXTtcbiAgICB2YXIgZG9Ob3RFbnVtc0xlbmd0aCA9IGRvTm90RW51bXMubGVuZ3RoO1xuICAgIHJldHVybiBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgIGlmICgodHlwZW9mIG9iaiA9PT0gXCJ1bmRlZmluZWRcIiA/IFwidW5kZWZpbmVkXCIgOiBfdHlwZW9mKG9iaikpICE9PSBcIm9iamVjdFwiICYmICh0eXBlb2Ygb2JqICE9PSBcImZ1bmN0aW9uXCIgfHwgb2JqID09PSBudWxsKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIk9iamVjdC5rZXlzIGNhbGxlZCBvbiBub24tb2JqZWN0XCIpO1xuICAgICAgICB9XG4gICAgICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgcHJvcCBpbiBvYmopIHtcbiAgICAgICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHByb3ApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChoYXNEb05vdEVudW1CdWcpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZG9Ob3RFbnVtc0xlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGRvTm90RW51bXNbaV0pKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGRvTm90RW51bXNbaV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG59XG5PYmplY3Qua2V5cyA9IE9iamVjdC5rZXlzIHx8IGtleXMoKTtcbi8qKlxuICogUmVxdWVzdCBhbmltYXRpb24gZnJhbWUgY2FsbCBzdGFjayBjbGFzc1xuICovXG5cbnZhciBBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAvKipcbiAgICAgKiBDcmVhdGUgcmVxdWVzdCBhbmltYXRpb24gZnJhbWVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBBbmltYXRpb25GcmFtZSgpIHtcbiAgICAgICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIEFuaW1hdGlvbkZyYW1lKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogU3Vic2NyaWJlZCBtZXRob2RzXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnN0YWNrID0ge307XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTdGFydCByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgd2F0Y2hlclxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy53YXRjaCgpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTdWJzY3JpYmUgbWV0aG9kIHRvIHdhdGNoXG4gICAgICogQHBhcmFtIGNvbnRleHRcbiAgICAgKiBAcGFyYW0gY2FsbGJhY2tcbiAgICAgKiBAcGFyYW0gcGFyYW1zXG4gICAgICogQHBhcmFtIElEXG4gICAgICogQHJldHVybiB7Ym9vbGVhbnxzdHJpbmd9XG4gICAgICovXG5cblxuICAgIEFuaW1hdGlvbkZyYW1lLnByb3RvdHlwZS5zdWJzY3JpYmUgPSBmdW5jdGlvbiBzdWJzY3JpYmUoKSB7XG4gICAgICAgIHZhciBjb250ZXh0ID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiByb290O1xuICAgICAgICB2YXIgY2FsbGJhY2sgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9O1xuICAgICAgICB2YXIgcGFyYW1zID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiBbXTtcbiAgICAgICAgdmFyIElEID0gYXJndW1lbnRzWzNdO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJZiBjb250ZXh0IGFuZCBjYWxsYmFjayBwYXNzZWQgYW5kIHRoZXkgYXJlIG9iamVjdCBhbmQgZnVuY3Rpb25cbiAgICAgICAgICovXG4gICAgICAgIGlmICgodHlwZW9mIGNvbnRleHQgPT09IFwidW5kZWZpbmVkXCIgPyBcInVuZGVmaW5lZFwiIDogX3R5cGVvZihjb250ZXh0KSkgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIGNhbGxiYWNrID09PSBcImZ1bmN0aW9uXCIgJiYgKHR5cGVvZiBwYXJhbXMgPT09IFwidW5kZWZpbmVkXCIgPyBcInVuZGVmaW5lZFwiIDogX3R5cGVvZihwYXJhbXMpKSA9PT0gXCJvYmplY3RcIiAmJiBBcnJheS5pc0FycmF5KHBhcmFtcykgJiYgKElEID09PSB1bmRlZmluZWQgfHwgdHlwZW9mIElEID09PSBcInN0cmluZ1wiKSkge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBDcmVhdGUgVUlEXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHZhciBkID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgIHZhciBsb2NhbElEID0gSUQgfHwgXCJ4LVwiICsgZC5nZXRUaW1lKCkgKyBcIi1cIiArIE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSAqIDFlNik7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEFkZCBtZXRob2QgdG8gdGhlIHN0YWNrXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHRoaXMuc3RhY2tbbG9jYWxJRF0gPSB7XG4gICAgICAgICAgICAgICAgY29udGV4dDogY29udGV4dCxcbiAgICAgICAgICAgICAgICBjYWxsYmFjazogY2FsbGJhY2ssXG4gICAgICAgICAgICAgICAgcGFyYW1zOiBwYXJhbXNcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIFdyaXRlIHRvIGNvbnNvbGUgY291bnQgb2YgdGhlIHN1YnNjcmliZWQgbWV0aG9kc1xuICAgICAgICAgICAgICovXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIFJldHVybiBVSURcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgcmV0dXJuIGxvY2FsSUQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFVuc3Vic2NyaWJlIG1ldGhvZCBieSBJRFxuICAgICAqIEBwYXJhbSBJRFxuICAgICAqL1xuXG5cbiAgICBBbmltYXRpb25GcmFtZS5wcm90b3R5cGUudW5zdWJzY3JpYmUgPSBmdW5jdGlvbiB1bnN1YnNjcmliZShJRCkge1xuICAgICAgICBpZiAodHlwZW9mIElEID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIElmIHJlcXVpcmVkIG1ldGhvZCBleGlzdCBpbiB0aGUgc3RhY2tcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgaWYgKHRoaXMuc3RhY2tbSURdKSB7XG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogTnVsbGlmeSBtZXRob2QgaW4gdGhlIHN0YWNrIGFuZCBkZXN0cm95IGl0XG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgdGhpcy5zdGFja1tJRF0gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5zdGFja1tJRF07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFdhdGNoIGFuZCBjYWxsIG1ldGhvZHNcbiAgICAgKi9cblxuXG4gICAgQW5pbWF0aW9uRnJhbWUucHJvdG90eXBlLndhdGNoID0gZnVuY3Rpb24gd2F0Y2goKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIElmIHN0YWNrIGV4aXN0LCBpdCBpcyBhbiBvYmplY3QgYW5kIGl0IGlzIGNvbnRhaW5zIG1ldGhvZHNcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgaWYgKHRoaXMuc3RhY2sgJiYgX3R5cGVvZih0aGlzLnN0YWNrKSA9PT0gXCJvYmplY3RcIiAmJiBPYmplY3Qua2V5cyh0aGlzLnN0YWNrKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogTG9vcCBhbGwgbWV0aG9kcyBpbiBzdGFja1xuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGZvciAodmFyIElEIGluIHRoaXMuc3RhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIFByb2Nlc3Mgb25seSBtZXRob2RzIHdpdGhvdXQgZXh0ZW5kZWQgcHJvcGVydGllc1xuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuc3RhY2suaGFzT3duUHJvcGVydHkoSUQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIElmIElEIGV4aXN0IGFuZCBpdCBpcyBhIHN0cmluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChJRCAmJiB0eXBlb2YgSUQgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIEdldCBzdWJzY3JpYmVkIG1ldGhvZCBwYXJhbXMgYnkgSURcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvYmpDYWxsID0gdGhpcy5zdGFja1tJRF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBJZiBwYXJhbXMgZXhpc3QsIGl0IGlzIGFuIG9iamVjdCwgYW5kIGl0IGlzIGNvbnRhaW5zIGNhbGwgY29udGV4dCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogY2FsbGJhY2ssIGFuZCBwYXJhbWV0ZXJzIHdoaWNoIGlzIGFycmF5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob2JqQ2FsbCAmJiAodHlwZW9mIG9iakNhbGwgPT09IFwidW5kZWZpbmVkXCIgPyBcInVuZGVmaW5lZFwiIDogX3R5cGVvZihvYmpDYWxsKSkgPT09IFwib2JqZWN0XCIgJiYgb2JqQ2FsbC5jb250ZXh0ICYmIG9iakNhbGwuY2FsbGJhY2sgJiYgb2JqQ2FsbC5wYXJhbXMgJiYgX3R5cGVvZihvYmpDYWxsLmNvbnRleHQpID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBvYmpDYWxsLmNhbGxiYWNrID09PSBcImZ1bmN0aW9uXCIgJiYgQXJyYXkuaXNBcnJheShvYmpDYWxsLnBhcmFtcykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICogQ2FsbCBzdWJzY3JpYmVkIG1ldGhvZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmpDYWxsLmNhbGxiYWNrLmFwcGx5KG9iakNhbGwuY29udGV4dCwgb2JqQ2FsbC5wYXJhbXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge31cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZSkge31cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlY2FsbCB3YXRjaGVyXG4gICAgICAgICAqL1xuICAgICAgICByb290LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLndhdGNoLmJpbmQodGhpcykpO1xuICAgIH07XG5cbiAgICByZXR1cm4gQW5pbWF0aW9uRnJhbWU7XG59KCk7XG4vKipcbiAqIENyZWF0ZSBzaW5nbGUgcmVxdWVzdCBhbmltYXRpb24gZnJhbWUgb2JqZWN0XG4gKiBAdHlwZSB7QW5pbWF0aW9uRnJhbWV9XG4gKi9cblxuXG5yb290LkFuaW1hdGlvbkZyYW1lID0gcm9vdC5BbmltYXRpb25GcmFtZSB8fCBuZXcgQW5pbWF0aW9uRnJhbWUoKTtcbi8qKlxuICogRXhwb3J0IHNpbmdsZSBBbmltYXRpb25GcmFtZSBpbnN0YW5jZVxuICovXG52YXIgX0FuaW1hdGlvbkZyYW1lID0gcm9vdC5BbmltYXRpb25GcmFtZTtcbmV4cG9ydHMuZGVmYXVsdCA9IF9BbmltYXRpb25GcmFtZTtcblxubW9kdWxlLmV4cG9ydHMgPSBfQW5pbWF0aW9uRnJhbWU7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L0FuaW1hdGlvbkZyYW1lL2xpYi9BbmltYXRpb25GcmFtZS50c1xuLy8gbW9kdWxlIGlkID0gMzFcbi8vIG1vZHVsZSBjaHVua3MgPSAxIDIgMyIsIlwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX3R5cGVvZiA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiID8gZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfSA6IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbnZhciBVUkwgPSByZXF1aXJlKFwidXJsXCIpO1xuLyoqXG4gKiBUaGUgZG9jdW1lbnQgY29va2llcyBzdG9yYWdlXG4gKi9cblxudmFyIENvb2tpZXMgPSBmdW5jdGlvbiAoKSB7XG4gIC8qKlxuICAgKiBUaGUgY29uc3RydWN0b3Igc2hvdWxkIGFjY2VwdCBhIGhhc2ggdG8gc2VwYXJhdGUgdGhlIHNjb3BlcyBvZiBzdG9yYWdlXG4gICAqIEBwYXJhbSBoYXNoIHtzdHJpbmd9XG4gICAqL1xuICBmdW5jdGlvbiBDb29raWVzKGhhc2gpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgQ29va2llcyk7XG5cbiAgICB0aGlzLnJlZ1ZhbGlkS2V5ID0gbmV3IFJlZ0V4cChcIihbYS16QS1aMC05Xy1dezAsfSlcIiwgXCJpXCIpO1xuICAgIHRoaXMuaGFzaCA9IGhhc2ggfHwgbG9jYXRpb24uaG9zdG5hbWU7XG4gIH1cbiAgLyoqXG4gICAqIFRoZSBtZXRob2QgcmV0dXJucyB0aGUgZmxhZyB3aGV0aGVyIHN1cHBvcnRlZCB0aGlzIHN0b3JhZ2UgdHlwZSBvciBub3RcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuXG5cbiAgQ29va2llcy5wcm90b3R5cGUuaXNTdXBwb3J0ZWQgPSBmdW5jdGlvbiBpc1N1cHBvcnRlZCgpIHtcbiAgICByZXR1cm4gKHR5cGVvZiBkb2N1bWVudCA9PT0gXCJ1bmRlZmluZWRcIiA/IFwidW5kZWZpbmVkXCIgOiBfdHlwZW9mKGRvY3VtZW50KSkgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIGRvY3VtZW50LmNvb2tpZSA9PT0gXCJzdHJpbmdcIjtcbiAgfTtcbiAgLyoqXG4gICAqIFRoZSBtZXRob2Qgc2V0cyB0aGUgdmFsdWUgYW5kIHJldHVybnMgdHJ1ZSBpZiBpdCBoYXMgYmVlbiBzZXRcbiAgICogQHBhcmFtIGNoZWNrU3VwcG9ydCB7Ym9vbGVhbn1cbiAgICogQHBhcmFtIGtleSB7c3RyaW5nfVxuICAgKiBAcGFyYW0gdmFsdWUge3N0cmluZ31cbiAgICogQHBhcmFtIGV4cGlyZXMge251bWJlcn1cbiAgICogQHBhcmFtIHBhdGgge3N0cmluZ31cbiAgICogQHBhcmFtIGRvbWFpbiB7c3RyaW5nfVxuICAgKiBAcGFyYW0gc2VjdXJlIHtib29sZWFufVxuICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgKi9cblxuXG4gIENvb2tpZXMucHJvdG90eXBlLnNldEl0ZW0gPSBmdW5jdGlvbiBzZXRJdGVtKCkge1xuICAgIHZhciBjaGVja1N1cHBvcnQgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHRydWU7XG4gICAgdmFyIGtleSA9IGFyZ3VtZW50c1sxXTtcbiAgICB2YXIgdmFsdWUgPSBhcmd1bWVudHNbMl07XG4gICAgdmFyIGV4cGlyZXMgPSBhcmd1bWVudHMubGVuZ3RoID4gMyAmJiBhcmd1bWVudHNbM10gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1szXSA6IDMwO1xuICAgIHZhciBwYXRoID0gYXJndW1lbnRzLmxlbmd0aCA+IDQgJiYgYXJndW1lbnRzWzRdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbNF0gOiBcIi9cIjtcbiAgICB2YXIgZG9tYWluID0gYXJndW1lbnRzLmxlbmd0aCA+IDUgJiYgYXJndW1lbnRzWzVdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbNV0gOiBsb2NhdGlvbi5ob3N0bmFtZTtcbiAgICB2YXIgc2VjdXJlID0gYXJndW1lbnRzLmxlbmd0aCA+IDYgJiYgYXJndW1lbnRzWzZdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbNl0gOiBsb2NhdGlvbi5wcm90b2NvbCA9PT0gXCJodHRwczpcIjtcblxuICAgIHRyeSB7XG4gICAgICAvKipcbiAgICAgICAqIFZhbGlkYXRlIGlucHV0IGRhdGFcbiAgICAgICAqL1xuICAgICAgaWYgKHR5cGVvZiBjaGVja1N1cHBvcnQgPT09IFwiYm9vbGVhblwiICYmIHR5cGVvZiBrZXkgPT09IFwic3RyaW5nXCIgJiYgdGhpcy5yZWdWYWxpZEtleS50ZXN0KGtleSkgJiYgdHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiICYmICh2YWx1ZSA9PT0gXCJcIiB8fCB0aGlzLnJlZ1ZhbGlkS2V5LnRlc3QodmFsdWUpKSAmJiB0eXBlb2YgZXhwaXJlcyA9PT0gXCJudW1iZXJcIiAmJiBleHBpcmVzIDwgMzY1ICYmIHR5cGVvZiBwYXRoID09PSBcInN0cmluZ1wiICYmIHR5cGVvZiBkb21haW4gPT09IFwic3RyaW5nXCIgJiYgZG9tYWluLmluZGV4T2YobG9jYXRpb24uaG9zdG5hbWUpICE9PSAtMSAmJiB0eXBlb2Ygc2VjdXJlID09PSBcImJvb2xlYW5cIiAmJiBzZWN1cmUgPT09IChsb2NhdGlvbi5wcm90b2NvbCA9PT0gXCJodHRwczpcIikpIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFZhbGlkYXRlIGlucHV0IGRhdGFcbiAgICAgICAgICovXG4gICAgICAgIHZhciB1ID0gVVJMLnBhcnNlKFwiaHR0cDovL1wiICsgZG9tYWluICsgcGF0aCk7XG4gICAgICAgIGlmICh1Lmhvc3RuYW1lID09PSBkb21haW4gfHwgdS5wYXRoID09PSBwYXRoKSB7XG4gICAgICAgICAgLyoqXG4gICAgICAgICAgICogSWYgdGhhdCBzdG9yZSBpcyBzdXBwb3J0ZWRcbiAgICAgICAgICAgKi9cbiAgICAgICAgICBpZiAoIWNoZWNrU3VwcG9ydCB8fCB0aGlzLmlzU3VwcG9ydGVkKCkpIHtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogVGhlIGhhc2ggbmVlZHMgZm9yIHNwbGl0dGluZyBzY29wZXMgc3RvcmFnZVxuICAgICAgICAgICAgICogQHR5cGUge3N0cmluZ31cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdmFyIGxvY2FsS2V5ID0gdGhpcy5oYXNoICsgXCJfXCIgKyBrZXk7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIFNhdmUgY29va2llcyBmb3IgMzAgZGF5c1xuICAgICAgICAgICAgICogQHR5cGUge0RhdGV9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHZhciBkYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgIGRhdGUuc2V0VGltZShkYXRlLmdldFRpbWUoKSArIGV4cGlyZXMgKiAyNCAqIDYwICogNjAgKiAxMDAwKTtcbiAgICAgICAgICAgIHZhciBleHAgPSBkYXRlLnRvVVRDU3RyaW5nKCk7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEVuY29kZSB2YWx1ZSBmb3Igc3RvcmVcbiAgICAgICAgICAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHZhbHVlID0gZW5jb2RlVVJJQ29tcG9uZW50KHZhbHVlKTtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogV3JpdGluZyB2YWx1ZSB0byB0aGUgZG9jdW1lbnQgY29va2llIHN0b3JhZ2VcbiAgICAgICAgICAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGRvY3VtZW50LmNvb2tpZSA9IGxvY2FsS2V5ICsgXCI9XCIgKyB2YWx1ZSArIChleHAgPyBcIjsgZXhwaXJlcz1cIiArIGV4cCA6IFwiXCIpICsgKHBhdGggPyBcIjsgcGF0aD1cIiArIHBhdGggOiBcIlwiKSArIChkb21haW4gPyBcIjsgZG9tYWluPVwiICsgZG9tYWluIDogXCJcIikgKyAoc2VjdXJlID8gXCI7IHNlY3VyZVwiIDogXCJcIik7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIElmIGFsbCBvayByZXR1cm4gdHJ1ZVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRJdGVtKGNoZWNrU3VwcG9ydCwga2V5KSA9PT0gZGVjb2RlVVJJQ29tcG9uZW50KHZhbHVlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBJZiBjb29raWUgZG9lcyBub3Qgc3VwcG9ydGVkIHJldHVybiBmYWxzZVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8qKlxuICAgICAgICAgICAqIElmIGlucHV0IGRhdGEgaXMgbm90IHZhbGlkXG4gICAgICAgICAgICovXG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvKipcbiAgICAgICAgICogSWYgaW5wdXQgZGF0YSBpcyBub3QgdmFsaWRcbiAgICAgICAgICovXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAvKipcbiAgICAgICAqIElmIHNvbWV0aGluZyBnb2VzIHdyb25nIHJldHVybiBmYWxzZVxuICAgICAgICovXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9O1xuICAvKipcbiAgICogVGhlIG1ldGhvZCByZWFkcyB0aGUgdmFsdWUgYW5kIHJldHVybnMgaXQgb3IgcmV0dXJucyBmYWxzZSBpZiB0aGUgdmFsdWUgZG9lcyBub3QgZXhpc3RcbiAgICogQHBhcmFtIGNoZWNrU3VwcG9ydCB7Ym9vbGVhbn1cbiAgICogQHBhcmFtIGtleSB7c3RyaW5nfVxuICAgKiBAcmV0dXJucyB7c3RyaW5nfGJvb2xlYW59XG4gICAqL1xuXG5cbiAgQ29va2llcy5wcm90b3R5cGUuZ2V0SXRlbSA9IGZ1bmN0aW9uIGdldEl0ZW0oKSB7XG4gICAgdmFyIGNoZWNrU3VwcG9ydCA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogdHJ1ZTtcbiAgICB2YXIga2V5ID0gYXJndW1lbnRzWzFdO1xuXG4gICAgdHJ5IHtcbiAgICAgIC8qKlxuICAgICAgICogVmFsaWRhdGUgaW5wdXQgZGF0YVxuICAgICAgICovXG4gICAgICBpZiAodHlwZW9mIGNoZWNrU3VwcG9ydCA9PT0gXCJib29sZWFuXCIgJiYgdHlwZW9mIGtleSA9PT0gXCJzdHJpbmdcIiAmJiB0aGlzLnJlZ1ZhbGlkS2V5LnRlc3Qoa2V5KSkge1xuICAgICAgICAvKipcbiAgICAgICAgICogSWYgdGhhdCBzdG9yZSBpcyBzdXBwb3J0ZWRcbiAgICAgICAgICovXG4gICAgICAgIGlmICghY2hlY2tTdXBwb3J0IHx8IHRoaXMuaXNTdXBwb3J0ZWQoKSkge1xuICAgICAgICAgIC8qKlxuICAgICAgICAgICAqIFRoZSBoYXNoIG5lZWRzIGZvciBzcGxpdHRpbmcgc2NvcGVzIHN0b3JhZ2VcbiAgICAgICAgICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICAgICAgICAqL1xuICAgICAgICAgIGtleSA9IHRoaXMuaGFzaCArIFwiX1wiICsga2V5O1xuICAgICAgICAgIC8qKlxuICAgICAgICAgICAqIEdldCB0aGUgYXJyYXkgZnJvbSBkb2N1bWVudCBjb29raWUgc3BsaXQgYnkgO1xuICAgICAgICAgICAqIEB0eXBlIHtzdHJpbmdbXX1cbiAgICAgICAgICAgKi9cbiAgICAgICAgICB2YXIgYXJyQ29va2llID0gZG9jdW1lbnQuY29va2llLnNwbGl0KFwiO1wiKTtcbiAgICAgICAgICAvKipcbiAgICAgICAgICAgKiBJdGVyYXRlIHRocm91Z2ggdGhlIGNvb2tpZXNcbiAgICAgICAgICAgKi9cbiAgICAgICAgICBmb3IgKHZhciBfaXRlcmF0b3IgPSBhcnJDb29raWUsIF9pc0FycmF5ID0gQXJyYXkuaXNBcnJheShfaXRlcmF0b3IpLCBfaSA9IDAsIF9pdGVyYXRvciA9IF9pc0FycmF5ID8gX2l0ZXJhdG9yIDogX2l0ZXJhdG9yW1N5bWJvbC5pdGVyYXRvcl0oKTs7KSB7XG4gICAgICAgICAgICB2YXIgX3JlZjtcblxuICAgICAgICAgICAgaWYgKF9pc0FycmF5KSB7XG4gICAgICAgICAgICAgIGlmIChfaSA+PSBfaXRlcmF0b3IubGVuZ3RoKSBicmVhaztcbiAgICAgICAgICAgICAgX3JlZiA9IF9pdGVyYXRvcltfaSsrXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIF9pID0gX2l0ZXJhdG9yLm5leHQoKTtcbiAgICAgICAgICAgICAgaWYgKF9pLmRvbmUpIGJyZWFrO1xuICAgICAgICAgICAgICBfcmVmID0gX2kudmFsdWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBpID0gX3JlZjtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBUcmltIGFuZCBzcGxpdCBlYWNoIGNvb2tpZSBieSA9IGZvciBrZXkgdmFsdWUgcGFyZVxuICAgICAgICAgICAgICogQHR5cGUge3N0cmluZ1tdfVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB2YXIgdiA9IGkudHJpbSgpLnNwbGl0KFwiPVwiLCAyKTtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogSWYgaXQgaXMgY29ycmVjdCBjb29raWUga2V5IHJldHVybiB0aGUgdmFsdWVcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgaWYgKHZbMF0gPT09IGtleSkge1xuICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICogSWYgdGhlIHZhbHVlIHdhcyBmb3VuZCByZXR1cm4gdGhlIHZhbHVlXG4gICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KHZbMV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICAvKipcbiAgICAgICAgICAgKiBJZiB0aGUgdmFsdWUgd2FzIG5vdCBmb3VuZCByZXR1cm4gZmFsc2VcbiAgICAgICAgICAgKi9cbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLyoqXG4gICAgICAgICAgICogSWYgY29va2llIGRvZXMgbm90IHN1cHBvcnRlZCByZXR1cm4gZmFsc2VcbiAgICAgICAgICAgKi9cbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJZiBpbnB1dCBkYXRhIGlzIG5vdCB2YWxpZFxuICAgICAgICAgKi9cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIC8qKlxuICAgICAgICogSWYgc29tZXRoaW5nIGdvZXMgd3JvbmcgcmV0dXJuIGZhbHNlXG4gICAgICAgKi9cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH07XG4gIC8qKlxuICAgKiBUaGUgbWV0aG9kIHJlbW92ZXMgdGhlIHZhbHVlIGFuZCByZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgZG9lcyBub3QgZXhpc3RcbiAgICogQHBhcmFtIGNoZWNrU3VwcG9ydCB7Ym9vbGVhbn1cbiAgICogQHBhcmFtIGtleSB7c3RyaW5nfVxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG5cblxuICBDb29raWVzLnByb3RvdHlwZS5yZW1vdmVJdGVtID0gZnVuY3Rpb24gcmVtb3ZlSXRlbSgpIHtcbiAgICB2YXIgY2hlY2tTdXBwb3J0ID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB0cnVlO1xuICAgIHZhciBrZXkgPSBhcmd1bWVudHNbMV07XG5cbiAgICB0cnkge1xuICAgICAgLyoqXG4gICAgICAgKiBWYWxpZGF0ZSBpbnB1dCBkYXRhXG4gICAgICAgKi9cbiAgICAgIGlmICh0eXBlb2YgY2hlY2tTdXBwb3J0ID09PSBcImJvb2xlYW5cIiAmJiB0eXBlb2Yga2V5ID09PSBcInN0cmluZ1wiICYmIHRoaXMucmVnVmFsaWRLZXkudGVzdChrZXkpKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJZiB0aGF0IHN0b3JlIGlzIHN1cHBvcnRlZFxuICAgICAgICAgKi9cbiAgICAgICAgaWYgKCFjaGVja1N1cHBvcnQgfHwgdGhpcy5pc1N1cHBvcnRlZCgpKSB7XG4gICAgICAgICAgLyoqXG4gICAgICAgICAgICogU2V0IGVtcHR5IG92ZXJkdWUgdmFsdWUgYnkga2V5XG4gICAgICAgICAgICovXG4gICAgICAgICAgdGhpcy5zZXRJdGVtKGNoZWNrU3VwcG9ydCwga2V5LCBcIlwiLCAtMSAqIDI0ICogNjAgKiA2MCk7XG4gICAgICAgICAgLyoqXG4gICAgICAgICAgICogSWYgYWxsIG9rIHJldHVybiB0cnVlXG4gICAgICAgICAgICovXG4gICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0SXRlbShjaGVja1N1cHBvcnQsIGtleSkgPT09IGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8qKlxuICAgICAgICAgICAqIElmIGNvb2tpZSBkb2VzIG5vdCBzdXBwb3J0ZWQgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgICovXG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvKipcbiAgICAgICAgICogSWYgaW5wdXQgZGF0YSBpcyBub3QgdmFsaWRcbiAgICAgICAgICovXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAvKipcbiAgICAgICAqIElmIHNvbWV0aGluZyBnb2VzIHdyb25nIHJldHVybiBmYWxzZVxuICAgICAgICovXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9O1xuICAvKipcbiAgICogVGhlIG1ldGhvZCByZXR1cm5zIHRoZSBhcnJheSBvZiBzdHJpbmcgb2YgYXZhaWxhYmxlIGtleXNcbiAgICogQHBhcmFtIGNoZWNrU3VwcG9ydCB7Ym9vbGVhbn1cbiAgICogQHJldHVybnMge3N0cmluZ1tdfVxuICAgKi9cblxuXG4gIENvb2tpZXMucHJvdG90eXBlLmdldEtleXMgPSBmdW5jdGlvbiBnZXRLZXlzKCkge1xuICAgIHZhciBjaGVja1N1cHBvcnQgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHRydWU7XG5cbiAgICB0cnkge1xuICAgICAgLyoqXG4gICAgICAgKiBWYWxpZGF0ZSBpbnB1dCBkYXRhXG4gICAgICAgKi9cbiAgICAgIGlmICh0eXBlb2YgY2hlY2tTdXBwb3J0ID09PSBcImJvb2xlYW5cIikge1xuICAgICAgICAvKipcbiAgICAgICAgICogSWYgdGhhdCBzdG9yZSBpcyBzdXBwb3J0ZWRcbiAgICAgICAgICovXG4gICAgICAgIGlmICghY2hlY2tTdXBwb3J0IHx8IHRoaXMuaXNTdXBwb3J0ZWQoKSkge1xuICAgICAgICAgIC8qKlxuICAgICAgICAgICAqIFRoZSBhcnJheSBvZiBhdmFpbGFibGUga2V5c1xuICAgICAgICAgICAqIEB0eXBlIHtBcnJheX1cbiAgICAgICAgICAgKi9cbiAgICAgICAgICB2YXIgYXJyS2V5cyA9IFtdO1xuICAgICAgICAgIC8qKlxuICAgICAgICAgICAqIEdldCB0aGUgYXJyYXkgZnJvbSBkb2N1bWVudCBjb29raWUgc3BsaXQgYnkgO1xuICAgICAgICAgICAqIEB0eXBlIHtzdHJpbmdbXX1cbiAgICAgICAgICAgKi9cbiAgICAgICAgICB2YXIgYXJyQ29va2llID0gZG9jdW1lbnQuY29va2llLnNwbGl0KFwiO1wiKTtcbiAgICAgICAgICAvKipcbiAgICAgICAgICAgKiBJdGVyYXRlIHRocm91Z2ggdGhlIGNvb2tpZXNcbiAgICAgICAgICAgKi9cbiAgICAgICAgICBmb3IgKHZhciBfaXRlcmF0b3IyID0gYXJyQ29va2llLCBfaXNBcnJheTIgPSBBcnJheS5pc0FycmF5KF9pdGVyYXRvcjIpLCBfaTIgPSAwLCBfaXRlcmF0b3IyID0gX2lzQXJyYXkyID8gX2l0ZXJhdG9yMiA6IF9pdGVyYXRvcjJbU3ltYm9sLml0ZXJhdG9yXSgpOzspIHtcbiAgICAgICAgICAgIHZhciBfcmVmMjtcblxuICAgICAgICAgICAgaWYgKF9pc0FycmF5Mikge1xuICAgICAgICAgICAgICBpZiAoX2kyID49IF9pdGVyYXRvcjIubGVuZ3RoKSBicmVhaztcbiAgICAgICAgICAgICAgX3JlZjIgPSBfaXRlcmF0b3IyW19pMisrXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIF9pMiA9IF9pdGVyYXRvcjIubmV4dCgpO1xuICAgICAgICAgICAgICBpZiAoX2kyLmRvbmUpIGJyZWFrO1xuICAgICAgICAgICAgICBfcmVmMiA9IF9pMi52YWx1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGkgPSBfcmVmMjtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBUcmltIGFuZCBzcGxpdCBlYWNoIGNvb2tpZSBieSA9IGZvciBrZXkgdmFsdWUgcGFyZVxuICAgICAgICAgICAgICogQHR5cGUge3N0cmluZ1tdfVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB2YXIgdiA9IGkudHJpbSgpLnNwbGl0KFwiPVwiLCAyKTtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogSWYgdGhlIGtleSBjb250YWlucyBoYXNoIGFkZCBpdCB0byB0aGUgbGlzdFxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBpZiAodlswXS5pbmRleE9mKHRoaXMuaGFzaCkgPT09IDApIHtcbiAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAqIEFkZCBrZXkgdG8gdGhlIGxpc3RcbiAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgIGFycktleXMucHVzaCh2WzBdLnN1YnN0cih0aGlzLmhhc2gubGVuZ3RoICsgMSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gYXJyS2V5cztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvKipcbiAgICAgICAgICAgKiBJZiBjb29raWUgZG9lcyBub3Qgc3VwcG9ydGVkIHJldHVybiBmYWxzZVxuICAgICAgICAgICAqL1xuICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIElmIGlucHV0IGRhdGEgaXMgbm90IHZhbGlkXG4gICAgICAgICAqL1xuICAgICAgICByZXR1cm4gW107XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgLyoqXG4gICAgICAgKiBJZiBzb21ldGhpbmcgZ29lcyB3cm9uZyByZXR1cm4gZmFsc2VcbiAgICAgICAqL1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgfTtcbiAgLyoqXG4gICAqIFRoZSBtZXRob2QgY2xlYW5zIHRoZSBzdG9yYWdlIGFuZCByZXR1cm4gdHJ1ZSBpZiBpdCBpcyBlbXB0eVxuICAgKiBAcGFyYW0gY2hlY2tTdXBwb3J0IHtib29sZWFufVxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG5cblxuICBDb29raWVzLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uIGNsZWFyKCkge1xuICAgIHZhciBjaGVja1N1cHBvcnQgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHRydWU7XG5cbiAgICB0cnkge1xuICAgICAgLyoqXG4gICAgICAgKiBWYWxpZGF0ZSBpbnB1dCBkYXRhXG4gICAgICAgKi9cbiAgICAgIGlmICh0eXBlb2YgY2hlY2tTdXBwb3J0ID09PSBcImJvb2xlYW5cIikge1xuICAgICAgICAvKipcbiAgICAgICAgICogSWYgdGhhdCBzdG9yZSBpcyBzdXBwb3J0ZWRcbiAgICAgICAgICovXG4gICAgICAgIGlmICghY2hlY2tTdXBwb3J0IHx8IHRoaXMuaXNTdXBwb3J0ZWQoKSkge1xuICAgICAgICAgIHZhciBhcnJLZXlzID0gdGhpcy5nZXRLZXlzKGNoZWNrU3VwcG9ydCk7XG4gICAgICAgICAgaWYgKGFycktleXMpIHtcbiAgICAgICAgICAgIGZvciAodmFyIF9pdGVyYXRvcjMgPSBhcnJLZXlzLCBfaXNBcnJheTMgPSBBcnJheS5pc0FycmF5KF9pdGVyYXRvcjMpLCBfaTMgPSAwLCBfaXRlcmF0b3IzID0gX2lzQXJyYXkzID8gX2l0ZXJhdG9yMyA6IF9pdGVyYXRvcjNbU3ltYm9sLml0ZXJhdG9yXSgpOzspIHtcbiAgICAgICAgICAgICAgdmFyIF9yZWYzO1xuXG4gICAgICAgICAgICAgIGlmIChfaXNBcnJheTMpIHtcbiAgICAgICAgICAgICAgICBpZiAoX2kzID49IF9pdGVyYXRvcjMubGVuZ3RoKSBicmVhaztcbiAgICAgICAgICAgICAgICBfcmVmMyA9IF9pdGVyYXRvcjNbX2kzKytdO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIF9pMyA9IF9pdGVyYXRvcjMubmV4dCgpO1xuICAgICAgICAgICAgICAgIGlmIChfaTMuZG9uZSkgYnJlYWs7XG4gICAgICAgICAgICAgICAgX3JlZjMgPSBfaTMudmFsdWU7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICB2YXIgaSA9IF9yZWYzO1xuXG4gICAgICAgICAgICAgIHRoaXMucmVtb3ZlSXRlbShjaGVja1N1cHBvcnQsIGkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICAvKipcbiAgICAgICAgICAgKiBJZiBhbGwgb2sgcmV0dXJuIHRydWVcbiAgICAgICAgICAgKi9cbiAgICAgICAgICByZXR1cm4gdGhpcy5nZXRLZXlzKGNoZWNrU3VwcG9ydCkubGVuZ3RoID09PSAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8qKlxuICAgICAgICAgICAqIElmIGNvb2tpZSBkb2VzIG5vdCBzdXBwb3J0ZWQgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgICovXG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJZiBpbnB1dCBkYXRhIGlzIG5vdCB2YWxpZFxuICAgICAgICAgKi9cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIC8qKlxuICAgICAgICogSWYgc29tZXRoaW5nIGdvZXMgd3JvbmcgcmV0dXJuIGZhbHNlXG4gICAgICAgKi9cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIENvb2tpZXM7XG59KCk7XG5cbmV4cG9ydHMuZGVmYXVsdCA9IENvb2tpZXM7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L0V2ZXJDb29raWUvbGliL1N0b3JhZ2VzL0Nvb2tpZXMudHNcbi8vIG1vZHVsZSBpZCA9IDMyXG4vLyBtb2R1bGUgY2h1bmtzID0gMSAyIDMiLCJcInVzZSBzdHJpY3RcIjtcbi8qKlxuICogVGhlIERPTVN0b3JhZ2VcbiAqL1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX3R5cGVvZiA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiID8gZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfSA6IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbnZhciBET01TdG9yYWdlID0gZnVuY3Rpb24gKCkge1xuICAgIC8qKlxuICAgICAqIFRoZSBjb25zdHJ1Y3RvciBzaG91bGQgYWNjZXB0IGEgaGFzaCB0byBzZXBhcmF0ZSB0aGUgc2NvcGVzIG9mIHN0b3JhZ2VcbiAgICAgKiBAcGFyYW0gaGFzaCB7c3RyaW5nfVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIERPTVN0b3JhZ2UoaGFzaCkge1xuICAgICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgRE9NU3RvcmFnZSk7XG5cbiAgICAgICAgdGhpcy5yZWdWYWxpZEtleSA9IG5ldyBSZWdFeHAoXCIoW2EtekEtWjAtOV8tXXswLH0pXCIsIFwiaVwiKTtcbiAgICAgICAgdGhpcy5oYXNoID0gaGFzaCB8fCBsb2NhdGlvbi5ob3N0bmFtZTtcbiAgICAgICAgdGhpcy5kb21TdG9yYWdlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5oYXNoKTtcbiAgICAgICAgaWYgKCF0aGlzLmRvbVN0b3JhZ2UpIHtcbiAgICAgICAgICAgIHRoaXMuZG9tU3RvcmFnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICB0aGlzLmRvbVN0b3JhZ2UuaWQgPSB0aGlzLmhhc2g7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRvY3VtZW50LmJvZHkpIHtcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5kb21TdG9yYWdlKTtcbiAgICAgICAgICAgIHRoaXMuZG9tU3RvcmFnZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuaGFzaCk7XG4gICAgICAgICAgICBpZiAodGhpcy5pc1N1cHBvcnRlZCgpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kb21TdG9yYWdlLnN0eWxlLmJlaGF2aW9yID0gXCJ1cmwoI2RlZmF1bHQjdXNlckRhdGEpXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogVGhlIG1ldGhvZCByZXR1cm5zIHRoZSBmbGFnIHdoZXRoZXIgc3VwcG9ydGVkIHRoaXMgc3RvcmFnZSB0eXBlIG9yIG5vdFxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgICAqL1xuXG5cbiAgICBET01TdG9yYWdlLnByb3RvdHlwZS5pc1N1cHBvcnRlZCA9IGZ1bmN0aW9uIGlzU3VwcG9ydGVkKCkge1xuICAgICAgICByZXR1cm4gX3R5cGVvZih0aGlzLmRvbVN0b3JhZ2UpID09PSBcIm9iamVjdFwiICYmIF90eXBlb2YodGhpcy5kb21TdG9yYWdlLnBhcmVudE5vZGUpID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiB0aGlzLmRvbVN0b3JhZ2UuYWRkQmVoYXZpb3IgIT09IFwidW5kZWZpbmVkXCI7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBUaGUgbWV0aG9kIHNldHMgdGhlIHZhbHVlIGFuZCByZXR1cm5zIHRydWUgaWYgaXQgaGFzIGJlZW4gc2V0XG4gICAgICogQHBhcmFtIGNoZWNrU3VwcG9ydCB7Ym9vbGVhbn1cbiAgICAgKiBAcGFyYW0ga2V5IHtzdHJpbmd9XG4gICAgICogQHBhcmFtIHZhbHVlIHtzdHJpbmd9XG4gICAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICAgKi9cblxuXG4gICAgRE9NU3RvcmFnZS5wcm90b3R5cGUuc2V0SXRlbSA9IGZ1bmN0aW9uIHNldEl0ZW0oKSB7XG4gICAgICAgIHZhciBjaGVja1N1cHBvcnQgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHRydWU7XG4gICAgICAgIHZhciBrZXkgPSBhcmd1bWVudHNbMV07XG4gICAgICAgIHZhciB2YWx1ZSA9IGFyZ3VtZW50c1syXTtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBWYWxpZGF0ZSBpbnB1dCBkYXRhXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGlmICh0eXBlb2YgY2hlY2tTdXBwb3J0ID09PSBcImJvb2xlYW5cIiAmJiB0eXBlb2Yga2V5ID09PSBcInN0cmluZ1wiICYmIHRoaXMucmVnVmFsaWRLZXkudGVzdChrZXkpICYmIHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIiAmJiAodmFsdWUgPT09IFwiXCIgfHwgdGhpcy5yZWdWYWxpZEtleS50ZXN0KHZhbHVlKSkpIHtcbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBJZiB0aGF0IHN0b3JlIGlzIHN1cHBvcnRlZFxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGlmICghY2hlY2tTdXBwb3J0IHx8IHRoaXMuaXNTdXBwb3J0ZWQoKSkge1xuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogVGhlIGhhc2ggbmVlZHMgZm9yIHNwbGl0dGluZyBzY29wZXMgc3RvcmFnZVxuICAgICAgICAgICAgICAgICAgICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgdmFyIGxvY2FsS2V5ID0gdGhpcy5oYXNoICsgXCJfXCIgKyBrZXk7XG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBTZXQgZG9tIHZhbHVlXG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRvbVN0b3JhZ2Uuc2V0QXR0cmlidXRlKGxvY2FsS2V5LCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZG9tU3RvcmFnZS5zYXZlKHRoaXMuaGFzaCk7XG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBJZiBhbGwgb2sgcmV0dXJuIHRydWVcbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldEl0ZW0oY2hlY2tTdXBwb3J0LCBrZXkpID09PSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogSWYgY29va2llIGRvZXMgbm90IHN1cHBvcnRlZCByZXR1cm4gZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIElmIGlucHV0IGRhdGEgaXMgbm90IHZhbGlkXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIElmIHNvbWV0aGluZyBnb2VzIHdyb25nIHJldHVybiBmYWxzZVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFRoZSBtZXRob2QgcmVhZHMgdGhlIHZhbHVlIGFuZCByZXR1cm5zIGl0IG9yIHJldHVybnMgZmFsc2UgaWYgdGhlIHZhbHVlIGRvZXMgbm90IGV4aXN0XG4gICAgICogQHBhcmFtIGNoZWNrU3VwcG9ydCB7Ym9vbGVhbn1cbiAgICAgKiBAcGFyYW0ga2V5IHtzdHJpbmd9XG4gICAgICogQHJldHVybnMge3N0cmluZ3xib29sZWFufVxuICAgICAqL1xuXG5cbiAgICBET01TdG9yYWdlLnByb3RvdHlwZS5nZXRJdGVtID0gZnVuY3Rpb24gZ2V0SXRlbSgpIHtcbiAgICAgICAgdmFyIGNoZWNrU3VwcG9ydCA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogdHJ1ZTtcbiAgICAgICAgdmFyIGtleSA9IGFyZ3VtZW50c1sxXTtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBWYWxpZGF0ZSBpbnB1dCBkYXRhXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGlmICh0eXBlb2YgY2hlY2tTdXBwb3J0ID09PSBcImJvb2xlYW5cIiAmJiB0eXBlb2Yga2V5ID09PSBcInN0cmluZ1wiICYmIHRoaXMucmVnVmFsaWRLZXkudGVzdChrZXkpKSB7XG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogSWYgdGhhdCBzdG9yZSBpcyBzdXBwb3J0ZWRcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBpZiAoIWNoZWNrU3VwcG9ydCB8fCB0aGlzLmlzU3VwcG9ydGVkKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIFRoZSBoYXNoIG5lZWRzIGZvciBzcGxpdHRpbmcgc2NvcGVzIHN0b3JhZ2VcbiAgICAgICAgICAgICAgICAgICAgICogQHR5cGUge3N0cmluZ31cbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIHZhciBsb2NhbEtleSA9IHRoaXMuaGFzaCArIFwiX1wiICsga2V5O1xuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogR2V0IHZhbHVlXG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRvbVN0b3JhZ2UubG9hZCh0aGlzLmhhc2gpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSB0aGlzLmRvbVN0b3JhZ2UuZ2V0QXR0cmlidXRlKGxvY2FsS2V5KTtcbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIElmIHZhbHVlIGV4aXN0LCByZXR1cm4gaXRcbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIElmIGNvb2tpZSBkb2VzIG5vdCBzdXBwb3J0ZWQgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBJZiBpbnB1dCBkYXRhIGlzIG5vdCB2YWxpZFxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBJZiBzb21ldGhpbmcgZ29lcyB3cm9uZyByZXR1cm4gZmFsc2VcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBUaGUgbWV0aG9kIHJlbW92ZXMgdGhlIHZhbHVlIGFuZCByZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgZG9lcyBub3QgZXhpc3RcbiAgICAgKiBAcGFyYW0gY2hlY2tTdXBwb3J0IHtib29sZWFufVxuICAgICAqIEBwYXJhbSBrZXkge3N0cmluZ31cbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKi9cblxuXG4gICAgRE9NU3RvcmFnZS5wcm90b3R5cGUucmVtb3ZlSXRlbSA9IGZ1bmN0aW9uIHJlbW92ZUl0ZW0oKSB7XG4gICAgICAgIHZhciBjaGVja1N1cHBvcnQgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHRydWU7XG4gICAgICAgIHZhciBrZXkgPSBhcmd1bWVudHNbMV07XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogVmFsaWRhdGUgaW5wdXQgZGF0YVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBpZiAodHlwZW9mIGNoZWNrU3VwcG9ydCA9PT0gXCJib29sZWFuXCIgJiYgdHlwZW9mIGtleSA9PT0gXCJzdHJpbmdcIiAmJiB0aGlzLnJlZ1ZhbGlkS2V5LnRlc3Qoa2V5KSkge1xuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIElmIHRoYXQgc3RvcmUgaXMgc3VwcG9ydGVkXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgaWYgKCFjaGVja1N1cHBvcnQgfHwgdGhpcy5pc1N1cHBvcnRlZCgpKSB7XG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBUaGUgaGFzaCBuZWVkcyBmb3Igc3BsaXR0aW5nIHNjb3BlcyBzdG9yYWdlXG4gICAgICAgICAgICAgICAgICAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICB2YXIgbG9jYWxLZXkgPSB0aGlzLmhhc2ggKyBcIl9cIiArIGtleTtcbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIENsZWFuIHZhbHVlIGFuZCByZW1vdmVcbiAgICAgICAgICAgICAgICAgICAgICogQHR5cGUge2Jvb2xlYW59XG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRvbVN0b3JhZ2UucmVtb3ZlQXR0cmlidXRlKGxvY2FsS2V5KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kb21TdG9yYWdlLnNhdmUodGhpcy5oYXNoKTtcbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIElmIGFsbCBvayByZXR1cm4gdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0SXRlbShjaGVja1N1cHBvcnQsIGtleSkgPT09IGZhbHNlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBJZiBjb29raWUgZG9lcyBub3Qgc3VwcG9ydGVkIHJldHVybiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogSWYgaW5wdXQgZGF0YSBpcyBub3QgdmFsaWRcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogSWYgc29tZXRoaW5nIGdvZXMgd3JvbmcgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgLyoqXG4gICAgICogVGhlIG1ldGhvZCByZXR1cm5zIHRoZSBhcnJheSBvZiBzdHJpbmcgb2YgYXZhaWxhYmxlIGtleXNcbiAgICAgKiBAcGFyYW0gY2hlY2tTdXBwb3J0IHtib29sZWFufVxuICAgICAqIEByZXR1cm5zIHtzdHJpbmdbXX1cbiAgICAgKi9cblxuXG4gICAgRE9NU3RvcmFnZS5wcm90b3R5cGUuZ2V0S2V5cyA9IGZ1bmN0aW9uIGdldEtleXMoKSB7XG4gICAgICAgIHZhciBjaGVja1N1cHBvcnQgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHRydWU7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogVmFsaWRhdGUgaW5wdXQgZGF0YVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBpZiAodHlwZW9mIGNoZWNrU3VwcG9ydCA9PT0gXCJib29sZWFuXCIpIHtcbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBJZiB0aGF0IHN0b3JlIGlzIHN1cHBvcnRlZFxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGlmICghY2hlY2tTdXBwb3J0IHx8IHRoaXMuaXNTdXBwb3J0ZWQoKSkge1xuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogVGhlIGFycmF5IG9mIGF2YWlsYWJsZSBrZXlzXG4gICAgICAgICAgICAgICAgICAgICAqIEB0eXBlIHtBcnJheX1cbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIHZhciBhcnJLZXlzID0gW107XG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBHZXQgdGhlIGFycmF5IGZyb20gZG9jdW1lbnQgY29va2llIHNwbGl0IGJ5IDtcbiAgICAgICAgICAgICAgICAgICAgICogQHR5cGUge3N0cmluZ1tdfVxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgdmFyIGxvY2FsQXJyS2V5cyA9IHRoaXMuZG9tU3RvcmFnZS5YTUxEb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuYXR0cmlidXRlcztcbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIEl0ZXJhdGUgdGhyb3VnaCB0aGUgZ2xvYmFsU3RvcmFnZVxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsb2NhbEFycktleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBrZXkgPSBsb2NhbEFycktleXNbaV0ubmFtZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgICAgICogSWYgdGhlIGtleSBjb250YWlucyBoYXNoIGFkZCBpdCB0byB0aGUgbGlzdFxuICAgICAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoa2V5LmluZGV4T2YodGhpcy5oYXNoKSA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqIEFkZCBrZXkgdG8gdGhlIGxpc3RcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcnJLZXlzLnB1c2goa2V5LnN1YnN0cih0aGlzLmhhc2gubGVuZ3RoICsgMSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhcnJLZXlzO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBJZiBjb29raWUgZG9lcyBub3Qgc3VwcG9ydGVkIHJldHVybiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogSWYgaW5wdXQgZGF0YSBpcyBub3QgdmFsaWRcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogSWYgc29tZXRoaW5nIGdvZXMgd3JvbmcgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgLyoqXG4gICAgICogVGhlIG1ldGhvZCBjbGVhbnMgdGhlIHN0b3JhZ2UgYW5kIHJldHVybiB0cnVlIGlmIGl0IGlzIGVtcHR5XG4gICAgICogQHBhcmFtIGNoZWNrU3VwcG9ydCB7Ym9vbGVhbn1cbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKi9cblxuXG4gICAgRE9NU3RvcmFnZS5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiBjbGVhcigpIHtcbiAgICAgICAgdmFyIGNoZWNrU3VwcG9ydCA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogdHJ1ZTtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBWYWxpZGF0ZSBpbnB1dCBkYXRhXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGlmICh0eXBlb2YgY2hlY2tTdXBwb3J0ID09PSBcImJvb2xlYW5cIikge1xuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIElmIHRoYXQgc3RvcmUgaXMgc3VwcG9ydGVkXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgaWYgKCFjaGVja1N1cHBvcnQgfHwgdGhpcy5pc1N1cHBvcnRlZCgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhcnJLZXlzID0gdGhpcy5nZXRLZXlzKGNoZWNrU3VwcG9ydCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhcnJLZXlzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBfaXRlcmF0b3IgPSBhcnJLZXlzLCBfaXNBcnJheSA9IEFycmF5LmlzQXJyYXkoX2l0ZXJhdG9yKSwgX2kgPSAwLCBfaXRlcmF0b3IgPSBfaXNBcnJheSA/IF9pdGVyYXRvciA6IF9pdGVyYXRvcltTeW1ib2wuaXRlcmF0b3JdKCk7Oykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBfcmVmO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKF9pc0FycmF5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChfaSA+PSBfaXRlcmF0b3IubGVuZ3RoKSBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3JlZiA9IF9pdGVyYXRvcltfaSsrXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfaSA9IF9pdGVyYXRvci5uZXh0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChfaS5kb25lKSBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3JlZiA9IF9pLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpID0gX3JlZjtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlSXRlbShjaGVja1N1cHBvcnQsIGkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBJZiBhbGwgb2sgcmV0dXJuIHRydWVcbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldEtleXMoY2hlY2tTdXBwb3J0KS5sZW5ndGggPT09IDA7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIElmIGNvb2tpZSBkb2VzIG5vdCBzdXBwb3J0ZWQgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIElmIGlucHV0IGRhdGEgaXMgbm90IHZhbGlkXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIElmIHNvbWV0aGluZyBnb2VzIHdyb25nIHJldHVybiBmYWxzZVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIERPTVN0b3JhZ2U7XG59KCk7XG5cbmV4cG9ydHMuZGVmYXVsdCA9IERPTVN0b3JhZ2U7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L0V2ZXJDb29raWUvbGliL1N0b3JhZ2VzL0RPTVN0b3JhZ2UudHNcbi8vIG1vZHVsZSBpZCA9IDMzXG4vLyBtb2R1bGUgY2h1bmtzID0gMSAyIDMiLCJcInVzZSBzdHJpY3RcIjtcbi8qKlxuICogVGhlIEdsb2JhbFN0b3JhZ2VcbiAqL1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX3R5cGVvZiA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiID8gZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfSA6IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbnZhciBHbG9iYWxTdG9yYWdlID0gZnVuY3Rpb24gKCkge1xuICAgIC8qKlxuICAgICAqIFRoZSBjb25zdHJ1Y3RvciBzaG91bGQgYWNjZXB0IGEgaGFzaCB0byBzZXBhcmF0ZSB0aGUgc2NvcGVzIG9mIHN0b3JhZ2VcbiAgICAgKiBAcGFyYW0gaGFzaCB7c3RyaW5nfVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIEdsb2JhbFN0b3JhZ2UoaGFzaCkge1xuICAgICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgR2xvYmFsU3RvcmFnZSk7XG5cbiAgICAgICAgdGhpcy5yZWdWYWxpZEtleSA9IG5ldyBSZWdFeHAoXCIoW2EtekEtWjAtOV8tXXswLH0pXCIsIFwiaVwiKTtcbiAgICAgICAgdGhpcy5oYXNoID0gaGFzaCB8fCBsb2NhdGlvbi5ob3N0bmFtZTtcbiAgICAgICAgaWYgKCF3aW5kb3cuZ2xvYmFsU3RvcmFnZSkge1xuICAgICAgICAgICAgd2luZG93Lmdsb2JhbFN0b3JhZ2UgPSB7fTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXdpbmRvdy5nbG9iYWxTdG9yYWdlW2RvY3VtZW50LmRvbWFpbl0pIHtcbiAgICAgICAgICAgIHdpbmRvdy5nbG9iYWxTdG9yYWdlW2RvY3VtZW50LmRvbWFpbl0gPSB7fTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmdsb2JhbFN0b3JhZ2UgPSB3aW5kb3cuZ2xvYmFsU3RvcmFnZVtkb2N1bWVudC5kb21haW5dO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBUaGUgbWV0aG9kIHJldHVybnMgdGhlIGZsYWcgd2hldGhlciBzdXBwb3J0ZWQgdGhpcyBzdG9yYWdlIHR5cGUgb3Igbm90XG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICovXG5cblxuICAgIEdsb2JhbFN0b3JhZ2UucHJvdG90eXBlLmlzU3VwcG9ydGVkID0gZnVuY3Rpb24gaXNTdXBwb3J0ZWQoKSB7XG4gICAgICAgIHJldHVybiBfdHlwZW9mKHRoaXMuZ2xvYmFsU3RvcmFnZSkgPT09IFwib2JqZWN0XCI7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBUaGUgbWV0aG9kIHNldHMgdGhlIHZhbHVlIGFuZCByZXR1cm5zIHRydWUgaWYgaXQgaGFzIGJlZW4gc2V0XG4gICAgICogQHBhcmFtIGNoZWNrU3VwcG9ydCB7Ym9vbGVhbn1cbiAgICAgKiBAcGFyYW0ga2V5IHtzdHJpbmd9XG4gICAgICogQHBhcmFtIHZhbHVlIHtzdHJpbmd9XG4gICAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICAgKi9cblxuXG4gICAgR2xvYmFsU3RvcmFnZS5wcm90b3R5cGUuc2V0SXRlbSA9IGZ1bmN0aW9uIHNldEl0ZW0oKSB7XG4gICAgICAgIHZhciBjaGVja1N1cHBvcnQgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHRydWU7XG4gICAgICAgIHZhciBrZXkgPSBhcmd1bWVudHNbMV07XG4gICAgICAgIHZhciB2YWx1ZSA9IGFyZ3VtZW50c1syXTtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBWYWxpZGF0ZSBpbnB1dCBkYXRhXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGlmICh0eXBlb2YgY2hlY2tTdXBwb3J0ID09PSBcImJvb2xlYW5cIiAmJiB0eXBlb2Yga2V5ID09PSBcInN0cmluZ1wiICYmIHRoaXMucmVnVmFsaWRLZXkudGVzdChrZXkpICYmIHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIiAmJiAodmFsdWUgPT09IFwiXCIgfHwgdGhpcy5yZWdWYWxpZEtleS50ZXN0KHZhbHVlKSkpIHtcbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBJZiB0aGF0IHN0b3JlIGlzIHN1cHBvcnRlZFxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGlmICghY2hlY2tTdXBwb3J0IHx8IHRoaXMuaXNTdXBwb3J0ZWQoKSkge1xuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogVGhlIGhhc2ggbmVlZHMgZm9yIHNwbGl0dGluZyBzY29wZXMgc3RvcmFnZVxuICAgICAgICAgICAgICAgICAgICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgdmFyIGxvY2FsS2V5ID0gdGhpcy5oYXNoICsgXCJfXCIgKyBrZXk7XG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBTZXQgdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgICogQHR5cGUge3N0cmluZ31cbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2xvYmFsU3RvcmFnZVtsb2NhbEtleV0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIElmIGFsbCBvayByZXR1cm4gdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0SXRlbShjaGVja1N1cHBvcnQsIGtleSkgPT09IHZhbHVlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBJZiBjb29raWUgZG9lcyBub3Qgc3VwcG9ydGVkIHJldHVybiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogSWYgaW5wdXQgZGF0YSBpcyBub3QgdmFsaWRcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogSWYgc29tZXRoaW5nIGdvZXMgd3JvbmcgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgLyoqXG4gICAgICogVGhlIG1ldGhvZCByZWFkcyB0aGUgdmFsdWUgYW5kIHJldHVybnMgaXQgb3IgcmV0dXJucyBmYWxzZSBpZiB0aGUgdmFsdWUgZG9lcyBub3QgZXhpc3RcbiAgICAgKiBAcGFyYW0gY2hlY2tTdXBwb3J0IHtib29sZWFufVxuICAgICAqIEBwYXJhbSBrZXkge3N0cmluZ31cbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfGJvb2xlYW59XG4gICAgICovXG5cblxuICAgIEdsb2JhbFN0b3JhZ2UucHJvdG90eXBlLmdldEl0ZW0gPSBmdW5jdGlvbiBnZXRJdGVtKCkge1xuICAgICAgICB2YXIgY2hlY2tTdXBwb3J0ID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB0cnVlO1xuICAgICAgICB2YXIga2V5ID0gYXJndW1lbnRzWzFdO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIFZhbGlkYXRlIGlucHV0IGRhdGFcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBjaGVja1N1cHBvcnQgPT09IFwiYm9vbGVhblwiICYmIHR5cGVvZiBrZXkgPT09IFwic3RyaW5nXCIgJiYgdGhpcy5yZWdWYWxpZEtleS50ZXN0KGtleSkpIHtcbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBJZiB0aGF0IHN0b3JlIGlzIHN1cHBvcnRlZFxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGlmICghY2hlY2tTdXBwb3J0IHx8IHRoaXMuaXNTdXBwb3J0ZWQoKSkge1xuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogVGhlIGhhc2ggbmVlZHMgZm9yIHNwbGl0dGluZyBzY29wZXMgc3RvcmFnZVxuICAgICAgICAgICAgICAgICAgICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgdmFyIGxvY2FsS2V5ID0gdGhpcy5oYXNoICsgXCJfXCIgKyBrZXk7XG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBHZXQgdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IHRoaXMuZ2xvYmFsU3RvcmFnZVtsb2NhbEtleV07XG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBJZiB2YWx1ZSBleGlzdCwgcmV0dXJuIGl0XG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBJZiBjb29raWUgZG9lcyBub3Qgc3VwcG9ydGVkIHJldHVybiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogSWYgY29va2llIGRvZXMgbm90IHN1cHBvcnRlZCByZXR1cm4gZmFsc2VcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogSWYgc29tZXRoaW5nIGdvZXMgd3JvbmcgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgLyoqXG4gICAgICogVGhlIG1ldGhvZCByZW1vdmVzIHRoZSB2YWx1ZSBhbmQgcmV0dXJuIHRydWUgaWYgdGhlIHZhbHVlIGRvZXMgbm90IGV4aXN0XG4gICAgICogQHBhcmFtIGNoZWNrU3VwcG9ydCB7Ym9vbGVhbn1cbiAgICAgKiBAcGFyYW0ga2V5IHtzdHJpbmd9XG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICovXG5cblxuICAgIEdsb2JhbFN0b3JhZ2UucHJvdG90eXBlLnJlbW92ZUl0ZW0gPSBmdW5jdGlvbiByZW1vdmVJdGVtKCkge1xuICAgICAgICB2YXIgY2hlY2tTdXBwb3J0ID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB0cnVlO1xuICAgICAgICB2YXIga2V5ID0gYXJndW1lbnRzWzFdO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIFZhbGlkYXRlIGlucHV0IGRhdGFcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBjaGVja1N1cHBvcnQgPT09IFwiYm9vbGVhblwiICYmIHR5cGVvZiBrZXkgPT09IFwic3RyaW5nXCIgJiYgdGhpcy5yZWdWYWxpZEtleS50ZXN0KGtleSkpIHtcbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBJZiB0aGF0IHN0b3JlIGlzIHN1cHBvcnRlZFxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGlmICghY2hlY2tTdXBwb3J0IHx8IHRoaXMuaXNTdXBwb3J0ZWQoKSkge1xuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogVGhlIGhhc2ggbmVlZHMgZm9yIHNwbGl0dGluZyBzY29wZXMgc3RvcmFnZVxuICAgICAgICAgICAgICAgICAgICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgdmFyIGxvY2FsS2V5ID0gdGhpcy5oYXNoICsgXCJfXCIgKyBrZXk7XG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBDbGVhbiB2YWx1ZSBhbmQgcmVtb3ZlXG4gICAgICAgICAgICAgICAgICAgICAqIEB0eXBlIHtib29sZWFufVxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nbG9iYWxTdG9yYWdlW2xvY2FsS2V5XSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5nbG9iYWxTdG9yYWdlW2xvY2FsS2V5XTtcbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIElmIGFsbCBvayByZXR1cm4gdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0SXRlbShjaGVja1N1cHBvcnQsIGtleSkgPT09IGZhbHNlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBJZiBjb29raWUgZG9lcyBub3Qgc3VwcG9ydGVkIHJldHVybiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogSWYgaW5wdXQgZGF0YSBpcyBub3QgdmFsaWRcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogSWYgc29tZXRoaW5nIGdvZXMgd3JvbmcgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgLyoqXG4gICAgICogVGhlIG1ldGhvZCByZXR1cm5zIHRoZSBhcnJheSBvZiBzdHJpbmcgb2YgYXZhaWxhYmxlIGtleXNcbiAgICAgKiBAcGFyYW0gY2hlY2tTdXBwb3J0IHtib29sZWFufVxuICAgICAqIEByZXR1cm5zIHtzdHJpbmdbXX1cbiAgICAgKi9cblxuXG4gICAgR2xvYmFsU3RvcmFnZS5wcm90b3R5cGUuZ2V0S2V5cyA9IGZ1bmN0aW9uIGdldEtleXMoKSB7XG4gICAgICAgIHZhciBjaGVja1N1cHBvcnQgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHRydWU7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogVmFsaWRhdGUgaW5wdXQgZGF0YVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBpZiAodHlwZW9mIGNoZWNrU3VwcG9ydCA9PT0gXCJib29sZWFuXCIpIHtcbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBJZiB0aGF0IHN0b3JlIGlzIHN1cHBvcnRlZFxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGlmICghY2hlY2tTdXBwb3J0IHx8IHRoaXMuaXNTdXBwb3J0ZWQoKSkge1xuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogVGhlIGFycmF5IG9mIGF2YWlsYWJsZSBrZXlzXG4gICAgICAgICAgICAgICAgICAgICAqIEB0eXBlIHtBcnJheX1cbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIHZhciBhcnJLZXlzID0gW107XG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBHZXQgdGhlIGFycmF5IGZyb20gZG9jdW1lbnQgY29va2llIHNwbGl0IGJ5IDtcbiAgICAgICAgICAgICAgICAgICAgICogQHR5cGUge3N0cmluZ1tdfVxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgdmFyIGxvY2FsQXJyS2V5cyA9IE9iamVjdC5rZXlzKHRoaXMuZ2xvYmFsU3RvcmFnZSk7XG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBJdGVyYXRlIHRocm91Z2ggdGhlIGdsb2JhbFN0b3JhZ2VcbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIF9pdGVyYXRvciA9IGxvY2FsQXJyS2V5cywgX2lzQXJyYXkgPSBBcnJheS5pc0FycmF5KF9pdGVyYXRvciksIF9pID0gMCwgX2l0ZXJhdG9yID0gX2lzQXJyYXkgPyBfaXRlcmF0b3IgOiBfaXRlcmF0b3JbU3ltYm9sLml0ZXJhdG9yXSgpOzspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBfcmVmO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoX2lzQXJyYXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoX2kgPj0gX2l0ZXJhdG9yLmxlbmd0aCkgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX3JlZiA9IF9pdGVyYXRvcltfaSsrXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX2kgPSBfaXRlcmF0b3IubmV4dCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChfaS5kb25lKSBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfcmVmID0gX2kudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBrZXkgPSBfcmVmO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICAgICAqIElmIHRoZSBrZXkgY29udGFpbnMgaGFzaCBhZGQgaXQgdG8gdGhlIGxpc3RcbiAgICAgICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGtleS5pbmRleE9mKHRoaXMuaGFzaCkgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBBZGQga2V5IHRvIHRoZSBsaXN0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJyS2V5cy5wdXNoKGtleS5zdWJzdHIodGhpcy5oYXNoLmxlbmd0aCArIDEpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXJyS2V5cztcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogSWYgY29va2llIGRvZXMgbm90IHN1cHBvcnRlZCByZXR1cm4gZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIElmIGlucHV0IGRhdGEgaXMgbm90IHZhbGlkXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIElmIHNvbWV0aGluZyBnb2VzIHdyb25nIHJldHVybiBmYWxzZVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFRoZSBtZXRob2QgY2xlYW5zIHRoZSBzdG9yYWdlIGFuZCByZXR1cm4gdHJ1ZSBpZiBpdCBpcyBlbXB0eVxuICAgICAqIEBwYXJhbSBjaGVja1N1cHBvcnQge2Jvb2xlYW59XG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICovXG5cblxuICAgIEdsb2JhbFN0b3JhZ2UucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gY2xlYXIoKSB7XG4gICAgICAgIHZhciBjaGVja1N1cHBvcnQgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHRydWU7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogVmFsaWRhdGUgaW5wdXQgZGF0YVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBpZiAodHlwZW9mIGNoZWNrU3VwcG9ydCA9PT0gXCJib29sZWFuXCIpIHtcbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBJZiB0aGF0IHN0b3JlIGlzIHN1cHBvcnRlZFxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGlmICghY2hlY2tTdXBwb3J0IHx8IHRoaXMuaXNTdXBwb3J0ZWQoKSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYXJyS2V5cyA9IHRoaXMuZ2V0S2V5cyhjaGVja1N1cHBvcnQpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYXJyS2V5cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgX2l0ZXJhdG9yMiA9IGFycktleXMsIF9pc0FycmF5MiA9IEFycmF5LmlzQXJyYXkoX2l0ZXJhdG9yMiksIF9pMiA9IDAsIF9pdGVyYXRvcjIgPSBfaXNBcnJheTIgPyBfaXRlcmF0b3IyIDogX2l0ZXJhdG9yMltTeW1ib2wuaXRlcmF0b3JdKCk7Oykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBfcmVmMjtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChfaXNBcnJheTIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKF9pMiA+PSBfaXRlcmF0b3IyLmxlbmd0aCkgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9yZWYyID0gX2l0ZXJhdG9yMltfaTIrK107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX2kyID0gX2l0ZXJhdG9yMi5uZXh0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChfaTIuZG9uZSkgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9yZWYyID0gX2kyLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpID0gX3JlZjI7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZUl0ZW0oY2hlY2tTdXBwb3J0LCBpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogSWYgYWxsIG9rIHJldHVybiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRLZXlzKGNoZWNrU3VwcG9ydCkubGVuZ3RoID09PSAwO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBJZiBjb29raWUgZG9lcyBub3Qgc3VwcG9ydGVkIHJldHVybiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBJZiBpbnB1dCBkYXRhIGlzIG5vdCB2YWxpZFxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBJZiBzb21ldGhpbmcgZ29lcyB3cm9uZyByZXR1cm4gZmFsc2VcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHJldHVybiBHbG9iYWxTdG9yYWdlO1xufSgpO1xuXG5leHBvcnRzLmRlZmF1bHQgPSBHbG9iYWxTdG9yYWdlO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9FdmVyQ29va2llL2xpYi9TdG9yYWdlcy9HbG9iYWxTdG9yYWdlLnRzXG4vLyBtb2R1bGUgaWQgPSAzNFxuLy8gbW9kdWxlIGNodW5rcyA9IDEgMiAzIiwiXCJ1c2Ugc3RyaWN0XCI7XG4vKipcbiAqIFRoZSBMb2NhbFN0b3JhZ2VcbiAqL1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG52YXIgTG9jYWxTdG9yYWdlID0gZnVuY3Rpb24gKCkge1xuICAgIC8qKlxuICAgICAqIFRoZSBjb25zdHJ1Y3RvciBzaG91bGQgYWNjZXB0IGEgaGFzaCB0byBzZXBhcmF0ZSB0aGUgc2NvcGVzIG9mIHN0b3JhZ2VcbiAgICAgKiBAcGFyYW0gaGFzaCB7c3RyaW5nfVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIExvY2FsU3RvcmFnZShoYXNoKSB7XG4gICAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBMb2NhbFN0b3JhZ2UpO1xuXG4gICAgICAgIHRoaXMucmVnVmFsaWRLZXkgPSBuZXcgUmVnRXhwKFwiKFthLXpBLVowLTlfLV17MCx9KVwiLCBcImlcIik7XG4gICAgICAgIHRoaXMuaGFzaCA9IGhhc2ggfHwgbG9jYXRpb24uaG9zdG5hbWU7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFRoZSBtZXRob2QgcmV0dXJucyB0aGUgZmxhZyB3aGV0aGVyIHN1cHBvcnRlZCB0aGlzIHN0b3JhZ2UgdHlwZSBvciBub3RcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKi9cblxuXG4gICAgTG9jYWxTdG9yYWdlLnByb3RvdHlwZS5pc1N1cHBvcnRlZCA9IGZ1bmN0aW9uIGlzU3VwcG9ydGVkKCkge1xuICAgICAgICByZXR1cm4gdHlwZW9mIHdpbmRvdy5sb2NhbFN0b3JhZ2UgIT09IFwidW5kZWZpbmVkXCI7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBUaGUgbWV0aG9kIHNldHMgdGhlIHZhbHVlIGFuZCByZXR1cm5zIHRydWUgaWYgaXQgaGFzIGJlZW4gc2V0XG4gICAgICogQHBhcmFtIGNoZWNrU3VwcG9ydCB7Ym9vbGVhbn1cbiAgICAgKiBAcGFyYW0ga2V5IHtzdHJpbmd9XG4gICAgICogQHBhcmFtIHZhbHVlIHtzdHJpbmd9XG4gICAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICAgKi9cblxuXG4gICAgTG9jYWxTdG9yYWdlLnByb3RvdHlwZS5zZXRJdGVtID0gZnVuY3Rpb24gc2V0SXRlbSgpIHtcbiAgICAgICAgdmFyIGNoZWNrU3VwcG9ydCA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogdHJ1ZTtcbiAgICAgICAgdmFyIGtleSA9IGFyZ3VtZW50c1sxXTtcbiAgICAgICAgdmFyIHZhbHVlID0gYXJndW1lbnRzWzJdO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIFZhbGlkYXRlIGlucHV0IGRhdGFcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBjaGVja1N1cHBvcnQgPT09IFwiYm9vbGVhblwiICYmIHR5cGVvZiBrZXkgPT09IFwic3RyaW5nXCIgJiYgdGhpcy5yZWdWYWxpZEtleS50ZXN0KGtleSkgJiYgdHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiICYmICh2YWx1ZSA9PT0gXCJcIiB8fCB0aGlzLnJlZ1ZhbGlkS2V5LnRlc3QodmFsdWUpKSkge1xuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIElmIHRoYXQgc3RvcmUgaXMgc3VwcG9ydGVkXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgaWYgKCFjaGVja1N1cHBvcnQgfHwgdGhpcy5pc1N1cHBvcnRlZCgpKSB7XG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBUaGUgaGFzaCBuZWVkcyBmb3Igc3BsaXR0aW5nIHNjb3BlcyBzdG9yYWdlXG4gICAgICAgICAgICAgICAgICAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICB2YXIgbG9jYWxLZXkgPSB0aGlzLmhhc2ggKyBcIl9cIiArIGtleTtcbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIFNldCB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKGxvY2FsS2V5LCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBJZiBhbGwgb2sgcmV0dXJuIHRydWVcbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldEl0ZW0oY2hlY2tTdXBwb3J0LCBrZXkpID09PSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogSWYgY29va2llIGRvZXMgbm90IHN1cHBvcnRlZCByZXR1cm4gZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIElmIGlucHV0IGRhdGEgaXMgbm90IHZhbGlkXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIElmIHNvbWV0aGluZyBnb2VzIHdyb25nIHJldHVybiBmYWxzZVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFRoZSBtZXRob2QgcmVhZHMgdGhlIHZhbHVlIGFuZCByZXR1cm5zIGl0IG9yIHJldHVybnMgZmFsc2UgaWYgdGhlIHZhbHVlIGRvZXMgbm90IGV4aXN0XG4gICAgICogQHBhcmFtIGNoZWNrU3VwcG9ydCB7Ym9vbGVhbn1cbiAgICAgKiBAcGFyYW0ga2V5IHtzdHJpbmd9XG4gICAgICogQHJldHVybnMge3N0cmluZ3xib29sZWFufVxuICAgICAqL1xuXG5cbiAgICBMb2NhbFN0b3JhZ2UucHJvdG90eXBlLmdldEl0ZW0gPSBmdW5jdGlvbiBnZXRJdGVtKCkge1xuICAgICAgICB2YXIgY2hlY2tTdXBwb3J0ID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB0cnVlO1xuICAgICAgICB2YXIga2V5ID0gYXJndW1lbnRzWzFdO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIFZhbGlkYXRlIGlucHV0IGRhdGFcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBjaGVja1N1cHBvcnQgPT09IFwiYm9vbGVhblwiICYmIHR5cGVvZiBrZXkgPT09IFwic3RyaW5nXCIgJiYgdGhpcy5yZWdWYWxpZEtleS50ZXN0KGtleSkpIHtcbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBJZiB0aGF0IHN0b3JlIGlzIHN1cHBvcnRlZFxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGlmICghY2hlY2tTdXBwb3J0IHx8IHRoaXMuaXNTdXBwb3J0ZWQoKSkge1xuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogVGhlIGhhc2ggbmVlZHMgZm9yIHNwbGl0dGluZyBzY29wZXMgc3RvcmFnZVxuICAgICAgICAgICAgICAgICAgICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgdmFyIGxvY2FsS2V5ID0gdGhpcy5oYXNoICsgXCJfXCIgKyBrZXk7XG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBHZXQgdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbShsb2NhbEtleSk7XG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBJZiB2YWx1ZSBleGlzdCwgcmV0dXJuIGl0XG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBJZiBjb29raWUgZG9lcyBub3Qgc3VwcG9ydGVkIHJldHVybiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogSWYgY29va2llIGRvZXMgbm90IHN1cHBvcnRlZCByZXR1cm4gZmFsc2VcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogSWYgc29tZXRoaW5nIGdvZXMgd3JvbmcgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgLyoqXG4gICAgICogVGhlIG1ldGhvZCByZW1vdmVzIHRoZSB2YWx1ZSBhbmQgcmV0dXJuIHRydWUgaWYgdGhlIHZhbHVlIGRvZXMgbm90IGV4aXN0XG4gICAgICogQHBhcmFtIGNoZWNrU3VwcG9ydCB7Ym9vbGVhbn1cbiAgICAgKiBAcGFyYW0ga2V5IHtzdHJpbmd9XG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICovXG5cblxuICAgIExvY2FsU3RvcmFnZS5wcm90b3R5cGUucmVtb3ZlSXRlbSA9IGZ1bmN0aW9uIHJlbW92ZUl0ZW0oKSB7XG4gICAgICAgIHZhciBjaGVja1N1cHBvcnQgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHRydWU7XG4gICAgICAgIHZhciBrZXkgPSBhcmd1bWVudHNbMV07XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogVmFsaWRhdGUgaW5wdXQgZGF0YVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBpZiAodHlwZW9mIGNoZWNrU3VwcG9ydCA9PT0gXCJib29sZWFuXCIgJiYgdHlwZW9mIGtleSA9PT0gXCJzdHJpbmdcIiAmJiB0aGlzLnJlZ1ZhbGlkS2V5LnRlc3Qoa2V5KSkge1xuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIElmIHRoYXQgc3RvcmUgaXMgc3VwcG9ydGVkXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgaWYgKCFjaGVja1N1cHBvcnQgfHwgdGhpcy5pc1N1cHBvcnRlZCgpKSB7XG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBUaGUgaGFzaCBuZWVkcyBmb3Igc3BsaXR0aW5nIHNjb3BlcyBzdG9yYWdlXG4gICAgICAgICAgICAgICAgICAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICB2YXIgbG9jYWxLZXkgPSB0aGlzLmhhc2ggKyBcIl9cIiArIGtleTtcbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIENsZWFuIHZhbHVlIGFuZCByZW1vdmVcbiAgICAgICAgICAgICAgICAgICAgICogQHR5cGUge2Jvb2xlYW59XG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0obG9jYWxLZXkpO1xuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogSWYgYWxsIG9rIHJldHVybiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRJdGVtKGNoZWNrU3VwcG9ydCwga2V5KSA9PT0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIElmIGNvb2tpZSBkb2VzIG5vdCBzdXBwb3J0ZWQgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBJZiBpbnB1dCBkYXRhIGlzIG5vdCB2YWxpZFxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBJZiBzb21ldGhpbmcgZ29lcyB3cm9uZyByZXR1cm4gZmFsc2VcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBUaGUgbWV0aG9kIHJldHVybnMgdGhlIGFycmF5IG9mIHN0cmluZyBvZiBhdmFpbGFibGUga2V5c1xuICAgICAqIEBwYXJhbSBjaGVja1N1cHBvcnQge2Jvb2xlYW59XG4gICAgICogQHJldHVybnMge3N0cmluZ1tdfVxuICAgICAqL1xuXG5cbiAgICBMb2NhbFN0b3JhZ2UucHJvdG90eXBlLmdldEtleXMgPSBmdW5jdGlvbiBnZXRLZXlzKCkge1xuICAgICAgICB2YXIgY2hlY2tTdXBwb3J0ID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB0cnVlO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIFZhbGlkYXRlIGlucHV0IGRhdGFcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBjaGVja1N1cHBvcnQgPT09IFwiYm9vbGVhblwiKSB7XG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogSWYgdGhhdCBzdG9yZSBpcyBzdXBwb3J0ZWRcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBpZiAoIWNoZWNrU3VwcG9ydCB8fCB0aGlzLmlzU3VwcG9ydGVkKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIFRoZSBhcnJheSBvZiBhdmFpbGFibGUga2V5c1xuICAgICAgICAgICAgICAgICAgICAgKiBAdHlwZSB7QXJyYXl9XG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICB2YXIgYXJyS2V5cyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogSXRlcmF0ZSB0aHJvdWdoIHRoZSBsb2NhbFN0b3JhZ2VcbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgd2luZG93LmxvY2FsU3RvcmFnZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHdpbmRvdy5sb2NhbFN0b3JhZ2Uua2V5KGkpLmluZGV4T2YodGhpcy5oYXNoKSA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFycktleXMucHVzaCh3aW5kb3cubG9jYWxTdG9yYWdlLmtleShpKS5zdWJzdHIodGhpcy5oYXNoLmxlbmd0aCArIDEpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogUmV0dXJuIGtleXNcbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhcnJLZXlzO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBJZiBjb29raWUgZG9lcyBub3Qgc3VwcG9ydGVkIHJldHVybiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogSWYgaW5wdXQgZGF0YSBpcyBub3QgdmFsaWRcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogSWYgc29tZXRoaW5nIGdvZXMgd3JvbmcgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgLyoqXG4gICAgICogVGhlIG1ldGhvZCBjbGVhbnMgdGhlIHN0b3JhZ2UgYW5kIHJldHVybiB0cnVlIGlmIGl0IGlzIGVtcHR5XG4gICAgICogQHBhcmFtIGNoZWNrU3VwcG9ydCB7Ym9vbGVhbn1cbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKi9cblxuXG4gICAgTG9jYWxTdG9yYWdlLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uIGNsZWFyKCkge1xuICAgICAgICB2YXIgY2hlY2tTdXBwb3J0ID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB0cnVlO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIFZhbGlkYXRlIGlucHV0IGRhdGFcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBjaGVja1N1cHBvcnQgPT09IFwiYm9vbGVhblwiKSB7XG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogSWYgdGhhdCBzdG9yZSBpcyBzdXBwb3J0ZWRcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBpZiAoIWNoZWNrU3VwcG9ydCB8fCB0aGlzLmlzU3VwcG9ydGVkKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFycktleXMgPSB0aGlzLmdldEtleXMoY2hlY2tTdXBwb3J0KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFycktleXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIF9pdGVyYXRvciA9IGFycktleXMsIF9pc0FycmF5ID0gQXJyYXkuaXNBcnJheShfaXRlcmF0b3IpLCBfaSA9IDAsIF9pdGVyYXRvciA9IF9pc0FycmF5ID8gX2l0ZXJhdG9yIDogX2l0ZXJhdG9yW1N5bWJvbC5pdGVyYXRvcl0oKTs7KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIF9yZWY7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoX2lzQXJyYXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKF9pID49IF9pdGVyYXRvci5sZW5ndGgpIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfcmVmID0gX2l0ZXJhdG9yW19pKytdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9pID0gX2l0ZXJhdG9yLm5leHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKF9pLmRvbmUpIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfcmVmID0gX2kudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGkgPSBfcmVmO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVJdGVtKGNoZWNrU3VwcG9ydCwgaSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIElmIGFsbCBvayByZXR1cm4gdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0S2V5cyhjaGVja1N1cHBvcnQpLmxlbmd0aCA9PT0gMDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogSWYgY29va2llIGRvZXMgbm90IHN1cHBvcnRlZCByZXR1cm4gZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogSWYgaW5wdXQgZGF0YSBpcyBub3QgdmFsaWRcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogSWYgc29tZXRoaW5nIGdvZXMgd3JvbmcgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICByZXR1cm4gTG9jYWxTdG9yYWdlO1xufSgpO1xuXG5leHBvcnRzLmRlZmF1bHQgPSBMb2NhbFN0b3JhZ2U7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L0V2ZXJDb29raWUvbGliL1N0b3JhZ2VzL0xvY2FsU3RvcmFnZS50c1xuLy8gbW9kdWxlIGlkID0gMzVcbi8vIG1vZHVsZSBjaHVua3MgPSAxIDIgMyIsIlwidXNlIHN0cmljdFwiO1xuLyoqXG4gKiBUaGUgU2Vzc2lvblN0b3JhZ2VcbiAqL1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG52YXIgU2Vzc2lvblN0b3JhZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgLyoqXG4gICAgICogVGhlIGNvbnN0cnVjdG9yIHNob3VsZCBhY2NlcHQgYSBoYXNoIHRvIHNlcGFyYXRlIHRoZSBzY29wZXMgb2Ygc3RvcmFnZVxuICAgICAqIEBwYXJhbSBoYXNoIHtzdHJpbmd9XG4gICAgICovXG4gICAgZnVuY3Rpb24gU2Vzc2lvblN0b3JhZ2UoaGFzaCkge1xuICAgICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgU2Vzc2lvblN0b3JhZ2UpO1xuXG4gICAgICAgIHRoaXMucmVnVmFsaWRLZXkgPSBuZXcgUmVnRXhwKFwiKFthLXpBLVowLTlfLV17MCx9KVwiLCBcImlcIik7XG4gICAgICAgIHRoaXMuaGFzaCA9IGhhc2ggfHwgbG9jYXRpb24uaG9zdG5hbWU7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFRoZSBtZXRob2QgcmV0dXJucyB0aGUgZmxhZyB3aGV0aGVyIHN1cHBvcnRlZCB0aGlzIHN0b3JhZ2UgdHlwZSBvciBub3RcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKi9cblxuXG4gICAgU2Vzc2lvblN0b3JhZ2UucHJvdG90eXBlLmlzU3VwcG9ydGVkID0gZnVuY3Rpb24gaXNTdXBwb3J0ZWQoKSB7XG4gICAgICAgIHJldHVybiB0eXBlb2Ygd2luZG93LnNlc3Npb25TdG9yYWdlICE9PSBcInVuZGVmaW5lZFwiO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogVGhlIG1ldGhvZCBzZXRzIHRoZSB2YWx1ZSBhbmQgcmV0dXJucyB0cnVlIGlmIGl0IGhhcyBiZWVuIHNldFxuICAgICAqIEBwYXJhbSBjaGVja1N1cHBvcnQge2Jvb2xlYW59XG4gICAgICogQHBhcmFtIGtleSB7c3RyaW5nfVxuICAgICAqIEBwYXJhbSB2YWx1ZSB7c3RyaW5nfVxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAgICovXG5cblxuICAgIFNlc3Npb25TdG9yYWdlLnByb3RvdHlwZS5zZXRJdGVtID0gZnVuY3Rpb24gc2V0SXRlbSgpIHtcbiAgICAgICAgdmFyIGNoZWNrU3VwcG9ydCA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogdHJ1ZTtcbiAgICAgICAgdmFyIGtleSA9IGFyZ3VtZW50c1sxXTtcbiAgICAgICAgdmFyIHZhbHVlID0gYXJndW1lbnRzWzJdO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIFZhbGlkYXRlIGlucHV0IGRhdGFcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBjaGVja1N1cHBvcnQgPT09IFwiYm9vbGVhblwiICYmIHR5cGVvZiBrZXkgPT09IFwic3RyaW5nXCIgJiYgdGhpcy5yZWdWYWxpZEtleS50ZXN0KGtleSkgJiYgdHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiICYmICh2YWx1ZSA9PT0gXCJcIiB8fCB0aGlzLnJlZ1ZhbGlkS2V5LnRlc3QodmFsdWUpKSkge1xuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIElmIHRoYXQgc3RvcmUgaXMgc3VwcG9ydGVkXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgaWYgKCFjaGVja1N1cHBvcnQgfHwgdGhpcy5pc1N1cHBvcnRlZCgpKSB7XG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBUaGUgaGFzaCBuZWVkcyBmb3Igc3BsaXR0aW5nIHNjb3BlcyBzdG9yYWdlXG4gICAgICAgICAgICAgICAgICAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICB2YXIgbG9jYWxLZXkgPSB0aGlzLmhhc2ggKyBcIl9cIiArIGtleTtcbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIFNldCB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgd2luZG93LnNlc3Npb25TdG9yYWdlLnNldEl0ZW0obG9jYWxLZXksIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIElmIGFsbCBvayByZXR1cm4gdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0SXRlbShjaGVja1N1cHBvcnQsIGtleSkgPT09IHZhbHVlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBJZiBjb29raWUgZG9lcyBub3Qgc3VwcG9ydGVkIHJldHVybiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogSWYgaW5wdXQgZGF0YSBpcyBub3QgdmFsaWRcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogSWYgc29tZXRoaW5nIGdvZXMgd3JvbmcgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgLyoqXG4gICAgICogVGhlIG1ldGhvZCByZWFkcyB0aGUgdmFsdWUgYW5kIHJldHVybnMgaXQgb3IgcmV0dXJucyBmYWxzZSBpZiB0aGUgdmFsdWUgZG9lcyBub3QgZXhpc3RcbiAgICAgKiBAcGFyYW0gY2hlY2tTdXBwb3J0IHtib29sZWFufVxuICAgICAqIEBwYXJhbSBrZXkge3N0cmluZ31cbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfGJvb2xlYW59XG4gICAgICovXG5cblxuICAgIFNlc3Npb25TdG9yYWdlLnByb3RvdHlwZS5nZXRJdGVtID0gZnVuY3Rpb24gZ2V0SXRlbSgpIHtcbiAgICAgICAgdmFyIGNoZWNrU3VwcG9ydCA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogdHJ1ZTtcbiAgICAgICAgdmFyIGtleSA9IGFyZ3VtZW50c1sxXTtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBWYWxpZGF0ZSBpbnB1dCBkYXRhXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGlmICh0eXBlb2YgY2hlY2tTdXBwb3J0ID09PSBcImJvb2xlYW5cIiAmJiB0eXBlb2Yga2V5ID09PSBcInN0cmluZ1wiICYmIHRoaXMucmVnVmFsaWRLZXkudGVzdChrZXkpKSB7XG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogSWYgdGhhdCBzdG9yZSBpcyBzdXBwb3J0ZWRcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBpZiAoIWNoZWNrU3VwcG9ydCB8fCB0aGlzLmlzU3VwcG9ydGVkKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIFRoZSBoYXNoIG5lZWRzIGZvciBzcGxpdHRpbmcgc2NvcGVzIHN0b3JhZ2VcbiAgICAgICAgICAgICAgICAgICAgICogQHR5cGUge3N0cmluZ31cbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIHZhciBsb2NhbEtleSA9IHRoaXMuaGFzaCArIFwiX1wiICsga2V5O1xuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogR2V0IHZhbHVlXG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSB3aW5kb3cuc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShsb2NhbEtleSk7XG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBJZiB2YWx1ZSBleGlzdCwgcmV0dXJuIGl0XG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBJZiBjb29raWUgZG9lcyBub3Qgc3VwcG9ydGVkIHJldHVybiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogSWYgY29va2llIGRvZXMgbm90IHN1cHBvcnRlZCByZXR1cm4gZmFsc2VcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogSWYgc29tZXRoaW5nIGdvZXMgd3JvbmcgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgLyoqXG4gICAgICogVGhlIG1ldGhvZCByZW1vdmVzIHRoZSB2YWx1ZSBhbmQgcmV0dXJuIHRydWUgaWYgdGhlIHZhbHVlIGRvZXMgbm90IGV4aXN0XG4gICAgICogQHBhcmFtIGNoZWNrU3VwcG9ydCB7Ym9vbGVhbn1cbiAgICAgKiBAcGFyYW0ga2V5IHtzdHJpbmd9XG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICovXG5cblxuICAgIFNlc3Npb25TdG9yYWdlLnByb3RvdHlwZS5yZW1vdmVJdGVtID0gZnVuY3Rpb24gcmVtb3ZlSXRlbSgpIHtcbiAgICAgICAgdmFyIGNoZWNrU3VwcG9ydCA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogdHJ1ZTtcbiAgICAgICAgdmFyIGtleSA9IGFyZ3VtZW50c1sxXTtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBWYWxpZGF0ZSBpbnB1dCBkYXRhXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGlmICh0eXBlb2YgY2hlY2tTdXBwb3J0ID09PSBcImJvb2xlYW5cIiAmJiB0eXBlb2Yga2V5ID09PSBcInN0cmluZ1wiICYmIHRoaXMucmVnVmFsaWRLZXkudGVzdChrZXkpKSB7XG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogSWYgdGhhdCBzdG9yZSBpcyBzdXBwb3J0ZWRcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBpZiAoIWNoZWNrU3VwcG9ydCB8fCB0aGlzLmlzU3VwcG9ydGVkKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIFRoZSBoYXNoIG5lZWRzIGZvciBzcGxpdHRpbmcgc2NvcGVzIHN0b3JhZ2VcbiAgICAgICAgICAgICAgICAgICAgICogQHR5cGUge3N0cmluZ31cbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIHZhciBsb2NhbEtleSA9IHRoaXMuaGFzaCArIFwiX1wiICsga2V5O1xuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogQ2xlYW4gdmFsdWUgYW5kIHJlbW92ZVxuICAgICAgICAgICAgICAgICAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5zZXNzaW9uU3RvcmFnZS5yZW1vdmVJdGVtKGxvY2FsS2V5KTtcbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIElmIGFsbCBvayByZXR1cm4gdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0SXRlbShjaGVja1N1cHBvcnQsIGtleSkgPT09IGZhbHNlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBJZiBjb29raWUgZG9lcyBub3Qgc3VwcG9ydGVkIHJldHVybiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogSWYgaW5wdXQgZGF0YSBpcyBub3QgdmFsaWRcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogSWYgc29tZXRoaW5nIGdvZXMgd3JvbmcgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgLyoqXG4gICAgICogVGhlIG1ldGhvZCByZXR1cm5zIHRoZSBhcnJheSBvZiBzdHJpbmcgb2YgYXZhaWxhYmxlIGtleXNcbiAgICAgKiBAcGFyYW0gY2hlY2tTdXBwb3J0IHtib29sZWFufVxuICAgICAqIEByZXR1cm5zIHtzdHJpbmdbXX1cbiAgICAgKi9cblxuXG4gICAgU2Vzc2lvblN0b3JhZ2UucHJvdG90eXBlLmdldEtleXMgPSBmdW5jdGlvbiBnZXRLZXlzKCkge1xuICAgICAgICB2YXIgY2hlY2tTdXBwb3J0ID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB0cnVlO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIFZhbGlkYXRlIGlucHV0IGRhdGFcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBjaGVja1N1cHBvcnQgPT09IFwiYm9vbGVhblwiKSB7XG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogSWYgdGhhdCBzdG9yZSBpcyBzdXBwb3J0ZWRcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBpZiAoIWNoZWNrU3VwcG9ydCB8fCB0aGlzLmlzU3VwcG9ydGVkKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIFRoZSBhcnJheSBvZiBhdmFpbGFibGUga2V5c1xuICAgICAgICAgICAgICAgICAgICAgKiBAdHlwZSB7QXJyYXl9XG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICB2YXIgYXJyS2V5cyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogSXRlcmF0ZSB0aHJvdWdoIHRoZSBTZXNzaW9uU3RvcmFnZVxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB3aW5kb3cuc2Vzc2lvblN0b3JhZ2UubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3aW5kb3cuc2Vzc2lvblN0b3JhZ2Uua2V5KGkpLmluZGV4T2YodGhpcy5oYXNoKSA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFycktleXMucHVzaCh3aW5kb3cuc2Vzc2lvblN0b3JhZ2Uua2V5KGkpLnN1YnN0cih0aGlzLmhhc2gubGVuZ3RoICsgMSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBSZXR1cm4ga2V5c1xuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFycktleXM7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIElmIGNvb2tpZSBkb2VzIG5vdCBzdXBwb3J0ZWQgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBJZiBpbnB1dCBkYXRhIGlzIG5vdCB2YWxpZFxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBJZiBzb21ldGhpbmcgZ29lcyB3cm9uZyByZXR1cm4gZmFsc2VcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBUaGUgbWV0aG9kIGNsZWFucyB0aGUgc3RvcmFnZSBhbmQgcmV0dXJuIHRydWUgaWYgaXQgaXMgZW1wdHlcbiAgICAgKiBAcGFyYW0gY2hlY2tTdXBwb3J0IHtib29sZWFufVxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgICAqL1xuXG5cbiAgICBTZXNzaW9uU3RvcmFnZS5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiBjbGVhcigpIHtcbiAgICAgICAgdmFyIGNoZWNrU3VwcG9ydCA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogdHJ1ZTtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBWYWxpZGF0ZSBpbnB1dCBkYXRhXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGlmICh0eXBlb2YgY2hlY2tTdXBwb3J0ID09PSBcImJvb2xlYW5cIikge1xuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIElmIHRoYXQgc3RvcmUgaXMgc3VwcG9ydGVkXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgaWYgKCFjaGVja1N1cHBvcnQgfHwgdGhpcy5pc1N1cHBvcnRlZCgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhcnJLZXlzID0gdGhpcy5nZXRLZXlzKGNoZWNrU3VwcG9ydCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhcnJLZXlzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBfaXRlcmF0b3IgPSBhcnJLZXlzLCBfaXNBcnJheSA9IEFycmF5LmlzQXJyYXkoX2l0ZXJhdG9yKSwgX2kgPSAwLCBfaXRlcmF0b3IgPSBfaXNBcnJheSA/IF9pdGVyYXRvciA6IF9pdGVyYXRvcltTeW1ib2wuaXRlcmF0b3JdKCk7Oykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBfcmVmO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKF9pc0FycmF5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChfaSA+PSBfaXRlcmF0b3IubGVuZ3RoKSBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3JlZiA9IF9pdGVyYXRvcltfaSsrXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfaSA9IF9pdGVyYXRvci5uZXh0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChfaS5kb25lKSBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3JlZiA9IF9pLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpID0gX3JlZjtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlSXRlbShjaGVja1N1cHBvcnQsIGkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBJZiBhbGwgb2sgcmV0dXJuIHRydWVcbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldEtleXMoY2hlY2tTdXBwb3J0KS5sZW5ndGggPT09IDA7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIElmIGNvb2tpZSBkb2VzIG5vdCBzdXBwb3J0ZWQgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIElmIGlucHV0IGRhdGEgaXMgbm90IHZhbGlkXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIElmIHNvbWV0aGluZyBnb2VzIHdyb25nIHJldHVybiBmYWxzZVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIFNlc3Npb25TdG9yYWdlO1xufSgpO1xuXG5leHBvcnRzLmRlZmF1bHQgPSBTZXNzaW9uU3RvcmFnZTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vRXZlckNvb2tpZS9saWIvU3RvcmFnZXMvU2Vzc2lvblN0b3JhZ2UudHNcbi8vIG1vZHVsZSBpZCA9IDM2XG4vLyBtb2R1bGUgY2h1bmtzID0gMSAyIDMiLCIoZnVuY3Rpb24gKCkge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICBmdW5jdGlvbiBidG9hKHN0cikge1xuICAgIHZhciBidWZmZXJcbiAgICAgIDtcblxuICAgIGlmIChzdHIgaW5zdGFuY2VvZiBCdWZmZXIpIHtcbiAgICAgIGJ1ZmZlciA9IHN0cjtcbiAgICB9IGVsc2Uge1xuICAgICAgYnVmZmVyID0gbmV3IEJ1ZmZlcihzdHIudG9TdHJpbmcoKSwgJ2JpbmFyeScpO1xuICAgIH1cblxuICAgIHJldHVybiBidWZmZXIudG9TdHJpbmcoJ2Jhc2U2NCcpO1xuICB9XG5cbiAgbW9kdWxlLmV4cG9ydHMgPSBidG9hO1xufSgpKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9idG9hL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSAzN1xuLy8gbW9kdWxlIGNodW5rcyA9IDEgMiAzIl0sInNvdXJjZVJvb3QiOiIifQ==