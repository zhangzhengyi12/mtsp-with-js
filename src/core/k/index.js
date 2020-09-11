import _ from 'loadsh'

function MKD(x, y, p) {
  var sum = 0;
  for (var i = 0, len = x.length; i < len; i++) {
    sum += Math.pow(Math.abs(x[i] - y[i]), p);
  }
  return Math.sqrt(sum);
}

function vectorsAVG(vectors) {
  const len = vectors.length;
  const latitude = vectors[0].length;
  let res = [];

  for (let i = 0; i < latitude; i++) {
    let sum = 0;
    for (let j = 0; j < len; j++) {
      sum += vectors[j][i];
    }
    res.push(sum / len);
  }
  return res;

}

/*

这个算法的名称是 K 均值（K-Means）聚类算法，

它让我们可以在一个任意多的数据上，

得到一个事先定好群组数量（K）的聚类结果。

1. 从 N 个数据对象中随机选取 k 个对象作为质心，这里每个群组的质心定义是，群组内所有成员对象的平均值。因为是第一轮，所以第 i 个群组的质心就是第 i 个对象，而且这时候我们只有这一个组员。

2. 对剩余的对象，测量它和每个质心的相似度，并把它归到最近的质心所属的群组。这里我们可以说距离，也可以说相似度，只是两者呈现反比关系。

3. 重新计算已经得到的各个群组的质心。这里质心的计算是关键，如果使用特征向量来表示的数据对象，那么最基本的方法是取群组内成员的特征向量，将它们的平均值作为质心的向量表示

4. 迭代上面的第 2 步和第 3 步，直至新的质心与原质心相等或相差之值小于指定阈值，算法结束。

*/

export default function KMeans(k, vectors) {
  // 初始质心 与 group 对应
  const centroids = _.shuffle(vectors).slice(0, k);
  let group;
  // 初始误差
  let thresHolder = 100;
  while (thresHolder > 0.001) {
    group = new Array(k).fill(1).map(() => []);
    // 计算每个目标与与当前所有质心的距离
    for (const corpu of vectors) {
      let min = Infinity;
      let minCentroidIndex = 0;

      centroids.forEach((centroid, index) => {
        let len = MKD(corpu, centroid, 2);
        if (len < min) {
          min = len;
          minCentroidIndex = index;
        }
      });
      // 把单个 corpu 放置到对应最短欧式距离 group 里
      group[minCentroidIndex].push(corpu);
    }

    // 重新计算每个质❤️
    // 为每个 group 的中心点
    let maxThresHolder = 0;
    for (let i = 0; i < k; i++) {
      let temp = centroids[i];
      centroids[i] = vectorsAVG(group[i]);
      maxThresHolder = Math.max(maxThresHolder, MKD(temp, centroids[i], 2));
    }
    // 误差为所有质心里面最大的那一个
    thresHolder = maxThresHolder;
  }

  console.log('完成分类\n------');


  return group.map(g => g.map(v => v._curpu))
}
