'use strict';

/**
 * Enum-like object to represent the type of an Option (Some or None).
 */
const OptionType = {
    Some: Symbol(':some'),
    None: Symbol(':none'),
};
class OptionExt {
    /**
     * Construct an Option from a value which may be undefined.
     *
     * @param value May be either undefined to not undefined.
     * @returns `Some(value)` if `value` is not undefined, otherwise `None`.
     *
     * #### Examples
     * ```ts
     * console.log(OptionExt.ofUndefinable(undefined).isNone()); // true
     * console.log(OptionExt.ofUndefinable("x").isSome()); // true
     * ```
     */
    static ofUndefinable(value) {
        return value === undefined ? None : Some(value);
    }
}
/**
 * Represents a Some value of Option.
 */
class SomeImpl {
    val;
    constructor(val) {
        this.val = val;
    }
    get type() {
        return OptionType.Some;
    }
    isSome() {
        return true;
    }
    isNone() {
        return false;
    }
    match(fn) {
        return fn.some(this.val);
    }
    map(fn) {
        return Some(fn(this.val));
    }
    andThen(fn) {
        return fn(this.val);
    }
    or(_optb) {
        return this;
    }
    and(optb) {
        return optb;
    }
    unwrapOr(_def) {
        return this.val;
    }
    unwrap(_msg) {
        return this.val;
    }
}
/**
 * Represents a None value of Option.
 */
class NoneImpl {
    get type() {
        return OptionType.None;
    }
    isSome() {
        return false;
    }
    isNone() {
        return true;
    }
    match({ none }) {
        if (typeof none === 'function') {
            return none();
        }
        return none;
    }
    map(_fn) {
        return new NoneImpl();
    }
    andThen(_fn) {
        return new NoneImpl();
    }
    or(optb) {
        return optb;
    }
    and(_optb) {
        return new NoneImpl();
    }
    unwrapOr(def) {
        return def;
    }
    unwrap(msg) {
        if (msg) {
            throw new Error(msg);
        }
        else {
            throw new ReferenceError('Trying to unwrap None.');
        }
    }
}
/**
 * Creates a Some instance of Option containing the given value.
 * This function is used to represent the presence of a value in an operation that may not always produce a value.
 *
 * @param val The value to be wrapped in a Some Option.
 * @returns An Option instance representing the presence of a value.
 *
 * #### Example
 *
 * ```ts
 * const option = Some(42);
 * console.log(option.unwrap()); // Outputs: 42
 * ```
 */
function Some(val) {
    return new SomeImpl(val);
}
/**
 * The singleton instance representing None, an Option with no value.
 * This constant is used to represent the absence of a value in operations that may not always produce a value.
 *
 * #### Example
 *
 * ```ts
 * const option = None;
 * console.log(option.isNone()); // Outputs: true
 * ```
 */
const None = new NoneImpl(); // eslint-disable-line @typescript-eslint/no-explicit-any
/**
 * Type guard to check if an Option is a Some value.
 * This function is used to narrow down the type of an Option to SomeOption in TypeScript's type system.
 *
 * @deprecated Use `Option.isSome` instead.
 * @param val The Option to be checked.
 * @returns true if the provided Option is a SomeOption, false otherwise.
 *
 * #### Example
 *
 * ```ts
 * const option = Some('Success');
 * if (isSome(option)) {
 *   console.log('Option has a value:', option.unwrap());
 * }
 * ```
 */
function isSome(val) {
    return val.isSome();
}
/**
 * Type guard to check if an Option is a None value.
 * This function is used to narrow down the type of an Option to NoneOption in TypeScript's type system.
 *
 * @deprecated Use `Option.isNone` instead.
 * @param val The Option to be checked.
 * @returns true if the provided Option is a NoneOption, false otherwise.
 *
 * #### Example
 *
 * ```ts
 * const option = None;
 * if (isNone(option)) {
 *   console.log('Option does not have a value.');
 * }
 * ```
 */
function isNone(val) {
    return val.isNone();
}

/**
 * Enum-like object for representing the state of an Either: Left or Right.
 */
const EitherType = {
    Left: Symbol(':left'),
    Right: Symbol(':right'),
};
/**
 * Implements the Either interface for a Left value.
 */
class LeftImpl {
    val;
    constructor(val) {
        this.val = val;
    }
    get type() {
        return EitherType.Left;
    }
    isLeft() {
        return true;
    }
    isRight() {
        return false;
    }
    left() {
        return Some(this.val);
    }
    right() {
        return None;
    }
    unwrap() {
        return this.val;
    }
    unwrapLeft() {
        return this.val;
    }
    unwrapRight() {
        throw new ReferenceError('Cannot unwrap Right value of Either.Left');
    }
    unwrapLeftOr(_other) {
        return this.val;
    }
    unwrapRightOr(other) {
        return other;
    }
    match(matchObject) {
        return matchObject.left(this.val);
    }
    mapLeft(fn) {
        return Left(fn(this.val));
    }
    mapRight(_fn) {
        return Left(this.val);
    }
    leftAndThen(fn) {
        return fn(this.val);
    }
    rightAndThen(_fn) {
        return Left(this.val);
    }
}
/**
 * Implements the Either interface for a Right value.
 */
