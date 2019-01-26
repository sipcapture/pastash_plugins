/* globals require process */
const isProd = process.env.NODE_ENV === 'production';
const tape = require('tape');
const plugmein = require(isProd ? '../dist/plugmein' : '../src/plugmein');

const crimeaData = [
  { date: new Date(Date.UTC(1854, 4 - 1, 1)), total: 8571, disease: 1, wounds: 0, other: 5, cat: 'A' },
  { date: new Date(Date.UTC(1854, 5 - 1, 1)), total: 23333, disease: 12, wounds: 0, other: 9, cat: 'B' },
  { date: new Date(Date.UTC(1854, 6 - 1, 1)), total: 28333, disease: 11, wounds: 0, other: 6, cat: 'C' },
  { date: new Date(Date.UTC(1854, 7 - 1, 1)), total: 28772, disease: 359, wounds: 0, other: 23, cat: 'C' },
  { date: new Date(Date.UTC(1854, 8 - 1, 1)), total: 30246, disease: 828, wounds: 1, other: 30, cat: 'B' },
  { date: new Date(Date.UTC(1854, 9 - 1, 1)), total: 30290, disease: 788, wounds: 81, other: 70, cat: 'A' },
  { date: new Date(Date.UTC(1854, 10 - 1, 1)), total: 30643, disease: 503, wounds: 132, other: 128, cat: 'C' },
  { date: new Date(Date.UTC(1854, 11 - 1, 1)), total: 29736, disease: 844, wounds: 287, other: 106, cat: 'D' },
  { date: new Date(Date.UTC(1854, 12 - 1, 1)), total: 32779, disease: 1725, wounds: 114, other: 131, cat: 'D' },
  { date: new Date(Date.UTC(1855, 1 - 1, 1)), total: 32393, disease: 2761, wounds: 83, other: 324, cat: 'B' },
  { date: new Date(Date.UTC(1855, 2 - 1, 1)), total: 30919, disease: 2120, wounds: 42, other: 361, cat: 'A' },
  { date: new Date(Date.UTC(1855, 3 - 1, 1)), total: 30107, disease: 1205, wounds: 32, other: 172, cat: 'C' },
  { date: new Date(Date.UTC(1855, 4 - 1, 1)), total: 32252, disease: 477, wounds: 48, other: 57, cat: 'D' },
  { date: new Date(Date.UTC(1855, 5 - 1, 1)), total: 35473, disease: 508, wounds: 49, other: 37, cat: 'B' },
  { date: new Date(Date.UTC(1855, 6 - 1, 1)), total: 38863, disease: 802, wounds: 209, other: 31, cat: 'C' },
  { date: new Date(Date.UTC(1855, 7 - 1, 1)), total: 42647, disease: 382, wounds: 134, other: 33, cat: 'A' },
  { date: new Date(Date.UTC(1855, 8 - 1, 1)), total: 44614, disease: 483, wounds: 164, other: 25, cat: 'E' },
  { date: new Date(Date.UTC(1855, 9 - 1, 1)), total: 47751, disease: 189, wounds: 276, other: 20, cat: 'C' },
  { date: new Date(Date.UTC(1855, 10 - 1, 1)), total: 46852, disease: 128, wounds: 53, other: 18, cat: 'D' },
  { date: new Date(Date.UTC(1855, 11 - 1, 1)), total: 37853, disease: 178, wounds: 33, other: 32, cat: 'A' },
  { date: new Date(Date.UTC(1855, 12 - 1, 1)), total: 43217, disease: 91, wounds: 18, other: 28, cat: 'A' },
  { date: new Date(Date.UTC(1856, 1 - 1, 1)), total: 44212, disease: 42, wounds: 2, other: 48, cat: 'E' },
  { date: new Date(Date.UTC(1856, 2 - 1, 1)), total: 43485, disease: 24, wounds: 0, other: 19, cat: 'B' },
  { date: new Date(Date.UTC(1856, 3 - 1, 1)), total: 46140, disease: 15, wounds: 0, other: 35, cat: 'C' }
];

const dataWithNulls = [
  { a: 1, b: true },
  { a: 0, b: true },
  { a: null, b: false },
  { a: 0, b: true },
  { a: 1, b: false },
  { a: 1, b: true },
  { a: 0, b: false },
  { a: null, b: true }
];

