//  © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { SortByPipe } from './sort-by.pipe';

describe('SortByPipe', () => {
  const arrayToSort = [
    {
      'controlLevel': 3,
      'cumul': {
        'mean': 10.976744186046512,
        'sd': 0.7396386535079259,
        'cv': 6.73823349594085,
        'numPoints': 43
      },
      'month': {
        'mean': 10.986486486486486,
        'sd': 0.7307950866823036,
        'cv': 6.651763396616294,
        'numPoints': 74
      }
    },
    {
      'controlLevel': 1,
      'cumul': {
        'mean': 30.976744186046513,
        'sd': 0.7396386535079112,
        'cv': 2.3877223799429568,
        'numPoints': 43
      },
      'month': {
        'mean': 30.986486486486488,
        'sd': 0.7307950866822355,
        'cv': 2.3584315924328574,
        'numPoints': 74
      }
    }
  ];
  const SortedArray = [
    {
      'controlLevel': 1,
      'cumul': {
        'mean': 30.976744186046513,
        'sd': 0.7396386535079112,
        'cv': 2.3877223799429568,
        'numPoints': 43
      },
      'month': {
        'mean': 30.986486486486488,
        'sd': 0.7307950866822355,
        'cv': 2.3584315924328574,
        'numPoints': 74
      }
    },
    {
      'controlLevel': 3,
      'cumul': {
        'mean': 10.976744186046512,
        'sd': 0.7396386535079259,
        'cv': 6.73823349594085,
        'numPoints': 43
      },
      'month': {
        'mean': 10.986486486486486,
        'sd': 0.7307950866823036,
        'cv': 6.651763396616294,
        'numPoints': 74
      }
    },
  ];

  it('create an instance', () => {
    const pipe = new SortByPipe();
    expect(pipe).toBeTruthy();
  });

  it('should return sorted output', () => {
    const pipe = new SortByPipe();
    const value = arrayToSort;
    expect(pipe.transform(value, 'asc', 'controlLevel')).toEqual(SortedArray);
  });

});
