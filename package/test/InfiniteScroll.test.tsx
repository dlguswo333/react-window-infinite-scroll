import {test, expect, ComponentFixtures} from '@playwright/experimental-ct-react17';
import {StaticData1, StaticData2, SimpleDynamicData, BiDirectDynamicData, SomeFailDynamicData} from './Components';
import React from 'react';

test.use({viewport: {width: 1000, height: 1000}});

const scrollComponentToBottom = (component: Awaited<ReturnType<ComponentFixtures['mount']>>) => {
  return component.evaluate(element => {
    element.scrollTop = 100000;
    return element.scrollTop;
  });
};

const scrollComponentToTop = (component: Awaited<ReturnType<ComponentFixtures['mount']>>) => {
  return component.evaluate(element => {
    element.scrollTop = 0;
    return element.scrollTop;
  });
};

const getData = (component: Awaited<ReturnType<ComponentFixtures['mount']>>) => (
  component.evaluate(() => window.data)
);

test('With static data with initial data', async ({mount}) => {
  const component = await mount(<StaticData1 />);
  await expect(component).toContainText('<0>');
});

test('With static data without initial data', async ({mount}) => {
  const component = await mount(<StaticData2 />);
  await expect(component).toContainText('<0>');
  await expect(component).toContainText('<1>');
  await expect(component).toContainText('<2>');
});

test('Load more items synchronously with initial data', async ({mount}) => {
  const component = await mount(<SimpleDynamicData hasInitialData={true} howToLoad='sync' longerData={false} />);
  await expect(component).toContainText('<0>');
  await expect(component).toContainText('<1>');
  await expect(component).toContainText('<2>');
});

test('Load more items synchronously without initial data', async ({mount}) => {
  const component = await mount(<SimpleDynamicData hasInitialData={false} howToLoad='sync' longerData={false} />);
  await expect(component).toContainText('<0>');
  await expect(component).toContainText('<1>');
  await expect(component).toContainText('<2>');
});

test('Load more items asynchronously but instantly with initial data', async ({mount}) => {
  const component = await mount(<SimpleDynamicData hasInitialData={true} howToLoad='instantAsync' longerData={false} />);
  await expect(component).toContainText('<0>');
  await expect(component).toContainText('<1>');
  await expect(component).toContainText('<2>');
});

test('Load more items asynchronously but instantly without initial data', async ({mount}) => {
  const component = await mount(<SimpleDynamicData hasInitialData={false} howToLoad='instantAsync' longerData={false} />);
  await expect(component).toContainText('<0>');
  await expect(component).toContainText('<1>');
  await expect(component).toContainText('<2>');
});

test('Load more items asynchronously but fast with initial data', async ({mount}) => {
  const component = await mount(<SimpleDynamicData hasInitialData={true} howToLoad='fastAsync' longerData={false} />);
  await expect(component).toContainText('<0>');
  await expect(component).toContainText('<1>');
  await expect(component).toContainText('<2>');
});

test('Load more items asynchronously but fast without initial data', async ({mount}) => {
  const component = await mount(<SimpleDynamicData hasInitialData={false} howToLoad='fastAsync' longerData={false} />);
  await expect(component).toContainText('<0>');
  await expect(component).toContainText('<1>');
  await expect(component).toContainText('<2>');
});

test('Load more items asynchronously but slowly with initial data', async ({mount}) => {
  const component = await mount(<SimpleDynamicData hasInitialData={true} howToLoad='slowAsync' longerData={false} />);
  await expect(component).toContainText('<0>');
  await expect(component).toContainText('<1>');
  await expect(component).toContainText('<2>');
});

test('Load more items asynchronously but slowly without initial data', async ({mount}) => {
  const component = await mount(<SimpleDynamicData hasInitialData={false} howToLoad='slowAsync' longerData={false} />);
  await expect(component).toContainText('<0>');
  await expect(component).toContainText('<1>');
  await expect(component).toContainText('<2>');
});

test('Load more longer items synchronously with initial data', async ({mount}) => {
  const component = await mount(<SimpleDynamicData hasInitialData={true} howToLoad='sync' longerData={true} />);
  await expect(component).toContainText('<0>');
  await expect(component).toContainText('<1>');
  await expect(component).toContainText('<2>');
  await expect(component).toContainText('<7>');
  await expect(component).toContainText('<8>');
  await expect(component).toContainText('<9>');

  await expect(component).not.toContainText('<14>');
  await scrollComponentToBottom(component);

  await expect(component).toContainText('<10>');
  await scrollComponentToBottom(component);

  await expect(component).toContainText('<11>');
  await scrollComponentToBottom(component);

  await expect(component).toContainText('<12>');
  await scrollComponentToBottom(component);

  await expect(component).toContainText('<13>');
  await scrollComponentToBottom(component);

  await expect(component).toContainText('<14>');
  await scrollComponentToBottom(component);
});