const underscored = d => String(d).split('').join('_');

tape('basic funtionality', t => {
  const ag = plugmein();

  t.ok(typeof ag === 'function', 'plugmein returns a function');
  t.ok(typeof ag.data === 'function', 'plugmein has a data function');
  t.ok(ag.data === ag, 'plugmein data function is a self ref');

  t.ok(Array.isArray(ag(crimeaData)), 'plugmein returns an array');
  t.ok(Array.isArray(ag.data(crimeaData)), 'plugmein.data returns an array');
  t.throws(ag, /^TypeError:/, 'plugmein only accepts arrays');
  t.throws(ag.data, /^TypeError:/, 'plugmein.data only accepts arrays');

  t.end();
});

tape('join by string', t => {
  const r = plugmein().groupBy('cat').data(crimeaData);
  t.equal(r.length, 5, 'grouping works for strings');
  t.deepEqual(r.map(d => d.key), [ 'A', 'B', 'C', 'D', 'E' ], 'correct keys returned');
  t.end();
});

tape('join by accessor function', t => {
  const r = plugmein().groupBy(d => d.cat).data(crimeaData);
  t.equal(r.length, 5, 'grouping works for strings');
  t.deepEqual(r.map(d => d.key), [ 'A', 'B', 'C', 'D', 'E' ], 'correct keys returned');
  t.end();
});

tape('join can be reset with a null', t => {
  const ag = plugmein();
  const r1 = ag.groupBy('cat').data(crimeaData);
  t.equal(r1.length, 5, 'grouping works for strings');
  const r2 = ag.groupBy(null).data(crimeaData);
  t.equal(r2.length, 1, 'grouping works for strings');
  t.equal(r2[0].values.length, crimeaData.length, 'grouping works for strings');
  t.end();
});

tape('join works with nested arrays', t => {
  const data = [
    [ 3, 15 ], [ 6, 26 ], [ 6, 34 ], [ 9, 43 ], [ 3, 11 ],
    [ 9, 28 ], [ 9, 33 ], [ 6, 40 ], [ 6, 61 ], [ 9, 9 ]
  ];
  const r1 = plugmein().groupBy(0).sum(1).sum(1, null, 'sum').data(data);
  t.equal(r1.length, 3, 'grouping works for numbers');
  t.deepEqual(r1.map(d => d.sum_1), [ 26, 161, 113 ], 'aggregate values are correct (1)');
  t.deepEqual(r1.map(d => d.sum), [ 26, 161, 113 ], 'aggregate values are correct (2)');
  t.end();
});

tape('nested grouping and aggregations', t => {
  const r1 = plugmein().groupBy([ d => d.date.getUTCFullYear(), 'cat' ]).sum('wounds').data(crimeaData);
  t.equal(r1.length, 3, 'level-1 grouping by year');
  t.deepEqual(r1.map(d => d.sum_wounds), [ 615, 1141, 2 ], 'summing top categories');
  t.deepEqual(r1.map(d => d.values.length), [ 4, 5, 3 ], 'number of children is ok');

  const group1 = r1[0];
  t.deepEqual(group1.values.map(d => d.sum_wounds), [ 81, 1, 132, 401 ], 'summing subgroup1 categories');
  t.deepEqual(group1.values.map(d => d.values.length), [ 2, 2, 3, 2 ], 'number of subgroup1 children is ok');
  t.equal(group1.key, 1854, 'subgroup1 is correctly keyed');
  t.equal(group1.values[0].key, 'A', 'subgroup1/subgroup1 is correctly keyed');

  const group2 = r1[1];
  t.deepEqual(group2.values.map(d => d.sum_wounds), [ 132, 227, 517, 101, 164 ], 'summing subgroup2 categories');
  t.deepEqual(group2.values.map(d => d.values.length), [ 2, 4, 3, 2, 1 ], 'number of subgroup2 children is ok');
  t.equal(group2.key, 1855, 'subgroup2 is correctly keyed');
  t.equal(group2.values[0].key, 'B', 'subgroup2/subgroup1 is correctly keyed');

  t.end();
});

