import {test, expect} from '@playwright/experimental-ct-react17';
import {StaticData1, StaticData2, SimpleDynamicData} from './Components';
import React from 'react';

test.use({viewport: {width: 1000, height: 1000}});

test('With static data with initial data', async ({mount}) => {
  const component = await mount(<StaticData1 />);
  await expect(component).toContainText('0');
});

test('With static data without initial data', async ({mount}) => {
  const component = await mount(<StaticData2 />);
  await expect(component).toContainText('0');
  await expect(component).toContainText('1');
  await expect(component).toContainText('2');
});

test('Load more items synchronously with initial data', async ({mount}) => {
  const component = await mount(<SimpleDynamicData hasInitialData={true} howToLoad='sync' />);
  await expect(component).toContainText('0');
  await expect(component).toContainText('1');
  await expect(component).toContainText('2');
});

test('Load more items synchronously without initial data', async ({mount}) => {
  const component = await mount(<SimpleDynamicData hasInitialData={false} howToLoad='sync' />);
  await expect(component).toContainText('0');
  await expect(component).toContainText('1');
  await expect(component).toContainText('2');
});

test('Load more items asynchronously but instantly with initial data', async ({mount}) => {
  const component = await mount(<SimpleDynamicData hasInitialData={true} howToLoad='instantAsync' />);
  await expect(component).toContainText('0');
  await expect(component).toContainText('1');
  await expect(component).toContainText('2');
});

test('Load more items asynchronously but instantly without initial data', async ({mount}) => {
  const component = await mount(<SimpleDynamicData hasInitialData={false} howToLoad='instantAsync' />);
  await expect(component).toContainText('0');
  await expect(component).toContainText('1');
  await expect(component).toContainText('2');
});

test('Load more items asynchronously but fast with initial data', async ({mount}) => {
  const component = await mount(<SimpleDynamicData hasInitialData={true} howToLoad='fastAsync' />);
  await expect(component).toContainText('0');
  await expect(component).toContainText('1');
  await expect(component).toContainText('2');
});

test('Load more items asynchronously but fast without initial data', async ({mount}) => {
  const component = await mount(<SimpleDynamicData hasInitialData={false} howToLoad='fastAsync' />);
  await expect(component).toContainText('0');
  await expect(component).toContainText('1');
  await expect(component).toContainText('2');
});

test('Load more items asynchronously but slowly with initial data', async ({mount}) => {
  const component = await mount(<SimpleDynamicData hasInitialData={true} howToLoad='slowAsync' />);
  await expect(component).toContainText('0');
  await expect(component).toContainText('1');
  await expect(component).toContainText('2');
});

test('Load more items asynchronously but slowly without initial data', async ({mount}) => {
  const component = await mount(<SimpleDynamicData hasInitialData={false} howToLoad='slowAsync' />);
  await expect(component).toContainText('0');
  await expect(component).toContainText('1');
  await expect(component).toContainText('2');
});
