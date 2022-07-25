// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

// Add any needed widget imports here (or from controls)
// import {} from '@jupyter-widgets/base';

import { createTestModel } from './utils';

import { DIVEWidgetModel } from '..';

describe('DIVEWidget', () => {
  describe('DIVEWidgetModel', () => {
    it('should be createable', () => {
      const model = createTestModel(DIVEWidgetModel);
      expect(model).toBeInstanceOf(DIVEWidgetModel);
    });

    it('should be createable with a value', () => {
      const state = { html: '<h1>hello</h1>' };
      const model = createTestModel(DIVEWidgetModel, state);
      expect(model).toBeInstanceOf(DIVEWidgetModel);
      expect(model.get('html')).toEqual('<h1>hello</h1>');
    });
  });
});