tape('join by partial date', t => {
  const r1 = plugmein().groupBy(d => d.date.getUTCFullYear()).count('total').sum('total').data(crimeaData);
  t.equal(r1.length, 3, 'grouping works for dates');
  t.deepEqual(r1.map(d => d.key), [ 1854, 1855, 1856 ], 'correct keys returned');
  t.deepEqual(r1.map(d => d.count_total), [ 9, 12, 3 ], 'aggregate values are correct (1)');
  t.deepEqual(r1.map(d => d.sum_total), [ 242703, 462941, 133837 ], 'aggregate values are correct (2)');
  t.end();
});

tape('aggregate by sum', t => {
  const r1 = plugmein().groupBy('cat').sum('disease').sum('wounds').data(crimeaData);
  t.equal(r1.length, 5);
  t.deepEqual(r1.map(d => d.key), [ 'A', 'B', 'C', 'D', 'E' ], 'grouping checks out');
  t.deepEqual(r1.map(d => d.sum_disease), [ 3560, 4133, 3084, 3174, 525 ], 'aggregate values are correct (1)');
  t.deepEqual(r1.map(d => d.sum_wounds), [ 308, 133, 649, 502, 166 ], 'aggregate values are correct (2)');
  // can create override value accessors
  const r2 = plugmein().groupBy('cat').sum('disease', underscored).data(crimeaData);
  t.deepEqual(r2.map(d => d.sum_disease), [ '3_5_6_0', '4_1_3_3', '3_0_8_4', '3_1_7_4', '5_2_5' ], 'transformer works');
  // can create override key names
  const r3 = plugmein().groupBy('cat').sum('disease').sum('disease', null, '_test').data(crimeaData);
  t.deepEqual(r3.map(d => d._test), [ 3560, 4133, 3084, 3174, 525 ], 'key overrides work');
  t.end();
});

tape('aggregate by mean', t => {
  const r1 = plugmein().groupBy('cat').mean('disease').mean('wounds').data(crimeaData);
  t.equal(r1.length, 5);
  t.deepEqual(r1.map(d => d.key), [ 'A', 'B', 'C', 'D', 'E' ], 'grouping checks out');
  t.deepEqual(r1.map(d => d.mean_disease), [ 593.3333333333334, 826.6, 440.57142857142856, 793.5, 262.5 ], 'aggregate values are correct (1)');
  t.deepEqual(r1.map(d => d.mean_wounds), [ 51.333333333333336, 26.6, 92.71428571428571, 125.5, 83 ], 'aggregate values are correct (2)');
  // can create override value accessors
  const r2 = plugmein().groupBy('cat').mean('disease', underscored).data(crimeaData);
  t.deepEqual(r2.map(d => d.mean_disease), [ '5_9_3_._3_3_3_3_3_3_3_3_3_3_3_3_4', '8_2_6_._6', '4_4_0_._5_7_1_4_2_8_5_7_1_4_2_8_5_6', '7_9_3_._5', '2_6_2_._5' ], 'transformer works');
  // can create override key names
  const r3 = plugmein().groupBy('cat').mean('disease').mean('disease', null, '_test').data(crimeaData);
  t.deepEqual(r3.map(d => d._test), [ 593.3333333333334, 826.6, 440.57142857142856, 793.5, 262.5 ], 'key overrides work');
  t.end();
});

tape('aggregate by count', t => {
  const r1 = plugmein().groupBy('cat').count('disease').count('wounds').data(crimeaData);
  t.equal(r1.length, 5);
  t.deepEqual(r1.map(d => d.key), [ 'A', 'B', 'C', 'D', 'E' ], 'grouping checks out');
  t.deepEqual(r1.map(d => d.count_disease), [ 6, 5, 7, 4, 2 ], 'aggregate values are correct (1)');
  t.deepEqual(r1.map(d => d.count_wounds), [ 6, 4, 5, 4, 2 ], 'aggregate values are correct (2)');
  // can create override value accessors
  const r2 = plugmein().groupBy('cat').count('disease', d => '_' + d).data(crimeaData);
  t.deepEqual(r2.map(d => d.count_disease), [ '_6', '_5', '_7', '_4', '_2' ], 'transformer works');
  // can create override key names
  const r3 = plugmein().groupBy('cat').count('disease').count('disease', null, '_test').data(crimeaData);
  t.deepEqual(r3.map(d => d._test), [ 6, 5, 7, 4, 2 ], 'key overrides work');
  t.end();
});

