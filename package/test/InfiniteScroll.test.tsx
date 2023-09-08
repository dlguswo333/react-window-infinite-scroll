import {test, expect} from '@playwright/experimental-ct-react17';
import {StaticData1, StaticData2} from './Components';
import React from 'react';

test.use({viewport: {width: 1000, height: 1000}});

test('With static data 1', async ({mount}) => {
  const component = await mount(<StaticData1 />);
  await expect(component).toContainText('0');
});

test('With static data 2', async ({mount}) => {
  const component = await mount(<StaticData2 />);
  await expect(component).toContainText('0');
  await expect(component).toContainText('1');
  await expect(component).toContainText('2');
});
