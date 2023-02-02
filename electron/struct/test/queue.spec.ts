import { Queue } from "./../queue";
import { expect } from "chai";

describe("queue unit test", () => {
  it(`should not throw error with default operation`, () => {
    let queue: Queue<number> = new Queue();

    expect(queue.hasNext()).to.be.false;

    queue.push(1);
    expect(queue.hasNext()).to.be.true;
    queue.push(3);
    queue.push(2);

    expect(queue.hasNext()).to.be.true;
    expect(queue.size).to.eq(3);

    expect(queue.pop()).to.eq(1);
    expect(queue.size).to.eq(2);

    queue.pushTop(12);

    expect(queue.size).to.eq(3);
    expect(queue.pop()).to.eq(12);

    expect(queue.toArray()).to.deep.equal([3, 2]);
  });
  it(`should throw when operating empty queue`, () => {
    expect(() => {
      let q = new Queue();
      q.pop();
    }).to.throws(/Empty queue/);
  });
  it(`should work with empty array when created`, () => {
    let q = new Queue();
    expect(q.toArray()).to.be.instanceOf(Array);
    expect(q.toArray().length).to.eq(0);
  });
});
