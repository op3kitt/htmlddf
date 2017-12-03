(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
  return (b64.length * 3 / 4) - placeHoldersCount(b64)
}

function toByteArray (b64) {
  var i, l, tmp, placeHolders, arr
  var len = b64.length
  placeHolders = placeHoldersCount(b64)

  arr = new Arr((len * 3 / 4) - placeHolders)

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len

  var L = 0

  for (i = 0; i < l; i += 4) {
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

},{}],2:[function(require,module,exports){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

var K_MAX_LENGTH = 0x7fffffff
exports.kMaxLength = K_MAX_LENGTH

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
  console.error(
    'This browser lacks typed array (Uint8Array) support which is required by ' +
    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
  )
}

function typedArraySupport () {
  // Can typed array instances can be augmented?
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42
  } catch (e) {
    return false
  }
}

function createBuffer (length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('Invalid typed array length')
  }
  // Return an augmented `Uint8Array` instance
  var buf = new Uint8Array(length)
  buf.__proto__ = Buffer.prototype
  return buf
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
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(arg)
  }
  return from(arg, encodingOrOffset, length)
}

// Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
if (typeof Symbol !== 'undefined' && Symbol.species &&
    Buffer[Symbol.species] === Buffer) {
  Object.defineProperty(Buffer, Symbol.species, {
    value: null,
    configurable: true,
    enumerable: false,
    writable: false
  })
}

Buffer.poolSize = 8192 // not used by this implementation

function from (value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (isArrayBuffer(value)) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  return fromObject(value)
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
  return from(value, encodingOrOffset, length)
}

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Buffer.prototype.__proto__ = Uint8Array.prototype
Buffer.__proto__ = Uint8Array

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(size).fill(fill, encoding)
      : createBuffer(size).fill(fill)
  }
  return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding)
}

function allocUnsafe (size) {
  assertSize(size)
  return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size)
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  var buf = createBuffer(length)

  var actual = buf.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual)
  }

  return buf
}

function fromArrayLike (array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  var buf = createBuffer(length)
  for (var i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255
  }
  return buf
}

function fromArrayBuffer (array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  var buf
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array)
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset)
  } else {
    buf = new Uint8Array(array, byteOffset, length)
  }

  // Return an augmented `Uint8Array` instance
  buf.__proto__ = Buffer.prototype
  return buf
}

