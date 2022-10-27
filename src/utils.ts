// Get relative path of target with respect to reference
export const getRelativePath = (target: string, reference: string): string => {
  const xs = target.split('/');
  const ys = reference.split('/').slice(0, -1);
  const n = Math.min(xs.length, ys.length);
  let count = 0;
  for (let i = 0; i < n; i++) {
    if (xs[i] === ys[i]) {
      count++;
    } else {
      break;
    }
  }

  const numUps = ys.length - count;
  const zs = [...(Array(numUps).fill('..') as string[]), ...xs.slice(count)];
  return zs.join('/');
};