tape('aggregate by uniq', t => {
  const r1 = plugmein().groupBy('cat').uniq('disease').uniq('wounds').data(crimeaData);
  t.equal(r1.length, 5);
  t.deepEqual(r1.map(d => d.key), [ 'A', 'B', 'C', 'D', 'E' ], 'grouping checks out');
  t.deepEqual(r1.map(d => d.uniq_disease), [
    [ 1, 788, 2120, 382, 178, 91 ],
    [ 12, 828, 2761, 508, 24 ],
    [ 11, 359, 503, 1205, 802, 189, 15 ],
    [ 844, 1725, 477, 128 ],
    [ 483, 42 ]
  ], 'aggregate values are correct (1)');
  t.deepEqual(r1.map(d => d.uniq_wounds), [
    [ 0, 81, 42, 134, 33, 18 ],
    [ 0, 1, 83, 49 ],
    [ 0, 132, 32, 209, 276 ],
    [ 287, 114, 48, 53 ],
    [ 164, 2 ]
  ], 'aggregate values are correct (2)');
  // can create override value accessors
  const r2 = plugmein().groupBy('cat').uniq('disease', d => d.join(':')).data(crimeaData);
  t.deepEqual(r2.map(d => d.uniq_disease), [
    '1:788:2120:382:178:91',
    '12:828:2761:508:24',
    '11:359:503:1205:802:189:15',
    '844:1725:477:128',
    '483:42'
  ], 'transformer works');
  // can create override key names
  const r3 = plugmein().groupBy('cat').uniq('disease').uniq('disease', null, '_test').data(crimeaData);
  t.deepEqual(r3.map(d => d._test), [
    [ 1, 788, 2120, 382, 178, 91 ],
    [ 12, 828, 2761, 508, 24 ],
    [ 11, 359, 503, 1205, 802, 189, 15 ],
    [ 844, 1725, 477, 128 ],
    [ 483, 42 ]
  ], 'key overrides work');
  // strings
  const r4 = plugmein().uniq('cat').data(crimeaData)[0];
  t.deepEqual(r4.uniq_cat, [ 'A', 'B', 'C', 'D', 'E' ], 'uniq over strings');
  // mixed mode
  const r5 = plugmein().uniq(0).data([ [ 1 ], [ 2 ], [ 3 ], [ '2' ], [ '1' ], [ 2 ], [ 3 ], [], [ null ] ])[0];
  t.deepEqual(r5.uniq_0, [ 1, 2, 3, '2', '1', null ], 'uniq over mixed types');
  // dates
  const r6 = plugmein().uniq(0).data([ 12e11, 13e11, 14e11, 13e11 ].map(d => [ new Date(d) ]))[0];
  t.deepEqual(r6.uniq_0.length, 3, 'uniq over dates');
  t.deepEqual(r6.uniq_0.map(d => typeof d), [ 'object', 'object', 'object' ], 'uniq over dates');
  t.end();
});

tape('aggregate by min', t => {
  const r1 = plugmein().groupBy('cat').min('disease').min('wounds').data(crimeaData);
  t.equal(r1.length, 5);
  t.deepEqual(r1.map(d => d.key), [ 'A', 'B', 'C', 'D', 'E' ], 'grouping checks out');
  t.deepEqual(r1.map(d => d.min_disease), [ 1, 12, 11, 128, 42 ], 'aggregate values are correct (1)');
  t.deepEqual(r1.map(d => d.min_wounds), [ 0, 0, 0, 48, 2 ], 'aggregate values are correct (2)');
  // can create override value accessors
  const r2 = plugmein().groupBy('cat').min('disease', underscored).data(crimeaData);
  t.deepEqual(r2.map(d => d.min_disease), [ '1', '1_2', '1_1', '1_2_8', '4_2' ], 'transformer works');
  // can create override key names
  const r3 = plugmein().groupBy('cat').min('disease').min('disease', null, '_test').data(crimeaData);
  t.deepEqual(r3.map(d => d._test), [ 1, 12, 11, 128, 42 ], 'key overrides work');
  // strings
  const r4 = plugmein().min('cat').data(crimeaData)[0];
  t.equal(r4.min_cat, 'A', 'min strings');
  // mixed mode
  const r5 = plugmein().min(0).data([ [ 1 ], [ 2 ], [ 3 ], [ '2' ], [ '1' ], [ 2 ], [ 3 ], [], [ null ] ])[0];
  t.equal(r5.min_0, null, 'min over mixed types');
  // dates
  const r6 = plugmein().min(0).data([ 12e11, 13e11, 14e11, 13e11 ].map(d => [ new Date(d) ]))[0];
  t.equal(r6.min_0 * 1, 12e11, 'min over dates');
  t.equal(typeof r6.min_0, 'object', 'min over dates');
  t.end();
});

