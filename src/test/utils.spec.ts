import chai from "chai";
import { getRelativePath } from '../utils';

const assert = chai.assert;

describe('Utils: getRelativePath', () => {
  it('getRelativePath: b from a', () => {
    const target: string = 'b';
    const ref: string = 'a';
    assert.deepEqual('b', getRelativePath(target, ref));
  });
  it('getRelativePath: x from some/path/x', () => {
    const target: string = 'x';
    const ref: string = 'some/path/x';
    assert.deepEqual('../../x', getRelativePath(target, ref));
  });
  it('getRelativePath: some/path/x from some/other/y', () => {
    const target: string = 'some/path/x';
    const ref: string = 'some/other/y';
    assert.deepEqual('../path/x', getRelativePath(target, ref));
  });
  it('getRelativePath: some/path/x from path/y', () => {
    const target: string = 'some/path/x';
    const ref: string = 'path/y';
    assert.deepEqual('../some/path/x', getRelativePath(target, ref));
  });

});