test('Load more longer items synchronously without initial data', async ({mount}) => {
  const component = await mount(<SimpleDynamicData hasInitialData={false} howToLoad='sync' longerData={true} />);
  await expect(component).toContainText('<0>');
  await expect(component).toContainText('<1>');
  await expect(component).toContainText('<2>');
  await expect(component).toContainText('<7>');
  await expect(component).toContainText('<8>');
  await expect(component).toContainText('<9>');

  await expect(component).not.toContainText('<14>');
  await scrollComponentToBottom(component);

  await expect(component).toContainText('<10>');
  await scrollComponentToBottom(component);

  await expect(component).toContainText('<11>');
  await scrollComponentToBottom(component);

  await expect(component).toContainText('<12>');
  await scrollComponentToBottom(component);

  await expect(component).toContainText('<13>');
  await scrollComponentToBottom(component);

  await expect(component).toContainText('<14>');
  await scrollComponentToBottom(component);
});

test('Load more longer items asynchronously but instantly with initial data', async ({mount}) => {
  const component = await mount(<SimpleDynamicData hasInitialData={true} howToLoad='instantAsync' longerData={true} />);
  await expect(component).toContainText('<0>');
  await expect(component).toContainText('<1>');
  await expect(component).toContainText('<2>');
  await expect(component).toContainText('<7>');
  await expect(component).toContainText('<8>');
  await expect(component).toContainText('<9>');

  await expect(component).not.toContainText('<14>');
  await scrollComponentToBottom(component);

  await expect(component).toContainText('<10>');
  await scrollComponentToBottom(component);

  await expect(component).toContainText('<11>');
  await scrollComponentToBottom(component);

  await expect(component).toContainText('<12>');
  await scrollComponentToBottom(component);

  await expect(component).toContainText('<13>');
  await scrollComponentToBottom(component);

  await expect(component).toContainText('<14>');
  await scrollComponentToBottom(component);
});

test('Load more longer items asynchronously but instantly without initial data', async ({mount}) => {
  const component = await mount(<SimpleDynamicData hasInitialData={false} howToLoad='instantAsync' longerData={true} />);
  await expect(component).toContainText('<0>');
  await expect(component).toContainText('<1>');
  await expect(component).toContainText('<2>');
  await expect(component).toContainText('<7>');
  await expect(component).toContainText('<8>');
  await expect(component).toContainText('<9>');

  await expect(component).not.toContainText('<14>');
  await scrollComponentToBottom(component);

  await expect(component).toContainText('<10>');
  await scrollComponentToBottom(component);

  await expect(component).toContainText('<11>');
  await scrollComponentToBottom(component);

  await expect(component).toContainText('<12>');
  await scrollComponentToBottom(component);

  await expect(component).toContainText('<13>');
  await scrollComponentToBottom(component);

  await expect(component).toContainText('<14>');
  await scrollComponentToBottom(component);
});

test('Load more longer items asynchronously but fast with initial data', async ({mount}) => {
  const component = await mount(<SimpleDynamicData hasInitialData={true} howToLoad='fastAsync' longerData={true} />);
  await expect(component).toContainText('<0>');
  await expect(component).toContainText('<1>');
  await expect(component).toContainText('<2>');
  await expect(component).toContainText('<7>');
  await expect(component).toContainText('<8>');
  await expect(component).toContainText('<9>');

  await expect(component).not.toContainText('<14>');
  await scrollComponentToBottom(component);

  await expect(component).toContainText('<10>');
  await scrollComponentToBottom(component);

  await expect(component).toContainText('<11>');
  await scrollComponentToBottom(component);

  await expect(component).toContainText('<12>');
  await scrollComponentToBottom(component);

  await expect(component).toContainText('<13>');
  await scrollComponentToBottom(component);

  await expect(component).toContainText('<14>');
  await scrollComponentToBottom(component);
});

test('Load more longer items asynchronously but fast without initial data', async ({mount}) => {
  const component = await mount(<SimpleDynamicData hasInitialData={false} howToLoad='fastAsync' longerData={true} />);
  await expect(component).toContainText('<0>');
  await expect(component).toContainText('<1>');
  await expect(component).toContainText('<2>');
  await expect(component).toContainText('<7>');
  await expect(component).toContainText('<8>');
  await expect(component).toContainText('<9>');

  await expect(component).not.toContainText('<14>');
  await scrollComponentToBottom(component);

  await expect(component).toContainText('<10>');
  await scrollComponentToBottom(component);

  await expect(component).toContainText('<11>');
  await scrollComponentToBottom(component);

  await expect(component).toContainText('<12>');
  await scrollComponentToBottom(component);

  await expect(component).toContainText('<13>');
  await scrollComponentToBottom(component);

  await expect(component).toContainText('<14>');
  await scrollComponentToBottom(component);
});