class RightImpl {
    val;
    constructor(val) {
        this.val = val;
    }
    get type() {
        return EitherType.Right;
    }
    isLeft() {
        return false;
    }
    isRight() {
        return true;
    }
    left() {
        return None;
    }
    right() {
        return Some(this.val);
    }
    unwrap() {
        return this.val;
    }
    unwrapLeft() {
        throw new ReferenceError('Cannot unwrap Left value of Either.Right');
    }
    unwrapRight() {
        return this.val;
    }
    unwrapLeftOr(other) {
        return other;
    }
    unwrapRightOr(_other) {
        return this.val;
    }
    match(matchObject) {
        return matchObject.right(this.val);
    }
    mapLeft(_fn) {
        return Right(this.val);
    }
    mapRight(fn) {
        return Right(fn(this.val));
    }
    leftAndThen(_fn) {
        return Right(this.val);
    }
    rightAndThen(fn) {
        return fn(this.val);
    }
}
/**
 * Factory function for creating a Left instance of Either.
 */
function Left(val) {
    return new LeftImpl(val);
}
/**
 * Factory function for creating a Right instance of Either.
 */
function Right(val) {
    return new RightImpl(val);
}
/**
 * Type guard for checking if an Either is a Left.
 *
 * @deprecated Use `Either.isLeft` instead.
 */
function isLeft(val) {
    return val.isLeft();
}
/**
 * Type guard for checking if an Either is a Right.
 *
 * @deprecated Use `Either.isRight` instead.
 */
function isRight(val) {
    return val.isRight();
}

/**
 * Enum-like object to represent the type of a Result (Ok or Err).
 */
const ResultType = {
    Ok: Symbol(':ok'),
    Err: Symbol(':err'),
};
/**
 * Represents a Ok Result.
 */
class OkImpl {
    val;
    constructor(val) {
        this.val = val;
    }
    get type() {
        return ResultType.Ok;
    }
    isOk() {
        return true;
    }
    isErr() {
        return false;
    }
    ok() {
        return Some(this.val);
    }
    err() {
        return None;
    }
    match(matchObject) {
        return matchObject.ok(this.val);
    }
    map(fn) {
        return Ok(fn(this.val));
    }
    mapErr(_fn) {
        return Ok(this.val);
    }
    andThen(fn) {
        return fn(this.val);
    }
    orElse(_fn) {
        return Ok(this.val);
    }
    unwrap(_msg) {
        return this.val;
    }
    unwrapErr(msg) {
        if (msg) {
            throw new Error(msg);
        }
        else {
            throw new ReferenceError('Cannot unwrap Err value of Result.Ok');
        }
    }
    unwrapOr(_optb) {
        return this.val;
    }
}
/**
 * Represents an Err Result.
 */
class ErrImpl {
    val;
    constructor(val) {
        this.val = val;
    }
    get type() {
        return ResultType.Err;
    }
    isOk() {
        return false;
    }
    isErr() {
        return true;
    }
    ok() {
        return None;
    }
    err() {
        return Some(this.val);
    }
    match(matchObject) {
        return matchObject.err(this.val);
    }
    map(_fn) {
        return Err(this.val);
    }
    mapErr(fn) {
        return Err(fn(this.val));
    }
    andThen(_fn) {
        return Err(this.val);
    }
    orElse(fn) {
        return fn(this.val);
    }
    unwrap(msg) {
        if (msg) {
            throw new Error(msg);
        }
        else {
            throw new ReferenceError('Cannot unwrap Ok value of Result.Err');
        }
    }
    unwrapErr(_msg) {
        return this.val;
    }
    unwrapOr(optb) {
        return optb;
    }
}
/**
 * Creates an Ok instance of Result containing the success value.
 * This function is used to represent a successful result in operations that could potentially fail.
 *
 * @param val The value to be contained within the Ok Result.
 * @returns A Result instance representing success and containing the provided value.
 *
 * #### Example
 *
 * ```ts
 * const successResult = Ok(42);
 * console.log(successResult.unwrap()); // Outputs: 42
 * ```
 */
function Ok(val) {
    return new OkImpl(val);
}
/**
 * Creates an Err instance of Result containing the error value.
 * This function is used to represent a failure in operations that could potentially fail.
 *
 * @param val The error value to be contained within the Err Result.
 * @returns A Result instance representing an error and containing the provided error value.
 *
 * #### Example
 *
 * ```ts
 * const errorResult = Err('Something went wrong');
 * console.log(errorResult.unwrapErr()); // Outputs: Something went wrong
 * ```
 */
function Err(val) {
    return new ErrImpl(val);
}
/**
 * Type guard to check if a Result is an Ok value.
 * This function is used to narrow down the type of a Result to OkResult in TypeScript type system.
 *
 * @deprecated Use `Result.isOk` instead.
 * @param val The Result to be checked.
 * @returns true if the provided Result is an OkResult, false otherwise.
 *
 * #### Example
 *
 * ```ts
 * const result = Ok('Success');
 * if (isOk(result)) {
 *   console.log('Operation was successful:', result.unwrap());
 * }
 * ```
 */
function isOk(val) {
    return val.isOk();
}
/**
 * Type guard to check if a Result is an Err value.
 * This function is used to narrow down the type of a Result to ErrResult in TypeScript type system.
 *
 * @deprecated Use `Result.isErr` instead.
 * @param val The Result to be checked.
 * @returns true if the provided Result is an ErrResult, false otherwise.
 *
 * #### Example
 *
 * ```ts
 * const result = Err('Failure');
 * if (isErr(result)) {
 *   console.log('Operation failed with error:', result.unwrapErr());
 * }
 * ```
 */
function isErr(val) {
    return val.isErr();
}

exports.EitherType = EitherType;
exports.Err = Err;
exports.Left = Left;
exports.None = None;
exports.Ok = Ok;
exports.OptionExt = OptionExt;
exports.OptionType = OptionType;
exports.ResultType = ResultType;
exports.Right = Right;
exports.Some = Some;
exports.isErr = isErr;
exports.isLeft = isLeft;
exports.isNone = isNone;
exports.isOk = isOk;
exports.isRight = isRight;
exports.isSome = isSome;