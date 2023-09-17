import {test, expect, ComponentFixtures} from '@playwright/experimental-ct-react17';
import {StaticData1, StaticData2, SimpleDynamicData} from './Components';
import React from 'react';

test.use({viewport: {width: 1000, height: 1000}});

const scrollComponentToBottom = (component: Awaited<ReturnType<ComponentFixtures['mount']>>) => {
  return component.evaluate(element => {
    element.scrollTop = 100000;
  });
};

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
  const component = await mount(<SimpleDynamicData hasInitialData={true} howToLoad='sync' longerData={false} />);
  await expect(component).toContainText('0');
  await expect(component).toContainText('1');
  await expect(component).toContainText('2');
});

test('Load more items synchronously without initial data', async ({mount}) => {
  const component = await mount(<SimpleDynamicData hasInitialData={false} howToLoad='sync' longerData={false} />);
  await expect(component).toContainText('0');
  await expect(component).toContainText('1');
  await expect(component).toContainText('2');
});

test('Load more items asynchronously but instantly with initial data', async ({mount}) => {
  const component = await mount(<SimpleDynamicData hasInitialData={true} howToLoad='instantAsync' longerData={false} />);
  await expect(component).toContainText('0');
  await expect(component).toContainText('1');
  await expect(component).toContainText('2');
});

test('Load more items asynchronously but instantly without initial data', async ({mount}) => {
  const component = await mount(<SimpleDynamicData hasInitialData={false} howToLoad='instantAsync' longerData={false} />);
  await expect(component).toContainText('0');
  await expect(component).toContainText('1');
  await expect(component).toContainText('2');
});

test('Load more items asynchronously but fast with initial data', async ({mount}) => {
  const component = await mount(<SimpleDynamicData hasInitialData={true} howToLoad='fastAsync' longerData={false} />);
  await expect(component).toContainText('0');
  await expect(component).toContainText('1');
  await expect(component).toContainText('2');
});

test('Load more items asynchronously but fast without initial data', async ({mount}) => {
  const component = await mount(<SimpleDynamicData hasInitialData={false} howToLoad='fastAsync' longerData={false} />);
  await expect(component).toContainText('0');
  await expect(component).toContainText('1');
  await expect(component).toContainText('2');
});

test('Load more items asynchronously but slowly with initial data', async ({mount}) => {
  const component = await mount(<SimpleDynamicData hasInitialData={true} howToLoad='slowAsync' longerData={false} />);
  await expect(component).toContainText('0');
  await expect(component).toContainText('1');
  await expect(component).toContainText('2');
});

test('Load more items asynchronously but slowly without initial data', async ({mount}) => {
  const component = await mount(<SimpleDynamicData hasInitialData={false} howToLoad='slowAsync' longerData={false} />);
  await expect(component).toContainText('0');
  await expect(component).toContainText('1');
  await expect(component).toContainText('2');
});

test('Load more longer items synchronously with initial data', async ({mount}) => {
  const component = await mount(<SimpleDynamicData hasInitialData={true} howToLoad='sync' longerData={true} />);
  await expect(component).toContainText('0');
  await expect(component).toContainText('1');
  await expect(component).toContainText('2');

  await expect(component).not.toContainText('14');
  await scrollComponentToBottom(component);

  await expect(component).toContainText('10');
  await scrollComponentToBottom(component);

  await expect(component).toContainText('11');
  await scrollComponentToBottom(component);

  await expect(component).toContainText('12');
  await scrollComponentToBottom(component);

  await expect(component).toContainText('13');
  await scrollComponentToBottom(component);

  await expect(component).toContainText('14');
  await scrollComponentToBottom(component);
});

test('Load more longer items synchronously without initial data', async ({mount}) => {
  const component = await mount(<SimpleDynamicData hasInitialData={false} howToLoad='sync' longerData={true} />);
  await expect(component).toContainText('0');
  await expect(component).toContainText('1');
  await expect(component).toContainText('2');

  await expect(component).not.toContainText('14');
  await scrollComponentToBottom(component);

  await expect(component).toContainText('10');
  await scrollComponentToBottom(component);

  await expect(component).toContainText('11');
  await scrollComponentToBottom(component);

  await expect(component).toContainText('12');
  await scrollComponentToBottom(component);

  await expect(component).toContainText('13');
  await scrollComponentToBottom(component);

  await expect(component).toContainText('14');
  await scrollComponentToBottom(component);
});