function fromObject (obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    var buf = createBuffer(len)

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len)
    return buf
  }

  if (obj) {
    if (isArrayBufferView(obj) || 'length' in obj) {
      if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
        return createBuffer(0)
      }
      return fromArrayLike(obj)
    }

    if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
      return fromArrayLike(obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
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
  return b != null && b._isBuffer === true
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
  if (!Array.isArray(list)) {
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
  if (isArrayBufferView(string) || isArrayBuffer(string)) {
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

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
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
  var length = this.length
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
  if (numberIsNaN(byteOffset)) {
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
    if (typeof Uint8Array.prototype.indexOf === 'function') {
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
    if (numberIsNaN(parsed)) return i
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
    offset = offset >>> 0
    if (isFinite(length)) {
      length = length >>> 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
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
    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
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

  var newBuf = this.subarray(start, end)
  // Return an augmented `Uint8Array` instance
  newBuf.__proto__ = Buffer.prototype
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
  offset = offset >>> 0
  byteLength = byteLength >>> 0
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
  offset = offset >>> 0
  byteLength = byteLength >>> 0
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
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
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
  offset = offset >>> 0
  byteLength = byteLength >>> 0
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
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  offset = offset >>> 0
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
  offset = offset >>> 0
  byteLength = byteLength >>> 0
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
  offset = offset >>> 0
  byteLength = byteLength >>> 0
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
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset + 3] = (value >>> 24)
  this[offset + 2] = (value >>> 16)
  this[offset + 1] = (value >>> 8)
  this[offset] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

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
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

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
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  this[offset + 2] = (value >>> 16)
  this[offset + 3] = (value >>> 24)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
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
  value = +value
  offset = offset >>> 0
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
  } else if (len < 1000) {
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
      : new Buffer(val, encoding)
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = str.trim().replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
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

// ArrayBuffers from another context (i.e. an iframe) do not pass the `instanceof` check
// but they should be treated as valid. See: https://github.com/feross/buffer/issues/166
function isArrayBuffer (obj) {
  return obj instanceof ArrayBuffer ||
    (obj != null && obj.constructor != null && obj.constructor.name === 'ArrayBuffer' &&
      typeof obj.byteLength === 'number')
}

// Node 0.10 supports `ArrayBuffer` but lacks `ArrayBuffer.isView`
function isArrayBufferView (obj) {
  return (typeof ArrayBuffer.isView === 'function') && ArrayBuffer.isView(obj)
}

function numberIsNaN (obj) {
  return obj !== obj // eslint-disable-line no-self-compare
}

},{"base64-js":1,"ieee754":3}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
module.exports={
  "name": "DodontoF_html5cli",
  "version": "1.0.0",
  "description": "DodontoF.rb client build package",
  "main": "gulpfile.js",
  "dependencies": {
    "browserify": "^14.4.0",
    "ddf": "^1.0.0",
    "gulp": "^3.9.1",
    "gulp-cssnano": "^2.1.2",
    "gulp-pug": "^3.3.0",
    "gulp-rename": "^1.2.2",
    "gulp-sass": "^3.1.0",
    "gulp-sourcemaps": "^2.6.1",
    "gulp-watchify": "^0.7.0",
    "uglifyify": "^4.0.5",
    "minami": "^1.2.3",
    "msgpack-lite": "^0.1.26",
    "store": "^2.0.12",
    "vinyl-buffer": "^1.0.0",
    "watchify": "^3.9.0",
    "del": "^3.0.0"
  },
  "devDependencies": {},
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "kitt @ttikitt <yosshi1123@gmail.com>",
  "license": "MIT",
  "directories": {
    "doc": "doc"
  }
}

},{}],5:[function(require,module,exports){
module.exports=ddf.config = {
  originalColorPalette: false, //true���w�肷���Ƃǂǂ��ƂӂƓ����ɂȂ��B
  base_url: "https://tools.cry-kit.com/ddf/public_html/DodontoF/"
}
},{}],6:[function(require,module,exports){
module.exports={
  clickoutFiresChange: true,
  showInput: true,
  preferredFormat: "hex",
  showPalette: true,
  showSelectionPalette: false,
  hideAfterPaletteSelect:true,
  chooseText: "選択",
  cancelText: "キャンセル",
  containerClassName: ddf.config.originalColorPalette?"originalColorSet":"",
  palette: ddf.config.originalColorPalette?
  [
    ["#000000","#000000","#003300","#006600","#009900","#00CC00","#00FF00","#330000","#333300","#336600","#339900","#33CC00","#33FF00","#660000","#663300","#666600","#669900","#66CC00","#66FF00"],
    ["#333333","#000033","#003333","#006633","#009933","#00CC33","#00FF33","#330033","#333333","#336633","#339933","#33CC33","#33FF33","#660033","#663333","#666633","#669933","#66CC33","#66FF33"],
    ["#666666","#000066","#003366","#006666","#009966","#00CC66","#00FF66","#330066","#333366","#336666","#339966","#33CC66","#33FF66","#660066","#663366","#666666","#669966","#66CC66","#66FF66"],
    ["#999999","#000099","#003399","#006699","#009999","#00CC99","#00FF99","#330099","#333399","#336699","#339999","#33CC99","#33FF99","#660099","#663399","#666699","#669999","#66CC99","#66FF99"],
    ["#CCCCCC","#0000CC","#0033CC","#0066CC","#0099CC","#00CCCC","#00FFCC","#3300CC","#3333CC","#3366CC","#3399CC","#33CCCC","#33FFCC","#6600CC","#6633CC","#6666CC","#6699CC","#66CCCC","#66FFCC"],
    ["#FFFFFF","#0000FF","#0033FF","#0066FF","#0099FF","#00CCFF","#00FFFF","#3300FF","#3333FF","#3366FF","#3399FF","#33CCFF","#33FFFF","#6600FF","#6633FF","#6666FF","#6699FF","#66CCFF","#66FFFF"],
    ["#FF0000","#990000","#993300","#996600","#999900","#99CC00","#99FF00","#CC0000","#CC3300","#CC6600","#CC9900","#CCCC00","#CCFF00","#FF0000","#FF3300","#FF6600","#FF9900","#FFCC00","#FFFF00"],
    ["#0000FF","#990033","#993333","#996633","#999933","#99CC33","#99FF33","#CC0033","#CC3333","#CC6633","#CC9933","#CCCC33","#CCFF33","#FF0033","#FF3333","#FF6633","#FF9933","#FFCC33","#FFFF33"],
    ["#00FF00","#990066","#993366","#996666","#999966","#99CC66","#99FF66","#CC0066","#CC3366","#CC6666","#CC9966","#CCCC66","#CCFF66","#FF0066","#FF3366","#FF6666","#FF9966","#FFCC66","#FFFF66"],
    ["#FF00FF","#990099","#993399","#996699","#999999","#99CC99","#99FF99","#CC0099","#CC3399","#CC6699","#CC9999","#CCCC99","#CCFF99","#FF0099","#FF3399","#FF6699","#FF9999","#FFCC99","#FFFF99"],
    ["#00FFFF","#9900CC","#9933CC","#9966CC","#9999CC","#99CCCC","#99FFCC","#CC00CC","#CC33CC","#CC66CC","#CC99CC","#CCCCCC","#CCFFCC","#FF00CC","#FF33CC","#FF66CC","#FF99CC","#FFCCCC","#FFFFCC"],
    ["#FFFF00","#9900FF","#9933FF","#9966FF","#9999FF","#99CCFF","#99FFFF","#CC00FF","#CC33FF","#CC66FF","#CC99FF","#CCCCFF","#CCFFFF","#FF00FF","#FF33FF","#FF66FF","#FF99FF","#FFCCFF","#FFFFFF"]
  ]
: [
    ["#FFFFFF","#FF2800","#FF2879","#FF9900","#FAF500","#CBF266","#35A16B","#0041FF","#9A28C9","#9A0079","#663300"],
    ["#CCCCCC","#991800","#991848","#995B00","#969300","#79913D","#1F6040","#002799","#5C1878","#5C0048","#3D1E00"],
    ["#999999","#4C0C00","#4C0C24","#4C2D00","#4B4900","#3C481E","#0F3020","#00134C","#2E0C3C","#2E0024","#1E0F00"],
    ["#666666","#FF6050","#FF99A0","#FFD1D1","#FFFF99","#DFFF99","#87E7B0","#66CCFF","#C8B9FA","#E5B2DE","#EDC58F"],
    ["#333333","#993930","#995B60","#997D7D","#99995B","#85995B","#518A69","#3D7A99","#786F96","#896A85","#8E7655"],
    ["#000000","#4C1C18","#4C2D30","#4C3E3E","#4C4C2D","#424C2D","#284534","#1E3D4C","#3C374B","#443542","#473B2A"]
  ]
}
},{}],7:[function(require,module,exports){
$(() => {
  require("./map.js");
  require("./characterData.js");
  require("./mapMask.js");
  require("./memo.js");
  require("./magicRange.js");
});
},{"./characterData.js":8,"./magicRange.js":9,"./map.js":10,"./mapMask.js":11,"./memo.js":12}],8:[function(require,module,exports){
$.contextMenu({
  zIndex: 150,
  selector: '#mapSurface .characterFrame',
  items: {
    edit: {name: "キャラクターの変更",
      callback: function(itemKey, opt, rootMenu, originalEvent) {
        ddf.cmd.addCharacter_show(opt.$trigger.attr("id"), true);
      },
    },
    delete: {name: "キャラクターの削除",
      callback: function(itemKey, opt, rootMenu, originalEvent) {
        ddf.removeCharacter(opt.$trigger.attr("id"), true);
        character = ddf.characters[opt.$trigger.attr("id")];
        if(character){
          ddf.safeDragDestoroy();
          character.obj && character.obj.remove();
          character.row && character.row.remove();
          ddf.characters[opt.$trigger.attr("id")] = null;
          $(".draggableObj").draggable(ddf.dragOption);
        }
      },
    },
    copy: {name: "キャラクターの複製",
      callback: function(itemKey, opt, rootMenu, originalEvent) {
        character = ddf.characters[opt.$trigger.attr("id")];
        basename = character.data.name.replace(/_\d+$/, "");
        index = 0;
        reg = new RegExp(basename+"_(\\d+)");
        for(item in ddf.characters){
          if(v = reg.exec(ddf.characters[item].data.name)){
            index = Math.max(index, parseInt(v[1]))
          }
        }
        data = $.extend(true, {}, character.data);
        data.name = basename + "_" + index + 1;
        data.dogTag = index + 1;
        data.imgId = 0;
        ddf.addCharacter(data);
      },
    },
    url: {name: "データ参照先URLを開く",
      visible: function(key, opt){
          return opt.$trigger && ddf.characters[opt.$trigger.attr("id")] && ddf.characters[opt.$trigger.attr("id")].data.url != "";
        },
      callback: function(itemKey, opt, rootMenu, originalEvent) {
        character = ddf.characters[opt.$trigger.attr("id")];
        window.open(character.data.url);
      },
    },
  }
});
},{}],9:[function(require,module,exports){
$.contextMenu({
  zIndex: 150,
  selector: '.magicRangeFrame',
  items: {
    edit: {name: "魔法範囲の変更",
      callback: function(itemKey, opt, rootMenu, originalEvent) {
        character = ddf.characters[opt.$trigger.attr("id")];
        switch(character.data.type){
          case "LogHorizonRange":
            ddf.cmd.magicRangeLH_show(opt.$trigger.attr("id"));
            break;
          case "magicRangeMarkerDD4th":
            ddf.cmd.magicRangeDD4th_show(opt.$trigger.attr("id"));
            break;
        }
      },
    },
    delete: {name: "魔法範囲の削除",
      callback: function(itemKey, opt, rootMenu, originalEvent) {
        ddf.removeCharacter(opt.$trigger.attr("id"), true);
        character = ddf.characters[opt.$trigger.attr("id")];
        if(character){
          ddf.safeDragDestoroy();
          character.obj && character.obj.remove();
          ddf.characters[opt.$trigger.attr("id")] = null;
          $(".draggableObj").draggable(ddf.dragOption);
        }
      },
    }
  }
});

},{}],10:[function(require,module,exports){
$.contextMenu({
  zIndex: 150,
  selector: '#mapSurface',
  items: {
    addCharacter: {name: "キャラクター追加",
      callback: function(itemKey, opt, rootMenu, originalEvent) {
        ddf.cmd.addCharacter_show("0");
      },
    },
    addMagicRangeDD3: {name: "魔法範囲追加(DD3版)",
      disabled: true, 
      callback: function(itemKey, opt, rootMenu, originalEvent) {
      },
    },
    addMagicRangeDD4: {name: "魔法範囲追加(DD4版)",
      callback: function(itemKey, opt, rootMenu, originalEvent) {
        ddf.cmd.magicRangeDD4th_show("0");
      },
    },
    addMagicRangeLH: {name: "ログホライズン用範囲",
      callback: function(itemKey, opt, rootMenu, originalEvent) {
        ddf.cmd.magicRangeLH_show("0");
      },
    },
    addMagicTimer: {name: "魔法タイマー追加",
      disabled: true, 
      callback: function(itemKey, opt, rootMenu, originalEvent) {
      },
    },
    addMapMask: {name: "マップマスク追加",
      callback: function(itemKey, opt, rootMenu, originalEvent) {
        ddf.mapMask_show("");
      },
    },
    addMapMarker: {name: "マップマーカー追加",
      disabled: true, 
      callback: function(itemKey, opt, rootMenu, originalEvent) {
      },
    },
    sep1: "---------",
    addDiceSymbol: {name: "ダイスシンボル追加",
      disabled: true, 
      callback: function(itemKey, opt, rootMenu, originalEvent) {
      },
    },
    sep2: "---------",
    addCardHolder: {name: "手札置き場の作成",
      disabled: true, 
      callback: function(itemKey, opt, rootMenu, originalEvent) {
      },
    },
    addMessageCard: {name: "メッセージカードの追加",
      disabled: true, 
      callback: function(itemKey, opt, rootMenu, originalEvent) {
      },
    },
    sep3: "---------",
    resetWindow: {name: "ウィンドウ配置初期化",
      disabled: true, 
      callback: function(itemKey, opt, rootMenu, originalEvent) {
      },
    }
  }
});
},{}],11:[function(require,module,exports){
$.contextMenu({
  zIndex: 150,
  selector: '.mapMaskFrame.draggableObj',
  items: {
    edit: {name: "マップマスクの変更",
      callback: function(itemKey, opt, rootMenu, originalEvent) {
        ddf.mapMask_show(opt.$trigger.attr("id"));
      },
    },
    fix: {name: "マップマスクの固定",
      callback: function(itemKey, opt, rootMenu, originalEvent) {
        ddf.safeDragDestoroy();
        character = ddf.characters[opt.$trigger.attr("id")];
        character.data.draggable = false;
        ddf.changeCharacter(character.data);
        character.obj.removeClass("draggableObj");
        $(".draggableObj").draggable(ddf.dragOption);
      },
    },
    delete: {name: "マップマスクの削除",
      callback: function(itemKey, opt, rootMenu, originalEvent) {
        ddf.removeCharacter(opt.$trigger.attr("id"), true);
        character = ddf.characters[opt.$trigger.attr("id")];
        if(character){
          ddf.safeDragDestoroy();
          character.obj && character.obj.remove();
          ddf.characters[opt.$trigger.attr("id")] = null;
          $(".draggableObj").draggable(ddf.dragOption);
        }
      },
    }
  }
});

$.contextMenu({
  selector: '.mapMaskFrame:not(.draggableObj)',
  items: {
    delete: {name: "マップマスクの削除",
      callback: function(itemKey, opt, rootMenu, originalEvent) {
        ddf.removeCharacter(opt.$trigger.attr("id"), true);
        character = ddf.characters[opt.$trigger.attr("id")];
        if(character){
          ddf.safeDragDestoroy();
          character.obj && character.obj.remove();
          ddf.characters[opt.$trigger.attr("id")] = null;
          $(".draggableObj").draggable(ddf.dragOption);
        }
      }
    }
  }
});
},{}],12:[function(require,module,exports){
$.contextMenu({
  zIndex: 150,
  selector: '#list_memo > div',
  items: {
    edit: {name: "共有メモの変更",
      callback: function(itemKey, opt, rootMenu, originalEvent) {
        ddf.cmd.openMemo(opt.$trigger.attr("id"));
      },
    },
    delete: {name: "共有メモの削除",
      callback: function(itemKey, opt, rootMenu, originalEvent) {
        ddf.removeCharacter(opt.$trigger.attr("id"), true);
        character = ddf.characters[opt.$trigger.attr("id")];
        if(character){
          ddf.safeDragDestoroy();
          character.obj && character.obj.remove();
          ddf.characters[opt.$trigger.attr("id")] = null;
          $(".draggableObj").draggable(ddf.dragOption);
        }
      },
    }
  }
});

},{}],13:[function(require,module,exports){
ddf.cmd = {};
chatlog = [];
var version = require('../../package.json').version;

var screenshot = require('./screenshot.js').generate;
var lang = "Japanese";

require("./.config.json");
ddf.base_url = ddf.config.base_url;

require("./contextMenu/.loading.js");
require("./window/.loading.js");
require("./room_menu.js");

window_focus = true;
running = false;
window.onblur = function() { window_focus = false; }
window.onfocus = function() { window_focus = true; }

frame = 0;
function titleAnimation(){
  list = "─／｜＼";
  if(window_focus){
    document.title = "どどんとふ";
    running = false;
  }else{
    frame = (frame + 1) % 4;
    document.title = list[frame] + " どどんとふ";
    setTimeout(titleAnimation, 300);
  }
}



window.addEventListener('popstate', (e) =>  {
  console.log(e);
});
var click = {x:0,y:0};

var roominfos = [];

var pageBuffer, diceRollBuffer, context;

function playSound(buffer) {
  if(ddf.roomState.playSound){
    var source = context.createBufferSource(); // creates a sound source
    source.buffer = buffer;                    // tell the source which sound to play
    source.connect(context.destination);       // connect the source to the context's destination (the speakers)
    source.start(0);                           // play the source now
  }                                           // note: on older systems, may have to use deprecated noteOn(time);
}

$(() => {
  window.AudioContext = window.AudioContext||window.webkitAudioContext;
  context = new AudioContext();
  var request = new XMLHttpRequest();
  request.open('GET', "sound/page.mp3", true);
  request.responseType = 'arraybuffer';
  request.onload = function() {
    context.decodeAudioData(request.response, function(buffer) {
      pageBuffer = buffer;
    });
  }
  request.send();
  var request2 = new XMLHttpRequest();
  request2.open('GET', "sound/diceRoll.mp3", true);
  request2.responseType = 'arraybuffer';
  request2.onload = function() {
    context.decodeAudioData(request2.response, function(buffer) {
      diceRollBuffer = buffer;
    });
  }
  request2.send();
  
  ddf.dragOption = {
    start: (event) =>  {
        click.x = event.clientX - parseInt($(event.target).css("marginLeft")) / 2;
        click.y = event.clientY - parseInt($(event.target).css("marginTop")) / 2;
    },
    drag: (event, ui) =>  {
      // This is the parameter for scale()
      var zoom = ddf.roomState.zoom;

      var original = ui.originalPosition;

      // jQuery will simply use the same object we alter here
      ui.position = {
          left: (event.clientX - click.x + original.left) / zoom,
          top:  (event.clientY - click.y + original.top ) / zoom
      };
      if(ddf.roomState.viewStateInfo.isSnapMovablePiece){
        if(ddf.roomState.mapData.isAlternately && ddf.roomState.mapData.gridInterval % 2 == 1){
          if((Math.floor(ui.position.top / 50 / ddf.roomState.mapData.gridInterval) & 1)){
            ui.position = {
                left: ((Math.floor(ui.position.left / 25) | 1) ^ 1) * 25,
                top: Math.floor(ui.position.top / 50) * 50
            };
          }else{
            ui.position = {
                left: (Math.floor(ui.position.left / 25) | 1) * 25,
                top: Math.floor(ui.position.top / 50) * 50
            };
          }
        }else{
          ui.position = {
              left: Math.floor(ui.position.left / 50) * 50,
              top: Math.floor(ui.position.top / 50) * 50
          };
        }
      }
    },
    stop: (event, ui) => {
      character = ddf.characters[ui.helper.attr("id")];
      if(character){
        data = character.data;
        data.x = ui.position.left / 50;
        data.y = ui.position.top / 50;
        ddf.moveCharacter(data.imgId, data.x, data.y);
      }
        console.log(ui);
    }
  };


  /*共通コンポーネント向け*/
  $(".draggable").draggable({
    cancel: ".dragprev, .draggableObj",
    stack: ".draggable"
  });
  $(".draggabletail").draggable({
    cancel: ".dragprev, .draggableObj"
  });

  $(document).on('mouseover', ".mapMaskFrame.draggableObj", (e) => {
    $(".mapMaskFrame.draggableObj").css('zIndex', 35);
    $(e.currentTarget).css('zIndex', 36);
  });
  $(document).on('mouseover', ".magicRangeFrame", (e) => {
    $(".magicRangeFrame").css('zIndex', 40);
    $(e.currentTarget).css('zIndex', 41);
  });
  $(document).on('mouseover', ".mapMarkerFrame", (e) => {
    $(".mapMarkerFrame").css('zIndex', 45);
    $(e.currentTarget).css('zIndex', 46);
  });
  $(document).on('mouseover', ".cardFrame", (e) => {
    $(".cardFrame").css('zIndex', 50);
    $(e.currentTarget).css('zIndex', 51);
  });
  $(document).on('mouseover', ".characterFrame:not(.isHide)", (e) => {
    $(".characterFrame:not(.isHide)").css('zIndex', 55);
    $(e.currentTarget).css('zIndex', 56);
  });
  $(document).on('mouseover', ".chitFrame", (e) => {
    $(".chitFrame").css('zIndex', 60);
    $(e.currentTarget).css('zIndex', 61);
  });
  
  $(".resizable").resizable({
    ghost: true,
    handles: 'n, e, s, w, ne, se, sw, nw'
  });
  $('.loader-inner').loaders();
  $(document).on('click', "#diceResult *", (e) => {
    $("#diceResult").empty();
  });
  $(document).on('click', "#characterCutIn img", (e) => {
    $("#characterCutIn").empty();
  });
  
  /*ページ移動の停止処理*/
  window.onbeforeunload = (e) =>  {
    e.returnValue = '他のページに移動しようとしています。\n移動しますか？';
  };
  
  /*エントリーポイント*/
  ddf.userState.room = -1;
  ddf.userState.own = "\t"+ddf.util.getUniqueId();
  getLoginInfo();
  
  /*待合室コマンド*/
  $("#btn_version").on('click', (e) => {
    $("#version_DodontoF").text(ddf.info.version);
    $("#version_ddfjs").text(ddf.version);
    $("#version_ddfcli").text(version);
    $("#window_version").show().css("zIndex", 151);
    $(".draggable:not(#window_version)").css("zIndex", 150);
  });
  
  $("#version_close").on('click', (e) => {
    $("#window_version").hide();    
  });
  
  $("#btn_loginNumber").on('click', (e) => {
    $("#window_loginNumber").show().css("zIndex", 151);
    $(".draggable:not(#window_loginNumber)").css("zIndex", 150);
  });
  $("#window_loginNumber .btn").on('click', (e) =>  {
    $("#window_loginNumber").hide();
  });
  
  $("#btn_manual").on('click', (e) => {
    window.open(ddf.base_url + "README.html");
  });
  
  $("#btn_removePlayRoom").on('click', (e) => {
    removePlayRoom(parseInt($("#playRoomNo").val().trim()));
  });
  

  $("#btn_site").on('click', () => {
    window.open("http://www.dodontof.com/");
  });
  
  $("#btn_createPlayRoom").on('click', (e) => {
    ddf.userState.room = -1;
    $("#window_createPlayRoom").show().css("zIndex", 151);
    $(".draggable:not(#window_createPlayRoom)").css("zIndex", 150);
  });
  $("#createPlayRoom_create").on('click', (e) => {
    createPlayRoom();
  });
  $("#createPlayRoom_close").on('click', (e) => {
    $("#window_createPlayRoom").hide();
  });

  $("#btn_login").on('click', (e) => {
    checkRoomStatus(parseInt($("#playRoomNo").val()));
  });

  $("#playRoomInfos table").tablesorter();

  var mousewheelevent = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
  $("#mapSurface").on(mousewheelevent,(e) => {
      e.preventDefault();
      var delta = e.originalEvent.deltaY ? -(e.originalEvent.deltaY) : e.originalEvent.wheelDelta ? e.originalEvent.wheelDelta : -(e.originalEvent.detail);
      if (delta < 0){
        setZoom(-0.1);
      } else {
        setZoom(0.1);
      }
  });
  
});

ddf.safeDragDestoroy = () => {
  try{
    $(".draggableObj").draggable("destroy");
  }catch(e){}
}

function setZoom(amount, relative = true){
  if(relative){
    ddf.roomState.zoom += amount;
  }else{
    ddf.roomState.zoom = amount;
  }
  ddf.roomState.zoom < 0.1 && (ddf.roomState.zoom = 0.1);
  ddf.roomState.zoom > 3.0 && (ddf.roomState.zoom = 3.0);
  $("#map").css("transform", "scale("+ddf.roomState.zoom+")");
}

function getDiceBotInfos(){
  return ddf.getDiceBotInfos().then((r)=>{
    ddf.patterns = {};
    ddf.info.diceBotInfos = r;
  });
}

function getLoginInfo(){
  return ddf.getLoginInfo().then((r) => {
    ddf.info = r;
    $("#loginMessage").html(ddf.info.loginMessage);
    total = 0;
    str = "";
    for(item of ddf.info.loginUserCountList){
      total += item[1];
      str += "No."+item[0]+"："+item[1]+"人<br>";
    }
    $("#window_loginNumber .body").html(str);
    $("#btn_loginNumber").text("現状："+ddf.info.loginUserCountList.length+"／上限："+ddf.info.limitLoginCount+"人");
    for(item of ddf.info.diceBotInfos){
      $("#playRoomGameType").append($('<option value="'+item.gameType+'">'+item.name+'</option>'));
    }
    ddf.cmd.getPlayRoomInfo();
    return r;
  });
}

ddf.cmd.getPlayRoomInfo = () => {
  promises = [];
  for(i = 0;i * ddf.info.playRoomGetRangeMax < ddf.info.playRoomMaxNumber;i++){
    promises.push(
      ddf.getPlayRoomInfo(i * ddf.info.playRoomGetRangeMax, ddf.info.playRoomGetRangeMax * (i+1) - 1 > ddf.info.playRoomMaxNumber ? ddf.info.playRoomMaxNumber : ddf.info.playRoomGetRangeMax * (i+1) - 1)
    );
  }
  callback = (r) => {
    roominfo = r;
    for(key in roominfo.playRoomStates){
      room = roominfo.playRoomStates[key];
      roominfos[parseInt(room.index.trim())] = room;
      
      var row = "<tr>";
      row += `<td>${room.index}</td>`
      row += `<td>${encode(room.playRoomName)}</td>`
      row += `<td>${encode(ddf.util.getDiceBotName(room.gameType))}</td>`
      row += `<td>${room.loginUsers.length}</td>`
      row += `<td>${room.passwordLockState?"有り":"--"}</td>`;
      row += `<td>${room.canVisit?"可":"--"}</td>`;
      row += `<td>${room.lastUpdateTime?room.lastUpdateTime:""}</td>`;
      row += "<td></td></tr>";
      tr = $(row);
      button = $("<button>削除</button>");
      if(room.lastUpdateTime){
        button.on('click', ((roomNumber) => {
          return (e) => {
            e.stopPropagation && e.stopPropagation();
            removePlayRoom(roomNumber)
          };
        })(parseInt(room.index.trim()) ));
      }else{
        button.prop("disabled", true);
      }      
      tr.children("td:last").append(button);
      $("#playRoomInfos tbody").append(tr);
      tr.on('dblclick', ((roomNumber) => {return (e) => {
        checkRoomStatus(roomNumber);
      }})(parseInt(room.index)));
      tr.on('click', ((roomNumber) => {return (e) => {
        $("#playRoomNo").val(roomNumber);
      }})(parseInt(room.index)));
    }
    $("#playRoomInfos table").trigger( 'update');
    return r;
  };

  promises.reduce((current, next) =>  {
    var p = current.then((v) =>  {
      return next;
    });
    p.then(callback);
    return p;
  }, Promise.resolve());
  
    $("#loading").hide();
};

function createPlayRoom(){
  ddf.createPlayRoom(
    ddf.userState.room,
    $("#playRoomName").val(),
    $("#playRoomPassword").val(),
    $("#playRoomGameType").val(),
    true,
    false,
    ["雑談"],
    {
      isCardPickUpVisible:false,
      isChatPaletteVisible:false,
      isSnapMovablePiece:true,
      isCardHandleLogVisible:true,
      isCounterRemoconVisible:false,
      isStandingGraphicVisible:true,
      isRotateMarkerVisible:true,
      isDiceVisible:true,
      isAdjustImageSize:true,
      isChatVisible:true,
      isGridVisible:true,
      isInitiativeListVisible:true,
      isPositionVisible:true,
      isCutInVisible:true,
      isResourceWindowVisible:false
    },
    ""
  ).then((r) => {
    if(r.resultText == "OK"){
      ddf.getPlayRoomInfo(r.playRoomIndex, r.playRoomIndex).then(
        ((roomNumber) => {
          return (r) => {
            roominfos[roomNumber] = r.playRoomStates[0];
            checkRoomStatus(roomNumber);
          };
        })(r.playRoomIndex)
      );

    }else{
    }
  });
}

function checkRoomStatus(roomNumber, password = null){
  room = roominfos[roomNumber];
  if(room){
    if(room.lastUpdateTime==""){
    /*ルーム未作成*/
      ddf.userState.room = roomNumber;
      $("#window_createPlayRoom").show().css("zIndex", 151);
      $(".draggable:not(#window_createPlayRoom)").css("zIndex", 150);
    }else if(room.passwordLockState && password == null){
    /*パスワード付きルーム1回目*/
    }else{
    /*ログイン*/
      return ddf.checkRoomStatus(roomNumber, password).then((r) => {
        roominfo=r;
        if(roominfo.isRoomExist){
          ddf.userState.room = roominfo.roomNumber;
          ddf.userState.name = $("#login_name").val();
          ddf.userState.color = "000000";
          ddf.sendChatMessage(0, "どどんとふ\t", "「"+ddf.userState.name+"」がログインしました。（htmlddf "+version+"）", "00aa00", true);
          $("#main").hide();
          history.pushState({roomNumber: roomNumber}, "room="+roomNumber, "index.html?room="+roomNumber);
          $("#main2").show();
          $("#chatname").val(ddf.userState.name);
          ddf.userState.room = roominfo.roomNumber;
          ddf.userState.lastUpdateTimes = {
            effects: 0,
            time: 0,
            map: 0,
            chatMessageDataLog: 0,
            recordIndex: 0,
            characters: 0,
            playRoomInfo: 0,
            record: 0
          };
          getDiceBotInfos();
          ddf.characters = [];
          ddf.roomState = {};
          ddf.roomState.roomNumber = roomNumber;
          ddf.roomState.zoom = 1;
          ddf.roomState.roundTimeData = {};
          ddf.roomState.ini_characters = {};
          ddf.roomState.roundTimeData.counterNames = [];
          ddf.userState.rIndex = 0;
          var count = 0;
          ddf.roomState.unread = [];
          ddf.roomState.effects = [];
          ddf.roomState.playSound = true;
          ddf.roomState.chatChannelNames = roominfo.chatChannelNames;
          for(tab of roominfo.chatChannelNames){
            ddf.roomState.unread.push(0);
            var obj = $(`<p>${encode(tab)}/<span class="tab_label">0</span></p>`);
            obj.on("click", ((index) => {
              return (e) => {
                if(!$(e.currentTarget).hasClass("active")){
                  setChatTab(index)
                }
              }
            })(count++));
            $("#tab").append(obj);
            $("#log").append($("<div><p></p></div>"));
          }
          for(item of ddf.info.diceBotInfos){
            if(/^[^:]*$/.test(item.gameType) && item.gameType != "BaseDiceBot"){
              $("#dicebot").append($(`<option value="${encode(item.gameType)}">${encode(item.name)}</option>`));
            }
          }
          setChatTab("0");
          refresh();
        }
      });
    }
  }
};

function removePlayRoom(roomNumber, password = null){
  room = roominfos[roomNumber];
  if(room && room.lastUpdateTime){
    if(room.passwordLockState && password == null){
    
    }else{
      body = `No.${room.index}：${room.playRoomName}\nを削除しますか？`;
      if(password != null || confirm(body)){
        ddf.removePlayRoom(roomNumber, false, password);
        $("#playRoomInfos tbody").empty();
        ddf.cmd.getPlayRoomInfo();
      }
    }
  }
}

function setChatTab(index){
  ddf.userState.channel = index;
  $("#tab p.active, #log div.active").removeClass('active');
  $(`#tab p:eq(${index}), #log div:eq(${index})`).addClass('active');
  ddf.roomState.unread[index] = 0;
  $(`#tab p:eq(${index}) span`).text(0);
}

function refresh(){
  ddf.refresh().then((r) => {
    refreshData = r;
    //console.log(refreshData);
    refreshData.lastUpdateTimes && (ddf.userState.lastUpdateTimes = refreshData.lastUpdateTimes);
    if(refreshData.viewStateInfo){
      ddf.roomState.viewStateInfo = refreshData.viewStateInfo;
    }
    if(refreshData.gameType){
      if($("#dicebot").children(`[value=${refreshData.gameType}]`).length==1){
        $("#dicebot").val($(refreshData.gameType));
      }else{
        $("#dicebot").append($(`<option value="${encode(refreshData.gameType)}">${encode(refreshData.gameType)}</option>`));
        $("#dicebot").val(refreshData.gameType);
      }
    }
    if(refreshData.mapData) {
      ddf.cmd.refresh_parseMapData(refreshData);
    }
    if(refreshData.characters){
      refresh_parseCharacters(refreshData);
    }
    if(refreshData.roundTimeData){
      refresh_parseRoundTimeData(refreshData);
    }
    if(refreshData.gameType){
      ddf.roomState.gameType = refreshData.gameType;
    }
    if(refreshData.viewStateInfo){
      refresh_parseViewStateInfo(refreshData);
    }
    if(refreshData.effects){
      refresh_parseEffects(refreshData);
    }
    if(refreshData.chatChannelNames && !refreshData.isFirstChatRefresh){
      $(`#tab > p:gt(${refreshData.chatChannelNames.length - 1}),#log > div:gt(${refreshData.chatChannelNames.length - 1})`).remove();
      ddf.roomState.unread.splice(refreshData.chatChannelNames.length);
      for(i = 0;i < refreshData.chatChannelNames.length;i++){
        if(ddf.roomState.chatChannelNames.length <= i){
          ddf.roomState.unread.push(0);
          var obj = $(`<p>${encode(tab)}/<span class="tab_label">0</span></p>`);
          obj.on("click", ((index) => {
            return (e) => {
              if(!$(e.currentTarget).hasClass("active")){
                setChatTab(index)
              }
            }
          })(i));
          $("#tab").append(obj);
          $("#log").append($("<div><p></p></div>"));
        }else{
          $(`#tab:eq(${refreshData.chatChannelNames - 1})`).html(`${encode(refreshData.chatChannelNames[i])}/<span class="tab_label">${ddf.roomState.unread[i]}</span>`);
        }
      }
      if($("#tab .active").length == 0){
        setChatTab(0);
      }
      ddf.roomState.chatChannelNames = refreshData.chatChannelNames;
    }
    if(refreshData.chatMessageDataLog){
      refresh_parseChatMessageDataLog(refreshData);
    }
    if(refreshData.record) {
      ddf.cmd.refresh_parseRecordData(refreshData);
    }
    if(refreshData.gameType){
      $("#dicebot").val(refreshData.gameType);
    }
    if(refreshData.loginUserInfo){
      $("#btn_member").text(`ルームNo.${ddf.roomState.roomNumber}：${refreshData.loginUserInfo.length}名`);
    }
    r = refreshData = null;
    if(ddf.userState.room != -1){
      setTimeout(refresh, 1000);
    }
  });
}

function refresh_parseEffects(refreshData){
  ddf.roomState.effects = refreshData.effects;
}

function refresh_parseChatMessageDataLog(refreshData){
  let prevheight = $("#log .active")[0].scrollHeight - $("#log .active").height();
  lastRandResult = false;
  lastCutIn = false;
  sound = false;
  for(item of refreshData.chatMessageDataLog){
    if(item[0] <= ddf.roomState.lastMessageTime){continue;}
    sound = true;
    if(!window_focus && !running){
      titleAnimation();
    }
    ddf.roomState.lastMessageTime = item[0];
    if(matches = /^(.*)@([^@]+)(@([^@]+))?$/.exec(item[1].message)){
      item[1].message = matches[1];
      item[1].senderName = matches[2];
      item[1].state = matches[4];
    }else if(matches = /^(.*)\t(.*)$/.exec(item[1].senderName)){
      item[1].senderName = matches[1];
      item[1].state = matches[2];
    }
    item[1].uniqueId != 'dummy' && (lastCutIn = [item[1].senderName, item[1].state]);
    if(matches = /^###CutInCommand:([a-zA-Z]+)###(.+)$/.exec(item[1].message)){
      switch(matches[1]){
        case "getDiceBotInfos":
            if(!refreshData.isFirstChatRefresh){
              getDiceBotInfos();
            }
          continue;
          break;
        case "rollVisualDice":
          param = JSON.parse(matches[2]);
          $(`#log div:eq(${item[1].channel})`).append($(`<p style="color: #${item[1].color}">${encode(item[1].senderName)}:${encode(param.chatMessage).replace(/\n/, "<br>")}</p>`));
          chatlog.push([item[1].channel, ddf.roomState.chatChannelNames[item[1].channel], item[0],"#"+item[1].color,item[1].senderName, param.chatMessage]);
          $(`#log div:eq(${item[1].channel})`).hasClass("active") || ddf.roomState.unread[item[1].channel]++;
          lastRandResult = [param.chatMessage, param.randResults];
          continue;
          break;
      }
    }else if(matches = /^###CutInMovie###(.+)$/.exec(item[1].message)){
      param = JSON.parse(matches[1]);
      $(`#log div:eq(${item[1].channel})`).append($(`<p style="color: #${item[1].color}">${encode(item[1].senderName)}:【${encode(param.message)}】</p>`));
      chatlog.push([item[1].channel, ddf.roomState.chatChannelNames[item[1].channel], item[0],"#"+item[1].color,item[1].senderName, param.chatMessage]);
      $(`#log div:eq(${item[1].channel})`).hasClass("active") || ddf.roomState.unread[item[1].channel]++;
    }else{
      $(`#log div:eq(${item[1].channel})`).append($(`<p style="color: #${item[1].color}">${encode(item[1].senderName)}:${encode(item[1].message).replace(/\n/, "<br>")}</p>`));
      chatlog.push([item[1].channel, ddf.roomState.chatChannelNames[item[1].channel], item[0],"#"+item[1].color,item[1].senderName, item[1].message]);
      $(`#log div:eq(${item[1].channel})`).hasClass("active") || ddf.roomState.unread[item[1].channel]++;
    }
  }
  if(refreshData.isFirstChatRefresh){
    for(div of $("#log").children("div")){
      div.scrollTop = $(div).children(":last").offset().top;
    }
    ddf.roomState.unread = ddf.roomState.unread.map(()=>{return 0;});
  }else{
    if(prevheight < $("#log .active").scrollTop()){
      $("#log .active").scrollTop($("#log .active")[0].scrollHeight);
    }
    for(index in $("#tab").children("p")){
      $("#tab").children("p").eq(index).children("span").text(ddf.roomState.unread[index]);
    }
  }
  if(lastCutIn){
    let found = false;
    if(!found){
      for(item of ddf.roomState.effects){
        if(item.type = "standingGraphicInfos"){
          if(lastCutIn[0] == item.name && lastCutIn[1] == item.state){
            $("#characterCutIn").empty();
            $("#characterCutIn").append($(`<img src="${ddf.base_url + item.source}" class="pos${item.leftIndex} ${item.motion} ${item.mirrored?"mirrored":""}">`));
          }
        }
      }
    }
    if(!found){
      for(id in ddf.characters){
        character = ddf.characters[id].data;
        if(character.name == lastCutIn[0]){
            $("#characterCutIn").empty();
          $("#characterCutIn").append($(`<img src="${ddf.base_url + character.imageName}" class="pos1">`));
          found = true;
          break;
        }
      }
    }
  }
  if(lastRandResult){
    playSound(diceRollBuffer);
    $("#diceResult").empty();
    for(item of lastRandResult[1]){
      if([4,6,8,10,12,20].includes(item[1])){
        $("#diceResult").append($(`<img src="${ddf.base_url}image/diceImage/${item[1]}_dice/${item[1]}_dice[${item[0]}].png" alt="${item[0]}">`));
      }else{
        $("#diceResult").append($(`<img src="${ddf.base_url}image/diceImage/unknown.png" alt="${item[0]}">`));
      }
    }
    total = /\s([^\s]+)$/.exec(lastRandResult[0])[1];
    $("#diceResult").append($(`<div class="total">${encode(total)}</div>`));
  }else if(sound){
    playSound(pageBuffer);
  }
}

function refresh_parseViewStateInfo(refreshData){
  for(key in refreshData.viewStateInfo){
    switch(key){
      case "isSnapMovablePiece":
        if(refreshData.viewStateInfo[key]){
          $("#btn_gridguide").addClass("checked");
        }
        break;
      case "isAdjustImageSize":
        if(refreshData.viewStateInfo[key]){
          $("#btn_adjustcharacter").addClass("checked");
          $("#characterCutIn").addClass("adjust");
        }
        break;
      case "isCardHandleLogVisible":
        if(refreshData.viewStateInfo[key]){
          $("#btn_cardlog").addClass("checked");
        }
        break;
      case "isCardPickUpVisible":
        if(refreshData.viewStateInfo[key]){
          $("#btn_cardpickup").addClass("checked");
        }
        break;
      case "isCutInVisible":
        if(refreshData.viewStateInfo[key]){
          $("#btn_displaycutin").addClass("checked");
        }
        break;
      case "isGridVisible":
        if(refreshData.viewStateInfo[key]){
          $("#btn_displaygridline").addClass("checked");
        }
        break;
      case "isPositionVisible":
        if(refreshData.viewStateInfo[key]){
          $("#btn_displaygridnum").addClass("checked");
        }
        break;
      case "isStandingGraphicVisible":
        if(refreshData.viewStateInfo[key]){
          $("#btn_displaycharacter").addClass("checked");

          $("#characterCutIn").show();
        }else{
          $("#characterCutIn").hide();
        }
        break;
      case "isRotateMarkerVisible":
        if(refreshData.viewStateInfo[key]){
          $("#btn_rotate").addClass("checked");
        }
        break;
      case "isChatVisible":
        if(refreshData.viewStateInfo[key]){
          $("#btn_displaychat").addClass("checked");
          
          $("#window_chat .inner").show();
        }else{
          $("#window_chat .inner").hide();
        }
        break;
      case "isDiceVisible":
        if(refreshData.viewStateInfo[key]){
          $("#btn_displaydice").addClass("checked");
          
          $("#diceResult").show();
        }else{
          $("#diceResult").hide();
        }
        break;
      case "isInitiativeListVisible":
        if(refreshData.viewStateInfo[key]){
          $("#btn_displayinitiative").addClass("checked");
          
          $("#initiative").show();
        }
        break;
      case "isResourceWindowVisible":
        if(refreshData.viewStateInfo[key]){
          $("#btn_displayresource").addClass("checked");
          
          //$("#resource").show();
          /*TODO*/
        }
        break;
      case "isChatPaletteVisible":
        if(refreshData.viewStateInfo[key]){
          $("#btn_displaychatpalette").addClass("checked");
          
          //$("#chatpalette").show();
          /*TODO*/
        }
        break;
      case "isCounterRemoconVisible":
        if(refreshData.viewStateInfo[key]){
          $("#btn_displaycounter").addClass("checked");
          
          //$("#remocon").show();
          /*TODO*/
        }
        break;
    }
  }
}

ddf.cmd.refresh_parseRecordData = (refreshData) => {
  ddf.safeDragDestoroy();
  for(record of refreshData.record){
    switch(record[1]){
    case "addCharacter":
    case "changeCharacter":
      data = record[2][0];
      character = ddf.characters[data.imgId];
      if(!character){
        return refresh_parseCharacters({characters: [data]});
      }
      obj = character.obj;
      switch(data.type){
        case "LogHorizonRange":
          obj.css({
            clipPath: `polygon(0 ${data.range*50+50}px, 0 ${data.range*50}px,${data.range*50}px 0,${data.range*50+50}px 0,${data.range*100+50}px ${data.range*50}px, ${data.range*100+50}px ${data.range*50+50}px, ${data.range*50+50}px ${data.range*100+50}px, ${data.range*50}px ${data.range*100+50}px)`,
            left: data.x * 50,
            top: data.y * 50,
            marginLeft: (data.range * -50) * ddf.roomState.mapData.gridInterval,
            marginTop:  (data.range * -50) * ddf.roomState.mapData.gridInterval,
            width: (data.range * 100 + 50) * ddf.roomState.mapData.gridInterval,
            height: (data.range * 100 + 50) * ddf.roomState.mapData.gridInterval,
          });
          obj.children("object").attr("data", `img/rangeLH.svg?size=${data.range}&color=${data.color}`);
          obj.children("object").css({
            width: (data.range * 100 + 50) * ddf.roomState.mapData.gridInterval,
            height: (data.range * 100 + 50) * ddf.roomState.mapData.gridInterval
          });
          break;
        case "magicRangeMarkerDD4th":
          obj.animate({
            left: data.x * 50,
            top: data.y * 50
          }, 300);
          if(!data.isHide){
            ddf.roomState.ini_characters[character.imgId] = ddf.characters[character.imgId];
          }else{
            ddf.roomState.ini_characters[character.imgId] = null;
          }
          obj.css({
            backgroundColor: "rgb("+[data.color / 65536 & 0xFF, data.color / 256 & 0xFF, data.color & 0xFF].join()+")"
          });
          switch(data.rangeType){
            case "closeBurstDD4th":
              obj.addClass("rangeCenterMarker");
              obj.css({
                marginLeft: (data.feets * -10) * ddf.roomState.mapData.gridInterval,
                marginTop:  (data.feets * -10) * ddf.roomState.mapData.gridInterval,
                width: (data.feets * 20 + 50) * ddf.roomState.mapData.gridInterval,
                height: (data.feets * 20 + 50) * ddf.roomState.mapData.gridInterval,
              });
              break;
            case "blastDD4th":
              obj.removeClass("rangeCenterMarker");
              obj.css({
                marginLeft: 0,
                marginTop:  0,
                width: (data.feets * 10) * ddf.roomState.mapData.gridInterval,
                height: (data.feets * 10) * ddf.roomState.mapData.gridInterval,
              });
          }
          break;
      case "mapMask":
        obj.children(".name").text(data.name);
        obj.animate({
          left: data.x * 50,
          top: data.y * 50
        }, 300);
        colors = [data.color / 65536 & 0xFF, data.color / 256 & 0xFF, data.color & 0xFF];
        sum = 255;
        refColor = [sum - colors[0], sum - colors[1], sum - colors[2]];
        obj.css({
          left: data.x * 50,
          top: data.y * 50,
          width: data.width * 50,
          height: data.height * 50,
          opacity: data.alpha,
          backgroundColor: "rgb("+colors+")"
        });
        obj.children(".name").css({
          color: "rgb("+refColor+")"
        });
        if(data.draggable){
          obj.addClass("draggableObj");
        }else{
          obj.removeClass("draggableObj");
        }
        break;
      case "characterData":
        obj.animate({
          left: data.x * 50,
          top: data.y * 50
        }, 300);
        obj.css({
          width: data.size * 50,
          height: data.size * 50
        });
        if(!data.isHide){
          ddf.roomState.ini_characters[character.imgId] = ddf.characters[character.imgId];
          obj.removeClass("isHide");
        }else{
          ddf.roomState.ini_characters[character.imgId] = null;
          obj.addClass("isHide");
        }
        obj.children(".inner").css({
          transform: "rotateZ("+data.rotation+"deg) "+(data.mirrored?" rotateY(180deg)":""),
          backgroundImage: "url("+ddf.base_url+data.imageName+")"
        });
        obj.children(".name").text(data.name);
        obj.children(".dogtag").text(data.dogTag);
        break;
      case "Memo":
        title = data.message.split("\r")[0];
        ar = data.message.split(/\t\|\t/);
        if(ar.length > 1){
          body = ar.map((v)=>{return `[${v.split("\r")[0]}]`}).join("<br>")
        }else{
          body = data.message.replace("\r", "<br>");
        }
        obj.html(`<span>${encode(title)}</span><img src="${ddf.base_url}image/memo2.png"><div>${encode(body)}</div>`);
      }
      character.data = data;
      break;
    case "removeCharacter":
      data = record[2][0];
      character = ddf.characters[data];
      if(character){
        character.obj && character.obj.remove();
        character.row && character.row.remove();
        ddf.characters[data[0]] = null;
      }
    }
  }
  $(".draggableObj").draggable(ddf.dragOption);
};

function refresh_parseCharacters(refreshData){
  for(character of refreshData.characters){
    switch(character.type){
    case "Card":
    case "CardTrushMount":
    case "CardMount":
      break;
    case "LogHorizonRange":
      obj = $(`<div class="magicRangeFrame draggableObj rangeCenterMarker" id="${character.imgId}"><object type="image/svg+xml" data="img/rangeLH.svg?size=${character.range}&color=${character.color}"></div>`);
      $("#mapSurface").append(obj);
      ddf.characters[character.imgId] = {
        obj: obj,
        data: character
      };
      obj.css({
        clipPath: `polygon(0 ${character.range*50+50}px, 0 ${character.range*50}px,${character.range*50}px 0,${character.range*50+50}px 0,${character.range*100+50}px ${character.range*50}px, ${character.range*100+50}px ${character.range*50+50}px, ${character.range*50+50}px ${character.range*100+50}px, ${character.range*50}px ${character.range*100+50}px)`,
        left: character.x * 50,
        top: character.y * 50,
        marginLeft: (character.range * -50) * ddf.roomState.mapData.gridInterval,
        marginTop:  (character.range * -50) * ddf.roomState.mapData.gridInterval,
        opacity: 0.5
      });
      obj.children("object").css({
        width: (character.range * 100 + 50) * ddf.roomState.mapData.gridInterval,
        height: (character.range * 100 + 50) * ddf.roomState.mapData.gridInterval
      });
      break;
    case "magicRangeMarkerDD4th":
      obj = $(`<div class="magicRangeFrame draggableObj" id="${character.imgId}"></div>`);
      $("#mapSurface").append(obj);
      ddf.characters[character.imgId] = {
        obj: obj,
        data: character
      };
      if(!character.isHide){
        ddf.roomState.ini_characters[character.imgId] = ddf.characters[character.imgId];
      }
      obj.css({
        left: character.x * 50,
        top: character.y * 50,
        opacity: 0.5,
        backgroundColor: "rgb("+[character.color / 65536 & 0xFF, character.color / 256 & 0xFF, character.color & 0xFF].join()+")"
      });
      switch(character.rangeType){
        case "closeBurstDD4th":
          obj.addClass("rangeCenterMarker");
          obj.css({
            marginLeft: (character.feets * -10) * ddf.roomState.mapData.gridInterval,
            marginTop:  (character.feets * -10) * ddf.roomState.mapData.gridInterval,
            width: (character.feets * 20 + 50) * ddf.roomState.mapData.gridInterval,
            height: (character.feets * 20 + 50) * ddf.roomState.mapData.gridInterval,
          });
          break;
        case "blastDD4th":
          obj.removeClass("rangeCenterMarker");
          obj.css({
            marginLeft: 0,
            marginTop:  0,
            width: (character.feets * 10) * ddf.roomState.mapData.gridInterval,
            height: (character.feets * 10) * ddf.roomState.mapData.gridInterval,
          });
      }
      break;
    case "mapMask":
      obj = $(`<div class="mapMaskFrame" id="${character.imgId}"></div>`);
      if(character.draggable){obj.addClass("draggableObj");}
      obj.append($(`<div class="name">${encode(character.name)}</div>`));
      ddf.characters[character.imgId] = {
        obj: obj,
        data: character
      };
      colors = [character.color / 65536 & 0xFF, character.color / 256 & 0xFF, character.color & 0xFF];
      sum = 255;
      refColor = [sum - colors[0], sum - colors[1], sum - colors[2]];
      obj.css({
        left: character.x * 50,
        top: character.y * 50,
        width: character.width * 50,
        height: character.height * 50,
        opacity: character.alpha,
        backgroundColor: "rgb("+colors+")"
      });
      obj.children(".name").css({
        color: "rgb("+refColor+")"
      });
      $("#mapSurface").append(obj);
      break;
    case "characterData":
      obj = $(`<div class="characterFrame draggableObj" id="${character.imgId}"></div>`);
      obj.append($(`<div class="inner"></div><div class="dogtag">${encode(character.dogTag)}</div><div class="name">${encode(character.name)}</div>`));
      ddf.characters[character.imgId] = {
        obj: obj,
        data: character
      };
      if(!character.isHide){
        ddf.roomState.ini_characters[character.imgId] = ddf.characters[character.imgId];
      }else{
        obj.addClass("isHide");
      }
      obj.css({
        left: character.x * 50,
        top: character.y * 50,
        width: character.size * 50,
        height: character.size * 50
      });
      obj.children(".inner").css({
        transform: "rotateZ("+character.rotation+"deg) "+(character.mirrored?" rotateY(180deg)":""),
        backgroundImage: "url("+ddf.base_url+character.imageName+")"
      });
              
      $("#mapSurface").append(obj);
      break;
    case "Memo":
      title = character.message.split("\r")[0];
      ar = character.message.split(/\t\|\t/);
      if(ar.length > 1){
        body = ar.map((v)=>{return `[${v.split("\r")[0]}]`}).join("<br>")
      }else{
        body = character.message.replace("\r", "<br>");
      }
      obj = $(`<div class="draggableObj" id="${character.imgId}"><span>${encode(title)}</span><img src="${ddf.base_url}image/memo2.png"><div>${encode(body)}</div></div>`);
      $("#list_memo").append(obj);
      ddf.characters[character.imgId] = {
        obj: obj,
        data: character
      };
      break;
    }
  }
  $(".draggableObj").draggable(ddf.dragOption);
}

ddf.cmd.refresh_parseMapData = (refreshData) => {
  ddf.roomState.mapData = refreshData.mapData;
  switch(refreshData.mapData.mapType){
    case "imageGraphic":
    $("#mapimg").attr("src", ddf.base_url + refreshData.mapData.imageSource)
    .css({
      width: refreshData.mapData.xMax * 50,
      height: refreshData.mapData.yMax * 50,
    });
    if(refreshData.mapData.mirrored){
      $("#mapimg").addClass("mirrored");
    }else{
      $("#mapimg").removeClass("mirrored");
    }
    $("#map")
    .css({
      width: refreshData.mapData.xMax * 50,
      height: refreshData.mapData.yMax * 50,
    });
    param = {
      x: refreshData.mapData.xMax,
      y: refreshData.mapData.yMax,
      border: ddf.roomState.viewStateInfo.isGridVisible,
      alt: refreshData.mapData.isAlternately,
      num: ddf.roomState.viewStateInfo.isPositionVisible,
      size: refreshData.mapData.gridInterval,
      color: "rgb("+[refreshData.mapData.gridColor / 65536 & 0xFF,refreshData.mapData.gridColor / 256 & 0xFF,refreshData.mapData.gridColor & 0xFF].join()+")",
      mapMarks: refreshData.mapData.mapMarks?refreshData.mapData.mapMarks.join("/"):"",
      mapMarksAlpha: refreshData.mapData.mapMarksAlpha!=null?refreshData.mapData.mapMarksAlpha:1
    };
    $("#mapGrid").attr("data", "img/grid.svg?"+$.map(param, (v,k) => {return k+"="+v;}).join("&"));
  }
  if(refreshData.mapData.drawsImage && refreshData.mapData.drawsImage != ""){
    $("#mapDraw").show();
    $("#mapDraw").attr("src", ddf.base_url + refreshData.mapData.drawsImage);
  }else{
    $("#mapDraw").hide();
  }
  if(refreshData.mapData.draws){
    $("#drawsPanel").attr("data", "img/draw.svg?width="+refreshData.mapData.xMax * 50+"&height=" + refreshData.mapData.yMax * 50 + "&list="+JSON.stringify(refreshData.mapData.draws));
  }else{
    $("#drawsPanel param").val("[]");
  }
  redraw = [];
  for(item in ddf.characters){
    if(ddf.characters[item].data.type == "magicRangeMarkerDD4th"){
      redraw.push([0, "changeCharacter", [ddf.characters[item].data], "dummy\t"]);
    }
  }
  ddf.cmd.refresh_parseRecordData({record: redraw});
};

function refresh_parseRoundTimeData(refreshData){
  if(JSON.stringify(refreshData.roundTimeData.counterNames) != JSON.stringify(ddf.roomState.roundTimeData.counterNames)){
    $("#initiative table thead tr").empty();
    $("#initiative table thead tr").append($("<th><p>順番</p></th>"));
    $("#initiative table thead tr").append($("<th><p>イニシアティブ</p></th>"));
    $("#initiative table thead tr").append($("<th><p>修正値</p></th>"));
    $("#initiative table thead tr").append($("<th><p>名前</p></th>"));
    for(counter of refreshData.roundTimeData.counterNames){
      $("#initiative table thead tr").append($(`<th><p>${encode(counter.replace(/^\*/, ""))}</p></th>`));
    }
    $("#initiative table thead tr").append($("<th><p>その他</p></th>"));
    
    $("#initiative table tbody").empty();
    ddf.roomState.ini_characters = ddf.util.hashSort(ddf.roomState.ini_characters, (obj) => {return obj.data.initiative});
    for(key in ddf.roomState.ini_characters){
      var character = ddf.roomState.ini_characters[key];
      var tmp = "<tr>";
      tmp+= `<td>${(character.data.initiative==refreshData.roundTimeData.initiative?"●":"")}</td>`;
      tmp+= `<td>${(character.data.initiative|0)}</td>`;
      tmp+= `<td>${(character.data.initiative*100 % 100)}</td>`;
      tmp+= `<td>${encode(character.data.name)}</td>`;
      for(counter of refreshData.roundTimeData.counterNames){
        character.data.counters == null && (character.data.counters = {});
        character.data.statusAlias == null && (character.data.statusAlias = {});
        character.data.counters[counter]==undefined && (character.data.counters[counter] = 0);
        if(/^\*/.test(counter)){
          tmp+= `<td>${(character.data.counters[counter]!=0?"●":"")}</td>`;
        }else{
          tmp+= `<td>${(character.data.counters[counter])}</td>`;
        }
      }
      tmp+= `<td>${encode(character.data.info)}</td>`;
      tmp+= "</tr>";
      character.row = $(tmp);
      $("#initiative table tbody").append(
        character.row
      );
    }
  }else{
      for(key in ddf.roomState.ini_characters){
        var character = ddf.roomState.ini_characters[key];
        character.row.children("td:eq(0)").text(character.data.initiative==refreshData.roundTimeData.initiative?"●":"");
      }
    }
  $("#round").text(refreshData.roundTimeData.round);
  $("#now_ini").text(refreshData.roundTimeData.initiative);

  ddf.roomState.roundTimeData = refreshData.roundTimeData;
}

ddf.cmd.sendChatMessage = (channel, senderName, state, gameType, message, color, isNeedResult = true) => {
  ddf.roomState.gameType = gameType;
  if(message.trim()==""){return false;}
  if(!(pattern = ddf.patterns[ddf.roomState.gameType])){
    dicebot = ddf.info.diceBotInfos.find((r) => {return r.gameType == ddf.roomState.gameType});
    pattern = [].concat(
      ddf.info.diceBotInfos.find((r) => {return r.gameType == "BaseDiceBot"}).prefixs,
      dicebot?dicebot.prefixs:[],
    ).map((r) => {return new RegExp("^((\\d+)\\s+)?(S?"+r+"[^\\s]*)", "i");});
    ddf.patterns[ddf.roomState.gameType] = pattern;
  }
  var match;
  if(!!pattern.find((r) => {return !!(match = r.exec(message));})){
    //DiceBotMessage
    ddf.userState.name = senderName;
    return ddf.sendDiceBotChatMessage(channel, senderName, state, match[2]?match[2]:0, match[3], color, ddf.roomState.gameType, isNeedResult);
  }else{
    //ChatMessage
    if(/^###CutInCommand:/.test(message)){
      message = "Wrong Message -> " + message;
    }
    ddf.userState.name = senderName;
    return ddf.sendChatMessage(channel, senderName + "\t"+ state, message, color);
  }
};

function initiativeNext(){
}
function initiativeBack(){
}
function initiativeReset(){
  return ddf.changeRoundTime();
}
},{"../../package.json":4,"./.config.json":5,"./contextMenu/.loading.js":7,"./room_menu.js":14,"./screenshot.js":15,"./window/.loading.js":16}],14:[function(require,module,exports){
$(() => {
  /*プレイルームメニュー*/
  $("#btn_save").on("click", (e) => {
  });
  $("#btn_load").on("click", (e) => {
  });
  $("#btn_saveall").on("click", (e) => {
  });
  $("#btn_loadall").on("click", (e) => {
  });
  /*$("#btn_savechatlog, #btn_saveChatLog2").on("click", (e) => {
  });*/
  $("#btn_startrecord").on("click", (e) => {
  });
  $("#btn_endrecord").on("click", (e) => {
  });
  $("#btn_cancelrecord").on("click", (e) => {
  });
  $("#btn_logout, #btn_logout2").on("click", (e) => {
    ddf.logout().then((r) => {
      ddf.userState.room = -1;
      location.href = "index.html"
    });
  });

  $("#btn_displaychat").on("click", (e) => {
    ddf.roomState.viewStateInfo.isChatVisible = !ddf.roomState.viewStateInfo.isChatVisible;
    $(e.currentTarget).toggleClass("checked");
    
    $("#window_chat .inner").toggle();
  });
  $("#btn_displaydice").on("click", (e) => {
    ddf.roomState.viewStateInfo.isDiceVisible = !ddf.roomState.viewStateInfo.isDiceVisible;
    $(e.currentTarget).toggleClass("checked");
    
    $("#diceResult").toggle();
  });
  $("#btn_displayinitiative").on("click", (e) => {
    ddf.roomState.viewStateInfo.isInitiativeListVisible = !ddf.roomState.viewStateInfo.isInitiativeListVisible;
    $(e.currentTarget).toggleClass("checked");
    $("#initiative").toggle();
  });
  $("#btn_displayresource").on("click", (e) => {
    ddf.roomState.viewStateInfo.isResourceWindowVisible = !ddf.roomState.viewStateInfo.isResourceWindowVisible;
    $(e.currentTarget).toggleClass("checked");
    
    //$("#resource").toggle();
    /*TODO*/
  });
  $("#btn_displaychatpalette").on("click", (e) => {
    ddf.roomState.viewStateInfo.isChatPaletteVisible = !ddf.roomState.viewStateInfo.isChatPaletteVisible;
    $(e.currentTarget).toggleClass("checked");
    
    //$("#chatpalette").toggle();
    /*TODO*/
  });
  $("#btn_displaycounter").on("click", (e) => {
    ddf.roomState.viewStateInfo.isCounterRemoconVisible = !ddf.roomState.viewStateInfo.isCounterRemoconVisible;
    $(e.currentTarget).toggleClass("checked");
    
    //$("#remocon").toggle();
    /*TODO*/
  });
  $("#btn_displaycharacter").on("click", (e) => {
    ddf.roomState.viewStateInfo.isCutInVisible = !ddf.roomState.viewStateInfo.isCutInVisible;
    $(e.currentTarget).toggleClass("checked");
    $("#characterCutIn").toggle();
  });
  $("#btn_displaycutin").on("click", (e) => {
    ddf.roomState.viewStateInfo.isStandingGraphicVisible = !ddf.roomState.viewStateInfo.isStandingGraphicVisible;
    $(e.currentTarget).toggleClass("checked");
  });
  $("#btn_displaygridnum").on("click", (e) => {
    ddf.roomState.viewStateInfo.isPositionVisible = !ddf.roomState.viewStateInfo.isPositionVisible;
    $(e.currentTarget).toggleClass("checked");
    ddf.cmd.refresh_parseMapData({mapData: ddf.roomState.mapData});
  });
  $("#btn_displaygridline").on("click", (e) => {
    ddf.roomState.viewStateInfo.isGridVisible = !ddf.roomState.viewStateInfo.isGridVisible;
    $(e.currentTarget).toggleClass("checked");
    ddf.cmd.refresh_parseMapData({mapData: ddf.roomState.mapData});
  });
  $("#btn_gridguide").on("click", (e) => {
    ddf.roomState.viewStateInfo.isSnapMovablePiece = !ddf.roomState.viewStateInfo.isSnapMovablePiece;
    $(e.currentTarget).toggleClass("checked");
  });
  $("#btn_adjustcharacter").on("click", (e) => {
    ddf.roomState.viewStateInfo.isAdjustImageSize = !ddf.roomState.viewStateInfo.isAdjustImageSize;
    $(e.currentTarget).toggleClass("checked");
    $("#characterCutIn").toggleClass("adjust");
  });
  $("#btn_chatfont").on("click", (e) => {
  });
  $("#btn_resetwindow").on("click", (e) => {
  });
  $("#btn_resetdisplay").on("click", (e) => {
  });

  /*$("#btn_addCharacter").on("click", (e) => {
  });*/
  $("#btn_ragedd3").on("click", (e) => {
  });
  /*$("#btn_rangedd4").on("click", (e) => {
  });*/
  /*$("#btn_rangelh").on("click", (e) => {
  });*/
  $("#btn_rangemg").on("click", (e) => {
  });
  $("#btn_magictimer").on("click", (e) => {
  });
  $("#btn_createchit").on("click", (e) => {
  });
  /*$("#btn_graveyard, #btn_graveyard2").on("click", (e) => {
  });*/
  $("#btn_waitroom").on("click", (e) => {
  });
  $("#btn_rotate").on("click", (e) => {
    ddf.roomState.viewStateInfo.isRotateMarkerVisible = !ddf.roomState.viewStateInfo.isRotateMarkerVisible;
    $(e.currentTarget).toggleClass("checked");
    
    /*TODO*/
  });

  $("#btn_cardpickup").on("click", (e) => {
    ddf.roomState.viewStateInfo.isCardPickUpVisible = !ddf.roomState.viewStateInfo.isCardPickUpVisible;
    $(e.currentTarget).toggleClass("checked");
  });
  $("#btn_cardlog").on("click", (e) => {
    ddf.roomState.viewStateInfo.isCardHandleLogVisible = !ddf.roomState.viewStateInfo.isCardHandleLogVisible;
    $(e.currentTarget).toggleClass("checked");
  });
  $("#btn_cardchange").on("click", (e) => {
  });
  $("#btn_cardreset").on("click", (e) => {
  });

  /*$("#btn_mapchange").on("click", (e) => {
  });*/
  $("#btn_maptile").on("click", (e) => {
  });
  /*$("#btn_mapmask").on("click", (e) => {
  });*/
  $("#btn_mapmodify").on("click", (e) => {
  });
  $("#btn_mapsave").on("click", (e) => {
    ddf.saveMap().then((r)=>{
      if(r.result == "OK"){
        a = $(`<a href="${ddf.base_url+r.saveFileName.replace("./", '')}" download="">.</a>`);
        $(document.body).append(a);
        a[0].click();
        a[0].remove();
      }
    });
  });
  $("#btn_mapchange").on("click", (e) => {
  });

  /*$("#btn_imageupload").on("click", (e) => {
  });*/
  $("#btn_camera").on("click", (e) => {
  });
  $("#btn_imagetagedit").on("click", (e) => {
  });
  /*$("#btn_imagedelete").on("click", (e) => {
  });*/

  var version = require('../../package.json').version;
  $("#btn_version2").on("click", (e) => {
    $("#version_DodontoF").text(ddf.info.version);
    $("#version_ddfjs").text(ddf.version);
    $("#version_ddfcli").text(version);
    $("#window_version").show().css("zIndex", 151);
    $(".draggable:not(#window_version)").css("zIndex", 150);
  });
  $("#btn_manual2").on("click", (e) => {
    window.open(ddf.base_url + "README.html");
  });
  $("#btn_tutorial").on("click", (e) => {
  });
  $("#btn_site2").on("click", (e) => {
    window.open("http://www.dodontof.com/");
  });


  $("#btn_zoomin").on("click", () => {
    setZoom(0.1);
  });
  $("#btn_zoomout").on("click", () => {
    setZoom(-0.1);
  });

  $("#btn_screenshot").on("click", generate);
});


function setZoom(amount, relative = true){
  if(relative){
    ddf.roomState.zoom += amount;
  }else{
    ddf.roomState.zoom = amount;
  }
  ddf.roomState.zoom < 0.1 && (ddf.roomState.zoom = 0.1);
  ddf.roomState.zoom > 3.0 && (ddf.roomState.zoom = 3.0);
  $("#map").css("transform", "scale("+ddf.roomState.zoom+")");
}
},{"../../package.json":4}],15:[function(require,module,exports){
(function (exports) {
    function urlsToAbsolute(nodeList) {
        if (!nodeList.length) {
            return [];
        }
        var attrName = 'href';
        if (nodeList[0].__proto__ === HTMLImageElement.prototype 
        || nodeList[0].__proto__ === HTMLScriptElement.prototype) {
            attrName = 'src';
        }
        nodeList = [].map.call(nodeList, function (el, i) {
            var attr = el.getAttribute(attrName);
            if (!attr) {
                return;
            }
            var absURL = /^(https?|data):/i.test(attr);
            if (absURL) {
                return el;
            } else {
                return el;
            }
        });
        return nodeList;
    }

    function screenshotPage() {
        urlsToAbsolute(document.images);
        urlsToAbsolute(document.querySelectorAll("link[rel='stylesheet']"));
        var screenshot = document.documentElement.cloneNode(true);
        var b = document.createElement('base');
        b.href = document.location.protocol + '//' + location.host;
        var head = screenshot.querySelector('head');
        head.insertBefore(b, head.firstChild);
        screenshot.style.pointerEvents = 'none';
        screenshot.style.overflow = 'hidden';
        screenshot.style.webkitUserSelect = 'none';
        screenshot.style.mozUserSelect = 'none';
        screenshot.style.msUserSelect = 'none';
        screenshot.style.oUserSelect = 'none';
        screenshot.style.userSelect = 'none';
        screenshot.dataset.scrollX = window.scrollX;
        screenshot.dataset.scrollY = window.scrollY;
        var script = document.createElement('script');
        script.textContent = '(' + addOnPageLoad_.toString() + ')();';
        screenshot.querySelector('body').appendChild(script);
        var blob = new Blob([screenshot.outerHTML], {
            type: 'text/html'
        });
        return blob;
    }

    function addOnPageLoad_() {
        window.addEventListener('DOMContentLoaded', function (e) {
            var scrollX = document.documentElement.dataset.scrollX || 0;
            var scrollY = document.documentElement.dataset.scrollY || 0;
            window.scrollTo(scrollX, scrollY);
        });
    }

    function generate() {
        window.URL = window.URL || window.webkitURL;
        window.open(window.URL.createObjectURL(screenshotPage()));
    }
    exports.screenshotPage = screenshotPage;
    exports.generate = generate;
})(window);
},{}],16:[function(require,module,exports){
$(() => {
  require("./upload.js");
  require("./graveyard.js");
  require("./imageDelete.js");
  require("./mapChange.js");
  require("./mapMask.js");
  require("./chat.js");
  require("./help.js");
  require("./memo.js");
  require("./magicRangeDD4th.js");
  require("./magicRangeLH.js");
  require("./saveChatLog.js");
  require("./addCharacter.js");
});
},{"./addCharacter.js":17,"./chat.js":18,"./graveyard.js":19,"./help.js":20,"./imageDelete.js":21,"./magicRangeDD4th.js":22,"./magicRangeLH.js":23,"./mapChange.js":24,"./mapMask.js":25,"./memo.js":26,"./saveChatLog.js":27,"./upload.js":28}],17:[function(require,module,exports){
$("#btn_addCharacter").on("click", (e) => {
  addCharacter_show("0");
});

ddf.cmd.addCharacter_show = (imgId) => {
  $("#window_addCharacter_sub").hide();

  ddf.getImageTagsAndImageList().then((r) => {
    tagList = ["キャラクター画像"];
    ddf.images = r;
    for(item of ddf.images.imageList){
      if(ddf.images.tagInfos[item]){
        for(tag of ddf.images.tagInfos[item].tags){
          if(tag == ""){continue;}
          tagList.includes(tag) || tagList.push(tag);
        }
      }
    }
    tagList.push("（全て）");

    $("#addCharacter_tagbox").empty();
    for(item of tagList){
      $("#addCharacter_tagbox").append($(`<option>${encode(item)}</option>`));
    }
      $("#addCharacter_tagbox").append($(`<option>${encode(item)}</option>`));
    addCharacter_setTag(tagList[0]);
  });

  if((character = ddf.characters[imgId])){
    character = character.data;

    $("#window_addCharacter .title").text("キャラクター変更");
    $("#addCharacter_send").text("変更");
  }else{
    character = {
      imgId: imgId,
      name: "",
      dogTag: "",
      size: 1,
      url: "",
      draggable: true,
      imageName: "./image/defaultImageSet/pawn/pawnBlack.png",
      images: ["./image/defaultImageSet/pawn/pawnBlack.png"],
      info: "",
      initiative: 0,
      isHide: false,
      mirrored: false,
      rotation: 0,
      statusAlias: {},
      type: "characterData",
      x: 0,
      y: 0
    };

    $("#window_addCharacter .title").text("キャラクター追加");
    $("#addCharacter_send").text("追加");
  }

  $("#addCharacter_imgId").val(character.imgId);
  $("#addCharacter_name").val(character.name);
  $("#addCharacter_dogTag").val(character.dogTag);
  $("#addCharacter_size").val(character.size);
  $("#addCharacter_url").val(character.url);
  $("#addCharacter_info").val(character.info);
  $("#addCharacter_imageName").val(character.imageName);
  $("#addCharacter_image").css("backgroundImage", `url(${ddf.base_url + character.imageName})`);
  $("#addCharacter_mirrored").prop("checked", character.mirrored);
  if(character.mirrored){
    $("#addCharacter_image").addClass("mirrored");
  }else{
    $("#addCharacter_image").removeClass("mirrored");
  }

  $("#addCharacter_counters").empty();
  character.counters == null && (character.counters = {});

  thead = $("<tr></tr>");
  tbody = $("<tr></tr>");
  
  thead.append($(`<th>イニシアティブ</th>`));
  tbody.append($(`<td><input id="addCharacter_initiative" type="number" value="${character.initiative|0}"></td>`));
  thead.append($(`<th>修正値</th>`));
  tbody.append($(`<td><input id="addCharacter_initiative2" type="number" value="${character.initiative * 100 % 100 | 0}" min="-9" max="90"></td>`));
  count = 0;
  for(item of ddf.roomState.roundTimeData.counterNames){
    character.counters[item]==undefined && (character.counters[item] = 0)
    if(!!(match = /^\*(.*)/.exec(item))){
      thead.append($(`<th>${match[1]}</th>`));
      tbody.append($(`<td><input name="addCharacter_counters[${count++}]" type="checkbox" value="1" ${character.counters[item]!=0?"checked":""}></td>`));
    }else{
      thead.append($(`<th>${item}</th>`));
      tbody.append($(`<td><input name="addCharacter_counters[${count++}]" type="number" value="${character.counters[item]}"></td>`));
    }
  }
  $("#addCharacter_counters").append(thead);
  $("#addCharacter_counters").append(tbody);

  $("#window_addCharacter").show().css("zIndex", 151);
  $(".draggable:not(#window_addCharacter)").css("zIndex", 150);
};

$("#addCharacter_close, #addCharacter_close2").on("click", (e) => {
  $("#window_addCharacter").hide();
});

$("#addCharacter_sub_close").on("click", (e) => {
  $("#window_addCharacter_sub").hide();
});

$("#addCharacter_tagbox").on('change', (e) => {
  addCharacter_setTag($("#addCharacter_tagbox").val());
});

function addCharacter_setTag(tag){
  $("#addCharacter_imagearea").empty();
  let password = $("#addCharacter_password").val();
  for(item of ddf.images.imageList){
    if(ddf.images.tagInfos[item]){
      if((tag == "（全て）" || ddf.images.tagInfos[item].tags.includes(tag)) && (ddf.images.tagInfos[item].password == "" || ddf.images.tagInfos[item].password == password)){
        $("#addCharacter_imagearea").append($(`<div><img src="${ddf.base_url + item}" /></div>`));
      }
    }else if(tag == "（全て）"){
      $("#addCharacter_imagearea").append($(`<div><img src="${ddf.base_url + item}" /></div>`));
    }
  }
}
$(document).on('click', '#addCharacter_imagearea div img', (e) => {
  let img = $(e.currentTarget).attr("src");
  $("#addCharacter_imageName").val(img.replace(ddf.base_url, ""));
  $("#addCharacter_image").css("backgroundImage", `url(${img})`);
});

$("#addCharacter_mirrored").on('click', (e) => {
  if($("#addCharacter_mirrored").prop("checked")){
    $("#addCharacter_image").addClass("mirrored");
  }else{
    $("#addCharacter_image").removeClass("mirrored");
  }
});

$("#addCharacter_btnpassword").on('click', (e) => {
  $("#addCharacter_btnpassword").hide();
  $("#addCharacter_password").show().focus();
});

$("#addCharacter_password").on('focusout', (e) => {
  $("#addCharacter_btnpassword").show();
  $("#addCharacter_password").hide();
  imageDelete_setTag($("#addCharacter_tagbox").val());
}).on('keydown', (e) => {
  if(e.keyCode == 13){
    $("#addCharacter_password").blur();
  }
});

$("#addCharacter_send").on('click', (e) => {

  if((character = ddf.characters[$("#addCharacter_imgId").val()])){

    character.data.name = $("#addCharacter_name").val();
    character.data.dogTag = $("#addCharacter_dogTag").val();
    character.data.size = $("#addCharacter_size").val();
    character.data.url = $("#addCharacter_url").val();
    character.data.info = $("#addCharacter_info").val();
    character.data.mirrored = $("#addCharacter_mirrored").prop("checked");
    character.data.imageName = $("#addCharacter_imageName").val();
    character.data.initiative = parseInt($("#addCharacter_initiative").val()) + ($("#addCharacter_initiative2").val() / 100);
    character.data.isHide = $("#addCharacter_isHide").prop("checked");
    count = 0;
    for(item of ddf.roomState.roundTimeData.counterNames){
      obj = $(`[name=addCharacter_counters\\[${count++}\\]]`);
      if(obj.attr("type")=="checkbox"){
        character.data.counters[item] = obj.prop("checked");
      }else{
        character.data.counters[item] = obj.val();
      }
    }

    ddf.changeCharacter(character.data).then((r) => {
      ddf.cmd.refresh_parseRecordData({record: [[0, "changeCharacter", [character.data], "dummy\t"]]});
      $("#window_addCharacter").hide();
    });
  }else{
    $("#addCharacter_sub_multiple").prop("checked", false);
    $("#addCharacter_sub_name").text($("#addCharacter_name").val());
    $("#addCharacter_sub_character").css("backgroundImage", $("#addCharacter_image").css("backgroundImage"));
    $("#window_addCharacter_sub").show();
    $("#window_addCharacter").hide();
  }
});

var click = {};
$("#window_addCharacter_sub .characterFrame").draggable({
  start: (event) =>  {
    click.x = event.clientX;
    click.y = event.clientY;
  },
  helper: () => {
    let obj = $("#window_addCharacter_sub .characterFrame").clone();
    obj.css("width", $("#addCharacter_size").val() * 50 + "px");
    obj.css("height", $("#addCharacter_size").val() * 50 + "px");
    obj.appendTo("#mapSurface");
    return obj;
  },
  drag: (event, ui) =>  {
      // This is the parameter for scale()
      var zoom = ddf.roomState.zoom;

      var original = ui.originalPosition;

      // jQuery will simply use the same object we alter here
      ui.position = {
          left: (event.clientX - click.x + original.left) / zoom,
          top:  (event.clientY - click.y + original.top ) / zoom
      };
      if(ddf.roomState.viewStateInfo.isSnapMovablePiece){
        if(ddf.roomState.mapData.isAlternately && ddf.roomState.mapData.gridInterval % 2 == 1){
          if((Math.floor(ui.position.top / 50 / ddf.roomState.mapData.gridInterval) & 1)){
            ui.position = {
                left: ((Math.floor(ui.position.left / 25) | 1) ^ 1) * 25,
                top: Math.floor(ui.position.top / 50) * 50
            };
          }else{
            ui.position = {
                left: (Math.floor(ui.position.left / 25) | 1) * 25,
                top: Math.floor(ui.position.top / 50) * 50
            };
          }
        }else{
          ui.position = {
              left: Math.floor(ui.position.left / 50) * 50,
              top: Math.floor(ui.position.top / 50) * 50
          };
        }
      }
    },
    stop: (event, ui) => {
      character = {
        counters: {},
        imgId: $("#addCharacter_imgId").val(),
        name: $("#addCharacter_name").val(),
        dogTag: $("#addCharacter_dogTag").val(),
        size: $("#addCharacter_size").val(),
        url: $("#addCharacter_url").val(),
        draggable: true,
        imageName: $("#addCharacter_imageName").val(),
        images: [$("#addCharacter_imageName").val()],
        info: $("#addCharacter_info").val(),
        initiative: parseInt($("#addCharacter_initiative").val())+($("#addCharacter_initiative2").val() / 100),
        isHide: $("#addCharacter_isHide").prop("checked"),
        mirrored: $("#addCharacter_mirrored").prop("checked"),
        rotation: 0,
        statusAlias: {},
        type: "characterData",
        x: ui.position.left / 50,
        y: ui.position.top / 50
      };
      count = 0;
      for(item of ddf.roomState.roundTimeData.counterNames){
        obj = $(`[name=addCharacter_counters\\[${count++}\\]]`);
        if(obj.attr("type")=="checkbox"){
          character.counters[item] = obj.prop("checked");
        }else{
          character.counters[item] = obj.val();
        }
      }
      ddf.addCharacter(character);
      if($("#addCharacter_sub_multiple").prop("checked")){
        match = /^(.+)(_(\d+))?$/.exec($("#addCharacter_name").val());
        basename = match[1];
        index = match[3]!=null?parseInt(match[3]):0;
        reg = new RegExp(basename+"_(\\d+)");
        for(item in ddf.characters){
          if(v = reg.exec(ddf.characters[item].data.name)){
            index = Math.max(index, parseInt(v[1]))
          }
        }
        $("#addCharacter_name").val(basename+"_"+(index + 1));
        $("#addCharacter_dogTag").val(index + 1);
        $("#addCharacter_sub_name").text(basename+"_"+(index + 1));
      }else{
        $("#window_addCharacter_sub").hide();
      }
    }
});
},{}],18:[function(require,module,exports){

$("#btn_private").on('click', (e) => {
});
/*$("#btn_help").on('click', (e) => {
});*/
$("#btn_diceBotTable").on('click', (e) => {
});
$("#btn_novel").on('click', (e) => {
});
$("#btn_chatDelete").on('click', (e) => {
  if(confirm('チャットログを全て削除します。よろしいですか？') && confirm('削除したログは復旧できませんが、本当によろしいですか？')){
    ddf.deleteChatLog().then((r) => {
      ddf.sendChatMessage(0, "どどんとふ\t", "全チャットログ削除が正常に終了しました。", "00aa00", true);
    });      
  }
});
$("#btn_chatFont").on('click', (e) => {
});
$("#btn_mute").on('click', (e) => {
  ddf.roomState.playSound = !ddf.roomState.playSound;
  if(ddf.roomState.playSound){
    $("#btn_mute img").attr("src", "image/icons/sound.png");
    $("#btn_mute .helptext").text("音再生あり");
  }else{
    $("#btn_mute img").attr("src", "image/icons/sound_mute.png");
    $("#btn_mute .helptext").text("音再生なし");
  }
});
$("#btn_vote").on('click', (e) => {
});
$("#btn_alarm").on('click', (e) => {
});
$("#btn_cutIinList").on('click', (e) => {
});
$("#btn_easyUpload").on('click', (e) => {
});
$("#btn_talk").on('click', (e) => {
});

$("#btn_chatsend").on('click', (e) => {
  ddf.cmd.sendChatMessage(ddf.userState.channel, $("#chatname").val(), "", $("#dicebot").val(), $("#chattext").val(), ddf.userState.color)
  $("#chattext").val("");
});
},{}],19:[function(require,module,exports){
$("#btn_graveyard, #btn_graveyard2").on("click", (e) => {
  getGraveyardCharacterData();
  $("#window_graveyard").show().css("zIndex", 151);
  $(".draggable:not(#window_graveyard)").css("zIndex", 150);
});

$("#graveyard_close, #graveyard_close2").on("click", (e) => {
  $("#window_graveyard").hide();
});
$("#graveyard_resurrect").on("click", (e) => {
  ddf.resurrectCharacter($("#graveyard_characters").val());
  $("#graveyard_characters")[0].remove($("#graveyard_characters")[0].selectedIndex);
});
$("#graveyard_clear").on("click", (e) => {
  ddf.clearGraveyard().then((r) => {
    getGraveyardCharacterData();
  });
});
$("#graveyard_reload").on("click", (e) => {
  getGraveyardCharacterData();
});


function getGraveyardCharacterData(){
  return ddf.getGraveyardCharacterData().then((r) => {
    $("#graveyard_characters").empty();

    for(item of r){
      type = item.type;
      name = item.name;
      switch(item.type){
        case "mapMask":
          type = "マップマスク";
          break;
        case "characterData":
          type = "キャラクター";
          break;
        case "magicRangeMarker":
          type = "魔法範囲";
          break;
        case "LogHorizonRange":
          type = "ログホライズン攻撃範囲";
          break;
        case "MetalicGuardianDamageRange":
          type = "メタリックガーディアン攻撃範囲";
          break;
        case "MagicTimer":
          type = "魔法タイマー";
          break;
        case "chit":
          name = ""
          type = "チット";
          break;
        case "Memo":
          type = "共有メモ";
          name = item.message.split("\r")[0];
          break;
        case "diceSymbol":
          type = "ダイスシンボル";
          name = `[${item.ownerName}]のダイス`;
          break;
        case "magicRangeMarkerDD4th":
          type = "魔法範囲D&D4版";
          break;
      }
      $("#graveyard_characters").append($(`<option value="${item.imgId}">${encode(name)}[${type}]</option>`));
    }
  });
}
},{}],20:[function(require,module,exports){

$("#btn_help").on('click', (e) => {
  dicebot = ddf.info.diceBotInfos.find((item) => {return item.gameType == $("#dicebot").val()});
  baseDicebot = ddf.info.diceBotInfos.find((item) => {return item.gameType == "BaseDiceBot"});
  $("#help_text").text(`${baseDicebot.info}\n==【${dicebot.name}専用】=======================\n${dicebot.info}`);
  $("#window_help").show().css("zIndex", 151);
  $(".draggable:not(#window_help)").css("zIndex", 150);
});

$("#help_close").on('click', (e) => {
  $("#window_help").hide();
});
},{}],21:[function(require,module,exports){
$("#btn_imagedelete").on('click', (e) => {
  $("#window_imageDelete").show().css("zIndex", 151);
  $(".draggable:not(#window_imageDelete)").css("zIndex", 150);

  ddf.getImageTagsAndImageList().then((r) => {
    tagList = ["（全て）"];
    ddf.images = r;
    for(item of ddf.images.imageList){
      if(ddf.images.tagInfos[item]){
        for(tag of ddf.images.tagInfos[item].tags){
          if(tag == ""){continue;}
          tagList.includes(tag) || tagList.push(tag);
        }
      }
    }

    $("#imageDelete_tagbox").empty();
    for(item of tagList){
      $("#imageDelete_tagbox").append($(`<option>${encode(item)}</option>`));
    }
    imageDelete_setTag(tagList[0]);
  });
});

$("#imageDelete_tagbox").on('change', (e) => {
  imageDelete_setTag($("#imageDelete_tagbox").val());
});

$("#imageDelete_close, #imageDelete_close2").on('click', (e) => {
  $("#window_imageDelete").hide();
  $("#imageDelete_password").val("");
});

function imageDelete_setTag(tag){
  $("#imageDelete_imagearea").empty();
  let password = $("#imageDelete_password").val();
  for(item of ddf.images.imageList){
    if(ddf.images.tagInfos[item]){
      if((tag == "（全て）" || ddf.images.tagInfos[item].tags.includes(tag)) && (ddf.images.tagInfos[item].password == "" || ddf.images.tagInfos[item].password == password)){
        $("#imageDelete_imagearea").append($(`<div><img src="${ddf.base_url + item}" /><input type="checkbox" value="${item}"></div>`));
      }
    }else if(tag == "（全て）"){
      $("#imageDelete_imagearea").append($(`<div><img src="${ddf.base_url + item}" /><input type="checkbox" value="${item}"></div>`));
    }
  }
}

$("#imageDelete_btnpassword").on('click', (e) => {
  $("#imageDelete_btnpassword").hide();
  $("#imageDelete_password").show().focus();
});

$("#imageDelete_password").on('focusout', (e) => {
  $("#imageDelete_btnpassword").show();
  $("#imageDelete_password").hide();
  imageDelete_setTag($("#imageDelete_tagbox").val());
}).on('keydown', (e) => {
  if(e.keyCode == 13){
    $("#imageDelete_password").blur();
  }
});

$("button#imageDelete_delete").on('click', (e) => {
  imageList = [];
  for(obj of $("#imageDelete_imagearea :checked")){
    imageList.push(obj.value);
    ddf.images.imageList.splice(ddf.images.imageList.indexOf(obj.value), 1);
  }
  ddf.deleteImage(imageList).then((r) => {
    imageDelete_setTag($("#imageDelete_tagbox").val());
    $("#imageDelete_result").text(r.resultText);
  });
});
},{}],22:[function(require,module,exports){
$("#btn_rangedd4").on("click", (e) => {
  ddf.cmd.magicRangeDD4th_show("");
});

$("#magicRangeDD4th_close, #magicRangeDD4th_close2").on('click', (e) => {
  $("#window_magicRangeDD4th").hide();
});

sp_param = require("../.option.spectrum.json");
sp_param.change = (c) => {
  $("#magicRangeDD4th_color").val(c.toHex());
};
$("#magicRangeDD4th_color2").spectrum(sp_param);

ddf.cmd.magicRangeDD4th_show = (imgId, x = 0, y = 0) => {
  if(character = ddf.characters[imgId]){
    character = character.data;
    $("#window_magicRangeDD4th .title").text("魔法範囲変更（Ｄ＆Ｄ４版）");
    $("#magicRangeDD4th_send").text("変更");
  }else{
    index = 0;
    reg = /^(\d+)$/;
    for(item in ddf.characters){
      if(v = reg.exec(ddf.characters[item].data.name)){
        index = Math.max(index, parseInt(v[1]))
      }
    }
    character = {
      type: "magicRangeMarkerDD4th",
      name: index + 1,
      rangeType: "closeBurstDD4th",
      feets: 15,
      color: 0,
      timeRange: 1,
      info: "",
      isHide: false,
      size: 0,
      x: x,
      y: y,
      counters: {},
      statusAlias: {},
      createRound: 1,
      draggable: true,
      imageName: "",
      imgId: "0",
      initiative: 1,
      rotation: 0,
      size: 0
    };
    $("#window_magicRangeDD4th .title").text("魔法範囲作成（Ｄ＆Ｄ４版）");
    $("#magicRangeDD4th_send").text("追加");
  }
  $("#magicRangeDD4th_imgId").val(character.imgId);
  $("#magicRangeDD4th_name").val(character.name);
  $("#magicRangeDD4th_rangeType").val(character.rangeType);
  $("#magicRangeDD4th_feets").val(character.feets / 5);
  color = new tinycolor("rgb("+[character.color / 65536 & 0xFF,character.color / 256 & 0xFF,character.color & 0xFF]+")").toHex();
  $("#magicRangeDD4th_color").val(color);
  $("#magicRangeDD4th_color2").spectrum("set", "#"+color);
  $("#magicRangeDD4th_timeRange").val(character.timeRange);
  $("#magicRangeDD4th_info").val(character.info);
  $("#magicRangeDD4th_isHide").prop("checked", !character.isHide);

  $("#window_magicRangeDD4th").show().css("zIndex", 151);
  $(".draggable:not(#window_magicRangeDD4th)").css("zIndex", 150);
};

$("#magicRangeDD4th_send").on('click', (e) => {
  if(character = ddf.characters[$("#magicRangeDD4th_imgId").val()]){

    character.data.name = $("#magicRangeDD4th_name").val();
    character.data.rangeType = $("#magicRangeDD4th_rangeType").val();
    character.data.feets = $("#magicRangeDD4th_feets").val() * 5;
    character.data.color = parseInt("0x"+$("#magicRangeDD4th_color").val());
    character.data.timeRange = $("#magicRangeDD4th_timeRange").val();
    character.data.info = $("#magicRangeDD4th_info").val();
    character.data.isHide = !$("#magicRangeDD4th_isHide").prop("checked");

    ddf.changeCharacter(character.data).then((r) => {
      ddf.cmd.refresh_parseRecordData({record: [[0, "changeCharacter", [character.data], "dummy\t"]]});
      $("#window_magicRangeDD4th").hide();
    });
  }else{

    character = {
      type: "magicRangeMarkerDD4th",
      /*name: index + 1,
      rangeType: "closeBurstDD4th",
      feets: 15,
      color: 0,
      timeRange: 1,
      info: "",
      isHide: false,*/
      size: 0,
      x: 1,
      y: 1,
      counters: {},
      statusAlias: {},
      createRound: 1,
      draggable: true,
      imageName: "",
      imgId: "0",
      initiative: 1,
      rotation: 0,
      size: 0
    };
    character.name = $("#magicRangeDD4th_name").val();
    character.rangeType = $("#magicRangeDD4th_rangeType").val();
    character.feets = $("#magicRangeDD4th_feets").val() * 5;
    character.color = parseInt("0x"+$("#magicRangeDD4th_color").val());
    character.timeRange = $("#magicRangeDD4th_timeRange").val();
    character.info = $("#magicRangeDD4th_info").val();
    character.isHide = !$("#magicRangeDD4th_isHide").prop("checked");

    ddf.addCharacter(character).then((r) => {
      $("#window_magicRangeDD4th").hide();
    });
  }
});

},{"../.option.spectrum.json":6}],23:[function(require,module,exports){
$("#btn_rangelh").on("click", (e) => {
  ddf.cmd.magicRangeLH_show("");
});

$("#magicRangeLH_close, #magicRangeLH_close2").on('click', (e) => {
  $("#window_magicRangeLH").hide();
});

sp_param = require("../.option.spectrum.json");
sp_param.change = (c) => {
  $("#magicRangeLH_color").val(c.toHex());
};
$("#magicRangeLH_color2").spectrum(sp_param);

ddf.cmd.magicRangeLH_show = (imgId, x = 0, y = 0) => {
  if(character = ddf.characters[imgId]){
    character = character.data;
    $("#window_magicRangeLH .title").text("攻撃範囲変更");
    $("#magicRangeLH_send").text("変更");
  }else{
    index = 0;
    reg = /^(\d+)$/;
    for(item in ddf.characters){
      if(v = reg.exec(ddf.characters[item].data.name)){
        index = Math.max(index, parseInt(v[1]))
      }
    }
    character = {
      type: "LogHorizonRange",
      name: index + 1,
      range: 1,
      color: 0,
      size: 0,
      x: x,
      y: y,
      draggable: true,
      imageName: "",
      imgId: "0",
      rotation: 0,
      size: 0
    };
    $("#window_magicRangeLH .title").text("攻撃範囲追加");
    $("#magicRangeLH_send").text("追加");
  }
  $("#magicRangeLH_imgId").val(character.imgId);
  $("#magicRangeLH_name").val(character.name);
  $("#magicRangeLH_range").val(character.range);
  color = new tinycolor("rgb("+[character.color / 65536 & 0xFF,character.color / 256 & 0xFF,character.color & 0xFF]+")").toHex();
  $("#magicRangeLH_color").val(color);
  $("#magicRangeLH_color2").spectrum("set", "#"+color);

  $("#window_magicRangeLH").show().css("zIndex", 151);
  $(".draggable:not(#window_magicRangeLH)").css("zIndex", 150);
};

$("#magicRangeLH_send").on('click', (e) => {
  if(character = ddf.characters[$("#magicRangeLH_imgId").val()]){

    character.data.name = $("#magicRangeLH_name").val();
    character.data.range = $("#magicRangeLH_range").val();
    character.data.color = parseInt("0x"+$("#magicRangeLH_color").val());

    ddf.changeCharacter(character.data).then((r) => {
      ddf.cmd.refresh_parseRecordData({record: [[0, "changeCharacter", [character.data], "dummy\t"]]});
      $("#window_magicRangeLH").hide();
    });
  }else{

    character = {
      type: "LogHorizonRange",
      size: 0,
      x: 1,
      y: 1,
      draggable: true,
      imageName: "",
      imgId: "0",
      rotation: 0,
      size: 0
    };
    character.name = $("#magicRangeLH_name").val();
    character.range = $("#magicRangeLH_range").val();
    character.color = parseInt("0x"+$("#magicRangeLH_color").val());

    ddf.addCharacter(character).then((r) => {
      $("#window_magicRangeLH").hide();
    });
  }
});

},{"../.option.spectrum.json":6}],24:[function(require,module,exports){
$("#btn_mapchange").on("click", (e) => {
  mapChange_show();
});

$("#window_mapChange input").on('change', mapChange_previewUpdate);
sp_param = require("../.option.spectrum.json");
sp_param.change = (c) => {
  $("#mapChange_color").val(c.toHex());
  mapChange_previewUpdate();
};
$("#mapChange_color2").spectrum(sp_param);

function mapChange_show(){
  $("#window_mapChange").show().css("zIndex", 151);
  $(".draggable:not(#window_mapChange)").css("zIndex", 150);

  color = new tinycolor("rgb("+[ddf.roomState.mapData.gridColor / 65536 & 0xFF,ddf.roomState.mapData.gridColor / 256 & 0xFF,ddf.roomState.mapData.gridColor & 0xFF]+")").toHex();
  $("#mapChange_width").val(ddf.roomState.mapData.xMax);
  $("#mapChange_height").val(ddf.roomState.mapData.yMax);
  $("#mapChange_isAlternately").prop("checked", ddf.roomState.mapData.isAlternately);
  //ddf.roomState.mapData.mirrored
  $("#mapChange_gridInterval").val(ddf.roomState.mapData.gridInterval);
  $("#mapChange_color").val(color);
  $("#mapChange_color2").spectrum("set", "#"+color);
  switch(ddf.roomState.mapData.mapType){
    case "imageGraphic":
      $("#mapChange_imageSource").val(ddf.roomState.mapData.imageSource);
      if($("#mapChange_imageSource").val() == "image/whiteBack.png"){
        $("#mapChange_blank").prop("checked", true);
      }else{
        $("#mapChange_blank").prop("checked", false);
      }
      $("#mapChange_mirrored").prop("checked", ddf.roomState.mapData.mirrored);
  }

  mapChange_previewUpdate();
}

function mapChange_previewUpdate(){
  param = {
      x: $("#mapChange_width").val(),
      y: $("#mapChange_height").val(),
      border: true,
      alt: $("#mapChange_isAlternately").prop("checked"),
      num: true,
      size: $("#mapChange_gridInterval").val(),
      color: "#"+$("#mapChange_color").val()
  };
  zoom = Math.min(1, 7.26 / param.y,8 / param.x);
  $("#mapChange_preview").css("transform", `scale(${zoom})`);
  $("#mapChange_grid, #mapChange_map").css({width: param.x * 50, height: param.y * 50});
  $("#mapChange_grid").attr("data", "img/grid.svg?"+$.map(param, (v,k) => {return k+"="+v;}).join("&"));
  $("#mapChange_map").attr("src", ddf.base_url + ($("#mapChange_blank").prop("checked")?"image/whiteBack.png":$("#mapChange_imageSource").val()));
  if($("#mapChange_mirrored").prop("checked")){
    $("#mapChange_map").addClass("mirrored");
  }else{
    $("#mapChange_map").removeClass("mirrored");
  }
}

$("#mapChange_close, #mapChange_close2").on("click", (e) => {
  $("#mapChange_image").show();
  $("#mapChange_imageSelect").hide();
  $("#window_mapChange").hide();
});

$("#mapChange_imageChange").on('click', (e) => {
  $("#mapChange_image").hide();
  $("#mapChange_imageSelect").show();

  
  ddf.getImageTagsAndImageList().then((r) => {
    tagList = ["（全て）"];
    ddf.images = r;
    for(item of ddf.images.imageList){
      if(ddf.images.tagInfos[item]){
        for(tag of ddf.images.tagInfos[item].tags){
          if(tag == ""){continue;}
          tagList.includes(tag) || tagList.push(tag);
        }
      }
    }

    $("#mapChange_tagbox").empty();
    for(item of tagList){
      $("#mapChange_tagbox").append($(`<option>${encode(item)}</option>`));
    }
    mapChange_setTag(tagList[0]);
  });
});

$("#mapChange_tagbox").on('change', (e) => {
  mapChange_setTag($("#mapChange_tagbox").val());
});

function mapChange_setTag(tag){
  $("#mapChange_imagearea").empty();
  let password = $("#mapChange_password").val();
  for(item of ddf.images.imageList){
    if(ddf.images.tagInfos[item]){
      if((tag == "（全て）" || ddf.images.tagInfos[item].tags.includes(tag)) && (ddf.images.tagInfos[item].password == "" || ddf.images.tagInfos[item].password == password)){
        $("#mapChange_imagearea").append($(`<div><img src="${ddf.base_url + item}" /></div>`));
      }
    }else if(tag == "（全て）"){
      $("#mapChange_imagearea").append($(`<div><img src="${ddf.base_url + item}" /></div>`));
    }
  }
}
$(document).on('click', '#mapChange_imagearea div img', (e) => {
  let img = $(e.currentTarget).attr("src");
  $("#mapChange_imageSource").val(img.replace(ddf.base_url, ""));
  $("#mapChange_blank").prop("checked", false);
  $("#mapChange_mirrored").prop("checked", $("#mapChange_mirrored2").prop("checked"));
  mapChange_previewUpdate();
});

$("#mapChange_btnpassword").on('click', (e) => {
  $("#mapChange_btnpassword").hide();
  $("#mapChange_password").show().focus();
});

$("#mapChange_password").on('focusout', (e) => {
  $("#mapChange_btnpassword").show();
  $("#mapChange_password").hide();
  imageDelete_setTag($("#mapChange_tagbox").val());
}).on('keydown', (e) => {
  if(e.keyCode == 13){
    $("#mapChange_password").blur();
  }
});

$("#mapChange_send").on('click', (e) => {
  ddf.changeMap(
    "imageGraphic",
    $("#mapChange_blank").prop("checked")?"image/whiteBack.png":$("#mapChange_imageSource").val(),
    $("#mapChange_width").val(),
    $("#mapChange_height").val(),
    $("#mapChange_gridInterval").val(),
    $("#mapChange_isAlternately").prop("checked"),
    $("#mapChange_mirrored").prop("checked"),
    parseInt("0x"+$("#mapChange_color").val()),
    ddf.roomState.mapData.mapMarksAlpha,
    ddf.roomState.mapData.mapMarks).then((r) => {
    $("#mapChange_image").show();
    $("#mapChange_imageSelect").hide();
    $("#window_mapChange").hide();
  });
});
},{"../.option.spectrum.json":6}],25:[function(require,module,exports){
$("#btn_mapmask").on("click", (e) => {
  ddf.mapMask_show("");
});

$("#window_mapMask .slider").slider({min: 0,max: 1, step:0.05, stop: (e, ui) => {
    $("#mapMask_alpha").val(ui.value);
    mapMask_previewUpdate();
  }
});

$("#window_mapMask input").on('change', mapMask_previewUpdate);
sp_param = require("../.option.spectrum.json");
sp_param.change = (c) => {
  $("#mapMask_color").val(c.toHex());
  mapMask_previewUpdate();
};
$("#mapMask_color2").spectrum(sp_param);

ddf.mapMask_show = (imageId) => {
  $("#window_mapMask").show().css("zIndex", 151);
  $(".draggable:not(#window_mapMask)").css("zIndex", 150);

  var character;
  if(ddf.characters[imageId] != null){
    character = ddf.characters[imageId].data;
    $("#mapMask_change").show();
    $("#mapMask_create").hide();
    $("#mapMask_preview").addClass("edit");
    $("#mapMask_title").text("マスク変更");
  }else{
    index = 0;
    reg = /^(\d+)$/;
    for(item in ddf.characters){
      if(v = reg.exec(ddf.characters[item].data.name)){
        index = Math.max(index, parseInt(v[1]))
      }
    }

    character = {
      type: "mapMask",
      name: index + 1,
      width: 3,
      height: 3,
      color: 0,
      alpha: 1,
      imgId: "",
      draggable: true,
      rotation: 0,
      x: 0,
      y: 0
    }

    $("#mapMask_change").hide();
    $("#mapMask_create").show();
    $("#mapMask_preview").removeClass("edit");
    $("#mapMask_title").text("マスク作成");
  }

  $("#mapMask_alpha").val(character.alpha);
  $("#window_mapMask .slider").slider("value", character.alpha);
  $("#mapMask_imageId").val(character.imgId);
  $("#mapMask_name").val(character.name);

  color = new tinycolor("rgb("+[character.color / 65536 & 0xFF,character.color / 256 & 0xFF,character.color & 0xFF]+")").toHex();
  $("#mapMask_width").val(character.width);
  $("#mapMask_height").val(character.height);
  $("#mapMask_color").val(color);
  $("#mapMask_color2").spectrum("set", "#"+color);

  mapMask_previewUpdate();
}

function mapMask_previewUpdate(){
  zoom = Math.min(1, 4.6 / $("#mapMask_width").val(),4.8 / $("#mapMask_height").val());
  $("#mapMask_preview").css("transform", `scale(${zoom})`);
  $("#mapMask_preview").css({
    width: $("#mapMask_width").val() * 50,
    height: $("#mapMask_height").val() * 50,
    opacity: $("#mapMask_alpha").val(),
    backgroundColor: "#"+$("#mapMask_color").val()
  });
}

$("#mapMask_close, #mapMask_close2").on("click", (e) => {
  $("#window_mapMask").hide();
});

var click = {
  x:0,
  y:0
};

$("#mapMask_preview").draggable({
  start: (event) =>  {
    click.x = event.clientX;
    click.y = event.clientY;
  },
  helper: () => {
    let obj = $("#mapMask_preview").clone();
    obj.appendTo("#mapSurface");
    return obj;
  },
  drag: (event, ui) =>  {
      // This is the parameter for scale()
      var zoom = ddf.roomState.zoom;

      var original = ui.originalPosition;

      // jQuery will simply use the same object we alter here
      ui.position = {
          left: (event.clientX - click.x + original.left) / zoom,
          top:  (event.clientY - click.y + original.top ) / zoom
      };
      if(ddf.roomState.viewStateInfo.isSnapMovablePiece){
        if(ddf.roomState.mapData.isAlternately && ddf.roomState.mapData.gridInterval % 2 == 1){
          if((Math.floor(ui.position.top / 50 / ddf.roomState.mapData.gridInterval) & 1)){
            ui.position = {
                left: ((Math.floor(ui.position.left / 25) | 1) ^ 1) * 25,
                top: Math.floor(ui.position.top / 50) * 50
            };
          }else{
            ui.position = {
                left: (Math.floor(ui.position.left / 25) | 1) * 25,
                top: Math.floor(ui.position.top / 50) * 50
            };
          }
        }else{
          ui.position = {
              left: Math.floor(ui.position.left / 50) * 50,
              top: Math.floor(ui.position.top / 50) * 50
          };
        }
      }
    },
    stop: (event, ui) => {
      character = {
        type: "mapMask",
        name: $("#mapMask_name").val(),
        width: $("#mapMask_width").val(),
        height: $("#mapMask_height").val(),
        color: parseInt("0x"+$("#mapMask_color").val()),
        alpha: $("#mapMask_alpha").val(),
        imgId: "",
        draggable: true,
        rotation: 0,
        x: ui.position.left / 50,
        y: ui.position.top / 50
      };
      ddf.addCharacter(character);
      if($("#mapMask_multiple").prop("checked")){
        $("#mapMask_name").val(parseInt($("#mapMask_name").val()) + 1)
      }else{
        $("#window_mapMask").hide();
      }
    },
    cancel: ".edit"
});


$("#mapMask_send").on('click', (e) => {
  imageId = $("#mapMask_imageId").val();
  character = ddf.characters[imageId].data;

  character.name = $("#mapMask_name").val();
  character.color = parseInt("0x"+$("#mapMask_color").val());
  character.width = $("#mapMask_width").val();
  character.height = $("#mapMask_height").val();
  character.alpha = $("#mapMask_alpha").val();

  ddf.changeCharacter(character).then((r) => {
    ddf.characters[imageId].data = character;
    ddf.cmd.refresh_parseRecordData({record: [[0, "changeCharacter", [character], "dummy\t"]]});
    $("#window_mapMask").hide();
  });
});
},{"../.option.spectrum.json":6}],26:[function(require,module,exports){

$("#btn_memo").on('click', (e) => {
  ddf.cmd.openMemo("");
});

$("#memo_close, #memo_close2").on('click', (e) => {
  $("#window_memo").hide();
});

ddf.cmd.openMemo = (imgId) => {
  $("#memo_imgId").val(imgId);
  if(!(character = ddf.characters[$("#memo_imgId").val()])){
    character = {
      color: 0xFFFFFF,
      draggable: true,
      height: 1,
      width: 1,
      rotation: 0,
      x: 0,
      y: 0,
      type: "Memo",
      isPaint: true,
      imgId: "",
      message: ""
    };
    $("#window_memo .title").text("共有メモ");
    $("#memo_send").text("追加");
  }else{
    character = character.data;
    $("#window_memo .title").text("共有メモ変更");
    $("#memo_send").text("変更");
  }

  $("#memo_tab, #memo_edit").empty();
  count = 0;
  for(item of character.message.split("\t|\t")){
    tab = $(`<div class="tab">${encode(item.split("\r")[0])}</div>`);
    obj = $(`<textarea>${encode(item)}</textarea>`);
    del = $(`<img src="image/icons/cancel.png">`);
    del.on('click', ((tab, obj)=>{return (e)=>{
      tab.remove();
      obj.remove();
    }})(tab, obj));
    tab.append(del);
    tab.on('click', ((obj) => {return (e) => {
      if(!$(this).hasClass("active")){
        $("#memo_tab .active, #memo_edit .active").removeClass("active");
        $(obj).addClass("active");
        $(this).addClass("active");
      }
    }})(obj));
    $("#memo_tab").append(tab);
    $("#memo_edit").append(obj);
    count++;
  }
  $("#memo_tab .tab:eq(0), #memo_edit textarea:eq(0)").addClass("active");
  $("#window_memo").show().css("zIndex", 151);
  $(".draggable:not(#window_memo)").css("zIndex", 150);
};

$("#memo_send").on('click', (e) => {
  arr = $.map($("#memo_edit textarea"),(v)=>{return $(v).val().replace("\n","\r");});
  message = arr.join("\t|\t")
  if(character = ddf.characters[$("#memo_imgId").val()]){
    character.data.message = message;
    ddf.changeCharacter(character.data).then((r) => {
        title = character.data.message.split("\r")[0];
        ar = character.data.message.split(/\t\|\t/);
        if(ar.length > 1){
          body = ar.map((v)=>{return `[${v.split("\r")[0]}]`}).join("<br>")
        }else{
          body = character.data.message.replace("\r", "<br>");
        }
        character.obj.html(`<span>${encode(title)}</span><img src="${ddf.base_url}image/memo2.png"><div>${encode(body)}</div>`);
    });
  }else{
    character = {
      color: 0xFFFFFF,
      draggable: true,
      height: 1,
      width: 1,
      rotation: 0,
      x: 0,
      y: 0,
      type: "Memo",
      isPaint: true,
      imgId: "0",
      message: message
    }
    ddf.addCharacter(character);
  }
  $("#window_memo").hide();
});

$("#memo_addTab").on('click', (e) => {
  count = $("#memo_tab .tab").length;
  tab = $(`<div class="tab active">${count + 1}</div>`);
  obj = $(`<textarea class="active"></textarea>`);
  del = $(`<img src="image/icons/cancel.png">`);
  del.on('click', ((tab, obj)=>{return (e)=>{
    tab.remove();
    obj.remove();
  }})(tab, obj));
  tab.append(del);
  tab.on('click', ((obj) => {return (e) => {
    if(!$(this).hasClass("active")){
      $("#memo_tab .active, #memo_edit .active").removeClass("active");
        $(obj).addClass("active");
        $(this).addClass("active");
    }
  }})(obj));
  $("#memo_tab .active, #memo_edit .active").removeClass("active");
  $("#memo_tab").append(tab);
  $("#memo_edit").append(obj);
});

$(document).on('keyup', "#memo_edit textarea", (e) => {
  $("#memo_tab .active").text(encode($("#memo_edit .active").val().split("\n")[0]));
});
},{}],27:[function(require,module,exports){
(function (Buffer){
$("#btn_savechatlog, #btn_savelog2").on("click", (e) => {
  saveChatLog_show();
});

$("#saveChatLog_close, #saveChatLog_close2").on("click", (e) => {
  $("#window_saveChatLog").hide();
});

$("[name=saveChatLog_mode]").on('click', (e) => {
  if($("[name=saveChatLog_mode]:checked").val()=="HTML"){
    $("#saveChatLog_fontSize").prop('disabled', false);
    $("#saveChatLog_lineHeight").prop('disabled', false);
  }else{
    $("#saveChatLog_fontSize").prop('disabled', true);
    $("#saveChatLog_lineHeight").prop('disabled', true);
  }
});

function saveChatLog_show(){
  $("#saveChatLog_channel").empty();

  index = 0;
  for(item of ddf.roomState.chatChannelNames){
    obj = $(`<button>${item}</button>`);
    obj.on('click', ((channel)=>{return (e)=>{saveChatLog(channel);}})(index++));
    $("#saveChatLog_channel").append(obj);
  }

  $("#window_saveChatLog").show().css("zIndex", "151");
  $(".draggable:not(#window_saveChatLog)").css("zIndex", "150");
}

$("#saveChatLog_saveAll").on('click', (e) => {saveChatLog()});

function saveChatLog(channel = 'all'){
  if(channel != 'all'){
    list = chatlog.filter((v)=>{return v[0]==channel});
  }else{
    list = chatlog.filter((v)=>{return v[1]!=null});
  }
  if($("[name=saveChatLog_mode]:checked").val()=="HTML"){
    style = `
#container * {
  font-size: ${$("#saveChatLog_fontSize").val()};
  line-height: ${$("#saveChatLog_lineHeight").val()};
}

#container dt {
  display: inline-block;
}

#container dd {
  margin-left: 0;
  display: inline;
  vertical-align:top;
}

#container dd:after {
  content:'';
  display:block;
} 
`;
    body = list.map((v)=>{return `<dt>[${encode(v[1])}]${ddf.roomState.showChatTime?dateFormat(new Date(v[2]*1000), "HH:MM")+"：":""}</dt><dd style="color:${v[3]};"><b>${encode(v[4])}</b>：${encode(v[5]).replace(/\n/g,"<br>")}</dd>`}).join("\n");
    output = `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<title></title>
<style>${style}</style>
</head>
<body>
<div id="container">
<dl>
${body}
</dl>
</div>
</body>
</html>
`;
    let buffer = new Buffer(output);
    let filename = `chatlog_${dateFormat(new Date, "yymmdd_HHMMss")}.html`;
    a = $(`<a href="data://text/html;base64,${buffer.toString('base64')}" download="${filename}">.</a>`);
    $(document.body).append(a);
    a[0].click();
    a.remove();
  }else{
    output = list.map((v)=>{return `[${v[1]}]${ddf.roomState.showChatTime?dateFormat(new Date(v[2]*1000), "HH:MM")+"：":""}${v[4]}：${v[5]}`}).join("\n");

    let buffer = new Buffer(output);
    let filename = `chatlog_${dateFormat(new Date, "yymmdd_HHMMss")}.txt`;
    a = $(`<a href="data://text/html;base64,${buffer.toString('base64')}" download="${filename}">.</a>`);
    $(document.body).append(a);
    a[0].click();
    a.remove();
  }
}
}).call(this,require("buffer").Buffer)
},{"buffer":2}],28:[function(require,module,exports){

$("#btn_imageupload").on("click", (e) => {
  $("#window_upload").show().css("zIndex", 151);
  $(".draggable:not(#window_upload)").css("zIndex", 150);
});

var upload_uploadlist = [];

$form = $("#upload_droparea");

$("#upload_droparea ~ .overwrap").on('dragenter', () => {
  $form.addClass('is-dragover');
});

$form.on('drag dragstart dragend dragover dragenter dragleave drop', (e) => {
  e.preventDefault();
  e.stopPropagation();
})
.on('dragover dragenter', () => {
  $form.addClass('is-dragover');
})
.on('dragleave dragend drop', () => {
  $form.removeClass('is-dragover');
})
.on('drop', (e) => {
  droppedFiles = e.originalEvent.dataTransfer.files;

  upload_uploadfiles(droppedFiles);
});

$("#window_upload :file").on('change', (e) => {
  arr = [];
  for(item of $("#window_upload :file")[0].files){
    arr.push(item);
  }
  upload_uploadfiles(arr);
});

function upload_uploadfiles(droppedFiles){
  upload_uploadlist = [];
  $("#upload_droparea").empty();
  for(file of droppedFiles){
    new Promise((success, error)=>{
      let fr = new FileReader();

      fr.onload = success;

      if(/image\/(gif|png|jpeg)/.test(file.type)){
        fr.readAsArrayBuffer(file);
      }
    }).then(((file) => {return (r)=>{
      let data = new Uint8Array(r.target.result);

      if(upload_uploadlist.length == 0){
        $("#upload_droparea").empty();
      }
      upload_uploadlist.push([file, data]);
      url = `data:${file.type};base64,${btoa(Array.from(data, e => String.fromCharCode(e)).join(""))}`;
      $("#upload_droparea").append(`<div><img src="${url}"></div>`);
    };})(file));
  }
}

$("#upload_send").on('click', (e)=>{
  $("#upload_result").text("");
  for(file of upload_uploadlist){
    ddf.uploadImageData(
      file[0].name,
      file[1],
      $("#upload_password").val(),
      $("#upload_tag").val().split(/[ 　]/),
      $("#upload_private").val()=="1"?null:ddf.userState.room
    ).then(((name) => {return (r)=>{
      $("#upload_result").text($("#upload_result").text() + name + ":" + r.resultText + "　　");
    };})(file[0].name));
  }
  upload_uploadlist = [];
});

$("#upload_tagbox").on('change', (e)=>{
  $("#upload_tag").val($("#upload_tagbox").val()+"　");
});

$("#upload_close, #upload_close2").on('click', (e)=>{
  $("#window_upload").hide();
  $("#upload_droparea").empty();
  $("#upload_password").val();
  $("#upload_btnpassword").text("パスワードなし");
});

$("#upload_btnpassword").on('click', (e) => {
  $("#upload_btnpassword").hide();
  $("#upload_password").show().focus();
});

$("#upload_password").on('focusout', (e) => {
  $("#upload_btnpassword").show().text($("#upload_password").val()==""?"パスワードなし":"パスワードあり");
  $("#upload_password").hide();
}).on('keydown', (e) => {
  if(e.keyCode == 13){
    $("#upload_password").blur();
  }
});

$("#window_upload .overwrap a").on('click', (e) => {
  $("#window_upload .overwrap :file").click();
  return false;
});

},{}]},{},[13]);

//# sourceMappingURL=.maps/index.js.map