tape('aggregate by max', t => {
  const r1 = plugmein().groupBy('cat').max('disease').max('wounds').data(crimeaData);
  t.equal(r1.length, 5);
  t.deepEqual(r1.map(d => d.key), [ 'A', 'B', 'C', 'D', 'E' ], 'grouping checks out');
  t.deepEqual(r1.map(d => d.max_disease), [ 2120, 2761, 1205, 1725, 483 ], 'aggregate values are correct (1)');
  t.deepEqual(r1.map(d => d.max_wounds), [ 134, 83, 276, 287, 164 ], 'aggregate values are correct (2)');
  // can create override value accessors
  const r2 = plugmein().groupBy('cat').max('disease', underscored).data(crimeaData);
  t.deepEqual(r2.map(d => d.max_disease), [ '2_1_2_0', '2_7_6_1', '1_2_0_5', '1_7_2_5', '4_8_3' ], 'transformer works');
  // can create override key names
  const r3 = plugmein().groupBy('cat').max('disease').max('disease', null, '_test').data(crimeaData);
  t.deepEqual(r3.map(d => d._test), [ 2120, 2761, 1205, 1725, 483 ], 'key overrides work');
  // strings
  const r4 = plugmein().max('cat').data(crimeaData)[0];
  t.equal(r4.max_cat, 'E', 'max strings');
  // mixed mode
  const r5 = plugmein().max(0).data([ [ 1 ], [ 2 ], [ 3 ], [ '2' ], [ '1' ], [ 2 ], [ 3 ], [], [ null ] ])[0];
  t.equal(r5.max_0, 3, 'max over mixed types');
  // dates
  const r6 = plugmein().max(0).data([ 12e11, 13e11, 14e11, 13e11 ].map(d => [ new Date(d) ]))[0];
  t.equal(r6.max_0 * 1, 14e11, 'max over dates');
  t.equal(typeof r6.max_0, 'object', 'max over dates');
  t.end();
});

tape('aggregate by range', t => {
  const r1 = plugmein().groupBy('cat').range('disease').range('wounds').data(crimeaData);
  t.equal(r1.length, 5);
  t.deepEqual(r1.map(d => d.key), [ 'A', 'B', 'C', 'D', 'E' ], 'grouping checks out');
  t.deepEqual(r1.map(d => d.range_disease), [ [ 1, 2120 ], [ 12, 2761 ], [ 11, 1205 ], [ 128, 1725 ], [ 42, 483 ] ], 'aggregate values are correct (1)');
  t.deepEqual(r1.map(d => d.range_wounds), [ [ 0, 134 ], [ 0, 83 ], [ 0, 276 ], [ 48, 287 ], [ 2, 164 ] ], 'aggregate values are correct (2)');
  // can create override value accessors
  const r2 = plugmein().groupBy('cat').range('disease', d => d.join('_')).data(crimeaData);
  t.deepEqual(r2.map(d => d.range_disease), [ '1_2120', '12_2761', '11_1205', '128_1725', '42_483' ], 'transformer works');
  // can create override key names
  const r3 = plugmein().groupBy('cat').range('disease').range('disease', null, '_test').data(crimeaData);
  t.deepEqual(r3.map(d => d._test), [ [ 1, 2120 ], [ 12, 2761 ], [ 11, 1205 ], [ 128, 1725 ], [ 42, 483 ] ], 'key overrides work');
  // strings
  const r4 = plugmein().range('cat').data(crimeaData)[0];
  t.deepEqual(r4.range_cat, [ 'A', 'E' ], 'range strings');
  // mixed mode
  const r5 = plugmein().range(0).data([ [ 1 ], [ 2 ], [ 3 ], [ '2' ], [ '1' ], [ 2 ], [ 3 ], [], [ null ] ])[0];
  t.deepEqual(r5.range_0, [ null, 3 ], 'range over mixed types');
  // dates
  const r6 = plugmein().range(0).data([ 12e11, 13e11, 14e11, 13e11 ].map(d => [ new Date(d) ]))[0];
  t.deepEqual(r6.range_0.map(Number), [ 12e11, 14e11 ], 'range over dates');
  t.deepEqual([ typeof r6.range_0[0], typeof r6.range_0[0] ], [ 'object', 'object' ], 'one over dates');
  t.end();
});