test('Load more longer items asynchronously but instantly with initial data', async ({mount}) => {
  const component = await mount(<SimpleDynamicData hasInitialData={true} howToLoad='instantAsync' longerData={true} />);
  await expect(component).toContainText('0');
  await expect(component).toContainText('1');
  await expect(component).toContainText('2');

  await expect(component).not.toContainText('14');
  await scrollComponentToBottom(component);

  await expect(component).toContainText('10');
  await scrollComponentToBottom(component);

  await expect(component).toContainText('11');
  await scrollComponentToBottom(component);

  await expect(component).toContainText('12');
  await scrollComponentToBottom(component);

  await expect(component).toContainText('13');
  await scrollComponentToBottom(component);

  await expect(component).toContainText('14');
  await scrollComponentToBottom(component);
});

test('Load more longer items asynchronously but instantly without initial data', async ({mount}) => {
  const component = await mount(<SimpleDynamicData hasInitialData={false} howToLoad='instantAsync' longerData={true} />);
  await expect(component).toContainText('0');
  await expect(component).toContainText('1');
  await expect(component).toContainText('2');

  await expect(component).not.toContainText('14');
  await scrollComponentToBottom(component);

  await expect(component).toContainText('10');
  await scrollComponentToBottom(component);

  await expect(component).toContainText('11');
  await scrollComponentToBottom(component);

  await expect(component).toContainText('12');
  await scrollComponentToBottom(component);

  await expect(component).toContainText('13');
  await scrollComponentToBottom(component);

  await expect(component).toContainText('14');
  await scrollComponentToBottom(component);
});

test('Load more longer items asynchronously but fast with initial data', async ({mount}) => {
  const component = await mount(<SimpleDynamicData hasInitialData={true} howToLoad='fastAsync' longerData={true} />);
  await expect(component).toContainText('0');
  await expect(component).toContainText('1');
  await expect(component).toContainText('2');

  await expect(component).not.toContainText('14');
  await scrollComponentToBottom(component);

  await expect(component).toContainText('10');
  await scrollComponentToBottom(component);

  await expect(component).toContainText('11');
  await scrollComponentToBottom(component);

  await expect(component).toContainText('12');
  await scrollComponentToBottom(component);

  await expect(component).toContainText('13');
  await scrollComponentToBottom(component);

  await expect(component).toContainText('14');
  await scrollComponentToBottom(component);
});

test('Load more longer items asynchronously but fast without initial data', async ({mount}) => {
  const component = await mount(<SimpleDynamicData hasInitialData={false} howToLoad='fastAsync' longerData={true} />);
  await expect(component).toContainText('0');
  await expect(component).toContainText('1');
  await expect(component).toContainText('2');

  await expect(component).not.toContainText('14');
  await scrollComponentToBottom(component);

  await expect(component).toContainText('10');
  await scrollComponentToBottom(component);

  await expect(component).toContainText('11');
  await scrollComponentToBottom(component);

  await expect(component).toContainText('12');
  await scrollComponentToBottom(component);

  await expect(component).toContainText('13');
  await scrollComponentToBottom(component);

  await expect(component).toContainText('14');
  await scrollComponentToBottom(component);
});

test('Load more longer items asynchronously but slowly with initial data', async ({mount}) => {
  const component = await mount(<SimpleDynamicData hasInitialData={true} howToLoad='slowAsync' longerData={true} />);
  await expect(component).toContainText('0');
  await expect(component).toContainText('1');
  await expect(component).toContainText('2');

  await expect(component).not.toContainText('14');
  await scrollComponentToBottom(component);

  await expect(component).toContainText('10');
  await scrollComponentToBottom(component);

  await expect(component).toContainText('11');
  await scrollComponentToBottom(component);

  await expect(component).toContainText('12');
  await scrollComponentToBottom(component);

  await expect(component).toContainText('13');
  await scrollComponentToBottom(component);

  await expect(component).toContainText('14');
  await scrollComponentToBottom(component);
});

test('Load more longer items asynchronously but slowly without initial data', async ({mount}) => {
  const component = await mount(<SimpleDynamicData hasInitialData={false} howToLoad='slowAsync' longerData={true} />);
  await expect(component).toContainText('0');
  await expect(component).toContainText('1');
  await expect(component).toContainText('2');

  await expect(component).not.toContainText('14');
  await scrollComponentToBottom(component);

  await expect(component).toContainText('10');
  await scrollComponentToBottom(component);

  await expect(component).toContainText('11');
  await scrollComponentToBottom(component);

  await expect(component).toContainText('12');
  await scrollComponentToBottom(component);

  await expect(component).toContainText('13');
  await scrollComponentToBottom(component);

  await expect(component).toContainText('14');
  await scrollComponentToBottom(component);
});