test('Load more longer items asynchronously but slowly with initial data', async ({mount}) => {
  const component = await mount(<SimpleDynamicData hasInitialData={true} howToLoad='slowAsync' longerData={true} />);
  await expect(component).toContainText('<0>');
  await expect(component).toContainText('<1>');
  await expect(component).toContainText('<2>');
  await expect(component).toContainText('<7>');
  await expect(component).toContainText('<8>');
  await expect(component).toContainText('<9>');

  await expect(component).not.toContainText('<14>');
  await scrollComponentToBottom(component);

  await expect(component).toContainText('<10>');
  await scrollComponentToBottom(component);

  await expect(component).toContainText('<11>');
  await scrollComponentToBottom(component);

  await expect(component).toContainText('<12>');
  await scrollComponentToBottom(component);

  await expect(component).toContainText('<13>');
  await scrollComponentToBottom(component);

  await expect(component).toContainText('<14>');
  await scrollComponentToBottom(component);
});

test('Load more longer items asynchronously but slowly without initial data', async ({mount}) => {
  const component = await mount(<SimpleDynamicData hasInitialData={false} howToLoad='slowAsync' longerData={true} />);
  await expect(component).toContainText('<0>');
  await expect(component).toContainText('<1>');
  await expect(component).toContainText('<2>');
  await expect(component).toContainText('<7>');
  await expect(component).toContainText('<8>');
  await expect(component).toContainText('<9>');

  await expect(component).not.toContainText('<14>');
  await scrollComponentToBottom(component);

  await expect(component).toContainText('<10>');
  await scrollComponentToBottom(component);

  await expect(component).toContainText('<11>');
  await scrollComponentToBottom(component);

  await expect(component).toContainText('<12>');
  await scrollComponentToBottom(component);

  await expect(component).toContainText('<13>');
  await scrollComponentToBottom(component);

  await expect(component).toContainText('<14>');
  await scrollComponentToBottom(component);
});

test('Load more items bidirectionally, asynchronously but fast without initial data', async ({mount}) => {
  const component = await mount(<BiDirectDynamicData hasInitialData={false} howToLoad='fastAsync' />);
  await expect(component).toContainText('<0>');
  await expect(component).toContainText('<1>');
  await expect(component).toContainText('<2>');
  await expect(component).not.toContainText('<-2>');

  await scrollComponentToBottom(component);
  await expect(component).toContainText('<10>');
  await expect(getData(component)).resolves.toContain('<10>');

  await scrollComponentToBottom(component);
  await expect(component).toContainText('<11>');
  await expect(getData(component)).resolves.toContain('<11>');

  await scrollComponentToBottom(component);
  await expect(component).toContainText('<12>');
  await expect(getData(component)).resolves.toContain('<12>');

  await scrollComponentToBottom(component);
  await expect(component).toContainText('<13>');
  await expect(getData(component)).resolves.toContain('<13>');

  await scrollComponentToBottom(component);
  await expect(component).toContainText('<14>');
  await expect(getData(component)).resolves.toContain('<14>');

  await scrollComponentToTop(component);
  await expect(component).toContainText('<-1>');
  await expect(getData(component)).resolves.toContain('<-1>');

  await scrollComponentToTop(component);
  await expect(component).toContainText('<-2>');
  await expect(getData(component)).resolves.toContain('<-2>');

  await scrollComponentToTop(component);
  await expect(component).toContainText('<-3>');
  await expect(getData(component)).resolves.toContain('<-3>');

  await scrollComponentToTop(component);
  await expect(component).toContainText('<-4>');
  await expect(getData(component)).resolves.toContain('<-4>');
});

test('Loading data synchronously, but fails for the first period without initial data', async ({mount}) => {
  const component = await mount(<SomeFailDynamicData hasInitialData={false} howToLoad='sync' />);
  await expect(component).toContainText('<0>');
  await expect(component).toContainText('<1>');
  await expect(component).toContainText('<2>');

  for (let value = 10; value <= 20;++value) {
    await scrollComponentToBottom(component);
    await expect(component).toContainText(value.toString());
  }
});

test('Loading data asynchronously, but fails for the first period without initial data', async ({mount}) => {
  const component = await mount(<SomeFailDynamicData hasInitialData={false} howToLoad='async' />);
  await expect(component).toContainText('<0>');
  await expect(component).toContainText('<1>');
  await expect(component).toContainText('<2>');

  for (let value = 10; value <= 20;++value) {
    await scrollComponentToBottom(component);
    await expect(component).toContainText(value.toString());
  }
});

test('Loading data synchronously, but fails for the first period with initial data', async ({mount}) => {
  const component = await mount(<SomeFailDynamicData hasInitialData={true} howToLoad='sync' />);
  await expect(component).toContainText('<0>');
  await expect(component).toContainText('<1>');
  await expect(component).toContainText('<2>');

  for (let value = 10; value <= 20;++value) {
    await scrollComponentToBottom(component);
    await expect(component).toContainText(value.toString());
  }
});

test('Loading data asynchronously, but fails for the first period with initial data', async ({mount}) => {
  const component = await mount(<SomeFailDynamicData hasInitialData={true} howToLoad='async' />);
  await expect(component).toContainText('<0>');
  await expect(component).toContainText('<1>');
  await expect(component).toContainText('<2>');

  for (let value = 10; value <= 20;++value) {
    await scrollComponentToBottom(component);
    await expect(component).toContainText(value.toString());
  }
});