tape('aggregate by one', t => {
  const r1 = plugmein().groupBy('cat').one('disease').one('wounds').data(crimeaData);
  t.equal(r1.length, 5);
  t.deepEqual(r1.map(d => d.key), [ 'A', 'B', 'C', 'D', 'E' ], 'grouping checks out');
  t.deepEqual(r1.map(d => d.disease), [ 1, 12, 11, 844, 483 ], 'aggregate values are correct (1)');
  t.deepEqual(r1.map(d => d.wounds), [ 0, 0, 0, 287, 164 ], 'aggregate values are correct (2)');
  // can create override value accessors
  const r2 = plugmein().groupBy('cat').one('disease', underscored).data(crimeaData);
  t.deepEqual(r2.map(d => d.disease), [ '1', '1_2', '1_1', '8_4_4', '4_8_3' ], 'transformer works');
  // can create override key names
  const r3 = plugmein().groupBy('cat').one('disease').one('disease', null, '_test').data(crimeaData);
  t.deepEqual(r3.map(d => d._test), [ 1, 12, 11, 844, 483 ], 'key overrides work');
  // strings
  const r4 = plugmein().one('cat').data(crimeaData)[0];
  t.deepEqual(r4.cat, 'A', 'one strings');
  // mixed mode
  const r5 = plugmein().one(0).data([ [ 1 ], [ 2 ], [ 3 ], [ '2' ], [ '1' ], [ 2 ], [ 3 ], [], [ null ] ])[0];
  t.deepEqual(r5[0], 1, 'one over mixed types');
  // dates
  const r6 = plugmein().one(0).data([ 12e11, 13e11, 14e11, 13e11 ].map(d => [ new Date(d) ]))[0];
  t.equal(r6[0] * 1, 12e11, 'one over dates');
  t.equal(typeof r6[0], 'object', 'one over dates');
  t.end();
});

tape('custom aggregations', t => {
  const median = vals => {
    const _ = vals.filter(d => isFinite(d)).sort((a, b) => a - b);
    return (_.length % 2) ? _[~~(_.length / 2)] : _[_.length / 2 - 1] / 2 + _[_.length / 2] / 2;
  };
  const r1 = plugmein().aggregate('total', median, null, 'median_total').data(crimeaData)[0];
  t.equal(r1.median_total, 32586, 'custom median filter');
  const freq = vals => {
    return vals.reduce((a, b) => { a[b] = (b in a ? a[b] + 1 : 1); return a; }, {});
  };
  const r2 = plugmein().aggregate('cat', freq, null, 'freq_cat').data(crimeaData)[0];
  t.deepEqual(r2.freq_cat, { C: 7, B: 5, E: 2, A: 6, D: 4 }, 'frequency aggregator');
  t.end();
});

tape('filter by value', t => {
  const r1 = plugmein().filter('wounds', 0).data(crimeaData)[0].values;
  t.equal(r1.length, 6, 'only zeros');
  const r2 = plugmein().filter('cat', 'D').data(crimeaData)[0].values;
  t.equal(r2.length, 4, 'only string');
  const r3 = plugmein().filter('date', new Date(Date.UTC(1856, 1 - 1, 1))).data(crimeaData)[0].values;
  t.equal(r3.length, 1, 'only date');
  const r4 = plugmein().filter('a', true).data(dataWithNulls)[0].values;
  t.equal(r4.length, 0, 'no matches');
  const r5 = plugmein().filter('a', 0).data(dataWithNulls)[0].values;
  t.equal(r5.length, 3, 'only zeros');
  const r6 = plugmein().filter('b', true).data(dataWithNulls)[0].values;
  t.equal(r6.length, 5, 'only true');
  const r7 = plugmein().filter('b', false).data(dataWithNulls)[0].values;
  t.equal(r7.length, 3, 'only false');
  const r8 = plugmein().filter('date', undefined).data(crimeaData)[0].values;
  t.equal(r8.length, crimeaData.length, 'ignore undefined filtervalue');
  t.end();
});

