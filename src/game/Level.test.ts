import { Level } from "./Level";


it("should have correct dimensions", () => {
    const level = new Level("name", [
        [0, 1, 1],
        [1, 0, 0]
    ])
    expect(level.height).toBe(2)
    expect(level.width).toBe(3)
});

it("should have correct helpers", () => {
    const level = new Level("name", [
        [1, 0, 1, 1, 0, 1],
        [0, 0, 1, 0, 0, 1],
        [0, 0, 0, 0, 0, 0],
        [1, 1, 1, 0, 0, 0]
    ])
    expect(level.sideHelper).toStrictEqual([
        [1, 2, 1],
        [1, 1],
        [],
        [3]
    ])
    expect(level.aboveHelper).toStrictEqual([
        [1, 1],
        [1],
        [2, 1],
        [1],
        [],
        [2]
    ])
});
