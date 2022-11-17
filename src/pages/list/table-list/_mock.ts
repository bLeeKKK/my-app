// eslint-disable-next-line import/no-extraneous-dependencies
// import type { BasicListItem } from './types.d';
import type { Request, Response } from 'express';
import { MOCKER_API } from '../../../services/constants';

function fakeList(): any[] {
  return [
    {
      period: '2022年一月 XXX',
      statistic: {
        intfDescription: null,
        intfTag: null,
        sendSystem: null,
        receiveSystem: null,
        intfTotal: 0,
        intfSuccessTotal: 0,
        successRate: 100,
        successRateLastPeriod: 100,
        successRateDifference: 0,
        intfAgingAverage: 79,
        intfAgingLongest: 99,
        intfAgingShortest: 8,
        intfAgingAverageLastPeriod: 79,
        intfAgingLongestLastPeriod: 99,
        intfAgingShortestLastPeriod: 8,
        intfAgingAverageDifference: 0,
        intfAgingLongestDifference: 0,
        intfAgingShortestDifference: 0,
        eventAgingAverage: 1.79,
        eventAgingLongest: 1.99,
        eventAgingShortest: 1.08,
        eventAgingAverageLastPeriod: 1.79,
        eventAgingLongestLastPeriod: 1.99,
        eventAgingShortestLastPeriod: 1.08,
        eventAgingAverageDifference: 0,
        eventAgingLongestDifference: 0,
        eventAgingShortestDifference: 0,
      },
    },
    {
      period: '2022年二月 XXX',
      statistic: {
        intfDescription: null,
        intfTag: null,
        sendSystem: null,
        receiveSystem: null,
        intfTotal: 0,
        intfSuccessTotal: 0,
        successRate: 100,
        successRateLastPeriod: 100,
        successRateDifference: 0,
        intfAgingAverage: 79,
        intfAgingLongest: 99,
        intfAgingShortest: 8,
        intfAgingAverageLastPeriod: 79,
        intfAgingLongestLastPeriod: 99,
        intfAgingShortestLastPeriod: 8,
        intfAgingAverageDifference: 0,
        intfAgingLongestDifference: 0,
        intfAgingShortestDifference: 0,
        eventAgingAverage: 1.79,
        eventAgingLongest: 1.99,
        eventAgingShortest: 1.08,
        eventAgingAverageLastPeriod: 1.79,
        eventAgingLongestLastPeriod: 1.99,
        eventAgingShortestLastPeriod: 1.08,
        eventAgingAverageDifference: 0,
        eventAgingLongestDifference: 0,
        eventAgingShortestDifference: 0,
      },
    },
  ];
}

// let sourceData: BasicListItem[] = [];

function getFakeList(req: Request, res: Response) {
  // const params = req.query as any;

  const result = fakeList();
  // sourceData = result;
  return res.json({
    data: result,
  });
}

export default {
  ['POST  ' + MOCKER_API + '/bizlog-core/statistic/overallData']: getFakeList,
};