tape('filter by date range', t => {
  const date1st = new Date(Date.UTC(1854, 10 - 1, 1));
  const date2nd = new Date(Date.UTC(1855, 8 - 1, 1));
  const r1 = plugmein().between('date', [ null, date2nd ]).data(crimeaData)[0];
  t.equal(r1.values.length, 17, 'before date');
  const r2 = plugmein().between('date', [ date1st, null ]).data(crimeaData)[0];
  t.equal(r2.values.length, 18, 'after date');
  const r3 = plugmein().between('date', [ date1st, date2nd ]).data(crimeaData)[0];
  t.equal(r3.values.length, 11, 'between dates');
  const r4 = plugmein().between('date', [ date1st, date1st ]).data(crimeaData)[0];
  t.equal(r4.values.length, 1, 'single date range');
  const r5 = plugmein().between('date', [ date1st ]).data(crimeaData)[0];
  t.equal(r5.values.length, 1, 'single date range');
  const r6 = plugmein().between('date', date1st).data(crimeaData)[0];
  t.equal(r6.values.length, 1, 'single date range');
  t.end();
});

tape('filter by number range', t => {
  // numbers
  const num1 = 30107;
  const r1 = plugmein().between('total', [ null, 40000 ]).data(crimeaData)[0];
  t.equal(r1.values.length, 16, 'before number');
  const r2 = plugmein().between('total', [ num1, null ]).data(crimeaData)[0];
  t.equal(r2.values.length, 19, 'after number');
  const r3 = plugmein().between('total', [ num1, 40000 ]).data(crimeaData)[0];
  t.equal(r3.values.length, 11, 'between numbers');
  const r4 = plugmein().between('total', [ num1, num1 ]).data(crimeaData)[0];
  t.equal(r4.values.length, 1, 'single number range');
  const r5 = plugmein().between('total', [ num1 ]).data(crimeaData)[0];
  t.equal(r5.values.length, 1, 'single number range');
  const r6 = plugmein().between('total', num1).data(crimeaData)[0];
  t.equal(r6.values.length, 1, 'single number range');
  // test zeros
  const r8 = plugmein().between(0, [ -2, 0 ])
    .data([ [ 1 ], [ 0 ], [ -1 ], [ 2 ], [ 0 ], [ -2 ], [ -3 ], [ 3 ] ])[0];
  t.deepEqual(r8.values, [ [ 0 ], [ -1 ], [ 0 ], [ -2 ] ], 'range with zeros');
  t.end();
});

tape('filter by string range', t => {
  // numbers
  const str1 = 'B';
  const r1 = plugmein().between('cat', [ null, 'D' ]).data(crimeaData)[0];
  t.equal(r1.values.length, 22, 'before string');
  const r2 = plugmein().between('cat', [ str1, null ]).data(crimeaData)[0];
  t.equal(r2.values.length, 18, 'after string');
  const r3 = plugmein().between('cat', [ str1, 'D' ]).data(crimeaData)[0];
  t.equal(r3.values.length, 16, 'between strings');
  const r4 = plugmein().between('cat', [ str1, str1 ]).data(crimeaData)[0];
  t.equal(r4.values.length, 5, 'single string range');
  const r5 = plugmein().between('cat', [ str1 ]).data(crimeaData)[0];
  t.equal(r5.values.length, 5, 'single string range');
  const r6 = plugmein().between('cat', str1).data(crimeaData)[0];
  t.equal(r6.values.length, 5, 'single string range');
  // test zeros
  const r8 = plugmein().between(0, [ -2, 0 ])
    .data([ [ 1 ], [ 0 ], [ -1 ], [ 2 ], [ 0 ], [ -2 ], [ -3 ], [ 3 ] ])[0];
  t.deepEqual(r8.values, [ [ 0 ], [ -1 ], [ 0 ], [ -2 ] ], 'range with zeros');
  t.end();
});

