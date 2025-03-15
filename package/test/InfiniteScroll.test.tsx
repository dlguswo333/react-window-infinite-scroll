import {test, expect, MountResult} from '@playwright/experimental-ct-react17';
import {StaticData1, StaticData2, SimpleDynamicData, BiDirectDynamicData, SomeFailDynamicData, ThresholdZeroBiDirectDynamicData} from './Components';
import React from 'react';

test.use({viewport: {width: 1000, height: 1000}});

const getData = (component: MountResult) => (
  component.evaluate(() => window.data)
);

const layouts = ['vertical', 'horizontal'] as const;
for (const layout of layouts) {
  const scrollComponentToEnd = (component: MountResult) => {
    return component.evaluate((element, layout) => {
      if (layout === 'horizontal') {
        element.scrollLeft = 100000;
        return element.scrollLeft;
      }
      element.scrollTop = 100000;
      return element.scrollTop;
    }, layout);
  };

  const scrollComponentToStart = (component: MountResult) => {
    return component.evaluate((element, layout) => {
      if (layout === 'horizontal') {
        element.scrollLeft = 0;
        return element.scrollLeft;
      }
      element.scrollTop = 0;
      return element.scrollTop;
    }, layout);
  };

  test(`With static data with initial data {layout: ${layout}}`, async ({mount}) => {
    const component = await mount(<StaticData1 layout={layout} />);
    await expect(component).toContainText('<0>');
  });

  test(`With static data without initial data {layout: ${layout}}`, async ({mount}) => {
    const component = await mount(<StaticData2 layout={layout} />);
    await expect(component).toContainText('<0>');
    await expect(component).toContainText('<1>');
    await expect(component).toContainText('<2>');
  });

  test(`Load more items synchronously with initial data {layout: ${layout}}`, async ({mount}) => {
    const component = await mount(<SimpleDynamicData hasInitialData={true} howToLoad='sync' longerData={false} layout={layout} />);
    await expect(component).toContainText('<0>');
    await expect(component).toContainText('<1>');
    await expect(component).toContainText('<2>');
  });

  test(`Load more items synchronously without initial data {layout: ${layout}}`, async ({mount}) => {
    const component = await mount(<SimpleDynamicData hasInitialData={false} howToLoad='sync' longerData={false} layout={layout} />);
    await expect(component).toContainText('<0>');
    await expect(component).toContainText('<1>');
    await expect(component).toContainText('<2>');
  });

  test(`Load more items asynchronously but instantly with initial data {layout: ${layout}}`, async ({mount}) => {
    const component = await mount(<SimpleDynamicData hasInitialData={true} howToLoad='instantAsync' longerData={false} layout={layout} />);
    await expect(component).toContainText('<0>');
    await expect(component).toContainText('<1>');
    await expect(component).toContainText('<2>');
  });

  test(`Load more items asynchronously but instantly without initial data {layout: ${layout}}`, async ({mount}) => {
    const component = await mount(<SimpleDynamicData hasInitialData={false} howToLoad='instantAsync' longerData={false} layout={layout} />);
    await expect(component).toContainText('<0>');
    await expect(component).toContainText('<1>');
    await expect(component).toContainText('<2>');
  });

  test(`Load more items asynchronously but fast with initial data {layout: ${layout}}`, async ({mount}) => {
    const component = await mount(<SimpleDynamicData hasInitialData={true} howToLoad='fastAsync' longerData={false} layout={layout} />);
    await expect(component).toContainText('<0>');
    await expect(component).toContainText('<1>');
    await expect(component).toContainText('<2>');
  });

  test(`Load more items asynchronously but fast without initial data {layout: ${layout}}`, async ({mount}) => {
    const component = await mount(<SimpleDynamicData hasInitialData={false} howToLoad='fastAsync' longerData={false} layout={layout} />);
    await expect(component).toContainText('<0>');
    await expect(component).toContainText('<1>');
    await expect(component).toContainText('<2>');
  });

  test(`Load more items asynchronously but slowly with initial data {layout: ${layout}}`, async ({mount}) => {
    const component = await mount(<SimpleDynamicData hasInitialData={true} howToLoad='slowAsync' longerData={false} layout={layout} />);
    await expect(component).toContainText('<0>');
    await expect(component).toContainText('<1>');
    await expect(component).toContainText('<2>');
  });

  test(`Load more items asynchronously but slowly without initial data {layout: ${layout}}`, async ({mount}) => {
    const component = await mount(<SimpleDynamicData hasInitialData={false} howToLoad='slowAsync' longerData={false} layout={layout} />);
    await expect(component).toContainText('<0>');
    await expect(component).toContainText('<1>');
    await expect(component).toContainText('<2>');
  });

  test(`Load more longer items synchronously with initial data {layout: ${layout}}`, async ({mount}) => {
    const component = await mount(<SimpleDynamicData hasInitialData={true} howToLoad='sync' longerData={true} layout={layout} />);
    await expect(component).toContainText('<0>');
    await expect(component).toContainText('<1>');
    await expect(component).toContainText('<2>');
    await expect(component).toContainText('<7>');
    await expect(component).toContainText('<8>');
    await expect(component).toContainText('<9>');

    await expect(component).not.toContainText('<14>');
    await scrollComponentToEnd(component);

    await expect(component).toContainText('<10>');
    await scrollComponentToEnd(component);

    await expect(component).toContainText('<11>');
    await scrollComponentToEnd(component);

    await expect(component).toContainText('<12>');
    await scrollComponentToEnd(component);

    await expect(component).toContainText('<13>');
    await scrollComponentToEnd(component);

    await expect(component).toContainText('<14>');
    await scrollComponentToEnd(component);
  });

  test(`Load more longer items synchronously without initial data {layout: ${layout}}`, async ({mount}) => {
    const component = await mount(<SimpleDynamicData hasInitialData={false} howToLoad='sync' longerData={true} layout={layout} />);
    await expect(component).toContainText('<0>');
    await expect(component).toContainText('<1>');
    await expect(component).toContainText('<2>');
    await expect(component).toContainText('<7>');
    await expect(component).toContainText('<8>');
    await expect(component).toContainText('<9>');

    await expect(component).not.toContainText('<14>');
    await scrollComponentToEnd(component);

    await expect(component).toContainText('<10>');
    await scrollComponentToEnd(component);

    await expect(component).toContainText('<11>');
    await scrollComponentToEnd(component);

    await expect(component).toContainText('<12>');
    await scrollComponentToEnd(component);

    await expect(component).toContainText('<13>');
    await scrollComponentToEnd(component);

    await expect(component).toContainText('<14>');
    await scrollComponentToEnd(component);
  });

  test(`Load more longer items asynchronously but instantly with initial data {layout: ${layout}}`, async ({mount}) => {
    const component = await mount(<SimpleDynamicData hasInitialData={true} howToLoad='instantAsync' longerData={true} layout={layout} />);
    await expect(component).toContainText('<0>');
    await expect(component).toContainText('<1>');
    await expect(component).toContainText('<2>');
    await expect(component).toContainText('<7>');
    await expect(component).toContainText('<8>');
    await expect(component).toContainText('<9>');

    await expect(component).not.toContainText('<14>');
    await scrollComponentToEnd(component);

    await expect(component).toContainText('<10>');
    await scrollComponentToEnd(component);

    await expect(component).toContainText('<11>');
    await scrollComponentToEnd(component);

    await expect(component).toContainText('<12>');
    await scrollComponentToEnd(component);

    await expect(component).toContainText('<13>');
    await scrollComponentToEnd(component);

    await expect(component).toContainText('<14>');
    await scrollComponentToEnd(component);
  });

  test(`Load more longer items asynchronously but instantly without initial data {layout: ${layout}}`, async ({mount}) => {
    const component = await mount(<SimpleDynamicData hasInitialData={false} howToLoad='instantAsync' longerData={true} layout={layout} />);
    await expect(component).toContainText('<0>');
    await expect(component).toContainText('<1>');
    await expect(component).toContainText('<2>');
    await expect(component).toContainText('<7>');
    await expect(component).toContainText('<8>');
    await expect(component).toContainText('<9>');

    await expect(component).not.toContainText('<14>');
    await scrollComponentToEnd(component);

    await expect(component).toContainText('<10>');
    await scrollComponentToEnd(component);

    await expect(component).toContainText('<11>');
    await scrollComponentToEnd(component);

    await expect(component).toContainText('<12>');
    await scrollComponentToEnd(component);

    await expect(component).toContainText('<13>');
    await scrollComponentToEnd(component);

    await expect(component).toContainText('<14>');
    await scrollComponentToEnd(component);
  });

  test(`Load more longer items asynchronously but fast with initial data {layout: ${layout}}`, async ({mount}) => {
    const component = await mount(<SimpleDynamicData hasInitialData={true} howToLoad='fastAsync' longerData={true} layout={layout} />);
    await expect(component).toContainText('<0>');
    await expect(component).toContainText('<1>');
    await expect(component).toContainText('<2>');
    await expect(component).toContainText('<7>');
    await expect(component).toContainText('<8>');
    await expect(component).toContainText('<9>');

    await expect(component).not.toContainText('<14>');
    await scrollComponentToEnd(component);

    await expect(component).toContainText('<10>');
    await scrollComponentToEnd(component);

    await expect(component).toContainText('<11>');
    await scrollComponentToEnd(component);

    await expect(component).toContainText('<12>');
    await scrollComponentToEnd(component);

    await expect(component).toContainText('<13>');
    await scrollComponentToEnd(component);

    await expect(component).toContainText('<14>');
    await scrollComponentToEnd(component);
  });

  test(`Load more longer items asynchronously but fast without initial data {layout: ${layout}}`, async ({mount}) => {
    const component = await mount(<SimpleDynamicData hasInitialData={false} howToLoad='fastAsync' longerData={true} layout={layout} />);
    await expect(component).toContainText('<0>');
    await expect(component).toContainText('<1>');
    await expect(component).toContainText('<2>');
    await expect(component).toContainText('<7>');
    await expect(component).toContainText('<8>');
    await expect(component).toContainText('<9>');

    await expect(component).not.toContainText('<14>');
    await scrollComponentToEnd(component);

    await expect(component).toContainText('<10>');
    await scrollComponentToEnd(component);

    await expect(component).toContainText('<11>');
    await scrollComponentToEnd(component);

    await expect(component).toContainText('<12>');
    await scrollComponentToEnd(component);

    await expect(component).toContainText('<13>');
    await scrollComponentToEnd(component);

    await expect(component).toContainText('<14>');
    await scrollComponentToEnd(component);
  });

  test(`Load more longer items asynchronously but slowly with initial data {layout: ${layout}}`, async ({mount}) => {
    const component = await mount(<SimpleDynamicData hasInitialData={true} howToLoad='slowAsync' longerData={true} layout={layout} />);
    await expect(component).toContainText('<0>');
    await expect(component).toContainText('<1>');
    await expect(component).toContainText('<2>');
    await expect(component).toContainText('<7>');
    await expect(component).toContainText('<8>');
    await expect(component).toContainText('<9>');

    await expect(component).not.toContainText('<14>');
    await scrollComponentToEnd(component);

    await expect(component).toContainText('<10>');
    await scrollComponentToEnd(component);

    await expect(component).toContainText('<11>');
    await scrollComponentToEnd(component);

    await expect(component).toContainText('<12>');
    await scrollComponentToEnd(component);

    await expect(component).toContainText('<13>');
    await scrollComponentToEnd(component);

    await expect(component).toContainText('<14>');
    await scrollComponentToEnd(component);
  });

  test(`Load more longer items asynchronously but slowly without initial data {layout: ${layout}}`, async ({mount}) => {
    const component = await mount(<SimpleDynamicData hasInitialData={false} howToLoad='slowAsync' longerData={true} layout={layout} />);
    await expect(component).toContainText('<0>');
    await expect(component).toContainText('<1>');
    await expect(component).toContainText('<2>');
    await expect(component).toContainText('<7>');
    await expect(component).toContainText('<8>');
    await expect(component).toContainText('<9>');

    await expect(component).not.toContainText('<14>');
    await scrollComponentToEnd(component);

    await expect(component).toContainText('<10>');
    await scrollComponentToEnd(component);

    await expect(component).toContainText('<11>');
    await scrollComponentToEnd(component);

    await expect(component).toContainText('<12>');
    await scrollComponentToEnd(component);

    await expect(component).toContainText('<13>');
    await scrollComponentToEnd(component);

    await expect(component).toContainText('<14>');
    await scrollComponentToEnd(component);
  });

  test(`Load more items bidirectionally, asynchronously but fast without initial data {layout: ${layout}}`, async ({mount}) => {
    const component = await mount(<BiDirectDynamicData hasInitialData={false} howToLoad='fastAsync' layout={layout} />);
    await expect(component).toContainText('<0>');
    await expect(component).toContainText('<1>');
    await expect(component).toContainText('<2>');
    await expect(component).not.toContainText('<-2>');

    await scrollComponentToEnd(component);
    await expect(component).toContainText('<10>');
    await expect(getData(component)).resolves.toContain('<10>');

    await scrollComponentToEnd(component);
    await expect(component).toContainText('<11>');
    await expect(getData(component)).resolves.toContain('<11>');

    await scrollComponentToEnd(component);
    await expect(component).toContainText('<12>');
    await expect(getData(component)).resolves.toContain('<12>');

    await scrollComponentToEnd(component);
    await expect(component).toContainText('<13>');
    await expect(getData(component)).resolves.toContain('<13>');

    await scrollComponentToEnd(component);
    await expect(component).toContainText('<14>');
    await expect(getData(component)).resolves.toContain('<14>');

    await scrollComponentToStart(component);
    await expect(component).toContainText('<-1>');
    await expect(getData(component)).resolves.toContain('<-1>');

    await scrollComponentToStart(component);
    await expect(component).toContainText('<-2>');
    await expect(getData(component)).resolves.toContain('<-2>');

    await scrollComponentToStart(component);
    await expect(component).toContainText('<-3>');
    await expect(getData(component)).resolves.toContain('<-3>');

    await scrollComponentToStart(component);
    await expect(component).toContainText('<-4>');
    await expect(getData(component)).resolves.toContain('<-4>');
  });

  test(`Loading data synchronously, but fails for the first period without initial data {layout: ${layout}}`, async ({mount}) => {
    const component = await mount(<SomeFailDynamicData hasInitialData={false} howToLoad='sync' layout={layout} />);
    await expect(component).toContainText('<0>');
    await expect(component).toContainText('<1>');
    await expect(component).toContainText('<2>');

    for (let value = 10; value <= 20;++value) {
      await scrollComponentToEnd(component);
      await expect(component).toContainText(value.toString());
    }
  });

  test(`Loading data asynchronously, but fails for the first period without initial data {layout: ${layout}}`, async ({mount}) => {
    const component = await mount(<SomeFailDynamicData hasInitialData={false} howToLoad='async' layout={layout} />);
    await expect(component).toContainText('<0>');
    await expect(component).toContainText('<1>');
    await expect(component).toContainText('<2>');

    for (let value = 10; value <= 20;++value) {
      await scrollComponentToEnd(component);
      await expect(component).toContainText(value.toString());
    }
  });

  test(`Loading data synchronously, but fails for the first period with initial data {layout: ${layout}}`, async ({mount}) => {
    const component = await mount(<SomeFailDynamicData hasInitialData={true} howToLoad='sync' layout={layout} />);
    await expect(component).toContainText('<0>');
    await expect(component).toContainText('<1>');
    await expect(component).toContainText('<2>');

    for (let value = 10; value <= 20;++value) {
      await scrollComponentToEnd(component);
      await expect(component).toContainText(value.toString());
    }
  });

  test(`Loading data asynchronously, but fails for the first period with initial data {layout: ${layout}}`, async ({mount}) => {
    const component = await mount(<SomeFailDynamicData hasInitialData={true} howToLoad='async' layout={layout} />);
    await expect(component).toContainText('<0>');
    await expect(component).toContainText('<1>');
    await expect(component).toContainText('<2>');

    for (let value = 10; value <= 20;++value) {
      await scrollComponentToEnd(component);
      await expect(component).toContainText(value.toString());
    }
  });

  test(`Loading data asynchronously, but zero threshold and positive scrollOffset {layout: ${layout}}`, async ({mount}) => {
    const component = await mount(<ThresholdZeroBiDirectDynamicData layout={layout} />);
    await expect(component).toContainText('<0>');
    await expect(component).toContainText('<1>');
    await expect(component).toContainText('<2>');
    await expect(component).not.toContainText('<-2>');

    await scrollComponentToEnd(component);
    await expect(component).toContainText('<10>');
    await expect(getData(component)).resolves.toContain('<10>');

    await scrollComponentToEnd(component);
    await expect(component).toContainText('<11>');
    await expect(getData(component)).resolves.toContain('<11>');

    await scrollComponentToEnd(component);
    await expect(component).toContainText('<12>');
    await expect(getData(component)).resolves.toContain('<12>');

    await scrollComponentToEnd(component);
    await expect(component).toContainText('<13>');
    await expect(getData(component)).resolves.toContain('<13>');

    await scrollComponentToEnd(component);
    await expect(component).toContainText('<14>');
    await expect(getData(component)).resolves.toContain('<14>');

    await scrollComponentToStart(component);
    await expect(component).toContainText('<-1>');
    await expect(getData(component)).resolves.toContain('<-1>');

    await scrollComponentToStart(component);
    await expect(component).toContainText('<-2>');
    await expect(getData(component)).resolves.toContain('<-2>');

    await scrollComponentToStart(component);
    await expect(component).toContainText('<-3>');
    await expect(getData(component)).resolves.toContain('<-3>');

    await scrollComponentToStart(component);
    await expect(component).toContainText('<-4>');
    await expect(getData(component)).resolves.toContain('<-4>');
  });
}