tape('custom filter function', t => {
  const exp1 = [ 28772, 30246, 30290, 29736, 32252, 44614, 46852, 44212, 46140 ];
  const r1 = plugmein().filter('total', d => !(d % 2)).data(crimeaData)[0].values;
  t.deepEqual(r1.map(d => d.total), exp1, 'even numbers');
  const r2 = plugmein().filter('date', (d, v) => v.getUTCDay() === 1).data(crimeaData)[0].values;
  t.deepEqual(r2.map(d => d.total), [ 23333, 32393, 46852 ], 'only mondays');

  // passing simple functions can be used too...
  const r3 = plugmein().filter(d => !(d.total % 2)).data(crimeaData)[0].values;
  t.deepEqual(r3.map(d => d.total), exp1, 'even numbers (fn)');
  const r4 = plugmein().filter(d => d.date.getUTCDay() === 1).data(crimeaData)[0].values;
  t.deepEqual(r4.map(d => d.total), [ 23333, 32393, 46852 ], 'only mondays (fn)');

  t.end();
});

tape('token filter', t => {
  const r1 = plugmein().in('cat', [ 'A', 'B' ]).groupBy('cat').data(crimeaData);
  t.equal(r1.length, 2, 'choice of strings');
  const r2 = plugmein().in('cat', 'A').groupBy('cat').data(crimeaData);
  t.equal(r2.length, 1, 'single string make single group');
  t.equal(r2[0].values.length, 6, 'single string');
  const r3 = plugmein().in('cat', [ 'A' ]).groupBy('cat').data(crimeaData);
  t.equal(r3.length, 1, 'single [string] make single group');
  t.equal(r3[0].values.length, 6, 'single [string]');
  const r4 = plugmein().in('wounds', [ 0, 1, 2 ]).data(crimeaData)[0];
  t.equal(r4.values.length, 8, 'single [string]');
  const r5 = plugmein().in('a', [ null ]).data(dataWithNulls)[0];
  t.equal(r5.values.length, 2, '[ null ]');
  const r6 = plugmein().in('a', null).data(dataWithNulls)[0];
  t.equal(r6.values.length, 2, 'null');
  t.end();
});

tape('sortKeys', t => {
  const unsorted = [ 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1, 2 ];
  const sorted = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ];

  const r1 = plugmein().groupBy(d => d.date.getUTCMonth()).data(crimeaData);
  t.deepEqual(r1.map(d => d.key), unsorted, 'unsorted by default');

  // can ask for sorted keys
  const r2 = plugmein().groupBy(d => d.date.getUTCMonth()).sortKeys().data(crimeaData);
  t.deepEqual(r2.map(d => d.key), sorted, 'trigger sorting by empty call');

  const a1 = plugmein().groupBy(d => d.date.getUTCMonth()).sortKeys(true);
  const r3 = a1.data(crimeaData);
  t.deepEqual(r3.map(d => d.key), sorted, 'trigger sorting by TRUE');

  // can disable sorting again
  const r4 = a1.sortKeys(false).data(crimeaData);
  t.deepEqual(r4.map(d => d.key), unsorted, 'disable sorting by FALSE');

  // can pass a custom sorting function
  const r5 = a1.sortKeys((a, b) => b - a).data(crimeaData);
  t.deepEqual(r5.map(d => d.key), [ 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0 ], 'custom key sorting function');

  t.end();
});

tape('cloning works', t => {
  const ag = plugmein().groupBy('cat').filter('disease', d => d > 100);
  const r1 = ag.data(crimeaData);
  t.equal(r1.length, 5, 'grouping works for strings');
  t.deepEqual(r1.map(d => d.key), [ 'C', 'B', 'A', 'D', 'E' ], 'correct keys returned');
  const r2 = ag.copy().data(crimeaData);
  t.equal(r2.length, 5, 'grouping works for strings in copy');
  t.deepEqual(r2.map(d => d.key), [ 'C', 'B', 'A', 'D', 'E' ], 'correct keys returned by copy');
  const r3 = ag.copy().in('cat', [ 'A', 'B' ]).data(crimeaData);
  t.equal(r3.length, 2, 'grouping works for strings in copy with filter');
  t.deepEqual(r3.map(d => d.key), [ 'B', 'A' ], 'correct keys returned by copy with filter');
  t.end();
});
